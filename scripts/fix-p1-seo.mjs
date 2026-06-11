/**
 * P1 SEO fixes: homepage links, kontakt/termin meta differentiation
 * Run: node scripts/fix-p1-seo.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const metaUpdates = {
  'kontakt.html': [
    ['<title>Kontakt &amp; Termin | Dr. Fadime Cenik – Physikalische Medizin &amp; Rehabilitation</title>', '<title>Kontakt | Dr. Fadime Cenik – Adresse, Anfahrt &amp; Öffnungszeiten</title>'],
    ['content="Kontakt &amp; Termin – Dr. Fadime Cenik, Physikalische Medizin &amp; Rehabilitation. Kaiser-Ebersdorfer-Str. 328, 1110 Wien. 01 / 769 29 91."', 'content="Kontakt – Ordination Dr. Fadime Cenik, Physikalische Medizin Wien 11. Adresse Kaiser-Ebersdorfer-Str. 328, Anfahrt, Karte, Öffnungszeiten. Telefon 01 / 769 29 91."'],
    ['<meta property="og:title" content="Kontakt &amp; Termin | Dr. Fadime Cenik">', '<meta property="og:title" content="Kontakt | Dr. Fadime Cenik – Adresse &amp; Anfahrt">'],
    ['content="Kontakt und Terminvereinbarung – Ordination Dr. Fadime Cenik, Kaiser-Ebersdorfer-Str. 328, 1110 Wien. 01 / 769 29 91."', 'content="Adresse, Karte, Anfahrt und Öffnungszeiten der Ordination Dr. Fadime Cenik in Wien 11."'],
    ['<meta name="twitter:title" content="Kontakt &amp; Termin | Dr. Fadime Cenik">', '<meta name="twitter:title" content="Kontakt | Dr. Fadime Cenik – Adresse &amp; Anfahrt">'],
    ['content="Ordination Dr. Fadime Cenik, Wien 11. 01 / 769 29 91."', 'content="Adresse, Karte und Öffnungszeiten – Ordination Wien 11. 01 / 769 29 91."'],
  ],
  'kontakt-tr.html': [
    ['<title>İletişim ve Randevu | Dr. Fadime Cenik – Fiziksel Tıp ve Rehabilitasyon</title>', '<title>İletişim | Dr. Fadime Cenik – Adres, Ulaşım ve Çalışma Saatleri</title>'],
    ['content="İletişim ve Randevu – Dr. Fadime Cenik, Fiziksel Tıp ve Rehabilitasyon. Kaiser-Ebersdorfer-Str. 328, 1110 Wien. 01 / 769 29 91."', 'content="İletişim – Dr. Fadime Cenik muayenehanesi, Fiziksel Tıp Viyana 11. Adres, harita, ulaşım, çalışma saatleri. 01 / 769 29 91."'],
    ['<meta property="og:title" content="İletişim ve Randevu | Dr. Fadime Cenik – Fiziksel Tıp ve Rehabilitasyon">', '<meta property="og:title" content="İletişim | Dr. Fadime Cenik – Adres ve Ulaşım">'],
    ['<meta name="twitter:title" content="İletişim ve Randevu | Dr. Fadime Cenik – Fiziksel Tıp ve Rehabilitasyon">', '<meta name="twitter:title" content="İletişim | Dr. Fadime Cenik – Adres ve Ulaşım">'],
  ],
  'kontakt-en.html': [
    ['<title>Contact &amp; Appointment | Dr. Fadime Cenik – Physical Medicine &amp; Rehabilitation</title>', '<title>Contact | Dr. Fadime Cenik – Address, Directions &amp; Opening Hours</title>'],
    ['content="Contact and appointment – Dr. Fadime Cenik, Physical Medicine and Rehabilitation. Kaiser-Ebersdorfer-Str. 328, 1110 Vienna. 01 / 769 29 91."', 'content="Contact – Dr. Fadime Cenik practice, Physical Medicine Vienna 11. Address, map, directions, opening hours. Phone 01 / 769 29 91."'],
    ['<meta property="og:title" content="Contact &amp; Appointment | Dr. Fadime Cenik – Physical Medicine &amp; Rehabilitation">', '<meta property="og:title" content="Contact | Dr. Fadime Cenik – Address &amp; Directions">'],
    ['<meta name="twitter:title" content="Contact &amp; Appointment | Dr. Fadime Cenik – Physical Medicine &amp; Rehabilitation">', '<meta name="twitter:title" content="Contact | Dr. Fadime Cenik – Address &amp; Directions">'],
  ],
  'termin.html': [
    ['content="Termin anfragen – Dr. Fadime Cenik, Physikalische Medizin &amp; Rehabilitation Wien 11. Telefon 01 / 769 29 91 oder E-Mail."', 'content="Termin anfragen per Telefon, E-Mail oder Formular. Erstuntersuchung nach Vereinbarung – Dr. Fadime Cenik, Physikalische Medizin Wien 11."'],
    ['content="Termin per Telefon oder E-Mail anfragen – Ordination Wien 11."', 'content="Termin online oder telefonisch anfragen – Erstuntersuchung nach Vereinbarung. Ordination Wien 11."'],
    ['  <meta name="twitter:image" content="https://www.drcenik.at/assets/logo.webp">\n  <meta property="og:locale" content="de_AT">', '  <meta name="twitter:image" content="https://www.drcenik.at/assets/logo.webp">\n  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:title" content="Termin anfragen | Dr. Fadime Cenik">\n  <meta name="twitter:description" content="Termin per Telefon, E-Mail oder Formular – Erstuntersuchung nach Vereinbarung. Wien 11.">\n  <meta property="og:locale" content="de_AT">'],
  ],
  'termin-tr.html': [
    ['content="Randevu talebi – Dr. Fadime Cenik, Fiziksel Tıp ve Rehabilitasyon Viyana 11. Telefon 01 / 769 29 91 veya e-posta."', 'content="Randevu talebi telefon, e-posta veya form ile. İlk muayene randevu ile – Dr. Fadime Cenik, Fiziksel Tıp Viyana 11."'],
    ['<meta property="og:description" content="Randevu talebi – Dr. Fadime Cenik, Fiziksel Tıp ve Rehabilitasyon Viyana 11. Telefon 01 / 769 29 91 veya e-posta."', '<meta property="og:description" content="Randevu telefon, e-posta veya form ile – ilk muayene randevu ile. Viyana 11.">'],
    ['<meta name="twitter:description" content="Randevu talebi – Dr. Fadime Cenik, Fiziksel Tıp ve Rehabilitasyon Viyana 11. Telefon 01 / 769 29 91 veya e-posta."', '<meta name="twitter:description" content="Randevu telefon, e-posta veya form ile – ilk muayene randevu ile. Viyana 11.">'],
  ],
  'termin-en.html': [
    ['content="Request an appointment – Dr. Fadime Cenik, Physical Medicine &amp; Rehabilitation Vienna 11. Phone 01 / 769 29 91 or email."', 'content="Request an appointment by phone, email or form. Initial consultation by appointment – Dr. Fadime Cenik, Physical Medicine Vienna 11."'],
    ['<meta property="og:description" content="Request an appointment – Dr. Fadime Cenik, Physical Medicine &amp; Rehabilitation Vienna 11. Phone 01 / 769 29 91 or email."', '<meta property="og:description" content="Book by phone, email or form – initial consultation by appointment. Vienna 11.">'],
    ['<meta name="twitter:description" content="Request an appointment – Dr. Fadime Cenik, Physical Medicine &amp; Rehabilitation Vienna 11. Phone 01 / 769 29 91 or email."', '<meta name="twitter:description" content="Book by phone, email or form – initial consultation by appointment. Vienna 11.">'],
  ],
};

const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith('.html') && f !== '267059-geschenkgutschein-vorlage.html');

for (const file of htmlFiles) {
  let html = fs.readFileSync(path.join(root, file), 'utf8');
  html = html.replace(/href="index\.html"/g, 'href="/"');
  html = html.replace(/267059-geschenkgutschein-vorlage\.html/g, 'geschenkgutschein.html');
  if (metaUpdates[file]) {
    for (const [from, to] of metaUpdates[file]) {
      if (!html.includes(from)) {
        console.warn('WARN: pattern not found in', file, from.slice(0, 60));
      } else {
        html = html.replace(from, to);
      }
    }
  }
  fs.writeFileSync(path.join(root, file), html);
  console.log('Updated', file);
}

console.log('P1 SEO fixes applied.');
