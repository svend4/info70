# Bauauftrag GEM-3: Klang-Detektive (Weiterführung ab 3)

Status: teilweise · Abschnitt: Gemeinsame Apps 3–5 · Ziel: Ausbau von apps/klang-detektive
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 81 (81), Abschnitt „Развиваемся в деятельности“ (S. 81, Kopfzeile der Seite), Gruppe „Малыши“ (S. 80). Auf S. 81 steht kein Gruppenkopf. Die Nachbarseiten S. 80 und S. 82 nennen die Gruppe „Малыши“.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Развиваемся в деятельности“ (S. 81)
  - „звуковысотный, тембровый, динамический слух“ (S. 81)
  - „музыкально-ритмическое чувство“ (S. 81)
  - „третьего года жизни“ (S. 81)
  - „Малыши“ (S. 80)
- Inhalt in eigenen Worten (S. 81): Ziele für das dritte Lebensjahr sind das Hören von Tonhöhe, Klangfarbe und Lautstärke sowie ein musikalisch-rhythmisches Gefühl. Musikalisches Spiel und Spielbilder dienen als Mittel.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Faktenstand laut index.json: nur Katalogtext. Für diesen Auftrag wurde gegen die Textkopie geprüft.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 3 bis 5 nur zusammen mit einem Erwachsenen, kurze Sitzungen (docs/10, Katalogeintrag; README). Verwendung: Bildschirm.
- Lernziele, prüfbar (Eigenentwurf; die Hörziele stehen auf S. 81):
  1. Kind unterscheidet hohe und tiefe Töne.
  2. Kind unterscheidet laute und leise sowie schnelle und langsame Klänge.
  3. Kind unterscheidet zwei Instrumente am Klang. Diese Frage ist noch nicht gebaut (Abschnitt 9).

## 3. Funktion

- Bildschirme: Start mit Hinweis zum Gehörschutz. Rätsel mit einer Schaltfläche zum Anhören des Klangs (beliebig oft), der Antwortauswahl und einer Auflösung mit Erklärung und erneutem Hören. Abschluss mit Punkten, Rang und Rekord.
- Ablauf: Start → 8 Rätsel aus 12 (gemischt) → Klang anhören → Antwort → Auflösung mit Vorlesen → Abschluss.
- Ist-Stand (README, GDD): Klänge werden im Browser per WebAudio synthetisiert. Fünf Merkmale: höher oder tiefer, lauter oder leiser, schneller oder langsamer, aufwärts oder abwärts, weich oder scharf. 12 Fragen. Rang und Rekord. Vorlesen. Keine externen Audiodateien.
- Der Katalog verlangt (docs/10, Z. 309): kurzes gemeinsames Hör-Quiz mit Hoch und Tief, Schnell und Langsam, Laut und Leise, welches Instrument. Sitzungen höchstens 5 Minuten. Vorlese-Audio. Klänge selbst erzeugt. Mini-i18n de, uk, ru.
- Lücken: Die Instrumentenfrage fehlt. Die Zeitgrenze von 5 Minuten ist nicht umgesetzt. uk und ru fehlen. Rang und Rekord widersprechen docs/02. Siehe Abschnitt 9.
- Druck: nicht vorgesehen.

## 4. Daten

Datei: `apps/klang-detektive/daten/fragen.json` (vorhanden). Die Felder quelle und eigenentwurf fehlen bisher. Schema mit einer Beispielzeile:

```json
{ "id": "hoeren-hoch-tief-01", "titel": "Hoch oder tief", "quelle": { "seite": "S. 81" }, "eigenentwurf": true }
```

## 5. Pseudocode

Vorhanden in logik.mjs: pruefeFragen, erwarteteAntwort, rangFuer. Alle anderen Funktionen sind (Eigenentwurf).

```
pruefeFragen(fragen: Frage[]) -> Fehler[]
  korrekte Antwort == erwarteteAntwort(klang, merkmal) und Wortlaut stimmt überein
  alle fünf Merkmale kommen vor

erwarteteAntwort(klang: {tonhoehe, lautstaerke, tempo, verlauf, wellenform}, merkmal) -> "A" | "B"
  Polarität je Merkmal: höher, lauter, schneller, aufwärts, weich

instrumentFrage(klangfarben: {name, wellenform}[], zufallsReihe: Zahl[]) -> Frage
  wenn weniger als 2 Klangfarben mit verschiedener wellenform: Fehler "nicht unterscheidbar"
  klang = klangfarben[zufallsReihe[0] mod Länge(klangfarben)]
  optionen = alle Namen, gemischt nach zufallsReihe[1..]
  -> {klang: klang.wellenform, optionen, richtig: klang.name}

pruefeSitzung(dauerSekunden: Zahl, grenzeSekunden: 300) -> Hinweis | null
  wenn dauerSekunden > grenzeSekunden: Hinweis für den Erwachsenen, Runde kürzen
  -> Hinweistext oder null
```

Die Zufallsreihe kommt als Parameter. Die Logikdatei enthält keine Zufallsquelle.

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Ist-Stand: Rekord `klang.rekord` in localStorage (app.mjs Z. 100, 147–148). Abweichung, siehe Abschnitt 9.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Ist-Stand: NetzwerkWaechter laut README. Abruf nur lokal (daten/fragen.json). Klänge per WebAudio.
- [ ] Keine Eingabefelder (Projektregel). Ist-Stand: Bedienung über Schaltflächen laut README.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Ist-Stand: Punkte, Rang und Rekord (README, rangFuer). Abweichung, siehe Abschnitt 9.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Nicht zutreffend.
- [ ] Mobile First 360 px; Knöpfe mindestens 48 px (docs/02 Z. 50). In diesem Auftrag nicht gemessen.
- [ ] Lernziele in der README als Liste (docs/02 Z. 42–43). Ist-Stand: nicht als Liste vorhanden.
- [ ] Vorlesen (docs/02 Z. 44). Ist-Stand: vorhanden laut README. Für gehörlose Kinder ungeeignet, das steht in der Eltern-Information.
- [ ] Pflichtmarkierung: Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft. (docs/02 Z. 151–152)
- [ ] Keine Modellnamen in Dateien. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen.

## 7. Tests

- `test/logik.test.mjs` (vorhanden, GDD Abschnitt 6): Fragenbank selbstkonsistent (pruefeFragen, korrekte Antwort aus den Parametern und aus dem Wortlaut). Alle fünf Merkmale vertreten. erwarteteAntwort beachtet die Polarität. Inkonsistenz wird erkannt. rangFuer.
- Neu: instrumentFrage (gleiche Wellenform ergibt Fehler, gleiche Zufallsreihe ergibt gleiche Frage), pruefeSitzung (Grenze 300 Sekunden).
- `test/regeln.test.mjs` (neu, nach Vorlage apps/puppentheater-werkstatt/test/regeln.test.mjs): kein Speicheraufruf; keine Anzeige von Punkten, Rang oder Rekord in Kindertexten (nach Entscheidung in Abschnitt 9); kein Abruf außerhalb von daten/.

## 8. Abnahme

- `npm test` im App-Ordner grün. Testzahl in README und GDD stimmt (docs/02 Z. 110–111).
- Browser bei 360 px: kein Überlauf, Fokus nach Klick, Klang ist hörbar, Gehörschutz-Hinweis sichtbar.
- Test mit Kindern von 3 bis 5 Jahren zusammen mit einem Erwachsenen (docs/02 Z. 45–46).
- Registrierung nur durch den Koordinator.

## 9. Offen

- Instrumentenfrage (Katalog: welches Instrument?) fehlt. GDD Abschnitt 7 nennt Klangfarbe als Erweiterung. Entscheidung: Ausbau.
- Zeitgrenze von 5 Minuten (docs/10 Z. 309) ist nicht umgesetzt. Rundenlänge prüfen.
- Punkte, Rang, Rekord und localStorage (klang.rekord) stehen gegen docs/02 Z. 141–146 und gegen die Vorlage. docs/02 Z. 25–26 erlaubt localStorage mit Löschknopf. Entscheidung offen.
- uk- und ru-Vorlesen und Begriffe (mini-i18n) fehlen.
- Katalog: docs/10 hat zwei Einträge „Klang-Detektive“ (Z. 309 Weiterführung ab 3, Alter 3–5; Z. 321 Hör-Quiz, Alter 4–6). Dieser Auftrag folgt dem Eintrag Weiterführung ab 3 (Index GEM-3). Die Koordination klärt, ob beide Einträge dieselbe App meinen.
- Daten: fragen.json ohne Felder quelle und eigenentwurf.
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt. Sie stehen in Abschnitt 1 und in den Daten als quelle. Hier notiert.
- Seitenangaben ohne Markierung „проверено человеком“ (A18, docs/02 Z. 151–152).
- Die Quelle beschreibt das dritte Lebensjahr (S. 81). Die Altersgrenze 3 bis 5 ist Eigenentwurf des Katalogs.
