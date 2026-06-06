/**
 * Enterprise SEO fixes – schema, meta, internal links, performance hints, AI signals.
 * Run: node scripts/fix-enterprise-seo.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at';
const SKIP = new Set(['prototype-apple.html', '267059-geschenkgutschein-vorlage.html']);

const FONT_PRELOAD = `  <link rel="preload" href="assets/fonts/source-sans-3-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>`;

const META_FIXES = {
  'r-force.html': {
    description:
      'R-Force Antigravitations-Laufband – Gehtraining mit Gewichtsentlastung in Wien 11. Dr. Fadime Cenik, Physikalische Medizin & Rehabilitation.',
    twitter:
      'R-Force Antigravitations-Laufband – Gehtraining mit Gewichtsentlastung. Physikalische Medizin Wien 11.',
  },
  'r-force-tr.html': {
    description:
      'R-Force antigravitasyon koşu bandı – ağırlık azaltmalı yürüme tedavisi, Viyana 11. Dr. Fadime Cenik, Fiziksel Tıp ve Rehabilitasyon.',
    twitter:
      'R-Force antigravitasyon koşu bandı – ağırlık azaltmalı yürüme tedavisi. Fiziksel Tıp Viyana 11.',
  },
  'r-force-en.html': {
    description:
      'R-Force anti-gravity treadmill – gait training with body-weight support in Vienna 11. Dr. Fadime Cenik, Physical Medicine & Rehabilitation.',
    twitter:
      'R-Force anti-gravity treadmill – gait training with body-weight support. Physical Medicine Vienna 11.',
  },
  'faq.html': {
    description:
      'FAQ zu Terminen, Kassenleistungen, Therapiedauer und Behandlungen – Dr. Fadime Cenik, Physikalische Medizin & Rehabilitation Wien 11.',
    twitter:
      'FAQ – Termine, Kassen, Behandlungen. Physikalische Medizin & Rehabilitation Wien 11.',
  },
  'faq-tr.html': {
    description:
      'Randevu, sigorta, tedavi süresi ve uygulamalar hakkında SSS – Dr. Fadime Cenik, Fiziksel Tıp ve Rehabilitasyon Viyana 11.',
    twitter:
      'SSS – randevu, sigorta, tedaviler. Fiziksel Tıp ve Rehabilitasyon Viyana 11.',
  },
  'faq-en.html': {
    description:
      'FAQ on appointments, insurance, session length and treatments – Dr. Fadime Cenik, Physical Medicine & Rehabilitation Vienna 11.',
    twitter:
      'FAQ – appointments, insurance, treatments. Physical Medicine & Rehabilitation Vienna 11.',
  },
};

const SPLASH_ALT = {
  'index.html': 'Dr. Fadime Cenik – Fachärztin für Physikalische Medizin und allgemeine Rehabilitation',
  'index-tr.html': 'Dr. Fadime Cenik – Fiziksel Tıp ve Genel Rehabilitasyon Uzmanı',
  'index-en.html': 'Dr. Fadime Cenik – Specialist in Physical Medicine and General Rehabilitation',
};

const ABOUT_PAGE_TR = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Hakkımızda – Dr. Fadime Cenik",
    "description": "Viyana 11'de Fiziksel Tıp ve Rehabilitasyon muayenehanesi. Uzmanlık, sigorta hizmetleri ve bireysel tedavi.",
    "url": "https://www.drcenik.at/ueber-uns-tr.html",
    "mainEntity": {
      "@type": "Physician",
      "name": "Dr. Fadime Cenik",
      "jobTitle": "Fiziksel Tıp ve Genel Rehabilitasyon Uzmanı",
      "description": "Muayenehanede harekete dönüş yolunuz ön plandadır. ÖGK sigorta hizmetleri, fizyoterapi, terapötik masaj, rehabilitasyon egzersizi, Indiba, lazer, şok dalgası, kinesio bantlama.",
      "url": "https://www.drcenik.at/",
      "telephone": "+43 1 769 29 91",
      "email": "office@drcenik.at",
      "address": { "@type": "PostalAddress", "streetAddress": "Kaiser-Ebersdorfer-Straße 328", "addressLocality": "Wien", "postalCode": "1110", "addressCountry": "AT" }
    }
  }
  </script>

`;

const WEBSITE_SCHEMA = {
  de: `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Dr. Fadime Cenik – Physikalische Medizin & Rehabilitation",
    "url": "https://www.drcenik.at/",
    "inLanguage": "de-AT",
    "publisher": {
      "@type": "Physician",
      "name": "Dr. Fadime Cenik",
      "url": "https://www.drcenik.at/"
    },
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.drcenik.at/termin.html",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "name": "Termin anfragen"
    }
  }
  </script>
`,
  tr: `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Dr. Fadime Cenik – Fiziksel Tıp ve Rehabilitasyon",
    "url": "https://www.drcenik.at/index-tr.html",
    "inLanguage": "tr-AT",
    "publisher": {
      "@type": "Physician",
      "name": "Dr. Fadime Cenik",
      "url": "https://www.drcenik.at/"
    },
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.drcenik.at/termin-tr.html",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "name": "Randevu talebi"
    }
  }
  </script>
`,
  en: `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Dr. Fadime Cenik – Physical Medicine & Rehabilitation",
    "url": "https://www.drcenik.at/index-en.html",
    "inLanguage": "en-AT",
    "publisher": {
      "@type": "Physician",
      "name": "Dr. Fadime Cenik",
      "url": "https://www.drcenik.at/"
    },
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.drcenik.at/termin-en.html",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "name": "Request appointment"
    }
  }
  </script>
`,
};

const SAME_AS = [
  'https://www.google.com/maps/search/?api=1&query=Dr.+Fadime+Cenik+Kaiser-Ebersdorfer-Straße+328+Wien',
];

function htmlFiles() {
  return fs.readdirSync(root).filter((f) => f.endsWith('.html') && !SKIP.has(f));
}

function setMeta(html, name, content) {
  const re = new RegExp(`(<meta name="${name}" content=")([^"]*)(")`, 'i');
  if (re.test(html)) return html.replace(re, `$1${content}$3`);
  return html;
}

function setTwitterDesc(html, content) {
  const re = /(<meta name="twitter:description" content=")([^"]*)(")/i;
  if (re.test(html)) return html.replace(re, `$1${content}$3`);
  return html;
}

function addFontPreload(html) {
  if (html.includes('source-sans-3-latin-400-normal.woff2')) return html;
  return html.replace(
    /(<link rel="stylesheet" href="styles\/fonts\.css">)/,
    `${FONT_PRELOAD}\n$1`
  );
}

function addFooterTermin(html, file) {
  const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/);
  if (!footerMatch) return html;
  let footer = footerMatch[0];
  if (/termin(-tr|-en)?\.html/.test(footer)) return html;

  if (file.includes('-tr.') || file === 'index-tr.html') {
    footer = footer.replace(
      /<li><a href="kontakt-tr\.html">İletişim<\/a><\/li>(\s*<\/ul>)/,
      '<li><a href="kontakt-tr.html">İletişim</a></li>\n            <li><a href="termin-tr.html">Randevu</a></li>$1'
    );
  } else if (file.includes('-en.') || file === 'index-en.html') {
    footer = footer.replace(
      /<li><a href="kontakt-en\.html">Contact<\/a><\/li>(\s*<\/ul>)/,
      '<li><a href="kontakt-en.html">Contact</a></li>\n            <li><a href="termin-en.html">Request appointment</a></li>$1'
    );
  } else if (file !== 'termin.html') {
    footer = footer.replace(
      /<li><a href="kontakt\.html">Kontakt<\/a><\/li>(\s*<\/ul>)/,
      '<li><a href="kontakt.html">Kontakt</a></li>\n            <li><a href="termin.html">Termin anfragen</a></li>$1'
    );
  }

  return html.replace(footerMatch[0], footer);
}

function enhancePhysicianSchema(html) {
  if (!html.includes('"@type": "Physician"')) return html;
  if (html.includes('"sameAs"')) return html;

  const insert = `,
    "image": "${SITE}/assets/logo.webp",
    "sameAs": [
      "${SAME_AS[0]}"
    ]`;

  return html.replace(
    /("medicalSpecialty":\s*\[[^\]]+\])/,
    `$1${insert}`
  );
}

function addWebSiteSchema(html, file) {
  if (html.includes('"@type": "WebSite"')) return html;
  if (file === 'index.html') {
    return html.replace('</head>', `${WEBSITE_SCHEMA.de}</head>`);
  }
  if (file === 'index-tr.html') {
    return html.replace('</head>', `${WEBSITE_SCHEMA.tr}</head>`);
  }
  if (file === 'index-en.html') {
    return html.replace('</head>', `${WEBSITE_SCHEMA.en}</head>`);
  }
  return html;
}

function fix404(html) {
  return html
    .replace(/\s*<link rel="canonical" href="https:\/\/www\.drcenik\.at\/404\.html">\n?/, '\n')
    .replace(
      '<meta property="og:locale" content="de_AT">',
      `<meta property="og:locale" content="de_AT">
  <meta property="og:locale:alternate" content="tr_TR">
  <meta property="og:locale:alternate" content="en_AT">`
    );
}

function addWebPageLegal(html, file) {
  const legal = ['impressum', 'datenschutz', 'agb'];
  const base = file.replace(/\.html$/, '').replace(/-tr$/, '').replace(/-en$/, '');
  if (!legal.includes(base)) return html;
  if (html.includes('"@type": "WebPage"')) return html;

  const names = {
    impressum: { de: 'Impressum', tr: 'İmpressum', en: 'Legal notice' },
    datenschutz: { de: 'Datenschutzerklärung', tr: 'Gizlilik politikası', en: 'Privacy policy' },
    agb: { de: 'AGB', tr: 'Kullanım koşulları', en: 'Terms and conditions' },
  };
  const lang = file.includes('-tr.') ? 'tr' : file.includes('-en.') ? 'en' : 'de';
  const url = `${SITE}/${file}`;
  const block = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "${names[base][lang]} – Dr. Fadime Cenik",
    "url": "${url}",
    "isPartOf": { "@type": "WebSite", "name": "Dr. Fadime Cenik", "url": "${SITE}/" }
  }
  </script>

`;

  return html.replace(
    /(<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "BreadcrumbList")/,
    `${block}$1`
  );
}

const log = [];

for (const file of htmlFiles()) {
  let html = fs.readFileSync(path.join(root, file), 'utf8');
  const before = html;

  if (META_FIXES[file]) {
    html = setMeta(html, 'description', META_FIXES[file].description);
    html = setTwitterDesc(html, META_FIXES[file].twitter);
    log.push(`${file}: meta descriptions erweitert`);
  }

  if (file === 'wissen-news-tr.html') {
    html = html.replace(/Pratiden/g, 'Pratikten');
    log.push('wissen-news-tr.html: Pratiden → Pratikten');
  }

  if (file === 'ueber-uns-tr.html' && !html.includes('"@type": "AboutPage"')) {
    html = html.replace(
      /(<link rel="stylesheet" href="styles\/mobile-navbar-fix\.css[^"]*">\s*\n\s*)(<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "BreadcrumbList")/,
      `$1${ABOUT_PAGE_TR}$2`
    );
    log.push('ueber-uns-tr.html: AboutPage-Schema ergänzt');
  }

  if (SPLASH_ALT[file]) {
    html = html.replace(
      /class="splash-screen__logo"[^>]*alt=""/,
      (m) => m.replace('alt=""', `alt="${SPLASH_ALT[file]}"`)
    );
    log.push(`${file}: Splash-Alt-Text gesetzt`);
  }

  html = addFontPreload(html);
  html = addFooterTermin(html, file);
  html = enhancePhysicianSchema(html);
  html = addWebSiteSchema(html, file);
  html = addWebPageLegal(html, file);

  if (file === '404.html') {
    html = fix404(html);
    log.push('404.html: canonical entfernt, og:locale:alternate ergänzt');
  }

  if (html !== before) {
    fs.writeFileSync(path.join(root, file), html, 'utf8');
  }
}

console.log('Enterprise SEO fixes applied:\n');
console.log(log.length ? log.map((l) => `  • ${l}`).join('\n') : '  (keine Änderungen nötig)');
console.log(`\n${log.length} Änderungen protokolliert.`);
