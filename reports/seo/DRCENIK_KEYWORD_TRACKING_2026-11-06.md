# Dr. Cenik – anahtar kelime izleme tabanı (6 Kasım 2026)

Search Console bu oturumda bağlı değildi. Aşağıdaki gösterim, tıklama, TO ve ortalama konum hücreleri boştur. Sıfır yazılmadı, çünkü sıfır ile “veri yok” aynı şey değildir.

Mülk: `https://www.drcenik.at/` (doğrulama etiketi sitede var, API okuması yok).
Karşılaştırma penceresi kurulamadı. Son 28 gün ve önceki 28 gün için sahip dışa aktarımı gerekir.

## Taban tablo

| Sorgu | Hedef URL | Gösterim | Tıklama | TO | Ort. konum | Sayfa |
| --- | --- | --- | --- | --- | --- | --- |
| Physikalische Therapie Wien | `/physikalische-therapie-wien-11/` | veri yok | veri yok | veri yok | veri yok | yayında değil (canlı 404) |
| Physikalische Therapie Wien 11 | `/physikalische-therapie-wien-11/` | veri yok | veri yok | veri yok | veri yok | yayında değil |
| Physikalische Therapie Simmering | `/physikalische-therapie-wien-11/` | veri yok | veri yok | veri yok | veri yok | yayında değil |
| Physikalisches Institut Wien | `/physikalische-therapie-wien-11/` | veri yok | veri yok | veri yok | veri yok | yayında değil |
| Physikalisches Institut Wien 11 | `/physikalische-therapie-wien-11/` | veri yok | veri yok | veri yok | veri yok | yayında değil |
| Physikalische Medizin Wien | `/` | veri yok | veri yok | veri yok | veri yok | canlı 200 |
| Physiotherapie Wien 11 | `/therapieangebot.html#physiotherapie` | veri yok | veri yok | veri yok | veri yok | canlı 200 |
| Physiotherapie Simmering | `/therapieangebot.html#physiotherapie` | veri yok | veri yok | veri yok | veri yok | canlı 200 |
| Heilgymnastik Wien 11 | `/therapieangebot.html` | veri yok | veri yok | veri yok | veri yok | canlı 200 |
| Physikalische Therapie 1110 Wien | `/physikalische-therapie-wien-11/` | veri yok | veri yok | veri yok | veri yok | yayında değil |
| Rehabilitation Wien 11 | `/` | veri yok | veri yok | veri yok | veri yok | canlı 200 |

Cihaz (mobil / masaüstü) ve ülke (Avusturya) kırılımı da yok. Search Console’da bu filtreler dışa aktarımda seçilmeli.

## Dışa aktarım

Search Console → Performans → Arama sonuçları.

1. Tarih: son 28 gün. Dışa aktar: sorgu + sayfa.
2. Aynı raporu önceki 28 gün için tekrarla.
3. Filtre: ülke Avusturya. Varsa cihaz mobil ve masaüstü ayrı.
4. Her hedef sorguyu tablodaki satıra işle.
5. Aynı sorguyu birden fazla URL alıyorsa her URL’yi ayrı satır yap. Bu, yamyamlaşmayı gösterir.

Düşük TO için eşik, veri geldikten sonra konuma göre yorumlanır. Konum verisi olmadan “düşük TO” denmez.

## 30 / 60 / 90 gün

Yayın günü T0 olsun. T0 bugün değildir, çünkü sayfa canlıda değildir.

| Gün | Ne bakılır | Karar |
| --- | --- | --- |
| T0+7 | URL denetimi: yeni sayfa “dizine eklendi” veya “dizine eklenebilir, bekliyor” | 404 veya noindex varsa yayın hatası |
| T0+30 | Hedef sorgularda gösterim, önceki 28 güne göre | Gösterim yoksa başlık ve iç bağlantı gözden geçirilir, yeni semt sayfası açılmaz |
| T0+60 | Aynı sorguda hangi URL’nin gösterim aldığı | Ana sayfa ve yeni sayfa aynı sorguda yarışıyorsa H1’ler ayrılmaya devam eder, üçüncü sayfa açılmaz |
| T0+90 | Tıklama ve ortalama konum, 30. gün tablosuna göre | İyileşme Google’a aittir, garanti edilmez. Konum 10 dışındaysa içerik ancak hekim onaylı gerçek hizmet farkıyla genişletilir |

İzlenen URL’ler:

- `https://www.drcenik.at/physikalische-therapie-wien-11/`
- `https://www.drcenik.at/`
- `https://www.drcenik.at/therapieangebot.html`

Başarı ölçüsü: bu üç adresin doğru indekslenmesi, çıplak `/therapieangebot` adresinin tek 301 ile `.html` adresine gitmesi ve hedef sorgularda gösterimin Search Console’da görünür olması. Birinci sayfa hedefi izlenir, vaat edilmez.
