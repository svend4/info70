# Schulstart-Begleiter 🎒

Eine **Checkliste für pädagogische Fachkräfte** im letzten Kita-Jahr. Sie prüft die
**Angebote des Erwachsenen** für den Schulstart: Raum, Material, Spiele und eigenes Handeln.
Fünf Bereiche mit je sechs Angeboten (30 insgesamt). Jedes Angebot wird als **angeboten**,
**noch offen** oder **trifft nicht zu** markiert. Gezählt wird je Bereich (z. B. „angeboten:
3 von 6“). Eine Gesamtzahl über alle Bereiche und Prozentwerte gibt es bewusst nicht. Ausgegeben
wird ein **Druckbogen** für die Teambesprechung.

Der Name bleibt, weil andere Apps auf den Ordner `apps/schulstart-begleiter` verweisen. Die
Beschreibung ist neu. Version 0.2.0 (vorher 0.1.0: Beobachtungsbogen je Kind).

## Was entfällt (gegenüber v0.1)

- Kinder: Kürzel, Kürzel-Verwaltung, Auswahl eines Kindes, Zähler und Fortschritt je Kind.
- Stufen: Die Auswahl je Merkmal (noch nicht / in Ansätzen / sicher) und die Stufen im Katalog.
- Kinderbericht samt Kopieren in die Zwischenablage.
- Datei-Export und -Import (Koffer: `kompass.mjs` und sein Test).
- Der Löschknopf für Kinderdaten.
- Die Merkmale als Beobachtung über Kinder. Sie sind durch Angebote des Erwachsenen ersetzt.

## Was gespeichert wird: nichts

- Die Seite schreibt nichts: kein `localStorage.setItem`, kein `sessionStorage`, keine
  IndexedDB, keine Cookies. Das prüft `test/quellcode.test.mjs`.
- Die Angaben (angeboten / noch offen / trifft nicht zu) liegen nur in einer Variable der
  Seite und sind nach dem Neuladen weg. Ohne Angabe gilt „noch offen“.
- **Altbestand-Bereinigung:** Beim Start wird der Schlüssel `ssb.daten` einmal per
  `localStorage.removeItem` entfernt, in try/catch (`bereinigeAltbestand()` in `logik.mjs`).
  Nur entfernen, nie schreiben. Alte Sicherungsdateien (Art `schulstart-begleiter-daten`) werden
  nicht mehr eingelesen.

## Merkmal-Kennungen (Eigenentwurf)

Jedes Angebot trägt das Feld `quelleMerkmal`, z. B. `sprache-1`. Die Seite zeigt darunter
„Eigenentwurf nach Merkmal sprache-1“, auch im Druckbogen. Die Formulierungen sind
Eigenentwürfe und keine Zitate. Die Bereiche tragen die Kennungen `sprache`, `mathe`,
`motorik`, `arbeit` und `sozial`. Jedes Merkmal wird genau einmal verwendet
(`pruefeKatalog()` in `logik.mjs`).

Die Wortlaute der früheren Merkmale (Beobachtungen über Kinder) stehen nicht mehr im Katalog.
Sie sind in der Git-Historie von `daten/indikatoren.json` bis zum Stand f16a54b erhalten.

## Quellen

- **Konzept:** `docs/10-praleska-baukasten.md`, Katalog Nr. 2 (Top-30 №2).
- **Programm „Praleska“** (НИО, Минск, 2007), Volltext `PRALESKA.pdf`, Seite 205. Wörtlich
  (Zeilenumbrüche durch Leerzeichen ersetzt, Seitenzahl = Anzahl der Formfeeds davor + 1):
  «Готовность к школе, к обучению в ней — один из важных результатов психического развития в дошкольный период.»
  Die Bereiche und Angebote sind Eigenentwürfe. Sie sind nicht aus einzelnen Seiten abgeschrieben.
- **Regel:** `docs/02-anforderungen.md`, Z. 141–146. Ein Kind wird nicht bewertet. Bewertet werden
  die eigenen Handlungen der Fachkraft und der Gegenstand.
- **Rechtsangaben:** keine. Ein früherer Verweis auf ein Landesschulgesetz ist entfernt, weil er nicht
  als geprüft in `docs/` steht. Eine Aufnahme ist offen (siehe GDD.md).

## Technik

- ES-Module ohne Abhängigkeiten. Bausteine: `kinder-ui` (`el`, `lokaleStimme`, `vorlesen`) und
  `kinderschutz` (`installiereNetzwerkWaechter()`, beim Start aufgerufen).
- CSP `default-src 'self'; style-src 'self' 'unsafe-inline'`. Keine externen Anfragen, keine
  fremden Skripte, keine Adressen im Quelltext.
- Beim Klick werden nur die Knöpfe der Zeile, die Zählung des Bereichs und die Druckzeilen
  aktualisiert, nicht die ganze Seite. Umschalter mit `aria-pressed`, jeder Knopf trägt das
  Angebot im `aria-label`.
- **Vorlesen** läuft nur mit einer Stimme, die auf dem Gerät liegt (`localService`). Gibt es keine,
  erscheint ein Hinweis, und es wird nicht vorgelesen.
- **Druck:** `druck.css` mit `@media print`. Bedienteile verschwinden, der Druckbogen erscheint.
  Keine Zeile für den Namen.

## Dateien

- `index.html`: Hülle, CSP, Stylesheets.
- `app.mjs`: DOM-Schicht. `logik.mjs`: reine Logik ohne DOM.
- `daten/indikatoren.json`: Katalog mit Auswahl und 30 Angeboten mit Merkmal-Kennung.
- `druck.css`: Druckbogen. `eltern.html`: Info für Träger und Leitung.
- `package.json`: Name unverändert, Beschreibung und Version 0.2.0.
- `test/`: Tests (siehe unten).

## Tests

29 Tests in drei Dateien: `test/indikatoren.test.mjs` (Katalog, Sprache der Angebote),
`test/logik.test.mjs` (Logik, Zählung, Altbestand) und `test/quellcode.test.mjs` (Speicher,
Netz, Seite, Druck, Modellnamen).

```bash
node --test apps/schulstart-begleiter/test/*.test.mjs
```

Ergebnis: 29 von 29 grün.
