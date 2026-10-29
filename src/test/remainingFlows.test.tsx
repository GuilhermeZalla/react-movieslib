import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../app/App';
import { fixtureFetch } from './fixtures/fetch';
import { searchControls } from './helpers/controls';

const pathOf = (input: RequestInfo | URL) =>
  new URL(
    input instanceof Request ? input.url : String(input),
    'http://localhost',
  );

const callsTo = (part: string) =>
  vi
    .mocked(fetch)
    .mock.calls.filter(([input]) => pathOf(input).pathname.includes(part));

function mockResponses(
  respond: (
    url: URL,
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => Promise<Response>,
) {
  vi.stubGlobal(
    'fetch',
    vi.fn((input: RequestInfo | URL, init?: RequestInit) =>
      respond(pathOf(input), input, init),
    ),
  );
}

function open(path: string) {
  window.history.replaceState(null, '', path);
  return render(<App />);
}

beforeEach(() => {
  mockResponses((_url, input) => fixtureFetch(input));
});
afterEach(() => {
  vi.useRealTimers();
});

describe('catálogo e busca de pessoas', () => {
  it('valida as seis páginas, preserva os cards e não refaz chamadas após re-render', async () => {
    const view = open('/cast');
    expect(
      await screen.findAllByRole('heading', { name: 'Pessoa de exemplo' }),
    ).toHaveLength(6);
    expect(
      screen.getAllByRole('img', { name: 'Pessoa de exemplo' })[0],
    ).toHaveAttribute('src', '/api/tmdb/image/w500/fixture.jpg');
    expect(callsTo('/person/popular')).toHaveLength(6);
    view.rerender(<App />);
    await act(async () => Promise.resolve());
    expect(callsTo('/person/popular')).toHaveLength(6);
  });

  it('mostra EmptyState sem retry quando todas as páginas estão vazias', async () => {
    mockResponses((url, input) =>
      url.pathname.endsWith('/person/popular')
        ? Promise.resolve(
            Response.json({
              page: 1,
              total_pages: 0,
              total_results: 0,
              results: [],
            }),
          )
        : fixtureFetch(input),
    );
    open('/cast');
    expect(
      await screen.findByRole('heading', { name: 'Nenhuma pessoa disponível' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Tentar novamente' }),
    ).not.toBeInTheDocument();
    expect(callsTo('/person/popular')).toHaveLength(6);
  });

  it('mostra falha real com retry e recupera os resultados', async () => {
    let fail = true;
    mockResponses((url, input) => {
      if (
        url.pathname.endsWith('/person/popular') &&
        url.searchParams.get('page') === '1' &&
        fail
      ) {
        fail = false;
        return Promise.resolve(new Response(null, { status: 502 }));
      }
      return fixtureFetch(input);
    });
    open('/cast');
    fireEvent.click(
      await screen.findByRole('button', { name: 'Tentar novamente' }),
    );
    expect(
      await screen.findAllByRole('heading', { name: 'Pessoa de exemplo' }),
    ).toHaveLength(6);
    expect(callsTo('/person/popular')).toHaveLength(7);
  });

  it('normaliza a busca, usa 300 ms e trata ausência de resultados sem retry', async () => {
    mockResponses((url, input) =>
      url.pathname.endsWith('/search/person')
        ? Promise.resolve(
            Response.json({
              page: 1,
              total_pages: 0,
              total_results: 0,
              results: [],
            }),
          )
        : fixtureFetch(input),
    );
    open('/cast');
    await screen.findAllByRole('heading', { name: 'Pessoa de exemplo' });
    const input = screen.getByRole('textbox', { name: 'Buscar pessoa' });
    expect(input).toHaveAttribute('maxlength', '200');
    fireEvent.change(input, { target: { value: '  Ninguém & + aqui  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar pessoa' }));
    expect(callsTo('/search/person')).toHaveLength(0);
    expect(
      await screen.findByRole('heading', { name: 'Nenhuma pessoa encontrada' }),
    ).toBeInTheDocument();
    expect(callsTo('/search/person')).toHaveLength(6);
    const firstSearch = callsTo('/search/person')[0];
    if (!firstSearch) throw new Error('Busca sem chamada ao proxy.');
    expect(pathOf(firstSearch[0]).searchParams.get('query')).toBe(
      'Ninguém & + aqui',
    );
    expect(
      screen.queryByRole('button', { name: 'Tentar novamente' }),
    ).not.toBeInTheDocument();
  });

  it('aborta a busca antiga ao trocar o termo e não refaz chamadas no re-render', async () => {
    const oldSignals: AbortSignal[] = [];
    mockResponses((url, input, init) => {
      if (
        url.pathname.endsWith('/search/person') &&
        url.searchParams.get('query') === 'primeiro'
      ) {
        if (init?.signal) oldSignals.push(init.signal);
        return new Promise<Response>(() => {});
      }
      return fixtureFetch(input);
    });
    const view = open('/cast');
    await screen.findAllByRole('heading', { name: 'Pessoa de exemplo' });
    const input = screen.getByRole('textbox', { name: 'Buscar pessoa' });
    const button = screen.getByRole('button', { name: 'Buscar pessoa' });
    fireEvent.change(input, { target: { value: 'primeiro' } });
    fireEvent.click(button);
    await waitFor(() => expect(callsTo('/search/person')).toHaveLength(6));
    fireEvent.change(input, { target: { value: 'segundo' } });
    fireEvent.click(button);
    await waitFor(() => expect(oldSignals).toHaveLength(6));
    await waitFor(() =>
      expect(oldSignals.every((signal) => signal.aborted)).toBe(true),
    );
    expect(
      await screen.findAllByRole('heading', { name: 'Pessoa de exemplo' }),
    ).toHaveLength(6);
    expect(callsTo('/search/person')).toHaveLength(12);
    view.rerender(<App />);
    await act(async () => Promise.resolve());
    expect(callsTo('/search/person')).toHaveLength(12);
  });

  it('permite retry de uma falha real na busca de pessoas', async () => {
    let fail = true;
    mockResponses((url, input) => {
      if (
        url.pathname.endsWith('/search/person') &&
        url.searchParams.get('page') === '1' &&
        fail
      ) {
        fail = false;
        return Promise.resolve(new Response(null, { status: 502 }));
      }
      return fixtureFetch(input);
    });
    open('/cast');
    await screen.findAllByRole('heading', { name: 'Pessoa de exemplo' });
    fireEvent.change(screen.getByRole('textbox', { name: 'Buscar pessoa' }), {
      target: { value: 'Pessoa' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar pessoa' }));
    fireEvent.click(
      await screen.findByRole('button', { name: 'Tentar novamente' }),
    );
    expect(
      await screen.findAllByRole('heading', { name: 'Pessoa de exemplo' }),
    ).toHaveLength(6);
    expect(callsTo('/search/person')).toHaveLength(7);
  });
});

describe('filtro por gênero', () => {
  it('mantém cinco páginas, filtra pelo ID e não refaz chamadas ao mudar o gênero', async () => {
    open('/genres/18/Drama');
    expect(await screen.findAllByRole('link', { name: 'View' })).toHaveLength(
      5,
    );
    expect(
      screen.getAllByRole('img', { name: 'Filme de exemplo' })[0],
    ).toHaveAttribute('src', '/api/tmdb/image/w500/fixture.jpg');
    expect(callsTo('/movie/popular')).toHaveLength(5);
    window.history.pushState(null, '', '/genres/99/Comédia');
    fireEvent.popState(window);
    expect(
      await screen.findByRole('heading', { name: 'Nenhum filme encontrado' }),
    ).toBeInTheDocument();
    expect(callsTo('/movie/popular')).toHaveLength(5);
  });

  it('não consulta a API com ID ou nome de gênero inválido', () => {
    open('/genres/abc/Drama');
    expect(
      screen.getByRole('heading', { name: '404 — Página não encontrada' }),
    ).toBeInTheDocument();
    expect(callsTo('/movie/popular')).toHaveLength(0);
  });

  it('mostra EmptyState sem retry quando o catálogo retorna vazio', async () => {
    mockResponses((url, input) =>
      url.pathname.endsWith('/movie/popular')
        ? Promise.resolve(
            Response.json({
              page: 1,
              total_pages: 0,
              total_results: 0,
              results: [],
            }),
          )
        : fixtureFetch(input),
    );
    open('/genres/18/Drama');
    expect(
      await screen.findByRole('heading', { name: 'Nenhum filme encontrado' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Tentar novamente' }),
    ).not.toBeInTheDocument();
    expect(callsTo('/movie/popular')).toHaveLength(5);
  });

  it('permite retry após erro real sem repetir as outras páginas', async () => {
    let fail = true;
    mockResponses((url, input) => {
      if (
        url.pathname.endsWith('/movie/popular') &&
        url.searchParams.get('page') === '1' &&
        fail
      ) {
        fail = false;
        return Promise.resolve(new Response(null, { status: 502 }));
      }
      return fixtureFetch(input);
    });
    open('/genres/18/Drama');
    fireEvent.click(
      await screen.findByRole('button', { name: 'Tentar novamente' }),
    );
    expect(await screen.findAllByRole('link', { name: 'View' })).toHaveLength(
      5,
    );
    expect(callsTo('/movie/popular')).toHaveLength(6);
  });

  it('cancela busca antiga no gênero ao trocar o termo', async () => {
    const oldSignals: AbortSignal[] = [];
    mockResponses((url, input, init) => {
      if (
        url.pathname.endsWith('/search/movie') &&
        url.searchParams.get('query') === 'primeiro'
      ) {
        if (init?.signal) oldSignals.push(init.signal);
        return new Promise<Response>(() => {});
      }
      return fixtureFetch(input);
    });
    const view = open('/genres/18/Drama');
    await screen.findAllByRole('link', { name: 'View' });
    const { input, submit } = searchControls();
    fireEvent.change(input, { target: { value: 'primeiro' } });
    fireEvent.click(submit);
    await waitFor(() => expect(callsTo('/search/movie')).toHaveLength(5));
    fireEvent.change(input, { target: { value: 'segundo' } });
    fireEvent.click(submit);
    await waitFor(() =>
      expect(oldSignals.every((signal) => signal.aborted)).toBe(true),
    );
    expect(await screen.findAllByRole('link', { name: 'View' })).toHaveLength(
      5,
    );
    expect(callsTo('/search/movie')).toHaveLength(10);
    view.rerender(<App />);
    await act(async () => Promise.resolve());
    expect(callsTo('/search/movie')).toHaveLength(10);
  });

  it('mostra EmptyState na busca do gênero sem oferecer retry', async () => {
    mockResponses((url, input) =>
      url.pathname.endsWith('/search/movie')
        ? Promise.resolve(
            Response.json({
              page: 1,
              total_pages: 0,
              total_results: 0,
              results: [],
            }),
          )
        : fixtureFetch(input),
    );
    open('/genres/18/Drama');
    await screen.findAllByRole('link', { name: 'View' });
    const { input, submit } = searchControls();
    fireEvent.change(input, { target: { value: 'Inexistente' } });
    fireEvent.click(submit);
    expect(
      await screen.findByRole('heading', { name: 'Nenhum filme encontrado' }),
    ).toBeInTheDocument();
    expect(callsTo('/search/movie')).toHaveLength(5);
    expect(
      screen.queryByRole('button', { name: 'Tentar novamente' }),
    ).not.toBeInTheDocument();
  });

  it('permite retry de uma falha real na busca do gênero', async () => {
    let fail = true;
    mockResponses((url, input) => {
      if (
        url.pathname.endsWith('/search/movie') &&
        url.searchParams.get('page') === '1' &&
        fail
      ) {
        fail = false;
        return Promise.resolve(new Response(null, { status: 502 }));
      }
      return fixtureFetch(input);
    });
    open('/genres/18/Drama');
    await screen.findAllByRole('link', { name: 'View' });
    const { input, submit } = searchControls();
    fireEvent.change(input, { target: { value: 'Filme' } });
    fireEvent.click(submit);
    fireEvent.click(
      await screen.findByRole('button', { name: 'Tentar novamente' }),
    );
    expect(await screen.findAllByRole('link', { name: 'View' })).toHaveLength(
      5,
    );
    expect(callsTo('/search/movie')).toHaveLength(6);
  });
});
