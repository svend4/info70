# Morgenkreis- und Wochenplaner U3 🗓️

Planer für eine Gruppe mit Kindern von 1 bis 3 Jahren. Die Quelle nennt je Bereich eine Zahl
Einheiten pro Woche (Praleska, Gruppe „Малыши“, S. 8–9): zusammen zehn Einheiten in sieben
Bereichen. Der Planer zählt die eigene Planung dagegen und zeigt die Abweichungen. Er ist eine
Rückmeldung, kein Fehler.

## Was an der Quelle geprüft ist

Der Katalogeintrag (Nr. 79) hatte vier Angaben, die der Text so nicht trägt:

- **Der Quellenbereich S. 81–94 als „Querschnitt aller Tätigkeitsbereiche“**: die Richtwerte
  stehen auf S. 8–9, die Bewegungsspiele auf S. 70–71, die Musik auf S. 81–86, Malen, Formen und
  Konstruieren auf S. 90–94. Der Bereich 81–94 deckt nicht alle Bereiche ab.
- **Morgenkreis als Format**: die Quelle beschreibt keinen Morgenkreis mit Kreis, Ritual und Dauer.
  Belegt ist nur die Morgengymnastik ab zwei Jahren (S. 57).
- **Wochentage und Wochenplan mit Wochenthemen**: die Quelle nennt nur Mengen. Die fünf Tage sind
  eigen.
- **„Planer-Selbstbeobachtung“ und „Datei-Export“**: Eigenschaften dieser App, keine Angaben der
  Quelle.

Belegt und mit Seite: die sieben Richtwerte (S. 8–9) einschließlich der Monatsregel für Lepka
(S. 9), die Bewegungsspiele (S. 70–71), die Musikgattungen (S. 81–86), die Themen für Malen (S. 91),
Formen (S. 92–93) und Konstruieren (S. 94).

## So funktioniert es

- Fünf Tage, je höchstens vier Einheiten. Jede Einheit wählt einen Bereich und, wo es einen gibt,
  einen Titelbaustein mit Seite aus der Quelle.
- Der Bereich „Sprache“, „Umwelt“ und „Sensomotorik“ hat keine Titelbausteine. Das Angebot bleibt
  bei der Fachkraft; der Planer sagt das.
- Die Statuszeile zeigt je Bereich „geplant von Richtwert“ und listet die Abweichungen.
- „Plan als Datei speichern“ schreibt nur Tage, Bereiche und Bausteine. Eine Datei mit einem
  Feld für Namen oder Freitext wird beim Laden abgewiesen.
- Der Planer speichert im Gerät nichts.

## Grenzen – ehrlich

- Die Bausteine sind Auswahlen aus den Listen der Quelle, nicht die vollständigen Listen.
- Die Monatsregel für Lepka kennt der Planer nicht, weil er keinen Monat führt. Sie steht als Hinweis.
- Die Richtwerte sind Richtwerte. Eine Gruppe, die anders plant, ist nicht falsch; der Planer
  zeigt nur die Abweichung.

## Prüfung

- `node --test apps/morgenkreis-wochenplaner-u3/test/*.mjs` – 21 Tests: Richtwerte ergeben zehn,
  Musik-Bausteine sind die Gattungen der Kartei 78, leerer Plan, voller Tag, Ändern und Entfernen,
  Datei nur mit Form, Abweichung ist keine Ablehnung, und Gegenproben: ein Namensfeld, falsche Art,
  Version oder Tagesreihenfolge, Baustein aus fremdem Bereich, zu viele Einheiten, Summe ungleich
  zehn, Autor im Titel, fremdes Feld im Baustein.
- Browser bei 360 px: fünf Tage, Bereichswahl und Baustein, Tag voll, Entfernen, Export,
  Import mit Namensfeld abgewiesen, Import eines Richtwert-Plans mit „Alle Richtwerte getroffen“,
  keine Speicherung, keine externen Anfragen. Die einzige Konsolenmeldung ist das `favicon.ico`.

## Starten

`index.html` über einen statischen Server öffnen, zum Beispiel `node tools/serve.mjs`.
