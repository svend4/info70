# Bauauftrag KIT-12: Musikspiele-Kartei U3

Status: teilweise · Abschnitt: Kita-Werkzeuge (Fachkräfte) · Ziel: Ausbau von apps/musikspiele-kartei-u3/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 81 (81–86), Abschnitt „Развиваемся в деятельности“ (Kopfzeile S. 81–85), Gruppe „Малыши“ (Seiten 81–86).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Песенно-игровое и песенно-инструментальное творчество“ (S. 81)
  - „Рекомендуемый музыкальный репертуар“ (S. 81)
  - „Попевки-упражнения“ (S. 81)
  - „Инсценирование попевок, песен“ (S. 82)
  - „Музыкально-ритмическая деятельность“ (S. 83)
  - „Хороводы“ (S. 83)
  - „Танцевальное творчество“ (S. 84)
  - „Игра на музыкальных инструментах“ (S. 86)
  - „Музыкальные сказки-драматизации“ (S. 86)
  - „Белорусские фольклорные игры“ (S. 86)
  - „третьего года жизни“ (S. 81)
- Umschrieben ohne Anführungszeichen: die Quelle ordnet die Musikspiele nach Singen, Musik-Rhythmus, Tanz, Instrumentalspiel und Musik-Inszenierung. Lieder und Tanzbeispiele stehen in Listen mit Titeln, die mit dem Zusatz „и др.“ enden (S. 82, 84, 85).
- Gattungen, Prinzipien und Auswahl sind Eigenentwurf; die Titel stammen aus der Quelle.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Nicht gefunden – offen:
  - Dauer, Gruppengröße und Ort je Spiel (Katalogangabe). Suchbegriffe auf S. 81–86: Minuten, Dauer, Ort, Gruppengroesse; keine Treffer.
  - Gesamtzahl „ca. 50“, „46“ und „9“ (Katalogangabe). Eine Zaehlung ist in der Quelle nicht belegt; die Listen enden mit dem Zusatz „и др.“ (S. 82, 84, 85).
  - Alter je Spiel: nur wo der Text es nennt (zum Beispiel „третьего года жизни“, S. 81).
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: <ausstehend>.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte mit Kindern von 1 bis 3 Jahren (Quelle: Gruppe „Малыши“, ranger Altersbereich, S. 6 und S. 44). Verwendung: Druck (Karten) und Bildschirm (Auswahl).
- Lernziele, prüfbar:
  1. Die Fachkraft waehlt eine der dreizehn Gattungen und sieht Prinzip, Seite der Quelle und Beispieltitel.
  2. Die Fachkraft druckt nur die gewaehlte Auswahl; die Zahl der gedruckten Karten stimmt mit der Auswahl ueberein.
  3. Bei jeder Karte steht das Alter nur, wenn die Quelle es nennt; sonst steht „nicht angegeben“ (Eigenentwurf).

## 3. Funktion

- Katalog verlangt (docs/10, Eintrag KIT-12): filterbare Ideenkartei mit etwa 50 Spielprinzipien (Tier-Inszenierung, Frage-Antwort-Singen, Reigen, Klangimitation); Filter nach Alter, Dauer, Gruppengroesse und Ort; jede Karte druckbar. Adaptation: nur Spielmechaniken, keine fremden Liedtexte; gemeinfreie deutsche Kinderlieder als Traeger (nicht geprueft); uk- und ru-Volksliedhinweise.
- App leistet schon (README, GDD, `logik.mjs`):
  - dreizehn Gattungen als Zusammenfassung der Quelle (Eigenentwurf);
  - Karte je Gattung mit Prinzip (Eigenentwurf), Seite und Titeln der Quelle in russischer oder belarussischer Fassung;
  - Filter nach Gattung;
  - Druck der gewaehlten Auswahl;
  - keine Speicherung, keine Verbindung nach außen.
- Bildschirme: Kartenuebersicht mit Filter-Knoepfen je Gattung (ohne Auswahl alle dreizehn); Druckansicht.
- Ablauf: Gattung waehlen → Karten ansehen → Auswahl treffen → Drucken.
- Was gedruckt wird: je Karte Gattung, Prinzip (Eigenentwurf), Titel der Quelle und Alter, nur wenn die Quelle es nennt. Keine Seitenzahl auf dem Blatt (A18-Standard). Eine Karte je Blatt A4 hoch.
- Luecke: Filter nach Dauer, Gruppengroesse und Ort lassen sich nicht umsetzen, weil die Quelle diese Angaben nicht macht. Deutsche Titel fehlen; gemeinfreie Kinderlieder sind nicht geprueft. Offen in Abschnitt 9.

## 4. Daten

Datei: `apps/musikspiele-kartei-u3/daten/karten.json`. Schema: je Karte `id`, `gattung`, `prinzip` (Eigenentwurf), `titel` (Quelle), `quelle.seite`. Schema mit einer Beispielzeile:

```json
{ "id": "reigen-01", "gattung": "Reigen", "prinzip": "Kinder bewegen sich im Kreis zu einem bekannten Lied.", "titel": "Хороводы", "quelle": { "seite": "S. 83" }, "eigenentwurf": true }
```

Das Feld `eigenentwurf` gilt fuer das Prinzip. Der Titel ist Quelle. Felder fuer Dauer, Gruppengroesse und Ort gibt es nicht.

## 5. Pseudocode

```
ladeKarten(pfad = "daten/karten.json") -> {gattungen, karten}
  Schritt 1: Datei lesen; bei Fehler Abbruch
  Schritt 2: genau 13 Gattungen; jede Karte hat quelle.seite zwischen S. 81 und S. 86
  Schritt 3: kein Feld dauer, gruppengroesse oder ort (Gegenprobe im Test)

gattungFuer(karte) -> Gattung
  Schritt 1: gattung der Karte lesen
  Schritt 2: unbekannte Gattung ergibt Fehler

kartenFuer(karten, gattungIds) -> Karte[]
  Schritt 1: ist gattungIds leer, alle Karten in Katalogreihenfolge
  Schritt 2: sonst nur Karten, deren gattung in gattungIds liegt

quelleTextVon(karte) -> Text
  Schritt 1: Titel und Seite der Quelle ausgeben, zum Beispiel „Хороводы“ (S. 83)
  Schritt 2: kein Satz aus der Quelle; nur Titel

pruefeDaten(karten) -> Fehlerliste
  Schritt 1: Titel hoechstens 6 Woerter, ohne Autorenangabe (Muster муз., сл., обр.)
  Schritt 2: kein Prinzip enthaelt eine Zaehlung oder Gesamtzahl
  Schritt 3: Liste der Fehler leer, sonst Testfehler

druckeAuswahl(karten, gattungIds) -> HTML
  Schritt 1: kartenFuer(karten, gattungIds) aufrufen
  Schritt 2: eine Karte je Blatt; Anzahl Blaetter gleich Anzahl ausgewaehlter Karten
  Schritt 3: keine Seitenzahl auf dem Blatt, keine Namenszeile, keine Zeichen ☐☒☑✓✔★☆
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Die App speichert nichts (logik.mjs Z. 25).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Die App hat nur Auswahl-Knoepfe.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Keine Rangfolge der Karten.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50). Die App-Dokumentation nennt 44 px; siehe Abschnitt 9.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Die Markierung gilt für jede Anzeige mit Seitenangabe. Die Karte traegt nach dem A18-Standard keine Seitenangabe.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden, laut README 17 Tests): dreizehn Gattungen mit Seite 81–86, Titel ohne Autorenangabe, kein Feld fuer Dauer, Gruppengroesse oder Ort, keine Summe, Filter nach Gattung, Abweisung fehlerhafter Daten.
- `test/regeln.test.mjs` (fehlt, anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Druck ohne Zeichen, Knopfhoehe 48 px, keine Modellnamen.

## 8. Abnahme

- `npm test` im App-Ordner gruen; Testzahl in README und GDD stimmt.
- Browser bei 360 px: dreizehn Karten sichtbar, Filter, Knoepfe mindestens 48 px, kein Ueberlauf, keine externen Anfragen, Speicher gleich null.
- Druck: Zahl gedruckter Karten gleich Auswahl; keine Zeichen; keine Seitenzahl auf dem Blatt.
- Registrierung nur durch den Koordinator.

## 9. Offen

- Dauer, Gruppengroesse und Ort: die Quelle nennt sie nicht (siehe Abschnitt 1). Entscheidung: Filter streichen (Ist-Stand im Titel der Gattungen) oder als Eigenentwurf mit Kennzeichnung aufnehmen.
- Gesamtzahl: die Katalogangabe („ca. 50“, „46“, „9“) ist nicht belegt; die App zeigt keine Summe. Katalog-Korrektur.
- Deutsche Titel und gemeinfreie deutsche Kinderlieder (Katalog-Adaptation): nicht geprueft, nicht enthalten.
- Knopfhoehe: die README nennt 44 px, die Regel verlangt 48 px (docs/02 Z. 50). Angleichen.
- Seitenzahlen auf den Karten: die App zeigt „S. n“ je Karte. Nach dem A18-Standard stehen Seiten nur in den Daten und in Abschnitt 1. Anpassen oder Standard neu entscheiden.
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Zitatgrenze: dieser Bauauftrag nutzt 6 Woerter (docs/10). A10 fragt, ob 12 gelten sollen (offen).
