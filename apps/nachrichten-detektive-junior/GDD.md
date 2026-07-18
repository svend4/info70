# Kurz-GDD: Nachrichten-Detektive junior 🕵️

**Einheit aus Katalog:** docs/09 №257 — «nachrichten-detektive junior (6-8)».
**Engine:** quiz-kern (Binaer-Modus, alle Fragen). Zielgruppe: Kinder 6-8.

## 1. Kernaussage

Schon 6-Jährige üben die wichtigste Medienkompetenz-Frage: „Kann das
wirklich sein?“ An einfachen, per Emoji dargestellten Bildern entscheiden
sie echt oder ausgedacht – komplett vorlesbar.

## 2. Zielgruppe

6-8 Jahre (noch vor sicherem Lesen). Nachbarn: nachrichten-detektive (8-12),
mini-rechte-entdecker (6-8), smarte-ohren (6-8), gefuehle-entdecker (5-7).

## 3. Ablauf

quiz-kern-Standard für die Kleinen: alle 12 Fragen (keine Auswahl), Ja/Nein
(„Echt“/„Ausgedacht“), Erklärung nach jeder Antwort, Vorlesen, Ränge und
Rekord, Klassen-Modus.

## 4. Didaktik / Nutzen

Legt das Fundament für spätere Fake-News-Kompetenz: erst begreifen, dass
Bilder erfunden sein können, dann die Prüf-Frage „Kann das wirklich sein?“.
Kurze Sätze und Vorlesen machen es für Nichtleser und Kinder mit
Leseschwäche zugänglich (BFSG).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, komplett vorlesbar.
Nur der Rekord (ndj.rekord) liegt lokal, löschbar. eltern.html vorhanden; im
Eltern-Sammelband gelistet.

## 6. Tests

`test/fragen.test.mjs`: quiz-kern-Schema gültig (≥12 Fragen), Zielgruppe 6-8
nur binaer mit erreichbaren Rängen, Balance echt/ausgedacht (je ≥4, Differenz
≤2), Lernkern „Kann das wirklich sein?“ und kurze Sätze (≤100 Zeichen).

## 7. Erweiterungen (Katalog)

Echte Bildpaare als lokale Grafiken; uk/ru; Leichte-Sprache-Katalog;
Übergang zu nachrichten-detektive (8-12).
