# Bauauftrag GEM-8: Mathe-Entdecker: Zahlen, Formen, Reihen

Status: teilweise · Abschnitt: Gemeinsame Apps 3–5 · Ziel: Ausbau von apps/mathe-entdecker
Blockiert durch: A7 quiz-kern

## 1. Quelle

- Praleska, S. 135 (135–138), Abschnitt „Математика (введение)“ (S. 135), Gruppe „Почемучки“ (S. 136).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Математика (введение)“ (S. 135)
  - „Количество и счет“ (S. 136)
  - „половина“ (S. 136)
  - „сериационные ряды“ (S. 137)
  - „Ориентировка в пространстве“ (S. 137)
  - „подсчет вершин, сторон, углов“ (S. 137)
  - „прямая, кривая, ломаная“ (S. 137)
  - „на пятом году жизни“ (S. 137)
  - „днями недели“ (S. 138)
  - „порах года“ (S. 138)
  - „сутки“ (S. 138)
- Inhalt in eigenen Worten (S. 136–138): Mengen vergleichen, bis 10 zählen, Hälfte und Teil-Ganzes, Größen vergleichen. Reihen aus 3 bis 5 Objekten. Figuren untersuchen (Ecken, Seiten, Winkel zählen). Linienarten. Richtungen im Raum. Tag, Wochentage und Jahreszeiten. Einige Ziele gelten für das fünfte Lebensjahr (S. 137).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Faktenstand laut index.json: nur Katalogtext. Für diesen Auftrag wurde gegen die Textkopie geprüft.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 4 bis 5 in Ko-Nutzung, 5 bis 7 kurz eigenständig (docs/10 Z. 314; GDD Abschnitt 2). Verwendung: Bildschirm.
- Lernziele, prüfbar (Eigenentwurf; die Themen stehen auf S. 136–138):
  1. Kind vergleicht zwei Mengen durch Zuordnen und nennt die größere oder die gleich große Menge.
  2. Kind zählt bis 10 und ordnet Zahl und Menge einander zu.
  3. Kind erkennt eine Hälfte als einen von zwei gleichen Teilen.
  4. Kind setzt eine Reihe aus 3 bis 5 Objekten nach einer Regel fort.
  5. Kind zählt Ecken und Seiten einer Figur.
  6. Kind nennt Wochentage und Tageszeiten in richtiger Reihenfolge.

## 3. Funktion

- Bildschirme: Start mit Vorlesen und gemeinsamem Mitsprechen. Quizfragen (16 Aufgaben, Runde 10, binär oder Wahl). Auflösung mit Vorlesen. Abschluss mit Rang und Rekord. Modi Duett, Staffel und Klassen aus quiz-kern.
- Ablauf: Start → 10 Aufgaben aus 16 (quiz-kern mischt) → Vorlesen je Aufgabe → Antwort → Auflösung → Abschluss.
- Ist-Stand (README, GDD): mehr, weniger oder gleich viele. Zählen bis 10. Formen und ihre Ecken. Reihen und Muster fortsetzen. Größenvergleich. Richtungen oben und unten. Hälfte. Tageszeit.
- Der Katalog verlangt (docs/10, Z. 314): Content-Pack auf quiz-kern mit Mini-Simulator für die 26 Mathematik-Lernziele. Dazu Linienarten, Raumrichtungen, Wochentage und Jahreszeiten sowie Reihen aus 3 bis 5 Objekten. Dreisprachig de, uk, ru.
- Lücken: Der Mini-Simulator (Reihen legen) ist nicht gebaut. Linienarten, Wochentage, Jahreszeiten sowie links und rechts stehen nicht in der README-Liste. uk und ru fehlen. Die Liste der 26 Ziele liegt nicht als Dokument vor. Siehe Abschnitt 9.
- Druck: nicht vorgesehen.

## 4. Daten

Datei: `apps/mathe-entdecker/daten/fragen.json` (vorhanden). Die Felder quelle und eigenentwurf fehlen bisher. Schema mit einer Beispielzeile:

```json
{ "id": "menge-mehr-weniger-01", "thema": "mengen", "titel": "Mehr, weniger oder gleich viele", "quelle": { "seite": "S. 136" }, "eigenentwurf": true }
```

## 5. Pseudocode

Vorhanden: pruefeFragen und starteQuiz aus packages/quiz-kern/src/quiz.mjs, geprüft in test/fragen.test.mjs. Alle anderen Funktionen sind (Eigenentwurf).

```
pruefeMatheFragen(fragen: Frage[]) -> Fehler[]
  pruefeFragen(fragen) aufrufen und dessen Fehler übernehmen
  Abdeckung: je Thema aus {mengen, zaehlen, formen, reihen, groesse, richtung, haelfte, zeit, linien, wochentage, jahreszeiten} mindestens eine Frage
  fehlen linien, wochentage oder jahreszeiten -> Fehler je Thema
  quelle.seite ist gesetzt, sonst Fehler "Seitenangabe fehlt"
  Mindestvorrat: 12 Fragen
  -> Fehler-Liste

erstelleReihe(objekte: Objekt[3 bis 5], regel: groesse | farbe, zufallsReihe: Zahl[]) -> Aufgabe
  reihe = objekte, nach regel sortiert
  luecke = zufallsReihe[0] mod Länge(reihe)
  -> {reihe mit Lücke an Position luecke, richtig: reihe[luecke]}

pruefeReihe(gelegt: Objekt[], regel: groesse | farbe) -> {ok: Boolean, fehlerIndex: Zahl | null}
  Länge ungleich -> {ok: false, fehlerIndex: 0}
  für i von 1 bis Länge - 1: Merkmal nach regel an Stelle i liegt nicht hinter Stelle i-1 -> {ok: false, fehlerIndex: i}
  -> {ok: true, fehlerIndex: null}
```

Die Zufallsreihe kommt als Parameter. Die Logikdatei enthält keine Zufallsquelle.

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Ist-Stand: Rekord mathe.rekord in localStorage, gesetzt über quiz-kern (README; packages/quiz-kern/src/quiz.mjs Z. 252–255). Abweichung, siehe A7 in docs/fragen-und-hinweise.md und Abschnitt 9.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Ist-Stand: NetzwerkWaechter laut README. Abruf nur lokal (daten/fragen.json).
- [ ] Keine Eingabefelder (Projektregel). Ist-Stand: Bedienung über Schaltflächen (quiz-kern).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Ist-Stand: Rang und Punkte (README; quiz-kern Z. 252–255). Abweichung, siehe A7.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Nicht zutreffend.
- [ ] Mobile First 360 px; Knöpfe mindestens 48 px (docs/02 Z. 50). In diesem Auftrag nicht gemessen.
- [ ] Lernziele in der README als Liste (docs/02 Z. 42–43). Ist-Stand: die README nennt nur die Zahl 26, die Liste fehlt.
- [ ] Vorlesen (docs/02 Z. 44). Ist-Stand: Vorlesen aller Aufgaben laut README.
- [ ] Pflichtmarkierung: Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft. (docs/02 Z. 151–152)
- [ ] Keine Modellnamen in Dateien. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: Zahlwörter nicht vorhanden, offen.

## 7. Tests

- `test/fragen.test.mjs` (vorhanden, GDD Abschnitt 6): quiz-kern-Schema gültig (pruefeFragen). Mischung aus binär und Wahl, ja und nein. Abdeckung Mengen, Zählen, Formen, Reihen, Ecken, mehr und weniger. Ränge in der 10er-Runde erreichbar. Mindestvorrat 12.
- Neu, nach Vorlage: `test/logik.test.mjs` (fehlt bisher). Inhalt: erstelleReihe (Lücke an richtiger Stelle, gleiche Zufallsreihe ergibt gleiche Aufgabe), pruefeReihe (Länge, Ordnung), pruefeMatheFragen (Themen linien, wochentage und jahreszeiten fehlen als Fehler).
- `test/regeln.test.mjs` (neu, nach Vorlage apps/puppentheater-werkstatt/test/regeln.test.mjs): kein Speicheraufruf in app.mjs; kein Abruf außerhalb von daten/; keine Anzeige von Punkten oder Rang (nach Entscheidung A7).

## 8. Abnahme

- `npm test` im App-Ordner grün. Testzahl in README und GDD stimmt (docs/02 Z. 110–111).
- Browser bei 360 px: kein Überlauf, Antwortknöpfe mindestens 48 px, Vorlesen funktioniert.
- Test mit Kindern der Zielgruppe zusammen mit Erwachsenen (docs/02 Z. 45–46).
- Registrierung nur durch den Koordinator.

## 9. Offen

- A7 (quiz-kern): Rekord im localStorage und Ränge nach Punkten (packages/quiz-kern/src/quiz.mjs Z. 252–255). Entscheidung: (a) Engine ändern (Empfehlung in docs/fragen-und-hinweise.md) oder (b) App anpassen. Betrifft 35 Apps.
- Mini-Simulator (Reihen legen) aus dem Katalog ist nicht gebaut.
- Linienarten (S. 137), Wochentage und Jahreszeiten (S. 138) sowie links und rechts (S. 137) fehlen in der README-Liste.
- uk- und ru-Zahlwörter nicht vorhanden (Katalog; Option laut README).
- Testdatei: Die Vorlage nennt test/logik.test.mjs, vorhanden ist test/fragen.test.mjs. Angleichen oder für diese App begründen.
- Hinweis, kein Blocker: docs/10 nennt als Zielgruppe 4 bis 5 in Ko-Nutzung. Der Index ordnet die Einheit den Gemeinsamen Apps 3 bis 5 zu.
- Daten: fragen.json ohne Felder quelle, thema und eigenentwurf.
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt. Sie stehen in Abschnitt 1 und in den Daten als quelle. Hier notiert.
- Seitenangaben ohne Markierung „проверено человеком“ (A18, docs/02 Z. 151–152).
- Lernziele fehlen in der README als Liste (docs/02 Z. 42–43).
