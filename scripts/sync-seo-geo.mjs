/**
 * SEO-Geo Single Source of Truth → Website + GBP
 * config/seo-geo.json ist die einzige Stelle für Standort-SEO.
 *
 * Usage: npm run sync-seo-geo
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'config/seo-geo.json'), 'utf8'));
const de = cfg.copy.de;
const schemaBlock = JSON.stringify(cfg.schema.areaServed, null, 6).replace(/^/gm, '    ');
const serviceAreaBlock = `    "serviceArea": ${JSON.stringify(cfg.schema.serviceArea, null, 6).replace(/\n/g, '\n    ')},`;

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}
function write(file, content) {
  fs.writeFileSync(path.join(root, file), content, 'utf8');
  console.log('✓', file);
}

function escAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function patchPhysicianSchema(html) {
  let out = html;
  if (out.includes('"serviceArea"')) {
    out = out.replace(
      /"serviceArea":\s*\{[\s\S]*?\n\s*\},?\s*\n(?=\s*"areaServed")/,
      `${serviceAreaBlock}\n`,
    );
  } else {
    out = out.replace(
      /("medicalSpecialty":\s*\[[^\]]+\],)\s*\n(\s*"areaServed":)/,
      `$1\n${serviceAreaBlock}\n$2`
    );
    if (!out.includes('"serviceArea"')) {
      out = out.replace(
        /("medicalSpecialty":\s*\[[^\]]+\],)\s*\n(\s*"image":)/,
        `$1\n${serviceAreaBlock}\n$2`
      );
    }
  }
  out = out.replace(/"areaServed":\s*\[[\s\S]*?\],?\s*\n(\s*"image":)/, `"areaServed": ${schemaBlock},\n$1`);
  return out;
}

function setMetaContent(html, attr, value) {
  const v = escAttr(value);
  if (attr.startsWith('name=')) {
    const name = attr.match(/name="([^"]+)"/)[1];
    return html.replace(
      new RegExp(`<meta name="${name}" content="[^"]*"`),
      `<meta name="${name}" content="${v}"`
    );
  }
  const prop = attr.match(/property="([^"]+)"/)[1];
  return html.replace(
    new RegExp(`<meta property="${prop}" content="[^"]*"`),
    `<meta property="${prop}" content="${v}"`
  );
}

// --- index.html (DE) ---
let index = read('index.html');
index = setMetaContent(index, 'name="description"', de.metaHome);
index = setMetaContent(index, 'property="og:description"', de.metaHomeOg);
index = setMetaContent(index, 'name="twitter:description"', de.metaHomeTwitter);
index = patchPhysicianSchema(index);
index = index.replace(/<span>1110 Wien · Schwechat<\/span>/, `<span>${de.heroBadge}</span>`);
index = index.replace(
  /<p class="body-text">1110 Wien \(Simmering\), erreichbar aus Schwechat<\/p>/,
  `<p class="body-text">${de.cardLocation}</p>`
);
index = index.replace(
  /<h2 class="heading-2" id="local-seo-heading">[^<]+<\/h2>/,
  `<h2 class="heading-2" id="local-seo-heading">${de.localSectionTitle}</h2>`
);
index = index.replace(
  /<p class="body-text-lg">Therapien in Simmering[^<]+<\/p>/,
  `<p class="body-text-lg">${de.localSectionSubtitle}</p>`
);
write('index.html', index);

// --- index-en.html ---
const en = cfg.copy.en;
let indexEn = read('index-en.html');
indexEn = setMetaContent(indexEn, 'name="description"', en.metaHome);
indexEn = setMetaContent(indexEn, 'property="og:description"', en.metaHomeOg);
indexEn = setMetaContent(indexEn, 'name="twitter:description"', en.metaHomeTwitter);
indexEn = patchPhysicianSchema(indexEn);
write('index-en.html', indexEn);

// --- index-tr.html ---
const tr = cfg.copy.tr;
let indexTr = read('index-tr.html');
indexTr = setMetaContent(indexTr, 'name="description"', tr.metaHome);
indexTr = setMetaContent(indexTr, 'property="og:description"', tr.metaHomeOg);
indexTr = setMetaContent(indexTr, 'name="twitter:description"', tr.metaHomeTwitter);
indexTr = patchPhysicianSchema(indexTr);
write('index-tr.html', indexTr);

// --- kontakt.html ---
let kontakt = read('kontakt.html');
kontakt = kontakt.replace(
  /content="Kontakt – Ordination Dr\. Fadime Cenik[^"]*"/,
  `content="${escAttr(de.metaKontakt)}"`
);
kontakt = kontakt.replace(
  /property="og:description" content="Ordination in 1110 Wien[^"]*"/,
  `property="og:description" content="${escAttr(de.metaKontaktOg)}"`
);
kontakt = kontakt.replace(
  /"description": "Adresse, Anfahrt[^"]*"/,
  `"description": "${de.kontaktIntro.replace(/"/g, '\\"')}"`
);
kontakt = kontakt.replace(
  /<p class="body-text-lg contact-page-intro">[^<]+<\/p>/,
  `<p class="body-text-lg contact-page-intro">${de.kontaktIntro} Für Terminbuchungen nutzen Sie bitte unsere <a href="termin.html">Termin-Seite</a>. Allgemeine Anfragen erreichen uns per Telefon, E-Mail oder Kontaktformular.</p>`
);
kontakt = kontakt.replace(
  /<p class="contact-faq-answer">Unsere Ordination befindet sich[^<]+<\/p>/,
  `<p class="contact-faq-answer">${de.kontaktFaqAnfahrt} <a href="https://www.google.com/maps/search/?api=1&amp;query=Kaiser-Ebersdorfer-Straße+328,+1110+Wien,+Österreich" target="_blank" rel="noopener noreferrer">Route in Google Maps</a>.</p>`
);
write('kontakt.html', kontakt);

// --- GBP configs ---
const gbpPath = path.join(root, 'config/gbp.json');
const gbp = JSON.parse(fs.readFileSync(gbpPath, 'utf8'));
gbp.description = de.gbpDescription;
gbp.descriptionCharCount = de.gbpDescription.length;
gbp.descriptionNote = 'GBP: keine URLs. Einzugsgebiet aus config/seo-geo.json';
gbp.seoGeoConfig = 'config/seo-geo.json';
gbp.serviceAreaKm = cfg.serviceRadiusKm;
gbp.serviceAreaLabels = cfg.primaryTargets.map((t) => t.label);
fs.writeFileSync(gbpPath, JSON.stringify(gbp, null, 2) + '\n');
console.log('✓ config/gbp.json (description', de.gbpDescription.length, 'Zeichen)');

const gbpLocalPath = path.join(root, 'config/gbp-local-seo.json');
const gbpLocal = JSON.parse(fs.readFileSync(gbpLocalPath, 'utf8'));
gbpLocal.serviceArea = {
  radiusKm: cfg.serviceRadiusKm,
  targets: cfg.primaryTargets,
  keywords: cfg.gbpKeywords,
};
for (const s of gbpLocal.services) {
  s.keywords = [...new Set([...(s.keywords || []), ...cfg.gbpKeywords])];
}
fs.writeFileSync(gbpLocalPath, JSON.stringify(gbpLocal, null, 2) + '\n');
console.log('✓ config/gbp-local-seo.json');

// --- Local SEO pages rebuild ---
console.log('\n→ build-local-seo …');
execSync('node scripts/build-local-seo-pages.mjs', { cwd: root, stdio: 'inherit' });

console.log('\n── SEO-Geo Sync abgeschlossen ──');
console.log('Einzugsgebiet:', cfg.primaryTargets.map((t) => t.label).join(' · '), `(${cfg.serviceRadiusKm} km)`);
console.log('GBP-Beschreibung:', de.gbpDescription.length, '/ 750 Zeichen');
if (de.gbpDescription.length > 750) console.warn('⚠️ GBP-Beschreibung zu lang!');
