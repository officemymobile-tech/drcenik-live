/**
 * Batch site updates: favicon, fonts, hreflang, OG/Twitter, scripts, maps consent
 * Run: node scripts/apply-site-updates.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at';
const TODAY = '2026-06-06';

const FAVICON_BLOCK = `  <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16.png">
  <link rel="apple-touch-icon" href="assets/apple-touch-icon.png">`;

const FONT_BLOCK = `  <link rel="stylesheet" href="styles/fonts.css">
  <link rel="stylesheet" href="styles/critical.css">`;

const GOOGLE_FONT_RE = /\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\s*<link href="https:\/\/fonts\.googleapis\.com\/css2[^"]+" rel="stylesheet">\s*/g;

function deUrl(file) {
  if (file === 'index-tr.html' || file === 'index-en.html') return SITE + '/';
  return SITE + '/' + file.replace(/-tr\.html$/, '.html').replace(/-en\.html$/, '.html');
}

function ogBlock(title, desc, url, locale = 'de_AT') {
  const t = title.replace(/"/g, '&quot;');
  const d = desc.replace(/"/g, '&quot;');
  return `  <meta property="og:title" content="${t}">
  <meta property="og:description" content="${d}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/assets/logo.webp">
  <meta property="og:locale" content="${locale}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:image" content="${SITE}/assets/logo.webp">
  <meta name="twitter:title" content="${t}">
  <meta name="twitter:description" content="${d}">`;
}

function localeForFile(file) {
  if (file.endsWith('-tr.html')) return 'tr_TR';
  if (file.endsWith('-en.html')) return 'en_AT';
  return 'de_AT';
}

function patchFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const file = path.basename(filePath);
  if (file === 'prototype-apple.html') return false;
  let changed = false;

  if (GOOGLE_FONT_RE.test(html)) {
    html = html.replace(GOOGLE_FONT_RE, '\n' + FONT_BLOCK + '\n');
    changed = true;
  } else if (!html.includes('styles/fonts.css') && html.includes('styles/main.css')) {
    html = html.replace('<link rel="stylesheet" href="styles/main.css">', FONT_BLOCK + '\n  <link rel="stylesheet" href="styles/main.css">');
    changed = true;
  }

  if (!html.includes('favicon-32.png')) {
    html = html.replace(/(<meta name="viewport"[^>]+>)/, '$1\n' + FAVICON_BLOCK);
    changed = true;
  }

  if (html.includes('hreflang="en"') && !html.includes('hreflang="x-default"')) {
    html = html.replace(/(<link rel="alternate" hreflang="en"[^>]+>)/, '$1\n  <link rel="alternate" hreflang="x-default" href="' + deUrl(file) + '">');
    changed = true;
  }

  if (!html.includes('og:title') && html.includes('<meta name="description"')) {
    const titleM = html.match(/<title>([^<]+)<\/title>/);
    const descM = html.match(/<meta name="description" content="([^"]*)">/);
    const canonM = html.match(/<link rel="canonical" href="([^"]+)">/);
    if (titleM && descM) {
      const url = canonM ? canonM[1] : SITE + '/' + file;
      const block = ogBlock(titleM[1], descM[1], url, localeForFile(file));
      html = html.replace(/(<meta name="description" content="[^"]*">)/, '$1\n' + block);
      changed = true;
    }
  }

  if (html.includes('scripts/main.js') && !html.includes('site-i18n.js')) {
    html = html.replace('<script src="scripts/main.js"', '<script src="scripts/site-i18n.js" defer></script>\n  <script src="scripts/main.js"');
    changed = true;
  }

  const mapsIframe = /<iframe class="contact-map-iframe" src="([^"]+)"([^>]*)><\/iframe>/;
  if (mapsIframe.test(html) && !html.includes('data-maps-consent')) {
    html = html.replace(
      /<div class="contact-map-wrap">\s*<div class="contact-map-overlay">([\s\S]*?)<\/div>\s*<iframe class="contact-map-iframe" src="([^"]+)"([^>]*)><\/iframe>\s*<\/div>/,
      function (_, overlay, src, rest) {
        const lang = file.includes('-tr') ? 'tr' : file.includes('-en') ? 'en' : 'de';
        const loadLabels = { de: 'Karte laden', tr: 'Haritayı yükle', en: 'Load map' };
        const blockedLabels = {
          de: 'Google Maps wird erst nach Ihrer Einwilligung geladen.',
          tr: 'Google Haritalar yalnızca onayınızdan sonra yüklenir.',
          en: 'Google Maps loads only after your consent.'
        };
        return `<div class="contact-map-wrap" data-maps-consent>
              <div class="contact-map-overlay">${overlay.trim()}</div>
              <div class="contact-map-placeholder" data-maps-placeholder>
                <p class="body-text contact-map-consent-text">${blockedLabels[lang]}</p>
                <button type="button" class="btn btn-primary" data-maps-load>${loadLabels[lang]}</button>
              </div>
              <iframe class="contact-map-iframe" data-maps-iframe data-src="${src}"${rest.replace(/\s*loading="lazy"/, '').replace(/\s*hidden title="Google Maps"/, '')} hidden></iframe>
            </div>`;
      }
    );
    changed = true;
  }

  if (file === 'impressum.html') {
    const old = '<p class="body-text-lg">Angaben gemäß § 5 TMG (Telemediengesetz).</p>';
    const neu = '<p class="body-text-lg">Angaben gemäß § 14 ECG und § 25 Mediengesetz (Österreich).</p>';
    if (html.includes(old)) { html = html.replace(old, neu); changed = true; }
  }

  if (html.includes('scripts/main.js') && !html.includes('main.js?v=')) {
    html = html.replace('scripts/main.js"', 'scripts/main.js?v=9"');
    changed = true;
  }

  if (changed) fs.writeFileSync(filePath, html);
  return changed;
}

const files = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
let n = 0;
files.forEach((f) => { if (patchFile(path.join(root, f))) { console.log('Updated:', f); n++; } });
console.log('Done:', n, 'files');
