import { ESLint } from 'eslint';

const eslint = new ESLint();
const results = await eslint.lintFiles(['.']);
const formatter = await eslint.loadFormatter('stylish');
process.stdout.write(formatter.format(results));
const errors = results.reduce((sum, result) => sum + result.errorCount, 0);
const warnings = results.reduce((sum, result) => sum + result.warningCount, 0);
process.stdout.write(`\n${errors} error(s), ${warnings} warning(s).\n`);
if (errors > 0 || warnings > 0) process.exitCode = 1;
