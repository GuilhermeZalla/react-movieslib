import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Build-time checks use a fictitious marker, never a real credential.
const forbidden = [
  'TMDB_READ_ACCESS_TOKEN',
  'tmdbDevPlugin',
  'fixture-only-build-marker',
  'startFixtureServer',
  'api.themoviedb.org',
  'image.tmdb.org',
];
function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) inspect(path);
    else if (/\.(?:js|css|html|json|map)$/.test(entry.name)) {
      const source = readFileSync(path, 'utf8');
      if (forbidden.some((value) => source.includes(value)))
        throw new Error(
          'Production bundle contains a server-only marker: ' + path,
        );
    }
  }
}
inspect('dist');
process.stdout.write(
  'Production bundle: no private variable, adapter, fixture server or direct TMDB host.\n',
);
