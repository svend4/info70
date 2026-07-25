# Kurz-GDD: Wörter-Sortierer 🗂️

**Einheit aus Katalog:** docs/10 (Praleska) Ko-Nutzung Nr. 12 —
«Woerter-Sortierer». **Engine:** Ko-Nutzungs-Muster mit `kinder-ui`.
Zielgruppe: 4–6, **ausschließlich gemeinsam mit einem Erwachsenen**.

## 1. Die drei Sortierungen

- **Oberbegriffe** — „Gehört die Gurke zum Gemüse?“ Über den einzelnen
  Dingen liegt eine Schublade; das ist die Grundlage jeder Ordnung.
- **Gegensätze** — groß/klein, heiß/kalt, laut/leise, nass/trocken,
  schnell/langsam. Entscheidend ist, dass beide Wörter **dieselbe
  Eigenschaft** beschreiben.
- **Mehrdeutigkeit** — Bank, Birne, Maus, Blatt. Für Kinder eine kleine
  Sensation und der erste Schritt zu der Einsicht, dass Wörter nicht die
  Dinge selbst sind.

## 2. Zwei Invarianten, die den Sinn schützen

- **Bei den Ja/Nein-Typen müssen beide Antworten vorkommen.** Sonst
  lernt das Kind „immer ja“ statt einer Unterscheidung. Deshalb sind bei
  den Doppelbedeutungen absichtlich **falsche Paare** dabei (Löffel und
  Auto, Schlüssel und Baum). Der Validator meldet Einseitigkeit.
- **Kein Ablenker darf selbst ein Gegenteil sein.** „laut“ neben „groß“
  ist ein guter Ablenker, weil beides Eigenschaften sind; „klein“ neben
  „groß“ wäre ein Fehler, den ein Kind zu Recht anfechten könnte. Ein
  Test prüft jedes Paar gegen eine Gegenteil-Tabelle.

## 3. Obst, Gemüse und die botanische Wahrheit

Gewertet wird die **Alltagseinteilung**: Gurke und Tomate zählen zum
Gemüse. Botanisch sind beide Früchte. Für Vier- bis Sechsjährige ist die
Küchen-Einteilung die richtige, weil sie sich mit Einkaufszettel und
Sprachgebrauch deckt; eltern.html erklärt die zweite Ordnung und sagt,
dass beide für ihren Zweck stimmen. Das Feld `hinweis` in den Daten
deklariert die Wahl, und ein Test hält sie fest.

## 4. Ko-Nutzungs-Design

Erwachsenen-Gate · `PRO_SESSION = 6` im Code erzwungen · keine Punkte,
kein Rekord, **kein localStorage** · Gesprächsimpuls nach jeder Antwort
(Validator verlangt Frageform) · Schluss „Bildschirm aus“ mit drei Ideen.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten, keine
Namen, nichts gespeichert. Vorlesefunktion auf jedem Bildschirm (BFSG).
eltern.html, im Sammelband.

## 6. Tests

`test/logik.test.mjs` (9): Daten gültig; alle drei Sortierungen mit je
≥4 Aufgaben (Mutation geprüft); bei den binären Typen kommen beide
Antworten vor (Mutation); Gegenteil-Aufgaben haben genau eine richtige
Option ohne Textdubletten (Mutation); **kein Ablenker ist selbst ein
Gegenteil** und jede richtige Antwort passt zur gefragten Eigenschaft;
`istRichtig` arbeitet für beide Antwortformen inklusive `undefined`;
echte Teekesselchen enthalten die deutschen Klassiker und es gibt
Gegenbeispiele; Sitzungsgrenze ≤6 mit Rotation; Ton ohne Tadel, jede
Frage an die Erwachsenen, Schluss offline, Alltagseinteilung deklariert.

## 7. Erweiterungen (Katalog)

Wortfeld-Memory zum Ausdrucken, Anlaut-Modus als Brücke zu `reim-radar`,
Herkunftssprachen-Vergleich (Doppelbedeutungen sind fast nie in zwei
Sprachen dieselben), Übergang zu `warum-heisst-das-so` für die Großen.
