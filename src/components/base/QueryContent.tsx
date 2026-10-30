import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/useLocale';
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
  emptyTitle = t('Nenhum filme encontrado'),
}: Props) {
  useLocale();
  if (pending)
    return (
      <div className="poster-grid" aria-label={t('Carregando resultados')}>
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
        message={t('Outra escolha pode render uma boa sessão.')}
      />
    );
  if (error)
    return (
      <ErrorState
        preview
        message={
          error instanceof TmdbError
            ? error.message
            : t('A sessão caiu. Tente novamente.')
        }
        onRetry={retry}
      />
    );
  return children;
}
