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
