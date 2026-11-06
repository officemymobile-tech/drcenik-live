# INCIDENT — Dr. Cenik Production Rollback

**Tarih / Saat:** 6 Kasım 2026, ~17:53 CET  
**Proje:** Cloudflare Pages `drcenik-live`  
**Domain:** https://www.drcenik.at  

## Sonuçlar (özet)

| Kontrol | Sonuç |
| --- | --- |
| **ROLLBACK** | **PASS** (ek rollback gerekmedi; canonical zaten hedefte) |
| **ASSISTENTEN-API** | **PASS** (HTTP 200 + UI akışı OK) |
| SEO yeniden yayın | **YAPILMADI** |
| DNS / Secrets / Worker / GitHub değişikliği | **YAPILMADI** |

---

## 1) Production durumu

| Alan | Değer |
| --- | --- |
| Canonical production ID | `9d68e71d-82e9-4206-a2ec-e6f1a407c151` |
| Alias | `https://www.drcenik.at` |
| `uses_functions` | `true` |
| Kaynak commit (Pages meta) | `540cfeb…` |
| Hatalı denenen deploy | `7aa094ba-bffb-45ef-86ea-ba323ce435a2` (artık alias’ta değil) |

**Aksiyon:** Madde 3 gereği ek rollback **yapılmadı** — hedef deployment zaten aktif.

Homepage title (canlı): `Dr. Fadime Cenik – Physikalische Medizin 1110 Wien | alle Kassen`  
SEO hedef URL cache-bust: **404** (beklenen eski durum).

---

## 2) Hata kök nedeni (önceki olay)

Static `wrangler pages deploy` ile `23d9ea2` production’a alındığında Pages **Functions taşınmadı**.  
Eski production `uses_functions: true`; yeni deploy Functions’sız → `POST /api/patient-assistant` **405**.

Anında rollback (önceki tur) başarıyla uygulandı; bu turda doğrulandı.

---

## 3) Assistenten-API & UI doğrulama

### UI (canlı)

1. Assistent öffnen → **PASS**
2. Einwilligung „Verstanden“ → **PASS**
3. Schnellaktion „Öffnungszeiten“ → **PASS** (Therapiezeiten metni göründü; preparing kayboldu)
4. Termin / Anrufen yüzeyleri → **PASS** (`Termin vereinbaren`, `Anrufen` / `tel:+4317692991`)

### API

```text
POST https://www.drcenik.at/api/patient-assistant
Origin: https://www.drcenik.at
Body: {"message":"Oeffnungszeiten?","lang":"de"}
→ HTTP 200
→ type: assistant_message
→ suggestedActions: Anrufen (tel:+4317692991), Termin vereinbaren, Öffnungszeiten
```

Hassas veri / API anahtarı loglanmadı.

---

## 4) Kernseiten

| URL | Sonuç |
| --- | --- |
| `/` Homepage | 200, nav (Startseite, Therapieangebot, R-Force, Kontakt, tel, mail) |
| `/therapieangebot` | 301 → `/therapieangebot.html` |
| `/therapieangebot.html` | 200 |
| `/kontakt.html` | 200, tel CTA |
| `/physikalische-therapie-wien-11/` (nocache) | 404 (eski production) |
| `/api/google-reviews` | 200 (içerik redakte edildi) |

---

## 5) Production-Deploy sperri

| Mekanizma | Durum |
| --- | --- |
| Cloudflare Pages Git source | **Bağlı değil** (`source` boş) → CF üzerinden otomatik Git deploy yok |
| GitHub Actions `deploy-cloudflare-pages.yml` | `push` → `main` ile `pages deploy … --branch=main` tanımlı |
| Bu turda workflow disable | **Yapılmadı** (GitHub değişikliği yasak) |

**Gerekli manuel kilit (sahip):**

1. GitHub → Actions → workflow’u disable **veya** `main` push trigger’ını kaldır  
2. `main` branch protection + required review  
3. Manuel `wrangler pages deploy --branch=main` yasağı (Functions’sız tree)  
4. Bir sonraki SEO yayını yalnızca `uses_functions: true` koruyan artifact ile

---

## 6) Zaman çizelgesi (özet)

1. SEO static production deploy → asistan API 405  
2. Rollback API → `9d68e71d…` tekrar canonical  
3. Bu Notfall turu: durum doğrulandı, ek rollback yok, UI+API PASS  

---

## Sonuç

- **ROLLBACK PASS** — canlı = `9d68e71d-82e9-4206-a2ec-e6f1a407c151`  
- **ASSISTENTEN-API PASS** — HTTP 200 + interaktif Öffnungszeiten OK  
- Yeni SEO yayını yok; production stabilize edildi.
