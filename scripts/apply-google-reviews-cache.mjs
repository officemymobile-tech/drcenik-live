#!/usr/bin/env node
/**
 * Apply data/google-reviews.json to kontakt pages (no API call).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  formatRating,
  formatReviewMeta,
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

  fs.writeFileSync(filePath, html, 'utf8');
}

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
for (const { file, locale } of KONTAKT_FILES) {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) continue;
  updateKontaktHtml(filePath, data, locale);
  console.log(`${file} ← ${data.rating} ★ · ${data.reviewCount}`);
}
