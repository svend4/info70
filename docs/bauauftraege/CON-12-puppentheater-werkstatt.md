# Bauauftrag CON-12: Puppentheater-Werkstatt (Content-Pack)

Status: teilweise · Abschnitt: Content-Pakete, Funktionen, Dokumente · Ziel: Ausbau von `apps/puppentheater-werkstatt/` (Index-Feld `app` ist leer, der Ordner existiert; siehe Abschnitt 9)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 287 bis 288 (287–288), Abschnitt „Рекомендуемая тематика детских работ“ (S. 288), Gruppe „ФАНТАЗЕРЫ“ (S. 288). Die Gestaltungsaufgaben stehen auf S. 287 und S. 288 im Kapitel „Развиваемся в деятельности“ (S. 287).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Рекомендуемая тематика детских работ“ (S. 288)
  - „Дизайн для кукольного театра“ (S. 288)
  - „Афиша для выставки“ (S. 288)
  - „Пригласительные билеты для выставки“ (S. 288)
  - „Одежда для кукол“ (S. 288)
  - „Скульптура для парка“ (S. 288)
  - „Дизайнеры-фантазеры“ (S. 288)
- Umschrieben, ohne Anführungszeichen: Die Seiten nennen Gestaltungsaufgaben für Kinder: Entwürfe für Figuren, Kulissen und Dekorationen, Plakate und Einladungen für eine Ausstellung sowie Kleidung für Puppen (S. 287–288). Die Aufgaben sind als Design in der Rolle von Gestaltern angelegt (S. 287).
- Umschrieben: Die Gruppe „ФАНТАЗЕРЫ“ wird auf S. 199 mit dem sechsten und siebten Lebensjahr beschrieben. S. 200 nennt Kinder von fünf bis sechs Jahren. Das stützt die Altersangabe 5 bis 7 als Lesart (Abschnitt 2).
- Die Geschichten des Generators, der Stückanfang und die deutschen Titel sind Eigenentwurf (docs/10, Z. 459: alle Geschichten eigenerzeugt).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.
- Katalogeintrag: docs/10, Z. 459 (Puppentheater-Werkstatt, Content-Pack). Zielgruppe 5 bis 7, Typ S.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 5 bis 7 Jahre (docs/10, Z. 459; die Altersangabe ist nach S. 199 eine Lesart, siehe Abschnitt 9). Verwendung: Druck (Gestaltungsauftrag je Blatt) und Bildschirm (Generator für Erwachsene).
- Lernziele, prüfbar (Eigenentwurf):
  1. Erwachsener wählt einen Gestaltungsauftrag (Plakat, Einladung, Kulisse, Puppe, Kleidung) und druckt eine Auftragskarte je A4-Blatt hoch.
  2. Erwachsener erzeugt aus festen Bausteinen einen Stückanfang mit der gewählten Figur und dem gewählten Schauplatz (`stueckAnfang`) und liest ihn vor.
  3. Kind gestaltet nach der gedruckten Karte mit eigenem Material; die App bewertet das Ergebnis nicht (Eigenentwurf).

## 3. Funktion

- Bestand: Der Index führt das Feld `app` leer; der Ordner `apps/puppentheater-werkstatt/` ist im Repo vorhanden. Eine Beschreibung des Bestands ist in diesem Bauauftrag nicht enthalten (siehe Abschnitt 9).
- Katalog: Generator mit einem Mini-Stückanfang und Gestaltungsaufträgen (docs/10, Z. 459). Der Kulturtransfer ist doppelt angelegt: die deutsche Kasperle- und Schattentheater-Tradition als Standard; ein optionales Modul für ukrainische und belarussische Familien ist im Katalog genannt, im Quelltext S. 287–288 aber nicht belegt (Abschnitt 9).
- Ablauf: Auftrag oder Figur wählen → Schauplatz wählen → Stückanfang erzeugen (`stueckAnfang`) → vorlesen → optional drucken.
- Was gedruckt wird: eine Auftragskarte je Blatt A4 hoch mit Auftragstitel, Kurzbeschreibung und einer Zeile „Material“ (Eigenentwurf). Der Stückanfang wird nur am Bildschirm gezeigt. Keine Seitenzahl auf dem Blatt (A18-Standard). Keine Namenszeile.
- Keine Punkte, keine Bewertung und keine Auswertung eines Kindes (docs/02, Z. 141–146).

## 4. Daten

Datei: `apps/puppentheater-werkstatt/daten/` (Ordner vorhanden). Der Name und das Schema der vorhandenen Datei werden in der Ausbau-Sitzung gegen das folgende Schema geprüft. Schema mit einer Beispielzeile:

```json
{ "id": "plakat", "typ": "plakat", "de": "Plakat", "ru": "Афиша для выставки", "quelle": { "seite": "S. 288" }, "eigenentwurf": false }
```

- Feld `typ` nur aus: `plakat`, `einladung`, `kulisse`, `puppe`, `kleidung`.
- Feld `quelle.seite` nur „S. 287“ oder „S. 288“, wenn der Titel aus dem Quelltext stammt. Bausteine für den Stückanfang tragen `eigenentwurf: true`.
- Feld `uk` für Titel bleibt offen (Abschnitt 9).

## 5. Pseudocode

```
ladeAuftraege(daten) -> Liste<Auftrag>
  prüfe je Eintrag: id, de, typ in {plakat, einladung, kulisse, puppe, kleidung}
  bricht ab, wenn ein Pflichtfeld fehlt
  gib daten.auftraege in Dateireihenfolge zurück

pruefeAuftraege(daten) -> Liste<Fehler>
  Fehler, wenn quelle.seite nicht in {S. 287, S. 288} liegt
  Fehler, wenn ein Eintrag weder quelle.seite noch eigenentwurf == true hat
  Fehler, wenn der Titel „Eintrittskarte“ enthält (S. 288 nennt Einladungen, siehe Abschnitt 9)

auftragFuer(daten, id) -> Auftrag | null
  gib den Eintrag mit dieser id zurück; null bei unbekannter id

stueckAnfang(daten, auswahl) -> { absaetze, pflicht }
  auswahl = { figur: id, schauplatz: id }; bricht ab, wenn ein Feld fehlt
  setzt die Absätze aus den Bausteinen zusammen; Platzhalter {figur} und {schauplatz} werden ersetzt
  keine Zufallsquelle; die Reihenfolge der Bausteine ist fest
  pflicht = PFLICHTMARKIERUNG, wenn ein Absatz eine Seitenangabe trägt, sonst null

druckBlaetter(auftraege) -> Liste<Blatt>
  je Auftrag ein Blatt A4 hoch; keine Zeichen aus ☐☒☑✓✔★☆, keine Emojis (\p{Extended_Pictographic})
  erzeugt keine Namenszeile
  Pflichtmarkierung nur, wenn ein Blatt eine Seitenangabe trägt (A18-Standard: keine)
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Werkzeuge ohne Nutzerdaten speichern nichts.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 17–30). Nur Auswahl aus Listen; kein Freitext für den Stückanfang.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Sie steht auf jedem gedruckten Blatt mit Seitenangabe. Ohne menschliche Prüfung erfüllt keine Seitenangabe die Regel docs/02 Z. 151–152. Deshalb trägt das Blatt keine Seitenangabe (A18).
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: die Titel stehen in de und ru; eine Fassung in uk ist offen. Der Katalog nennt die Fassung in uk und ru (docs/10, Z. 459).

## 7. Tests

- `test/logik.test.mjs`: Bank gültig (Pflichtfelder, sechs Typen gedeckt); `pruefeAuftraege` findet Einträge außerhalb S. 287–288; `stueckAnfang` ergibt dieselbe Ausgabe für dieselbe Auswahl; `stueckAnfang` bricht ohne vollständige Auswahl ab.
- `test/regeln.test.mjs`: Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs` (Druck ohne Zeichen aus der Sperrliste, ohne Namenszeile; Knopfhöhe 3rem; Zufall nur in `app.mjs`).

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick, Speicher gleich null, nur `localhost`.
- Druck: eine Auftragskarte je Blatt; keine Zeichen; keine Namenszeile; Zahl gedruckter Karten gleich Auswahl.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Index-Feld `app` für CON-12 ist leer, obwohl `apps/puppentheater-werkstatt/` im Repo liegt. Korrektur durch den Koordinator (`tools/bauauftrag-index.mjs`). Diese Sitzung ändert den Index nicht.
- Altersangabe 5 bis 7: eine Lesart (S. 199). Entscheidung nötig.
- Vertep- und Batleika-Modul (docs/10, Z. 459): im Quelltext S. 287–288 nicht belegt. Entscheidung: streichen oder mit anderer Quelle belegen.
- Eintrittskarten (docs/10, Z. 459): S. 288 nennt Einladungen für eine Ausstellung. Der Auftragstyp heißt deshalb „einladung“.
- Fassung in uk und ru: offen.
- Seitenangabe auf dem Druckblatt: Standard für neue Apps (A18). Keine Seitenzahl auf dem Blatt; die Angaben stehen in Abschnitt 1 und in den Daten als `quelle`.
