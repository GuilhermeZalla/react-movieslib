import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTmdbHandler } from './handler.ts';
import { createRateLimiter } from './rateLimit.ts';

const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
const image = () =>
  new Response(jpeg, { headers: { 'Content-Type': 'image/jpeg' } });

function scenario(limit = 60, timeoutMs = 8_000) {
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(image());
  const handler = createTmdbHandler({
    fetcher,
    getToken: () => 'fixture-only',
    allowRequest: createRateLimiter(limit),
    allowImageRequest: createRateLimiter(limit),
    timeoutMs,
  });
  return { fetcher, handler };
}

afterEach(() => vi.useRealTimers());

describe('imagens TMDB via proxy', () => {
  it.each([
    '/api/tmdb/image/w500/cartaz.jpg',
    '/api/tmdb?path=image/w500/cartaz.jpg',
  ])(
    'serve bytes da origem fixa, sem enviar token ao CDN: %s',
    async (target) => {
      const { fetcher, handler } = scenario();
      const response = await handler(target);
      expect(response.status).toBe(200);
      expect(new Uint8Array(await response.arrayBuffer())).toEqual(jpeg);
      expect(response.headers.get('content-type')).toBe('image/jpeg');
      expect(response.headers.get('x-content-type-options')).toBe('nosniff');
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(response.headers.get('vercel-cdn-cache-control')).toContain(
        's-maxage=60',
      );
      const [url, options] = fetcher.mock.calls[0] ?? [];
      expect(url).toBeInstanceOf(URL);
      if (!(url instanceof URL)) throw new Error('Origem da imagem inválida.');
      expect(url.href).toBe('https://image.tmdb.org/t/p/w500/cartaz.jpg');
      expect(options?.headers).toEqual({
        Accept: 'image/webp,image/png,image/jpeg',
      });
      expect(JSON.stringify(options)).not.toContain('fixture-only');
    },
  );

  it.each([
    '/api/tmdb/image/original/cartaz.jpg',
    '/api/tmdb/image/w500/../cartaz.jpg',
    '/api/tmdb/image/w500//cartaz.jpg',
    '/api/tmdb/image/w500/cartaz.svg',
    '/api/tmdb/image/w500/cartaz.jpg/extra',
    '/api/tmdb/image/w500/%2e%2e%2fcartaz.jpg',
    '/api/tmdb/image/w500/%252e%252e.jpg',
    '/api/tmdb/image/w500/cartaz.jpg?url=https://example.test',
    '/api/tmdb?path=image/w500/cartaz.jpg&path=image/w500/outro.jpg',
    '/api/tmdb/image/w500/cartaz.jpg?path=image/w500/outro.jpg',
  ])(
    'rejeita tamanho, formato ou caminho não permitido: %s',
    async (target) => {
      const { fetcher, handler } = scenario();
      const response = await handler(target);
      expect([400, 404]).toContain(response.status);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(fetcher).not.toHaveBeenCalled();
    },
  );

  it('exige GET, quota e configuração sem revelar detalhes', async () => {
    const { handler, fetcher } = scenario(1);
    expect(
      (await handler('/api/tmdb/image/w500/cartaz.jpg', 'POST')).status,
    ).toBe(405);
    expect((await handler('/api/tmdb/image/w500/cartaz.jpg')).status).toBe(200);
    const limited = await handler('/api/tmdb/image/w500/cartaz.jpg');
    expect(limited.status).toBe(429);
    expect(limited.headers.get('retry-after')).toBeTruthy();
    expect(fetcher).toHaveBeenCalledTimes(1);
    const withoutToken = createTmdbHandler({
      fetcher,
      getToken: () => undefined,
    });
    const missing = await withoutToken('/api/tmdb/image/w500/cartaz.jpg');
    expect(missing.status).toBe(502);
    expect(await missing.text()).not.toContain('TMDB_READ_ACCESS_TOKEN');
  });

  it('não repassa erro sensível, SVG ou corpo acima de 5 MB', async () => {
    const { handler, fetcher } = scenario();
    const sensitive = new Response('private upstream body', { status: 404 });
    fetcher.mockResolvedValueOnce(sensitive);
    const unavailable = await handler('/api/tmdb/image/w500/cartaz.jpg');
    expect(unavailable.status).toBe(404);
    expect(unavailable.headers.get('vercel-cdn-cache-control')).toBeNull();
    expect(await unavailable.text()).not.toContain('private');
    expect(sensitive.bodyUsed).toBe(false);
    fetcher.mockResolvedValueOnce(
      new Response('<svg/>', { headers: { 'Content-Type': 'image/svg+xml' } }),
    );
    expect((await handler('/api/tmdb/image/w500/cartaz.jpg')).status).toBe(502);
    fetcher.mockResolvedValueOnce(
      new Response(new Uint8Array([0, 0, 0, 0]), {
        headers: { 'Content-Type': 'image/avif' },
      }),
    );
    expect((await handler('/api/tmdb/image/w500/cartaz.jpg')).status).toBe(502);
    fetcher.mockResolvedValueOnce(
      new Response(new Uint8Array(5_000_001), {
        headers: { 'Content-Type': 'image/jpeg' },
      }),
    );
    expect((await handler('/api/tmdb/image/w500/cartaz.jpg')).status).toBe(502);
  });

  it('interrompe imagem lenta com 504 e sem cache', async () => {
    vi.useFakeTimers();
    const { handler, fetcher } = scenario(60, 500);
    fetcher.mockImplementation(() => new Promise<Response>(() => {}));
    const pending = handler('/api/tmdb/image/w500/cartaz.jpg');
    await vi.advanceTimersByTimeAsync(500);
    const response = await pending;
    expect(response.status).toBe(504);
    expect(response.headers.get('cache-control')).toBe('no-store');
  });
});
