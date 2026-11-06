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
function check(cond, message) {
  if (!cond) failures.push(message);
}

const home = await fetch(base + '/');
const homeHtml = await home.text();
check(home.status === 200, `home HTTP ${home.status}`);
check(/patient-assistant-boot\.js/.test(homeHtml), 'home missing patient-assistant-boot.js');
check(/ÖGK|SVS|BVAEB|KFA/.test(homeHtml), 'home missing kassen markers');
check(/physikalische-therapie-wien-11\//.test(homeHtml), 'home missing SEO page link');

const seo = await fetch(base + '/physikalische-therapie-wien-11/');
check(seo.status === 200, `seo page HTTP ${seo.status}`);

const assistantJs = await fetch(base + '/scripts/patient-assistant.js');
check(assistantJs.status === 200, `patient-assistant.js HTTP ${assistantJs.status}`);
const assistantBoot = await fetch(base + '/scripts/patient-assistant-boot.js');
check(assistantBoot.status === 200, `patient-assistant-boot.js HTTP ${assistantBoot.status}`);

const apiGet = await fetch(base + '/api/patient-assistant');
check(apiGet.status !== 404, 'API route missing (404) — Functions likely absent');
check([405, 403, 429].includes(apiGet.status), `unexpected GET status ${apiGet.status}`);

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
check(apiPost.status !== 405, 'CRITICAL: static-only artifact (POST 405)');
check(apiPost.status === 200, `API POST HTTP ${apiPost.status} body=${apiText.slice(0, 120)}`);
check(Boolean(apiJson?.message), 'API POST missing message');
check(/Therapiezeiten|07:00/.test(apiJson?.message || ''), 'API POST hours content missing');
check(apiJson?.phone?.href === 'tel:+4317692991', 'API phone href missing');

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
  if (!metaRes.ok) {
    failures.push(`CF API deployment lookup HTTP ${metaRes.status}`);
  } else if (cfMeta && Object.prototype.hasOwnProperty.call(cfMeta, 'uses_functions')) {
    check(cfMeta.uses_functions === true, `CF meta uses_functions=${cfMeta.uses_functions}`);
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
  failures,
};

console.log(JSON.stringify(report, null, 2));
if (failures.length) {
  console.error('FAIL: uploaded deployment artifact checks failed');
  for (const f of failures) console.error(' -', f);
  process.exit(1);
}
console.log('PASS: uploaded deployment artifact includes Functions + SEO + assistant assets');
process.exit(0);
