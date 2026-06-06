/**
 * Critical SEO fixes: termin meta HTML, kontakt intent, news Article schema
 * Run: node scripts/fix-critical-seo.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at';
const MODIFIED = '2026-06-06';

const publisher = {
  '@type': 'Organization',
  name: 'Dr. Fadime Cenik',
  url: `${SITE}/`,
  logo: { '@type': 'ImageObject', url: `${SITE}/assets/logo.webp` },
};

const author = { '@type': 'Person', name: 'Dr. Fadime Cenik' };

function buildItemList(pageUrl, articles) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: articles.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Article',
        headline: a.headline,
        description: a.description,
        datePublished: a.datePublished,
        dateModified: MODIFIED,
        url: `${pageUrl}#${a.id}`,
        mainEntityOfPage: `${pageUrl}#${a.id}`,
        author,
        publisher,
        image: a.image,
      },
    })),
  };
}

const newsArticles = {
  'wissen-news.html': {
    url: `${SITE}/wissen-news.html`,
    articles: [
      {
        id: 'news-mtd',
        headline: 'MTD-Gesetz 2024: Dry Needling im Berufsbild Physiotherapie',
        description: 'Dry Needling ist seit dem MTD-Gesetz 2024 Teil des Physiotherapie-Berufsbilds und ÖGK-Kassenleistung.',
        datePublished: '2024-09-01',
        image: `${SITE}/assets/images/wissen-news/artikel-1-medizin.webp`,
      },
      {
        id: 'news-oegpmr',
        headline: 'ÖGPMR & Österreichische Schmerzgesellschaft: Stärkere Zusammenarbeit 2025',
        description: 'ÖGPMR und Schmerzgesellschaft stärken die interdisziplinäre Schmerztherapie in Österreich.',
        datePublished: '2025-01-15',
        image: `${SITE}/assets/images/wissen-news/artikel-2-physio.webp`,
      },
      {
        id: 'news-leitlinien',
        headline: 'Leitlinien 2024: Spastik, Schlaganfall-Reha und Bewegungstherapie',
        description: 'Aktualisierte Leitlinien zu Spastik, Schlaganfall-Rehabilitation und Bewegungstherapie bei chronischen Schmerzen.',
        datePublished: '2024-06-01',
        image: `${SITE}/assets/images/wissen-news/artikel-3-bewegung.webp`,
      },
      {
        id: 'news-oegk',
        headline: 'ÖGK: Gesundheitszentren für Physikalische Medizin und Kostenerstattung',
        description: 'ÖGK-Gesundheitszentren und Kostenerstattung für Physiotherapie und physikalische Medizin in Österreich.',
        datePublished: '2024-10-01',
        image: `${SITE}/assets/images/wissen-news/artikel-4-klinik.webp`,
      },
      {
        id: 'news-reha',
        headline: 'Rehabilitation: ICF, MLP und teilhabeorientierte Reha',
        description: 'Teilhabeorientierte Rehabilitation nach ICF und medizinischem Leistungsprofil in Österreich.',
        datePublished: '2024-11-01',
        image: `${SITE}/assets/images/wissen-news/artikel-5-reha.webp`,
      },
      {
        id: 'news-schlaganfall',
        headline: 'Frühmobilisation und Schlaganfall-Reha: Leitlinien 2024',
        description: 'Leitlinien zur Frühmobilisation und Schlaganfall-Rehabilitation mit task-spezifischem Training.',
        datePublished: '2024-08-01',
        image: `${SITE}/assets/images/wissen-news/artikel-6-therapie.webp`,
      },
    ],
  },
  'wissen-news-tr.html': {
    url: `${SITE}/wissen-news-tr.html`,
    articles: [
      {
        id: 'news-mtd',
        headline: 'MTD Yasası 2024: Dry Needling fizyoterapi meslek tanımında',
        description: 'Dry Needling, MTD Yasası ile fizyoterapi kapsamında ve ÖGK kasa hizmeti olarak tanımlandı.',
        datePublished: '2024-09-01',
        image: `${SITE}/assets/images/wissen-news/artikel-1-medizin.webp`,
      },
      {
        id: 'news-oegpmr',
        headline: 'Disiplinler arası ağrı tedavisi: Fiziksel tıp odağında',
        description: 'ÖGPMR ve Avusturya Ağrı Derneği multimodal ağrı tedavisinde iş birliğini güçlendiriyor.',
        datePublished: '2025-01-15',
        image: `${SITE}/assets/images/wissen-news/artikel-2-physio.webp`,
      },
      {
        id: 'news-leitlinien',
        headline: '2024 Kılavuzları: Spastisite, inme rehab ve hareket tedavisi',
        description: 'Spastisite, inme rehabilitasyonu ve kronik ağrıda güncel kılavuz önerileri.',
        datePublished: '2024-06-01',
        image: `${SITE}/assets/images/wissen-news/artikel-3-bewegung.webp`,
      },
      {
        id: 'news-oegk',
        headline: 'ÖGK Mali karşılık: Fizyoterapi ve tedavi masajı 2024/2025',
        description: 'ÖGK seçim alanında fizyoterapi ve tedavi masajı mali karşılık düzenlemeleri.',
        datePublished: '2024-10-01',
        image: `${SITE}/assets/images/wissen-news/artikel-4-klinik.webp`,
      },
      {
        id: 'news-reha',
        headline: 'Rehabilitasyon: ICF, MLP ve katılım odaklı rehab',
        description: 'ICF ve MLP temelli katılım odaklı rehabilitasyon yaklaşımı.',
        datePublished: '2024-11-01',
        image: `${SITE}/assets/images/wissen-news/artikel-5-reha.webp`,
      },
      {
        id: 'news-schlaganfall',
        headline: 'Erken mobilizasyon ve inme rehab: 2024 kılavuzları',
        description: 'Inme rehabilitasyonunda erken mobilizasyon ve görev odaklı eğitim kılavuzları.',
        datePublished: '2024-08-01',
        image: `${SITE}/assets/images/wissen-news/artikel-2-physio.webp`,
      },
    ],
  },
  'wissen-news-en.html': {
    url: `${SITE}/wissen-news-en.html`,
    articles: [
      {
        id: 'news-mtd',
        headline: 'MTD Act 2024: Dry Needling in physiotherapy scope',
        description: 'Dry Needling is now part of the physiotherapy scope and an ÖGK statutory service since 2024.',
        datePublished: '2024-09-01',
        image: `${SITE}/assets/images/wissen-news/artikel-1-medizin.webp`,
      },
      {
        id: 'news-oegpmr',
        headline: 'Interdisciplinary pain therapy: Physical medicine in focus',
        description: 'ÖGPMR and the Austrian Pain Society strengthen multimodal pain management.',
        datePublished: '2025-01-15',
        image: `${SITE}/assets/images/wissen-news/artikel-2-physio.webp`,
      },
      {
        id: 'news-leitlinien',
        headline: 'Guidelines 2024: Spasticity, stroke rehab and exercise therapy',
        description: 'Updated guidelines on spasticity, stroke rehabilitation and exercise therapy for chronic pain.',
        datePublished: '2024-06-01',
        image: `${SITE}/assets/images/wissen-news/artikel-3-bewegung.webp`,
      },
      {
        id: 'news-oegk',
        headline: 'ÖGK cost reimbursement: Physiotherapy and therapeutic massage 2024/2025',
        description: 'ÖGK reimbursement for physiotherapy and therapeutic massage under the elective scheme.',
        datePublished: '2024-10-01',
        image: `${SITE}/assets/images/wissen-news/artikel-4-klinik.webp`,
      },
      {
        id: 'news-reha',
        headline: 'Rehabilitation: ICF, MLP and participation-oriented rehab',
        description: 'Participation-oriented rehabilitation based on the WHO ICF model and MLP.',
        datePublished: '2024-11-01',
        image: `${SITE}/assets/images/wissen-news/artikel-5-reha.webp`,
      },
      {
        id: 'news-schlaganfall',
        headline: 'Early mobilisation and stroke rehab: Guidelines 2024',
        description: 'Guidelines on early mobilisation and stroke rehabilitation with task-specific training.',
        datePublished: '2024-08-01',
        image: `${SITE}/assets/images/wissen-news/artikel-2-physio.webp`,
      },
    ],
  },
};

function replaceItemList(file) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const re = /  <script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "ItemList"[\s\S]*?<\/script>/;
  const cfg = newsArticles[file];
  if (!cfg) return;
  const block = `  <script type="application/ld+json">\n  ${JSON.stringify(buildItemList(cfg.url, cfg.articles), null, 2).replace(/\n/g, '\n  ')}\n  </script>`;
  if (!re.test(html)) {
    console.warn('ItemList not found in', file);
    return;
  }
  fs.writeFileSync(path.join(root, file), html.replace(re, block));
  console.log('Updated ItemList', file);
}

for (const file of ['termin-tr.html', 'termin-en.html']) {
  const p = path.join(root, file);
  let html = fs.readFileSync(p, 'utf8');
  html = html.replace(/">>/g, '">');
  fs.writeFileSync(p, html);
  console.log('Fixed meta HTML', file);
}

const kontaktEdits = {
  'kontakt.html': {
    intro:
      'Adresse, Anfahrt und Öffnungszeiten unserer Ordination in Wien 11. Für Terminbuchungen nutzen Sie bitte unsere <a href="termin.html">Termin-Seite</a>. Allgemeine Anfragen erreichen uns per Telefon, E-Mail oder Kontaktformular.',
    faqQ: 'Wo finde ich die Ordination und wie komme ich hin?',
    faqA:
      'Unsere Ordination befindet sich in der Kaiser-Ebersdorfer-Straße 328, 1110 Wien. Anfahrt mit Bus (71B, 73A, 76B, 79A, 79B) und Tram (11, 71) bis Station Kaiserebersdorf, Zinnergasse. <a href="https://www.google.com/maps/search/?api=1&amp;query=Kaiser-Ebersdorfer-Straße+328,+1110+Wien,+Österreich" target="_blank" rel="noopener noreferrer">Route in Google Maps</a>.',
  },
  'kontakt-tr.html': {
    intro:
      'Adres, ulaşım ve çalışma saatleri – Dr. Fadime Cenik muayenehanesi, Viyana 11. Randevu için lütfen <a href="termin-tr.html">randevu sayfamızı</a> kullanın. Genel sorularınız için telefon, e-posta veya iletişim formu.',
    faqQ: 'Muayenehaneyi nerede bulabilirim ve nasıl ulaşırım?',
    faqA:
      'Muayenehanemiz Kaiser-Ebersdorfer-Straße 328, 1110 Wien adresindedir. Otobüs (71B, 73A, 76B, 79A, 79B) ve tramvay (11, 71) ile Kaiserebersdorf, Zinnergasse durağına. <a href="https://www.google.com/maps/search/?api=1&amp;query=Kaiser-Ebersdorfer-Straße+328,+1110+Wien,+Österreich" target="_blank" rel="noopener noreferrer">Google Haritalar\'da rota</a>.',
  },
  'kontakt-en.html': {
    intro:
      'Address, directions and opening hours of our practice in Vienna 11. For appointments please use our <a href="termin-en.html">appointment page</a>. For general enquiries contact us by phone, email or contact form.',
    faqQ: 'Where is the practice and how do I get there?',
    faqA:
      'Our practice is at Kaiser-Ebersdorfer-Straße 328, 1110 Vienna. By bus (71B, 73A, 76B, 79A, 79B) and tram (11, 71) to Kaiserebersdorf, Zinnergasse. <a href="https://www.google.com/maps/search/?api=1&amp;query=Kaiser-Ebersdorfer-Straße+328,+1110+Wien,+Österreich" target="_blank" rel="noopener noreferrer">Directions in Google Maps</a>.',
  },
};

for (const [file, ed] of Object.entries(kontaktEdits)) {
  let html = fs.readFileSync(path.join(root, file), 'utf8');
  html = html.replace(
    /<p class="body-text-lg contact-page-intro">[\s\S]*?<\/p>/,
    `<p class="body-text-lg contact-page-intro">${ed.intro}</p>`
  );
  html = html.replace(
    /<summary class="contact-faq-question">[\s\S]*?<\/summary>\s*<p class="contact-faq-answer">[\s\S]*?<\/p>/,
    `<summary class="contact-faq-question">${ed.faqQ}</summary>\n            <p class="contact-faq-answer">${ed.faqA}</p>`
  );
  fs.writeFileSync(path.join(root, file), html);
  console.log('Updated kontakt content', file);
}

for (const file of Object.keys(newsArticles)) {
  replaceItemList(file);
}

console.log('Critical SEO fixes applied.');
