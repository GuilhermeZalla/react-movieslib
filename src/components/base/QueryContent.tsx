import type { ReactNode } from 'react';
import { TmdbError } from '../../api/tmdb/client';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import Skeleton from './Skeleton';
interface Props {
  pending: boolean;
  error: unknown;
  empty: boolean;
  retry: () => void;
  children: ReactNode;
  emptyTitle?: string;
}
export default function QueryContent({
  pending,
  error,
  empty,
  retry,
  children,
  emptyTitle = 'Nenhum filme encontrado',
}: Props) {
  if (pending)
    return (
      <div className="poster-grid" aria-label="Carregando resultados">
        {[1, 2, 3, 4, 5].map((value) => (
          <Skeleton key={value} variant="poster" />
        ))}
      </div>
    );
  if (
    (error instanceof TmdbError && error.kind === 'empty') ||
    (!error && empty)
  )
    return (
      <EmptyState
        preview
        title={emptyTitle}
        message="Outra escolha pode render uma boa sessão."
      />
    );
  if (error)
    return (
      <ErrorState
        preview
        message={
          error instanceof TmdbError
            ? error.message
            : 'A sessão caiu. Tente novamente.'
        }
        onRetry={retry}
      />
    );
  return children;
}
