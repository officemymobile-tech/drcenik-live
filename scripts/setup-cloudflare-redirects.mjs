/**
 * Legt Cloudflare Redirect Rules per API an (optional).
 * Env: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID
 * Docs: infra/cloudflare/README.md
 */

const token = process.env.CLOUDFLARE_API_TOKEN;
const zoneId = process.env.CLOUDFLARE_ZONE_ID;

if (!token || !zoneId) {
  console.log('Cloudflare API Setup (optional)\n');
  console.log('1. Zone drcenik.at in Cloudflare importieren');
  console.log('2. Token: Cloudflare Dashboard → My Profile → API Tokens');
  console.log('   Berechtigung: Zone → Redirect Rules → Edit');
  console.log('3. Zone ID: Overview → rechts unter „API“\n');
  console.log('Dann:');
  console.log('  set CLOUDFLARE_API_TOKEN=...');
  console.log('  set CLOUDFLARE_ZONE_ID=...');
  console.log('  node scripts/setup-cloudflare-redirects.mjs\n');
  console.log('Oder manuell: infra/cloudflare/bulk-redirects.csv importieren');
  process.exit(0);
}

const rules = [
  {
    description: 'drcenik apex → www HTTPS',
    expression: '(http.host eq "drcenik.at")',
    action_parameters: {
      from_value: {
        status_code: 301,
        target_url: {
          expression: 'concat("https://www.drcenik.at", http.request.uri.path)',
        },
        preserve_query_string: true,
      },
    },
  },
  {
    description: 'index.html → /',
    expression: '(http.request.uri.path eq "/index.html")',
    action_parameters: {
      from_value: {
        status_code: 301,
        target_url: { value: 'https://www.drcenik.at/' },
        preserve_query_string: true,
      },
    },
  },
  {
    description: 'legacy geschenkgutschein',
    expression: '(http.request.uri.path eq "/267059-geschenkgutschein-vorlage.html")',
    action_parameters: {
      from_value: {
        status_code: 301,
        target_url: { value: 'https://www.drcenik.at/geschenkgutschein.html' },
        preserve_query_string: true,
      },
    },
  },
  {
    description: 'trailing slash after .html',
    expression: '(http.request.uri.path matches "^/.+\\\\.html/$")',
    action_parameters: {
      from_value: {
        status_code: 301,
        target_url: {
          expression: 'concat("https://www.drcenik.at", regex_replace(http.request.uri.path, "/$", ""))',
        },
        preserve_query_string: true,
      },
    },
  },
];

const res = await fetch(
  `https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets/phases/http_request_dynamic_redirect/entrypoint`,
  {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rules: rules.map((r, i) => ({
        action: 'redirect',
        expression: r.expression,
        description: r.description,
        enabled: true,
        action_parameters: r.action_parameters,
      })),
    }),
  },
);

const data = await res.json();
if (!data.success) {
  console.error('Cloudflare API Fehler:', JSON.stringify(data.errors, null, 2));
  process.exit(1);
}

console.log('✅ Redirect Rules gesetzt. Prüfen mit: npm run audit-redirects');
