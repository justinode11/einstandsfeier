# Einstandsfeier-App – SG Freiensteinau

Handy-App für die Einstandsfeier: Spieler eintragen → Teams losen → Punkte an den
5 Stationen eintragen (Darts, Bierpong, Fußballquiz, FIFA-Elfmeterschießen, Torwand)
→ Gesamtwertung nach dem Regelheft (10/8/6/4/2 Wertungspunkte, Gleichstand geteilt).

Keine Anmeldung nötig: Zugang nur über den geheimen **Feier-Link** (`…/?k=<Schlüssel>`).
Wer den Link hat, kann eintragen – also nur an die Teamleitung schicken.

## Dateien
| Datei | Inhalt |
|---|---|
| `index.html` | Die komplette App (Design, Stationen, Wertung) |
| `storage.js` | Datenspeicher: Firebase Firestore oder Testmodus (nur dieses Gerät) |
| `firebase-config.js` | Zugangsdaten des Firebase-Projekts – **einmal ausfüllen** |
| `firestore.rules` | Sicherheitsregeln für Firestore (nur mit Feier-Schlüssel) |
| `logo.png` | Wappen SG Freiensteinau |

## Einrichtung (einmalig, ca. 15 Minuten)

### 1. Firebase (Datenspeicher, kostenlos)
1. https://console.firebase.google.com → mit Google-Konto anmelden → **Projekt hinzufügen**
   (Name z. B. `einstandsfeier-sgf`, Google Analytics kann aus bleiben).
2. Links **Build → Firestore Database → Datenbank erstellen** → Standort `europe-west3 (Frankfurt)`
   → **Produktionsmodus**.
3. Reiter **Regeln**: Inhalt von `firestore.rules` hineinkopieren → **Veröffentlichen**.
4. Zahnrad → **Projekteinstellungen → Allgemein → Meine Apps → Web (`</>`)** → App registrieren
   (Hosting-Haken nicht nötig) → die angezeigten Werte in `firebase-config.js` eintragen.

### 2. GitHub Pages (Webseite, kostenlos)
1. Neues Repository auf github.com anlegen (z. B. `einstandsfeier`), diesen Ordner hochladen
   (oder `git push`, siehe unten).
2. Repository → **Settings → Pages** → Source: *Deploy from a branch*, Branch `main`, Ordner `/ (root)` → Save.
3. Nach 1–2 Minuten ist die App unter `https://<benutzername>.github.io/einstandsfeier/` erreichbar.

### 3. Feier-Link erzeugen
Die Adresse aus Schritt 2 **ohne** `?k=` öffnen → die App zeigt einen neuen Feier-Link →
öffnen, kopieren und an die Teamleitung schicken. Alle mit diesem Link sehen dieselben Daten live.

## Testen ohne Firebase
Solange `firebase-config.js` noch `HIER_EINTRAGEN` enthält, läuft die App im **Testmodus**:
alles funktioniert, die Daten bleiben aber nur im jeweiligen Browser.
Lokal starten: `python3 -m http.server 8000` im Ordner, dann http://localhost:8000 öffnen.

## Mit Git hochladen
```bash
git remote add origin https://github.com/<benutzername>/einstandsfeier.git
git push -u origin main
```

## Hinweis zur Sicherheit
Der Firebase-`apiKey` ist kein Geheimnis – er darf öffentlich im Repository stehen.
Geschützt werden die Daten durch die Regeln in `firestore.rules` und den zufälligen
Feier-Schlüssel im Link. Nach der Feier kann die Datenbank in der Firebase-Konsole geleert werden.
