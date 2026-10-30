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
const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
export default function MovieDetails() {
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
  usePageTitle(movie?.title ?? 'Filme');
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
        Voltar ao catálogo
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
          <section className="detail-opening" aria-label="Ficha do filme">
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
                {movie.release_date?.slice(0, 4) || 'Ano não informado'} ·{' '}
                {movie.status || 'Status não informado'}
              </p>
              <h1>{movie.title}</h1>
              {movie.tagline && (
                <p className="font-display text-preview-section text-preview-ink">
                  {movie.tagline}
                </p>
              )}
              <p>{movie.overview || 'Sinopse indisponível.'}</p>
              <p className="font-semibold text-preview-accent-text">
                {movie.vote_average === null
                  ? 'Sem nota'
                  : 'Nota ' + movie.vote_average.toFixed(1) + ' de 10'}
              </p>
              <dl className="grid gap-4 sm:grid-cols-3">
                <div>
                  <dt>Orçamento</dt>
                  <dd>
                    {movie.budget
                      ? money.format(movie.budget)
                      : 'Não informado'}
                  </dd>
                </div>
                <div>
                  <dt>Receita</dt>
                  <dd>
                    {movie.revenue
                      ? money.format(movie.revenue)
                      : 'Não informada'}
                  </dd>
                </div>
                <div>
                  <dt>Duração</dt>
                  <dd>
                    {movie.runtime
                      ? String(movie.runtime) + ' min'
                      : 'Não informada'}
                  </dd>
                </div>
              </dl>
              <nav
                aria-label="Gêneros do filme"
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
                      encodeURIComponent(genre.name)
                    }
                  >
                    {genre.name}
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
            <h2 className="section-title">Antes de dar play</h2>
            <QueryContent
              pending={videos.isPending}
              error={videos.error}
              empty={!trailer}
              emptyTitle="Trailer indisponível"
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
          <section className="page-stack" aria-label="Elenco">
            <h2 className="section-title">Quem está em cena</h2>
            <QueryContent
              pending={credits.isPending}
              error={credits.error}
              empty={cast.length === 0}
              emptyTitle="Elenco não informado"
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
          <section className="page-stack" aria-label="Equipe">
            <h2 className="section-title">Por trás da câmera</h2>
            {credits.error ? (
              <p>
                Equipe indisponível. Use a nova tentativa da seção de elenco.
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
                      {person.job} · {person.department}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState preview title="Equipe não informada" />
            )}
          </section>
          <section className="page-stack" aria-label="Galeria">
            <h2 className="section-title">Dentro do filme</h2>
            <QueryContent
              pending={images.isPending}
              error={images.error}
              empty={!gallery.length}
              emptyTitle="Sem imagens de cena"
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
                      alt={'Cena ' + String(index + 1) + ' de ' + movie.title}
                    />
                  </div>
                ))}
              </div>
            </QueryContent>
          </section>
          <section className="page-stack" aria-label="Recomendações">
            <h2 className="section-title">A sessão pode continuar</h2>
            <QueryContent
              pending={recommendations.isPending}
              error={recommendations.error}
              empty={!related.length}
              emptyTitle="Sem recomendações por enquanto"
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
