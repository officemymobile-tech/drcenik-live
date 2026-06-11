/**
 * Google Analytics 4 – nur nach Cookie-Einwilligung („accepted“).
 * Mess-ID: <meta name="drcenik-ga4" content="G-XXXXXXXX">
 * Web Vitals (LCP, CLS, INP) → GA4-Events nach Consent.
 */
(function () {
  'use strict';

  var WEB_VITALS_SRC = 'scripts/web-vitals.iife.js';
  var webVitalsStarted = false;

  function measurementId() {
    var meta = document.querySelector('meta[name="drcenik-ga4"]');
    var id = meta && meta.getAttribute('content');
    if (!id || id.indexOf('G-') !== 0) return null;
    return id;
  }

  function webVitalsScriptSrc() {
    var base = document.querySelector('script[src*="analytics.js"]');
    if (!base) return WEB_VITALS_SRC;
    var src = base.getAttribute('src') || '';
    if (src.indexOf('/') === -1) return WEB_VITALS_SRC;
    return src.replace(/analytics\.js.*$/, 'web-vitals.iife.js');
  }

  function sendWebVital(metric) {
    if (typeof window.gtag !== 'function') return;
    var name = metric.name;
    var rounded = Math.round(name === 'CLS' ? metric.delta * 1000 : metric.delta);
    window.gtag('event', name, {
      value: rounded,
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
      non_interaction: true,
    });
  }

  function initWebVitals() {
    if (webVitalsStarted || typeof window.webVitals === 'undefined') return;
    webVitalsStarted = true;
    var wv = window.webVitals;
    if (wv.onLCP) wv.onLCP(sendWebVital);
    if (wv.onCLS) wv.onCLS(sendWebVital);
    if (wv.onINP) wv.onINP(sendWebVital);
  }

  function loadWebVitals() {
    if (webVitalsStarted || document.querySelector('script[data-drcenik-web-vitals]')) return;
    var script = document.createElement('script');
    script.src = webVitalsScriptSrc();
    script.defer = true;
    script.setAttribute('data-drcenik-web-vitals', '1');
    script.onload = initWebVitals;
    document.head.appendChild(script);
    if (window.webVitals) initWebVitals();
  }

  function loadAnalytics() {
    var mid = measurementId();
    if (!mid || window._drcenikGaLoaded) return;
    window._drcenikGaLoaded = true;

    var preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://www.googletagmanager.com';
    preconnect.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect);

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(mid);
    script.onload = function () {
      loadWebVitals();
    };
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', mid, { anonymize_ip: true, allow_google_signals: false });
  }

  window.drcenikLoadAnalytics = loadAnalytics;

  try {
    if (localStorage.getItem('drcenik-cookie-consent') === 'accepted') {
      loadAnalytics();
    }
  } catch (e) {}

  document.addEventListener('drcenik:consent', function (ev) {
    if (ev.detail && ev.detail.value === 'accepted') {
      loadAnalytics();
    }
  });
})();
