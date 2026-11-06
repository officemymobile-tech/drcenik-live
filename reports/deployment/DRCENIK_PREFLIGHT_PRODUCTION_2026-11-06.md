# DRCENIK — Preflight Production (ohne Deploy)

**Datum:** 6. November 2026  
**Production-Deploy:** **NICHT ausgeführt**  
**DNS / Workers / Secrets:** unverändert

---

## Entscheidung Kurz

Technische Veröffentlichungsvoraussetzungen für den RC sind **vorbereitet**.  
Production bleibt gesperrt, bis der Owner den Environment-Review freigibt und den Workflow bewusst startet.

---

## 1) Remote-Commit & Tag (verifiziert)

| Objekt | Remote-Wert | Status |
| --- | --- | --- |
| GitHub Auth | `officemymobile-tech` (repo+workflow) | PASS |
| Freigegebener RC-Commit | `cfcc7ab31ddf6ec95d61d2ca4b96d5975300c33d` | vorhanden |
| Tag `rc/seo-assistant-2026-11-06` | annotated → peelt auf **`cfcc7ab…`** | PASS |
| Branch `release/seo-physikalische-therapie-wien-11` | enthält RC als Ancestor | PASS |
| Force-Push | **nicht verwendet** | PASS |
| `origin/main` | `6ed5952` (älter, **ohne** RC) | erwartet |

Hinweis: `main` enthält den RC **nicht**. Ein versehentliches Deploy von `main` würde den falschen Stand liefern — deshalb RC-Pin in der Pipeline (unten).

---

## 2) Production-Environment-Schutz

| Regel | Status |
| --- | --- |
| Environment `production` | vorhanden |
| Required reviewers | **aktiv** → User `officemymobile-tech` |
| Deployment branch policy | **custom** |
| Erlaubte Quellen | Branch `release/seo-physikalische-therapie-wien-11` · Tag `rc/seo-assistant-2026-11-06` |
| `can_admins_bypass` | `true` (GitHub-Default; Owner-Achtung) |

### Manuelle Freigabe (dokumentiert)

1. Actions → **Deploy Cloudflare Pages** → **Run workflow**
2. **Use workflow from:** `release/seo-physikalische-therapie-wien-11` (aktueller Gate-Workflow)
3. **git_ref:** `rc/seo-assistant-2026-11-06`
4. **confirm_production_deploy:** `DEPLOY-PRODUCTION`
5. Nach Start: Environment **`production`** → Review **Approve**
6. Erst danach läuft der Deploy-Job

Ohne Reviewer-Freigabe und ohne exakte Bestätigungszeichenkette startet kein Production-Upload über Actions.

---

## 3) Pipeline pinnt den freigegebenen Commit (nicht altes `main`)

Workflow-Absicherung:

- Input `git_ref` nur erlaubt als `rc/seo-assistant-2026-11-06` **oder** `cfcc7ab31ddf6ec95d61d2ca4b96d5975300c33d`
- `actions/checkout` mit diesem Ref
- `git rev-parse HEAD` muss exakt `cfcc7ab…` sein, sonst Abbruch
- `wrangler pages deploy` setzt `--commit-hash=cfcc7ab…`
- `npm run deploy-pages` lokal → **REFUSED** (kein ungepinntes Production-Publish)

Damit kann die Actions-Pipeline keinen älteren `main`-Stand (`6ed5952`) als freigegebenen Inhalt deployen.

---

## 4) Functions-Gate (erneut geprüft)

| Prüfung | Exit | Ergebnis |
| --- | --- | --- |
| Validator ohne `functions/` | **1** | FAIL closed — Static-only blockiert |
| Validator mit RC-Function | **0** | PASS |

Deployments ohne Pages Functions werden vor Upload abgebrochen.

---

## 5) Rollback vorbereitet

Runbook: `reports/deployment/DRCENIK_ROLLBACK_9d68e71d.md`

Ziel-Deployment: **`9d68e71d-82e9-4206-a2ec-e6f1a407c151`**  
Dashboard → Pages `drcenik-live` → Deployments → Rollback to this deployment  
Probe: `node scripts/probe-patient-assistant-api.mjs https://www.drcenik.at`

---

## 6) Exaktes Deployment-Verfahren (wenn Owner freigibt)

**Noch nicht ausführen in diesem Preflight.**

```text
1. GitHub Actions → Deploy Cloudflare Pages → Run workflow
2. Use workflow from: release/seo-physikalische-therapie-wien-11
3. git_ref = rc/seo-assistant-2026-11-06
4. confirm_production_deploy = DEPLOY-PRODUCTION
5. Environment production → Approve
6. Warten auf Pages Deploy + API-Probe-Step
7. Manuell: Assistent DE/EN/TR Stichprobe auf https://www.drcenik.at
8. Bei Fehler: Rollback 9d68e71d… laut Runbook
```

Freigegebener Inhalt: Commit **`cfcc7ab31ddf6ec95d61d2ca4b96d5975300c33d`**  
Getestetes Preview: **`3a4cb082-65d7-4189-b009-e279e09e8c8d`** (`uses_functions: true`)

---

## 7) Verbleibende Risiken

| Risiko | Hinweis |
| --- | --- |
| Admin-Bypass Environment | Admins können Review umgehen (`can_admins_bypass: true`) |
| Lokales Wrangler mit Token | Nur über `ALLOW_PRODUCTION_RC_DEPLOY=YES` + HEAD=RC; trotzdem Actions bevorzugen |
| Worker/DNS | bewusst unangetastet; weiter Proxy-Modell beachten |

---

## Preflight-Status

| Voraussetzung | Status |
| --- | --- |
| RC + Tag remote | **PASS** |
| Environment manuelle Freigabe | **PASS** (Reviewer + Branch/Tag-Policy) |
| Pipeline nur freigegebener Commit | **PASS** (vorbereitet im Workflow) |
| Functions-los blockiert | **PASS** |
| Rollback-Runbook | **PASS** |
| Production-Deploy | **NICHT ausgeführt** |
