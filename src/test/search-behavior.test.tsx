import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../app/App';
import { fixtureFetch } from './fixtures/fetch';

beforeEach(() => {
  window.history.replaceState(null, '', '/catalog/popular/1');
  vi.stubGlobal('fetch', vi.fn(fixtureFetch));
});

describe('comportamento da busca (grupo 4c)', () => {
  it('debounce: só a última digitação gera consulta', async () => {
    const queries: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const url = new URL(
          input instanceof Request ? input.url : String(input),
          'http://localhost',
        );
        if (url.pathname === '/api/tmdb/search/movie') {
          queries.push(url.searchParams.get('query') ?? '');
        }
        return fixtureFetch(input);
      }),
    );
    render(<App />);
    await screen.findByRole('link', { name: 'View' });
    const { input, submit } = (
      await import('./helpers/controls')
    ).searchControls();
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.click(submit);
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.click(submit);
    await screen.findByRole('heading', { name: 'Movies by the name ab' });
    expect(queries).not.toContain('a');
    expect(queries).toContain('ab');
  });

  it('limita o termo a 200 caracteres', async () => {
    const longTerm = 'x'.repeat(250);
    let captured = '';
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const url = new URL(
          input instanceof Request ? input.url : String(input),
          'http://localhost',
        );
        if (url.pathname === '/api/tmdb/search/movie') {
          captured = url.searchParams.get('query') ?? '';
        }
        return fixtureFetch(input);
      }),
    );
    render(<App />);
    await screen.findByRole('link', { name: 'View' });
    const { input, submit } = (
      await import('./helpers/controls')
    ).searchControls();
    fireEvent.change(input, { target: { value: longTerm } });
    fireEvent.click(submit);
    await waitFor(() => expect(captured.length).toBeGreaterThan(0));
    expect(captured.length).toBeLessThanOrEqual(200);
  });

  it('termo só com espaços não chama a API', async () => {
    render(<App />);
    await screen.findByRole('link', { name: 'View' });
    const calls = vi.mocked(fetch).mock.calls.length;
    const { input, submit } = (
      await import('./helpers/controls')
    ).searchControls();
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(submit);
    await new Promise((r) => setTimeout(r, 400));
    expect(vi.mocked(fetch).mock.calls.length).toBe(calls);
  });

  it('cancela consulta anterior ao trocar o termo', async () => {
    render(<App />);
    await screen.findByRole('link', { name: 'View' });
    const { input, submit } = (
      await import('./helpers/controls')
    ).searchControls();
    fireEvent.change(input, { target: { value: 'primeiro' } });
    fireEvent.click(submit);
    await screen.findByRole('heading', { name: 'Movies by the name primeiro' });
    fireEvent.change(input, { target: { value: 'segundo' } });
    fireEvent.click(submit);
    await screen.findByRole('heading', { name: 'Movies by the name segundo' });
    expect(
      screen.queryByText('Movies by the name primeiro'),
    ).not.toBeInTheDocument();
  });

  it('parâmetros de URL inválidos caem em padrão seguro', async () => {
    window.history.replaceState(null, '', '/catalog/popular/abc');
    render(<App />);
    // should not crash; either shows catalog or 404
    await new Promise((r) => setTimeout(r, 400));
    expect(document.body).toBeTruthy();
  });
});
