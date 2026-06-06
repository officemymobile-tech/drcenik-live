/**
 * Dr. Fadime Cenik – Website (Splash, Consent, Maps, Navbar, Forms, CTA)
 */
(function () {
  'use strict';

  var CONSENT_KEY = 'drcenik-cookie-consent';
  var MAPS_SRC_DEFAULT = 'https://www.google.com/maps?q=Kaiser-Ebersdorfer-Stra%C3%9Fe+328,+1110+Wien,+%C3%96sterreich&z=16&output=embed';

  function lang() {
    return (document.documentElement.lang || 'de').slice(0, 2);
  }

  function L() {
    var pack = (window.DRCENIK_I18N || {})[lang()] || window.DRCENIK_I18N.de;
    return pack;
  }

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  function hasMapsConsent() {
    return getConsent() === 'accepted';
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
    document.dispatchEvent(new CustomEvent('drcenik:consent', { detail: { value: value } }));
    if (value === 'accepted') loadAllMaps();
  }

  function loadMapIframe(iframe) {
    if (!iframe || iframe.getAttribute('data-maps-loaded')) return;
    var src = iframe.getAttribute('data-src') || MAPS_SRC_DEFAULT;
    iframe.setAttribute('src', src);
    iframe.setAttribute('data-maps-loaded', '1');
    iframe.removeAttribute('hidden');
    var wrap = iframe.closest('[data-maps-consent]');
    if (wrap) {
      var ph = wrap.querySelector('[data-maps-placeholder]');
      if (ph) ph.setAttribute('hidden', '');
    }
  }

  function loadAllMaps() {
    document.querySelectorAll('[data-maps-iframe]').forEach(loadMapIframe);
  }

  function initMapsConsent() {
    document.querySelectorAll('[data-maps-consent]').forEach(function (wrap) {
      var iframe = wrap.querySelector('[data-maps-iframe]');
      var ph = wrap.querySelector('[data-maps-placeholder]');
      if (!iframe) return;
      if (hasMapsConsent()) {
        loadMapIframe(iframe);
        return;
      }
      iframe.removeAttribute('src');
      if (ph) {
        ph.removeAttribute('hidden');
        var btn = ph.querySelector('[data-maps-load]');
        if (btn && !btn._bound) {
          btn._bound = true;
          btn.addEventListener('click', function () {
            setConsent('accepted');
          });
        }
      }
    });
    if (hasMapsConsent()) loadAllMaps();
  }

  function initSplash() {
    var splash = document.getElementById('splash-screen');
    if (!splash) return;
    var HIDDEN = 'splash-screen--hidden';
    var STORAGE_KEY = 'drcenikSplashShown';
    var SHOW_MS = 700;
    var FADE_MS = 250;
    var dismissed = false;
    var t = L();

    function dismissSplash() {
      if (dismissed) return;
      dismissed = true;
      splash.classList.add(HIDDEN);
      splash.setAttribute('aria-hidden', 'true');
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
      setTimeout(function () { splash.remove(); }, FADE_MS);
    }

    if (sessionStorage.getItem(STORAGE_KEY) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      splash.remove();
      return;
    }

    splash.setAttribute('aria-hidden', 'false');
    splash.setAttribute('title', t.splashSkip);
    splash.addEventListener('click', dismissSplash);
    splash.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') dismissSplash();
    });
    setTimeout(dismissSplash, SHOW_MS);
  }

  function initStickyCta() {
    var existing = document.getElementById('sticky-cta') || document.getElementById('mobile-cta');
    if (existing) {
      document.body.classList.add('has-mobile-cta');
      return;
    }
    var t = L();
    var aside = document.createElement('aside');
    aside.className = 'mobile-cta';
    aside.id = 'mobile-cta';
    aside.setAttribute('aria-label', t.ctaCall + ' / ' + t.ctaBookShort);
    aside.innerHTML =
      '<a href="tel:+4317692991" class="mobile-cta-btn mobile-cta-phone">' + t.ctaCall + '</a>' +
      '<a href="' + t.terminPath + '" class="mobile-cta-btn mobile-cta-book">' + t.ctaBook + '</a>';
    document.body.appendChild(aside);
    document.body.classList.add('has-mobile-cta');
  }

  function initMapsFab() {
    if (window.matchMedia('(min-width: 769px)').matches) return;
    var MAPS_URL = 'https://www.google.com/maps/dir/?api=1&destination=Kaiser-Ebersdorfer-Stra%C3%9Fe+328,+1110+Wien,+%C3%96sterreich';
    var labels = {
      de: 'Route in Google Maps öffnen',
      tr: 'Google Haritalar\'da yol tarifi aç',
      en: 'Open directions in Google Maps'
    };
    var fab = document.createElement('a');
    fab.href = MAPS_URL;
    fab.className = 'mobile-maps-fab';
    fab.setAttribute('target', '_blank');
    fab.setAttribute('rel', 'noopener noreferrer');
    fab.setAttribute('aria-label', labels[lang()] || labels.de);
    fab.innerHTML = '<svg class="mobile-maps-fab-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>';
    document.body.appendChild(fab);
    document.body.classList.add('has-mobile-maps-fab');
  }

  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (navbar) {
      var onScroll = function () {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    var toggle = document.getElementById('navbar-toggle');
    var links = document.getElementById('navbar-links');
    var menuOpen = false;
    var t = L();

    if (toggle) {
      toggle.setAttribute('aria-controls', 'navbar-links');
      toggle.setAttribute('aria-expanded', 'false');
    }
    if (links) links.setAttribute('aria-hidden', 'true');

    function setMenuOpen(open) {
      menuOpen = !!open;
      if (toggle) {
        toggle.classList.toggle('active', menuOpen);
        toggle.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
        toggle.setAttribute('aria-label', menuOpen ? t.menuClose : t.menuOpen);
      }
      if (links) {
        links.classList.toggle('active', menuOpen);
        links.setAttribute('aria-hidden', menuOpen ? 'false' : 'true');
        if (menuOpen) {
          links.scrollTop = 0;
          var s = links.style;
          s.setProperty('left', '0', 'important');
          s.setProperty('right', '0', 'important');
          s.setProperty('top', '64px', 'important');
          s.setProperty('bottom', '0', 'important');
          s.setProperty('width', '100%', 'important');
          s.setProperty('min-height', 'calc(100vh - 64px)', 'important');
          s.setProperty('transform', 'none', 'important');
          s.setProperty('visibility', 'visible', 'important');
          s.setProperty('clip-path', 'none', 'important');
          s.setProperty('z-index', '2000', 'important');
          s.setProperty('pointer-events', 'auto', 'important');
          s.setProperty('display', 'flex', 'important');
          s.setProperty('flex-direction', 'column', 'important');
          s.setProperty('justify-content', 'flex-start', 'important');
          s.setProperty('overflow-y', 'auto', 'important');
          s.setProperty('overflow-x', 'hidden', 'important');
        } else {
          links.style.cssText = '';
        }
      }
      document.body.classList.toggle('nav-menu-open', menuOpen);
      document.body.style.overflow = menuOpen ? 'hidden' : '';
      var nav = document.getElementById('navbar');
      if (nav) {
        nav.style.overflow = menuOpen ? 'visible' : '';
        var container = nav.querySelector('.navbar-container');
        if (container) container.style.overflow = menuOpen ? 'visible' : '';
      }
    }

    if (toggle && links) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(!menuOpen);
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setMenuOpen(false); });
      });
    }
  }

  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.fade-in-up').forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.fade-in-up').forEach(function (el) { observer.observe(el); });
  }

  function initOpenClosed() {
    var openClosedEls = document.querySelectorAll('[data-open-closed]');
    if (!openClosedEls.length) return;
    var now = new Date();
    var vienna = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Vienna' }));
    var day = vienna.getDay();
    var time = vienna.getHours() * 60 + vienna.getMinutes();

    var isOpenTherapy = false;
    if (day === 1) { if (time >= 420 && time < 1140) isOpenTherapy = true; }
    else if (day >= 2 && day <= 4) { if (time >= 390 && time < 1140) isOpenTherapy = true; }
    else if (day === 5) { if (time >= 390 && time < 1020) isOpenTherapy = true; }

    var isOpenOrdination = false;
    if (day === 1 || day === 3) { if (time >= 780 && time < 1080) isOpenOrdination = true; }
    else if (day === 2) { if (time >= 480 && time < 780) isOpenOrdination = true; }
    else if (day === 4) { if (time >= 420 && time < 720) isOpenOrdination = true; }

    var labels = {
      de: { open: 'Geöffnet', closed: 'Geschlossen', therapy: 'Therapie', ordination: 'Ordination' },
      en: { open: 'Open', closed: 'Closed', therapy: 'Therapy', ordination: 'Practice' },
      tr: { open: 'Açık', closed: 'Kapalı', therapy: 'Terapi', ordination: 'Muayenehane' }
    };
    var lbl = labels[lang()] || labels.de;
    var openIcon = '<span class="open-closed-icon open-closed-icon-open" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg></span>';
    var closedIcon = '<span class="open-closed-icon open-closed-icon-closed" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>';

    openClosedEls.forEach(function (el) {
      var type = (el.getAttribute('data-open-closed') || 'therapy').toLowerCase();
      var isOpen = type === 'ordination' ? isOpenOrdination : isOpenTherapy;
      var inDual = !!el.closest('.contact-profile-status-dual');
      var prefix = (type === 'ordination' ? lbl.ordination : (inDual ? lbl.therapy : '')) + (type === 'ordination' || inDual ? ': ' : '');
      var text = prefix + (isOpen ? lbl.open : lbl.closed);
      el.classList.add(isOpen ? 'is-open' : 'is-closed');
      el.setAttribute('aria-label', text);
      el.innerHTML = (isOpen ? openIcon : closedIcon) + '<span class="open-closed-text">' + text + '</span>';
    });
  }

  function initLangSwitch() {
    var path = window.location.pathname || '';
    var file = path.split('/').pop() || 'index.html';
    if (!file) file = 'index.html';
    var base = file.replace(/\.html$/i, '').replace(/-tr$|-en$/, '');
    if (!base) base = 'index';
    var isTR = /-tr\.html$/i.test(file);
    var isEN = /-en\.html$/i.test(file);
    var hrefDE = base + '.html';
    var hrefTR = base + '-tr.html';
    var hrefEN = base + '-en.html';
    document.querySelectorAll('.navbar-lang').forEach(function (wrap) {
      var links = wrap.querySelectorAll('.navbar-lang-link');
      links.forEach(function (a) { a.classList.remove('is-active'); });
      if (links[0]) { links[0].href = hrefDE; links[0].setAttribute('hreflang', 'de'); links[0].setAttribute('lang', 'de'); if (!isTR && !isEN) links[0].classList.add('is-active'); }
      if (links[1]) { links[1].href = hrefTR; links[1].setAttribute('hreflang', 'tr'); links[1].setAttribute('lang', 'tr'); if (isTR) links[1].classList.add('is-active'); }
      if (links[2]) { links[2].href = hrefEN; links[2].setAttribute('hreflang', 'en'); links[2].setAttribute('lang', 'en'); if (isEN) links[2].classList.add('is-active'); }
    });
  }

  function initFormAutoSave() {
    var STORAGE_PREFIX = 'drcenik-form-';
    var timers = {};

    function formStorageKey(form) {
      var id = form.id && form.id.trim();
      var path = (window.location.pathname || '').replace(/^\//, '') || 'index.html';
      return STORAGE_PREFIX + (id || path);
    }

    function getFormData(form) {
      var data = {};
      form.querySelectorAll('input, textarea, select').forEach(function (el) {
        if (!el.name || el.type === 'file' || el.type === 'submit' || el.type === 'button' || el.type === 'reset') return;
        if (el.type === 'checkbox' || el.type === 'radio') {
          if (el.checked) data[el.name] = el.value || 'on';
        } else {
          data[el.name] = el.value;
        }
      });
      return data;
    }

    function setFormData(form, data) {
      Object.keys(data).forEach(function (name) {
        var el = form.querySelector('[name="' + name + '"]');
        if (!el) return;
        if (el.type === 'checkbox' || el.type === 'radio') {
          el.checked = el.value ? data[name] === el.value : data[name] === 'on';
        } else {
          el.value = data[name];
        }
      });
    }

    document.querySelectorAll('form').forEach(function (form) {
      var key = formStorageKey(form);
      try {
        var saved = localStorage.getItem(key);
        if (saved) setFormData(form, JSON.parse(saved));
      } catch (e) {}

      form.querySelectorAll('input, textarea, select').forEach(function (el) {
        if (!el.name || el.type === 'file' || el.type === 'submit' || el.type === 'button' || el.type === 'reset') return;
        el.addEventListener('input', function () {
          if (timers[key]) clearTimeout(timers[key]);
          timers[key] = setTimeout(function () {
            try { localStorage.setItem(key, JSON.stringify(getFormData(form))); } catch (e) {}
          }, 400);
        });
        el.addEventListener('change', function () {
          try { localStorage.setItem(key, JSON.stringify(getFormData(form))); } catch (e) {}
        });
      });

      form.addEventListener('submit', function () {
        try { localStorage.removeItem(key); } catch (e) {}
      });
      form.addEventListener('reset', function () {
        setTimeout(function () { try { localStorage.removeItem(key); } catch (e) {} }, 0);
      });
    });
  }

  function initCookieBanner() {
    if (getConsent()) return;
    var t = L();
    var banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', t.cookieLabel);
    banner.innerHTML =
      '<div class="cookie-consent-inner">' +
        '<p class="cookie-consent-text">' + t.cookieText +
          '<a href="' + t.privacyPath + '">' + t.cookiePrivacy + '</a></p>' +
        '<div class="cookie-consent-actions">' +
          '<button type="button" class="btn btn-secondary cookie-consent-necessary">' + t.cookieNecessary + '</button>' +
          '<button type="button" class="btn btn-primary cookie-consent-accept">' + t.cookieAccept + '</button>' +
        '</div></div>';
    document.body.appendChild(banner);

    function closeBanner(value) {
      setConsent(value);
      banner.classList.add('cookie-consent-hidden');
      setTimeout(function () { banner.remove(); }, 300);
    }
    banner.querySelector('.cookie-consent-accept').addEventListener('click', function () { closeBanner('accepted'); });
    banner.querySelector('.cookie-consent-necessary').addEventListener('click', function () { closeBanner('necessary'); });
  }

  function mailtoFallback(cfg, form, fields) {
    var t = L();
    var status = form.querySelector('[data-form-status]');
    if (status) status.textContent = t.formFallback;
    var body = 'Name: ' + fields.name + '\nE-Mail: ' + fields.email + '\nTelefon: ' + fields.phone;
    if (fields.date) body += '\nWunschtermin: ' + fields.date;
    if (fields.time) body += '\nWunschzeit: ' + fields.time;
    body += '\n\nNachricht:\n' + fields.message;
    window.location.href = 'mailto:office@drcenik.at?subject=' + encodeURIComponent(cfg.subject) + '&body=' + encodeURIComponent(body);
  }

  function initForms() {
    var forms = [
      { id: 'contact-form', subject: 'Kontaktanfrage drcenik.at', consentId: 'contact-consent' },
      { id: 'booking-form', subject: 'Terminanfrage drcenik.at', consentId: 'booking-consent' }
    ];
    forms.forEach(function (cfg) {
      var form = document.getElementById(cfg.id);
      if (!form) return;
      var status = form.querySelector('[data-form-status]');
      if (!status) {
        status = document.createElement('p');
        status.className = 'form-status body-text';
        status.setAttribute('data-form-status', '');
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        form.appendChild(status);
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var t = L();
        var consent = document.getElementById(cfg.consentId);
        if (consent && !consent.checked) {
          consent.focus();
          return;
        }
        var fields = {
          name: (form.querySelector('[name="name"]') || {}).value || '',
          email: (form.querySelector('[name="email"]') || {}).value || '',
          phone: (form.querySelector('[name="phone"]') || {}).value || '',
          message: (form.querySelector('[name="message"]') || {}).value || '',
          date: (form.querySelector('[name="preferred_date"]') || {}).value || '',
          time: (form.querySelector('[name="preferred_time"]') || {}).value || ''
        };
        var submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        status.textContent = t.formSending;

        fetch('https://formsubmit.co/ajax/office@drcenik.at', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: fields.name,
            email: fields.email,
            phone: fields.phone,
            message: fields.message,
            preferred_date: fields.date,
            preferred_time: fields.time,
            _subject: cfg.subject,
            _captcha: 'false',
            _template: 'table'
          })
        }).then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        }).then(function () {
          status.textContent = t.formSuccess;
          form.reset();
          try { localStorage.removeItem('drcenik-form-' + (form.id || '')); } catch (e) {}
        }).catch(function () {
          status.textContent = t.formError;
          mailtoFallback(cfg, form, fields);
        }).finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
      });
    });
  }

  function init() {
    initSplash();
    initStickyCta();
    initMapsFab();
    initNavbar();
    initScrollReveal();
    initOpenClosed();
    initLangSwitch();
    initFormAutoSave();
    initCookieBanner();
    initMapsConsent();
    initForms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
