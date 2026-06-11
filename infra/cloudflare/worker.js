/**
 * Edge-301 + Security-Headers für drcenik.at vor GitHub Pages.
 * Deploy: npx wrangler deploy (siehe README.md, AKTIVIERUNG.md)
 *
 * Optional: GET /api/google-reviews – cached Places API proxy (Secret GOOGLE_PLACES_API_KEY).
 */
const CANONICAL = 'https://www.drcenik.at';
const PLACES_BASE = 'https://places.googleapis.com/v1';
const PLACES_FIELD_MASK = 'rating,userRatingCount';
const REVIEWS_CACHE_TTL = 60 * 60 * 6;

/**
 * CSP abgestimmt auf statische Site: self-hosted Assets, GA4/Maps nach Consent,
 * FormSubmit, img onerror-Fallbacks (script-src-attr), wenige inline styles (404).
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com",
  "script-src-attr 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://formsubmit.co",
  "frame-src https://www.google.com",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ');

/** @type {Record<string, string>} */
const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
  'Content-Security-Policy': CONTENT_SECURITY_POLICY,
};

/** @param {Headers} headers */
function applySecurityHeaders(headers) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
}

/** @param {Response} response */
function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  applySecurityHeaders(headers);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/** @param {URL} url */
function redirect301(url, targetPath, search = '') {
  const dest = `${CANONICAL}${targetPath}${search}`;
  return withSecurityHeaders(Response.redirect(dest, 301));
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

  if (path === '/index.html' || path === '/Index.html') {
    return redirect301(url, '/', search);
  }

  if (path === '/267059-geschenkgutschein-vorlage.html') {
    return redirect301(url, '/geschenkgutschein.html', search);
  }

  /** @type {Record<string, string>} */
  const legacyI18n = {
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
    '/en/index.html': '/en/',
  };
  if (legacyI18n[path]) {
    return redirect301(url, legacyI18n[path], search);
  }

  if (/^\/\/+/.test(path)) {
    path = path.replace(/^\/+/, '/');
    return redirect301(url, path, search);
  }

  if (/^\/[^/]+\.html\/+\/?$/i.test(path)) {
    return redirect301(url, path.replace(/\/+$/, ''), search);
  }

  if (url.protocol === 'http:') {
    return redirect301(url, path || '/', search);
  }

  return null;
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': CANONICAL,
    'Cache-Control': `public, max-age=${REVIEWS_CACHE_TTL}`,
    ...extraHeaders,
  });
  applySecurityHeaders(headers);
  return new Response(JSON.stringify(data), { status, headers });
}

/** @param {string} apiKey @param {string} placeId */
async function fetchPlaceReviews(apiKey, placeId) {
  const res = await fetch(`${PLACES_BASE}/places/${encodeURIComponent(placeId)}`, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': PLACES_FIELD_MASK,
    },
  });

  if (!res.ok) {
    throw new Error(`Places API ${res.status}`);
  }

  const details = await res.json();
  const rating = Number(details.rating);
  const reviewCount = Number(details.userRatingCount);

  if (!Number.isFinite(rating) || !Number.isFinite(reviewCount)) {
    throw new Error('Missing rating/userRatingCount');
  }

  return {
    placeId,
    rating: Math.round(rating * 10) / 10,
    reviewCount: Math.round(reviewCount),
    syncedAt: new Date().toISOString(),
    reviewUrl:
      'https://www.google.com/maps/place/Dr.Fadime+Cenik/@48.1588483,16.4717764,17z/data=!4m6!3m5!1s0x476dabdc170b5eb7:0xe05e264828e86fd6!8m2!3d48.1588483!4d16.4717764!16s%2Fg%2F11yx9rm5zy!9m1!1b1',
    mapsUrl: 'https://www.google.com/maps?cid=16167401803672481750',
  };
}

/** @param {Request} request @param {Record<string, string>} env */
async function handleGoogleReviews(request, env) {
  if (request.method === 'OPTIONS') {
    const headers = new Headers({
      'Access-Control-Allow-Origin': CANONICAL,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Max-Age': '86400',
    });
    applySecurityHeaders(headers);
    return new Response(null, { headers });
  }

  const apiKey = env.GOOGLE_PLACES_API_KEY;
  const placeId = env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return jsonResponse({ error: 'Reviews API not configured' }, 503, {
      'Cache-Control': 'no-store',
    });
  }

  const cache = caches.default;
  const cacheKey = new Request(`${CANONICAL}/api/google-reviews`, { method: 'GET' });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchPlaceReviews(apiKey, placeId);
    const response = jsonResponse(data);
    await cache.put(cacheKey, response.clone());
    return response;
  } catch (err) {
    return jsonResponse({ error: 'Upstream fetch failed' }, 502, {
      'Cache-Control': 'no-store',
    });
  }
}

export default {
  /** @param {Request} request @param {Record<string, string>} env */
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/google-reviews') {
      return handleGoogleReviews(request, env);
    }

    const blocked = normalizeRequest(request);
    if (blocked) return blocked;

    // GitHub Pages antwortet nur mit Host www.drcenik.at (nicht *.github.io).
    // resolveOverride leitet DNS auf GitHub, URL/Host bleiben die Custom Domain.
    const originRequest = new Request(request.url, request);
    const originResponse = await fetch(originRequest, {
      cf: { resolveOverride: 'officemymobile-tech.github.io' },
      redirect: 'manual',
    });

    return withSecurityHeaders(originResponse);
  },
};
