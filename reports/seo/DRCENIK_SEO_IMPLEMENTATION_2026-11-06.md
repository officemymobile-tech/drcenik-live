# Dr. Cenik – uygulama kaydı (6 Kasım 2026)

Yayın yapılmadı. Değişiklikler dal `seo/local-wien-11-2026-11-06` üzerindedir. Geri alma etiketi: `backup/pre-seo-2026-11-06` (commit `6ed5952`).

## Ne değişti

### P0 – kopya URL kuralı kaynağa alındı

Kanıt: canlıda `GET /therapieangebot` zaten `301` ile `https://www.drcenik.at/therapieangebot.html` adresine gidiyor. Git’teki worker ve Apache `.htaccess` bu kuralı taşımıyordu. Cloudflare Pages `.htaccess` çalıştırmaz. Yeni bir kopya sayfa üretilmedi.

- `infra/cloudflare/worker.js`: `/therapieangebot` ve `/therapieangebot/` için 301.
- `_redirects`: aynı iki kural, Pages yedeği.

Tercih edilen adres `.html` kaldı, çünkü menü, canonical ve sitemap bunu kullanıyor. İç bağlantılar zaten bu adrese gidiyordu. Sitemap’e çıplak yol eklenmedi.

### P1 – arama niyeti sayfası

Yeni URL: `/physikalische-therapie-wien-11/`

- Başlık: `Physikalische Therapie Wien 11 | Dr. Fadime Cenik`
- H1: `Physikalische Therapie in Wien 11 – Simmering`
- Açıklama: `Physikalische Therapie in Wien 11 bei Dr. Fadime Cenik. Fachärztliche Betreuung, individuelle Therapieplanung und Rehabilitation. Termin: 01 769 29 91.`
- Gövde yaklaşık 889 kelime. Şablonla birlikte sayfa yaklaşık 1310 kelime.
- Şema: `MedicalWebPage`, `MedicalTherapy` (sağlayıcı `https://www.drcenik.at/#physician`), `BreadcrumbList`, `FAQPage`.
- Ayrı bir `MedicalClinic` eklenmedi. Ana sayfadaki `Physician` kaydı adres ve telefonu zaten taşıyor. İkinci, çelişen bir işletme nesnesi açılmadı.
- Sayfa muayenehaneyi “Physikalisches Institut” diye adlandırmaz. Arayan kişiye farkı anlatır.
- ÖGK için “her tedavi ödenir” denmez. Metin, canlı ana sayfadaki temkinli kasa cümlesini kullanır: kabul edilen kasalar ÖGK, BVAEB, SVS ve KFA; ödeme endikasyon, reçete ve kasa kuralına bağlıdır.
- Ulaşım yalnızca sitede yazan otobüs ve tramvay hatlarıdır.

Ana sayfa H1’i `Physikalische Medizin & Rehabilitation Wien` olarak kaldı. Başlık, canlıda indekslenen metne çekildi: `Dr. Fadime Cenik – Physikalische Medizin 1110 Wien | alle Kassen` (64 karakter). Açıklama 126 karaktere indirildi ve terapi ile telefonu içeriyor.

`therapieangebot.html` girişine yeni sayfaya giden gerçek bir `<a>` eklendi. Fizyoterapi kartına `id="physiotherapie"` verildi.

### P2 – iç bağlantı ve stil

Ana sayfa kartı, kasa bloğu ve Simmering bölümü yeni sayfaya bağlanır. Bağlantılar normal HTML çapa etiketidir. `.kassen-facts` kuralları `styles/main.css` içine eklendi; mevcut lacivert ve altın düzen korundu. Yeni yazı tipi veya ikon kütüphanesi yok.

`robots.txt` canlıdaki gibi `/prototype-apple` yolunu da engeller.

## Değişen dosyalar

- `physikalische-therapie-wien-11/index.html` (yeni)
- `content/local-seo/pages.mjs`
- `content/local-seo/manifest.json`
- `scripts/build-local-seo-pages.mjs`
- `scripts/generate-sitemap.mjs`
- `scripts/audit-seo-regression-2026-11-06.mjs` (yeni)
- `sitemap.xml`
- `index.html`
- `therapieangebot.html`
- `styles/main.css`
- `infra/cloudflare/worker.js`
- `_redirects` (yeni)
- `robots.txt`

## Test

Komut:

`node scripts/audit-seo-regression-2026-11-06.mjs`

Sonuç: geçti. Kontrol edilenler: ana sayfa ve katalog 200, tek H1, canonical, indekslenebilirlik, telefon bağlantısı `tel:+4317692991`, sitemap kaydı, yönlendirme kuralının kaynakta durması, JSON-LD ayrışması, 404 davranışı, yatay taşma için ayrı ölçüm.

Mobil ölçüm (Edge, 390 px, yerel dosya): `scrollWidth` 390, `clientWidth` 390. H1 kutusu sağ kenarı 374 px. Yatay taşma yok. Menü düğmesi `display: flex`.

Masaüstü ekran görüntüsü (1280 px) mevcut şablonu gösterdi: lacivert başlık, altın üst satır, telefon düğmesi, tam menü.

Playwright’ın Chrome kurulu olmadığı için tarayıcı MCP’si açılamadı. Cursor tarayıcısı `127.0.0.1` adresine ulaşamadı. Doğrulama Edge ve Node ile yapıldı.

PageSpeed Insights: HTTP 429. Skor yazılmadı.

Ayrı bir `npm run build` yok. Sayfa `SEO_ONLY=physikalische-therapie-wien-11 node scripts/build-local-seo-pages.mjs` ile üretildi. Sitemap `node scripts/generate-sitemap.mjs` ile yenilendi. Diğer yerel SEO sayfaları yeniden yazılmadı.

## Yayın durumu

Yayınlanmadı. `main` itmesi tüm siteyi Cloudflare Pages’e gönderir. Canlı kopya Git’ten ileride olduğu için bu dalın yayını, asistan betiğini ve canlıda olup depoda olmayan metinleri silebilir.

Yayın için sahip onayı gerekir. Güvenli yol: canlıdaki yayınlanmamış dosyalar önce depoya alınmalı, bu dal onun üzerine birleştirilmeli, sonra `main`’e alınmalıdır.

## Sahip onayı gerekenler

- Canlıya alma
- Başlıktaki “alle Kassen” ifadesinin kalması
- Ergotherapie, Logopädie ve Kur’un muayenehane hizmeti olarak sunulup sunulmadığı
- Yeni tıbbi iddia eklemek (bu turda eklenmedi)
- Google Business Profile kategori değişikliği (yapılmadı)

## Search Console – yeniden dizine ekleme

Hesaba bu oturumda girilemedi. Yayın sonrası sahip şunları yapmalı:

1. `https://www.drcenik.at/sitemap.xml` adresini tekrar göndermek.
2. URL denetimi: `https://www.drcenik.at/physikalische-therapie-wien-11/`
3. Aynı denetim: `https://www.drcenik.at/` ve `https://www.drcenik.at/therapieangebot.html`
4. `/therapieangebot` için “Sayfa yönlendirmeyle dizine eklenmedi” beklenir. Hedef `.html` olmalıdır.
5. 28 gün sonra hedef sorguların gösterim ve ortalama konumunu bu raporun izleme dosyasıyla karşılaştırmak.

## Geri alma

Yerel:

`git checkout backup/pre-seo-2026-11-06`

Dal uzakda olmadığı için sunucuda geri alınacak bir yayın yoktur. İleride yayınlanırsa önceki Cloudflare Pages dağıtımı geri yüklenebilir. Son kayıtlı GitHub dağıtımı `82b8f3f` (28 Ağustos 2026) tarihine aittir ve bugünkü canlı siteden daha eskidir. Onu geri yüklemek de canlı metni siler. Geri alma, yayından hemen önceki Pages dağıtımı olmalıdır.
