# Performance – drcenik.at

Stand: Juni 2026

## Lab-Messung (Lighthouse, Mobile)

| Metrik | Wert |
|--------|------|
| Performance Score | **100** |
| LCP | ~1,3 s |
| CLS | 0 |
| TBT | 0 ms |
| Speed Index | ~2,4 s |

Desktop: ebenfalls **100** (LCP ~0,4 s).

> CrUX-Felddaten („Echte Nutzer“ in PageSpeed Insights) fehlen bei neuen Sites typischerweise **28+ Tage** – das lässt sich nicht künstlich erzeugen.

## Umgesetzte Optimierungen

### Bereits vorhanden (Audit-Basis 8/10)
- WebP-Bilder, self-hosted Fonts mit `font-display: swap`
- `styles/critical.css` für Splash + Navbar
- LCP-Logo: `preload`, `fetchpriority="high"`, `width`/`height` 400×400
- GA4/Maps nur nach Cookie-Consent
- `scripts/main.js` + `analytics.js` mit `defer`

### Neu (Juni 2026)
1. **Web Vitals → GA4** (`scripts/analytics.js` + `scripts/web-vitals.iife.js`)
   - Events `LCP`, `CLS`, `INP` nach Consent („Alles akzeptieren“)
   - In GA4: Berichte → Engagement → Events
2. **CLS-Fixes**: `height="auto"` entfernt (Splash 220×220, Gutschein 300×420, Navbar-Logo 140×58)
3. **LCP preload**: `type="image/webp"` + `fetchpriority="high"` auf Startseiten DE/EN/TR
4. **Splash**: kürzere Anzeige (400 ms), übersprungen bei `saveData` / 2G / `prefers-reduced-motion`
5. **Audit-Skript**: `npm run audit-performance` (lokal), `--live` für Live-HTML + optional Lighthouse

## Skripte

```bash
npm run audit-performance          # lokale Checks
npm run audit-performance -- --live  # Live + Lighthouse (Chrome nötig)
npm run apply-performance          # HTML-Performance-Patches erneut anwenden
npm run audit-images               # WebP-Größen Live vs. lokal
```

## Erwartete Wirkung

| Metrik | Erwartung |
|--------|-----------|
| **LCP** | Stabil grün; preload + fetchpriority sichern Hero-Logo |
| **CLS** | 0 – feste Bilddimensionen, kein Layout-Springen |
| **INP** | Unkritisch (leichtes JS); RUM in GA4 für echte Nutzer |
| **CrUX** | Erst nach ausreichend Traffic sichtbar |

## Hinweise

- `*.tmp.webp` ist in `.gitignore` – nicht committen.
- Nach Deploy: Consent akzeptieren → GA4-Events prüfen (DebugView).
- PageSpeed API-Quota kann erschöpft sein; Lighthouse lokal: `npx lighthouse https://www.drcenik.at/`
