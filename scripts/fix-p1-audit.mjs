/**
 * P1 audit fixes: og:locale, index hreflang, schema TR/EN, map iframe title, termin notes
 * Run: node scripts/fix-p1-audit.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at';

const INDEX_HREFLANG = `  <link rel="alternate" hreflang="de" href="${SITE}/">
  <link rel="alternate" hreflang="tr" href="${SITE}/index-tr.html">
  <link rel="alternate" hreflang="en" href="${SITE}/index-en.html">
  <link rel="alternate" hreflang="x-default" href="${SITE}/">`;

const SCHEMA_TR = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": "Dr. Fadime Cenik",
    "jobTitle": "Fiziksel Tıp ve Genel Rehabilitasyon Uzmanı",
    "description": "Fiziksel Tıp ve Rehabilitasyon muayenehanesi. Hareket burada başlar.",
    "url": "${SITE}/index-tr.html",
    "telephone": "+43 1 769 29 91",
    "email": "office@drcenik.at",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kaiser-Ebersdorfer-Straße 328",
      "addressLocality": "Wien",
      "postalCode": "1110",
      "addressCountry": "AT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.1619,
      "longitude": 16.4689
    },
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "name": "Tedavi saatleri", "dayOfWeek": "Monday", "opens": "07:00", "closes": "19:00" },
      { "@type": "OpeningHoursSpecification", "name": "Tedavi saatleri", "dayOfWeek": ["Tuesday","Wednesday","Thursday"], "opens": "06:30", "closes": "19:00" },
      { "@type": "OpeningHoursSpecification", "name": "Tedavi saatleri", "dayOfWeek": "Friday", "opens": "06:30", "closes": "17:00" },
      { "@type": "OpeningHoursSpecification", "name": "Muayene saatleri", "dayOfWeek": ["Monday","Wednesday"], "opens": "13:00", "closes": "18:00" },
      { "@type": "OpeningHoursSpecification", "name": "Muayene saatleri", "dayOfWeek": "Tuesday", "opens": "08:00", "closes": "13:00" },
      { "@type": "OpeningHoursSpecification", "name": "Muayene saatleri", "dayOfWeek": "Thursday", "opens": "07:00", "closes": "12:00" }
    ],
    "priceRange": "€€",
    "medicalSpecialty": ["PhysicalMedicine", "Rehabilitation"]
  }
  </script>`;

const SCHEMA_EN = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": "Dr. Fadime Cenik",
    "jobTitle": "Specialist in Physical Medicine and General Rehabilitation",
    "description": "Practice for Physical Medicine and Rehabilitation. Where movement begins.",
    "url": "${SITE}/index-en.html",
    "telephone": "+43 1 769 29 91",
    "email": "office@drcenik.at",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kaiser-Ebersdorfer-Straße 328",
      "addressLocality": "Wien",
      "postalCode": "1110",
      "addressCountry": "AT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.1619,
      "longitude": 16.4689
    },
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "name": "Therapy hours", "dayOfWeek": "Monday", "opens": "07:00", "closes": "19:00" },
      { "@type": "OpeningHoursSpecification", "name": "Therapy hours", "dayOfWeek": ["Tuesday","Wednesday","Thursday"], "opens": "06:30", "closes": "19:00" },
      { "@type": "OpeningHoursSpecification", "name": "Therapy hours", "dayOfWeek": "Friday", "opens": "06:30", "closes": "17:00" },
      { "@type": "OpeningHoursSpecification", "name": "Practice hours", "dayOfWeek": ["Monday","Wednesday"], "opens": "13:00", "closes": "18:00" },
      { "@type": "OpeningHoursSpecification", "name": "Practice hours", "dayOfWeek": "Tuesday", "opens": "08:00", "closes": "13:00" },
      { "@type": "OpeningHoursSpecification", "name": "Practice hours", "dayOfWeek": "Thursday", "opens": "07:00", "closes": "12:00" }
    ],
    "priceRange": "€€",
    "medicalSpecialty": ["PhysicalMedicine", "Rehabilitation"]
  }
  </script>`;

const TERMIN_NOTES = {
  'termin.html': '<p class="contact-form-note">Ihre Anfrage wird verschlüsselt an <strong>office@drcenik.at</strong> übermittelt. Sie erhalten in Kürze eine Bestätigung per E-Mail. Alternativ rufen Sie uns unter <a href="tel:+4317692991">01 / 769 29 91</a> an. Weitere Kontaktdaten finden Sie auf der <a href="kontakt.html">Kontaktseite</a>.</p>',
  'termin-tr.html': '<p class="contact-form-note">Talebiniz şifreli olarak <strong>office@drcenik.at</strong> adresine iletilir. Kısa süre içinde e-posta ile onay alırsınız. <a href="tel:+4317692991">01 / 769 29 91</a> numarasından da arayabilirsiniz. <a href="kontakt-tr.html">İletişim sayfası</a>.</p>',
  'termin-en.html': '<p class="contact-form-note">Your request is sent securely to <strong>office@drcenik.at</strong>. You will receive a confirmation by email shortly. You can also call <a href="tel:+4317692991">01 / 769 29 91</a>. See the <a href="kontakt-en.html">contact page</a>.</p>',
};

function localeFor(file) {
  if (file.endsWith('-tr.html')) return 'tr_TR';
  if (file.endsWith('-en.html')) return 'en_AT';
  return 'de_AT';
}

function setOgLocale(html, locale) {
  const tag = `<meta property="og:locale" content="${locale}">`;
  if (html.includes('og:locale')) {
    return html.replace(/<meta property="og:locale" content="[^"]*">/, tag);
  }
  if (html.includes('og:image')) {
    return html.replace(/(<meta property="og:image"[^>]+>)/, `$1\n  ${tag}`);
  }
  return html;
}

function patchFile(filePath) {
  const file = path.basename(filePath);
  if (file === 'prototype-apple.html') return false;

  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  const locale = localeFor(file);

  const nextLocale = setOgLocale(html, locale);
  if (nextLocale !== html) {
    html = nextLocale;
    changed = true;
  }

  if (file === 'index.html' || file === 'index-tr.html' || file === 'index-en.html') {
    const blockRe = /  <link rel="alternate" hreflang="de" href="[^"]+">\s*\n  <link rel="alternate" hreflang="tr" href="[^"]+">\s*\n  <link rel="alternate" hreflang="en" href="[^"]+">\s*\n  <link rel="alternate" hreflang="x-default" href="[^"]+">/;
    if (blockRe.test(html)) {
      html = html.replace(blockRe, INDEX_HREFLANG);
      changed = true;
    }
  }

  if (file === 'index-tr.html' && !html.includes('openingHoursSpecification')) {
    html = html.replace(
      /(<link rel="stylesheet" href="styles\/mobile-navbar-fix\.css[^"]*">)\s*\n<\/head>/,
      `$1\n${SCHEMA_TR}\n</head>`
    );
    changed = true;
  }

  if (file === 'index-en.html' && !html.includes('openingHoursSpecification')) {
    html = html.replace(
      /(<link rel="stylesheet" href="styles\/mobile-navbar-fix\.css[^"]*">)\s*\n<\/head>/,
      `$1\n${SCHEMA_EN}\n</head>`
    );
    changed = true;
  }

  if (html.includes('data-maps-iframe') && html.includes(' hidden title="Google Maps"')) {
    html = html.replace(/ hidden title="Google Maps"/g, ' hidden');
    changed = true;
  }
  html = html.replace(
    /(<iframe class="contact-map-iframe" data-maps-iframe[^>]+title="[^"]*")(?!\s*hidden)(><\/iframe>)/g,
    '$1 hidden$2'
  );

  if (TERMIN_NOTES[file]) {
    const noteRe = /<p class="contact-form-note">[\s\S]*?<\/p>/;
    if (noteRe.test(html)) {
      html = html.replace(noteRe, TERMIN_NOTES[file]);
      changed = true;
    }
  }

  if (changed) fs.writeFileSync(filePath, html);
  return changed;
}

let n = 0;
fs.readdirSync(root)
  .filter((f) => f.endsWith('.html'))
  .forEach((f) => {
    if (patchFile(path.join(root, f))) {
      console.log('Updated:', f);
      n++;
    }
  });
console.log('Done:', n, 'files');
