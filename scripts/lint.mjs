import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ESLint } from 'eslint';

// Phase 6 debt, authorized in STATUS.md: do not change the legacy dropdown markup here.
// Match the source rather than a line number so formatting cannot invalidate the list.
const deferredFiles = new Map([
  [
    'src/components/common/aside/aside.tsx',
    '<a role="button" className="aside__dropdown" onClick={handleDropDown}>',
  ],
  [
    'src/components/common/asideMobile/asideMobile.tsx',
    '<a role="button" onClick={handleDropUpMenu}>',
  ],
]);
const deferredRules = new Set([
  'jsx-a11y/anchor-is-valid',
  'jsx-a11y/click-events-have-key-events',
  'jsx-a11y/interactive-supports-focus',
]);

const eslint = new ESLint();
const results = await eslint.lintFiles(['.']);
const formatter = await eslint.loadFormatter('stylish');
process.stdout.write(formatter.format(results));
let unexpected = 0;
const accepted = new Set();
for (const result of results) {
  const relativePath = path
    .relative(process.cwd(), result.filePath)
    .split(path.sep)
    .join('/');
  const lines = (await readFile(result.filePath, 'utf8')).split(/\r?\n/);
  for (const message of result.messages) {
    if (message.severity !== 1) continue;
    const key = `${relativePath}:${message.ruleId}`;
    const documented =
      deferredFiles.has(relativePath) &&
      deferredRules.has(message.ruleId) &&
      lines[message.line - 1]?.trim() === deferredFiles.get(relativePath) &&
      !accepted.has(key);
    if (documented) accepted.add(key);
    else unexpected++;
  }
}
const errors = results.reduce((sum, result) => sum + result.errorCount, 0);
process.stdout.write(
  `Documented Phase 6 warnings: ${accepted.size}; unexpected warnings: ${unexpected}.\n`,
);
if (errors > 0 || unexpected > 0) process.exitCode = 1;
