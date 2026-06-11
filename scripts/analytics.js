/**
 * Google Analytics 4 – nur nach Cookie-Einwilligung („accepted“).
 * Mess-ID: <meta name="drcenik-ga4" content="G-XXXXXXXX">
 */
(function () {
  'use strict';

  function measurementId() {
    var meta = document.querySelector('meta[name="drcenik-ga4"]');
    var id = meta && meta.getAttribute('content');
    if (!id || id.indexOf('G-') !== 0) return null;
    return id;
  }

  function loadAnalytics() {
    var mid = measurementId();
    if (!mid || window._drcenikGaLoaded) return;
    window._drcenikGaLoaded = true;

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(mid);
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
