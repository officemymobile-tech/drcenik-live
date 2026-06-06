/**
 * Recompress oversized WebP assets (logo, gutschein, kassen logos).
 * Downloads from live site if local file missing.
 * Run: npm run optimize-webp
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('Bitte zuerst: npm install');
  process.exit(1);
}

const TARGETS = [
  { rel: 'assets/logo.webp', maxWidth: 440, quality: 82 },
  { rel: 'assets/gutschein.webp', maxWidth: 640, quality: 80 },
  { rel: 'assets/images/kassen/kfa-logo.webp', maxWidth: 240, quality: 88 },
  { rel: 'assets/images/kassen/oegk-logo.webp', maxWidth: 240, quality: 88 },
  { rel: 'assets/images/kassen/bvaeb-logo.webp', maxWidth: 240, quality: 88 },
  { rel: 'assets/images/kassen/svs-logo.webp', maxWidth: 240, quality: 88 },
  { rel: 'assets/visitenkarte-qr.webp', maxWidth: 600, quality: 82 },
];

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'drcenik-optimize/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function optimizeOne({ rel, maxWidth, quality }) {
  const abs = path.join(root, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });

  if (!fs.existsSync(abs)) {
    console.log('Lade:', rel);
    const buf = await download(`${SITE}/${rel.replace(/\\/g, '/')}`);
    fs.writeFileSync(abs, buf);
  }

  const before = fs.statSync(abs).size;
  const optimized = await sharp(abs)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toBuffer();
  fs.writeFileSync(abs + '.tmp.webp', optimized);
  try {
    fs.copyFileSync(abs + '.tmp.webp', abs);
    fs.unlinkSync(abs + '.tmp.webp');
  } catch (err) {
    console.warn('Hinweis: Kopieren fehlgeschlagen – manuell anwenden:', rel + '.tmp.webp ->', rel);
    throw err;
  }
  const after = fs.statSync(abs).size;
  console.log(
    rel,
    `${(before / 1024).toFixed(1)} KB -> ${(after / 1024).toFixed(1)} KB`
  );
}

console.log('=== WebP optimieren ===');
for (const target of TARGETS) {
  try {
    await optimizeOne(target);
  } catch (err) {
    console.warn('Übersprungen:', target.rel, '-', err.message);
  }
}
console.log('Fertig.');
