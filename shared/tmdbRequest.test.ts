import { describe, expect, it } from 'vitest';
import {
  detailRequestSchema,
  idParameterSchema,
  movieListRequestSchema,
  pageParameterSchema,
  searchInputSchema,
  searchQuerySchema,
  searchRequestSchema,
} from './tmdbRequest';

describe('parâmetros TMDB compartilhados', () => {
  it('executa em Node, sem DOM', () => {
    expect(typeof document).toBe('undefined');
  });

  it('aceita IDs e páginas inteiros com limites e defaults explícitos', () => {
    expect(detailRequestSchema.parse({ id: '42' })).toEqual({ id: 42 });
    expect(pageParameterSchema.parse('500')).toBe(500);
    expect(movieListRequestSchema.parse({ category: 'upcoming' })).toEqual({
      category: 'upcoming',
      page: 1,
    });
    expect(searchRequestSchema.parse({ query: ' Filme ', page: '2' })).toEqual({
      query: 'Filme',
      page: 2,
    });
  });

  it.each([
    '',
    '0',
    '-1',
    '1.5',
    ' 1',
    '1e2',
    '01',
    '9007199254740992',
    '../1',
  ])('rejeita ID ambíguo ou inválido: %j', (value) => {
    expect(idParameterSchema.safeParse(value).success).toBe(false);
  });

  it('rejeita página fora do limite, categoria arbitrária e valores duplicados', () => {
    expect(pageParameterSchema.safeParse('501').success).toBe(false);
    expect(pageParameterSchema.safeParse(['1', '2']).success).toBe(false);
    expect(
      movieListRequestSchema.safeParse({ category: '../configuration' })
        .success,
    ).toBe(false);
    expect(detailRequestSchema.safeParse({ id: ['1', '2'] }).success).toBe(
      false,
    );
  });

  it('normaliza Unicode e espaços preservando pontuação para URLSearchParams', () => {
    expect(searchQuerySchema.parse('  Sessa\u0303o\t teste & + cinema  ')).toBe(
      'Sessão teste & + cinema',
    );
    expect(searchInputSchema.parse(' \n\t ')).toBe('');
    expect(searchQuerySchema.safeParse(' \n\t ').success).toBe(false);
  });

  it('impõe 200 caracteres sem truncar silenciosamente', () => {
    expect(searchQuerySchema.parse('a'.repeat(200))).toHaveLength(200);
    expect(searchQuerySchema.safeParse('a'.repeat(201)).success).toBe(false);
  });

  it.each([
    { language: 'pt-BR' },
    { include_adult: 'true' },
    { api_key: 'not-a-credential' },
    { unexpected: 'value' },
  ])('rejeita opções não controladas pelo cliente (%#)', (extra) => {
    expect(
      searchRequestSchema.safeParse({ query: 'Filme', ...extra }).success,
    ).toBe(false);
    expect(
      movieListRequestSchema.safeParse({ category: 'popular', ...extra })
        .success,
    ).toBe(false);
  });
});
