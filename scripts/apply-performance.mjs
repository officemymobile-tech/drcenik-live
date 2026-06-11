/**
 * Batch performance head/body fixes across public HTML pages.
 * Run: npm run apply-performance
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['prototype-apple.html', '267059-geschenkgutschein-vorlage.html']);

function assetPrefix(file) {
  const depth = file.split('/').length - 1;
  return depth ? '../'.repeat(depth) : '';
}

function walk(dir, acc = [], prefix = '') {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${ent.name}` : ent.name;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, acc, rel);
    else if (ent.name.endsWith('.html')) acc.push(rel.replace(/\\/g, '/'));
  }
  return acc;
}

function patch(html, file) {
  let changed = false;
  const prefix = assetPrefix(file);
  const isHome = file === 'index.html' || file === 'en/index.html' || file === 'tr/index.html';

  if (isHome) {
    const preloadRe = new RegExp(
      `<link rel="preload" href="${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}assets/logo\\.webp" as="image">`
    );
    const preloadOpt = `<link rel="preload" href="${prefix}assets/logo.webp" as="image" type="image/webp" fetchpriority="high">`;
    if (preloadRe.test(html) && !html.includes(`${prefix}assets/logo.webp" as="image" type="image/webp" fetchpriority="high"`)) {
      html = html.replace(preloadRe, preloadOpt);
      changed = true;
    }
  }

  if (html.includes('splash-screen__logo') && html.includes('height="auto"')) {
    html = html.replace(
      /class="splash-screen__logo" width="220" height="auto"/g,
      'class="splash-screen__logo" width="220" height="220"'
    );
    changed = true;
  }

  if (html.includes('gutscheine-voucher-img') && html.includes('height="auto"')) {
    html = html.replace(
      /class="gutscheine-voucher-img" width="300" height="auto"/g,
      'class="gutscheine-voucher-img" width="300" height="420"'
    );
    changed = true;
  }

  const navLogoRe = /class="navbar-logo-icon" height="58"/g;
  if (navLogoRe.test(html) && !html.includes('navbar-logo-icon" width=')) {
    html = html.replace(navLogoRe, 'class="navbar-logo-icon" width="140" height="58"');
    changed = true;
  }

  return { html, changed };
}

let count = 0;
for (const file of walk(root)) {
  if (SKIP.has(file)) continue;
  const full = path.join(root, file);
  const { html, changed } = patch(fs.readFileSync(full, 'utf8'), file);
  if (changed) {
    fs.writeFileSync(full, html);
    count++;
    console.log('updated', file);
  }
}
console.log(`\n${count} HTML-Dateien aktualisiert.`);
