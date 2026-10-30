import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/useLocale';
import { useQueries } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useSavedMovies } from '../../hooks/useSavedMovies';
import { usePageTitle } from '../../hooks/usePageTitle';
import { movieQuery } from '../../api/tmdb/queries';
import MovieCard from '../../components/base/MovieCard';
import Skeleton from '../../components/base/Skeleton';
import ErrorState from '../../components/base/ErrorState';
import SaveMovieButton from '../../components/base/SaveMovieButton';
import { useCatalogParams } from '../../hooks/useCatalogParams';
import { Pagination } from '../../components/base/CatalogTools';
export default function MyList() {
  useLocale();
  const saved = useSavedMovies();
  const state = useCatalogParams();
  const page = Math.min(
    state.page,
    Math.max(1, Math.ceil(saved.ids.length / 12)),
  );
  const pageIds = saved.ids.slice((page - 1) * 12, page * 12);
  const results = useQueries({ queries: pageIds.map(movieQuery) });
  usePageTitle(t('Minha lista'));
  return (
    <div className="page-stack">
      <header className="page-intro">
        <p className="eyebrow">Movieslib</p>
        <h1>{t('Minha lista')}</h1>
        <p>{t('Só os filmes que você guardou. A ordem é sua.')}</p>
      </header>
      {!saved.ids.length && (
        <section className="empty-panel">
          <h2>{t('Nenhum ingresso guardado')}</h2>
          <p>
            {t(
              'Quando um filme chamar sua atenção, guarde para voltar depois.',
            )}
          </p>
          <Link className="button-primary" to="/catalog/popular/1">
            {t('Escolher um filme')}
          </Link>
        </section>
      )}
      <h2 className="sr-only">{t('Filmes guardados')}</h2>
      <div className="poster-grid">
        {results.map((result, index) => {
          const id = pageIds[index];
          if (id === undefined) return null;
          if (result.isPending) return <Skeleton key={id} variant="poster" />;
          if (result.error)
            return (
              <div key={id}>
                <ErrorState
                  preview
                  message={t('Este filme não chegou à lista.')}
                  onRetry={() => {
                    void result.refetch();
                  }}
                />
                <SaveMovieButton id={id} title={t('filme {id}', { id })} />
              </div>
            );
          const movie = result.data;
          return (
            <MovieCard
              key={id}
              movieId={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              vote={movie.vote_average?.toFixed(1) ?? null}
              saveable
            />
          );
        })}
      </div>
      {saved.ids.length > 0 && (
        <Pagination
          page={page}
          total={Math.ceil(saved.ids.length / 12)}
          href={state.pageHref}
        />
      )}
    </div>
  );
}
