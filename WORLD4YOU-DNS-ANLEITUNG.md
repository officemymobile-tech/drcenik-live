# www.drcenik.at bei World4You auf GitHub Pages einrichten

Damit **www.drcenik.at** auf deine GitHub-Pages-Webseite zeigt, musst du bei World4You einen **CNAME-Eintrag** anlegen.

---

## Schritte im World4You Kundenbereich

1. **Anmelden**  
   [world4you.com](https://www.world4you.com) → Profil-Icon → **Kundenbereich** (Login).

2. **Domain wählen**  
   Oben links den **Vertrag** auswählen, in dem die Domain **drcenik.at** liegt.

3. **DNS verwalten**  
   Bei der Domain **drcenik.at** auf den **3-Punkte-Button** (⋮) klicken → **DNS** (oder „DNS-Einträge“ / „DNS verwalten“).

4. **Neuen DNS-Eintrag hinzufügen**  
   Button **„Neuen DNS-Eintrag hinzufügen“** (oder vergleichbar) klicken.

5. **CNAME so eintragen:**

   | Feld        | Wert |
   |------------|------|
   | **Typ**    | **CNAME** |
   | **Name**   | **www** (nur das, ohne Punkt oder Domain) |
   | **Wert / Ziel / Target** | **officemymobile-tech.github.io** |

   Kein `https://`, kein Slash – nur: `officemymobile-tech.github.io`

6. **Speichern** („Hinzufügen“ / „Speichern“).

---

## Optional: drcenik.at (ohne www) weiterleiten

Wenn **drcenik.at** (ohne www) auch auf die Webseite soll:

- Entweder bei World4You eine **Weiterleitung** einrichten: `drcenik.at` → `https://www.drcenik.at`
- Oder in den GitHub Pages Einstellungen unter **Custom domain** zusätzlich die Apex-Domain eintragen und bei World4You die **A-Records** auf die [GitHub Pages IPs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) setzen (aufwendiger; für den Start reicht www).

---

## Nach dem Eintrag

- DNS-Änderungen können **einige Minuten bis 48 Stunden** brauchen.
- Auf **GitHub** unter **Settings → Pages** steht bei **Custom domain** bereits **www.drcenik.at** (CNAME-Datei im Repo).
- Wenn die Domain grün angezeigt wird: **Enforce HTTPS** aktivieren.

Fragen zu World4You: [World4You Support / FAQ](https://faq.world4you.com/de/articles/4402-wo-und-wie-kann-ich-dns-eintraege-dns-records-setzen-und-aendern).
