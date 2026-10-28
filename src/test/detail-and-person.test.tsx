import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../app/App';
import fixture from './fixtures/tmdb.json';
import { fixtureFetch } from './fixtures/fetch';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  vi.stubGlobal('fetch', vi.fn(fixtureFetch));
});

describe('detalhe do filme e pessoa (grupo 4b)', () => {
  it('mantém o detalhe visível quando os créditos falham', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input instanceof Request ? input.url : input);
        if (url.startsWith('/api/tmdb/movie/1/credits')) {
          return Promise.reject(new Error('network'));
        }
        return fixtureFetch(input);
      }),
    );
    window.history.replaceState(null, '', '/movie-details/1');
    render(<App />);
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Filme de exemplo',
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Não foi possível carregar o elenco.'),
    ).toBeInTheDocument();
  });

  it('filme sem pôster e sem sinopse tem fallback (sem imagem quebrada)', async () => {
    const movie = JSON.parse(JSON.stringify(fixture.movie)) as {
      poster_path: string | null;
      overview: string | null;
      title: string;
    };
    movie.poster_path = null;
    movie.overview = null;
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input instanceof Request ? input.url : input);
        if (url.startsWith('/api/tmdb/movie/1?')) {
          return Promise.resolve(
            new Response(JSON.stringify(movie), {
              headers: { 'Content-Type': 'application/json' },
            }),
          );
        }
        return fixtureFetch(input);
      }),
    );
    window.history.replaceState(null, '', '/movie-details/1');
    render(<App />);
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Filme de exemplo',
      }),
    ).toBeInTheDocument();
    const img = screen.getByRole('img', { name: 'Filme de exemplo' });
    expect(img).not.toHaveAttribute('src');
  });

  it('ID inválido de filme vai para 404 sem chamar o fetch', async () => {
    window.history.replaceState(null, '', '/movie-details/abc');
    render(<App />);
    expect(
      await screen.findByRole('heading', { level: 1, name: /404/ }),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('ID inválido de pessoa vai para 404 sem chamar o fetch', async () => {
    window.history.replaceState(null, '', '/cast/abc');
    render(<App />);
    expect(
      await screen.findByRole('heading', { level: 1, name: /404/ }),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('pessoa sem filmografia mostra EmptyState sem botão de tentar de novo', async () => {
    const person = { ...fixture.person, gender: 0 };
    const credits = { id: 2, cast: [], crew: [] };
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input instanceof Request ? input.url : input);
        if (url === '/api/tmdb/person/2') {
          return Promise.resolve(
            new Response(JSON.stringify(person), {
              headers: { 'Content-Type': 'application/json' },
            }),
          );
        }
        if (url === '/api/tmdb/person/2/movie_credits') {
          return Promise.resolve(
            new Response(JSON.stringify(credits), {
              headers: { 'Content-Type': 'application/json' },
            }),
          );
        }
        return fixtureFetch(input);
      }),
    );
    window.history.replaceState(null, '', '/cast/2');
    render(<App />);
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Pessoa de exemplo',
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Nenhuma filmografia encontrada'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Tentar novamente/ }),
    ).not.toBeInTheDocument();
  });

  it('falha real mostra ErrorState com retry que refaz a consulta', async () => {
    let calls = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input instanceof Request ? input.url : input);
        if (url.startsWith('/api/tmdb/movie/1?')) {
          calls += 1;
          if (calls <= 2) return Promise.reject(new TypeError('network'));
          return fixtureFetch(input);
        }
        return fixtureFetch(input);
      }),
    );
    window.history.replaceState(null, '', '/movie-details/1');
    render(<App />);
    const retry = await screen.findByRole(
      'button',
      { name: /Tentar novamente/ },
      { timeout: 5000 },
    );
    expect(retry).toBeInTheDocument();
    fireEvent.click(retry);
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Filme de exemplo',
      }),
    ).toBeInTheDocument();
  });
});
