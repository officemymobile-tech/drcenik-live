/**
 * Probe POST /api/patient-assistant on a given base URL.
 * Success requires HTTP 200 + JSON assistant envelope — not mere HTML 200.
 *
 * Usage:
 *   node scripts/probe-patient-assistant-api.mjs https://www.drcenik.at
 *   node scripts/probe-patient-assistant-api.mjs https://seo-preview-….pages.dev
 */
const base = (process.argv[2] || 'https://www.drcenik.at').replace(/\/$/, '');
const origin = process.argv[3] || base;

const body = JSON.stringify({ message: 'Oeffnungszeiten?', lang: 'de' });
const res = await fetch(`${base}/api/patient-assistant`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Origin: origin,
    Referer: `${origin}/`,
    Accept: 'application/json',
  },
  body,
});

const text = await res.text();
let json = null;
try {
  json = JSON.parse(text);
} catch {
  json = null;
}

const actions = Array.isArray(json?.suggestedActions) ? json.suggestedActions : [];
const hasCall = actions.some((a) => a?.id === 'call' || /^tel:/i.test(a?.href || ''));
const hasAppointment = actions.some((a) => a?.id === 'appointment' || /termin/i.test(a?.label || ''));
const hasHoursHint =
  /Therapiezeiten|Ordinationszeiten|07:00|Öffnungszeiten|Oeffnungszeiten/i.test(json?.message || '') ||
  actions.some((a) => a?.id === 'hours');

const report = {
  base,
  status: res.status,
  contentType: res.headers.get('content-type'),
  type: json?.type || null,
  hasMessage: typeof json?.message === 'string' && json.message.length > 0,
  hasCall,
  hasAppointment,
  hasHoursHint,
  actionIds: actions.map((a) => a?.id).filter(Boolean),
};

console.log(JSON.stringify(report, null, 2));

const ok =
  res.status === 200 &&
  json &&
  typeof json.message === 'string' &&
  json.message.length > 0 &&
  (json.type === 'assistant_message' || json.type === 'workflow' || typeof json.type === 'string');

if (!ok) {
  console.error('FAIL: patient-assistant API probe did not return a usable 200 JSON response.');
  process.exit(1);
}

console.log('PASS: patient-assistant API responded with HTTP 200 and assistant envelope.');
process.exit(0);
