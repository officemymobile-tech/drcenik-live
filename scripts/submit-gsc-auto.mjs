/**
 * P1 Google Search Console – automatische Einreichung (API + Ping).
 *
 * Voraussetzung (einmalig):
 * 1. Google Cloud → Search Console API aktivieren
 * 2. OAuth-Client (Desktop) → config/gsc-oauth-client.json
 * 3. Einmal autorisieren: npm run gsc-auth
 * 4. Token landet in config/gsc-oauth-token.json (gitignored)
 *
 * Alternativ: Service-Account als Owner in GSC → config/gsc-service-account.json
 *
 * Run: npm run submit-gsc
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.drcenik.at/';
const SITEMAP = 'https://www.drcenik.at/sitemap.xml';
const INSPECT_URLS = [
  'https://www.drcenik.at/',
  'https://www.drcenik.at/kontakt.html',
  'https://www.drcenik.at/faszienschmerzen/',
  'https://www.drcenik.at/rueckenschmerzen-wien/',
  'https://www.drcenik.at/tr/',
  'https://www.drcenik.at/en/',
];

function loadJson(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

async function refreshAccessToken(client, refreshToken) {
  const body = new URLSearchParams({
    client_id: client.installed?.client_id || client.web?.client_id,
    client_secret: client.installed?.client_secret || client.web?.client_secret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`OAuth refresh failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function apiFetch(token, url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  return { status: res.status, ok: res.ok, json };
}

async function submitSitemap(token) {
  const siteEnc = encodeURIComponent(SITE);
  const feedEnc = encodeURIComponent(SITEMAP);
  const url = `https://www.googleapis.com/webmasters/v3/sites/${siteEnc}/sitemaps/${feedEnc}`;
  const { status, ok, json } = await apiFetch(token, url, { method: 'PUT' });
  console.log(ok ? '✅ Sitemap eingereicht' : `⚠️ Sitemap HTTP ${status}`, json.errors ? json : '');
  return ok;
}

async function inspectUrl(token, inspectionUrl) {
  const { ok, json } = await apiFetch(token, 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    body: JSON.stringify({
      inspectionUrl,
      siteUrl: SITE,
      languageCode: 'de-AT',
    }),
  });
  const state = json?.inspectionResult?.indexStatusResult?.coverageState || json?.error?.message || 'unbekannt';
  console.log(ok ? `✅ Inspect ${inspectionUrl}` : `❌ Inspect ${inspectionUrl}`, '→', state);
  return ok;
}

function pingSitemap() {
  return new Promise((resolve) => {
    const ping = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`;
    https.get(ping, (res) => {
      console.log(`Ping sitemap: HTTP ${res.statusCode}`);
      resolve(res.statusCode === 200);
    }).on('error', (e) => {
      console.log('Ping sitemap: übersprungen', e.message);
      resolve(false);
    });
  });
}

async function main() {
  console.log('=== GSC Auto-Submit ===\n');
  await pingSitemap();

  const client = loadJson('config/gsc-oauth-client.json');
  const tokenFile = loadJson('config/gsc-oauth-token.json');
  const sa = loadJson('config/gsc-service-account.json');

  let accessToken = process.env.GSC_ACCESS_TOKEN;

  if (!accessToken && tokenFile?.refresh_token && client) {
    accessToken = await refreshAccessToken(client, tokenFile.refresh_token);
    console.log('OAuth Access Token erneuert');
  }

  if (!accessToken && sa?.private_key) {
    console.log('Service-Account: npm install googleapis && erweitern für JWT (optional)');
  }

  if (!accessToken) {
    console.log(`
Kein API-Token – Browser-Automatisierung oder einmalig einrichten:
  1. Google Cloud Console → APIs: Search Console API
  2. OAuth Desktop Client → config/gsc-oauth-client.json
  3. npm run gsc-auth
  4. npm run submit-gsc

Manuell (falls eingeloggt): npm run gsc-checklist
Property: ${SITE}
Sitemap: ${SITEMAP}
`);
    process.exit(0);
  }

  await submitSitemap(accessToken);
  for (const u of INSPECT_URLS) {
    await inspectUrl(accessToken, u);
  }
  console.log('\nHinweis: „Indexierung beantragen“ ist in der API nur Inspect – UI-Button wurde per Browser ausgeführt.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
