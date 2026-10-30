import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/useLocale';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { MovieSummary } from '../../api/tmdb/schemas';
import { tmdbImageUrl } from '../../api/tmdb/client';
import PosterImage from '../base/PosterImage';
import SaveMovieButton from '../base/SaveMovieButton';

interface Props {
  movies: MovieSummary[];
  pending: boolean;
}

export default function PopularHero({ movies, pending }: Props) {
  useLocale();
  const slides = movies.slice(0, 6);
  const [index, setIndex] = useState(0);
  // Reduced motion changes the CSS transition, never the automatic start.
  const rotating = slides.length > 1;
  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      7000,
    );
    return () => window.clearInterval(timer);
  }, [rotating, slides.length, index]);
  const currentIndex = index % Math.max(1, slides.length);
  const movie = slides[currentIndex];
  const select = (next: number) => {
    setIndex((next + slides.length) % slides.length);
  };
  return (
    <section
      aria-label={t('Destaque')}
      aria-roledescription={t('carrossel')}
      className="feature-hero"
    >
      {movie && (
        <div className="feature-hero__image" key={movie.id}>
          <PosterImage
            fill
            src={tmdbImageUrl(movie.backdrop_path ?? movie.poster_path)}
            alt={movie.title}
            loading="eager"
            fetchPriority={currentIndex === 0 ? 'high' : 'auto'}
            className="size-full"
            placeholder=""
          />
        </div>
      )}
      <div
        className="feature-hero__body"
        aria-live={rotating ? 'off' : 'polite'}
        aria-atomic="true"
      >
        <p className="feature-hero__eyebrow">
          <span aria-hidden="true" />
          {t('No radar · populares agora')}
        </p>
        <h1
          aria-label={movie?.title}
          className={
            pending
              ? 'feature-hero__title animate-pulse motion-reduce:animate-none'
              : 'feature-hero__title'
          }
        >
          {movie?.title ?? t('Seu próximo filme começa aqui.')}
        </h1>
        {movie && (
          <div className="feature-hero__meta">
            <span>
              {movie.release_date?.slice(0, 4) || t('Ano não informado')}
            </span>
            <span aria-hidden="true">/</span>
            <span>
              {movie.vote_average === null
                ? t('Sem nota')
                : t('Nota {score} de 10', {
                    score: movie.vote_average.toFixed(1),
                  })}
            </span>
            <span className="feature-hero__tag">{t('Cinema')}</span>
          </div>
        )}
        <p className="feature-hero__synopsis">
          {movie
            ? movie.overview || t('Sinopse indisponível.')
            : t(
                'Grandes histórias, novos encontros. Explore o catálogo e encontre a sua próxima sessão.',
              )}
        </p>
        <div className="feature-hero__actions">
          <Link
            to={movie ? `/movie-details/${movie.id}` : '/catalog/popular/1'}
            className="button-primary"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 12h16m-6-6 6 6-6 6" />
            </svg>
            {movie ? t('Ver detalhes') : t('Explorar filmes')}
          </Link>
          {movie && (
            <SaveMovieButton
              id={movie.id}
              title={movie.title}
              fullWidth={false}
            />
          )}
        </div>
      </div>
      {slides.length > 1 && (
        <p className="sr-only" role="status">
          {t('Troca automática a cada 7 segundos.')}
        </p>
      )}
      {slides.length > 1 && (
        <div className="feature-hero__controls">
          <div className="feature-hero__pages" aria-hidden="true">
            {slides.map((slide, position) => (
              <span
                key={slide.id}
                className="feature-page"
                data-active={position === currentIndex ? 'true' : undefined}
              >
                <span />
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="feature-hero__counter" aria-hidden="true">
              {String(currentIndex + 1).padStart(2, '0')} /{' '}
              {String(slides.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              className="cinema-icon-button"
              aria-label={t('Destaque anterior')}
              onClick={() => select(currentIndex - 1)}
            >
              ←
            </button>
            <button
              type="button"
              className="cinema-icon-button"
              aria-label={t('Próximo destaque')}
              onClick={() => select(currentIndex + 1)}
            >
              →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
