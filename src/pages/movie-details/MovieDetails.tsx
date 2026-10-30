import { getLocale } from '../../i18n/locale';
import { genreName, metadataLabel } from '../../i18n/metadata';
import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/useLocale';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { idParameterSchema } from '../../../shared/tmdbRequest';
import {
  movieQuery,
  movieCreditsQuery,
  movieVideosQuery,
  movieImagesQuery,
  recommendationsQuery,
} from '../../api/tmdb/queries';
import { TmdbError, tmdbImageUrl } from '../../api/tmdb/client';
import { usePageTitle } from '../../hooks/usePageTitle';
import QueryContent from '../../components/base/QueryContent';
import PosterImage from '../../components/base/PosterImage';
import PersonCard from '../../components/base/PersonCard';
import MovieGrid from '../../components/base/MovieGrid';
import SaveMovieButton from '../../components/base/SaveMovieButton';
import Trailer from '../../components/base/Trailer';
import EmptyState from '../../components/base/EmptyState';
import NotFoundScreen from '../not-found/NotFoundScreen';
const moneyFormat = () =>
  new Intl.NumberFormat(getLocale(), {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
export default function MovieDetails() {
  useLocale();
  const money = moneyFormat();
  const { id } = useParams<'id'>();
  const parsed = idParameterSchema.safeParse(id ?? '');
  const safeId = parsed.success ? parsed.data : 1;
  const enabled = parsed.success;
  const details = useQuery({ ...movieQuery(safeId), enabled });
  const credits = useQuery({ ...movieCreditsQuery(safeId), enabled });
  const videos = useQuery({ ...movieVideosQuery(safeId), enabled });
  const images = useQuery({ ...movieImagesQuery(safeId), enabled });
  const recommendations = useQuery({
    ...recommendationsQuery(safeId),
    enabled,
  });
  const movie = details.data;
  usePageTitle(movie?.title ?? t('Filme'));
  if (
    !enabled ||
    (details.error instanceof TmdbError && details.error.kind === 'not-found')
  )
    return <NotFoundScreen />;
  const trailer = videos.data?.results
    .filter(
      (video) =>
        video.site === 'YouTube' &&
        video.type === 'Trailer' &&
        /^[A-Za-z0-9_-]{11}$/.test(video.key),
    )
    .sort((a, b) => Number(b.official) - Number(a.official))[0];
  const cast = credits.data?.cast.slice(0, 20) ?? [];
  const crew = credits.data?.crew ?? [];
  const gallery = images.data?.backdrops.slice(0, 6) ?? [];
  const related = (recommendations.data?.results ?? [])
    .filter((item) => item.id !== movie?.id)
    .slice(0, 6);
  return (
    <div className="page-stack">
      <Link
        className="text-preview-accent-text underline"
        to="/catalog/popular/1"
      >
        {t('Voltar ao catálogo')}
      </Link>
      <QueryContent
        pending={details.isPending}
        error={details.error}
        empty={!movie}
        retry={() => {
          void details.refetch();
        }}
      >
        {movie && (
          <section className="detail-opening" aria-label={t('Ficha do filme')}>
            <div className="mx-auto w-full max-w-preview-card">
              <div className="aspect-preview-poster overflow-hidden rounded-preview-poster">
                <PosterImage
                  fill
                  className="size-full"
                  src={tmdbImageUrl(movie.poster_path)}
                  alt={movie.title}
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <SaveMovieButton id={movie.id} title={movie.title} />
            </div>
            <article className="page-intro min-w-0">
              <p className="eyebrow">
                {movie.release_date?.slice(0, 4) || t('Ano não informado')} ·{' '}
                {metadataLabel(movie.status ?? '') || t('Status não informado')}
              </p>
              <h1>{movie.title}</h1>
              {movie.tagline && (
                <p className="font-display text-preview-section text-preview-ink">
                  {movie.tagline}
                </p>
              )}
              <p>{movie.overview || t('Sinopse indisponível.')}</p>
              <p className="font-semibold text-preview-accent-text">
                {movie.vote_average === null
                  ? t('Sem nota')
                  : t('Nota {score} de 10', {
                      score: movie.vote_average.toFixed(1),
                    })}
              </p>
              <dl className="grid gap-4 sm:grid-cols-3">
                <div>
                  <dt>{t('Orçamento')}</dt>
                  <dd>
                    {movie.budget
                      ? money.format(movie.budget)
                      : t('Não informado')}
                  </dd>
                </div>
                <div>
                  <dt>{t('Receita')}</dt>
                  <dd>
                    {movie.revenue
                      ? money.format(movie.revenue)
                      : t('Não informada')}
                  </dd>
                </div>
                <div>
                  <dt>{t('Duração')}</dt>
                  <dd>
                    {movie.runtime
                      ? String(movie.runtime) + ' min'
                      : t('Não informada')}
                  </dd>
                </div>
              </dl>
              <nav
                aria-label={t('Gêneros do filme')}
                className="flex flex-wrap gap-2"
              >
                {movie.genres.map((genre) => (
                  <Link
                    className="chip"
                    key={genre.id}
                    to={
                      '/genres/' +
                      String(genre.id) +
                      '/' +
                      encodeURIComponent(genreName(genre))
                    }
                  >
                    {genreName(genre)}
                  </Link>
                ))}
              </nav>
            </article>
          </section>
        )}
      </QueryContent>
      {movie && (
        <>
          <section className="page-stack" aria-label="Trailer">
            <h2 className="section-title">{t('Antes de dar play')}</h2>
            <QueryContent
              pending={videos.isPending}
              error={videos.error}
              empty={!trailer}
              emptyTitle={t('Trailer indisponível')}
              retry={() => {
                void videos.refetch();
              }}
            >
              {trailer && (
                <Trailer
                  key={trailer.key}
                  videoKey={trailer.key}
                  title={movie.title}
                />
              )}
            </QueryContent>
          </section>
          <section className="page-stack" aria-label={t('Elenco')}>
            <h2 className="section-title">{t('Quem está em cena')}</h2>
            <QueryContent
              pending={credits.isPending}
              error={credits.error}
              empty={cast.length === 0}
              emptyTitle={t('Elenco não informado')}
              retry={() => {
                void credits.refetch();
              }}
            >
              <div className="poster-grid">
                {cast.map((person, index) => (
                  <PersonCard
                    key={String(person.id) + '-' + String(index)}
                    id={person.id}
                    name={person.name}
                    photo={person.profile_path}
                    character={person.character}
                  />
                ))}
              </div>
            </QueryContent>
          </section>
          <section className="page-stack" aria-label={t('Equipe')}>
            <h2 className="section-title">{t('Por trás da câmera')}</h2>
            {credits.error ? (
              <p>
                {t(
                  'Equipe indisponível. Use a nova tentativa da seção de elenco.',
                )}
              </p>
            ) : crew.length ? (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {crew.slice(0, 24).map((person) => (
                  <li key={person.credit_id}>
                    <Link
                      className="font-semibold text-preview-accent-text underline"
                      to={'/cast/' + String(person.id)}
                    >
                      {person.name}
                    </Link>
                    <p className="text-preview-caption text-preview-muted">
                      {metadataLabel(person.job)} ·{' '}
                      {metadataLabel(person.department)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState preview title={t('Equipe não informada')} />
            )}
          </section>
          <section className="page-stack" aria-label={t('Galeria')}>
            <h2 className="section-title">{t('Dentro do filme')}</h2>
            <QueryContent
              pending={images.isPending}
              error={images.error}
              empty={!gallery.length}
              emptyTitle={t('Sem imagens de cena')}
              retry={() => {
                void images.refetch();
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((image, index) => (
                  <div
                    className="aspect-video overflow-hidden rounded-preview-poster"
                    key={image.file_path ?? index}
                  >
                    <PosterImage
                      fill
                      className="size-full"
                      src={tmdbImageUrl(image.file_path)}
                      alt={t('Cena {number} de {title}', {
                        number: index + 1,
                        title: movie.title,
                      })}
                    />
                  </div>
                ))}
              </div>
            </QueryContent>
          </section>
          <section className="page-stack" aria-label={t('Recomendações')}>
            <h2 className="section-title">{t('A sessão pode continuar')}</h2>
            <QueryContent
              pending={recommendations.isPending}
              error={recommendations.error}
              empty={!related.length}
              emptyTitle={t('Sem recomendações por enquanto')}
              retry={() => {
                void recommendations.refetch();
              }}
            >
              <MovieGrid movies={related} />
            </QueryContent>
          </section>
        </>
      )}
    </div>
  );
}
