import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fixtureFetch } from './fixtures/fetch';
import { openApp, pathOf } from './helpers/app';
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('fetch', vi.fn(fixtureFetch));
});
describe('rotas preservadas e navegação Pulso', () => {
  it.each([
    ['/', 'Filme de exemplo'],
    ['/catalog/popular/1', 'Filmes populares'],
    ['/upcoming_&_just_released/upcoming/1', 'Em breve'],
    ['/top_rated/top_rated/1', 'Mais bem avaliados'],
    ['/genres/18/Drama', 'Filmes de Drama'],
    ['/movie-details/1', 'Filme de exemplo'],
    ['/cast/2', 'Pessoa de exemplo'],
    ['/cast', 'Quem faz o cinema'],
    ['/minha-lista', 'Minha lista'],
  ])('abre diretamente %s', async (path, title) => {
    openApp(path);
    expect(
      await screen.findByRole('heading', { level: 1, name: title }),
    ).toBeInTheDocument();
    expect(
      vi
        .mocked(fetch)
        .mock.calls.every(([input]) =>
          pathOf(input).pathname.startsWith('/api/tmdb/'),
        ),
    ).toBe(true);
  });
  it('catálogo → detalhe → voltar preserva filtros da URL', async () => {
    openApp('/catalog/popular/1?q=Filme');
    fireEvent.click(
      await screen.findByRole('link', { name: /Filme de exemplo.*Nota/ }),
    );
    await screen.findByRole('heading', { level: 1, name: 'Filme de exemplo' });
    window.history.back();
    await waitFor(() => expect(window.location.search).toBe('?q=Filme'));
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Busca por “Filme”',
      }),
    ).toBeInTheDocument();
  });
  it('abre pessoa e filmografia sem repetir chamadas', async () => {
    openApp('/cast');
    fireEvent.click(
      await screen.findByRole('link', { name: /Pessoa de exemplo/ }),
    );
    await screen.findByRole('heading', { level: 1, name: 'Pessoa de exemplo' });
    expect(
      await screen.findByRole('link', { name: /Filme de exemplo.*Nota/ }),
    ).toHaveAttribute('href', '/movie-details/1');
    const count = vi.mocked(fetch).mock.calls.length;
    await act(async () => {
      await Promise.resolve();
    });
    expect(fetch).toHaveBeenCalledTimes(count);
  });
  it('404 não consulta API e permite voltar ao início', async () => {
    openApp('/nao-existe');
    expect(screen.getByRole('heading', { name: /404/ })).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('link', { name: 'Voltar ao início' }));
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Filme de exemplo',
      }),
    ).toBeInTheDocument();
  });
});
