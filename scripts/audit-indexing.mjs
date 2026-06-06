/**
 * Indexierungs-Audit: robots, canonical, noindex, Sitemap-Abdeckung
 * Run: node scripts/audit-indexing.mjs
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'drcenik-index-audit/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetch(res.headers.location).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8'), finalUrl: url }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function localHtmlFiles() {
  return fs.readdirSync(root).filter((f) => f.endsWith('.html') && f !== 'prototype-apple.html');
}

function parseSitemap(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

console.log('=== INDEXIERUNGS-AUDIT ===\n');

// robots.txt
const robots = await fetch(`${SITE}/robots.txt`);
const robotsOk = robots.body.includes('Allow: /') && robots.body.includes('Sitemap:');
console.log('robots.txt:', robots.status, robotsOk ? 'OK' : 'PRÜFEN');
console.log('  Disallow prototype:', robots.body.includes('prototype-apple') ? 'OK' : 'FEHLT');

// sitemap
const sm = await fetch(`${SITE}/sitemap.xml`);
const sitemapUrls = parseSitemap(sm.body);
console.log('\nsitemap.xml:', sm.status, '→', sitemapUrls.length, 'URLs');

// local vs sitemap
const localPaths = new Set(localHtmlFiles().map((f) => (f === 'index.html' ? `${SITE}/` : `${SITE}/${f}`)));
const inSitemapNotLocal = sitemapUrls.filter((u) => !localPaths.has(u) && !u.endsWith('/'));
const localNotInSitemap = [...localPaths].filter((u) => u !== `${SITE}/404.html` && !sitemapUrls.includes(u));

if (localNotInSitemap.length) console.log('  Nicht in Sitemap:', localNotInSitemap.join(', '));

// sample live pages
const samples = ['', 'kontakt.html', 'therapieangebot.html', 'wissen-news.html', 'index-tr.html', '404.html'];
console.log('\nLIVE-STICHPROBE:');
console.log('PAGE'.padEnd(26), 'HTTP', 'ROBOTS', 'CANONICAL');
for (const p of samples) {
  const url = p ? `${SITE}/${p}` : `${SITE}/`;
  const r = await fetch(url);
  const robotsMeta = (r.body.match(/name="robots" content="([^"]+)"/i) || [])[1] || 'index,follow (default)';
  const canon = (r.body.match(/rel="canonical" href="([^"]+)"/i) || [])[1] || '-';
  const gsc = r.body.includes('google-site-verification') ? 'GSC✓' : 'GSC–';
  console.log((p || '/').padEnd(26), String(r.status).padStart(4), robotsMeta.slice(0, 18).padEnd(18), canon.slice(0, 36), gsc);
}

// local noindex scan
console.log('\nLOKAL noindex:');
for (const f of localHtmlFiles()) {
  const html = fs.readFileSync(path.join(root, f), 'utf8');
  const m = html.match(/name="robots" content="([^"]+)"/i);
  if (m) console.log(' ', f, '→', m[1]);
}

const gscConfigured = localHtmlFiles().some((f) => fs.readFileSync(path.join(root, f), 'utf8').includes('google-site-verification'));
console.log('\nGoogle-Verifizierung im Code:', gscConfigured ? 'JA' : 'NEIN (Search Console noch nicht verifiziert)');
console.log('\nHinweis: site:drcenik.at in Google prüfen – ohne GSC/Sitemap dauert Indexierung oft Tage bis Wochen.');
