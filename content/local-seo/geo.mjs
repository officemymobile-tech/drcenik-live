/**
 * Geo-SEO – liest zentrale Konfiguration aus config/seo-geo.json
 * Änderungen nur dort + npm run sync-seo-geo
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const cfg = JSON.parse(
  fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../../config/seo-geo.json'), 'utf8')
);

const de = cfg.copy.de;
const p = cfg.practice;

export const GEO = {
  addr: `${p.street}, ${p.postalCode} ${p.city} (${p.district})`,
  district: de.district,
  region: de.region,
  overline: de.overline,
  reachLine: de.reachLine,
  terminCta: de.terminCta,
  terminText: de.terminText,
  phone: '01 / 769 29 91',
  radiusKm: cfg.serviceRadiusKm,
};

export const AREA_SERVED_SCHEMA = cfg.schema.areaServed;
export const SERVICE_AREA_SCHEMA = cfg.schema.serviceArea;
