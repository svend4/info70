# Bauauftrag CON-3: Meine Familie - Woerter und Rollen (Content-Pack)

Status: offen · Abschnitt: Content-Pakete, Funktionen, Dokumente · Ziel: neue App (Ordner `apps/meine-familie-woerter-und-rollen-content-pack/`)
Blockiert durch: A7 quiz-kern

## 1. Quelle

- Praleska, S. 117 (117), Abschnitt „Ребенок как член семьи“ (S. 117), Gruppe „ПОЧЕМУЧКИ“ (S. 114).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Ребенок как член семьи“ (S. 117)
  - „Я и мир вокруг меня“ (S. 117)
  - „родственных связях“ (S. 117)
  - „сын, дочь, внук“ (S. 117)
  - „домашнем труде“ (S. 117)
  - „семейном бюджете“ (S. 117)
- Umschrieben, ohne Anführungszeichen: Die Seite nennt Verwandtschaftsrollen wie Sohn, Tochter, Enkel, Schwester, Bruder und Neffe (S. 117). Sie nennt Höflichkeit wie danken, um Verzeihung bitten sowie Mitgefühl und Bewunderung zeigen (S. 117). Sie verlangt, dass alle Familienmitglieder die Hausarbeit teilen (S. 117), und eine erste Vorstellung vom Familienbudget (S. 117).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.
- Katalogeintrag: docs/10, Z. 450 (Meine Familie - Woerter und Rollen). Zielgruppe 3 bis 5 in Ko-Nutzung, Typ S, Engine quiz-kern (Content-Pack).

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 3 bis 5 Jahre in Ko-Nutzung mit Erwachsenen. Verwendung: beides (Bildschirm nur gemeinsam mit Erwachsenen, Druck einer Karte je Blatt).
- Lernziele, prüfbar (Eigenentwurf):
  1. Erwachsene findet im Modul Rollen alle sechs Verwandtschaftsrollen mit je einer Beispielkarte.
  2. Kind nennt zu einer gezeigten Rolle die passende Bezeichnung (Ko-Nutzung).
  3. Erwachsene wählt ein Modul (Haushalt, Höflichkeit oder Familienbudget) und liest die Karte vor.
  4. Erwachsene druckt eine Karte auf ein A4-Blatt ohne Namenszeile.

## 3. Funktion

- Bildschirme oder Blätter: (1) Startbildschirm mit vier Modulen: Rollen, Haushalt, Höflichkeit, Familienbudget (Benennung Eigenentwurf); (2) je Modul eine Kartenreihe mit Vorlesetext für Erwachsene; (3) Rollenquiz mit zwei Antworten je Frage und einer Erklärung nach der Antwort; (4) Druckauswahl.
- Ablauf: Startbildschirm → Modul wählen → Karte zeigen und vorlesen → Kind wählt eine von zwei Antworten → Erklärung → nächste Karte.
- Keine Punkte, kein Rang, keine Stufe, kein Rekord (docs/02 Z. 141–146; Eigenentwurf). Damit weicht die App vom Motor quiz-kern ab (Abschnitt 9).
- Was gedruckt wird: eine Karte je Blatt A4 hoch mit Titel und einem Satz. Ohne Seitenzahl (A18-Standard: Seitenangabe nur in den Daten), ohne Namenszeile, ohne Tagesfelder.

## 4. Daten

Datei: `apps/meine-familie-woerter-und-rollen-content-pack/daten/rollen.json` (weitere Dateien je Modul: `haushalt.json`, `hoeflichkeit.json`, `budget.json`). Schema mit einer Beispielzeile:

```json
{ "id": "rolle-sohn", "titel": "Sohn", "modul": "rollen", "erklaerung": "Der Sohn ist das Kind der Eltern.", "quelle": { "seite": "S. 117" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
ladeModule(dateien) -> Liste<Modul>
  lies rollen.json, haushalt.json, hoeflichkeit.json, budget.json
  prüfe je Eintrag: id, titel, modul, erklaerung vorhanden
  prüfe je Eintrag: quelle.seite vorhanden ODER eigenentwurf == true
  bricht ab, wenn ein Eintrag beides nicht hat

zeigeStartbildschirm(module) -> Bildschirm
  zeige je Modul Titel und Anzahl der Karten
  setze Fokus auf die Überschrift des Bildschirms (tabindex -1, .focus())

erzeugeQuizFrage(rollen, zufall) -> Frage
  zufall ist ein Parameter (liefert Zahl von 0 bis 1), nicht in logik.mjs erzeugt
  r = rollen[floor(zufall() * anzahl(rollen))]
  distraktoren = drei verschiedene Rollen ungleich r, gewählt über zufall
  optionen = mischen([r, ...distraktoren], zufall)
  gib { id: r.id, optionen: Liste aus (id, titel), richtig: r.id } zurück

beantworteQuizFrage(frage, auswahlId) -> { richtig, erklaerung }
  richtig = (auswahlId === frage.richtig)
  gib { richtig, erklaerung: frage.erklaerung } zurück
  kein Zähler, keine Rangfolge, kein Speichern

druckeKarte(karte) -> HTML-Blatt
  prüfe Text: keine Zeichen aus ☐☒☑✓✔★☆, keine Emojis (Unicode-Eigenschaft Extended_Pictographic)
  setze Titel und Satz; keine Seitenzahl (A18-Standard); keine Namenszeile
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Diese Einheit speichert keine Nutzerdaten. Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24; die CSP-Umsetzung ist Eigenentwurf).
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 17–30 begrenzt Datenerhebung und Kommunikation).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Der Motor quiz-kern vergibt Ränge (packages/quiz-kern/src/quiz.mjs, Z. 252–255) und ist deshalb nur nach A7 zu verwenden.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Sie steht auf jedem gedruckten Blatt mit Seitenangabe. Nach dem A18-Standard trägt das Blatt keine Seitenangabe, dann entfällt die Markierung.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt). Der Katalog nennt parallele Verwandtschaftswörter de/uk/ru (docs/10, Z. 450).

## 7. Tests

- `test/logik.test.mjs`: Quizfrage mit fester Zufallsfolge; genau eine richtige Option; Distraktoren ungleich der richtigen Rolle; mischen erhält alle Optionen; ladeModule lehnt einen Eintrag ohne Quelle und ohne Eigenentwurf-Kennung ab; beantworteQuizFrage liefert kein Punktefeld.
- `test/regeln.test.mjs`: Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs` (Druck über alle Karten: keine Zeichen aus der Sperrliste, keine Emojis, keine Namenszeile, keine Tagesfelder; kein Speicheraufruf; keine externe Adresse).

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick, Speicher gleich null, nur `localhost`.
- Druck: Zahl gedruckter Karten gleich Auswahl; keine Zeichen; keine Namenszeile.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- A7 quiz-kern (Blockade): Laut docs/fragen-und-hinweise.md speichert quiz-kern den Rekord im localStorage und vergibt Ränge nach Punkten (packages/quiz-kern/src/quiz.mjs, Z. 252–255). Das widerspricht den Projektregeln. Ohne A7-Entscheidung wird nichts gebaut.
- Falls eine Engine ohne Punkte beschlossen wird, ist der Ablauf aus Abschnitt 5 (Eigenentwurf) die Grundlage.
- A18 Seitenangaben: Standard (Vorschlag) ist, dass keine Seitenzahl auf dem Blatt steht, nur in Abschnitt 1 und in den Daten („quelle“). Ob die Pflichtmarkierung „maschinell geprüft“ auf Blättern steht, bleibt offen.
- Vorlesefunktion (F2), Favicon (A3).
