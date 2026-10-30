import { readFileSync } from 'node:fs';
import { z } from 'zod';
import { describe, expect, it } from 'vitest';
const config = z
  .object({
    headers: z.array(
      z.object({
        source: z.string(),
        headers: z.array(z.object({ key: z.string(), value: z.string() })),
      }),
    ),
    rewrites: z.array(
      z.object({ source: z.string(), destination: z.string() }),
    ),
  })
  .parse(
    JSON.parse(
      readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'),
    ),
  );
const headers = Object.fromEntries(
  (config.headers[0]?.headers ?? []).map((item) => [item.key, item.value]),
);
describe('cabeçalhos e fallback da SPA', () => {
  it.each([
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Referrer-Policy',
    'Permissions-Policy',
    'Content-Security-Policy',
  ])('inclui %s', (name) => {
    expect(headers[name]).toBeTruthy();
  });
  it('mantém script/style sem inline e frame limitado ao nocookie', () => {
    const csp = headers['Content-Security-Policy'] ?? '';
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("style-src 'self'");
    expect(csp).toContain('frame-src https://www.youtube-nocookie.com');
    expect(csp).not.toMatch(/unsafe-inline|unsafe-eval|\*/);
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
  });
  it('não depende de script inline para o tema padrão', () => {
    const html = readFileSync(
      new URL('../index.html', import.meta.url),
      'utf8',
    );
    expect(html).not.toMatch(/<script\s*>/);
  });
  it('fallback não captura API', () => {
    const fallback = config.rewrites.find(
      (rule) => rule.destination === '/index.html',
    );
    expect(fallback).toBeDefined();
    const expression = new RegExp('^' + (fallback?.source ?? '') + '$');
    expect(expression.test('/catalog/popular/1')).toBe(true);
    expect(expression.test('/api/tmdb/movie/popular')).toBe(false);
    expect(expression.test('/api')).toBe(false);
  });
});
