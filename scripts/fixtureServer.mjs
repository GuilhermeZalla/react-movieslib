import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, sep, extname } from 'node:path';
const fixture = JSON.parse(
  readFileSync(
    new URL('../src/test/fixtures/tmdb.json', import.meta.url),
    'utf8',
  ),
);
const poster =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect width="200" height="300" fill="#321e24"/><circle cx="100" cy="112" r="65" fill="#c62828"/><path d="M20 270 100 125 180 270Z" fill="#b7bbc2"/></svg>';
export function fixtureResponse(path, search = new URLSearchParams()) {
  const page = Number(search.get('page') || 1);
  const movies = Array.from({ length: 20 }, (_, index) => ({
    ...fixture.movie,
    id: index + 1,
    title: index === 0 ? fixture.movie.title : 'Sessão ' + (index + 1),
  }));
  if (path === '/api/tmdb/genre/movie/list')
    return { genres: fixture.movie.genres };
  if (/\/movie\/\d+\/videos$/.test(path))
    return {
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
    };
  if (/\/movie\/\d+\/images$/.test(path))
    return {
      id: 1,
      backdrops: [{ file_path: '/fixture.jpg', width: 1200, height: 800 }],
      posters: [],
    };
  if (/\/movie\/\d+\/credits$/.test(path))
    return {
      cast: fixture.movie.credits.cast,
      crew: [
        {
          id: 3,
          name: 'Direção de exemplo',
          profile_path: null,
          credit_id: 'fixture',
          department: 'Directing',
          job: 'Director',
        },
      ],
    };
  if (/\/person\/\d+\/movie_credits$/.test(path))
    return { cast: movies, crew: [] };
  if (/\/person\/\d+$/.test(path)) return { ...fixture.person, gender: 0 };
  if (/\/movie\/\d+$/.test(path))
    return { ...fixture.movie, id: Number(path.split('/').at(-1)) };
  if (path === '/api/tmdb/person/popular' || path === '/api/tmdb/search/person')
    return {
      page,
      total_pages: 5,
      total_results: 100,
      results: [fixture.person],
    };
  return { page, total_pages: 5, total_results: 100, results: movies };
}
export async function startFixtureServer({
  port = 4180,
  directory = 'dist',
  headers = true,
} = {}) {
  const root = resolve(directory);
  const config = JSON.parse(
    readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'),
  );
  const server = createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://localhost');
    if (headers)
      for (const header of config.headers[0].headers)
        res.setHeader(header.key, header.value);
    res.setHeader('Cache-Control', 'no-store');
    if (url.pathname.startsWith('/api/tmdb/image/')) {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.end(poster);
      return;
    }
    if (url.pathname.startsWith('/api/tmdb/')) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(fixtureResponse(url.pathname, url.searchParams)));
      return;
    }
    let path;
    try {
      path = resolve(root, '.' + decodeURIComponent(url.pathname));
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (path !== root && !path.startsWith(root + sep)) {
      res.writeHead(404).end();
      return;
    }
    if (!existsSync(path) || path === root) {
      if (extname(url.pathname)) {
        res.writeHead(404).end();
        return;
      }
      path = resolve(root, 'index.html');
    }
    const mime = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.svg': 'image/svg+xml',
      '.woff2': 'font/woff2',
      '.woff': 'font/woff',
      '.ttf': 'font/ttf',
      '.ico': 'image/x-icon',
    };
    res.setHeader(
      'Content-Type',
      mime[extname(path)] || 'application/octet-stream',
    );
    res.end(readFileSync(path));
  });
  await new Promise((resolveReady) =>
    server.listen(port, '127.0.0.1', resolveReady),
  );
  return server;
}
if (process.argv[1]?.endsWith('fixtureServer.mjs')) {
  await startFixtureServer();
  process.stdout.write('Fixture preview: http://127.0.0.1:4180\n');
}
