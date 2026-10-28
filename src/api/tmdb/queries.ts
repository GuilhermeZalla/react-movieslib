import { queryOptions } from '@tanstack/react-query';
import {
  idParameterSchema,
  movieListRequestSchema,
  pageParameterSchema,
  searchInputSchema,
} from '../../../shared/tmdbRequest';
import {
  getGenres,
  getMovie,
  getMovieCredits,
  getMovies,
  getPeople,
  getPerson,
  getPersonCredits,
  getTrending,
  searchMovies,
  searchPeople,
  validateRequest,
  type MovieCategory,
} from './client';

export function movieListQuery(
  category: MovieCategory,
  page: number | string = 1,
) {
  const input = validateRequest(movieListRequestSchema, {
    category,
    page: String(page),
  });
  return queryOptions({
    queryKey: ['tmdb', 'movie', 'list', input.category, input.page] as const,
    queryFn: ({ signal }) => getMovies(input.category, input.page, { signal }),
  });
}
export function trendingQuery(page: number | string = 1) {
  const value = validateRequest(pageParameterSchema, String(page));
  return queryOptions({
    queryKey: ['tmdb', 'movie', 'trending', 'day', value] as const,
    queryFn: ({ signal }) => getTrending(value, { signal }),
  });
}
export function peopleQuery(page: number | string = 1) {
  const value = validateRequest(pageParameterSchema, String(page));
  return queryOptions({
    queryKey: ['tmdb', 'person', 'list', 'popular', value] as const,
    queryFn: ({ signal }) => getPeople(value, { signal }),
  });
}
export function movieSearchQuery(term: string, page: number | string = 1) {
  const query = validateRequest(searchInputSchema, term);
  const value = validateRequest(pageParameterSchema, String(page));
  return queryOptions({
    queryKey: ['tmdb', 'movie', 'search', query, value] as const,
    enabled: query.length > 0,
    queryFn: ({ signal }) => searchMovies(query, value, { signal }),
  });
}
export function personSearchQuery(term: string, page: number | string = 1) {
  const query = validateRequest(searchInputSchema, term);
  const value = validateRequest(pageParameterSchema, String(page));
  return queryOptions({
    queryKey: ['tmdb', 'person', 'search', query, value] as const,
    enabled: query.length > 0,
    queryFn: ({ signal }) => searchPeople(query, value, { signal }),
  });
}
export function genresQuery() {
  return queryOptions({
    queryKey: ['tmdb', 'genre', 'movie', 'list'] as const,
    queryFn: ({ signal }) => getGenres({ signal }),
  });
}
export function movieQuery(id: number | string) {
  const value = validateRequest(idParameterSchema, String(id));
  return queryOptions({
    queryKey: ['tmdb', 'movie', 'detail', value, 'credits'] as const,
    queryFn: ({ signal }) => getMovie(value, { signal }),
  });
}
export function movieCreditsQuery(id: number | string) {
  const value = validateRequest(idParameterSchema, String(id));
  return queryOptions({
    queryKey: ['tmdb', 'movie', 'credits', value] as const,
    queryFn: ({ signal }) => getMovieCredits(value, { signal }),
  });
}
export function personQuery(id: number | string) {
  const value = validateRequest(idParameterSchema, String(id));
  return queryOptions({
    queryKey: ['tmdb', 'person', 'detail', value] as const,
    queryFn: ({ signal }) => getPerson(value, { signal }),
  });
}
export function personCreditsQuery(id: number | string) {
  const value = validateRequest(idParameterSchema, String(id));
  return queryOptions({
    queryKey: ['tmdb', 'person', 'movie_credits', value] as const,
    queryFn: ({ signal }) => getPersonCredits(value, { signal }),
  });
}
