# Bauauftrag KIN-18: Deutschland-Kompass (Einheit 18)

Status: teilweise · Abschnitt: Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) · Ziel: Ausbau von apps/deutschland-kompass
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 233 (233–234), Abschnitt „География (введение)“ (S. 233), Gruppe „Фантазеры“ (S. 234).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „География (введение)“ (S. 233)
  - „крупные города“ (S. 233)
  - „крупные реки“ (S. 233)
  - „картой мира“ (S. 234)
  - „компасом“ (S. 234)
  - „читать план“ (S. 234)
  - „обычаях белорусского народа“ (S. 234)
- Inhalt in eigenen Worten (S. 233–234): Karte mit großen Städten und Flüssen. Weltkarte mit Wasser und Land, Nachbarländern, Nord- und Südpol sowie Kontinenten. Einen Plan lesen und einen vertrauten Ort als Plan nachzeichnen. Kompass und vier Himmelsrichtungen, für ältere Kinder. Bräuche und die Vielfalt der Kulturen.
- Abweichung von der Quelle: Die Quelle nennt Minsk und die belarussische Karte. Der Auftrag ersetzt sie durch Deutschland und Nachbarländer (Eigenentwurf nach docs/10, Adaptation).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Faktenstand laut index.json: nur Katalogtext. Für diesen Auftrag wurde gegen die Textkopie geprüft.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 5–7 zusammen mit einem Erwachsenen, 8–12 eigenständig (docs/10; GDD Abschnitt 2). Verwendung: Bildschirm.
- Lernziele, prüfbar (Eigenentwurf; die Themen stehen auf S. 233–234):
  1. Kind liest einen Plan von oben und findet einen Ort, wenn Richtung und Anzahl der Felder genannt sind.
  2. Kind benennt die vier Himmelsrichtungen und weiß, wo die Sonne morgens aufgeht.
  3. Kind findet Deutschland, seine Nachbarländer und die Ukraine auf einer Karte.
  4. Kind unterscheidet Landkarte und Weltkarte mit Kontinenten sowie Nord- und Südpol.

## 3. Funktion

- Bildschirme: Modus 1 Plan und Kompass mit einem 5×5-Raster, acht benannten Orten und einer Windrose. Modus 2 Karten-Quiz mit 13 Fragen in drei Bereichen (Himmelsrichtungen, Deutschland, Welt). Modus 3 Länderkarten Deutschland und Ukraine.
- Ablauf: Modus wählen → Aufgabe (Startort, Richtung und Anzahl der Felder werden genannt, die Frage ist: wo bist du?) → Antwort → Quiz-Frage mit vorlesbarer Erklärung → Länderkarte nachschlagen.
- Ist-Stand (README, GDD): drei Modi. Aufgaben sind per Konstruktion lösbar (alleAufgaben, baueAufgabe). Norden ist oben. Vorlesen. Windrose als Bild mit Beschreibung. Länderkarte Ukraine nur mit Geografie. In den Länderdaten ist eine Liste von Kriegsbegriffen verboten.
- Der Katalog verlangt (docs/10, Z. 296): eigene Umgebung als Plan lesen und legen, Deutschlandkarte mit großen Städten und Flüssen, Weltkarte oder Globus mit Kontinenten, Nord- und Südpol sowie Nachbarländern, Kompass und vier Himmelsrichtungen, Ukraine-Zusatzmodul für Kinder mit Herkunftsbezug.
- Lücken: Das Kind legt keinen eigenen Plan, der Plan ist fest. Es gibt keinen Globus-Modus. Brauchtum und die Vielfalt der Kulturen sind nicht sichtbar. Siehe Abschnitt 9.
- Druck: nicht vorgesehen.

## 4. Daten

Datei: `apps/deutschland-kompass/daten/karte.json` (vorhanden). Die Felder quelle und eigenentwurf fehlen bisher. Schema mit einer Beispielzeile:

```json
{ "id": "land-ukraine-lage", "titel": "Die Ukraine liegt östlich von Polen", "quelle": { "seite": "S. 234" }, "eigenentwurf": true }
```

## 5. Pseudocode

Vorhanden in logik.mjs: alleAufgaben, baueAufgabe, aufgabenText, imFeld, ortAn. Alle anderen Funktionen sind (Eigenentwurf).

```
alleAufgaben(orte: Ort[], raster: 5 x 5) -> Aufgabe[]
  für jeden Startort, jede Richtung und n von 1 bis 4:
    ziel = Feld nach n Schritten in Richtung
    wenn ziel ein benannter Ort ist: Aufgabe {start, richtung, n, ziel}
  ohne Ergebnis: Fehler "Plan nicht lösbar"

baueAufgabe(aufgaben: Aufgabe[], zufallsReihe: Zahl[]) -> Aufgabe
  aufgabe = aufgaben[zufallsReihe[0] mod Länge(aufgaben)]
  optionen = ziel plus zwei weitere Orte, der Startort nie
  -> {text: aufgabenText(aufgabe), optionen: gemischt nach zufallsReihe[1..], richtig: ziel}

pruefeKarte(karte: {id, titel, quelle, eigenentwurf, inhalt: Text}, verboten: Liste) -> Fehler[]
  quelle.seite ist gesetzt, sonst Fehler "Seitenangabe fehlt"
  inhalt enthält kein Wort aus verboten als Wortstamm; geprüft wird die Konstruktion, nicht das Einzelwort
  -> leere Liste heißt: gültig

eigenerPlan(zellen: Ortsname[5][5]) -> Fehler[]   (Erweiterung)
  jeder Ort genau einmal; Raster genau 5 × 5; leere Zelle erlaubt
  -> Fehler-Liste
```

Die Zufallsreihe kommt als Parameter. In logik.mjs steht keine Zufallsquelle; app.mjs Z. 18 nutzt Math.random und liegt außerhalb der Logikdatei.

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Ist-Stand: kein localStorage. Die Zähler gelten nur für die laufende Sitzung (quizPunkte, app.mjs Z. 26).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Ist-Stand: NetzwerkWaechter laut README. Abruf nur lokal (daten/karte.json).
- [ ] Keine Eingabefelder (Projektregel). Ist-Stand: Bedienung über Schaltflächen.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Ist-Stand: Die Anzeige „Richtig beantwortet“ mit Zählerstand (app.mjs Z. 199) ist zu prüfen. Siehe Abschnitt 9.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Nicht zutreffend.
- [ ] Mobile First 360 px; Knöpfe und Felder mindestens 48 px (docs/02 Z. 50). Ist-Stand: Windrose als role img mit Beschreibung, jedes Planfeld mit aria-label. Größenmessung offen.
- [ ] Lernziele in der README als Liste (docs/02 Z. 42–43). Ist-Stand: nicht vorhanden, die README beschreibt Modi.
- [ ] Vorlesen (docs/02 Z. 44). Ist-Stand: vorhanden laut README.
- [ ] Pflichtmarkierung: Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft. (docs/02 Z. 151–152)
- [ ] Keine Modellnamen in Dateien. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen. Die Ukraine-Karte ist nur als Geografie-Karte angelegt.

## 7. Tests

- `test/logik.test.mjs` (vorhanden, 11 Prüfungen laut GDD Abschnitt 6): Daten gültig. Norden ist oben (Vorzeichen, unbekannte Richtung, Umkehrbarkeit). Uhrzeigersinn. imFeld und ortAn am Planrand. alleAufgaben enthält nur Wege mit Ziel und Rückweg. baueAufgabe ist über 400 Ziehungen lösbar, zeigt drei Optionen mit dem Ziel, nie den Startort. aufgabenText unterscheidet Einzahl und Mehrzahl. Der Validator meldet doppelte Felder, Orte außerhalb, ins Leere zeigende Indizes, fehlenden Bereich und doppelte Antworten. Geografiewerte sind fest. Länderkarten ohne Kriegsinhalte.
- Neu: pruefeKarte (fehlende Seitenangabe, verbotener Wortstamm), eigenerPlan (Ort doppelt, Raster nicht 5 × 5).
- `test/regeln.test.mjs` (neu, nach Vorlage apps/puppentheater-werkstatt/test/regeln.test.mjs): kein Speicheraufruf; kein Eingabefeld; kein Abruf außerhalb von daten/; keine Anzeige von Punkten in Kindertexten (nach Entscheidung in Abschnitt 9).

## 8. Abnahme

- `npm test` im App-Ordner grün. Die Testzahl 11 aus dem GDD wird gegen die Datei geprüft (docs/02 Z. 110–111).
- Browser bei 360 px: Raster ohne Überlauf, Felder und Knöpfe mindestens 48 px, Windrose mit role img, Fokus nach Klick.
- Test mit Kindern der Zielgruppe (docs/02 Z. 45–46).
- Registrierung nur durch den Koordinator.

## 9. Offen

- Eigener Plan zum Selbstlegen (docs/10 Z. 296; GDD Abschnitt 7) ist nicht gebaut.
- Globus oder Weltkarte mit Kontinenten: Die App hat Fakten im Quiz, aber keinen Kartenmodus. Entscheidung: Ausbau oder Katalogtext anpassen.
- Brauchtum und Vielfalt der Kulturen (S. 234, Übertragung als Eigenentwurf) sind in der App nicht sichtbar.
- Die Ukraine-Karte: docs/10 nennt Kinder mit Fluchtgeschichte. Die App nennt Herkunftsbezug und schließt Krieg und Flucht aus (GDD Abschnitt 4). Entscheidung der Koordination nötig.
- Anzeige „Richtig beantwortet“ (app.mjs Z. 199) gegen docs/02 Z. 141–146 prüfen.
- Lernziele fehlen in der README als Liste (docs/02 Z. 42–43).
- Daten: karte.json ohne Felder quelle und eigenentwurf.
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt. Sie stehen in Abschnitt 1 und in den Daten als quelle. Hier notiert.
- Seitenangaben ohne Markierung „проверено человеком“ (A18, docs/02 Z. 151–152).
