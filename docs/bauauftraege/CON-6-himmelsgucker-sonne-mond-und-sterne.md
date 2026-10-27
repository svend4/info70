# Bauauftrag CON-6: Himmelsgucker: Sonne, Mond und Sterne

Status: offen · Abschnitt: Content-Pakete, Funktionen, Dokumente · Ziel: neue App (Ordner `apps/himmelsgucker-sonne-mond-und-sterne/`)
Blockiert durch: keine (A7 am 27.10.2026 umgesetzt)

Stand 27.10.2026: A7 ist umgesetzt. Der Motor `quiz-kern` speichert nichts und kennt keinen Rekord, keine Punkte und keine Ränge mehr; die Quiz-Apps laufen ohne Wertung durch (Quiz-Durchlauf). Aussagen zu A7 weiter unten stammen aus der Zeit davor.

## 1. Quelle

- Praleska, S. 138 (138), Abschnitt „Астрономия (введение)“ (S. 138), Gruppe „ПОЧЕМУЧКИ“ (S. 138).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Астрономия (введение)“ (S. 138)
  - „Солнце, Луна, звезды“ (S. 138)
  - „небесных тел“ (S. 138)
  - „полная, неполная, серпом“ (S. 138)
  - „звездное небо“ (S. 114)
- Umschrieben, ohne Anführungszeichen: Die Seite verlangt, dass Kinder elementare Vorstellungen von Himmelskörpern gewinnen und ihre Lage beobachten (S. 138). Sie beschreibt Auf- und Untergang von Sonne und Mond, die Wärme der Sonne und die Gestalt des Mondes von voll bis Sichel (S. 138). Ziel ist die Beobachtung von Sonne, Mond und Sternenhimmel (S. 114).
- Raumfahrt wird in der Quelle über Kosmonauten eingeführt (S. 138). Der Katalog ersetzt das durch Astronautinnen und Astronauten der ESA (docs/10, Z. 453). Diese Ersetzung ist Eigenentwurf.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.
- Katalogeintrag: docs/10, Z. 453 (Himmelsgucker). Zielgruppe 5 bis 7 mit Beobachtung offline und Eltern, Typ S, Engine quiz-kern plus Druckmaterial.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 5 bis 7 Jahre, Beobachtung offline mit Eltern. Verwendung: beides (kurzer Bildschirm, Druck für die Beobachtung draußen).
- Lernziele, prüfbar (Eigenentwurf):
  1. Kind nennt, wann Sonne und wann Sterne zu sehen sind.
  2. Kind ordnet die Mondgestalten voll, teilweise und Sichel den passenden Bildern zu (Ko-Nutzung).
  3. Erwachsene druckt ein Beobachtungsblatt für den Abendhimmel ohne Datum und ohne Namenszeile.

## 3. Funktion

- Bildschirme oder Blätter: (1) Start mit drei Karten Sonne, Mond, Sterne (Eigenentwurf); (2) Mondgestalten als Zwei-Antworten-Frage mit Erklärung; (3) Druckauswahl mit zwei Blättern.
- Ablauf am Bildschirm: Start → Karte wählen → Erwachsene liest vor → Kind wählt eine von zwei Antworten → Erklärung → nächste Frage oder Ende.
- Ablauf Druck: Blatt wählen → Vorschau → drucken.
- Keine Punkte, kein Rang, kein Rekord (docs/02 Z. 141–146; Eigenentwurf). Der Motor quiz-kern speichert einen Rekord und vergibt Ränge (Abschnitt 9).
- Was gedruckt wird: (a) Mondblatt mit den drei Mondgestalten. Die Zuordnung geschieht durch Ausmalen oder Verbinden, nicht durch Ankreuzen (Eigenentwurf, Abschnitt 9). (b) Beobachtungsblatt mit Feldern für Mondgestalt, Himmelsrichtung und Wetter, ohne Datum, ohne Tagesfelder, ohne Namenszeile (Eigenentwurf). Eine Karte je Blatt A4 hoch.

## 4. Daten

Datei: `apps/himmelsgucker-sonne-mond-und-sterne/daten/himmel.json` (neu). Schema mit einer Beispielzeile:

```json
{ "id": "mond-voll", "titel": "Voller Mond", "modul": "mondphasen", "erklaerung": "Der Mond ist ganz rund zu sehen.", "quelle": { "seite": "S. 138" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
ladeHimmel(datei) -> Liste<Karte>
  lies daten/himmel.json
  prüfe je Eintrag: id, titel, modul, erklaerung vorhanden
  prüfe je Eintrag: quelle.seite vorhanden ODER eigenentwurf == true
  bricht ab, wenn ein Eintrag beides nicht hat

mondphasenFrage(karten, zufall) -> Frage
  zufall ist ein Parameter (liefert Zahl von 0 bis 1), nicht in logik.mjs erzeugt
  mondKarten = Karten mit modul == "mondphasen"
  k = mondKarten[floor(zufall() * anzahl(mondKarten))]
  optionen = mischen([k.titel, zwei weitere Titel aus mondKarten ungleich k], zufall)
  gib { id: k.id, optionen, richtig: k.titel, erklaerung: k.erklaerung } zurück

beantworteMondphase(frage, auswahl) -> { richtig, erklaerung }
  richtig = (auswahl === frage.richtig)
  gib { richtig, erklaerung: frage.erklaerung } zurück
  kein Zähler, keine Rangfolge, kein Speichern

druckeBeobachtungsblatt(anzahl) -> HTML
  erzeuge anzahl Blätter A4 hoch mit Feldern Mondgestalt, Himmelsrichtung, Wetter
  prüfe: kein Datumsfeld, keine Namenszeile, keine Zeichen aus ☐☒☑✓✔★☆, keine Emojis
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Diese Einheit speichert keine Nutzerdaten. Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24; die CSP-Umsetzung ist Eigenentwurf).
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 17–30 begrenzt Datenerhebung und Kommunikation). Das Beobachtungsblatt ist Druck, keine Eingabe am Bildschirm.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Der Motor quiz-kern ist nur nach A7 zu verwenden.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Ankreuzkästchen entfallen (Konflikt mit docs/10, Z. 453; Abschnitt 9).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Sie steht auf jedem gedruckten Blatt mit Seitenangabe. Nach dem A18-Standard trägt das Blatt keine Seitenangabe, dann entfällt die Markierung.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs`: mondphasenFrage liefert bei fester Zufallsfolge genau eine richtige Option und drei verschiedene Optionen; ladeHimmel lehnt eine Karte ohne Quelle und ohne Eigenentwurf-Kennung ab; beantworteMondphase liefert kein Punktefeld.
- `test/regeln.test.mjs` (Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Druck über beide Blätter: keine Zeichen aus der Sperrliste, keine Emojis, kein Datumsfeld, keine Namenszeile; kein Speicheraufruf; keine externe Adresse.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick, Speicher gleich null, nur `localhost`.
- Druck: Zahl gedruckter Blätter gleich Auswahl; keine Zeichen; kein Datumsfeld; keine Namenszeile.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- A7 quiz-kern (Blockade): Laut docs/fragen-und-hinweise.md speichert quiz-kern den Rekord im localStorage und vergibt Ränge nach Punkten (packages/quiz-kern/src/quiz.mjs, Z. 252–255). Das widerspricht den Projektregeln. Ohne A7-Entscheidung wird nichts gebaut.
- Beobachtungstagebuch mit Tagesfeldern (docs/10, Z. 453) gegen docs/02 Z. 79–82: Entscheidung nötig. Vorschlag (Eigenentwurf): Beobachtungsfelder ohne Datum, nach Nummer geordnet.
- Mondphasen-Blatt „zum Ankreuzen“ (docs/10, Z. 453) gegen das Zeichenverbot: Vorschlag (Eigenentwurf) ist Ausmalen oder Verbinden.
- Raumfahrt: Quelle nennt Kosmonauten (S. 138), Katalog ESA. Entscheidung über die Bildauswahl (Eigenentwurf).
- A18 Seitenangaben: Standard (Vorschlag) ist, dass keine Seitenzahl auf dem Blatt steht.
- Vorlesefunktion (F2), Favicon (A3).
