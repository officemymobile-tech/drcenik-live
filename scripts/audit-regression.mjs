import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['prototype-apple.html', '267059-geschenkgutschein-vorlage.html']);
const files = fs.readdirSync(root).filter((f) => f.endsWith('.html') && !SKIP.has(f));

let jsonErr = 0;
let titleOgMismatch = [];
let descOgMismatch = [];
let titles = new Map();

for (const f of files) {
  const h = fs.readFileSync(path.join(root, f), 'utf8');
  const head = h.split('</head>')[0];
  for (const [, j] of h.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(j.trim());
    } catch {
      jsonErr++;
      console.log('JSON-LD FAIL:', f);
    }
  }
  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1]?.replace(/&amp;/g, '&');
  const og = (head.match(/property="og:title" content="([^"]*)"/) || [])[1]?.replace(/&amp;/g, '&');
  const desc = (head.match(/name="description" content="([^"]*)"/) || [])[1]?.replace(/&amp;/g, '&');
  const ogd = (head.match(/property="og:description" content="([^"]*)"/) || [])[1]?.replace(/&amp;/g, '&');
  if (title && titles.has(title)) titleOgMismatch.push(`${f} duplicate title with ${titles.get(title)}`);
  if (title) titles.set(title, f);
  if (title && og && title !== og && !og.includes(title.split('|')[0].trim())) titleOgMismatch.push(`${f}: title≠og`);
  if (desc && ogd && desc.slice(0, 40) !== ogd.slice(0, 40)) descOgMismatch.push(f);
}

console.log('Pages:', files.length);
console.log('JSON-LD errors:', jsonErr);
console.log('Title duplicates:', titleOgMismatch.filter((x) => x.includes('duplicate')).length);
console.log('Title vs OG mismatches:', titleOgMismatch.filter((x) => x.includes('title≠og')).length);
console.log('Desc vs OG desc drift (>40 chars):', descOgMismatch.length);
