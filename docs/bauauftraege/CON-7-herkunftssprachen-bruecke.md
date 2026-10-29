# Bauauftrag CON-7: Herkunftssprachen-Bruecke uk/ru

Status: teilweise · Abschnitt: Content-Pakete, Funktionen, Dokumente · Ziel: Ausbau von `apps/herkunftssprachen-bruecke/`
Blockiert durch: keine (A7 am 27.10.2026 umgesetzt)

Stand 27.10.2026: A7 ist umgesetzt. Der Motor `quiz-kern` speichert nichts und kennt keinen Rekord, keine Punkte und keine Ränge mehr; die Quiz-Apps laufen ohne Wertung durch (Quiz-Durchlauf). Aussagen zu A7 weiter unten stammen aus der Zeit davor.

## 1. Quelle

- Praleska, S. 143 (143–144), Abschnitt „Развіццё беларускага маўлення“ (S. 143), Gruppe „ПОЧЕМУЧКИ“ (S. 144).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Развіццё беларускага маўлення“ (S. 143)
  - „фонематического слуха“ (S. 143)
  - „кошка, ножка, ложка“ (S. 143)
  - „параўнання рускіх і беларускіх слоў“ (S. 144)
- Umschrieben, ohne Anführungszeichen: Die Seiten verlangen, Wörter mit ähnlichem Klang zu vergleichen (S. 143) und die Sprachen Russisch und Belarussisch gegenüberzustellen (S. 144). Verwechslungen ähnlicher Wörter zwischen den beiden Sprachen sollen vermieden werden, und besondere Laute sollen richtig gesprochen werden (S. 144).
- Die Quelle arbeitet mit Russisch und Belarussisch. Der Katalog kehrt die Ausgangslage um: Deutsch als Umgebungssprache, Ukrainisch und Russisch als zu erhaltende Familiensprache (docs/10, Z. 454). Die Umkehrung ist Eigenentwurf.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.
- Katalogeintrag: docs/10, Z. 454 (Herkunftssprachen-Bruecke uk/ru). Zielgruppe Eltern und Kinder 4 bis 7, Typ M, Engine quiz-kern plus mini-i18n.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 8 bis 12 Jahre eigenständig, auch Eltern und Familien mit Herkunftssprache (Bestand: README, GDD). Katalog: Eltern und Kinder 4 bis 7 (docs/10, Z. 454). Die Abweichung steht in Abschnitt 9. Verwendung: Bildschirm, mit Vorlesen.
- Lernziele, prüfbar (Eigenentwurf):
  1. Kind nennt zu einem Brückenwort die deutsche, die russische und die ukrainische Form.
  2. Kind erkennt ein falsches Freundpaar und nennt die deutsche Bedeutung.
  3. Erwachsene findet in `eltern.html`, wie die Herkunftssprache im Alltag genutzt werden kann.

## 3. Funktion

- Bestand (README, GDD): Quiz mit 14 Fällen; eine Runde umfasst 11. Brücken-Wörter (Telefon, Musik, Doktor, Bus) und falsche Freunde (Dom und дом, Familie und фамилия, Angel und ангел, Krawatte und кровать). Kyrillische Wörter mit Transliteration in Klammern, alles vorlesbar. Das Ergebnis zeigt „N von 11 richtig“ und den Rekord (`app.mjs` Z. 30); der Rekord liegt im localStorage unter `herkunft.rekord` (`app.mjs` Z. 17). Der Rang kommt aus `daten/fragen.json` (Feld `raenge`).
- Lücke gegen den Katalog: Parallele Wortkarten de/uk/ru mit Hinweisen zu falschen Freunden (docs/10, Z. 454) gibt es als Karten-Ansicht nicht. Die Inhalte liegen als Quiz vor.
- Ablauf im Bestand: Start mit Vorlesen → Runde mit 11 Fällen → Antwort → Erklärung → Ergebnis mit Punkten, Rekord und Rang.
- Ablauf im Ausbau (Eigenentwurf): Start → Runde → Antwort → Erklärung → Abschluss mit einer Liste der Brücken-Wörter aus der Runde, ohne Punkte und ohne Rang.
- Was gedruckt wird: nichts. Der Katalog verlangt keinen Druck.

## 4. Daten

Datei: `apps/herkunftssprachen-bruecke/daten/fragen.json` (Bestand, Version 1, 14 Fragen). Ausbau: Feld `raenge` entfällt (Abschnitt 6). Neu: Felder `quelle` und `eigenentwurf`. Schema mit einer Beispielzeile:

```json
{ "id": "b01", "typ": "binaer", "kategorie": "Brücken-Wörter", "korrekt": "ja", "quelle": { "seite": "S. 143–144" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
ladeFragen(datei) -> Liste<Frage>
  lies daten/fragen.json
  prüfe je Frage: id, typ in [binaer, wahl], korrekt gesetzt
  prüfe je Frage: quelle.seite vorhanden ODER eigenentwurf == true
  bricht ab bei Fehler; das Feld raenge wird im Ausbau nicht mehr gelesen

waehleRunde(fragen, anzahl, zufall) -> Liste<Frage>
  zufall ist ein Parameter (liefert Zahl von 0 bis 1)
  mische fragen mit mischen(fragen, zufall); nimm die ersten anzahl = 11 Fragen

beantworteFrage(frage, antwort) -> { richtig, erklaerung }
  richtig = (antwort === frage.korrekt)
  gib { richtig, erklaerung: frage.erklaerung } zurück
  kein Zähler im Ausbau (Abschnitt 6)

zeigeAbschluss(runde, antworten) -> Bildschirm
  sammle die Brücken-Wörter aus runde, bei denen antworten[id].richtig == true
  zeige die Liste; ohne Anzahl und ohne Rang
  speichert nichts

rekordEntfernen() -> void
  entferne den Schlüssel herkunft.rekord aus dem localStorage, einmalig beim Start
  (Altwert aus dem Bestand; ohne Fehler, wenn kein Wert vorhanden ist)
```

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Der Bestand speichert den Rekord; der Ausbau speichert nichts und entfernt den Altwert über `rekordEntfernen`.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24; die CSP-Umsetzung ist Eigenentwurf). Der NetzwerkWächter ist im Bestand (README).
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 17–30 begrenzt Datenerhebung und Kommunikation). Antworten per Schaltfläche.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Verstoß im Bestand: Punktzahl und Ergebnissatz (`app.mjs` Z. 30), Rekord (`app.mjs` Z. 17) und Ränge (`daten/fragen.json`, Feld `raenge`). Der Ausbau entfernt alle drei.
  Anmerkung 29.10.2026: Nicht mehr zutreffend für Punktzahl, Ergebnissatz und Ränge: entfernt mit Commit 96a1f89 (27.10.2026); `daten/fragen.json` enthält kein Feld `raenge`. Der Schlüssel `herkunft.rekord` bleibt nur für die einmalige Entfernung beim Start.
- [ ] Druck: nicht vorgesehen. Käme Druck hinzu, gelten docs/02 Z. 79–82.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Diese Einheit druckt nichts. Seitenangaben stehen nur in Abschnitt 1 und in den Daten (A18-Standard).
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: die Inhalte sind vorhanden (Bestand). Die Fassung der Oberfläche in uk und ru ist offen.

## 7. Tests

- `test/fragen.test.mjs` (Bestand) erweitern: jede Frage hat Quelle oder Eigenentwurf-Kennung; nach dem Ausbau kein Feld `raenge`; beantworteFrage liefert kein Punktefeld.
- `test/regeln.test.mjs` (neu, Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Speicher nur über rekordEntfernen; keine Ausgabe mit den Wörtern Punkte, Rang oder Rekord; keine externe Adresse.

## 8. Abnahme

- `node --test apps/herkunftssprachen-bruecke/test/*.test.mjs` grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick, Speicher nach dem Ausbau gleich null, nur `localhost`.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Punkte, Rang und Rekord im Bestand verstoßen gegen docs/02 Z. 141–146. Entscheidung nötig; Empfehlung: entfernen (Abschnitt 6).
- A7 quiz-kern: Die App ist auf quiz-kern gebaut (`package.json`). Der Index führt für CON-7 keine Blockade. Der Koordinator prüft, ob A7 diese App betrifft; der Rekord und die Ränge kommen aus dem Motor (packages/quiz-kern/src/quiz.mjs, Z. 252–255).
- Altersgruppe: Katalog Kinder 4 bis 7 und Eltern (docs/10, Z. 454) gegen App 8 bis 12 (README, GDD). Entscheidung nötig.
- Wortkarten de/uk/ru aus dem Katalog fehlen als Ansicht. Entscheidung, ob sie gebaut werden.
- A18 Seitenangaben: Standard (Vorschlag) ist, dass keine Seitenzahl auf dem Bildschirm steht; die Daten tragen `quelle`.
- Nach einer Änderung stimmen Testzahl in README und GDD neu.
