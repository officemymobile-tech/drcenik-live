#!/usr/bin/env node
/**
 * Exportiert GBP Copy-Paste-Inhalte für das Google Business Profile Dashboard.
 * Keine Website-Änderungen – nur Ausgabe für manuelles Einspielen.
 *
 * Usage: npm run gbp-export
 *        npm run gbp-export -- --post 0   (nur erster Post)
 *        npm run gbp-export -- --services (nur Dienstleistungen)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const gbp = JSON.parse(fs.readFileSync(path.join(root, 'config/gbp.json'), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(root, 'config/gbp-local-posts.json'), 'utf8'));
const localSeo = JSON.parse(fs.readFileSync(path.join(root, 'config/gbp-local-seo.json'), 'utf8'));

const args = process.argv.slice(2);
const onlyPost = args.includes('--post') ? Number(args[args.indexOf('--post') + 1]) : null;
const onlyServices = args.includes('--services');
const onlyReviews = args.includes('--reviews');

const line = (char = '─', n = 72) => char.repeat(n);
const section = (title) => {
  console.log('\n' + line('═'));
  console.log(`  ${title}`);
  console.log(line('═') + '\n');
};

const ctaLabel = (cta) => {
  const map = { BOOK: 'Termin buchen', CALL: 'Anrufen', LEARN_MORE: 'Mehr erfahren' };
  return `${map[cta.type] || cta.type} → ${cta.url}`;
};

if (!onlyServices && !onlyReviews) {
  section('GOOGLE BUSINESS PROFILE – BEITRÄGE (Copy & Paste)');
  console.log(`Dashboard: ${localSeo.profile.editUrl}`);
  console.log(`Zeitplan: ${posts.schedule.preferredPostDay} ${posts.schedule.preferredPostTime}, ab ${posts.schedule.startDate}\n`);

  const list = onlyPost != null && !Number.isNaN(onlyPost) ? [posts.posts[onlyPost]].filter(Boolean) : posts.posts;

  for (const post of list) {
    const text = post.body || post.summary;
    const len = text.length;
    const warn = len > 1500 ? ` ⚠️ ${len} Zeichen (max. 1500!)` : ` (${len} Zeichen)`;

    console.log(line());
    console.log(`📅 ${post.scheduledDate} ${post.scheduledTime} · ${post.title}${warn}`);
    console.log(line());
    console.log(text);
    console.log(`\nButton: ${ctaLabel(post.callToAction)}`);
    if (post.link) console.log(`Link (optional): ${post.link}`);
    if (post.hashtags?.length) console.log(`Hashtags: ${post.hashtags.map((h) => '#' + h).join(' ')}`);
    console.log('');
  }
}

if (!onlyPost && !onlyReviews) {
  section('DIENSTLEISTUNGEN (Profil → Dienstleistungen bearbeiten)');

  console.log('Bestehende Services aus gbp.json (Priorität):\n');
  for (const s of gbp.services) {
    console.log(`• ${s.name}`);
    console.log(`  ${s.desc}\n`);
  }

  console.log(line());
  console.log('Neue Local-SEO-Services (zusätzlich anlegen):\n');
  for (const s of localSeo.services) {
    console.log(`• ${s.name}`);
    console.log(`  ${s.shortDescription}`);
    console.log(`  Kategorie-Hinweis: ${s.gbpCategoryHint}`);
    console.log(`  Landingpage: ${s.landingPage}`);
    console.log(`  Fotos: ${s.imageIdeas.join(' · ')}\n`);
  }
}

if (!onlyPost && !onlyServices) {
  section('REVIEW-VORLAGEN');
  const r = localSeo.reviewTemplates;
  console.log('SMS / E-Mail (Review anfragen):\n');
  console.log(r.requestSms.replace('{reviewUrl}', gbp.reviewUrl || localSeo.profile.reviewUrl));
  console.log('\nAntwort positiv:\n');
  console.log(r.replyPositive);
  console.log('\nAntwort kritisch:\n');
  console.log(r.replyCritical);

  section('LOCAL-RANKING CHECKLISTE');
  for (const item of localSeo.localRankingChecklist) {
    console.log(`☐ ${item}`);
  }
}

section('NÄCHSTER SCHRITT');
console.log('1. https://business.google.com/locations öffnen (officemymobile@gmail.com)');
console.log('2. Profil bearbeiten → Beitrag hinzufügen → Text oben einfügen');
console.log('3. Dienstleistungen → 7 Local-SEO-Einträge anlegen');
console.log('4. Pro Service mindestens 1 Foto hochladen');
console.log('5. Review-Link auf Visitenkarte / nach Termin versenden\n');
