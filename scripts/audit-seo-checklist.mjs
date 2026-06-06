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
const trFiles = fs.readdirSync(root).filter((f) => f.endsWith('-tr.html'));
const trWienInHead = trFiles.filter((f) => {
  const head = read(f).split('</head>')[0];
  return /Wien 11|Wien\./.test(head.replace(/addressLocality": "Wien"/g, ''));
});
checks.push(['P2', 'TR-Meta: kein Wien 11 im Head', trWienInHead.length === 0, trWienInHead.join(', ') || 'ok']);
checks.push(['P2', 'ContactPage kontakt-tr', read('kontakt-tr.html').includes('ContactPage')]);
checks.push(['P2', 'ContactPage kontakt-en', read('kontakt-en.html').includes('ContactPage')]);
checks.push(['P2', 'Schema termin (potentialAction)', read('termin.html').includes('potentialAction')]);
checks.push(['P2', 'BreadcrumbList Unterseiten', read('kontakt.html').includes('BreadcrumbList')]);
checks.push(['P2', 'News Alt-Texte vollständig DE', !read('wissen-news.html').includes('alt=""')]);
checks.push(['P2', 'News Alt-Texte vollständig TR', !read('wissen-news-tr.html').includes('alt=""')]);
checks.push(['P2', 'News Alt-Texte vollständig EN', !read('wissen-news-en.html').includes('alt=""')]);
checks.push(['P2', 'prototype noindex', read('prototype-apple.html').includes('noindex')]);

// P3
checks.push(['P3', 'Article ItemList wissen-news DE', read('wissen-news.html').includes('"@type": "ItemList"')]);
checks.push(['P3', 'og:locale:alternate index', read('index.html').includes('og:locale:alternate')]);
checks.push(['P3', '404 mehrsprachig TR/EN', read('404.html').includes('lang="tr"') && read('404.html').includes('lang="en"')]);
checks.push(['P3', 'Consent-Analytics (bewusst aus)', read('datenschutz.html').includes('keine Analyse-') || read('datenschutz-en.html').includes('do not use any analytics')]);

// P4 Enterprise
checks.push(['P4', 'AboutPage ueber-uns-tr', read('ueber-uns-tr.html').includes('"@type": "AboutPage"')]);
checks.push(['P4', 'WebSite + ReserveAction index', read('index.html').includes('"@type": "WebSite"') && read('index.html').includes('ReserveAction')]);
checks.push(['P4', 'Physician sameAs GBP', read('index.html').includes('"sameAs"')]);
checks.push(['P4', 'Font preload siteweit', fs.readdirSync(root).filter((f) => f.endsWith('.html') && !['prototype-apple.html', '267059-geschenkgutschein-vorlage.html'].includes(f)).every((f) => read(f).includes('source-sans-3-latin-400-normal.woff2'))]);
checks.push(['P4', 'Footer Termin-Link', (() => {
  const skip = new Set(['prototype-apple.html', '267059-geschenkgutschein-vorlage.html', 'termin.html', 'termin-tr.html', 'termin-en.html']);
  const missing = fs.readdirSync(root).filter((f) => {
    if (!f.endsWith('.html') || skip.has(f)) return false;
    const footer = read(f).split('<footer')[1]?.split('</footer>')[0] || '';
    return !/termin(-tr|-en)?\.html/.test(footer);
  });
  return missing.length === 0;
})(), (() => {
  const skip = new Set(['prototype-apple.html', '267059-geschenkgutschein-vorlage.html', 'termin.html', 'termin-tr.html', 'termin-en.html']);
  return fs.readdirSync(root).filter((f) => {
    if (!f.endsWith('.html') || skip.has(f)) return false;
    const footer = read(f).split('<footer')[1]?.split('</footer>')[0] || '';
    return !/termin(-tr|-en)?\.html/.test(footer);
  }).join(', ') || 'ok';
})()]);
checks.push(['P4', 'TR Pratiden-Tippfehler behoben', !read('wissen-news-tr.html').includes('Pratiden')]);
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
