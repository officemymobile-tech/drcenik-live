# Dr. Cenik — Nihai üretim serbest bırakma denetimi

**Tarih:** 6 Kasım 2026  
**Dal:** `release/seo-physikalische-therapie-wien-11`  
**Release commit (HEAD):** `8eb25c29bcc039e59f9c859e824a77f0278a68fb`  
**İçerik commit (telefon düzeltmesi):** `562070dac7cad87f826aac769465d0cb5b1264be`  
**Canlı production deployment (değişmedi):** `9d68e71d-82e9-4206-a2ec-e6f1a407c151`  
**Nihai preview deployment:** `622da5c9-3914-4ed5-b1cb-148a68870857` (kaynak `8eb25c2`)  
**Preview alias:** https://seo-preview-2026-11-06.drcenik-live.pages.dev  

**Genel sonuç: CONDITIONAL PASS** (teknik olarak yayına hazır; „alle Kassen“ içerik onayı açık)  
**Bu turda production deployment yapılmadı.**

---

## 1) 87 yedek üretim dosyası × final release — PASS

| Metrik | Değer |
| --- | --- |
| Yedek dosya | 87 |
| Birebir aynı | 83 |
| Planlı fark | 4 (`index.html`, `sitemap.xml`, `therapieangebot`, `therapieangebot.html`) |
| Beklenmeyen fark | 0 |
| Eksik | 0 |

Kaynak: `reports/deployment/final-87-file-check.json`

---

## 2) Hasta asistanı etkileşimli test — PASS

Canlı site **https://www.drcenik.at/** üzerinde:

1. Çerez: „Nur notwendige“
2. **Patienten-Assistent** açıldı
3. **Verstanden** onayı
4. Hızlı eylem **Öffnungszeiten**
5. API cevabı: terapi/ordinasyon saatleri + **Termin vereinbaren** / **Anrufen**

Ek: tarayıcı `Origin` ile `POST /api/patient-assistant` → **200**.

---

## 3) „nutzen Sie unser Telefon“ (yeni SEO sayfası) — PASS

- `/physikalische-therapie-wien-11/` metni: **„Terminvereinbarung telefonisch unter 01 / 769 29 91“**
- Şablon + R-Force kaynak metni düzeltildi
- Preview yeniden yayınlandı: `badPhone=false`, `goodPhone=true`

Not: Eski konu sayfalarında (`faszienschmerzen/` vb.) eski ifade hâlâ var; bu görev kapsamı yeni SEO sayfasıydı.

---

## 4) „alle Kassen“ iddiaları — PASS (onay işaretleri açık)

### Ayırt edilmiş / mevcut canlı metin

| İfade | Yer | Durum |
| --- | --- | --- |
| ÖGK, BVAEB, SVS, KFA; her terapi her kasadan ödenmez | `index.html` kasa bölümü; SEO gövde/FAQ | Canlı/üretim; ayırt edilmiş |
| KFA / ÖGK / BVAEB / SVS logoları | `index.html` | Canlı/üretim |
| SEO: „Kassen: ÖGK · BVAEB · SVS“ + metinde KFA | `physikalische-therapie-wien-11/` | Release; ayırt edilmiş |

### FREIGABE GEREKLİ — bağımsız kanıt yok

| ID | İfade | Yer | Risk |
| --- | --- | --- | --- |
| AK-01 | Title/OG/Twitter: **„\| alle Kassen“** | `index.html` meta | Mutlak pazarlama; tüm Avusturya kasaları sözleşme listesi kanıtlanmadı |
| AK-02 | Meta: **„alle Kassen mit Verordnung“** | `index.html` | Tüm kasa kabulü gibi okunabilir |
| AK-03 | UI: **„Alle Kassen & Privat“** / **„Alle Kassen & Privatordination“** | Hero, kart, kasa başlığı, ilk randevu | Logo listesine rağmen mutlak ifade |
| AK-04 | „Alle Kassen- und Privatleistungen“ | `content/local-seo/pages.mjs` | Mutlak ifade |

**Yayın öncesi öneri:** Sahip AK-01–AK-04’ü onaylar **veya** ifadeler „ÖGK · BVAEB · SVS · KFA & Privat“ ile değiştirilir.

---

## 5) Cloudflare preview × canlı production — PASS (beklenen farklar)

| Yol | Production | Preview | Değerlendirme |
| --- | --- | --- | --- |
| `/` | 200 | 200 + SEO iç linkler | Planlı |
| `/physikalische-therapie-wien-11/` | **404** | **200** | Beklenen (yeni sayfa) |
| `/sitemap.xml` | yeni URL yok | yeni URL var | Planlı |
| `/styles/main.css` | SHA aynı | SHA aynı | Değişmedi |
| `/scripts/patient-assistant.js` | SHA aynı | SHA aynı | Değişmedi |
| `/kontakt.html` | SHA aynı | SHA aynı | Değişmedi |
| `/therapieangebot.html` | farklı | SEO bağlam linki | Planlı |

Canlı alias hâlâ `9d68e71d…`.

---

## 6) `9d68e71d-82e9-4206-a2ec-e6f1a407c151` geri alma — PASS

| Kontrol | Sonuç |
| --- | --- |
| Pages listesinde | Var |
| Ortam | **Production** (şu an aktif) |
| `https://9d68e71d.drcenik-live.pages.dev` | HTTP 200 |
| Mekanizma | Dashboard „Rollback to this deployment“; API `POST .../deployments/{id}/rollback` |
| Wrangler CLI Pages rollback | Yok; Dashboard/API yeterli |
| Yerel yedek | `DRCENIK_LIVE_FULL_BACKUP_2026-11-06` + `recovery/production-2026-10-14` |

Gelecekteki bir production deploy sonrası `9d68e71d…` geçerli geri alma hedefi olarak kalır.

---

## 7) Preview ≡ test edilen release commit — PASS

| Alan | Değer |
| --- | --- |
| Yerel HEAD | `8eb25c29bcc039e59f9c859e824a77f0278a68fb` |
| Preview kaynağı | `8eb25c2` |
| Preview ID | `622da5c9-3914-4ed5-b1cb-148a68870857` |
| Alias | https://seo-preview-2026-11-06.drcenik-live.pages.dev |
| Önceki içerik preview | `b3ddea8b…` / `562070d` (telefon düzeltmesi smoke) |

---

## PASS/FAIL özeti

| # | Kontrol | Sonuç |
| --- | --- | --- |
| 1 | 87 yedek dosya × release | **PASS** |
| 2 | Hasta asistanı etkileşimli | **PASS** |
| 3 | Telefon metni (yeni SEO sayfası) | **PASS** |
| 4 | „alle Kassen“ denetimi + işaretleme | **PASS** (AK-01–AK-04 onay bekliyor) |
| 5 | Preview × production | **PASS** |
| 6 | Rollback `9d68e71d…` | **PASS** |
| 7 | Preview = release commit | **PASS** |

### Genel karar

**CONDITIONAL PASS** — AK-01–AK-04 sahibi onayından sonra production’a alınabilir.  
**Production deployment yapılmadı.**
