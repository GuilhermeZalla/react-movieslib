import type { MovieDetails as MovieDetailsData } from '../../types/tmdb';
// Legacy JSON is trusted only at these explicit boundaries; schema validation is Phase 3.
import Header from '../../components/layout/Header';
import { useParams } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { BsWallet2 } from 'react-icons/bs';
import { BiTimer } from 'react-icons/bi';
import { FaChartLine } from 'react-icons/fa';
import Genres from '../../components/movies/Genres';
import Cast from '../../components/people/Cast';
import Aside from '../../components/layout/Aside';
import AsideMobile from '../../components/layout/AsideMobile';

const dollarUSLocale = Intl.NumberFormat('en-US');

const MovieDetails = () => {
  const [details, setDetails] = useState<MovieDetailsData | null>(null);
  const { id } = useParams<'id'>();

  useEffect(() => {
    if (!id) return;
    async function getDetails(): Promise<MovieDetailsData> {
      const response = await fetch(
        `/api/tmdb/movie/${id}?append_to_response=credits`,
        {
          method: 'GET',
        },
      );
      const result: unknown = await response.json();
      return result as MovieDetailsData;
    }
    getDetails()
      .then((details) => setDetails(details))
      .catch((error: unknown) => console.error(error));
  }, [id]);

  return (
    <Fragment>
      <Header search={true} />
      <Aside />
      <AsideMobile />
      <main className="main">
        <div className="container">
          <div className="main__img">
            <img
              src={
                details?.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${details.poster_path}`
                  : undefined
              }
              alt={details?.title ?? ''}
            />
          </div>
          <article className="main__article">
            <h1 className="main__title">{details?.title}</h1>
            <p className="movie-year">
              {details?.release_date?.split('-')[0]} <span>Status:</span>{' '}
              <span>{details?.status}</span>
            </p>
            <h2 className="main__subtitle">{details?.tagline}</h2>
            <p className="main__paragraph">{details?.overview}</p>
            <ul className="main__list">
              <li className="main__item">
                <BsWallet2 /> Budget:{' '}
                <span>
                  $
                  {details?.budget == null
                    ? '\u2014'
                    : dollarUSLocale.format(details.budget)}
                </span>
              </li>
              <li className="main__item">
                <FaChartLine /> Revenue:{' '}
                <span>
                  $
                  {details?.revenue == null
                    ? '\u2014'
                    : dollarUSLocale.format(details.revenue)}
                </span>
              </li>
              <li className="main__item">
                <BiTimer /> Runtime:{' '}
                <span>{details?.runtime ?? '\u2014'} minutes</span>
              </li>
            </ul>
            <ul className="main__list">
              {details?.genres?.map((genre, index) => (
                <Genres key={index} id={genre.id} genre={genre.name} />
              ))}
            </ul>
          </article>
        </div>
        <div className="container-cast">
          {details?.credits?.cast?.map((cast, index) =>
            index < 20 ? (
              <Cast
                key={index}
                id={cast.id}
                photo={`https://image.tmdb.org/t/p/w500${cast.profile_path}`}
                name={cast.name}
                character={cast.character}
              />
            ) : null,
          )}
        </div>
      </main>
    </Fragment>
  );
};

export default MovieDetails;
