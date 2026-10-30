import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const routes = [
  '/',
  '/catalog/popular/1',
  '/genres/18/Drama',
  '/movie-details/1',
  '/cast',
  '/cast/2',
  '/minha-lista',
  '/nao-existe',
];
test.use({ reducedMotion: 'reduce' });
for (const width of [360, 768, 1024, 1440]) {
  for (const route of routes)
    test(`AA e reflow em ${width}px, escuro: ${route}`, async ({ page }) => {
      test.setTimeout(60000);
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(() => localStorage.setItem('theme', 'light'));
      await page.goto(route);
      await expect(page.locator('[data-design-theme]')).toHaveAttribute(
        'data-design-theme',
        'dark',
      );
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await page.evaluate(async () => {
        await document.fonts.ready;
      });
      await expect(
        page.locator('[aria-label="Carregando resultados"]'),
      ).toHaveCount(0);
      const scan = await new AxeBuilder({ page })
        // Omit passing-node details without replacing the rule/tag selection.
        .options({ resultTypes: ['violations'] })
        .withTags([
          'wcag2a',
          'wcag2aa',
          'wcag21aa',
          'wcag22aa',
          'best-practice',
        ])
        .analyze();
      expect(
        scan.violations.map((item) => ({
          id: item.id,
          nodes: item.nodes.map((node) => node.target),
        })),
        route,
      ).toEqual([]);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        route,
      ).toBe(width);
    });
}
test('link de pular conteúdo funciona pelo teclado', async ({ page }) => {
  await page.goto('/catalog/popular/1');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Pular para o conteúdo principal' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
});
