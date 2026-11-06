/**
 * Contract tests for POST /api/patient-assistant based on scripts/patient-assistant.js
 * and observed production envelopes. Uses the local Function handler (no network).
 *
 * Usage: node scripts/patient-assistant-contract.test.mjs
 */
import { handleRequest } from '../functions/api/patient-assistant.js';

const failures = [];

function assert(cond, msg) {
  if (!cond) failures.push(msg);
}

async function call(method, body, headers = {}) {
  const init = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://www.drcenik.at',
      Accept: 'application/json',
      ...headers,
    },
  };
  if (body !== undefined) {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  const req = new Request('https://www.drcenik.at/api/patient-assistant', init);
  const res = await handleRequest(req);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: res.status, headers: res.headers, json, text };
}

function assertEnvelope(json, label) {
  assert(json && typeof json === 'object', `${label}: JSON object`);
  assert(typeof json.message === 'string' && json.message.length > 0, `${label}: message`);
  assert(typeof json.type === 'string', `${label}: type`);
  assert(['de', 'tr', 'en'].includes(json.language), `${label}: language`);
  assert(Array.isArray(json.suggestedActions), `${label}: suggestedActions array`);
  assert(json.safetyState === 'normal' || json.safetyState === 'emergency', `${label}: safetyState`);
  assert(json.phone && json.phone.href === 'tel:+4317692991', `${label}: phone.href`);
  assert(json.phone.display === '01 / 769 29 91', `${label}: phone.display`);
  for (const a of json.suggestedActions || []) {
    assert(a && typeof a.id === 'string' && typeof a.label === 'string', `${label}: action shape`);
  }
  for (const link of json.links || []) {
    assert(link && typeof link.href === 'string', `${label}: link.href`);
    assert(/^\/[a-z0-9._/-]*$/i.test(link.href), `${label}: relative link only`);
  }
}

console.log('=== patient-assistant contract tests ===');

// Method guard
{
  const r = await call('GET');
  assert(r.status === 405, 'GET => 405');
}

// Invalid JSON
{
  const r = await call('POST', '{not-json');
  assert(r.status === 400 && r.json?.error === 'invalid_json', 'invalid JSON => 400');
}

// Empty body
{
  const r = await call('POST', '   ');
  assert(r.status === 400, 'empty body => 400');
}

// Oversized body
{
  const big = JSON.stringify({ action: 'chat', language: 'de', message: 'x'.repeat(30_000) });
  const r = await call('POST', big);
  assert(r.status === 413, 'oversized => 413');
}

// Frontend chat body (hours intent via probe-style message)
{
  const r = await call('POST', {
    action: 'chat',
    language: 'de',
    message: 'Oeffnungszeiten?',
    history: [],
    preferStructured: false,
  });
  assert(r.status === 200, 'chat hours status 200');
  assertEnvelope(r.json, 'chat hours');
  assert(/Therapiezeiten|07:00/.test(r.json.message), 'chat hours content');
}

// Structured actions DE
for (const action of [
  'hours',
  'appointment',
  'prescription',
  'insurance',
  'treatments',
  'bring',
  'cancel',
  'contact',
]) {
  const r = await call('POST', {
    action,
    language: 'de',
    message: action,
    history: [],
    preferStructured: true,
  });
  assert(r.status === 200, `${action} status`);
  assertEnvelope(r.json, action);
  if (action === 'appointment' || action === 'prescription') {
    assert(r.json.type === 'workflow', `${action} type workflow`);
    assert(r.json.workflow && r.json.workflow.id === action, `${action} workflow.id`);
    assert(
      (r.json.suggestedActions || []).some((a) => a.id === 'sendRequest'),
      `${action} sendRequest`,
    );
  }
  if (action === 'hours') {
    assert(/Therapiezeiten/.test(r.json.message) && /Ordinationszeiten/.test(r.json.message), 'hours DE text');
  }
  if (action === 'cancel') {
    assert(/24 Stunden/.test(r.json.message) && /45 €/.test(r.json.message), 'cancel fee text');
  }
  if (action === 'insurance' || action === 'treatments') {
    assert((r.json.links || []).some((l) => l.href === '/therapieangebot.html'), `${action} link`);
  }
  assert((r.json.suggestedActions || []).some((a) => a.id === 'call' && a.href === 'tel:+4317692991'), `${action} call`);
}

// Languages TR / EN hours
for (const language of ['tr', 'en']) {
  const r = await call('POST', {
    action: 'hours',
    language,
    message: 'hours',
    history: [],
    preferStructured: true,
  });
  assert(r.status === 200 && r.json.language === language, `hours ${language}`);
  assertEnvelope(r.json, `hours ${language}`);
  assert(/07:00/.test(r.json.message), `hours ${language} times`);
}

// Appointment request never books
{
  const r = await call('POST', {
    action: 'appointment_request',
    language: 'de',
    firstName: 'Synthetic',
    lastName: 'Test',
    phone: '+430000000',
    email: '',
    patientStatus: 'new',
    insurer: 'oegk',
    reason: 'synthetic contract test',
    hasPrescription: false,
    prescribedService: '',
    units: '',
    preferredPeriod: '',
    preferredWeekday: '',
    preferredTimeOfDay: 'either',
  });
  assert(r.status === 200, 'appointment_request status');
  assert(r.json.type === 'unavailable', 'appointment_request unavailable');
  assertEnvelope(r.json, 'appointment_request');
  assert(!(r.json.message || '').toLowerCase().includes('synthetic'), 'no echo of reason PII');
  assert(!(r.json.message || '').includes('Test'), 'no echo of name');
}

// Emergency lock path
{
  const r = await call('POST', {
    action: 'chat',
    language: 'de',
    message: 'Brustschmerz und Atemnot Notfall',
    history: [],
    preferStructured: false,
  });
  assert(r.status === 200, 'emergency status');
  assert(r.json.type === 'emergency' && r.json.safetyState === 'emergency', 'emergency flags');
  assert(/144/.test(r.json.message) && /112/.test(r.json.message), 'emergency numbers');
}

// Probe compatibility body (message + lang, no action)
{
  const r = await call('POST', { message: 'Oeffnungszeiten?', lang: 'de' });
  assert(r.status === 200, 'probe body status');
  assertEnvelope(r.json, 'probe body');
  assert(/Therapiezeiten|07:00/.test(r.json.message), 'probe hours intent');
}

// Security headers
{
  const r = await call('POST', { action: 'contact', language: 'de', message: 'contact', history: [] });
  assert(r.headers.get('Cache-Control') === 'no-store', 'Cache-Control');
  assert(r.headers.get('X-Content-Type-Options') === 'nosniff', 'nosniff');
  assert((r.headers.get('Content-Type') || '').includes('application/json'), 'content-type');
}

// Disallowed origin
{
  const r = await call(
    'POST',
    { action: 'hours', language: 'de', message: 'hours', history: [] },
    { Origin: 'https://evil.example' },
  );
  assert(r.status === 403, 'evil origin => 403');
}

if (failures.length) {
  console.error('FAIL');
  for (const f of failures) console.error(' -', f);
  process.exit(1);
}

console.log('PASS: all contract assertions succeeded.');
process.exit(0);
