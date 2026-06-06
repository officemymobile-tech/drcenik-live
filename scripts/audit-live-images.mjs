/**
 * Compare live vs local WebP sizes.
 * Run: node scripts/audit-live-images.mjs
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at';

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (ent.name.endsWith('.webp') && !ent.name.endsWith('.tmp.webp')) acc.push(path.relative(root, p).replace(/\\/g, '/'));
  }
  return acc;
}

function fetchSize(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'drcenik-audit/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchSize(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).length));
      res.on('error', reject);
    }).on('error', reject);
  });
}

const files = walk(path.join(root, 'assets')).sort();
let liveTotal = 0;
let localTotal = 0;
const rows = [];

console.log('FILE'.padEnd(52), 'LIVE KB', 'LOCAL KB', 'STATUS');
for (const rel of files) {
  const local = fs.statSync(path.join(root, rel)).size;
  localTotal += local;
  try {
    const live = await fetchSize(`${SITE}/${rel}`);
    liveTotal += live;
    const liveKb = live / 1024;
    const localKb = local / 1024;
    let status = 'OK';
    if (liveKb > 100) status = 'GROSS';
    else if (Math.abs(live - local) > 512) status = live > local ? 'LIVE+' : 'LOCAL+';
    rows.push({ rel, liveKb, localKb, status });
    console.log(
      rel.padEnd(52),
      liveKb.toFixed(1).padStart(7),
      localKb.toFixed(1).padStart(8),
      status.padStart(6)
    );
  } catch (err) {
    console.log(rel.padEnd(52), 'ERR'.padStart(7), (local / 1024).toFixed(1).padStart(8), err.message);
  }
}

console.log('\nTOTAL LIVE:', (liveTotal / 1024).toFixed(1), 'KB');
console.log('TOTAL LOCAL:', (localTotal / 1024).toFixed(1), 'KB');
const gross = rows.filter((r) => r.liveKb > 100);
if (gross.length) {
  console.log('\n> 100 KB auf Live:', gross.map((r) => r.rel).join(', '));
} else {
  console.log('\nKeine Live-Datei > 100 KB.');
}
