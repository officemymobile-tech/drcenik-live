import https from 'https';

function get(url, follow = true) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'drcenik-live-audit/1.0' } }, (res) => {
        if (follow && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, url).href;
          get(next, true).then(resolve).catch(reject);
          return;
        }
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ url, status: res.statusCode, location: res.headers.location, body }));
      })
      .on('error', reject);
  });
}

const tests = [
  ['https://www.drcenik.at/index.html', 'P1 Redirect index→/', (b, s, loc) => s === 301 && loc === 'https://www.drcenik.at/'],
  ['https://www.drcenik.at/267059-geschenkgutschein-vorlage.html', 'P1 Redirect Gutschein', (b, s, loc) => (s === 301 && loc?.includes('geschenkgutschein')) || (s === 200 && b.includes('geschenkgutschein.html') && b.includes('noindex'))],
  ['https://www.drcenik.at/kontakt.html', 'P2 ContactPage + Breadcrumb', (b) => b.includes('ContactPage') && b.includes('BreadcrumbList')],
  ['https://www.drcenik.at/kontakt-tr.html', 'P2 TR ContactPage + Viyana', (b) => b.includes('ContactPage') && b.includes('Viyana 11') && !b.split('</head>')[0].includes('Wien 11')],
  ['https://www.drcenik.at/termin.html', 'P2 Termin Schema', (b) => b.includes('potentialAction') && b.includes('twitter:card')],
  ['https://www.drcenik.at/wissen-news.html', 'P2/P3 News', (b) => b.includes('ItemList') && !b.includes('alt=""')],
  ['https://www.drcenik.at/geschenkgutschein.html', 'P1 Gutschein hreflang', (b) => b.includes('hreflang="de"') && !b.includes('hreflang="tr"')],
  ['https://www.drcenik.at/', 'P3 og:locale:alternate', (b) => b.includes('og:locale:alternate')],
  ['https://www.drcenik.at/404.html', 'P3 404 i18n + noindex', (b) => b.includes('lang="tr"') && b.includes('noindex')],
  ['https://www.drcenik.at/sitemap.xml', 'Sitemap geschenkgutschein', (b) => b.includes('geschenkgutschein.html') && !b.includes('267059')],
];

console.log('=== LIVE-PRÜFUNG www.drcenik.at ===\n');
let ok = 0;
for (const [url, label, fn] of tests) {
  try {
    const r = await get(url, url.includes('index.html') || url.includes('267059') ? false : true);
    const pass = fn(r.body, r.status, r.location);
    console.log(pass ? '✅' : '❌', label);
    console.log('   ', url, '→ HTTP', r.status, r.location ? `Location: ${r.location}` : '');
    if (!pass) console.log('   → Prüfung fehlgeschlagen');
    if (pass) ok++;
  } catch (e) {
    console.log('❌', label, '→', e.message);
  }
}
console.log(`\n${ok}/${tests.length} live bestanden`);
