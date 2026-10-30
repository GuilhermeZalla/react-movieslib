import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PulsoShell from './PulsoShell';
function CurrentRoute() {
  const route = useLocation();
  return (
    <output aria-label="Rota atual">{route.pathname + route.search}</output>
  );
}
function renderShell() {
  return render(
    <MemoryRouter>
      <PulsoShell>
        <p>Conteúdo</p>
        <CurrentRoute />
      </PulsoShell>
    </MemoryRouter>,
  );
}
beforeEach(() => localStorage.clear());
describe('shell Pulso escuro', () => {
  it('ignora preferência clara antiga e não oferece alternância', () => {
    localStorage.setItem('theme', 'light');
    renderShell();
    expect(
      screen.getByText('Conteúdo').closest('[data-design-theme]'),
    ).toHaveAttribute('data-design-theme', 'dark');
    expect(
      screen.queryByRole('button', { name: /Alternar para tema/ }),
    ).not.toBeInTheDocument();
  });
  it('não precisa ler ou gravar preferência de tema', () => {
    const read = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('blocked');
      });
    const write = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('blocked');
      });
    renderShell();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(read).not.toHaveBeenCalled();
    expect(write).not.toHaveBeenCalled();
  });
  it('busca global envia termo normalizado e mantém limite de entrada', () => {
    renderShell();
    const input = screen.getByRole('searchbox', {
      name: 'Pesquisar catálogo',
    });
    expect(input).toHaveAttribute('maxlength', '200');
    fireEvent.change(input, { target: { value: '  Noite   azul  ' } });
    fireEvent.click(
      screen.getByRole('button', { name: 'Pesquisar no catálogo' }),
    );
    expect(screen.getByLabelText('Rota atual')).toHaveTextContent(
      '/catalog/popular/1?q=Noite%20azul',
    );
  });
  it('busca global vazia não navega', () => {
    renderShell();
    fireEvent.click(
      screen.getByRole('button', { name: 'Pesquisar no catálogo' }),
    );
    expect(screen.getByLabelText('Rota atual')).toHaveTextContent('/');
  });
  it('exibe Créditos e aviso exato; logo continua pendente', () => {
    renderShell();
    expect(screen.getByText('Guilherme Zalla')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Código no GitHub/ }),
    ).toHaveAttribute(
      'href',
      'https://github.com/GuilhermeZalla/react-movieslib',
    );
    expect(
      screen.getByRole('link', { name: /Código no GitHub/ }),
    ).toHaveAttribute('rel', 'noopener noreferrer');
    expect(
      screen.getByRole('region', { name: 'Créditos' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'This product uses the TMDB API but is not endorsed or certified by TMDB.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /The Movie Database \(TMDB\)/ }),
    ).toHaveAttribute('rel', 'noopener noreferrer');
    expect(
      screen.queryByRole('img', { name: 'The Movie Database (TMDB)' }),
    ).not.toBeInTheDocument();
  });
});
