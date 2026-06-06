/**
 * Regenerate sitemap.xml with hreflang alternates for all DE/TR/EN clusters
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at';
const TODAY = '2026-06-06';

const clusters = [
  ['', 'index-tr.html', 'index-en.html'],
  ['ueber-uns.html', 'ueber-uns-tr.html', 'ueber-uns-en.html'],
  ['therapieangebot.html', 'therapieangebot-tr.html', 'therapieangebot-en.html'],
  ['r-force.html', 'r-force-tr.html', 'r-force-en.html'],
  ['wissen-news.html', 'wissen-news-tr.html', 'wissen-news-en.html'],
  ['faq.html', 'faq-tr.html', 'faq-en.html'],
  ['kontakt.html', 'kontakt-tr.html', 'kontakt-en.html'],
  ['impressum.html', 'impressum-tr.html', 'impressum-en.html'],
  ['datenschutz.html', 'datenschutz-tr.html', 'datenschutz-en.html'],
  ['agb.html', 'agb-tr.html', 'agb-en.html'],
  ['termin.html', 'termin-tr.html', 'termin-en.html'],
];

const singles = [
  ['geschenkgutschein.html', 'monthly', '0.6'],
];

function loc(file) {
  return file === '' ? SITE + '/' : SITE + '/' + file;
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

function hreflangBlock(de, tr, en) {
  return `    <xhtml:link rel="alternate" hreflang="de" href="${loc(de)}"/>\n` +
    `    <xhtml:link rel="alternate" hreflang="tr" href="${loc(tr)}"/>\n` +
    `    <xhtml:link rel="alternate" hreflang="en" href="${loc(en)}"/>\n` +
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc(de)}"/>\n`;
}

for (const [de, tr, en] of clusters) {
  for (const file of [de, tr, en]) {
    const priority = file === de ? (de === '' ? '1.0' : '0.9') : '0.85';
    const freq = de.includes('impressum') || de.includes('datenschutz') || de.includes('agb') ? 'yearly' : 'monthly';
    xml += `  <url>\n    <loc>${loc(file)}</loc>\n${hreflangBlock(de, tr, en)}    <lastmod>${TODAY}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  }
}

for (const [file, freq, pri] of singles) {
  xml += `  <url>\n    <loc>${loc(file)}</loc>\n    <xhtml:link rel="alternate" hreflang="de" href="${loc(file)}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${loc(file)}"/>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>\n  </url>\n`;
}

xml += '</urlset>\n';
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log('sitemap.xml regenerated');
