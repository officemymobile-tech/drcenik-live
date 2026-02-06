# Webseite auf GitHub veröffentlichen (GitHub Pages)

Deine Seite ist statisches HTML/CSS/JS und eignet sich gut für **GitHub Pages**. So geht’s:

---

## 1. Repository auf GitHub anlegen (falls noch nicht geschehen)

1. Gehe zu [github.com](https://github.com) und melde dich an.
2. Klick auf **„New repository“** (grüner Button).
3. **Repository name:** z. B. `dr-fadime-cenik-website` oder `drcenik-at`.
4. **Public** auswählen, **ohne** README, .gitignore oder Lizenz anlegen (Projekt existiert schon).
5. **Create repository** klicken.

---

## 2. Projekt mit Git verbinden und hochladen

Im Projektordner (z. B. `dr-fadime-cenik-website`) in **PowerShell** oder **Terminal** ausführen:

```bash
# Falls noch kein Git-Repo: initialisieren
git init

# Alle Dateien zur Staging-Area hinzufügen
git add .

# Erster Commit
git commit -m "Website Dr. Fadime Cenik – initial"

# GitHub als Remote hinzufügen (ERSETZE dein-username und repo-name durch deine Werte)
git remote add origin https://github.com/DEIN-USERNAME/REPO-NAME.git

# Hauptbranch auf "main" setzen (falls nötig)
git branch -M main

# Hochladen
git push -u origin main
```

**Hinweis:** Beim ersten `git push` wirst du nach deinem GitHub-Benutzernamen und Passwort/Token gefragt. Nutze für Passwort ein **Personal Access Token** (GitHub → Settings → Developer settings → Personal access tokens).

---

## 3. GitHub Pages aktivieren

1. Öffne dein Repository auf GitHub.
2. **Settings** (Reiter oben).
3. Links im Menü: **Pages**.
4. Unter **„Build and deployment“**:
   - **Source:** **Deploy from a branch**
   - **Branch:** `main` (oder `master`), Ordner **/ (root)**.
5. **Save** klicken.

Nach 1–2 Minuten ist die Seite erreichbar unter:

- **https://DEIN-USERNAME.github.io/REPO-NAME/**

Beispiel: `https://maxmustermann.github.io/dr-fadime-cenik-website/`

---

## 4. Eigene Domain (z. B. www.drcenik.at) einbinden (optional)

Falls du später eine eigene Domain nutzen willst:

1. In GitHub **Settings → Pages** bei **Custom domain** z. B. `www.drcenik.at` eintragen.
2. Bei deinem Domain-Anbieter einen **CNAME-Eintrag** auf `DEIN-USERNAME.github.io` setzen.
3. **Enforce HTTPS** in den Pages-Einstellungen aktivieren.

---

## Kurz-Checkliste

- [ ] Repository auf GitHub erstellt
- [ ] `git init` (falls nötig), `git add .`, `git commit`
- [ ] `git remote add origin https://github.com/...`
- [ ] `git push -u origin main`
- [ ] Unter **Settings → Pages** Branch `main`, Root, speichern
- [ ] URL testen: `https://DEIN-USERNAME.github.io/REPO-NAME/`

Wenn du deinen GitHub-Benutzernamen und den gewünschten Repo-Namen nennst, kann ich dir die genauen Befehle mit ausgefüllten Platzhaltern formulieren.
