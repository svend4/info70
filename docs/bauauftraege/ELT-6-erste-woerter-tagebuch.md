# Bauauftrag ELT-6: Erste-Woerter-Tagebuch

Status: teilweise · Abschnitt: Eltern-Werkzeuge · Ziel: Ausbau von apps/erste-woerter-tagebuch
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 29 (29–39), Abschnitte „ОБЩЕНИЕ И РЕЧЬ“ (S. 37) und die Entwicklungscharakteristik des ersten Lebensjahrs (S. 29), Gruppe „МАЛЮТКИ“ (S. 38).
- Katalogeintrag: docs/10, Zeile 359, Eintrag Erste-Woerter-Tagebuch.
- Faktenstand laut index.json: faktengeprüft.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „ОБЩЕНИЕ И РЕЧЬ“ (S. 37): Abschnitt Kommunikation und Sprache.
  - „гуканье“ (S. 29): vokale Laute im ersten Halbjahr.
  - „гуление“ (S. 29): gezogene Laute im ersten Halbjahr.
  - „лепет“ (S. 29): Lallen im zweiten Halbjahr.
  - „первые слова“ (S. 29): erste Wörter, die Quelle nennt 4 bis 20.
  - „гуления“ (S. 38): dieselben Laute in anderer Reihenfolge. Die Quelle ordnet also an zwei Stellen unterschiedlich (S. 29 und S. 38).
  - „гуканья“ (S. 38): wie oben, in anderer Reihenfolge.
  - „фонематический слух“ (S. 39): Gehör für Laute als Ziel im dritten Zeitraum.
- Keine ganzen Sätze aus dem Buch. Sätze werden ohne Anführungszeichen umschrieben und mit Seitenangabe belegt: Die Quelle beschreibt das Sprechen des Kindes als Verbindung von Gurren, Lallen und ersten Wörtern (S. 29, S. 39).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet, etwa die deutsche Bezeichnung Lallmonolog und die Gliederung nach Lautarten.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Eltern von Kindern 0–2 (Katalog). Verwendung: Bildschirm und Datei-Export. Nur für Eltern, nicht für Kindertagespflege und Krippe (GDD Abschnitt 4).
- Lernziele, prüfbar:
  1. Erwachsener hält fest, was das Kind gesagt hat, in welcher Sprache und wobei; die App zählt nicht (Eigenentwurf; Bezug „первые слова“ (S. 29)).
  2. Erwachsener sieht die Einträge nach Lautart und nach Sprache getrennt, ohne Summe über die Sprachen (Eigenentwurf; Abweichung Welle 79).
  3. Erwachsener erfährt, dass die Lautarten keine feste Reihenfolge sind (Befund zur Quelle, siehe Abschnitt 1).

## 3. Funktion

- Bildschirme oder Blätter: Eingabe eines Eintrags (Laut, gemeint, Sprache, Art, wo, Datum), Liste nach Datum, Ansicht nach Art, Ansicht nach Sprache, Export als Datei und Text, Import einer Datei, Löschen. Druckansicht mit Rohliste und Hinweis (GDD Abschnitt 7, druck.css vorhanden).
- Ablauf: Eintrag erfassen → baueEintrag(...) → Speichern-Knopf → Ansichten (nachDatum, nachArt, nachSprache) → Export (exportText, packe) oder Import (pruefePaket, vereinige).
- Was gedruckt wird: Rohliste chronologisch mit Hinweis, ohne Zählung und ohne Bewertung.
- Bestand laut README und GDD: Eingabe mit Feldgrenzen (MAX_LAUT 60, MAX_GEMEINT 60, MAX_SPRACHE 30, MAX_WO 80), zehn Lautarten (ARTEN), getrennte Sprachen, Export und Import.
- Lücken laut Befund (Ausbau):
  - Meilenstein-Ansicht als Zählung ist nicht gebaut. Das ist eine Entscheidung aus Welle 79, keine Lücke im Bau.
  - Gesamtwortschatz über alle Sprachen als Zahl ist nicht gebaut. Die Quelle nennt dazu keine belastbare Summierung; die App sagt es als Satz.
  - Vorlesen der Einträge fehlt (GDD Abschnitt 8); Rahmentexte werden vorgelesen.
  - uk und ru fehlen als Kartentexte.

## 4. Daten

Datei: `apps/erste-woerter-tagebuch/daten/tagebuch.json`. Vorhandene Schlüssel: hinweis, wasEsIst, keinScreening, keineZahl, keinAlter, keinStufenmodell, mehrsprachig, keineSumme, nurEltern, speicherGrenzen, speichernAufKnopf, ueberDritte, tastaturHinweis, fragebogen, export, arten, quelle. Die Lautarten sind schreien, gurren, quietschen, lallen, lallen-kanonisch, lallen-variierend, lallmonolog, lautmalerei, wort, zwei-woerter. Schema mit einer Beispielzeile für neue Art-Einträge:

```json
{ "id": "gurren", "titel": "Gurren", "quelle": { "seite": "S. 29" }, "eigenentwurf": true }
```

Die deutschen Bezeichnungen sind Übersetzungen der Quellbegriffe und daher `eigenentwurf: true`. Die Seitenangabe gilt für den Quellbegriff.

## 5. Pseudocode

```
baueEintrag({laut, gemeint, sprache, art, wo, datum}) -> Eintrag oder Fehler
  laut: Pflicht, Länge höchstens MAX_LAUT (60)
  gemeint: optional, Länge höchstens MAX_GEMEINT (60)
  sprache: Länge höchstens MAX_SPRACHE (30)
  art: muss in ARTEN stehen, sonst Fehler
  wo: optional, Länge höchstens MAX_WO (80)
  datum: Pflicht, wird vom Aufrufer übergeben, nicht aus dem Systemzeitpunkt gelesen
  Rückgabe: { id, laut, gemeint, sprache, art, wo, datum }

istEintrag(x) -> bool
  prüft Form und Feldgrenzen

nachDatum(eintraege) -> Liste, aufsteigend nach datum

nachArt(daten, eintraege) -> Gruppen je Art aus ARTEN
  leere Art bleibt sichtbar mit Hinweis, dass nichts eingetragen ist (Eigenentwurf)

nachSprache(eintraege) -> Gruppen je sprache, ohne Summe

exportText(daten, eintraege, stand) -> Text
  stand wird als Parameter übergeben
  enthält keine Zählwerte und keine Altersangabe (Test)

packe(eintraege) -> Dateiinhalt (JSON-Text)

pruefePaket(rohtext) -> { ok, eintraege, fehler }
  prüft Form, Feldgrenzen und ARTEN; Datumsfelder mit Monatsangabe werden verworfen

vereinige(alt, neu) -> Liste ohne doppelte id

pruefeDaten(daten) -> Liste der Fehler
  kein Text enthält ZAHL_MIT_ALTER, BEWERTUNG oder ZWECK_KIPPT (Regex in logik.mjs)
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Befund: die App speichert auf Knopfdruck im localStorage unter dem Schlüssel ewt.eintraege (app.mjs Zeilen 40, 52–53). Konflikt, siehe 9. Offen.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Befund: Export als Datei lokal; Prüfung in der Abnahme.
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Befund: Eingabefelder für Laut, gemeint, Sprache, Art, wo und Datum (app.mjs Zeilen 94–112) sowie Dateiauswahl für den Import (Zeile 197). Konflikt, siehe 9. Offen.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Befund: Sperrmuster für Bewertung und Altersangabe in logik.mjs (Zeilen 46–49, 56).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Prüfen an der Druckfassung.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung: Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden): Einträge und Feldgrenzen, Sperrmuster für Zählung, Alter und Bewertung, Ansichten nach Datum, Art und Sprache, Export und Import, Zusammenführung. Ausbau: Prüfung, dass exportText keine Summe und keine Zählung enthält.
- `test/regeln.test.mjs` (neu, nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Druck, Namenszeile, Eingabemuster.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein horizontaler Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick, nur localhost.
- Speicher: gleich null, wenn die Speicherfrage (9. Offen) zugunsten keiner Speicherung entschieden ist; sonst nur der eine Schlüssel ewt.eintraege, und nur nach Knopfdruck.
- Druck: Rohliste mit Hinweis; keine Zeichen; Pflichtmarkierung auf jeder gedruckten Seite.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Konflikt Speicherung: docs/02 Zeile 25 erlaubt localStorage für Nutzerdaten mit Löschknopf. Diese Vorlage und die Sitzungsanleitung verbieten Speichern. Ein Tagebuch braucht Speicherung, daher ist eine Entscheidung vor dem Ausbau nötig.
- Konflikt Eingabefelder: ein Tagebuch braucht Eingabe. Die Projektregel verbietet Eingabefelder. Entscheidung, ob die Regel für diese Eltern-App gilt.
- Gesamtwortschatz über alle Sprachen: fachlich nicht entschieden (zwei konkurrierende Verfahren). Entscheidung, ob eine Summe je erstellt wird.
- Meilenstein-Ansicht als Zählung: bewusst nicht gebaut (Welle 79). Bestätigung offen.
- Kartentexte uk und ru: offen.
- Vorlesen der Einträge: nicht gebaut (GDD Abschnitt 8); Vorlesefunktion (F2) offen.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard für neue Apps: keine Seitenzahl auf dem Druckblatt; Seitenangaben stehen in Abschnitt 1 und in den Daten im Feld quelle.
- Favicon (A3).
- Offline-Test (F4): Neuladen ohne Netz wird berichtet, ist aber keine Abnahmebedingung.
