import { getLocale } from '../../i18n/locale';
import { metadataLabel } from '../../i18n/metadata';
import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/useLocale';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { idParameterSchema } from '../../../shared/tmdbRequest';
import { personQuery, personCreditsQuery } from '../../api/tmdb/queries';
import { tmdbImageUrl, TmdbError } from '../../api/tmdb/client';
import { usePageTitle } from '../../hooks/usePageTitle';
import PosterImage from '../../components/base/PosterImage';
import QueryContent from '../../components/base/QueryContent';
import MovieGrid from '../../components/base/MovieGrid';
import NotFoundScreen from '../not-found/NotFoundScreen';
const genders = {
  0: 'Não informado',
  1: 'Feminino',
  2: 'Masculino',
  3: 'Não binário',
};
const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat(getLocale(), { timeZone: 'UTC' }).format(
        new Date(value + 'T00:00:00Z'),
      )
    : t('Não informada');
export default function CastDetails() {
  useLocale();
  const { id } = useParams<'id'>();
  const parsed = idParameterSchema.safeParse(id ?? '');
  const safeId = parsed.success ? parsed.data : 1;
  const details = useQuery({ ...personQuery(safeId), enabled: parsed.success });
  const credits = useQuery({
    ...personCreditsQuery(safeId),
    enabled: parsed.success,
  });
  const person = details.data;
  usePageTitle(person?.name ?? t('Pessoa'));
  if (
    !parsed.success ||
    (details.error instanceof TmdbError && details.error.kind === 'not-found')
  )
    return <NotFoundScreen />;
  const movies = [
    ...new Map(
      [...(credits.data?.cast ?? []), ...(credits.data?.crew ?? [])].map(
        (movie) => [movie.id, movie],
      ),
    ).values(),
  ];
  return (
    <div className="page-stack">
      <Link to="/cast" className="text-preview-accent-text underline">
        {t('Voltar às pessoas')}
      </Link>
      <QueryContent
        pending={details.isPending}
        error={details.error}
        empty={!person}
        emptyTitle={t('Nenhuma pessoa encontrada')}
        retry={() => {
          void details.refetch();
        }}
      >
        {person && (
          <section className="detail-opening">
            <div className="mx-auto w-full max-w-preview-card">
              <div className="aspect-preview-poster overflow-hidden rounded-preview-poster">
                <PosterImage
                  fill
                  className="size-full"
                  src={tmdbImageUrl(person.profile_path)}
                  alt={person.name}
                  loading="eager"
                />
              </div>
            </div>
            <article className="page-intro min-w-0">
              <p className="eyebrow">
                {metadataLabel(person.known_for_department ?? '') ||
                  t('No cinema')}
              </p>
              <h1>{person.name}</h1>
              <h2 className="section-title">{t('Biografia')}</h2>
              <p className="whitespace-pre-line">
                {person.biography || t('Biografia indisponível.')}
              </p>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt>{t('Nascimento')}</dt>
                  <dd>{formatDate(person.birthday)}</dd>
                </div>
                {person.deathday && (
                  <div>
                    <dt>{t('Falecimento')}</dt>
                    <dd>{formatDate(person.deathday)}</dd>
                  </div>
                )}
                <div>
                  <dt>{t('Local de nascimento')}</dt>
                  <dd>{person.place_of_birth || t('Não informado')}</dd>
                </div>
                <div>
                  <dt>{t('Gênero da pessoa')}</dt>
                  <dd>{t(genders[person.gender])}</dd>
                </div>
              </dl>
            </article>
          </section>
        )}
      </QueryContent>
      {person && (
        <section className="page-stack">
          <h2 className="section-title">{t('Uma vida em filmes')}</h2>
          <QueryContent
            pending={credits.isPending}
            error={credits.error}
            empty={!movies.length}
            emptyTitle={t('Nenhuma filmografia encontrada')}
            retry={() => {
              void credits.refetch();
            }}
          >
            <MovieGrid movies={movies} />
          </QueryContent>
        </section>
      )}
    </div>
  );
}
