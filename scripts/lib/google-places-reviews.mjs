/**
 * Google Places API (New) – rating & review count for Dr. Cenik GBP location.
 * Shared by sync script and Cloudflare Worker.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const GBP_PATH = path.join(ROOT, 'config/gbp.json');

const PLACES_BASE = 'https://places.googleapis.com/v1';
const FIELD_MASK = 'id,rating,userRatingCount';

export function loadGbpConfig() {
  return JSON.parse(fs.readFileSync(GBP_PATH, 'utf8'));
}

export function saveGbpConfig(gbp) {
  fs.writeFileSync(GBP_PATH, `${JSON.stringify(gbp, null, 2)}\n`, 'utf8');
}

function normalizePlaceId(id) {
  if (!id) return null;
  return id.startsWith('places/') ? id.slice('places/'.length) : id;
}

async function placesFetch(url, apiKey, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': FIELD_MASK,
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Places API ${res.status}: ${body}`);
  }

  return res.json();
}

async function resolvePlaceId(gbp, apiKey) {
  if (gbp.placeId) return normalizePlaceId(gbp.placeId);

  const textQuery = `${gbp.businessName}, ${gbp.address}`;
  const data = await placesFetch(`${PLACES_BASE}/places:searchText`, apiKey, {
    method: 'POST',
    body: JSON.stringify({ textQuery }),
  });

  const place = data.places?.[0];
  if (!place?.id) {
    throw new Error(`Kein Place für "${textQuery}" gefunden.`);
  }

  return normalizePlaceId(place.id);
}

export async function fetchGoogleReviews(apiKey, options = {}) {
  if (!apiKey) {
    throw new Error('GOOGLE_PLACES_API_KEY fehlt.');
  }

  const gbp = options.gbp || loadGbpConfig();
  const placeId = await resolvePlaceId(gbp, apiKey);
  const details = await placesFetch(`${PLACES_BASE}/places/${encodeURIComponent(placeId)}`, apiKey);

  const rating = Number(details.rating);
  const reviewCount = Number(details.userRatingCount);

  if (!Number.isFinite(rating) || !Number.isFinite(reviewCount)) {
    throw new Error('Places API lieferte kein rating/userRatingCount.');
  }

  return {
    placeId,
    rating: Math.round(rating * 10) / 10,
    reviewCount: Math.round(reviewCount),
    syncedAt: new Date().toISOString(),
    reviewUrl: gbp.reviewUrl,
    mapsUrl: gbp.mapsCidUrl || gbp.mapsPlaceUrl,
  };
}

export function starsForRating(rating) {
  const full = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return `${'★'.repeat(full)}${'☆'.repeat(5 - full)}`;
}

export function starsOutline(rating) {
  return starsForRating(rating).split('').join(' ');
}

const MONTHS = {
  de: [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ],
  tr: [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
  ],
};

export function formatReviewMeta(reviewCount, syncedAt, locale = 'de') {
  const date = syncedAt ? new Date(syncedAt) : new Date();
  const count = Math.max(0, Math.round(Number(reviewCount) || 0));

  if (locale === 'en') {
    const monthYear = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(date);
    const label = count === 1 ? 'review' : 'reviews';
    return `${count} ${label} · As of ${monthYear}`;
  }

  if (locale === 'tr') {
    const monthYear = `${MONTHS.tr[date.getMonth()]} ${date.getFullYear()}`;
    return `${count} değerlendirme · Durum: ${monthYear}`;
  }

  const monthYear = `${MONTHS.de[date.getMonth()]} ${date.getFullYear()}`;
  const label = count === 1 ? 'Bewertung' : 'Bewertungen';
  return `${count} ${label} · Stand: ${monthYear}`;
}

export function formatRating(rating) {
  return (Math.round(Number(rating) * 10) / 10).toFixed(1);
}
