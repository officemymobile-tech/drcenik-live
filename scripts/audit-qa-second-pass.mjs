/**
 * Second-pass SEO QA – independent validation, no assumptions.
 * Run: node scripts/audit-qa-second-pass.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at';
const SKIP = new Set(['prototype-apple.html', '267059-geschenkgutschein-vorlage.html']);

const htmlFiles = () =>
  fs.readdirSync(root).filter((f) => f.endsWith('.html') && !SKIP.has(f));

function read(f) {
  return fs.readFileSync(path.join(root, f), 'utf8');
}

const issues = { critical: [], high: [], medium: [], low: [] };
const add = (sev, msg, file = '') => issues[sev].push(file ? `[${file}] ${msg}` : msg);

// --- robots.txt ---
const robots = read('robots.txt');
if (!robots.includes('Sitemap:')) add('critical', 'robots.txt ohne Sitemap-URL');
if (!robots.includes('Disallow: /prototype-apple.html')) add('high', 'prototype nicht in robots disallow');

// --- sitemap ---
const sitemap = read('sitemap.xml');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const localPages = htmlFiles().filter((f) => f !== '404.html' && f !== 'geschenkgutschein.html' || true);
const expectedInSitemap = htmlFiles().filter((f) => !['404.html'].includes(f));
for (const f of expectedInSitemap) {
  const url = f === 'index.html' ? `${SITE}/` : `${SITE}/${f}`;
  if (!sitemapUrls.includes(url)) add('high', `fehlt in sitemap: ${url}`, f);
}
if (sitemapUrls.some((u) => u.includes('404') || u.includes('prototype') || u.includes('267059')))
  add('critical', 'Sitemap enthält unerwünschte URLs');

// hreflang cluster validation
const clusters = [
  ['index.html', 'index-tr.html', 'index-en.html'],
  ['ueber-uns.html', 'ueber-uns-tr.html', 'ueber-uns-en.html'],
  ['therapieangebot.html', 'therapieangebot-tr.html', 'therapieangebot-en.html'],
  ['r-force.html', 'r-force-tr.html', 'r-force-en.html'],
  ['wissen-news.html', 'wissen-news-tr.html', 'wissen-news-en.html'],
  ['faq.html', 'faq-tr.html', 'faq-en.html'],
  ['kontakt.html', 'kontakt-tr.html', 'kontakt-en.html'],
  ['termin.html', 'termin-tr.html', 'termin-en.html'],
  ['impressum.html', 'impressum-tr.html', 'impressum-en.html'],
  ['datenschutz.html', 'datenschutz-tr.html', 'datenschutz-en.html'],
  ['agb.html', 'agb-tr.html', 'agb-en.html'],
];

for (const cluster of clusters) {
  for (const f of cluster) {
    const h = read(f);
    for (const alt of cluster) {
      const altUrl = alt === 'index.html' ? `${SITE}/` : `${SITE}/${alt}`;
      const lang = alt.includes('-tr.') ? 'tr' : alt.includes('-en.') ? 'en' : 'de';
      if (!h.includes(`hreflang="${lang}"`) && !h.includes(`hreflang="${lang}" href="${altUrl}"`)) {
        if (!h.includes(altUrl)) add('high', `hreflang ${lang} fehlt oder URL falsch`, f);
      }
    }
    if (!h.includes('hreflang="x-default"')) add('medium', 'x-default hreflang fehlt', f);
  }
}

// per-page checks
const titles = new Map();
const descs = new Map();

for (const f of htmlFiles()) {
  const h = read(f);
  const head = h.split('</head>')[0];

  // title
  const titleM = h.match(/<title>([^<]*)<\/title>/);
  if (!titleM) add('critical', 'kein title', f);
  else {
    const t = titleM[1];
    if (titles.has(t)) add('high', `doppelter title mit ${titles.get(t)}`, f);
    titles.set(t, f);
    if (t.length < 30) add('medium', `title zu kurz (${t.length})`, f);
    if (t.length > 70) add('medium', `title zu lang (${t.length})`, f);
  }

  // meta description
  const descM = head.match(/<meta name="description" content="([^"]*)"/);
  if (!descM && f !== '404.html') add('high', 'meta description fehlt', f);
  else if (descM) {
    const d = descM[1].replace(/&amp;/g, '&');
    if (descs.has(d)) add('medium', `doppelte description mit ${descs.get(d)}`, f);
    descs.set(d, f);
    if (d.length < 70) add('medium', `description zu kurz (${d.length})`, f);
    if (d.length > 165) add('medium', `description zu lang (${d.length})`, f);
  }

  // canonical
  if (!h.includes('rel="canonical"') && f !== '404.html') add('high', 'canonical fehlt', f);

  // h1
  const h1s = [...h.matchAll(/<h1[^>]*>/gi)];
  if (h1s.length === 0) add('high', 'kein H1', f);
  if (h1s.length > 1) add('medium', `${h1s.length} H1-Elemente`, f);

  // og/twitter
  if (!head.includes('og:title') && f !== '404.html') add('medium', 'og:title fehlt', f);
  if (!head.includes('twitter:card') && f !== '404.html') add('medium', 'twitter:card fehlt', f);

  // JSON-LD validity
  const ldBlocks = [...h.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)<\/script>/g)];
  for (const [, json] of ldBlocks) {
    try {
      JSON.parse(json.trim());
    } catch (e) {
      add('critical', `JSON-LD ungültig: ${e.message}`, f);
    }
  }

  // empty alt in content (not aria-hidden decorative)
  const emptyAlts = [...h.matchAll(/<img[^>]*alt=""[^>]*>/g)];
  for (const m of emptyAlts) {
    if (!m[0].includes('aria-hidden') && !m[0].includes('splash-screen'))
      add('medium', 'img mit leerem alt', f);
  }

  // internal broken patterns
  if (h.includes('href="index.html"')) add('critical', 'interner Link zu index.html', f);

  // font preload
  if (!h.includes('source-sans-3-latin-400-normal.woff2')) add('low', 'font preload fehlt', f);

  // footer termin
  const footer = h.split('<footer')[1]?.split('</footer>')[0] || '';
  if (!/termin(-tr|-en)?\.html/.test(footer) && !['termin.html', 'termin-tr.html', 'termin-en.html'].includes(f))
    add('medium', 'Footer ohne Termin-Link', f);

  // gsc
  if (!head.includes('google-site-verification')) add('low', 'GSC verification fehlt', f);
}

// geschenkgutschein DE-only
const g = read('geschenkgutschein.html');
if (g.includes('hreflang="tr"')) add('high', 'Gutschein sollte kein TR hreflang haben', 'geschenkgutschein.html');

// schema specific
for (const f of ['index.html', 'index-tr.html', 'index-en.html']) {
  const h = read(f);
  if (!h.includes('"@type": "Physician"')) add('critical', 'Physician schema fehlt', f);
  if (!h.includes('"@type": "WebSite"')) add('high', 'WebSite schema fehlt', f);
}
if (!read('ueber-uns-tr.html').includes('"@type": "AboutPage"')) add('high', 'AboutPage TR fehlt', 'ueber-uns-tr.html');
if (!read('kontakt.html').includes('ContactPage')) add('high', 'ContactPage fehlt', 'kontakt.html');
if (!read('faq.html').includes('FAQPage')) add('high', 'FAQPage fehlt', 'faq.html');

// .htaccess
const ht = read('.htaccess');
if (!ht.includes('index.html')) add('high', 'index.html redirect fehlt in .htaccess');

// orphan check – pages linked from sitemap should be reachable via internal links from index
const indexH = read('index.html');
for (const f of sitemapUrls) {
  const file = f === `${SITE}/` ? 'index.html' : f.replace(SITE + '/', '');
  if (file === 'index.html' || file === 'geschenkgutschein.html') continue;
  const slug = file.replace(/\.html$/, '');
  if (!indexH.includes(file) && !fs.readFileSync(path.join(root, 'index.html'), 'utf8').includes(slug))
    add('low', 'nicht von Startseite verlinkt (orphan risk)', file);
}

console.log('=== SECOND-PASS SEO QA ===\n');
let total = 0;
for (const [sev, list] of Object.entries(issues)) {
  if (list.length) {
    console.log(`\n## ${sev.toUpperCase()} (${list.length})`);
    list.forEach((i) => console.log(`  • ${i}`));
    total += list.length;
  }
}
console.log(`\n---\nGesamt: ${total} Findings`);
console.log(`Seiten geprüft: ${htmlFiles().length}`);
console.log(`Sitemap URLs: ${sitemapUrls.length}`);

process.exit(issues.critical.length > 0 ? 1 : 0);
