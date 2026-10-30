import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/useLocale';
import { useQuery } from '@tanstack/react-query';
import { peopleQuery, personSearchQuery } from '../../api/tmdb/queries';
import { useCatalogParams } from '../../hooks/useCatalogParams';
import { usePageTitle } from '../../hooks/usePageTitle';
import { SearchField, Pagination } from '../../components/base/CatalogTools';
import PersonCard from '../../components/base/PersonCard';
import QueryContent from '../../components/base/QueryContent';
export default function CastCatalog() {
  useLocale();
  const state = useCatalogParams();
  const result = useQuery(
    state.term
      ? personSearchQuery(state.term, state.page)
      : peopleQuery(state.page),
  );
  const people = result.data?.results ?? [];
  const title = state.term
    ? t('Pessoas: “{term}”', { term: state.term })
    : t('Quem faz o cinema');
  usePageTitle(title);
  return (
    <div className="page-stack">
      <header className="page-intro">
        <p className="eyebrow">{t('Na frente e atrás da câmera')}</p>
        <h1>{title}</h1>
        <p>{t('Rostos conhecidos. Trabalhos que ainda vão surpreender.')}</p>
      </header>
      <SearchField
        people
        value={state.input}
        onChange={(value) => state.update('q', value)}
      />
      <h2 className="sr-only">{t('Pessoas desta página')}</h2>
      <QueryContent
        pending={result.isPending}
        error={result.error}
        empty={people.length === 0}
        emptyTitle={
          state.term
            ? t('Nenhuma pessoa encontrada')
            : t('Nenhuma pessoa disponível')
        }
        retry={() => {
          void result.refetch();
        }}
      >
        <div className="poster-grid">
          {people.map((person) => (
            <PersonCard
              key={person.id}
              id={person.id}
              name={person.name}
              photo={person.profile_path}
            />
          ))}
        </div>
      </QueryContent>
      {result.data && !result.isError && (
        <Pagination
          page={state.page}
          total={result.data.total_pages}
          href={state.pageHref}
        />
      )}
    </div>
  );
}
