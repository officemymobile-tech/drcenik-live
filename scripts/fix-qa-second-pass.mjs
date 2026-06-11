/**
 * QA second-pass fixes – schema validity, title length, meta depth.
 * Run: node scripts/fix-qa-second-pass.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at';
const SKIP = new Set(['prototype-apple.html', '267059-geschenkgutschein-vorlage.html']);

const TITLE_SUFFIX = {
  de: '| Dr. Fadime Cenik – Physikalische Medizin &amp; Rehabilitation',
  deShort: '| Dr. Fadime Cenik, Wien 11',
  tr: '| Dr. Fadime Cenik – Fiziksel Tıp ve Rehabilitasyon',
  trShort: '| Dr. Fadime Cenik, Viyana 11',
  en: '| Dr. Fadime Cenik – Physical Medicine &amp; Rehabilitation',
  enShort: '| Dr. Fadime Cenik, Vienna 11',
};

const META_EXPAND = {
  'impressum.html': 'Impressum und Anbieterkennzeichnung – Dr. Fadime Cenik, Physikalische Medizin Wien 11. Kontakt, UID, Kammer, Aufsichtsbehörde.',
  'impressum-tr.html': 'İmpressum ve yasal bilgiler – Dr. Fadime Cenik, Fiziksel Tıp Viyana 11. İletişim, vergi numarası, denetim otoritesi.',
  'impressum-en.html': 'Imprint and legal notice – Dr. Fadime Cenik, Physical Medicine Vienna 11. Contact, tax ID, supervisory authority.',
  'datenschutz.html': 'Datenschutzerklärung gemäß DSGVO – Dr. Fadime Cenik, Physikalische Medizin Wien 11. Informationen zu Datenverarbeitung und Ihren Rechten.',
  'datenschutz-tr.html': 'KVKK/GDPR gizlilik politikası – Dr. Fadime Cenik, Fiziksel Tıp Viyana 11. Veri işleme ve haklarınız hakkında bilgi.',
  'datenschutz-en.html': 'Privacy policy (GDPR) – Dr. Fadime Cenik, Physical Medicine Vienna 11. Data processing and your rights.',
  'agb.html': 'Allgemeine Geschäftsbedingungen der Ordination – Dr. Fadime Cenik, Physikalische Medizin und Rehabilitation, Wien 11.',
  'agb-tr.html': 'Muayenehane kullanım koşulları (AGB) – Dr. Fadime Cenik, Fiziksel Tıp ve Rehabilitasyon, Viyana 11.',
  'agb-en.html': 'Terms and conditions of the practice – Dr. Fadime Cenik, Physical Medicine & Rehabilitation, Vienna 11.',
  'ueber-uns-tr.html': 'Hakkımızda – Dr. Fadime Cenik, Fiziksel Tıp uzmanı. 1990\'dan beri Viyana 11\'de rehabilitasyon ve fiziksel tıp.',
  'therapieangebot.html': 'Therapieangebot: Heilmassage, Heilgymnastik, Elektrotherapie, R-Force, Indiba u. a. – Dr. Fadime Cenik, Kassenleistung Wien 11.',
  'therapieangebot-tr.html': 'Tedavi olanakları: masaj, rehabilitasyon egzersizi, elektroterapi, R-Force, Indiba – Dr. Fadime Cenik, sigorta hizmetleri Viyana 11.',
  'therapieangebot-en.html': 'Treatments: massage, remedial exercise, electrotherapy, R-Force, Indiba – Dr. Fadime Cenik, statutory insurance Vienna 11.',
  'wissen-news.html': 'Wissen & News: MTD-Gesetz, Dry Needling, Leitlinien und Praxis-Updates – Dr. Fadime Cenik, Physikalische Medizin Wien 11.',
  'wissen-news-tr.html': 'Bilgi ve Haberler: MTD yasası, dry needling, rehberler ve muayenehaberleri – Dr. Fadime Cenik, Viyana 11.',
  'wissen-news-en.html': 'Knowledge & News: MTD act, dry needling, guidelines and practice updates – Dr. Fadime Cenik, Physical Medicine Vienna 11.',
};

const FAQ_META = {
  'faq.html': { url: `${SITE}/faq.html`, name: 'Häufige Fragen – Dr. Fadime Cenik' },
  'faq-tr.html': { url: `${SITE}/faq-tr.html`, name: 'Sık Sorulan Sorular – Dr. Fadime Cenik' },
  'faq-en.html': { url: `${SITE}/faq-en.html`, name: 'FAQ – Dr. Fadime Cenik' },
};

const CORMORANT_PRELOAD = `  <link rel="preload" href="assets/fonts/cormorant-garamond-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>`;

function langOf(file) {
  if (file.includes('-tr.')) return 'tr';
  if (file.includes('-en.')) return 'en';
  return 'de';
}

function shortenTitles(html, lang) {
  const long = TITLE_SUFFIX[lang];
  const short = TITLE_SUFFIX[`${lang}Short`];
  if (long) {
    html = html.replaceAll(long, short);
  }
  html = html.replace(
    /<title>Seite nicht gefunden \(404\) \| Dr\. Fadime Cenik[^<]*<\/title>/,
    '<title>Seite nicht gefunden | Dr. Fadime Cenik</title>'
  );
  return html;
}

function fixArticleMainEntity(html) {
  return html.replace(
    /"mainEntityOfPage": "([^"]+)"/g,
    '"mainEntityOfPage": { "@type": "WebPage", "@id": "$1" }'
  );
}

function addFaqPageProps(html, file) {
  const meta = FAQ_META[file];
  if (!meta || html.includes('"url": "' + meta.url)) return html;
  return html.replace(
    /"@type": "FAQPage",\s*\n\s*"mainEntity"/,
    `"@type": "FAQPage",\n    "name": "${meta.name}",\n    "url": "${meta.url}",\n    "mainEntity"`
  );
}

function setMetaDesc(html, content) {
  return html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${content}"`);
}

function addCormorantPreload(html) {
  if (html.includes('cormorant-garamond-latin-400-normal.woff2')) return html;
  return html.replace(
    /(<link rel="preload" href="assets\/fonts\/source-sans-3[^>]+>\n)/,
    `$1${CORMORANT_PRELOAD}\n`
  );
}

function addPhysicianId(html) {
  if (!html.includes('"@type": "Physician"') || html.includes('"@id":')) return html;
  return html.replace(
    /"@type": "Physician",\s*\n\s*"name"/,
    '"@type": "Physician",\n    "@id": "https://www.drcenik.at/#physician",\n    "name"'
  );
}

const log = [];
for (const file of fs.readdirSync(root).filter((f) => f.endsWith('.html') && !SKIP.has(f))) {
  let html = fs.readFileSync(path.join(root, file), 'utf8');
  const before = html;
  const lang = langOf(file);

  html = shortenTitles(html, lang);
  html = fixArticleMainEntity(html);
  html = addFaqPageProps(html, file);
  if (META_EXPAND[file]) html = setMetaDesc(html, META_EXPAND[file]);
  if (file.startsWith('index')) {
    html = addCormorantPreload(html);
    html = addPhysicianId(html);
  }
  if (html !== before) {
    fs.writeFileSync(path.join(root, file), html, 'utf8');
    log.push(file);
  }
}

console.log('QA second-pass fixes:', log.length ? log.join(', ') : 'none');
