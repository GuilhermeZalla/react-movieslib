import { getLocale } from '../../i18n/locale';
import { genreName } from '../../i18n/metadata';
import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/useLocale';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import {
  movieListQuery,
  movieSearchQuery,
  discoverQuery,
  genresQuery,
} from '../../api/tmdb/queries';
import { movieCategorySchema } from '../../../shared/tmdbRequest';
import { useCatalogParams } from '../../hooks/useCatalogParams';
import { usePageTitle } from '../../hooks/usePageTitle';
import {
  SearchField,
  CatalogFilters,
  Pagination,
} from '../../components/base/CatalogTools';
import MovieGrid from '../../components/base/MovieGrid';
import QueryContent from '../../components/base/QueryContent';
interface Props {
  genre?: { id: number; name: string };
}
const labels = {
  popular: 'Filmes populares',
  now_playing: 'Em cartaz',
  upcoming: 'Em breve',
  top_rated: 'Mais bem avaliados',
};
export default function MoviesCatalog({ genre }: Props) {
  useLocale();
  const route = useParams<'category' | 'page'>();
  const parsedCategory = movieCategorySchema.safeParse(
    route.category ?? 'popular',
  );
  const category = parsedCategory.success ? parsedCategory.data : 'popular';
  const state = useCatalogParams(genre ? undefined : (route.page ?? '1'));
  const genreList = useQuery(genresQuery());
  const filters = {
    ...state.filters,
    ...(genre ? { with_genres: String(genre.id) } : {}),
  };
  const hasFilters = Object.keys(filters).length > 0;
  const result = useQuery(
    state.term
      ? movieSearchQuery(state.term, state.page)
      : hasFilters
        ? discoverQuery({ ...filters, page: String(state.page) })
        : movieListQuery(category, state.page),
  );
  const title = state.term
    ? t('Busca por “{term}”', { term: state.term })
    : genre
      ? t('Filmes de {genre}', { genre: genreName(genre) })
      : hasFilters
        ? t('Filmes para a sua sessão')
        : t(labels[category]);
  usePageTitle(title);
  let movies = result.data?.results ?? [];
  if (state.term) {
    movies = movies.filter(
      (movie) =>
        (!filters.with_genres ||
          movie.genre_ids.includes(Number(filters.with_genres))) &&
        (!filters.primary_release_year ||
          movie.release_date?.startsWith(filters.primary_release_year)) &&
        (!filters['vote_average.gte'] ||
          (movie.vote_average ?? -1) >= Number(filters['vote_average.gte'])),
    );
    if (filters.sort_by === 'title.asc')
      movies = [...movies].sort((a, b) =>
        a.title.localeCompare(b.title, getLocale()),
      );
    if (filters.sort_by === 'vote_average.desc')
      movies = [...movies].sort(
        (a, b) => (b.vote_average ?? -1) - (a.vote_average ?? -1),
      );
    if (filters.sort_by === 'primary_release_date.desc')
      movies = [...movies].sort((a, b) =>
        (b.release_date ?? '').localeCompare(a.release_date ?? ''),
      );
  }
  return (
    <div className="page-stack">
      <header className="catalog-heading">
        <h1>{title}</h1>
        <p role="status">
          {result.isPending
            ? t('Preparando os pôsteres…')
            : t('{count} filmes nesta página', { count: movies.length })}
        </p>
      </header>
      <div className="catalog-layout">
        <aside
          aria-label={t('Filtros de filmes')}
          className="grid min-w-0 gap-5"
        >
          <CatalogFilters
            params={state.params}
            update={state.update}
            genres={genreList.data?.genres ?? []}
            {...(genre ? { lockedGenre: genre.id } : {})}
          />
          {genre && (
            <nav
              aria-label={t('Outros gêneros')}
              className="catalog-genre-links"
            >
              {genreList.data?.genres.map((item) => (
                <Link
                  className="catalog-genre-link"
                  key={item.id}
                  to={
                    '/genres/' +
                    String(item.id) +
                    '/' +
                    encodeURIComponent(genreName(item))
                  }
                >
                  {genreName(item)}
                </Link>
              ))}
            </nav>
          )}
        </aside>
        <section
          aria-label={t('Resultados de filmes')}
          className="catalog-results"
        >
          <SearchField
            value={state.input}
            onChange={(value) => state.update('q', value)}
          />
          {state.term && hasFilters && (
            <p className="text-preview-caption text-preview-muted">
              {t(
                'Na busca por título, os filtros refinam os resultados desta página. Sem termo, a seleção consulta o catálogo completo.',
              )}
            </p>
          )}
          <h2 className="sr-only">{t('Filmes desta página')}</h2>
          <QueryContent
            pending={result.isPending}
            error={result.error}
            empty={movies.length === 0}
            retry={() => {
              void result.refetch();
            }}
          >
            <MovieGrid movies={movies} />
          </QueryContent>
          {result.data && !result.isError && (
            <Pagination
              page={state.page}
              total={result.data.total_pages}
              href={state.pageHref}
            />
          )}
        </section>
      </div>
    </div>
  );
}
