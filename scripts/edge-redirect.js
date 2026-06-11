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

  if (/^\/[^/]+\.html\/+\/?$/i.test(path)) {
    location.replace('https://www.drcenik.at' + path.replace(/\/+$/, '') + search + hash);
    return;
  }

  if (proto === 'http:') {
    location.replace('https://' + location.host + path + search + hash);
  }
})();
