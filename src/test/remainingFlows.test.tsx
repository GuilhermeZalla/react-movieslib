import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../app/App';
import { fixtureFetch } from './fixtures/fetch';
import { openApp, pathOf, json } from './helpers/app';
import { searchControls } from './helpers/controls';
const flows = [
  {
    name: 'pessoas',
    route: '/cast',
    browse: '/api/tmdb/person/popular',
    search: '/api/tmdb/search/person',
    empty: 'Nenhuma pessoa disponível',
    searchEmpty: 'Nenhuma pessoa encontrada',
    item: /Pessoa de exemplo/,
  },
  {
    name: 'gênero',
    route: '/genres/18/Drama',
    browse: '/api/tmdb/discover/movie',
    search: '/api/tmdb/search/movie',
    empty: 'Nenhum filme encontrado',
    searchEmpty: 'Nenhum filme encontrado',
    item: /Filme de exemplo.*Nota/,
  },
] as const;
beforeEach(() => vi.stubGlobal('fetch', vi.fn(fixtureFetch)));
for (const flow of flows)
  describe(flow.name, () => {
    it('consulta uma página e não repete após rerender', async () => {
      const view = openApp(flow.route);
      await screen.findByRole('link', { name: flow.item });
      const calls = () =>
        vi
          .mocked(fetch)
          .mock.calls.filter(
            ([input]) => pathOf(input).pathname === flow.browse,
          );
      expect(calls()).toHaveLength(1);
      view.rerender(<App />);
      await act(async () => {
        await Promise.resolve();
      });
      expect(calls()).toHaveLength(1);
    });
    it('resultado vazio não oferece retry', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn((input: RequestInfo | URL) =>
          pathOf(input).pathname === flow.browse
            ? Promise.resolve(
                json({
                  page: 1,
                  total_pages: 0,
                  total_results: 0,
                  results: [],
                }),
              )
            : fixtureFetch(input),
        ),
      );
      openApp(flow.route);
      await screen.findByRole('heading', { name: flow.empty });
      expect(
        screen.queryByRole('button', { name: 'Tentar novamente' }),
      ).not.toBeInTheDocument();
    });
    it('recupera falha real com apenas uma chamada adicional', async () => {
      let failing = true;
      vi.stubGlobal(
        'fetch',
        vi.fn((input: RequestInfo | URL) =>
          pathOf(input).pathname === flow.browse && failing
            ? Promise.resolve(json({}, 502))
            : fixtureFetch(input),
        ),
      );
      openApp(flow.route);
      const retry = await screen.findByRole('button', {
        name: 'Tentar novamente',
      });
      const before = vi.mocked(fetch).mock.calls.length;
      failing = false;
      fireEvent.click(retry);
      await screen.findByRole('link', { name: flow.item });
      expect(fetch).toHaveBeenCalledTimes(before + 1);
    });
    it('normaliza busca e mostra vazio sem retry', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn((input: RequestInfo | URL) =>
          pathOf(input).pathname === flow.search
            ? Promise.resolve(
                json({
                  page: 1,
                  total_pages: 0,
                  total_results: 0,
                  results: [],
                }),
              )
            : fixtureFetch(input),
        ),
      );
      openApp(flow.route);
      await screen.findByRole('link', { name: flow.item });
      fireEvent.change(searchControls().input, {
        target: { value: '  Ninguém   aqui ' },
      });
      await screen.findByRole('heading', { name: flow.searchEmpty });
      const call = vi
        .mocked(fetch)
        .mock.calls.find(([input]) => pathOf(input).pathname === flow.search);
      expect(pathOf(call?.[0] ?? '').searchParams.get('query')).toBe(
        'Ninguém aqui',
      );
      expect(
        screen.queryByRole('button', { name: 'Tentar novamente' }),
      ).not.toBeInTheDocument();
    });
    it('aborta busca antiga e não repete no rerender', async () => {
      let oldSignal: AbortSignal | null = null;
      vi.stubGlobal(
        'fetch',
        vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
          if (
            pathOf(input).pathname === flow.search &&
            pathOf(input).searchParams.get('query') === 'primeiro'
          ) {
            oldSignal = init?.signal ?? null;
            return new Promise<Response>(() => {});
          }
          return fixtureFetch(input);
        }),
      );
      const view = openApp(flow.route);
      await screen.findByRole('link', { name: flow.item });
      fireEvent.change(searchControls().input, {
        target: { value: 'primeiro' },
      });
      await waitFor(() => expect(oldSignal).not.toBeNull());
      fireEvent.change(searchControls().input, {
        target: { value: 'segundo' },
      });
      await waitFor(() => expect(oldSignal?.aborted).toBe(true));
      await screen.findByRole('link', { name: flow.item });
      const count = vi.mocked(fetch).mock.calls.length;
      view.rerender(<App />);
      await act(async () => {
        await Promise.resolve();
      });
      expect(fetch).toHaveBeenCalledTimes(count);
    });
  });
it('ID inválido de gênero não inicia chamadas', () => {
  openApp('/genres/../Drama');
  expect(screen.getByRole('heading', { name: /404/ })).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});
