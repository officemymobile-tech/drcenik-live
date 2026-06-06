/**
 * Lädt offizielle Kassenlogos, konvertiert alle Bilder nach WebP, aktualisiert HTML/CSS-Referenzen.
 * Ausführung: npm install && node scripts/process-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('Bitte zuerst: npm install');
  process.exit(1);
}

const LOGO_SOURCES = {
  'kfa-logo': 'https://www.kfawien.at/cdscontent/load?contentid=10008.673457&version=1549268977',
  'oegk-logo': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/%C3%96GK-Logo.svg',
  'bvaeb-logo': 'https://www.bvaeb.at/cdscontent/load?contentid=10008.723686&version=1570182342',
  'svs-logo': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/SVS-Logo.png',
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'drcenik-website/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        fs.writeFileSync(dest, Buffer.concat(chunks));
        resolve(dest);
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function toWebp(input, output, opts = {}) {
  const { maxWidth = 1600, quality = 82, height } = opts;
  let img = sharp(input).rotate();
  const meta = await img.metadata();
  if (maxWidth && meta.width && meta.width > maxWidth) {
    img = img.resize({ width: maxWidth, withoutEnlargement: true });
  }
  if (height) {
    img = img.resize({ height, withoutEnlargement: true });
  }
  await img.webp({ quality, effort: 6, alphaQuality: 90 }).toFile(output);
  const before = fs.statSync(input).size;
  const after = fs.statSync(output).size;
  return { before, after };
}

async function processKassenLogos() {
  const dir = path.join(root, 'assets', 'images', 'kassen');
  fs.mkdirSync(dir, { recursive: true });
  const tmpDir = path.join(dir, '.tmp');
  fs.mkdirSync(tmpDir, { recursive: true });

  for (const [name, url] of Object.entries(LOGO_SOURCES)) {
    const ext = url.includes('.svg') ? '.svg' : path.extname(new URL(url).pathname) || '.png';
    const tmp = path.join(tmpDir, `${name}${ext}`);
    const out = path.join(dir, `${name}.webp`);
    console.log('Logo laden:', name);
    await download(url, tmp);
    await toWebp(tmp, out, { maxWidth: 480, quality: 90 });
    const kb = (fs.statSync(out).size / 1024).toFixed(1);
    console.log('  ->', path.relative(root, out), kb + ' KB');
  }

  fs.rmSync(tmpDir, { recursive: true, force: true });

  for (const old of ['kfa-logo.png', 'oegk-logo.png', 'bvaeb-logo.png', 'svs-logo.png']) {
    const p = path.join(dir, old);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
}

function walkImages(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.git' || ent.name === '.tmp') continue;
      walkImages(p, acc);
    } else if (/\.(png|jpe?g)$/i.test(ent.name)) {
      acc.push(p);
    }
  }
  return acc;
}

async function convertAllImages() {
  const skipDirs = ['assets/images/kassen/.tmp'];
  const images = walkImages(root).filter((p) => {
    const rel = path.relative(root, p).replace(/\\/g, '/');
    if (rel.startsWith('assets/images/kassen/') && /\.(png|jpe?g)$/i.test(rel)) return false;
    return true;
  });

  for (const input of images) {
    const out = input.replace(/\.(png|jpe?g)$/i, '.webp');
    if (fs.existsSync(out)) continue;
    const rel = path.relative(root, input);
    const isLogo = /logo/i.test(rel);
    const isQr = /qr|visitenkarte|gutschein/i.test(rel);
    const maxWidth = isLogo ? 900 : isQr ? 800 : 1400;
    const quality = isLogo ? 85 : 82;
    const before = fs.statSync(input).size;
    await toWebp(input, out, { maxWidth, quality });
    const after = fs.statSync(out).size;
    console.log(
      path.relative(root, out),
      `${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`
    );
  }
}

function updateReferences() {
  const exts = ['html', 'css', 'js', 'json', 'xml', 'md'];
  const files = [];
  function walk(d) {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) {
        if (['node_modules', '.git'].includes(ent.name)) continue;
        walk(p);
      } else if (exts.includes(path.extname(ent.name).slice(1))) {
        files.push(p);
      }
    }
  }
  walk(root);

  const replacements = [
    [/assets\/images\/kassen\/kfa-logo\.png/g, 'assets/images/kassen/kfa-logo.webp'],
    [/assets\/images\/kassen\/oegk-logo\.png/g, 'assets/images/kassen/oegk-logo.webp'],
    [/assets\/images\/kassen\/bvaeb-logo\.png/g, 'assets/images/kassen/bvaeb-logo.webp'],
    [/assets\/images\/kassen\/svs-logo\.png/g, 'assets/images/kassen/svs-logo.webp'],
    [/(\.\/)?assets\/logo\.jpg/g, 'assets/logo.webp'],
    [/Logo\.png\.jpg/g, 'logo.webp'],
    [/assets\/gutschein\.png/g, 'assets/gutschein.webp'],
    [/assets\/qr-kontakt\.png/g, 'assets/qr-kontakt.webp'],
    [/assets\/visitenkarte-qr\.png/g, 'assets/visitenkarte-qr.webp'],
    [/artikel-1-medizin\.jpg/g, 'artikel-1-medizin.webp'],
    [/artikel-2-physio\.jpg/g, 'artikel-2-physio.webp'],
    [/artikel-3-bewegung\.jpg/g, 'artikel-3-bewegung.webp'],
    [/artikel-4-klinik\.jpg/g, 'artikel-4-klinik.webp'],
    [/artikel-5-reha\.jpg/g, 'artikel-5-reha.webp'],
    [/artikel-6-therapie\.jpg/g, 'artikel-6-therapie.webp'],
    [/r-force-hero\.jpg/g, 'r-force-hero.webp'],
    [/r-force-anwendung\.jpg/g, 'r-force-anwendung.webp'],
    [/r-force-training\.jpg/g, 'r-force-training.webp'],
  ];

  let changed = 0;
  for (const file of files) {
    let text = fs.readFileSync(file, 'utf8');
    let orig = text;
    for (const [re, rep] of replacements) text = text.replace(re, rep);
    if (text !== orig) {
      fs.writeFileSync(file, text, 'utf8');
      changed++;
      console.log('Aktualisiert:', path.relative(root, file));
    }
  }
  console.log(`${changed} Dateien mit WebP-Referenzen aktualisiert.`);
}

function removeOldRaster() {
  const keep = new Set();
  for (const webp of walkImages(root).map((p) => p.replace(/\.(png|jpe?g)$/i, '.webp'))) {
    keep.add(webp);
  }
  for (const input of walkImages(root)) {
    const webp = input.replace(/\.(png|jpe?g)$/i, '.webp');
    if (fs.existsSync(webp) && input !== webp) {
      fs.unlinkSync(input);
      console.log('Entfernt:', path.relative(root, input));
    }
  }
}

console.log('=== Kassenlogos (offizielle Quellen) ===');
await processKassenLogos();
console.log('\n=== Bilder nach WebP ===');
await convertAllImages();
console.log('\n=== HTML/CSS-Referenzen ===');
updateReferences();
console.log('\n=== Alte PNG/JPG entfernen ===');
removeOldRaster();
console.log('\nFertig.');
