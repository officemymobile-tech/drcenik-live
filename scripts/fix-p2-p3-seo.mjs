/**
 * P2/P3 SEO fixes: TR meta, Schema, Breadcrumbs, og:locale:alternate, News Article schema
 * Run: node scripts/fix-p2-p3-seo.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at';

const SKIP = new Set(['404.html', 'prototype-apple.html']);

const homeLabels = { de: 'Startseite', tr: 'Ana Sayfa', en: 'Home' };

const pageLabels = {
  de: {
    'ueber-uns': 'Über uns',
    therapieangebot: 'Therapieangebot',
    'r-force': 'R-Force',
    'wissen-news': 'Wissen & News',
    faq: 'Häufige Fragen',
    kontakt: 'Kontakt',
    termin: 'Termin anfragen',
    impressum: 'Impressum',
    datenschutz: 'Datenschutz',
    agb: 'AGB',
    geschenkgutschein: 'Geschenkgutschein',
  },
  tr: {
    'ueber-uns': 'Hakkımızda',
    therapieangebot: 'Tedavi Olanakları',
    'r-force': 'R-Force',
    'wissen-news': 'Bilgi ve Haberler',
    faq: 'Sık Sorulan Sorular',
    kontakt: 'İletişim',
    termin: 'Randevu talebi',
    impressum: 'İmpressum',
    datenschutz: 'Gizlilik',
    agb: 'AGB',
    geschenkgutschein: 'Hediye çeki',
  },
  en: {
    'ueber-uns': 'About us',
    therapieangebot: 'Therapies',
    'r-force': 'R-Force',
    'wissen-news': 'Knowledge & News',
    faq: 'FAQ',
    kontakt: 'Contact',
    termin: 'Request appointment',
    impressum: 'Legal notice',
    datenschutz: 'Privacy',
    agb: 'Terms',
    geschenkgutschein: 'Gift voucher',
  },
};

function langOf(file) {
  if (file.includes('-tr.')) return 'tr';
  if (file.includes('-en.')) return 'en';
  return 'de';
}

function baseSlug(file) {
  if (file === 'index.html' || file === 'index-tr.html' || file === 'index-en.html') return 'index';
  return file.replace(/\.html$/, '').replace(/-tr$/, '').replace(/-en$/, '');
}

function pageUrl(file) {
  if (file === 'index.html') return `${SITE}/`;
  return `${SITE}/${file}`;
}

function fixTrHeadWien(html, file) {
  if (!file.endsWith('-tr.html')) return html;
  const parts = html.split('</head>');
  if (parts.length < 2) return html;
  let head = parts[0];
  head = head.replace(/Wien 11/g, 'Viyana 11');
  head = head.replace(/"description": "([^"]*?)Wien 11/g, '"description": "$1Viyana 11');
  head = head.replace(/"description":"([^"]*?)Wien 11/g, '"description":"$1Viyana 11');
  return head + '</head>' + parts.slice(1).join('</head>');
}

function ogLocaleAlternates(lang) {
  const map = {
    de: ['tr_TR', 'en_AT'],
    tr: ['de_AT', 'en_AT'],
    en: ['de_AT', 'tr_TR'],
  };
  return (map[lang] || [])
    .map((l) => `  <meta property="og:locale:alternate" content="${l}">`)
    .join('\n');
}

function injectOgAlternates(html, file) {
  if (SKIP.has(file) || file === 'geschenkgutschein.html') return html;
  if (html.includes('og:locale:alternate')) return html;
  const lang = langOf(file);
  const block = ogLocaleAlternates(lang);
  return html.replace(
    /(<meta property="og:locale" content="[^"]+">)/,
    `$1\n${block}`
  );
}

function breadcrumbJson(file) {
  const slug = baseSlug(file);
  if (slug === 'index') return null;
  const lang = langOf(file);
  const labels = pageLabels[lang];
  const name = labels[slug];
  if (!name) return null;
  const home = homeLabels[lang];
  const url = pageUrl(file);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: home, item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name, item: url },
    ],
  };
}

function injectBreadcrumb(html, file) {
  if (SKIP.has(file)) return html;
  const data = breadcrumbJson(file);
  if (!data) return html;
  if (html.includes('"@type": "BreadcrumbList"') || html.includes('"@type":"BreadcrumbList"')) {
    return html;
  }
  const script = `\n  <script type="application/ld+json">\n  ${JSON.stringify(data, null, 2).replace(/\n/g, '\n  ')}\n  </script>`;
  return html.replace('</head>', `${script}\n</head>`);
}

const contactSchema = {
  tr: {
    name: 'İletişim – Dr. Fadime Cenik',
    description: 'Adres, harita, ulaşım ve çalışma saatleri – Dr. Fadime Cenik muayenehanesi, Viyana 11.',
    url: `${SITE}/kontakt-tr.html`,
  },
  en: {
    name: 'Contact – Dr. Fadime Cenik',
    description: 'Address, map, directions and opening hours – Dr. Fadime Cenik practice, Vienna 11.',
    url: `${SITE}/kontakt-en.html`,
  },
};

function contactPageSchema(lang, meta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: meta.name,
    description: meta.description,
    url: meta.url,
    mainEntity: {
      '@type': 'Physician',
      name: 'Dr. Fadime Cenik',
      telephone: '+43 1 769 29 91',
      email: 'office@drcenik.at',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Kaiser-Ebersdorfer-Straße 328',
        addressLocality: 'Wien',
        postalCode: '1110',
        addressCountry: 'AT',
      },
    },
  };
}

function terminPageSchema(lang, file) {
  const copy = {
    de: {
      name: 'Termin anfragen – Dr. Fadime Cenik',
      description: 'Termin anfragen per Telefon, E-Mail oder Formular. Erstuntersuchung nach Vereinbarung.',
      url: `${SITE}/termin.html`,
    },
    tr: {
      name: 'Randevu talebi – Dr. Fadime Cenik',
      description: 'Randevu talebi telefon, e-posta veya form ile. İlk muayene randevu ile.',
      url: `${SITE}/termin-tr.html`,
    },
    en: {
      name: 'Request appointment – Dr. Fadime Cenik',
      description: 'Request an appointment by phone, email or form. Initial consultation by appointment.',
      url: `${SITE}/termin-en.html`,
    },
  }[lang];

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: copy.name,
    description: copy.description,
    url: copy.url,
    potentialAction: {
      '@type': 'CommunicateAction',
      name: copy.name,
      target: ['tel:+4317692991', 'mailto:office@drcenik.at', copy.url],
    },
    publisher: { '@type': 'Physician', name: 'Dr. Fadime Cenik', url: `${SITE}/` },
  };
}

function injectSchema(html, file) {
  if (html.includes('application/ld+json') && file.startsWith('kontakt-')) {
    if (html.includes('ContactPage')) return html;
  }
  if (file === 'kontakt-tr.html' && !html.includes('ContactPage')) {
    const s = contactPageSchema('tr', contactSchema.tr);
    const script = `\n  <script type="application/ld+json">\n  ${JSON.stringify(s, null, 2).replace(/\n/g, '\n  ')}\n  </script>`;
    return html.replace('</head>', `${script}\n</head>`);
  }
  if (file === 'kontakt-en.html' && !html.includes('ContactPage')) {
    const s = contactPageSchema('en', contactSchema.en);
    const script = `\n  <script type="application/ld+json">\n  ${JSON.stringify(s, null, 2).replace(/\n/g, '\n  ')}\n  </script>`;
    return html.replace('</head>', `${script}\n</head>`);
  }
  if (/^termin(-tr|-en)?\.html$/.test(file) && !html.includes('"potentialAction"')) {
    const lang = langOf(file);
    const s = terminPageSchema(lang, file);
    const script = `\n  <script type="application/ld+json">\n  ${JSON.stringify(s, null, 2).replace(/\n/g, '\n  ')}\n  </script>`;
    return html.replace('</head>', `${script}\n</head>`);
  }
  return html;
}

function extractNewsArticles(html, pageUrl) {
  const articles = [];
  const re =
    /<article class="article-card" id="([^"]+)"[\s\S]*?<img src="([^"]+)" alt="([^"]*)"[^>]*>[\s\S]*?<h2 class="article-card-title">([\s\S]*?)<\/h2>/g;
  let m;
  let pos = 1;
  while ((m = re.exec(html)) !== null) {
    const id = m[1];
    const headline = m[4].replace(/<[^>]+>/g, '').trim();
    let img = m[2];
    if (img.startsWith('./')) img = `${SITE}/${img.slice(2)}`;
    else if (!img.startsWith('http')) img = `${SITE}/${img}`;
    articles.push({
      '@type': 'ListItem',
      position: pos++,
      item: {
        '@type': 'Article',
        headline,
        url: `${pageUrl}#${id}`,
        mainEntityOfPage: `${pageUrl}#${id}`,
        author: { '@type': 'Physician', name: 'Dr. Fadime Cenik' },
        publisher: { '@type': 'Physician', name: 'Dr. Fadime Cenik', url: `${SITE}/` },
        image: img,
      },
    });
  }
  return articles;
}

function injectNewsArticleList(html, file) {
  if (!/^wissen-news(-tr|-en)?\.html$/.test(file)) return html;
  if (html.includes('"@type": "ItemList"') || html.includes('"@type":"ItemList"')) return html;
  const items = extractNewsArticles(html, pageUrl(file));
  if (!items.length) return html;
  const data = { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: items };
  const script = `\n  <script type="application/ld+json">\n  ${JSON.stringify(data, null, 2).replace(/\n/g, '\n  ')}\n  </script>`;
  return html.replace('</head>', `${script}\n</head>`);
}

const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith('.html'));

for (const file of htmlFiles) {
  let html = fs.readFileSync(path.join(root, file), 'utf8');
  html = fixTrHeadWien(html, file);
  html = injectOgAlternates(html, file);
  html = injectBreadcrumb(html, file);
  html = injectSchema(html, file);
  html = injectNewsArticleList(html, file);
  fs.writeFileSync(path.join(root, file), html);
  console.log('Processed', file);
}

console.log('P2/P3 SEO script done. Apply manual patches: prototype noindex, news alts, 404 i18n, kontakt schema text.');
