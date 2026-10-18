# Bauauftrag KIT-14: Natur-Fürsorge-Karten (ohne Beobachtungsprotokoll)

Status: teilweise · Abschnitt: Kita-Werkzeuge (Fachkräfte) · Ziel: Ausbau von apps/natur-fuersorge-karten/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 96 (96), Abschnitt „Труд в природе“, Gruppe „Малыши“ (S. 96). Altersangabe auf S. 6 und S. 44.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Труд в природе“ (S. 96)
  - „Задачи“ (S. 96)
  - „ранний возраст“ (S. 6)
  - „полить комнатные растения“ (S. 96)
  - „покормить птичек, рыбок“ (S. 96)
  - „собрать овощи“ (S. 96)
- Umschrieben ohne Anführungszeichen: die Quelle nennt vier Aufgaben für die Fachkraft (S. 96). Sie betreffen das Interesse an der Pflege durch Erwachsene, die Freude an Pflanzen und Tieren, eigene einfache Pflegehandlungen und das Gespür für den richtigen Zeitpunkt der Pflege. Die Altersstufe ist 1 bis 3 Jahre (S. 6 und S. 44).
- Nicht gefunden – offen:
  - Mini-Protokoll, welches Kind welche Handlung selbstständig zeigt (Katalogangabe). Suchbegriff протокол im gesamten Text: keine Treffer; die Beobachtung einzelner Kinder ist im Abschnitt nicht vorgesehen.
  - Bezug zu Bildung für nachhaltige Entwicklung und zu Landesplänen (Katalogangabe). Suchbegriff устойчивое развитие auf S. 96: keine Treffer; die Quelle ist ein belarussisches Programm ohne Länder.
- Anregungen auf den Karten und die Checkliste für Erwachsene sind Eigenentwurf.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft; das Skript meldet für diese Datei keine Fehler.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte mit Kindern von 1 bis 3 Jahren. Der Katalog nennt „2–3“; die Korrekturnotiz im Katalog und die Quelle (S. 6, S. 44) nennen 1 bis 3. Dieser Bauauftrag folgt der Korrektur. Verwendung: Druck.
- Lernziele, prüfbar:
  1. Die Fachkraft kennt die vier Aufgaben der Quelle (S. 96) und ordnet jeder Handlungskarte eine davon zu (Eigenentwurf).
  2. Die Fachkraft wählt eine Handlungskarte (gießen, füttern oder ernten) und druckt sie mit der Checkliste.
  3. Die Checkliste nennt den Zeitpunkt der Pflege und enthält keine Notiz über einzelne Kinder (Eigenentwurf).

## 3. Funktion

- Katalog verlangt (docs/10, Eintrag KIT-14): Karten für erste Naturpflege-Handlungen (gießen, Vögel füttern, ernten); ein Mini-Protokoll, welches Kind welche Handlung selbstständig zeigt; Erwachsenen-Checkliste mit Bericht (optional), sonst Druckmaterial. Adaptation: heimische Arten, Jahreszeitenlauf, Bezug zu Bildung für nachhaltige Entwicklung; Protokoll lokal ohne personenbezogene Cloud-Daten.
- App leistet schon (README, GDD, `logik.mjs`):
  - vier Aufgaben aus S. 96 als Karten;
  - drei Handlungskarten mit dem Textbeispiel aus der Quelle und einer Anregung (Eigenentwurf);
  - Checkliste für Erwachsene (Eigenentwurf);
  - Druck von Karten und Checkliste;
  - keine Eingabe, kein Name, keine Speicherung.
- Bildschirme: Aufgabenübersicht; Handlungskarten; Checkliste; Druckansicht.
- Ablauf: Aufgabe lesen → Handlungskarte wählen → Checkliste ansehen → Drucken.
- Was gedruckt wird: die gewählten Handlungskarten (Titel, Textbeispiel als Begriff, Anregung als Eigenentwurf) und die Checkliste; eine Karte je Blatt A4 hoch; keine Seitenzahl auf dem Blatt (A18-Standard).
- Lücke: das Mini-Protokoll ist nicht gebaut (Entscheidung in Abschnitt 9). Bildung für nachhaltige Entwicklung und Landespläne sind nicht gebaut, weil die Quelle sie nicht enthält. Der Bericht ist nicht gebaut (im Katalog optional).

## 4. Daten

Datei: `apps/natur-fuersorge-karten/daten/karten.json`. Schema: je Karte `id`, `titel` (Eigenentwurf), `quellbegriff` (Quelle, höchstens 6 Wörter), `quelle.seite`. Schema mit einer Beispielzeile:

```json
{ "id": "giessen", "titel": "Gießen", "quellbegriff": "полить комнатные растения", "quelle": { "seite": "S. 96" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
ladeKarten(pfad = "daten/karten.json") -> {aufgaben, handlungen, checkliste}
  Schritt 1: Datei lesen; bei Fehler Abbruch
  Schritt 2: aufgaben hat 4 Einträge mit quelle.seite „S. 96“
  Schritt 3: handlungen hat 3 Einträge (giessen, fuettern, ernten)

zielVon(karte) -> Altersgruppe
  Schritt 1: „1 bis 3 Jahre“ zurückgeben
  Schritt 2: der Katalogwert „2 bis 3“ ergibt einen Testfehler

kartenFuer(karten, handlungIds) -> Karte[]
  Schritt 1: ist handlungIds leer, alle drei Handlungskarten und die Checkliste
  Schritt 2: sonst nur die gewählten Handlungskarten

quelleTextVon(karte) -> Text
  Schritt 1: quellbegriff und Seite ausgeben, zum Beispiel „полить комнатные растения“ (S. 96)
  Schritt 2: kein Satz aus der Quelle; höchstens 6 Wörter

pruefeDaten(karten) -> Fehlerliste
  Schritt 1: keine Felder name, protokoll, verlauf, beobachtung, notiz oder geburtsdatum (Muster im Test)
  Schritt 2: jeder quellbegriff höchstens 6 Wörter
  Schritt 3: Liste der Fehler leer, sonst Testfehler

druckeAuswahl(karten, handlungIds) -> HTML
  Schritt 1: kartenFuer(karten, handlungIds) aufrufen
  Schritt 2: Anzahl Karten gleich Anzahl gewählter Handlungen plus Checkliste, wenn gewählt
  Schritt 3: keine Namenszeile, keine Zeichen ☐☒☑✓✔★☆, keine Seitenzahl
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Die App speichert nichts (logik.mjs Z. 19).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Die App hat nur Auswahl-Knöpfe.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Das Mini-Protokoll ist ausgeschlossen (Abschnitt 9).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50). Die App-Dokumentation nennt 44 px; siehe Abschnitt 9.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Die Markierung gilt für jede Anzeige mit Seitenangabe. Die Karten tragen nach dem A18-Standard keine Seitenangabe.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden, laut README 18 Tests): vier Aufgaben auf S. 96, Handlungen als Textbeispiele, Eigenentwurf je Karte, Abweisung von Feldern nach Kind, Altersangabe 1 bis 3, Filter, Gegenproben.
- `test/regeln.test.mjs` (fehlt, anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Druck ohne Zeichen, Knopfhöhe 48 px, keine Modellnamen.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: vier Aufgaben am Anfang, Filter, Knöpfe mindestens 48 px, kein Überlauf, keine externen Anfragen, Speicher gleich null.
- Druck: Zahl gedruckter Karten gleich Auswahl; keine Zeichen; keine Seitenzahl auf dem Blatt.
- Registrierung nur durch den Koordinator.

## 9. Offen

- Mini-Protokoll je Kind: der Katalog verlangt es, die Quelle hat dafür keine Grundlage (siehe Abschnitt 1). Notizen über einzelne Kinder sind nach docs/02 Z. 141–146 ausgeschlossen. Entscheidung: nicht bauen (Ist-Stand) oder aus dem Katalog streichen.
- Bildung für nachhaltige Entwicklung und Landespläne: nicht im Text. Katalog-Korrektur.
- Altersangabe: die Katalogzeile nennt 2–3, die Korrekturnotiz nennt 1 bis 3 (S. 6, S. 44). Die Zeile in docs/10 ist noch nicht angepasst.
- Aufgaben im russischen Wortlaut: die README sagt, die vier Aufgaben stehen auf den Karten „mit russischem Wortlaut“. Das widerspricht docs/10, Rechtsrahmen Punkt 1 (keine ganzen Sätze). Auf deutsche Umschreibung mit Seitenangabe umstellen; Titel und Begriffe bleiben russisch.
- Knöpfhöhe: erledigt. Die Knöpfe und der Fußlink sind 48 px hoch (Entscheidung und Messung in der Prüfung).
- Seitenzahlen auf den Karten: die App zeigt die Seite je Karte. Nach dem A18-Standard stehen Seiten nur in den Daten und in Abschnitt 1.
- Katalog-Angabe „S“ (Aufwand) ist laut GDD ungeklärt.
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Zitatgrenze: dieser Bauauftrag nutzt 6 Wörter (docs/10). A10 fragt, ob 12 gelten sollen (offen).
