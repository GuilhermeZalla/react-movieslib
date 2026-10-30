import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { startFixtureServer } from './fixtureServer.mjs';
const label = process.argv[2] || 'after';
if (!['baseline', 'after'].includes(label))
  throw new Error('Use baseline or after.');
const server = await startFixtureServer();
const browser = await chromium.launch({
  headless: true,
  args: ['--remote-debugging-port=9223'],
});
try {
  const results = [];
  for (const path of ['/', '/catalog/popular/1']) {
    const report = await lighthouse('http://127.0.0.1:4180' + path, {
      port: 9223,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });
    if (!report) throw new Error('Lighthouse did not return a report.');
    const { lhr } = report;
    results.push({
      path,
      scores: Object.fromEntries(
        Object.entries(lhr.categories).map(([key, value]) => [
          key,
          Math.round((value.score || 0) * 100),
        ]),
      ),
      metrics: Object.fromEntries(
        [
          'first-contentful-paint',
          'largest-contentful-paint',
          'cumulative-layout-shift',
          'total-blocking-time',
        ].map((key) => [key, lhr.audits[key]?.numericValue]),
      ),
      failedAudits: Object.values(lhr.audits)
        .filter(
          (a) =>
            a.score !== null &&
            a.score < 1 &&
            a.scoreDisplayMode !== 'informative',
        )
        .map((a) => ({ id: a.id, title: a.title, score: a.score })),
      lighthouseVersion: lhr.lighthouseVersion,
    });
  }
  mkdirSync('docs/quality', { recursive: true });
  writeFileSync(
    'docs/quality/lighthouse-' + label + '.json',
    JSON.stringify(
      {
        fixtureOnly: true,
        mode: 'mobile simulated throttling, Lighthouse defaults',
        results,
      },
      null,
      2,
    ) + '\n',
  );
  process.stdout.write(
    JSON.stringify(
      results.map(({ path, scores }) => ({ path, ...scores })),
      null,
      2,
    ) + '\n',
  );
} finally {
  await browser.close();
  await new Promise((resolveClosed) => server.close(resolveClosed));
}
