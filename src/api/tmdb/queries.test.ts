import { QueryObserver } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createQueryClient, QUERY_STALE_TIME } from '../../app/queryClient';
import { fixtureFetch } from '../../test/fixtures/fetch';
import { TmdbError } from './client';
import {
  genresQuery,
  movieCreditsQuery,
  movieListQuery,
  movieQuery,
  movieSearchQuery,
  peopleQuery,
  personCreditsQuery,
  personQuery,
  personSearchQuery,
  trendingQuery,
} from './queries';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('consultas TMDB', () => {
  it('separa categoria, tipo, ID, página e termo nas chaves de cache', () => {
    const keys = [
      movieListQuery('popular', 1),
      movieListQuery('popular', 2),
      movieListQuery('top_rated', 1),
      trendingQuery(1),
      peopleQuery(1),
      movieSearchQuery('Filme', 1),
      movieSearchQuery('Filme', 2),
      personSearchQuery('Filme', 1),
      genresQuery(),
      movieQuery(1),
      movieQuery(2),
      movieCreditsQuery(1),
      personQuery(1),
      personCreditsQuery(1),
    ].map(({ queryKey }) => JSON.stringify(queryKey));
    expect(new Set(keys).size).toBe(keys.length);
    expect(movieSearchQuery('  Filme  ').queryKey).toEqual(
      movieSearchQuery('Filme').queryKey,
    );
    expect(movieListQuery('popular', '1').queryKey).toEqual(
      movieListQuery('popular', 1).queryKey,
    );
  });

  it('mantém dados em memória por 60 s e nunca usa localStorage', async () => {
    vi.useFakeTimers();
    const storageWrite = vi.spyOn(Storage.prototype, 'setItem');
    const storageRead = vi.spyOn(Storage.prototype, 'getItem');
    const fetcher = vi.fn(fixtureFetch);
    vi.stubGlobal('fetch', fetcher);
    const client = createQueryClient();
    try {
      expect(client.getDefaultOptions().queries?.staleTime).toBe(60_000);
      expect(QUERY_STALE_TIME).toBe(60_000);
      const query = movieListQuery('popular', 1);
      await client.query(query);
      await vi.advanceTimersByTimeAsync(59_999);
      await client.query(query);
      expect(fetcher).toHaveBeenCalledTimes(1);
      await vi.advanceTimersByTimeAsync(1);
      await client.query(query);
      expect(fetcher).toHaveBeenCalledTimes(2);
      expect(client.getQueryData(query.queryKey)).toBeDefined();
      expect(storageWrite).not.toHaveBeenCalled();
      expect(storageRead).not.toHaveBeenCalled();
      expect(createQueryClient().getQueryData(query.queryKey)).toBeUndefined();
    } finally {
      client.clear();
    }
  });

  it('repete falha de rede uma vez e respeita o relógio de retry', async () => {
    vi.useFakeTimers();
    const fetcher = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError('offline'))
      .mockImplementation(fixtureFetch);
    vi.stubGlobal('fetch', fetcher);
    const client = createQueryClient();
    try {
      const pending = client.query(movieListQuery('popular'));
      await vi.advanceTimersByTimeAsync(999);
      expect(fetcher).toHaveBeenCalledTimes(1);
      await vi.advanceTimersByTimeAsync(1);
      await expect(pending).resolves.toHaveProperty('page', 1);
      expect(fetcher).toHaveBeenCalledTimes(2);
    } finally {
      client.clear();
    }
  });

  it('limita falha de rede persistente a duas tentativas', async () => {
    vi.useFakeTimers();
    const fetcher = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new TypeError('offline'));
    vi.stubGlobal('fetch', fetcher);
    const client = createQueryClient();
    try {
      const assertion = expect(
        client.query(movieListQuery('popular')),
      ).rejects.toMatchObject({ kind: 'network' });
      await vi.advanceTimersByTimeAsync(1_000);
      await assertion;
      expect(fetcher).toHaveBeenCalledTimes(2);
    } finally {
      client.clear();
    }
  });

  it.each([400, 404, 429])('não repete resposta HTTP %s', async (status) => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status }));
    vi.stubGlobal('fetch', fetcher);
    const client = createQueryClient();
    try {
      await expect(
        client.query(movieListQuery('popular')),
      ).rejects.toBeInstanceOf(TmdbError);
      expect(fetcher).toHaveBeenCalledTimes(1);
    } finally {
      client.clear();
    }
  });

  it('interrompe a busca anterior quando a consulta muda de termo', async () => {
    let oldSignal: AbortSignal | undefined;
    const fetcher = vi.fn<typeof fetch>().mockImplementation((input, init) => {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      if (url.includes('query=primeiro')) {
        oldSignal = init?.signal ?? undefined;
        return new Promise<Response>(() => {});
      }
      return fixtureFetch(input);
    });
    vi.stubGlobal('fetch', fetcher);
    const client = createQueryClient();
    const oldQuery = movieSearchQuery('primeiro');
    const newQuery = movieSearchQuery('segundo');
    const observer = new QueryObserver(client, oldQuery);
    const unsubscribe = observer.subscribe(() => {});
    try {
      expect(fetcher).toHaveBeenCalledTimes(1);
      observer.setOptions(newQuery);
      expect(oldSignal?.aborted).toBe(true);
      await vi.waitFor(() => {
        expect(observer.getCurrentResult().data?.results).toHaveLength(1);
      });
      expect(fetcher).toHaveBeenCalledTimes(2);
      expect(client.getQueryData(oldQuery.queryKey)).toBeUndefined();
      expect(client.getQueryData(newQuery.queryKey)).toBeDefined();
    } finally {
      unsubscribe();
      client.clear();
    }
  });

  it('busca vazia permanece desativada e não chama o proxy', () => {
    const fetcher = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetcher);
    const client = createQueryClient();
    const observer = new QueryObserver(client, movieSearchQuery('   '));
    const unsubscribe = observer.subscribe(() => {});
    expect(fetcher).not.toHaveBeenCalled();
    unsubscribe();
    client.clear();
  });
});
