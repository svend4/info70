# Kurz-GDD: Dinge des Alltags 🪑

**Einheit aus Katalog:** docs/10 (Praleska) Ko-Nutzung Nr. 2 — «Dinge des
Alltags – Quiz-Content-Pack (Ko-Nutzung)». **Engine:** eigenes
Ko-Nutzungs-Muster mit `kinder-ui`. Zielgruppe: 3–5, **ausschließlich
gemeinsam mit einem Erwachsenen**.

## 1. Kernaussage

Kinder ordnen die Dingwelt in Schubladen: Was gehört zusammen, woraus ist
es, wozu ist es da? Die App liefert die Sortierungen — das Gespräch
darüber liefert der Erwachsene.

## 2. Die sechs Sortierungen

Kategorie (Möbel/Geschirr/Kleidung), Teil, Material, Funktion, Fahrzeug —
und **„gemacht oder gewachsen“**. Die letzte ist die tragende: Sie trennt
die von Menschen gemachte von der gewachsenen Welt und ist bewusst
knifflig, weil ein Stuhl aus Holz besteht, das gewachsen ist. Genau das
sagt die Erklärung auch („Das Holz dafür ist gewachsen – der Stuhl selbst
nicht“).

Ein Test verlangt, dass bei dieser Sortierung **beide** Antworten
vorkommen: Wäre immer „gemacht“ richtig, lernte das Kind eine Klopfregel
statt einer Unterscheidung.

## 3. Warum nicht `quiz-kern`

Der Motor bringt Punkte, einen Rekord im localStorage und Ränge mit. Für
Dreijährige, die noch nicht lesen, wäre das ein Wettbewerb um eine Zahl,
die sie nicht deuten können. Richtig und falsch gibt es hier trotzdem —
das sind Sachfragen —, aber **folgenlos**: Statt „falsch“ zeigt die App
freundlich, was gemeint war. Das Wort „falsch“ kommt im Datensatz nicht
vor, ein Test hält das fest.

## 4. Ko-Nutzungs-Design (wie `gemeinsam-gesund-essen`)

| Element | Umsetzung |
| --- | --- |
| Erwachsenen-Gate | Start erst nach ausdrücklicher Bestätigung |
| Sitzungsgrenze | `PRO_SESSION = 6`, im Code erzwungen, nicht nur dokumentiert |
| kein Ergebnis | keine Punkte, kein Rekord, kein localStorage |
| Gesprächsimpuls | nach **jeder** Antwort, per Validator als Frage erzwungen |
| Schluss | „Bildschirm aus“ mit drei Ideen für die echte Wohnung |

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten, keine
Namen, **kein localStorage**. Vorlesefunktion auf jedem Bildschirm (BFSG),
große Emoji-Flächen als Antwortknöpfe mit `aria-label`. eltern.html, im
Sammelband.

## 6. Herkunftssprache

Der Katalog sieht de/uk/ru als Wortschatzbrücke vor. Statt erfundener
Wortlisten bittet eltern.html die Familie, die Dinge zusätzlich in der
Familiensprache zu benennen — dieselbe Linie wie in `mensch-tier-pflanze`
und `warum-heisst-das-so`.

## 7. Tests

`test/logik.test.mjs` (8): Daten gültig; Sitzungsgrenze ≤6, ohne Dubletten
und mit Rotation über mehrere Sitzungen; genau eine richtige Option je
Aufgabe (mit zwei Mutationen geprüft); alle sechs Aufgabentypen kommen
vor; bei „gemacht oder gewachsen“ sind beide Antworten vertreten und der
Validator meldet Einseitigkeit; jede Aufgabe endet mit einem
Gesprächsimpuls in Frageform; Ton ohne Tadel und ohne Wertung des Kindes;
die Sitzung endet offline.

## 8. Erweiterungen (Katalog)

Bild-Memory aus denselben Kategorien, Druckkarten für die Kita
(`quiz-karten-druck`), Brücke zu `erfinder-werkstatt` („gemacht“ weiter
gedacht) und zu `mathe-entdecker` (sortieren und zählen).
