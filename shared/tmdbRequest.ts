import { z } from 'zod';

export const SEARCH_MAX_LENGTH = 200;
export const MAX_PAGE = 500;

// Reject signs, decimals, whitespace and coercions such as an empty string to 0.
export const idParameterSchema = z
  .string()
  .regex(/^[1-9]\d*$/)
  .transform(Number)
  .pipe(z.number().int().positive().max(Number.MAX_SAFE_INTEGER));
export const pageParameterSchema = idParameterSchema.pipe(
  z.number().max(MAX_PAGE),
);
export const movieCategorySchema = z.enum([
  'popular',
  'top_rated',
  'now_playing',
  'upcoming',
]);

// Keep a valid empty input for clearing the UI; actual searches require text.
export const searchInputSchema = z
  .string()
  .max(SEARCH_MAX_LENGTH)
  .transform((value) => value.normalize('NFC').trim().replace(/\s+/gu, ' '))
  .pipe(z.string().max(SEARCH_MAX_LENGTH));
export const searchQuerySchema = searchInputSchema.pipe(z.string().min(1));

// Server-owned language/adult settings are deliberately absent. Unknown keys fail.
export const searchRequestSchema = z.strictObject({
  query: searchQuerySchema,
  page: pageParameterSchema.default(1),
});
export const movieListRequestSchema = z.strictObject({
  category: movieCategorySchema,
  page: pageParameterSchema.default(1),
});
export const detailRequestSchema = z.strictObject({ id: idParameterSchema });

export type SearchRequest = z.infer<typeof searchRequestSchema>;
export type MovieListRequest = z.infer<typeof movieListRequestSchema>;
