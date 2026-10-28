import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../app/App';
import { fixtureFetch } from './fixtures/fetch';
import { searchControls } from './helpers/controls';

describe('Fase 3: páginas distintas da busca de filmes', () => {
  const pages: string[] = [];

  // Setup/assertions outside it.fails prevent a rendering/fixture failure from
  // being mistaken for the known duplicate-page regression.
  beforeEach(async () => {
    pages.length = 0;
    window.history.replaceState(null, '', '/catalog/popular/1');
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const value = input instanceof Request ? input.url : String(input);
        const url = new URL(value, 'http://localhost');
        if (url.pathname === '/api/tmdb/search/movie') {
          expect(url.searchParams.get('query')).toBe('Sessão teste');
          const page = url.searchParams.get('page');
          if (!page) throw new Error('Página ausente na requisição de busca.');
          pages.push(page);
        }
        return fixtureFetch(input);
      }),
    );
    render(<App />);
    await screen.findByRole('link', { name: 'View' });
    const { input, submit } = searchControls();
    fireEvent.change(input, { target: { value: 'Sessão teste' } });
    fireEvent.click(submit);
    await screen.findByRole('heading', {
      name: 'Movies by the name Sessão teste',
    });
    await waitFor(() =>
      expect(screen.getAllByRole('link', { name: 'View' })).toHaveLength(5),
    );
    expect(pages).toHaveLength(5);
  });

  it('deve consultar páginas 1-5 uma vez cada', () => {
    expect(pages).toEqual(['1', '2', '3', '4', '5']);
  });
});
