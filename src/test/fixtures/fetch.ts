import fixture from './tmdb.json';
import type {
  GenreList,
  MovieDetails,
  MoviePage,
  MovieSummary,
  PersonDetails,
  PersonMovieCredits,
  PersonPage,
} from '../../types/tmdb';

const movie = fixture.movie satisfies MovieDetails & MovieSummary;
const person = { ...fixture.person, gender: 0 } satisfies PersonDetails;

export function fixtureFetch(input: RequestInfo | URL): Promise<Response> {
  const value = input instanceof Request ? input.url : String(input);
  const url = new URL(value, 'http://localhost');

  if (
    url.origin !== 'http://localhost' ||
    !url.pathname.startsWith('/api/tmdb/')
  ) {
    return Promise.reject(
      new Error('A fixture só aceita a API relativa local.'),
    );
  }

  let data:
    | GenreList
    | MovieDetails
    | MoviePage
    | PersonDetails
    | PersonMovieCredits
    | PersonPage;

  if (url.pathname === '/api/tmdb/genre/movie/list') {
    data = { genres: movie.genres };
  } else if (/\/movie\/\d+\/videos$/.test(url.pathname)) {
    return Promise.resolve(
      Response.json({
        id: 1,
        results: [
          {
            id: 'fixture',
            key: 'abcdefghijk',
            site: 'YouTube',
            type: 'Trailer',
            official: true,
            name: 'Trailer fictício',
          },
        ],
      }),
    );
  } else if (/\/movie\/\d+\/images$/.test(url.pathname)) {
    return Promise.resolve(
      Response.json({
        id: 1,
        backdrops: [{ file_path: '/fixture.jpg', width: 1200, height: 800 }],
        posters: [],
      }),
    );
  } else if (/\/movie\/\d+\/credits$/.test(url.pathname)) {
    return Promise.resolve(Response.json(movie.credits));
  } else if (/\/movie\/\d+\/recommendations$/.test(url.pathname)) {
    data = {
      page: 1,
      total_pages: 1,
      total_results: 1,
      results: [{ ...movie, id: 3, title: 'Outra sessão' }],
    };
  } else if (url.pathname === '/api/tmdb/discover/movie') {
    const matching =
      !url.searchParams.has('with_genres') ||
      url.searchParams.get('with_genres') === '18';
    data = {
      page: Number(url.searchParams.get('page') || 1),
      total_pages: matching ? 5 : 0,
      total_results: matching ? 5 : 0,
      results: matching ? [movie] : [],
    };
  } else if (/\/person\/\d+\/movie_credits$/.test(url.pathname)) {
    data = { cast: [movie], crew: [] };
  } else if (/\/person\/\d+$/.test(url.pathname)) {
    data = { ...person, id: Number(url.pathname.split('/').at(-1)) };
  } else if (/\/movie\/\d+$/.test(url.pathname)) {
    data = { ...movie, id: Number(url.pathname.split('/').at(-1)) };
  } else if (/\/person\/popular$|\/search\/person$/.test(url.pathname)) {
    data = {
      results: [person],
      total_results: 6,
      total_pages: 6,
      page: Number(url.searchParams.get('page') || 1),
    };
  } else if (
    /\/movie\/(popular|now_playing|top_rated|upcoming)$|\/trending\/movie\/day$|\/search\/movie$/.test(
      url.pathname,
    )
  ) {
    data = {
      results: [movie],
      total_results: 5,
      total_pages: 5,
      page: Number(url.searchParams.get('page') || 1),
    };
  } else {
    return Promise.reject(new Error('Caminho sem fixture de migração.'));
  }

  return Promise.resolve(
    new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
}
