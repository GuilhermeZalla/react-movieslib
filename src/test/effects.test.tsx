import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import MoviesCatalog from '../pages/movies/MoviesCatalog';
import CastDetails from '../pages/person-details/CastDetails';
import { controlledFetch } from './fixtures/controlledFetch';

function Scenario({ kind }: { kind: 'catalog' | 'person' }) {
  const [revision, setRevision] = useState(0);
  const navigate = useNavigate();
  return (
    <>
      <button type="button" onClick={() => setRevision((value) => value + 1)}>
        Atualizar contexto
      </button>
      <output aria-label="Revisão">{revision}</output>
      <button
        type="button"
        onClick={() =>
          navigate(kind === 'catalog' ? '/catalog/top_rated/2' : '/cast/3')
        }
      >
        Trocar contexto da rota
      </button>
      {kind === 'catalog' ? <MoviesCatalog /> : <CastDetails />}
    </>
  );
}

function catalogTree() {
  return (
    <MemoryRouter initialEntries={['/catalog/popular/1']}>
      <Routes>
        <Route
          path="/catalog/:category/:page"
          element={<Scenario kind="catalog" />}
        />
      </Routes>
    </MemoryRouter>
  );
}

function personTree() {
  return (
    <MemoryRouter initialEntries={['/cast/2']}>
      <Routes>
        <Route path="/cast/:id" element={<Scenario kind="person" />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('regressões dos efeitos de dados', () => {
  it('catálogo: não consulta novamente por resposta, rerender ou estado do pai', async () => {
    const api = controlledFetch((url) =>
      /^\/api\/tmdb\/movie\//.test(url.pathname),
    );
    vi.stubGlobal('fetch', vi.fn(api.fetch));
    const view = render(catalogTree());
    expect(api.requests).toHaveLength(1);

    await act(async () => {
      await api.respondNext();
    });
    await screen.findByRole('link', { name: 'View' });
    expect(api.requests).toHaveLength(1);
    expect(fetch).toHaveBeenCalledTimes(3); // catálogo + dois menus de gêneros

    view.rerender(catalogTree());
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar contexto' }));
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar contexto' }));
    expect(screen.getByLabelText('Revisão')).toHaveTextContent('2');
    expect(api.requests).toHaveLength(1);
    expect(fetch).toHaveBeenCalledTimes(3);

    fireEvent.click(screen.getByRole('link', { name: '2' }));
    expect(api.requests).toHaveLength(2);
    await act(async () => {
      await api.respondNext();
    });
    expect(api.requests.map((url) => url.searchParams.get('page'))).toEqual([
      '1',
      '2',
    ]);
    expect(api.requests).toHaveLength(2);

    fireEvent.click(
      screen.getByRole('button', { name: 'Trocar contexto da rota' }),
    );
    await act(async () => {
      await api.respondNext();
    });
    expect(api.requests.map((url) => url.pathname)).toEqual([
      '/api/tmdb/movie/popular',
      '/api/tmdb/movie/popular',
      '/api/tmdb/movie/top_rated',
    ]);
    expect(fetch).toHaveBeenCalledTimes(5);
  });

  it('pessoa: duas consultas por id, sem repetir por resposta, rerender ou estado do pai', async () => {
    const api = controlledFetch((url) =>
      /^\/api\/tmdb\/person\/\d+/.test(url.pathname),
    );
    vi.stubGlobal('fetch', vi.fn(api.fetch));
    const view = render(personTree());
    expect(api.requests).toHaveLength(2);

    await act(async () => {
      await api.respondNext();
    });
    await act(async () => {
      await api.respondNext();
    });
    await screen.findByRole('heading', { level: 1, name: 'Pessoa de exemplo' });
    await screen.findByRole('link', { name: 'View' });
    expect(api.requests).toHaveLength(2);
    expect(fetch).toHaveBeenCalledTimes(4); // detalhe/créditos + dois menus

    view.rerender(personTree());
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar contexto' }));
    expect(screen.getByLabelText('Revisão')).toHaveTextContent('1');
    expect(api.requests).toHaveLength(2);
    expect(fetch).toHaveBeenCalledTimes(4);

    fireEvent.click(
      screen.getByRole('button', { name: 'Trocar contexto da rota' }),
    );
    expect(api.requests).toHaveLength(4);
    await act(async () => {
      await api.respondNext();
    });
    await act(async () => {
      await api.respondNext();
    });
    expect(api.requests.map((url) => url.pathname)).toEqual([
      '/api/tmdb/person/2',
      '/api/tmdb/person/2/movie_credits',
      '/api/tmdb/person/3',
      '/api/tmdb/person/3/movie_credits',
    ]);
    expect(fetch).toHaveBeenCalledTimes(6);
  });
});
