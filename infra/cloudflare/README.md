# Cloudflare — HTTP-301 für drcenik.at

GitHub Pages kann keine Pfad-Redirects. Cloudflare sitzt vor GitHub und liefert echte **301**.

## Voraussetzungen

- Cloudflare-Konto (Free reicht)
- Domain `drcenik.at` in Cloudflare importieren
- Nameserver bei World4You auf Cloudflare umstellen

## Schritt 1 — DNS (Cloudflare Dashboard)

| Typ | Name | Inhalt | Proxy |
|-----|------|--------|-------|
| CNAME | `www` | `officemymobile-tech.github.io` | **Proxied** (orange Wolke) |
| A | `@` | `185.199.108.153` | Proxied |
| A | `@` | `185.199.109.153` | Proxied |
| A | `@` | `185.199.110.153` | Proxied |
| A | `@` | `185.199.111.153` | Proxied |

(GitHub Pages Apex-IPs — alternativ Apex-Weiterleitung bei World4You, siehe `../world4you/README.md`.)

## Schritt 2 — SSL/TLS

- **SSL/TLS** → Encryption mode: **Full (strict)**
- **Edge Certificates** → **Always Use HTTPS**: ON
- **Automatic HTTPS Rewrites**: ON

## Schritt 3 — Redirects (eine Option wählen)

### Option A — Bulk Redirects (schnell, ohne Code)

1. **Bulk Redirects** → List erstellen → `bulk-redirects.csv` importieren
2. **Bulk Redirect Rules** → Rule: Liste zuweisen, alle Hosts

### Option B — Redirect Rules (empfohlen für Wildcards)

Regeln in dieser Reihenfolge (Dashboard → Rules → Redirect Rules):

| # | Wenn | Dann | Code |
|---|------|------|------|
| 1 | `http.host eq "drcenik.at"` | Dynamic: `concat("https://www.drcenik.at", http.request.uri.path)` | 301 |
| 2 | `http.request.uri.path eq "/index.html"` | Static: `https://www.drcenik.at/` | 301 |
| 3 | `http.request.uri.path eq "/267059-geschenkgutschein-vorlage.html"` | Static: `https://www.drcenik.at/geschenkgutschein.html` | 301 |
| 4 | `http.request.uri.path matches "^/.+\\.html/$"` | Dynamic: `concat("https://www.drcenik.at", regex_replace(http.request.uri.path, "/$", ""))` | 301 |

„Always Use HTTPS“ deckt `http://www` ab.

### Option C — Worker (alles in einem Deploy)

```bash
cd infra/cloudflare
npm install -g wrangler   # einmalig
wrangler login
wrangler deploy
```

Worker-Route muss `*drcenik.at/*` abdecken (siehe `wrangler.toml`).

## Schritt 4 — GitHub Pages

Repository → **Settings → Pages → Enforce HTTPS** aktivieren.

## Schritt 5 — Prüfen

```bash
npm run audit-redirects
```

Erwartung: alle P0-URLs → **HTTP 301**.

## World4You-Konflikt vermeiden

Wenn Apex-Weiterleitung **und** Cloudflare Apex-A-Records aktiv sind, nur **eine** Apex-Lösung nutzen (Cloudflare A-Records **oder** World4You-Weiterleitung, nicht beides).
