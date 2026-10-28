import { describe, expect, it } from 'vitest';
import fixture from './fixtures/tmdb.json';
import { genreFixture } from './fixtures/genres';
import { fixtureFetch } from './fixtures/fetch';
import {
  genreListSchema,
  movieDetailsSchema,
  moviePageSchema,
  movieSummarySchema,
  personDetailsSchema,
  personMovieCreditsSchema,
  personPageSchema,
} from '../api/tmdb/schemas';

describe('contrato das fixtures atuais dos componentes', () => {
  it.each([
    ['/api/tmdb/movie/popular?page=1', moviePageSchema],
    ['/api/tmdb/movie/popular?page=5', moviePageSchema],
    ['/api/tmdb/movie/now_playing?page=1', moviePageSchema],
    ['/api/tmdb/movie/top_rated?page=2', moviePageSchema],
    ['/api/tmdb/movie/upcoming?page=1', moviePageSchema],
    ['/api/tmdb/trending/movie/day?page=1', moviePageSchema],
    ['/api/tmdb/search/movie?query=Filme&page=3', moviePageSchema],
    ['/api/tmdb/person/popular?page=6', personPageSchema],
    ['/api/tmdb/search/person?query=Pessoa&page=2', personPageSchema],
    ['/api/tmdb/genre/movie/list', genreListSchema],
    ['/api/tmdb/movie/1?append_to_response=credits', movieDetailsSchema],
    ['/api/tmdb/movie/2?append_to_response=credits', movieDetailsSchema],
    ['/api/tmdb/person/2', personDetailsSchema],
    ['/api/tmdb/person/3', personDetailsSchema],
    ['/api/tmdb/person/2/movie_credits', personMovieCreditsSchema],
  ] as const)(
    'valida o payload real de fixtureFetch para %s',
    async (path, schema) => {
      const response = await fixtureFetch(path);
      const data: unknown = await response.json();
      expect(schema.safeParse(data).success).toBe(true);
    },
  );

  it('aceita os gêneros dos menus e as variantes nulas usadas nos componentes', () => {
    expect(genreListSchema.safeParse(genreFixture).success).toBe(true);
    expect(
      movieSummarySchema.safeParse({ ...fixture.movie, vote_average: null })
        .success,
    ).toBe(true);
    const movie = {
      ...fixture.movie,
      poster_path: null,
      backdrop_path: null,
      overview: null,
      release_date: null,
      tagline: null,
      runtime: null,
      budget: null,
      revenue: null,
    };
    Reflect.deleteProperty(movie, 'credits');
    const parsed = movieDetailsSchema.safeParse(movie);
    expect(parsed.success).toBe(true);
    for (const gender of [0, 1, 2, 3]) {
      expect(
        personDetailsSchema.safeParse({
          ...fixture.person,
          gender,
          biography: null,
          birthday: null,
          deathday: null,
          place_of_birth: null,
          imdb_id: null,
          profile_path: null,
        }).success,
      ).toBe(true);
    }
  });
});
