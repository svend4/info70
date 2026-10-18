# Bauauftrag <ID>: <Einheit>

Status: <gebaut | teilweise | offen> · Abschnitt: <Abschnitt> · Ziel: <neue App | Ausbau von apps/…>
Blockiert durch: <keine | A7 quiz-kern | A18 | …>

## 1. Quelle

- Praleska, S. <n> (<n–m>), Abschnitt „<Titel im Original>“, Gruppe „<Gruppenname>“.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „<Begriff oder Titel>“ (S. <n>)
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: <geprüft | nicht gefunden: …>.

## 2. Zielgruppe und Lernziele

- Zielgruppe: <Kinder Alter | Eltern | Fachkräfte>, Verwendung: <Bildschirm | Druck | beides>.
- Lernziele, prüfbar:
  1. <Erwachsene findet … / Kind kann … / Erwachsene druckt …>
  2. …

## 3. Funktion

- Bildschirme oder Blätter: <Liste>.
- Ablauf: <Schritt 1 → Schritt 2 → …>.
- Was gedruckt wird: <Inhalt je Blatt>, eine Karte je Blatt A4 hoch, wenn Druckkarten.

## 4. Daten

Datei: `apps/<ordner>/daten/<name>.json`. Schema mit einer Beispielzeile:

```json
{ "id": "…", "titel": "…", "quelle": { "seite": "S. n" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
<Funktionsname>(<Eingabe>) -> <Ausgabe>
  <Schritt>
  <Schritt>
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Werkzeuge ohne Nutzerdaten speichern nichts. Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs`: <Liste der Prüfungen>.
- `test/regeln.test.mjs`: Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, nur `localhost`.
- Druck: Zahl gedruckter Karten gleich Auswahl; keine Zeichen; Pflichtmarkierung je Karte.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- <Entscheidungen aus docs/fragen-und-hinweise.md, die diese Einheit betreffen>
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
