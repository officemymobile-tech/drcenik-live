import http from 'http';
import https from 'https';

/** @param {string} url @param {boolean} follow */
function head(url, follow = false) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib
      .get(url, { headers: { 'User-Agent': 'drcenik-redirect-audit/1.0' } }, (res) => {
        if (follow && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, url).href;
          head(next, true).then(resolve).catch(reject);
          return;
        }
        resolve({
          url,
          status: res.statusCode,
          location: res.headers.location || null,
        });
        res.resume();
      })
      .on('error', reject);
  });
}

/** @type {Array<[string, string, (loc: string | null) => boolean]>} */
const P0 = [
  [
    'http://www.drcenik.at/',
    'HTTP www → HTTPS www',
    (loc) => loc === 'https://www.drcenik.at/' || loc?.startsWith('https://www.drcenik.at'),
  ],
  [
    'http://www.drcenik.at/index.html',
    'HTTP www/index.html → HTTPS /',
    (loc) => loc === 'https://www.drcenik.at/' || loc === 'https://www.drcenik.at',
  ],
  [
    'http://drcenik.at/',
    'HTTP apex → HTTPS www',
    (loc) => loc?.startsWith('https://www.drcenik.at'),
  ],
  [
    'https://drcenik.at/kontakt.html',
    'HTTPS apex → HTTPS www (Pfad)',
    (loc) => loc === 'https://www.drcenik.at/kontakt.html',
  ],
  [
    'https://www.drcenik.at/index.html',
    'HTTPS /index.html → /',
    (loc) => loc === 'https://www.drcenik.at/' || loc === 'https://www.drcenik.at',
  ],
  [
    'https://www.drcenik.at/267059-geschenkgutschein-vorlage.html',
    'Legacy Gutschein → geschenkgutschein.html',
    (loc) => loc === 'https://www.drcenik.at/geschenkgutschein.html',
  ],
];

/** @type {Array<[string, string, (loc: string | null) => boolean]>} */
const P1 = [
  [
    'https://www.drcenik.at/kontakt.html/',
    'Trailing Slash .html → ohne Slash',
    (loc) => loc === 'https://www.drcenik.at/kontakt.html',
  ],
];

function pass(status, loc, check) {
  return status === 301 && check(loc);
}

console.log('=== REDIRECT-AUDIT (strikt: HTTP 301) ===\n');
console.log('Setup: infra/cloudflare/README.md + infra/world4you/README.md\n');

let ok = 0;
let total = 0;

for (const [url, label, check] of [...P0, ...P1]) {
  total++;
  try {
    const r = await head(url, false);
    const p = pass(r.status, r.location, check);
    console.log(p ? '✅' : '❌', label);
    console.log(`   ${url}`);
    console.log(`   → HTTP ${r.status}`, r.location ? `Location: ${r.location}` : '(kein Location-Header)');
    if (!p) {
      if (r.status === 200) {
        console.log('   → GitHub Pages liefert 200. Cloudflare/World4You laut README aktivieren.');
      } else if (r.status === 301 && r.location) {
        console.log('   → 301 vorhanden, Ziel-URL weicht ab.');
      }
    }
    if (p) ok++;
  } catch (e) {
    console.log('❌', label, '→', e.message);
    console.log(`   ${url}`);
  }
}

console.log(`\n${ok}/${total} echte 301-Redirects`);
if (ok < P0.length) {
  console.log('\n⚠️  P0 unvollständig — Cloudflare Bulk Redirects oder Worker deployen.');
  process.exitCode = 1;
}
