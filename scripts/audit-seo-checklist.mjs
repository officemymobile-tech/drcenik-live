/**
 * SEO checklist verification (P1–P3)
 * Run: node scripts/audit-seo-checklist.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(f) {
  return fs.readFileSync(path.join(root, f), 'utf8');
}

function isRedirectStub(f) {
  if (!f.endsWith('.html')) return false;
  const h = read(f);
  return h.includes('noindex, follow') && h.includes('edge-redirect.js') && h.length < 900;
}

function allContentPages() {
  const pages = [];
  for (const f of fs.readdirSync(root)) {
    if (!f.endsWith('.html')) continue;
    if (['prototype-apple.html', '267059-geschenkgutschein-vorlage.html'].includes(f)) continue;
    if (isRedirectStub(f)) continue;
    pages.push(f);
  }
  for (const lang of ['tr', 'en']) {
    const dir = path.join(root, lang);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.html')) pages.push(`${lang}/${f}`);
    }
  }
  return pages;
}

const checks = [];

// P1
checks.push(['P1', '301 index.html in .htaccess', /RewriteRule \^index\\\.html/.test(read('.htaccess'))]);
checks.push(['P1', '301 Gutschein-URL in .htaccess', /267059-geschenkgutschein/.test(read('.htaccess'))]);
checks.push([
  'P1',
  'Keine internen index.html Links',
  !fs.readdirSync(root).some((f) => f.endsWith('.html') && read(f).includes('href="index.html"')),
]);
checks.push(['P1', 'termin.html Twitter vollständig', (() => {
  const h = read('termin.html');
  return h.includes('twitter:card') && h.includes('twitter:title') && h.includes('twitter:description');
})()]);
checks.push(['P1', 'geschenkgutschein.html existiert', fs.existsSync(path.join(root, 'geschenkgutschein.html'))]);
checks.push(['P1', 'Gutschein hreflang DE-only', (() => {
  const h = read('geschenkgutschein.html');
  return h.includes('hreflang="de"') && !h.includes('hreflang="tr"');
})()]);
checks.push(['P1', 'Kontakt ohne Termin im Title', read('kontakt.html').includes('Adresse, Anfahrt') && !read('kontakt.html').includes('Kontakt &amp; Termin |')]);

// P2
const trFiles = allContentPages().filter((f) => f.startsWith('tr/') || f.endsWith('-tr.html'));
const trWienInHead = trFiles.filter((f) => {
  const head = read(f).split('</head>')[0];
  return /Wien 11|Wien\./.test(head.replace(/addressLocality": "Wien"/g, ''));
});
checks.push(['P2', 'TR-Meta: kein Wien 11 im Head', trWienInHead.length === 0, trWienInHead.join(', ') || 'ok']);
checks.push(['P2', 'ContactPage kontakt-tr', read('tr/kontakt.html').includes('ContactPage')]);
checks.push(['P2', 'ContactPage kontakt-en', read('en/kontakt.html').includes('ContactPage')]);
checks.push(['P2', 'Schema termin (potentialAction)', read('termin.html').includes('potentialAction')]);
checks.push(['P2', 'BreadcrumbList Unterseiten', read('kontakt.html').includes('BreadcrumbList')]);
checks.push(['P2', 'News Alt-Texte vollständig DE', !read('wissen-news.html').includes('alt=""')]);
checks.push(['P2', 'News Alt-Texte vollständig TR', !read('tr/wissen-news.html').includes('alt=""')]);
checks.push(['P2', 'News Alt-Texte vollständig EN', !read('en/wissen-news.html').includes('alt=""')]);
checks.push(['P2', 'prototype noindex', read('prototype-apple.html').includes('noindex')]);

// P3
checks.push(['P3', 'Article ItemList wissen-news DE', read('wissen-news.html').includes('"@type": "ItemList"')]);
checks.push(['P3', 'og:locale:alternate index', read('index.html').includes('og:locale:alternate')]);
checks.push(['P3', '404 mehrsprachig TR/EN', read('404.html').includes('lang="tr"') && read('404.html').includes('lang="en"')]);
checks.push(['P3', 'GA4 Datenschutz DE', read('datenschutz.html').includes('Google Analytics 4')]);
checks.push(['P3', 'GA4 Datenschutz EN', read('en/datenschutz.html').includes('Google Analytics 4')]);
checks.push(['P3', 'analytics.js vorhanden', fs.existsSync(path.join(root, 'scripts/analytics.js'))]);

// P4 Enterprise
checks.push(['P4', 'AboutPage ueber-uns-tr', read('tr/ueber-uns.html').includes('"@type": "AboutPage"')]);
checks.push(['P4', 'WebSite + ReserveAction index', read('index.html').includes('"@type": "WebSite"') && read('index.html').includes('ReserveAction')]);
checks.push(['P4', 'Physician sameAs GBP', read('index.html').includes('"sameAs"')]);
checks.push(['P4', 'Font preload siteweit', allContentPages().every((f) => read(f).includes('source-sans-3-latin-400-normal.woff2'))]);
checks.push(['P4', 'Footer Termin-Link', (() => {
  const skipTermin = /\/termin\.html$|^termin\.html$/;
  const missing = allContentPages().filter((f) => {
    if (skipTermin.test(f)) return false;
    const footer = read(f).split('<footer')[1]?.split('</footer>')[0] || '';
    return !/termin\.html/.test(footer);
  });
  return missing.length === 0;
})(), (() => {
  return allContentPages().filter((f) => {
    if (/termin\.html$/.test(f)) return false;
    const footer = read(f).split('<footer')[1]?.split('</footer>')[0] || '';
    return !/termin\.html/.test(footer);
  }).join(', ') || 'ok';
})()]);
checks.push(['P4', 'TR Pratiden-Tippfehler behoben', !read('tr/wissen-news.html').includes('Pratiden')]);
checks.push(['P4', '404 ohne canonical', !read('404.html').includes('rel="canonical"')]);
checks.push(['P4', 'R-Force Meta ausführlich', read('r-force.html').includes('Antigravitations-Laufband')]);
checks.push(['P4', 'WebPage Schema Rechtliches', read('impressum.html').includes('"@type": "WebPage"') && read('datenschutz.html').includes('"@type": "WebPage"')]);
checks.push(['P4', 'Splash Alt index DE', read('index.html').includes('splash-screen__logo') && !read('index.html').match(/splash-screen__logo[^>]*alt=""/)]);

console.log('=== SEO CHECKLIST ===\n');
let fail = 0;
for (const [prio, label, ok, note] of checks) {
  const status = ok ? '✅' : '❌';
  if (!ok) fail++;
  console.log(`${status} [${prio}] ${label}${note && !ok ? ` → ${note}` : note && ok && note !== 'ok' ? ` (${note})` : ''}`);
}
console.log(`\n${checks.length - fail}/${checks.length} bestanden${fail ? `, ${fail} offen` : ''}`);
