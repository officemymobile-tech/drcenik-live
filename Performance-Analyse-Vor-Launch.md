# Performance-Analyse vor dem Livegang – Dr. Fadime Cenik Website

Ausführliche Untersuchung zu Ladezeiten, Core Web Vitals, Bildoptimierung, CSS/JS, Fonts, Lazy Loading, Caching und typischen Performance-Problemen. Am Ende: **konkrete Befunde** und **Handlungsempfehlungen**.

---

## 1. Ladezeiten der Seiten (insbesondere mobil)

### Was geprüft wird
- Zeit bis First Contentful Paint (FCP) und Largest Contentful Paint (LCP)
- Zeit bis Interactive (TTI) / Total Blocking Time (TBT)
- Gesamte Ladezeit und Größe der übertragenen Daten (insbesondere auf 3G/4G-Simulation)

### Warum es wichtig ist
- Langsame Ladezeiten erhöhen Absprungraten und verschlechtern das Ranking (Page Experience).
- Mobil ist oft die langsamere Verbindung; hier wirken schwere Ressourcen am stärksten.

### Wie man es testet
- **PageSpeed Insights** (https://pagespeed.web.dev/): URL eingeben, Mobile- und Desktop-Report prüfen
- **Chrome DevTools** → Network: Throttling „Fast 3G“ oder „Slow 4G“, Reload, Wasserfall analysieren
- **WebPageTest** (https://www.webpagetest.org/): Mehrere Standorte, First View / Repeat View

### Idealer Zustand
- LCP (Mobile) < 2,5 s
- FCP < 1,8 s
- TBT < 200 ms
- Gesamtgröße pro Seite (ohne Video) möglichst < 2–3 MB auf erster Ladung

### Befund Ihre Website
| Ressource | Größe (ca.) | Hinweis |
|-----------|-------------|--------|
| **main.css** | ~117 KB | Einzelne, große CSS-Datei; kein kritischer Pfad optimiert |
| **main.js** | ~10 KB | Klein, am Ende des Body – gut |
| **Google Fonts (CSS + Fonts)** | ~30–80 KB (je nach Subset) | Render-blockierend, Third-Party |
| **assets/gutschein.png** | **~5.300 KB (5,3 MB)** | **Kritisch** – wird auf Startseite mit `loading="lazy"` geladen |
| **assets/images/kassen/kfa-logo.png** | **~4.410 KB (4,4 MB)** | **Kritisch** – Kassen-Logo viel zu groß |
| **assets/logo.jpg** | ~625 KB | Eager geladen (Above-the-fold); sollte komprimiert werden |
| **assets/visitenkarte-qr.png** | ~353 KB | Auf Über-uns; komprimieren oder verkleinern |
| **assets/images/wissen-news/*.jpg** | 38–71 KB je Bild | Bereits in Ordnung (lazy) |
| **r-force** (falls genutzt) | JPG 5–6 MB, WebP 55–178 KB | WebP-Varianten vorhanden – nutzen |

**Fazit Ladezeiten:** Die **Startseite** lädt auf Mobil bei langsamer Verbindung mehrere MB (allein gutschein.png + kfa-logo.png + logo.jpg ≈ 10+ MB). Das führt zu sehr langen Ladezeiten und schlechten LCP-Werten. Nach Optimierung der großen Bilder und Fonts/CSS sind spürbare Verbesserungen zu erwarten.

---

## 2. Lighthouse- und PageSpeed-Metriken

### Was geprüft wird
- **Performance-Score** (0–100)
- **FCP, LCP, TBT, CLS, Speed Index**
- **Best Practices** und **Accessibility** (indirekt performance-relevant)
- **SEO** (bereits in separater Checkliste)

### Warum es wichtig ist
- Lighthouse bildet reale Nutzerbedingungen nach und gibt konkrete Verbesserungsvorschläge.
- Google nutzt ähnliche Signale für Page Experience.

### Wie man es testet
- PageSpeed Insights (Mobile + Desktop)
- Chrome DevTools → Lighthouse-Tab (Mobile, „Clear storage“ vorher optional)
- Nach jeder größeren Änderung erneut messen

### Idealer Zustand
- Performance (Mobile) ≥ 90; LCP grün, CLS grün, TBT gering
- Keine „Avoid enormous network payloads“-Warnung

### Befund Ihre Website
- **Ohne Live-URL** kann kein exakter Lighthouse-Score angegeben werden.
- **Erwartung bei aktuellem Stand:** Performance wird durch **grosse Bilder** (gutschein.png, kfa-logo.png, logo.jpg) stark belastet → typische Warnungen: „Properly size images“, „Defer offscreen images“, „Reduce unused CSS“.
- **Nach Bildoptimierung und optionalem Critical CSS/Font-Optimierung:** Performance-Score 80+ (Mobile) erreichbar.

---

## 3. Core Web Vitals (LCP, CLS, INP)

### LCP (Largest Contentful Paint)
- **Was:** Zeit, bis das größte sichtbare Element (oft Bild oder Textblock) gerendert ist.
- **Ziel:** < 2,5 s (gut), < 4,0 s (verbesserungswürdig), > 4,0 s (schlecht).
- **Ihre Seite:** Das LCP-Element ist sehr wahrscheinlich das **Hero-Logo** (logo.jpg, 625 KB, `loading="eager"`) oder der Hero-Text. Das Logo hat `width="400" height="400"` → **gut für CLS**. Die Dateigröße verzögert aber LCP. **Empfehlung:** Logo komprimieren (z. B. 80–150 KB) und/oder in WebP ausliefern.

### CLS (Cumulative Layout Shift)
- **Was:** Stabilität des Layouts; unerwartete Verschiebungen (z. B. durch nachlade Bilder ohne feste Größe).
- **Ziel:** < 0,1 (gut).
- **Ihre Seite:**  
  - Hero-Logo: `width="400" height="400"` → gut.  
  - **Gutschein-Bild:** `width="300" height="auto"` → bis das Bild geladen ist, kann die Höhe 0 sein und dann springen → **CLS-Risiko**.  
  - Footer-Logo: `width="180" height="auto"` → gleiches Risiko.  
  - Artikelbilder: `width="400" height="225"` → gut.  
- **Empfehlung:** Für alle Bilder, die Platz einnehmen, **width und height** setzen (z. B. Gutschein-Bild: reale Höhe ermitteln und im HTML setzen).

### INP (Interaction to Next Paint, ersetzt FID)
- **Was:** Reaktionszeit auf erste Nutzerinteraktion (z. B. Klick auf Menü).
- **Ziel:** < 200 ms.
- **Ihre Seite:** Ein einziges, kleines JS-Bundle (~10 KB), keine schweren Frameworks → INP sollte unkritisch sein. Nach dem Go-Live in PageSpeed/Real User Monitoring prüfen.

---

## 4. Bildoptimierung

### Was geprüft wird
- Dateigröße und Dimensionen vs. Anzeigegröße
- Format (JPEG/PNG/WebP/AVIF)
- `width`/`height` zur Vermeidung von CLS
- `loading="lazy"` für Below-the-fold-Bilder
- Responsive Images (srcset) wo sinnvoll

### Warum es wichtig ist
- Bilder sind oft der größte Anteil am Datenvolumen. Reduktion verbessert LCP und Ladezeit massiv.

### Wie man es testet
- Network-Tab: Größe jeder Bild-URL
- Lighthouse: „Properly size images“, „Use next-gen formats“
- Manuell: Anzeigegröße in DevTools vs. natürliche Bildgröße

### Idealer Zustand
- Kein Bild deutlich größer als seine Anzeigegröße (z. B. max. 2x für Retina).
- WebP (oder AVIF) wo unterstützt; Fallback JPEG/PNG.
- Above-the-fold: optimiert und zügig geladen; Rest: lazy.

### Befund Ihre Website (Detail)

| Datei | Aktuell | Anzeige (typ.) | Empfehlung |
|-------|---------|----------------|------------|
| **gutschein.png** | **5.300 KB** | ~300 px breit | **Dringend:** Auf ~300–600 px Breite skalieren, als WebP/JPEG komprimieren. Ziel: < 150 KB. |
| **kfa-logo.png** | **4.410 KB** | 120×40 px | **Dringend:** Auf 240×80 px (2x Retina) skalieren, PNG komprimieren oder als SVG wenn möglich. Ziel: < 30 KB. |
| **logo.jpg** | 625 KB | Nav 58px, Hero 400px | Komprimieren (Qualität 80–85) oder WebP. Ziel: < 150 KB für Hero; Nav könnte kleinere Variante nutzen. |
| **Logo.png.jpg** | 625 KB | Fallback | Wie logo.jpg optimieren. |
| **visitenkarte-qr.png** | 353 KB | Über-uns | Verkleinern/komprimieren; Ziel < 80 KB. |
| **wissen-news/*.jpg** | 38–71 KB | 400×225 | Bereits akzeptabel; optional WebP-Varianten für bessere Ladezeit. |
| **r-force** | JPG 5–6 MB | – | **WebP-Varianten nutzen** (55–178 KB), in HTML auf .webp verweisen mit Fallback. |

**Kassen-Logos:** bvaeb, oegk, svs sind klein (5–25 KB). Nur kfa-logo.png ist extrem groß und muss optimiert werden.

---

## 5. CSS- und JavaScript-Optimierung

### CSS
- **Größe:** main.css ~117 KB (unkomprimiert). Mit Gzip/Brotli auf dem Server typisch ~20–30 KB.
- **Struktur:** Eine Datei, keine @import – gut. Viele Media Queries und Varianten → Potenzial für „Unused CSS“ (Lighthouse warnt oft).
- **Render-blockierend:** `<link rel="stylesheet" href="styles/main.css">` im `<head>` blockiert das erste Rendering, bis CSS geladen ist. **Idealer Zustand:** Critical CSS inline für Above-the-fold, Rest asynchron nachladen; oder mindestens CSS nicht durch andere Blockaden verzögern.
- **Keine externen CSS-Frameworks** – gut für Kontrolle und Größe.

### JavaScript
- **Größe:** main.js ~10 KB – sehr gering.
- **Position:** Am Ende des `<body>` → blockiert nicht das initiale Rendering, aber das Parsing bis dahin. **Empfehlung:** `defer` setzen: `<script src="scripts/main.js" defer></script>` → nicht blockierend, Ausführung nach DOMContentLoaded.
- **Inhalt:** Splash, Navbar-Scroll, Mobile-Menü, IntersectionObserver für fade-in, Öffnungszeiten, Sprachumschalter. Keine schweren Bibliotheken – gut.

### Befund
- **CSS:** Größter Hebel wäre Critical CSS + async für den Rest; zweiter Hebel: Unused CSS entfernen (aufwändiger). Für den Launch: Kompression auf Server (s. Caching) ist Pflicht.
- **JS:** `defer` ergänzen; ansonsten bereits schlank.

---

## 6. Render-blockierende Ressourcen

### Was blockiert aktuell
1. **Google Fonts CSS:**  
   `<link href="https://fonts.googleapis.com/css2?family=...&display=swap" rel="stylesheet">`  
   Blockiert Rendering, bis die Font-CSS geladen ist. `display=swap` ist bereits gesetzt → Text erscheint sofort mit Systemfont, dann Swap zu Webfont. Trotzdem blockierend.
2. **Eigene Stylesheet:**  
   `styles/main.css` – blockiert bis geladen.

### Wie man es testet
- Lighthouse: Abschnitt „Render-blocking resources“
- Chrome DevTools → Performance: „Before First Paint“-Phase und welche Ressourcen davor laden

### Idealer Zustand
- Critical CSS (für Above-the-fold) inline oder sehr klein und schnell.
- Fonts: `preload` für die wichtigste Font-Datei + `font-display: swap` (haben Sie bereits); oder Font-CSS asynchron laden (z. B. mit Media="print" onload trick oder JS).
- Kein JS im Head ohne `defer`/`async`.

### Befund Ihre Website
- **Preconnect** für fonts.googleapis.com und fonts.gstatic.com auf index.html (und einigen anderen Seiten) – **gut**. Auf **index-tr.html** und **index-en.html** fehlt preconnect im geprüften Ausschnitt; alle Seiten sollten einheitlich preconnect haben.
- Font-CSS und main.css sind render-blockierend. Für schnellen Launch: Beibehalten, aber **Server-Kompression** und **Bildoptimierung** zuerst umsetzen. Optional danach: Critical CSS auslagern oder Font-Loading optimieren.

---

## 7. Font-Ladestrategien

### Aktuell
- **Quelle:** Google Fonts (Cormorant Garamond, Source Sans 3), mehrere Schnitte (ital, wght).
- **Parameter:** `display=swap` → Text sofort sichtbar, Font tauscht nach – **gut**.
- **Preconnect:** Auf DE-Hauptseiten vorhanden; index-tr/index-en prüfen (s. oben).

### Was zu prüfen ist
- Subset: Nur Zeichen laden, die genutzt werden (Google Fonts kann mit &subset= oder font-display gesteuert werden).
- Self-Hosting: Fonts selbst hosten entfällt Third-Party-Request zu Google, kann LCP leicht verbessern (optional).
- Preload: Die eine wichtigste Font-Datei (z. B. Source Sans 3 regular) mit `<link rel="preload" href="..." as="font" crossorigin>` kann First Paint beschleunigen.

### Idealer Zustand
- `font-display: swap` (erfüllt).
- Preconnect für Font-Domains (erfüllt auf vielen Seiten).
- Kein Flash of Invisible Text (FOIT); mit swap ist FOIT minimiert.

### Empfehlung
- Preconnect auf **allen** Einstiegsseiten (index, index-en, index-tr) setzen, falls dort Google Fonts geladen werden.
- Optional später: eine häufig genutzte Font-Datei preloaden.

---

## 8. Lazy Loading

### Was geprüft wird
- `loading="lazy"` für Bilder (und ggf. iframes) unterhalb des Viewports
- Kein Lazy Loading für das LCP-Element (Hero-Logo/Bild)
- Native Lazy Loading vs. JS-basiert

### Befund Ihre Website
- **Hero-Logo, Nav-Logo:** `loading="eager"` (explizit) bzw. ohne Attribut (default eager) – **korrekt**.
- **Kassen-Logos, Erkenntnisse-Karten, Gutschein-Bild, Footer-Logo:** `loading="lazy"` – **gut**.
- **Artikelbilder** auf wissen-news: `loading="lazy"` – **gut**.
- Kein iframe ohne Lazy Loading gefunden.

**Fazit:** Lazy Loading ist sinnvoll gesetzt. Das Problem der Startseite ist weniger Lazy Loading, sondern die **Größe** der lazy geladenen Dateien (gutschein.png 5,3 MB, kfa-logo 4,4 MB). Diese werden beim Scroll trotzdem geladen und können dann TBT und Gesamtdatenvolumen belasten.

---

## 9. Caching, CDN und Server-Konfiguration

### Aktueller Stand (aus Codebasis)
- **Kein .htaccess** oder andere Server-Config im Projekt gefunden → Caching und Kompression müssen auf **Server-/Hosting-Ebene** konfiguriert werden.
- **Kein CDN** für statische Assets (CSS, JS, Bilder) – alles vom gleichen Origin.

### Was konfiguriert werden sollte (Server/Hosting)

| Maßnahme | Zweck | Typische Werte |
|----------|--------|-----------------|
| **Gzip oder Brotli** | Komprimierung von HTML, CSS, JS | Für alle text/* und application/javascript |
| **Cache-Control** für statische Assets | Browser cached CSS/JS/Bilder | z. B. `max-age=31536000, immutable` für dateinamen mit Hash oder Version |
| **Cache-Control** für HTML | Frische Seiten | z. B. `max-age=0, must-revalidate` oder kurz max-age |
| **CDN (optional)** | Kürzere Latenz, Entlastung Origin | z. B. Cloudflare, Bunny, oder Hosting-eigenes CDN für /assets, /styles, /scripts |

### Wie man es testet
- Response-Header prüfen: z. B. `curl -I https://www.drcenik.at/styles/main.css` → `Content-Encoding: br` oder `gzip`, `Cache-Control`
- PageSpeed Insights: Hinweise zu „Leverage browser caching“
- WebPageTest: „Cache static assets“

### Idealer Zustand vor Live
- HTML: kurz cachebar oder revalidate.
- CSS/JS: lange Cache-Dauer (z. B. 1 Jahr), bei Änderungen Dateiname/Query ändern (z. B. main.css?v=2).
- Bilder: lange Cache-Dauer.
- Kompression (Brotli bevorzugt, sonst Gzip) für alle textbasierten Ressourcen.

### Empfehlung
- **Apache:** .htaccess mit mod_deflate und mod_headers (Beispiele im Anhang möglich).
- **Nginx:** entsprechende compression und expires-Direktiven.
- **Managed Hosting:** Control Panel prüfen („Caching“, „Compression“); oft mit einem Klick aktivierbar.

---

## 10. Performance-Probleme durch Frameworks oder Build-Prozesse

### Was geprüft wird
- Ob ein Frontend-Framework (React, Vue, Angular) oder ein großer JS-Build verwendet wird
- Ob CSS/JS gebündelt, minifiziert und ggf. gesplittet werden
- Ob viele Third-Party-Skripte (Analytics, Tag Manager, Chat) synchron geladen werden

### Befund Ihre Website
- **Kein package.json**, kein Build-Schritt (kein Webpack, Vite, etc.) – **statisches HTML/CSS/JS**.
- **Keine Frameworks** – nur vanilles JS.
- **Eine CSS-Datei**, eine JS-Datei – kein Bundle-Overhead, keine Runtime-Framework-Kosten.
- **Third-Party:** Nur Google Fonts (CSS + Font-Dateien). Keine Analytics/Tag-Manager im geprüften Code.

**Fazit:** Es gibt **keine** typischen Framework- oder Build-Performance-Probleme. Die Performance wird vor allem durch **Bildgrößen**, **eine große CSS-Datei** und **render-blockierende Fonts/CSS** bestimmt. Optional könnte später ein Mini-Build (CSS/JS minify, optional Critical CSS) eingeführt werden; für den Launch ist das nicht zwingend, wenn Bilder und Server-Caching stimmen.

---

## Kurz-Checkliste und Prioritäten

| Priorität | Maßnahme | Erwarteter Effekt |
|-----------|----------|-------------------|
| **P0** | **gutschein.png** stark verkleinern/komprimieren (Ziel < 150 KB) | Sehr großer Gewinn bei Ladezeit und LCP-Nachladezeit |
| **P0** | **kfa-logo.png** auf Logo-Größe skalieren + komprimieren (Ziel < 30 KB) | Großer Gewinn, da auf Startseite |
| **P0** | **logo.jpg** (Hero/Nav) komprimieren oder WebP (Ziel < 150 KB) | Besserer LCP |
| **P1** | **width/height** für Gutschein-Bild und Footer-Logo setzen (CLS vermeiden) | Stabilerer CLS-Score |
| **P1** | **Server:** Gzip/Brotli + Cache-Control für statische Dateien | Weniger Datenvolumen, schnellere Wiederbesuche |
| **P2** | **main.js** mit `defer` laden | Leicht bessere TBT/INP |
| **P2** | **Preconnect** für Fonts auf index-en und index-tr ergänzen | Konsistenz, leicht schnellere Font-Ladung |
| **P3** | Optional: Critical CSS; Font-Preload; WebP für Artikelbilder | Weitere Verbesserung |

---

## Umgesetzte Maßnahmen (Stand Projekt)

- **CLS:** Gutschein-Bild mit festen Proportionen (300×420, `aspect-ratio` in CSS), Footer-Logo 180×180 in allen HTML-Seiten; CSS `.footer-logo` und `.gutscheine-voucher-img` mit festen Maßen/`object-fit: contain`.
- **Caching & Kompression:** `.htaccess` mit Cache-Control (statische Assets 1 Jahr, HTML 1 Stunde) und Gzip/Brotli-Anweisungen.
- **Script:** `main.js` wird auf allen Seiten mit `defer` geladen; Preconnect/Fonts auf index-tr ergänzt.
- **Bildoptimierung:** Skript vorbereitet. **Ausführung (mit Node.js/npm):** im Projektordner `npm install` ausführen, danach `npm run optimize-images`. Das skaliert und komprimiert `gutschein.png`, `kfa-logo.png` und `logo.jpg` (Ziele: starke Reduktion der P0-Bilder). Ohne Node: Bilder extern verkleinern (z. B. TinyPNG, Squoosh) und ersetzen.

---

## Nächste Schritte nach dem Launch

1. **PageSpeed Insights** mit der echten Live-URL (Mobile + Desktop) ausführen und Ergebnisse dokumentieren.
2. **Core Web Vitals** in der Google Search Console („Core Web Vitals“-Report) über 28 Tage beobachten.
3. Bei Bedarf: **WebP** (und AVIF) für alle großen Bilder einführen; **CDN** für /assets prüfen.
4. Bei weiterem Optimierungsbedarf: **Critical CSS** für Above-the-fold extrahieren und Rest asynchron laden.

---

*Hinweis: Exakte LCP-/CLS-/INP-Sekunden und Lighthouse-Scores können erst mit Messung auf der live geschalteten Domain und unter realen Netzwerkbedingungen angegeben werden. Die obigen Befunde basieren auf der Analyse des Quellcodes und der Dateigrößen im Projekt.*
