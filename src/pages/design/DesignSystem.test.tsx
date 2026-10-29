import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DesignSystem from './DesignSystem';

describe('laboratório visual', () => {
  it('mostra a tipografia B e os dois temas nas duas larguras', () => {
    render(<DesignSystem />);
    expect(
      screen.getByRole('heading', { name: /Pulso: tipografia B/ }),
    ).toBeInTheDocument();
    for (const label of [
      'Amostra escura em 360 pixels',
      'Amostra escura em 1440 pixels',
      'Amostra clara em 360 pixels',
      'Amostra clara em 1440 pixels',
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

  it('renderiza quatro amostras sem seletor de fonte', () => {
    render(<DesignSystem />);
    const frames = document.querySelectorAll('[data-design-preview]');
    expect(frames).toHaveLength(4);
    frames.forEach((frame) => {
      expect(frame).not.toHaveAttribute('data-font-option');
    });
  });
});
