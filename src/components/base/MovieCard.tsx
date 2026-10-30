import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { tmdbImageUrl } from '../../api/tmdb/client';
import PosterImage from './PosterImage';
import SaveMovieButton from './SaveMovieButton';
interface MovieCardProps {
  posterPath?: string | null;
  title: string;
  vote?: string | null;
  movieId: number;
  onClick?: () => void;
  rank?: number;
  artwork?: ReactNode;
  saveable?: boolean;
}
export default function MovieCard({
  posterPath,
  title,
  vote,
  movieId,
  onClick,
  rank,
  artwork,
  saveable = false,
}: MovieCardProps) {
  return (
    <article className="movie-card">
      <Link
        to={`/movie-details/${movieId}`}
        onClick={onClick}
        className="movie-card__link focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-preview-accent-text"
      >
        {rank !== undefined && (
          <span className="sr-only">Posição {rank}. </span>
        )}
        <div className="movie-card__poster aspect-preview-poster">
          {artwork ? (
            <div aria-hidden="true" className="size-full">
              {artwork}
            </div>
          ) : (
            <PosterImage
              src={posterPath ? tmdbImageUrl(posterPath) : null}
              alt={title}
              fill
              className="size-full"
            />
          )}
          {rank !== undefined && (
            <span aria-hidden="true" className="movie-card__rank">
              {String(rank).padStart(2, '0')}
            </span>
          )}
        </div>
        <div className="movie-card__info">
          <h3 className="movie-card__title">{title}</h3>
          {vote && (
            <span className="movie-card__score">
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="m12 2 3 6.3 7 .9-5.1 5 1.2 7L12 18l-6.1 3.2 1.2-7L2 9.2l7-.9L12 2Z" />
              </svg>
              <span aria-hidden="true">{vote}</span>
              <span className="sr-only">Nota {vote} de 10</span>
            </span>
          )}
        </div>
      </Link>
      {saveable && (
        <div className="movie-card__save">
          <SaveMovieButton id={movieId} title={title} compact />
        </div>
      )}
    </article>
  );
}
