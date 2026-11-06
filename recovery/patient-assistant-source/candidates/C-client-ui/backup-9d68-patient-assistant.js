/**
 * Digitaler Patienten-Assistent – UI only. No secrets, no medical storage.
 */
(function () {
  'use strict';
  if (window.__drcenikAssistantApp) return;
  window.__drcenikAssistantApp = true;

  var API = '/api/patient-assistant';
  var TEL = 'tel:+4317692991';
  var history = [];
  var lang = (document.documentElement.lang || 'de').slice(0, 2);
  if (lang !== 'tr' && lang !== 'en') lang = 'de';
  var consented = false;
  var open = false;
  var abortCtrl = null;
  var lastFocus = null;
  var emergencyLock = false;

  var I18N = {
    de: {
      launcher: 'Patienten-Assistent',
      title: 'Patienten-Assistent',
      ki: 'KI-gestützter Patienten-Assistent',
      notStaff: 'Sie schreiben nicht mit Dr. Cenik und nicht mit einer Mitarbeiterin.',
      greet: 'Guten Tag. Ich bin der digitale Patienten-Assistent der Ordination Dr. Fadime Cenik.',
      help: 'Wie kann ich Ihnen helfen?',
      consent: 'Dieser Assistent beantwortet organisatorische Fragen. Er stellt keine Diagnose. Angaben in Formularen (Name, Telefon, Terminwunsch) gehen nur an die Ordination. Sie können jederzeit anrufen.',
      understood: 'Verstanden',
      close: 'Assistent schließen',
      send: 'Senden',
      input: 'Nachricht an den Patienten-Assistenten',
      placeholder: 'Ihre Frage …',
      typing: 'Antwort wird vorbereitet …',
      call: 'Anrufen',
      first: 'Vorname',
      last: 'Nachname',
      phone: 'Telefon',
      email: 'E-Mail (optional)',
      status: 'Neu- oder Bestandspatient',
      statusNew: 'Neu',
      statusExisting: 'Bestand',
      insurer: 'Versicherung',
      reason: 'Grund des Terminwunsches',
      rx: 'Verordnung vorhanden',
      yes: 'Ja',
      no: 'Nein',
      period: 'Gewünschter Zeitraum',
      weekday: 'Wochentag (optional)',
      daypart: 'Tageszeit',
      morning: 'Vormittag',
      afternoon: 'Nachmittag',
      either: 'Egal',
      units: 'Einheiten (falls bekannt)',
      service: 'Verordnete Leistung',
      submit: 'Terminwunsch senden',
      back: 'Zurück',
      required: 'Bitte Vorname, Nachname und Telefon angeben.',
    },
    tr: {
      launcher: 'Hasta asistanı',
      title: 'Hasta asistanı',
      ki: 'Yapay zekâ destekli hasta asistanı',
      notStaff: 'Dr. Cenik veya bir çalışanla değil, dijital asistanla yazışıyorsunuz.',
      greet: 'Merhaba. Ben Dr. Fadime Cenik muayenehanesinin dijital hasta asistanıyım.',
      help: 'Size nasıl yardımcı olabilirim?',
      consent: 'Bu asistan organizasyon sorularını yanıtlar, tanı koymaz. Form bilgileri yalnızca muayenehaneye iletilir. İstediğiniz zaman arayabilirsiniz.',
      understood: 'Anladım',
      close: 'Asistanı kapat',
      send: 'Gönder',
      input: 'Hasta asistanına mesaj',
      placeholder: 'Sorunuz …',
      typing: 'Yanıt hazırlanıyor …',
      call: 'Ara',
      first: 'Ad',
      last: 'Soyad',
      phone: 'Telefon',
      email: 'E-posta (isteğe bağlı)',
      status: 'Yeni veya kayıtlı hasta',
      statusNew: 'Yeni',
      statusExisting: 'Kayıtlı',
      insurer: 'Sigorta',
      reason: 'Randevu nedeni',
      rx: 'Reçete var mı',
      yes: 'Evet',
      no: 'Hayır',
      period: 'Tercih edilen dönem',
      weekday: 'Gün (isteğe bağlı)',
      daypart: 'Saat dilimi',
      morning: 'Sabah',
      afternoon: 'Öğleden sonra',
      either: 'Fark etmez',
      units: 'Seans sayısı (varsa)',
      service: 'Reçete edilen işlem',
      submit: 'Randevu talebi gönder',
      back: 'Geri',
      required: 'Lütfen ad, soyad ve telefon girin.',
    },
    en: {
      launcher: 'Patient assistant',
      title: 'Patient assistant',
      ki: 'AI-supported patient assistant',
      notStaff: 'You are not writing to Dr Cenik or to a staff member.',
      greet: 'Good day. I am the digital patient assistant of Dr Fadime Cenik’s practice.',
      help: 'How can I help you?',
      consent: 'This assistant answers organisational questions and does not diagnose. Form details go to the practice only. You can call at any time.',
      understood: 'Understood',
      close: 'Close assistant',
      send: 'Send',
      input: 'Message to the patient assistant',
      placeholder: 'Your question …',
      typing: 'Preparing a reply …',
      call: 'Call',
      first: 'First name',
      last: 'Last name',
      phone: 'Phone',
      email: 'Email (optional)',
      status: 'New or existing patient',
      statusNew: 'New',
      statusExisting: 'Existing',
      insurer: 'Insurance',
      reason: 'Reason for the request',
      rx: 'Prescription available',
      yes: 'Yes',
      no: 'No',
      period: 'Preferred period',
      weekday: 'Weekday (optional)',
      daypart: 'Time of day',
      morning: 'Morning',
      afternoon: 'Afternoon',
      either: 'Either',
      units: 'Sessions if known',
      service: 'Prescribed service',
      submit: 'Send appointment request',
      back: 'Back',
      required: 'Please enter first name, last name and phone.',
    }
  };

  var START_ACTIONS = [
    'appointment', 'prescription', 'insurance', 'treatments',
    'bring', 'cancel', 'hours', 'contact'
  ];

  function L() { return I18N[lang] || I18N.de; }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === 'className') node.className = attrs[key];
        else if (key === 'text') node.textContent = attrs[key];
        else if (key.slice(0, 2) === 'on') node.addEventListener(key.slice(2).toLowerCase(), attrs[key]);
        else if (attrs[key] === false || attrs[key] == null) return;
        else node.setAttribute(key, attrs[key]);
      });
    }
    (children || []).forEach(function (child) {
      if (child) node.appendChild(child);
    });
    return node;
  }

  var root = el('div', { className: 'pa-root', 'data-pa-root': 'true' });
  var launcher = el('button', {
    className: 'pa-launcher',
    type: 'button',
    'aria-haspopup': 'dialog',
    'aria-expanded': 'false',
    'aria-controls': 'pa-panel'
  });
  launcher.appendChild(el('span', { className: 'pa-launcher-mark', 'aria-hidden': 'true' }, [
    (function () {
      var ns = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('width', '16');
      svg.setAttribute('height', '16');
      svg.setAttribute('viewBox', '0 0 16 16');
      svg.setAttribute('fill', 'none');
      var p = document.createElementNS(ns, 'path');
      p.setAttribute('d', 'M3 4.5A1.5 1.5 0 0 1 4.5 3h7A1.5 1.5 0 0 1 13 4.5v4A1.5 1.5 0 0 1 11.5 10H8l-3 2.5V10H4.5A1.5 1.5 0 0 1 3 8.5v-4Z');
      p.setAttribute('stroke', '#E2CFB5');
      p.setAttribute('stroke-width', '1.4');
      svg.appendChild(p);
      return svg;
    })()
  ]));
  var launcherText = el('span', { className: 'pa-launcher-text' });
  launcher.appendChild(launcherText);

  var panel = el('div', {
    className: 'pa-panel',
    id: 'pa-panel',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'pa-title',
    hidden: true
  });

  var head = el('div', { className: 'pa-head' });
  var headCopy = el('div');
  var title = el('h2', { className: 'pa-head-title', id: 'pa-title' });
  var meta = el('p', { className: 'pa-head-meta' });
  headCopy.appendChild(title);
  headCopy.appendChild(meta);
  var closeBtn = el('button', { className: 'pa-close', type: 'button' });
  closeBtn.textContent = '×';
  head.appendChild(headCopy);
  head.appendChild(closeBtn);

  var langs = el('div', { className: 'pa-langs', role: 'group', 'aria-label': 'Language' });
  ['de', 'tr', 'en'].forEach(function (code) {
    var b = el('button', { className: 'pa-lang', type: 'button', 'data-lang': code });
    b.textContent = code.toUpperCase();
    langs.appendChild(b);
  });

  var live = el('div', { className: 'pa-scroll', 'aria-live': 'polite', 'aria-relevant': 'additions' });
  var composer = el('form', { className: 'pa-composer' });
  var input = el('input', { type: 'text', maxlength: '2000', autocomplete: 'off', enterkeyhint: 'send' });
  var sendBtn = el('button', { className: 'pa-send', type: 'submit' });
  composer.appendChild(input);
  composer.appendChild(sendBtn);

  panel.appendChild(head);
  panel.appendChild(langs);
  panel.appendChild(live);
  panel.appendChild(composer);
  root.appendChild(launcher);
  root.appendChild(panel);
  document.body.appendChild(root);

  function applyCopy() {
    var c = L();
    launcherText.textContent = c.launcher;
    launcher.setAttribute('aria-label', c.launcher);
    title.textContent = c.title;
    meta.textContent = c.ki;
    closeBtn.setAttribute('aria-label', c.close);
    input.setAttribute('aria-label', c.input);
    input.placeholder = c.placeholder;
    sendBtn.textContent = c.send;
    Array.prototype.forEach.call(langs.querySelectorAll('.pa-lang'), function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
  }

  function bubble(text, kind) {
    var b = el('div', { className: 'pa-bubble' + (kind ? ' pa-bubble-' + kind : '') });
    b.textContent = text;
    live.appendChild(b);
    live.scrollTop = live.scrollHeight;
    return b;
  }

  function renderActions(actions) {
    if (!actions || !actions.length) return;
    var wrap = el('div', { className: 'pa-actions' });
    actions.forEach(function (action) {
      var id = action.id || action;
      var label = action.label || id;
      if (id === 'call' || action.href && String(action.href).indexOf('tel:') === 0) {
        var a = el('a', { className: 'pa-chip', href: action.href || TEL });
        a.textContent = label;
        wrap.appendChild(a);
        return;
      }
      var btn = el('button', { className: 'pa-chip', type: 'button', 'data-action': id });
      btn.textContent = label;
      wrap.appendChild(btn);
    });
    live.appendChild(wrap);
  }

  function renderLinks(links) {
    if (!links || !links.length) return;
    var wrap = el('div', { className: 'pa-links' });
    links.forEach(function (link) {
      if (!link || !link.href) return;
      var href = String(link.href);
      if (!/^\/[a-z0-9._/-]*$/i.test(href)) return;
      var a = el('a', { href: href });
      a.textContent = link.label || href;
      wrap.appendChild(a);
    });
    if (wrap.childNodes.length) live.appendChild(wrap);
  }

  function startScreen() {
    live.textContent = '';
    if (!consented) {
      var box = el('div', { className: 'pa-consent' });
      box.appendChild(el('p', { text: L().consent }));
      box.appendChild(el('p', { className: 'pa-ki', text: L().notStaff }));
      var ok = el('button', { className: 'pa-btn pa-btn-primary', type: 'button' });
      ok.textContent = L().understood;
      ok.addEventListener('click', function () {
        consented = true;
        startScreen();
      });
      box.appendChild(ok);
      live.appendChild(box);
      return;
    }
    bubble(L().greet);
    bubble(L().help);
    var ki = el('p', { className: 'pa-ki', text: L().ki + ' — ' + L().notStaff });
    live.appendChild(ki);
    renderActions(START_ACTIONS.map(function (id) {
      return { id: id, label: defaultLabel(id) };
    }));
  }

  function defaultLabel(id) {
    var map = {
      de: {
        appointment: 'Termin vereinbaren', prescription: 'Ich habe eine Verordnung', insurance: 'Kasse & Kosten',
        treatments: 'Therapieangebot', bring: 'Was muss ich mitbringen?', cancel: 'Termin absagen',
        hours: 'Öffnungszeiten', contact: 'Ordination kontaktieren', call: 'Anrufen', sendRequest: 'Terminwunsch senden'
      },
      tr: {
        appointment: 'Randevu almak', prescription: 'Reçetem var', insurance: 'Kasa ve ücret',
        treatments: 'Tedavi seçenekleri', bring: 'Ne getirmeliyim?', cancel: 'Randevu iptali',
        hours: 'Açılış saatleri', contact: 'Muayenehaneyi ara', call: 'Telefon', sendRequest: 'Randevu talebi gönder'
      },
      en: {
        appointment: 'Request an appointment', prescription: 'I have a prescription', insurance: 'Insurance & costs',
        treatments: 'Treatments', bring: 'What should I bring?', cancel: 'Cancel appointment',
        hours: 'Opening hours', contact: 'Contact the practice', call: 'Call', sendRequest: 'Send appointment request'
      }
    };
    return (map[lang] || map.de)[id] || id;
  }

  function field(label, name, type, required) {
    var wrap = el('label', { className: 'pa-field' });
    wrap.appendChild(el('span', { text: label + (required ? ' *' : '') }));
    var control = el(type === 'textarea' ? 'textarea' : 'input', {
      name: name,
      required: required ? 'required' : false,
      autocomplete: name === 'phone' ? 'tel' : name === 'email' ? 'email' : 'on'
    });
    if (type !== 'textarea') control.type = type || 'text';
    wrap.appendChild(control);
    return wrap;
  }

  function selectField(label, name, options) {
    var wrap = el('label', { className: 'pa-field' });
    wrap.appendChild(el('span', { text: label }));
    var sel = el('select', { name: name });
    options.forEach(function (opt) {
      var o = el('option');
      o.value = opt.value;
      o.textContent = opt.label;
      sel.appendChild(o);
    });
    wrap.appendChild(sel);
    return wrap;
  }

  function appointmentForm(isRx) {
    var c = L();
    var form = el('form', { className: 'pa-form' });
    form.appendChild(field(c.first, 'firstName', 'text', true));
    form.appendChild(field(c.last, 'lastName', 'text', true));
    form.appendChild(field(c.phone, 'phone', 'tel', true));
    form.appendChild(field(c.email, 'email', 'email', false));
    form.appendChild(selectField(c.status, 'patientStatus', [
      { value: 'new', label: c.statusNew },
      { value: 'existing', label: c.statusExisting }
    ]));
    form.appendChild(selectField(c.insurer, 'insurer', [
      { value: 'oegk', label: 'ÖGK' },
      { value: 'bvaeb', label: 'BVAEB' },
      { value: 'svs', label: 'SVS' },
      { value: 'kfa', label: 'KFA' },
      { value: 'private', label: 'Privat' },
      { value: 'unknown', label: '—' }
    ]));
    if (isRx) {
      form.appendChild(field(c.service, 'prescribedService', 'text', false));
      form.appendChild(field(c.units, 'units', 'text', false));
    }
    form.appendChild(selectField(c.rx, 'hasPrescription', [
      { value: isRx ? 'yes' : 'no', label: c.yes },
      { value: 'no', label: c.no }
    ]));
    form.appendChild(field(c.reason, 'reason', 'text', false));
    form.appendChild(field(c.period, 'preferredPeriod', 'text', false));
    form.appendChild(field(c.weekday, 'preferredWeekday', 'text', false));
    form.appendChild(selectField(c.daypart, 'preferredTimeOfDay', [
      { value: 'either', label: c.either },
      { value: 'morning', label: c.morning },
      { value: 'afternoon', label: c.afternoon }
    ]));
    var actions = el('div', { className: 'pa-actions' });
    var submit = el('button', { className: 'pa-btn pa-btn-primary', type: 'submit' });
    submit.textContent = c.submit;
    var call = el('a', { className: 'pa-chip', href: TEL });
    call.textContent = c.call;
    actions.appendChild(submit);
    actions.appendChild(call);
    form.appendChild(actions);
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var data = new FormData(form);
      var firstName = String(data.get('firstName') || '').trim();
      var lastName = String(data.get('lastName') || '').trim();
      var phone = String(data.get('phone') || '').trim();
      if (!firstName || !lastName || !phone) {
        bubble(c.required, 'emergency');
        return;
      }
      submit.disabled = true;
      post({
        action: 'appointment_request',
        language: lang,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: String(data.get('email') || ''),
        patientStatus: data.get('patientStatus'),
        insurer: data.get('insurer'),
        reason: String(data.get('reason') || ''),
        hasPrescription: data.get('hasPrescription') === 'yes',
        prescribedService: String(data.get('prescribedService') || ''),
        units: String(data.get('units') || ''),
        preferredPeriod: String(data.get('preferredPeriod') || ''),
        preferredWeekday: String(data.get('preferredWeekday') || ''),
        preferredTimeOfDay: data.get('preferredTimeOfDay')
      }, submit);
    });
    live.appendChild(form);
    var first = form.querySelector('[name="firstName"]');
    if (first) first.focus();
  }

  function showReply(data) {
    if (!data || !data.message) return;
    var kind = data.safetyState === 'emergency' ? 'emergency' : '';
    bubble(data.message, kind);
    renderLinks(data.links);
    renderActions(data.suggestedActions);
    if (data.workflow && (data.workflow.id === 'appointment' || data.workflow.id === 'prescription')) {
      appointmentForm(data.workflow.id === 'prescription');
    }
    if (data.safetyState === 'emergency') {
      emergencyLock = true;
      input.disabled = true;
      sendBtn.disabled = true;
    }
  }

  function post(body, disableEl) {
    if (abortCtrl) abortCtrl.abort();
    abortCtrl = new AbortController();
    var timer = setTimeout(function () { abortCtrl.abort(); }, 12000);
    var status = el('p', { className: 'pa-status', text: L().typing });
    live.appendChild(status);
    sendBtn.disabled = true;
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      credentials: 'same-origin',
      signal: abortCtrl.signal
    }).then(function (res) {
      if (!res.ok) throw new Error('http');
      return res.json();
    }).then(function (data) {
      status.remove();
      showReply(data);
      if (body.message && data && data.message) {
        history.push({ role: 'user', content: String(body.message).slice(0, 500) });
        history.push({ role: 'assistant', content: String(data.message).slice(0, 500) });
        if (history.length > 16) history = history.slice(-16);
      }
    }).catch(function () {
      status.remove();
      var fallback = {
        de: 'Der digitale Assistent ist derzeit nicht verfügbar. Sie können die Ordination telefonisch kontaktieren.',
        tr: 'Dijital asistan şu anda kullanılamıyor. Lütfen muayenehaneyi telefonla arayın.',
        en: 'The digital assistant is currently unavailable. Please call the practice.'
      };
      bubble(fallback[lang] || fallback.de);
      renderActions([{ id: 'call', label: L().call, href: TEL }]);
    }).finally(function () {
      clearTimeout(timer);
      sendBtn.disabled = emergencyLock;
      if (disableEl) disableEl.disabled = false;
    });
  }

  function ask(text, action) {
    if (text) bubble(text, 'user');
    post({
      action: action || 'chat',
      language: lang,
      message: text || action,
      history: history,
      preferStructured: Boolean(action)
    });
  }

  function setOpen(next) {
    open = next;
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
    launcher.hidden = open;
    if (open) {
      lastFocus = document.activeElement;
      emergencyLock = false;
      input.disabled = false;
      sendBtn.disabled = false;
      if (!live.childNodes.length) startScreen();
      closeBtn.focus();
    } else {
      launcher.hidden = false;
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      else launcher.focus();
    }
  }

  launcher.addEventListener('click', function () { setOpen(!open); });
  closeBtn.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && open) {
      ev.preventDefault();
      setOpen(false);
    }
  });
  langs.addEventListener('click', function (ev) {
    var btn = ev.target.closest('.pa-lang');
    if (!btn) return;
    lang = btn.getAttribute('data-lang');
    applyCopy();
    startScreen();
  });
  live.addEventListener('click', function (ev) {
    var btn = ev.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-action');
    if (action === 'sendRequest') {
      appointmentForm(false);
      return;
    }
    ask(btn.textContent, action);
  });
  composer.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!consented) {
      startScreen();
      return;
    }
    var value = (input.value || '').trim();
    if (!value) return;
    input.value = '';
    ask(value);
  });

  function syncCookie() {
    var banner = document.querySelector('.cookie-consent');
    var up = Boolean(banner && !banner.classList.contains('cookie-consent-hidden') && banner.offsetParent !== null);
    root.setAttribute('data-cookie-up', up ? 'true' : 'false');
  }
  syncCookie();
  var obs = new MutationObserver(syncCookie);
  obs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', function () {
      if (!open) return;
      var offset = window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop;
      panel.style.marginBottom = offset > 40 ? offset + 'px' : '';
    });
  }

  applyCopy();
})();
