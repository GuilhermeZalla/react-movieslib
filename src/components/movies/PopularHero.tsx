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
  const slides = movies.slice(0, 6);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    change();
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    const change = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', change);
    return () => document.removeEventListener('visibilitychange', change);
  }, []);
  const rotating =
    slides.length > 1 && !paused && !hovered && !focused && !hidden && !reduced;
  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      7000,
    );
    return () => window.clearInterval(timer);
  }, [rotating, slides.length]);
  const currentIndex = index % Math.max(1, slides.length);
  const movie = slides[currentIndex];
  const select = (next: number) => {
    setIndex((next + slides.length) % slides.length);
    setPaused(true);
  };
  return (
    <section
      aria-label="Destaque"
      aria-roledescription="carrossel"
      className="feature-hero"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
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
          No radar · populares agora
        </p>
        <h1
          aria-label={movie?.title}
          className={
            pending
              ? 'feature-hero__title animate-pulse motion-reduce:animate-none'
              : 'feature-hero__title'
          }
        >
          {movie?.title ?? 'Seu próximo filme começa aqui.'}
        </h1>
        {movie && (
          <div className="feature-hero__meta">
            <span>
              {movie.release_date?.slice(0, 4) || 'Ano não informado'}
            </span>
            <span aria-hidden="true">/</span>
            <span>
              {movie.vote_average === null
                ? 'Sem nota'
                : `Nota ${movie.vote_average.toFixed(1)} de 10`}
            </span>
            <span className="feature-hero__tag">Cinema</span>
          </div>
        )}
        <p className="feature-hero__synopsis">
          {movie
            ? movie.overview || 'Sinopse indisponível.'
            : 'Grandes histórias, novos encontros. Explore o catálogo e encontre a sua próxima sessão.'}
        </p>
        <div
          className="feature-hero__actions"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Link
            to={movie ? `/movie-details/${movie.id}` : '/catalog/popular/1'}
            className="button-primary"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="m8 5 11 7-11 7V5Z" />
            </svg>
            {movie ? 'Ver detalhes' : 'Explorar filmes'}
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
        <div
          className="feature-hero__controls"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="feature-hero__pages" aria-label="Escolher destaque">
            {slides.map((slide, position) => (
              <button
                key={slide.id}
                type="button"
                className="feature-page"
                aria-label={`Mostrar destaque ${position + 1}: ${slide.title}`}
                aria-current={position === currentIndex ? 'true' : undefined}
                onClick={() => select(position)}
              >
                <span />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="feature-hero__counter" aria-hidden="true">
              {String(currentIndex + 1).padStart(2, '0')} /{' '}
              {String(slides.length).padStart(2, '0')}
            </span>
            {!reduced && (
              <button
                type="button"
                className="cinema-icon-button"
                aria-label={
                  paused
                    ? 'Retomar destaques automáticos'
                    : 'Pausar destaques automáticos'
                }
                onClick={() => {
                  setPaused((value) => !value);
                  setFocused(false);
                  setHovered(false);
                }}
              >
                {paused ? (
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="m8 5 11 7-11 7V5Z" />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                  </svg>
                )}
              </button>
            )}
            <button
              type="button"
              className="cinema-icon-button"
              aria-label="Destaque anterior"
              onClick={() => select(currentIndex - 1)}
            >
              ←
            </button>
            <button
              type="button"
              className="cinema-icon-button"
              aria-label="Próximo destaque"
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
