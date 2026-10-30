import { expect, test } from '@playwright/test';
import fixture from '../src/test/fixtures/tmdb.json' with { type: 'json' };
test('rótulos ingleses do menu cabem em seus próprios links no celular', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem('movieslib:locale', 'en-US'),
  );
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(
    navigation.getByRole('link', { name: 'Coming soon' }),
  ).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  for (const width of [360, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const boxes = await navigation.getByRole('link').evaluateAll((links) =>
      links.map((link) => {
        const label = link.querySelector('span');
        if (!label) throw new Error('Rótulo ausente.');
        const box = link.getBoundingClientRect(),
          text = label.getBoundingClientRect();
        return { left: text.left - box.left, right: box.right - text.right };
      }),
    );
    expect(boxes).toHaveLength(5);
    for (const box of boxes) {
      expect(box.left).toBeGreaterThanOrEqual(0);
      expect(box.right).toBeGreaterThanOrEqual(0);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  }
});
test('idioma muda interface e dados, preserva rota/lista e sobrevive à recarga', async ({
  page,
}) => {
  const requests: string[] = [];
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() =>
    localStorage.setItem('movieslib:saved-ids', '[1]'),
  );
  await page.route('**/api/tmdb/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.includes('/image/'))
      return route.fulfill({ status: 404, body: '' });
    const english = url.searchParams.get('locale') === 'en-US';
    requests.push(url.searchParams.get('locale') ?? 'missing');
    if (url.pathname.includes('/genre/'))
      return route.fulfill({
        json: { genres: [{ id: 28, name: english ? 'Action' : 'Ação' }] },
      });
    return route.fulfill({
      json: {
        page: Number(url.searchParams.get('page') ?? 1),
        total_pages: 5,
        total_results: 100,
        results: [
          {
            ...fixture.movie,
            title: english ? 'A movie in English' : 'Um filme em português',
          },
        ],
      },
    });
  });
  await page.goto('/catalog/popular/2');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Filmes populares',
  );
  await expect(page.getByRole('heading', { level: 3 })).toHaveText(
    'Um filme em português',
  );
  await page
    .getByRole('combobox', { name: 'Alterar idioma' })
    .selectOption('en-US');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Popular movies',
  );
  await expect(page.getByRole('heading', { level: 3 })).toHaveText(
    'A movie in English',
  );
  await expect(page).toHaveURL('/catalog/popular/2');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  await expect(
    page.getByRole('option', { name: 'Action', exact: true }),
  ).toHaveCount(1);
  expect(
    await page.evaluate(() => localStorage.getItem('movieslib:saved-ids')),
  ).toBe('[1]');
  await page.reload();
  await expect(
    page.getByRole('combobox', { name: 'Change language' }),
  ).toHaveValue('en-US');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Popular movies',
  );
  await page
    .getByRole('combobox', { name: 'Change language' })
    .selectOption('pt-BR');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Filmes populares',
  );
  await expect(
    page.getByRole('option', { name: 'Ação', exact: true }),
  ).toHaveCount(1);
  expect(requests).toContain('pt-BR');
  expect(requests).toContain('en-US');
  expect(requests).not.toContain('missing');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
test('CTA aparece somente na home e tradução alcança pessoas, erros, lista e 404', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('link', { name: 'A próxima sessão →' }),
  ).toHaveCount(1);
  await page
    .getByRole('combobox', { name: 'Alterar idioma' })
    .selectOption('en-US');
  await page.getByRole('link', { name: 'Your next screening →' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Popular movies',
  );
  await expect(
    page.getByRole('link', { name: 'Your next screening →' }),
  ).toHaveCount(0);
  await page.goto('/cast');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'The people behind the movies',
  );
  await page.goto('/cast/2');
  await expect(page.getByRole('heading', { name: 'Biography' })).toBeVisible();
  await expect(page.getByText('Gender', { exact: true })).toBeVisible();
  await page.goto('/minha-lista');
  await expect(
    page.getByRole('heading', { name: 'No movies saved yet' }),
  ).toBeVisible();
  await page.goto('/not-a-route');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    '404 — Page not found',
  );
  await page.route('**/api/tmdb/movie/popular**', (route) =>
    route.fulfill({ status: 429, json: { error: 'LIMITED' } }),
  );
  await page.goto('/catalog/popular/1');
  await expect(page.getByRole('alert')).toContainText(
    'Too many requests. Try again shortly.',
  );
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
});
test('player envia a origem necessária e mantém alternativa externa sem autoplay', async ({
  page,
  baseURL,
}) => {
  let referer: string | undefined;
  await page.route('https://www.youtube-nocookie.com/**', async (route) => {
    referer = (await route.request().allHeaders()).referer;
    return route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Player fixture</title>',
    });
  });
  await page.goto('/movie-details/1');
  expect(referer).toBeUndefined();
  await page.getByRole('button', { name: 'Abrir trailer' }).click();
  await expect
    .poll(() => referer)
    .toBe(new URL(baseURL ?? 'http://127.0.0.1:4180').origin + '/');
  await expect(page.locator('iframe')).toHaveAttribute(
    'referrerpolicy',
    'strict-origin-when-cross-origin',
  );
  await expect(page.locator('iframe')).toHaveAttribute('src', /autoplay=0/);
  await expect(
    page.getByRole('link', { name: 'Assistir no YouTube' }),
  ).toHaveAttribute('rel', 'noopener noreferrer');
});
for (const width of [360, 1440])
  test(`destaque ${width}px mantém quadro e retoma automático depois da seta`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const start = new Date('2026-10-29T12:00:00Z');
    await page.clock.install({ time: start });
    await page.route('**/api/tmdb/**', async (route) => {
      const url = new URL(route.request().url());
      if (url.pathname.includes('/image/')) {
        const portrait = url.pathname.includes('portrait');
        return route.fulfill({
          contentType: 'image/svg+xml',
          body: `<svg xmlns="http://www.w3.org/2000/svg" width="${portrait ? 400 : 1600}" height="${portrait ? 600 : 900}"><rect width="100%" height="100%" fill="${portrait ? '#843b45' : '#233d47'}"/></svg>`,
        });
      }
      return route.fulfill({
        json: url.pathname.includes('/genre/')
          ? { genres: [] }
          : {
              page: 1,
              total_pages: 1,
              total_results: 2,
              results: [
                {
                  ...fixture.movie,
                  id: 1,
                  title: 'Um filme',
                  backdrop_path: '/landscape.jpg',
                },
                {
                  ...fixture.movie,
                  id: 2,
                  title:
                    'Uma história de título muito mais longo que precisa ocupar várias linhas sem mudar o tamanho da abertura',
                  overview: 'Uma sinopse comprida. '.repeat(50),
                  backdrop_path: '/portrait.jpg',
                },
              ],
            },
      });
    });
    await page.goto('/');
    const hero = page.getByRole('region', { name: 'Destaque', exact: true });
    await expect(hero.getByRole('heading', { level: 1 })).toHaveText(
      'Um filme',
    );
    // Let query notifications render first, then freeze layout/locator time.
    await page.clock.pauseAt(
      new Date((await page.evaluate(() => Date.now())) + 1000),
    );
    const bounds = await hero.boundingBox();
    const image = hero.locator('img');
    const firstImage = await image.boundingBox();
    await hero.getByRole('button', { name: 'Próximo destaque' }).click();
    await expect(image).toHaveAttribute('src', /portrait/);
    expect(await hero.boundingBox()).toEqual(bounds);
    expect(await image.boundingBox()).toEqual(firstImage);
    await page.clock.fastForward(6999);
    await expect(image).toHaveAttribute('src', /portrait/);
    await page.clock.fastForward(1);
    await expect(image).toHaveAttribute('src', /landscape/);
    expect(await hero.boundingBox()).toEqual(bounds);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  });
