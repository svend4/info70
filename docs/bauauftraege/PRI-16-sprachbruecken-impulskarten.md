# Bauauftrag PRI-16: Sprachbruecken: Gespraechs-Impulskarten mehrsprachig

Status: teilweise · Abschnitt: Printmaterialien Kita · Ziel: Ausbau von apps/sprachbruecken-impulskarten
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 139 (139–140), Abschnitt „ОБЩЕНИЕ И РЕЧЬ“ (S. 139), Gruppe „Почемучки“ (S. 140).
- Katalog: docs/10, Zeile 488, Abschnitt Printmaterialien Kita, Nr. 16. Der Katalog nennt S. 139–140 und die Formulierung der Kommunikations- und Sprach-Lernziele.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „ОБЩЕНИЕ И РЕЧЬ“ (S. 139)
  - „Развитие общения“ (S. 139)
  - „детские вопросы“ (S. 139)
  - „Развитие речи“ (S. 140)
  - „мимика, жесты“ (S. 140)
  - „формулами белорусского этикета“ (S. 140)
  - „Почемучки“ (S. 140)
- Umschrieben, ohne Anführungszeichen: Die Quelle nennt Gesprächsanlässe: Fragen zur Lebensweise von Tieren, zu Naturerscheinungen und zu Maschinen (S. 139). Nonverbale Mittel wie Mimik und Gesten sollen die Kinder einsetzen lernen (S. 140). Das Ziel, außerhalb der Situation persönlich zu sprechen (Beispiele: Motive literarischer Figuren, Erleben anderer Menschen), ist im Quelltext mit Stern markiert, also als Aufgabe für ältere Kinder (S. 139).
- Quellenbefund: Die Quelle zielt auf erste Gesprächsfertigkeiten auf Belarussisch (S. 140). Deutsch, Ukrainisch und Russisch sind im Quelltext nicht vorgesehen; die Mehrsprachigkeit ist Katalog-Adaption (Eigenentwurf).
- Quellenbefund: Die Situationen (Ankommen, Essen, Anziehen, Spielen, Draußen, Trösten, Abschied) und die Formeln in de/uk/ru sind Eigenentwurf nach dem Katalog. Die 16 Lernziele aus dem Katalog sind nicht nachgezählt.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet: die Situationen, die Sätze in Deutsch, Ukrainisch und Russisch, die Aussprachehilfen, die Praxis-Tipps, die Impulsfragen.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte im Kita-Team; Kinder 3 bis 5 Jahre (Katalog, docs/10 Zeile 488; Quelle: Gruppe „Почемучки“, S. 6: drei bis fünf Jahre). Verwendung: Druck. Der Bildschirm dient der Auswahl durch die Fachkraft. Es gibt keinen Kinderbildschirm.
- Lernziele, prüfbar:
  1. Die Fachkraft wählt eine Alltagssituation und druckt die Impulskarten mit deutschem Satz, ukrainischer und russischer Fassung (Eigenentwurf).
  2. Die Fachkraft stellt eine offene Frage von der Karte. Sie wartet die Antwort ab und greift sie auf (Eigenentwurf nach S. 139: Fragen der Kinder anregen).
  3. Die Fachkraft bewertet die Antwort des Kindes nicht. Es gibt keine richtige oder falsche Antwort (docs/02 Z. 141–146).

## 3. Funktion

- Bildschirme oder Blätter: Bildschirm für die Fachkraft mit der Auswahl der Situation, Vorschau und Druckknopf. Blatt: eine Impulskarte je Blatt A4 hoch.
- Stand der App (laut ihrer README und Daten): sieben Situationen, 14 Karten mit deutschem Satz, ukrainischer und russischer Fassung und lateinischer Aussprachehilfe, je Situation ein Praxis-Tipp, Filter, Druck und Vorlesetext. Die App speichert nichts.
- Lücke gegenüber dem Katalog: Keine Gefühle-Karten (Mimik und Gesten), keine Warum-Fragen-Runden, keine Gesprächskarten zu Geschichtenfiguren. Die vorhandenen Karten sind Sätze, keine Impulsfragen.
- Ablauf: Situation wählen → Karten drucken → an der Situation aufhängen (Garderobe, Esstisch, Bauecke) → vorlesen oder sagen (Eigenentwurf).
- Was gedruckt wird: Situation mit Praxis-Tipp (Eigenentwurf), deutscher Satz groß, ukrainische und russische Fassung mit lateinischer Aussprachehilfe, eine Impulsfrage (Eigenentwurf, neu zu bauen), Pflichtmarkierung nach Abschnitt 6. Seitenzahlen stehen nicht auf dem Blatt (A18, Abschnitt 9).

## 4. Daten

Datei: `apps/sprachbruecken-impulskarten/daten/karten.json` (vorhanden). Bestehende Felder bleiben: `situationen` mit `id`, `emoji`, `name`, `tipp`; `karten` mit `id`, `situation`, `de`, `uk`, `ukLat`, `ru`, `ruLat`. Neue Impulsfragen als Schema mit einer Beispielzeile:

```json
{ "id": "f01", "situation": "<id aus situationen>", "art": "warum", "frage": "…", "quelle": { "seite": "S. 139" }, "eigenentwurf": true }
```

Pflicht für neue Einträge: `art` in {warum, gefuehl, geschichte}; `quelle.seite` S. 139 oder S. 140; `eigenentwurf: true`.

## 5. Pseudocode

```
pruefeKarten(daten) -> Fehler[]                     (vorhanden)
  Schrift in beide Richtungen: uk nur kyrillisch, ukLat nur lateinisch; ru und ruLat entsprechend
kartenFuer(daten, situationId) -> Karte[]           (vorhanden)
  situationId null -> alle 14 Karten
vorleseText(karte) -> Text                          (vorhanden)
pruefeImpulse(daten) -> Fehler[]                    (neu, Eigenentwurf)
  art in {"warum", "gefuehl", "geschichte"}; sonst FEHLER_ART
  quelle.seite in {"S. 139", "S. 140"}; sonst FEHLER_QUELLE
  frage enthaelt keines der Woerter richtig, falsch, gut, schlecht; sonst FEHLER_WERTUNG (docs/02 Z. 141–146)
impulseFuer(daten, situationId, art) -> Frage[]     (neu)
  filtert nach situation und art; leere Liste ist kein Fehler, sondern ein Hinweis
```

Keine Zufallsquelle nötig. Die Reihenfolge der Impulse folgt der Reihenfolge in den Daten.

## 6. Regeln (docs/02)

- [ ] Speicherung: keine. Die App speichert nichts; die Regel docs/02, Z. 25 (localStorage mit Löschknopf) gilt nur für Nutzerdaten. Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen (docs/02 Z. 22–24). CSP `default-src 'self'` ist Eigenentwurf der Apps; docs/02 verlangt nur das Verbot externer Anfragen.
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 19–20 schließt Konten und personenbezogene Daten aus).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Die App hat Emojis in den Situationsnamen; Prüfung auf dem Druck offen (Abschnitt 9).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung (Einheit mit Seitenangaben), auf jeder gedruckten Karte: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: vorhanden als Kartentexte; Prüfung durch Muttersprachler offen.

## 7. Tests

- `test/logik.test.mjs`: vorhandene Prüfungen bleiben (Bank, Schrift in beide Richtungen, Situationen, Praxis-Tipps, Filter, Vorlesetext). Neu: `pruefeImpulse` lehnt unbekannte `art` und Wertungswörter ab; `impulseFuer` filtert nach Situation und Art.
- `test/regeln.test.mjs`: Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, keine Anfrage außer localhost.
- Druck: Zahl gedruckter Karten gleich Auswahl; keine Zeichen; Pflichtmarkierung je Karte; Emojis nicht auf dem Blatt.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Lücke: Gefühle-Karten, Warum-Fragen-Runden und Gesprächskarten zu Geschichtenfiguren fehlen. Entscheidung: Ausbau der App oder neue Kartei.
- Sprache: Die Quelle nennt Belarussisch (S. 139–140), die App arbeitet mit Deutsch, Ukrainisch und Russisch. Entscheidung der Redaktion, wie der Katalog-Ansatz übernommen wird.
- Übersetzungen uk und ru: Prüfung durch Muttersprachler offen. Die Aussprachehilfe ist eine Annäherung, wie die App selbst sagt.
- Emojis: Die App stellt die Situationen mit Emoji dar (app.mjs, Zeilen 21 und 46). Ob sie auf dem Druck erscheinen, ist nicht geprüft.
- Zahl 16 aus dem Katalog: nicht nachgezählt.
- Stern-Markierung: Das Gesprächsziel mit Motiven literarischer Figuren ist für ältere Kinder markiert (S. 139). Die Geschichtenfiguren-Karten sind deshalb für die Gruppe 3 bis 5 nur eingeschränkt belegt; Entscheidung der Redaktion.
- Standard für Seitenangaben (A18, offen): Auf dem Blatt stehen keine Seitenzahlen; die Seiten stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18; docs/02 Z. 151–152).
- Vorlesefunktion (F2): Die App hat einen Vorlesetext. Die Regel für Fachkraft-Werkzeuge ist offen.
- Favicon (A3).
