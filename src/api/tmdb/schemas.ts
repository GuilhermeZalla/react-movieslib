import { z } from 'zod';

const idSchema = z.number().int().positive().max(Number.MAX_SAFE_INTEGER);
const nullableText = z.string().nullable().default(null);
const nullableDate = z
  .union([z.iso.date(), z.literal('')])
  .nullable()
  .default(null);
const nullableAmount = z.number().nonnegative().nullable().default(null);
const imagePathSchema = z
  .string()
  .regex(/^\/[a-zA-Z0-9._/-]+$/)
  .refine((path) => !path.includes('..'), 'Invalid image path')
  .nullable()
  .default(null);

export const genreSchema = z.object({ id: idSchema, name: z.string() });
export const genreListSchema = z.object({ genres: z.array(genreSchema) });
export const pageMetadataSchema = z.object({
  page: z.number().int().positive(),
  total_pages: z.number().int().nonnegative(),
  total_results: z.number().int().nonnegative(),
});

export function createPageSchema<T extends z.ZodType>(itemSchema: T) {
  return pageMetadataSchema.extend({ results: z.array(itemSchema) });
}

export const movieSummarySchema = z.object({
  id: idSchema,
  title: z.string(),
  poster_path: imagePathSchema,
  backdrop_path: imagePathSchema,
  overview: nullableText,
  release_date: nullableDate,
  vote_average: z.number().min(0).max(10).nullable().default(null),
  genre_ids: z.array(idSchema).default([]),
});
export const personSummarySchema = z.object({
  id: idSchema,
  name: z.string(),
  profile_path: imagePathSchema,
});
export const personGenderSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);
export const personDetailsSchema = personSummarySchema.extend({
  biography: nullableText,
  birthday: nullableDate,
  deathday: nullableDate,
  known_for_department: nullableText,
  gender: personGenderSchema.default(0),
  place_of_birth: nullableText,
  imdb_id: nullableText,
});
export const castMemberSchema = personSummarySchema.extend({
  character: nullableText,
});
export const crewMemberSchema = personSummarySchema.extend({
  credit_id: z.string(),
  department: z.string(),
  job: z.string(),
});
export const movieCreditsSchema = z.object({
  cast: z.array(castMemberSchema),
  crew: z.array(crewMemberSchema),
});
export const movieDetailsSchema = movieSummarySchema
  .omit({ genre_ids: true })
  .extend({
    genres: z.array(genreSchema),
    tagline: nullableText,
    status: nullableText,
    budget: nullableAmount,
    revenue: nullableAmount,
    runtime: nullableAmount,
    credits: movieCreditsSchema.optional(),
  });
export const personMovieCreditsSchema = z.object({
  cast: z.array(movieSummarySchema),
  crew: z.array(
    movieSummarySchema.extend({
      credit_id: z.string(),
      department: z.string(),
      job: z.string(),
    }),
  ),
});
export const moviePageSchema = createPageSchema(movieSummarySchema);
export const personPageSchema = createPageSchema(personSummarySchema);

export type Genre = z.infer<typeof genreSchema>;
export type GenreList = z.infer<typeof genreListSchema>;
export type Page<T> = z.infer<typeof pageMetadataSchema> & { results: T[] };
export type MovieSummary = z.infer<typeof movieSummarySchema>;
export type MovieDetails = z.infer<typeof movieDetailsSchema>;
export type MovieCredits = z.infer<typeof movieCreditsSchema>;
export type MoviePage = z.infer<typeof moviePageSchema>;
export type PersonSummary = z.infer<typeof personSummarySchema>;
export type PersonDetails = z.infer<typeof personDetailsSchema>;
export type PersonGender = z.infer<typeof personGenderSchema>;
export type PersonPage = z.infer<typeof personPageSchema>;
export type PersonMovieCredits = z.infer<typeof personMovieCreditsSchema>;
export type CastMember = z.infer<typeof castMemberSchema>;
export type CrewMember = z.infer<typeof crewMemberSchema>;
