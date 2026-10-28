import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App.jsx';
import { fixtureFetch } from './fixtures/fetch';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  vi.stubGlobal('fetch', vi.fn(fixtureFetch));
});

function openRoute(path: string) {
  window.history.replaceState(null, '', path);
  return render(<App />);
}

describe('contratos de navegação preservados na migração', () => {
  it.each([
    ['/', 'Welcome to the Movie Library'],
    ['/catalog/popular/1', 'Overviewing popular movies'],
    ['/upcoming_&_just_released/upcoming/1', 'Overviewing upcoming movies'],
    ['/top_rated/top_rated/1', 'Overviewing top rated movies'],
    ['/genres/18/Drama', 'Overviewing Drama movies'],
    ['/movie-details/1', 'Filme de exemplo'],
    ['/cast/2', 'Pessoa de exemplo'],
  ])('abre diretamente %s', async (path, title) => {
    openRoute(path);
    expect(
      await screen.findByRole('heading', { level: 1, name: title }),
    ).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(
      vi
        .mocked(fetch)
        .mock.calls.every(([url]) => String(url).startsWith('/api/tmdb/')),
    ).toBe(true);
  });

  it('abre o catálogo de pessoas e uma filmografia sem repetir chamadas em loop', async () => {
    openRoute('/cast');
    const people = await screen.findAllByRole('heading', {
      name: 'Pessoa de exemplo',
    });
    fireEvent.click(people[0].closest('a')!);
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Pessoa de exemplo',
      }),
    ).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /View/ })).toHaveAttribute(
      'href',
      '/movie-details/1',
    );
    const calls = vi.mocked(fetch).mock.calls.length;
    await new Promise((resolve) => setTimeout(resolve, 75));
    expect(fetch).toHaveBeenCalledTimes(calls);
  });

  it('navega de um card para o filme e permite voltar pelo histórico', async () => {
    openRoute('/catalog/popular/1');
    fireEvent.click(await screen.findByRole('link', { name: /View/ }));
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Filme de exemplo',
      }),
    ).toBeInTheDocument();
    window.history.back();
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Overviewing popular movies',
      }),
    ).toBeInTheDocument();
  });

  it('atualiza o filme quando o parâmetro de rota muda', async () => {
    openRoute('/movie-details/1');
    await screen.findByRole('heading', { level: 1, name: 'Filme de exemplo' });
    window.history.pushState(null, '', '/movie-details/3');
    fireEvent.popState(window);
    await waitFor(() =>
      expect(
        vi
          .mocked(fetch)
          .mock.calls.some(([url]) => String(url).includes('/movie/3?')),
      ).toBe(true),
    );
  });

  it('mostra a 404 sem API e oferece retorno à home', async () => {
    openRoute('/endereco-inexistente');
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '404 — Página não encontrada',
      }),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('link', { name: 'Voltar ao início' }));
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Welcome to the Movie Library',
      }),
    ).toBeInTheDocument();
  });
});
