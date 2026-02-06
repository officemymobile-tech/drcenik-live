# SEO-Checkliste vor dem Livegang – Dr. Fadime Cenik Website

Detaillierte Prüfpunkte mit **Was**, **Warum**, **Wie testen** und **Idealer Zustand**. Am Ende: **Befund Ihrer Website** in Stichpunkten.

---

## 1. Technisches SEO (Indexierung, Crawling, robots.txt, Sitemap, Canonical, noindex)

### Was geprüft werden muss
- **robots.txt**: Erlaubnis für Suchmaschinen, Verweis auf Sitemap, keine versehentlichen Disallows für wichtige Bereiche
- **sitemap.xml**: Vollständigkeit (alle öffentlichen URLs), gültiges XML, lastmod/priority sinnvoll, ggf. hreflang
- **Canonical**: Jede Seite hat genau einen `<link rel="canonical" href="...">` auf die bevorzugte URL (inkl. Domain)
- **noindex**: Nur wo gewollt (z. B. Danke-Seiten, Prototypen); keine Hauptseiten mit noindex
- **Indexierung**: Keine Blockierung durch Meta-Robots noindex auf wichtigen Seiten

### Warum es wichtig ist
- Falsche Canonicals oder blockierte URLs führen zu Duplicate Content oder fehlender Indexierung.
- Fehlende oder unvollständige Sitemap verzögert die Entdeckung neuer/geänderter Seiten.

### Wie man es testet
- **robots.txt**: `https://www.drcenik.at/robots.txt` im Browser prüfen; Google Search Console „robots.txt Tester“
- **Sitemap**: `https://www.drcenik.at/sitemap.xml` öffnen, mit [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html) prüfen; in GSC „Sitemaps“ einreichen
- **Canonical/noindex**: Pro Seite im Quellcode nach `<link rel="canonical"` und `<meta name="robots"` suchen; Crawl-Tools (Screaming Frog, Sitebulb)

### Idealer Zustand vor dem Livegang
- robots.txt: `Allow: /`, Sitemap-URL angegeben, nur Test-/Prototyp-Seiten ggf. `Disallow`
- Sitemap: Alle relevanten Seiten (DE/EN/TR) enthalten, max. 50.000 URLs, korrekte Domain (https)
- Jede Seite: genau ein Canonical auf die kanonische URL (gleiche Domain wie finaler Live-Domain)
- Keine noindex auf Startseite, Kontakt, Über uns, Therapieangebot, Wissen & News, FAQ

---

### Befund Ihre Website (Technisches SEO)
- **robots.txt**: Vorhanden, `Allow: /`, Sitemap verlinkt, `Disallow: /prototype-apple.html` – gut.
- **sitemap.xml**: Vollständig mit DE/EN/TR, hreflang in urlset, lastmod/priority gesetzt. **Hinweis:** `267059-geschenkgutschein-vorlage.html` fehlt in der Sitemap – bei gewünschter Indexierung aufnehmen.
- **Canonical**: Auf allen geprüften Seiten gesetzt (index, ueber-uns, wissen-news, kontakt, etc.) mit `https://www.drcenik.at/...`.
- **noindex**: Keine noindex auf wichtigen Seiten gefunden – gut.

---

## 2. Onpage-SEO (Title-Tags, Meta-Descriptions, H1–H6, URL-Struktur)

### Was geprüft werden muss
- **Title**: Pro Seite einzigartig, ca. 50–60 Zeichen, Hauptkeyword + ggf. Marke/Standort
- **Meta Description**: Pro Seite einzigartig, ca. 150–160 Zeichen, Handlungsaufforderung/Info, kein Duplikat
- **H1**: Pro Seite genau eine H1, inhaltlich zur Seite passend
- **H2–H6**: Logische Hierarchie (kein H4 ohne H3), thematische Gliederung
- **URL-Struktur**: Kurz, lesbar, kleingeschrieben, Bindestriche; keine unnötigen Parameter

### Warum es wichtig ist
- Title und Description steuern Klickrate in den Suchergebnissen (CTR).
- Klare H1-Struktur hilft Suchmaschinen und Nutzern, das Thema der Seite zu erfassen.

### Wie man es testet
- Manuell: Quellcode jeder Seite nach `<title>`, `<meta name="description"`, `<h1>` durchsuchen
- Tools: Screaming Frog (Titles/Descriptions/H1 pro URL), Google Search Console „Seiten“-Berichte

### Idealer Zustand vor dem Livegang
- Jede Seite: einzigartiger Title (inkl. „Dr. Fadime Cenik“ bzw. „Physikalische Medizin“ wo sinnvoll)
- Jede Seite: einzigartige Meta Description mit Relevanz und ggf. Ort (Wien 11)
- Jede Seite: genau eine H1; Unterseiten mit H2 für Blöcke, H3 für Unterpunkte
- URLs: z. B. `/kontakt`, `/ueber-uns`, `/wissen-news` (Ihre Struktur mit `.html` ist in Ordnung)

---

### Befund Ihre Website (Onpage)
- **Titles**: Durchgängig vorhanden und einzigartig, mit „Dr. Fadime Cenik“ und „Physikalische Medizin & Rehabilitation“ (bzw. EN/TR).
- **Meta Descriptions**: Vorhanden, einzigartig, mit Wien 11 / Vienna. Längen i. d. R. im Rahmen.
- **H1**: Startseite: H1 „Physikalische Medizin & Rehabilitation Wien“. Unterseiten: H1 z. B. „Über uns“, „Wissen & News“, „Kontakt“. **Hinweis:** `267059-geschenkgutschein-vorlage.html` nutzt `heading-2` als Seitentitel – für SEO idealerweise eine H1.
- **URL-Struktur**: Konsistent (z. B. `ueber-uns.html`, `wissen-news.html`, Sprachvarianten `-tr`, `-en`) – gut.

---

## 3. Content-SEO (Keyword-Nutzung, Content-Qualität, Thin Content)

### Was geprüft werden muss
- **Keyword-Nutzung**: Relevante Begriffe (z. B. Physikalische Medizin, Rehabilitation, Wien, Facharzt, Schmerztherapie) natürlich in Title, H1, Fließtext
- **Content-Qualität**: Verständlich, fachlich stimmig, Mehrwert für Nutzer (Infos, Termin, Kontakt)
- **Thin Content**: Keine extrem kurzen Seiten ohne Mehrwert; Mindestumfang für Suchintention (z. B. FAQ mit mehreren Fragen)

### Warum es wichtig ist
- Dünner oder irrelevanter Content wird schlechter ranken und kann als Low Quality gelten.
- Klare thematische Ausrichtung unterstützt Relevanz für Suchanfragen.

### Wie man es testet
- Manuell: Seiten lesen, Keyword-Vorkommen und Lesbarkeit prüfen
- Tools: Wortanzahl pro Seite (z. B. in Editor), Keyword-Recherche (Google Suggest, Ubersuggest) mit Abgleich

### Idealer Zustand vor dem Livegang
- Pro Seite erkennbarer Fokus (z. B. Kontakt, Über uns, Therapie); Hauptkeywords in Title/H1 und im Text.
- Keine reinen Platzhalter-Texte; FAQ und Wissen & News mit ausreichend Inhalt.
- Keine doppelten oder nahezu identischen Texte über viele Seiten (Duplicate/Thin Content).

---

### Befund Ihre Website (Content)
- **Fokus**: Startseite (Physikalische Medizin Wien), Über uns (Werdegang, Kontakt), Wissen & News (aktuelle PMR-Themen), Therapie, R-Force, FAQ, Kontakt – thematisch klar.
- **Keyword-Anker**: „Physikalische Medizin“, „Rehabilitation“, „Wien“, „Fachärztin“ in Titles/Meta und Inhalt – gut.
- **Umfang**: Wissen & News mit mehreren Artikeln; FAQ mit mehreren Fragen; keine offensichtlich zu dünnen Hauptseiten.

---

## 4. Bild-SEO (Alt-Texte, Dateinamen, Bildgrößen)

### Was geprüft werden muss
- **Alt-Texte**: Jedes inhaltliche Bild hat ein beschreibendes `alt="-Text"` (oder bewusst `alt=""` bei dekorativen Bildern mit aria-hidden)
- **Dateinamen**: Aussagekräftig (z. B. `physiotherapie-behandlung.jpg`) statt `IMG_1234.jpg`
- **Größen/Ladezeit**: Keine unnötig großen Dateien; ggf. WebP/Responsive; width/height gegen CLS

### Warum es wichtig ist
- Alt-Texte verbessern Barrierefreiheit und Bildsuche; fehlende Alts sind ein häufiger SEO-Schwachpunkt.
- Schwere Bilder verschlechtern Ladezeit und Core Web Vitals.

### Wie man es testet
- Quellcode: Alle `<img>` auf `alt` prüfen (z. B. mit Screaming Frog „Images“-Tab)
- Dateinamen: In Sitemap/Quellcode prüfen
- Größen: Browser DevTools (Network), PageSpeed Insights, Lighthouse

### Idealer Zustand vor dem Livegang
- Inhaltliche Bilder: kurzer, beschreibender Alt-Text (z. B. „Physiotherapeutin bei Manueller Therapie“).
- Dekorative Bilder: `alt=""` und ggf. `aria-hidden="true"` (z. B. Splash-Logo, Artikel-Karten-Bilder in Kacheln).
- Dateinamen: sprechend (z. B. `artikel-1-medizin.jpg` ist in Ordnung).
- Bilder: komprimiert, width/height gesetzt wo möglich (CLS vermeiden).

---

### Befund Ihre Website (Bilder)
- **Alt-Texte**: Viele Artikelkarten-Bilder haben `alt=""` bei `aria-hidden="true"` – für dekorative Kacheln akzeptabel. **Empfehlung:** Wo Bilder inhaltlich zum Artikel gehören, kurzen beschreibenden Alt ergänzen (z. B. „MTD-Gesetz 2024 – Physiotherapie“). Logo/Splash mit `alt=""` – bei rein dekorativer Nutzung ok; auf der Startseite hat das Hero-Logo einen aussagekräftigen Alt.
- **Dateinamen**: `artikel-1-medizin.jpg` etc. – in Ordnung. `gutschein.png`, `logo.jpg` – ok.
- **Größen**: width/height bei Artikelbildern (400×225) gesetzt – gut für CLS. Ladezeit vor Live mit PageSpeed prüfen.

---

## 5. Interne Verlinkung und Seitenarchitektur

### Was geprüft werden muss
- **Navigation**: Wichtige Seiten (Start, Über uns, Therapie, R-Force, Wissen & News, FAQ, Kontakt) von überall erreichbar
- **Interne Links**: Relevante Verlinkung zwischen thematisch verwandten Seiten (z. B. Therapie → Kontakt, News → Wissen & News)
- **Tiefe**: Wichtige Seiten möglichst in 1–2 Klicks von der Startseite erreichbar
- **Ankertexte**: Verständlich und thematisch (kein „Hier klicken“ überall)

### Warum es wichtig ist
- Klare Struktur und interne Links verteilen Relevanz und helfen Crawlern sowie Nutzern.

### Wie man es testet
- Manuell: Von Startseite alle Hauptbereiche anclicken; Broken Links mit Browser-Plugin oder Screaming Frog prüfen
- Tools: Screaming Frog „Internal“-Links, „Link Depth“; Visualisierung der Seitenarchitektur

### Idealer Zustand vor dem Livegang
- Jede wichtige Seite mindestens von der Nav und/oder Footer verlinkt.
- Keine toten Enden (Seiten ohne ausgehende interne Links zu anderen relevanten Seiten).
- CTA-Links (z. B. „Termin buchen“, „Lesen →“) mit sinnvollem Ankertext.

---

### Befund Ihre Website (Interne Verlinkung)
- **Navigation**: Einheitliche Nav mit Startseite, Therapieangebot, R-Force, Wissen & News, FAQ, Über uns, Kontakt – gut.
- **Footer**: Gleiche Struktur + Impressum, Datenschutz, AGB – gut.
- **Interne Verweise**: Wissen & News verlinkt auf Kontakt/Telefon; Startseite Erkenntnisse → wissen-news.html; Gutschein-Vorlage von Startseite verlinkt – sinnvoll.
- **Gutschein-Vorlage**: Nur in Nav nicht verlinkt (bewusst als Zusatzseite) – ok; bei Sichtbarkeit in Sitemap aufnehmen.

---

## 6. Mobile Optimierung und Core Web Vitals

### Was geprüft werden muss
- **Viewport**: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- **Responsive**: Layout und Lesbarkeit auf kleinen Bildschirmen (Navigation, Buttons, Text)
- **Core Web Vitals**: LCP (Largest Contentful Paint), FID/INP (Interaktivität), CLS (Cumulative Layout Shift)
- **Touch-Ziele**: Buttons/Links mind. ca. 44×44 px

### Warum es wichtig ist
- Mobile-First-Index; schlechte Mobile-Erfahrung und schwache Core Web Vitals können Ranking und Nutzerzufriedenheit beeinträchtigen.

### Wie man es testet
- Viewport: Quellcode prüfen
- Responsive: Browser DevTools (Device Toolbar), reale Geräte
- Core Web Vitals: [PageSpeed Insights](https://pagespeed.web.dev/), Google Search Console „Core Web Vitals“, Lighthouse (Mobile)

### Idealer Zustand vor dem Livegang
- Viewport gesetzt; keine horizontalen Scrolls auf Mobile.
- LCP unter ca. 2,5 s; CLS unter 0,1; Interaktivität ohne lange Verzögerung.
- Buttons und Nav-Links groß genug zum Tippen.

---

### Befund Ihre Website (Mobile / CWV)
- **Viewport**: In index.html und vermutlich allen Seiten vorhanden – gut.
- **Responsive**: Media Queries und theme-ref-Layout deuten auf mobile Anpassung hin; vor Live mit DevTools und echten Geräten testen.
- **Touch**: In CSS min-height für Buttons/Nav (z. B. 44px) gesetzt – gut.
- **CWV**: Erst nach Deployment mit PageSpeed Insights (echte URL) messen; Bilder mit width/height und lazy loading bereits vorbereitet.

### Performance-Optimierungen (umgesetzt für Core Web Vitals)
- **LCP**: Hero-Logo mit `<link rel="preload" href="./assets/logo.jpg" as="image">` und `fetchpriority="high"` auf Startseiten (DE/EN/TR); width/height 400×400 gesetzt (CLS).
- **Fonts**: Google Fonts mit `display=swap` geladen; preconnect für fonts.googleapis.com und fonts.gstatic.com.
- **Skripte**: `main.js` mit `defer` eingebunden.
- **Test**: Nach Go-Live [PageSpeed Insights](https://pagespeed.web.dev/) für https://www.drcenik.at/ (Mobile + Desktop) ausführen; GSC „Core Web Vitals“ beobachten.

---

## 7. Strukturierte Daten (Schema Markup)

### Was geprüft werden muss
- **Vorhandenes Schema**: Pro Seite passender Typ (z. B. Physician, MedicalBusiness, ContactPage, AboutPage, FAQPage)
- **Korrekte Felder**: name, url, telephone, address, openingHours etc. ausgefüllt und fehlerfrei
- **Validierung**: Keine Fehler im [Google Rich Results Test](https://search.google.com/test/rich-results) / Schema Markup Validator

### Warum es wichtig ist
- Strukturierte Daten können Rich Snippets (z. B. Kontakt, Öffnungszeiten, FAQ) in den Suchergebnissen ermöglichen und die CTR verbessern.

### Wie man es testet
- Quellcode: Nach `application/ld+json` suchen, JSON prüfen
- Google Rich Results Test: URL oder Code-Snippet einfügen
- [Schema.org Validator](https://validator.schema.org/)

### Idealer Zustand vor dem Livegang
- Startseite/Kontakt: Physician oder MedicalBusiness mit Adresse, Telefon, Öffnungszeiten.
- Kontakt: ContactPage.
- Über uns: AboutPage oder Physician.
- FAQ: FAQPage mit Fragen/Antworten.
- Keine kritischen Fehler in den Validatoren.

---

### Befund Ihre Website (Schema)
- **index.html**: Physician mit name, jobTitle, description, url, telephone, email, address, geo, openingHoursSpecification – sehr gut.
- **kontakt.html**: ContactPage mit mainEntity (Physician) – gut.
- **ueber-uns.html**: AboutPage mit mainEntity Physician – gut.
- **wissen-news** (DE/EN/TR): WebPage-Schema vorhanden.
- **faq**: FAQPage-Schema referenziert – gut.
- **therapieangebot, r-force**: WebPage/Provider-Schema vorhanden.
- **Empfehlung:** Vor Live Rich Results Test für Startseite und Kontakt ausführen; bei FAQPage prüfen, ob alle FAQ-Paare korrekt ausgezeichnet sind.

---

## 8. Häufige SEO-Fehler vor dem Launch

### Was geprüft werden muss
- **Doppelte Titles/Descriptions** über mehrere Seiten
- **Fehlende Canonicals** oder Canonical auf falsche Domain (z. B. Staging)
- **Broken Links** (interne und externe)
- **Mixed Content** (HTTPS-Seite lädt HTTP-Ressourcen)
- **Redirect-Ketten** (z. B. http → https → www)
- **Hreflang**: Wenn mehrsprachig, konsistente hreflang-Sets (alle Varianten gegenseitig verlinkt)
- **Doppelter Inhalt** zwischen Sprachversionen ohne hreflang/canonical

### Warum es wichtig ist
- Diese Fehler führen zu schlechter Indexierung, Duplicate-Content-Problemen oder Sicherheitswarnungen.

### Wie man es testet
- Crawl (Screaming Frog, Sitebulb): Titles, Descriptions, Canonicals, Links, Statuscodes
- Browser: Alle Seiten unter finaler Domain (https://www.drcenik.at/) aufrufen; Netzwerk-Tab auf HTTP-Ressourcen prüfen
- Hreflang: Manuell oder mit Tool (z. B. Sistrix, hreflang Tags Testing Tool)

### Idealer Zustand vor dem Livegang
- Keine Duplikate bei Title/Meta Description für wichtige Seiten.
- Alle Canonicals auf die Live-Domain (https://www.drcenik.at/...).
- Keine 404 auf verlinkten Seiten; 301 von alten URLs falls nötig.
- Alles über HTTPS; hreflang auf allen Sprachversionen konsistent.

---

### Befund Ihre Website (Häufige Fehler)
- **Titles/Descriptions**: Einzigartig pro Seite – gut.
- **Canonicals**: Auf https://www.drcenik.at/... gesetzt – gut.
- **Hreflang**: Im Sitemap und in den HTML-Head-Bereichen (link rel="alternate" hreflang) für DE/EN/TR verwendet – gut. Vor Live prüfen: Jede Sprachversion verweist auf alle drei (de, en, tr) inkl. sich selbst.
- **Prototyp**: `prototype-apple.html` in robots.txt disallow – sinnvoll, nicht in Sitemap – gut.
- **Gutschein-Vorlage**: In Sitemap fehlend – je nach Ziel: aufnehmen oder bewusst nicht indexieren (dann ggf. noindex oder in robots disallow).

---

## Kurz-Checkliste vor dem Livegang (Abhaken)

| Bereich | Prüfung | Status (Beispiel) |
|--------|---------|-------------------|
| Technisch | robots.txt, Sitemap, Canonical, noindex | ✅ weitgehend ok; Sitemap: Gutschein-Vorlage optional |
| Onpage | Title, Meta, H1 pro Seite | ✅ ok; Gutschein-Seite: H1 statt H2 |
| Content | Keywords, keine Thin Content | ✅ ok |
| Bilder | Alt-Texte, Dateinamen, Größen | ⚠ Alt bei Artikelbildern ausbaufähig |
| Intern | Nav, Footer, interne Links | ✅ ok |
| Mobile/CWV | Viewport, Responsive, CWV | ✅ vorbereitet; CWV nach Go-Live messen |
| Schema | Physician, Contact, FAQ, About | ✅ vorhanden; Validator vor Go-Live |
| Fehler | Duplikate, Broken Links, HTTPS, Hreflang | ✅ gut; Hreflang-Konsistenz prüfen |

---

## 404-Seite und Server-Konfiguration

- **404.html**: Liegt im Projektroot. Enthält „Seite nicht gefunden“, Link zur Startseite und Kontakt, gleiches Layout/Nav wie die übrige Website; `noindex, follow` gesetzt.
- **Server**: Damit bei fehlerhaften URLs die 404-Seite ausgeliefert wird, muss das Fehlerdokument konfiguriert werden:
  - **Apache** (`.htaccess`): `ErrorDocument 404 /404.html`
  - **Nginx**: `error_page 404 /404.html;` (im `server`-Block)
  - **Netlify/Vercel**: In der Projekt-Config „Custom 404 page“ auf `/404.html` setzen (oft Standard).

---

## Bildoptimierung (optional)

- Im Projekt: `scripts/optimize-images.js` und `package.json` mit Script `optimize-images` (nutzt `sharp`).
- **Ausführung** (wenn Node.js/npm installiert ist): `npm install` dann `npm run optimize-images`. Ohne Node: Bilder manuell komprimieren (z. B. TinyPNG, Squoosh).

---

**Hinweis:** Die konkreten Befunde beziehen sich auf den aktuellen Stand des Projekts. Nach letzten Änderungen und direkt vor dem Livegang einen finalen Crawl (z. B. mit Screaming Frog) und einen Test mit PageSpeed Insights auf der Staging-/Live-URL durchführen.
