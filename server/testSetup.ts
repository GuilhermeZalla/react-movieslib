import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => {
      throw new Error(
        'Server tests must mock fetch; network access is forbidden.',
      );
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});
