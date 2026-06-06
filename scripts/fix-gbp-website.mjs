import fs from 'fs';
import path from 'path';

const root = path.resolve(import.meta.dirname, '..');
const gbp = JSON.parse(fs.readFileSync(path.join(root, 'config/gbp.json'), 'utf8'));

const sameAsBlock = `"sameAs": [
      "${gbp.mapsPlaceUrl}",
      "${gbp.mapsCidUrl}",
      "https://at.linkedin.com/in/fadime-cenik-3472b0132",
      "https://www.researchgate.net/profile/Fadime-Cenik-2"
    ]`;

const mapsFooter = `<li><a href="${gbp.mapsCidUrl}" target="_blank" rel="noopener noreferrer">Google Maps</a></li>
            <li><a href="${gbp.reviewUrl}" target="_blank" rel="noopener noreferrer">Google-Bewertung abgeben</a></li>`;

const oldSameAs = /"sameAs":\s*\[[^\]]*\]/s;
const oldMapsOnly = /<li><a href="https:\/\/www\.google\.com\/maps\/search\/[^"]+"[^>]*>Google Maps<\/a><\/li>/g;

const skip = new Set(['267059-geschenkgutschein-vorlage.html', 'prototype-apple.html']);
let updated = 0;

for (const file of fs.readdirSync(root).filter((f) => f.endsWith('.html') && !skip.has(f))) {
  let html = fs.readFileSync(path.join(root, file), 'utf8');
  const before = html;

  if (html.includes('"sameAs"')) {
    html = html.replace(oldSameAs, sameAsBlock);
  }

  html = html.replace(oldMapsOnly, mapsFooter);

  if (file.startsWith('termin') && html.includes('<h5>Kontakt</h5>') && !html.includes('Google Maps')) {
    html = html.replace(
      /(<h5>Kontakt<\/h5>\s*<ul>\s*<li><a href="tel:[^"]+">[^<]+<\/a><\/li>\s*<li><a href="mailto:[^"]+">[^<]+<\/a><\/li>)/,
      `$1\n            ${mapsFooter.split('\n').map((l) => l.trim()).join('\n            ')}`,
    );
  }

  if (html !== before) {
    fs.writeFileSync(path.join(root, file), html);
    updated++;
    console.log('✓', file);
  }
}

console.log(`\n${updated} Dateien aktualisiert (sameAs + Footer Maps/Review).`);
