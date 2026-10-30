import { screen, within } from '@testing-library/react';
export function searchControls() {
  const form = within(
    screen.getByRole('search', { name: /Busca de (filmes|pessoas)/ }),
  );
  return {
    input: form.getByRole('searchbox'),
    submit: form.getByRole('button', { name: /Buscar/ }),
    get clear() {
      return form.getByRole('button', { name: 'Limpar busca' });
    },
  };
}
