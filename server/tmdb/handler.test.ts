import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTmdbHandler } from './handler.ts';
import { createRateLimiter } from './rateLimit.ts';

const page = {
  page: 1,
  total_pages: 1,
  total_results: 1,
  results: [{ id: 1, title: 'Filme fictício' }],
};
const goodResponse = () => Response.json(page);
function scenario() {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockImplementation(() => Promise.resolve(goodResponse()));
  const handler = createTmdbHandler({
    fetcher,
    getToken: () => 'fixture-only',
    allowRequest: createRateLimiter(),
  });
  return { fetcher, handler };
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe('proxy TMDB protegido', () => {
  it.each([
    ['/api/tmdb/movie/popular', page],
    ['/api/tmdb/movie/top_rated', page],
    ['/api/tmdb/movie/now_playing', page],
    ['/api/tmdb/movie/upcoming', page],
    ['/api/tmdb/trending/movie/day', page],
    [
      '/api/tmdb/person/popular',
      { ...page, results: [{ id: 2, name: 'Pessoa fictícia' }] },
    ],
    ['/api/tmdb/search/movie?query=Filme', page],
    [
      '/api/tmdb/search/person?query=Pessoa',
      { ...page, results: [{ id: 2, name: 'Pessoa fictícia' }] },
    ],
    ['/api/tmdb/genre/movie/list', { genres: [] }],
    [
      '/api/tmdb/movie/1?append_to_response=credits',
      { id: 1, title: 'Filme', genres: [], credits: { cast: [], crew: [] } },
    ],
    ['/api/tmdb/movie/1/credits', { cast: [], crew: [] }],
    ['/api/tmdb/person/2', { id: 2, name: 'Pessoa' }],
    ['/api/tmdb/person/2/movie_credits', { cast: [], crew: [] }],
  ] as const)(
    'aceita endpoint enumerado com resposta válida: %s',
    async (target, body) => {
      const { handler, fetcher } = scenario();
      fetcher.mockResolvedValueOnce(Response.json(body));
      expect((await handler(target)).status).toBe(200);
      expect(fetcher).toHaveBeenCalledTimes(1);
    },
  );

  it.each(['POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])(
    'somente GET: %s retorna 405 sem fetch',
    async (method) => {
      const { handler, fetcher } = scenario();
      const result = await handler('/api/tmdb/movie/popular', method);
      expect(result.status).toBe(405);
      expect(result.headers.get('allow')).toBe('GET');
      expect(result.headers.get('cache-control')).toBe('no-store');
      expect(fetcher).not.toHaveBeenCalled();
    },
  );

  it.each([
    '/api/tmdb/configuration',
    '/api/tmdb/account',
    '/api/tmdb/person/1/credits',
    '/api/other',
    '/api/tmdb',
  ])('rejeita endpoint fora da lista: %s', async (target) => {
    const { handler, fetcher } = scenario();
    expect((await handler(target)).status).toBe(404);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it.each([
    '/api/tmdb/movie/popular?page=0',
    '/api/tmdb/movie/popular?page=501',
    '/api/tmdb/movie/popular?page=1&page=2',
    '/api/tmdb/movie/0',
    '/api/tmdb/search/movie?query=%20%20',
    '/api/tmdb/search/movie?query=' + 'a'.repeat(201),
    '/api/tmdb/movie/1?append_to_response=credits,account_states',
    '/api/tmdb/movie/popular?url=https://other.example',
    '/api/tmdb/movie/popular?host=other.example',
    '/api/tmdb/movie/popular?api_key=fixture',
    '/api/tmdb/movie/popular?__proto__=bad',
    '/api/tmdb/genre/movie/list?page=1',
    '/api/tmdb/movie/popular?path=person/popular',
    '/api/tmdb?path=movie/popular&path=person/popular',
  ])('rejeita parâmetros inválidos (%#)', async (target) => {
    const { handler, fetcher } = scenario();
    expect((await handler(target)).status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it.each([
    '/api/tmdb/../movie/popular',
    '/api/tmdb//movie/popular',
    '/api/tmdb/movie/popular/',
    '/api/tmdb/movie\\popular',
    '/api/tmdb/%2e%2e/movie/popular',
    '/api/tmdb/%252e%252e/movie/popular',
    '/api/tmdb/movie%2fpopular',
    '/api/tmdb?path=..%2Fmovie%2Fpopular',
    '/api/tmdb?path=%252e%252e%252fmovie',
    '/api/tmdb?path=https%3A%2F%2Fother.example',
    '/api/tmdb?path=movie%252fpopular',
  ])(
    'bloqueia traversal, barras ambíguas e codificação dupla (%#)',
    async (target) => {
      const { handler, fetcher } = scenario();
      expect((await handler(target)).status).toBe(400);
      expect(fetcher).not.toHaveBeenCalled();
    },
  );

  it('impõe idioma/adulto, autentica só por header e não segue redirects', async () => {
    const { handler, fetcher } = scenario();
    const result = await handler(
      '/api/tmdb/search/movie?query=Filme+%26+teste&include_adult=true&include_adult=true&language=pt-BR&language=fr-FR&page=2',
    );
    expect(result.status).toBe(200);
    const [url, options] = fetcher.mock.calls[0] ?? [];
    expect(url).toBeInstanceOf(URL);
    const parsed = new URL(url instanceof URL ? url.href : '');
    expect(parsed.origin).toBe('https://api.themoviedb.org');
    expect(parsed.pathname).toBe('/3/search/movie');
    expect(Object.fromEntries(parsed.searchParams)).toEqual({
      query: 'Filme & teste',
      page: '2',
      language: 'pt-BR',
      include_adult: 'false',
    });
    expect(parsed.toString()).not.toContain('fixture-only');
    expect(options?.headers).toEqual({
      Authorization: 'Bearer fixture-only',
      Accept: 'application/json',
    });
    expect(options?.redirect).toBe('error');
    expect(options?.signal).toBeInstanceOf(AbortSignal);
  });

  it('atende o transporte interno do rewrite somente com caminho permitido', async () => {
    const { handler, fetcher } = scenario();
    expect(
      (await handler('/api/tmdb?path=movie%2Fpopular&page=1')).status,
    ).toBe(200);
    const upstream = fetcher.mock.calls[0]?.[0];
    expect(upstream instanceof URL ? upstream.href : '').toContain(
      '/3/movie/popular?',
    );
  });

  it('separa cache de borda de 60s e navegador no-store, sem CORS aberto', async () => {
    const { handler } = scenario();
    const response = await handler('/api/tmdb/movie/popular');
    expect(response.headers.get('vercel-cdn-cache-control')).toBe(
      'public, s-maxage=60, stale-while-revalidate=15',
    );
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(response.headers.get('content-type')).toBe(
      'application/json; charset=utf-8',
    );
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.has('access-control-allow-origin')).toBe(false);
  });

  it.each([400, 401, 403, 404, 429, 500, 302])(
    'sanitiza erro upstream %s sem ler corpo/cabeçalhos sensíveis',
    async (status) => {
      const { handler, fetcher } = scenario();
      const upstream = new Response('sensitive-upstream-body-fixture-only', {
        status,
        headers: { Authorization: 'Bearer fixture-only' },
      });
      const read = vi.spyOn(upstream, 'text');
      fetcher.mockResolvedValueOnce(upstream);
      const response = await handler('/api/tmdb/movie/popular');
      expect(response.status).toBe(
        [400, 404, 429].includes(status) ? status : 502,
      );
      expect(await response.text()).not.toMatch(
        /sensitive|fixture-only|stack|Authorization/,
      );
      expect(read).not.toHaveBeenCalled();
      expect(upstream.bodyUsed).toBe(false);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(response.headers.has('vercel-cdn-cache-control')).toBe(false);
      expect(response.headers.has('authorization')).toBe(false);
    },
  );

  it('timeout aborta o fetch e retorna 504 sem expor detalhes', async () => {
    vi.useFakeTimers();
    const fetcher = vi
      .fn<typeof fetch>()
      .mockImplementation(() => new Promise<Response>(() => {}));
    const handler = createTmdbHandler({
      fetcher,
      getToken: () => 'fixture-only',
      timeoutMs: 50,
    });
    const pending = handler('/api/tmdb/movie/popular');
    await vi.advanceTimersByTimeAsync(50);
    const response = await pending;
    expect(response.status).toBe(504);
    expect(fetcher.mock.calls[0]?.[1]?.signal?.aborted).toBe(true);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({
      error: {
        code: 'UPSTREAM_TIMEOUT',
        message: 'O serviço demorou para responder.',
      },
    });
  });

  it('mantém o timeout durante a leitura de um corpo que não termina', async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(new ReadableStream(), {
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const pending = createTmdbHandler({
      fetcher,
      getToken: () => 'fixture-only',
      timeoutMs: 50,
    })('/api/tmdb/movie/popular');
    await vi.advanceTimersByTimeAsync(50);
    expect((await pending).status).toBe(504);
  });

  it('sem token retorna erro genérico sem nome da variável ou fetch', async () => {
    vi.stubEnv('TMDB_READ_ACCESS_TOKEN', '');
    const fetcher = vi.fn<typeof fetch>();
    const response = await createTmdbHandler({ fetcher })(
      '/api/tmdb/movie/popular',
    );
    expect(response.status).toBe(502);
    expect(await response.text()).not.toMatch(/TMDB|TOKEN|env/);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('falha de rede não vaza mensagem nem cria logs', async () => {
    const { handler, fetcher } = scenario();
    const logs = [
      vi.spyOn(console, 'log'),
      vi.spyOn(console, 'warn'),
      vi.spyOn(console, 'error'),
    ];
    fetcher.mockRejectedValueOnce(
      new Error('sensitive Authorization fixture-only'),
    );
    const response = await handler('/api/tmdb/movie/popular');
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain('sensitive');
    logs.forEach((spy) => expect(spy).not.toHaveBeenCalled());
  });

  it('limite por instância retorna 429/Retry-After sem nova consulta', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockImplementation(() => Promise.resolve(goodResponse()));
    const handler = createTmdbHandler({
      fetcher,
      getToken: () => 'fixture-only',
      allowRequest: createRateLimiter(1),
    });
    expect((await handler('/api/tmdb/movie/popular')).status).toBe(200);
    const result = await handler('/api/tmdb/movie/popular');
    expect(result.status).toBe(429);
    expect(Number(result.headers.get('retry-after'))).toBeGreaterThan(0);
    expect(result.headers.get('cache-control')).toBe('no-store');
    expect(result.headers.has('vercel-cdn-cache-control')).toBe(false);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('remove entradas adultas e bloqueia detalhe adulto', async () => {
    const { handler, fetcher } = scenario();
    fetcher.mockResolvedValueOnce(
      Response.json({
        ...page,
        results: [...page.results, { id: 2, title: 'Excluído', adult: true }],
      }),
    );
    expect(
      await (await handler('/api/tmdb/movie/popular')).json(),
    ).toMatchObject({ results: [{ id: 1 }] });
    fetcher.mockResolvedValueOnce(
      Response.json({ id: 2, title: 'Excluído', adult: true }),
    );
    expect((await handler('/api/tmdb/movie/2')).status).toBe(404);
  });

  it.each([
    new Response('not JSON', { headers: { 'Content-Type': 'text/html' } }),
    new Response('{', { headers: { 'Content-Type': 'application/json' } }),
    Response.json({ results: null }),
    new Response('x'.repeat(2_000_001), {
      headers: { 'Content-Type': 'application/json' },
    }),
  ])(
    'rejeita conteúdo inválido ou excessivo como 502 (%#)',
    async (upstream) => {
      const { handler, fetcher } = scenario();
      fetcher.mockResolvedValueOnce(upstream);
      const response = await handler('/api/tmdb/movie/popular');
      expect(response.status).toBe(502);
      expect(response.headers.get('cache-control')).toBe('no-store');
    },
  );
});
