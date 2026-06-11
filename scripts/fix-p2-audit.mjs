/**
 * P2 audit fixes: nav aria-label, twitter:image, Gutschein twitter:card
 * Run: node scripts/fix-p2-audit.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at';
const TWITTER_IMAGE = `  <meta name="twitter:image" content="${SITE}/assets/logo.webp">`;

function navLabel(file) {
  if (file.endsWith('-tr.html')) return 'Ana menü';
  if (file.endsWith('-en.html')) return 'Main navigation';
  return 'Hauptnavigation';
}

function patchFile(filePath) {
  const file = path.basename(filePath);
  if (file === 'prototype-apple.html') return false;

  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const bareNav = '<nav class="navbar" id="navbar">';
  const labeledNav = `<nav class="navbar" id="navbar" aria-label="${navLabel(file)}">`;
  if (html.includes(bareNav)) {
    html = html.replace(bareNav, labeledNav);
    changed = true;
  }

  if (html.includes('og:image') && !html.includes('twitter:image')) {
    html = html.replace(
      /(<meta property="og:image" content="[^"]+">)/,
      `$1\n${TWITTER_IMAGE}`
    );
    changed = true;
  }

  if (file === '267059-geschenkgutschein-vorlage.html' && !html.includes('twitter:card')) {
    html = html.replace(
      /(<meta property="og:locale" content="de_AT">)/,
      `$1\n  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:title" content="Geschenkgutschein-Vorlage | Dr. Fadime Cenik">\n  <meta name="twitter:description" content="Druckbare Geschenkkarte für Physikalische Medizin und Rehabilitation. Wien 11.">`
    );
    changed = true;
  }

  if (changed) fs.writeFileSync(filePath, html);
  return changed;
}

let n = 0;
fs.readdirSync(root)
  .filter((f) => f.endsWith('.html'))
  .forEach((f) => {
    if (patchFile(path.join(root, f))) {
      console.log('Updated:', f);
      n++;
    }
  });
console.log('Done:', n, 'files');
