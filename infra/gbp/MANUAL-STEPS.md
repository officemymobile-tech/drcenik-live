# Google Business Profile — Manuelle Schritte (5–10 Min.)

Profil ist unter **officemymobile@gmail.com** erreichbar. Die Website wurde automatisch synchronisiert.
Google blockiert die Bearbeitung im Automations-Browser — diese Schritte bitte **einmal manuell** durchklicken.

## Direktlinks

| Aktion | URL |
|--------|-----|
| Alle Standorte | https://business.google.com/locations |
| Profil bearbeiten | https://business.google.com/n/13753004035634104414/profile?fid=16167401803672481750 |
| Maps (öffentlich) | https://www.google.com/maps?cid=16167401803672481750 |

---

## Schritt 1 — Google-Update prüfen (wichtig!)

1. https://business.google.com/locations öffnen
2. Bei **Dr.Fadime Cenik** auf **„1 Google-Update“** klicken
3. Vorschläge prüfen → **Akzeptieren** nur wenn korrekt, sonst **Ablehnen** und korrekte Daten setzen

---

## Schritt 2 — Kategorie ändern

Aktuell auf Maps nur: **„Arzt“** (zu generisch)

1. **Profil bearbeiten** → **Unternehmensinformationen**
2. **Primärkategorie:** `Arzt für physikalische Medizin und allgemeine Rehabilitation`
   - Falls nicht verfügbar: `Rehabilitationszentrum` oder `Physiotherapie-Praxis`
3. **Zusatzkategorien** (max. 9):
   - Rehabilitationszentrum
   - Physiotherapie-Praxis
   - Schmerztherapeut
   - Massage-Therapeut
   - Medizinisches Zentrum

---

## Schritt 3 — Beschreibung einfügen

**Profil bearbeiten → Info → Beschreibung** — Text aus `config/gbp.json` → Feld `description` kopieren (748 Zeichen).

---

## Schritt 4 — Dienstleistungen

**Dienstleistungen bearbeiten** → Alle Einträge aus `config/gbp.json` → Array `services` anlegen.

Priorität: R-Force, Stoßwellentherapie, Heilmassage, Kassenleistung Physiotherapie, Privatordination.

---

## Schritt 5 — FAQ (Fragen & Antworten)

Im Profil **Fragen und Antworten** → Als Inhaberin die FAQs aus `config/gbp.json` → `faqs` posten.

---

## Schritt 6 — Buchungen / Termin-URL

**Buchungen einrichten** oder **Termin-URL:**
`https://www.drcenik.at/termin.html`

---

## Schritt 7 — Fotos (kritisch für Local Pack)

Mindestens hochladen:
- Außenansicht Kaiser-Ebersdorfer-Straße 328
- Empfang / Wartebereich
- Dr. Cenik Porträt
- R-Force-Laufband
- Therapieraum

Logo allein reicht nicht — Maps zeigt derzeit wenig „Vom Inhaber“-Fotos.

---

## Schritt 8 — Local-SEO-Beiträge (7 Wochen Plan)

**Beitrag hinzufügen** — Copy-Paste aus dem Export:

```bash
npm run gbp-export
```

Quellen:
- `config/gbp-local-posts.json` — 7 Beiträge mit Datum (ab 09.06.2026, dienstags 09:00)
- `config/gbp-local-seo.json` — Dienstleistungen, Review-Vorlagen, Checkliste

Nur einen Post exportieren: `npm run gbp-export -- --post 0` (Index 0–6)

---

## Schritt 8b — Local-SEO-Dienstleistungen

**Dienstleistungen bearbeiten** → Zusätzlich zu den bestehenden Einträgen in `gbp.json` die 7 Services aus `config/gbp-local-seo.json` → `services` anlegen (Name + Kurzbeschreibung + je 1 Foto).

---

## Schritt 9 — Rezensionen

- **Um Rezensionen bitten** → Link kopieren → auf Visitenkarte-QR verlinken
- Alle 6 Rezensionen mit **Antwort** (Danke + Praxisname) — steigert Trust

---

## Bereits gut ✅

- 5,0 Sterne · 6 Rezensionen
- Website drcenik.at verknüpft
- Adresse & Telefon korrekt
- Öffnungszeiten (Therapiezeiten) stimmen
- Beiträge vorhanden
- 1.370 Kundeninteraktionen

## Website bereits synchronisiert ✅

Nach `npm run fix-gbp-website`:
- Schema.org `sameAs` → Maps + LinkedIn + ResearchGate
- Footer: Google Maps + Google-Bewertung
