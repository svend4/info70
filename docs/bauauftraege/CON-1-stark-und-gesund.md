# Bauauftrag CON-1: Content-Pack: Stark und gesund

Status: teilweise · Abschnitt: Content-Pakete, Funktionen, Dokumente · Ziel: Ausbau von apps/stark-und-gesund/
Blockiert durch: keine (A7 am 27.10.2026 umgesetzt)

Stand 27.10.2026: A7 ist umgesetzt. Der Motor `quiz-kern` speichert nichts und kennt keinen Rekord, keine Punkte und keine Ränge mehr; die Quiz-Apps laufen ohne Wertung durch (Quiz-Durchlauf). Aussagen zu A7 weiter unten stammen aus der Zeit davor.

## 1. Quelle

- Praleska, S. 13 (13–14), Abschnitt „Расти здоровым, малыш!“ (Gesundheitsteil), Gruppe: keine (Programmteil; Kopfzeile „Программа «ПРАЛЕСКА»“ (S. 14)).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Расти здоровым, малыш!“ (S. 13)
  - „двигательная активность“ (S. 13)
  - „приобщение детей к природе“ (S. 13)
  - „Солнце, воздух, земля, вода“ (S. 13)
  - „грамотное, рациональное питание“ (S. 13)
  - „йодированной солью“ (S. 13)
  - „физкультурно-оздоровительной работы“ (S. 14)
  - „закаливанию“ (S. 14)
- Umschrieben ohne Anführungszeichen: Die Quelle verbindet Gesundheit mit Bewegung, mit dem Aufenthalt in Luft und Sonne sowie mit einer ausgewogenen Ernährung (S. 13). Abhärtung ist Teil der Gesundheitsarbeit, verläuft aber nicht für alle Kinder gleich (S. 14).
- Nicht gefunden – offen (Suchbegriffe auf S. 13–20, Quelle-Lücke):
  - Schlaf: Suchbegriffe „сон“, „сна“ ohne Treffer.
  - Bildschirm und Pausen: Suchbegriffe „экран“, „телевиз“ ohne Treffer.
  - Getränke ohne Zucker, Wasser als Getränk: Suchbegriffe „напит“, „сладк“ ohne Treffer; „вода“ steht nur in der Aufzählung auf S. 13.
  - Hygiene (Hände, Zähne): Suchbegriffe „мыть“, „зуб“ ohne Treffer.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet. Die Erklärungen stützen sich auf BZgA- und DGE-Empfehlungen (Eigenentwurf, nicht gegen die Quelle geprüft).
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft; das Skript meldet für diese Datei keine Fehler.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder von 8 bis 12 Jahren (docs/02 Z. 40). Verwendung: Bildschirm (Quiz mit Vorlesefunktion, offline nutzbar).
- Lernziele, prüfbar (aus dem Entwurf der App, übersetzt; Eigenentwurf):
  1. Das Kind nennt drei bis vier einfache Gewohnheiten, die den Körper stärken: Bewegung, Schlaf, Wasser, bunte Ernährung, Pausen.
  2. Das Kind unterscheidet Wasser oder ungesüßten Tee von süßen Getränken und begründet, warum Wasser besser ist.
  3. Das Kind erkennt Körpersignale wie Durst oder Müdigkeit und kennt eine einfache erste Antwort darauf.
  4. Das Kind verbindet Bildschirmpausen mit der Pflege von Augen und Körper.

## 3. Funktion

- Katalog verlangt (docs/10, Eintrag „Content-Pack: Stark und gesund“, Typ: quiz-kern, Alter 8–12): Quizfragen mit Erklärungen und Rängen zu Bewegung, Ernährung, Schlaf, frischer Luft und Abhärtung, abgeleitet aus dem Gesundheitskapitel. Adaptation laut Katalog: DGE-Ernährungskreis und BZgA-Botschaften statt der landesspezifischen Jodsalz-Kampagne; Bezug zu Sachunterricht und Gesundheitserziehung; uk/ru-Übersetzung.
- App leistet schon (README, GDD, `daten/fragen.json`):
  - Quiz auf der Engine `@info70/quiz-kern` (Daten, Texte und Politik in der App);
  - Bank von 16 Fragen, Runde mit 12 Fragen; Fragetypen „binaer“ (ja oder nein) und „wahl“ (drei Antworten);
  - jede Antwort mit Erklärung; Vorlesen über die Engine; `eltern.html`; Impressum;
  - keine Anfrage an fremde Adressen (CSP `default-src 'self'`, Netzwerk-Wächter).
- Abweichungen, die der Ausbau beheben muss (docs/02 Z. 141–146):
  - Ränge: `fragen.json` enthält vier Rangstufen mit Titeln und Symbolen;
  - Punkte: die Engine zählt Punkte;
  - Rekord: der Schlüssel `sug.rekord` im localStorage, mit Löschknopf.
- Lücke: Die Quelle belegt Bewegung, Luft, Wasser, Ernährung und Abhärtung nur teilweise (Abschnitt 1). Schlaf, Bildschirmpausen, Getränke und Hygiene sind Eigenentwurf nach BZgA und DGE und nicht gegen die Quelle geprüft; die Fragen tragen dafür die Kennzeichnung `eigenentwurf`.
- Bildschirme: Start; Frage mit zwei oder drei Antworten; Erklärung nach jeder Antwort; Ende der Runde ohne Rang und ohne Punkte; Vorlesen-Knopf.
- Ablauf: Start → Frage lesen oder vorlesen lassen → Antwort wählen → Erklärung lesen → nächste Frage → Ende der Runde.
- Was gedruckt wird: nichts. Ein Druck ist nicht vorgesehen.

## 4. Daten

Datei: `apps/stark-und-gesund/daten/fragen.json` (vorhanden). Ist-Stand der Felder: id, typ, kategorie, aussage oder frage, korrekt, antworten (bei „wahl“), erklaerung. Ziel-Form mit einer Beispielzeile:

```json
{ "id": "g01", "typ": "binaer", "kategorie": "Bewegung", "aussage": "…", "korrekt": "ja", "erklaerung": "…", "quelle": { "seite": "S. 13" }, "eigenentwurf": true }
```

Ausbau: Das Feld `raenge` wird vollständig entfernt, nicht nur ausgeblendet (docs/02 Z. 141–146). Fragen ohne Bezug zu S. 13–14 erhalten `"quelle": null` und `"eigenentwurf": true`.

## 5. Pseudocode

```
ladeFragen(pfad = "daten/fragen.json") -> {zielgruppe, fragen}
  Schritt 1: Datei lesen; bei Fehler Abbruch
  Schritt 2: pruefeFragen(daten) aufrufen; bei Fehlern Abbruch
  Schritt 3: das Feld raenge wird nicht übernommen (Ausbau, docs/02 Z. 141–146)

pruefeFragen(daten) -> Fehlerliste (Validator der Engine quiz-kern)
  Schritt 1: jede Frage hat id, typ (binaer oder wahl), kategorie, aussage oder frage, korrekt, erklaerung
  Schritt 2: typ binaer: korrekt ist ja oder nein; beide Werte kommen in der Bank vor (Test)
  Schritt 3: typ wahl: antworten hat drei Einträge; korrekt ist ein Index von 0 bis 2
  Schritt 4: erklaerung ist nicht leer
  Schritt 5: Liste der Fehler leer; sonst Testfehler

rundeWaehlen(fragen, anzahl = 12, rng) -> Frage[] (neu oder aus quiz-kern, zu prüfen)
  Schritt 1: rng wird als Parameter übergeben
  Schritt 2: anzahl Fragen ohne Wiederholung aus der Bank von 16
  Schritt 3: Reihenfolge über rng mischen

bewerteAntwort(frage, antwort) -> {richtig, erklaerung}
  Schritt 1: richtig = antwort ist gleich frage.korrekt
  Schritt 2: erklaerung wird immer ausgegeben, unabhängig vom Ergebnis
  Schritt 3: kein Punktwert und kein Zähler über die Runde

endeRunde(ergebnisse) -> Anzeige
  Schritt 1: Anzeige enthält nur die Erklärungen der Runde und einen neutralen Abschluss (Eigenentwurf)
  Schritt 2: kein Rang, keine Punkte, keine Anzahl richtiger Antworten, kein Rekord
  Schritt 3: kein Speicherzugriff
```

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Werkzeuge ohne Nutzerdaten speichern nichts. Ist-Stand: Rekord `sug.rekord` im localStorage mit Löschknopf (GDD). Ausbau: Rekord entfernen; Entscheidung A7 in Abschnitt 9.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Ist-Stand: CSP `default-src 'self'` und Netzwerk-Wächter (GDD).
- [ ] Keine Eingabefelder (Projektregel der Vorlage). Ist-Stand: keine Eingabe; die App fragt Wissen, nicht Name, Größe oder Gewicht (GDD).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Ist-Stand: Ränge und Punkte vorhanden (`raenge`, Engine). Verstoß gegen die Regel; der Ausbau entfernt sie.
  Anmerkung 29.10.2026: Nicht mehr zutreffend. Ränge und Punkte sind mit Commit 96a1f89 (27.10.2026) aus Code und Daten entfernt; `test/fragen.test.mjs` prüft, dass `raenge` nicht in den Daten steht. Der Schlüssel `sug.rekord` steht nur noch für die einmalige Entfernung beim Start.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Kein Druck vorgesehen.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50). Ist-Stand: Klassen aus `kinder-ui` (GDD); Messung offen.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ (docs/02 Z. 151–152). Ist-Stand: Der Bildschirm zeigt keine Seitenangabe. Wenn die Quelle je Frage angezeigt wird, gilt die Markierung.
- [ ] Keine Modellnamen in Dateien. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen. Der Katalog verlangt eine vollständige uk/ru-Übersetzung.

## 7. Tests

- `test/fragen.test.mjs` (vorhanden): Prüfung der Fragendaten. Inhalt vor dem Ausbau prüfen; die Engine-Validierung läuft darüber.
- `test/logik.test.mjs` (fehlt, anlegen): Runde mit 12 aus 16 Fragen über den übergebenen rng; bewerteAntwort liefert Erklärung ohne Punkt; endeRunde ohne Rang.
- `test/regeln.test.mjs` (fehlt, anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): keine Felder `raenge`, `punkte` oder `rekord` im Quelltext und in den Daten; keine fremde Adresse; kein localStorage; keine Modellnamen; Knopfhöhe 48 px.

## 8. Abnahme

- `npm test` im Ordner apps/stark-und-gesund grün; Testzahl in README und GDD nennen und prüfen (heute nicht genannt).
- Browser bei 360 px: Knöpfe mindestens 48 px, kein Überlauf, Vorlesen funktioniert, offline nach dem ersten Laden, keine externen Anfragen.
- Keine Ränge, Punkte oder Rekorde auf dem Bildschirm und in den Daten; Speicher gleich null.
- Registrierung nur durch den Koordinator. Die Zahl der speichernden Apps im Impressum ändert sich, wenn der Rekord entfällt.

## 9. Offen

- A7 (quiz-kern): Rekord und Ränge widersprechen den Projektregeln (docs/fragen-und-hinweise.md, A7). Der Index nennt für CON-1 keine Blockade, die App nutzt aber die Engine. Entscheidung: Engine ändern (a) oder App anpassen (b), vor dem Ausbau.
- Katalog verlangt Ränge („Raengen“); docs/02 Z. 141–146 verbietet sie. Katalog-Korrektur nötig.
- Schlaf, Bildschirmpausen, Getränke und Hygiene sind in S. 13–20 nicht belegt (Abschnitt 1). Die Erklärungen nach BZgA und DGE sind Eigenentwurf und nicht geprüft.
- uk/ru-Übersetzung (Katalog): offen.
- Test mit Kindern der Zielgruppe vor dem Release (docs/02 Z. 45–46).
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Zitatgrenze: dieser Bauauftrag nutzt höchstens 6 Wörter (docs/10). A10 fragt, ob 12 gelten sollen (offen).
