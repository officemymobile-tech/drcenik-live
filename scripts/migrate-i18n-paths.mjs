/**
 * P3: Migrate *-tr.html / *-en.html → /tr/ and /en/ clean URLs.
 * Updates hreflang sitewide, legacy 301 maps, sitemap clusters.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at';

const PAGES = [
  '',
  'ueber-uns',
  'therapieangebot',
  'r-force',
  'wissen-news',
  'faq',
  'kontakt',
  'impressum',
  'datenschutz',
  'agb',
  'termin',
];

function publicUrl(lang, slug) {
  if (lang === 'de') return slug === '' ? `${SITE}/` : `${SITE}/${slug}.html`;
  return slug === '' ? `${SITE}/${lang}/` : `${SITE}/${lang}/${slug}.html`;
}

function oldLangFile(lang, slug) {
  if (slug === '') return lang === 'tr' ? 'index-tr.html' : 'index-en.html';
  return `${slug}-${lang}.html`;
}

function relPath(lang, slug) {
  if (lang === 'de') return slug === '' ? 'index.html' : `${slug}.html`;
  return slug === '' ? path.join(lang, 'index.html') : path.join(lang, `${slug}.html`);
}

function transformForLangFolder(html, lang, slug) {
  let h = html;

  // Asset / script / style paths (one level deeper)
  h = h.replace(/(href|src)="\.\/assets\//g, '$1="../assets/');
  h = h.replace(/(href|src)="assets\//g, '$1="../assets/');
  h = h.replace(/(href|src)="styles\//g, '$1="../styles/');
  h = h.replace(/(href|src)="scripts\//g, '$1="../scripts/');

  // Canonical + OG URL
  const canon = publicUrl(lang, slug);
  h = h.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${canon}">`);
  h = h.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${canon}">`);

  // hreflang cluster for all pages
  for (const s of PAGES) {
    const deU = publicUrl('de', s);
    const trU = publicUrl('tr', s);
    const enU = publicUrl('en', s);
    const oldTr = oldLangFile('tr', s);
    const oldEn = oldLangFile('en', s);
    for (const [from, to] of [
      [oldTr, trU],
      [oldEn, enU],
      [s === '' ? 'index.html' : `${s}.html`, deU],
    ]) {
      h = h.replaceAll(`href="${from}"`, `href="${to}"`);
      h = h.replaceAll(`href="${SITE}/${from}"`, `href="${to}"`);
    }
    h = h.replaceAll(`hreflang="de" href="${SITE}/${s === '' ? '' : s + '.html'}"`.replace('""', '"'), `hreflang="de" href="${deU}"`);
  }

  // Rebuild hreflang block cleanly
  const block =
    `  <link rel="alternate" hreflang="de" href="${publicUrl('de', slug)}">\n` +
    `  <link rel="alternate" hreflang="tr" href="${publicUrl('tr', slug)}">\n` +
    `  <link rel="alternate" hreflang="en" href="${publicUrl('en', slug)}">\n` +
    `  <link rel="alternate" hreflang="x-default" href="${publicUrl('de', slug)}">`;
  h = h.replace(
    /  <link rel="alternate" hreflang="de" href="[^"]*">\n(?:  <link rel="alternate" hreflang="[^"]*" href="[^"]*">\n)*  <link rel="alternate" hreflang="x-default" href="[^"]*">/,
    block,
  );

  // Intra-language nav: *-tr.html → relative .html in /tr/
  h = h.replace(new RegExp(`${lang === 'tr' ? '-tr' : '-en'}\\.html`, 'g'), '.html');
  // Cross-language switcher
  h = h.replace(/href="index\.html"/g, `href="${publicUrl('de', '')}"`);
  h = h.replace(/href="\/tr\/"/g, `href="${publicUrl('tr', '')}"`);
  h = h.replace(/href="\/en\/"/g, `href="${publicUrl('en', '')}"`);

  // Lang switcher active states
  if (lang === 'tr') {
    h = h.replace(/hreflang="de" lang="de"/g, 'hreflang="de" lang="de"');
  }

  return h;
}

function transformDePage(html, slug) {
  let h = html;
  for (const s of PAGES) {
    h = h.replaceAll(`href="${oldLangFile('tr', s)}"`, `href="${publicUrl('tr', s)}"`);
    h = h.replaceAll(`href="${oldLangFile('en', s)}"`, `href="${publicUrl('en', s)}"`);
    h = h.replaceAll(`href="${SITE}/${oldLangFile('tr', s)}"`, `href="${publicUrl('tr', s)}"`);
    h = h.replaceAll(`href="${SITE}/${oldLangFile('en', s)}"`, `href="${publicUrl('en', s)}"`);
  }
  const block =
    `  <link rel="alternate" hreflang="de" href="${publicUrl('de', slug)}">\n` +
    `  <link rel="alternate" hreflang="tr" href="${publicUrl('tr', slug)}">\n` +
    `  <link rel="alternate" hreflang="en" href="${publicUrl('en', slug)}">\n` +
    `  <link rel="alternate" hreflang="x-default" href="${publicUrl('de', slug)}">`;
  h = h.replace(
    /  <link rel="alternate" hreflang="de" href="[^"]*">\n(?:  <link rel="alternate" hreflang="[^"]*" href="[^"]*">\n)*  <link rel="alternate" hreflang="x-default" href="[^"]*">/,
    block,
  );
  return h;
}

function legacyStub(target) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <script src="scripts/edge-redirect.js"></script>
  <meta http-equiv="refresh" content="0;url=${target}">
  <link rel="canonical" href="${target}">
  <meta name="robots" content="noindex, follow">
</head>
<body><p><a href="${target}">Weiter…</a></p></body>
</html>
`;
}

// --- Create /tr and /en ---
for (const lang of ['tr', 'en']) {
  fs.mkdirSync(path.join(root, lang), { recursive: true });
  for (const slug of PAGES) {
    const src = path.join(root, oldLangFile(lang, slug));
    if (!fs.existsSync(src)) continue;
    let html = fs.readFileSync(src, 'utf8');
    html = transformForLangFolder(html, lang, slug);
    const out = path.join(root, relPath(lang, slug));
    fs.writeFileSync(out, html);
    console.log('Wrote', out);
  }
}

// --- Update DE root pages hreflang + lang links ---
for (const slug of PAGES) {
  const fp = path.join(root, relPath('de', slug));
  if (!fs.existsSync(fp)) continue;
  const html = transformDePage(fs.readFileSync(fp, 'utf8'), slug);
  fs.writeFileSync(fp, html);
  console.log('Updated DE', fp);
}

// --- Legacy stubs at old URLs ---
for (const lang of ['tr', 'en']) {
  for (const slug of PAGES) {
    const old = path.join(root, oldLangFile(lang, slug));
    const target = publicUrl(lang, slug);
    fs.writeFileSync(old, legacyStub(target));
    console.log('Stub', old, '→', target);
  }
}

// --- Export redirect map for worker / edge-redirect ---
const legacyRedirects = {};
for (const lang of ['tr', 'en']) {
  for (const slug of PAGES) {
    legacyRedirects[`/${oldLangFile(lang, slug)}`] = publicUrl(lang, slug).replace(SITE, '');
  }
}
legacyRedirects['/tr/index.html'] = '/tr/';
legacyRedirects['/en/index.html'] = '/en/';

fs.writeFileSync(
  path.join(root, 'config', 'i18n-redirects.json'),
  JSON.stringify(legacyRedirects, null, 2) + '\n',
);
console.log('Wrote config/i18n-redirects.json');
