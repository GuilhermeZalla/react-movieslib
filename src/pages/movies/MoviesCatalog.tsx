// Legacy JSON is trusted only at these explicit boundaries; schema validation is Phase 3.
import Header from '../../components/layout/Header';
import FilmCard from '../../components/movies/FilmCard';
import { Fragment, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { movieListQuery, movieSearchQuery } from '../../api/tmdb/queries';
import {
  movieCategorySchema,
  pageParameterSchema,
} from '../../../shared/tmdbRequest';
import { useParams } from 'react-router-dom';
import Aside from '../../components/layout/Aside';
import AsideMobile from '../../components/layout/AsideMobile';
import Footer from '../../components/layout/Footer';
import EmptyState from '../../components/base/EmptyState';
import ErrorState from '../../components/base/ErrorState';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

const normalizeTerm = (value: string): string =>
  value.normalize('NFC').trim().replace(/\s+/gu, ' ').slice(0, 200);

const MoviesCatalog = () => {
  const { category: rawCategory = 'popular' } = useParams<'category'>();
  const { page: rawPage = '1' } = useParams<'page'>();
  const category = movieCategorySchema.safeParse(rawCategory).success
    ? rawCategory
    : 'popular';
  const page = pageParameterSchema.safeParse(rawPage).success ? rawPage : '1';
  const [searchContent, setSearchContent] = useState('');
  const debouncedSearch = useDebouncedValue(searchContent);
  const safeTerm = normalizeTerm(debouncedSearch);
  const isSearching = safeTerm.length > 0;

  const catalog = useQuery(
    movieListQuery(
      category as 'popular' | 'top_rated' | 'now_playing' | 'upcoming',
      page,
    ),
  );

  const search1 = useQuery(movieSearchQuery(safeTerm, 1));
  const search2 = useQuery(movieSearchQuery(safeTerm, 2));
  const search3 = useQuery(movieSearchQuery(safeTerm, 3));
  const search4 = useQuery(movieSearchQuery(safeTerm, 4));
  const search5 = useQuery(movieSearchQuery(safeTerm, 5));

  const handleSearchMovies = (result: string) => {
    setSearchContent(result);
  };

  const refetchSearch = () => {
    void search1.refetch();
    void search2.refetch();
    void search3.refetch();
    void search4.refetch();
    void search5.refetch();
  };

  const searchHasError = search1.isError;
  const searchIsEmpty =
    !searchHasError &&
    search1.isSuccess &&
    (search1.data?.results?.length ?? 0) === 0;

  return (
    <Fragment>
      <Header handleSearchMovies={handleSearchMovies} />
      <Aside />
      <AsideMobile />
      <main className="home__main relative mb-[5%] mt-[7%] pl-[100px] pr-[30px] pt-[20px] pb-[20px] text-ink">
        {isSearching ? (
          <div className="home__container container__films catalog relative border-t line/40 mt-[5%] pt-[10px] grid grid-cols-[repeat(auto-fill,minmax(150px,2fr))] gap-10">
            <h1 className="home__title movies-catalog text-[1.4rem] font-normal absolute top-[-35px]">
              Movies by the name <span>{safeTerm}</span>
            </h1>
            {searchHasError ? (
              <ErrorState
                message="Não foi possível realizar a busca."
                onRetry={refetchSearch}
              />
            ) : searchIsEmpty ? (
              <EmptyState title="Nenhum filme encontrado" />
            ) : (
              <>
                {search1.data?.results?.map((movie, index) => (
                  <FilmCard
                    key={`s1-${index}`}
                    poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    title={movie.title}
                    vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                    movieId={movie.id}
                  />
                ))}
                {search2.data?.results?.map((movie, index) => (
                  <FilmCard
                    key={`s2-${index}`}
                    poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    title={movie.title}
                    vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                    movieId={movie.id}
                  />
                ))}
                {search3.data?.results?.map((movie, index) => (
                  <FilmCard
                    key={`s3-${index}`}
                    poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    title={movie.title}
                    vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                    movieId={movie.id}
                  />
                ))}
                {search4.data?.results?.map((movie, index) => (
                  <FilmCard
                    key={`s4-${index}`}
                    poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    title={movie.title}
                    vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                    movieId={movie.id}
                  />
                ))}
                {search5.data?.results?.map((movie, index) => (
                  <FilmCard
                    key={`s5-${index}`}
                    poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    title={movie.title}
                    vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                    movieId={movie.id}
                  />
                ))}
              </>
            )}
          </div>
        ) : (
          <div className="home__container container__films catalog relative border-t line/40 mt-[5%] pt-[10px] grid grid-cols-[repeat(auto-fill,minmax(150px,2fr))] gap-10">
            <h1 className="home__title movies-catalog text-[1.4rem] font-normal absolute top-[-35px]">
              Overviewing{' '}
              <span>
                {`${category.split('_')[0]} ${
                  category.split('_')[1] === undefined
                    ? ''
                    : category.split('_')[1]
                }`.trim()}
              </span>{' '}
              movies
            </h1>
            {catalog.data?.results?.map((movie, index) => (
              <FilmCard
                key={index}
                poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                title={movie.title}
                vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                movieId={movie.id}
              />
            ))}
          </div>
        )}
      </main>
      <Footer category={category} />
    </Fragment>
  );
};

export default MoviesCatalog;
