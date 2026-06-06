#!/usr/bin/env node
/**
 * Sync Google rating + review count → data/google-reviews.json + kontakt pages.
 *
 * Usage:
 *   GOOGLE_PLACES_API_KEY=... npm run sync-google-reviews
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  fetchGoogleReviews,
  formatRating,
  formatReviewMeta,
  loadGbpConfig,
  saveGbpConfig,
  starsForRating,
  starsOutline,
} from './lib/google-places-reviews.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data/google-reviews.json');

const KONTAKT_FILES = [
  { file: 'kontakt.html', locale: 'de' },
  { file: 'kontakt-en.html', locale: 'en' },
  { file: 'kontakt-tr.html', locale: 'tr' },
];

function loadEnvFile() {
  const envPath = path.join(ROOT, 'config/google-places.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key && !(key in process.env)) process.env[key] = value;
  }
}

function readEnvKey() {
  loadEnvFile();
  return process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
}

function updateKontaktHtml(filePath, data, locale) {
  let html = fs.readFileSync(filePath, 'utf8');
  const rating = formatRating(data.rating);
  const meta = formatReviewMeta(data.reviewCount, data.syncedAt, locale);
  const stars = starsForRating(data.rating);
  const starsSpaced = starsOutline(data.rating);

  html = html.replace(
    /(<span class="contact-google-stars" aria-hidden="true">)[^<]*(<\/span>)/,
    `$1${stars}$2`,
  );
  html = html.replace(
    /(<strong class="contact-google-score">)[^<]*(<\/strong>)/,
    `$1${rating}$2`,
  );
  html = html.replace(
    /(<p class="contact-google-reviews">)[^<]*(<\/p>)/,
    `$1${meta}$2`,
  );
  html = html.replace(
    /(<span class="contact-reviews-stars-outline" aria-hidden="true">)[^<]*(<\/span>)/,
    `$1${starsSpaced}$2`,
  );
  html = html.replace(
    /(<p class="contact-reviews-score">)[^<]*(<\/p>)/,
    `$1${rating}$2`,
  );
  html = html.replace(
    /(<p class="contact-reviews-count">)[^<]*(<\/p>)/,
    `$1${meta}$2`,
  );

  if (data.reviewUrl) {
    html = html.replace(
      /(<div class="contact-google-reviews-block">[\s\S]*?<a href=")[^"]+(" target="_blank" rel="noopener noreferrer" class="btn btn-primary">)/,
      `$1${data.reviewUrl}$2`,
    );
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

async function main() {
  const apiKey = readEnvKey();
  const gbp = loadGbpConfig();
  const data = await fetchGoogleReviews(apiKey, { gbp });

  if (data.placeId && gbp.placeId !== data.placeId) {
    gbp.placeId = data.placeId;
    saveGbpConfig(gbp);
    console.log(`placeId gespeichert: ${data.placeId}`);
  }

  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`data/google-reviews.json → ${data.rating} ★ · ${data.reviewCount} Bewertungen`);

  for (const { file, locale } of KONTAKT_FILES) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) continue;
    updateKontaktHtml(filePath, data, locale);
    console.log(`${file} aktualisiert (${locale})`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
