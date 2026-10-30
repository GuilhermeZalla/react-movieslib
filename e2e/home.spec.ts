import { test, expect } from '@playwright/test';
import fixture from '../src/test/fixtures/tmdb.json' with { type: 'json' };

test.use({ reducedMotion: 'reduce' });

for (const width of [360, 768, 1024, 1440]) {
  test(`home ${width}px, escuro: sem overflow e carrossel por teclado`, async ({
    page,
    baseURL,
  }) => {
    if (!baseURL) throw new Error('baseURL não configurada para o teste.');
    const origin = new URL(baseURL).origin;
    const externalRequests: string[] = [];
    await page.setViewportSize({ width, height: 900 });
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

test('destaque gira sem pausa/play, conserva dimensões e só oferece setas', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.route('**/api/tmdb/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.includes('/image/')) {
      const wide = url.pathname.includes('wide');
      return route.fulfill({
        contentType: 'image/svg+xml',
        body: `<svg xmlns="http://www.w3.org/2000/svg" width="${wide ? 1600 : 400}" height="${wide ? 900 : 600}"><rect width="100%" height="100%" fill="#243b47"/></svg>`,
      });
    }
    return route.fulfill({
      json: url.pathname.includes('/genre/')
        ? { genres: fixture.movie.genres }
        : {
            page: 1,
            total_pages: 1,
            total_results: 2,
            results: [
              {
                ...fixture.movie,
                id: 1,
                title: 'Primeiro destaque',
                backdrop_path: '/wide.jpg',
                poster_path: '/tall.jpg',
              },
              {
                ...fixture.movie,
                id: 2,
                title: 'Segundo destaque',
                backdrop_path: '/tall.jpg',
                poster_path: '/wide.jpg',
              },
            ],
          },
    });
  });
  await page.goto('/');
  const hero = page.getByRole('region', { name: 'Destaque', exact: true });
  await expect(hero.getByRole('heading', { level: 1 })).toHaveText(
    'Primeiro destaque',
  );
  await page.clock.pauseAt(
    new Date((await page.evaluate(() => Date.now())) + 1000),
  );
  await expect(
    hero.getByRole('button', { name: /Pausar|Retomar|Reproduzir|Play/i }),
  ).toHaveCount(0);
  await expect(
    hero.locator('.feature-hero__controls').getByRole('button'),
  ).toHaveCount(2);
  const firstSize = await hero.boundingBox();
  const posters = page
    .getByRole('region', { name: 'Em cartaz', exact: true })
    .locator('.movie-card__poster');
  await expect(posters).toHaveCount(2);
  const posterSizes = await posters.evaluateAll((elements) =>
    elements.map((element) => ({
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
    })),
  );
  const [firstPoster, secondPoster] = posterSizes;
  if (!firstPoster || !secondPoster) throw new Error('Pôsteres ausentes.');
  // Grid columns can differ by one layout subpixel after distributing free space.
  expect(Math.abs(firstPoster.width - secondPoster.width)).toBeLessThan(1);
  expect(Math.abs(firstPoster.height - secondPoster.height)).toBeLessThan(1);
  await hero.hover({ position: { x: 900, y: 40 } });
  await page.clock.fastForward(7000);
  await expect(hero.getByRole('heading', { level: 1 })).toHaveText(
    'Segundo destaque',
  );
  await expect(hero.locator('img')).toHaveAttribute('src', /tall/);
  await expect(hero.locator('.feature-hero__image')).toHaveCSS(
    'animation-name',
    'none',
  );
  expect(await hero.boundingBox()).toEqual(firstSize);
  const previous = hero.getByRole('button', { name: 'Destaque anterior' });
  await previous.focus();
  await page.keyboard.press('Enter');
  await expect(hero.getByRole('heading', { level: 1 })).toHaveText(
    'Primeiro destaque',
  );
  for (const title of [
    'Segundo destaque',
    'Primeiro destaque',
    'Segundo destaque',
  ]) {
    await page.clock.fastForward(7000);
    await expect(hero.getByRole('heading', { level: 1 })).toHaveText(title);
  }
});

test('créditos identificam o autor e a marca usa o mesmo SVG do favicon', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByText('Guilherme Zalla')).toHaveCount(1);
  await expect(
    page.getByRole('link', { name: /Código no GitHub/ }),
  ).toHaveAttribute(
    'href',
    'https://github.com/GuilhermeZalla/react-movieslib',
  );
  await expect(page.locator('.cinema-brand img')).toHaveAttribute(
    'src',
    '/favicon.svg',
  );
  const icon = await page.request.get('/favicon.svg');
  expect(icon.ok()).toBe(true);
  expect((await icon.text()).toLowerCase()).toContain('#c62828');
});
