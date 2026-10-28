import { QueryClient } from '@tanstack/react-query';
import { TmdbError } from '../api/tmdb/client';

export const QUERY_STALE_TIME = 60_000;
export const QUERY_GC_TIME = 5 * 60_000;

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME,
        gcTime: QUERY_GC_TIME,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) =>
          error instanceof TmdbError &&
          error.kind === 'network' &&
          ![400, 404, 429].includes(error.status ?? 0) &&
          failureCount < 1,
        retryDelay: 1_000,
      },
      mutations: { retry: false },
    },
  });
}
