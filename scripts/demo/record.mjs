import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { startFixtureServer } from '../fixtureServer.mjs';
import { artwork, response } from './showcase.mjs';
import { gif } from './gif.mjs';

const origin = 'http://127.0.0.1:4182';
const server = await startFixtureServer({ port: 4182 });
let browser;
try {
  browser = await chromium.launch();
  await mkdir('docs/screenshots', { recursive: true });
  await mkdir('docs/demo', { recursive: true });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.addInitScript(() => {
    globalThis.localStorage.setItem(
      'movieslib:saved-ids',
      JSON.stringify([101, 102, 103]),
    );
  });
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) return route.abort();
    if (url.pathname.startsWith('/api/tmdb/image/')) {
      return route.fulfill({
        contentType: 'image/svg+xml',
        body: artwork(url.pathname),
      });
    }
    if (url.pathname.startsWith('/api/tmdb/'))
      return route.fulfill({ json: response(url.pathname, url.searchParams) });
    return route.continue();
  });
  const page = await context.newPage();
  async function ready(path) {
    await page.goto(origin + path);
    await page.getByRole('heading', { level: 1 }).waitFor();
    await page.evaluate(async () => {
      await globalThis.document.fonts.ready;
      await Promise.all(
        [...globalThis.document.images].map((image) =>
          image.decode().catch(() => {}),
        ),
      );
    });
    await page.waitForTimeout(350);
  }
  const routes = [
    ['home', '/'],
    ['catalogo', '/catalog/popular/1'],
    ['filme', '/movie-details/101'],
    ['pessoas', '/cast'],
    ['pessoa', '/cast/201'],
    ['minha-lista', '/minha-lista'],
  ];
  const pixelPage = await browser.newPage();
  async function frame(width, height) {
    const png = await page.screenshot();
    return Uint8Array.from(
      await pixelPage.evaluate(
        async ({ data, width, height }) => {
          const image = new globalThis.Image();
          image.src = 'data:image/png;base64,' + data;
          await image.decode();
          const canvas = globalThis.document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, width, height);
          const pixels = ctx.getImageData(0, 0, width, height).data;
          const result = [];
          for (let index = 0; index < pixels.length; index += 4)
            result.push(
              ((pixels[index] >> 5) << 5) |
                ((pixels[index + 1] >> 5) << 2) |
                (pixels[index + 2] >> 6),
            );
          return result;
        },
        { data: png.toString('base64'), width, height },
      ),
    );
  }
  for (const [device, width, height, gifWidth, gifHeight] of [
    ['desktop', 1440, 1000, 960, 667],
    ['mobile', 390, 844, 300, 649],
  ]) {
    await page.setViewportSize({ width, height });
    const frames = [];
    for (const [name, path] of routes) {
      await ready(path);
      await page.screenshot({ path: `docs/screenshots/${name}-${device}.png` });
      frames.push(await frame(gifWidth, gifHeight));
      if (name === 'home') {
        await page
          .getByRole('button', { name: 'Próximo destaque', exact: true })
          .click();
        frames.push(await frame(gifWidth, gifHeight));
        await page.evaluate(() => globalThis.scrollTo(0, 620));
        await page.waitForTimeout(100);
        frames.push(await frame(gifWidth, gifHeight));
      }
    }
    await writeFile(
      `docs/demo/movieslib-${device}.gif`,
      gif(gifWidth, gifHeight, frames, 180),
    );
    process.stdout.write(
      `${device}: ${routes.length} screenshots, ${frames.length} GIF frames\n`,
    );
  }
  await pixelPage.setViewportSize({ width: 180, height: 180 });
  const svg = await readFile('public/favicon.svg', 'utf8');
  await pixelPage.setContent(
    `<style>body{margin:0}svg{display:block;width:100vw;height:100vh}</style>${svg}`,
  );
  await pixelPage.screenshot({ path: 'public/apple-touch-icon.png' });
  await pixelPage.setViewportSize({ width: 64, height: 64 });
  const png = await pixelPage.screenshot();
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header[6] = 64;
  header[7] = 64;
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  await writeFile('public/favicon.ico', Buffer.concat([header, png]));
  process.stdout.write(
    'Local SVG, ICO and Apple icons aligned. No TMDB network or credentials used.\n',
  );
} finally {
  await browser?.close();
  await new Promise((resolveClose, reject) =>
    server.close((error) => (error ? reject(error) : resolveClose())),
  );
}
