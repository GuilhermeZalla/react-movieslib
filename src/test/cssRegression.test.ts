import { describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

describe('regressão de CSS: utilitários do Tailwind no build', () => {
  it('gera as classes utilitárias essenciais no CSS do build', () => {
    const root = resolve(process.cwd());
    const outDir = resolve(root, 'dist-css-regression');
    execSync(`npm run build -- --outDir ${outDir}`, {
      cwd: root,
      stdio: 'pipe',
      timeout: 30000,
    });
    const assetsDir = resolve(outDir, 'assets');
    const cssFiles = readdirSync(assetsDir).filter((f) => f.endsWith('.css'));
    expect(cssFiles.length).toBeGreaterThan(0);
    const css = cssFiles
      .map((f) => readFileSync(resolve(assetsDir, f), 'utf8'))
      .join('\n');
    const essential = [
      '.flex',
      '.grid',
      '.gap-3',
      '.p-5',
      '.text-preview-title',
      '.items-center',
      '.justify-center',
    ];
    for (const cls of essential) {
      expect(css, `classe ${cls} ausente no CSS gerado`).toContain(cls);
    }
    rmSync(outDir, { recursive: true, force: true });
  });
});
