import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CLIENT_TIMEOUT_MS,
  TmdbError,
  getGenres,
  getMovie,
  getMovieCredits,
  getMovies,
  getPeople,
  getPerson,
  getPersonCredits,
  getTrending,
  searchMovies,
  searchPeople,
  tmdbImageUrl,
} from './client';
import { fixtureFetch } from '../../test/fixtures/fetch';

const page = {
  page: 1,
  total_pages: 1,
  total_results: 1,
  results: [{ id: 1, title: 'Teste' }],
};
afterEach(() => {
  vi.useRealTimers();
});

describe('cliente TMDB', () => {
  it('constrói apenas URLs relativas para imagens permitidas', () => {
    expect(tmdbImageUrl('/cartaz.jpg')).toBe('/api/tmdb/image/w500/cartaz.jpg');
    for (const path of [
      null,
      '/../../../secret.jpg',
      '/file.svg',
      'https://image.tmdb.org/t/p/w500/cartaz.jpg',
    ])
      expect(tmdbImageUrl(path)).toBeNull();
  });
  it('usa só o proxy, valida schemas e não encaminha opções de servidor', async () => {
    const fetcher = vi.fn(fixtureFetch);
    vi.stubGlobal('fetch', fetcher);
    expect((await getMovies('popular', 2)).page).toBe(2);
    expect((await getMovie(1)).title).toBe('Filme de exemplo');
    expect((await getPerson(2)).name).toBe('Pessoa de exemplo');
    expect((await getTrending()).results).toHaveLength(1);
    expect((await getPeople()).results).toHaveLength(1);
    expect((await getGenres()).genres).toHaveLength(1);
    expect((await getPersonCredits(2)).cast).toHaveLength(1);
    const calls = vi.mocked(fetch).mock.calls;
    for (const [url, options] of calls) {
      expect(url).toMatch(/^\/api\/tmdb\//);
      expect(url as string).not.toMatch(
        /language=|include_adult=|api_key=|token=/,
      );
      expect(options?.headers).toEqual({ Accept: 'application/json' });
      expect(options?.signal).toBeInstanceOf(AbortSignal);
      expect(options?.cache).toBe('no-store');
      expect(options?.redirect).toBe('error');
    }
  });

  it('codifica e normaliza termo, preservando & e + como texto', async () => {
    const fetcher = vi.fn(fixtureFetch);
    vi.stubGlobal('fetch', fetcher);
    await searchMovies('  Sessa\u0303o & + cinema  ', 3);
    await searchPeople('Pessoa', 2);
    const url = new URL(
      fetcher.mock.calls[0]?.[0] as string,
      'http://localhost',
    );
    expect(url.searchParams.get('query')).toBe('Sessão & + cinema');
    expect(url.searchParams.get('page')).toBe('3');
    expect(fetcher.mock.calls[1]?.[0]).toBe(
      '/api/tmdb/search/person?query=Pessoa&page=2&locale=pt-BR',
    );
  });

  it('valida os parâmetros antes de iniciar fetch', () => {
    const fetcher = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetcher);
    expect(() => getMovie('../1')).toThrow(TmdbError);
    expect(() => getMovies('popular', 501)).toThrow(TmdbError);
    expect(() => searchMovies(' ')).toThrow(TmdbError);
    expect(() => searchMovies('a'.repeat(201))).toThrow(TmdbError);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it.each([
    [400, 'invalid-request'],
    [404, 'not-found'],
    [429, 'rate-limited'],
    [502, 'unavailable'],
    [504, 'timeout'],
  ])('tipa HTTP %s e ignora corpo sensível', async (status, kind) => {
    const body = new Response('private upstream stack and credential', {
      status,
    });
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(body));
    await expect(getMovies('popular')).rejects.toMatchObject({ kind, status });
    expect(body.bodyUsed).toBe(false);
    await expect(getMovies('popular')).rejects.not.toThrow(
      /private|stack|credential/,
    );
  });

  it('tipa falha de rede sem expor o erro original', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn<typeof fetch>()
        .mockRejectedValue(new TypeError('private network detail')),
    );
    await expect(getMovies('popular')).rejects.toMatchObject({
      kind: 'network',
      status: undefined,
    });
    await expect(getMovies('popular')).rejects.not.toThrow(/private/);
  });

  it.each([
    Response.json({ ...page, results: [{ id: '1', title: 'Inválido' }] }),
    Response.json(null),
    new Response('{', { headers: { 'Content-Type': 'application/json' } }),
    new Response('<html>erro</html>', {
      headers: { 'Content-Type': 'text/html' },
    }),
  ])(
    'tipa resposta inválida por schema, JSON ou HTML (%#)',
    async (response) => {
      vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(response));
      await expect(getMovies('popular')).rejects.toMatchObject({
        kind: 'invalid-response',
      });
    },
  );

  it.each([
    new Response(null, { status: 204 }),
    Response.json({ ...page, results: [], total_results: 0, total_pages: 0 }),
  ])('distingue vazio de falha de formato (%#)', async (response) => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(response));
    await expect(getMovies('popular')).rejects.toMatchObject({ kind: 'empty' });
  });

  it('créditos/gêneros vazios são dados opcionais válidos', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ cast: [], crew: [] }))
      .mockResolvedValueOnce(Response.json({ genres: [] }));
    vi.stubGlobal('fetch', fetcher);
    expect(await getMovieCredits(1)).toEqual({ cast: [], crew: [] });
    expect(await getGenres()).toEqual({ genres: [] });
  });

  it.each([
    ['12', 12_000],
    [null, undefined],
    ['garbage', undefined],
    ['0', 0],
  ])('interpreta Retry-After %j', async (value, retryAfterMs) => {
    const headers = new Headers();
    if (value !== null) headers.set('Retry-After', value);
    vi.stubGlobal(
      'fetch',
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(new Response(null, { status: 429, headers })),
    );
    await expect(getMovies('popular')).rejects.toMatchObject({
      kind: 'rate-limited',
      retryAfterMs,
    });
  });

  it('interpreta Retry-After como data HTTP usando o relógio atual', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(null, {
          status: 429,
          headers: { 'Retry-After': 'Thu, 01 Jan 2026 00:00:15 GMT' },
        }),
      ),
    );
    await expect(getMovies('popular')).rejects.toMatchObject({
      retryAfterMs: 15_000,
    });
  });

  it('aborto do chamador interrompe fetch sem virar falha de rede', async () => {
    const caller = new AbortController();
    const fetcher = vi
      .fn<typeof fetch>()
      .mockImplementation(() => new Promise<Response>(() => {}));
    vi.stubGlobal('fetch', fetcher);
    const pending = getMovies('popular', 1, { signal: caller.signal });
    const assertion = expect(pending).rejects.toMatchObject({
      name: 'AbortError',
    });
    caller.abort();
    await assertion;
    expect(fetcher.mock.calls[0]?.[1]?.signal?.aborted).toBe(true);
  });

  it('sinal já abortado não inicia fetch', async () => {
    const caller = new AbortController();
    caller.abort();
    const fetcher = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetcher);
    await expect(
      getMovies('popular', 1, { signal: caller.signal }),
    ).rejects.toMatchObject({ name: 'AbortError' });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('timeout do cliente cobre fetch e retorna erro próprio', async () => {
    vi.useFakeTimers();
    const fetcher = vi
      .fn<typeof fetch>()
      .mockImplementation(() => new Promise<Response>(() => {}));
    vi.stubGlobal('fetch', fetcher);
    const pending = getMovies('popular');
    const assertion = expect(pending).rejects.toMatchObject({
      kind: 'timeout',
    });
    await vi.advanceTimersByTimeAsync(CLIENT_TIMEOUT_MS);
    await assertion;
    expect(fetcher.mock.calls[0]?.[1]?.signal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('timeout cobre também o corpo sem término', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(new ReadableStream(), {
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    const pending = getMovies('popular');
    const assertion = expect(pending).rejects.toMatchObject({
      kind: 'timeout',
    });
    await vi.advanceTimersByTimeAsync(CLIENT_TIMEOUT_MS);
    await assertion;
  });
});
