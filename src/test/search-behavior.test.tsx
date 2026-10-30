import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openApp, pathOf } from './helpers/app';
import { fixtureFetch } from './fixtures/fetch';
import { searchControls } from './helpers/controls';
beforeEach(() => vi.stubGlobal('fetch', vi.fn(fixtureFetch)));
const searchCalls = () =>
  vi
    .mocked(fetch)
    .mock.calls.filter(
      ([input]) => pathOf(input).pathname === '/api/tmdb/search/movie',
    );
describe('busca com URL e cancelamento', () => {
  it('aguarda 300 ms e só consulta a última digitação normalizada', async () => {
    openApp('/catalog/popular/1');
    await screen.findByRole('link', { name: /Filme de exemplo.*Nota/ });
    const { input } = searchControls();
    fireEvent.change(input, { target: { value: 'primeiro' } });
    fireEvent.change(input, { target: { value: '  última   sessão  ' } });
    expect(searchCalls()).toHaveLength(0);
    await waitFor(() => expect(searchCalls()).toHaveLength(1));
    expect(pathOf(searchCalls()[0]?.[0] ?? '').searchParams.get('query')).toBe(
      'última sessão',
    );
  });
  it('não chama busca para vazio ou só espaços', async () => {
    openApp('/catalog/popular/1');
    await screen.findByRole('link', { name: /Filme de exemplo.*Nota/ });
    fireEvent.change(searchControls().input, { target: { value: '   ' } });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });
    expect(searchCalls()).toHaveLength(0);
  });
  it('limita o termo a 200 caracteres', async () => {
    openApp('/catalog/popular/1');
    await screen.findByRole('link', { name: /Filme de exemplo.*Nota/ });
    fireEvent.change(searchControls().input, {
      target: { value: 'x'.repeat(250) },
    });
    await waitFor(() => expect(searchCalls()).toHaveLength(1));
    expect(
      pathOf(searchCalls()[0]?.[0] ?? '').searchParams.get('query'),
    ).toHaveLength(200);
  });
  it('aborta requisição antiga quando a entrada muda', async () => {
    let oldSignal: AbortSignal | null = null;
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
        const url = pathOf(input);
        if (url.searchParams.get('query') === 'primeiro') {
          oldSignal = init?.signal ?? null;
          return new Promise<Response>(() => {});
        }
        return fixtureFetch(input);
      }),
    );
    openApp('/catalog/popular/1');
    await screen.findByRole('link', { name: /Filme de exemplo.*Nota/ });
    fireEvent.change(searchControls().input, { target: { value: 'primeiro' } });
    await waitFor(() => expect(oldSignal).not.toBeNull());
    fireEvent.change(searchControls().input, { target: { value: 'segundo' } });
    await waitFor(() => expect(oldSignal?.aborted).toBe(true));
    expect(
      await screen.findByRole('heading', { name: 'Busca por “segundo”' }),
    ).toBeInTheDocument();
  });
  it('página inválida usa padrão seguro antes da chamada', async () => {
    openApp('/catalog/popular/abc');
    await screen.findByRole('link', { name: /Filme de exemplo.*Nota/ });
    const call = vi
      .mocked(fetch)
      .mock.calls.find(
        ([input]) => pathOf(input).pathname === '/api/tmdb/movie/popular',
      );
    expect(pathOf(call?.[0] ?? '').searchParams.get('page')).toBe('1');
  });
});
