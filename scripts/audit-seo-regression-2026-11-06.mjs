/**
 * Local regression checks for the 2026-11-06 SEO changes.
 * Serves the repo and inspects HTML without a browser dependency.
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function expect(condition, message) {
  if (!condition) fail(message);
}

function jsonLd(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  return blocks.map((block) => JSON.parse(block));
}

const home = read('index.html');
const therapy = read('therapieangebot.html');
const robots = read('robots.txt');
const redirects = read('_redirects');
const worker = read('infra/cloudflare/worker.js');
const sitemap = read('sitemap.xml');

expect(home.includes('physikalische-therapie-wien-11/'), 'homepage missing link to target page');
expect((home.match(/<h1\b/g) || []).length === 1, 'homepage must have exactly one h1');
expect(!/noindex/i.test(home.slice(0, 4000)), 'homepage must stay indexable');
expect(home.includes('rel="canonical" href="https://www.drcenik.at/"'), 'homepage canonical');
expect(home.includes('tel:+4317692991'), 'homepage phone CTA');
expect(therapy.includes('href="physikalische-therapie-wien-11/"'), 'therapy page missing contextual link');
expect(therapy.includes('rel="canonical" href="https://www.drcenik.at/therapieangebot.html"'), 'therapy canonical');
expect(therapy.includes('id="physiotherapie"'), 'physiotherapy anchor missing');
expect(redirects.includes('/therapieangebot /therapieangebot.html 301'), 'pages redirect missing');
expect(worker.includes("path === '/therapieangebot'"), 'worker redirect missing');
expect(robots.includes('Disallow: /prototype-apple'), 'prototype disallow missing');
expect(sitemap.includes('https://www.drcenik.at/physikalische-therapie-wien-11/'), 'sitemap missing target URL');
expect(!sitemap.includes('/therapieangebot</loc>'), 'sitemap must not list the bare duplicate URL');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  let filePath = decodeURIComponent(url.pathname);
  if (filePath.endsWith('/')) filePath += 'index.html';
  const abs = path.normalize(path.join(root, filePath));
  if (!abs.startsWith(root)) {
    res.writeHead(403);
    res.end('forbidden');
    return;
  }
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('not found');
    return;
  }
  const ext = path.extname(abs);
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.xml': 'application/xml' };
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(abs).pipe(res);
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const base = `http://127.0.0.1:${port}`;

async function get(pathname) {
  const res = await fetch(base + pathname);
  const text = await res.text();
  return { status: res.status, text };
}

const page = await get('/physikalische-therapie-wien-11/');
expect(page.status === 200, 'target page status ' + page.status);
const html = page.text;
expect((html.match(/<title>([^<]*)<\/title>/) || [])[1] === 'Physikalische Therapie Wien 11 | Dr. Fadime Cenik', 'unexpected title');
expect(/<h1[^>]*>Physikalische Therapie in Wien 11 – Simmering<\/h1>/.test(html), 'unexpected h1');
expect((html.match(/<h1\b/g) || []).length === 1, 'target page must have exactly one h1');
expect(html.includes('rel="canonical" href="https://www.drcenik.at/physikalische-therapie-wien-11/"'), 'target canonical');
expect(!/noindex/i.test(html), 'target page must be indexable');
expect(html.includes('href="tel:+4317692991"'), 'target phone link');
expect(html.includes('href="../therapieangebot.html"'), 'target link to therapy catalog');
expect(html.includes('href="/"'), 'target link to homepage');
expect(!html.includes('outcome') && !/Heilung garantiert|100 %/.test(html), 'misleading outcome claim');
const schemas = jsonLd(html);
expect(schemas.some((s) => s['@type'] === 'MedicalWebPage'), 'MedicalWebPage missing');
expect(schemas.some((s) => s['@type'] === 'BreadcrumbList'), 'BreadcrumbList missing');
expect(schemas.some((s) => s['@type'] === 'FAQPage'), 'FAQPage missing');
expect(schemas.some((s) => s['@type'] === 'MedicalTherapy'), 'MedicalTherapy missing');
const words = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
expect(words > 700, 'target page too thin: ' + words);

const homeRes = await get('/');
expect(homeRes.status === 200, 'homepage local status');
expect(homeRes.text.includes('physikalische-therapie-wien-11/'), 'served homepage missing link');

const therapyRes = await get('/therapieangebot.html');
expect(therapyRes.status === 200, 'therapy catalog status');
expect(!/noindex/i.test(therapyRes.text.slice(0, 3000)), 'therapy catalog indexable');

const missing = await get('/this-page-should-404');
expect(missing.status === 404, 'missing page should 404');

const css = await get('/styles/main.css');
expect(css.status === 200 && css.text.includes('.kassen-facts'), 'kassen facts CSS missing');

server.close();

if (failures.length) {
  console.error('FAILED');
  for (const item of failures) console.error(' -', item);
  process.exit(1);
}
console.log('SEO regression checks passed. Target page words:', words);
