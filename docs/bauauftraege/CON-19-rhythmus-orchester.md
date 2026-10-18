# Bauauftrag CON-19: Rhythmus-Orchester-Handbuch

Status: teilweise · Abschnitt: Content-Pakete, Funktionen, Dokumente · Ziel: Ausbau von apps/rhythmus-orchester (Handbuch als Druck-Doku, kein Kinder-Bildschirm)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 86 (86–87), Abschnitt „Игра на музыкальных инструментах“ (S. 86), Gruppe „Малыши“ (S. 86).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „метрической основы“ (S. 86)
  - „ритмическом оркестре“ (S. 86)
  - „игре ритмов звукоподражаний“ (S. 86)
  - „в разных регистрах“ (S. 86)
  - „первые самостоятельные попытки“ (S. 86)
  - „Рекомендуемый музыкальный репертуар“ (S. 86)
  - „Инструментальная музыка“ (S. 87)
- Umschrieben, ohne Anführungszeichen: Die Quelle nennt sechs Ziele für das Musizieren mit Instrumenten (S. 86). Der Repertoire-Teil umfasst 43 Stücke, 19 Vokal- und 24 Instrumentalstücke (S. 86–87; eigene Zählung). Titel und Noten werden nicht übernommen, nur der Verweis mit Seitenangabe.
- Quellenbefund: nicht gefunden – offen: Der Katalog nennt das Orff-Schulwerk als Referenzrahmen. Suchbegriff Орф: kein Treffer im Quelltext. Der Bezug bleibt Eigenentwurf.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet: Haushaltsinstrumente, Körper-Percussion-Anleitung, Kapitelaufbau, Orff-Bezug.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Erwachsene (Kita-Teams und Eltern). Kinder laut Katalog 2 bis 3 Jahre; die Quelle führt die Gruppe „Малыши“ (S. 86). Verwendung: Druck. Kein Bildschirm für Kinder.
- Lernziele, prüfbar:
  1. Erwachsene findet im Handbuch die Kapitel Metrum halten, Echo-Rhythmen, Register hoch und tief und erste Improvisation (Katalog-Begriffe).
  2. Erwachsene richtet mit Haushaltsmaterial ein Körper-Percussion-Orchester ein und hält dabei ein Metrum (Eigenentwurf).
  3. Erwachsene findet die Repertoire-Verweise mit Seitenangabe (S. 86–87). Im Heft stehen keine Noten und keine Liedtexte.

## 3. Funktion

- Bildschirme oder Blätter: keine neuen Kinder-Bildschirme. Ein Handbuch als Druckansicht der App (`druck.css`), Blätter A4 hoch. Kapitel: sechs Ziele (S. 86), Instrumente aus Haushaltsmaterial, Metrum, Echo-Rhythmen, Register, erste Improvisation, Repertoire-Verweis (S. 86–87). Der Bildschirm dient nur der Auswahl der Kapitel.
- Ablauf: Kapitel wählen → Vorschau → Browser-Druck → Heft zusammenlegen (Eigenentwurf).
- Was gedruckt wird: je Kapitel ein Blatt mit Lernziel, Anleitung (Eigenentwurf) und der Seitenangabe zur Quelle, falls vorhanden. Ein Repertoire-Blatt mit der Anzahl 43 und den Seiten S. 86 und S. 87. Auf jedem Blatt mit Seitenangabe steht die Pflichtmarkierung (Abschnitt 6).
- Ausbau gegenüber dem Stand: Die App hat drei Kinder-Modi (Vers, Nachbau, Orchester), eine Elternseite (`eltern.html`) und Klänge per WebAudio ohne Mikrofon. Fehlt ist das Handbuch. Die Kinder-Modi bleiben unverändert.

## 4. Daten

Datei: `apps/rhythmus-orchester/daten/handbuch.json` (neu). Schema mit einer Beispielzeile:

```json
{ "id": "metrum", "titel": "Metrum halten", "quelle": { "seite": "S. 86" }, "eigenentwurf": true }
```

Repertoire-Zeile: `{ "id": "repertoire", "vokal": 19, "instrumental": 24, "seiten": ["S. 86", "S. 87"] }`.

## 5. Pseudocode

```
pruefeHandbuch(daten) -> Fehler[]               (neu, Eigenentwurf)
  jedes Kapitel: id, titel, und quelle.seite oder eigenentwurf == true
  repertoire.vokal + repertoire.instrumental == 43
  Reihenfolge: Ziele, Instrumente, Metrum, Echo-Rhythmen, Register, Improvisation, Repertoire
baueHandbuch(daten, auswahl) -> Blatt[]        (neu, Eigenentwurf)
  fuer jedes gewaehlte Kapitel in fester Reihenfolge: Blatt mit titel, Text, Seitenangabe
  Repertoire-Blatt: nur Anzahl und Seiten, keine Titel, keine Noten
pruefeMarkierung(blaetter) -> Fehler[]         (neu, Eigenentwurf)
  Blaetter mit Seitenangabe muessen die Pflichtmarkierung tragen
druckeHandbuch(blaetter) -> Druckzeilen        (neu, Eigenentwurf)
  keine Zeichen aus ☐☒☑✓✔★☆ und keine Emojis
```

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Werkzeuge ohne Nutzerdaten speichern nichts. Das Handbuch speichert nichts. Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen (docs/02 Z. 22–24). CSP `default-src 'self'` ist Eigenentwurf, docs/02 verlangt nur das Verbot externer Anfragen.
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 19–20 schließt Konten und personenbezogene Daten aus).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Seitenangaben nur mit Markierung (docs/02 Z. 151–152). Pflichtmarkierung auf jeder gedruckten Seite mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs`: Handbuch-Daten (sechs Ziele, Kapitelreihenfolge, Repertoire 19 + 24 = 43), `baueHandbuch`, `pruefeMarkierung` (neu).
- `test/regeln.test.mjs`: Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, nur `localhost`.
- Druck: Zahl der Blätter gleich der Auswahl; keine Zeichen; Pflichtmarkierung auf jedem Blatt mit Seitenangabe; kein Titel und keine Note des Repertoires im Druck.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Index ordnet CON-19 der Kinder-App `rhythmus-orchester` (KIN-7) zu. Das Handbuch ist laut Katalog Typ S (Dokument, PDF) für Erwachsene. Der Koordinator entscheidet die Zuordnung.
- Altersangabe: Katalog 2 bis 3, Quelle Gruppe „Малыши“ (1 bis 3). Entscheidung offen.
- Titel-Liste des Repertoires: nicht gedruckt. Rechte an den Stücken der Quelle nicht geprüft.
- Orff-Bezug: Eigenentwurf, keine Quellenstelle.
- A18: Seitenangaben auf dem Blatt. Vorlesefunktion (F2), Favicon (A3).
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
