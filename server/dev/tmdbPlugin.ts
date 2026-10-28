import { loadEnv, type Plugin } from 'vite';
import { createTmdbHandler } from '../tmdb/handler.ts';
import { sendNodeResponse } from '../tmdb/nodeAdapter.ts';

/** MOVIESLIB_DEVELOPMENT_PROXY_ADAPTER: imported only by Vite serve/development. */
export function tmdbDevPlugin(): Plugin {
  return {
    name: 'movieslib-development-proxy-adapter',
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.root, 'TMDB_');
      const handler = createTmdbHandler({
        getToken: () =>
          process.env.TMDB_READ_ACCESS_TOKEN ?? env.TMDB_READ_ACCESS_TOKEN,
      });
      server.middlewares.use((request, response, next) => {
        if (!/^\/api(?:\/|\?|$)/.test(request.url ?? '')) {
          next();
          return;
        }
        void sendNodeResponse(request, response, handler);
      });
    },
  };
}
