/**
 * Tiny boot: load CSS + widget after idle or first pointer.
 * No AI code, no secrets.
 */
(function () {
  'use strict';
  if (window.__drcenikAssistantBoot) return;
  window.__drcenikAssistantBoot = true;
  var meta = document.querySelector('meta[name="drcenik-assistant"]');
  if (meta && /off|false|0/i.test(meta.getAttribute('content') || '')) return;

  var scripts = document.querySelectorAll('script[src]');
  var bootSrc = '';
  for (var i = 0; i < scripts.length; i++) {
    if ((scripts[i].src || '').indexOf('patient-assistant-boot') !== -1) {
      bootSrc = scripts[i].getAttribute('src') || scripts[i].src;
      break;
    }
  }
  var dir = bootSrc.replace(/patient-assistant-boot\.js(\?.*)?$/, '');
  var cssHref = dir.replace(/scripts\/?$/, 'styles/') + 'patient-assistant.css?v=1';
  var jsHref = dir + 'patient-assistant.js?v=1';

  function load() {
    if (window.__drcenikAssistantLoaded) return;
    window.__drcenikAssistantLoaded = true;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    document.head.appendChild(link);
    var s = document.createElement('script');
    s.src = jsHref;
    s.defer = true;
    document.body.appendChild(s);
  }

  var loaded = false;
  function once() {
    if (loaded) return;
    loaded = true;
    load();
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(once, { timeout: 2500 });
  } else {
    setTimeout(once, 1200);
  }
  window.addEventListener('pointerdown', once, { once: true, passive: true });
  window.addEventListener('keydown', once, { once: true });
})();
