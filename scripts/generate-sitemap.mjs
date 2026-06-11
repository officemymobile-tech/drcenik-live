/**
 * Regenerate sitemap.xml with hreflang alternates for all DE/TR/EN clusters
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at';
const TODAY = new Date().toISOString().slice(0, 10);

const clusters = [
  ['', 'tr/', 'en/'],
  ['ueber-uns.html', 'tr/ueber-uns.html', 'en/ueber-uns.html'],
  ['therapieangebot.html', 'tr/therapieangebot.html', 'en/therapieangebot.html'],
  ['r-force.html', 'tr/r-force.html', 'en/r-force.html'],
  ['wissen-news.html', 'tr/wissen-news.html', 'en/wissen-news.html'],
  ['faq.html', 'tr/faq.html', 'en/faq.html'],
  ['kontakt.html', 'tr/kontakt.html', 'en/kontakt.html'],
  ['impressum.html', 'tr/impressum.html', 'en/impressum.html'],
  ['datenschutz.html', 'tr/datenschutz.html', 'en/datenschutz.html'],
  ['agb.html', 'tr/agb.html', 'en/agb.html'],
  ['termin.html', 'tr/termin.html', 'en/termin.html'],
];

const singles = [
  ['geschenkgutschein.html', 'monthly', '0.6'],
];

const localSeoSingles = [
  ['r-force-therapie-wien/', 'monthly', '0.88'],
  ['stosswellentherapie-wien/', 'monthly', '0.88'],
  ['nackenschmerzen-ursachen/', 'monthly', '0.88'],
  ['rueckenschmerzen-wien/', 'monthly', '0.88'],
  ['knieschmerzen-behandlung/', 'monthly', '0.88'],
  ['schulter-schmerzen/', 'monthly', '0.88'],
  ['faszienschmerzen/', 'monthly', '0.88'],
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

for (const [file, freq, pri] of localSeoSingles) {
  xml += `  <url>\n    <loc>${loc(file)}</loc>\n    <xhtml:link rel="alternate" hreflang="de" href="${loc(file)}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${loc(file)}"/>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>\n  </url>\n`;
}

xml += '</urlset>\n';
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log('sitemap.xml regenerated');
