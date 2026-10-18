# Bauauftrag ELT-17: Wachstums- und Bewegungsbegleiter

Status: teilweise · Abschnitt: Eltern-Werkzeuge · Ziel: Ausbau von apps/wachstums-bewegungs-begleiter/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 126 (126–127), Abschnitt „Здоровый образ жизни“ (S. 126), Gruppe „ПОЧЕМУЧКИ“ (S. 126). Weitere Stellen laut App-Dokumentation: S. 222 und S. 224–225 (Gruppe „ФАНТАЗЕРЫ“); in dieser Einheit nicht gegengelesen.
- Katalogeintrag: docs/10, Zeile 390, Eintrag Wachstums- und Bewegungsbegleiter.
- Faktenstand laut index.json: nur Katalogtext. Die Seiten 126–127 sind mit der Arbeitskopie abgeglichen; die Fachaussagen aus der App-Dokumentation sind es nicht (Abschnitt 9).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Здоровый образ жизни“ (S. 126): Abschnitt mit vier Fragen an das Kind zu Haltung, Fuessen, Wachsen und Bewegung (S. 126–127).
  - „ПОЧЕМУЧКИ“ (S. 126): Gruppe der Quelle.
  - „Двигательная деятельность“ (S. 127): Bewegungsabschnitt mit Tagesstruktur der Einrichtung (S. 127).
  - „утренняя гимнастика“ (S. 127): Angebot mit Zeitangabe in der Einrichtung; in der App nicht uebernommen.
  - „шагомером“ (S. 127): Schrittzaehler, in der App ausgeschlossen (Abschnitt 3).
  - „ходьба на носках“ (S. 127): als Kraeftigungsuebung genannt; in der App kein Uebungsvorschlag, sondern ein Untersuchungszeichen (Abschnitt 9).
  - „для стимуляции роста“ (S. 127): Uebungen zur Wachstumsstimulation; in der App ausgeschlossen.
- Keine ganzen Saetze aus dem Buch. Die vier Fragen der Quelle an das Kind werden ohne Anfuehrungszeichen umschrieben (Haltung, Fuesse, Wachsen, Bewegung; S. 126–127).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet. Dazu gehoeren die Umkehrung der vier Fragen an die Erwachsenen, die acht Gelegenheiten fuer den Erwachsenen und die Bewegungswerte mit ihrer Herkunft (WHO und deutsche Empfehlungen; nicht aus der Praleska).
- Die Fachaussagen zur Leitlinie „Kindlicher Knick-Senkfuß“ (AWMF-Register 187-053, 2022) stammen aus der App-Dokumentation, nicht aus der Praleska.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Eltern und Kindertagespflege, Kinder von 3 bis 7 Jahren. Verwendung: beides (Bildschirm fuer den Erwachsenen; Druck als Zettel fuer die Kueche).
- Lernziele, prüfbar:
  1. Erwachsener sieht bei jedem der vier Bloecke, dass die Frage an ihn als Erwachsenen gerichtet ist, und wohin die Frage an das Kind gehoert (Eigenentwurf; Grundlage: vier Bloecke, S. 126–127).
  2. Erwachsener sieht fuer sein Alter die Orientierungswerte mit Quelle und Einschraenkung; bei Ueberschneidung zeigt die App mehrere Werte (Eigenentwurf; Grundlage: Bewegungswerte, Abschnitt 9).
  3. Erwachsener markiert die Gelegenheiten, die er am Tag geschaffen hat; gespeichert wird nur der eigene Tag (Eigenentwurf).

## 3. Funktion

- Bildschirme oder Blaetter: Startseite mit Hinweis; vier Bloecke (Haltung, Fuesse, Wachsen, Bewegung), je mit Frage an die Erwachsenen und dem Ort, wohin die Frage an das Kind gehoert; Altersauswahl mit Orientierungswerten (werteFuerAlter); acht Gelegenheiten als Auswahl fuer den heutigen Tag; Druckzettel.
- Ablauf: Alter waehlen → werteFuerAlter(daten, jahre) zeigt alle Werte mit Quelle und Einschraenkung → Gelegenheit markieren → speichereHeute(ids) → beim Start verwirft ladeHeute() jeden Eintrag, dessen Tag nicht heute ist → datenKarte loescht.
- Was gedruckt wird: ein Zettel mit den Orientierungswerten des gewaehlten Alters samt Quelle und den acht Gelegenheiten als Liste, ohne Haken (docs/02; GDD Abschnitt 7). Die vier Bloecke stehen nicht auf dem Zettel. Symbole (Feld zeichen) werden nicht gedruckt.
- Luecken laut Befund (Ausbau):
  - Die Bewegungs-Ampel mit Tagesstatistik: nicht gebaut (AMPEL; Begruendung: Einstufung des Kindes nach docs/02 und EU-KI-Verordnung).
  - Messlatten-Eintraege und Koerperdaten: nicht gebaut (KOERPERMASS, keinKoerperdatum).
  - Haltungs-Bildvergleich, Schrittzaehler und Wachstumsuebungen: nicht gebaut (keinSchrittzaehler, keinWachstumstrick).
  - Die Zehenspitzen-Uebung: nicht gebaut; die App fuehrt sie als Untersuchungszeichen (Abschnitt 9).

## 4. Daten

Datei: `apps/wachstums-bewegungs-begleiter/daten/begleiter.json`. Listen: bloecke (4), bewegungswerte (4), fachliches (4), gelegenheiten (8), ausgeschlossen (8). Seitenangabe im Feld `quelle.werk` (S. 126–127; dazu S. 222 und S. 224–225). Schema mit einer Beispielzeile (Feldnamen wie in der Datei):

```json
{ "id": "g-weg", "zeichen": "…", "text": "…" }
```

Das Feld `zeichen` ist ein Bildschirmsymbol und wird im Druck nicht gezeigt (Abnahme, Abschnitt 8).

## 5. Pseudocode

```
pruefeDaten(daten) -> Liste der Fehler (leer = gueltig)
  bloecke: 4 Eintraege; jeder Text enthaelt den Satz „Die Frage an die Erwachsenen lautet“ woertlich
  bloecke und gelegenheiten: keine mehrstellige Zahl (MEHRSTELLIGE_ZAHL)
  bewegungswerte: jeder Wert hat eine Quelle mit Jahreszahl und eine Einschraenkung
  fachliches: jeder Satz hat eine Leitlinienangabe mit Jahr und verweist auf einen vorhandenen Block
  AMPEL, KOERPERMASS, EINSTUFUNG: Treffer in angebotsTexte(daten) = Fehler; NICHT_GEPRUEFT nur benannte Ausnahmen
  ausgeschlossen: der Zehenspitzengang steht dort mit Befund (Untersuchungszeichen)

werteFuerAlter(daten, jahre) -> Liste der Werte
  filtert bewegungswerte nach Altersspanne; gibt alle Treffer zurueck (bei sechs Jahren drei)
  waehlt keinen „richtigen“ Wert aus

blockVon(daten, id) -> Block
wertVon(daten, id) -> Wert
handlungsTexte(daten) -> Liste der Gelegenheiten ohne Zahlen (Anzeige und Druck)

tagHeute() -> Datum YYYY-MM-DD in lokaler Zeit (nicht toISOString)
ladeHeute() -> Liste der ids; leer, wenn der gespeicherte Tag nicht heute ist
speichereHeute(ids) -> speichert { tag: tagHeute(), ids }; bei leerer Liste wird der Eintrag entfernt
  Fehler beim Schreiben werden abgefangen (privater Modus)
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Befund: localStorage nur fuer den heutigen Tag (speichereHeute, ladeHeute, datenKarte). Abweichung von dieser Vorlage wie in ELT-12 (docs/02 Z. 25). Entscheidung offen (Abschnitt 9).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Befund: CSP-Meta in index.html, Zeile 6; app.mjs laedt nur daten/begleiter.json (Zeile 17).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Befund: kein `<input>`.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Befund: keine Ampel, keine Einstufung (AMPEL, EINSTUFUNG; keineAmpel).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Befund: Zettel ohne Haken (GDD Abschnitt 7); Symbole und Emojis im Druck ausschliessen; Pruefung offen (test/regeln.test.mjs, neu).
- [ ] Mobile First 360 px; Knoepfe und Fusslink mindestens 48 px (docs/02 Z. 50). Befund: GDD Abschnitt 8 nennt 48 px als Ziel und zugleich „gemessen: keiner unter 44 px“. Das belegt die Einhaltung nicht; nachmessen (Abschnitt 9).
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Befund: Seitenangaben in Abschnitt 1 und im Feld quelle; Markierung auf dem Zettel noch einzubauen.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden, 14 Tests): Bloecke mit Frage an die Erwachsenen, Zahlen-Netz, Quellen mit Jahr, Alter mit mehreren Werten, Ampel- und Koerperdaten-Netz, Gelegenheiten ohne Zahl, Speichern nur fuer den heutigen Tag; jede Netzpruefung mit Gegenprobe.
- `test/regeln.test.mjs` (neu, nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Druck ohne Haken, Symbole und Emojis; kein externer Request; kein `<input>`.

## 8. Abnahme

- `npm test` im App-Ordner gruen; Testzahl 14 in README und GDD stimmt.
- Browser bei 360 px: kein horizontaler Ueberlauf, Knoepfe mindestens 48 px (nachmessen), Fokus nach Klick, Speicher nur fuer den heutigen Tag, nur localhost.
- Druck: keine Haken, keine Symbole, keine Emojis, Pflichtmarkierung auf dem Zettel mit Seitenangabe.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Katalogzahl „WHO/BZgA-Bewegungsempfehlung (180 Min/Tag fuer 3-5)“: nicht belegt. Die App nennt die Werte getrennt mit Quelle (GDD Abschnitt 4). Der Katalogeintrag ist zu korrigieren; diese Sitzung aendert ihn nicht.
- Bewegungs-Ampel mit Tagesstatistik (Katalog): nicht gebaut. Entscheidung, ob der Katalogeintrag angepasst wird.
- Messlatten und Koerperdaten (Katalog): nicht gebaut. Entscheidung, ob der Katalogeintrag angepasst wird.
- Zehenspitzengang: Der Katalog nennt ihn als Ausgleichsuebung. Die App-Dokumentation nennt ihn ein Untersuchungszeichen (Leitlinie Kindlicher Knick-Senkfuß, AWMF 187-053, 2022). Die Leitlinie ist in dieser Einheit nicht geprueft.
- Quellen S. 222 und S. 224–225: in der App genutzt, in dieser Einheit nicht gegengelesen.
- Speicherregel: wie in ELT-12 (docs/02 Z. 25 gegen diese Vorlage). Entscheidung offen.
- Knopfgroesse: 44 statt 48 px laut GDD Abschnitt 8; nachmessen.
- Die acht Gelegenheiten sind Eigenentwurf; Entscheidung, ob die Liste so bleibt.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard fuer neue Apps: keine Seitenzahl auf dem Blatt; Seitenangaben stehen in Abschnitt 1 und im Feld quelle der Daten.
- Vorlesefunktion (F2): die App hat sie (nur mit Geraetestimme). Regel fuer Eltern-Werkzeuge offen.
- Favicon (A3).
