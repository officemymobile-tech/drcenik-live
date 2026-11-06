# DRCENIK Release Candidate — SEO + Trilingual Patient Assistant

**Status:** Immutable candidate for manual production approval only.  
**Production deploy:** NOT performed with this document.  
**Rollback target:** `9d68e71d-82e9-4206-a2ec-e6f1a407c151`

## Contents

1. Current production website baseline (Pages static tree)  
2. Approved SEO improvements + `/physikalische-therapie-wien-11/`  
3. New Cloudflare Pages Function `functions/api/patient-assistant.js` (DE/EN/TR)  
4. Patient assistant UI (`scripts/patient-assistant*.js`, CSS)  
5. Confirmed insurers ÖGK · SVS · BVAEB · KFA (site + assistant copy)  
6. Fail-closed validator `scripts/validate-pages-functions-artifact.mjs`  
7. Manual production workflow gate (workflow_dispatch + `DEPLOY-PRODUCTION`)

## Immutable identity

Filled after commit in the GO/NO-GO report:

- Release commit SHA  
- Preview deployment ID  
- Tag (optional): `rc/seo-assistant-2026-11-06`
