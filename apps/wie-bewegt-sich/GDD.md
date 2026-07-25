# Kurz-GDD: Wie bewegt sich das? 🐰

**Einheit aus Katalog:** docs/10 (Praleska) Ko-Nutzung Nr. 6 — «Wie
bewegen sich Tiere und Pflanzen?». **Engine:** Ko-Nutzungs-Muster mit
`kinder-ui`. Zielgruppe: 3–5, **ausschließlich gemeinsam mit einem
Erwachsenen**.

## 1. Kernaussage

Ein Kind muss die Tiere nicht kennen. Es genügt, auf die Beine zu
schauen — dann folgt die Bewegung fast von allein. Aus Raten wird
Schließen.

## 2. Die vier Aha-Regeln

| Körperbau | Bewegung | Beispiele |
| --- | --- | --- |
| vier gleich lange Beine | laufen | Reh |
| lange Hinterbeine | springen | Hase, Frosch, Eichhörnchen |
| keine Beine | kriechen | Regenwurm, Schnecke, Blindschleiche |
| Flügel | fliegen | Amsel, Schmetterling, Ente |

Bei der Frage stehen **immer alle Bewegungsarten** zur Wahl; eine
Vorauswahl wäre schon die halbe Antwort.

## 3. Die tragende Invariante: keine stillschweigenden Gegenbeispiele

Eine Regel ist nur etwas wert, wenn die Beispiele sie auch tragen.
`pruefeDaten` rechnet das nach:

- Jedes Tier **muss** zur Bewegung seiner Regel passen — oder als
  `ausnahme: true` markiert **und** begründet sein.
- Umgekehrt: Wer als Ausnahme markiert ist, aber der Regel folgt, ist
  ebenfalls ein Fehler.
- Es **muss mindestens eine Ausnahme geben**. Eine Regel ohne
  Gegenbeispiel wirkt größer, als sie ist.
- Jede Regel braucht mindestens ein Tier, das sie zeigt.

Die Ausnahme ist der **Fisch**: keine Beine, kriecht trotzdem nicht.
Sein Grund steht als `ausnahmeGrund` **in den Daten**, nicht im Code —
sonst müsste die App raten, sobald jemand eine zweite Ausnahme einträgt.
Auch das prüft der Validator in beide Richtungen.

## 4. Zwei Sachen, die oft falsch erzählt werden

- **Die Blindschleiche ist keine Schlange**, sondern eine Echse ohne
  Beine — und blind ist sie auch nicht. Der Name führt zweimal in die
  Irre; ein Test nagelt beide Richtigstellungen fest.
- **Die Sonnenblume dreht sich nur als junge Knospe** mit der Sonne mit;
  die fertig aufgeblühte Blüte bleibt nach Osten stehen. Ein Test hält
  fest, dass „jung“ und „Osten“ im Text vorkommen.

## 5. Pflanzen bewegen sich auch

Der Überraschungsteil des Katalogs: Sonnenblume, Gänseblümchen,
Bohnenranke — jeweils mit einem **Versuch zum Selbermachen**, der Tage
dauert. Genau daran lernt ein Kind, dass langsam auch Bewegung ist.

## 6. Ko-Nutzungs-Design

Erwachsenen-Gate · `PRO_SESSION = 5` im Code erzwungen · keine Punkte,
kein Rekord, **kein localStorage** · Gesprächsimpuls nach jeder Antwort
(Validator verlangt Frageform) · Schluss „Bildschirm aus“ mit drei Ideen
für draußen.

## 7. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten, keine
Namen, nichts gespeichert. Vorlesefunktion auf jedem Bildschirm (BFSG).
eltern.html, im Sammelband.

## 8. Tests

`test/logik.test.mjs` (10): Daten gültig; die vier Katalog-Regeln stimmen
paarweise; jedes Tier folgt seiner Regel oder ist erklärte Ausnahme (mit
zwei Mutationen in beide Richtungen); mindestens eine Ausnahme, und ihr
Grund liegt in den Daten (drei Mutationen); jede Regel wird von einem
Tier gezeigt; Sitzungsgrenze ≤6 ohne Dubletten mit Rotation; die Auswahl
verrät nichts; Blindschleiche als Echse; Sonnenblume korrekt beschrieben;
Ton ohne Tadel, jede Frage an die Erwachsenen, Schluss offline.

## 9. Erweiterungen (Katalog)

Bewegungs-Memory zum Nachmachen, Wasser-Modus mit mehr Schwimmern,
Brücke zu `wer-wohnt-wo` (wer bewegt sich in welchem Lebensraum) und zu
`mensch-tier-pflanze` (Bewegung als Lebenszeichen).
