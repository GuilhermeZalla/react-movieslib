import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Home from './Home';
import { createQueryClient } from '../../app/queryClient';
import { fixtureFetch } from '../../test/fixtures/fetch';
import fixture from '../../test/fixtures/tmdb.json';

function renderHome() {
  const client = createQueryClient();
  const tree = () => (
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </QueryClientProvider>
  );
  const view = render(tree());
  return { ...view, client, rerenderHome: () => view.rerender(tree()) };
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function pathOf(input: RequestInfo | URL) {
  return new URL(
    input instanceof Request ? input.url : String(input),
    'http://localhost',
  ).pathname;
}

const sections = [
  ['Em cartaz', '/api/tmdb/movie/now_playing', 'Nada em cartaz'],
  ['Populares', '/api/tmdb/movie/popular', 'Sem populares'],
  ['Mais bem avaliados', '/api/tmdb/movie/top_rated', 'Sem resultados'],
] as const;

describe('home Pulso', () => {
  it('exibe skeletons enquanto aguarda as respostas', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>(() => {})),
    );
    renderHome();
    expect(
      screen.getAllByRole('status', { name: 'Carregando pôster' }),
    ).toHaveLength(15);
    expect(
      screen.queryByRole('button', { name: 'Tentar novamente' }),
    ).not.toBeInTheDocument();
  });

  it('carrega as quatro consultas, inclusive uma lista com só um filme, sem repetir no rerender', async () => {
    vi.stubGlobal('fetch', vi.fn(fixtureFetch));
    const view = renderHome();
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: fixture.movie.title,
      }),
    ).toBeInTheDocument();
    const nowPlaying = screen.getByRole('region', { name: 'Em cartaz' });
    expect(
      within(nowPlaying).getByRole('heading', { name: fixture.movie.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Todo mundo está vendo' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Drama' })).toHaveAttribute(
      'href',
      '/genres/18/Drama',
    );
    expect(
      within(screen.getByRole('region', { name: 'Destaque' })).getByRole(
        'img',
        { name: fixture.movie.title },
      ),
    ).toHaveAttribute('fetchpriority', 'high');
    expect(fetch).toHaveBeenCalledTimes(4);
    view.rerenderHome();
    await act(async () => {
      await Promise.resolve();
    });
    expect(fetch).toHaveBeenCalledTimes(4);
    expect(document.body.textContent).not.toMatch(/\\u[0-9a-f]{4}/i);
  });

  it.each(sections)(
    '%s: resposta vazia usa EmptyState sem retry',
    async (label, path, title) => {
      vi.stubGlobal(
        'fetch',
        vi.fn((input: RequestInfo | URL) =>
          pathOf(input) === path
            ? Promise.resolve(
                json({
                  page: 1,
                  results: [],
                  total_pages: 0,
                  total_results: 0,
                }),
              )
            : fixtureFetch(input),
        ),
      );
      renderHome();
      const section = screen.getByRole('region', { name: label });
      expect(
        await within(section).findByRole('heading', { name: title }),
      ).toBeInTheDocument();
      expect(
        within(section).queryByRole('button', { name: 'Tentar novamente' }),
      ).not.toBeInTheDocument();
      expect(fetch).toHaveBeenCalledTimes(4);
    },
  );

  it('gêneros vazios têm estado explícito sem retry', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) =>
        pathOf(input) === '/api/tmdb/genre/movie/list'
          ? Promise.resolve(json({ genres: [] }))
          : fixtureFetch(input),
      ),
    );
    renderHome();
    const section = screen.getByRole('region', { name: 'Gêneros' });
    expect(
      await within(section).findByRole('heading', {
        name: 'Nenhum gênero por aqui',
      }),
    ).toBeInTheDocument();
    expect(within(section).queryByRole('button')).not.toBeInTheDocument();
  });

  it('substitui os dados antigos por EmptyState quando a atualização vem vazia', async () => {
    let empty = false;
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) =>
        empty && pathOf(input) === '/api/tmdb/movie/popular'
          ? Promise.resolve(
              json({ page: 1, results: [], total_pages: 0, total_results: 0 }),
            )
          : fixtureFetch(input),
      ),
    );
    const { client } = renderHome();
    await screen.findByRole('region', { name: 'Filmes populares' });
    empty = true;
    await act(async () => {
      await client.invalidateQueries({
        queryKey: ['tmdb', 'movie', 'list', 'popular', 1],
      });
    });
    const section = screen.getByRole('region', { name: 'Populares' });
    expect(
      await within(section).findByRole('heading', { name: 'Sem populares' }),
    ).toBeInTheDocument();
    expect(
      within(section).queryByRole('button', { name: 'Tentar novamente' }),
    ).not.toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(5);
  });

  it.each([
    ...sections.map(([label, path]) => [label, path] as const),
    ['Gêneros', '/api/tmdb/genre/movie/list'],
  ] as const)(
    '%s: retry recarrega somente a consulta que falhou',
    async (label, path) => {
      let failing = true;
      const fetchMock = vi.fn((input: RequestInfo | URL) =>
        pathOf(input) === path && failing
          ? Promise.resolve(json({ error: 'unavailable' }, 502))
          : fixtureFetch(input),
      );
      vi.stubGlobal('fetch', fetchMock);
      renderHome();
      const section = screen.getByRole('region', { name: label });
      const retry = await within(section).findByRole('button', {
        name: 'Tentar novamente',
      });
      expect(fetchMock).toHaveBeenCalledTimes(4);
      failing = false;
      fireEvent.click(retry);
      await waitFor(() =>
        expect(
          within(section).queryByRole('button', { name: 'Tentar novamente' }),
        ).not.toBeInTheDocument(),
      );
      expect(fetchMock).toHaveBeenCalledTimes(5);
      expect(
        fetchMock.mock.calls.filter(([input]) => pathOf(input) === path),
      ).toHaveLength(2);
    },
  );

  it('troca imagem quebrada por fallback na abertura e nos cards', async () => {
    vi.stubGlobal('fetch', vi.fn(fixtureFetch));
    renderHome();
    const opening = screen.getByRole('region', { name: 'Destaque' });
    const poster = await within(opening).findByRole('img', {
      name: fixture.movie.title,
    });
    fireEvent.error(poster);
    expect(
      within(opening).getByRole('img', { name: fixture.movie.title }),
    ).not.toHaveAttribute('src');
    const card = within(
      screen.getByRole('region', { name: 'Em cartaz' }),
    ).getByRole('img', { name: fixture.movie.title });
    fireEvent.error(card);
    expect(
      within(screen.getByRole('region', { name: 'Em cartaz' })).getByText(
        'Sem pôster',
      ),
    ).toBeInTheDocument();
  });

  it('mantém filme sem pôster, nota ou sinopse acessível', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) =>
        pathOf(input) === '/api/tmdb/movie/popular'
          ? Promise.resolve(
              json({
                page: 1,
                total_pages: 1,
                total_results: 1,
                results: [
                  {
                    ...fixture.movie,
                    poster_path: null,
                    backdrop_path: null,
                    vote_average: null,
                    overview: null,
                  },
                ],
              }),
            )
          : fixtureFetch(input),
      ),
    );
    renderHome();
    const opening = screen.getByRole('region', { name: 'Destaque' });
    expect(
      await within(opening).findByRole('heading', {
        level: 1,
        name: fixture.movie.title,
      }),
    ).toBeInTheDocument();
    expect(within(opening).getByText('Sem nota')).toBeInTheDocument();
    expect(
      within(opening).getByText('Sinopse indisponível.'),
    ).toBeInTheDocument();
    expect(
      within(opening).getByRole('img', { name: fixture.movie.title }),
    ).not.toHaveAttribute('src');
  });

  it.each([false, true])(
    'carrossel respeita redução de movimento: %s',
    async (reducedMotion) => {
      vi.stubGlobal('fetch', vi.fn(fixtureFetch));
      vi.stubGlobal(
        'matchMedia',
        vi.fn(() => ({
          matches: reducedMotion,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      );
      renderHome();
      const region = await screen.findByRole('region', {
        name: 'Filmes populares',
      });
      const scrollBy = vi.fn();
      Object.defineProperty(region, 'scrollBy', { value: scrollBy });
      Object.defineProperty(region, 'clientWidth', { value: 500 });
      fireEvent.click(screen.getByRole('button', { name: 'Próximo' }));
      fireEvent.click(screen.getByRole('button', { name: 'Anterior' }));
      expect(scrollBy.mock.calls).toEqual([
        [{ left: 400, behavior: reducedMotion ? 'auto' : 'smooth' }],
        [{ left: -400, behavior: reducedMotion ? 'auto' : 'smooth' }],
      ]);
    },
  );
});
