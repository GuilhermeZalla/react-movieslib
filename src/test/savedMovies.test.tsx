import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openApp } from './helpers/app';
import { fixtureFetch } from './fixtures/fetch';
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('fetch', vi.fn(fixtureFetch));
});
describe('Minha lista guarda somente IDs', () => {
  it('volta à página disponível ao remover o último item da segunda página', async () => {
    localStorage.setItem(
      'movieslib:saved-ids',
      JSON.stringify(Array.from({ length: 13 }, (_, index) => index + 1)),
    );
    openApp('/minha-lista?page=2');
    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Retirar Filme de exemplo na minha lista',
      }),
    );
    await waitFor(() =>
      expect(
        screen.getAllByRole('button', {
          name: 'Retirar Filme de exemplo na minha lista',
        }),
      ).toHaveLength(12),
    );
    expect(screen.getByRole('link', { name: 'Página 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(
      JSON.parse(localStorage.getItem('movieslib:saved-ids') ?? '[]'),
    ).toEqual(Array.from({ length: 12 }, (_, index) => index + 1));
  });
  it('guarda, reabre e remove um filme sem persistir metadados', async () => {
    const first = openApp('/catalog/popular/1');
    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Guardar Filme de exemplo na minha lista',
      }),
    );
    expect(localStorage.getItem('movieslib:saved-ids')).toBe('[1]');
    expect(localStorage.getItem('movieslib:saved-ids')).not.toMatch(
      /title|poster|Filme/,
    );
    first.unmount();
    openApp('/minha-lista');
    const remove = await screen.findByRole('button', {
      name: 'Retirar Filme de exemplo na minha lista',
    });
    expect(remove).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(remove);
    expect(
      screen.getByRole('heading', { name: 'Nenhum ingresso guardado' }),
    ).toBeInTheDocument();
    expect(localStorage.getItem('movieslib:saved-ids')).toBe('[]');
  });
  it.each(['{broken', '{"id":1}', '["1"]', '[0,-1]', '[1.5]', '[null]'])(
    'recupera leitura inválida sem quebrar: %s',
    (value) => {
      localStorage.setItem('movieslib:saved-ids', value);
      openApp('/minha-lista');
      expect(
        screen.getByRole('heading', { name: 'Nenhum ingresso guardado' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent(/lista/);
      expect(fetch).not.toHaveBeenCalled();
    },
  );
  it('deduplica IDs ao ler e carrega apenas 12 filmes por página', async () => {
    localStorage.setItem(
      'movieslib:saved-ids',
      JSON.stringify([
        1,
        1,
        ...Array.from({ length: 20 }, (_, index) => index + 2),
      ]),
    );
    openApp('/minha-lista');
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(12));
    expect(screen.getByRole('link', { name: 'Página 2' })).toHaveAttribute(
      'href',
      '/minha-lista?page=2',
    );
  });
  it('continua acessível quando armazenamento é bloqueado', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    openApp('/catalog/popular/1');
    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Guardar Filme de exemplo na minha lista',
      }),
    );
    expect(screen.getByText(/O navegador bloqueou/)).toHaveAttribute(
      'role',
      'status',
    );
  });
  it('sincroniza remoção feita em outra aba', async () => {
    localStorage.setItem('movieslib:saved-ids', '[1]');
    openApp('/minha-lista');
    await screen.findByRole('button', {
      name: 'Retirar Filme de exemplo na minha lista',
    });
    localStorage.setItem('movieslib:saved-ids', '[]');
    fireEvent(
      window,
      new StorageEvent('storage', { key: 'movieslib:saved-ids' }),
    );
    expect(
      screen.getByRole('heading', { name: 'Nenhum ingresso guardado' }),
    ).toBeInTheDocument();
  });
});
