import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DesignSystem from './DesignSystem';

describe('laboratório visual', () => {
  it('oferece três fontes e mostra os dois temas nas duas larguras', () => {
    render(<DesignSystem />);
    expect(
      screen.getByRole('radio', { name: /A · Plus Jakarta Sans/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: /B · Bricolage/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /C · Figtree/ })).toBeChecked();
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

  it('troca todas as amostras para a fonte escolhida', () => {
    render(<DesignSystem />);
    fireEvent.click(screen.getByRole('radio', { name: /B · Bricolage/ }));
    expect(screen.getByRole('radio', { name: /B · Bricolage/ })).toBeChecked();
    const frames = document.querySelectorAll('[data-design-preview]');
    expect(frames).toHaveLength(4);
    frames.forEach((frame) =>
      expect(frame).toHaveAttribute('data-font-option', 'b'),
    );
  });
});
