/**
 * Copy self-hosted woff2 fonts from @fontsource packages
 * Run: npm install && node scripts/download-fonts.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'assets', 'fonts');
fs.mkdirSync(out, { recursive: true });

const copies = [
  ['@fontsource/source-sans-3/files/source-sans-3-latin-400-normal.woff2', 'source-sans-3-latin-400-normal.woff2'],
  ['@fontsource/source-sans-3/files/source-sans-3-latin-600-normal.woff2', 'source-sans-3-latin-600-normal.woff2'],
  ['@fontsource/source-sans-3/files/source-sans-3-latin-700-normal.woff2', 'source-sans-3-latin-700-normal.woff2'],
  ['@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2', 'cormorant-garamond-latin-400-normal.woff2'],
  ['@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2', 'cormorant-garamond-latin-400-italic.woff2'],
];

for (const [from, name] of copies) {
  const src = path.join(root, 'node_modules', from);
  if (!fs.existsSync(src)) {
    console.error('Missing:', src, '– run npm install @fontsource/source-sans-3 @fontsource/cormorant-garamond');
    process.exit(1);
  }
  fs.copyFileSync(src, path.join(out, name));
  console.log('Copied', name);
}
