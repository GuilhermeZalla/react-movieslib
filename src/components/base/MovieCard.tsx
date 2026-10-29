import { tmdbImageUrl } from '../../api/tmdb/client';
import PosterImage from './PosterImage';
import type { ReactNode } from 'react';

interface MovieCardProps {
  posterPath?: string | null;
  title: string;
  vote?: string | null;
  movieId: number;
  onClick?: () => void;
  rank?: number;
  artwork?: ReactNode;
}

const MovieCard = ({
  posterPath,
  title,
  vote,
  movieId,
  onClick,
  rank,
  artwork,
}: MovieCardProps) => {
  return (
    <article className="group w-full max-w-preview-card font-body">
      <a
        href={`/movie-details/${movieId}`}
        onClick={onClick}
        className="relative block rounded-preview-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-preview-accent-text"
      >
        <div className="flex items-end gap-1">
          {rank !== undefined && (
            <>
              <span className="sr-only">Posição {rank}. </span>
              <span
                aria-hidden="true"
                className="font-display text-preview-rank font-extrabold leading-none text-preview-muted"
              >
                {String(rank).padStart(2, '0')}
              </span>
            </>
          )}
          <div className="aspect-preview-poster min-w-0 flex-1 overflow-hidden rounded-preview-poster bg-preview-surface transition-transform duration-preview ease-preview group-hover:-translate-y-1 group-focus-within:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none">
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
          </div>
        </div>
        <div className="mt-2 flex items-start justify-between gap-2">
          <h3 className="min-w-0 wrap-break-word font-display text-preview-card font-bold leading-tight text-preview-ink group-hover:text-preview-accent-text group-focus-within:text-preview-accent-text">
            {title}
          </h3>
          {vote && (
            <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-preview-accent-text font-body text-preview-caption font-bold text-preview-accent-text">
              <span aria-hidden="true">{vote}</span>
              <span className="sr-only">Nota {vote} de 10</span>
            </span>
          )}
        </div>
      </a>
    </article>
  );
};

export default MovieCard;
