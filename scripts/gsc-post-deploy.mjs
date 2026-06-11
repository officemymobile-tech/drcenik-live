/**
 * P1: Google Search Console checklist (manual steps after deploy).
 * Run: npm run gsc-checklist
 */
const SITEMAP = 'https://www.drcenik.at/sitemap.xml';
const INSPECT = [
  'https://www.drcenik.at/',
  'https://www.drcenik.at/kontakt.html',
  'https://www.drcenik.at/faszienschmerzen/',
  'https://www.drcenik.at/rueckenschmerzen-wien/',
  'https://www.drcenik.at/tr/',
  'https://www.drcenik.at/en/',
];

console.log('=== Google Search Console – P1 Checkliste ===\n');
console.log('1. Öffnen: https://search.google.com/search-console');
console.log('2. Property: https://www.drcenik.at/');
console.log(`3. Sitemaps → Neue Sitemap: ${SITEMAP}`);
console.log('4. URL-Prüfung → jeweils „Indexierung beantragen“:\n');
for (const u of INSPECT) console.log(`   • ${u}`);
console.log('\n5. Nach 3–14 Tagen: site:www.drcenik.at in Google prüfen');
console.log('6. Berichte → Seiten → Indexierung beobachten\n');
