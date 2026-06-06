/**
 * Critical audit fixes: edge redirect script, footer i18n (EN/TR).
 * Run: node scripts/fix-audit-critical.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const EDGE_TAG = '  <script src="scripts/edge-redirect.js"></script>\n';

const FOOTER_I18N = {
  en: { from: 'Google-Bewertung abgeben', to: 'Leave a Google review' },
  tr: { from: 'Google-Bewertung abgeben', to: "Google'da değerlendirme yazın" },
};

function injectEdgeRedirect(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  if (html.includes('scripts/edge-redirect.js')) return false;
  const marker = '<meta charset="UTF-8">';
  if (!html.includes(marker)) return false;
  html = html.replace(marker, marker + '\n' + EDGE_TAG.trimEnd());
  fs.writeFileSync(filePath, html, 'utf8');
  return true;
}

function fixFooterLang(filePath, lang) {
  const { from, to } = FOOTER_I18N[lang];
  let html = fs.readFileSync(filePath, 'utf8');
  if (!html.includes(from)) return false;
  html = html.split(from).join(to);
  fs.writeFileSync(filePath, html, 'utf8');
  return true;
}

const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
let injected = 0;
let i18n = 0;

for (const file of htmlFiles) {
  if (injectEdgeRedirect(path.join(root, file))) injected++;
  if (file.endsWith('-en.html') && fixFooterLang(path.join(root, file), 'en')) i18n++;
  if (file.endsWith('-tr.html') && fixFooterLang(path.join(root, file), 'tr')) i18n++;
}

console.log(`edge-redirect injected: ${injected} HTML files`);
console.log(`footer i18n fixed: ${i18n} files`);
