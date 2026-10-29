import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PulsoShell from './PulsoShell';

function renderShell() {
  return render(
    <MemoryRouter>
      <PulsoShell>
        <p>Conteúdo da home</p>
      </PulsoShell>
    </MemoryRouter>,
  );
}

beforeEach(() => localStorage.clear());

describe('shell Pulso', () => {
  it('começa escuro mesmo com sistema claro, e mantém o tema dentro da home', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true })),
    );
    const initialRootTheme =
      document.documentElement.getAttribute('data-theme');
    renderShell();
    const shell = screen
      .getByText('Conteúdo da home')
      .closest('[data-design-theme]');
    expect(shell).toHaveAttribute('data-design-theme', 'dark');
    fireEvent.click(
      screen.getByRole('button', { name: 'Alternar para tema light' }),
    );
    expect(shell).toHaveAttribute('data-design-theme', 'light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe(
      initialRootTheme,
    );
  });

  it('respeita uma escolha clara já salva', () => {
    localStorage.setItem('theme', 'light');
    renderShell();
    expect(
      screen.getByRole('button', { name: 'Alternar para tema dark' }),
    ).toBeInTheDocument();
  });

  it('continua funcionando quando o navegador bloqueia armazenamento', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    renderShell();
    fireEvent.click(
      screen.getByRole('button', { name: 'Alternar para tema light' }),
    );
    expect(
      screen.getByRole('button', { name: 'Alternar para tema dark' }),
    ).toBeInTheDocument();
  });

  it('exibe o aviso exato em Créditos e fallback caso o logo ainda não exista', () => {
    renderShell();
    expect(
      screen.getByRole('region', { name: 'Créditos' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'This product uses the TMDB API but is not endorsed or certified by TMDB.',
      ),
    ).toBeInTheDocument();
    const logo = screen.getByRole('img', { name: 'The Movie Database (TMDB)' });
    expect(logo.className).not.toContain('opacity');
    fireEvent.error(logo);
    expect(screen.getByText('TMDB')).toBeInTheDocument();
  });
});
