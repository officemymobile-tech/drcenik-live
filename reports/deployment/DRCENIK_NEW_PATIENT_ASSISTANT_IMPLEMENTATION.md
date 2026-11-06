# DRCENIK — Yeni Patient Assistant Pages Function Uygulaması

**Tarih:** 6 Kasım 2026  
**Dil:** Türkçe rapor  
**Canlı production değiştirilmedi.** DNS / Worker / secrets / `main` push / production promote **yapılmadı**.

| Madde | Sonuç |
| --- | --- |
| Yeni Function kaynağı | **PASS** — `functions/api/patient-assistant.js` |
| Contract testleri | **PASS** — `npm run test-patient-assistant-contract` |
| Artifact validator | **PASS** — static-only deploy engellenir |
| Lokal `wrangler pages dev` | **PASS** (127.0.0.1:8788) |
| İzole Preview | **PASS** — `61a9c1fb-0a8e-47a2-a2f8-665f4fb9cae6` |
| Preview API | **PASS** — Functions bundle yüklendi, HTTP 200 |
| Browser E2E (preview) | **PASS** (açılış saatleri, randevu, TR, tel, SEO) |
| Production’a promote | **YAPILMADI** |
| Orijinal kaynak eşdeğerliği iddiası | **YOK** — yeni implementasyon |

---

## 1) API sözleşmesi (frontend + canlı üretimden doğrulandı)

Kaynaklar: `scripts/patient-assistant.js`, canlı `POST https://www.drcenik.at/api/patient-assistant`, recovery notları.

### İstek

- **Method:** yalnızca `POST`
- **Content-Type:** `application/json`
- **Timeout (istemci):** 12 sn
- **Chat / aksiyon gövdesi:**

```json
{
  "action": "chat|appointment|prescription|insurance|treatments|bring|cancel|hours|contact",
  "language": "de|tr|en",
  "message": "string (<=2000 UI)",
  "history": [{ "role": "user|assistant", "content": "..." }],
  "preferStructured": true
}
```

- **Randevu formu gövdesi:** `action: "appointment_request"` + `firstName`, `lastName`, `phone`, `email`, `patientStatus`, `insurer`, `reason`, `hasPrescription`, `prescribedService`, `units`, `preferredPeriod`, `preferredWeekday`, `preferredTimeOfDay`
- **Probe uyumluluğu:** `{ "message": "...", "lang": "de" }` (action yok) kabul edilir

### Yanıt zarfı

```json
{
  "type": "assistant_message|workflow|unavailable|emergency",
  "language": "de|tr|en",
  "message": "string",
  "suggestedActions": [{ "id": "...", "label": "...", "href?": "tel:+4317692991" }],
  "workflow": { "id": "appointment|prescription", "step": 1 } | null,
  "safetyState": "normal|emergency",
  "links": [{ "href": "/therapieangebot.html", "label": "..." }],
  "phone": { "display": "01 / 769 29 91", "href": "tel:+4317692991" }
}
```

### Hata / güvenlik yanıtları (yeni)

| Durum | HTTP | Gövde |
| --- | --- | --- |
| Yanlış method | 405 | `{ "error": "method_not_allowed" }` |
| Bozuk JSON | 400 | `{ "error": "invalid_json" }` |
| Aşırı büyük gövde | 413 | `{ "error": "payload_too_large" }` |
| Origin reddi | 403 | `{ "error": "origin_not_allowed" }` |
| Rate limit | 429 | `{ "error": "rate_limited" }` |

---

## 2) Yeni kaynak dosyalar

| Dosya | Rol |
| --- | --- |
| `functions/api/patient-assistant.js` | Cloudflare Pages Function (deterministik) |
| `scripts/patient-assistant-contract.test.mjs` | Otomatik sözleşme testleri |
| `package.json` | `test-patient-assistant-contract`, preview branch güncellemesi |
| `.cfignore` | `*.test.mjs` upload dışı |

Mevcut istemci dosyaları **değiştirilmedi:** `scripts/patient-assistant.js`, `scripts/patient-assistant-boot.js`.

---

## 3) Davranış özeti

- Deterministik pratik bilgisi: açılış, telefon, adres, kasa genel bilgisi, terapi kategorileri, iptal kuralları (canlı üretim yanıtları + site facts ile hizalı)
- `appointment` / `prescription` → `workflow` + form; **bağlayıcı online rezervasyon yok**
- `appointment_request` → `type: unavailable` (PII saklanmaz, e-posta/backend yok)
- Tıbbi acil anahtar kelimeler → `emergency` + 144/112
- Bilinmeyen / tıbbi tavsiye talepleri → güvenli genel yönlendirme / telefon
- Loglama: kullanıcı mesajı / isim / telefon **loglanmaz**

---

## 4) Test sonuçları

### Contract (lokal handler)

`npm run test-patient-assistant-contract` → **PASS**

Kapsam: POST-only, invalid JSON, oversized, hours DE/TR/EN, tüm structured action’lar, appointment_request unavailable, emergency, probe body, güvenlik header’ları, evil origin.

### Artifact gate

`npm run validate-pages-functions` → **PASS** (`functions/api/patient-assistant.js` bulundu)

### Lokal Pages runtime

`npx wrangler pages dev . --port 8788` → hours/appointment/contact/TR/appointment_request/probe/GET405/bad JSON → beklenen sonuçlar.

### Preview probe

```
base: https://61a9c1fb.drcenik-live.pages.dev
status: 200
type: assistant_message
hasCall / hasAppointment / hasHoursHint: true
PASS
```

Wrangler çıktısı: **“Uploading Functions bundle”** + Preview environment.

### Production vs Preview (sentetik)

`hours`, `appointment`, `insurance` için **message / type / actions / workflow birebir eşit** (canlı üretimle karşılaştırıldı).

### Browser E2E (preview)

1. Assistent açıldı  
2. Notice kabul (`Verstanden`)  
3. Öffnungszeiten → Therapiezeiten/Ordinationszeiten metni  
4. Termin vereinbaren → workflow metni + form + `tel:+4317692991`  
5. TR dil + Açılış saatleri → Türkçe saat metni  
6. Invalid JSON → 400  
7. SEO `/physikalische-therapie-wien-11/` ve `/therapieangebot.html` → 200  
8. Kritik konsol hatası gözlenmedi (UI render başarılı)

---

## 5) Güvenlik / gizlilik bulguları

| Konu | Durum |
| --- | --- |
| Veri minimizasyonu | Randevu talebi saklanmıyor; unavailable |
| Hassas log | Mesaj/PII log yok |
| CORS | Allowlist (drcenik.at + pages.dev + localhost) |
| Rate limit | Isolate-içi best-effort (30/dk); kalıcı KV yok |
| Secrets | Hardcoded secret yok |
| Hata ifşası | Genel error kodları |
| GDPR | Test geçişi ≠ uyumluluk beyanı |

**Not:** Production’da da 429 `rate_limited` gözlendi; yeni kod benzer davranış hedefler, dağıtık limit için ileride KV/DO düşünülebilir.

---

## 6) Production farkları / bilinmeyenler

| Konu | Sınıf |
| --- | --- |
| Orijinal kaynak kurtarılamadı; bu **yeni** kod | Bilinen |
| Chat intent eşleştirme (anahtar kelime) orijinal LLM/kurallardan farklı olabilir | Orta — bilinmeyen |
| `history` alanı kabul edilir ama sunucu tarafında diyalog belleği yok | Düşük |
| Rate limit yalnızca isolate-local | Orta |
| Medical free-text kapsamı orijinalden dar/geniş olabilir | Orta — onay gerekir |
| Yapılandırılmış aksiyon metinleri canlı üretimle hizalandı (doğrulandı) | Düşük |

**Eşitlik iddiası yok:** Yapılandırılmış aksiyonlarda yüksek benzerlik var; tüm free-text chat yolları için birebir eşdeğerlik kanıtlanmadı.

---

## 7) Preview deployment

| Alan | Değer |
| --- | --- |
| Deployment ID | `61a9c1fb-0a8e-47a2-a2f8-665f4fb9cae6` |
| URL | https://61a9c1fb.drcenik-live.pages.dev |
| Alias | https://seo-preview-patient-assistan.drcenik-live.pages.dev |
| Environment | **Preview** (production domain’e bağlı değil) |
| Branch | `seo-preview-patient-assistant-rebuild` |
| Source commit (wrangler) | `3ecefde…` (SEO release ağacı + yeni Function) |
| Functions | Bundle upload edildi (`uses_functions` beklenen) |

---

## 8) Tıbbi / içerik — sahip onayı gerekenler

Aşağıdaki metinler canlı siteden / production API’den alındı veya güvenli genel yönlendirmedir; yine de yayın öncesi klinik/hukuk onayı önerilir:

- Kasa kabul + “somut performans garantisi yok” metinleri  
- İptal: 24 saat / 45 €  
- Tedavi kategorileri listesi  
- Acil durum (144/112)  
- “Tanı yok / bireysel tedavi yok” yönlendirmeleri  

---

## 9) Kalan blocker’lar (SEO release’i production’a almak için)

1. **Sahip onayı:** Preview kabul → ayrı production deploy kararı  
2. **Production deploy yolu:** yalnızca `validate-pages-functions` + Functions’lı artifact (static-only yasak)  
3. **Rollback hedefi korunmalı:** `9d68e71d-82e9-4206-a2ec-e6f1a407c151`  
4. Orijinal Function kaynağı hâlâ yok; bu rebuild production’a alınırsa “kurtarma” değil “yeni sürüm”dür  
5. Bu turda **promote edilmedi**

---

## 10) Rollback prosedürü

Canlı site bozulursa (ör. yanlışlıkla Functions’sız production):

1. Cloudflare Pages → `drcenik-live` → Deployment `9d68e71d-82e9-4206-a2ec-e6f1a407c151` → **Rollback to this deployment**  
2. Doğrula: `POST https://www.drcenik.at/api/patient-assistant` → HTTP 200 JSON  
3. Bu preview (`61a9c1fb…`) production’a alınmamalı; yalnızca test içindir

---

## 11) Sonuç

SEO release’i **Functions ile birlikte** izole preview’da çalışır durumda:

- Mevcut frontend davranışı korunuyor  
- Yeni güvenli Pages Function eklendi  
- Canlı production **dokunulmadı**  
- Production’a otomatik promote **yok**

Sonraki adım (sahip): Preview’ı onayla → ayrı, gated production deploy (bu raporda yapılmadı).
