import { readFileSync } from 'node:fs';
const fixture = JSON.parse(
  readFileSync(
    new URL('../../src/test/fixtures/tmdb.json', import.meta.url),
    'utf8',
  ),
);
const titles = [
  'Depois da chuva',
  'Órbita',
  'A última estação',
  'Margem sul',
  'O outro lado da noite',
  'Entre dois mundos',
];
const colors = [
  ['#173b47', '#dea877'],
  ['#25223f', '#a69ec9'],
  ['#424237', '#daa879'],
  ['#213c38', '#a6bd96'],
  ['#332332', '#c1798c'],
  ['#3c3029', '#d2a86f'],
];
export const movies = titles.map((title, index) => ({
  ...fixture.movie,
  id: 101 + index,
  title,
  overview: [
    'Quando a cidade adormece, duas pessoas encontram um novo caminho para casa.',
    'Uma viagem para além do conhecido. E uma descoberta que muda o significado de voltar.',
    'O último trem da noite une destinos que pareciam distantes.',
  ][index % 3],
  poster_path: `/demo-poster-${index}.jpg`,
  backdrop_path: `/demo-scene-${index}.jpg`,
  vote_average: 8.1 + index / 10,
  release_date: '2026-05-12',
  genres: [
    { id: 18, name: 'Drama' },
    { id: 878, name: 'Ficção científica' },
  ],
  genre_ids: [18, 878],
  runtime: 112,
  tagline: 'Há histórias que ficam.',
  budget: 12000000,
  revenue: 36000000,
}));
const people = [
  {
    ...fixture.person,
    id: 201,
    name: 'Helena Prado',
    profile_path: '/demo-person-0.jpg',
    biography:
      'Atriz e roteirista de histórias sobre encontros, cidades e novos começos.',
    gender: 1,
  },
  {
    ...fixture.person,
    id: 202,
    name: 'Caio Duarte',
    profile_path: '/demo-person-1.jpg',
    biography:
      'Ator e diretor. Seu trabalho explora os pequenos acontecimentos que transformam uma vida.',
    gender: 2,
  },
];
const page = (results, number = 1) => ({
  page: number,
  total_pages: 1,
  total_results: results.length,
  results,
});
export function response(path, params) {
  const match = /\/movie\/(\d+)/.exec(path),
    movie = movies.find((item) => item.id === Number(match?.[1])) ?? movies[0];
  if (path.endsWith('/genre/movie/list'))
    return {
      genres: [
        { id: 18, name: 'Drama' },
        { id: 878, name: 'Ficção científica' },
        { id: 53, name: 'Suspense' },
        { id: 12, name: 'Aventura' },
        { id: 35, name: 'Comédia' },
      ],
    };
  if (/\/movie\/\d+\/credits$/.test(path))
    return {
      id: movie.id,
      cast: people.map((person) => ({
        ...person,
        character: 'Personagem de demonstração',
      })),
      crew: [
        {
          ...people[1],
          credit_id: 'demo',
          department: 'Directing',
          job: 'Diretor',
        },
      ],
    };
  if (path.endsWith('/videos')) return { id: movie.id, results: [] };
  if (path.endsWith('/images'))
    return {
      id: movie.id,
      backdrops: [{ file_path: movie.backdrop_path, width: 1600, height: 900 }],
      posters: [],
    };
  if (path.endsWith('/recommendations'))
    return page(movies.filter((item) => item.id !== movie.id));
  if (/\/movie\/\d+$/.test(path)) return movie;
  if (path.endsWith('/movie_credits')) return { cast: movies, crew: [] };
  if (/\/person\/\d+$/.test(path))
    return (
      people.find((item) => item.id === Number(path.split('/').at(-1))) ??
      people[0]
    );
  if (path.includes('/person')) return page(people);
  const query = (params.get('query') ?? '').toLocaleLowerCase('pt-BR');
  return page(
    query
      ? movies.filter((item) =>
          item.title.toLocaleLowerCase('pt-BR').includes(query),
        )
      : movies,
  );
}
export function artwork(path) {
  const index = Number(/-(\d+)\./.exec(path)?.[1] ?? 0) % colors.length,
    [background, light] = colors[index];
  const scene = path.includes('scene'),
    person = path.includes('person');
  const width = scene ? 1600 : 400,
    height = scene ? 900 : 600;
  const art = scene
    ? `<circle cx="1180" cy="260" r="150" fill="${light}"/><path d="M500 700 1080 240 1600 610V900H500Z" fill="#111b21"/><path d="M720 900 1410 390 1770 900Z" fill="#172c31"/><path d="M0 770Q600 650 1600 790V900H0Z" fill="#0d2028"/><path d="M760 800h460m-330 35h390m-480 32h360" stroke="${light}" stroke-opacity=".35" stroke-width="4"/>`
    : person
      ? `<circle cx="200" cy="215" r="75" fill="${light}"/><path d="M40 570q15-220 160-220t160 220" fill="#142129"/>`
      : `<circle cx="265" cy="180" r="100" fill="${light}"/><path d="m-40 510 280-330 210 420H-40Z" fill="#101d27"/><path d="m120 600 240-310 150 310" fill="#1e343e"/><path d="M30 460h340M55 480h280" stroke="${light}" stroke-opacity=".4"/><text x="30" y="530" fill="#fff" font-family="sans-serif" font-size="22" letter-spacing="2">${titles[index].toLocaleUpperCase('pt-BR')}</text><text x="30" y="565" fill="${light}" font-family="sans-serif" font-size="11" letter-spacing="3">UMA HISTÓRIA PARA FICAR</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${background}"/>${art}</svg>`;
}
