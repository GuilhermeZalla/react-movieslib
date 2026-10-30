import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import ErrorBoundary from '../app/ErrorBoundary';
function Broken(): never {
  throw new Error('fixture-internal-details');
}
it('a barreira raiz oferece recuperação sem expor detalhes internos', () => {
  // React development reports caught render errors; this fixture expects that report.
  vi.spyOn(console, 'error').mockImplementation(() => {});
  // jsdom emits the deliberately thrown error before React catches it.
  const expectedError = (event: ErrorEvent) => {
    if (event.message.includes('fixture-internal-details'))
      event.preventDefault();
  };
  window.addEventListener('error', expectedError);
  render(
    <ErrorBoundary>
      <Broken />
    </ErrorBoundary>,
  );
  window.removeEventListener('error', expectedError);
  expect(
    screen.getByRole('heading', { name: 'A sessão foi interrompida' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Recarregar página' }),
  ).toBeInTheDocument();
  expect(document.body).not.toHaveTextContent('fixture-internal-details');
});
