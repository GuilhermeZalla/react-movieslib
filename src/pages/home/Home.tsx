import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { movieListQuery, genresQuery } from '../../api/tmdb/queries';
import { TmdbError, tmdbImageUrl } from '../../api/tmdb/client';
import MovieCard from '../../components/base/MovieCard';
import PosterImage from '../../components/base/PosterImage';
import Skeleton from '../../components/base/Skeleton';
import EmptyState from '../../components/base/EmptyState';
import ErrorState from '../../components/base/ErrorState';

const isEmptyError = (error: unknown) =>
  error instanceof TmdbError && error.kind === 'empty';

const Ring = ({ vote }: { vote: number | null }) => {
  const value = vote !== null ? Math.round(vote * 10) : 0;
  const circumference = 2 * Math.PI * 14;
  const dash = (value / 100) * circumference;
  return (
    <span
      className="relative inline-flex size-10 items-center justify-center"
      role="img"
      aria-label={vote !== null ? `Nota ${vote.toFixed(1)} de 10` : 'Sem nota'}
    >
      <svg
        viewBox="0 0 32 32"
        className="size-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke="var(--color-preview-line)"
          strokeWidth="3"
        />
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke="var(--color-preview-accent-text)"
          strokeWidth="3"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-preview-caption font-bold text-preview-accent-text">
        {vote !== null ? vote.toFixed(1) : '—'}
      </span>
    </span>
  );
};

const SectionHeader = ({ title, href }: { title: string; href: string }) => (
  <div className="flex items-baseline justify-between gap-3">
    <h2 className="font-preview-bricolage text-preview-section font-bold text-preview-ink">
      {title}
    </h2>
    <Link
      to={href}
      className="text-preview-caption font-bold text-preview-accent-text hover:underline"
    >
      Ver mais
    </Link>
  </div>
);

const Carousel = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    el.scrollBy({
      left: dir * el.clientWidth * 0.8,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };
  return (
    <div className="relative min-w-0">
      <div
        ref={ref}
        role="region"
        aria-label={label}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 motion-reduce:scroll-auto"
      >
        {children}
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => scroll(-1)}
          className="min-h-11 min-w-11 rounded-preview-control border border-preview-line px-3 py-1 text-preview-caption text-preview-muted hover:text-preview-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-preview-accent-text"
        >
          ← Anterior
        </button>
        <button
          type="button"
          aria-label="Próximo"
          onClick={() => scroll(1)}
          className="min-h-11 min-w-11 rounded-preview-control border border-preview-line px-3 py-1 text-preview-caption text-preview-muted hover:text-preview-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-preview-accent-text"
        >
          Próximo →
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const nowPlaying = useQuery(movieListQuery('now_playing', 1));
  const popular = useQuery(movieListQuery('popular', 1));
  const topRated = useQuery(movieListQuery('top_rated', 1));
  const genres = useQuery(genresQuery());

  // Query retains previous data after a failed refetch; an explicit empty
  // response must still replace it with the section's empty state.
  const np = isEmptyError(nowPlaying.error)
    ? []
    : (nowPlaying.data?.results ?? []);
  const pop = isEmptyError(popular.error) ? [] : (popular.data?.results ?? []);
  const tr = isEmptyError(topRated.error) ? [] : (topRated.data?.results ?? []);
  const opening = np[0] ?? null;
  const openingPoster = opening ? tmdbImageUrl(opening.poster_path) : null;

  return (
    <div className="grid min-w-0 gap-12">
      <section
        aria-label="Destaque"
        className="grid gap-6 md:grid-cols-5 md:items-center"
      >
        <div className="mx-auto w-full max-w-preview-card md:col-span-2">
          {opening ? (
            <div className="aspect-preview-poster overflow-hidden rounded-preview-poster bg-preview-surface">
              {openingPoster ? (
                <PosterImage
                  src={openingPoster}
                  alt={opening.title}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  className="size-full object-cover"
                />
              ) : (
                <div className="grid size-full place-items-center text-preview-muted">
                  Sem pôster
                </div>
              )}
            </div>
          ) : nowPlaying.isLoading ? (
            <Skeleton variant="poster" />
          ) : (
            <div className="aspect-preview-poster grid place-items-center rounded-preview-poster bg-preview-surface text-preview-muted">
              Sem destaque
            </div>
          )}
        </div>
        <div className="grid min-w-0 gap-4 md:col-span-3">
          <p className="text-preview-caption font-bold uppercase tracking-wide text-preview-accent-text">
            Em cartaz agora
          </p>
          <h1 className="wrap-break-word font-preview-bricolage text-preview-display font-extrabold leading-tight text-preview-ink">
            {opening ? opening.title : 'A tela acende.'}
          </h1>
          {opening && (
            <p className="max-w-prose text-preview-body text-preview-muted">
              {opening.overview || 'Sinopse indisponível.'}
            </p>
          )}
          {opening && (
            <div className="flex items-center gap-4">
              <Ring vote={opening.vote_average} />
              <Link
                to={`/movie-details/${opening.id}`}
                className="inline-flex min-h-11 items-center rounded-preview-control bg-preview-accent px-4 py-2 text-preview-body font-bold text-preview-on-accent hover:bg-preview-accent-hover active:bg-preview-accent-pressed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-preview-accent-text"
              >
                Ver detalhes
              </Link>
            </div>
          )}
        </div>
      </section>

      <section aria-label="Em cartaz" className="grid gap-4">
        <SectionHeader title="Em cartaz" href="/catalog/now_playing/1" />
        {nowPlaying.isLoading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="poster" />
            ))}
          </div>
        )}
        {nowPlaying.isError && !isEmptyError(nowPlaying.error) && (
          <ErrorState
            preview
            message="Não foi possível carregar os filmes em cartaz."
            onRetry={() => {
              void nowPlaying.refetch();
            }}
          />
        )}
        {!nowPlaying.isLoading &&
          (!nowPlaying.isError || isEmptyError(nowPlaying.error)) &&
          np.length === 0 && (
            <EmptyState
              preview
              title="Nada em cartaz"
              message="Tente novamente mais tarde."
            />
          )}
        {!nowPlaying.isLoading && !nowPlaying.isError && np.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {np.slice(0, 4).map((m) => (
              <MovieCard
                key={m.id}
                movieId={m.id}
                title={m.title}
                vote={m.vote_average?.toFixed(1) ?? null}
                posterPath={m.poster_path}
              />
            ))}
          </div>
        )}
      </section>

      <section aria-label="Populares" className="grid min-w-0 gap-4">
        <SectionHeader
          title="Todo mundo está vendo"
          href="/catalog/popular/1"
        />
        {popular.isLoading && (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-44 shrink-0">
                <Skeleton variant="poster" />
              </div>
            ))}
          </div>
        )}
        {popular.isError && !isEmptyError(popular.error) && (
          <ErrorState
            preview
            message="Não foi possível carregar os populares."
            onRetry={() => {
              void popular.refetch();
            }}
          />
        )}
        {!popular.isLoading &&
          (!popular.isError || isEmptyError(popular.error)) &&
          pop.length === 0 && (
            <EmptyState
              preview
              title="Sem populares"
              message="Tente novamente mais tarde."
            />
          )}
        {!popular.isLoading && !popular.isError && pop.length > 0 && (
          <Carousel label="Filmes populares">
            {pop.map((m, i) => (
              <div key={m.id} className="w-44 shrink-0 snap-start">
                <MovieCard
                  movieId={m.id}
                  title={m.title}
                  vote={m.vote_average?.toFixed(1) ?? null}
                  rank={i + 1}
                  posterPath={m.poster_path}
                />
              </div>
            ))}
          </Carousel>
        )}
      </section>

      <section aria-label="Mais bem avaliados" className="grid gap-4">
        <SectionHeader title="Mais bem avaliados" href="/catalog/top_rated/1" />
        {topRated.isLoading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="poster" />
            ))}
          </div>
        )}
        {topRated.isError && !isEmptyError(topRated.error) && (
          <ErrorState
            preview
            message="Não foi possível carregar os mais bem avaliados."
            onRetry={() => {
              void topRated.refetch();
            }}
          />
        )}
        {!topRated.isLoading &&
          (!topRated.isError || isEmptyError(topRated.error)) &&
          tr.length === 0 && (
            <EmptyState
              preview
              title="Sem resultados"
              message="Tente novamente mais tarde."
            />
          )}
        {!topRated.isLoading && !topRated.isError && tr.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {tr.slice(0, 4).map((m) => (
              <MovieCard
                key={m.id}
                movieId={m.id}
                title={m.title}
                vote={m.vote_average?.toFixed(1) ?? null}
                posterPath={m.poster_path}
              />
            ))}
          </div>
        )}
      </section>

      <section aria-label="Gêneros" className="grid gap-3">
        <h2 className="font-preview-bricolage text-preview-card font-bold text-preview-ink">
          Explore por gênero
        </h2>
        {genres.isLoading && (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height="2rem" width="6rem" />
            ))}
          </div>
        )}
        {genres.isError && (
          <ErrorState
            preview
            message="Não foi possível carregar os gêneros."
            onRetry={() => {
              void genres.refetch();
            }}
          />
        )}
        {!genres.isLoading &&
          !genres.isError &&
          (genres.data?.genres ?? []).length === 0 && (
            <EmptyState
              preview
              title="Nenhum gênero por aqui"
              message="A lista volta em outra sessão."
            />
          )}
        {!genres.isLoading &&
          !genres.isError &&
          (genres.data?.genres ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(genres.data?.genres ?? []).slice(0, 12).map((g) => (
                <Link
                  key={g.id}
                  to={`/genres/${g.id}/${encodeURIComponent(g.name)}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-preview-line bg-preview-surface px-3 py-1 text-preview-caption text-preview-ink hover:bg-preview-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-preview-accent-text"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          )}
      </section>
    </div>
  );
};

export default Home;
