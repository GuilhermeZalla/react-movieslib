import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
const escape = (text) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const source = await readFile('docs/GUIA_ENTREVISTA.md', 'utf8');
const body = source
  .split(/\r?\n/)
  .filter((line) => line.trim())
  .map((line) => {
    const heading = /^(#{1,3}) (.+)$/.exec(line);
    if (heading)
      return `<h${heading[1].length}>${escape(heading[2])}</h${heading[1].length}>`;
    return `<p${/^(?:- |\d+\. )/.test(line) ? ' class="item"' : ''}>${escape(line.replace(/^- /, '• '))}</p>`;
  })
  .join('\n');
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setContent(
    `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>MoviesLib — guia para entrevista</title><style>@page{size:A4}body{font:14px/1.55 Arial,sans-serif;color:#1a1c20}h1{font-size:24px;color:#8f1d1d}h2{font-size:18px;margin-top:22px;border-bottom:1px solid #ddd;padding-bottom:5px}h3{font-size:15px;margin-top:16px}h1,h2,h3{break-after:avoid}p{orphans:3;widows:3;margin:7px 0}.item{padding-left:12px}a{color:#8f1d1d}</style></head><body>${body}</body></html>`,
  );
  const pdf = await page.pdf({
    format: 'A4',
    margin: { top: '16mm', right: '18mm', bottom: '19mm', left: '18mm' },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate:
      '<div style="font-size:9px;width:100%;text-align:center;color:#555">MoviesLib · Guilherme Zalla · <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
  });
  await writeFile('docs/GUIA_ENTREVISTA.pdf', pdf);
  process.stdout.write(
    'Interview guide PDF generated from the Markdown source.\n',
  );
} finally {
  await browser.close();
}
