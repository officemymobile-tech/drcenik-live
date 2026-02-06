# Launch-Audit: Dr. Fadime Cenik – Physikalische Medizin & Rehabilitation

**Stand:** Vor Livegang  
**Rolle:** Senior Web Designer, Web Architect, UX/UI, SEO, Performance, Conversion  
**Methode:** Vollständige Analyse ohne Rückfragen; Annahmen nach Best Practices.

---

## 1. Seitenstruktur & Informationsarchitektur

### 1.1 Logik der Seitenhierarchie

| Befund | Kritikalität | Empfehlung |
|--------|--------------|------------|
| **Flache IA:** Startseite → 7 Hauptbereiche (Therapieangebot, R-Force, Wissen & News, FAQ, Über uns, Kontakt) plus Rechtliches. Keine Unter-URLs (z. B. `/therapieangebot/massage`). | Gering | Für eine Ordinations-Website angemessen. Optional später: thematische Unterseiten (z. B. Schmerztherapie, Rehabilitation) für SEO. |
| **Gutschein-Vorlage** (`267059-geschenkgutschein-vorlage.html`) ist über Startseite/Gutschein-Bereich erreichbar und in Sitemap; URL mit Zahlen-Präfix wirkt technisch. | Mittel | URL beibehalten (bereits verlinkt, canonical gesetzt). Für Nutzer: Linktitel „Geschenkgutschein“ reicht; keine Änderung nötig. |
| **Prototype-Seite** (`prototype-apple.html`) ist in robots.txt mit `Disallow` geschützt, wird nicht indexiert. | Positiv | So belassen. |

### 1.2 Navigation, User Flow, Orientierung

| Problem | Warum kritisch | Empfehlung |
|---------|----------------|------------|
| **Sprachwahl nur in Nav:** DE | TR | EN – Links werden per JS gesetzt (main.js). Ohne JS bleiben `href="#"`, Nutzer landen nicht auf Sprachversion. | Barrierefreiheit & Crawler: Google kann alternates nutzen, aber Nutzer mit abgeschaltetem JS wechseln Sprache nicht. | **Server-seitig oder statisch:** In jedem HTML die passenden `href` setzen (z. B. `index.html`, `index-tr.html`, `index-en.html`) statt `#`. JS nur noch für `is-active`-Klasse. |
| **Kein Breadcrumb** auf Unterseiten. | Erstbesucher wissen nicht, wo sie sich in der Struktur befinden; leichte Orientierungslosigkeit. | **Optional:** Breadcrumb (z. B. Startseite > Kontakt) mit Schema.org `BreadcrumbList`; visuell dezent unter der Nav oder über H1. |
| **„Termin buchen“** führt zu Kontakt; kein Buchungssystem. | Erwartung „Online-Termin“ kann enttäuschen. | Klar kommunizieren: z. B. Button „Termin buchen“ mit Subline „per Anruf oder Kontaktformular“ oder „Kontakt & Termin“. |
| **Startseite:** Hero → Kassen → Therapie → Erkenntnisse → Gutschein → Öffnungszeiten. Logischer Flow. | — | Beibehalten. |

### 1.3 Klarheit der Seitenziele

| Seite | Ziel | Bewertung |
|-------|------|-----------|
| Startseite | Informieren, Vertrauen, CTA Termin/Kontakt | Erfüllt: Value Proposition (Phys. Med. & Reha Wien), Öffnungszeiten, Telefon, CTAs. |
| Kontakt | Termin/Kommunikation, Adresse, Öffnungszeiten, ggf. Formular | Erfüllt. Formular mit DSGVO-Hinweis vorhanden. |
| Über uns | Kompetenz, Werdegang, Kontakt | Erfüllt. |
| Therapieangebot / R-Force / Wissen & News | Informieren, Vertrauen | Erfüllt. |
| FAQ | Entlastung, schnelle Antworten | Erfüllt. |
| Impressum/Datenschutz/AGB | Rechtssicherheit | Vorhanden, mehrsprachig. |

---

## 2. UX/UI & visuelles Design

### 2.1 Konsistenz Layout, Farben, Typografie

| Problem | Warum kritisch | Empfehlung |
|---------|----------------|------------|
| **Eine große CSS-Datei** (~3.600+ Zeilen, theme-ref, page-home, etc.). Viele überschreibende Selektoren. | Wartung und gezielte Anpassungen werden schwer; Risiko unbeabsichtigter Seiteneffekte. | Vor Launch: keine Big-Refactor. Mittelfristig: CSS nach Bereichen aufteilen (z. B. base, components, pages) oder BEM/Utility-Klassen konsolidieren. |
| **Markenfarben** (Blau, Gold/Beige) sind in `:root` definiert und werden genutzt. | Konsistenz gegeben. | Beibehalten. |
| **Typografie:** Cormorant Garamond (Serif) + Source Sans 3 (Sans), Fallback Segoe UI. | Lesbarkeit und Markenauftritt stimmig. | Beibehalten. Fonts siehe Performance (render-blocking). |

### 2.2 Abstände, visuelle Hierarchie, Lesbarkeit

| Befund | Empfehlung |
|--------|-------------|
| Footer und Über-uns/Kontakt wurden auf bessere Lesbarkeit (Schriftgröße, Kontrast navy-800) angepasst. | Kontrast auf allen Seiten prüfen (z. B. WCAG AA); besonders Cookie-Banner und Buttons. |
| Section-Abstände (z. B. `section-standard`, `section-zeiten-ref`) sind einheitlich. | OK. |
| **Mobile CTA** (Anrufen / Termin) fixiert am unteren Rand; body hat `padding-bottom` bei kleinem Viewport. | Gut. Prüfen, dass kein Inhalt verdeckt wird (z. B. letzter Footer-Bereich). |

### 2.3 Mobile UX & Touch

| Problem | Warum kritisch | Empfehlung |
|---------|----------------|------------|
| **Hamburger-Menü** ab 768px; Menü fullscreen mit Links + Telefon + Sprachwahl. | Standard und nutzbar. | Sicherstellen: Touch-Ziele mind. 44×44px (bereits durch Padding/Links gegeben). |
| **Buttons** (Termin buchen, Gutschein anfragen): ausreichend groß. | — | OK. |
| **Tabellen** (z. B. Therapieangebot, Öffnungszeiten): horizontal scrollbar auf kleinen Screens. | Gut umgesetzt. | Beibehalten. |

### 2.4 CTA-Platzierung und Nutzerführung

| Befund | Empfehlung |
|--------|-------------|
| Primär-CTA „Termin buchen“ in Nav und Hero; Sekundär „Mehr erfahren“. Kontaktseite: Formular + Telefon + Maps. | Klar. |
| Gutschein-Bereich: „Gutschein-Vorlage ansehen“ + „Gutschein anfragen“. | OK. |
| **Above-the-fold:** Hero mit Headline, Kurztext, Telefon, E-Mail, zwei Buttons. Logo rechts. | Starke erste Wahrnehmung. |

---

## 3. Technisches SEO

### 3.1 Indexierung, Crawling, Canonicals, Meta-Tags

| Problem | Warum kritisch | Empfehlung |
|---------|----------------|------------|
| **robots.txt:** `Allow: /`, Sitemap angegeben, `Disallow: /prototype-apple.html`. | Korrekt. | — |
| **Sitemap:** Alle relevanten Seiten inkl. Sprachvarianten; hreflang bei DE-URLs; 267059-Gutschein enthalten. | Gut. | TR/EN-URLs in Sitemap haben keine `xhtml:link`-Alternates – technisch optional, aber für konsistentes hreflang-Set sinnvoll: Bei jeder URL alle drei Sprachen angeben. |
| **Canonical:** Jede Seite hat `rel="canonical"` auf die eigene URL. | Korrekt. | — |
| **Meta-Title & Description:** Pro Seite individuell, Markenname + Thema; Länge titel ~50–60 Zeichen, Description ~150–160. | Gut. | — |
| **OG/Twitter:** Auf Index und Kontakt gesetzt; auf anderen Seiten teilweise nur Title/Description. | Einheitlichkeit: Auf allen öffentlichen Seiten mind. `og:title`, `og:description`, `og:url`, `og:image` setzen. |

### 3.2 Überschriftenstruktur (H1–H6)

| Seite | H1 | Bewertung |
|-------|----|-----------|
| Index | „Physikalische Medizin & Rehabilitation Wien“ | Ein H1, thematisch passend. |
| Kontakt, Über uns, FAQ, Wissen & News, Therapieangebot, R-Force | Jeweils ein H1 (Seitentitel). | Korrekt. |
| 267059-Gutschein | „Geschenkgutschein-Vorlage“. | Korrekt. |
| Index: Section-Überschriften (Therapie, Erkenntnisse, Gutschein, Öffnungszeiten) | H2/H3. | Kein H1 in Sections; saubere Hierarchie. |

**Empfehlung:** Auf Artikel-/News-Seiten (Wissen & News) pro Artikel nur ein H1 (Seitentitel); Artikelüberschriften als H2.

### 3.3 URL-Struktur

| Befund | Empfehlung |
|--------|-------------|
| Sprechende URLs: `ueber-uns.html`, `therapieangebot.html`, `kontakt.html`, etc. Sprachsuffix `-tr`, `-en`. | Gut. |
| `267059-geschenkgutschein-vorlage.html`: Zahlen-Präfix nicht semantisch. | Für Launch akzeptabel; Änderung würde Verlinkungen und Canonicals anfassen. |

### 3.4 Interne Verlinkung

| Problem | Warum kritisch | Empfehlung |
|---------|----------------|------------|
| Footer: Navigation, Kontakt, Rechtliches auf allen Seiten. Startseite verlinkt Therapieangebot, Über uns, Kontakt, Wissen & News, Gutschein. | Gut. | — |
| **Kontextlinks:** Von Wissen & News aus gezielte Links zu Therapieangebot oder Kontakt (z. B. bei bestimmten Themen). | Stärkt IA und SEO. | Optional: In Artikel-Snippets oder Intro 1–2 kontextuelle Links zu relevanten Unterseiten. |
| **Gutschein-Vorlage:** Von Startseite (Gutschein-Bereich) verlinkt; in Sitemap. | Ausreichend. | — |

### 3.5 Bild-SEO

| Problem | Warum kritisch | Empfehlung |
|---------|----------------|------------|
| **Logo:** `alt="Dr. Fadime Cenik – Fachärztin für …"` (Nav/Footer). Splash: `alt=""` (dekorativ). | OK. | — |
| **Artikelbilder (Wissen & News):** Alt-Texte vorhanden (z. B. „MTD-Gesetz und ÖGPMR …“). | Gut. | Alle Bilder mit inhaltlichem Bezug: beschreibenden, keyword-relevanten Alt-Text (kurz, natürlich). |
| **Kassen-Logos:** Alt mit Kassenname. | Gut. | — |
| **Dateinamen:** `artikel-1-medizin.jpg` etc. | Semantisch schwächer. | Optional: z. B. `physikalische-medizin-mtd-oegk.jpg`; nicht zwingend vor Launch. |
| **Größen:** Siehe Performance – gutschein.png, kfa-logo.png, logo.jpg zu groß. | LCP und Datenvolumen. | Siehe Abschnitt 4. |

### 3.6 Schema.org (JSON-LD)

| Problem | Warum kritisch | Empfehlung |
|---------|----------------|------------|
| **Index:** `Physician` mit Adresse, Telefon, E-Mail, Geo, openingHoursSpecification. | Gut für lokale Suche. | `medicalSpecialty` aktuell „Physiotherapy“ – fachlich präziser: „PhysicalMedicine“ oder „Rehabilitation“ (Schema erlaubt mehrere). |
| **Kontakt:** `ContactPage` mit `mainEntity` Physician + Öffnungszeiten. | Gut. | — |
| **Über uns / andere Seiten:** WebPage, FAQPage wo genutzt. | Vorhanden. | — |
| **Gutschein-Seite:** Kein spezielles Schema. | Optional. | `Product` oder `Offer` mit `name="Geschenkgutschein"` möglich. |

---

## 4. Performance & Core Web Vitals

### 4.1 Ladezeiten (mobil & desktop)

| Problem | Warum kritisch | Empfehlung |
|---------|----------------|------------|
| **assets/gutschein.png** (~5,3 MB) und **kfa-logo.png** (~4,4 MB) extrem groß. | Startseite lädt mehrere MB nur durch wenige Bilder; LCP und TTI leiden stark, besonders mobil. | **P0:** Bilder auf Zielgröße skalieren (z. B. Gutschein max. 600px Breite, Kassen-Logo max. 240px) und komprimieren (PNG-Optimizer/WebP). Skript `scripts/optimize-images.js` vorhanden – nach `npm install` mit `npm run optimize-images` ausführen. |
| **logo.jpg** (~625 KB) above-the-fold. | Direkt relevant für LCP. | Komprimieren (z. B. 80–85 Qualität, max. 800px) oder WebP-Variante mit `<picture>`. |
| **main.css** ~117 KB, eine Datei. | Render-blocking; verzögert FCP. | Vor Launch: Optional Critical CSS für Above-the-fold extrahieren, Rest asynchron laden. Oder Minify (z. B. cssnano) im Build. |
| **main.js** ~10 KB, `defer`. | Unkritisch. | Beibehalten. |

### 4.2 LCP, CLS, INP

| Metrik | Befund | Empfehlung |
|--------|--------|------------|
| **LCP** | Wahrscheinlich Hero-Logo oder -Text. Logo 400×400 px, aber Dateigröße hoch. | Logo verkleinern; feste width/height beibehalten. |
| **CLS** | Gutschein-Bild und Footer-Logo haben feste Proportionen (width/height bzw. aspect-ratio) umgesetzt. | Prüfen: Keine weiteren Bilder mit `height="auto"` ohne aspect-ratio oder feste Höhe. |
| **INP** | Kleines JS, kein schweres Framework. | Wahrscheinlich gut. Nach Launch in PageSpeed/CrUX prüfen. |

### 4.3 Bild-, CSS-, JS-Optimierung

| Thema | Empfehlung |
|-------|-------------|
| **Bilder:** Siehe oben. WebP für Logo/Gutschein/Kassen optional; `<picture>` mit Fallback. | Priorität: Größe/Skalierung vor Format-Wechsel. |
| **CSS:** Eine Datei, kein Minify im Repo. | Build-Step: Minify + ggf. Critical CSS. |
| **JS:** Bereits klein, defer. | OK. |

### 4.4 Render-blockierende Ressourcen

| Problem | Empfehlung |
|---------|------------|
| **Google Fonts:** CSS synchron im `<head>`. | Preconnect vorhanden. Optional: `display=swap` beibehalten; Fonts nur für genutzte Zeichen/Schnitte laden (subset). |
| **main.css** blockiert. | Siehe Critical CSS / Minify. |

### 4.5 Fonts, Lazy Loading, Caching

| Thema | Befund | Empfehlung |
|-------|--------|------------|
| **Fonts** | Preconnect + display=swap. | OK. Optional: self-host oder font-display: optional für schnellere FCP. |
| **Lazy Loading** | Hero/Nav-Logo `loading="eager"`, untere Bilder `loading="lazy"`. | Korrekt. |
| **Caching** | .htaccess: Cache-Control für statische Dateien (1 Jahr), HTML (1 Stunde), Gzip, optional Brotli. | Server muss mod_headers/mod_deflate unterstützen. Nach Launch prüfen (Response-Header). |

---

## 5. Content & Kommunikation

### 5.1 Klarheit der Botschaft

| Befund | Empfehlung |
|--------|-------------|
| **Value Proposition** auf der Startseite klar: Physikalische Medizin & Rehabilitation Wien, Fachärztin, Spezialisierung, „Wo Bewegung beginnt“. | Beibehalten. |
| **Öffnungszeiten** einheitlich (Mo 07:00–19:00, Di–Do 06:30–19:00, Fr 06:30–17:00, Sa/So geschlossen); im Schema und auf der Seite. | Gut. |

### 5.2 Verständlichkeit für Erstbesucher

| Thema | Empfehlung |
|-------|------------|
| Fachbegriffe (z. B. Physikalische Medizin, Rehabilitation) sind für Zielgruppe (Patienten, Überweisung) üblich. | Optional: Ein Satz „Was ist Physikalische Medizin?“ mit Link zu Therapieangebot oder FAQ. |
| **Alle Kassen** mit Logos (KFA, ÖGK, BVAEB, SVS). | Vertrauen und Klarheit. |

### 5.3 Conversion-Fokus

| Thema | Empfehlung |
|-------|------------|
| **Primärer CTA:** Termin buchen (Kontakt). Telefon klickbar. | Gut. |
| Kontaktformular mit DSGVO-Hinweis; Auto-Save lokal. | Conversion- und rechtssicher. |
| **Trust:** Facharzt, Ordination, Adresse, Öffnungszeiten, Kassen. | Ausreichend. Optional: kurzer Hinweis „Termin nach telefonischer Vereinbarung“. |

### 5.4 Vertrauen & Glaubwürdigkeit

| Befund | Empfehlung |
|--------|-------------|
| Impressum, Datenschutz, AGB vorhanden und verlinkt. | Rechtlich abgesichert. |
| Über uns: Werdegang, Ausbildung, Publikationen. | Stärkt Autorität. |

---

## 6. Typische Launch-Fehler

| Risiko | Warum kritisch | Empfehlung |
|--------|----------------|------------|
| **Schwere Bilder** (gutschein.png, kfa-logo.png, logo.jpg) unoptimiert live. | PageSpeed und Core Web Vitals schlecht; schlechtere Platzierung und Nutzererlebnis. | Vor Go-Live zwingend verkleinern/komprimieren. |
| **Sprachlinks mit href="#"** ohne JS. | Sprachumschalter funktioniert nur mit JS. | Hrefs statisch setzen (siehe 1.2). |
| **Canonical/OG-URLs** auf https://www.drcenik.at/ – Server muss HTTPS und www konsistent liefern. | Sonst Duplicate-Content- oder Redirect-Probleme. | Server: 301 von http→https und ggf. non-www→www (oder umgekehrt) und Sitemap/Canonicals anpassen. |
| **Cookie-Banner** nur „Alles akzeptieren“; keine Ablehnung. | DSGVO-konform: Nutzer müssen ablehnen können, wenn nur nicht-notwendige Cookies im Einsatz sind. Aktuell keine Analyse-Cookies – Banner trotzdem oft mit „Nur notwendige“ / „Alle akzeptieren“. | Optional: Zweiter Button „Nur notwendige“; bei späterer Nutzung von Analytics Consent-Lösung einbauen. |
| **Formular:** Kein sichtbares Feedback bei fehlenden Pflichtfeldern (nur HTML5). | UX: Klare Fehlermeldungen. | Optional: clientseitige Validierung mit ARIA-live oder Hinweise unter den Feldern. |
| **404-Seite** nicht geprüft. | Bei falschen Links schlechte UX. | Eine 404.html mit Link zur Startseite und ggf. Suche/Navigation bereitstellen; Server konfigurieren. |
| **Splash-Screen** 2 Sekunden; sessionStorage verhindert Wiederanzeige. | Kann als Verzögerung empfunden werden. | Bereits kurz; akzeptabel. Optional: Dauer auf 1–1,5 s reduzieren. |

---

## 7. Priorisierte Maßnahmen vor Launch

| Priorität | Maßnahme | Aufwand |
|-----------|----------|---------|
| **P0** | gutschein.png und kfa-logo.png stark verkleinern/komprimieren; logo.jpg komprimieren oder WebP. | Mittel (Skript oder manuell). |
| **P0** | Sprachlinks (DE/TR/EN) im HTML mit echten URLs statt `#` ausliefern. | Gering. |
| **P1** | Server: HTTPS, Redirects, .htaccess (Cache, Gzip) prüfen. | Gering–Mittel. |
| **P1** | Schema `medicalSpecialty` auf PhysicalMedicine/Rehabilitation anpassen. | Gering. |
| **P2** | OG/Twitter-Meta auf allen öffentlichen Seiten einheitlich. | Gering. |
| **P2** | Optional: Cookie-Banner um „Nur notwendige“ erweitern. | Gering. |
| **P3** | CSS minifizieren; optional Critical CSS. | Mittel. |
| **P3** | 404-Seite und Server-Config. | Gering. |

---

## 8. Kurzfassung

- **Stärken:** Klare IA, konsistente Meta-Tags, Canonicals, hreflang, Sitemap, Schema, DSGVO-Hinweise, mobile Navigation, CTAs.
- **Kritisch vor Launch:** Bildgrößen (gutschein.png, kfa-logo.png, logo.jpg) und Sprachlinks ohne JS.
- **Sinnvoll danach:** PageSpeed/CrUX messen, ggf. Critical CSS, einheitliche OG-Tags, 404-Handling, Cookie-Option „Nur notwendige“.

Die Website ist fachlich und rechtlich gut vorbereitet; die größte technische und nutzerbezogene Wirkung hat die Bildoptimierung vor dem Livegang.
