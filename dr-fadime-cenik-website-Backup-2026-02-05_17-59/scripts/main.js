/**
 * Dr. Fadime Cenik – Website
 * Mobile navigation & scroll animations
 */

(function () {
  'use strict';

  // --- Mobile CTA: add body class for spacing ---
  var mobileCta = document.getElementById('mobile-cta');
  if (mobileCta && window.matchMedia('(max-width: 768px)').matches) {
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

  // --- Mobile menu toggle ---
  const toggle = document.getElementById('navbar-toggle');
  const links = document.getElementById('navbar-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('active');
      document.body.style.overflow = links.classList.contains('active') ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('active');
        document.body.style.overflow = '';
      });
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

  // --- Google-style Open/Closed (Öffnungszeiten: Mo 7–19, Di–Do 6:30–19, Fr 6:30–17, Sa/So geschlossen) ---
  var openClosedEls = document.querySelectorAll('[data-open-closed]');
  if (openClosedEls.length) {
    var now = new Date();
    var vienna = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Vienna' }));
    var day = vienna.getDay();
    var hour = vienna.getHours();
    var min = vienna.getMinutes();
    var time = hour * 60 + min;
    var isOpen = false;
    if (day === 1) {
      if (time >= 7 * 60 && time < 19 * 60) isOpen = true;
    } else if (day >= 2 && day <= 4) {
      if (time >= 6 * 60 + 30 && time < 19 * 60) isOpen = true;
    } else if (day === 5) {
      if (time >= 6 * 60 + 30 && time < 17 * 60) isOpen = true;
    }
    var openIcon = '<span class="open-closed-icon open-closed-icon-open" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg></span>';
    var closedIcon = '<span class="open-closed-icon open-closed-icon-closed" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>';
    openClosedEls.forEach(function (el) {
      el.classList.add(isOpen ? 'is-open' : 'is-closed');
      el.setAttribute('aria-label', isOpen ? 'Aktuell geöffnet' : 'Aktuell geschlossen');
      el.innerHTML = (isOpen ? openIcon : closedIcon) + '<span class="open-closed-text">' + (isOpen ? 'Geöffnet' : 'Geschlossen') + '</span>';
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

  // --- Cookie-Einwilligung: „Alles akzeptieren“ ---
  var cookieConsentKey = 'drcenik-cookie-consent';
  if (!localStorage.getItem(cookieConsentKey)) {
    var banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie-Hinweis');
    banner.innerHTML =
      '<div class="cookie-consent-inner">' +
        '<p class="cookie-consent-text">Wir verwenden Cookies, um die Nutzung der Website zu erleichtern. Mit „Alles akzeptieren“ stimmen Sie der Verwendung zu. <a href="datenschutz.html">Datenschutzerklärung</a></p>' +
        '<div class="cookie-consent-actions">' +
          '<button type="button" class="btn btn-primary cookie-consent-accept">ALLES AKZEPTIEREN</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);
    banner.querySelector('.cookie-consent-accept').addEventListener('click', function () {
      try { localStorage.setItem(cookieConsentKey, 'accepted'); } catch (e) {}
      banner.classList.add('cookie-consent-hidden');
      setTimeout(function () { banner.remove(); }, 300);
    });
  }
})();
