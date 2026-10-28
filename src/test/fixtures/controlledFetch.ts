import { fixtureFetch } from './fetch';

/** Only the test releases tracked responses, so a reverted effect cannot run away. */
export function controlledFetch(matches: (url: URL) => boolean) {
  const requests: URL[] = [];
  const pending: Array<() => Promise<void>> = [];

  const fetch = (input: RequestInfo | URL): Promise<Response> => {
    const value = input instanceof Request ? input.url : String(input);
    const url = new URL(value, 'http://localhost');
    if (!matches(url)) return fixtureFetch(input);
    requests.push(url);
    return new Promise<Response>((resolve) => {
      pending.push(async () => {
        resolve(await fixtureFetch(input));
      });
    });
  };

  const respondNext = async () => {
    const reply = pending.shift();
    if (!reply) throw new Error('Não há resposta pendente para liberar.');
    await reply();
  };

  return { fetch, requests, respondNext };
}
