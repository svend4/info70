# Bauauftrag CON-4: Mein Ort, mein Land, unsere Erde (Content-Pack)

Status: teilweise · Abschnitt: Content-Pakete, Funktionen, Dokumente · Ziel: Ausbau von `apps/deutschland-kompass/`
Blockiert durch: A7 quiz-kern

## 1. Quelle

- Praleska, S. 119 (119–120), Abschnitt „Ребенок как член общества“ (S. 119), Gruppe „ПОЧЕМУЧКИ“ (S. 120).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „родном городе“ (S. 119)
  - „родного края“ (S. 120)
  - „родной стране“ (S. 120)
  - „столица“ (S. 120)
  - „национальным культурам“ (S. 120)
  - „человечестве как семье“ (S. 120)
- Umschrieben, ohne Anführungszeichen: Die Seiten nennen als Ziele den eigenen Ort, das eigene Land mit Hauptstadt, Sprache und Natur sowie die Menschheit als eine Familie auf der Erde mit Achtung vor allen Kulturen (S. 119–120). Die Quelle verlangt außerdem Stolz auf Nation und Staatssymbole sowie Dankbarkeit gegenüber Kriegshelden (S. 119). Diesen Teil ersetzt der Katalog durch Heimat- und Europabildung (docs/10, Z. 451).
- Die Stufen Straße und Stadt, Bundesland, Deutschland, Europa und Erde sind Katalogvorgabe (docs/10, Z. 451), nicht Wortlaut der Quelle. Die Stufenbezeichnungen sind Eigenentwurf.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.
- Katalogeintrag: docs/10, Z. 451 (Mein Ort, mein Land, unsere Erde). Zielgruppe 5 bis 7 und 8 bis 12, Typ M, Engine quiz-kern (Content-Pack, Ränge).

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 5 bis 7 Jahre in Ko-Nutzung, 8 bis 12 Jahre eigenständig (GDD). Verwendung: Bildschirm.
- Lernziele, prüfbar (Eigenentwurf):
  1. Kind nennt die Stufen Straße und Stadt, Bundesland, Deutschland, Europa und Erde in dieser Reihenfolge.
  2. Kind ordnet eine Frage der passenden Stufe zu.
  3. Erwachsene findet in `eltern.html`, wie die Stufen gemeint sind.

## 3. Funktion

- Bestand (README und GDD der App): Modus 1 „Plan und Kompass“ mit einem 5×5-Raster, acht benannten Orten und einer Windrose; die Aufgaben sind lösbar per Konstruktion (`alleAufgaben`, `baueAufgabe` in `logik.mjs`). Modus 2 Karten-Quiz mit 13 Fragen in drei Bereichen (Himmelsrichtungen, Deutschland, Welt). Modus 3 Länderkarten Deutschland und Ukraine, nur Geografie.
- Lücke gegen den Katalog: Die Stufenfolge Bundesland, Deutschland, Europa und Erde fehlt als geführter Ablauf. Der Katalog nennt Ränge (docs/10, Z. 451); docs/02 Z. 141–146 verbietet sie für Kinder. Die Ukraine-Karte ist vorhanden, ein Herkunftsland-Modul mit uk/ru-Fassung fehlt.
- Ablauf neu (Eigenentwurf): Stufe wählen (Straße und Stadt → Bundesland → Deutschland → Europa und Erde) → drei bis fünf Fragen der Stufe → Erklärung nach jeder Antwort → nächste Stufe oder Abschluss.
- Bildschirme: Stufenwahl, Frage, Erklärung, Abschluss. Der Abschluss zeigt keine Punkte und keinen Rang (Eigenentwurf).
- Was gedruckt wird: nichts. Der Katalog verlangt keinen Druck.

## 4. Daten

Datei: `apps/deutschland-kompass/daten/stufen.json` (neu). Bestand: `daten/karte.json` (Version 1, Orte des Plans). Die 13 Quizfragen erhalten ein neues Feld `stufe`. Die Sitzung prüft vor dem Schreiben, in welcher Datei die Quizfragen stehen. Schema mit einer Beispielzeile:

```json
{ "id": "stufe-stadt", "titel": "Straße und Stadt", "reihenfolge": 1, "quelle": { "seite": "S. 119" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
ladeStufen(datei) -> Liste<Stufe>
  lies daten/stufen.json
  prüfe je Eintrag: id, titel, reihenfolge (Werte 1 bis 4)
  prüfe je Eintrag: quelle.seite vorhanden ODER eigenentwurf == true
  sortiere nach reihenfolge

naechsteStufe(stufen, aktuelleId) -> Stufe | null
  i = Index des Eintrags mit id == aktuelleId
  gib stufen[i + 1] zurück, wenn vorhanden, sonst null

fragenFuerStufe(fragen, stufeId, zufall) -> Liste<Frage>
  filtere fragen mit frage.stufe == stufeId
  mische mit mischen(liste, zufall); zufall ist Parameter

beantworteFrage(frage, auswahlIndex) -> { richtig, erklaerung }
  richtig = (auswahlIndex == frage.richtigIndex)
  gib { richtig, erklaerung } zurück
  kein Zähler (siehe Abschnitt 6)

pruefeDaten(daten) -> Liste<Fehler>   (bestehend in logik.mjs, ergänzt)
  Fehler, wenn eine Frage keine gültige Stufe hat oder eine Stufe ohne Frage ist
  baueAufgabe(...) für Modus 1 bleibt unverändert
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Die App speichert nichts; laut README wird localStorage nicht verwendet, Zähler leben nur in der Sitzung.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24; die CSP-Umsetzung ist Eigenentwurf). Der NetzwerkWächter der App ist im Bestand.
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 17–30 begrenzt Datenerhebung und Kommunikation). Die Auswahl erfolgt über Schaltflächen.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Verstoß im Bestand: der Zähler `quizPunkte` mit der Ausgabe „Richtig beantwortet“ in `apps/deutschland-kompass/app.mjs` (Z. 26, 155, 199). Er wird entfernt.
- [ ] Druck: in dieser Einheit nicht vorgesehen. Käme Druck hinzu, gelten docs/02 Z. 79–82.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Diese Einheit druckt keine Seitenangabe; Seitenangaben stehen nur in Abschnitt 1 und in den Daten (A18-Standard).
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: offen. Die Ukraine-Karte ist vorhanden; das Herkunftsland-Modul des Katalogs (docs/10, Z. 451) fehlt.

## 7. Tests

- `test/logik.test.mjs` (Bestand) erweitern: Stufen lückenlos von 1 bis 4; jede Quizfrage hat genau eine gültige Stufe; fragenFuerStufe liefert nur Fragen der gewählten Stufe; beantworteFrage liefert kein Punktefeld.
- `test/regeln.test.mjs` (neu, Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): kein Aufruf von localStorage oder sessionStorage; keine Ausgabe mit „Richtig beantwortet“ oder einer Punktzahl; das Wortverbot der Länderkarten bleibt bestehen.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick auf der Überschrift des neuen Bildschirms, Speicher gleich null, nur `localhost`.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Ränge im Katalog (docs/10, Z. 451) gegen docs/02 Z. 141–146: Entscheidung nötig. Empfehlung: keine Ränge.
- Punktzähler im Bestand (`app.mjs` Z. 26, 155, 199): Entfernung ist eine Änderung der App. Freigabe durch den Koordinator.
- Stufen Bundesland, Europa und Erde: Inhalte sind Eigenentwurf; die Quelle nennt Heimatkunde und Menschheit als Familie (S. 120), nicht die Stufenfolge.
- Herkunftsland-Modul (uk/ru): offen.
- A18 Seitenangaben: Standard (Vorschlag) ist, dass keine Seitenzahl auf dem Bildschirm steht; die Daten tragen `quelle`.
- Die Engine laut GDD ist `kinder-ui`; der Katalog nennt quiz-kern. A7 betrifft diese App nur, falls quiz-kern eingeführt wird.
