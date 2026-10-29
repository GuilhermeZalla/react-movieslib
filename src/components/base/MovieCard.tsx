import { tmdbImageUrl } from '../../api/tmdb/client';
import PosterImage from './PosterImage';
import Badge from './Badge';

interface MovieCardProps {
  posterPath?: string | null;
  title: string;
  vote?: string | null;
  movieId: number;
  onClick?: () => void;
}

const MovieCard = ({
  posterPath,
  title,
  vote,
  movieId,
  onClick,
}: MovieCardProps) => {
  return (
    <article className="flex flex-col gap-2">
      <a
        href={`/movie-details/${movieId}`}
        onClick={onClick}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={title}
      >
        <PosterImage
          src={posterPath ? tmdbImageUrl(posterPath) : null}
          alt={title}
          width={190}
          height={285}
        />
      </a>
      <h3 className="font-body text-card text-ink">{title}</h3>
      {vote && <Badge variant="neutral">{vote}</Badge>}
    </article>
  );
};

export default MovieCard;
