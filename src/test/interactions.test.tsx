import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fixtureFetch } from './fixtures/fetch';
import { openApp, pathOf } from './helpers/app';
import { searchControls } from './helpers/controls';
beforeEach(() => vi.stubGlobal('fetch', vi.fn(fixtureFetch)));
describe('controles acessíveis do catálogo', () => {
  it('mantém campo e botões nomeados, com limpeza funcional', async () => {
    openApp('/catalog/popular/1');
    await screen.findByRole('link', { name: /Filme de exemplo.*Nota/ });
    fireEvent.change(searchControls().input, { target: { value: 'Noite' } });
    await screen.findByRole('heading', { name: 'Busca por “Noite”' });
    fireEvent.click(searchControls().clear);
    await screen.findByRole('heading', { name: 'Filmes populares' });
    expect(searchControls().input).toHaveValue('');
    expect(window.location.search).not.toContain('q=');
  });
  it('não busca de novo ao enviar campo vazio', async () => {
    openApp('/catalog/popular/1');
    await screen.findByRole('link', { name: /Filme de exemplo.*Nota/ });
    const count = vi.mocked(fetch).mock.calls.length;
    fireEvent.click(searchControls().submit);
    await act(async () => {
      await Promise.resolve();
    });
    expect(fetch).toHaveBeenCalledTimes(count);
  });
  it('envia filtros validados ao discover e guarda seleção na URL', async () => {
    openApp('/catalog/popular/1');
    await screen.findByRole('link', { name: /Filme de exemplo.*Nota/ });
    fireEvent.change(screen.getByRole('combobox', { name: 'Gênero' }), {
      target: { value: '18' },
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Ano' }), {
      target: { value: '2026' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: 'Nota mínima' }), {
      target: { value: '7' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: 'Ordenar' }), {
      target: { value: 'vote_average.desc' },
    });
    await waitFor(() =>
      expect(
        vi.mocked(fetch).mock.calls.some(([input]) => {
          const url = pathOf(input);
          return (
            url.pathname === '/api/tmdb/discover/movie' &&
            url.searchParams.get('primary_release_year') === '2026' &&
            url.searchParams.get('with_genres') === '18' &&
            url.searchParams.get('vote_average.gte') === '7' &&
            url.searchParams.get('sort_by') === 'vote_average.desc'
          );
        }),
      ).toBe(true),
    );
    expect(window.location.search).toContain('year=2026');
  });
  it('a página de gênero permite trocar por link e mantém o ID no cliente', async () => {
    openApp('/genres/18/Drama');
    await screen.findByRole('link', { name: /Filme de exemplo.*Nota/ });
    expect(screen.getByRole('combobox', { name: 'Gênero' })).toBeDisabled();
    expect(screen.getByRole('link', { name: 'Drama' })).toHaveAttribute(
      'href',
      '/genres/18/Drama',
    );
  });
});
