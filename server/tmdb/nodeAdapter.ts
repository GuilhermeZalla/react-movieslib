import type { IncomingMessage, ServerResponse } from 'node:http';
import type { createTmdbHandler } from './handler.ts';

export async function sendNodeResponse(
  request: IncomingMessage,
  response: ServerResponse,
  handler: ReturnType<typeof createTmdbHandler>,
) {
  const result = await handler(request.url ?? '', request.method ?? 'GET');
  response.statusCode = result.status;
  result.headers.forEach((value, key) => response.setHeader(key, value));
  response.end(await result.text());
}
