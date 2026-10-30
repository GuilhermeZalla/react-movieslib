import { genreName } from '../../i18n/metadata';
import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/useLocale';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { movieListQuery, genresQuery } from '../../api/tmdb/queries';
import { TmdbError } from '../../api/tmdb/client';
import MovieCard from '../../components/base/MovieCard';
import Skeleton from '../../components/base/Skeleton';
import EmptyState from '../../components/base/EmptyState';
import ErrorState from '../../components/base/ErrorState';
import QueryContent from '../../components/base/QueryContent';
import PopularHero from '../../components/movies/PopularHero';
import { usePageTitle } from '../../hooks/usePageTitle';

const isEmptyError = (error: unknown) =>
  error instanceof TmdbError && error.kind === 'empty';
const SectionHeader = ({ title, href }: { title: string; href: string }) => {
  useLocale();
  return (
    <div className="home-section__heading">
      <h2>{title}</h2>
      <Link to={href}>
        {t('Ver mais')}
        <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
};

const Carousel = ({ children }: { children: React.ReactNode }) => {
  useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (direction: -1 | 1) => {
    const element = ref.current;
    if (!element) return;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    element.scrollBy({
      left: direction * element.clientWidth * 0.8,
      behavior: reduced ? 'auto' : 'smooth',
    });
  };
  return (
    <div className="home-reel">
      <div
        ref={ref}
        role="region"
        aria-label={t('Filmes populares')}
        className="home-reel__track"
      >
        {children}
      </div>
      <div className="home-reel__controls">
        <button
          type="button"
          className="cinema-icon-button"
          aria-label={t('Anterior')}
          onClick={() => scroll(-1)}
        >
          ←
        </button>
        <button
          type="button"
          className="cinema-icon-button"
          aria-label={t('Próximo')}
          onClick={() => scroll(1)}
        >
          →
        </button>
      </div>
    </div>
  );
};
export default function Home() {
  useLocale();
  usePageTitle('MoviesLib');
  const nowPlaying = useQuery(movieListQuery('now_playing', 1));
  const popular = useQuery(movieListQuery('popular', 1));
  const topRated = useQuery(movieListQuery('top_rated', 1));
  const genres = useQuery(genresQuery());
  const np = isEmptyError(nowPlaying.error)
    ? []
    : (nowPlaying.data?.results ?? []);
  const pop = isEmptyError(popular.error) ? [] : (popular.data?.results ?? []);
  const tr = isEmptyError(topRated.error) ? [] : (topRated.data?.results ?? []);
  return (
    <div className="home-cinema">
      <PopularHero movies={pop} pending={popular.isPending} />
      <section aria-label={t('Em cartaz')} className="home-section">
        <SectionHeader title={t('Em cartaz')} href="/catalog/now_playing/1" />
        <QueryContent
          pending={nowPlaying.isPending}
          error={nowPlaying.error}
          empty={!np.length}
          emptyTitle={t('Nada em cartaz')}
          retry={() => {
            void nowPlaying.refetch();
          }}
        >
          <div className="home-poster-grid">
            {np.slice(0, 6).map((movie) => (
              <MovieCard
                key={movie.id}
                movieId={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                vote={movie.vote_average?.toFixed(1) ?? null}
                saveable
              />
            ))}
          </div>
        </QueryContent>
      </section>
      <section aria-label={t('Populares')} className="home-section">
        <SectionHeader
          title={t('Todo mundo está vendo')}
          href="/catalog/popular/1"
        />
        <QueryContent
          pending={popular.isPending}
          error={popular.error}
          empty={!pop.length}
          emptyTitle={t('Sem populares')}
          retry={() => {
            void popular.refetch();
          }}
        >
          <Carousel>
            {pop.slice(0, 12).map((movie, index) => (
              <div key={movie.id} className="home-reel__item">
                <MovieCard
                  movieId={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  vote={movie.vote_average?.toFixed(1) ?? null}
                  rank={index + 1}
                  saveable
                />
              </div>
            ))}
          </Carousel>
        </QueryContent>
      </section>
      <section aria-label={t('Mais bem avaliados')} className="home-section">
        <SectionHeader
          title={t('Vale cada minuto')}
          href="/catalog/top_rated/1"
        />
        <QueryContent
          pending={topRated.isPending}
          error={topRated.error}
          empty={!tr.length}
          emptyTitle={t('Sem resultados')}
          retry={() => {
            void topRated.refetch();
          }}
        >
          <div className="home-poster-grid">
            {tr.slice(0, 6).map((movie) => (
              <MovieCard
                key={movie.id}
                movieId={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                vote={movie.vote_average?.toFixed(1) ?? null}
                saveable
              />
            ))}
          </div>
        </QueryContent>
      </section>
      <section aria-label={t('Gêneros')} className="home-genres">
        <div>
          <p className="eyebrow">{t('Cada humor, um caminho')}</p>
          <h2>{t('Qual é a sua hoje?')}</h2>
        </div>
        <div className="home-genres__links">
          {genres.isPending &&
            Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} variant="chip" />
            ))}
          {genres.isError && (
            <ErrorState
              preview
              message={t('Não foi possível carregar os gêneros.')}
              onRetry={() => {
                void genres.refetch();
              }}
            />
          )}
          {!genres.isPending &&
            !genres.isError &&
            !genres.data.genres.length && (
              <EmptyState
                preview
                title={t('Nenhum gênero por aqui')}
                message={t('A lista volta em outra sessão.')}
              />
            )}
          {genres.data?.genres.slice(0, 10).map((genre) => (
            <Link
              key={genre.id}
              className="home-genre"
              to={`/genres/${genre.id}/${encodeURIComponent(genreName(genre))}`}
            >
              {genreName(genre)}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
