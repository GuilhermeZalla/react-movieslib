import type { IncomingMessage, ServerResponse } from 'node:http';
import { createTmdbHandler } from '../server/tmdb/handler.ts';
import { sendNodeResponse } from '../server/tmdb/nodeAdapter.ts';

// Kept warm per serverless instance; no imports from development tooling.
const handler = createTmdbHandler();

export default async function tmdb(
  request: IncomingMessage,
  response: ServerResponse,
) {
  await sendNodeResponse(request, response, handler);
}
