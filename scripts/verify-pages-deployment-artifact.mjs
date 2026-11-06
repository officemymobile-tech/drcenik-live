/**
 * Verify a Cloudflare Pages *uploaded* deployment (not only local source).
 *
 * Usage:
 *   node scripts/verify-pages-deployment-artifact.mjs <deployment-url> [deployment-id]
 */
const base = (process.argv[2] || '').replace(/\/$/, '');
const deploymentId = process.argv[3] || '';
if (!base) {
  console.error('Usage: node scripts/verify-pages-deployment-artifact.mjs <deployment-url> [deployment-id]');
  process.exit(2);
}

const failures = [];
function fail(m) {
  failures.push(m);
}

const home = await fetch(base + '/');
fail(home.status !== 200 && `home HTTP ${home.status}`);
const homeHtml = await home.text();
if (!/patient-assistant-boot\.js/.test(homeHtml)) fail('home missing patient-assistant-boot.js');
if (!/ÖGK|SVS|BVAEB|KFA/.test(homeHtml)) fail('home missing kassen markers');
if (!/physikalische-therapie-wien-11\//.test(homeHtml)) fail('home missing SEO page link');

const seo = await fetch(base + '/physikalische-therapie-wien-11/');
fail(seo.status !== 200 && `seo page HTTP ${seo.status}`);

const assistantJs = await fetch(base + '/scripts/patient-assistant.js');
fail(assistantJs.status !== 200 && `patient-assistant.js HTTP ${assistantJs.status}`);
const assistantBoot = await fetch(base + '/scripts/patient-assistant-boot.js');
fail(assistantBoot.status !== 200 && `patient-assistant-boot.js HTTP ${assistantBoot.status}`);

const apiGet = await fetch(base + '/api/patient-assistant');
fail(apiGet.status === 404 && 'API route missing (404) — Functions likely absent');
fail(apiGet.status !== 405 && apiGet.status !== 403 && apiGet.status !== 429 && `unexpected GET status ${apiGet.status}`);

const apiPost = await fetch(base + '/api/patient-assistant', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Origin: base,
    Accept: 'application/json',
  },
  body: JSON.stringify({
    action: 'hours',
    language: 'de',
    message: 'hours',
    history: [],
    preferStructured: true,
  }),
});
const apiText = await apiPost.text();
let apiJson = null;
try {
  apiJson = JSON.parse(apiText);
} catch {
  apiJson = null;
}
if (apiPost.status !== 200) fail(`API POST HTTP ${apiPost.status} body=${apiText.slice(0, 120)}`);
if (!apiJson?.message) fail('API POST missing message');
if (!/Therapiezeiten|07:00/.test(apiJson?.message || '')) fail('API POST hours content missing');
if (apiJson?.phone?.href !== 'tel:+4317692991') fail('API phone href missing');

// Static-only regression signature
if (apiPost.status === 405) fail('CRITICAL: static-only artifact (POST 405)');

let cfMeta = null;
const token = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '32d1986a33941214ed1e8890189180a4';
if (token && deploymentId) {
  const metaRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/drcenik-live/deployments/${deploymentId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const metaJson = await metaRes.json();
  cfMeta = metaJson?.result || null;
  if (!metaRes.ok) fail(`CF API deployment lookup HTTP ${metaRes.status}`);
  else {
    if (cfMeta?.uses_functions !== true && cfMeta?.env_vars?.CF_PAGES == null) {
      // uses_functions is the authoritative field when present
    }
    if (cfMeta && Object.prototype.hasOwnProperty.call(cfMeta, 'uses_functions') && cfMeta.uses_functions !== true) {
      fail(`CF meta uses_functions=${cfMeta.uses_functions}`);
    }
    if (cfMeta?.environment && !/preview|production/i.test(cfMeta.environment)) {
      fail(`unexpected environment ${cfMeta.environment}`);
    }
  }
}

const report = {
  base,
  deploymentId: deploymentId || null,
  home: home.status,
  seo: seo.status,
  assistantJs: assistantJs.status,
  assistantBoot: assistantBoot.status,
  apiGet: apiGet.status,
  apiPost: apiPost.status,
  apiType: apiJson?.type || null,
  functionsLive: apiPost.status === 200 && Boolean(apiJson?.message),
  cfUsesFunctions: cfMeta?.uses_functions ?? null,
  cfEnvironment: cfMeta?.environment ?? null,
  cfCommitHash: cfMeta?.deployment_trigger?.metadata?.commit_hash ?? cfMeta?.production_branch ?? null,
  failures,
};

console.log(JSON.stringify(report, null, 2));
if (failures.length) {
  console.error('FAIL: uploaded deployment artifact checks failed');
  process.exit(1);
}
console.log('PASS: uploaded deployment artifact includes Functions + SEO + assistant assets');
process.exit(0);
