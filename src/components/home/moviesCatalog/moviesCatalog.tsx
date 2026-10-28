import type { MoviePage } from '../../../types/tmdb';
// Legacy JSON is trusted only at these explicit boundaries; schema validation is Phase 3.
import Header from '../../common/header/header';
import FilmCard from '../filmCard/filmCard';
import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Aside from '../../common/aside/aside';
import AsideMobile from '../../common/asideMobile/asideMobile';
import Footer from '../../common/footer/footer';

const MoviesCatalog = () => {
  const [movies, setMovies] = useState<MoviePage[]>([]);
  const [search, setSearch] = useState<MoviePage | null>(null);
  const [search2, setSearch2] = useState<MoviePage | null>(null);
  const [search3, setSearch3] = useState<MoviePage | null>(null);
  const [search4, setSearch4] = useState<MoviePage | null>(null);
  const [search5, setSearch5] = useState<MoviePage | null>(null);
  const [searchContent, setSearchContent] = useState('');
  const { category = 'popular' } = useParams<'category'>();
  const { page = '1' } = useParams<'page'>();

  useEffect(() => {
    async function getMovies(): Promise<MoviePage> {
      const response = await fetch(`/api/tmdb/movie/${category}?page=${page}`, {
        method: 'GET',
      });
      const result: unknown = await response.json();
      return result as MoviePage;
    }
    getMovies()
      .then((data) => setMovies([data]))
      .catch((error: unknown) => console.log(error));
  }, [category, page]);

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
        .catch((error: unknown) => console.log(error));
      searchMovie2()
        .then((data) => setSearch2(data))
        .catch((error: unknown) => console.log(error));
      searchMovie3()
        .then((data) => setSearch3(data))
        .catch((error: unknown) => console.log(error));
      searchMovie4()
        .then((data) => setSearch4(data))
        .catch((error: unknown) => console.log(error));
      searchMovie5()
        .then((data) => setSearch5(data))
        .catch((error: unknown) => console.log(error));
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
              Overviewing{' '}
              <span>
                {category.split('_')[0] +
                  ' ' +
                  (category.split('_')[1] === undefined
                    ? ''
                    : category.split('_')[1])}
              </span>{' '}
              movies
            </h1>
            {movies[0]?.results.map((movie, index) => (
              <FilmCard
                key={index}
                poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path}
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
        <main className="home__main">
          <div className="home__container container__films catalog">
            <h1 className="home__title movies-catalog">
              Movies by the name <span>{searchContent.replace('+', ' ')}</span>
            </h1>
            {search?.results?.map((movie, index) => (
              <FilmCard
                key={index}
                poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path}
                title={movie.title}
                vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                movieId={movie.id}
              />
            ))}
            {search2?.results?.map((movie, index) => (
              <FilmCard
                key={index}
                poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path}
                title={movie.title}
                vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                movieId={movie.id}
              />
            ))}
            {search3?.results?.map((movie, index) => (
              <FilmCard
                key={index}
                poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path}
                title={movie.title}
                vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                movieId={movie.id}
              />
            ))}
            {search4?.results?.map((movie, index) => (
              <FilmCard
                key={index}
                poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path}
                title={movie.title}
                vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                movieId={movie.id}
              />
            ))}
            {search5?.results?.map((movie, index) => (
              <FilmCard
                key={index}
                poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path}
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
