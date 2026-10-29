import { IncomingMessage, ServerResponse } from 'node:http';
import { Socket } from 'node:net';
import { afterEach, describe, expect, it, vi } from 'vitest';
import tmdb from '../../api/tmdb.ts';
import config from '../../vercel.json';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('entrada Node e roteamento do proxy', () => {
  it('a função usa o segredo apenas no servidor e escreve JSON pelo adaptador Node', async () => {
    vi.stubEnv('TMDB_READ_ACCESS_TOKEN', 'fixture-only');
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ genres: [] }));
    vi.stubGlobal('fetch', fetcher);
    const socket = new Socket();
    const request = new IncomingMessage(socket);
    request.method = 'GET';
    request.url = '/api/tmdb?path=genre/movie/list';
    const response = new ServerResponse(request);
    const end = vi.spyOn(response, 'end').mockImplementation(() => response);
    await tmdb(request, response);
    expect(response.statusCode).toBe(200);
    expect(response.getHeader('content-type')).toBe(
      'application/json; charset=utf-8',
    );
    expect(end).toHaveBeenCalledWith(Buffer.from('{"genres":[]}'));
    expect(fetcher).toHaveBeenCalledTimes(1);
    socket.destroy();
  });

  it('a entrada Node preserva os bytes de uma imagem', async () => {
    vi.stubEnv('TMDB_READ_ACCESS_TOKEN', 'fixture-only');
    const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
    vi.stubGlobal(
      'fetch',
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(
          new Response(bytes, { headers: { 'Content-Type': 'image/jpeg' } }),
        ),
    );
    const socket = new Socket();
    const request = new IncomingMessage(socket);
    request.method = 'GET';
    request.url = '/api/tmdb?path=image/w500/cartaz.jpg';
    const response = new ServerResponse(request);
    const end = vi.spyOn(response, 'end').mockImplementation(() => response);
    await tmdb(request, response);
    expect(response.statusCode).toBe(200);
    expect(response.getHeader('content-type')).toBe('image/jpeg');
    expect(end).toHaveBeenCalledWith(Buffer.from(bytes));
    socket.destroy();
  });

  it('o fallback da SPA exclui /api e seus subcaminhos', () => {
    const fallback = config.rewrites.find(
      (rewrite) => rewrite.destination === '/index.html',
    );
    expect(fallback).toBeDefined();
    const pattern = new RegExp('^' + (fallback?.source ?? '') + '$');
    for (const path of [
      '/api',
      '/api/tmdb',
      '/api/tmdb/movie/popular',
      '/api/desconhecida',
    ])
      expect(pattern.test(path)).toBe(false);
    for (const path of [
      '/',
      '/catalog/popular/1',
      '/movie-details/1',
      '/endereco-inexistente',
    ])
      expect(pattern.test(path)).toBe(true);
    expect(config.rewrites[0]).toEqual({
      source: '/api/tmdb/:path*',
      destination: '/api/tmdb?path=:path*',
    });
  });
});
