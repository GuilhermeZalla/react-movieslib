import { describe, expect, it } from 'vitest';
import { resolveRequest, PolicyError } from './policy';
describe('idioma enumerado do proxy', () => {
  it.each(['pt-BR', 'en-US'])(
    'reconstrói %s sem permitir controle de adulto/host',
    (locale) => {
      const { url } = resolveRequest(
        '/api/tmdb/genre/movie/list?locale=' +
          locale +
          '&language=xx&include_adult=true',
      );
      expect(url.origin).toBe('https://api.themoviedb.org');
      expect(url.searchParams.get('language')).toBe(locale);
      expect(url.searchParams.get('include_adult')).toBe('false');
      expect(url.searchParams.has('locale')).toBe(false);
    },
  );
  it('usa pt-BR sem preferência', () => {
    expect(
      resolveRequest('/api/tmdb/movie/popular').url.searchParams.get(
        'language',
      ),
    ).toBe('pt-BR');
  });
  it.each([
    'fr-FR',
    '',
    '../en-US',
    'en-US&locale=pt-BR',
    'https://example.com',
  ])('rejeita preferência inválida ou duplicada: %s', (value) => {
    expect(() =>
      resolveRequest('/api/tmdb/movie/popular?locale=' + value),
    ).toThrow(PolicyError);
  });
});
