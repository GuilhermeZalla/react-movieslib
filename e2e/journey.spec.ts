import { test, expect } from '@playwright/test';

test('validação e navegação não disparam violações da CSP estrita', async ({
  page,
}) => {
  await page.addInitScript(() =>
    document.addEventListener('securitypolicyviolation', () =>
      document.documentElement.setAttribute('data-csp-violation', 'true'),
    ),
  );
  await page.goto('/catalog/popular/1');
  await page.getByRole('link', { name: /Filme de exemplo.*Nota/ }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Filme de exemplo' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Quem está em cena' }),
  ).toBeVisible();
  await expect(page.locator('html')).not.toHaveAttribute(
    'data-csp-violation',
    'true',
  );
});
test('busca → detalhe → trailer → voltar → minha lista → recarregar → remover', async ({
  page,
}) => {
  const outside: string[] = [];
  page.on('request', (request) => {
    if (
      !request.url().startsWith('http://127.0.0.1:4180') &&
      !request.url().startsWith('https://www.youtube-nocookie.com/')
    )
      outside.push(request.url());
  });
  await page.route('https://www.youtube-nocookie.com/**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><html lang="pt-BR"><title>Player fictício</title><body>Trailer de teste</body></html>',
    }),
  );
  await page.goto('/catalog/popular/1');
  await page.getByRole('searchbox', { name: 'Buscar filme' }).fill('Filme');
  await expect(
    page.getByRole('heading', { name: 'Busca por “Filme”' }),
  ).toBeVisible();
  await page.getByRole('spinbutton', { name: 'Ano' }).fill('2026');
  await page.getByRole('link', { name: /Filme de exemplo.*Nota/ }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Filme de exemplo' }),
  ).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Guardar Filme de exemplo na minha lista' })
    .click();
  await page.getByRole('button', { name: 'Abrir trailer' }).click();
  await expect(page.locator('iframe')).toHaveAttribute(
    'src',
    /^https:\/\/www.youtube-nocookie.com\/embed\/abcdefghijk\?autoplay=0/,
  );
  await page.keyboard.press('Escape');
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.goBack();
  await expect(
    page.getByRole('searchbox', { name: 'Buscar filme' }),
  ).toHaveValue('Filme');
  await expect(page.getByRole('spinbutton', { name: 'Ano' })).toHaveValue(
    '2026',
  );
  await page.getByRole('link', { name: 'Minha lista', exact: true }).click();
  await page.reload();
  const ids: unknown = await page.evaluate(
    () =>
      JSON.parse(
        localStorage.getItem('movieslib:saved-ids') ?? '[]',
      ) as unknown,
  );
  expect(ids).toEqual([1]);
  await page
    .getByRole('button', { name: 'Retirar Filme de exemplo na minha lista' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Nenhum ingresso guardado' }),
  ).toBeVisible();
  expect(outside).toEqual([]);
});
test('pessoas: busca, paginação e biografia mantêm URL e navegação', async ({
  page,
}) => {
  await page.goto('/cast');
  await page.getByRole('searchbox', { name: 'Buscar pessoa' }).fill('Pessoa');
  await expect(
    page.getByRole('heading', { name: 'Pessoas: “Pessoa”' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Página 2', exact: true }).click();
  await expect(page).toHaveURL(/q=Pessoa.*page=2|page=2.*q=Pessoa/);
  await page.getByRole('link', { name: /Pessoa de exemplo/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Biografia', exact: true }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole('searchbox', { name: 'Buscar pessoa' }),
  ).toHaveValue('Pessoa');
});
test('headers locais de produção e API separada da SPA', async ({
  request,
}) => {
  const response = await request.get('/');
  const headers = response.headers();
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['content-security-policy']).toContain(
    'frame-src https://www.youtube-nocookie.com',
  );
  expect(headers['content-security-policy']).not.toContain('unsafe-inline');
  expect(headers['permissions-policy']).toContain('camera=()');
  const api = await request.get('/api/tmdb/movie/popular');
  expect(api.headers()['content-type']).toContain('application/json');
});
