import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import App from '../app/App';
import { fixtureFetch } from './fixtures/fetch';
import { pathOf } from './helpers/app';
function Scenario() {
  const [revision, setRevision] = useState(0);
  return (
    <>
      <button type="button" onClick={() => setRevision((value) => value + 1)}>
        Atualizar contexto
      </button>
      <output aria-label="Revisão">{revision}</output>
      <App />
    </>
  );
}
describe('regressões das chamadas contínuas', () => {
  it('catálogo: resposta, rerender e estado do pai não repetem chamadas; página nova consulta uma vez', async () => {
    window.history.replaceState(null, '', '/catalog/popular/1');
    vi.stubGlobal('fetch', vi.fn(fixtureFetch));
    const view = render(<Scenario />);
    await screen.findByRole('link', { name: /Filme de exemplo.*Nota/ });
    expect(fetch).toHaveBeenCalledTimes(2);
    view.rerender(<Scenario />);
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar contexto' }));
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar contexto' }));
    await act(async () => {
      await Promise.resolve();
    });
    expect(fetch).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole('link', { name: 'Página 2' }));
    await screen.findByRole('link', { name: /Filme de exemplo.*Nota/ });
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(
      vi
        .mocked(fetch)
        .mock.calls.filter(
          ([input]) => pathOf(input).pathname === '/api/tmdb/movie/popular',
        )
        .map(([input]) => pathOf(input).searchParams.get('page')),
    ).toEqual(['1', '2']);
  });
  it('pessoa: duas chamadas por ID; resposta, rerender e contexto não geram loops', async () => {
    window.history.replaceState(null, '', '/cast/2');
    vi.stubGlobal('fetch', vi.fn(fixtureFetch));
    const view = render(<Scenario />);
    await screen.findByRole('heading', { level: 1, name: 'Pessoa de exemplo' });
    await screen.findByRole('link', { name: /Filme de exemplo.*Nota/ });
    expect(fetch).toHaveBeenCalledTimes(2);
    view.rerender(<Scenario />);
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar contexto' }));
    await act(async () => {
      await Promise.resolve();
    });
    expect(fetch).toHaveBeenCalledTimes(2);
    window.history.pushState(null, '', '/cast/3');
    fireEvent.popState(window);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(4));
    expect(
      vi.mocked(fetch).mock.calls.map(([input]) => pathOf(input).pathname),
    ).toEqual([
      '/api/tmdb/person/2',
      '/api/tmdb/person/2/movie_credits',
      '/api/tmdb/person/3',
      '/api/tmdb/person/3/movie_credits',
    ]);
  });
});
