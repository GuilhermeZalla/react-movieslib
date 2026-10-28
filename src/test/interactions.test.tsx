import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import Aside from '../components/common/aside/aside';
import AsideMobile from '../components/common/asideMobile/asideMobile';
import Footer from '../components/common/footer/footer';
import FilmCard from '../components/home/filmCard/filmCard';
import NotFoundScreen from '../screens/notFoundScreen';
import { fixtureFetch } from './fixtures/fetch';
import { genreFixture } from './fixtures/genres';
import { searchControls } from './helpers/controls';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  vi.stubGlobal('fetch', vi.fn(fixtureFetch));
});

function LocationDisplay() {
  return <output aria-label="Rota atual">{useLocation().pathname}</output>;
}

describe('cards e paginação', () => {
  it.each([null, '', 'https://image.tmdb.org/t/p/w500/null'])(
    'não exibe um card sem pôster: %s',
    (poster) => {
      render(
        <MemoryRouter>
          <FilmCard movieId={1} title="Sem pôster" poster={poster} vote="—" />
        </MemoryRouter>,
      );
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    },
  );

  it.each(['', '—'])(
    'mantém imagem e navegação sem nota numérica: %s',
    (vote) => {
      render(
        <MemoryRouter>
          <FilmCard
            movieId={1}
            title="Sessão de teste"
            poster="/fixture.svg"
            vote={vote}
          />
          <LocationDisplay />
        </MemoryRouter>,
      );
      expect(
        screen.getByRole('img', { name: 'Sessão de teste' }),
      ).toHaveAttribute('src', '/fixture.svg');
      const link = screen.getByRole('link', { name: 'View' });
      expect(link).toHaveAttribute('href', '/movie-details/1');
      fireEvent.click(link);
      expect(screen.getByLabelText('Rota atual')).toHaveTextContent(
        '/movie-details/1',
      );
      expect(document.body).not.toHaveTextContent(/NaN|undefined|null/);
    },
  );

  it.each(['popular', 'top_rated'])(
    'preserva as cinco páginas de %s e retorna ao topo',
    (category) => {
      render(
        <MemoryRouter>
          <Footer category={category} />
          <LocationDisplay />
        </MemoryRouter>,
      );
      const footer = within(screen.getByRole('contentinfo'));
      expect(footer.getAllByRole('link')).toHaveLength(5);
      for (const page of [1, 2, 3, 4, 5]) {
        expect(
          footer.getByRole('link', { name: String(page) }),
        ).toHaveAttribute('href', `/catalog/${category}/${page}`);
      }
      document.body.scrollTop = 99;
      document.documentElement.scrollTop = 88;
      fireEvent.click(footer.getByRole('link', { name: '5' }));
      expect(screen.getByLabelText('Rota atual')).toHaveTextContent(
        `/catalog/${category}/5`,
      );
      expect(document.body.scrollTop).toBe(0);
      expect(document.documentElement.scrollTop).toBe(0);
    },
  );
});

describe('busca vazia e limpeza', () => {
  it('não consulta a busca para campo vazio e mantém o catálogo', async () => {
    window.history.replaceState(null, '', '/catalog/popular/1');
    render(<App />);
    await screen.findByRole('link', { name: 'View' });
    const calls = vi.mocked(fetch).mock.calls.length;
    const { input, submit } = searchControls();
    expect(input).toHaveValue('');
    fireEvent.click(submit);
    expect(
      screen.getByRole('heading', { name: 'Overviewing popular movies' }),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(calls);
  });

  it('limpa o resultado pelo X, restaura o catálogo e não faz outra consulta', async () => {
    window.history.replaceState(null, '', '/catalog/popular/1');
    render(<App />);
    await screen.findByRole('link', { name: 'View' });
    const { input, submit, clear } = searchControls();
    fireEvent.change(input, { target: { value: 'Noite azul' } });
    fireEvent.click(submit);
    await screen.findByRole('heading', {
      name: 'Movies by the name Noite azul',
    });
    expect(await screen.findAllByRole('link', { name: 'View' })).toHaveLength(
      5,
    );
    const calls = vi.mocked(fetch).mock.calls.length;
    fireEvent.click(clear);
    expect(
      screen.getByRole('heading', { name: 'Overviewing popular movies' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'View' })).toHaveLength(1);
    expect(input).toHaveStyle({ width: '0px', opacity: '0' });
    expect(fetch).toHaveBeenCalledTimes(calls);
  });
});

describe('menus de gêneros', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response(JSON.stringify(genreFixture)))),
    );
  });

  it('abre/fecha o menu desktop, filtra os gêneros legados e navega', async () => {
    render(
      <MemoryRouter>
        <Aside />
        <LocationDisplay />
      </MemoryRouter>,
    );
    const aside = within(screen.getByRole('complementary'));
    const drama = await aside.findByRole('link', { name: 'Drama' });
    expect(
      aside.queryByRole('link', { name: 'Documentary' }),
    ).not.toBeInTheDocument();
    expect(
      aside.queryByRole('link', { name: 'TV Movie' }),
    ).not.toBeInTheDocument();
    // No aria-expanded exists yet; inspect only the legacy state set by these controls.
    const list = drama.closest('.menu-dropdown');
    fireEvent.click(aside.getByRole('link', { name: 'MoviesLib' }));
    const control = aside.getByRole('button', { name: 'Genres' });
    fireEvent.click(control);
    expect(list).toHaveStyle({ height: '230px' });
    fireEvent.click(control);
    expect(list).toHaveStyle({ height: '0px' });
    fireEvent.click(control);
    fireEvent.click(drama);
    expect(screen.getByLabelText('Rota atual')).toHaveTextContent(
      '/genres/18/Drama',
    );
    expect(list).toHaveStyle({ height: '0px' });
  });

  it('abre/fecha o menu móvel e segue o link do gênero', async () => {
    render(
      <MemoryRouter>
        <AsideMobile />
        <LocationDisplay />
      </MemoryRouter>,
    );
    const aside = within(screen.getByRole('complementary'));
    const drama = await aside.findByRole('link', { name: 'Drama' });
    expect(
      aside.queryByRole('link', { name: 'Documentary' }),
    ).not.toBeInTheDocument();
    expect(
      aside.queryByRole('link', { name: 'TV Movie' }),
    ).not.toBeInTheDocument();
    // The mobile icon has no accessible name until Phase 6; use its button role/order.
    const [control] = aside.getAllByRole('button');
    if (!control) throw new Error('Controle móvel ausente.');
    const list = drama.closest('.menu-dropup');
    fireEvent.click(control);
    expect(list).toHaveStyle({ visibility: 'visible', opacity: '1' });
    fireEvent.click(control);
    expect(list).toHaveStyle({ visibility: 'hidden', opacity: '0' });
    fireEvent.click(control);
    fireEvent.click(drama);
    expect(screen.getByLabelText('Rota atual')).toHaveTextContent(
      '/genres/18/Drama',
    );
  });
});

it('404 oferece retorno à home sem consultar a API', () => {
  render(
    <MemoryRouter initialEntries={['/nao-existe']}>
      <NotFoundScreen />
      <LocationDisplay />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole('heading', {
      level: 1,
      name: '404 — Página não encontrada',
    }),
  ).toBeInTheDocument();
  const link = screen.getByRole('link', { name: 'Voltar ao início' });
  expect(link).toHaveAttribute('href', '/');
  fireEvent.click(link);
  expect(screen.getByLabelText('Rota atual')).toHaveTextContent(/^\/$/);
  expect(fetch).not.toHaveBeenCalled();
});
