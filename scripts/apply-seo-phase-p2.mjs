/**
 * P2 SEO: og:image CTR, shorter meta description, kontakt heading hierarchy
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OG = 'https://www.drcenik.at/assets/gbp/gbp-praxis-empfang.webp';

const DESC = {
  de: 'Dr. Fadime Cenik – Physikalische Medizin & Rehabilitation in 1110 Wien (Simmering). Erreichbar aus 1100 Wien, Schwechat, Mannswörth & Umgebung (15 km).',
  tr: 'Dr. Fadime Cenik – Fiziksel Tıp, 1110 Viyana (Simmering). 1100 Viyana, Schwechat ve çevresinden ulaşılabilir (15 km).',
  en: 'Dr. Fadime Cenik – Physical Medicine & Rehabilitation in 1110 Vienna (Simmering). Reachable from 1100 Vienna, Schwechat & area (15 km).',
};

const OG_PAGES = [
  'index.html',
  'index-tr.html',
  'index-en.html',
  'tr/index.html',
  'en/index.html',
  'kontakt.html',
  'kontakt-tr.html',
  'kontakt-en.html',
  'tr/kontakt.html',
  'en/kontakt.html',
  'termin.html',
  'termin-tr.html',
  'termin-en.html',
  'tr/termin.html',
  'en/termin.html',
];

function patchOg(html) {
  let h = html;
  h = h.replace(
    /<meta property="og:image" content="[^"]*">/,
    `<meta property="og:image" content="${OG}">`,
  );
  if (!h.includes('og:image:width')) {
    h = h.replace(
      `<meta property="og:image" content="${OG}">`,
      `<meta property="og:image" content="${OG}">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="800">`,
    );
  }
  h = h.replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${OG}">`);
  return h;
}

function patchDesc(html, text) {
  return html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${text.replace(/"/g, '&quot;')}">`);
}

function patchHeadings(html) {
  return html.replace(/<h3 class="contact-zeiten-title">/g, '<h2 class="contact-zeiten-title">').replace(
    /<\/h3>(\s*<(?:p|ul|table|div)[^>]*class="contact-zeiten)/g,
    '</h2>$1',
  );
}

// Fix heading close tags properly
function patchKontakt(file) {
  const fp = path.join(root, file);
  if (!fs.existsSync(fp)) return;
  let h = fs.readFileSync(fp, 'utf8');
  h = patchOg(h);
  h = h.replace(/<h3 class="contact-zeiten-title">/g, '<h2 class="contact-zeiten-title">');
  h = h.replace(/(<h2 class="contact-zeiten-title">[\s\S]*?)<\/h3>/g, '$1</h2>');
  fs.writeFileSync(fp, h);
  console.log('Kontakt patched:', file);
}

for (const f of OG_PAGES) {
  const fp = path.join(root, f);
  if (!fs.existsSync(fp)) continue;
  let h = patchOg(fs.readFileSync(fp, 'utf8'));
  if (f.includes('index')) {
    const lang = f.includes('/tr/') || f.includes('-tr') ? 'tr' : f.includes('/en/') || f.includes('-en') ? 'en' : 'de';
    h = patchDesc(h, DESC[lang]);
  }
  fs.writeFileSync(fp, h);
  console.log('OG patched:', f);
}

for (const f of [
  'kontakt.html',
  'kontakt-tr.html',
  'kontakt-en.html',
  'tr/kontakt.html',
  'en/kontakt.html',
]) {
  patchKontakt(f);
}
