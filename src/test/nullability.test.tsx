import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../app/App';
import Header from '../components/layout/Header';
import Genres from '../components/layout/Genres';
import FilmCard from '../components/movies/FilmCard';
import Cast from '../components/people/Cast';
import BannerImg from '../components/movies/BannerImg';
import fixture from './fixtures/tmdb.json';
import { fixtureFetch } from './fixtures/fetch';
import { searchControls } from './helpers/controls';
import type {
  MovieDetails,
  MoviePage,
  PersonDetails,
  PersonGender,
} from '../types/tmdb';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  vi.stubGlobal('fetch', vi.fn(fixtureFetch));
});

describe('ausências tratadas durante a conversão estrita', () => {
  it('mantém pesquisa e limpeza no cabeçalho com botões válidos', () => {
    const onSearch = vi.fn<(query: string) => void>();
    render(
      <MemoryRouter>
        <Header handleSearchMovies={onSearch} />
      </MemoryRouter>,
    );
    const { input, submit: search, clear: close } = searchControls();
    fireEvent.change(input, { target: { value: 'Filme' } });
    fireEvent.click(search);
    expect(onSearch).toHaveBeenLastCalledWith('Filme');
    fireEvent.click(close);
    expect(onSearch).toHaveBeenLastCalledWith('');
    expect(
      screen
        .getAllByRole('button')
        .every((button) => button.getAttribute('type') === 'button'),
    ).toBe(true);
  });

  it('aceita o link de gênero do menu móvel sem callback de fechar', () => {
    render(
      <MemoryRouter>
        <Genres id={18} name="Drama" />
      </MemoryRouter>,
    );
    const link = screen.getByRole('link', { name: 'Drama' });
    expect(link).toHaveAttribute('href', '/genres/18/Drama');
    expect(() => fireEvent.click(link)).not.toThrow();
  });

  it.each([
    [
      'filme',
      <FilmCard movieId={1} title="Sem imagem" poster={null} vote="—" />,
    ],
    ['pessoa', <Cast id={2} name="Sem foto" photo={null} />],
    ['banner', <BannerImg movieId={1} title="Sem fundo" url={null} />],
  ])('não cria URL inválida para %s sem imagem', (_label, element) => {
    const { container } = render(<MemoryRouter>{element}</MemoryRouter>);
    expect(container).toBeEmptyDOMElement();
  });

  it('mostra ausência de valores no detalhe sem NaN, URL null ou créditos obrigatórios', async () => {
    const movie: MovieDetails = {
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
    delete movie.credits;
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) =>
        String(input instanceof Request ? input.url : input).startsWith(
          '/api/tmdb/movie/1?',
        )
          ? Promise.resolve(
              new Response(JSON.stringify(movie), {
                headers: { 'Content-Type': 'application/json' },
              }),
            )
          : fixtureFetch(input),
      ),
    );
    window.history.replaceState(null, '', '/movie-details/1');
    render(<App />);
    await screen.findByRole('heading', { level: 1, name: 'Filme de exemplo' });
    const main = screen.getByRole('main');
    expect(main).toHaveTextContent('$—');
    expect(main).toHaveTextContent('— minutes');
    expect(main).not.toHaveTextContent(/NaN|undefined|null/);
    expect(
      screen.getByRole('img', { name: 'Filme de exemplo' }),
    ).not.toHaveAttribute('src');
    expect(
      screen.queryByRole('heading', { name: 'Pessoa de exemplo' }),
    ).not.toBeInTheDocument();
  });

  const genders: Array<[PersonGender, string]> = [
    [0, 'Not specified'],
    [1, 'Feminine'],
    [2, 'Masculine'],
    [3, 'Non-binary'],
  ];

  it.each(genders)(
    'trata gênero %s e campos nulos de pessoa',
    async (gender, label) => {
      const person: PersonDetails = {
        ...fixture.person,
        gender,
        biography: null,
        birthday: null,
        deathday: null,
        place_of_birth: null,
        imdb_id: null,
        profile_path: null,
      };
      vi.stubGlobal(
        'fetch',
        vi.fn((input: RequestInfo | URL) =>
          String(input instanceof Request ? input.url : input) ===
          '/api/tmdb/person/2'
            ? Promise.resolve(
                new Response(JSON.stringify(person), {
                  headers: { 'Content-Type': 'application/json' },
                }),
              )
            : fixtureFetch(input),
        ),
      );
      window.history.replaceState(null, '', '/cast/2');
      render(<App />);
      await screen.findByRole('heading', {
        level: 1,
        name: 'Pessoa de exemplo',
      });
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.queryByText('Deathday:')).not.toBeInTheDocument();
      expect(
        screen.getByRole('img', { name: 'Pessoa de exemplo' }),
      ).not.toHaveAttribute('src');
    },
  );

  it('mantém o card de filme quando só a nota está ausente', async () => {
    const page: MoviePage = {
      page: 1,
      total_pages: 1,
      total_results: 1,
      results: [{ ...fixture.movie, vote_average: null }],
    };
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) =>
        String(input instanceof Request ? input.url : input).startsWith(
          '/api/tmdb/movie/popular?',
        )
          ? Promise.resolve(
              new Response(JSON.stringify(page), {
                headers: { 'Content-Type': 'application/json' },
              }),
            )
          : fixtureFetch(input),
      ),
    );
    window.history.replaceState(null, '', '/catalog/popular/1');
    render(<App />);
    const link = await screen.findByRole('link', { name: /View/ });
    expect(link).toHaveAttribute('href', '/movie-details/1');
    expect(link.closest('.home__card')).toHaveTextContent('—');
  });
});
