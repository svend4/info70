# Bauauftrag ELT-15: Kunst-Gucken: Bilderbuch-Dialog-Guide

Status: teilweise · Abschnitt: Eltern-Werkzeuge · Ziel: Ausbau von apps/kunst-gucken/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 88 (88–89), Abschnitt „Восприятие искусства“ (S. 89) im Kapitel „Ознакомление с изобразительным искусством“ (S. 88), Gruppe „МАЛЫШИ“ (S. 88).
- Katalogeintrag: docs/10, Zeile 384, Eintrag Kunst-Gucken: Bilderbuch-Dialog-Guide.
- Faktenstand laut index.json: faktengeprüft.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Ознакомление с изобразительным искусством“ (S. 88): Oberkapitel.
  - „Восприятие искусства“ (S. 89): Unterabschnitt, Grundlage dieser Einheit.
  - „средства художественной выразительности“ (S. 89): Mittel der Ausdruckskraft; die Quelle zaehlt sie in einer Aufzaehlung auf (Farbe, Form, Teile, Material, Klang).
  - „Рекомендуемые произведения искусства“ (S. 89): Empfehlungsliste der Quelle, in der App nicht uebernommen (keine Titel).
  - „Книжная графика“ (S. 89): Buchgrafik; in der App als Buchart uebernommen.
  - „Народное декоративно-прикладное искусство“ (S. 89): Volkskunst; in der App mit Holz- und Tonspielzeug.
  - „глиняные свистульки“ (S. 89): Tonpfeifen der Quelle; in der App durch einen Becher aus Ton ersetzt (Sicherheit, Abschnitt 3).
  - „внутреннего мира детей“ (S. 88): Ziel 6 der Quelle; in der App ausdruecklich zurueckgewiesen.
  - „Рисование“ (S. 89): eigenes Malen der Kinder; ein anderer Unterabschnitt, nicht Teil dieser Einheit.
  - „МАЛЫШИ“ (S. 88): Gruppe der Quelle.
- Die Quelle nennt 13 Ziele: sieben allgemeine (S. 88) und sechs zur Wahrnehmung (S. 89).
- Keine ganzen Saetze aus dem Buch. Saetze werden ohne Anfuehrungszeichen umschrieben und mit Seitenangabe belegt: Die Quelle nennt die Mittel der Ausdruckskraft als Aufzaehlung (S. 89).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet. Dazu gehoeren die Gliederung in fuenf Achsen (die Quelle nennt die Mittel in einer Aufzaehlung; die App gliedert sie in fuenf Achsen, Feld fuenfteilung), die drei Impulse je Achse, die fuenf Gegenstandstypen mit ihren Fundorten und die Sicherheitshinweise.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Eltern und Kindertagespflege, Kinder von 1 bis 3 Jahren. Verwendung: beides (Bildschirm fuer den Erwachsenen; Druck als Blatt mit allen fuenf Achsen).
- Lernziele, prüfbar:
  1. Erwachsener findet zu jeder Achse (Farbe, Form, Teile, Material, Klang) drei Feststellungen zum Anfangen, ohne Frage und ohne Pruefung (Eigenentwurf; Grundlage: „средства художественной выразительности“ (S. 89)).
  2. Erwachsener waehlt einen Gegenstand (Bilderbuchseite, Holzfigur, Ton, Stoff, Kachel) und weiss, wo er ihn ohne Geld findet (Eigenentwurf; Grundlage: „Народное декоративно-прикладное искусство“ (S. 89)).
  3. Erwachsener weiss, dass das Blatt nichts speichert und kein Urteil ueber das Kind enthaelt. Das Ziel „внутреннего мира детей“ (S. 88) ist ausdruecklich zurueckgewiesen (Eigenentwurf).

## 3. Funktion

- Bildschirme oder Blaetter: Startseite mit Hinweis (Geraet in der Hand, Gegenstand auf dem Tisch); Auswahl des Gegenstands (fuenf Typen, je mit Fundort ohne Geld und Sicherheitshinweis); fuenf aufklappbare Achsen mit Hinweis „worauf“, drei Impulsen und einer Grenze; Vorlesen nur mit lokaler Stimme; Druckblatt.
- Ablauf: Gegenstand waehlen (waehlerKnopf) → Achse aufklappen (achsenKarte) → Impulse lesen oder vorlesen (vorleseKnopf) → drucken: blatt(daten) zeigt alle fuenf Achsen offen.
- Was gedruckt wird: ein Blatt mit fuenf Achsen, Impulse in 13 pt, ohne Namenszeile, Haken oder Stern (druck.css; GDD Abschnitt 6).
- Luecken laut Befund (Ausbau):
  - Die kuratierte Buchliste des Katalogs: nicht gebaut. Die App nennt Buchtypen, keine Titel (keineBuchliste).
  - Die uk/ru-Buchtipps des Katalogs: entfallen mit der Titelliste (keineBuchliste).
  - Der Verweis auf eine bestimmte Stiftung: nicht gebaut. Genannt wird nur die Einrichtungsart, die Buecher ohne Geld abgibt (GDD Abschnitt 5, Punkt 8).
  - Die Ton-Vogelpfeifen des Katalogs: durch einen Becher aus Ton ersetzt. Eine Pfeife geht in den Mund und ist damit Spielzeug (Spielzeug-Check U3).
  - Ziel 6 der Quelle: zurueckgewiesen und in der App begruendet.

## 4. Daten

Datei: `apps/kunst-gucken/daten/achsen.json`. Listen: achsen (5), gegenstaende (5), regeln (3), ziele (13), ausgeschlossen (8). Seitenangabe im Feld `quelle.werk` (S. 88–89). Schema mit einer Beispielzeile (Feldnamen wie in der Datei):

```json
{ "gruppe": "wahrnehmung", "nr": 1, "kurz": "…", "einordnung": "gebaut", "belegtDurch": ["…"] }
```

## 5. Pseudocode

```
pruefeDaten(daten) -> Liste der Fehler (leer = gueltig)
  achsen: genau 5 Eintraege in der Reihenfolge Farbe, Form, Teile, Material, Klang (fuenfteilung)
  impulse: je Achse genau 3; kein Impuls mit Fragezeichen (ABFRAGE); kein Urteil ueber die Antwort des Kindes (PRUEFURTEIL)
  ziele: 13 Eintraege (allgemein 7, wahrnehmung 6); jede Einordnung genau einmal
  Bilanz: 5 gebaut, 2 alsGanzes, 1 ausgeschlossen, 5 anderesThema; Abweichungsnotiz nennt dieselben Zahlen
  ziel nr 6 (innere Welt): einordnung ausgeschlossen; der Text nennt die Deutung (DEUTUNG)
  gegenstaende: jede Achse ist bei mindestens einem Gegenstand stark (starkeAchsen)
  NICHT_GEPRUEFT: nur benannte Ausnahmen; WERK_ODER_URHEBER und MARKE_ODER_QUELLE treffen keine Titel

achseVon(daten, achsenId) -> Achse
gegenstandVon(daten, id) -> Gegenstand
alleImpulse(daten) -> Liste der 15 Impulse (Eingabe fuer die ABFRAGE-Pruefung)
angebotsTexte(daten) -> Liste aller geprueften Angebotstexte
blatt(daten) -> Text
  alle fuenf Achsen offen; Impulse in 13 pt; keine Namenszeile; keine Speicherung
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Befund: kein localStorage und kein Schluessel in app.mjs und logik.mjs; ein Test prueft das (GDD Abschnitt 5.6).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Befund: CSP-Meta in index.html, Zeile 6; app.mjs laedt nur daten/achsen.json (Zeile 18).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Befund: kein `<input>`.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Befund: keine Abfrage, kein Urteil, keine Stufe; Netze ABFRAGE, PRUEFURTEIL, DEUTUNG, EINSTUFUNG.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Befund: druck.css ohne Haken, Stern und Namenszeile (GDD Abschnitt 6); Pruefung offen (test/regeln.test.mjs, neu).
- [ ] Mobile First 360 px; Knoepfe und Fusslink mindestens 48 px (docs/02 Z. 50). Befund: GDD Abschnitt 7 nennt 48 px als Ziel und zugleich „gemessen: kein Knopf unter 44 px“. Das belegt die Einhaltung nicht; nachmessen (Abschnitt 9).
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Befund: Seitenangaben in Abschnitt 1 und im Feld quelle; Markierung auf dem Druckblatt noch einzubauen.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt). Befund: die uk/ru-Buchtipps entfallen (keineBuchliste).

## 7. Tests

- `test/logik.test.mjs` (vorhanden, 26 Tests): Impulse ohne Abfrage, kein Urteil ueber Antworten, Deutung in beide Richtungen, Bilanz der 13 Ziele mit Abweichungsnotiz, Reihenfolge der Achsen, starke Achse je Achse, keine Speicherung; jede Netzpruefung mit Gegenprobe.
- `test/regeln.test.mjs` (neu, nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Druck ohne Zeichen, Namenszeile und Haken; kein externer Request; kein `<input>`.

## 8. Abnahme

- `npm test` im App-Ordner gruen; Testzahl 26 in README und GDD stimmt.
- Browser bei 360 px: kein horizontaler Ueberlauf, Knoepfe mindestens 48 px (nachmessen), Fokus nach Klick, Speicher leer, nur localhost.
- Druck: fuenf Achsen offen, 13 pt, keine Namenszeile, keine Zeichen; Pflichtmarkierung auf dem Blatt.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Kuratierte Buchliste (Katalog): nicht gebaut; die App nennt Buchtypen. Entscheidung, ob der Katalogeintrag angepasst wird.
- Ton-Vogelpfeifen (Katalog): durch einen Becher aus Ton ersetzt. Entscheidung, ob der Katalogeintrag angepasst wird.
- Stiftungsbezug und uk/ru-Buchtipps (Katalog): entfallen. Entscheidung, ob ein Herkunftssprachen-Angebot anders gebaut wird.
- Die fuenf Achsen sind Eigenentwurf; die Quelle nennt die Mittel in einer Aufzaehlung. Entscheidung, ob die Gliederung bleibt.
- Knopfgroesse: 44 statt 48 px laut GDD Abschnitt 7; nachmessen.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard fuer neue Apps: keine Seitenzahl auf dem Blatt; Seitenangaben stehen in Abschnitt 1 und im Feld quelle der Daten.
- Vorlesefunktion (F2): die App hat sie (nur mit Geraetestimme). Regel fuer Eltern-Werkzeuge offen.
- Favicon (A3).
