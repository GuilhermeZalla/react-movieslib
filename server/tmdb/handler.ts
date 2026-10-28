import { PolicyError, removeAdultEntries, resolveRequest } from './policy.ts';
import { createRateLimiter } from './rateLimit.ts';

type ErrorStatus = 400 | 404 | 405 | 429 | 502 | 504;
const errors: Record<ErrorStatus, { code: string; message: string }> = {
  400: { code: 'INVALID_REQUEST', message: 'Solicitação inválida.' },
  404: { code: 'NOT_FOUND', message: 'Recurso não encontrado.' },
  405: { code: 'METHOD_NOT_ALLOWED', message: 'Método não permitido.' },
  429: {
    code: 'RATE_LIMITED',
    message: 'Muitas solicitações. Tente novamente em instantes.',
  },
  502: {
    code: 'UPSTREAM_UNAVAILABLE',
    message: 'Serviço temporariamente indisponível.',
  },
  504: {
    code: 'UPSTREAM_TIMEOUT',
    message: 'O serviço demorou para responder.',
  },
};

function json(
  value: unknown,
  status: number,
  headers: Record<string, string> = {},
) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

function failure(status: ErrorStatus, headers: Record<string, string> = {}) {
  return json({ error: errors[status] }, status, headers);
}

interface Options {
  fetcher?: typeof fetch;
  getToken?: () => string | undefined;
  allowRequest?: ReturnType<typeof createRateLimiter>;
  timeoutMs?: number;
}

export function createTmdbHandler({
  fetcher = (...args) => fetch(...args),
  getToken = () => process.env.TMDB_READ_ACCESS_TOKEN,
  allowRequest = createRateLimiter(),
  timeoutMs = 8_000,
}: Options = {}) {
  return async (target: string, method = 'GET'): Promise<Response> => {
    if (method !== 'GET') return failure(405, { Allow: 'GET' });
    try {
      const { url, schema } = resolveRequest(target);
      const token = getToken()?.trim();
      if (!token || /[\r\n]/.test(token)) return failure(502);
      const admission = allowRequest();
      if (!admission.allowed)
        return failure(429, { 'Retry-After': String(admission.retryAfter) });

      const controller = new AbortController();
      let timer: ReturnType<typeof setTimeout> | undefined;
      const timedOut = new Error('Upstream timeout');
      try {
        const timeout = new Promise<never>((_, reject) => {
          timer = setTimeout(() => {
            controller.abort();
            reject(timedOut);
          }, timeoutMs);
        });
        const request = async () => {
          const response = await fetcher(url, {
            method: 'GET',
            redirect: 'error',
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
          if (response.status !== 200) {
            // Never read/forward upstream errors, headers, stack traces or messages.
            const status = response.status;
            return failure(
              status === 400 || status === 404 || status === 429 ? status : 502,
              status === 429 ? { 'Retry-After': '60' } : {},
            );
          }
          if (
            !response.headers
              .get('content-type')
              ?.toLowerCase()
              .includes('application/json')
          )
            return failure(502);
          // Cap the untrusted body before JSON parsing (also covers streamed responses).
          const reader = response.body?.getReader();
          if (!reader) return failure(502);
          const chunks: Uint8Array[] = [];
          let length = 0;
          try {
            for (
              let chunk = await reader.read();
              !chunk.done;
              chunk = await reader.read()
            ) {
              length += chunk.value.byteLength;
              if (length > 2_000_000) {
                await reader.cancel();
                return failure(502);
              }
              chunks.push(chunk.value);
            }
          } finally {
            reader.releaseLock();
          }
          const body: unknown = JSON.parse(
            Buffer.concat(chunks).toString('utf8'),
          );
          const parsed = schema.safeParse(removeAdultEntries(body));
          if (!parsed.success) return failure(502);
          return json(parsed.data, 200, {
            'Vercel-CDN-Cache-Control':
              'public, s-maxage=60, stale-while-revalidate=15',
          });
        };
        return await Promise.race([request(), timeout]);
      } catch (error: unknown) {
        if (controller.signal.aborted || error === timedOut)
          return failure(504);
        if (error instanceof PolicyError) return failure(error.status);
        return failure(502);
      } finally {
        clearTimeout(timer);
        controller.abort();
      }
    } catch (error: unknown) {
      return failure(error instanceof PolicyError ? error.status : 502);
    }
  };
}
