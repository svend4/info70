# Bauauftrag ELT-19: Spielend schulreif - Eltern-Navigator

Status: teilweise · Abschnitt: Eltern-Werkzeuge · Ziel: Ausbau von apps/schulanfang-spiel-navigator/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 242 (242), Abschnitt „МИР ИГРЫ“ (S. 242), Gruppe „ФАНТАЗЕРЫ“ (S. 242).
- Katalogeintrag: docs/10, Zeile 396, Eintrag Spielend schulreif - Eltern-Navigator.
- Faktenstand laut index.json: nur Katalogtext.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Задачи (общие)“ (S. 242): allgemeine Ziele der Quelle, fünf an der Zahl.
  - „ведущей деятельности“ (S. 242): das Spiel als führende Tätigkeit des Alters (Ziel 1, in der App gebaut).
  - „Сюжетно-ролевые игры“ (S. 242): Rollenspiel als Unterabschnitt des Kapitels.
  - „богатые возможности игры“ (S. 242): Ziel 3 der Quelle, in der App zurückgewiesen.
  - „коррекционных целях“ (S. 242): Teil desselben zurückgewiesenen Ziels.
- Die Quelle nennt fünf allgemeine Ziele (S. 242). Davon ist eines zurückgewiesen, zwei sind gebaut, zwei betreffen den Tagesablauf einer Einrichtung (in der App nicht gebaut).
- Keine ganzen Sätze aus dem Buch. Die Ziele werden ohne Anführungszeichen umschrieben und mit Seitenangabe belegt (S. 242).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet. Dazu gehören die drei Teile des Navigators, die Aussagen zum Landesrecht und zur KMK/JFMK-Empfehlung (Fundstellen laut App, nicht aus der Praleska; Abschnitt 9) sowie die Abgrenzungstexte „was es nicht ist“.
- Die vier Spielarten (Rollenspiel, Regelspiel, Theater, Bauspiel) stammen laut App-Dokumentation aus der Gliederung des Kapitels. Ihre Seiten sind in dieser Einheit nicht geprüft (Abschnitt 9).
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Eltern und Kindertagespflege, Kinder von 5 bis 7 Jahren. Verwendung: beides (Bildschirm für den Erwachsenen; Druck als Blatt für die Elternmappe).
- Lernziele, prüfbar:
  1. Erwachsener kennt die Zuständigkeit: Die Schulleitung entscheidet auf Grundlage des ärztlichen Gutachtens; eine bundesweite Regel gibt es nicht (Eigenentwurf; Landesrecht laut App, Abschnitt 9).
  2. Erwachsener kann zu jedem der drei Bereiche sagen, wie sicher die Aussage ist (Eigenentwurf; Grundlage: gemeinsame Empfehlung von KMK und JFMK, nicht aus der Praleska).
  3. Erwachsener kann für jede Spielart angeben, was sie nicht ist (Eigenentwurf; Grundlage: Kapitel „МИР ИГРЫ“ (S. 242)).

## 3. Funktion

- Bildschirme oder Blätter: Hinweis; Teil 1 „Was gilt und wer entscheidet“ (sechs Fragen mit Antwort und Fundstelle); Teil 2 „Drei Bereiche“ mit Sicherheit je Bereich; Teil 3 „Vier Spielarten“ mit „was es ist“ und „was es nicht ist“; Hinweis auf schulstart-begleiter im Fuß; Druckblatt.
- Ablauf: Frage wählen (frageKarte) → Antwort und Fundstelle lesen → bereichVon(daten, id) für die Sicherheit → spielartVon(daten, id) → spielKarte(daten, id) mit der Abgrenzung → drucken: alles offen.
- Was gedruckt wird: ein Blatt für die Elternmappe, alles offen, ohne Knöpfe, Haken und Namenszeile (GDD Abschnitt 9). Symbole (Feld zeichen) werden auf Papier nicht gezeigt.
- Lücken laut Befund (Ausbau):
  - Der Katalog nennt Checkliste und Bericht als Datei-Export. Nicht gebaut: eine Checkliste über ein Kind wäre eine Beurteilung, ein Bericht wäre ein Bericht über ein Kind (GDD Abschnitt „Nicht gebaut“).
  - Der Katalog nennt Mehrsprachigkeit de/uk/ru. Nicht gebaut: Rechtsbegriffe in ungeprüfter Übersetzung (GDD Abschnitt 10).
  - Der Katalogtitel „Spielend schulreif“ ist nicht übernommen. Die App heißt „Schulanfang und Spiel“, weil „schulreif“ als Urteil über ein Kind nicht verwendet wird (GDD Abschnitt 2).
  - Eine Vorhersage für das einzelne Kind: nicht gebaut (VORHERSAGE, BEWERTUNG).

## 4. Daten

Datei: `apps/schulanfang-spiel-navigator/daten/navigator.json`. Listen: wasGilt (6), bereiche (3), spielarten (4), ziele (5), ausgeschlossen (6). Seitenangabe für die Ziele im Feld `quelle.werk` (S. 242); die Fundstelle jeder Antwort zum Landesrecht steht im Feld `quelle` der Antwort. Schema mit einer Beispielzeile (Feldnamen wie in der Datei):

```json
{ "id": "g-entscheidung", "zeichen": "…", "frage": "…", "antwort": "…", "quelle": "…" }
```

Das Feld `zeichen` ist ein Bildschirmsymbol und wird im Druck nicht gezeigt (Abnahme, Abschnitt 8).

## 5. Pseudocode

```
pruefeDaten(daten) -> Liste der Fehler (leer = gültig)
  ziele: genau 5 Einträge; genau einer hat einordnung ausgeschlossen; dessen Text enthält „diagnostisch“
  wasGilt: 6 Einträge; jede Antwort hat ein Feld quelle mit Fundstelle
  Länderantworten nennen mindestens zwei Bundesländer (Test)
  bereiche: 3 Einträge (sozial-emotional, sprachlich, mathematisch); jeder hat ein Pflichtfeld sicherheit
  sozial-emotional: sicherheit sagt, dass keine Zahl genannt wird; bereicheHinweis nennt die Liste als nicht abschließend
  spielarten: 4 Einträge; jeder hat wasEsNichtIst mit einer Verneinung
  SCHULREIF_ALS_URTEIL, VORHERSAGE, BEWERTUNG, KOENNENSALTER: Treffer außerhalb NICHT_GEPRUEFT = Fehler
  NICHT_GEPRUEFT: genau der erklärende Absatz zum Begriff „schulreif“

bereichVon(daten, id) -> Bereich
spielartVon(daten, id) -> Spielart
frageKarte(daten, id) -> Text (Frage, Antwort, Fundstelle)
spielKarte(daten, id) -> Text (Spielart, wasEsNichtIst)
render() -> Seite; keine Schreibvorgänge, keine Speicherung
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Befund: keine Nutzung von localStorage in app.mjs und logik.mjs (Suche leer); GDD Abschnitt „Hinweis Speicherung: nein“ (Technik-Tabelle).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Befund: CSP-Meta in index.html, Zeile 6; app.mjs lädt nur daten/navigator.json (Zeile 15).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Befund: kein `<input>`.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Befund: keine Beurteilung (keineBeurteilung), keine Vorhersage; Netze SCHULREIF_ALS_URTEIL, VORHERSAGE, BEWERTUNG.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Befund: Blatt ohne Knöpfe und Haken (GDD Abschnitt 9); Symbole im Druck ausschließen; Prüfung offen (test/regeln.test.mjs, neu).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50). Befund: in der GDD-Technik-Tabelle keine Messung angegeben. Nachmessen (Abschnitt 8).
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Befund: Seitenangabe für die Ziele in Abschnitt 1 und im Feld quelle; Markierung auf dem Blatt noch einzubauen.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt). Befund: bewusst weggelassen (GDD Abschnitt 10).

## 7. Tests

- `test/logik.test.mjs` (vorhanden, 13 Tests): genau ein zurückgewiesenes Ziel mit dem Wort „diagnostisch“, Fundstelle je Antwort, zwei Bundesländer bei Länderantworten, Sicherheit je Bereich, Verneinung bei Spielarten, Netze gegen Urteil, Vorhersage und Altersangabe; jede Netzprüfung mit Gegenprobe.
- `test/regeln.test.mjs` (neu, nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Druck ohne Knöpfe, Haken und Symbole; kein externer Request; kein `<input>`.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl 13 in README und GDD stimmt.
- Browser bei 360 px: kein horizontaler Überlauf, Knöpfe mindestens 48 px (messen), Fokus nach Klick, keine Speicherung, nur localhost.
- Druck: Blatt ohne Knöpfe, keine Zeichen und Symbole, Pflichtmarkierung auf dem Blatt mit Seitenangabe.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Titel „Spielend schulreif“ (Katalog): nicht übernommen; die App heißt „Schulanfang und Spiel“. Entscheidung, ob der Katalogtitel geändert wird.
- Checkliste und Bericht-Export (Katalog): nicht gebaut. Entscheidung, ob der Katalogeintrag angepasst wird.
- Mehrsprachigkeit de/uk/ru (Katalog): nicht gebaut. Entscheidung, ob ein gegengelesenes Angebot später folgt.
- Landesrecht: Stichtage, Zurückstellung und Untersuchung sind Landesrecht und nicht aus der Praleska. Fundstellen (zum Beispiel Paragraf 35 Absatz 3 SchulG NRW) und der Stand 2026 sind vor Veröffentlichung nachzuprüfen. Die gemeinsame Empfehlung von KMK und JFMK ist ebenfalls nicht aus der Praleska und ist nachzuprüfen.
- Die vier Spielarten: Seitenangaben innerhalb des Kapitels sind nicht geprüft.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard für neue Apps: keine Seitenzahl auf dem Blatt; Seitenangaben stehen in Abschnitt 1 und im Feld quelle der Daten.
- Vorlesefunktion (F2): die App hat sie nicht; Regel für Eltern-Werkzeuge offen.
- Favicon (A3).
