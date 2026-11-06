# Sofort-Rollback auf `9d68e71d-82e9-4206-a2ec-e6f1a407c151`

**Nicht ausführen, außer Production ist fehlerhaft.**  
DNS / Workers / Secrets nicht ändern.

## Cloudflare Dashboard (bevorzugt)

1. https://dash.cloudflare.com → Account → **Workers & Pages** → Projekt **`drcenik-live`**
2. Tab **Deployments**
3. Deployment-ID suchen: **`9d68e71d-82e9-4206-a2ec-e6f1a407c151`**
4. Menü **⋯** → **Rollback to this deployment** (bzw. „Promote to production“ / Rollback-Aktion je nach UI)
5. Warten bis Production auf dieses Deployment zeigt

## Sofort-Verifikation

```bash
node scripts/probe-patient-assistant-api.mjs https://www.drcenik.at
```

Erwartung: HTTP **200**, JSON mit `message`, Call-/Termin-Aktionen.

Zusätzlich Browser:

- Startseite lädt
- Patienten-Assistent öffnet, Öffnungszeiten antworten
- Kein API-405

## Hinweis

`9d68e71d` ist der letzte bekannte **Functions-fähige** Production-Stand vor dem Static-Only-Vorfall.  
SEO-RC `cfcc7ab` / Preview `3a4cb082` sind davon getrennt und werden durch diesen Rollback nicht gelöscht.
