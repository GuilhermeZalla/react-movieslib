import { QueryObserver } from '@tanstack/react-query';
import { afterEach, expect, it, vi } from 'vitest';
import { createQueryClient } from '../../app/queryClient';
import { setLocale } from '../../i18n/locale';
import {
  genresQuery,
  movieListQuery,
  movieSearchQuery,
  personQuery,
  peopleQuery,
} from './queries';
import { getGenres } from './client';
function requestUrl(input: RequestInfo | URL) {
  return new URL(
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.href
        : input.url,
    'http://localhost',
  );
}
afterEach(() => setLocale('pt-BR', false));
it('isola idioma em listas, buscas, gêneros e detalhes sem persistir respostas', async () => {
  const write = vi.spyOn(Storage.prototype, 'setItem');
  const read = vi.spyOn(Storage.prototype, 'getItem');
  const factories = [
    () => genresQuery().queryKey,
    () => movieListQuery('popular').queryKey,
    () => movieSearchQuery('noite').queryKey,
    () => personQuery(1).queryKey,
    () => peopleQuery().queryKey,
  ];
  const pt = factories.map((fn) => fn());
  const ptRequest = genresQuery();
  setLocale('en-US', false);
  const en = factories.map((fn) => fn());
  expect(new Set([...pt, ...en].map((key) => JSON.stringify(key))).size).toBe(
    10,
  );
  const fetcher = vi.fn<typeof fetch>().mockImplementation((input) => {
    const locale = requestUrl(input).searchParams.get('locale');
    return Promise.resolve(
      Response.json({
        genres: [{ id: 28, name: locale === 'pt-BR' ? 'Ação' : 'Action' }],
      }),
    );
  });
  vi.stubGlobal('fetch', fetcher);
  const client = createQueryClient();
  try {
    expect((await client.query(ptRequest)).genres[0]?.name).toBe('Ação');
    expect((await client.query(genresQuery())).genres[0]?.name).toBe('Action');
    await client.query(ptRequest);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(write).not.toHaveBeenCalled();
    expect(read).not.toHaveBeenCalled();
  } finally {
    client.clear();
  }
});
it('cancela consulta antiga ao trocar o idioma e não deixa resposta antiga ocupar a nova chave', async () => {
  let oldSignal: AbortSignal | undefined;
  const fetcher = vi.fn<typeof fetch>().mockImplementation((input, options) => {
    if (requestUrl(input).searchParams.get('locale') === 'pt-BR') {
      oldSignal = options?.signal ?? undefined;
      return new Promise<Response>(() => {});
    }
    return Promise.resolve(
      Response.json({ genres: [{ id: 28, name: 'Action' }] }),
    );
  });
  vi.stubGlobal('fetch', fetcher);
  const client = createQueryClient();
  const old = genresQuery();
  const observer = new QueryObserver(client, old);
  const unsubscribe = observer.subscribe(() => {});
  try {
    setLocale('en-US', false);
    observer.setOptions(genresQuery());
    expect(oldSignal?.aborted).toBe(true);
    await vi.waitFor(() =>
      expect(observer.getCurrentResult().data?.genres[0]?.name).toBe('Action'),
    );
    expect(client.getQueryData(old.queryKey)).toBeUndefined();
    expect(fetcher).toHaveBeenCalledTimes(2);
  } finally {
    unsubscribe();
    client.clear();
  }
});
it('o cliente aplica pt-BR por padrão e aceita apenas a preferência enumerada', async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockImplementation(() => Promise.resolve(Response.json({ genres: [] })));
  vi.stubGlobal('fetch', fetcher);
  await getGenres();
  expect(fetcher).toHaveBeenCalledWith(
    '/api/tmdb/genre/movie/list?locale=pt-BR',
    expect.any(Object),
  );
  await getGenres({ locale: 'en-US' });
  expect(fetcher).toHaveBeenLastCalledWith(
    '/api/tmdb/genre/movie/list?locale=en-US',
    expect.any(Object),
  );
});
