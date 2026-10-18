# Bauauftrag KIT-15: Spielbegleiter 3-5: Vom Hantieren zum Rollenspiel

Status: teilweise · Abschnitt: Kita-Werkzeuge (Fachkräfte) · Ziel: Ausbau von apps/spielbegleiter-rollenspiel/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 145 (104, 145–146), Abschnitt „Сюжетно-ролевые игры“, Gruppe „Почемучки“ (S. 104).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Сюжетно-ролевые игры“ (S. 145)
  - „Задачи“ (S. 145)
  - „конце четвертого года“ (S. 104)
  - „диады, триады“ (S. 104)
  - „от трех до пяти лет“ (S. 6)
  - „эмоциональный дискомфорт“ (S. 146)
- Umschrieben ohne Anführungszeichen: die Quelle beschreibt sieben Aufgaben fuer die Fachkraft (S. 145–146), die den Uebergang vom Spiel mit Gegenstaenden zum Rollenspiel begleiten. Der Uebergang liegt am Ende des vierten Lebensjahres; die ersten Spielgruppen sind Zweier- und Dreiergruppen (S. 104).
- Der Diagnoseteil auf S. 146 (Beobachtung einzelner Kinder mit Blick auf emotionales Unbehagen) wird nicht uebernommen; der Bezug steht im Zitat oben.
- Nicht gefunden – offen:
  - Spielideen je Entwicklungsschritt (Katalogangabe). Suchbegriffe auf S. 104, 145, 146: Idee, Beispiel; keine Treffer.
  - Kurze Verlaufsdokumentation (Katalogangabe). Suchbegriff Dokumentation auf S. 104, 145, 146: keine Treffer.
- Checkliste und Karten-Titel sind Eigenentwurf.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: <ausstehend>.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte mit Kindern von 3 bis 5 Jahren (Quelle: Altersbereich „Почемучки“, S. 6). Verwendung: Druck (Karten) und Checkliste.
- Lernziele, prüfbar:
  1. Die Fachkraft kennt die sieben Aufgaben (S. 145–146) und ordnet jede einer Karte zu.
  2. Die Fachkraft prueft mit der Checkliste Ersatzgegenstaende, Spielgruppen und Platz fuer Rollenspiele (Eigenentwurf).
  3. Die Karten enthalten keinen Diagnoseteil und keine Bewertung einzelner Kinder.

## 3. Funktion

- Katalog verlangt (docs/10, Eintrag KIT-15): Impulskartei und Checkliste fuer Fachkraefte; Uebergang vom gegenstaendlichen Spiel zum Rollenspiel begleiten; Rollenangebote; Gruppengroesse Diade und Triade beachten; Spielideen je Entwicklungsschritt; kurze Verlaufsdokumentation. Adaptation: deutsche Fachsprache; Bezug auf § 22a SGB VIII; keine Kinderdaten in der Cloud.
- App leistet schon (README, GDD, `logik.mjs`):
  - sieben Aufgabenkarten mit Seite und Bezugsbegriff;
  - Faktenkarte zum Uebergang und zu den Spielgruppen (S. 6, S. 104);
  - Checkliste fuer Erwachsene (Eigenentwurf);
  - Druck der Karten;
  - keine Eingabe, keine Namen, keine Speicherung.
- Bildschirme: Kartenuebersicht mit neun Karten (sieben Aufgaben, eine Faktenkarte, eine Checkliste); Druckansicht.
- Ablauf: Karte waehlen → Aufgabe lesen → Checkliste ansehen → Drucken.
- Was gedruckt wird: die gewaehlten Karten, eine Karte je Blatt A4 hoch; keine Seitenzahl auf dem Blatt (A18-Standard).
- Luecke: Spielideen je Entwicklungsschritt und Verlaufsdokumentation sind nicht gebaut, weil die Quelle sie nicht enthaelt. Rollenangebote sind nur als Aufgabe beschrieben, nicht als Liste. Offen in Abschnitt 9.

## 4. Daten

Datei: `apps/spielbegleiter-rollenspiel/daten/karten.json`. Schema: je Karte `id`, `titel` (Eigenentwurf), `quellbegriff` (Quelle, höchstens 6 Wörter), `quelle.seite`. Schema mit einer Beispielzeile:

```json
{ "id": "aufgabe-1", "titel": "Rollenspiel begleiten", "quellbegriff": "Сюжетно-ролевые игры", "quelle": { "seite": "S. 145" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
ladeKarten(pfad = "daten/karten.json") -> {aufgaben, fakten, checkliste}
  Schritt 1: Datei lesen; bei Fehler Abbruch
  Schritt 2: aufgaben hat 7 Eintraege; quelle.seite ist „S. 145“ oder „S. 146“
  Schritt 3: fakten hat die Seiten „S. 6“ und „S. 104“
  Schritt 4: keine Felder verlauf, diagnose, beobachtung oder name

aufgabeVon(karten, id) -> Aufgabe
  Schritt 1: id suchen; unbekannte id ergibt Fehler

kartenFuer(karten, auswahlIds) -> Karte[]
  Schritt 1: ist auswahlIds leer, alle neun Karten in Katalogreihenfolge
  Schritt 2: sonst nur die gewaehlten Karten in Katalogreihenfolge

pruefeDaten(karten) -> Fehlerliste
  Schritt 1: Muster fuer Verlauf, Diagnose und Namen in keinem Text (Test)
  Schritt 2: jeder quellbegriff hoechstens 6 Woerter
  Schritt 3: Altersangabe „3 bis 5 Jahre“ hat die Quelle „S. 6“
  Schritt 4: Liste der Fehler leer, sonst Testfehler

druckeAuswahl(karten, auswahlIds) -> HTML
  Schritt 1: kartenFuer(karten, auswahlIds) aufrufen
  Schritt 2: eine Karte je Blatt; Anzahl Blaetter gleich Anzahl gewaehlter Karten
  Schritt 3: keine Namenszeile, keine Zeichen ☐☒☑✓✔★☆, keine Seitenzahl auf dem Blatt
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Die App speichert nichts (logik.mjs Z. 13).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Die App hat nur Auswahl-Knoepfe.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Der Diagnoseteil S. 146 ist ausgeschlossen.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50). Die App-Dokumentation nennt 44 px; siehe Abschnitt 9.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Die Markierung gilt für jede Anzeige mit Seitenangabe. Die Karten tragen nach dem A18-Standard keine Seitenangabe.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden, laut README 16 Tests): sieben Aufgaben auf S. 145 oder 146, Fakten mit Seite, Abweisung von Feldern nach Kind, keine Lernziele fuer Kinder, Abweichung nennt die Verlaufsdokumentation, Gegenproben.
- `test/regeln.test.mjs` (fehlt, anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Druck ohne Zeichen, Knopfhoehe 48 px, keine Modellnamen.

## 8. Abnahme

- `npm test` im App-Ordner gruen; Testzahl in README und GDD stimmt.
- Browser bei 360 px: neun Karten sichtbar, Knoepfe mindestens 48 px, kein Ueberlauf, keine externen Anfragen, Speicher gleich null.
- Druck: Zahl gedruckter Karten gleich Auswahl; keine Zeichen; keine Seitenzahl auf dem Blatt.
- Registrierung nur durch den Koordinator.

## 9. Offen

- Spielideen je Entwicklungsschritt und Verlaufsdokumentation: die Quelle enthaelt beides nicht (siehe Abschnitt 1). Entscheidung: aus dem Katalog streichen oder als Eigenentwurf mit Kennzeichnung aufnehmen.
- Rollenangebote: nur als Aufgabe beschrieben; eine Liste von Rollen ist nicht gebaut. Entscheidung, ob sie als Eigenentwurf aufgenommen wird.
- Diagnoseteil S. 146: bewusst nicht uebernommen. Bestaetigen.
- Aufgaben im russischen Wortlaut: die README sagt, die sieben Aufgaben stehen „mit russischem Wortlaut“ auf den Karten. Das widerspricht docs/10, Rechtsrahmen Punkt 1 (keine ganzen Sätze). Auf deutsche Umschreibung mit Seitenangabe umstellen; Titel und Begriffe bleiben russisch.
- Knopfhoehe: die README nennt 44 px, die Regel verlangt 48 px (docs/02 Z. 50). Angleichen.
- Seitenzahlen auf den Karten: die App zeigt die Seite je Karte. Nach dem A18-Standard stehen Seiten nur in den Daten und in Abschnitt 1.
- Checkliste ist Eigenentwurf. Die GDD empfiehlt eine Lesung durch eine Fachkraft aus einer deutschen Kita, bevor sie in der Ausbildung eingesetzt wird.
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Zitatgrenze: dieser Bauauftrag nutzt 6 Woerter (docs/10). A10 fragt, ob 12 gelten sollen (offen).
