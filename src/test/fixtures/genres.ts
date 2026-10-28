import type { GenreList } from '../../types/tmdb';

export const genreFixture = {
  genres: [
    { id: 18, name: 'Drama' },
    { id: 99, name: 'Documentary' },
    { id: 10770, name: 'TV Movie' },
  ],
} satisfies GenreList;
