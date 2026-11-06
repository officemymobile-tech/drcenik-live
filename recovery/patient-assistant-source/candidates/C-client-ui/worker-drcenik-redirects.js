var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker.js
var CANONICAL = "https://www.drcenik.at";
var PAGES_ORIGIN = "https://drcenik-live.pages.dev";
var PAGES_HOST = "drcenik-live.pages.dev";
var PLACES_BASE = "https://places.googleapis.com/v1";
var PLACES_FIELD_MASK = "rating,userRatingCount";
var REVIEWS_CACHE_TTL = 60 * 60 * 6;
var CONTENT_SECURITY_POLICY = [
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
  "upgrade-insecure-requests"
].join("; ");
var SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  "Content-Security-Policy": CONTENT_SECURITY_POLICY
};
function applySecurityHeaders(headers) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
}
__name(applySecurityHeaders, "applySecurityHeaders");
function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  applySecurityHeaders(headers);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
__name(withSecurityHeaders, "withSecurityHeaders");
function isBlockedInternalPath(pathname) {
  const p = pathname.toLowerCase();
  if (p === "/package.json" || p === "/package-lock.json" || p === "/.mcp.json") return true;
  if (p === "/.gitignore" || p === "/.cfignore" || p === "/.nojekyll") return true;
  if (p === "/lighthouse-mobile.json" || p === "/skills-lock.json") return true;
  if (p.startsWith("/.claude") || p.startsWith("/.github") || p.startsWith("/.git")) return true;
  if (p.startsWith("/.cursor") || p.startsWith("/.wrangler") || p.startsWith("/.impeccable")) return true;
  if (p.startsWith("/config/") || p === "/config") return true;
  if (p.startsWith("/content/") || p === "/content") return true;
  if (p.startsWith("/infra/") || p === "/infra") return true;
  if (p.startsWith("/seo/") || p === "/seo") return true;
  if (p.startsWith("/logs/") || p.startsWith("/tmp-") || p.startsWith("/preview-")) return true;
  if (p.startsWith("/node_modules/") || p.startsWith("/.env")) return true;
  if (p.endsWith(".md") || p.endsWith(".mjs") || p.endsWith(".toml") || p.endsWith(".env")) return true;
  if (p === "/scripts/optimize-images.js") return true;
  return false;
}
__name(isBlockedInternalPath, "isBlockedInternalPath");
function blockedInternalResponse() {
  const headers = new Headers({
    "Cache-Control": "no-store, max-age=0",
    "CDN-Cache-Control": "no-store",
    "Content-Type": "text/plain; charset=utf-8"
  });
  applySecurityHeaders(headers);
  return new Response("Not found", { status: 404, headers });
}
__name(blockedInternalResponse, "blockedInternalResponse");
function redirect301(url, targetPath, search = "") {
  const dest = `${CANONICAL}${targetPath}${search}`;
  return withSecurityHeaders(Response.redirect(dest, 301));
}
__name(redirect301, "redirect301");
function normalizeRequest(request) {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const search = url.search;
  let path = url.pathname;
  if (host === "drcenik.at") {
    return redirect301(url, path === "" ? "/" : path, search);
  }
  if (path === "/index.html" || path === "/Index.html") {
    return redirect301(url, "/", search);
  }
  if (path === "/267059-geschenkgutschein-vorlage.html") {
    return redirect301(url, "/geschenkgutschein.html", search);
  }
  const legacyI18n = {
    "/index-tr.html": "/tr/",
    "/index-en.html": "/en/",
    "/ueber-uns-tr.html": "/tr/ueber-uns.html",
    "/ueber-uns-en.html": "/en/ueber-uns.html",
    "/therapieangebot-tr.html": "/tr/therapieangebot.html",
    "/therapieangebot-en.html": "/en/therapieangebot.html",
    "/r-force-tr.html": "/tr/r-force.html",
    "/r-force-en.html": "/en/r-force.html",
    "/wissen-news-tr.html": "/tr/wissen-news.html",
    "/wissen-news-en.html": "/en/wissen-news.html",
    "/faq-tr.html": "/tr/faq.html",
    "/faq-en.html": "/en/faq.html",
    "/kontakt-tr.html": "/tr/kontakt.html",
    "/kontakt-en.html": "/en/kontakt.html",
    "/impressum-tr.html": "/tr/impressum.html",
    "/impressum-en.html": "/en/impressum.html",
    "/datenschutz-tr.html": "/tr/datenschutz.html",
    "/datenschutz-en.html": "/en/datenschutz.html",
    "/agb-tr.html": "/tr/agb.html",
    "/agb-en.html": "/en/agb.html",
    "/termin-tr.html": "/tr/",
    "/termin-en.html": "/en/",
    "/termin.html": "/",
    "/tr/termin.html": "/tr/",
    "/en/termin.html": "/en/",
    "/tr/index.html": "/tr/",
    "/en/index.html": "/en/"
  };
  if (legacyI18n[path]) {
    return redirect301(url, legacyI18n[path], search);
  }
  if (/^\/\/+/.test(path)) {
    path = path.replace(/^\/+/, "/");
    return redirect301(url, path, search);
  }
  if (/^\/[^/]+\.html\/+\/?$/i.test(path)) {
    return redirect301(url, path.replace(/\/+$/, ""), search);
  }
  if (url.protocol === "http:") {
    return redirect301(url, path || "/", search);
  }
  return null;
}
__name(normalizeRequest, "normalizeRequest");
function jsonResponse(data, status = 200, extraHeaders = {}) {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": CANONICAL,
    "Cache-Control": `public, max-age=${REVIEWS_CACHE_TTL}`,
    ...extraHeaders
  });
  applySecurityHeaders(headers);
  return new Response(JSON.stringify(data), { status, headers });
}
__name(jsonResponse, "jsonResponse");
async function fetchPlaceReviews(apiKey, placeId) {
  const res = await fetch(`${PLACES_BASE}/places/${encodeURIComponent(placeId)}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": PLACES_FIELD_MASK
    }
  });
  if (!res.ok) {
    throw new Error(`Places API ${res.status}`);
  }
  const details = await res.json();
  const rating = Number(details.rating);
  const reviewCount = Number(details.userRatingCount);
  if (!Number.isFinite(rating) || !Number.isFinite(reviewCount)) {
    throw new Error("Missing rating/userRatingCount");
  }
  return {
    placeId,
    rating: Math.round(rating * 10) / 10,
    reviewCount: Math.round(reviewCount),
    syncedAt: (/* @__PURE__ */ new Date()).toISOString(),
    reviewUrl: "https://www.google.com/maps/place/Dr.Fadime+Cenik/@48.1588483,16.4717764,17z/data=!4m6!3m5!1s0x476dabdc170b5eb7:0xe05e264828e86fd6!8m2!3d48.1588483!4d16.4717764!16s%2Fg%2F11yx9rm5zy!9m1!1b1",
    mapsUrl: "https://www.google.com/maps?cid=16167401803672481750"
  };
}
__name(fetchPlaceReviews, "fetchPlaceReviews");
async function handleGoogleReviews(request, env) {
  if (request.method === "OPTIONS") {
    const headers = new Headers({
      "Access-Control-Allow-Origin": CANONICAL,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Max-Age": "86400"
    });
    applySecurityHeaders(headers);
    return new Response(null, { headers });
  }
  const apiKey = env.GOOGLE_PLACES_API_KEY;
  const placeId = env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) {
    return jsonResponse({ error: "Reviews API not configured" }, 503, {
      "Cache-Control": "no-store"
    });
  }
  const cache = caches.default;
  const cacheKey = new Request(`${CANONICAL}/api/google-reviews`, { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  try {
    const data = await fetchPlaceReviews(apiKey, placeId);
    const response = jsonResponse(data);
    await cache.put(cacheKey, response.clone());
    return response;
  } catch (err) {
    return jsonResponse({ error: "Upstream fetch failed" }, 502, {
      "Cache-Control": "no-store"
    });
  }
}
__name(handleGoogleReviews, "handleGoogleReviews");
function cancelBody(body) {
  if (body && typeof body.cancel === "function") {
    try {
      body.cancel();
    } catch {
    }
  }
}
__name(cancelBody, "cancelBody");
async function fetchPagesPath(request, pathname) {
  const url = new URL(request.url);
  const pagesUrl = `${PAGES_ORIGIN}${pathname}${url.search}`;
  const headers = new Headers(request.headers);
  headers.set("Cache-Control", "no-cache");
  headers.set("Pragma", "no-cache");
  return fetch(pagesUrl, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? void 0 : request.body,
    redirect: "manual",
    cf: { resolveOverride: PAGES_HOST, cacheTtl: 0, cacheEverything: false }
  });
}
__name(fetchPagesPath, "fetchPagesPath");
async function fetchPages(request) {
  const url = new URL(request.url);
  return fetchPagesPath(request, url.pathname === "" ? "/" : url.pathname);
}
__name(fetchPages, "fetchPages");
function locationPathname(response, requestUrl) {
  const loc = response.headers.get("Location");
  if (!loc) return "";
  try {
    return new URL(loc, requestUrl).pathname;
  } catch {
    return loc;
  }
}
__name(locationPathname, "locationPathname");
function isExtensionlessHtmlCandidate(path) {
  if (!path || path === "/") return false;
  if (path.endsWith("/")) return false;
  if (path.includes(".")) return false;
  if (path.startsWith("/api/")) return false;
  return true;
}
__name(isExtensionlessHtmlCandidate, "isExtensionlessHtmlCandidate");
async function fetchPagesCanonicalHtml(request) {
  const url = new URL(request.url);
  const path = url.pathname === "" ? "/" : url.pathname;
  if (/\.html$/i.test(path)) {
    const htmlResponse = await fetchPagesPath(request, path);
    if (htmlResponse.status >= 300 && htmlResponse.status < 400) {
      const dest = locationPathname(htmlResponse, url.href);
      const pretty = path.replace(/\.html$/i, "");
      if (dest === pretty || dest === `${pretty}/`) {
        cancelBody(htmlResponse.body);
        return fetchPagesPath(request, dest);
      }
    }
    return htmlResponse;
  }
  if (isExtensionlessHtmlCandidate(path)) {
    const prettyResponse = await fetchPagesPath(request, path);
    if (prettyResponse.status >= 300 && prettyResponse.status < 400) {
      return prettyResponse;
    }
    if (prettyResponse.status === 200) {
      cancelBody(prettyResponse.body);
      return redirect301(url, `${path}.html`, url.search);
    }
    return prettyResponse;
  }
  return fetchPages(request);
}
__name(fetchPagesCanonicalHtml, "fetchPagesCanonicalHtml");
var worker_default = {
  /** @param {Request} request @param {Record<string, string>} env */
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/google-reviews") {
      return handleGoogleReviews(request, env);
    }
    const blockedInternal = isBlockedInternalPath(url.pathname);
    if (blockedInternal) {
      return blockedInternalResponse();
    }
    const blocked = normalizeRequest(request);
    if (blocked) return blocked;
    const originResponse = await fetchPagesCanonicalHtml(request);
    return withSecurityHeaders(originResponse);
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
