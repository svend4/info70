# Kurz-GDD: Reim-Werkstatt 🎵

**Einheit aus Katalog:** docs/10 (Praleska) Kinder-Apps Nr. 20 —
«Reim-Werkstatt». **Engine:** eigener Generator + Simulator mit
`kinder-ui`. Zielgruppe: 5–8, mit 5–6 in Ko-Nutzung.

## 1. Kernaussage

Reimen ist der sichtbarste Teil der **phonologischen Bewusstheit** — der
Fähigkeit, Sprache als Lautfolge statt als Bedeutung wahrzunehmen. Wer
hört, dass „Maus“ und „Haus“ hinten gleich sind, kann später auch hören,
dass „Maus“ vorne mit M anfängt. Von allen Vorläuferfähigkeiten sagt sie
am besten voraus, wie leicht ein Kind später liest.

Deshalb darf ein Reim ausdrücklich Unfug sein: Genau dann hört das Kind
auf den Klang statt auf den Sinn.

## 2. Abgrenzung zu `reim-radar`

`reim-radar` (4–6) lässt **prüfen**: Reimt sich das oder nicht? Die
Werkstatt lässt **produzieren**: das passende Wort auswählen, ganze
Reimfamilien sehen, eigene Zeilen erfinden. Andere Zielgruppe, andere
Tätigkeit, kein Ersatz.

## 3. Die drei Modi

- **Reimfamilien** — 11 Familien (-aus, -atze, -acht, -aum, -ein, -onne,
  -icht, -isch, -and, -eller, -ann) mit je mindestens vier Wörtern, alle
  vorlesbar.
- **Reimrätsel** — acht Zweizeiler, das Schlusswort fehlt, drei Wörter
  zur Auswahl, von denen sich nur eines reimt.
- **Quatschreime** — fester Anfang plus gezogene Reimzeile (16
  Möglichkeiten), danach ist das Kind dran und bekommt die Reimwörter
  seiner Familie als Werkzeugkasten.

## 4. Die tragende Invariante: ein Reim, der keiner ist, kommt nicht rein

Der ganze Nutzen hängt daran, dass sich die Wörter wirklich reimen.
Deshalb ist das keine Behauptung in der Prosa, sondern eine Regel, die
`pruefeDaten` an jedem Datensatz nachrechnet:

| Regel | Warum |
| --- | --- |
| jedes Wort einer Familie endet auf deren Endung | sonst steht ein Nicht-Reim in der Familie |
| die erste Rätselzeile endet auf einen Reimpartner | sonst gibt es nichts, worauf sich die Lösung reimen könnte |
| die erste Zeile nennt nicht schon die Lösung | sonst ist der Reim vorweggenommen |
| die Lösung steht nirgends im Text | sonst ist nichts zu raten |
| kein Ablenker reimt sich | sonst gäbe es zwei richtige Antworten |
| jede Quatsch-Reimzeile endet auf die Endung | sonst reimt der Generator nicht |

Beim Aufbau der Daten hat genau das zwei echte Fehler gefangen:
„Platz“ und „Latz“ standen in der *-atze*-Familie (sie enden auf *-atz*,
reimen sich also nicht auf „Katze“), und ein Rätsel nannte die Lösung
„Nacht“ direkt vor der Lücke. Beide wären ohne die Regel im Datensatz
geblieben.

`reimtSich` arbeitet mit `endsWith` und ohne Rücksicht auf Groß- und
Kleinschreibung — dadurch zählt auch „Winterwonne“ zur *-onne*-Familie,
was für zusammengesetzte Wörter genau richtig ist.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten,
**kein localStorage** — der Zähler gilt nur für die laufende Sitzung.
Vorlesefunktion in jedem Modus (BFSG), denn Reime existieren im Ohr.
eltern.html, im Sammelband.

## 6. Tests

`test/logik.test.mjs` (10): Daten gültig; `letztesWort` schneidet Punkt,
Ausrufe- und Fragezeichen ab; `reimtSich` ist schreibungsunabhängig und
weist „Platz“ auf „atze“ zurück; jedes Wort jeder Familie reimt sich
wirklich; die Rätsel-Invarianten halten (Reimvorbild in Zeile 1, Lösung
nicht im Text, Ablenker reimen nicht, Lösung in der Familie); der
Validator greift bei allen vier Rätsel-Fehlern; jede Quatsch-Reimzeile
endet richtig; `baueRaetsel`/`baueQuatsch` wiederholen sich nicht und
liefern über 200 bzw. 100 Ziehungen immer drei verschiedene Optionen mit
der Lösung darunter; `reimpartner` findet die Familie und lässt das Wort
selbst weg; die Herkunft ist deklariert und kein Wort ist erfunden.

## 7. Erweiterungen (Katalog)

Silben-Modus als Brücke zu `reim-radar`, druckbare Reimfamilien-Karten
(`quiz-karten-druck`), Anlaut-Modus als Vorstufe zu
`erste-woerter-lesewerkstatt`, gemeinsamer Familienreim im `familienrat`.
