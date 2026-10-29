import { test, expect } from '@playwright/test';
import fixture from '../src/test/fixtures/tmdb.json' with { type: 'json' };

test.use({ reducedMotion: 'reduce' });

for (const width of [360, 768, 1024, 1440]) {
  for (const theme of ['dark', 'light'] as const) {
    test(`home ${width}px, ${theme}: sem overflow e carrossel por teclado`, async ({
      page,
      baseURL,
    }) => {
      if (!baseURL) throw new Error('baseURL não configurada para o teste.');
      const origin = new URL(baseURL).origin;
      const externalRequests: string[] = [];
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(
        (value) => localStorage.setItem('theme', value),
        theme,
      );
      await page.route('**/*', async (route) => {
        const url = new URL(route.request().url());
        if (url.origin !== origin) {
          externalRequests.push(url.origin);
          return route.abort();
        }
        if (url.pathname.startsWith('/api/tmdb/image/')) {
          return route.fulfill({ status: 404, body: '' });
        }
        if (url.pathname.startsWith('/api/tmdb/')) {
          return route.fulfill({
            json: url.pathname.includes('/genre/')
              ? { genres: fixture.movie.genres }
              : {
                  page: 1,
                  total_pages: 1,
                  total_results: 20,
                  results: Array.from({ length: 20 }, (_, index) => ({
                    ...fixture.movie,
                    id: index + 1,
                    title: `Filme demonstrativo ${index + 1}`,
                  })),
                },
          });
        }
        if (url.pathname === '/tmdb-logo.svg') {
          return route.fulfill({ status: 404, body: '' });
        }
        return route.continue();
      });

      await page.goto('/');
      await expect(
        page.getByRole('heading', {
          level: 1,
          name: 'Filme demonstrativo 1',
          exact: true,
        }),
      ).toBeVisible();
      await page.evaluate(async () => {
        await document.fonts.ready;
      });
      const loadedFonts = await page.evaluate(() =>
        [...document.fonts]
          .filter((font) => font.status === 'loaded')
          .map((font) => font.family),
      );
      expect(loadedFonts).toEqual(
        expect.arrayContaining([
          'Bricolage Grotesque Variable',
          'Figtree Variable',
        ]),
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      const carousel = page.getByRole('region', { name: 'Filmes populares' });
      await page.getByRole('button', { name: 'Próximo', exact: true }).focus();
      await page.keyboard.press('Enter');
      await expect
        .poll(() => carousel.evaluate((element) => element.scrollLeft))
        .toBeGreaterThan(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      expect(externalRequests).toEqual([]);
    });
  }
}
