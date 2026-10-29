import { tmdbImageUrl } from '../../api/tmdb/client';
import { Fragment, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { BiSearchAlt2 } from 'react-icons/bi';
import Header from '../../components/layout/Header';
import Aside from '../../components/layout/Aside';
import AsideMobile from '../../components/layout/AsideMobile';
import Cast from '../../components/people/Cast';
import EmptyState from '../../components/base/EmptyState';
import ErrorState from '../../components/base/ErrorState';
import { peopleQuery, personSearchQuery } from '../../api/tmdb/queries';
import { TmdbError } from '../../api/tmdb/client';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import {
  SEARCH_MAX_LENGTH,
  searchInputSchema,
} from '../../../shared/tmdbRequest';

const pages = [1, 2, 3, 4, 5, 6] as const;

const isEmpty = (error: unknown) =>
  error instanceof TmdbError && error.kind === 'empty';

const CastCatalog = () => {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState('');
  const debounced = useDebouncedValue(submitted);
  const parsed = searchInputSchema.safeParse(debounced);
  const term = parsed.success ? parsed.data : '';
  const searching = term.length > 0;

  const browse = useQueries({
    queries: pages.map((page) => ({
      ...peopleQuery(page),
      enabled: !searching,
    })),
  });
  const search = useQueries({
    queries: pages.map((page) => personSearchQuery(term, page)),
  });
  const active = searching ? search : browse;
  const failed = active.some(
    (result) => result.isError && !isEmpty(result.error),
  );
  const settled = active.every(
    (result) => result.isSuccess || isEmpty(result.error),
  );
  const people = active.flatMap((result, pageIndex) =>
    (result.data?.results ?? []).map((person, index) => ({
      person,
      key: `${pageIndex}-${index}-${person.id}`,
    })),
  );

  const submit = () => {
    const normalized = searchInputSchema.safeParse(input);
    setSubmitted(normalized.success ? normalized.data : '');
  };
  const retry = () => {
    for (const result of active) {
      if (result.isError && !isEmpty(result.error)) void result.refetch();
    }
  };

  return (
    <Fragment>
      <Header search={true} />
      <Aside />
      <AsideMobile />
      <main className="main main-casts pl-[100px] pr-[30px] pb-[8%] pt-0">
        <nav className="main__navbar flex items-center relative w-full mt-[10%] mb-[8%] ml-[30%] mr-[30%]">
          <input
            type="text"
            placeholder="Search for a person"
            aria-label="Buscar pessoa"
            maxLength={SEARCH_MAX_LENGTH}
            value={input}
            onChange={(event) =>
              setInput(event.target.value.slice(0, SEARCH_MAX_LENGTH))
            }
          />
          <button type="button" onClick={submit} aria-label="Buscar pessoa">
            <BiSearchAlt2 />
          </button>
        </nav>
        <div className="casts relative border-t line/40 pt-[15px] grid grid-cols-[repeat(auto-fill,minmax(190px,2fr))] gap-10">
          {failed ? (
            <ErrorState
              message="Não foi possível carregar as pessoas."
              onRetry={retry}
            />
          ) : settled && people.length === 0 ? (
            <EmptyState
              title={
                searching
                  ? 'Nenhuma pessoa encontrada'
                  : 'Nenhuma pessoa disponível'
              }
            />
          ) : (
            people.map(({ person, key }) => (
              <Cast
                key={key}
                id={person.id}
                photo={
                  person.profile_path ? tmdbImageUrl(person.profile_path) : null
                }
                name={person.name}
              />
            ))
          )}
        </div>
      </main>
    </Fragment>
  );
};

export default CastCatalog;
