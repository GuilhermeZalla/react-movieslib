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
      <main className="main flex flex-start items-center flex-wrap text-ink p-[10%] pr-[15%] pb-[5%] pt-[15%]">
        <div className="container flex flex-start items-start gap-150 rounded-[10px]">
          <div className="main__img rounded-[10px]">
            <img
              src={
                details?.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${details.poster_path}`
                  : undefined
              }
              alt={details?.title ?? ''}
              className="rounded-[10px] shadow-[0_0_8px_0_#000] w-[20vw] object-cover"
            />
          </div>
          <article className="main__article self-flex-start flex-col gap-15">
            <h1 className="main__title text-[2rem] font-bold font-display">
              {details?.title}
            </h1>
            <p className="movie-year text-[1.1rem]">
              {details?.release_date?.split('-')[0]} <span>Status:</span>{' '}
              <span>{details?.status}</span>
            </p>
            <h2 className="main__subtitle uppercase font-bold text-[1.2rem] mt-[20px]">
              {details?.tagline}
            </h2>
            <p className="main__paragraph text-[1.1rem] leading-[.7cm]">
              {details?.overview}
            </p>
            <ul className="main__list mt-[30px] flex flex-col gap-15">
              <li className="main__item flex items-center gap-10 font-bold text-[1rem]">
                <BsWallet2 /> Budget:{' '}
                <span>
                  $
                  {details?.budget == null
                    ? '\u2014'
                    : dollarUSLocale.format(details.budget)}
                </span>
              </li>
              <li className="main__item flex items-center gap-10 font-bold text-[1rem]">
                <FaChartLine /> Revenue:{' '}
                <span>
                  $
                  {details?.revenue == null
                    ? '\u2014'
                    : dollarUSLocale.format(details.revenue)}
                </span>
              </li>
              <li className="main__item flex items-center gap-10 font-bold text-[1rem]">
                <BiTimer /> Runtime:{' '}
                <span>{details?.runtime ?? '\u2014'} minutes</span>
              </li>
            </ul>
            <ul className="main__list mt-[30px] flex flex-col gap-15">
              {details?.genres?.map((genre, index) => (
                <Genres key={index} id={genre.id} genre={genre.name} />
              ))}
            </ul>
          </article>
        </div>
        <div className="container-cast relative border-t line/40 w-full mt-[12%] pt-[20px] grid grid-cols-[repeat(auto-fill,minmax(180px,2fr))]">
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
