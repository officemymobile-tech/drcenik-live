/**
 * Google Search Console – Verifizierungs-Meta-Tag auf alle HTML-Seiten setzen.
 *
 * 1. In Search Console: Property „https://www.drcenik.at/“ anlegen
 * 2. Verifizierung „HTML-Tag“ wählen, content-Wert kopieren
 * 3. Ausführen: node scripts/setup-gsc.mjs IHR_TOKEN
 *    oder: echo TOKEN > config/gsc-verification.txt && npm run setup-gsc
 * 4. Deploy, in Search Console „Bestätigen“
 * 5. Sitemap einreichen: https://www.drcenik.at/sitemap.xml
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITEMAP = 'https://www.drcenik.at/sitemap.xml';

function readToken() {
  const arg = process.argv[2];
  if (arg && !arg.startsWith('-')) return arg.trim();
  const cfg = path.join(root, 'config', 'gsc-verification.txt');
  if (fs.existsSync(cfg)) {
    const line = fs.readFileSync(cfg, 'utf8').split(/\r?\n/).find((l) => l.trim() && !l.trim().startsWith('#'));
    if (line) return line.trim();
  }
  return null;
}

const token = readToken();
if (!token) {
  console.error(`
Google Search Console – Token fehlt.

So geht's:
  1. https://search.google.com/search-console → Property hinzufügen
  2. URL-Präfix: https://www.drcenik.at/
  3. Verifizierung: „HTML-Tag“ → content="..." kopieren
  4. node scripts/setup-gsc.mjs IHR_TOKEN

Oder Token in config/gsc-verification.txt speichern (eine Zeile, ohne #).
`);
  process.exit(1);
}

const meta = `  <meta name="google-site-verification" content="${token}">`;
const metaRe = /<meta name="google-site-verification" content="[^"]*">\s*\n?/;

let updated = 0;
for (const file of fs.readdirSync(root).filter((f) => f.endsWith('.html'))) {
  if (file === 'prototype-apple.html') continue;
  const fp = path.join(root, file);
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes(`content="${token}"`)) continue;
  if (metaRe.test(html)) {
    html = html.replace(metaRe, meta + '\n');
  } else if (html.includes('<meta charset="UTF-8">')) {
    html = html.replace('<meta charset="UTF-8">', `<meta charset="UTF-8">\n${meta}`);
  } else {
    continue;
  }
  fs.writeFileSync(fp, html);
  console.log('Meta-Tag gesetzt:', file);
  updated++;
}

console.log(`\n${updated} Seite(n) aktualisiert.`);
console.log('Nächste Schritte:');
console.log('  1. Deploy / git push');
console.log('  2. Search Console → „Bestätigen“');
console.log(`  3. Sitemaps → ${SITEMAP} einreichen`);
