/**
 * Generate Local SEO landing pages from content/local-seo/pages.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PAGES, ALL_SLUGS } from '../content/local-seo/pages.mjs';
import { GEO, AREA_SERVED_SCHEMA, SERVICE_AREA_SCHEMA } from '../content/local-seo/geo.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at';
const PHYSICIAN_ID = `${SITE}/#physician`;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wordCount(text) {
  return text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

function renderParagraphs(paragraphs) {
  return paragraphs.map((p) => `          <p class="body-text">${p}</p>`).join('\n');
}

function renderSections(sections) {
  return sections
    .map((sec) => {
      let html = `        <div class="section-header">\n          <h2 class="heading-2">${sec.h2}</h2>\n        </div>\n`;
      if (sec.intro) html += renderParagraphs([sec.intro]) + '\n';
      if (sec.paragraphs?.length) html += renderParagraphs(sec.paragraphs) + '\n';
      if (sec.subsections?.length) {
        html += sec.subsections
          .map((sub) => {
            let subHtml = `        <h3 class="heading-3">${sub.h3}</h3>\n`;
            if (sub.paragraphs?.length) subHtml += renderParagraphs(sub.paragraphs) + '\n';
            return subHtml;
          })
          .join('\n');
      }
      return html;
    })
    .join('\n');
}

function renderFaqs(faqs) {
  return faqs
    .map(
      (f) => `          <details class="therapy-dropdown fade-in-up">
            <summary class="therapy-dropdown-trigger">${esc(f.q)}</summary>
            <div class="therapy-dropdown-content">
              <p class="body-text">${f.a}</p>
            </div>
          </details>`
    )
    .join('\n');
}

function renderRelated(related, currentSlug) {
  const cards = related
    .filter((r) => r.slug !== currentSlug)
    .map((r) => {
      const href = r.href || `${r.slug}/`;
      const title = r.title;
      const desc = r.desc;
      return `          <a href="${href}" class="therapy-detail-card related-treatment-card">
            <h3 class="heading-4">${title}</h3>
            <p class="body-text">${desc}</p>
            <span class="card-link">Mehr erfahren →</span>
          </a>`;
    })
    .join('\n');
  return `        <div class="section-header">
          <h2 class="heading-2">Verwandte Behandlungen &amp; Themen</h2>
        </div>
        <div class="related-treatments-grid">
${cards}
        </div>`;
}

function buildSchemas(page, url) {
  const medicalWebPage = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: page.h1,
    description: page.metaDescription,
    url,
    inLanguage: 'de-AT',
    about: { '@type': 'MedicalCondition', name: page.conditionName || page.h1 },
    lastReviewed: '2026-06-07',
    reviewedBy: { '@id': PHYSICIAN_ID },
    publisher: { '@id': PHYSICIAN_ID },
  };

  const service = {
    '@context': 'https://schema.org',
    '@type': page.schemaType || 'MedicalTherapy',
    name: page.schemaName,
    description: page.metaDescription,
    url,
    provider: { '@id': PHYSICIAN_ID },
    areaServed: AREA_SERVED_SCHEMA,
    serviceArea: SERVICE_AREA_SCHEMA,
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: url,
      servicePhone: '+4317692991',
    },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: page.breadcrumbName, item: url },
    ],
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return [medicalWebPage, service, breadcrumb, faqPage]
    .map((o) => `  <script type="application/ld+json">\n  ${JSON.stringify(o, null, 2)}\n  </script>`)
    .join('\n\n');
}

function buildPage(page) {
  const url = `${SITE}/${page.slug}/`;
  const midIndex = Math.floor(page.sections.length / 2);
  const sectionsBefore = page.sections.slice(0, midIndex);
  const sectionsAfter = page.sections.slice(midIndex);

  const bodyText = [
    page.heroIntro,
    ...page.sections.flatMap((s) => [
      s.intro,
      ...(s.paragraphs || []),
      ...(s.subsections || []).flatMap((sub) => sub.paragraphs || []),
    ]),
    ...page.faqs.map((f) => f.a),
  ]
    .filter(Boolean)
    .join(' ');

  const wc = wordCount(bodyText);

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <script src="../scripts/edge-redirect.js"></script>
  <meta name="google-site-verification" content="_KnZVMV9x2kk0NG_q5RMmQE4ZORs3Es5juq_OwbqVUs">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="../assets/favicon-16.png">
  <link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.metaDescription)}">
  <meta property="og:title" content="${esc(page.title)}">
  <meta property="og:description" content="${esc(page.metaDescription)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/assets/logo.webp">
  <meta name="twitter:image" content="${SITE}/assets/logo.webp">
  <meta property="og:locale" content="de_AT">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(page.title)}">
  <meta name="twitter:description" content="${esc(page.metaDescription)}">
  <link rel="canonical" href="${url}">
  <link rel="preload" href="../assets/fonts/source-sans-3-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="../styles/fonts.css">
  <link rel="stylesheet" href="../styles/critical.css">
  <link rel="stylesheet" href="../styles/main.css">
  <link rel="stylesheet" href="../styles/mobile-navbar-fix.css?v=8">

${buildSchemas(page, url)}
</head>
<body class="page page-local-seo theme-ref" data-local-seo-slug="${page.slug}">
  <a href="#main-content" class="skip-link">Zum Inhalt springen</a>
  <header class="site-header">
  <nav class="navbar" id="navbar" aria-label="Hauptnavigation">
    <div class="navbar-container">
      <a href="/" class="navbar-logo">
        <img src="../assets/logo.webp" onerror="this.onerror=null;this.src='../assets/logo.webp';" alt="Dr. Fadime Cenik" class="navbar-logo-icon" height="58" loading="eager">
      </a>
      <button type="button" class="navbar-toggle" id="navbar-toggle" aria-label="Menü öffnen">
        <span></span><span></span><span></span>
      </button>
      <ul class="navbar-links" id="navbar-links">
        <li><a href="/" class="nav-link nav-link-startseite">Startseite</a></li>
        <li><a href="../therapieangebot.html" class="nav-link nav-link-therapieangebot">Therapieangebot</a></li>
        <li><a href="../r-force.html" class="nav-link nav-link-r-force">R-Force</a></li>
        <li><a href="../wissen-news.html" class="nav-link nav-link-wissen">Wissen &amp; News</a></li>
        <li><a href="../faq.html" class="nav-link nav-link-faq">Häufige Fragen</a></li>
        <li><a href="../ueber-uns.html" class="nav-link nav-link-ueber-uns">Über uns</a></li>
        <li><a href="../kontakt.html" class="nav-link nav-link-kontakt">Kontakt</a></li>
        <li class="navbar-mobile-extra">
          <a href="tel:+4317692991" class="navbar-phone">01 / 769 29 91</a>
        </li>
      </ul>
      <div class="navbar-actions">
        <a href="tel:+4317692991" class="navbar-phone">01 / 769 29 91</a>
        <a href="../termin.html" class="btn btn-primary">Termin buchen</a>
      </div>
    </div>
  </nav>
  </header>

  <main id="main-content">
    <section class="local-seo-hero section-standard" aria-labelledby="page-heading">
      <div class="container">
        <div class="local-trust-bar" role="note" aria-label="Vertrauensmerkmale">
          <span>Seit 1990 in 1110 Wien</span>
          <span>Fachärztin für Physikalische Medizin</span>
          <span>Kassen: ÖGK · BVAEB · SVS</span>
        </div>
        <div class="section-header">
          <span class="overline">${GEO.overline}</span>
          <h1 class="heading-1" id="page-heading">${page.h1}</h1>
          <p class="body-text-lg">${page.heroIntro}</p>
        </div>
        <div class="cta-block local-seo-hero-cta">
          <div class="cta-actions">
            <a href="tel:+4317692991" class="btn btn-primary">Jetzt anrufen: 01 / 769 29 91</a>
            <a href="../termin.html" class="btn btn-secondary">Termin online anfragen</a>
          </div>
          <p class="body-text cta-address">Kaiser-Ebersdorfer-Straße 328, 1110 Wien (Simmering) · BUS 71B/73A/76B · TRAM 11/71</p>
        </div>
      </div>
    </section>

    <section class="section-standard section-page" aria-label="Behandlungsinformationen">
      <div class="container local-seo-content">
${renderSections(sectionsBefore)}

        <div class="cta-block cta-block-large local-seo-mid-cta">
          <h2 class="heading-2">Persönliche Beratung in Simmering</h2>
          <p class="body-text">Dr. Fadime Cenik ist Fachärztin für Physikalische Medizin und allgemeine Rehabilitation. Wir nehmen uns Zeit für Ihre Anamnese, Befunderhebung und einen individuellen Therapieplan – mit Kassenleistung (ÖGK, BVAEB, SVS) oder als Privatordination.</p>
          <div class="cta-actions">
            <a href="tel:+4317692991" class="btn btn-primary">01 / 769 29 91</a>
            <a href="../termin.html" class="btn btn-secondary">Termin anfragen</a>
          </div>
        </div>

${renderSections(sectionsAfter)}

${renderRelated(page.related, page.slug)}

        <div class="section-header">
          <h2 class="heading-2">Häufige Fragen</h2>
        </div>
        <div class="faq-list">
${renderFaqs(page.faqs)}
        </div>

        <div class="cta-block cta-block-large local-seo-end-cta">
          <h2 class="heading-2">${GEO.terminCta || 'Termin in 1110 Wien vereinbaren'}</h2>
          <p class="body-text">Ob akute Beschwerden oder chronische Schmerzen: In unserer Ordination in Simmering finden wir gemeinsam den passenden Behandlungsweg – ${GEO.terminText || 'gut erreichbar aus 1100 Wien, Schwechat und dem 15-km-Umkreis.'} Rufen Sie an oder nutzen Sie unser Online-Formular.</p>
          <div class="cta-actions">
            <a href="tel:+4317692991" class="btn btn-primary">Jetzt anrufen</a>
            <a href="../termin.html" class="btn btn-secondary">Termin buchen</a>
          </div>
          <p class="body-text cta-address"><a href="https://www.google.com/maps?cid=16167401803672481750" target="_blank" rel="noopener noreferrer">Route planen (Google Maps)</a> · <a href="../kontakt.html">Kontakt &amp; Anfahrt</a></p>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer footer-ref" role="contentinfo">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="footer-brand">
            <a href="/" class="footer-logo-link"><img src="../assets/logo.webp" onerror="this.onerror=null;this.src='../assets/logo.webp';" alt="Dr. Fadime Cenik – Fachärztin für Physikalische Medizin und allgemeine Rehabilitation" class="footer-logo" width="180" height="180" loading="lazy"></a>
            <p class="footer-desc">Fachärztin für Physikalische Medizin und allgemeine Rehabilitation in Wien.</p>
          </div>
        </div>
        <div class="footer-col">
          <h5>Navigation</h5>
          <ul>
            <li><a href="/">Startseite</a></li>
            <li><a href="../therapieangebot.html">Therapieangebot</a></li>
            <li><a href="../r-force.html">R-Force</a></li>
            <li><a href="../wissen-news.html">Wissen &amp; News</a></li>
            <li><a href="../faq.html">Häufige Fragen</a></li>
            <li><a href="../ueber-uns.html">Über uns</a></li>
            <li><a href="../kontakt.html">Kontakt</a></li>
            <li><a href="../termin.html">Termin anfragen</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Kontakt</h5>
          <ul>
            <li><a href="tel:+4317692991">01 / 769 29 91</a></li>
            <li><a href="mailto:office@drcenik.at">office@drcenik.at</a></li>
            <li><a href="https://www.google.com/maps?cid=16167401803672481750" target="_blank" rel="noopener noreferrer">Google Maps</a></li>
            <li><a href="https://www.google.com/maps/place/Dr.Fadime+Cenik/@48.1588483,16.4717764,17z/data=!4m6!3m5!1s0x476dabdc170b5eb7:0xe05e264828e86fd6!8m2!3d48.1588483!4d16.4717764!16s%2Fg%2F11yx9rm5zy!9m1!1b1" target="_blank" rel="noopener noreferrer">Google-Bewertung abgeben</a></li>
          </ul>
        </div>
        <div class="footer-col footer-col-address">
          <h5>Adresse</h5>
          <p class="footer-address">Kaiser-Ebersdorfer-Straße 328, 1110 Wien, Österreich</p>
          <p class="footer-public"><strong>Öffentlich erreichbar:</strong><br>BUS: 71B / 73A / 76B / 79A / 79B<br>TRAM: 11 / 71<br>Station: Kaiserebersdorf, Zinnergasse</p>
        </div>
        <div class="footer-col">
          <h5>Rechtliches</h5>
          <ul>
            <li><a href="../impressum.html">Impressum</a></li>
            <li><a href="../datenschutz.html">Datenschutzerklärung</a></li>
            <li><a href="../agb.html">AGB</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-since">Seit 1990 für Sie da.</p>
        <p>© 2026 Dr. Fadime Cenik. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  </footer>

  <aside class="mobile-cta" id="mobile-cta" aria-label="Schnellaktionen">
    <a href="tel:+4317692991" class="mobile-cta-btn mobile-cta-phone">Anrufen</a>
    <a href="../termin.html" class="mobile-cta-btn mobile-cta-book">Termin</a>
  </aside>

  <script src="../scripts/main.js?v=11" defer></script>
</body>
</html>`;

  return { slug: page.slug, html, wordCount: wc };
}

const results = [];
for (const page of PAGES) {
  if (page.title.length > 60) console.warn(`WARN ${page.slug}: title ${page.title.length} chars (>60)`);
  if (page.metaDescription.length > 155) console.warn(`WARN ${page.slug}: meta ${page.metaDescription.length} chars (>155)`);

  const outDir = path.join(root, page.slug);
  fs.mkdirSync(outDir, { recursive: true });
  const built = buildPage(page);
  fs.writeFileSync(path.join(outDir, 'index.html'), built.html);
  results.push(built);
  console.log(`✓ ${page.slug}/index.html (${built.wordCount} Wörter)`);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  pages: results.map((r) => ({ slug: r.slug, wordCount: r.wordCount })),
  slugs: ALL_SLUGS,
};
fs.writeFileSync(path.join(root, 'content/local-seo/manifest.json'), JSON.stringify(manifest, null, 2));
console.log('\nLocal SEO pages generated:', results.length);
