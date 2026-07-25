# Kurz-GDD: Warum heißt das so? 🔤

**Einheit aus Katalog:** docs/10 (Praleska) Kinder-Apps Nr. 23 —
«Warum heisst das so? Wort-Quiz». **Engine:** `quiz-kern` (Einzel-,
Klassen-, Duett- und Staffel-Modus, Vorlesen, Rekord). Zielgruppe: 5–7
in Ko-Nutzung, 8–12 eigenständig.

## 1. Kernaussage

Viele deutsche Namen sind kleine Beschreibungen: Der Löwenzahn hat
gezackte Blätter wie Zähne, der Fingerhut Blüten wie ein Nähfingerhut,
die Ringelnatter helle Mondflecken hinter dem Kopf. Wer den Namen liest,
schaut die Sache genauer an — das ist der Ertrag.

## 2. Die tragende Entscheidung: die Hälfte der Namen schwindelt

Ein Quiz nur mit treffenden Namen hätte einen unerwünschten
Nebeneffekt: Das Kind lernte, dem Namen zu **glauben**. Deshalb trägt
jede Frage ein Feld `art`:

- **`stimmt`** — Löwenzahn, Ringelnatter, Fingerhut, Schneeglöckchen,
  Nashorn, Nacktschnecke, Seepferdchen, Handschuh, Zebrastreifen,
  Staubsauger, Schmetterling.
- **`irrefuehrend`** — Tausendfüßer (meist 30–200 Beine), Maulwurf
  (von „Erde werfen“, geworfen wird mit den Schaufelhänden), Ohrwurm
  (alter Aberglaube), Meerschweinchen (kein Schwein, nur übers Meer
  gekommen), Flusspferd (näher mit Walen verwandt), Fledermaus (keine
  Maus, sondern das einzige wirklich fliegende Säugetier).

Tests erzwingen, dass **beide Sorten mit je mindestens sechs Fragen**
vertreten sind, dass jede Frage eine `art` trägt, dass die Kategorie
„Namen, die täuschen“ ausschließlich irreführende enthält und dass jede
irreführende Erklärung den Irrtum **ausdrücklich richtigstellt**.

Frage w17 zieht die Regel explizit: *Ein Name ist ein guter Hinweis, aber
kein Beweis.* Ohne sie wäre die App eine Sammlung von Anekdoten; ein
eigener Test hält sie fest.

## 3. Sicherheit

Der Fingerhut ist stark giftig. Die Erklärung sagt das und ergänzt die
Handlungsanweisung („anschauen ja, anfassen und in den Mund nehmen auf
keinen Fall“). Ein Test prüft beides.

## 4. Mehrsprachigkeit

Der Katalog sieht den Vergleich mit der Herkunftssprache vor. Statt
erfundener Wortlisten bittet eltern.html die Familie, den Namen selbst
in ihrer Sprache zu nennen und zu überlegen, was *dieser* Name
beschreibt — meistens etwas ganz anderes, und genau der Vergleich ist die
Sprachbrücke. Dieselbe Linie wie in `mensch-tier-pflanze` und
`hoeflich-fair`.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten. Nur
der Punkte-Rekord liegt unter `warum.rekord` im localStorage und ist in
der App löschbar. Vorlesefunktion (BFSG). eltern.html, im Sammelband.

## 6. Tests

`test/fragen.test.mjs` (9): Schema gültig bei erhöhter Latte (≥16 Fragen,
Erklärung ≥80 Zeichen); Ränge beginnen bei 0 und sind in einer 12er-Runde
erreichbar; beide Namenssorten sind mit je ≥6 Fragen vertreten und jede
Frage trägt eine gültige `art`; jede irreführende Erklärung stellt richtig
und die Kategorie „Namen, die täuschen“ ist sortenrein; die sechs
klassischen Irrtümer sind einzeln an ids festgenagelt; die Schlussregel
steht in den Daten; der Fingerhut wird als giftig benannt; binäre Fragen
enthalten beide Antworten und die richtige Wahlantwort steht nicht immer
an derselben Stelle; jede Erklärung ≥150 Zeichen mit Satzzeichen, ids in
Reihenfolge.

## 7. Erweiterungen (Katalog)

Sammelmodus „Wörter, die du selbst gebaut hast“, Brücke zu
`maerchen-gedicht-fabel` (Sprache als Material) und zu `wer-wohnt-wo`
(dieselben Tiere im Lebensraum), druckbare Namenskarten für den
Sachunterricht.
