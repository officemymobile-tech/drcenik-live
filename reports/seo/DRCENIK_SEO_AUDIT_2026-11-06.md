# Dr. Cenik – yerel SEO denetimi (6 Kasım 2026)

Bu rapor https://www.drcenik.at için yapılan doğrulanmış denetimi özetler. Sıralama vaadi yoktur. Google sıralamayı bağımsız belirler.

## Yönetici özeti

Site, Dr. med. univ. Fadime Cenik’in 1110 Wien, Simmering’deki (Kaiser-Ebersdorfer-Straße 328) fiziksel tıp ve rehabilitasyon muayenehanesine aittir. Depo `officemymobile-tech/drcenik-live`, statik HTML’dir ve Cloudflare Pages (`drcenik-live`) üzerinden yayınlanır. `main` dalına yapılan her itme, GitHub Actions ile otomatik yayına gider.

Canlı site teknik olarak büyük ölçüde indekslenebilir: HTTPS, www yönlendirmesi, canonical etiketler, sitemap ve robots.txt çalışıyor. Şüphelenilen `/therapieangebot` kopyası canlıda zaten 301 ile `/therapieangebot.html` adresine gidiyor. Asıl arama açığı, “Physikalische Therapie Wien 11” niyetine ayrılmış, taranabilir bir sayfanın olmamasıydı. Ana sayfa hekimlik kimliğini taşıyor; tedavi kataloğu ise tüm yöntemlerin listesi. Bu iki sayfa tek başına yerel terapi aramasını karşılamıyor.

Google Search Console, Analytics ve Business Profile API’lerine bu oturumda erişilemedi. Gösterim, tıklama, TO ve ortalama konum uydurulmadı.

## Depo ve yayın

| Kontrol | Sonuç |
| --- | --- |
| Depo | `https://github.com/officemymobile-tech/drcenik-live.git` |
| Dal | Denetim başında `main`, `origin/main` ile temiz, commit `6ed5952` (19 Eylül 2026) |
| Çatı | Statik HTML, CSS, JS. Ayrı bir derleme adımı yok |
| Yayın | Cloudflare Pages, workflow `.github/workflows/deploy-cloudflare-pages.yml`, yalnızca `main` |
| Son kayıtlı GitHub yayını | 28 Ağustos 2026, commit `82b8f3f` |
| Geri alma noktası | Yerel etiket `backup/pre-seo-2026-11-06` → `6ed5952` |

Çalışma dalı: `seo/local-wien-11-2026-11-06`. Bu dal uzak depoya itilmedi ve canlıya alınmadı.

## Canlı site ile Git farkı

Canlı HTML, Git’teki `main` ile aynı değil. Örnek: canlı ana sayfa başlığı `Dr. Fadime Cenik – Physikalische Medizin 1110 Wien | alle Kassen`. Depodaki başlık denetimden önce `Dr. Fadime Cenik – Physikalische Medizin & Rehabilitation` idi.

Canlıda olup depoda olmayanlar:

- Ana sayfadaki “Kassen und Abrechnung” açıklaması
- `scripts/patient-assistant-boot.js` ve buna bağlı asistan dosyaları
- `styles/main.css` sürüm `v=28` içindeki ek kurallar
- Birçok sayfada daha yeni başlıklar

Bu dosyalar Git geçmişinde yok. `main` dalının olduğu gibi yayınlanması, canlıdaki bu iyileştirmeleri siler. Bu yüzden yayın yapılmadı.

## Google verisi

- Search Console: sitede doğrulama meta etiketi var (`google-site-verification`). OAuth istemcisi yalnızca `config/gsc-oauth-client.json.example`. Sorgu, cihaz veya ülke verisi çekilmedi.
- Analytics: sitede GA4 kimliği `G-4HLLNDWSS6` meta etiketi olarak duruyor. Hesaba girilmedi, rapor okunmadı.
- Business Profile: yetkili bağlantı yok. Kategori değişikliği yapılmadı.
- PageSpeed Insights API: 6 Kasım 2026 çağrısı HTTP 429, günlük kota dolu. LCP, INP ve CLS sayısı bu denetimde yok. Uydurulmadı.
- Zengin sonuç testi arayüzüne girilmedi. JSON-LD yerel dosyada ayrıştırılarak doğrulandı.

## Canlı HTTP kanıtı

Ölçüm 6 Kasım 2026, yönlendirme izlenmeden.

| URL | Durum | Gözlem |
| --- | --- | --- |
| `https://www.drcenik.at/` | 200 | İndekslenebilir, canonical `https://www.drcenik.at/`, tek H1 |
| `https://drcenik.at/` | 301 | `https://www.drcenik.at/` |
| `https://www.drcenik.at/index.html` | 301 | `https://www.drcenik.at/` |
| `https://www.drcenik.at/therapieangebot` | 301 | `https://www.drcenik.at/therapieangebot.html` |
| `https://www.drcenik.at/therapieangebot/` | 308 | `/therapieangebot` (ardından 301). İki adım |
| `https://www.drcenik.at/therapieangebot.html` | 200 | Canonical kendi adresi. Başlık: `Therapieangebot Wien 11 – Physikalische Medizin \| Dr. Cenik` |
| `https://www.drcenik.at/therapieangebot.html/` | 301 | `.html` adresine |
| `https://www.drcenik.at/physikalische-therapie-wien-11/` | 404 | Hedef sayfa henüz yayında değil |
| `https://www.drcenik.at/does-not-exist-seo-audit` | 404 | Yumuşak 404 değil |
| `https://www.drcenik.at/404.html` | 200 | `noindex, follow` |
| `https://www.drcenik.at/prototype-apple.html` | 404 | Canlıda dosya yok. robots.txt yine de engelliyor |
| `https://www.drcenik.at/robots.txt` | 200 | `Allow: /`, sitemap, prototype engeli |
| `https://www.drcenik.at/sitemap.xml` | 200 | `therapieangebot.html` var, çıplak `/therapieangebot` yok |
| `https://www.drcenik.at/kontakt.html` | 200 | Canonical doğru |
| `https://www.drcenik.at/rueckenschmerzen-wien/` | 200 | Canonical doğru |

Tercih edilen katalog adresi mevcut mimariye göre `https://www.drcenik.at/therapieangebot.html`. Menü, canonical ve sitemap bu adresi kullanıyor. Çıplak yol canlıda zaten kalıcı olarak buraya gidiyor. Depoda bu kural yoktu; worker ve `_redirects` içine işlendi. Kural canlıya ancak onaylı yayından sonra geçer.

## Anahtar kelime ve sayfa eşlemesi

| Sorgu | Hedef | Gerekçe |
| --- | --- | --- |
| Physikalische Therapie Wien | `/physikalische-therapie-wien-11/` | Hizmet niyeti, ana sayfadaki hekimlik kimliğinden ayrı |
| Physikalische Therapie Wien 11 | aynı sayfa | Yer niyeti bu sayfada |
| Physikalische Therapie Simmering | aynı sayfa | İkinci bir semt sayfası açılmadı |
| Physikalisches Institut Wien / Wien 11 | aynı sayfa | İnsanlar enstitü arar. Muayenehane kendine enstitü demez; sayfa farkı açıklar |
| Physikalische Medizin Wien | `/` | Hekimlik kimliği ana sayfada kalır |
| Physiotherapie Wien 11 / Simmering | `/therapieangebot.html#physiotherapie` ve yeni sayfa | Fizyoterapi ayrı meslek olarak katalogda durur |
| Heilgymnastik Wien 11 | `/therapieangebot.html` ve yeni sayfa | Katalogdaki gerçek başlık |
| Physikalische Therapie 1110 Wien | yeni sayfa | Ayrı URL gerekmez |
| Rehabilitation Wien 11 | `/` ve yeni sayfa | Uzmanlık ana sayfada, süreç yeni sayfada |

Yeni near-duplicate semt sayfaları üretilmedi.

## Rakipler (kamuya açık arama, sıralama ölçümü değil)

Kişiselleştirilmiş Google sonuçları mutlak sıra kabul edilmedi. Aşağıdakiler 6 Kasım 2026 web aramasında görünen organik ve dizin sayfalarıdır. Reklam ile organik ayrımı API’siz aramada tam yapılamaz.

1. **Physita Elf – physikalischetherapie.at** (Simmeringer Hauptstraße 147, 1110 Wien, 01 749 21 64). “Physikalische Therapie” ve “Institut” sorgularında en görünür rakip. Ayrı Wien-11 sayfası, tedavi listesi, saatler ve “alle Kassen” iddiası var. İçerik kopyalanmadı.
2. **Physikalisches Institut Leopoldau – physico.at** (Kürschnergasse 1b, 1210 Wien). “Institut” sorgusunda çıkar, 11. bölge değildir.
3. **Inst. f. Phys.Med. Dr. Zwieauer – physikalisches-institut.at** (Dresdner Straße 38-40, 1200 Wien). Yine “Institut” niyeti, başka bölge.
4. **Dizinler:** herold.at, arztsuche24.at, schnelltermin.at. Bunlar muayenehane sitesi değildir.
5. **Dr. Fadime Cenik – drcenik.at** “Physikalische Medizin Simmering” aramasında kendi sitesiyle görünür. Başlık canlıda fiziksel tıp ve kasa vurguludur, “Physikalische Therapie Wien 11” ifadesini taşımaz.

İçerik boşluğu: rakiplerin terapi enstitüsü sayfalarında sorgu başlıkta, semt sayfasında ve tedavi listesindedir. Dr. Cenik’te güven sinyali daha güçlüdür (isim, uzmanlık, MedUni Wien, adres, telefon, saatler). Eksik olan, bu güveni terapi aramasına bağlayan tek bir yararlı sayfaydı.

## E-E-A-T

Doğrulanıp kullanılanlar: ad ve unvan (impressum), uzmanlık, MedUni Wien (Über uns), adres, telefon `+43 1 769 29 91`, e-posta `office@drcenik.at`, 1990’dan beri aynı adreste muayenehane ve ekibin devralındığı bilgisi, sitede yazılı tedavi ve ordinations saatleri, otobüs 71B/73A/76B/79A/79B ve tramvay 11/71, durak Kaiserebersdorf / Zinnergasse.

Yayınlanmayanlar: yeni ödül, sıralama, hasta yorumu, sonuç vaadi, “her tedavi ÖGK tarafından ödenir” cümlesi, engelli erişim iddiası (sitede doğrulanmış bir cümle yok).

`therapieangebot.html` içindeki Ergotherapie, Logopädie ve Kuraufhalt maddeleri kasa kategorisi diliyle yazılmış. Bunların muayenehanede bizzat sunulduğu bu denetimde ayrıca doğrulanmadı. Yeni sayfaya alınmadı. Hekim onayı olmadan bu üç madde “bizim hizmetimiz” diye genişletilmemeli.

Yasal sayfalar (Impressum, Datenschutz, AGB) değiştirilmedi.

## Performans

PageSpeed kotası dolduğu için laboratuvar skoru yok. Değişiklikler yeni kütüphane eklemez. Yeni sayfa mevcut `styles/main.css` ve yerel SEO şablonunu kullanır. Ana sayfaya yalnızca mevcut kart ve bir kasa metin bloğu eklendi. Bu, ölçülmüş bir hız iyileştirmesi değildir.

## Kalan riskler

- Depo ile canlı site ayrışmış durumda. Onaysız `main` yayını asistanı ve canlı metinleri geri alabilir.
- Search Console verisi olmadan hangi sorgunun gerçekten gösterim aldığını bilmiyoruz.
- `/therapieangebot/` hâlâ iki yönlendirme adımı kullanıyor (308, sonra 301). Zararsız, kısaltılması şart değil.
- Başlık “alle Kassen” ifadesini canlı siteden korur. Gövde metni, her tedavinin ödenmediğini açıklar. Başlıktaki iddia hekim onayına açıktır.
