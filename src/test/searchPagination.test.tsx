import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { openApp, pathOf } from './helpers/app';
import { fixtureFetch } from './fixtures/fetch';
it('a busca consulta 1,2,3,4,5 ao avançar, sem repetir a página 3', async () => {
  const pages: string[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn((input: RequestInfo | URL) => {
      const url = pathOf(input);
      if (url.pathname === '/api/tmdb/search/movie')
        pages.push(url.searchParams.get('page') ?? '');
      return fixtureFetch(input);
    }),
  );
  openApp('/catalog/popular/1?q=Filme');
  await screen.findByRole('link', { name: /Filme de exemplo.*Nota/ });
  for (let page = 2; page <= 5; page++) {
    fireEvent.click(screen.getByRole('link', { name: `Página ${page}` }));
    await waitFor(() => expect(pages.at(-1)).toBe(String(page)));
    await screen.findByRole('link', { name: /Filme de exemplo.*Nota/ });
  }
  expect(pages).toEqual(['1', '2', '3', '4', '5']);
});
