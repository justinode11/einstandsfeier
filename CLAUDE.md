# Projekt: Einstandsfeier-App (SG Freiensteinau)

Statische Web-App ohne Build-Schritt (HTML + ES-Module), gehostet über GitHub Pages,
Daten in Firebase Firestore. Sprache der App und der Kommunikation: Deutsch.

## Ablauf am Abend (so einfach wie möglich halten)
Spieler eintragen → Teams losen (Spieler pro Team, Standard 5) → Punkte je Station → Ergebnis.
Nur die Teamleitung nutzt die App; keine Rollen, keine Anmeldung.

## Regeln (aus dem Regelheft „Einstandsfeier“)
- 5 Stationen: Darts (9 Darts/Spieler, Punkte addiert), Bierpong (10 Würfe/Spieler, Treffer),
  Fußballquiz (15 Fragen, Team gemeinsam), FIFA-Elfmeter (5 Schüsse/Spieler),
  Torwand (6 Schüsse/Spieler, unten 1, oben 2).
- Gleiche Versuche: kleinere Teams bekommen Zeilen „Zusatzrunde“ (bis zur größten Teamgröße); nicht beim Quiz.
- Wertung je Disziplin nur über abgeschlossene Ergebnisse: Platz 1–5 = 10/8/6/4/2,
  Gleichstand → Punkte der betroffenen Plätze werden gemittelt. Max. 50 Wertungspunkte.

## Technik
- `index.html`: gesamte UI und Logik (Konstante `STATIONS`, Funktionen `stationRanking`, `overall`).
- `storage.js`: Adapter mit Mini-API `db.collection(name).doc(id?).set/update/delete`,
  `.add`, `.onSnapshot`. Firestore-Pfade: `events/<key>/{teams|players|results}/<id>`.
  Ohne ausgefüllte `firebase-config.js` → Testmodus mit localStorage.
- Ergebnis-Dokument: `results/<stationId>__<teamId>` = `{station, teamId, rows, q, done, total}`.
- Feier-Schlüssel aus `?k=` (24–64 Zeichen, alphanumerisch); ohne Schlüssel zeigt die App einen neuen Link.
- Design: Indigo #2e2f8f, Gold #c8a24a, Creme #f6f3ea; Schriften Barlow Condensed + Source Sans 3.
- Werte aus der Datenbank immer escapen (`esc`), nie als HTML einsetzen.

## Lokal testen
`python3 -m http.server 8000` → http://localhost:8000

## Veröffentlichung (GitHub Pages + Firebase)
- Repository: https://github.com/justinode11/einstandsfeier (öffentlich, Branch `main`, Pages aus `/` root)
- Live-Adresse: https://justinode11.github.io/einstandsfeier/  (ohne `?k=` zeigt die App einen neuen Feier-Link an)
- Ordner mit GitHub verbinden: `git remote add origin https://github.com/justinode11/einstandsfeier.git` (falls noch nicht gesetzt),
  `git fetch origin`, dann lokale Änderungen mit origin/main zusammenführen – lokale Arbeit NICHT mit reset --hard überschreiben.
- Veröffentlichen: `git add -A && git commit -m "…" && git push` → Pages baut in ca. 1 Minute neu.
  Browser/Handys cachen Dateien bis zu 10 Minuten; zum Prüfen neu laden bzw. Cache leeren.
- Prüfen: `curl -sI https://justinode11.github.io/einstandsfeier/` (HTTP 200) und
  `curl -s https://justinode11.github.io/einstandsfeier/firebase-config.js | grep projectId`.
- Firebase-Projekt: `einstandsfeier-sgf` (Firestore, europe-west3, Spark-Tarif), Konsole:
  https://console.firebase.google.com/project/einstandsfeier-sgf
  Regeln stehen in `firestore.rules`; Änderungen dort in der Konsole unter Firestore → Regeln veröffentlichen
  (oder per Firebase-CLI: `firebase deploy --only firestore:rules --project einstandsfeier-sgf`).
- `firebase-config.js` MUSS die echten Werte enthalten (nicht "HIER_EINTRAGEN"), sonst läuft die App im Testmodus.
- Der geheime Feier-Link steht nur lokal in `FEIER-LINK.txt` (in .gitignore) – NIE committen, nicht in README/CLAUDE.md schreiben.
