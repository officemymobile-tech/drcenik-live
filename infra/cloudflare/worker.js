/**
 * Edge-301 für drcenik.at vor GitHub Pages.
 * Deploy: npx wrangler deploy (siehe README.md)
 */
const CANONICAL = 'https://www.drcenik.at';
const GITHUB_ORIGIN = 'https://officemymobile-tech.github.io';

/** @param {URL} url */
function redirect301(url, targetPath, search = '') {
  const dest = `${CANONICAL}${targetPath}${search}`;
  return Response.redirect(dest, 301);
}

/** @param {Request} request */
function normalizeRequest(request) {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const search = url.search;
  let path = url.pathname;

  if (host === 'drcenik.at') {
    return redirect301(url, path === '' ? '/' : path, search);
  }

  if (url.protocol === 'http:') {
    return redirect301(url, path || '/', search);
  }

  if (path === '/index.html' || path === '/Index.html') {
    return redirect301(url, '/', search);
  }

  if (path === '/267059-geschenkgutschein-vorlage.html') {
    return redirect301(url, '/geschenkgutschein.html', search);
  }

  if (/^\/\/+/.test(path)) {
    path = path.replace(/^\/+/, '/');
    return redirect301(url, path, search);
  }

  if (/^\/[^/]+\.html\/+\/?$/i.test(path)) {
    return redirect301(url, path.replace(/\/+$/, ''), search);
  }

  return null;
}

export default {
  /** @param {Request} request */
  async fetch(request) {
    const blocked = normalizeRequest(request);
    if (blocked) return blocked;

    const url = new URL(request.url);
    const originUrl = `${GITHUB_ORIGIN}${url.pathname}${url.search}`;

    const headers = new Headers(request.headers);
    headers.set('Host', 'www.drcenik.at');

    const originResponse = await fetch(originUrl, {
      method: request.method,
      headers,
      redirect: 'manual',
    });

    return new Response(originResponse.body, {
      status: originResponse.status,
      statusText: originResponse.statusText,
      headers: originResponse.headers,
    });
  },
};
