import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { gif } from './gif.mjs';

// Use the running app's public proxy. Never read tokens, environment files or
// the owner's browser profile, and never substitute TMDB responses or artwork.
const target = new URL(
  process.env.MOVIESLIB_DEMO_URL ?? 'http://127.0.0.1:5173',
);
if (
  !['http:', 'https:'].includes(target.protocol) ||
  target.username ||
  target.password
)
  throw new Error('Use an HTTP(S) app address without credentials.');
const origin = target.origin;
const files = new Map();
const browser = await chromium.launch();
const pixelPage = await browser.newPage();
try {
  for (const [device, width, height, gifWidth, gifHeight] of [
    ['desktop', 1440, 1000, 960, 667],
    ['mobile', 390, 844, 300, 649],
  ]) {
    // Disposable profiles leave the owner's language, list and cookies alone.
    const context = await browser.newContext({
      viewport: { width, height },
      locale: 'pt-BR',
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    const failures = [];
    page.on('response', (response) => {
      if (
        new URL(response.url()).pathname.startsWith('/api/') &&
        !response.ok()
      )
        failures.push(response.status());
    });
    async function settled() {
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      await expect(page.locator('.animate-pulse')).toHaveCount(0, {
        timeout: 15000,
      });
      await expect(
        page.getByRole('button', { name: 'Tentar novamente' }),
      ).toHaveCount(0);
      await page.evaluate(async () => {
        await globalThis.document.fonts.ready;
        await Promise.all(
          [...globalThis.document.images]
            .filter((image) => {
              const bounds = image.getBoundingClientRect();
              return bounds.bottom > 0 && bounds.top < globalThis.innerHeight;
            })
            .map((image) => image.decode()),
        );
      });
      if (failures.length)
        throw new Error(
          'The live API returned an error; captures were not published.',
        );
      const overflow = await page.evaluate(
        () =>
          globalThis.document.documentElement.scrollWidth >
          globalThis.innerWidth,
      );
      if (overflow)
        throw new Error('Horizontal overflow found in the capture.');
    }
    async function visit(path) {
      await page.goto(origin + path);
      await page.getByRole('heading', { level: 1 }).waitFor();
      await settled();
      process.stdout.write(`${device}: ready ${path}\n`);
    }
    const frames = [],
      delays = [];
    async function frame(delay = 150) {
      const png = await page.screenshot();
      const pixels = await pixelPage.evaluate(
        async ({ data, width, height }) => {
          const image = new globalThis.Image();
          image.src = 'data:image/png;base64,' + data;
          await image.decode();
          const canvas = globalThis.document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, width, height);
          return [...ctx.getImageData(0, 0, width, height).data];
        },
        { data: png.toString('base64'), width: gifWidth, height: gifHeight },
      );
      frames.push(Uint8Array.from(pixels));
      delays.push(delay);
    }
    async function screenshot(name) {
      files.set(
        `docs/screenshots/${name}-${device}.png`,
        await page.screenshot(),
      );
    }
    await visit('/');
    const hero = page.getByRole('region', { name: 'Destaque', exact: true });
    const moviePath = await hero
      .getByRole('link', { name: 'Ver detalhes' })
      .getAttribute('href');
    if (!moviePath) throw new Error('The live home has no featured movie.');
    await screenshot('home');
    await frame(240);
    // Observe the real seven-second timer, without substituting a manual click.
    const firstTitle = await hero
      .getByRole('heading', { level: 1 })
      .innerText();
    await expect(hero.getByRole('heading', { level: 1 })).not.toHaveText(
      firstTitle,
      { timeout: 10000 },
    );
    await settled();
    await frame(160);
    await hero
      .getByRole('button', { name: /^Guardar .* na minha lista$/ })
      .click();
    await frame(110);
    await page
      .getByRole('region', { name: 'Em cartaz', exact: true })
      .scrollIntoViewIfNeeded();
    await settled();
    await frame(180);
    if (device === 'desktop') {
      await page.locator('.home-poster-grid .movie-card').first().hover();
      await page.waitForTimeout(480);
      await frame(110);
    }
    await visit('/catalog/popular/1');
    await screenshot('catalogo');
    await frame(180);
    await page
      .getByRole('button', { name: /^Guardar .* na minha lista$/ })
      .first()
      .click();
    await visit(moviePath);
    await screenshot('filme');
    await frame(210);
    await visit('/cast');
    await screenshot('pessoas');
    await frame(150);
    const personPath = await page
      .locator('a[href^="/cast/"]')
      .first()
      .getAttribute('href');
    if (!personPath) throw new Error('The live people catalog is empty.');
    await visit(personPath);
    await screenshot('pessoa');
    await frame(180);
    await visit('/minha-lista');
    await expect(page.locator('.movie-card').first()).toBeVisible();
    await screenshot('minha-lista');
    await frame(210);
    files.set(
      `docs/demo/movieslib-${device}.gif`,
      gif(gifWidth, gifHeight, frames, delays),
    );
    process.stdout.write(
      `${device}: 6 real screenshots, ${frames.length} GIF frames; no API errors or overflow.\n`,
    );
    await context.close();
  }
  // Replace reviewed assets only after both complete captures succeed.
  await mkdir('docs/screenshots', { recursive: true });
  await mkdir('docs/demo', { recursive: true });
  for (const [path, data] of files) await writeFile(path, data);
  process.stdout.write(
    'Saved 12 PNGs and 2 GIFs from the running app. No fixtures, token access or app changes.\n',
  );
} finally {
  await browser.close();
}
