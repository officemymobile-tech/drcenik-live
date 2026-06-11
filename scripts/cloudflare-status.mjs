/**
 * Kurzstatus: NS-Propagation, Zone, Redirect-Audit
 */
import { execSync, spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const DOMAIN = 'drcenik.at';
const CF_NS = ['aarav.ns.cloudflare.com', 'nancy.ns.cloudflare.com'];

async function nsViaGoogleDns() {
  try {
    const res = await fetch('https://dns.google/resolve?name=drcenik.at&type=NS');
    const data = await res.json();
    return (data.Answer || []).map((a) => a.data.replace(/\.$/, '').toLowerCase());
  } catch {
    return [];
  }
}

function nsViaLookup() {
  try {
    const out = execSync(`nslookup -type=NS ${DOMAIN}`, { encoding: 'utf8', timeout: 15000 });
    return [...out.matchAll(/nameserver\s*=\s*(\S+)/gi)].map((m) => m[1].toLowerCase());
  } catch {
    return [];
  }
}

const ns = nsViaLookup();
const nsGoogle = await nsViaGoogleDns();
const onCf =
  (ns.length > 0 && ns.every((n) => n.includes('cloudflare.com'))) ||
  (nsGoogle.length > 0 && nsGoogle.every((n) => n.includes('cloudflare.com')));

console.log('=== Cloudflare Status drcenik.at ===\n');
console.log('Nameserver (lokal):', ns.join(', ') || '(keine)');
if (nsGoogle.length) console.log('Nameserver (Google DoH):', nsGoogle.join(', '));
console.log('Cloudflare aktiv:', onCf ? 'JA' : 'NEIN (noch World4You o.ä.)');
console.log('Zone Cloudflare:', 'pending bis NS weltweit auf aarav/nancy zeigen');
if (!onCf) {
  console.log('\n→ World4You: NS setzen auf');
  CF_NS.forEach((n) => console.log('   ', n));
  console.log('\n→ Anleitung: infra/cloudflare/AKTIVIERUNG.md');
}

const audit = spawnSync('npm', ['run', 'audit-redirects'], {
  encoding: 'utf8',
  shell: true,
  cwd: root,
});
console.log('\n' + (audit.stdout || audit.stderr || ''));

process.exit(onCf ? 0 : 2);
