import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PopularHero from './PopularHero';
import fixture from '../../test/fixtures/tmdb.json';
const movies = [
  fixture.movie,
  { ...fixture.movie, id: 2, title: 'Outra história' },
];
function mount(reduced = false) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: reduced,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
  return render(
    <MemoryRouter>
      <PopularHero movies={movies} pending={false} />
    </MemoryRouter>,
  );
}
function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());
describe('carrossel de populares', () => {
  it('alterna a cada 7 segundos e volta ao primeiro, sem chamadas de rede', () => {
    mount();
    advance(6999);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Filme de exemplo',
    );
    advance(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Outra história',
    );
    advance(7000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Filme de exemplo',
    );
    expect(fetch).not.toHaveBeenCalled();
  });
  it('pausa e retoma por decisão explícita', () => {
    mount();
    fireEvent.click(
      screen.getByRole('button', { name: 'Pausar destaques automáticos' }),
    );
    advance(21000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Filme de exemplo',
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Retomar destaques automáticos' }),
    );
    advance(7000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Outra história',
    );
  });
  it('pausa sobre ações, mas não congela com o cursor sobre a imagem', () => {
    mount();
    const hero = screen.getByRole('region', { name: 'Destaque' });
    fireEvent.mouseEnter(hero);
    advance(7000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Outra história',
    );
    fireEvent.mouseEnter(screen.getByRole('link', { name: 'Ver detalhes' }));
    advance(14000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Outra história',
    );
    fireEvent.mouseLeave(screen.getByRole('link', { name: 'Ver detalhes' }));
    advance(7000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Filme de exemplo',
    );
  });
  it('pausa quando o teclado entra no conteúdo', () => {
    mount();
    fireEvent.focus(screen.getByRole('link', { name: 'Ver detalhes' }));
    advance(21000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Filme de exemplo',
    );
  });
  it('seleção manual para a rotação e atualiza link/indicador', () => {
    mount();
    fireEvent.click(screen.getByRole('button', { name: 'Próximo destaque' }));
    expect(screen.getByRole('link', { name: 'Ver detalhes' })).toHaveAttribute(
      'href',
      '/movie-details/2',
    );
    expect(
      screen.getByRole('button', {
        name: 'Mostrar destaque 2: Outra história',
      }),
    ).toHaveAttribute('aria-current', 'true');
    advance(14000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Outra história',
    );
  });
  it('não gira em movimento reduzido e mantém navegação manual', () => {
    mount(true);
    advance(21000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Filme de exemplo',
    );
    expect(
      screen.queryByRole('button', { name: 'Pausar destaques automáticos' }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Próximo destaque' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Outra história',
    );
  });
  it('não gira com a aba oculta e limpa temporizador ao desmontar', () => {
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    const view = mount();
    hidden.mockReturnValue(true);
    fireEvent(document, new Event('visibilitychange'));
    advance(21000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Filme de exemplo',
    );
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  it('não cria controles ou timer para um único filme', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
    render(
      <MemoryRouter>
        <PopularHero movies={[fixture.movie]} pending={false} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);
  });
});
