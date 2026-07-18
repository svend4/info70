# Kurz-GDD: Reim-Radar 👂

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 5 — «Reim-Radar».
**Engine:** @info70/quiz-kern (binär + wahl, Vorlesen). Zielgruppe: 4–6 in
Ko-Nutzung mit Erwachsenem.

## 1. Kernaussage

Phonologische Bewusstheit als kurzes Vorlese-Quiz: Reimpaare finden, Reime
hören (ja/nein), Anlaute erkennen, Wortlängen vergleichen und Silben klatschen.
Das ist der am besten belegte Prädiktor für den späteren Schriftspracherwerb.

## 2. Zielgruppe

Vorschule 4–6, gemeinsam mit einem Erwachsenen. Nachbarn: gefuehle-entdecker,
gemeinsam-gesund-essen, sicher-unterwegs, notruf-held, nachrichten-detektive-
junior.

## 3. Ablauf

1) Gemeinsamer Start (Erwachsener liest/klatscht mit).
2) 8 Aufgaben aus 14 (quiz-kern mischt, Vorlesen je Aufgabe).
3) Punkte + Rang + Rekord; Duett-/Staffel-/Klassen-Modus vom quiz-kern geerbt.

## 4. Didaktik / Nutzen

Übt die Vorläuferfähigkeiten Schriftsprache (Bildungsbereich Sprache aller
Länder) auf spielerische, hörende Weise – ohne Buchstaben-Druck. Alle Reim-
und Anlautbeispiele sind Eigenproduktion (kein Buchtext aus der Quelle).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), keine Konten, nur Rekord in
localStorage (reimradar.rekord). Werbefrei. Vorlesen (BFSG). Kinder-/Ko-
Nutzungs-App mit eltern.html, im Eltern-Sammelband. Praleska-Adaption:
deutsche Reim-/Anlautbeispiele, uk/ru als spätere Herkunftssprachen-Chance.

## 6. Tests

`test/fragen.test.mjs`: quiz-kern-Schema gültig (pruefeFragen), Mischung
binär/wahl (Reim ja UND nein), Abdeckung (Reim/Anlaut/Wortlänge/Silben),
Ränge in 8er-Runde erreichbar, Mindestvorrat 12.

## 7. Erweiterungen (Katalog)

uk/ru-Reim-Modus (Herkunftssprache), Anlaut-Sammelmodus, Übergang zu
Erste-Wörter-Lesewerkstatt (Nr. 25) und Warum-heißt-das-so-Wort-Quiz.
