import { describe, expect, it, vi } from 'vitest';
import {
  discoverMovies,
  getMovieImages,
  getMovieVideos,
  getRecommendations,
  TmdbError,
} from './client';
import {
  discoverQuery,
  movieImagesQuery,
  movieVideosQuery,
  recommendationsQuery,
} from './queries';
describe('contratos adicionais no cliente centralizado', () => {
  it('valida descoberta e usa apenas o proxy', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      Response.json({
        page: 1,
        total_pages: 1,
        total_results: 1,
        results: [{ id: 1, title: 'Filme' }],
      }),
    );
    vi.stubGlobal('fetch', fetcher);
    expect(
      (
        await discoverMovies({
          page: '1',
          with_genres: '18',
          primary_release_year: '2026',
          'vote_average.gte': '7',
          sort_by: 'title.asc',
        })
      ).results[0]?.id,
    ).toBe(1);
    expect(String(fetcher.mock.calls[0]?.[0])).toContain(
      '/api/tmdb/discover/movie?',
    );
    expect(String(fetcher.mock.calls[0]?.[0])).toContain(
      'primary_release_year=2026',
    );
  });
  it('rejeita filtro inválido antes de fetch', () => {
    expect(() => discoverMovies({ 'vote_average.gte': '99' })).toThrow(
      TmdbError,
    );
    expect(fetch).not.toHaveBeenCalled();
  });
  it('aplica schema de vídeos e de imagens', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ id: 1, results: 'wrong' })),
    );
    await expect(getMovieVideos(1)).rejects.toBeInstanceOf(TmdbError);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({
          id: 1,
          backdrops: [{ file_path: 'javascript:attack', width: 1, height: 1 }],
          posters: [],
        }),
      ),
    );
    await expect(getMovieImages(1)).rejects.toMatchObject({
      kind: 'invalid-response',
    });
  });
  it('recomendação vazia usa erro tipado vazio', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({
          page: 1,
          total_pages: 0,
          total_results: 0,
          results: [],
        }),
      ),
    );
    await expect(getRecommendations(1)).rejects.toMatchObject({
      kind: 'empty',
    });
  });
  it('chaves não colidem entre detalhe, mídias e filtros', () => {
    const keys = [
      discoverQuery({ with_genres: '18' }),
      discoverQuery({ with_genres: '35' }),
      movieImagesQuery(1),
      movieVideosQuery(1),
      recommendationsQuery(1),
    ].map((option) => JSON.stringify(option.queryKey));
    expect(new Set(keys).size).toBe(5);
  });
});
