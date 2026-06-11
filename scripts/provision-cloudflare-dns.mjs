/**
 * Setzt DNS für drcenik.at in Cloudflare (GitHub Pages + E-Mail unverändert).
 * Auth: wrangler login (OAuth) oder CLOUDFLARE_API_TOKEN
 */
import { execSync } from 'child_process';

const ZONE_NAME = 'drcenik.at';
const GITHUB = 'officemymobile-tech.github.io';
const GITHUB_APEX_IPS = [
  '185.199.108.153',
  '185.199.109.153',
  '185.199.110.153',
  '185.199.111.153',
];

function token() {
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN;
  const raw = execSync('npx wrangler auth token', { encoding: 'utf8' });
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const candidate = lines.find((l) => /^[\x20-\x7E]+$/.test(l) && l.length >= 40);
  if (!candidate) throw new Error('Kein Cloudflare-Token von wrangler auth token');
  return candidate;
}

async function cf(path, opts = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token()}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  const data = await res.json();
  if (!data.success) {
    const msg = JSON.stringify(data.errors || data);
    if (msg.includes('Authentication error')) {
      throw new Error(
        `${msg}\n\nWrangler-OAuth reicht nicht für DNS-API. API-Token erstellen:\n` +
          '  Cloudflare → My Profile → API Tokens → Edit zone DNS\n' +
          '  dann: $env:CLOUDFLARE_API_TOKEN="..." ; npm run provision-cloudflare-dns\n' +
          '  Siehe infra/cloudflare/AKTIVIERUNG.md',
      );
    }
    throw new Error(msg);
  }
  return data.result;
}

const zones = await cf(`/zones?name=${ZONE_NAME}`);
const zone = zones[0];
if (!zone) throw new Error(`Zone ${ZONE_NAME} nicht gefunden`);

console.log('Zone:', zone.id, zone.status);

const records = await cf(`/zones/${zone.id}/dns_records?per_page=100`);

async function upsert(type, name, content, proxied) {
  const fullName = name === '@' ? ZONE_NAME : `${name}.${ZONE_NAME}`;
  const existing = records.find(
    (r) => r.type === type && r.name === fullName && r.content === content,
  );
  const body = { type, name: fullName, content, proxied, ttl: 1 };

  if (existing) {
    if (existing.proxied === proxied) {
      console.log('OK', type, fullName, content.slice(0, 40));
      return;
    }
    await cf(`/zones/${zone.id}/dns_records/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    console.log('UPD', type, fullName, proxied ? 'proxied' : 'DNS only');
    return;
  }

  await cf(`/zones/${zone.id}/dns_records`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  console.log('ADD', type, fullName);
}

// Apex: World4You-IP entfernen, GitHub-IPs setzen
for (const r of records.filter((x) => x.type === 'A' && x.name === ZONE_NAME)) {
  if (!GITHUB_APEX_IPS.includes(r.content)) {
    await cf(`/zones/${zone.id}/dns_records/${r.id}`, { method: 'DELETE' });
    console.log('DEL A', ZONE_NAME, r.content);
  }
}
for (const ip of GITHUB_APEX_IPS) {
  await upsert('A', '@', ip, true);
}

await upsert('CNAME', 'www', GITHUB, true);

// E-Mail: nicht proxien
for (const r of records.filter((x) => x.name.includes('mail.') || x.name.startsWith('imap.'))) {
  if (r.proxied) {
    await cf(`/zones/${zone.id}/dns_records/${r.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ proxied: false }),
    });
    console.log('UPD mail/imap DNS only:', r.name);
  }
}

// SSL: Always Use HTTPS
await cf(`/zones/${zone.id}/settings/always_use_https`, {
  method: 'PATCH',
  body: JSON.stringify({ value: 'on' }),
});
console.log('OK Always Use HTTPS');

console.log('\nNameserver bei World4You setzen (Cloudflare Overview):');
console.log('  aarav.ns.cloudflare.com');
console.log('  nancy.ns.cloudflare.com');
