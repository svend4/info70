# Bauauftrag ELT-19: Spielend schulreif - Eltern-Navigator

Status: teilweise · Abschnitt: Eltern-Werkzeuge · Ziel: Ausbau von apps/schulanfang-spiel-navigator/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 242 (242), Abschnitt „МИР ИГРЫ“ (S. 242), Gruppe „ФАНТАЗЕРЫ“ (S. 242).
- Katalogeintrag: docs/10, Zeile 396, Eintrag Spielend schulreif - Eltern-Navigator.
- Faktenstand laut index.json: nur Katalogtext.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Задачи (общие)“ (S. 242): allgemeine Ziele der Quelle, fuenf an der Zahl.
  - „ведущей деятельности“ (S. 242): das Spiel als fuehrende Taetigkeit des Alters (Ziel 1, in der App gebaut).
  - „Сюжетно-ролевые игры“ (S. 242): Rollenspiel als Unterabschnitt des Kapitels.
  - „богатые возможности игры“ (S. 242): Ziel 3 der Quelle, in der App zurueckgewiesen.
  - „коррекционных целях“ (S. 242): Teil desselben zurueckgewiesenen Ziels.
- Die Quelle nennt fuenf allgemeine Ziele (S. 242). Davon ist eines zurueckgewiesen, zwei sind gebaut, zwei betreffen den Tagesablauf einer Einrichtung (in der App nicht gebaut).
- Keine ganzen Saetze aus dem Buch. Die Ziele werden ohne Anfuehrungszeichen umschrieben und mit Seitenangabe belegt (S. 242).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet. Dazu gehoeren die drei Teile des Navigators, die Aussagen zum Landesrecht und zur KMK/JFMK-Empfehlung (Fundstellen laut App, nicht aus der Praleska; Abschnitt 9) sowie die Abgrenzungstexte „was es nicht ist“.
- Die vier Spielarten (Rollenspiel, Regelspiel, Theater, Bauspiel) stammen laut App-Dokumentation aus der Gliederung des Kapitels. Ihre Seiten sind in dieser Einheit nicht geprueft (Abschnitt 9).
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Eltern und Kindertagespflege, Kinder von 5 bis 7 Jahren. Verwendung: beides (Bildschirm fuer den Erwachsenen; Druck als Blatt fuer die Elternmappe).
- Lernziele, prüfbar:
  1. Erwachsener kennt die Zustaendigkeit: Die Schulleitung entscheidet auf Grundlage des aerztlichen Gutachtens; eine bundesweite Regel gibt es nicht (Eigenentwurf; Landesrecht laut App, Abschnitt 9).
  2. Erwachsener kann zu jedem der drei Bereiche sagen, wie sicher die Aussage ist (Eigenentwurf; Grundlage: gemeinsame Empfehlung von KMK und JFMK, nicht aus der Praleska).
  3. Erwachsener kann fuer jede Spielart angeben, was sie nicht ist (Eigenentwurf; Grundlage: Kapitel „МИР ИГРЫ“ (S. 242)).

## 3. Funktion

- Bildschirme oder Blaetter: Hinweis; Teil 1 „Was gilt und wer entscheidet“ (sechs Fragen mit Antwort und Fundstelle); Teil 2 „Drei Bereiche“ mit Sicherheit je Bereich; Teil 3 „Vier Spielarten“ mit „was es ist“ und „was es nicht ist“; Hinweis auf schulstart-begleiter im Fuss; Druckblatt.
- Ablauf: Frage waehlen (frageKarte) → Antwort und Fundstelle lesen → bereichVon(daten, id) fuer die Sicherheit → spielartVon(daten, id) → spielKarte(daten, id) mit der Abgrenzung → drucken: alles offen.
- Was gedruckt wird: ein Blatt fuer die Elternmappe, alles offen, ohne Knoepfe, Haken und Namenszeile (GDD Abschnitt 9). Symbole (Feld zeichen) werden auf Papier nicht gezeigt.
- Luecken laut Befund (Ausbau):
  - Der Katalog nennt Checkliste und Bericht als Datei-Export. Nicht gebaut: eine Checkliste ueber ein Kind waere eine Beurteilung, ein Bericht waere ein Bericht ueber ein Kind (GDD Abschnitt „Nicht gebaut“).
  - Der Katalog nennt Mehrsprachigkeit de/uk/ru. Nicht gebaut: Rechtsbegriffe in ungepruefter Uebersetzung (GDD Abschnitt 10).
  - Der Katalogtitel „Spielend schulreif“ ist nicht uebernommen. Die App heisst „Schulanfang und Spiel“, weil „schulreif“ als Urteil ueber ein Kind nicht verwendet wird (GDD Abschnitt 2).
  - Eine Vorhersage fuer das einzelne Kind: nicht gebaut (VORHERSAGE, BEWERTUNG).

## 4. Daten

Datei: `apps/schulanfang-spiel-navigator/daten/navigator.json`. Listen: wasGilt (6), bereiche (3), spielarten (4), ziele (5), ausgeschlossen (6). Seitenangabe fuer die Ziele im Feld `quelle.werk` (S. 242); die Fundstelle jeder Antwort zum Landesrecht steht im Feld `quelle` der Antwort. Schema mit einer Beispielzeile (Feldnamen wie in der Datei):

```json
{ "id": "g-entscheidung", "zeichen": "…", "frage": "…", "antwort": "…", "quelle": "…" }
```

Das Feld `zeichen` ist ein Bildschirmsymbol und wird im Druck nicht gezeigt (Abnahme, Abschnitt 8).

## 5. Pseudocode

```
pruefeDaten(daten) -> Liste der Fehler (leer = gueltig)
  ziele: genau 5 Eintraege; genau einer hat einordnung ausgeschlossen; dessen Text enthaelt „diagnostisch“
  wasGilt: 6 Eintraege; jede Antwort hat ein Feld quelle mit Fundstelle
  Laenderantworten nennen mindestens zwei Bundeslaender (Test)
  bereiche: 3 Eintraege (sozial-emotional, sprachlich, mathematisch); jeder hat ein Pflichtfeld sicherheit
  sozial-emotional: sicherheit sagt, dass keine Zahl genannt wird; bereicheHinweis nennt die Liste als nicht abschliessend
  spielarten: 4 Eintraege; jeder hat wasEsNichtIst mit einer Verneinung
  SCHULREIF_ALS_URTEIL, VORHERSAGE, BEWERTUNG, KOENNENSALTER: Treffer ausserhalb NICHT_GEPRUEFT = Fehler
  NICHT_GEPRUEFT: genau der erklaerende Absatz zum Begriff „schulreif“

bereichVon(daten, id) -> Bereich
spielartVon(daten, id) -> Spielart
frageKarte(daten, id) -> Text (Frage, Antwort, Fundstelle)
spielKarte(daten, id) -> Text (Spielart, wasEsNichtIst)
render() -> Seite; keine Schreibvorgaenge, keine Speicherung
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Befund: keine Nutzung von localStorage in app.mjs und logik.mjs (Suche leer); GDD Abschnitt „Hinweis Speicherung: nein“ (Technik-Tabelle).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Befund: CSP-Meta in index.html, Zeile 6; app.mjs laedt nur daten/navigator.json (Zeile 15).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Befund: kein `<input>`.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Befund: keine Beurteilung (keineBeurteilung), keine Vorhersage; Netze SCHULREIF_ALS_URTEIL, VORHERSAGE, BEWERTUNG.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Befund: Blatt ohne Knoepfe und Haken (GDD Abschnitt 9); Symbole im Druck ausschliessen; Pruefung offen (test/regeln.test.mjs, neu).
- [ ] Mobile First 360 px; Knoepfe und Fusslink mindestens 48 px (docs/02 Z. 50). Befund: in der GDD-Technik-Tabelle keine Messung angegeben. Nachmessen (Abschnitt 8).
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Befund: Seitenangabe fuer die Ziele in Abschnitt 1 und im Feld quelle; Markierung auf dem Blatt noch einzubauen.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt). Befund: bewusst weggelassen (GDD Abschnitt 10).

## 7. Tests

- `test/logik.test.mjs` (vorhanden, 13 Tests): genau ein zurueckgewiesenes Ziel mit dem Wort „diagnostisch“, Fundstelle je Antwort, zwei Bundeslaender bei Laenderantworten, Sicherheit je Bereich, Verneinung bei Spielarten, Netze gegen Urteil, Vorhersage und Altersangabe; jede Netzpruefung mit Gegenprobe.
- `test/regeln.test.mjs` (neu, nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Druck ohne Knoepfe, Haken und Symbole; kein externer Request; kein `<input>`.

## 8. Abnahme

- `npm test` im App-Ordner gruen; Testzahl 13 in README und GDD stimmt.
- Browser bei 360 px: kein horizontaler Ueberlauf, Knoepfe mindestens 48 px (messen), Fokus nach Klick, keine Speicherung, nur localhost.
- Druck: Blatt ohne Knoepfe, keine Zeichen und Symbole, Pflichtmarkierung auf dem Blatt mit Seitenangabe.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Titel „Spielend schulreif“ (Katalog): nicht uebernommen; die App heisst „Schulanfang und Spiel“. Entscheidung, ob der Katalogtitel geaendert wird.
- Checkliste und Bericht-Export (Katalog): nicht gebaut. Entscheidung, ob der Katalogeintrag angepasst wird.
- Mehrsprachigkeit de/uk/ru (Katalog): nicht gebaut. Entscheidung, ob ein gegengelesenes Angebot spaeter folgt.
- Landesrecht: Stichtage, Zurueckstellung und Untersuchung sind Landesrecht und nicht aus der Praleska. Fundstellen (zum Beispiel Paragraf 35 Absatz 3 SchulG NRW) und der Stand 2026 sind vor Veroeffentlichung nachzupruefen. Die gemeinsame Empfehlung von KMK und JFMK ist ebenfalls nicht aus der Praleska und ist nachzupruefen.
- Die vier Spielarten: Seitenangaben innerhalb des Kapitels sind nicht geprueft.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard fuer neue Apps: keine Seitenzahl auf dem Blatt; Seitenangaben stehen in Abschnitt 1 und im Feld quelle der Daten.
- Vorlesefunktion (F2): die App hat sie nicht; Regel fuer Eltern-Werkzeuge offen.
- Favicon (A3).
