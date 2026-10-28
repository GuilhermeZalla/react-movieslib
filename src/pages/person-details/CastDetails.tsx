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
      <main className="main cast-detail">
        <div className="container">
          <img
            src={
              person?.profile_path
                ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                : undefined
            }
            alt={person?.name ?? ''}
            className="main__img"
          />
          <article className="article">
            <h1 className="article__title">{cast[0]?.name}</h1>
            <span>Biography</span>
            <p className="article__paragraph">{cast[0]?.biography}</p>
            <ul className="article__list">
              <li className="article__item">
                <span>Birthday: </span>
                {cast[0]?.birthday}
              </li>
              {person?.deathday ? (
                <li className="article__item">
                  <span>Deathday: </span>
                  {person.deathday}
                </li>
              ) : null}
              <li className="article__item">
                <span>Known for: </span>
                {cast[0]?.known_for_department}
              </li>
              <li className="article__item">
                <span>Gender: </span>
                {person ? genderLabels[person.gender] : ''}
              </li>
              <li className="article__item">
                <span>Place of birth: </span>
                {cast[0]?.place_of_birth}
              </li>
              <li className="article__item">
                <span>IMDB ID: </span>
                {cast[0]?.imdb_id}
              </li>
            </ul>
          </article>
        </div>
        <div className="container-credits">
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
