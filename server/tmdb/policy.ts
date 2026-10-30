import { z } from '../../shared/zod.ts';
import {
  discoverRequestSchema,
  idParameterSchema,
  pageParameterSchema,
  searchQuerySchema,
} from '../../shared/tmdbRequest.ts';
import {
  movieVideosSchema,
  movieImagesSchema,
  genreListSchema,
  movieCreditsSchema,
  movieDetailsSchema,
  moviePageSchema,
  personDetailsSchema,
  personMovieCreditsSchema,
  personPageSchema,
} from '../../src/api/tmdb/schemas.ts';

const ORIGIN = 'https://api.themoviedb.org/3/';
const IMAGE_ORIGIN = 'https://image.tmdb.org/t/p/';
const IMAGE_PATH =
  /^image\/w500\/([A-Za-z0-9_-]{1,160}\.(?:jpg|jpeg|png|webp))$/i;
const paged = z.strictObject({ page: pageParameterSchema.default(1) });
const searched = paged.extend({ query: searchQuerySchema });
const detail = z.strictObject({
  append_to_response: z.literal('credits').optional(),
});
const empty = z.strictObject({});
const lists = new Set([
  'movie/popular',
  'movie/top_rated',
  'movie/now_playing',
  'movie/upcoming',
  'trending/movie/day',
]);

export class PolicyError extends Error {
  constructor(readonly status: 400 | 404) {
    super('Invalid proxy request');
  }
}

/** A separate fixed-origin allowlist for binary images; no arbitrary URLs or sizes. */
export function resolveImageRequest(target: string): URL | null {
  const [rawPath = '', query = ''] = target.split('?');
  if (
    target.length > 4096 ||
    target.includes('#') ||
    target.split('?').length > 2
  )
    throw new PolicyError(400);
  if (rawPath !== '/api/tmdb' && !rawPath.startsWith('/api/tmdb/')) return null;
  const params = new URLSearchParams(query);
  const paths = params.getAll('path');
  const suffix = rawPath.startsWith('/api/tmdb/')
    ? rawPath.slice('/api/tmdb/'.length)
    : '';
  const candidate = suffix || paths[0] || '';
  if (!candidate.startsWith('image/')) return null;
  if (
    /[%\\]/.test(rawPath) ||
    paths.length > 1 ||
    (suffix && paths.length === 1 && paths[0] !== suffix) ||
    [...params.keys()].some((key) => key !== 'path')
  )
    throw new PolicyError(400);
  const match = IMAGE_PATH.exec(candidate);
  if (!match) throw new PolicyError(400);
  return new URL(`w500/${match[1]}`, IMAGE_ORIGIN);
}

/** Parse the raw target BEFORE URL normalization can remove traversal segments. */
export function resolveRequest(target: string): {
  url: URL;
  schema: z.ZodType;
} {
  const [rawPath = '', query = ''] = target.split('?');
  if (
    target.length > 4096 ||
    target.includes('#') ||
    !/^\/api\/tmdb(?:\/|$)/.test(rawPath)
  ) {
    throw new PolicyError(404);
  }
  if (target.split('?').length > 2 || /[%\\]/.test(rawPath))
    throw new PolicyError(400);
  const params = new URLSearchParams(query);
  const paths = params.getAll('path');
  const suffix = rawPath.slice('/api/tmdb'.length).replace(/^\//, '');
  if (paths.length > 1 || (suffix && paths.length === 1 && paths[0] !== suffix))
    throw new PolicyError(400);
  const path = suffix || paths[0] || '';
  if (!path) throw new PolicyError(404);
  // No encoded characters, dots, backslashes, leading/trailing or duplicate slashes.
  if (!/^[a-z0-9_]+(?:\/[a-z0-9_]+)*$/.test(path)) throw new PolicyError(400);

  let input: z.ZodType;
  let schema: z.ZodType;
  if (path === 'discover/movie') {
    input = discoverRequestSchema;
    schema = moviePageSchema;
  } else if (lists.has(path)) {
    input = paged;
    schema = moviePageSchema;
  } else if (path === 'person/popular') {
    input = paged;
    schema = personPageSchema;
  } else if (path === 'search/movie') {
    input = searched;
    schema = moviePageSchema;
  } else if (path === 'search/person') {
    input = searched;
    schema = personPageSchema;
  } else if (path === 'genre/movie/list') {
    input = empty;
    schema = genreListSchema;
  } else {
    const match =
      /^(movie|person)\/(\d+)(?:\/(credits|movie_credits|videos|images|recommendations))?$/.exec(
        path,
      );
    if (!match || !idParameterSchema.safeParse(match[2]).success)
      throw new PolicyError(match ? 400 : 404);
    if (match[1] === 'movie' && !match[3]) {
      input = detail;
      schema = movieDetailsSchema;
    } else if (match[1] === 'movie' && match[3] === 'credits') {
      input = empty;
      schema = movieCreditsSchema;
    } else if (match[1] === 'movie' && match[3] === 'videos') {
      input = empty;
      schema = movieVideosSchema;
    } else if (match[1] === 'movie' && match[3] === 'images') {
      input = empty;
      schema = movieImagesSchema;
    } else if (match[1] === 'movie' && match[3] === 'recommendations') {
      input = paged;
      schema = moviePageSchema;
    } else if (match[1] === 'person' && !match[3]) {
      input = empty;
      schema = personDetailsSchema;
    } else if (match[1] === 'person' && match[3] === 'movie_credits') {
      input = empty;
      schema = personMovieCreditsSchema;
    } else throw new PolicyError(404);
  }

  const values: Record<string, string> = {};
  for (const key of new Set(params.keys())) {
    // These values never reach upstream, even when repeated by an attacker.
    if (key === 'path' || key === 'language' || key === 'include_adult')
      continue;
    if (
      ![
        'page',
        'query',
        'append_to_response',
        'with_genres',
        'primary_release_year',
        'vote_average.gte',
        'sort_by',
      ].includes(key)
    )
      throw new PolicyError(400);
    if (params.getAll(key).length !== 1) throw new PolicyError(400);
    values[key] = params.get(key) ?? '';
  }
  const parsed = input.safeParse(values);
  if (!parsed.success) throw new PolicyError(400);
  const url = new URL(path, ORIGIN);
  // Reconstruct only validated values; never forward arbitrary client headers/query.
  for (const [key, value] of Object.entries(values))
    url.searchParams.set(key, value);
  if ('page' in values)
    url.searchParams.set(
      'page',
      String(pageParameterSchema.parse(values.page)),
    );
  if ('query' in values)
    url.searchParams.set('query', searchQuerySchema.parse(values.query));
  url.searchParams.set('language', 'en-US');
  url.searchParams.set('include_adult', 'false');
  return { url, schema };
}

function isAdult(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'adult' in value &&
    value.adult === true
  );
}

/** Some detail/credit endpoints do not enforce include_adult themselves. */
export function removeAdultEntries(value: unknown): unknown {
  if (isAdult(value)) throw new PolicyError(404);
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return value;
  const copy: Record<string, unknown> = { ...value };
  for (const key of ['results', 'cast', 'crew']) {
    const entries = copy[key];
    if (Array.isArray(entries))
      copy[key] = entries.filter((entry: unknown) => !isAdult(entry));
  }
  if ('credits' in copy) copy.credits = removeAdultEntries(copy.credits);
  return copy;
}
