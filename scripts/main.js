/**
 * Dr. Fadime Cenik – Website
 * Splash screen, mobile navigation & scroll animations
 */

(function () {
  'use strict';

  function init() {

  // --- Splash Screen: Intro-Logo 2 Sekunden (nur einmal pro Session) ---
  (function () {
    var splash = document.getElementById('splash-screen');
    if (!splash) return;
    var HIDDEN = 'splash-screen--hidden';
    var STORAGE_KEY = 'drcenikSplashShown';
    var DURATION_MS = 2000;
    var FADE_MS = 500;

    if (sessionStorage.getItem(STORAGE_KEY)) {
      splash.classList.add(HIDDEN);
      setTimeout(function () { splash.remove(); }, FADE_MS);
      return;
    }

    setTimeout(function () {
      splash.classList.add(HIDDEN);
      sessionStorage.setItem(STORAGE_KEY, '1');
      setTimeout(function () { splash.remove(); }, FADE_MS);
    }, DURATION_MS);
  })();

  // --- Sticky CTA-Bar: body class für Abstand (Desktop & Mobile) ---
  var stickyCta = document.getElementById('sticky-cta') || document.getElementById('mobile-cta');
  if (stickyCta) {
    document.body.classList.add('has-mobile-cta');
  }

  // --- Navbar scroll state ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile menu toggle (Inline-Styles = keine CSS-Überschreibung möglich) ---
  var toggle = document.getElementById('navbar-toggle');
  var links = document.getElementById('navbar-links');
  var menuOpen = false;
  function setMenuOpen(open) {
    menuOpen = !!open;
    if (toggle) toggle.classList.toggle('active', menuOpen);
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
    function onToggle(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      setMenuOpen(!menuOpen);
    }
    toggle.addEventListener('click', onToggle);
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenuOpen(false); });
    });
  }

  // --- Scroll reveal (fade-in-up) ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
      }
    );
    document.querySelectorAll('.fade-in-up').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.fade-in-up').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Open/Closed: Therapie (Mo 7–19, Di–Do 6:30–19, Fr 6:30–17) + Ordination (Mo/Mi 13–18, Di 8–13, Do 7–12) ---
  var openClosedEls = document.querySelectorAll('[data-open-closed]');
  if (openClosedEls.length) {
    var now = new Date();
    var vienna = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Vienna' }));
    var day = vienna.getDay();
    var hour = vienna.getHours();
    var min = vienna.getMinutes();
    var time = hour * 60 + min;

    var isOpenTherapy = false;
    if (day === 1) { if (time >= 7 * 60 && time < 19 * 60) isOpenTherapy = true; }
    else if (day >= 2 && day <= 4) { if (time >= 6 * 60 + 30 && time < 19 * 60) isOpenTherapy = true; }
    else if (day === 5) { if (time >= 6 * 60 + 30 && time < 17 * 60) isOpenTherapy = true; }

    var isOpenOrdination = false;
    if (day === 1 || day === 3) { if (time >= 13 * 60 && time < 18 * 60) isOpenOrdination = true; }
    else if (day === 2) { if (time >= 8 * 60 && time < 13 * 60) isOpenOrdination = true; }
    else if (day === 4) { if (time >= 7 * 60 && time < 12 * 60) isOpenOrdination = true; }

    var lang = (document.documentElement.getAttribute('lang') || 'de').split('-')[0];
    var labels = {
      de: { open: 'Geöffnet', closed: 'Geschlossen', therapy: 'Therapie', ordination: 'Ordination' },
      en: { open: 'Open', closed: 'Closed', therapy: 'Therapy', ordination: 'Practice' },
      tr: { open: 'Açık', closed: 'Kapalı', therapy: 'Terapi', ordination: 'Muayenehane' }
    };
    var L = labels[lang] || labels.de;

    var openIcon = '<span class="open-closed-icon open-closed-icon-open" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg></span>';
    var closedIcon = '<span class="open-closed-icon open-closed-icon-closed" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>';

    openClosedEls.forEach(function (el) {
      var type = (el.getAttribute('data-open-closed') || 'therapy').toLowerCase();
      var isOpen = type === 'ordination' ? isOpenOrdination : isOpenTherapy;
      var inDual = !!el.closest('.contact-profile-status-dual');
      var prefix = (type === 'ordination' ? L.ordination : (inDual ? L.therapy : '')) + (type === 'ordination' || inDual ? ': ' : '');
      var text = prefix + (isOpen ? L.open : L.closed);
      el.classList.add(isOpen ? 'is-open' : 'is-closed');
      el.setAttribute('aria-label', text);
      el.innerHTML = (isOpen ? openIcon : closedIcon) + '<span class="open-closed-text">' + text + '</span>';
    });
  }

  // --- Sprachumschalter DE | TR | EN (aktiv) ---
  (function () {
    var path = window.location.pathname || '';
    var file = path.split('/').pop() || '';
    if (!file && window.location.href) file = window.location.href.split('/').pop().split('?')[0] || 'index.html';
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
  })();

  // --- Auto-Save für alle Formularfelder (DSGVO-konform: nur lokal im Browser) ---
  (function () {
    var STORAGE_PREFIX = 'drcenik-form-';
    var DEBOUNCE_MS = 400;
    var timers = {};

    function formStorageKey(form) {
      var id = form.id && form.id.trim();
      var path = (window.location.pathname || '').replace(/^\//, '') || 'index.html';
      return STORAGE_PREFIX + (id || path) + '-' + [].indexOf.call(document.forms, form);
    }

    function getFormData(form) {
      var data = {};
      var els = form.querySelectorAll('input, textarea, select');
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el.name && el.type !== 'file' && el.type !== 'submit' && el.type !== 'button' && el.type !== 'reset') {
          if (el.type === 'checkbox' || el.type === 'radio') {
            if (el.checked) data[el.name] = el.value || 'on';
          } else {
            data[el.name] = el.value;
          }
        }
      }
      return data;
    }

    function setFormData(form, data) {
      Object.keys(data).forEach(function (name) {
        var el = form.querySelector('[name="' + name + '"]');
        if (!el) return;
        if (el.type === 'checkbox' || el.type === 'radio') {
          el.checked = (el.value ? data[name] === el.value : data[name] === 'on');
        } else {
          el.value = data[name];
        }
      });
    }

    function saveForm(form) {
      var key = formStorageKey(form);
      try {
        var data = getFormData(form);
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {}
    }

    function scheduleSave(form) {
      var key = formStorageKey(form);
      if (timers[key]) clearTimeout(timers[key]);
      timers[key] = setTimeout(function () {
        saveForm(form);
        timers[key] = null;
      }, DEBOUNCE_MS);
    }

    function clearFormStorage(form) {
      try {
        localStorage.removeItem(formStorageKey(form));
      } catch (e) {}
    }

    document.querySelectorAll('form').forEach(function (form) {
      var key = formStorageKey(form);
      try {
        var saved = localStorage.getItem(key);
        if (saved) {
          var data = JSON.parse(saved);
          if (data && typeof data === 'object') setFormData(form, data);
        }
      } catch (e) {}

      form.querySelectorAll('input, textarea, select').forEach(function (el) {
        if (!el.name || el.type === 'file' || el.type === 'submit' || el.type === 'button' || el.type === 'reset') return;
        el.addEventListener('input', function () { scheduleSave(form); });
        el.addEventListener('change', function () { scheduleSave(form); });
      });

      form.addEventListener('submit', function () {
        clearFormStorage(form);
      });
      form.addEventListener('reset', function () {
        setTimeout(function () { clearFormStorage(form); }, 0);
      });
    });
  })();

  // --- Cookie-Einwilligung: „Alles akzeptieren“ / „Nur notwendige“ ---
  var cookieConsentKey = 'drcenik-cookie-consent';
  if (!localStorage.getItem(cookieConsentKey)) {
    var banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie-Hinweis');
    banner.innerHTML =
      '<div class="cookie-consent-inner">' +
        '<p class="cookie-consent-text">Wir verwenden Cookies, um die Nutzung der Website zu erleichtern. <a href="datenschutz.html">Datenschutzerklärung</a></p>' +
        '<div class="cookie-consent-actions">' +
          '<button type="button" class="btn btn-secondary cookie-consent-necessary">Nur notwendige</button>' +
          '<button type="button" class="btn btn-primary cookie-consent-accept">Alles akzeptieren</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);
    function closeBanner(value) {
      try { localStorage.setItem(cookieConsentKey, value); } catch (e) {}
      banner.classList.add('cookie-consent-hidden');
      setTimeout(function () { banner.remove(); }, 300);
    }
    banner.querySelector('.cookie-consent-accept').addEventListener('click', function () { closeBanner('accepted'); });
    banner.querySelector('.cookie-consent-necessary').addEventListener('click', function () { closeBanner('necessary'); });
  }

  } // end init()

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
