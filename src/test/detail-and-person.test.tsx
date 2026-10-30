import { fireEvent, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fixtureFetch } from './fixtures/fetch';
import fixture from './fixtures/tmdb.json';
import { openApp, pathOf, json } from './helpers/app';
beforeEach(() => vi.stubGlobal('fetch', vi.fn(fixtureFetch)));
describe('fichas completas com falhas independentes', () => {
  it.each([
    '/movie-details/abc',
    '/cast/abc',
    '/movie-details/0',
    '/genres/abc/Drama',
  ])('ID inválido em %s não chama API', (path) => {
    openApp(path);
    expect(screen.getByRole('heading', { name: /404/ })).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each(['/movie-details/1', '/cast/2'])(
    '404 do provedor em %s vira página não encontrada',
    async (path) => {
      vi.stubGlobal(
        'fetch',
        vi.fn(() => Promise.resolve(json({}, 404))),
      );
      openApp(path);
      expect(
        await screen.findByRole('heading', { name: /404/ }),
      ).toBeInTheDocument();
    },
  );
  it('falha dos créditos não apaga o filme e permite recuperar elenco', async () => {
    let failing = true;
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) =>
        pathOf(input).pathname === '/api/tmdb/movie/1/credits' && failing
          ? Promise.resolve(json({}, 502))
          : fixtureFetch(input),
      ),
    );
    openApp('/movie-details/1');
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Filme de exemplo',
      }),
    ).toBeInTheDocument();
    const section = within(screen.getByRole('region', { name: 'Elenco' }));
    const retry = await section.findByRole('button', {
      name: 'Tentar novamente',
    });
    failing = false;
    fireEvent.click(retry);
    expect(
      await section.findByRole('link', { name: /Pessoa de exemplo/ }),
    ).toBeInTheDocument();
  });
  it('sem filmografia usa vazio sem retry', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) =>
        pathOf(input).pathname.endsWith('/movie_credits')
          ? Promise.resolve(json({ cast: [], crew: [] }))
          : fixtureFetch(input),
      ),
    );
    openApp('/cast/2');
    expect(
      await screen.findByRole('heading', {
        name: 'Nenhuma filmografia encontrada',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Tentar novamente' }),
    ).not.toBeInTheDocument();
  });
  it('inclui equipe, imagens e recomendações reais do contrato', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) =>
        pathOf(input).pathname.endsWith('/credits')
          ? Promise.resolve(
              json({
                cast: fixture.movie.credits.cast,
                crew: [
                  {
                    id: 3,
                    name: 'Diretora de exemplo',
                    profile_path: null,
                    credit_id: 'one',
                    job: 'Director',
                    department: 'Directing',
                  },
                ],
              }),
            )
          : fixtureFetch(input),
      ),
    );
    openApp('/movie-details/1');
    expect(
      await screen.findByRole('link', { name: 'Diretora de exemplo' }),
    ).toHaveAttribute('href', '/cast/3');
    expect(
      await screen.findByRole('img', { name: 'Cena 1 de Filme de exemplo' }),
    ).toHaveAttribute('src', '/api/tmdb/image/w500/fixture.jpg');
    expect(
      await screen.findByRole('link', { name: /Outra sessão.*Nota/ }),
    ).toHaveAttribute('href', '/movie-details/3');
  });
  it('trailer só cria iframe nocookie após clique, sem autoplay, e fecha com Escape', async () => {
    openApp('/movie-details/1');
    const open = await screen.findByRole('button', { name: 'Abrir trailer' });
    expect(document.querySelector('iframe')).toBeNull();
    fireEvent.click(open);
    const player = screen.getByTitle('Trailer de Filme de exemplo');
    expect(player).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/abcdefghijk?autoplay=0&rel=0',
    );
    expect(player).toHaveAttribute('referrerpolicy', 'no-referrer');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.querySelector('iframe')).toBeNull();
  });
  it.each([
    'javascript:alert(1)',
    '../attack',
    'https://evil.test/video',
    'abcdefghijk?x=1',
    'short',
  ])('não incorpora chave de vídeo inválida: %s', async (key) => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) =>
        pathOf(input).pathname.endsWith('/videos')
          ? Promise.resolve(
              json({
                id: 1,
                results: [
                  {
                    id: 'fixture',
                    key,
                    name: 'Vídeo',
                    site: 'YouTube',
                    type: 'Trailer',
                    official: true,
                  },
                ],
              }),
            )
          : fixtureFetch(input),
      ),
    );
    openApp('/movie-details/1');
    expect(
      await screen.findByRole('heading', { name: 'Trailer indisponível' }),
    ).toBeInTheDocument();
    expect(document.querySelector('iframe')).toBeNull();
  });
  it('não incorpora vídeos de outro provedor', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) =>
        pathOf(input).pathname.endsWith('/videos')
          ? Promise.resolve(
              json({
                id: 1,
                results: [
                  {
                    id: 'fixture',
                    key: 'abcdefghijk',
                    name: 'Vídeo',
                    site: 'Vimeo',
                    type: 'Trailer',
                    official: true,
                  },
                ],
              }),
            )
          : fixtureFetch(input),
      ),
    );
    openApp('/movie-details/1');
    expect(
      await screen.findByRole('heading', { name: 'Trailer indisponível' }),
    ).toBeInTheDocument();
  });
});
