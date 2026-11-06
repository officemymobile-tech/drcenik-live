# Dr. Cenik — SEO sürümü hazır (yayın için onay bekleniyor)

Tarih: 6 Kasım 2026  
Durum: **Canlıya alınmadı.** Onay bekleniyor.

## 1. Kaynak ve yedek doğrulaması

| Öğe | Değer |
| --- | --- |
| Canlı site | `https://www.drcenik.at` |
| Canlı production deployment | `9d68e71d-82e9-4206-a2ec-e6f1a407c151` (14 Ekim 2026) |
| Doğrulanmış yedek | `C:\Users\kassa\Desktop\DRCENIK_LIVE_FULL_BACKUP_2026-11-06` |
| Recovery dalı | `recovery/production-2026-10-14` → `1c58e56` |
| Release dalı | `release/seo-physikalische-therapie-wien-11` |
| SEO geliştirme dalı (dokunulmadı) | `seo/local-wien-11-2026-11-06` → `eaf4227` |
| Git `main` | `6ed5952` (canlıdan eski; doğrudan yayınlanmamalı) |

Recovery dalı, Git `main` üzerindeki araçları koruyarak yedekteki canlı dosya ağacını üstüne kopyalar. Bu, orijinal yükleme commit’i `540cfeb…` değildir; o commit GitHub’da yoktur.

Release, yedeklenen 87 canlı dosyayla karşılaştırıldı: beklenmeyen fark **0**, eksik dosya **0**. Yalnızca planlı SEO dosyaları değişti.

## 2. Değişen dosyalar (release)

- `physikalische-therapie-wien-11/index.html` — yeni hedef sayfa
- `index.html` — yeni sayfaya bağlantılar; Physiotherapie kartı “Physikalische Therapie” olarak hedef sayfaya bağlandı
- `therapieangebot.html` (+ eşdeğer alias `therapieangebot`) — bağlamsal bağlantı
- `sitemap.xml` — yeni URL eklendi
- `infra/cloudflare/worker.js` — `/therapieangebot` → `.html` kuralı kaynakta
- `_redirects` — Pages yedek yönlendirmesi
- `content/local-seo/pages.mjs`, `manifest.json`
- `scripts/build-local-seo-pages.mjs` (hasta asistanı boot eklendi), `generate-sitemap.mjs`, `audit-seo-regression-2026-11-06.mjs`
- SEO raporları `reports/seo/*`
- `.gitignore` — `.wrangler/` eklendi

## 3. Korunan canlı işlevler

- Hasta asistanı: `scripts/patient-assistant-boot.js`, `patient-assistant.js`, `styles/patient-assistant.css`
- Ana sayfa başlığı, kasa metni, saatler, NAP
- DE/TR/EN sayfalar
- Tedavi kataloğu ve yerel SEO sayfaları
- CSS/JS/font/görseller
- Telefon CTA `tel:+4317692991`
- `robots.txt` prototype engeli

Canlı doğrulama (entegrasyon sonrası, yayın yokken):

- `www.drcenik.at` hâlâ asistanlı canlı başlığı gösteriyor
- `/physikalische-therapie-wien-11/` canlıda hâlâ **404** (beklenen)

## 4. Entegre SEO iyileştirmeleri

- Hedef sayfa: Physikalische Therapie Wien 11 | Dr. Fadime Cenik
- H1: Physikalische Therapie in Wien 11 – Simmering
- İç bağlantılar, sitemap, canonical, JSON-LD
- Kaynakta `/therapieangebot` 301 kuralı (canlıda zaten vardı)

## 5. Testler

| Test | Sonuç |
| --- | --- |
| `node scripts/audit-seo-regression-2026-11-06.mjs` | geçti |
| Yedek vs release karşılaştırma | beklenmeyen fark 0 |
| Yerel önizleme `http://127.0.0.1:4191` | ana sayfa, terapi, yeni sayfa, asistan, sitemap OK |
| Cloudflare Pages önizleme | `https://seo-preview-2026-11-06.drcenik-live.pages.dev` ve `https://0aaaa4f3.drcenik-live.pages.dev` — smoke test OK |
| Canlı production alias | değişmedi |

## 6. Eksik bileşenler

- Canlıdaki orijinal yükleme commit’i GitHub’da yok
- DNS kayıtlarının API dışa aktarımı yedekte yoktu
- Worker sırları (`GOOGLE_PLACE_ID`, `GOOGLE_PLACES_API_KEY`) değer olarak yok; canlı Worker’a dokunulmadı
- Bu release Pages önizlemesi Worker route’larını kullanmaz; `/therapieangebot` çıplak yol davranışı önizlemede Worker’sız Pages kurallarına bağlıdır

## 7. Önizleme URL’leri

- Yerel: `http://127.0.0.1:4191/` (oturum sırasında)
- Cloudflare Pages (production değil):  
  `https://seo-preview-2026-11-06.drcenik-live.pages.dev`  
  `https://0aaaa4f3.drcenik-live.pages.dev`

## 8. Canlı yayın planı (onay sonrası)

1. Sahip onayı
2. `release/seo-physikalische-therapie-wien-11` dalını gözden geçirin
3. Production’a almak için mevcut doğrulanmış iş akışı:  
   `npx wrangler pages deploy . --project-name=drcenik-live --branch=main`  
   veya `main`’e merge + GitHub Actions  
   **Dikkat:** `branch=main` production alias’ı günceller.
4. Worker kaynak güncellemesi ayrıdır: `infra/cloudflare` deploy’u yalnızca onayla; canlı Worker şu an zaten terapi yönlendirmesini yapıyor
5. Yayın sonrası smoke: ana sayfa, asistan, terapi, yeni sayfa 200, sitemap

## 9. Geri alma

- Anında geri alma hedefi: mevcut canlı deployment `9d68e71d-82e9-4206-a2ec-e6f1a407c151`
- Cloudflare Dashboard → Pages → `drcenik-live` → Deployments → bu kimliği yeniden production yapın
- Yerel yedek: `C:\Users\kassa\Desktop\DRCENIK_LIVE_FULL_BACKUP_2026-11-06`
- Git: `recovery/production-2026-10-14` veya etiket `backup/pre-seo-2026-11-06`

## Onay kapısı

**Canlıya yayın için açık onayınız gerekir.**  
Şu an yalnızca recovery + release hazır ve Pages önizlemesi açıktır. Production Worker, DNS ve `www.drcenik.at` değiştirilmedi.
