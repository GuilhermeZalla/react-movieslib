import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PulsoShell from '../components/layout/PulsoShell';
import SavedMoviesProvider from '../app/SavedMoviesProvider';
import SaveMovieButton from '../components/base/SaveMovieButton';
import {
  getLocale,
  initializeLocale,
  LOCALE_STORAGE_KEY,
  setLocale,
} from './locale';
import { genreName, metadataLabel } from './metadata';
import { t } from './translate';
import english from './en-US.json';
beforeEach(() => localStorage.clear());
afterEach(() => {
  act(() => setLocale('pt-BR', false));
});
describe('idioma da interface', () => {
  it('traduz também um aviso já existente quando o idioma muda', () => {
    setLocale('en-US', false);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(
      <MemoryRouter>
        <SavedMoviesProvider>
          <PulsoShell>
            <SaveMovieButton id={1} title="Example" />
          </PulsoShell>
        </SavedMoviesProvider>
      </MemoryRouter>,
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Save Example to my list' }),
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'The browser blocked storage. Your list was not changed.',
    );
    fireEvent.change(
      screen.getByRole('combobox', { name: 'Change language' }),
      { target: { value: 'pt-BR' } },
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'O navegador bloqueou o armazenamento. Sua lista não foi alterada.',
    );
  });
  it('inicia em português e traduz parâmetros sem traduzir o valor interpolado', () => {
    initializeLocale();
    expect(getLocale()).toBe('pt-BR');
    expect(t('Nota {score} de 10', { score: '8.5' })).toBe('Nota 8.5 de 10');
    setLocale('en-US');
    expect(t('Nota {score} de 10', { score: '8.5' })).toBe(
      'Rated 8.5 out of 10',
    );
    expect(t('Filmes de {genre}', { genre: '<script>' })).toBe(
      '<script> movies',
    );
    expect(document.documentElement.lang).toBe('en-US');
  });
  it('recupera preferência válida e ignora uma preferência corrompida', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en-US');
    initializeLocale();
    expect(getLocale()).toBe('en-US');
    localStorage.setItem(LOCALE_STORAGE_KEY, 'fr-FR');
    initializeLocale();
    expect(getLocale()).toBe('pt-BR');
  });
  it('funciona na sessão com armazenamento bloqueado', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => initializeLocale()).not.toThrow();
    expect(() => setLocale('en-US')).not.toThrow();
    expect(getLocale()).toBe('en-US');
  });
  it('traduz gêneros por ID e metadados conhecidos sem alterar nomes próprios', () => {
    expect(genreName({ id: 28, name: 'Action' })).toBe('Ação');
    expect(metadataLabel('Released')).toBe('Lançado');
    setLocale('en-US', false);
    expect(genreName({ id: 28, name: 'Ação' })).toBe('Action');
    expect(metadataLabel('Released')).toBe('Released');
    expect(genreName({ id: 999, name: 'Gênero novo' })).toBe('Gênero novo');
  });
  it('altera o rodapé e a navegação sem apagar IDs da lista', () => {
    localStorage.setItem('movieslib:saved-ids', '[12]');
    render(
      <MemoryRouter>
        <PulsoShell>Conteúdo</PulsoShell>
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByRole('combobox', { name: 'Alterar idioma' }), {
      target: { value: 'en-US' },
    });
    expect(screen.getByRole('link', { name: 'Movies' })).toHaveAttribute(
      'href',
      '/catalog/popular/1',
    );
    expect(
      screen.getByRole('combobox', { name: 'Change language' }),
    ).toHaveValue('en-US');
    expect(localStorage.getItem('movieslib:saved-ids')).toBe('[12]');
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en-US');
  });
  it.each(['/', '/catalog/popular/1', '/cast'])(
    'CTA de próxima sessão só aparece na home: %s',
    (path) => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <PulsoShell>Conteúdo</PulsoShell>
        </MemoryRouter>,
      );
      expect(
        screen.queryAllByRole('link', { name: 'A próxima sessão →' }),
      ).toHaveLength(path === '/' ? 1 : 0);
    },
  );
  it('todas as traduções mantêm os parâmetros da mensagem original', () => {
    for (const [key, value] of Object.entries(english)) {
      expect(
        [...value.matchAll(/\{\w+\}/g)].map((match) => match[0]).sort(),
        key,
      ).toEqual([...key.matchAll(/\{\w+\}/g)].map((match) => match[0]).sort());
    }
  });
});
