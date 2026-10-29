import { tmdbImageUrl } from '../../api/tmdb/client';
import { Fragment, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Aside from '../../components/layout/Aside';
import AsideMobile from '../../components/layout/AsideMobile';
import FilmCard from '../../components/movies/FilmCard';
import EmptyState from '../../components/base/EmptyState';
import ErrorState from '../../components/base/ErrorState';
import NotFoundScreen from '../not-found/NotFoundScreen';
import { movieListQuery, movieSearchQuery } from '../../api/tmdb/queries';
import { TmdbError } from '../../api/tmdb/client';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import {
  idParameterSchema,
  searchInputSchema,
} from '../../../shared/tmdbRequest';

const pages = [1, 2, 3, 4, 5] as const;

const isEmpty = (error: unknown) =>
  error instanceof TmdbError && error.kind === 'empty';

const GenresCatalog = () => {
  const { id, genre = '' } = useParams<'id' | 'genre'>();
  const parsedId = idParameterSchema.safeParse(id ?? '');
  const parsedGenre = searchInputSchema.safeParse(genre);
  const validRoute =
    parsedId.success && parsedGenre.success && parsedGenre.data.length > 0;
  const genreId = parsedId.success ? parsedId.data : null;
  const [searchContent, setSearchContent] = useState('');
  const debounced = useDebouncedValue(searchContent);
  const parsedTerm = searchInputSchema.safeParse(debounced);
  const term = parsedTerm.success ? parsedTerm.data : '';
  const searching = term.length > 0;

  const browse = useQueries({
    queries: pages.map((page) => ({
      ...movieListQuery('popular', page),
      enabled: validRoute && !searching,
    })),
  });
  const search = useQueries({
    queries: pages.map((page) => ({
      ...movieSearchQuery(term, page),
      enabled: validRoute && searching,
    })),
  });
  const active = searching ? search : browse;
  const failed = active.some(
    (result) => result.isError && !isEmpty(result.error),
  );
  const settled = active.every(
    (result) => result.isSuccess || isEmpty(result.error),
  );
  const movies = active
    .flatMap((result, pageIndex) =>
      (result.data?.results ?? []).map((movie, index) => ({
        movie,
        key: `${pageIndex}-${index}-${movie.id}`,
      })),
    )
    .filter(
      ({ movie }) => searching || movie.genre_ids.includes(genreId ?? -1),
    );

  const retry = () => {
    for (const result of active) {
      if (result.isError && !isEmpty(result.error)) void result.refetch();
    }
  };

  if (!validRoute) return <NotFoundScreen />;

  return (
    <Fragment>
      <Header
        handleSearchMovies={(value) => setSearchContent(value.slice(0, 200))}
      />
      <Aside />
      <AsideMobile />
      <main className="home__main relative mb-[5%] mt-[7%] pl-[100px] pr-[30px] pt-[20px] pb-[20px] text-ink">
        <div className="home__container container__films catalog relative border-t line/40 mt-[5%] pt-[10px] grid grid-cols-[repeat(auto-fill,minmax(150px,2fr))] gap-10">
          <h1 className="home__title movies-catalog text-[1.4rem] font-normal absolute top-[-35px]">
            {searching ? (
              <>
                Movies by the name <span>{term}</span>
              </>
            ) : (
              <>
                Overviewing <span>{genre}</span> movies
              </>
            )}
          </h1>
          {failed ? (
            <ErrorState
              message="Não foi possível carregar os filmes."
              onRetry={retry}
            />
          ) : settled && movies.length === 0 ? (
            <EmptyState title="Nenhum filme encontrado" />
          ) : (
            movies.map(({ movie, key }) => (
              <FilmCard
                key={key}
                poster={
                  movie.poster_path ? tmdbImageUrl(movie.poster_path) : null
                }
                title={movie.title}
                vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                movieId={movie.id}
              />
            ))
          )}
        </div>
      </main>
    </Fragment>
  );
};

export default GenresCatalog;
