import { tmdbImageUrl } from '../../api/tmdb/client';
import type { PersonGender } from '../../types/tmdb';
// Legacy JSON is trusted only at these explicit boundaries; schema validation is Phase 3.
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { personQuery, personCreditsQuery } from '../../api/tmdb/queries';
import { idParameterSchema } from '../../../shared/tmdbRequest';
import { Fragment } from 'react';
import Aside from '../../components/layout/Aside';
import AsideMobile from '../../components/layout/AsideMobile';
import Header from '../../components/layout/Header';
import FilmCard from '../../components/movies/FilmCard';
import EmptyState from '../../components/base/EmptyState';
import ErrorState from '../../components/base/ErrorState';

const genderLabels: Record<PersonGender, string> = {
  0: 'Not specified',
  1: 'Feminine',
  2: 'Masculine',
  3: 'Non-binary',
};

const CastDetails = () => {
  const { id } = useParams<'id'>();
  const validId = (() => {
    const parsed = idParameterSchema.safeParse(id ?? '');
    return parsed.success ? String(parsed.data) : null;
  })();

  const personQueryResult = useQuery({
    ...personQuery(validId ?? '1'),
    enabled: validId !== null,
  });
  const creditsQueryResult = useQuery({
    ...personCreditsQuery(validId ?? '1'),
    enabled: validId !== null,
  });

  const person = personQueryResult.data ?? null;
  const credits = creditsQueryResult.data ?? null;

  if (validId === null) {
    return <Navigate to="/404" replace />;
  }

  if (personQueryResult.isError) {
    const err = personQueryResult.error;
    const kind =
      err instanceof Error && 'kind' in err
        ? (err as { kind: string }).kind
        : '';
    if (kind === 'empty') {
      return (
        <Fragment>
          <Header search={true} />
          <Aside />
          <AsideMobile />
          <EmptyState title="Nenhuma pessoa encontrada" />
        </Fragment>
      );
    }
    return (
      <Fragment>
        <Header search={true} />
        <Aside />
        <AsideMobile />
        <ErrorState
          message="Não foi possível carregar a pessoa."
          onRetry={() => {
            void personQueryResult.refetch();
          }}
        />
      </Fragment>
    );
  }

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
                ? (tmdbImageUrl(person.profile_path) ?? undefined)
                : undefined
            }
            alt={person?.name ?? ''}
            className="main__img rounded-[10px] shadow-[0_0_8px_0_#000] w-[18vw] object-cover"
          />
          <article className="article flex-col gap-15 self-flex-start">
            <h1 className="article__title text-[2rem] font-bold font-display">
              {person?.name}
            </h1>
            <span>Biography</span>
            <p className="article__paragraph text-[1.1rem] leading-[.7cm]">
              {person?.biography}
            </p>
            <ul className="article__list flex-col gap-15">
              <li className="article__item flex items-center gap-10">
                <span>Birthday: </span>
                {person?.birthday}
              </li>
              {person?.deathday ? (
                <li className="article__item flex items-center gap-10">
                  <span>Deathday: </span>
                  {person.deathday}
                </li>
              ) : null}
              <li className="article__item flex items-center gap-10">
                <span>Known for: </span>
                {person?.known_for_department}
              </li>
              <li className="article__item flex items-center gap-10">
                <span>Gender: </span>
                {person ? genderLabels[person.gender] : ''}
              </li>
              <li className="article__item flex items-center gap-10">
                <span>Place of birth: </span>
                {person?.place_of_birth}
              </li>
              <li className="article__item flex items-center gap-10">
                <span>IMDB ID: </span>
                {person?.imdb_id}
              </li>
            </ul>
          </article>
        </div>
        <div className="container-credits relative border-t line/40 w-full mt-[12%] pt-[20px] grid grid-cols-[repeat(auto-fill,minmax(180px,2fr))]">
          {creditsQueryResult.isError ? (
            <ErrorState
              message="Não foi possível carregar a filmografia."
              onRetry={() => {
                void creditsQueryResult.refetch();
              }}
            />
          ) : credits?.cast?.length ? (
            credits.cast.map((movie, index) => (
              <FilmCard
                key={index}
                poster={tmdbImageUrl(movie.poster_path)}
                title={movie.title}
                vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                movieId={movie.id}
              />
            ))
          ) : credits ? (
            <EmptyState title="Nenhuma filmografia encontrada" />
          ) : null}
        </div>
      </main>
    </Fragment>
  );
};

export default CastDetails;
