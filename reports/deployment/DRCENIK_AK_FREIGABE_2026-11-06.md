# Dr. Cenik — AK-01 bis AK-04 Freigabe-Umsetzung

**Tarih:** 6 Kasım 2026  
**Dal:** `release/seo-physikalische-therapie-wien-11`  
**İçerik commit:** `23d9ea22c1185fbc0a0f3a2a20bc944972d41371`  
**Preview deployment:** `62e8a8b0-…` (kaynak `23d9ea2`)  
**Preview alias:** https://seo-preview-2026-11-06.drcenik-live.pages.dev  
**Production:** değişmedi (`9d68e71d-82e9-4206-a2ec-e6f1a407c151`)

**Sahip onayı:** ÖGK, SVS, KFA, BVAEB için ayakta kasa sözleşmeleri teyit edildi.

**Genel sonuç: PASS**  
**Production yayınlanmadı.**

---

## Yapılanlar (yalnızca Freigabe kapsamı)

| ID | Önceki risk | Uygulama |
| --- | --- | --- |
| AK-01 | Title/OG/Twitter „\| alle Kassen“ | `\| ÖGK · SVS · BVAEB · KFA` |
| AK-02 | Meta „alle Kassen mit Verordnung“ | `ÖGK · SVS · BVAEB · KFA & Privat – mit Verordnung` |
| AK-03 | UI „Alle Kassen & Privat“ | `ÖGK · SVS · BVAEB · KFA & Privat` (+ Privatordination) |
| AK-04 | Related „Alle Kassen- und Privatleistungen“ | `ÖGK · SVS · BVAEB · KFA und Privatleistungen…` |

Ek (aynı Freigabe doğruluğu): SEO-şablon trust-bar + orta CTA’ya KFA eklendi; FAQ’da „unter anderem“ yerine teyitli sözleşme formülü; „Nicht jede Therapie…“ korundu.

Korunanlar: kasa logoları, mevcut ayırt edilmiş gövde metni, SEO hedef sayfası, hasta asistanı boot, telefon CTA.

---

## Regression

| Test | Sonuç |
| --- | --- |
| `node scripts/audit-seo-regression-2026-11-06.mjs` | **PASS** |
| Preview ana sayfa: „alle Kassen“ yok, dört kasa var | **PASS** |
| Preview SEO sayfası: dört kasa + maliyet uyarısı | **PASS** |
| Production alias değişmedi | **PASS** |
| Preview kaynak = `23d9ea2` | **PASS** |

---

## PASS/FAIL özeti

| # | Kontrol | Sonuç |
| --- | --- | --- |
| 1 | AK-01–AK-04 uygulandı | **PASS** |
| 2 | Mutlak „Alle Kassen“ kaldırıldı / netleştirildi | **PASS** |
| 3 | Dört kasa + Privat doğru adı | **PASS** |
| 4 | Toplu maliyet vaadi yok | **PASS** |
| 5 | SEO + işlevler korundu | **PASS** |
| 6 | Regression | **PASS** |
| 7 | Preview ↔ commit `23d9ea2` | **PASS** |
| 8 | Production deploy yok | **PASS** |

### Genel karar

**PASS** — AK Freigabe uygulandı; production onayı ayrıca bekleniyor.
