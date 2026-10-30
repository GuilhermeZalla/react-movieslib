import { queryOptions } from '@tanstack/react-query';
import {
  idParameterSchema,
  movieListRequestSchema,
  pageParameterSchema,
  searchInputSchema,
} from '../../../shared/tmdbRequest';
import {
  discoverMovies,
  getMovieVideos,
  getMovieImages,
  getRecommendations,
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
import {
  discoverRequestSchema,
  type DiscoverInput,
} from '../../../shared/tmdbRequest';
import type { MoviePage, PersonPage } from './schemas';

export function movieListQuery(
  category: MovieCategory,
  page: number | string = 1,
) {
  const input = validateRequest(movieListRequestSchema, {
    category,
    page: String(page),
  });
  return queryOptions<MoviePage>({
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
  return queryOptions<PersonPage>({
    queryKey: ['tmdb', 'person', 'list', 'popular', value] as const,
    queryFn: ({ signal }) => getPeople(value, { signal }),
  });
}
export function movieSearchQuery(term: string, page: number | string = 1) {
  const query = validateRequest(searchInputSchema, term);
  const value = validateRequest(pageParameterSchema, String(page));
  return queryOptions<MoviePage>({
    queryKey: ['tmdb', 'movie', 'search', query, value] as const,
    enabled: query.length > 0,
    queryFn: ({ signal }) => searchMovies(query, value, { signal }),
  });
}
export function personSearchQuery(term: string, page: number | string = 1) {
  const query = validateRequest(searchInputSchema, term);
  const value = validateRequest(pageParameterSchema, String(page));
  return queryOptions<PersonPage>({
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

export function discoverQuery(input: DiscoverInput) {
  const parsed = validateRequest(discoverRequestSchema, input);
  return queryOptions<MoviePage>({
    queryKey: ['tmdb', 'movie', 'discover', parsed] as const,
    queryFn: ({ signal }) => discoverMovies(input, { signal }),
  });
}
export function movieVideosQuery(id: number | string) {
  const value = validateRequest(idParameterSchema, String(id));
  return queryOptions({
    queryKey: ['tmdb', 'movie', 'videos', value] as const,
    queryFn: ({ signal }) => getMovieVideos(value, { signal }),
  });
}
export function movieImagesQuery(id: number | string) {
  const value = validateRequest(idParameterSchema, String(id));
  return queryOptions({
    queryKey: ['tmdb', 'movie', 'images', value] as const,
    queryFn: ({ signal }) => getMovieImages(value, { signal }),
  });
}
export function recommendationsQuery(id: number | string) {
  const value = validateRequest(idParameterSchema, String(id));
  return queryOptions({
    queryKey: ['tmdb', 'movie', 'recommendations', value, 1] as const,
    queryFn: ({ signal }) => getRecommendations(value, { signal }),
  });
}
