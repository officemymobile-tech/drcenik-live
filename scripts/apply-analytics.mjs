/**
 * Injects GA4 meta tag + analytics.js into all public HTML pages.
 * Config: config/analytics.json (copy from analytics.json.example)
 * Run: npm run apply-analytics
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(root, 'config', 'analytics.json');

function readConfig() {
  if (!fs.existsSync(configPath)) {
    console.log('Keine config/analytics.json – Kopie von analytics.json.example anlegen.');
    return { ga4MeasurementId: '', enabled: false };
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

function walkHtml(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const st = fs.statSync(abs);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      walkHtml(abs, out);
      continue;
    }
    if (!name.endsWith('.html')) continue;
    out.push(abs);
  }
  return out;
}

function isRedirectStub(html) {
  return html.includes('http-equiv="refresh"') && html.length < 800;
}

function relScriptSrc(file, scriptRel) {
  const depth = path.relative(root, path.dirname(file)).split(path.sep).filter(Boolean).length;
  return (depth ? '../'.repeat(depth) : '') + scriptRel;
}

function applyOne(file, measurementId) {
  let html = fs.readFileSync(file, 'utf8');
  if (isRedirectStub(html)) return false;

  const metaTag = `<meta name="drcenik-ga4" content="${measurementId}">`;
  const analyticsSrc = relScriptSrc(file, 'scripts/analytics.js');
  const analyticsTag = `<script src="${analyticsSrc}" defer></script>`;

  html = html.replace(/\s*<meta name="drcenik-ga4"[^>]*>\n?/g, '\n');
  html = html.replace(
    /\s*<script src="[^"]*scripts\/analytics\.js" defer><\/script>\n?/g,
    '\n'
  );

  if (!measurementId) {
    fs.writeFileSync(file, html);
    return false;
  }

  if (html.includes('google-site-verification')) {
    html = html.replace(
      /(<meta name="google-site-verification"[^>]*>)/,
      `$1\n  ${metaTag}`
    );
  } else if (html.includes('<head>')) {
    html = html.replace('<head>', `<head>\n  ${metaTag}`);
  }

  if (html.includes('scripts/site-i18n.js')) {
    html = html.replace(
      /(\s*<script src="[^"]*site-i18n\.js" defer><\/script>)/,
      `\n  ${analyticsTag}$1`
    );
  } else if (html.includes('scripts/main.js')) {
    html = html.replace(
      /(\s*<script src="[^"]*main\.js[^"]*" defer><\/script>)/,
      `\n  ${analyticsTag}$1`
    );
  }

  fs.writeFileSync(file, html);
  return true;
}

const cfg = readConfig();
const id = (cfg.ga4MeasurementId || '').trim();
const enabled = cfg.enabled !== false && id.startsWith('G-');

console.log('=== GA4 einbinden ===');
if (!enabled) {
  console.log('Deaktiviert oder keine Mess-ID in config/analytics.json');
  process.exit(0);
}

let count = 0;
for (const file of walkHtml(root)) {
  if (applyOne(file, id)) count++;
}
console.log(`GA4 ${id} in ${count} HTML-Dateien eingetragen.`);
