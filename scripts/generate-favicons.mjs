/**
 * Generates favicon.ico, favicon-32.png, apple-touch-icon.png from logo.webp
 * Run: npm install && node scripts/generate-favicons.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const logo = path.join(root, 'assets', 'logo.webp');
const outDir = path.join(root, 'assets');

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('npm install required');
  process.exit(1);
}

if (!fs.existsSync(logo)) {
  console.error('logo.webp not found');
  process.exit(1);
}

await sharp(logo).resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png().toFile(path.join(outDir, 'apple-touch-icon.png'));
await sharp(logo).resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png().toFile(path.join(outDir, 'favicon-32.png'));
await sharp(logo).resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png().toFile(path.join(outDir, 'favicon-16.png'));
// favicon.ico as 32px png renamed – browsers accept png via link rel=icon
console.log('Favicons generated in assets/');
