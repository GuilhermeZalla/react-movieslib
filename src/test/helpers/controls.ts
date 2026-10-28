import { screen, within } from '@testing-library/react';

export function searchControls() {
  const header = within(screen.getByRole('banner'));
  const [clear, submit] = header.getAllByRole('button');
  // The legacy icon buttons lack accessible names. Roles/order are the fallback
  // until the Phase 6 markup fixes; tests must not silently change the product.
  if (!clear || !submit) throw new Error('Controles de busca ausentes.');
  return { input: header.getByRole('textbox'), clear, submit };
}
