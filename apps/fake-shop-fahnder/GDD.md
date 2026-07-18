# Kurz-GDD: Fake-Shop-Fahnder 🕵️

**Einheit aus Katalog:** docs/09 №46 — «Fake-Shop-Fahnder». **Engine:**
quiz-kern (Content-Pack, inkl. Klassen-Modus).

## 1. Kernaussage

Echter Shop oder Fake? Wer die fünf Warnsignale kennt und im Zweifel
innehält, fällt nicht auf Betrugs-Shops herein.

## 2. Zielgruppe

Kinder 8-12. Nachbarn: koeder-quiz (Phishing), impressum-detektive
(Transparenz), muenz-trick (Kostenfallen), darf-ich-posten.

## 3. Ablauf

quiz-kern-Standard: Start → 12er-Runde → binaer (Echt/Fake) und wahl mit
Erklärung → Rang + Rekord. Zusätzlich Klassen-Modus.

## 4. Didaktik

Fünf Warnsignale: zu billig, kein Impressum, nur Vorkasse, Fantasie-Siegel,
Countdown-Druck. Balance-Test: beide binaer-Antworten kommen vor (auch echte
Shops), damit das Kind PRÜFT statt pauschal „alles Fake“. Handlungswissen:
innehalten, Erwachsene fragen, Shop nachschlagen, keine Daten für „Rabatt“.

## 5. Politik-Konformität (docs/02)

Netzwerk-Wächter in der App, quiz-kern macht keine Anfragen, Fälle
nachgestellt (keine echten Shops), nur `fsf.rekord` in localStorage +
Löschknopf, werbefrei, Vorlesen, eltern.html.

## 6. Tests

`test/fragen.test.mjs`: quiz-kern-Schema (≥12), Balance (ja+nein),
Typ-Mischung, Kategorie-Abdeckung, fünf Kern-Warnsignale, Rang-
Erreichbarkeit.

## 7. Erweiterungen (Katalog)

Nachbarpakete: Seiten-Scanner (№47/135), Wer steckt dahinter? (№51),
Link-Kompass (№50); uk/ru + Leichte Sprache über kinder-ui.
