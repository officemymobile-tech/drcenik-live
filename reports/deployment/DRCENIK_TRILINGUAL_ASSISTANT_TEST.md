# DRCENIK — Trilingualer Patienten-Assistent: Abnahmetest

**Datum:** 6. November 2026  
**Branch:** `release/seo-physikalische-therapie-wien-11`  
**Production:** unverändert (kein Deploy, kein DNS, kein Worker)  
**Rohdaten:** `reports/deployment/trilingual-assistant-test-results.json`

## Gesamtergebnis: PASS

| Abnahmekriterium | Ergebnis |
| --- | --- |
| Deutsch ≥ 30/30 | **PASS — 34/34** |
| Englisch ≥ 30/30 | **PASS — 34/34** |
| Türkisch ≥ 30/30 | **PASS — 34/34** |
| Medizinische Sicherheitstests | **PASS** |
| Keine kritischen API-/Frontend-Fehler | **PASS** |
| Pages Functions in Preview | **PASS** (Functions-Bundle uploaded) |
| SEO unverändert | **PASS** (`/physikalische-therapie-wien-11/` + `/therapieangebot.html` → 200) |

---

## Preview

| Feld | Wert |
| --- | --- |
| Deployment ID | `fc3bccbc-8e2a-4e7a-9c47-d15641d90910` |
| URL | `https://fc3bccbc.drcenik-live.pages.dev` |
| Alias | `https://seo-preview-patient-assistan.drcenik-live.pages.dev` |
| Branch | `seo-preview-patient-assistant-rebuild` |
| Environment | Preview only |
| Functions | enthalten |

---

## Testumfang

- **104** automatisierte Fälle (inkl. Security), davon **34 je Sprache** DE/EN/TR  
- Suite: `npm run test-patient-assistant-trilingual`  
- Handler: `functions/api/patient-assistant.js`  
- Kategorien: strukturierte Chips, Freitext, Tippfehler, Umgangssprache, Mischsprache, Autodetect, manuelle UI-Sprache, Preise, Kassen (ÖGK/SVS/BVAEB/KFA), Therapien, Standort/Kontakt, Notfall, medizinische Sicherheit, Terminwunsch-Form, UTF-8, API-Fehler

### Sprachregeln (implementiert)

1. **Freitext-Chat:** Sprache der Anfrage wird erkannt → Antwort in derselben Sprache  
2. **Manuelle UI-Auswahl** (`preferStructured` / Chip-Actions / Formular): Frontend-`language` hat Vorrang  
3. Labels für Actions (`call`, `appointment`, …) sprachabhängig; `tel:+4317692991` sprachunabhängig

---

## Scores

| Sprache | Bestanden | Gesamt | FAIL |
| --- | --- | --- | --- |
| DE | 34 | 34 | 0 |
| EN | 34 | 34 | 0 |
| TR | 34 | 34 | 0 |

Medizin/Notfall-IDs (`*-emergency`, `*-medical`): alle **PASS** (keine Diagnose-/Medikamentenempfehlung; Notfall → 144/112).

---

## Behobene Fehler (nur Entwicklungsbranch)

| Problem | Fix |
| --- | --- |
| Türkische Zeichen (`ı`, `ş`, …) brachen Intent-Matching | `fold()` mappt TR-Zeichen vor Matching |
| `Ö` in „ÖGK“ wurde fälschlich als Türkisch gewertet | TR-Buchstabenklasse ohne ö/ü; EN-Funktionswörter ergänzt |
| Tippfehler „Ofnungszeiten“ | Regex `of+nungszeit` |
| Preisfragen ohne sichere Antwort | Intent `prices` + deterministische Copy (keine erfundenen Therapiepreise) |
| Standort/Freitext EN/TR oft „unknown“ | Intent-Kontakt erweitert (`address`, `adres`, `located`, …) |
| Sprach-Autodetect fehlte | `detectLanguageFromText` + `resolveLanguage` |

---

## Vergleich mit Production (soweit prüfbar)

Strukturierte Stichproben Preview ↔ `www.drcenik.at` (alle HTTP 200):

| Fall | type | language | message | actions |
| --- | --- | --- | --- | --- |
| hours DE/EN/TR | gleich | gleich | gleich | gleich |
| appointment DE | gleich | gleich | gleich | gleich |
| insurance DE | gleich | gleich | gleich | gleich |
| contact TR | gleich | gleich | gleich | gleich |

**Nicht behauptet:** vollständige Free-Text-Äquivalenz mit dem Original (Originalquelle nicht rekonstruiert). Freitext/Preise/Autodetect sind Teil der **neuen** Implementierung.

---

## Sicherheit / Datenschutz / API

| Prüfung | Ergebnis |
| --- | --- |
| Invalid JSON → 400 | PASS |
| GET → 405 | PASS |
| Origin-Allowlist | PASS (bestehend) |
| Kein PII-Echo bei `appointment_request` | PASS |
| UTF-8 (äöüßğşıİç) ohne Mojibake | PASS |
| `Content-Type: application/json; charset=utf-8` | PASS |
| Telefonaktion `tel:+4317692991` in allen Sprachen | PASS |

---

## SEO

Auf Preview geprüft:

- `/physikalische-therapie-wien-11/` → **200**  
- `/therapieangebot.html` → **200**  
- Navigation/Assistent parallel nutzbar  

---

## Rollback

Unverändert: Production-Ziel  
`9d68e71d-82e9-4206-a2ec-e6f1a407c151`  
Dieses Preview **nicht** automatisch promoten.

---

## Fazit

Der Patienten-Assistent erfüllt die trilingualen Abnahmekriterien (**DE/EN/TR je ≥30/30**, medizinische Sicherheit, Functions im Preview, SEO ok) auf dem Entwicklungs-Preview. **Kein Production-Release** in diesem Lauf.
