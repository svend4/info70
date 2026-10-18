# Bauauftrag CON-14: Elternbrief-Generator Krippenjahr

Status: teilweise · Abschnitt: Content-Pakete, Funktionen, Dokumente · Ziel: Ausbau von `apps/elternbrief-generator/`
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 50 bis 58 (50–58), Abschnitt „Я И МИР ВОКРУГ МЕНЯ“ (S. 50), Gruppe „МАЛЫШИ“ (S. 50).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Я И МИР ВОКРУГ МЕНЯ“ (S. 50)
  - „ЧЕЛОВЕК И ПРИРОДА“ (S. 50)
  - „ЧЕЛОВЕК И ОБЩЕСТВО“ (S. 51)
  - „ЧЕЛОВЕК И РУКОТВОРНЫЙ МИР“ (S. 52)
  - „Примерный распорядок дня“ (S. 54)
  - „Закаливание“ (S. 56)
  - „Обеспечение безопасности“ (S. 56)
  - „Двигательная деятельность“ (S. 57)
  - „Развитие движений“ (S. 58)
- Umschrieben, ohne Anführungszeichen: Die Seiten 50 bis 58 gliedern die Ziele für die kleinsten Kinder nach Bereichen: Ich und die Welt, Natur, Gesellschaft, die vom Menschen gemachte Dingwelt und Bewegung (S. 50–58). Für die Altersstufe 1 bis 1 Jahr 6 Monate stehen Bewegungsübungen auf S. 58.
- Umschrieben: Die Seiten 54 und 55 enthalten einen Tagesablauf für Kinder im zweiten und dritten Lebensjahr (S. 54–55).
- Die Zuordnung der Themen des Briefs zu den Bereichen und die Spielideen sind Eigenentwurf (docs/10, Z. 464: Zielkataloge S. 50–58).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.
- Katalogeintrag: docs/10, Z. 464 (Elternbrief-Generator Krippenjahr). Zielgruppe Erwachsene, Bezugskinder 0 bis 3, Typ M.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte in der Krippe. Bezugskinder 1 bis 3 Jahre (App und Quelle „МАЛЫШИ“, docs/10, Rechtsrahmen Punkt 2). Der Katalog nennt 0 bis 3 (Abschnitt 9). Verwendung: Bildschirm (Erwachsene) und Druck oder Textdatei (Elternbrief).
- Lernziele, prüfbar (Eigenentwurf):
  1. Fachkraft wählt Monat, Altersband (1 bis 2 oder 2 bis 3 Jahre) und Themen; der Brief enthält nur die gewählten Themen (`baueBrief`).
  2. Fachkraft kopiert den Brief oder speichert ihn als Textdatei; der Brief enthält keinen Kindernamen (`normalisiereName`).
  3. Fachkraft druckt den Brief ohne Emojis und ohne Namenszeile (`druckText`, Ausbau).

## 3. Funktion

- Bestand (README und GDD der App): Formular mit Monat, Altersband, Themen, optionalem Einrichtungs- und Gruppennamen; Live-Vorschau; Kopieren; Export als `.txt`; „Zurücksetzen“. Die Auswahl steht im localStorage unter `ebg.auswahl`. Die Bausteine liegen in `daten/bausteine.json`: zwei Altersbänder, zwölf Monate, fünf Themen mit je einem Lern-Text und einer Spielidee je Band.
- Lücke gegen den Katalog (docs/10, Z. 464):
  - Der Katalog verlangt drei bildschirmfreie Spielideen je Brief; die App liefert je Thema eine Spielidee.
  - Der Katalog nennt Text und PDF; die App exportiert `.txt`.
  - Der Katalog nennt de, uk und ru; die App hat nur de.
  - Der Katalog nennt die Bereiche Ich, Natur, Gesellschaft, Dingwelt und Bewegung (S. 50–58). Die App nennt Bewegung, Sprache, Selbstständigkeit, Miteinander und Sinne & Entdecken.
  - Der Katalog nennt 0 bis 3 Jahre; die App hat 1 bis 2 und 2 bis 3 Jahre.
- Vorgabe aus der Vorlage: Keine Eingabefelder (Projektregel). Das Formular hat ein Freitextfeld für Einrichtungs- und Gruppennamen. Entscheidung in Abschnitt 9.
- Druck-Vorgabe: Keine Emojis auf dem Blatt (Vorlage Abschnitt 6, docs/02 Z. 79–82). Der Brief trägt heute vor jedem Thema ein Emoji (`baueBrief`). Der Druck braucht eine Fassung ohne Emoji (Ausbau).
- Was gedruckt wird: ein Brief je Blatt A4 hoch mit Kopf (nur Einrichtungs- und Gruppenname aus dem Formular), Monat und Altersband, Themen mit Entwicklungstext und Spielidee sowie Schluss. Keine Seitenzahl auf dem Blatt (A18-Standard). Keine Zeile zum Ausfüllen.
- Keine Bewertung von Kindern und keine Namen einzelner Kinder (docs/02, Z. 141–146; Brief immer über die Gruppe).

## 4. Daten

Datei: `apps/elternbrief-generator/daten/bausteine.json` (Bestand, `version` 1). Schema mit einer Beispielzeile (Feldname aus dem Bestand, neu ergänzt sind `quelle` und `eigenentwurf`):

```json
{ "id": "bewegung", "emoji": "🤸", "name": "Bewegung", "lernt": { "1-2": "…", "2-3": "…" }, "spielidee": { "1-2": "…", "2-3": "…" }, "quelle": { "seite": "S. 58" }, "eigenentwurf": true }
```

- Feld `emoji` bleibt für den Bildschirm. Der Druck lässt es weg.
- Feld `quelle.seite` nennt die Seite des Zielkatalogs (S. 50 bis 58). Die Texte `lernt` und `spielidee` tragen `eigenentwurf: true`.
- Feld `spielidee` braucht je Band drei Einträge (Katalog, docs/10, Z. 464). Der Bestand hat je Band einen Eintrag.

## 5. Pseudocode

```
pruefeBausteine(daten) -> Liste<Fehler>          (Bestand, erweitert)
  Bestand: Altersbänder >= 2, 12 Monate, >= 4 Themen, Lern-Text und Spielidee je Band mit mindestens 40 Zeichen
  neu: je Thema quelle.seite gesetzt oder eigenentwurf == true
  neu: je Thema und Band drei Spielideen (Katalog, docs/10, Z. 464)

baueBrief(daten, auswahl) -> String              (Bestand; mit emoji für den Bildschirm)
  auswahl = { monat, altersband, themenIds, kitaName, gruppenName }
  gibt '' zurück, wenn themenIds leer ist

druckText(daten, auswahl) -> String              (neu)
  wie baueBrief, ohne Feld emoji
  Kopf nur aus normalisiereName(kitaName) und normalisiereName(gruppenName)
  prüft Zeichen: keine aus ☐☒☑✓✔★☆, keine Emojis (\p{Extended_Pictographic}); bricht ab, wenn eines gefunden wird

druckBlaetter(text) -> Liste<Blatt>               (neu)
  ein Brief je Blatt A4 hoch; keine Zeile zum Ausfüllen
  Pflichtmarkierung nur, wenn der Text eine Seitenangabe enthält (A18-Standard: nein)

exportTxt(text) -> String                         (Bestand)
  liefert dieselbe Textform wie druckText; keine Netzanfrage
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Auswahl im localStorage unter `ebg.auswahl`, Löschknopf „Zurücksetzen“ für genau diesen Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache (Bestand, README).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Bestand: NetzwerkWaechter.
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 17–30). Das Freitextfeld für Einrichtungs- und Gruppennamen widerspricht dieser Regel. Entscheidung in Abschnitt 9.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Keine Kindernamen (Bestand, UI-Hinweis).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Der heutige Brief enthält vor jedem Thema ein Emoji (`baueBrief`). Export und Druck brauchen deshalb eine Fassung ohne Emoji (Abschnitt 3).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Sie steht auf jedem gedruckten Blatt mit Seitenangabe. Ohne menschliche Prüfung erfüllt keine Seitenangabe die Regel docs/02 Z. 151–152. Deshalb trägt das Blatt keine Seitenangabe (A18).
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen. Der Bestand nennt eine Fassung erst nach geprüfter Übersetzung (GDD, Erweiterungen).

## 7. Tests

- `test/logik.test.mjs` (Bestand, acht Prüfungen): Bank gültig; Spielideen bildschirmfrei; `normalisiereName` kappt auf 60 Zeichen; `baueBrief` mit Kopf und nur gewählten Themen; Altersband wählt die passenden Texte; ohne Themen leer.
- Neu in `logik.test.mjs`: `druckText` enthält kein Emoji und keine Zeichen aus der Sperrliste; `pruefeBausteine` findet Themen ohne `quelle` und ohne Eigenentwurf-Kennung; drei Spielideen je Band.
- `test/regeln.test.mjs` fehlt im Bestand. Neu nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs` (Druck ohne Zeichen aus der Sperrliste, ohne Namenszeile, ohne Emoji; Knopfhöhe 3rem; Zufall nur in `app.mjs`).

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick, Speicher nur `ebg.auswahl`, nur `localhost`.
- Druck: ein Brief je Blatt; keine Zeichen; keine Emojis; keine Namenszeile; kein Kindername im Text.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Altersband: Katalog 0 bis 3 (docs/10, Z. 464); App und Quelle „МАЛЫШИ“ 1 bis 3 (S. 50). Das Altersband 0 bis 1 ist nach docs/10, Rechtsrahmen Punkt 2, nur als Werkzeug für Erwachsene und Druck zulässig. Entscheidung nötig.
- Freitextfeld für Einrichtungs- und Gruppennamen: Konflikt mit der Projektregel „keine Eingabefelder“. Entscheidung: Auswahlliste oder Entfall.
- Themen: Katalog-Bereiche (Ich, Natur, Gesellschaft, Dingwelt, Bewegung; S. 50–58) gegen die Themen der App. Entscheidung nötig.
- Spielideen: drei je Band (Katalog) gegen eine je Thema und Band (App).
- Export: Katalog nennt PDF; App exportiert `.txt`. Entscheidung nötig.
- Fassung in uk und ru: offen (Katalog, docs/10, Z. 464).
- Emoji im Bildschirmtext: erlaubt; auf dem Druckblatt verboten (Abschnitt 3).
- Seitenangabe auf dem Druckblatt: Standard für neue Apps (A18). Keine Seitenzahl auf dem Blatt; die Angaben stehen in Abschnitt 1 und in den Daten als `quelle`.
