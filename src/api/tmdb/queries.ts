import { getLocale } from '../../i18n/locale';
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
  const locale = getLocale();
  const input = validateRequest(movieListRequestSchema, {
    category,
    page: String(page),
  });
  return queryOptions<MoviePage>({
    queryKey: [
      'tmdb',
      'movie',
      'list',
      input.category,
      input.page,
      locale,
    ] as const,
    queryFn: ({ signal }) =>
      getMovies(input.category, input.page, { signal, locale }),
  });
}
export function trendingQuery(page: number | string = 1) {
  const locale = getLocale();
  const value = validateRequest(pageParameterSchema, String(page));
  return queryOptions({
    queryKey: ['tmdb', 'movie', 'trending', 'day', value, locale] as const,
    queryFn: ({ signal }) => getTrending(value, { signal, locale }),
  });
}
export function peopleQuery(page: number | string = 1) {
  const locale = getLocale();
  const value = validateRequest(pageParameterSchema, String(page));
  return queryOptions<PersonPage>({
    queryKey: ['tmdb', 'person', 'list', 'popular', value, locale] as const,
    queryFn: ({ signal }) => getPeople(value, { signal, locale }),
  });
}
export function movieSearchQuery(term: string, page: number | string = 1) {
  const locale = getLocale();
  const query = validateRequest(searchInputSchema, term);
  const value = validateRequest(pageParameterSchema, String(page));
  return queryOptions<MoviePage>({
    queryKey: ['tmdb', 'movie', 'search', query, value, locale] as const,
    enabled: query.length > 0,
    queryFn: ({ signal }) => searchMovies(query, value, { signal, locale }),
  });
}
export function personSearchQuery(term: string, page: number | string = 1) {
  const locale = getLocale();
  const query = validateRequest(searchInputSchema, term);
  const value = validateRequest(pageParameterSchema, String(page));
  return queryOptions<PersonPage>({
    queryKey: ['tmdb', 'person', 'search', query, value, locale] as const,
    enabled: query.length > 0,
    queryFn: ({ signal }) => searchPeople(query, value, { signal, locale }),
  });
}
export function genresQuery() {
  const locale = getLocale();
  return queryOptions({
    queryKey: ['tmdb', 'genre', 'movie', 'list', locale] as const,
    queryFn: ({ signal }) => getGenres({ signal, locale }),
  });
}
export function movieQuery(id: number | string) {
  const locale = getLocale();
  const value = validateRequest(idParameterSchema, String(id));
  return queryOptions({
    queryKey: ['tmdb', 'movie', 'detail', value, 'credits', locale] as const,
    queryFn: ({ signal }) => getMovie(value, { signal, locale }),
  });
}
export function movieCreditsQuery(id: number | string) {
  const locale = getLocale();
  const value = validateRequest(idParameterSchema, String(id));
  return queryOptions({
    queryKey: ['tmdb', 'movie', 'credits', value, locale] as const,
    queryFn: ({ signal }) => getMovieCredits(value, { signal, locale }),
  });
}
export function personQuery(id: number | string) {
  const locale = getLocale();
  const value = validateRequest(idParameterSchema, String(id));
  return queryOptions({
    queryKey: ['tmdb', 'person', 'detail', value, locale] as const,
    queryFn: ({ signal }) => getPerson(value, { signal, locale }),
  });
}
export function personCreditsQuery(id: number | string) {
  const locale = getLocale();
  const value = validateRequest(idParameterSchema, String(id));
  return queryOptions({
    queryKey: ['tmdb', 'person', 'movie_credits', value, locale] as const,
    queryFn: ({ signal }) => getPersonCredits(value, { signal, locale }),
  });
}

export function discoverQuery(input: DiscoverInput) {
  const locale = getLocale();
  const parsed = validateRequest(discoverRequestSchema, input);
  return queryOptions<MoviePage>({
    queryKey: ['tmdb', 'movie', 'discover', parsed, locale] as const,
    queryFn: ({ signal }) => discoverMovies(input, { signal, locale }),
  });
}
export function movieVideosQuery(id: number | string) {
  const locale = getLocale();
  const value = validateRequest(idParameterSchema, String(id));
  return queryOptions({
    queryKey: ['tmdb', 'movie', 'videos', value, locale] as const,
    queryFn: ({ signal }) => getMovieVideos(value, { signal, locale }),
  });
}
export function movieImagesQuery(id: number | string) {
  const locale = getLocale();
  const value = validateRequest(idParameterSchema, String(id));
  return queryOptions({
    queryKey: ['tmdb', 'movie', 'images', value, locale] as const,
    queryFn: ({ signal }) => getMovieImages(value, { signal, locale }),
  });
}
export function recommendationsQuery(id: number | string) {
  const locale = getLocale();
  const value = validateRequest(idParameterSchema, String(id));
  return queryOptions({
    queryKey: ['tmdb', 'movie', 'recommendations', value, 1, locale] as const,
    queryFn: ({ signal }) => getRecommendations(value, { signal, locale }),
  });
}
