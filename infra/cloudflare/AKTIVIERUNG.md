# Cloudflare aktivieren — Checkliste drcenik.at

**Stand:** 11. Juni 2026  
**Worker:** `drcenik-redirects` deployed (Routes `drcenik.at/*`, `www.drcenik.at/*`)  
**Zone-ID:** `b7ff8c0a0014cf9b634b109db088c392`  
**Status Zone:** `active` (Cloudflare-Mail bestätigt) — **offen:** `www` muss **Proxied** (orange Wolke) sein

## Was der Worker nach Aktivierung liefert (echte HTTP-301)

| Von | Nach |
|-----|------|
| `http://` / `drcenik.at` | `https://www.drcenik.at` + Pfad |
| `/index.html` | `/` |
| `/267059-geschenkgutschein-vorlage.html` | `/geschenkgutschein.html` |
| `/*.html/` (Trailing Slash) | ohne Slash |

Prüfung: `npm run audit-redirects` → Ziel **7/7**

---

## Schritt 1 — Nameserver bei World4You (Pflicht, manuell)

1. [my.world4you.com](https://my.world4you.com/) → **Domains** → `drcenik.at`
2. **Nameserver** / DNS-Verwaltung → **eigene Nameserver** (nicht World4You-Standard)
3. Eintragen:

   ```
   aarav.ns.cloudflare.com
   nancy.ns.cloudflare.com
   ```

4. Speichern. Propagation: **15 Min – 24 h**

Aktuell noch aktiv: `ns1.world4you.at`, `ns2.world4you.at`

---

## Schritt 2 — World4You Apex-Weiterleitung deaktivieren

Sobald Cloudflare-NS aktiv sind:

- World4You → `drcenik.at` → **Weiterleitung** für Apex **ausschalten**
- Sonst Konflikt mit Cloudflare A-Records / Worker

---

## Schritt 3 — DNS in Cloudflare (P0: www proxied)

**Ohne diesen Schritt bleiben Live-301-Redirects bei 3/7** (`index.html`, Gutschein, Trailing-Slash).

### Option A — API (empfohlen)

1. Cloudflare Dashboard → **My Profile** → **API Tokens** → **Create Token**
2. Vorlage **Edit zone DNS** oder Custom:
   - Zone → DNS → Edit
   - Zone → Zone → Read
   - Zone → Zone Settings → Edit (für Always Use HTTPS)
3. Zone: `drcenik.at`

```powershell
cd C:\Users\Kassa\drcenik-live
$env:CLOUDFLARE_API_TOKEN = "DEIN_TOKEN"
npm run provision-cloudflare-dns
npm run audit-redirects
```

Setzt automatisch:

| Typ | Name | Ziel | Proxy |
|-----|------|------|-------|
| CNAME | www | officemymobile-tech.github.io | ✅ orange |
| A | @ | 185.199.108–111.153 (GitHub Pages) | ✅ |

### Option B — Dashboard (ohne Token)

Cloudflare → `drcenik.at` → **DNS** → `www` CNAME → **Proxied** (orange Wolke, nicht grau)

---

## Schritt 3b — DNS-Details (Referenz)

### Option A — API (empfohlen)

1. Cloudflare Dashboard → **My Profile** → **API Tokens** → **Create Token**
2. Vorlage **Edit zone DNS** oder Custom:
   - Zone → DNS → Edit
   - Zone → Zone → Read
   - Zone → Zone Settings → Edit (für Always Use HTTPS)
3. Zone: `drcenik.at`

```powershell
cd C:\Users\Kassa\drcenik-live
$env:CLOUDFLARE_API_TOKEN = "DEIN_TOKEN"
npm run provision-cloudflare-dns
```

Setzt automatisch:

| Typ | Name | Ziel | Proxy |
|-----|------|------|-------|
| CNAME | www | officemymobile-tech.github.io | ✅ |
| A | @ | 185.199.108–111.153 (GitHub Pages) | ✅ |

E-Mail-Records (`mail`, `imap`) bleiben **DNS only**.

### Option B — Dashboard manuell

Cloudflare → `drcenik.at` → **DNS** → Records wie in `infra/cloudflare/README.md`

---

## Schritt 4 — SSL (Cloudflare Dashboard)

- **SSL/TLS** → **Full (strict)**
- **Edge Certificates** → **Always Use HTTPS**: ON

GitHub Pages: **Enforce HTTPS** bleibt AN.

---

## Schritt 5 — Prüfen

```bash
npm run audit-redirects
```

Optional Warte-Monitor (nach NS-Umstellung):

```bash
npm run monitor-cf
```

---

## Schritt 6 — Security Headers (Worker)

Der Worker `drcenik-redirects` setzt auf **allen** Antworten (HTML, 301-Redirects, `/api/google-reviews`) folgende Header:

| Header | Wert |
|--------|------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `Content-Security-Policy` | siehe `worker.js` → `CONTENT_SECURITY_POLICY` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Kamera, Mikrofon, Geolocation, Payment, USB deaktiviert |
| `X-Content-Type-Options` | `nosniff` |

**Deploy nach Änderung an `worker.js`:**

```powershell
cd C:\Users\Kassa\drcenik-live\infra\cloudflare
npx wrangler login    # einmalig
npx wrangler deploy
```

Propagation: meist **unter 1 Minute**. Worker muss auf `drcenik.at/*` und `www.drcenik.at/*` geroutet sein (`wrangler.toml`).

**Prüfen (PowerShell oder curl):**

```powershell
curl.exe -sI https://www.drcenik.at/ | findstr /i "strict-transport content-security x-frame referrer permissions x-content"
```

Erwartung: alle sechs Header in der Antwort. Bei 301-Redirects ebenfalls (z. B. `https://drcenik.at/`).

**CSP-Hinweise** (Domains, die erlaubt sein müssen):

- **GA4** (nach Cookie-Consent): `www.googletagmanager.com`, `www.google-analytics.com`, `analytics.google.com`, `region1.google-analytics.com`
- **Google Maps** (iframe nach Consent): `frame-src https://www.google.com`
- **Kontaktformular**: `connect-src … https://formsubmit.co`
- **Logo-Fallback**: `script-src-attr 'unsafe-inline'` (wegen `onerror` auf `<img>`)
- **404-Seite**: `style-src 'unsafe-inline'` (wenige inline styles)
- Schriften/Bilder: nur `'self'` (lokal unter `assets/`)

Bei neuen Drittanbieter-Skripten CSP in `worker.js` anpassen und erneut deployen.

---

## Troubleshooting

| Problem | Lösung |
|---------|--------|
| Weiterhin 2/7 bei audit | NS noch nicht auf Cloudflare; Worker bekommt keinen Traffic |
| `Authentication error` bei provision | API-Token mit DNS-Edit-Rechten erstellen (Wrangler-OAuth reicht nicht) |
| Apex + www beide down | World4You-Weiterleitung noch aktiv → deaktivieren |
| E-Mail bricht | `mail`/`imap` in CF auf **DNS only** (grau), nicht proxied |
| Security-Header fehlen | `cd infra/cloudflare && npx wrangler deploy`; `www` muss proxied sein |
| CSP blockiert GA4/Maps | Consent akzeptieren; bei neuen Domains `worker.js` → CSP erweitern |
