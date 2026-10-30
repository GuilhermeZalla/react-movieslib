import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { setLocale } from '../i18n/locale';

beforeEach(() => {
  setLocale('pt-BR', false);
  vi.stubGlobal(
    'fetch',
    vi.fn(() => {
      throw new Error(
        'Requisição sem fixture: testes não podem acessar a rede.',
      );
    }),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
