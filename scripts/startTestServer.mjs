import { build } from 'vite';
import { startFixtureServer } from './fixtureServer.mjs';
await build({ logLevel: 'error' });
await startFixtureServer();
process.stdout.write('Production fixture server ready on port 4180\n');
