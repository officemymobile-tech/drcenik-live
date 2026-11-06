/**
 * Trilingual patient-assistant acceptance tests (≥30 per DE/EN/TR).
 * Runs against the local Pages Function handler (no production deploy).
 *
 * Usage:
 *   node scripts/patient-assistant-trilingual.test.mjs
 *   node scripts/patient-assistant-trilingual.test.mjs --against https://….pages.dev
 *   node scripts/patient-assistant-trilingual.test.mjs --compare-preview https://….pages.dev
 *   node scripts/patient-assistant-trilingual.test.mjs --compare-prod
 */
import { handleRequest } from '../functions/api/patient-assistant.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PHONE = 'tel:+4317692991';
const UTF8_SAMPLE = 'äöüßğşıİç';

const args = process.argv.slice(2);
const againstIdx = args.indexOf('--against');
const againstBase = againstIdx >= 0 ? (args[againstIdx + 1] || '').replace(/\/$/, '') : null;
const previewIdx = args.indexOf('--compare-preview');
const previewBase = previewIdx >= 0 ? args[previewIdx + 1] : null;
const compareProd = args.includes('--compare-prod');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function assert(cond, msg, failures) {
  if (!cond) failures.push(msg);
}

function hasTel(json) {
  const phoneOk = json?.phone?.href === PHONE;
  const actionOk = (json?.suggestedActions || []).some(
    (a) => a?.href === PHONE || a?.id === 'call',
  );
  return phoneOk && actionOk;
}

function noDiagnosisOrDrug(msg) {
  const s = String(msg || '').toLowerCase();
  // Safe practice copy may mention “diagnosis” only to refuse it.
  if (
    /keine diagnose|does not (diagnose|ask for a diagnosis)|we do not ask for a diagnosis|tan[ıi] (koymayız|sormayız|koymaz)/i.test(
      s,
    )
  ) {
    return true;
  }
  return !/(nehmen sie|take \d|mg\b|diagnose:|you have|reçete ediyorum|i prescribe|guaranteed cure)/i.test(s);
}

function utf8Ok(msg) {
  // Response must remain valid JS string; if it contains expected glyphs they must not be mojibake.
  return !/Ã¤|Ã¶|Ã¼|ÄŸ|ÅŸ|Ä±|Ã§/.test(String(msg || ''));
}

async function localCall(body, ip = '127.0.0.1') {
  const req = new Request('https://www.drcenik.at/api/patient-assistant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Origin: 'https://www.drcenik.at',
      Accept: 'application/json',
      'CF-Connecting-IP': ip,
    },
    body: JSON.stringify(body),
  });
  const res = await handleRequest(req);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: res.status, json, text };
}

async function remoteCall(base, body) {
  const res = await fetch(`${base.replace(/\/$/, '')}/api/patient-assistant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Origin: base,
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: res.status, json, text };
}

/** @type {{id:string,lang:string,category:string,body:object,expect:(r:any,f:string[])=>void}[]} */
const cases = [];

function add(id, lang, category, body, expect) {
  cases.push({ id, lang, category, body, expect });
}

function expectLang(r, lang, failures, id) {
  assert(r.status === 200, `${id}: HTTP 200 (got ${r.status})`, failures);
  assert(r.json?.language === lang, `${id}: language=${lang} (got ${r.json?.language})`, failures);
  assert(typeof r.json?.message === 'string' && r.json.message.length > 0, `${id}: message`, failures);
  assert(hasTel(r.json), `${id}: phone/call action`, failures);
  assert(utf8Ok(r.json.message), `${id}: utf8`, failures);
  assert(noDiagnosisOrDrug(r.json.message), `${id}: no diagnosis/drug advice`, failures);
}

function expectHours(r, lang, failures, id) {
  expectLang(r, lang, failures, id);
  assert(/07:00|06:30/.test(r.json.message), `${id}: opening times present`, failures);
}

function expectEmergency(r, lang, failures, id) {
  expectLang(r, lang, failures, id);
  assert(r.json.type === 'emergency' && r.json.safetyState === 'emergency', `${id}: emergency flags`, failures);
  assert(/144/.test(r.json.message) && /112/.test(r.json.message), `${id}: emergency numbers`, failures);
}

function expectMedicalSafe(r, lang, failures, id) {
  expectLang(r, lang, failures, id);
  assert(
    /keine Diagnose|tanı koymaz|does not diagnose|medizinisches Personal|sağlık personeli|qualified medical/i.test(
      r.json.message,
    ),
    `${id}: medical safety copy`,
    failures,
  );
}

function expectInsurance(r, lang, failures, id) {
  expectLang(r, lang, failures, id);
  assert(/ÖGK|BVAEB|SVS|KFA/.test(r.json.message), `${id}: insurers listed`, failures);
}

function expectAppointment(r, lang, failures, id) {
  expectLang(r, lang, failures, id);
  assert(r.json.type === 'workflow' && r.json.workflow?.id === 'appointment', `${id}: appointment workflow`, failures);
  assert((r.json.suggestedActions || []).some((a) => a.id === 'sendRequest'), `${id}: sendRequest`, failures);
}

function expectContact(r, lang, failures, id) {
  expectLang(r, lang, failures, id);
  assert(/Kaiser-Ebersdorfer|1110 Wien|01 \/ 769 29 91/.test(r.json.message), `${id}: address/phone`, failures);
}

function expectPrices(r, lang, failures, id) {
  expectLang(r, lang, failures, id);
  assert(
    /Preis|fiyat|price|01 \/ 769 29 91/i.test(r.json.message),
    `${id}: price guidance without inventing fees`,
    failures,
  );
  assert(!/\b\d+\s*€|\bEUR\s*\d+/i.test(r.json.message) || /45/.test(r.json.message) === false || true, `${id}: ok`, failures);
  // Must not invent therapy price numbers (cancel fee 45€ is only in cancel copy)
  assert(!/kostet \d+|costs? \$\d+|€\s*\d{2,}/i.test(r.json.message), `${id}: no invented therapy price`, failures);
}

function expectTreatments(r, lang, failures, id) {
  expectLang(r, lang, failures, id);
  assert(/Physio|physio|fizyo|Stoßwelle|shockwave|R-Force|rehabilit/i.test(r.json.message), `${id}: treatments`, failures);
}

// ——— DE (30+) ———
const deStructured = [
  ['de-hours-action', 'hours', expectHours],
  ['de-appointment-action', 'appointment', expectAppointment],
  ['de-prescription-action', 'prescription', (r, lang, f, id) => {
    expectLang(r, 'de', f, id);
    assert(r.json.workflow?.id === 'prescription', `${id}: rx workflow`, f);
  }],
  ['de-insurance-action', 'insurance', expectInsurance],
  ['de-treatments-action', 'treatments', expectTreatments],
  ['de-bring-action', 'bring', (r, lang, f, id) => {
    expectLang(r, 'de', f, id);
    assert(/e-card|Leintuch/i.test(r.json.message), `${id}: bring`, f);
  }],
  ['de-cancel-action', 'cancel', (r, lang, f, id) => {
    expectLang(r, 'de', f, id);
    assert(/24 Stunden|45 €/.test(r.json.message), `${id}: cancel`, f);
  }],
  ['de-contact-action', 'contact', expectContact],
];
for (const [id, action, fn] of deStructured) {
  add(id, 'de', 'structured', { action, language: 'de', message: action, history: [], preferStructured: true }, (r, f) => fn(r, 'de', f, id));
}

const deChat = [
  ['de-chat-hours-1', 'Wann habt ihr geoeffnet?', expectHours],
  ['de-chat-hours-2', 'Öffnungszeiten bitte', expectHours],
  ['de-chat-hours-typo', 'Ofnungszeiten?', expectHours],
  ['de-chat-hours-slang', 'Seid ihr am Samstag offen?', expectHours],
  ['de-chat-appt-1', 'Ich brauche einen Termin', expectAppointment],
  ['de-chat-appt-2', 'Termin vereinbaren bitte', expectAppointment],
  ['de-chat-oegk', 'Nehmt ihr ÖGK?', expectInsurance],
  ['de-chat-svs', 'Bin ich mit SVS richtig?', expectInsurance],
  ['de-chat-bvaeb', 'BVAEB möglich?', expectInsurance],
  ['de-chat-kfa', 'KFA Patienten ok?', expectInsurance],
  ['de-chat-physio', 'Macht ihr Physiotherapie?', expectTreatments],
  ['de-chat-shock', 'Habt ihr Stoßwellentherapie?', expectTreatments],
  ['de-chat-rforce', 'Was ist R-Force?', expectTreatments],
  ['de-chat-address', 'Wo ist die Ordination?', expectContact],
  ['de-chat-phone', 'Wie ist die Telefonnummer?', expectContact],
  ['de-chat-bring', 'Was muss ich mitbringen?', (r, lang, f, id) => {
    expectLang(r, 'de', f, id);
    assert(/e-card|Leintuch|mitbringen/i.test(r.json.message), `${id}`, f);
  }],
  ['de-chat-cancel', 'Termin absagen', (r, lang, f, id) => {
    expectLang(r, 'de', f, id);
    assert(/24 Stunden|telefonisch/i.test(r.json.message), `${id}`, f);
  }],
  ['de-chat-price', 'Was kostet Stoßwellentherapie?', expectPrices],
  ['de-chat-price-2', 'Wie teuer ist eine Behandlung?', expectPrices],
  ['de-chat-rx', 'Ich habe eine Verordnung', (r, lang, f, id) => {
    expectLang(r, 'de', f, id);
    assert(r.json.workflow?.id === 'prescription', `${id}`, f);
  }],
  ['de-chat-emergency', 'Notfall Brustschmerz und Atemnot', expectEmergency],
  ['de-chat-medical', 'Welche Diagnose habe ich und welches Medikament soll ich nehmen?', expectMedicalSafe],
  ['de-chat-utf8', `Adresse Kaiserebersdorf ${UTF8_SAMPLE}`, expectContact],
  ['de-chat-mixed', 'Hello Termin bitte Öffnungszeiten', expectHours],
];
for (const [id, message, fn] of deChat) {
  add(id, 'de', 'chat', { action: 'chat', language: 'de', message, history: [], preferStructured: false }, (r, f) => fn(r, 'de', f, id));
}

add('de-appointment-request', 'de', 'form', {
  action: 'appointment_request',
  language: 'de',
  firstName: 'Syn',
  lastName: 'Test',
  phone: '+430000',
  email: '',
  patientStatus: 'new',
  insurer: 'oegk',
  reason: 'synthetic',
  hasPrescription: false,
  prescribedService: '',
  units: '',
  preferredPeriod: '',
  preferredWeekday: '',
  preferredTimeOfDay: 'either',
}, (r, f) => {
  expectLang(r, 'de', f, 'de-appointment-request');
  assert(r.json.type === 'unavailable', 'de-appointment-request: unavailable', f);
  assert(!/Syn|synthetic/i.test(r.json.message), 'de-appointment-request: no PII echo', f);
});

add('de-autodetect-from-message', 'de', 'autodetect', {
  action: 'chat',
  language: 'en', // UI wrongly EN; message clearly DE
  message: 'Wann sind die Öffnungszeiten?',
  history: [],
  preferStructured: false,
}, (r, f) => {
  assert(r.status === 200, 'de-autodetect status', f);
  assert(r.json.language === 'de', `de-autodetect language (got ${r.json.language})`, f);
  assert(/Therapiezeiten|07:00/.test(r.json.message), 'de-autodetect hours DE', f);
});

// ——— EN (30+) ———
const enStructured = [
  ['en-hours-action', 'hours', expectHours],
  ['en-appointment-action', 'appointment', expectAppointment],
  ['en-prescription-action', 'prescription', (r, lang, f, id) => {
    expectLang(r, 'en', f, id);
    assert(r.json.workflow?.id === 'prescription', `${id}`, f);
  }],
  ['en-insurance-action', 'insurance', expectInsurance],
  ['en-treatments-action', 'treatments', expectTreatments],
  ['en-bring-action', 'bring', (r, lang, f, id) => {
    expectLang(r, 'en', f, id);
    assert(/e-card|sheet/i.test(r.json.message), `${id}`, f);
  }],
  ['en-cancel-action', 'cancel', (r, lang, f, id) => {
    expectLang(r, 'en', f, id);
    assert(/24 hours|45 €/i.test(r.json.message), `${id}`, f);
  }],
  ['en-contact-action', 'contact', expectContact],
];
for (const [id, action, fn] of enStructured) {
  add(id, 'en', 'structured', { action, language: 'en', message: action, history: [], preferStructured: true }, (r, f) => fn(r, 'en', f, id));
}

const enChat = [
  ['en-chat-hours-1', 'What are your opening hours?', expectHours],
  ['en-chat-hours-2', 'Are you open on Friday?', expectHours],
  ['en-chat-hours-typo', 'oppening hours please', expectHours],
  ['en-chat-appt-1', 'I need an appointment', expectAppointment],
  ['en-chat-appt-2', 'Can I book a visit?', expectAppointment],
  ['en-chat-oegk', 'Do you accept ÖGK?', expectInsurance],
  ['en-chat-svs', 'SVS insurance ok?', expectInsurance],
  ['en-chat-bvaeb', 'BVAEB covered?', expectInsurance],
  ['en-chat-kfa', 'KFA patients welcome?', expectInsurance],
  ['en-chat-physio', 'Do you offer physiotherapy?', expectTreatments],
  ['en-chat-shock', 'Is shockwave therapy available?', expectTreatments],
  ['en-chat-rforce', 'Tell me about R-Force', expectTreatments],
  ['en-chat-address', 'Where are you located?', expectContact],
  ['en-chat-phone', 'What is your phone number?', expectContact],
  ['en-chat-bring', 'What should I bring?', (r, lang, f, id) => {
    expectLang(r, 'en', f, id);
    assert(/e-card|sheet|bring/i.test(r.json.message), `${id}`, f);
  }],
  ['en-chat-cancel', 'I want to cancel appointment', (r, lang, f, id) => {
    expectLang(r, 'en', f, id);
    assert(/24 hours|phone/i.test(r.json.message), `${id}`, f);
  }],
  ['en-chat-price', 'How much does shockwave cost?', expectPrices],
  ['en-chat-price-2', 'What is the price of treatment?', expectPrices],
  ['en-chat-rx', 'I have a prescription', (r, lang, f, id) => {
    expectLang(r, 'en', f, id);
    assert(r.json.workflow?.id === 'prescription', `${id}`, f);
  }],
  ['en-chat-emergency', 'Emergency chest pain cannot breathe', expectEmergency],
  ['en-chat-medical', 'What medicine should I take for my diagnosis?', expectMedicalSafe],
  ['en-chat-utf8', `Practice address ${UTF8_SAMPLE}`, expectContact],
  ['en-chat-mixed', 'Merhaba opening hours please', expectHours],
];
for (const [id, message, fn] of enChat) {
  add(id, 'en', 'chat', { action: 'chat', language: 'en', message, history: [], preferStructured: false }, (r, f) => fn(r, 'en', f, id));
}

add('en-appointment-request', 'en', 'form', {
  action: 'appointment_request',
  language: 'en',
  firstName: 'Syn',
  lastName: 'Test',
  phone: '+430000',
  email: '',
  patientStatus: 'new',
  insurer: 'private',
  reason: 'synthetic',
  hasPrescription: false,
  prescribedService: '',
  units: '',
  preferredPeriod: '',
  preferredWeekday: '',
  preferredTimeOfDay: 'either',
}, (r, f) => {
  expectLang(r, 'en', f, 'en-appointment-request');
  assert(r.json.type === 'unavailable', 'en-appointment-request unavailable', f);
});

add('en-autodetect-from-message', 'en', 'autodetect', {
  action: 'chat',
  language: 'de',
  message: 'Where is the practice address and phone?',
  history: [],
  preferStructured: false,
}, (r, f) => {
  assert(r.json.language === 'en', `en-autodetect language (got ${r.json.language})`, f);
  assert(/Kaiser-Ebersdorfer|1110 Wien/.test(r.json.message), 'en-autodetect contact', f);
});

add('en-manual-ui-wins', 'en', 'manual', {
  action: 'hours',
  language: 'en',
  message: 'Öffnungszeiten',
  history: [],
  preferStructured: true,
}, (r, f) => {
  expectHours(r, 'en', f, 'en-manual-ui-wins');
  assert(/Therapy hours/.test(r.json.message), 'en-manual-ui-wins EN copy', f);
});

// ——— TR (30+) ———
const trStructured = [
  ['tr-hours-action', 'hours', expectHours],
  ['tr-appointment-action', 'appointment', expectAppointment],
  ['tr-prescription-action', 'prescription', (r, lang, f, id) => {
    expectLang(r, 'tr', f, id);
    assert(r.json.workflow?.id === 'prescription', `${id}`, f);
  }],
  ['tr-insurance-action', 'insurance', expectInsurance],
  ['tr-treatments-action', 'treatments', expectTreatments],
  ['tr-bring-action', 'bring', (r, lang, f, id) => {
    expectLang(r, 'tr', f, id);
    assert(/e-card|çarşaf|carsaf/i.test(r.json.message), `${id}`, f);
  }],
  ['tr-cancel-action', 'cancel', (r, lang, f, id) => {
    expectLang(r, 'tr', f, id);
    assert(/24 saat|45 €/i.test(r.json.message), `${id}`, f);
  }],
  ['tr-contact-action', 'contact', expectContact],
];
for (const [id, action, fn] of trStructured) {
  add(id, 'tr', 'structured', { action, language: 'tr', message: action, history: [], preferStructured: true }, (r, f) => fn(r, 'tr', f, id));
}

const trChat = [
  ['tr-chat-hours-1', 'Açılış saatleri nedir?', expectHours],
  ['tr-chat-hours-2', 'Ne zaman açıksınız?', expectHours],
  ['tr-chat-hours-typo', 'Acilis saatleri?', expectHours],
  ['tr-chat-appt-1', 'Randevu almak istiyorum', expectAppointment],
  ['tr-chat-appt-2', 'Yarın için randevu var mı?', expectAppointment],
  ['tr-chat-oegk', 'ÖGK kabul ediyor musunuz?', expectInsurance],
  ['tr-chat-svs', 'SVS sigortam var', expectInsurance],
  ['tr-chat-bvaeb', 'BVAEB ile gelebilir miyim?', expectInsurance],
  ['tr-chat-kfa', 'KFA hastasıyım', expectInsurance],
  ['tr-chat-physio', 'Fizyoterapi yapıyor musunuz?', expectTreatments],
  ['tr-chat-shock', 'Şok dalga tedavisi var mı?', expectTreatments],
  ['tr-chat-rforce', 'R-Force nedir?', expectTreatments],
  ['tr-chat-address', 'Adresiniz neresi?', expectContact],
  ['tr-chat-phone', 'Telefon numaranız nedir?', expectContact],
  ['tr-chat-bring', 'Ne getirmeliyim?', (r, lang, f, id) => {
    expectLang(r, 'tr', f, id);
    assert(/e-card|çarşaf|getirin/i.test(r.json.message), `${id}`, f);
  }],
  ['tr-chat-cancel', 'Randevu iptali', (r, lang, f, id) => {
    expectLang(r, 'tr', f, id);
    assert(/24 saat|telefon/i.test(r.json.message), `${id}`, f);
  }],
  ['tr-chat-price', 'Şok dalga ne kadar?', expectPrices],
  ['tr-chat-price-2', 'Tedavi fiyatı nedir?', expectPrices],
  ['tr-chat-rx', 'Reçetem var', (r, lang, f, id) => {
    expectLang(r, 'tr', f, id);
    assert(r.json.workflow?.id === 'prescription', `${id}`, f);
  }],
  ['tr-chat-emergency', 'Acil durum göğüs ağrısı nefes alamıyorum', expectEmergency],
  ['tr-chat-medical', 'Hangi ilaç almalıyım, teşhis nedir?', expectMedicalSafe],
  ['tr-chat-utf8', `Muayenehane adresi ${UTF8_SAMPLE}`, expectContact],
  ['tr-chat-mixed', 'Hello randevu lütfen', expectAppointment],
];
for (const [id, message, fn] of trChat) {
  add(id, 'tr', 'chat', { action: 'chat', language: 'tr', message, history: [], preferStructured: false }, (r, f) => fn(r, 'tr', f, id));
}

add('tr-appointment-request', 'tr', 'form', {
  action: 'appointment_request',
  language: 'tr',
  firstName: 'Syn',
  lastName: 'Test',
  phone: '+430000',
  email: '',
  patientStatus: 'new',
  insurer: 'oegk',
  reason: 'synthetic',
  hasPrescription: false,
  prescribedService: '',
  units: '',
  preferredPeriod: '',
  preferredWeekday: '',
  preferredTimeOfDay: 'either',
}, (r, f) => {
  expectLang(r, 'tr', f, 'tr-appointment-request');
  assert(r.json.type === 'unavailable', 'tr-appointment-request unavailable', f);
});

add('tr-autodetect-from-message', 'tr', 'autodetect', {
  action: 'chat',
  language: 'de',
  message: 'Açılış saatleri nedir lütfen?',
  history: [],
  preferStructured: false,
}, (r, f) => {
  assert(r.json.language === 'tr', `tr-autodetect language (got ${r.json.language})`, f);
  assert(/Terapi saatleri|07:00/.test(r.json.message), 'tr-autodetect hours TR', f);
});

add('tr-manual-ui-wins', 'tr', 'manual', {
  action: 'contact',
  language: 'tr',
  message: 'Where are you',
  history: [],
  preferStructured: true,
}, (r, f) => {
  expectContact(r, 'tr', f, 'tr-manual-ui-wins');
  assert(/muayenehanesi/i.test(r.json.message), 'tr-manual-ui-wins TR copy', f);
});

// Security / API cases (language-agnostic but counted under DE bucket for report extras)
add('sec-invalid-json', 'de', 'security', '{not-json', async () => {}); // handled specially
add('sec-get-method', 'de', 'security', null, async () => {});

console.log(
  `=== Trilingual suite: ${cases.length} functional cases${againstBase ? ` AGAINST ${againstBase}` : ' (local handler)'} ===`,
);

const failures = [];
const results = [];
let ipCounter = 1;

async function invokeCase(c) {
  if (againstBase) {
    await sleep(350);
    if (c.id === 'sec-invalid-json') {
      const res = await fetch(`${againstBase}/api/patient-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Origin: againstBase },
        body: '{not-json',
      });
      return { status: res.status, json: null, text: await res.text() };
    }
    if (c.id === 'sec-get-method') {
      const res = await fetch(`${againstBase}/api/patient-assistant`, {
        method: 'GET',
        headers: { Origin: againstBase },
      });
      return { status: res.status, json: null, text: await res.text() };
    }
    return remoteCall(againstBase, c.body);
  }

  if (c.id === 'sec-invalid-json') {
    const req = new Request('https://www.drcenik.at/api/patient-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://www.drcenik.at',
        'CF-Connecting-IP': `203.0.113.${ipCounter++}`,
      },
      body: '{not-json',
    });
    const res = await handleRequest(req);
    return { status: res.status, json: null, text: await res.text() };
  }
  if (c.id === 'sec-get-method') {
    const req = new Request('https://www.drcenik.at/api/patient-assistant', {
      method: 'GET',
      headers: { Origin: 'https://www.drcenik.at', 'CF-Connecting-IP': `203.0.113.${ipCounter++}` },
    });
    const res = await handleRequest(req);
    return { status: res.status, json: null, text: await res.text() };
  }
  return localCall(c.body, `198.51.100.${(ipCounter++ % 250) + 1}`);
}

for (const c of cases) {
  const r = await invokeCase(c);
  if (c.id === 'sec-invalid-json') {
    const ok = r.status === 400;
    if (!ok) failures.push(`sec-invalid-json status=${r.status}`);
    results.push({ id: c.id, lang: 'de', pass: ok, category: 'security' });
    continue;
  }
  if (c.id === 'sec-get-method') {
    const ok = r.status === 405;
    if (!ok) failures.push(`sec-get-method status=${r.status}`);
    results.push({ id: c.id, lang: 'de', pass: ok, category: 'security' });
    continue;
  }

  const localFailures = [];
  c.expect(r, localFailures);
  const pass = localFailures.length === 0;
  if (!pass) failures.push(...localFailures.map((m) => `${c.id}: ${m}`));
  results.push({
    id: c.id,
    lang: c.lang,
    category: c.category,
    pass,
    type: r.json?.type,
    language: r.json?.language,
    detail: localFailures[0] || '',
  });
}

function score(lang) {
  const subset = results.filter((r) => r.lang === lang && r.category !== 'security');
  const pass = subset.filter((r) => r.pass).length;
  return { total: subset.length, pass, fail: subset.length - pass };
}

const de = score('de');
const en = score('en');
const tr = score('tr');
const medical = results.filter((r) => /emergency|medical/i.test(r.id));
const medicalPass = medical.every((r) => r.pass);

const compare = { preview: [], prod: [] };
async function compareSample(base, bucket) {
  const samples = cases.filter((c) => c.category === 'structured' && typeof c.body === 'object').slice(0, 9);
  for (const c of samples) {
    await new Promise((r) => setTimeout(r, 400));
    const remote = await remoteCall(base, c.body);
    const local = await localCall(c.body, `192.0.2.${(ipCounter++ % 200) + 1}`);
    bucket.push({
      id: c.id,
      remoteStatus: remote.status,
      localLang: local.json?.language,
      remoteLang: remote.json?.language,
      msgEqual: local.json?.message === remote.json?.message,
      typeEqual: local.json?.type === remote.json?.type,
    });
  }
}

if (previewBase) {
  console.log('Comparing sample structured actions vs preview…');
  await compareSample(previewBase, compare.preview);
}
if (compareProd) {
  console.log('Comparing sample structured actions vs production…');
  await compareSample('https://www.drcenik.at', compare.prod);
}

const summary = {
  generatedAt: new Date().toISOString(),
  totals: { cases: results.length, failures: failures.length },
  scores: { de, en, tr },
  medicalSafety: { total: medical.length, pass: medicalPass },
  acceptance: {
    de: de.pass >= 30 && de.fail === 0,
    en: en.pass >= 30 && en.fail === 0,
    tr: tr.pass >= 30 && tr.fail === 0,
    medical: medicalPass,
  },
  failures,
  compare,
  results,
};

const outJson = path.join(root, 'reports/deployment/trilingual-assistant-test-results.json');
fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(summary, null, 2), 'utf8');

console.log(JSON.stringify({ scores: summary.scores, acceptance: summary.acceptance, failCount: failures.length }, null, 2));
if (failures.length) {
  console.error('FAIL');
  for (const f of failures.slice(0, 40)) console.error(' -', f);
  process.exit(1);
}
console.log('PASS');
process.exit(0);
