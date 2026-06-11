/**
 * Edge-301 für drcenik.at vor GitHub Pages.
 * Deploy: npx wrangler deploy (siehe README.md)
 *
 * Optional: GET /api/google-reviews – cached Places API proxy (Secret GOOGLE_PLACES_API_KEY).
 */
const CANONICAL = 'https://www.drcenik.at';
const GITHUB_ORIGIN = 'https://officemymobile-tech.github.io';
const PLACES_BASE = 'https://places.googleapis.com/v1';
const PLACES_FIELD_MASK = 'rating,userRatingCount';
const REVIEWS_CACHE_TTL = 60 * 60 * 6;

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

  if (url.protocol === 'http:') {
    return redirect301(url, path || '/', search);
  }

  return null;
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': CANONICAL,
      'Cache-Control': `public, max-age=${REVIEWS_CACHE_TTL}`,
      ...extraHeaders,
    },
  });
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
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': CANONICAL,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
    });
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
