# DRCENIK — Hasta Asistanı Pages Function Kaynak Kurtarma

**Tarih:** 6 Kasım 2026  
**Hedef:** `POST /api/patient-assistant` orijinal Pages Function kaynağı  
**Çalışan production:** `9d68e71d-82e9-4206-a2ec-e6f1a407c151`  
**Dahili script adı:** `pages-worker--18518054-production`  
**Proje:** `drcenik-live`  

**Production’a dokunulmadı. DNS/Worker/GitHub main push yok. Tahmini kaynak üretilmedi.**

---

## Yönetici özeti

| Durum | Sonuç |
| --- | --- |
| **Orijinal kaynak (A)** | **BULUNAMADI** |
| **Derlenmiş production bundle (B)** | **İndirilemedi / erişilemez** |
| **Kısmi artifact (C)** | Client UI + Worker (reviews) + canlı API sözleşmesi |
| **Functions-enabled preview** | **YAPILMADI** (geçerli A/B aday yok) |
| **Kalıcı blocker** | Pages Function kaynağı depo/yedek/API’de yok |

---

## Phase 1 — Yerel Windows araması

### Taranan konumlar

- `%USERPROFILE%\Desktop`, `Documents`, `Downloads`
- `Desktop\WEBSITE_BACKUPS` (+ `archives`, `DEEP_RECOVERY`, `projects`, `github`, bare `.git`)
- `Desktop\DRCENIK_LIVE_FULL_BACKUP_2026-11-06`
- Cursor workspaces / agent-transcripts (içerik tarama)
- `%USERPROFILE%\.wrangler`
- `%TEMP%\drcenik-*` stage klasörleri
- ZIP envanteri (14 ilgili arşiv)

### İçerik anahtarları

`patient-assistant`, `onRequestPost`, `assistant_message`, `/api/patient-assistant`, `functions/api`, `_worker.js`, `pages-worker--18518054-production`

### Bulgular

| Bulgu | Sınıf |
| --- | --- |
| `onRequestPost` / `functions/api/patient-assistant` **sunucu kaynağı** | **0 adet** |
| Client `scripts/patient-assistant.js` (+ boot/css) birçok yedekte | **C** |
| ZIP’lerde yalnızca client asset yolları | **C** |
| PHP_CodeSniffer `functions` dizinleri | **D** (ilgisiz) |
| `pages-worker--18518054` yalnızca JSON metadata | **C** (meta) |

Kanıt indeksleri (ayrı recovery klasörü, mevcut backup’lar üzerine yazılmadı):

- `recovery/patient-assistant-source/local-content-hits.csv`
- `recovery/patient-assistant-source/server-marker-hits.txt`
- `recovery/patient-assistant-source/archive-candidates.csv`
- `recovery/patient-assistant-source/zip-inventory-*.txt`

---

## Phase 2 — GitHub

| Kaynak | Sonuç |
| --- | --- |
| Repo `officemymobile-tech/drcenik-live` branches | `main`, `rforce-btl-update` |
| Tags | yok |
| Actions artifacts | **0** |
| Actions geçmişi | çoğunlukla `Sync Google reviews`; **Pages Functions deploy log’u yok** |
| Code search (`assistant_message`, `onRequestPost`, `/api/patient-assistant`) | boş |
| Commit `540cfeb…` (Pages meta) | GitHub’da **yok** (422) |
| Yerel `git rev-list --objects` | yalnızca client `scripts/patient-assistant*.js` |
| `git grep onRequest` tüm commit’ler | yalnızca yeni validator/rapor metinleri |

**Sonuç:** GitHub’da orijinal Function implementasyonu yok.

---

## Phase 3 — Cloudflare (yetkili OAuth)

### Doğrulanan metadata

| Alan | Değer |
| --- | --- |
| Deployment | `9d68e71d-…` `uses_functions: true` |
| Trigger | `ad_hoc`, dirty commit `540cfeb…` |
| `production_script_name` | `pages-worker--18518054-production` |
| Project env_vars | `null` (asistan için binding listesi yok) |

### Kaynak indirme denemeleri

| Endpoint / yöntem | HTTP | Anlam |
| --- | --- | --- |
| `GET …/workers/scripts/pages-worker--18518054-production` | **404** code **10007** | “This Worker does not exist on your account.” — Pages dahili script, Workers Scripts API’de görünmüyor |
| `GET …/content` | **405** `method_not_allowed` | Desteklenen indirme yolu değil |
| `GET …/workers/services/pages-worker--…` | **404** code **10090** | Aynı |
| `GET …/deployments/…/files` / `/functions` | başarısız / desteklenmiyor (boş veya hata) | Public Pages API Function kaynağı vermiyor |
| `https://9d68e71d…pages.dev/functions/api/patient-assistant.js` | **404** HTML | Kaynak HTTP ile yayınlanmıyor |
| `…/_worker.js`, `…/*.map`, `…/_routes.json` | **404** | Source map / Advanced Mode dosyası yok |
| `GET …/workers/scripts/drcenik-redirects` | **200** | Worker indirildi; **`patient-assistant` yok**; `google-reviews` var |

**Sonuç:** Desteklenen API ile Pages dahili Function bundle’ı **okunamıyor**. 404, “hesapta Worker yok” = Pages-managed script; yetkisiz bypass denenmedi.

Davranış kanıtı (derleme varlığını gösterir, kaynak değildir):

- `9d68e71d…pages.dev` + `www.drcenik.at` → POST API **200**
- Static-only `7aa094ba…` → **405**

---

## Phase 4 — Aday sınıflandırma + SHA-256

Klasör: `recovery/patient-assistant-source/candidates/`

| Dosya | Sınıf | SHA-256 | Not |
| --- | --- | --- | --- |
| `C-client-ui/patient-assistant.js` | **C** | `95E90E45DBD3613843B11A524132430214FFCE06928457C1CD4688788B0322AC` | UI only; `API='/api/patient-assistant'` |
| `C-client-ui/backup-9d68-patient-assistant.js` | **C** | aynı hash | Yedek = repo client |
| `C-client-ui/patient-assistant-boot.js` | **C** | `29308A98B1B436EBC29E21097ACECE0F30B1D0B92A7AC517E0863058EC187847` | Loader |
| `C-related-worker/drcenik-redirects.api-export.js` | **D*** | `6428A10C725A793B284A6EEB8AFDB25E8D68C8E73BA941F69902BCE90F51E186` | Asistan route yok (*ilgili altyapı kanıtı) |
| `C-related-worker` backup kopyası | **D*** | `FA2CCDED…` (backup dosya hash’i) | Aynı içerik ailesi |
| A — orijinal Function | — | — | **yok** |
| B — derlenmiş Pages bundle | — | — | **yok / erişilemez** |

\* Worker, asistan API implementasyonu değildir; yanlış pozitif engeli için D.

---

## Phase 5 — Doğrulama

### C-sınıfı client

- `/api/patient-assistant` **çağırır**, implement **etmez**
- Beklenen JSON alanları UI’da kullanılır: `type`, `message`, `suggestedActions`, `safetyState`, `workflow`
- Runtime: tarayıcı; gizli bağlama yok

### Canlı API sözleşme örneği (sentetik, hasta verisi yok)

Dosya: `candidates/live-api-contract-sanitized.json`

```json
{
  "status": 200,
  "type": "assistant_message",
  "language": "de",
  "suggestedActionIds": ["call", "appointment", "hours"],
  "hasTelHref": true,
  "workflow": null,
  "safetyState": "normal"
}
```

Mesaj metni rapora yazılmadı (gerek yok); uzunluk alanı tutuldu.

### Eşdeğerlik

HTTP 200 ≠ kaynak kurtarma. A/B aday olmadığı için lokal Function testi ve preview **yapılmadı**.

---

## Phase 6 — Kaynak yoksa gelecek rekonstrüksiyon planı

**Uyarı:** Yeni yazılacak kod **asla “kurtarılmış orijinal” diye adlandırılmamalı.**

1. Hekim onaylı organizasyon içerikleri (saatler, telefon, Kassen metni, acil durum redaksiyonu)  
2. Public contract’a uygun yeni Pages Function (`functions/api/patient-assistant.js`) — ayrı Freigabe  
3. `validate-pages-functions-artifact` + preview API probe zorunlu  
4. Production yalnızca Functions’lı artifact + rollback `9d68e71d` hazırken  

Bu görevde rekonstrüksiyon **kodlanmadı / deploy edilmedi**.

---

## Preview test sonuçları

| Test | Sonuç |
| --- | --- |
| Functions-enabled preview | **SKIP / BLOCKED** |
| Production deploy | **YOK** |

---

## Kalan blocker’lar

1. Orijinal Function kaynağı hiçbir yetkili kanalda yok  
2. Pages dahili worker API ile export edilemiyor (404/405)  
3. GitHub commit `540cfeb` ve Actions artifact yok  
4. HTTP crawl yalnızca static asset kurtarır  

### Olası sonraki insan aksiyonları

- Eski geliştirici makinesi / Time Machine / başka PC yedekleri  
- Cloudflare Dashboard → Pages → deployment → varsa Function source UI (API’de yok)  
- Cursor/Cloud geçmiş sohbet export’ları (bu makinede Function kaynak dosyası çıkmadı)  

---

## Sonuç cümlesi

**Orijinal kaynak kurtarma: FAIL.**  
**Derlenmiş bundle kurtarma: FAIL (erişim yok).**  
**Kısmi client/worker kanıtı: PASS (sınıf C/D).**  
Production sağlıklı bırakıldı; SEO Functions’sız yeniden yayınlanmamalı.
