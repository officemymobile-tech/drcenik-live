/**
 * Lab + live performance checks (HTML hints, assets, optional Lighthouse).
 * Run: npm run audit-performance
 * Live: npm run audit-performance -- --live
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at';
const live = process.argv.includes('--live');

function walkHtml(dir, acc = [], prefix = '') {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${ent.name}` : ent.name;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(full, acc, rel);
    else if (ent.name.endsWith('.html') && !['prototype-apple.html', '267059-geschenkgutschein-vorlage.html'].includes(ent.name)) {
      acc.push(rel.replace(/\\/g, '/'));
    }
  }
  return acc;
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function kb(file) {
  return (fs.statSync(path.join(root, file)).size / 1024).toFixed(1);
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'drcenik-perf-audit/1.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, url).href;
          fetchText(next).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        const t0 = Date.now();
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({
            status: res.statusCode,
            body: Buffer.concat(chunks).toString('utf8'),
            ttfbMs: Date.now() - t0,
            headers: res.headers,
          })
        );
        res.on('error', reject);
      })
      .on('error', reject);
  });
}

const pages = walkHtml(root).sort();
const homePages = ['index.html', 'en/index.html', 'tr/index.html'];
let ok = 0;
let total = 0;

function check(label, pass, detail = '') {
  total++;
  if (pass) ok++;
  console.log(pass ? '✅' : '❌', label, detail ? `– ${detail}` : '');
}

console.log('=== PERFORMANCE-AUDIT (lokal) ===\n');

check('analytics.js Web Vitals', read('scripts/analytics.js').includes('onLCP'));
check('web-vitals.iife.js vorhanden', fs.existsSync(path.join(root, 'scripts/web-vitals.iife.js')));
check('fonts.css font-display: swap', read('styles/fonts.css').includes('font-display: swap'));
check('critical.css vorhanden', fs.existsSync(path.join(root, 'styles/critical.css')));
check('main.css Größe < 200 KB', fs.statSync(path.join(root, 'styles/main.css')).size < 200 * 1024, `${kb('styles/main.css')} KB`);
check('logo.webp < 50 KB', fs.statSync(path.join(root, 'assets/logo.webp')).size < 50 * 1024, `${kb('assets/logo.webp')} KB`);

for (const p of homePages) {
  const h = read(p);
  check(`${p}: LCP preload logo`, /rel="preload"[^>]+logo\.webp/.test(h));
  check(`${p}: fetchpriority LCP`, /fetchpriority="high"/.test(h));
  check(`${p}: hero width/height`, /hero-ref-logo[^>]+width="400"[^>]+height="400"/.test(h));
}

const badHeightAuto = pages.filter((p) => read(p).includes('height="auto"'));
check('kein height="auto" in Bildern', badHeightAuto.length === 0, badHeightAuto.join(', ') || 'OK');

const noDefer = pages.filter((p) => {
  const h = read(p);
  return h.includes('analytics.js') && !h.includes('analytics.js" defer');
});
check('analytics.js defer überall', noDefer.length === 0, noDefer.slice(0, 3).join(', '));

if (live) {
  console.log('\n=== LIVE-PRÜFUNG', SITE, '===\n');
  try {
    const r = await fetchText(SITE + '/');
    check('Homepage HTTP 200', r.status === 200, `HTTP ${r.status}`);
    check('Live HTML: logo preload', r.body.includes('rel="preload"') && r.body.includes('logo.webp'));
    check('Live HTML: fetchpriority high', r.body.includes('fetchpriority="high"'));
    check('Live HTML: critical.css', r.body.includes('styles/critical.css'));
    check('Live HTML: analytics.js defer', r.body.includes('analytics.js" defer'));
    check('Live TTFB Schätzung < 800 ms', r.ttfbMs < 800, `${r.ttfbMs} ms`);
    const cc = r.headers['cache-control'] || '(kein Header)';
    check('Cache-Control gesetzt', Boolean(r.headers['cache-control']), cc);
  } catch (e) {
    check('Live fetch', false, e.message);
  }

  const lh = spawnSync(
    'npx',
    [
      '--yes',
      'lighthouse',
      SITE + '/',
      '--only-categories=performance',
      '--form-factor=mobile',
      '--chrome-flags=--headless --no-sandbox',
      '--output=json',
      '--quiet',
    ],
    { cwd: root, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, shell: true }
  );
  if (lh.status === 0 && lh.stdout) {
    try {
      const j = JSON.parse(lh.stdout);
      const score = Math.round((j.categories?.performance?.score || 0) * 100);
      const a = j.audits || {};
      check('Lighthouse Mobile Score ≥ 90', score >= 90, `${score}/100`);
      console.log('   LCP:', a['largest-contentful-paint']?.displayValue);
      console.log('   CLS:', a['cumulative-layout-shift']?.displayValue);
      console.log('   TBT:', a['total-blocking-time']?.displayValue);
      console.log('   INP (lab):', a['experimental-interaction-to-next-paint']?.displayValue || 'n/a');
    } catch {
      console.log('⚠️  Lighthouse JSON nicht parsebar (ggf. --live ohne Lighthouse erneut lokal messen)');
    }
  } else {
    console.log('⚠️  Lighthouse übersprungen (Chrome nicht verfügbar oder Timeout)');
  }
}

console.log(`\n${ok}/${total} Checks bestanden`);
console.log('\nHinweis: CrUX-Felddaten (PageSpeed „Echte Nutzer“) brauchen ~28 Tage Traffic.');
console.log('Web Vitals in GA4 erscheinen nach Consent unter Events: LCP, CLS, INP.');
process.exit(ok === total ? 0 : 1);
