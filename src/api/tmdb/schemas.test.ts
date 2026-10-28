import { describe, expect, it } from 'vitest';
import fixture from '../../test/fixtures/tmdb.json';
import {
  genreListSchema,
  movieCreditsSchema,
  movieDetailsSchema,
  moviePageSchema,
  movieSummarySchema,
  personDetailsSchema,
  personMovieCreditsSchema,
  personPageSchema,
} from './schemas';

describe('contratos das respostas TMDB', () => {
  it('aceita filme, pessoa, gêneros e créditos fictícios existentes', () => {
    expect(movieDetailsSchema.parse(fixture.movie).credits?.cast[0]?.id).toBe(
      2,
    );
    expect(personDetailsSchema.parse(fixture.person).gender).toBe(0);
    expect(
      genreListSchema.parse({ genres: fixture.movie.genres }).genres,
    ).toHaveLength(1);
    expect(movieCreditsSchema.parse(fixture.movie.credits).crew).toEqual([]);
  });

  it('normaliza ausência de campos de apresentação e conserva valores nulos', () => {
    expect(movieSummarySchema.parse({ id: 3, title: 'Sem ficha' })).toEqual({
      id: 3,
      title: 'Sem ficha',
      poster_path: null,
      backdrop_path: null,
      overview: null,
      release_date: null,
      vote_average: null,
      genre_ids: [],
    });
    expect(
      personDetailsSchema.parse({
        id: 4,
        name: 'Pessoa fictícia',
        birthday: null,
      }),
    ).toMatchObject({
      birthday: null,
      deathday: null,
      gender: 0,
      profile_path: null,
    });
    expect(movieDetailsSchema.parse(fixture.movie).budget).toBe(100);
    const withoutCredits = { id: 3, title: 'Sem ficha', genres: [] };
    expect(movieDetailsSchema.parse(withoutCredits)).not.toHaveProperty(
      'credits',
    );
  });

  it.each([
    { ...fixture.movie, id: '1' },
    { ...fixture.movie, id: 0 },
    { ...fixture.movie, title: undefined },
    { ...fixture.movie, vote_average: 11 },
    { ...fixture.movie, release_date: '2026-99-99' },
    { ...fixture.movie, poster_path: 'https://other.example/poster.jpg' },
    { ...fixture.movie, poster_path: '/../poster.jpg' },
  ])('rejeita filme inválido sem coerção dos dados remotos (%#)', (input) => {
    expect(movieSummarySchema.safeParse(input).success).toBe(false);
  });

  it('tolera campos novos do TMDB sem expô-los ao modelo consumido', () => {
    expect(
      movieSummarySchema.parse({ ...fixture.movie, unknown_field: true }),
    ).not.toHaveProperty('unknown_field');
  });

  it('aceita resultados vazios como sucesso e rejeita páginas malformadas', () => {
    const empty = { page: 1, total_pages: 0, total_results: 0, results: [] };
    expect(moviePageSchema.parse(empty).results).toEqual([]);
    expect(personPageSchema.parse(empty).results).toEqual([]);
    expect(moviePageSchema.safeParse({ ...empty, results: null }).success).toBe(
      false,
    );
    expect(
      moviePageSchema.safeParse({ ...empty, total_results: -1 }).success,
    ).toBe(false);
    expect(
      personPageSchema.safeParse({ ...empty, results: [{ id: 2 }] }).success,
    ).toBe(false);
  });

  it('valida os campos específicos de equipe e filmografia', () => {
    const crew = {
      ...fixture.person,
      credit_id: 'fictitious',
      department: 'Directing',
      job: 'Director',
    };
    expect(
      movieCreditsSchema.parse({ cast: [], crew: [crew] }).crew[0]?.job,
    ).toBe('Director');
    expect(
      movieCreditsSchema.safeParse({ cast: [], crew: [{ ...crew, job: 4 }] })
        .success,
    ).toBe(false);
    expect(
      personMovieCreditsSchema.parse({ cast: [fixture.movie], crew: [] })
        .cast[0]?.title,
    ).toBe(fixture.movie.title);
    expect(
      personMovieCreditsSchema.safeParse({ cast: [], crew: [fixture.movie] })
        .success,
    ).toBe(false);
    expect(
      personDetailsSchema.safeParse({ ...fixture.person, gender: 7 }).success,
    ).toBe(false);
    expect(
      movieDetailsSchema.safeParse({ ...fixture.movie, runtime: -1 }).success,
    ).toBe(false);
  });
});
