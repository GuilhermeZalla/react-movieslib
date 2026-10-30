import { MemoryRouter } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DesignSystem from './DesignSystem';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}
describe('laboratório visual', () => {
  it('mostra a tipografia B em tema escuro nas duas larguras', () => {
    renderWithRouter(<DesignSystem />);
    expect(
      screen.getByRole('heading', { name: /Pulso: tipografia B/ }),
    ).toBeInTheDocument();
    for (const label of [
      'Amostra escura em 360 pixels',
      'Amostra escura em 1440 pixels',
    ]) {
      const frame = screen.getByRole('region', { name: label });
      expect(
        within(frame).getByRole('heading', { name: /Todo mundo está vendo/ }),
      ).toBeInTheDocument();
      expect(
        within(frame).getByRole('status', { name: 'Carregando pôster' }),
      ).toBeInTheDocument();
    }
  });

  it('renderiza duas amostras sem seletor de fonte ou tema', () => {
    renderWithRouter(<DesignSystem />);
    const frames = document.querySelectorAll('[data-design-preview]');
    expect(frames).toHaveLength(2);
    frames.forEach((frame) => {
      expect(frame).not.toHaveAttribute('data-font-option');
    });
  });
});
