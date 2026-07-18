# Kurz-GDD: Deepfake-Spürnase 🐽

**Einheit aus Katalog:** docs/09 №109/213 — «Deepfake-Spürnase». **Engine:**
quiz-kern (Content-Pack, inkl. Klassen-Modus), Ergänzung zu
nachrichten-detektive.

## 1. Kernaussage

KI-Bilder/-Videos macht man mit konkreten Prüfmerkmalen sichtbar: Hände,
Licht, Text, Quelle. „Perfekt“ heißt nicht „echt“.

## 2. Zielgruppe

Kinder 8-12 (Variante 13-15). Nachbarn: nachrichten-detektive,
deepfake-studio, wer-dahinter, verschwoerungs-werkstatt.

## 3. Ablauf

quiz-kern-Standard: Start → 12er-Runde → binaer/wahl mit Erklärung →
Rang + Rekord. Zusätzlich Klassen-Modus.

## 4. Didaktik

Konkrete Prüfmerkmale statt Bauchgefühl: Finger/Hände, Licht/Schatten,
wirrer Text, „matschiger“ Hintergrund, zu viele Körperteile. Zwei
Meta-Regeln: „perfekt ≠ echt“ und Quelle prüfen. Rechtsbezug: KI-
Kennzeichnungspflicht (EU-KI-Verordnung). Handlungsregel: erst prüfen,
dann teilen. Balance-Test: beide binaer-Antworten kommen vor.

## 5. Politik-Konformität (docs/02)

Netzwerk-Wächter, quiz-kern macht keine Anfragen, Fälle beschrieben (keine
echten Bilder), nur `dfs.rekord` + Löschung, werbefrei, Vorlesen,
eltern.html.

## 6. Tests

`test/fragen.test.mjs`: quiz-kern-Schema (≥12), Balance (ja+nein),
Typ-Mischung, Kategorie-Abdeckung, Prüfmerkmale (Hände/Licht/Text/Quelle)
+ KI-Kennzeichnung + teilen, Rang-Erreichbarkeit.

## 7. Erweiterungen (Katalog)

Variante 13-15 (mehr Video/Stimme); Anzeige oder nicht? (№110);
uk/ru + Leichte Sprache über kinder-ui.
