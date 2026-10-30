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
  it.each([false, true])(
    'inicia sozinho e alterna a cada 7 segundos, movimento reduzido: %s',
    (reduced) => {
      mount(reduced);
      expect(
        screen.queryByRole('button', {
          name: /Pausar|Retomar|Reproduzir|Play/i,
        }),
      ).not.toBeInTheDocument();
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
    },
  );
  it('oferece somente voltar/avançar e mantém ciclos automáticos sucessivos', () => {
    mount();
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(
      screen.getByRole('button', { name: 'Destaque anterior' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Próximo destaque' }),
    ).toBeInTheDocument();
    for (const title of [
      'Outra história',
      'Filme de exemplo',
      'Outra história',
      'Filme de exemplo',
    ]) {
      advance(7000);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        title,
      );
    }
  });
  it('não congela quando o mouse permanece sobre imagem ou controles', () => {
    mount();
    const hero = screen.getByRole('region', { name: 'Destaque' });
    fireEvent.mouseEnter(hero);
    advance(7000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Outra história',
    );
    fireEvent.mouseEnter(screen.getByRole('link', { name: 'Ver detalhes' }));
    advance(7000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Filme de exemplo',
    );
    fireEvent.mouseLeave(screen.getByRole('link', { name: 'Ver detalhes' }));
    advance(7000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Outra história',
    );
  });
  it('continua automaticamente com foco de teclado no conteúdo', () => {
    mount();
    act(() => screen.getByRole('link', { name: 'Ver detalhes' }).focus());
    advance(21000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Outra história',
    );
  });
  it('volta com wrap, avança e mantém a troca automática depois da seta', () => {
    mount();
    fireEvent.click(screen.getByRole('button', { name: 'Destaque anterior' }));
    expect(screen.getByRole('link', { name: 'Ver detalhes' })).toHaveAttribute(
      'href',
      '/movie-details/2',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Próximo destaque' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Filme de exemplo',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Próximo destaque' }));
    advance(7000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Filme de exemplo',
    );
  });
  it('mantém avanço automático depois de seleção manual com movimento reduzido', () => {
    mount(true);
    fireEvent.click(screen.getByRole('button', { name: 'Próximo destaque' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Outra história',
    );
    advance(7000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Filme de exemplo',
    );
  });
  it('não cria pausa por visibilidade e limpa temporizador ao desmontar', () => {
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    const view = mount();
    hidden.mockReturnValue(true);
    fireEvent(document, new Event('visibilitychange'));
    advance(21000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Outra história',
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
