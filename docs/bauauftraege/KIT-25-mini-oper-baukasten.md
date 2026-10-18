# Bauauftrag KIT-25: Mini-Oper-Baukasten

Status: teilweise · Abschnitt: Kita-Werkzeuge (Fachkräfte) · Ziel: Ausbau von apps/mini-oper-baukasten/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 262 (262–270), Abschnitte „Песенно-игровое и песенно-инструментальное творчество“ (S. 262) und „Музыкальные инсценировки, сказки-драматизации“ (S. 269), Gruppe „ФАНТАЗЕРЫ“.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Группа «ФАНТАЗЕРЫ»“ (S. 262)
  - „Песенно-игровое и песенно-инструментальное творчество“ (S. 262)
  - „сочинению микроопер по сказкам“ (S. 262)
  - „стрекоза, муравей, бегемот“ (S. 262)
  - „физкультурник, снеговик“ (S. 262)
  - „Музыкальные инсценировки, сказки-драматизации“ (S. 269)
  - „Гадкий утенок“ (S. 269)
  - „Принцесса на горошине“ (S. 269)
  - „Аленушка и лиса“ (S. 269)
  - „тембр инструмента“ (S. 270)
- Umschrieben ohne Anführungszeichen: Die Quelle nennt als Ziel, Kinder zu gemeinsamen Liedimprovisationen und zum Komponieren von Mikroopern nach Märchen anzuregen (S. 262). Der Klang eines Instruments soll zum Charakter der Musik oder zu einem Teil des Stücks passen (S. 270). Auf S. 269 stehen 18 Titel für Musik-Inszenierungen und Märchen-Dramatisierungen, darunter Musikwerke und ein belarussisches Volksspiel (S. 269).
- Nicht gefunden – offen:
  - Zuordnung Instrument zu Figur (Katalog): Suchbegriff „инструмент“ auf S. 262–270. Die Quelle nennt nur die Klangfarbe nach Charakter der Musik (S. 270); eine Figur-Instrument-Zuordnung steht nicht darin.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft; das Skript meldet für diese Datei keine Fehler.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Erwachsene (Musikfachkräfte und Kita-Team) für Gruppen mit Kindern von 5 bis 7 Jahren (Katalog). Verwendung: Bildschirm (Gerüst) und Druck (Gerüstbogen).
- Lernziele, prüfbar:
  1. Die Fachkraft legt die Anzahl der Szenen (3 bis 5) und der Rollenplätze (2 bis 6) fest; das Gerüst zeigt genau diese Anzahl.
  2. Die Fachkraft zieht vier Requisiten aus der festen Liste; die Liste ist sichtbar und wird nicht gespeichert.
  3. Die Fachkraft druckt einen Gerüstbogen mit leeren Linien, ohne Kästchen, Häkchen oder Namenszeile.

## 3. Funktion

- Katalog verlangt (docs/10, Eintrag Nr. 91, Typ: Geschichten-Generator): einen Generator für Aufführungsskripte mit Rollenkarten, Szenenfolge, Klang-Hinweisen (welches Instrument für welche Figur) und Requisitenliste; Märchen-Adaptionen; eine uk/ru-Option. Der Zusatz zur Anbindung im Katalogtyp entfällt (docs/10, Welle 88); keine Anfragen nach außen und keine Dienste Dritter (docs/02 Z. 22–24).
- App leistet schon (README, GDD, `logik.mjs`):
  - Szenen von 3 bis 5 (`SZENEN`, Eigenentwurf) als Liste leerer Zeilen mit Stichwort-Feld;
  - Rollenplätze von 2 bis 6 (`ROLLEN`, Eigenentwurf) mit Nummern;
  - Figuren-Vorschläge aus S. 262 (`FIGUREN`), deutsche Namen als Eigenentwurf;
  - 18 Titel aus S. 269 (`TITEL`) ohne Text und Musik, in der Schreibweise der Quelle;
  - vier Requisiten aus einer festen Liste (`REQUISITEN`), zufällig gezogen über eine übergebene Funktion, dazu eine freie Zeile (Eigenentwurf);
  - Klang-Hinweis nach S. 270 (`KLANG_HINWEIS`, sinngemäß) und Instrumentenbeispiele (`INSTRUMENTE`, Eigenentwurf ohne Quellenbezug);
  - Gerüstbogen zum Drucken; keine Speicherung; keine Anfrage an fremde Adressen.
- Lücke:
  - Kein Skript: Die App schreibt weder Handlung noch Text. Der Hinweis `IMPULS_HINWEIS` sagt, das Gerüst ist ein Impuls, kein fertiges Skript.
  - Keine Figur-Instrument-Zuordnung: Die Quelle gibt keine vor; die App ordnet keine zu.
  - Keine Märchen-Texte und keine uk/ru-Option.
- Bildschirme: Gerüst-Seite mit Anzahl Szenen und Rollen, Titelauswahl, Ziehen der Requisiten, Klang-Hinweis; Druckknopf für den Gerüstbogen.
- Ablauf: Szenen- und Rollenzahl wählen → Titel wählen → Requisiten ziehen → Gerüst prüfen → Gerüstbogen drucken.
- Was gedruckt wird (Soll): der Gerüstbogen mit leeren Linien für Szenen, Rollen und Requisiten; der gewählte Titel als Überschrift (Entscheidung in Abschnitt 9). Keine Eingaben vom Bildschirm.

## 4. Daten

Keine Datendatei. Die Daten stehen in `apps/mini-oper-baukasten/logik.mjs` (`TITEL`, `FIGUREN`, `REQUISITEN`, `INSTRUMENTE`, `SEITE`). Ziel-Form für eine Auslagerung der Titel, Vorlage-Form mit einer Beispielzeile:

```json
{ "id": "titel-07", "titel": "Гадкий утенок", "quelle": { "seite": "S. 269" }, "eigenentwurf": false }
```

Datei bei Auslagerung: `apps/mini-oper-baukasten/daten/titel.json`. Ist-Stand: Die Titel sind Quelle; der Eintrag ist nicht Eigenentwurf.

## 5. Pseudocode

```
szenenAnzahl(wert) -> Zahl
  Schritt 1: begrenze(wert, SZENEN.min = 3, SZENEN.max = 5, SZENEN.standard = 3)
  Schritt 2: Rückgabe ist eine ganze Zahl von 3 bis 5

rollenAnzahl(wert) -> Zahl
  Schritt 1: begrenze(wert, ROLLEN.min = 2, ROLLEN.max = 6, ROLLEN.standard = 2)

erzeugeSzenen(anzahl) -> Szene[]
  Schritt 1: anzahl = szenenAnzahl(anzahl)
  Schritt 2: Liste mit anzahl leeren Zeilen; je Zeile ein Stichwort-Feld (Eingabe nur im Speicher der Seite)

erzeugeRollen(anzahl) -> Rolle[]
  Schritt 1: anzahl = rollenAnzahl(anzahl)
  Schritt 2: Platzhalter mit Nummer 1 bis anzahl; keine Namen

pruefeZufall(rng) -> ok
  Schritt 1: rng muss eine Funktion sein; sonst Fehler
  Schritt 2: der Zufall kommt nur als Parameter in die Logikdatei

erzeugeRequisiten(rng, anzahl = REQUISITEN_ANZAHL = 4) -> Requisit[]
  Schritt 1: pruefeZufall(rng)
  Schritt 2: ziehe(REQUISITEN, anzahl, rng) ohne Wiederholung
  Schritt 3: freie Zeile als zusätzlicher leerer Eintrag

titelGueltig(titel) -> wahr oder falsch
  Schritt 1: null gilt als gültig (kein Titel gewählt)
  Schritt 2: sonst titel ist Element von TITEL (18 Einträge, S. 269)

erzeugeGeruest({szenen, rollen, titel, requisiten}, rng) -> Geruest
  Schritt 1: szenen = szenenAnzahl(szenen); rollen = rollenAnzahl(rollen)
  Schritt 2: titel nur übernehmen, wenn titelGueltig(titel)
  Schritt 3: requisiten, falls leer, über erzeugeRequisiten(rng) ziehen
  Schritt 4: KLANG_HINWEIS (S. 270) und IMPULS_HINWEIS anhängen
  Schritt 5: Rückgabe {szenen, rollen, titel, requisiten, hinweise}; keine Figur-Instrument-Zuordnung

druckeGeruest(geruest) -> HTML
  Schritt 1: je Szene und je Rolle eine leere Linie; je Requisit eine leere Zeile
  Schritt 2: Titel als Überschrift nur, wenn titel gesetzt ist (Entscheidung Abschnitt 9)
  Schritt 3: keine Kästchen, keine Häkchen, keine Namenszeile, keine Eingabefelder
```

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Werkzeuge ohne Nutzerdaten speichern nichts. Ist-Stand: keine Speicherung (README, GDD). Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Ist-Stand: keine Anfrage an fremde Adressen (Test in `test/logik.test.mjs`).
- [ ] Keine Eingabefelder (Projektregel der Vorlage). Ist-Stand: Stichwort-Felder und eine freie Zeile vorhanden; Eingaben nur im Speicher der Seite. Entscheidung in Abschnitt 9.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Ist-Stand: Rollen sind Platzhalter; keine Namen (GDD).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Ist-Stand: Gerüstbogen ohne Kästchen, Häkchen und Namenszeile (GDD, Test).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50). Ist-Stand: keine Browserprobe (GDD); offen.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ (docs/02 Z. 151–152). Ist-Stand: Der Gerüstbogen trägt heute keine Seitenangabe; wird der Titel mit Seite gedruckt, gilt die Markierung.
- [ ] Keine Modellnamen in Dateien. Der Anwendungsname (Zusatz in `APP_NAME`) ist zu bestätigen oder zu ändern (Abschnitt 9). Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden, laut README 19 Tests): Szenen- und Rollenzahlen, deterministische Auswahl über die übergebene Zufallsquelle, Titel und Figuren wörtlich mit Seite, Klang-Hinweis ohne Figur-Instrument-Zuordnung, keine externen Adressen, keine verbotenen Begriffe, keine Kästchen, Häkchen oder Namenszeile, kein Speicherzugriff.
- `test/regeln.test.mjs` (fehlt, anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Druck ohne Zeichen, Netzwerk, Modellnamen, Knopfhöhe 48 px.

## 8. Abnahme

- `node --test apps/mini-oper-baukasten/test/*.test.mjs` grün; Testzahl 19 in README und GDD stimmt.
- Browser bei 360 px (fehlt laut GDD): Szenen, Rollen, Titel, Requisiten, Druck, kein Überlauf, Knöpfe mindestens 48 px.
- Druck: Gerüstbogen ohne Eingaben; keine Zeichen.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Anwendungsname mit Zusatz (siehe GDD, Abschnitt 2): bestätigen oder ändern.
- Gerüst statt Generator: Der Katalog verlangt Skripte; die App baut keine. Entscheidung: Katalogeintrag umschreiben oder Ausbau.
- Katalogeintrag Nr. 91 beschreibt eine andere Fassung (Generator, Figur-Instrument-Zuordnung, Gemeinfreiheitsaussage, uk/ru-Option). Eintrag umschreiben (GDD, Offen).
- Katalogtext „18 Märchen“ ist falsch: S. 269 nennt 18 Titel, darunter Musikwerke und Volksspiele (Befund Welle 88). Katalog-Korrektur.
- Deutsche Figurennamen und Requisiten sind Eigenübersetzung oder Eigenentwurf; zur Abnahme.
- Titel als Überschrift auf dem Gerüstbogen: bleibt oder entfällt?
- Zahlen 3 bis 5 Szenen und 2 bis 6 Rollen sind Eigenentwurf; das Team entscheidet.
- Zielgruppe: Die App ist für Erwachsene gebaut. Eine Variante für Kinder wäre eine eigene Entscheidung nach docs/02.
- Stichwort-Felder im Gerüst: Regel „keine Eingabefelder“ klären.
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Zitatgrenze: dieser Bauauftrag nutzt höchstens 6 Wörter (docs/10). A10 fragt, ob 12 gelten sollen (offen).
