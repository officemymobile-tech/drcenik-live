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
  { rel: 'assets/qr-kontakt.webp', maxWidth: 400, quality: 82 },
  { rel: 'assets/images/r-force/r-force-hero.webp', maxWidth: 1200, quality: 78 },
  { rel: 'assets/images/r-force/r-force-gerat.webp', maxWidth: 900, quality: 78 },
  { rel: 'assets/images/r-force/r-force-training.webp', maxWidth: 1200, quality: 76 },
  { rel: 'assets/images/r-force/r-force-anwendung.webp', maxWidth: 1200, quality: 76 },
  { rel: 'assets/images/wissen-news/artikel-1-medizin.webp', maxWidth: 800, quality: 80 },
  { rel: 'assets/images/wissen-news/artikel-2-physio.webp', maxWidth: 800, quality: 80 },
  { rel: 'assets/images/wissen-news/artikel-3-bewegung.webp', maxWidth: 800, quality: 80 },
  { rel: 'assets/images/wissen-news/artikel-4-klinik.webp', maxWidth: 800, quality: 80 },
  { rel: 'assets/images/wissen-news/artikel-5-reha.webp', maxWidth: 800, quality: 80 },
  { rel: 'assets/images/wissen-news/artikel-6-therapie.webp', maxWidth: 800, quality: 80 },
  { rel: 'assets/gbp/gbp-praxis-empfang.webp', maxWidth: 1200, quality: 76 },
  { rel: 'assets/gbp/gbp-schulterschmerzen.webp', maxWidth: 1000, quality: 76 },
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
  const tmpPath = abs + '.tmp.webp';
  fs.writeFileSync(tmpPath, optimized);
  try {
    fs.unlinkSync(abs);
    fs.renameSync(tmpPath, abs);
  } catch {
    try {
      fs.copyFileSync(tmpPath, abs);
      fs.unlinkSync(tmpPath);
    } catch (err) {
      console.warn('Manuell anwenden:', rel + '.tmp.webp ->', rel);
      throw err;
    }
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
