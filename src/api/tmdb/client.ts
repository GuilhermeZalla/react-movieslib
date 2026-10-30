import { z } from '../../../shared/zod.ts';
import { getLocale } from '../../i18n/locale';
import { isLocale, type Locale } from '../../../shared/locale';
import {
  discoverRequestSchema,
  type DiscoverInput,
  idParameterSchema,
  movieCategorySchema,
  movieListRequestSchema,
  pageParameterSchema,
  searchRequestSchema,
} from '../../../shared/tmdbRequest';
import {
  movieVideosSchema,
  movieImagesSchema,
  genreListSchema,
  movieCreditsSchema,
  movieDetailsSchema,
  moviePageSchema,
  personDetailsSchema,
  personMovieCreditsSchema,
  personPageSchema,
} from './schemas';

export type TmdbErrorKind =
  | 'network'
  | 'invalid-response'
  | 'empty'
  | 'not-found'
  | 'rate-limited'
  | 'invalid-request'
  | 'timeout'
  | 'unavailable';
const messages: Record<TmdbErrorKind, string> = {
  network: 'Não foi possível conectar. Confira sua conexão.',
  'invalid-response': 'Não foi possível carregar os dados recebidos.',
  empty: 'Nenhum resultado por aqui.',
  'not-found': 'Este conteúdo não foi encontrado.',
  'rate-limited': 'Muitas solicitações. Tente novamente em instantes.',
  'invalid-request': 'Confira os dados da busca ou do endereço.',
  timeout: 'O serviço demorou para responder. Tente novamente.',
  unavailable: 'Serviço temporariamente indisponível.',
};

export class TmdbError extends Error {
  constructor(
    readonly kind: TmdbErrorKind,
    readonly status?: number,
    readonly retryAfterMs?: number,
  ) {
    super(messages[kind]);
    this.name = 'TmdbError';
  }
}

export const CLIENT_TIMEOUT_MS = 10_000;
export type MovieCategory = z.infer<typeof movieCategorySchema>;
export interface RequestOptions {
  signal?: AbortSignal;
  locale?: Locale;
}

/** Browser images use the same-origin, fixed-path proxy and never a CDN URL. */
export function tmdbImageUrl(path: string | null | undefined): string | null {
  if (!path || !/^\/[A-Za-z0-9_-]{1,160}\.(?:jpg|jpeg|png|webp)$/i.test(path))
    return null;
  return `/api/tmdb/image/w500${path}`;
}

export function validateRequest<T extends z.ZodType>(
  schema: T,
  value: unknown,
): z.output<T> {
  const parsed = schema.safeParse(value);
  if (!parsed.success) throw new TmdbError('invalid-request', 400);
  return parsed.data;
}

function retryAfter(value: string | null): number | undefined {
  if (value === null) return undefined;
  if (/^\d+$/.test(value)) {
    const seconds = Number(value);
    return Number.isSafeInteger(seconds * 1000) ? seconds * 1000 : undefined;
  }
  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(0, date - Date.now()) : undefined;
}

function httpError(response: Response): TmdbError {
  const status = response.status;
  if (status === 400) return new TmdbError('invalid-request', status);
  if (status === 404) return new TmdbError('not-found', status);
  if (status === 429)
    return new TmdbError(
      'rate-limited',
      status,
      retryAfter(response.headers.get('retry-after')),
    );
  if (status === 504) return new TmdbError('timeout', status);
  return new TmdbError('unavailable', status);
}

// Not exported: callers can only select the enumerated operations below.
async function request<T>(
  path: string,
  params: Record<string, string>,
  schema: z.ZodType<T>,
  { signal, locale = getLocale() }: RequestOptions = {},
): Promise<T> {
  if (!isLocale(locale)) throw new TmdbError('invalid-request', 400);
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted)
    throw new DOMException('Solicitação cancelada.', 'AbortError');
  signal?.addEventListener('abort', abort, { once: true });
  // A deadline covers both headers and body, even if an underlying implementation stalls.
  let rejectAbort: (() => void) | undefined;
  const interrupted = new Promise<never>((_, reject) => {
    rejectAbort = () =>
      reject(new DOMException('Solicitação cancelada.', 'AbortError'));
    controller.signal.addEventListener('abort', rejectAbort, { once: true });
  });
  const timer = setTimeout(() => {
    controller.abort();
  }, CLIENT_TIMEOUT_MS);
  const query = new URLSearchParams({ ...params, locale }).toString();
  try {
    const operation = async () => {
      const response = await fetch(
        '/api/tmdb/' + path + (query ? '?' + query : ''),
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
          cache: 'no-store',
          redirect: 'error',
        },
      );
      if (!response.ok) throw httpError(response);
      const text = await response.text();
      if (!text.trim()) throw new TmdbError('empty', response.status);
      if (
        !response.headers
          .get('content-type')
          ?.toLowerCase()
          .includes('application/json')
      )
        throw new TmdbError('invalid-response', response.status);
      let json: unknown;
      try {
        json = JSON.parse(text);
      } catch {
        throw new TmdbError('invalid-response', response.status);
      }
      const parsed = schema.safeParse(json);
      if (!parsed.success)
        throw new TmdbError('invalid-response', response.status);
      // Paginated searches/lists have an explicit empty state. Empty credits/genres
      // are valid optional data and must not make an otherwise valid detail fail.
      if (
        typeof parsed.data === 'object' &&
        parsed.data !== null &&
        'results' in parsed.data &&
        Array.isArray(parsed.data.results) &&
        parsed.data.results.length === 0
      )
        throw new TmdbError('empty', response.status);
      return parsed.data;
    };
    return await Promise.race([operation(), interrupted]);
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      if (signal?.aborted)
        throw new DOMException('Solicitação cancelada.', 'AbortError');
      throw new TmdbError('timeout');
    }
    if (error instanceof TmdbError) throw error;
    throw new TmdbError('network');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
    if (rejectAbort)
      controller.signal.removeEventListener('abort', rejectAbort);
    controller.abort();
  }
}

function pageValue(page: number | string) {
  return String(validateRequest(pageParameterSchema, String(page)));
}
function idValue(id: number | string) {
  return validateRequest(idParameterSchema, String(id));
}

export function getMovies(
  category: MovieCategory,
  page: number | string = 1,
  options?: RequestOptions,
) {
  const input = validateRequest(movieListRequestSchema, {
    category,
    page: String(page),
  });
  return request(
    'movie/' + input.category,
    { page: String(input.page) },
    moviePageSchema,
    options,
  );
}
export function getTrending(
  page: number | string = 1,
  options?: RequestOptions,
) {
  return request(
    'trending/movie/day',
    { page: pageValue(page) },
    moviePageSchema,
    options,
  );
}
export function getPeople(page: number | string = 1, options?: RequestOptions) {
  return request(
    'person/popular',
    { page: pageValue(page) },
    personPageSchema,
    options,
  );
}
export function searchMovies(
  query: string,
  page: number | string = 1,
  options?: RequestOptions,
) {
  const input = validateRequest(searchRequestSchema, {
    query,
    page: String(page),
  });
  return request(
    'search/movie',
    { query: input.query, page: String(input.page) },
    moviePageSchema,
    options,
  );
}
export function searchPeople(
  query: string,
  page: number | string = 1,
  options?: RequestOptions,
) {
  const input = validateRequest(searchRequestSchema, {
    query,
    page: String(page),
  });
  return request(
    'search/person',
    { query: input.query, page: String(input.page) },
    personPageSchema,
    options,
  );
}
export function getGenres(options?: RequestOptions) {
  return request('genre/movie/list', {}, genreListSchema, options);
}
export function getMovie(id: number | string, options?: RequestOptions) {
  return request(
    `movie/${idValue(id)}`,
    { append_to_response: 'credits' },
    movieDetailsSchema,
    options,
  );
}
export function getMovieCredits(id: number | string, options?: RequestOptions) {
  return request(
    `movie/${idValue(id)}/credits`,
    {},
    movieCreditsSchema,
    options,
  );
}
export function getPerson(id: number | string, options?: RequestOptions) {
  return request(`person/${idValue(id)}`, {}, personDetailsSchema, options);
}
export function getPersonCredits(
  id: number | string,
  options?: RequestOptions,
) {
  return request(
    `person/${idValue(id)}/movie_credits`,
    {},
    personMovieCreditsSchema,
    options,
  );
}

export function discoverMovies(input: DiscoverInput, options?: RequestOptions) {
  const parsed = validateRequest(discoverRequestSchema, input);
  const params = Object.fromEntries(
    Object.entries(parsed).map(([key, value]) => [key, String(value)]),
  );
  return request('discover/movie', params, moviePageSchema, options);
}
export function getMovieVideos(id: number | string, options?: RequestOptions) {
  return request(`movie/${idValue(id)}/videos`, {}, movieVideosSchema, options);
}
export function getMovieImages(id: number | string, options?: RequestOptions) {
  return request(`movie/${idValue(id)}/images`, {}, movieImagesSchema, options);
}
export function getRecommendations(
  id: number | string,
  options?: RequestOptions,
) {
  return request(
    `movie/${idValue(id)}/recommendations`,
    { page: '1' },
    moviePageSchema,
    options,
  );
}
