import { test, expect } from '@playwright/test';
import fixture from '../src/test/fixtures/tmdb.json' with { type: 'json' };

test('erro de rede permite recuperação; resposta vazia não oferece retry', async ({
  page,
}) => {
  let offline = true;
  await page.route('**/api/tmdb/movie/popular?**', (route) =>
    offline
      ? route.abort('internetdisconnected')
      : route.fulfill({
          json: {
            page: 1,
            total_pages: 1,
            total_results: 1,
            results: [fixture.movie],
          },
        }),
  );
  await page.goto('/catalog/popular/1');
  await expect(
    page.getByRole('button', { name: 'Tentar novamente' }),
  ).toBeVisible();
  offline = false;
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(
    page.getByRole('link', { name: /Filme de exemplo.*Nota/ }),
  ).toBeVisible();
  await page.route('**/api/tmdb/search/movie?**', (route) =>
    route.fulfill({
      json: { page: 1, total_pages: 0, total_results: 0, results: [] },
    }),
  );
  await page
    .getByRole('searchbox', { name: 'Buscar filme' })
    .fill('zzsemresultados');
  await expect(
    page.getByRole('heading', { name: 'Nenhum filme encontrado' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Tentar novamente' }),
  ).toHaveCount(0);
});

for (const reducedMotion of ['reduce', 'no-preference'] as const)
  test(`escuro fixo preserva hover dos cards, movimento: ${reducedMotion}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await page.addInitScript(() => localStorage.setItem('theme', 'light'));
    await page.goto('/catalog/popular/1');
    await expect(page.locator('[data-design-theme]')).toHaveAttribute(
      'data-design-theme',
      'dark',
    );
    await expect(
      page.getByRole('button', { name: /Alternar para tema/ }),
    ).toHaveCount(0);
    const poster = page
      .getByRole('link', { name: /Filme de exemplo.*Nota/ })
      .locator('.movie-card__poster');
    await expect(poster).toBeVisible();
    await poster.hover();
    const lift = reducedMotion === 'reduce' ? -1 : -4;
    const scale = reducedMotion === 'reduce' ? 1.01 : 1.035;
    await expect(poster).toHaveCSS(
      'transform',
      `matrix(1, 0, 0, 1, 0, ${lift})`,
    );
    await expect(poster.locator('img')).toHaveCSS(
      'transform',
      `matrix(${scale}, 0, 0, ${scale}, 0, 0)`,
    );
    await expect(poster).toHaveCSS(
      'transition-duration',
      reducedMotion === 'reduce' ? '0.08s' : '0.16s',
    );
    await page.mouse.move(0, 0);
    await expect(poster).toHaveCSS('transform', 'none');
  });
