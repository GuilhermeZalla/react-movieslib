import type { MoviePage } from '../../types/tmdb';
// Legacy JSON is trusted only at these explicit boundaries; schema validation is Phase 3.
import Header from '../../components/layout/Header';
import FilmCard from '../../components/movies/FilmCard';
import { Fragment, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { movieListQuery } from '../../api/tmdb/queries';
import { useParams } from 'react-router-dom';
import Aside from '../../components/layout/Aside';
import AsideMobile from '../../components/layout/AsideMobile';
import Footer from '../../components/layout/Footer';

const MoviesCatalog = () => {
  const [search, setSearch] = useState<MoviePage | null>(null);
  const { category = 'popular' } = useParams<'category'>();
  const { page = '1' } = useParams<'page'>();
  const [search2, setSearch2] = useState<MoviePage | null>(null);
  const [search3, setSearch3] = useState<MoviePage | null>(null);
  const [search4, setSearch4] = useState<MoviePage | null>(null);
  const [search5, setSearch5] = useState<MoviePage | null>(null);
  const [searchContent, setSearchContent] = useState('');
  const catalog = useQuery(
    movieListQuery(
      category as 'popular' | 'top_rated' | 'now_playing' | 'upcoming',
      page,
    ),
  );
  const handleSearchMovies = (result: string) => {
    let movie = result;
    if (movie === '') {
      setSearch(null);
    } else {
      movie = movie.replace(/\s/g, '+');
      setSearchContent(movie);
      async function searchMovie(): Promise<MoviePage> {
        const response = await fetch(
          `/api/tmdb/search/movie?query=${movie}&page=1`,
          {
            method: 'GET',
          },
        );
        const result: unknown = await response.json();
        return result as MoviePage;
      }
      async function searchMovie2(): Promise<MoviePage> {
        const response = await fetch(
          `/api/tmdb/search/movie?query=${movie}&page=2`,
          {
            method: 'GET',
          },
        );
        const result: unknown = await response.json();
        return result as MoviePage;
      }
      async function searchMovie3(): Promise<MoviePage> {
        const response = await fetch(
          `/api/tmdb/search/movie?query=${movie}&page=3`,
          {
            method: 'GET',
          },
        );
        const result: unknown = await response.json();
        return result as MoviePage;
      }
      async function searchMovie4(): Promise<MoviePage> {
        const response = await fetch(
          `/api/tmdb/search/movie?query=${movie}&page=3`,
          {
            method: 'GET',
          },
        );
        const result: unknown = await response.json();
        return result as MoviePage;
      }
      async function searchMovie5(): Promise<MoviePage> {
        const response = await fetch(
          `/api/tmdb/search/movie?query=${movie}&page=3`,
          {
            method: 'GET',
          },
        );
        const result: unknown = await response.json();
        return result as MoviePage;
      }
      searchMovie()
        .then((data) => setSearch(data))
        .catch((error: unknown) => console.error(error));
      searchMovie2()
        .then((data) => setSearch2(data))
        .catch((error: unknown) => console.error(error));
      searchMovie3()
        .then((data) => setSearch3(data))
        .catch((error: unknown) => console.error(error));
      searchMovie4()
        .then((data) => setSearch4(data))
        .catch((error: unknown) => console.error(error));
      searchMovie5()
        .then((data) => setSearch5(data))
        .catch((error: unknown) => console.error(error));
    }
  };

  if (search === null) {
    return (
      <Fragment>
        <Header handleSearchMovies={handleSearchMovies} />
        <Aside />
        <AsideMobile />
        <main className="home__main relative mb-[5%] mt-[7%] pl-[100px] pr-[30px] pt-[20px] pb-[20px] text-ink">
          <div className="home__container container__films catalog relative border-t line/40 mt-[5%] pt-[10px] grid grid-cols-[repeat(auto-fill,minmax(150px,2fr))] gap-10">
            <h1 className="home__title movies-catalog text-[1.4rem] font-normal absolute top-[-35px]">
              Overviewing{' '}
              <span>
                {`${category.split('_')[0]} ${
                  category.split('_')[1] === undefined
                    ? ''
                    : category.split('_')[1]
                }`}
              </span>{' '}
              movies
            </h1>
            {catalog.data?.results.map((movie, index) => (
              <FilmCard
                key={index}
                poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                title={movie.title}
                vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                movieId={movie.id}
              />
            ))}
          </div>
        </main>
        <Footer category={category} />
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <Header handleSearchMovies={handleSearchMovies} />
        <Aside />
        <AsideMobile />
        <main className="home__main relative mb-[5%] mt-[7%] pl-[100px] pr-[30px] pt-[20px] pb-[20px] text-ink">
          <div className="home__container container__films catalog relative border-t line/40 mt-[5%] pt-[10px] grid grid-cols-[repeat(auto-fill,minmax(150px,2fr))] gap-10">
            <h1 className="home__title movies-catalog text-[1.4rem] font-normal absolute top-[-35px]">
              Movies by the name <span>{searchContent.replace('+', ' ')}</span>
            </h1>
            {search?.results?.map((movie, index) => (
              <FilmCard
                key={index}
                poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                title={movie.title}
                vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                movieId={movie.id}
              />
            ))}
            {search2?.results?.map((movie, index) => (
              <FilmCard
                key={index}
                poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                title={movie.title}
                vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                movieId={movie.id}
              />
            ))}
            {search3?.results?.map((movie, index) => (
              <FilmCard
                key={index}
                poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                title={movie.title}
                vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                movieId={movie.id}
              />
            ))}
            {search4?.results?.map((movie, index) => (
              <FilmCard
                key={index}
                poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                title={movie.title}
                vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                movieId={movie.id}
              />
            ))}
            {search5?.results?.map((movie, index) => (
              <FilmCard
                key={index}
                poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                title={movie.title}
                vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                movieId={movie.id}
              />
            ))}
          </div>
        </main>
      </Fragment>
    );
  }
};

export default MoviesCatalog;
