import type {
  PersonDetails,
  PersonMovieCredits,
  PersonGender,
} from '../../types/tmdb';
// Legacy JSON is trusted only at these explicit boundaries; schema validation is Phase 3.
import { useParams } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import Aside from '../../components/layout/Aside';
import AsideMobile from '../../components/layout/AsideMobile';
import Header from '../../components/layout/Header';
import FilmCard from '../../components/movies/FilmCard';

const genderLabels: Record<PersonGender, string> = {
  0: 'Not specified',
  1: 'Feminine',
  2: 'Masculine',
  3: 'Non-binary',
};

const CastDetails = () => {
  const [cast, setCast] = useState<PersonDetails[]>([]);
  const [credits, setCredits] = useState<PersonMovieCredits[]>([]);
  const person = cast[0];
  const { id } = useParams<'id'>();

  useEffect(() => {
    if (!id) return;
    async function getCast(): Promise<PersonDetails> {
      const response = await fetch(`/api/tmdb/person/${id}`, {
        method: 'GET',
      });
      const result: unknown = await response.json();
      return result as PersonDetails;
    }
    async function getCredits(): Promise<PersonMovieCredits> {
      const response = await fetch(`/api/tmdb/person/${id}/movie_credits`, {
        method: 'GET',
      });
      const result: unknown = await response.json();
      return result as PersonMovieCredits;
    }
    getCast()
      .then((cast) => setCast([cast]))
      .catch((error: unknown) => console.error(error));
    getCredits()
      .then((cast) => setCredits([cast]))
      .catch((error: unknown) => console.error(error));
  }, [id]);

  return (
    <Fragment>
      <Header search={true} />
      <Aside />
      <AsideMobile />
      <main className="main cast-detail p-[10%] pr-[20px] pb-[20px] pt-[20px]">
        <div className="container flex flex-start items-start gap-150">
          <img
            src={
              person?.profile_path
                ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                : undefined
            }
            alt={person?.name ?? ''}
            className="main__img rounded-[10px] shadow-[0_0_8px_0_#000] w-[18vw] object-cover"
          />
          <article className="article flex-col gap-15 self-flex-start">
            <h1 className="article__title text-[2rem] font-bold font-display">
              {cast[0]?.name}
            </h1>
            <span>Biography</span>
            <p className="article__paragraph text-[1.1rem] leading-[.7cm]">
              {cast[0]?.biography}
            </p>
            <ul className="article__list flex-col gap-15">
              <li className="article__item flex items-center gap-10">
                <span>Birthday: </span>
                {cast[0]?.birthday}
              </li>
              {person?.deathday ? (
                <li className="article__item flex items-center gap-10">
                  <span>Deathday: </span>
                  {person.deathday}
                </li>
              ) : null}
              <li className="article__item flex items-center gap-10">
                <span>Known for: </span>
                {cast[0]?.known_for_department}
              </li>
              <li className="article__item flex items-center gap-10">
                <span>Gender: </span>
                {person ? genderLabels[person.gender] : ''}
              </li>
              <li className="article__item flex items-center gap-10">
                <span>Place of birth: </span>
                {cast[0]?.place_of_birth}
              </li>
              <li className="article__item flex items-center gap-10">
                <span>IMDB ID: </span>
                {cast[0]?.imdb_id}
              </li>
            </ul>
          </article>
        </div>
        <div className="container-credits relative border-t line/40 w-full mt-[12%] pt-[20px] grid grid-cols-[repeat(auto-fill,minmax(180px,2fr))]">
          {credits[0]?.cast?.map((movie, index) => (
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
};

export default CastDetails;
