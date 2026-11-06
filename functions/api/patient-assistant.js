/**
 * Cloudflare Pages Function — POST /api/patient-assistant
 *
 * New maintainable implementation compatible with scripts/patient-assistant.js.
 * Not recovered original source. Deterministic practice info only.
 * No persistent patient storage. No unauthorized booking. No medical diagnosis.
 */

const MAX_BODY_BYTES = 24_576;
const RATE_WINDOW_MS = 60_000;
/** Soft isolate-local limit; high enough for RC suites, still abuse-resistant per IP. */
const RATE_MAX = 120;
const PHONE_DISPLAY = '01 / 769 29 91';
const PHONE_HREF = 'tel:+4317692991';
const TREATMENTS_HREF = '/therapieangebot.html';

/** Best-effort per-isolate rate limit (no KV binding required). */
const rateBuckets = new Map();

const ALLOWED_ORIGINS = new Set([
  'https://www.drcenik.at',
  'https://drcenik.at',
  'http://127.0.0.1:8788',
  'http://localhost:8788',
  'http://127.0.0.1:8787',
  'http://localhost:8787',
]);

const LABELS = {
  de: {
    appointment: 'Termin vereinbaren',
    prescription: 'Ich habe eine Verordnung',
    insurance: 'Kasse & Kosten',
    treatments: 'Therapieangebot',
    bring: 'Was muss ich mitbringen?',
    cancel: 'Termin absagen',
    hours: 'Öffnungszeiten',
    contact: 'Ordination kontaktieren',
    call: 'Anrufen',
    sendRequest: 'Terminwunsch senden',
  },
  tr: {
    appointment: 'Randevu almak',
    prescription: 'Reçetem var',
    insurance: 'Kasa ve ücret',
    treatments: 'Tedavi seçenekleri',
    bring: 'Ne getirmeliyim?',
    cancel: 'Randevu iptali',
    hours: 'Açılış saatleri',
    contact: 'Muayenehaneyi ara',
    call: 'Telefon',
    sendRequest: 'Randevu talebi gönder',
  },
  en: {
    appointment: 'Request an appointment',
    prescription: 'I have a prescription',
    insurance: 'Insurance & costs',
    treatments: 'Treatments',
    bring: 'What should I bring?',
    cancel: 'Cancel appointment',
    hours: 'Opening hours',
    contact: 'Contact the practice',
    call: 'Call',
    sendRequest: 'Send appointment request',
  },
};

/** Verified public practice copy (mirrored from live production responses + site facts). */
const COPY = {
  hours: {
    de: 'Therapiezeiten: Montag: 07:00–19:00; Dienstag, Mittwoch, Donnerstag: 06:30–19:00; Freitag: 06:30–17:00; Samstag und Sonntag: geschlossen Ordinationszeiten: Montag, Mittwoch: 13:00–18:00; Dienstag: 08:00–13:00; Donnerstag: 07:00–12:00; Termine zur Erstuntersuchung nach telefonischer Vereinbarung.',
    tr: 'Terapi saatleri: Pazartesi: 07:00–19:00; Salı, Çarşamba, Perşembe: 06:30–19:00; Cuma: 06:30–17:00; Cumartesi ve Pazar: kapalı Muayene saatleri: Pazartesi, Çarşamba: 13:00–18:00; Salı: 08:00–13:00; Perşembe: 07:00–12:00; İlk muayene randevuları telefonla kararlaştırılır.',
    en: 'Therapy hours: Monday: 07:00–19:00; Tuesday, Wednesday, Thursday: 06:30–19:00; Friday: 06:30–17:00; Saturday and Sunday: closed Consultation hours: Monday, Wednesday: 13:00–18:00; Tuesday: 08:00–13:00; Thursday: 07:00–12:00; First examinations by telephone appointment.',
  },
  appointment: {
    de: 'Online können keine verbindlichen Termine gebucht werden. Sie können einen Terminwunsch senden oder uns anrufen: 01 / 769 29 91.',
    tr: 'Online bağlayıcı randevu yoktur. Talep gönderebilir veya arayabilirsiniz: 01 / 769 29 91.',
    en: 'There is no confirmed online booking. You can send a request or call 01 / 769 29 91.',
  },
  prescription: {
    de: 'Wenn eine Verordnung vorliegt, klären wir Neu- oder Bestandspatient, Versicherung, verordnete Leistung und Einheiten. Eine Diagnose brauchen wir nicht. Verordnungen bitte zur Untersuchung mitbringen; ein unsicherer Upload ist nicht vorgesehen.',
    tr: 'Reçeteniz varsa yeni/kayıtlı hasta, sigorta, reçete edilen işlem ve seans sayısını netleştiririz. Tanı sormayız. Reçeteyi muayeneye getirin; güvensiz yükleme yoktur.',
    en: 'If you have a prescription, we clarify new or existing patient, insurer, prescribed service and number of sessions. We do not ask for a diagnosis. Please bring the prescription to the examination; there is no file upload.',
  },
  insurance: {
    de: 'Die Ordination behandelt grundsätzlich Patientinnen und Patienten von ÖGK, BVAEB, SVS, KFA sowie privat. Das sagt noch nichts über die Übernahme einer konkreten Leistung. Die Ordination behandelt grundsätzlich Patientinnen und Patienten dieser Kassen. Ob eine konkrete Leistung übernommen wird, hängt von Leistung, Verordnung und den Regeln der Versicherung ab und muss gegebenenfalls geprüft werden. Eine Kostenübernahme wird nicht zugesagt.',
    tr: 'Muayenehane ÖGK, BVAEB, SVS, KFA hastalarını genel olarak kabul eder, özel hastalar da. Bu, belirli bir tedavinin ödeneceği anlamına gelmez. Muayenehane bu sigortaların hastalarını genel olarak kabul eder. Belirli bir tedavinin karşılanıp karşılanmadığı hizmete, reçeteye ve sigorta kurallarına bağlıdır; gerektiğinde kontrol edilir. Ödeme garantisi verilmez.',
    en: 'The practice generally treats patients insured with ÖGK, BVAEB, SVS, KFA, and private patients. That does not mean a specific service is covered. The practice generally treats patients of these insurers. Whether a specific service is covered depends on the service, the prescription and the insurer’s rules, and may need to be checked. Coverage is never guaranteed.',
  },
  treatments: {
    de: 'Zum Angebot gehören unter anderem Physiotherapie, Heilmassage, Heilgymnastik, Rehabilitation, Stoßwellentherapie und R-Force. Details stehen auf der Seite Therapieangebot. Ob eine Leistung kassenfinanziert ist, hängt von Verordnung und Versicherung ab.',
    tr: 'Sunulanlar arasında fizyoterapi, tıbbi masaj, egzersiz tedavisi, rehabilitasyon, şok dalga ve R-Force vardır. Ayrıntılar tedavi sayfasındadır. Kasa ödemesi reçete ve sigortaya bağlıdır.',
    en: 'The practice offers physiotherapy, therapeutic massage, therapeutic exercise, rehabilitation, shockwave therapy and R-Force, among others. Details are on the treatments page. Insurance cover depends on the prescription and the insurer.',
  },
  bring: {
    de: 'Zur Erstuntersuchung: e-card, vorhandene Überweisungen oder Verordnungen sowie Befunde. Für die Therapie bitte ein eigenes Leintuch mitbringen. Eine Überweisung ist für den ersten Termin nicht zwingend. Beim ersten Termin: Gespräch, Untersuchung, Befundbesprechung und individueller Therapieplan. Vor Therapiebeginn erfolgt immer eine fachärztliche Untersuchung.',
    tr: 'İlk muayene için: e-card, varsa sevk/reçete ve tetkikler. Terapi için kendi çarşafınızı getirin. İlk randevu için sevk zorunlu değildir. İlk randevuda görüşme, muayene, bulgular ve bireysel plan. Tedavi öncesi her zaman hekim muayenesi yapılır.',
    en: 'For the first visit: e-card, any referrals or prescriptions, and existing findings. Please bring your own sheet for therapy. A referral is not required for the first appointment. First visit: consultation, examination, discussion of findings and an individual plan. Therapy always follows a specialist examination.',
  },
  cancel: {
    de: 'Termine bitte mindestens 24 Stunden vorher absagen. Absagen werden ausschließlich telefonisch unter 01 / 769 29 91 berücksichtigt – nicht per E-Mail und nicht über diesen Assistenten. Bei verspäteter Absage oder Nichterscheinen kann ein Ausfallhonorar von 45 € anfallen.',
    tr: 'Randevular en az 24 saat önce iptal edilmelidir. İptaller yalnızca 01 / 769 29 91 numaralı telefonla geçerlidir – e-posta veya bu asistan üzerinden değil. Geç iptal veya gelmeme durumunda 45 € gelmeme ücreti doğabilir.',
    en: 'Please cancel at least 24 hours in advance. Cancellations are accepted by phone only on 01 / 769 29 91 — not by email and not through this assistant. Late cancellation or non-attendance may incur a 45 € fee.',
  },
  contact: {
    de: 'Ordination Dr. Fadime Cenik, Kaiser-Ebersdorfer-Straße 328, 1110 Wien. Telefon 01 / 769 29 91.',
    tr: 'Dr. Fadime Cenik muayenehanesi, Kaiser-Ebersdorfer-Straße 328, 1110 Wien. Telefon 01 / 769 29 91.',
    en: 'Dr Fadime Cenik, Kaiser-Ebersdorfer-Straße 328, 1110 Wien. Phone 01 / 769 29 91.',
  },
  unknown: {
    de: 'Diese Information kann ich nicht zuverlässig bestätigen. Bitte kontaktieren Sie die Ordination telefonisch unter 01 / 769 29 91.',
    tr: 'Bu bilgiyi güvenilir şekilde doğrulayamıyorum. Lütfen muayenehaneyi arayın: 01 / 769 29 91.',
    en: 'I cannot reliably confirm this. Please call the practice on 01 / 769 29 91.',
  },
  emergency: {
    de: 'Dieser digitale Assistent ersetzt keine Notfallversorgung. Bei einem möglichen medizinischen Notfall wählen Sie bitte die Rettung 144 oder den Euronotruf 112.',
    tr: 'Bu dijital asistan acil tıbbi yardımın yerine geçmez. Olası bir tıbbi acilde lütfen 144 ambulans veya 112 Avrupa acil hattını arayın.',
    en: 'This digital assistant is not emergency care. If you may be having a medical emergency, call ambulance 144 or the European emergency number 112.',
  },
  unavailable: {
    de: 'Der Terminwunsch kann gerade nicht digital übermittelt werden. Bitte rufen Sie an: 01 / 769 29 91.',
    tr: 'Randevu talebi şu anda dijital olarak iletilemiyor. Lütfen arayın: 01 / 769 29 91.',
    en: 'The appointment request cannot be submitted digitally right now. Please call: 01 / 769 29 91.',
  },
  medical: {
    de: 'Dieser Assistent stellt keine Diagnose und gibt keine individuelle Behandlungsempfehlung. Bitte wenden Sie sich an qualifiziertes medizinisches Personal oder rufen Sie die Ordination unter 01 / 769 29 91 an.',
    tr: 'Bu asistan tanı koymaz ve bireysel tedavi önerisi vermez. Lütfen nitelikli sağlık personeline başvurun veya 01 / 769 29 91 numarasını arayın.',
    en: 'This assistant does not diagnose or give personal treatment advice. Please contact qualified medical staff or call the practice on 01 / 769 29 91.',
  },
  prices: {
    de: 'Aktuelle Preise und Kosten nennen wir vor Beginn der Behandlung – telefonisch oder in der Ordination. Über diesen Assistenten erfolgt keine verbindliche Preisauskunft. Telefon 01 / 769 29 91.',
    tr: 'Güncel fiyatları tedavi başlamadan önce telefonla veya muayenehanede söyleriz. Bu asistan üzerinden bağlayıcı fiyat verilmez. Telefon 01 / 769 29 91.',
    en: 'Current prices are confirmed before treatment starts — by phone or at the practice. This assistant does not give binding price quotes. Phone 01 / 769 29 91.',
  },
};

function normalizeLang(raw) {
  const lang = String(raw || 'de').slice(0, 2).toLowerCase();
  return lang === 'tr' || lang === 'en' ? lang : 'de';
}

/**
 * Detect reply language from free-text patient input.
 * Returns null when confidence is low.
 */
function detectLanguageFromText(text) {
  const raw = String(text || '').trim();
  if (!raw) return null;
  const s = raw.toLowerCase();

  let tr = 0;
  let en = 0;
  let de = 0;

  // Turkish-specific letters only (ö/ü also exist in German — do not count them alone).
  if (/[ğüşıĞÜŞİçÇ]/.test(raw)) tr += 3;
  if (/[äöüßÄÖÜ]/.test(raw)) de += 2;

  if (
    /\b(merhaba|randevu|lütfen|lutfen|nedir|nasil|nasıl|misiniz|musunuz|var mi|var mı|muayene|acilis|açılış|saatleri|sigorta|kasa|iptal|getirmeli|adresiniz|neredesiniz|fiyat|ücret|ucret|tedavi|reçete|recete|acil|ambulans)\b/i.test(
      s,
    )
  ) {
    tr += 3;
  }
  if (
    /\b(please|what|when|where|how|hello|hi|do|you|your|accept|with|have|need|want|can|appointment|opening|hours|insurance|cost|price|treatments?|cancel|bring|located|address|phone|prescription|emergency|ambulance|shockwave|physiotherapy)\b/i.test(
      s,
    )
  ) {
    en += 3;
  }
  if (
    /\b(bitte|wann|wie|was|wo|hallo|guten|termin|offnungs|oeffnungs|öffnungs|kasse|verordnung|mitbringen|adresse|anrufen|stoßwelle|stosswelle|physiotherapie|notfall|kosten|preis|absagen)\b/i.test(
      s,
    )
  ) {
    de += 3;
  }

  const ranked = [
    ['tr', tr],
    ['en', en],
    ['de', de],
  ].sort((a, b) => b[1] - a[1]);
  if (ranked[0][1] === 0) return null;
  if (ranked[0][1] === ranked[1][1]) return null;
  return ranked[0][0];
}

function t(dict, lang) {
  return dict[lang] || dict.de;
}

function phonePayload() {
  return { display: PHONE_DISPLAY, href: PHONE_HREF };
}

function action(id, lang, withTel) {
  const labels = LABELS[lang] || LABELS.de;
  const item = { id, label: labels[id] || id };
  if (withTel || id === 'call') item.href = PHONE_HREF;
  return item;
}

function envelope({ type, language, message, suggestedActions, workflow, safetyState, links }) {
  return {
    type: type || 'assistant_message',
    language,
    message,
    suggestedActions: suggestedActions || [],
    workflow: workflow || null,
    safetyState: safetyState || 'normal',
    links: links || [],
    phone: phonePayload(),
  };
}

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const u = new URL(origin);
    if (u.hostname === 'drcenik-live.pages.dev') return true;
    if (u.hostname.endsWith('.drcenik-live.pages.dev')) return true;
    if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') return true;
  } catch {
    return false;
  }
  return false;
}

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (origin && isOriginAllowed(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

function securityHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
  };
}

function jsonResponse(request, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...securityHeaders(),
      ...corsHeaders(request),
    },
  });
}

function clientKey(request) {
  const cf = request.cf || {};
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    cf.colo ||
    'unknown'
  );
}

function checkRateLimit(request) {
  const key = clientKey(request);
  const now = Date.now();
  let bucket = rateBuckets.get(key);
  if (!bucket || now - bucket.start > RATE_WINDOW_MS) {
    bucket = { start: now, count: 0 };
    rateBuckets.set(key, bucket);
  }
  bucket.count += 1;
  if (rateBuckets.size > 5000) {
    for (const [k, v] of rateBuckets) {
      if (now - v.start > RATE_WINDOW_MS) rateBuckets.delete(k);
    }
  }
  return bucket.count <= RATE_MAX;
}

function looksEmergency(text) {
  const s = String(text || '').toLowerCase();
  return (
    /notfall|emergency|rettung|\b144\b|\b112\b|brustschmerz|brustschmerzen|atemnot|herzinfarkt|schlaganfall|bewusstlos|suizid|selbstmord|kanama|bay[ıi]l|acil\b|ambulans|kalp krizi|inme|heart attack|stroke|can't breathe|cannot breathe|can’t breathe|chest pain|unconscious|suicide/.test(
      s,
    )
  );
}

function looksMedicalAdvice(text) {
  const s = String(text || '').toLowerCase();
  return /diagnose|diagnos[ei]|medikament|tabletten|dosage|dosis|soll ich nehmen|hangi ila[cç]|prescription drug|what (medicine|medication|drug)|should i take|te[sş]his|tedavi [oö]ner|heilversprechen|guaranteed cure|definitely heal/.test(
    s,
  );
}

function fold(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ç/g, 'c')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss');
}

function detectIntent(message) {
  const s = fold(message);

  // Prices / costs — never invent amounts; dedicated safe copy
  if (
    /(was kostet|wie teuer|preis|preise|honorar|how much|cost|price|pricing|ne kadar|fiyat|ucret|ücret)/.test(s) &&
    !/(oegk|bvaeb|svs|kfa|kasse|versicherung|insurance|sigorta)/.test(s)
  ) {
    return 'prices';
  }

  if (
    /of+nungszeit|oeffnungszeit|therapiezeit|ordinationszeit|opening hour|openin hours|oppening|acilis|acil[iı]s saat|ne zaman acik|ne zaman aciks[iı]n[iı]z|wann (habt|seid|sind).*(offen|geoeffnet|geoffnet)|(seid|sind|habt) ihr.*offen|samstag.*offen|when.*(open|hours)|are you open/.test(
      s,
    )
  ) {
    return 'hours';
  }
  if (/termin absag|absagen|stornier|iptal|cancel (my )?appointment|randevu (iptal|iptali)/.test(s)) return 'cancel';
  if (/verordnung|re[cç]ete|prescription|rezept|arztbrief/.test(s)) return 'prescription';
  if (/kasse|versicherung|oegk|ogk|bvaeb|svs|kfa|insurance|insurer|sigorta|krankenkasse|kostenuber|kostenueber/.test(s)) {
    return 'insurance';
  }
  if (
    /therapieangebot|physiotherapie|physio|heilmassage|heilgymnastik|stosswelle|stosswellentherapie|shockwave|r-force|r force|rehabilitation|treatments?|tedavi|fizyoterapi|sok dalga|şok dalga/.test(
      s,
    )
  ) {
    return 'treatments';
  }
  if (/mitbringen|was muss ich|ne getirmeli|what (should|do) i bring|e-card|ecard|leintuch|carsaf|çarşaf/.test(s)) {
    return 'bring';
  }
  if (
    /adresse|address|standort|location|wo (liegt|findet|seid|sind)|kontakt|telefon|anrufen|phone|call you|nerede|neredesiniz|adres(iniz|i)?|muayenehane|kaiserebersdorf|where (are you|is the practice)|how (do i|can i) (get|find|reach)/.test(
      s,
    )
  ) {
    return 'contact';
  }
  if (/termin|randevu|appointment|booking|book a|terminwunsch|termin verein/.test(s)) return 'appointment';
  return null;
}

function buildStructured(actionId, lang) {
  switch (actionId) {
    case 'hours':
      return envelope({
        type: 'assistant_message',
        language: lang,
        message: t(COPY.hours, lang),
        suggestedActions: [action('appointment', lang), action('call', lang, true)],
      });
    case 'appointment':
      return envelope({
        type: 'workflow',
        language: lang,
        message: t(COPY.appointment, lang),
        suggestedActions: [action('sendRequest', lang), action('call', lang, true)],
        workflow: { id: 'appointment', step: 1 },
      });
    case 'prescription':
      return envelope({
        type: 'workflow',
        language: lang,
        message: t(COPY.prescription, lang),
        suggestedActions: [action('sendRequest', lang), action('call', lang, true)],
        workflow: { id: 'prescription', step: 1 },
      });
    case 'insurance':
      return envelope({
        type: 'assistant_message',
        language: lang,
        message: t(COPY.insurance, lang),
        suggestedActions: [
          action('appointment', lang),
          action('treatments', lang),
          action('call', lang, true),
        ],
        links: [{ href: TREATMENTS_HREF, label: (LABELS[lang] || LABELS.de).treatments }],
      });
    case 'treatments':
      return envelope({
        type: 'assistant_message',
        language: lang,
        message: t(COPY.treatments, lang),
        suggestedActions: [
          action('appointment', lang),
          action('insurance', lang),
          action('call', lang, true),
        ],
        links: [{ href: TREATMENTS_HREF, label: (LABELS[lang] || LABELS.de).treatments }],
      });
    case 'bring':
      return envelope({
        type: 'assistant_message',
        language: lang,
        message: t(COPY.bring, lang),
        suggestedActions: [action('appointment', lang), action('call', lang, true)],
      });
    case 'cancel':
      return envelope({
        type: 'assistant_message',
        language: lang,
        message: t(COPY.cancel, lang),
        suggestedActions: [action('call', lang, true), action('hours', lang)],
      });
    case 'contact':
      return envelope({
        type: 'assistant_message',
        language: lang,
        message: t(COPY.contact, lang),
        suggestedActions: [action('call', lang, true), action('appointment', lang)],
      });
    case 'prices':
      return envelope({
        type: 'assistant_message',
        language: lang,
        message: t(COPY.prices, lang),
        suggestedActions: [action('call', lang, true), action('insurance', lang), action('appointment', lang)],
      });
    default:
      return null;
  }
}

function resolveLanguage(body, message, actionRaw, preferStructured) {
  const explicit = body.language || body.lang;
  const detected = detectLanguageFromText(message);
  const structuredIds = new Set([
    'appointment',
    'prescription',
    'insurance',
    'treatments',
    'bring',
    'cancel',
    'hours',
    'contact',
    'prices',
  ]);

  // Manual UI language wins for structured chips / forms.
  if (preferStructured || structuredIds.has(actionRaw) || actionRaw === 'appointment_request') {
    return normalizeLang(explicit);
  }
  // Free-text chat: answer in detected request language when confident.
  if (detected) return detected;
  return normalizeLang(explicit);
}

function handlePayload(body) {
  const actionRaw = String(body.action || '').trim();
  const message = typeof body.message === 'string' ? body.message.slice(0, 2000) : '';
  const preferStructured = Boolean(body.preferStructured);
  const language = resolveLanguage(body, message, actionRaw, preferStructured);

  if (looksEmergency(message) || looksEmergency(actionRaw)) {
    return envelope({
      type: 'emergency',
      language,
      message: t(COPY.emergency, language),
      suggestedActions: [action('call', language, true)],
      safetyState: 'emergency',
    });
  }

  if (actionRaw === 'appointment_request') {
    // Never book or store PII. Digital submission intentionally unavailable.
    return envelope({
      type: 'unavailable',
      language,
      message: t(COPY.unavailable, language),
      suggestedActions: [action('call', language, true)],
    });
  }

  const structuredIds = new Set([
    'appointment',
    'prescription',
    'insurance',
    'treatments',
    'bring',
    'cancel',
    'hours',
    'contact',
    'prices',
  ]);

  if (structuredIds.has(actionRaw)) {
    return buildStructured(actionRaw, language);
  }

  if (looksMedicalAdvice(message)) {
    return envelope({
      type: 'assistant_message',
      language,
      message: t(COPY.medical, language),
      suggestedActions: [action('call', language, true), action('appointment', language)],
    });
  }

  const intent = detectIntent(message) || (actionRaw === 'chat' ? null : detectIntent(actionRaw));
  if (intent) return buildStructured(intent, language);

  return envelope({
    type: 'assistant_message',
    language,
    message: t(COPY.unknown, language),
    suggestedActions: [
      action('call', language, true),
      action('appointment', language),
      action('hours', language),
    ],
  });
}

/**
 * Testable core handler (Web Fetch API).
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { ...corsHeaders(request), ...securityHeaders() } });
  }

  if (request.method !== 'POST') {
    return jsonResponse(request, 405, {
      error: 'method_not_allowed',
      message: 'POST only',
    });
  }

  const origin = request.headers.get('Origin') || '';
  if (origin && !isOriginAllowed(origin)) {
    return jsonResponse(request, 403, { error: 'origin_not_allowed' });
  }

  if (!checkRateLimit(request)) {
    return jsonResponse(request, 429, { error: 'rate_limited' });
  }

  const contentLength = Number(request.headers.get('Content-Length') || '0');
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse(request, 413, { error: 'payload_too_large' });
  }

  let raw;
  try {
    raw = await request.arrayBuffer();
  } catch {
    return jsonResponse(request, 400, { error: 'invalid_body' });
  }

  if (raw.byteLength > MAX_BODY_BYTES) {
    return jsonResponse(request, 413, { error: 'payload_too_large' });
  }

  let body;
  try {
    const text = new TextDecoder('utf-8', { fatal: false }).decode(raw);
    if (!text || !text.trim()) {
      return jsonResponse(request, 400, { error: 'empty_body' });
    }
    body = JSON.parse(text);
  } catch {
    return jsonResponse(request, 400, { error: 'invalid_json' });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return jsonResponse(request, 400, { error: 'invalid_payload' });
  }

  // Do not log message, names, phone, email, or other patient fields.
  const result = handlePayload(body);
  return jsonResponse(request, 200, result);
}

export async function onRequest(context) {
  return handleRequest(context.request);
}

export async function onRequestPost(context) {
  return handleRequest(context.request);
}

export async function onRequestOptions(context) {
  return handleRequest(context.request);
}
