/**
 * Client-side redirects when no edge proxy (Cloudflare) is active.
 * Loaded synchronously in <head> — before render where possible.
 */
(function () {
  var proto = location.protocol;
  var host = location.hostname.toLowerCase();
  var path = location.pathname;
  var search = location.search;
  var hash = location.hash;

  if (host === 'drcenik.at') {
    location.replace('https://www.drcenik.at' + path + search + hash);
    return;
  }

  if (/^\/index\.html$/i.test(path)) {
    location.replace('https://www.drcenik.at/' + search + hash);
    return;
  }

  if (path === '/267059-geschenkgutschein-vorlage.html') {
    location.replace('https://www.drcenik.at/geschenkgutschein.html' + search + hash);
    return;
  }

  var legacyI18n = {
    '/index-tr.html': '/tr/',
    '/index-en.html': '/en/',
    '/ueber-uns-tr.html': '/tr/ueber-uns.html',
    '/ueber-uns-en.html': '/en/ueber-uns.html',
    '/therapieangebot-tr.html': '/tr/therapieangebot.html',
    '/therapieangebot-en.html': '/en/therapieangebot.html',
    '/r-force-tr.html': '/tr/r-force.html',
    '/r-force-en.html': '/en/r-force.html',
    '/wissen-news-tr.html': '/tr/wissen-news.html',
    '/wissen-news-en.html': '/en/wissen-news.html',
    '/faq-tr.html': '/tr/faq.html',
    '/faq-en.html': '/en/faq.html',
    '/kontakt-tr.html': '/tr/kontakt.html',
    '/kontakt-en.html': '/en/kontakt.html',
    '/impressum-tr.html': '/tr/impressum.html',
    '/impressum-en.html': '/en/impressum.html',
    '/datenschutz-tr.html': '/tr/datenschutz.html',
    '/datenschutz-en.html': '/en/datenschutz.html',
    '/agb-tr.html': '/tr/agb.html',
    '/agb-en.html': '/en/agb.html',
    '/termin-tr.html': '/tr/termin.html',
    '/termin-en.html': '/en/termin.html',
    '/tr/index.html': '/tr/',
    '/en/index.html': '/en/'
  };
  if (legacyI18n[path]) {
    location.replace('https://www.drcenik.at' + legacyI18n[path] + search + hash);
    return;
  }

  if (/^\/[^/]+\.html\/+\/?$/i.test(path)) {
    location.replace('https://www.drcenik.at' + path.replace(/\/+$/, '') + search + hash);
    return;
  }

  if (proto === 'http:') {
    location.replace('https://' + location.host + path + search + hash);
  }
})();
