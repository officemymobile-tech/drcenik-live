# Dr. Cenik — Production deployment denemesi (FAIL + Rollback)

**Tarih:** 6 Kasım 2026  
**Freigabe:** Owner onayı ile SEO release yayın denemesi  
**Hedef release commit:** `23d9ea22c1185fbc0a0f3a2a20bc944972d41371`  
**Önceki production:** `9d68e71d-82e9-4206-a2ec-e6f1a407c151`  
**Yeni denenen production:** `7aa094ba-bffb-45ef-86ea-ba323ce435a2` (kaynak `23d9ea2`)  

## Genel sonuç: **FAIL** (kritik hata → anında rollback)

**Güncel canlı production ID:** `9d68e71d-82e9-4206-a2ec-e6f1a407c151`  
**DNS / Secrets / diğer projeler:** dokunulmadı.

---

## 1) Yayın öncesi doğrulama — PASS

| Kontrol | Sonuç |
| --- | --- |
| Canlı = `9d68e71d` (SHA/title) | Evet |
| SEO sayfası canlıda 404 | Evet (beklenen) |
| Release ağacı `23d9ea2` | Doğrulandı (detached HEAD) |
| AK metinleri / sitemap / asistan boot dosyaları | Mevcut |

---

## 2) Yayın — yapıldı, sonra geri alındı

```text
npx wrangler pages deploy . \
  --project-name=drcenik-live \
  --branch=main \
  --commit-hash=23d9ea22c1185fbc0a0f3a2a20bc944972d41371
```

Deployment `7aa094ba-bffb-45ef-86ea-ba323ce435a2` kısa süre production alias’ına alındı.

HTML smoke (yeni deploy sırasında):

| Test | Sonuç |
| --- | --- |
| Homepage 200 + ÖGK·SVS·BVAEB·KFA | PASS |
| `/physikalische-therapie-wien-11/` 200 | PASS |
| Sitemap SEO URL | PASS |
| `/therapieangebot` → 301 `.html` | PASS |
| Navigation / tel / mail | PASS |
| Kontakt 200 | PASS |
| **POST `/api/patient-assistant`** | **FAIL → 405** |

---

## 3) Kritik hata

Eski production deployment API meta: **`uses_functions: true`**.  
`wrangler pages deploy` ile yüklenen `23d9ea2` ağacı **Pages Functions içermiyor** (repo’da `functions/` / `_worker.js` yok).

Sonuç:

- Yeni Pages host (`7aa094ba…pages.dev`): `/api/patient-assistant` → **405**
- Eski Pages host (`9d68e71d…pages.dev`): aynı endpoint → **200**
- Canlıda asistan UI açılıyor ama API cevap vermiyor (kritik işlev kaybı)

Bu, Freigabe maddesi 6 kapsamında **anında rollback** tetikledi. Worker/DNS/secret değiştirilmedi.

---

## 4) Rollback — PASS

```text
POST /accounts/.../pages/projects/drcenik-live/deployments/9d68e71d-.../rollback
→ success=true
```

| Kontrol (rollback sonrası) | Sonuç |
| --- | --- |
| Canonical production | `9d68e71d-82e9-4206-a2ec-e6f1a407c151` |
| Homepage title (eski) | `… \| alle Kassen` |
| SEO sayfası (cache-bust) | **404** |
| POST `/api/patient-assistant` | **200** |
| GET `/api/google-reviews` | **200** |

Not: CDN’de SEO URL için kısa süreli `cf-cache-status: HIT` görülebilir; kaynak deployment geri alındı.

---

## 5) PASS/FAIL özeti

| # | Madde | Sonuç |
| --- | --- | --- |
| 1 | Baseline doğrulama | **PASS** |
| 2 | Release commit doğrulama | **PASS** |
| 3 | Yalnızca bu release ile Pages publish denemesi | **PASS** (yöntem) / içerik deploy **FAIL** |
| 4 | DNS/Secrets/diğer projeler dokunulmadı | **PASS** |
| 5 | Canlı smoke (yeni deploy) | **FAIL** (asistan API) |
| 6 | Kritik hatada rollback | **PASS** |
| 7 | Nihai production ID + rapor | **PASS** (rapor) |

### Genel karar

**FAIL** — SEO HTML yayınlandı ama Pages Functions eksikliği asistan API’sini kırdı; production **`9d68e71d…`** durumuna döndürüldü.

### Sonraki adım (bu turda yapılmadı)

Functions içeren eski production artifact’ı ile SEO HTML’i birleştirip yeniden Freigabe almak; `uses_functions: true` koruması olmadan `main`’e static-only deploy edilmemeli.
