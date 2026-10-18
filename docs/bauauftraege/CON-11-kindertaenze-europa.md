# Bauauftrag CON-11: Kindertänze Europas

Status: teilweise · Abschnitt: Content-Pakete, Funktionen, Dokumente · Ziel: Ausbau von `apps/kindertaenze-europa/` (Index-Feld `app` ist leer, der Ordner existiert; siehe Abschnitt 9)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 266 bis 267 (266–267), Abschnitt „Рекомендуемый репертуар“ (S. 266), Gruppe „ФАНТАЗЕРЫ“ (S. 266). Die Tanzarten stehen zusätzlich auf S. 259 (Abschnitt „Развиваемся в деятельности“, S. 259).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „хоровод“ (S. 259)
  - „менуэт“ (S. 259)
  - „Менуэт“ (S. 267)
  - „Полонез“ (S. 267)
  - „Полька“ (S. 267)
  - „Гопак“ (S. 267)
  - „Казачок“ (S. 267)
  - „Коло“ (S. 267)
  - „Ласточка“ (S. 267)
  - „Трапятуха“ (S. 267)
- Umschrieben, ohne Anführungszeichen: Die Seiten nennen Tanzarten und Tanztitel aus mehreren Völkern, zum Beispiel Walzer, Mazurka und Polonaise sowie ukrainische, belarussische und russische Volkstänze (S. 259, S. 267). Die Quelle nennt Titel und Musik, keine Schrittfolgen.
- „nicht gefunden – offen“: Sirtaki (Eigenentwurf: griechischer Tanz). Suchbegriffe: Сиртаки, Сиртак. Ohne Treffer in der gesamten Textkopie (S. 1–321), auch mit Silbentrennung.
- Die Schrittfolgen, die Herkunftsgeschichten und die deutschen Titel sind Eigenentwurf (docs/10, Z. 458).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.
- Katalogeintrag: docs/10, Z. 458 (Kindertaenze Europas). Zielgruppe 5 bis 7 (Kita) und Familien, Typ M.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 5 bis 7 Jahre in der Kita, Familien mit Migrationsgeschichte (docs/10, Z. 458). Verwendung: Druck (Tanzkarte) und Bildschirm (Repertoire-Navigator für Erwachsene).
- Lernziele, prüfbar (Eigenentwurf):
  1. Erwachsener wählt eine Herkunft und sieht nur die Tänze dieser Herkunft (`taenzeFuer`).
  2. Erwachsener druckt eine Tanzkarte je A4-Blatt hoch mit Titel, Herkunft und den Schritten.
  3. Kind und Erwachsener machen die Schrittfolge einer Karte im Raum nach. Die App zeigt keine Bewertung (Eigenentwurf).

## 3. Funktion

- Bestand: Der Index führt das Feld `app` leer; der Ordner `apps/kindertaenze-europa/` ist im Repo vorhanden. Eine Beschreibung des Bestands ist in diesem Bauauftrag nicht enthalten (siehe Abschnitt 9).
- Katalog: Datenpaket für Druckkartei und Repertoire-Navigator (docs/10, Z. 458). Ein europäischer Fokus, mit ukrainischem Hopak und weiteren Herkunftstänzen als interkulturelle Brücke.
- Ablauf: Herkunft wählen → Tanzliste → Tanzkarte zeigen → optional drucken. Jeder Schritt ist eine Auswahl aus einer Liste, kein Freitext (Eigenentwurf).
- Keine Punkte, keine Bewertung, keine Auswertung eines Kindes (docs/02, Z. 141–146).
- Was gedruckt wird: eine Tanzkarte je Blatt A4 hoch mit Titel (ru und de), Herkunft und Schrittfolge (Eigenentwurf). Keine Seitenzahl auf dem Blatt (A18-Standard). Keine Namenszeile.

## 4. Daten

Datei: `apps/kindertaenze-europa/daten/` (Ordner vorhanden). Der Name und das Schema der vorhandenen Datei werden in der Ausbau-Sitzung gegen das folgende Schema geprüft. Schema mit einer Beispielzeile:

```json
{ "id": "polonaise", "de": "Polonaise", "ru": "Полонез", "herkunft": "Polen", "schritte": ["…"], "quelle": { "seite": "S. 267" }, "eigenentwurf": true }
```

- Feld `quelle.seite` nur „S. 259“, „S. 266“ oder „S. 267“, wenn der Titel aus dem Quelltext stammt.
- Feld `herkunft` ist Eigenentwurf und trägt `eigenentwurf: true`.
- Feld `schritte` ist Eigenentwurf: drei bis sechs Schritte je Tanz.

## 5. Pseudocode

```
ladeTaenze(daten) -> Liste<Tanz>
  prüfe je Eintrag: id, de, herkunft, ru oder null
  bricht ab, wenn ein Pflichtfeld fehlt
  gib daten.taenze in Dateireihenfolge zurück

pruefeTaenze(daten) -> Liste<Fehler>
  Fehler, wenn quelle.seite nicht in {S. 259, S. 266, S. 267} liegt
  Fehler, wenn ein Eintrag weder quelle.seite noch eigenentwurf == true hat
  Fehler, wenn ein Eintrag ohne herkunft steht
  Fehler, wenn der Eintrag „Sirtaki“ enthält, solange Abschnitt 9 offen ist

taenzeFuer(daten, herkunft) -> Liste<Tanz>
  gib alle Einträge mit eintrag.herkunft == herkunft zurück; leere Liste bei unbekannter Herkunft

tanzKarte(tanz) -> { titel, herkunft, schritte, quelle }
  titel = tanz.ru, wenn nicht null, sonst tanz.de
  schritte = tanz.schritte; Fehler, wenn die Liste leer ist

druckBlaetter(karten) -> Liste<Blatt>
  je Karte ein Blatt A4 hoch; keine Zeichen aus ☐☒☑✓✔★☆, keine Emojis (\p{Extended_Pictographic})
  erzeugt keine Namenszeile
  Pflichtmarkierung nur, wenn ein Blatt eine Seitenangabe trägt (A18-Standard: keine)
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Werkzeuge ohne Nutzerdaten speichern nichts.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Keine fremden Melodie-Aufnahmen; nur Titel (S. 267).
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 17–30). Nur Auswahl aus Listen.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Sie steht auf jedem gedruckten Blatt mit Seitenangabe. Ohne menschliche Prüfung erfüllt keine Seitenangabe die Regel docs/02 Z. 151–152. Deshalb trägt das Blatt keine Seitenangabe (A18).
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: die Titel stehen in ru und in Umschrift; eine Fassung in uk ist offen.

## 7. Tests

- `test/logik.test.mjs`: Bank gültig (Pflichtfelder, Herkunft gesetzt); `pruefeTaenze` findet Einträge ohne Quelle und ohne Eigenentwurf-Kennung; `taenzeFuer` liefert nur die gewählte Herkunft; `tanzKarte` verlangt mindestens einen Schritt.
- `test/regeln.test.mjs`: Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs` (Druck ohne Zeichen aus der Sperrliste, ohne Namenszeile; Knopfhöhe 3rem; Zufall nur in `app.mjs`).

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick, Speicher gleich null, nur `localhost`.
- Druck: eine Tanzkarte je Blatt; keine Zeichen; keine Namenszeile; Zahl gedruckter Karten gleich Auswahl.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Index-Feld `app` für CON-11 ist leer, obwohl `apps/kindertaenze-europa/` im Repo liegt. Korrektur durch den Koordinator (`tools/bauauftrag-index.mjs`). Diese Sitzung ändert den Index nicht.
- Sirtaki: nicht im Quelltext gefunden (siehe Abschnitt 1). Der Katalog nennt ihn (docs/10, Z. 458). Entscheidung: streichen oder mit anderer Quelle belegen.
- Schrittfolgen und Herkunftsgeschichten: Eigenentwurf; die Quelle liefert nur Titel und Musik.
- Seitenangabe auf dem Druckblatt: Standard für neue Apps (A18). Keine Seitenzahl auf dem Blatt.
- Fassung in uk: offen.
