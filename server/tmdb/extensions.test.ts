import { describe, expect, it, vi } from 'vitest';
import { createTmdbHandler } from './handler.ts';
const page = {
  page: 1,
  total_pages: 1,
  total_results: 1,
  results: [{ id: 1, title: 'Filme fictício' }],
};
function calledUrl(fetcher: ReturnType<typeof vi.fn<typeof fetch>>) {
  const input = fetcher.mock.calls[0]?.[0];
  if (input instanceof Request) return new URL(input.url);
  if (input === undefined) throw new Error('Expected an upstream call');
  return new URL(input);
}
describe('lista de permissão dos detalhes e descoberta', () => {
  it.each([
    [
      '/api/tmdb/discover/movie?with_genres=18&primary_release_year=2026&vote_average.gte=7&sort_by=vote_average.desc',
      page,
    ],
    ['/api/tmdb/movie/1/videos', { id: 1, results: [] }],
    ['/api/tmdb/movie/1/images', { id: 1, backdrops: [], posters: [] }],
    ['/api/tmdb/movie/1/recommendations?page=2', page],
  ] as const)('aceita somente contrato enumerado: %s', async (target, body) => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json(body));
    const result = await createTmdbHandler({
      fetcher,
      getToken: () => 'fixture-only',
    })(target);
    expect(result.status).toBe(200);
    expect(result.headers.get('vercel-cdn-cache-control')).toContain(
      's-maxage=60',
    );
    expect(result.headers.get('cache-control')).toBe('no-store');
    const called = calledUrl(fetcher);
    expect(called.origin).toBe('https://api.themoviedb.org');
    expect(called.searchParams.get('language')).toBe('en-US');
    expect(called.searchParams.get('include_adult')).toBe('false');
  });
  it.each([
    '/api/tmdb/discover/movie?with_genres=../18',
    '/api/tmdb/discover/movie?primary_release_year=1700',
    '/api/tmdb/discover/movie?vote_average.gte=11',
    '/api/tmdb/discover/movie?sort_by=arbitrary',
    '/api/tmdb/discover/movie?with_genres=18&with_genres=19',
    '/api/tmdb/discover/movie?url=https://evil.test',
    '/api/tmdb/movie/1/videos?query=attack',
    '/api/tmdb/movie/1/images?host=evil.test',
    '/api/tmdb/movie/1/%252e%252e/videos',
    '/api/tmdb/person/1/videos',
    '/api/tmdb/movie/1//images',
  ])('bloqueia parâmetros/caminhos indevidos sem rede: %s', async (target) => {
    const fetcher = vi.fn<typeof fetch>();
    const result = await createTmdbHandler({
      fetcher,
      getToken: () => 'fixture-only',
    })(target);
    expect([400, 404]).toContain(result.status);
    expect(fetcher).not.toHaveBeenCalled();
    expect(result.headers.get('cache-control')).toBe('no-store');
  });
  it('continua impondo idioma e classificação no discover', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json(page));
    const result = await createTmdbHandler({
      fetcher,
      getToken: () => 'fixture-only',
    })('/api/tmdb/discover/movie?language=pt-BR&include_adult=true');
    expect(result.status).toBe(200);
    expect(calledUrl(fetcher).searchParams.get('language')).toBe('en-US');
    expect(calledUrl(fetcher).searchParams.get('include_adult')).toBe('false');
  });
  it('não repassa corpo inválido das novas respostas', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        Response.json({ secret: 'fixture-sensitive', backdrops: 'invalid' }),
      );
    const result = await createTmdbHandler({
      fetcher,
      getToken: () => 'fixture-only',
    })('/api/tmdb/movie/1/images');
    expect(result.status).toBe(502);
    expect(await result.text()).not.toContain('fixture-sensitive');
  });
});
