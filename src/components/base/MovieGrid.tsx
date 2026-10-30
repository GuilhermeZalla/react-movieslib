import type { MovieSummary } from '../../api/tmdb/schemas';
import MovieCard from './MovieCard';
export default function MovieGrid({ movies }: { movies: MovieSummary[] }) {
  return (
    <div className="poster-grid">
      {movies.map((movie) => (
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
  );
}
