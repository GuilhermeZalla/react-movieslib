import { render } from '@testing-library/react';
import App from '../../app/App';
export function openApp(path: string) {
  window.history.replaceState(null, '', path);
  return render(<App />);
}
export function pathOf(input: RequestInfo | URL) {
  return new URL(
    input instanceof Request ? input.url : String(input),
    'http://localhost',
  );
}
export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
