# World4You — Apex & DNS für drcenik.at

## Aktuelles Setup

- `www` → CNAME → `officemymobile-tech.github.io` (GitHub Pages)
- Apex-HTTP leitet derzeit auf `http://www.drcenik.at/` (ohne HTTPS) — **fixen**

## Option A — Mit Cloudflare (empfohlen)

Nameserver bei World4You auf Cloudflare zeigen, DNS wie in `../cloudflare/README.md`.  
World4You-Apex-Weiterleitung **deaktivieren**, wenn Cloudflare Apex-A-Records gesetzt sind.

## Option B — Nur World4You (ohne Cloudflare)

### Apex `drcenik.at` → www HTTPS

World4You Kundenbereich → **Domains** → `drcenik.at` → **Weiterleitung**:

| Feld | Wert |
|------|------|
| Ziel | `https://www.drcenik.at/` |
| Typ | **301 Permanent** |
| Pfad beibehalten | **Ja** (`/kontakt.html` → `https://www.drcenik.at/kontakt.html`) |

**Wichtig:** Ziel muss `https://` sein, nicht `http://www.drcenik.at`.

### Was World4You für `www` nicht kann

Solange `www` per CNAME direkt auf GitHub zeigt, sind **keine** Pfad-Redirects möglich für:

- `/index.html` → `/`
- Legacy-Gutschein-URL

→ Cloudflare vor `www` ist nötig (siehe `../cloudflare/README.md`).

### GitHub Pages HTTPS

Zusätzlich in GitHub: **Settings → Pages → Enforce HTTPS** aktivieren.

## Prüfung

```bash
curl -sI http://drcenik.at/ | findstr HTTP Location
# Erwartung: 301 → https://www.drcenik.at/

npm run audit-redirects
```
