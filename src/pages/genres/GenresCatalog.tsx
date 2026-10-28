import type { MoviePage } from '../../types/tmdb';
// Legacy JSON is trusted only at these explicit boundaries; schema validation is Phase 3.
import Header from '../../components/layout/Header';
import FilmCard from '../../components/movies/FilmCard';
import Aside from '../../components/layout/Aside';
import AsideMobile from '../../components/layout/AsideMobile';
import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const GenresCatalog = () => {
  const [movies, setMovies] = useState<MoviePage | null>(null);
  const [movies2, setMoviesPage2] = useState<MoviePage | null>(null);
  const [movies3, setMoviesPage3] = useState<MoviePage | null>(null);
  const [movies4, setMoviesPage4] = useState<MoviePage | null>(null);
  const [movies5, setMoviesPage5] = useState<MoviePage | null>(null);
  const [search, setSearch] = useState<MoviePage | null>(null);
  const [search2, setSearch2] = useState<MoviePage | null>(null);
  const [search3, setSearch3] = useState<MoviePage | null>(null);
  const [search4, setSearch4] = useState<MoviePage | null>(null);
  const [search5, setSearch5] = useState<MoviePage | null>(null);
  const [searchContent, setSearchContent] = useState('');
  const { genre = '' } = useParams<'genre'>();
  const { id } = useParams<'id'>();

  useEffect(() => {
    async function getMovies(): Promise<MoviePage> {
      const response = await fetch(`/api/tmdb/movie/popular?page=1`, {
        method: 'GET',
      });
      const result: unknown = await response.json();
      return result as MoviePage;
    }
    async function getMoviesPage2(): Promise<MoviePage> {
      const response = await fetch(`/api/tmdb/movie/popular?page=2`, {
        method: 'GET',
      });
      const result: unknown = await response.json();
      return result as MoviePage;
    }
    async function getMoviesPage3(): Promise<MoviePage> {
      const response = await fetch(`/api/tmdb/movie/popular?page=3`, {
        method: 'GET',
      });
      const result: unknown = await response.json();
      return result as MoviePage;
    }
    async function getMoviesPage4(): Promise<MoviePage> {
      const response = await fetch(`/api/tmdb/movie/popular?page=4`, {
        method: 'GET',
      });
      const result: unknown = await response.json();
      return result as MoviePage;
    }
    async function getMoviesPage5(): Promise<MoviePage> {
      const response = await fetch(`/api/tmdb/movie/top_rated?page=5`, {
        method: 'GET',
      });
      const result: unknown = await response.json();
      return result as MoviePage;
    }
    getMovies()
      .then((data) => setMovies(data))
      .catch((error: unknown) => console.error(error));
    getMoviesPage2()
      .then((data) => setMoviesPage2(data))
      .catch((error: unknown) => console.error(error));
    getMoviesPage3()
      .then((data) => setMoviesPage3(data))
      .catch((error: unknown) => console.error(error));
    getMoviesPage4()
      .then((data) => setMoviesPage4(data))
      .catch((error: unknown) => console.error(error));
    getMoviesPage5()
      .then((data) => setMoviesPage5(data))
      .catch((error: unknown) => console.error(error));
  }, []);

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
          `/api/tmdb/search/movie?query=${movie}&page=4`,
          {
            method: 'GET',
          },
        );
        const result: unknown = await response.json();
        return result as MoviePage;
      }
      async function searchMovie5(): Promise<MoviePage> {
        const response = await fetch(
          `/api/tmdb/search/movie?query=${movie}&page=5`,
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
        <main className="home__main">
          <div className="home__container container__films catalog">
            <h1 className="home__title movies-catalog">
              Overviewing <span>{genre}</span> movies
            </h1>
            {movies?.results?.map((movie, index) =>
              movie.genre_ids?.map((ids) =>
                ids === Number(id) ? (
                  <FilmCard
                    key={index}
                    poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    title={movie.title}
                    vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                    movieId={movie.id}
                  />
                ) : null,
              ),
            )}
            {movies2?.results?.map((movie, index) =>
              movie.genre_ids.map((ids) =>
                ids === Number(id) ? (
                  <FilmCard
                    key={index}
                    poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    title={movie.title}
                    vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                    movieId={movie.id}
                  />
                ) : null,
              ),
            )}
            {movies3?.results?.map((movie, index) =>
              movie.genre_ids.map((ids) =>
                ids === Number(id) ? (
                  <FilmCard
                    key={index}
                    poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    title={movie.title}
                    vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                    movieId={movie.id}
                  />
                ) : null,
              ),
            )}
            {movies4?.results?.map((movie, index) =>
              movie.genre_ids.map((ids) =>
                ids === Number(id) ? (
                  <FilmCard
                    key={index}
                    poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    title={movie.title}
                    vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                    movieId={movie.id}
                  />
                ) : null,
              ),
            )}
            {movies5?.results?.map((movie, index) =>
              movie.genre_ids.map((ids) =>
                ids === Number(id) ? (
                  <FilmCard
                    key={index}
                    poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    title={movie.title}
                    vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                    movieId={movie.id}
                  />
                ) : null,
              ),
            )}
          </div>
        </main>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <Header handleSearchMovies={handleSearchMovies} />
        <Aside />
        <AsideMobile />
        <main className="home__main">
          <div className="home__container container__films catalog">
            <h1 className="home__title movies-catalog">
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

export default GenresCatalog;
