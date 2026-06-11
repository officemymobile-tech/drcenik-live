# Cloudflare aktivieren — Checkliste drcenik.at

**Stand:** 11. Juni 2026  
**Worker:** `drcenik-redirects` deployed (Routes `drcenik.at/*`, `www.drcenik.at/*`)  
**Zone-ID:** `b7ff8c0a0014cf9b634b109db088c392`  
**Status Zone:** `pending` — Traffic läuft noch über World4You-NS

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

## Schritt 3 — DNS in Cloudflare (nach NS-Umstellung)

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

## Troubleshooting

| Problem | Lösung |
|---------|--------|
| Weiterhin 2/7 bei audit | NS noch nicht auf Cloudflare; Worker bekommt keinen Traffic |
| `Authentication error` bei provision | API-Token mit DNS-Edit-Rechten erstellen (Wrangler-OAuth reicht nicht) |
| Apex + www beide down | World4You-Weiterleitung noch aktiv → deaktivieren |
| E-Mail bricht | `mail`/`imap` in CF auf **DNS only** (grau), nicht proxied |
