# Kurz-GDD: Deutschland-Kompass 🧭

**Einheit aus Katalog:** docs/10 (Praleska) Kinder-Apps Nr. 18 —
«Deutschland-Kompass». **Engine:** eigener Plan-Simulator + Karten-Quiz
mit `kinder-ui`. Zielgruppe: 5–7 in Ko-Nutzung, 8–12 eigenständig.

## 1. Kernaussage

Der Sprung von der eigenen Straße zur Weltkarte ist groß. Die App macht
ihn in drei Schritten: erst den Ortsplan von oben lesen, dann die
Deutschlandkarte, dann den Globus. Erst wenn ein Kind die Welt von oben
denken kann, ergibt eine Landkarte überhaupt Sinn.

## 2. Modus 1: Plan & Kompass (Simulator)

Ein 5×5-Raster mit acht benannten Orten (Bücherei, Teich, Schule,
Bäckerei, Park, Spielplatz, Turnhalle, Bahnhof) und einer Windrose. Die
Aufgabe lautet immer: „Du stehst *irgendwo*. Gehe *n* Felder nach
*Richtung*. Wo bist du?“

**Lösbarkeit per Konstruktion.** `alleAufgaben()` zählt alle Wege auf,
die von einem Ort aus geradeaus wieder auf einem benannten Ort enden;
`baueAufgabe()` zieht nur aus dieser Liste. Es kann also keine Aufgabe
entstehen, die auf einem leeren Feld endet oder aus dem Plan hinausführt.
Ein Test läuft 400 Ziehungen durch und rechnet jede einzeln nach.

**Norden ist oben.** In der Rasterdarstellung heißt das `dz = -1` für
Norden — genau hier entstehen die klassischen Vorzeichenfehler, deshalb
hängt ein eigener Test daran, der zusätzlich prüft, dass jeder Weg
umkehrbar ist (hin und zurück landet wieder am Start) und dass die
Umkehrung jeder gültigen Aufgabe selbst eine gültige Aufgabe ist.

Der Startort ist nie eine Antwortmöglichkeit — sonst wäre „stehen
bleiben“ wählbar, obwohl die Aufgabe Bewegung verlangt.

Merksatz für die Reihenfolge im Uhrzeigersinn: *Nie ohne Seife waschen.*

## 3. Modus 2: Karten-Quiz

13 Fragen in drei Bereichen, die der Validator alle drei einfordert:

- **Himmelsrichtungen:** Kompassnadel zeigt nach Norden, Sonne geht im
  Osten auf, Osten liegt rechts, wenn man nach Norden schaut.
- **Deutschland:** 16 Bundesländer (drei Stadtstaaten), neun Nachbarn
  **namentlich in der Erklärung**, Nord- und Ostsee, Italien als
  Nicht-Nachbar, die Donau als einziger großer Fluss nach Osten, Alpen im
  Süden mit der Zugspitze (2962 m).
- **Welt:** sieben Kontinente, Nordpol (Eis auf dem Meer) gegenüber
  Südpol (Eis auf Festland), Äquator, Nordhalbkugel.

Ein Test nagelt die belegten Werte fest, einschließlich der Liste aller
neun Nachbarländer — eine spätere Datenänderung kann sie nicht
stillschweigend verkürzen.

## 4. Modus 3: Länderkarten — und die Grenze, die dabei gilt

Zwei Karten zum Nachschlagen: Deutschland und die Ukraine. Die
Ukraine-Karte ist Katalogvorgabe („Zusatzmodul für Kinder mit
Herkunftsbezug“) und enthält **ausschließlich Geografie**: Kyjiw, der
Dnipro, das Schwarze Meer, die Grenze zu Polen, das größte vollständig in
Europa liegende Land.

Krieg, Flucht und Politik kommen nicht vor. Ein Test verbietet die
Begriffe *Krieg, Flucht, geflüchtet, Soldat, Bombe, Angriff, besetzt* in
den Länderdaten. Begründung: Ein Kind soll sein Herkunftsland auf der
Karte finden können, ohne dass eine Lern-App ihm dabei ein Thema
aufdrängt. Kommt das Gespräch von selbst darauf, gehört es zu den
Erwachsenen — eltern.html sagt das ausdrücklich.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten,
**kein localStorage**, darum keine Karte „Meine Daten löschen“. Das Kind
wird nicht bewertet: keine Punkte, kein Rekord, keine Ränge, kein Zähler;
jede Antwort bekommt eine Erklärung. Vorlesefunktion für Aufgaben, Erklärungen und Länderkarten; Windrose als
`role="img"` mit vollständiger Beschreibung, jedes Planfeld mit
`aria-label` (Zeile, Spalte, Ort, „hier stehst du“). eltern.html, im
Sammelband.

## 6. Tests

`test/logik.test.mjs` (13): Daten gültig; Norden ist oben (Vorzeichen,
unbekannte Richtung, Umkehrbarkeit); Uhrzeigersinn läuft um und
Gegenrichtung stimmt; `imFeld`/`ortAn` am Planrand; `alleAufgaben`
enthält nur Wege, die auf einem Ort enden, und zu jedem Weg auch den
Rückweg; `baueAufgabe` ist über 400 Ziehungen immer lösbar, zeigt drei
verschiedene Optionen inklusive Ziel, nie den Startort und nie zweimal
dieselbe Aufgabe; `aufgabenText` unterscheidet Einzahl und Mehrzahl; der
Validator meldet doppelte Felder, Orte außerhalb des Plans, ins Leere
zeigende Antwortindizes, einen fehlenden Bereich und doppelte Antworten;
die Geographie-Werte stehen fest; die Länderkarten sind sachlich und
ohne Kriegsinhalte; keine Bewertung im App-Code (Abwesenheits-Test) und die
Speicherregel (kein setItem, keine Löschkarte).

## 7. Erweiterungen (Katalog)

Eigener Plan zum Selbstlegen (Anschluss an `ornament-werkstatt`-Mechanik),
Maßstab und Entfernungen als Brücke zu `mess-labor`, weitere
Länderkarten als Content-Pack, Bundesland-Modus mit Wappen als
Druckmaterial.
