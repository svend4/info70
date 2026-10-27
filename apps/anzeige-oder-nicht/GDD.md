# Kurz-GDD: Anzeige oder nicht? 🏷️

**Einheit aus Katalog:** docs/09 №110 — «Anzeige oder nicht?». **Engine:**
quiz-kern (Content-Pack, inkl. Klassen-Modus), Erweiterung des Werbe-Radars.

## 1. Kernaussage

Empfehlung oder bezahlte Werbung? Wer die Werbeformen und die Kennzeichnungs-
pflicht kennt, trennt Werbeabsicht von echter Meinung.

## 2. Zielgruppe

Kinder 8-12. Nachbarn: nachrichten-detektive (Werbe-Radar), muenz-trick,
lootbox-labor, dark-pattern-detektiv.

## 3. Ablauf

quiz-kern-Standard: Start → 12er-Runde → binaer/wahl mit Erklärung →
„Ende der Runde“ ohne Wertung. Zusätzlich Klassen-Modus.

## 4. Didaktik

Werbeformen: #Anzeige, Merch, Produktplatzierung, Affiliate/Rabattcode,
Gratis-Haul. Meta-Skill: Werbung von Meinung trennen (Absicht + Vorteil).
Kennzeichnungspflicht (JMStV, UWG) als Fairness gegenüber Kindern.
Balance-Test: beide binaer-Antworten kommen vor. Handlungsregel: Käufe mit
Erwachsenen, nie heimlich.

## 5. Politik-Konformität (docs/02)

Netzwerk-Wächter, quiz-kern macht keine Anfragen, Fälle erfunden (keine
echten Marken/Personen), werbefrei, Vorlesen, eltern.html. Die App speichert
nichts und kennt keine Punkte, keinen Rekord, keine Ränge; der frühere
Schlüssel `aon.rekord` wird beim Start einmal entfernt.

## 6. Tests

`test/fragen.test.mjs`: quiz-kern-Schema (≥12), Balance (ja+nein),
Typ-Mischung, Kategorie-Abdeckung, Werbeformen (#anzeige/Merch/
Produktplatzierung/Affiliate) + Meinung-Abgrenzung, keine Ränge in den Daten,
App-Code ohne Wertung und ohne Speicher.

## 7. Erweiterungen (Katalog)

Jugendversion 13+ (Finfluencer, Gewinnspiele); uk/ru + Leichte Sprache
über kinder-ui.
