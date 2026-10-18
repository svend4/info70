# Bauauftrag PRI-19: Schwungblatt-Generator

Status: teilweise · Abschnitt: Printmaterialien Kita · Ziel: Ausbau von apps/schwungblatt-generator
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 298 (298–299), Abschnitt „Подготовка руки к письму“ (S. 298), Gruppe „ФАНТАЗЕРЫ“ (S. 298).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „мелкую моторику“ (S. 298)
  - „ориентации на листе бумаги“ (S. 298)
  - „прямых“ (S. 299)
  - „наклонных“ (S. 299)
  - „волнистых линий“ (S. 299)
  - „овалов“ (S. 299)
  - „петель“ (S. 299)
  - „крючков“ (S. 299)
  - „штриховке“ (S. 299)
  - „раскрашивании“ (S. 299)
  - „графических упражнений“ (S. 299)
- Die Seitenangabe 298–299 aus dem Katalog (docs/10, Z. 491) ist gegen die Quelle geprüft: Der Abschnitt steht auf S. 298, die Grundformen und Übungsarten auf S. 299.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft. Nicht gefunden – offen: keine.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 5–7 als Übende, Fachkräfte und Eltern als Anwender (Katalog docs/10, Z. 491; Eigenentwurf). Verwendung: Druck. Der Bildschirm dient nur der Vorschau.
- Lernziele, prüfbar:
  1. Erwachsene wählt Stufe und Muster und druckt ein Blatt, auf dem jedes gewählte Muster in zwei Zeilen à acht Wiederholungen steht.
  2. Kind fährt den gepunkteten Strich mit dem Stift von links nach rechts ab und beginnt am grünen Punkt, ohne Bildschirm. Ziel laut Quelle: „мелкую моторику“ (S. 298); die Umsetzung ist Eigenentwurf.
  3. Erwachsene wählt Stufe 1 bis 3 als Materialwahl. Die Stufe steht nicht auf dem Blatt und ist keine Einstufung des Kindes (Eigenentwurf; docs/02 Z. 141–146).

## 3. Funktion

- Bildschirme oder Blätter: Bedienseite (nur am Bildschirm) mit drei Stufenknöpfen, sechs Mustertasten und dem Knopf „Schwungblatt drucken“. Blatt (Druck): ein Schwungblatt mit allen gewählten Mustern. Zusätzlich die Elternseite eltern.html (Eigenentwurf).
- Ablauf: Stufe wählen → Muster an- oder abwählen → Vorschau prüfen (die Vorschau ist das Druckbild) → „Schwungblatt drucken“ (window.print) → Stift auf Papier, am grünen Punkt starten.
- Was gedruckt wird: je gewähltem Muster eine Überschrift und zwei Zeilen à acht Wiederholungen (SVG, Feld 480 × 70 Einheiten). Kein Namensfeld. Es gibt keine Druckkarten; die Regel „eine Karte je Blatt A4“ entfällt.
- Katalog verlangt (docs/10, Z. 491; Eigenentwurf als Adaptation): sechs Grundelemente (gerade, schräge, wellige Linien, Ovale, Schleifen, Haken), wählbare Progression, Ausmal- und Schraffur-Vorlagen, Hinweisblatt zu Stifthaltung in de/uk/ru, kein Touch-Nachspuren. Die Grundelemente entsprechen den Formen aus Abschnitt 1 (S. 299).
- App leistet heute: sechs Muster in drei Stufen (Große Wellen, Runde Berge; Girlanden, Zickzack; Schleifen, Kreise-Kette), gepunkteter Nachspur-Strich und grüner Startpunkt, Druck über druck.css, Elternseite nur auf Deutsch, kein Touch, nichts gespeichert. Die Lücken stehen unter Abschnitt 9.
- Die Zuordnung der Stufen zu Arm, Handgelenk und Fingern ist Eigenentwurf. Der Katalog nennt nur „Progression“.

## 4. Daten

Datei: `apps/schwungblatt-generator/daten/muster.json` (Ziel). Ist-Stand: kein Ordner daten/; die Muster stehen als Konstante `MUSTER` in logik.mjs (Zeilen 7–14, Felder id, name, emoji, stufe). Schema mit einer Beispielzeile:

```json
{ "id": "welle", "titel": "Große Wellen", "stufe": 1, "quelle": { "seite": "S. 299" }, "eigenentwurf": true }
```

Die Seitenangabe im Feld „quelle“ bezieht sich auf die Grundform wellige Linien (S. 299). Sie steht in den Daten und nicht auf dem Druckblatt (Standard für A18, siehe Abschnitt 9).

## 5. Pseudocode

```
musterFuerStufe(stufe: 1 | 2 | 3) -> Liste aus {id, titel, stufe}
  filtere MUSTER nach Feld stufe == stufe
  wenn Länge < 2 -> Fehler "Stufe hat weniger als 2 Muster"
  gib Liste in Datenreihenfolge zurück

stufeWaehlen(stufe) -> Zustand
  setze aktuelle Stufe = stufe
  setze gewaehlt = Ids aus musterFuerStufe(stufe)
  rendere Bedienseite und Vorschau neu

musterUmschalten(id) -> Zustand
  wenn id in gewaehlt: entferne id aus gewaehlt, sonst hänge id an gewaehlt
  rendere Bedienseite und Vorschau neu

pfad(musterId: Text, einheiten: 8) -> Text | null
  setze Grundlinie y = HOEHE - 15 mit HOEHE = 70
  beginne mit "M 0 {y}"
  für i von 1 bis einheiten: hänge das Segment von musterId an (Tabelle je Muster in logik.mjs)
  unbekannte musterId -> gib null zurück
  enthält das Ergebnis NaN oder undefined -> gib null zurück
  sonst gib d-Text zurück

zeilenSVG(musterId: Text, einheiten: 8) -> SVG-Text | null
  d = pfad(musterId, einheiten); wenn d == null -> gib null zurück
  breite = einheiten * EINHEIT mit EINHEIT = 60, also 480
  gib <svg viewBox="0 0 breite 70"> zurück mit
    <path d=d> als gepunkteter Nachspur-Strich (stroke-dasharray "1 7")
    <circle cx="0" cy="55" r="6"> als grüner Startpunkt
  das SVG enthält kein href, kein url( und keinen Bildpfad

blattKarte(gewaehlteIds, zeilenJeMuster = 2, einheiten = 8) -> Blatt-Knoten
  muster = MUSTER, gefiltert nach gewaehlteIds, in Datenreihenfolge
  wenn muster leer -> gib Hinweis mit Klasse "nur-bildschirm" zurück
  für jedes Muster:
    Überschrift = titel ohne Emoji (Ausbau; Ist-Stand mit Emoji, siehe Abschnitt 9)
    zeilenJeMuster-mal zeilenSVG(id, einheiten)
  kein Namensfeld, keine Stufenangabe, keine Haken oder Sterne
  gib Blatt-Knoten zurück

drucken() -> Druckdialog
  nur auslösen, wenn gewaehlt nicht leer ist
  Abnahme: Zahl der Muster-Blöcke im Blatt == Länge(gewaehlt)

pruefeMuster() -> Liste von Fehlern
  für jedes Muster: id eindeutig; pfad(id, 2) ohne NaN
  für Stufen 1, 2, 3: musterFuerStufe(stufe) hat mindestens 2 Einträge
  Fehlerliste nicht leer -> Anzeige "Datenfehler" statt Bedienseite
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Werkzeuge ohne Nutzerdaten speichern nichts. Die Entscheidung je Einheit steht in Abschnitt 9. Ist: erfüllt; app.mjs und logik.mjs greifen auf keinen Speicher zu.
- [ ] Keine Anfragen nach außen (docs/02 Z. 22–24). Ist: erfüllt im Code; installiereNetzwerkWaechter() in app.mjs Z. 10. Die CSP-Meta-Zeile `default-src 'self'` steht in index.html Z. 6 und eltern.html Z. 6; docs/02 nennt sie nicht (Eigenentwurf).
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 17–30 zu Daten und Privatsphäre). Ist: erfüllt, nur Knöpfe, kein input-Element.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Ist: erfüllt, die Stufe ist Materialwahl durch Erwachsene (Eigenentwurf; Klärung in Abschnitt 9).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82; Emoji-Regel nach docs/bauauftraege/SESSION-ANLEITUNG.md, Schritt 4). Ist: offen. Namenszeile, Tagesfelder und die Zeichenliste fehlen im Druckteil; Emojis sind im Druckteil vorhanden (app.mjs Z. 38 und Z. 45).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50). Ist: Viewport-Meta in index.html Z. 5 vorhanden; Maße noch nicht gemessen, siehe Abschnitt 8.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe. Ist: Das Druckblatt trägt keine Seitenangabe (Standard A18), die Markierung ist auf dem Blatt daher nicht nötig. Diese Einheit hat Seitenangaben in Abschnitt 1 und 4; deshalb steht die Markierung hier: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Seitenangaben nur mit Markierung „проверено человеком“ (docs/02 Z. 151–152). Ist: offen (A18, siehe Abschnitt 9).
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen. Ist: in den gelesenen Dateien nicht gefunden.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt). Ist: eltern.html ist nur auf Deutsch (lang="de", Z. 2). Der Katalog verlangt das Hinweisblatt in de/uk/ru.

## 7. Tests

- `test/logik.test.mjs`: fünf Prüfungen vorhanden. Muster-Katalog gültig (6 Muster, je Stufe 2, keine NaN); Progression (Stufe 1 Wellen und Berge, Stufe 3 Schleifen und Kreise); pfad (Grundlinie, Wiederholung, unbekanntes Muster ergibt null); zeilenSVG (Nachspur-Strich, Startpunkt, keine externen Referenzen); Konstanten (EINHEIT 60, HOEHE 70).
- Fehlt: Prüfung, dass das Druckteil keine Emojis, keine Zeichen aus ☐☒☑✓✔★☆ und keine Namenszeile enthält. Der aktuelle Stand besteht diese Prüfung nicht (Emojis im Druckteil).
- `test/regeln.test.mjs`: fehlt. Anzulegen nach dem Muster `apps/puppentheater-werkstatt/test/regeln.test.mjs` (Eigenentwurf zur Übernahme der Projektregeln: Druck, Namenszeile, Zeichen, Speicher, Netzzugriffe).

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt. Ist: package.json hat kein Skript „test“. Die README nennt stattdessen `node --test apps/schwungblatt-generator/test/*.test.mjs` (README Z. 32). README und GDD nennen keine Testzahl. Ausbau: Skript ergänzen und Zahl eintragen.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, nur `localhost`. Prüfpunkt: render() baut die Oberfläche bei jedem Klick neu (app.mjs Z. 50–51, 61, 71). Der Fokus geht dann voraussichtlich verloren. Im Browser-Lauf prüfen und bei Abweichung beheben.
- Druck: Zahl der Muster-Blöcke gleich Auswahl; keine Zeichen; Pflichtmarkierung je Karte mit Seitenangabe (entfällt, solange keine Seitenangabe auf dem Blatt steht). Ist: Emojis im Druckteil (app.mjs Z. 38 und Z. 45) sind ein Verstoß.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog). Diese Einheit registriert nichts.

## 9. Offen

- Entscheidungen aus docs/fragen-und-hinweise.md:
  - F2 Vorlesefunktion: das Werkzeug hat keine Vorlesefunktion. Für Fachkraft- und Eltern-Werkzeuge ist die Ausnahme im GDD zu begründen; das GDD enthält noch keine Begründung.
  - A3 Favicon: index.html hat kein Icon. Gemeinsames Icon für alle oder unverändert?
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard für diese Einheit: keine Seitenzahl auf dem Druckblatt; Seitenangaben stehen nur in Abschnitt 1 und in den Daten als „quelle“.
- Befunde im Ist-Stand gegen Katalog und Quelle:
  1. Grundformen: Der Katalog nennt die gerade Linie und den Haken (docs/10, Z. 491). Die Quelle nennt die Formen прямые und крючки (S. 299). Die App hat kein Muster dafür; Ovale sind nur als Bögen (Runde Berge) vorhanden. Entscheidung: zwei Muster ergänzen oder den Katalog anpassen.
  2. Ausmal- und Schraffur-Vorlagen (docs/10, Z. 491) fehlen in der App. Die Quelle nennt Ausmalen und Schraffieren als Übungsziel (S. 299). Entscheidung: bauen oder aus dem Katalog streichen.
  3. Hinweisblatt in uk und ru fehlt. eltern.html ist nur auf Deutsch (Z. 2) und enthält eine Kurzfassung zu Stift und Hand (Z. 21).
  4. Emojis im Druckteil: Die Muster-Überschriften (app.mjs Z. 38) und der Blatttitel (app.mjs Z. 45) tragen Emoji-Zeichen; die Emoji-Felder stehen in logik.mjs Z. 8–13. Ausbau: Emojis nur auf dem Bildschirm, Titel ohne Emoji.
  5. Das GDD widerspricht dem Code: GDD Z. 25 und Z. 38 nennen eine Namenszeile auf dem Papier. README Z. 16–17, app.mjs Z. 42–43 und eltern.html Z. 28 sagen: keine Namenszeile. Ausbau: GDD korrigieren.
  6. package.json hat keine Skripte. `npm test` und `npm run dev` (README Z. 31) laufen nicht.
  7. test/regeln.test.mjs fehlt (Pflicht nach docs/bauauftraege/SESSION-ANLEITUNG.md, Schritt 3).
  8. Fokus nach Klick: render() ersetzt alle Knöpfe (app.mjs Z. 50–51). Siehe Abschnitt 8.
  9. Stufen 1 bis 3 sind Materialwahl. Das GDD soll festhalten, dass docs/02 Z. 141–146 nicht als Einstufung des Kindes gelesen wird (Eigenentwurf).
