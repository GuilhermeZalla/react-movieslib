/**
 * Raw TMDB field names and nullable values used by the legacy screens.
 * Static contracts only: they do not validate JSON. Phase 3 will parse unknown
 * responses with schemas before exposing these models to the UI.
 */
export interface Genre {
  id: number;
  name: string;
}

export interface GenreList {
  genres: Genre[];
}

export interface Page<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MovieSummary {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string | null;
  release_date: string | null;
  vote_average: number | null;
  genre_ids: number[];
}

export interface PersonSummary {
  id: number;
  name: string;
  profile_path: string | null;
}

export type PersonGender = 0 | 1 | 2 | 3;

export interface PersonDetails extends PersonSummary {
  biography: string | null;
  birthday: string | null;
  deathday: string | null;
  known_for_department: string | null;
  gender: PersonGender;
  place_of_birth: string | null;
  imdb_id: string | null;
}

export interface CastMember extends PersonSummary {
  character: string | null;
}

export interface CrewMember extends PersonSummary {
  credit_id: string;
  department: string;
  job: string;
}

export interface MovieCredits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface MovieDetails extends Omit<MovieSummary, 'genre_ids'> {
  genres: Genre[];
  tagline: string | null;
  status: string | null;
  budget: number | null;
  revenue: number | null;
  runtime: number | null;
  /** Absent unless credits were appended; screens must handle that absence. */
  credits?: MovieCredits;
}

export interface PersonMovieCredits {
  cast: MovieSummary[];
  crew: (MovieSummary & {
    credit_id: string;
    department: string;
    job: string;
  })[];
}

export type MoviePage = Page<MovieSummary>;
export type PersonPage = Page<PersonSummary>;
