import { Link } from 'react-router-dom';
import { tmdbImageUrl } from '../../api/tmdb/client';
import PosterImage from './PosterImage';
export default function PersonCard({
  id,
  name,
  photo,
  character,
}: {
  id: number;
  name: string;
  photo: string | null;
  character?: string | null;
}) {
  return (
    <article className="min-w-0">
      <Link
        to={`/cast/${id}`}
        className="group relative block rounded-preview-control"
      >
        <div className="aspect-preview-poster overflow-hidden rounded-preview-poster bg-preview-surface">
          <PosterImage
            fill
            className="size-full"
            src={tmdbImageUrl(photo)}
            alt=""
            placeholder="Sem retrato"
          />
        </div>
        <h3 className="mt-2 wrap-break-word font-display text-preview-card font-bold group-hover:text-preview-accent-text">
          {name}
        </h3>
        {character && (
          <p className="text-preview-caption text-preview-muted">{character}</p>
        )}
      </Link>
    </article>
  );
}
