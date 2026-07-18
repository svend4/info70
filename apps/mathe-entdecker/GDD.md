# Kurz-GDD: Mathe-Entdecker 🔢

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 6 — «Mathe-Entdecker:
Zahlen, Formen, Reihen». **Engine:** @info70/quiz-kern (binär + wahl, Vorlesen).
Zielgruppe: 5–7 (kurze Einheiten, 4–5 in Ko-Nutzung).

## 1. Kernaussage

Frühe mathematische Bildung als Vorlese-Quiz: Mengenvergleich, Zählen bis 10,
Formen und ihre Ecken, Reihen/Muster fortsetzen, Größenvergleich,
Raumrichtungen, gerechtes Teilen (Hälfte) und Tageszeiten.

## 2. Zielgruppe

Vorschule 5–7. Nachbarn: reim-radar, uhr-und-kalender-kind (geplant),
sicher-unterwegs, gefuehle-entdecker.

## 3. Ablauf

1) Start (Vorlesen), gemeinsames Mitsprechen.
2) 10 Aufgaben aus 16 (quiz-kern mischt, Vorlesen je Aufgabe).
3) Punkte + Rang + Rekord; Duett-/Staffel-/Klassen-Modus vom quiz-kern geerbt.

## 4. Didaktik / Nutzen

Deckt den eigenen Bildungsbereich „Mathematische Bildung“ aller Länder ab und
macht Mathe im Alltag sichtbar (zuordnen statt raten, Formen suchen). Aus 26
operationalisierten Praleska-Lernzielen abgeleitet; alle Aufgaben sind
Eigenproduktion (kein Buchtext aus der Quelle).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), keine Konten, nur Rekord in
localStorage (mathe.rekord). Werbefrei. Vorlesen (BFSG). Kinder-App mit
eltern.html, im Eltern-Sammelband. Emojis als Mengenbilder (keine externen
Assets).

## 6. Tests

`test/fragen.test.mjs`: quiz-kern-Schema gültig (pruefeFragen), Mischung
binär/wahl (ja UND nein), Abdeckung (Mengen/Zählen/Formen/Reihen, Ecken,
mehr/weniger), Ränge in 10er-Runde erreichbar, Mindestvorrat 12.

## 7. Erweiterungen (Katalog)

Ausbaulinie „Zahlenland bis 20“ (8–12), Mini-Simulator zum Legen von Reihen,
uk/ru-Zahlwörter als Herkunftssprachen-Chance.
