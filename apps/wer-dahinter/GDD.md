# Kurz-GDD: Wer steckt dahinter? 🔎

**Einheit aus Katalog:** docs/09 №51 — «Wer steckt dahinter?». **Engine:**
quiz-kern (Content-Pack, inkl. Klassen-Modus).

## 1. Kernaussage

Eine gute Kinderseite sagt immer, wer schreibt und woher die Info stammt.
Autor, Datum, Quelle machen einen Beitrag nachprüfbar.

## 2. Zielgruppe

Kinder 8-12. Ergänzt nachrichten-detektive. Nachbarn: verschwoerungs-
werkstatt, feed-forscher, deepfake-studio.

## 3. Ablauf

quiz-kern-Standard: Start → 12er-Runde → binaer/wahl mit Erklärung →
Rang + Rekord. Zusätzlich Klassen-Modus.

## 4. Didaktik

Die drei Detektiv-Fragen Wer/Wann/Woher als Werkzeug gegen Falschmeldungen:
Autor genannt? Datum aktuell? Quelle nachlesbar? Warnbild „kein Autor,
kein Datum, keine Quelle, aber starke Wut“ = typische Falschmeldung.
Alte Fotos im neuen Kontext. Handlungsregel: erst prüfen, dann (vielleicht)
weiterschicken. Balance-Test: beide binaer-Antworten kommen vor.

## 5. Politik-Konformität (docs/02)

Netzwerk-Wächter, quiz-kern macht keine Anfragen, Fälle beschrieben, nur
`wd.rekord` + Löschung, werbefrei, Vorlesen, eltern.html.

## 6. Tests

`test/fragen.test.mjs`: quiz-kern-Schema (≥10), Balance (ja+nein),
Typ-Mischung, Abdeckung Autor/Datum/Quelle/Transparenz (je ≥2),
Wer/Wann/Woher + Nachprüfbarkeit + weiterschicken, Rang-Erreichbarkeit.

## 7. Erweiterungen (Katalog)

Nachbarpakete: Anzeige oder nicht? (№110), Deepfake-Spürnase (№109);
uk/ru + Leichte Sprache über kinder-ui.
