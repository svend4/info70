# Kurz-GDD: Sprachbrücken-Impulskarten 🗣️

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 18 — «Sprachbrücken:
Gesprächs-Impulskarten mehrsprachig». **Engine:** filterbare Kartei + Druck
(Muster bewegungs-schatzkiste/quiz-karten-druck). Zielgruppe: Kita-Teams.

## 1. Kernaussage

Dreisprachige Gesprächs-Impulskarten (de/uk/ru mit Aussprachehilfe) für
alltagsintegrierte Sprachbildung: nach Kita-Situation filterbar (Ankommen,
Essen, Anziehen, Spielen, Draußen, Trösten, Abschied) und druckbar zum
Aufhängen direkt an der Situation. Je Situation ein Praxis-Tipp.

## 2. Zielgruppe

Kita-Teams (auch ohne Einarbeitung einsetzbar). Nachbarn:
herkunftssprachen-bruecke, eingewoehnungs-tagebuch, elternbrief-generator,
vorlese-kompass.

## 3. Ablauf

1) Methode-Kurztext (anknüpfen, offene Impulse, erweitern) + ehrlicher
   Hinweis zur Aussprachehilfe („Annäherung, kein Ersatz“).
2) Situation wählen (oder Alle) → Karten mit de groß, uk/ru + Latein-Hilfe.
3) Vorlesen je Karte; Drucken (druck.css, `sbi-nur-bildschirm`).

## 4. Didaktik / Nutzen

Alltagsintegrierte Sprachbildung ist der Kern der Sprach-Kitas-Nachfolge-
programme; mehrsprachige Impulskarten sind als Druckprodukt extrem günstig
und sofort einsetzbar. Ein Satz in der Familiensprache öffnet Türen –
besonders in der Eingewöhnung. Bewusst kurze, sehr gebräuchliche Sätze
(Genauigkeit vor Menge); gegenderte Verbformen wurden vermieden.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, **speichert nichts**
(kein localStorage). Team-Werkzeug OHNE eltern.html, nicht im Sammelband.

## 6. Tests

`test/logik.test.mjs`: Bank gültig (≥4 Situationen × ≥2 Karten, Praxis-Tipps),
je Karte de + kyrillisch uk/ru + lateinische Aussprachehilfe (Schrift-Checks
in beide Richtungen), Kern-Situationen abgedeckt, Methode/Ehrlichkeits-Hinweis,
`kartenFuer`-Filter, `vorleseText`.

## 7. Erweiterungen (Katalog)

Weitere Sprachen nur mit geprüfter Übersetzung (tr/ar/pl), Karten-Sets je
Jahreszeit, Kopplung mit elternbrief-generator und eingewoehnungs-tagebuch.
