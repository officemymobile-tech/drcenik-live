# DRCENIK — Finaler Release Candidate: GO/NO-GO

**Datum:** 6. November 2026  
**Entscheidung:** **GO mit manueller Freigabe** (kein automatisches Production-Deployment)  
**Production-Deploy in diesem Lauf:** **NEIN**

---

## 1) Release-Identität (unveränderlich)

| Feld | Wert |
| --- | --- |
| Release-Commit | `cfcc7ab31ddf6ec95d61d2ca4b96d5975300c33d` |
| Commit-Message | `release: SEO + trilingual patient-assistant Pages Function RC` |
| Branch | `release/seo-physikalische-therapie-wien-11` |
| Lokaler Tag | `rc/seo-assistant-2026-11-06` |
| Preview-Deployment-ID | `3a4cb082-65d7-4189-b009-e279e09e8c8d` |
| Preview-URL | https://3a4cb082.drcenik-live.pages.dev |
| Preview-Alias | https://rc-final-seo-assistant-2026.drcenik-live.pages.dev |
| Preview-Branch | `rc-final-seo-assistant-2026-11-06` |
| Rollback-Ziel | `9d68e71d-82e9-4206-a2ec-e6f1a407c151` |

### Cloudflare-Artefakt (hochgeladen, nicht nur lokal)

CF API Lookup des Deployments:

| Metadatum | Wert |
| --- | --- |
| `uses_functions` | **true** |
| `environment` | **preview** |
| `commit_hash` | **`cfcc7ab31ddf6ec95d61d2ca4b96d5975300c33d`** (identisch zum RC) |
| Functions-Bundle | hochgeladen (`Uploading Functions bundle`) |

Live-Artefakt-Checks (`scripts/verify-pages-deployment-artifact.mjs`): **PASS**

- Home 200, SEO-Seite 200, Assistent-JS/CSS 200  
- `POST /api/patient-assistant` → 200 JSON (nicht 405)  
- Kassenmarker ÖGK/SVS/BVAEB/KFA vorhanden  

---

## 2) Inhalt des Release Candidates

1. Gesicherter Produktions-Website-Stand (Pages-Static-Tree)  
2. Freigegebene SEO-Verbesserungen  
3. `/physikalische-therapie-wien-11/`  
4. Neue dreisprachige Pages Function `functions/api/patient-assistant.js`  
5. Patientenassistenten-UI (`scripts/patient-assistant*.js`, CSS)  
6. Kassenverträge ÖGK · SVS · BVAEB · KFA (Site + Assistent)  
7. Validator `scripts/validate-pages-functions-artifact.mjs` + Functions im Artifact  

---

## 3) Testnachweise auf dem RC-Preview

| Test | Ergebnis |
| --- | --- |
| 104 Assistenten-Tests **gegen Preview** (`--against https://3a4cb082…`) | **PASS** — DE 34/34, EN 34/34, TR 34/34, Medical PASS |
| Contract-Tests (lokal, gleicher Commit) | **PASS** |
| `validate-pages-functions` | **PASS** |
| SEO-Regression `audit-seo-regression-2026-11-06.mjs` | **PASS** |
| SEO-URLs am Preview (`/`, SEO-Seite, Therapieangebot) | **PASS** (200) |
| Browser-E2E am Preview | **PASS** — Consent, Öffnungszeiten DE, Stunden EN, `tel:+4317692991`, Kassen, SEO-Link |

---

## 4) Production-Schutz / keine veraltete Veröffentlichung

| Maßnahme | Status |
| --- | --- |
| Fail-closed Functions-Validator vor Deploy | **aktiv** — Static-only → Exit 1 |
| GitHub Actions: kein `push → main` Auto-Deploy mehr | **umgesetzt** — nur `workflow_dispatch` |
| Explizite Bestätigung `DEPLOY-PRODUCTION` | **erforderlich** im Workflow |
| Job `environment: production` | **gesetzt** |
| Required Reviewers in GitHub Environment `production` | **NOCH LEER** — Owner muss Reviewer aktivieren |
| Direkter `wrangler pages deploy --branch=main` lokal | **technisch weiter möglich** (Token-Risiko) — Prozessregel: nur nach Freigabe |

Fazit Schutz: Veraltete Functions-lose GitHub-Snapshots werden durch den Validator blockiert. Automatisches Main-Push-Deploy ist deaktiviert. **Menschliche Environment-Reviewer sind noch zu aktivieren.**

---

## 5) GO/NO-GO

### Entscheidung: **GO mit manueller Freigabe**

Der Release Candidate ist funktional freigabefähig:

- Dreisprachiger Assistent auf dem **hochgeladenen** Preview bestanden  
- Functions im Cloudflare-Artefakt bestätigt (`uses_functions: true`, Commit-Match)  
- SEO-Regression bestanden  
- Production wurde **nicht** angefasst  

### Vor dem Production-Deploy (Checkliste)

1. GitHub → Settings → Environments → `production` → **Required reviewers** setzen  
2. RC-Commit/Tag nach GitHub pushen (lokaler Push in diesem Lauf: Auth fehlgeschlagen)  
3. Workflow manuell starten mit Input `DEPLOY-PRODUCTION`  
4. Nach Deploy: API-Probe + Stichprobe Assistent DE/EN/TR  
5. Bei Incident: Rollback auf `9d68e71d-82e9-4206-a2ec-e6f1a407c151`

---

## 6) Verbleibende Risiken

| Risiko | Schwere | Kommentar |
| --- | --- | --- |
| Function ist **Neubau**, nicht Originalquelle | Mittel | Strukturierte Antworten production-nah; Free-Text nicht 1:1 garantiert |
| GitHub Environment ohne Reviewer | Hoch (Prozess) | Bis Reviewer gesetzt: Freigabe nur organisatorisch |
| RC/Tag nicht remote gepusht | Mittel | Lokal getaggt; Remote-Push nachholen |
| Lokales Wrangler kann Workflow umgehen | Mittel | Nur freigegebene Operatoren / Token-Schutz |
| Cloudflare listet ältere Production-Einträge | Info | Live-API unter www war zuletzt funktionsfähig; vor Prod-Cutover erneut prüfen |

---

## 7) Rollback

Cloudflare Pages → Projekt `drcenik-live` → Deployment  
`9d68e71d-82e9-4206-a2ec-e6f1a407c151` → **Rollback to this deployment**  
Danach: `POST https://www.drcenik.at/api/patient-assistant` muss HTTP 200 JSON liefern.

---

## Kurzfazit

**GO** für einen späteren, manuell freigegebenen Production-Deploy des Commits `cfcc7ab…` über Preview `3a4cb082…`.  
**NO-GO** für ungeprüftes/automatisches Production-Deploy in diesem Schritt.
