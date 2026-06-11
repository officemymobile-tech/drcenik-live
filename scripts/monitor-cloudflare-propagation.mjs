/**
 * Wartet auf Cloudflare-NS-Propagation, konfiguriert DNS, prüft Redirects.
 * Run: node scripts/monitor-cloudflare-propagation.mjs
 * Env: CF_MONITOR_INTERVAL_MS (default 300000 = 5 min), CF_MONITOR_MAX_HOURS (default 48)
 */
import { execSync, spawnSync } from 'child_process';
import dns from 'dns/promises';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOMAIN = 'drcenik.at';
const CF_NS = ['cloudflare.com'];
const RESOLVERS = ['8.8.8.8', '1.1.1.1', '9.9.9.9'];
const INTERVAL_MS = Number(process.env.CF_MONITOR_INTERVAL_MS || 5 * 60 * 1000);
const MAX_MS = Number(process.env.CF_MONITOR_MAX_HOURS || 48) * 60 * 60 * 1000;
const LOG = path.join(root, 'logs', 'cloudflare-propagation.log');

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  fs.appendFileSync(LOG, line + '\n');
}

function nslookupNs(resolver) {
  try {
    const out = execSync(`nslookup -type=NS ${DOMAIN} ${resolver}`, {
      encoding: 'utf8',
      timeout: 15000,
    });
    const names = [...out.matchAll(/nameserver\s*=\s*(\S+)/gi)].map((m) => m[1].toLowerCase());
    return names;
  } catch {
    return [];
  }
}

function isCloudflareNs(names) {
  return names.length > 0 && names.every((n) => CF_NS.some((cf) => n.includes(cf)));
}

async function checkPropagation() {
  const results = {};
  let cfCount = 0;
  for (const r of RESOLVERS) {
    const ns = nslookupNs(r);
    results[r] = ns;
    if (isCloudflareNs(ns)) cfCount++;
  }
  return { results, cfCount, done: cfCount >= 2 };
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: root, encoding: 'utf8', shell: true });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

async function finishSetup() {
  log('Propagation erkannt — DNS + Redirect-Audit starten');

  const prov = run('npm', ['run', 'provision-cloudflare-dns']);
  log(`provision-cloudflare-dns exit=${prov.code}`);
  if (prov.code !== 0) log(prov.out.slice(-800));

  await new Promise((r) => setTimeout(r, 5000));

  const audit = run('npm', ['run', 'audit-redirects']);
  log(audit.out);

  const ok = /(\d+)\/7 echte 301/.exec(audit.out);
  const score = ok ? Number(ok[1]) : 0;
  if (score >= 7) {
    log('FERTIG: 7/7 Redirects — Cloudflare aktiv');
    return true;
  }
  log(`Redirect-Score: ${score}/7 — ggf. Worker-Route prüfen`);
  return score >= 6;
}

const start = Date.now();
log(`Monitor gestartet (Intervall ${INTERVAL_MS / 60000} min, max ${MAX_MS / 3600000}h)`);

while (Date.now() - start < MAX_MS) {
  const { results, cfCount, done } = await checkPropagation();
  const summary = RESOLVERS.map((r) => `${r}:${(results[r] || []).join(',') || '?'}`).join(' | ');
  log(`NS-Check (${cfCount}/${RESOLVERS.length} CF): ${summary}`);

  if (done) {
    const ok = await finishSetup();
    process.exit(ok ? 0 : 1);
  }

  await new Promise((r) => setTimeout(r, INTERVAL_MS));
}

log('Timeout — Propagation nach 48h noch nicht abgeschlossen. World4You NS prüfen.');
process.exit(2);
