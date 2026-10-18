# Bauauftrag GEM-7: Sicher unterwegs – Szenario-Trainer Alltag & Straße

Status: teilweise · Abschnitt: Gemeinsame Apps 3–5 · Ziel: Ausbau von apps/sicher-unterwegs
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 125 (125–126), Abschnitt „Обеспечение безопасности“ (S. 125), Gruppe „Почемучки“ (S. 126).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Обеспечение безопасности“ (S. 125)
  - „поведения пешехода“ (S. 126)
  - „скорой помощи“ (S. 126)
  - „нельзя играть с огнем“ (S. 126)
  - „пить только“ (S. 126)
  - „бездомными животными“ (S. 126)
  - „оберегать глаза от травм“ (S. 126)
  - „ножницами и другими острыми предметами“ (S. 126)
- Inhalt in eigenen Worten (S. 126): Regeln zu Schere und scharfen Gegenständen, zum Schutz der Augen, zum Trinken, zu Feuer, zu fremden Personen, zum Verlassen des Geländes, zu Medikamenten, zu streunenden Tieren und zum Verhalten als Fußgänger. Außerdem Brandschutz und Telefonnummern (zu Hause, Feuerwehr, Polizei, Rettungsdienst). Die Quelle nennt die Dienste, nicht die Nummern 112 und 110 (Eigenentwurf).
- Zählung: S. 126 enthält sechs Punkte mit zusammen elf Einzelregeln. Der Katalog nennt 13 (docs/10 Z. 313). Der Abgleich bleibt offen (Abschnitt 9).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Faktenstand laut index.json: nur Katalogtext. Für diesen Auftrag wurde gegen die Textkopie geprüft.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 5–7 in Ko-Nutzung ab 4 bis 5, Weiterführung 8–12 (docs/10 Z. 313; GDD Abschnitt 2). Verwendung: Bildschirm. Druck nicht geplant.
- Lernziele, prüfbar (Eigenentwurf; die Regeln stehen auf S. 126):
  1. Kind wählt in einer Alltagssituation die sicherste von drei Handlungsoptionen und nennt einen Grund.
  2. Kind weiß, wen es bei einer Verletzung oder bei Feuer ruft: einen Erwachsenen oder den Notruf 112.
  3. Kind kennt die Regeln: nicht allein mit fremden Personen gehen, keine Medikamente ohne Erwachsene nehmen, nur abgekochtes Wasser trinken, nicht mit Feuer spielen.
  4. Kind schützt sich vor Verletzungen durch Schere und scharfe Gegenstände und schützt die Augen.

## 3. Funktion

- Bildschirme: Start mit Vorlesen und Hinweis auf 112 und 110. Situation mit drei Handlungsoptionen. Erklärung mit Vorlesen. Abschluss mit Punkten, Rang und Rekord. Gesprächsimpuls für Erwachsene (eltern.html).
- Ablauf: Start → 12 von 14 Situationen (gemischt) → Option wählen → Erklärung → Abschluss.
- Ist-Stand (README, GDD): 14 Situationen zu Straße und Ampel, fremden Personen, Feuer und Notruf 112 und 110, Medikamenten und Gift, fremden Tieren, Schere und Werkzeug, Küche, Wasser, Steckdose und Fahrradhelm. Vorlesen. Hilfe-Insel (hilfeInsel in app.mjs Z. 9 und 51). Rekord.
- Der Katalog verlangt (docs/10 Z. 313): 13 konkrete Sicherheitsregeln (Fußgänger, Feuer, fremde Personen, Medikamente, streunende Tiere, Augenschutz, Schere und Werkzeug). Vorlese-Funktion. Kurze Sessions.
- Lücken: Augenschutz und das Verlassen des Geländes ohne Erlaubnis fehlen in der Themenliste. Die Zählung 13 gegen elf ist offen. Das Üben der Notrufe liegt im Nachbarn notruf-held und ist nicht Teil dieses Auftrags. Siehe Abschnitt 9.
- Druck: nicht vorgesehen.

## 4. Daten

Datei: `apps/sicher-unterwegs/daten/szenarien.json` (vorhanden). Die Felder quelle, thema und eigenentwurf fehlen bisher. Schema mit einer Beispielzeile:

```json
{ "id": "feuer-streichhoelzer", "thema": "feuer", "titel": "Streichhölzer liegen herum", "quelle": { "seite": "S. 126" }, "eigenentwurf": true }
```

## 5. Pseudocode

Vorhanden in logik.mjs: punkteFuer, maxPunkte, rangFuer, ergebnisSatz. Alle anderen Funktionen sind (Eigenentwurf).

```
pruefeSzenarien(szenarien: Szenario[]) -> Fehler[]
  je Szenario: genau drei Optionen mit den Werten 2, 1 und 0, je einmal
  quelle.seite ist gesetzt, sonst Fehler "Seitenangabe fehlt"
  thema aus {strasse, fremde, feuer, notruf, gift, tiere, werkzeug, kueche, wasser, steckdose, helm, augen, gelaende}
  Abdeckung: jedes Thema mindestens einmal; augen und gelaende fehlen bisher -> Fehler je Thema
  -> leere Liste heißt: gültig

ziehe12(szenarien: Szenario[14], zufallsReihe: Zahl[]) -> Szenario[12]
  Reihenfolge nach zufallsReihe mit Fisher-Yates mischen
  -> die ersten 12 Einträge

punkteFuer(option: {wert: 2 | 1 | 0}) -> Zahl
  liefert option.wert
  Die Werte bleiben intern. Eine Summe wird dem Kind nicht angezeigt (docs/02 Z. 141–146; Entscheidung offen, Abschnitt 9).
```

Die Zufallsreihe kommt als Parameter. Die Logikdatei enthält keine Zufallsquelle.

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Ist-Stand: Rekord `sicher.rekord` in localStorage (app.mjs Z. 37, 100–101). Abweichung, siehe Abschnitt 9.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Ist-Stand: NetzwerkWaechter laut README. Abruf nur lokal (daten/szenarien.json).
- [ ] Keine Eingabefelder (Projektregel). Ist-Stand: Bedienung über Schaltflächen laut README.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Ist-Stand: Punkte 2, 1, 0, Rang und Rekord (README). Abweichung, siehe Abschnitt 9.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Nicht zutreffend.
- [ ] Mobile First 360 px; Knöpfe mindestens 48 px (docs/02 Z. 50). In diesem Auftrag nicht gemessen.
- [ ] Gefahrenthemen: hilfeInsel mit 116 111 (docs/02 Z. 74–75). Ist-Stand: eingebunden (app.mjs Z. 9 und 51). Die Erreichbarkeit wird in Abschnitt 8 geprüft.
- [ ] Lernziele in der README als Liste (docs/02 Z. 42–43). Ist-Stand: nicht als Liste vorhanden.
- [ ] Vorlesen (docs/02 Z. 44). Ist-Stand: vorhanden laut README.
- [ ] Pflichtmarkierung: Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft. (docs/02 Z. 151–152)
- [ ] Keine Modellnamen in Dateien. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden. Vorlesen in uk und ru ist als künftige Option genannt (README).

## 7. Tests

- `test/logik.test.mjs` (vorhanden, GDD Abschnitt 6): mindestens 12 Szenen. Eindeutige IDs. Genau drei Optionen mit den Werten 0, 1, 2. Abdeckung Straße, fremde Personen, 112 und 110, Gift, Tiere. Einfache Sprache mit höchstens 120 Zeichen je Satz. Wertung und Rang-Logik. Rang in der 12er-Runde erreichbar.
- Neu: pruefeSzenarien (Themen augen und gelaende fehlen als Fehler), ziehe12 (gleiche Zufallsreihe ergibt gleiche Auswahl).
- `test/regeln.test.mjs` (neu, nach Vorlage apps/puppentheater-werkstatt/test/regeln.test.mjs): kein Speicheraufruf; keine Punktsumme in Kindertexten (nach Entscheidung in Abschnitt 9); kein Abruf außerhalb von daten/.

## 8. Abnahme

- `npm test` im App-Ordner grün. Testzahl in README und GDD stimmt (docs/02 Z. 110–111).
- Browser bei 360 px: kein Überlauf, Knöpfe mindestens 48 px, Vorlesen funktioniert, Hilfe-Insel sichtbar und erreichbar.
- Test mit Erwachsenen und Kindern der Zielgruppe (docs/02 Z. 45–46).
- Registrierung nur durch den Koordinator.

## 9. Offen

- Augenschutz und das Verlassen des Geländes ohne Erlaubnis (S. 126) fehlen als Szenarien.
- Zählung: Der Katalog nennt 13 Regeln. Die Quelle (S. 126) enthält elf Einzelregeln in sechs Punkten. Die Koordination legt die Zielzahl fest.
- Punkte, Rang und Rekord stehen gegen docs/02 Z. 141–146. Rekord in localStorage (docs/02 Z. 25–26 erlaubt das mit Löschknopf, die Vorlage verbietet es). Entscheidung offen.
- Abgrenzung zu notruf-held (Notrufe üben), damit keine Dublette entsteht.
- uk- und ru-Vorlesen als künftige Option (README).
- Daten: szenarien.json ohne Felder quelle, thema und eigenentwurf.
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt. Sie stehen in Abschnitt 1 und in den Daten als quelle. Hier notiert.
- Seitenangaben ohne Markierung „проверено человеком“ (A18, docs/02 Z. 151–152).
- Lernziele fehlen in der README als Liste (docs/02 Z. 42–43).
