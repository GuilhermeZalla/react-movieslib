import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import fixture from './fixtures/tmdb.json';
import { fixtureFetch } from './fixtures/fetch';
import { openApp, pathOf, json } from './helpers/app';
beforeEach(() => vi.stubGlobal('fetch', vi.fn(fixtureFetch)));
describe('dados ausentes na interface Pulso', () => {
  it('mantém filme sem pôster e sem nota no catálogo', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) =>
        pathOf(input).pathname === '/api/tmdb/movie/popular'
          ? Promise.resolve(
              json({
                page: 1,
                total_pages: 1,
                total_results: 1,
                results: [
                  { ...fixture.movie, poster_path: null, vote_average: null },
                ],
              }),
            )
          : fixtureFetch(input),
      ),
    );
    openApp('/catalog/popular/1');
    expect(
      await screen.findByRole('link', { name: /Filme de exemplo/ }),
    ).toHaveAttribute('href', '/movie-details/1');
    expect(screen.getByText('Sem pôster')).toBeInTheDocument();
    expect(screen.queryByText('NaN')).not.toBeInTheDocument();
  });
  it('substitui dados ausentes da ficha por texto compreensível', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) =>
        pathOf(input).pathname === '/api/tmdb/movie/1'
          ? Promise.resolve(
              json({
                ...fixture.movie,
                poster_path: null,
                overview: null,
                budget: null,
                revenue: null,
                runtime: null,
              }),
            )
          : fixtureFetch(input),
      ),
    );
    openApp('/movie-details/1');
    await screen.findByRole('heading', { level: 1, name: 'Filme de exemplo' });
    const card = within(screen.getByRole('region', { name: 'Ficha do filme' }));
    expect(card.getByText('Sinopse indisponível.')).toBeInTheDocument();
    expect(card.getByText('Não informado')).toBeInTheDocument();
    expect(
      card.getByRole('img', { name: 'Filme de exemplo' }),
    ).not.toHaveAttribute('src');
  });
  it.each([
    [0, 'Não informado'],
    [1, 'Feminino'],
    [2, 'Masculino'],
    [3, 'Não binário'],
  ])('trata gênero %s e ausência da biografia', async (gender, label) => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) =>
        pathOf(input).pathname === '/api/tmdb/person/2'
          ? Promise.resolve(
              json({
                ...fixture.person,
                gender,
                biography: null,
                profile_path: null,
                birthday: null,
              }),
            )
          : fixtureFetch(input),
      ),
    );
    openApp('/cast/2');
    await screen.findByRole('heading', { level: 1, name: 'Pessoa de exemplo' });
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText('Biografia indisponível.')).toBeInTheDocument();
    expect(screen.queryByText('Falecimento')).not.toBeInTheDocument();
  });
});
