# Kurz-GDD: Freunde in der Gruppe 🤝

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 10 — «Freunde in der
Gruppe – Sozial-Trainer». **Engine:** Szenario-Trainer (2/1/0) + Vorlesen.
Zielgruppe: 5–7 (Ko-Nutzung), Weiterführung 8–12.

## 1. Kernaussage

Sozial-Trainer zu Konfliktlösung und Peer-Kompetenz: pro Situation aus der
Kindergruppe drei Optionen (2/1/0) mit kindgerechter Erklärung. Themen:
mitspielen lassen, teilen, Streit fair lösen, trösten, entschuldigen, fair
verlieren, warten, Rollen aushandeln, Gefühle erkennen, Hilfe holen.

## 2. Zielgruppe

Vorschule/Grundschule. Nachbarn: gefuehle-entdecker, sicher-unterwegs,
stark-im-chat-mini, tagesblick-fachkraft, gruppenklima-check.

## 3. Ablauf

1) Start (Vorlesen), Hinweis „keine Blamage – Reden ist das Wichtigste“.
2) 12 Situationen aus 14 (gemischt), je 3 Optionen, Erklärung + Vorlesen.
3) Punkte 2/1/0, Rang und Rekord; Gesprächsimpuls für Erwachsene.

## 4. Didaktik / Nutzen

Konfliktlösung und Peer-Kompetenz sind der meistgefragte Förderbereich in
Elterngesprächen. Die 2/1/0-Wertung macht „freundlich / geht so / unfair“
erlebbar. Kultursensibel, ohne Kindernamen. Aus 10 Kindergruppen-Zielen
abgeleitet; alle Szenen Eigenproduktion (kein Buchtext aus der Quelle).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), keine Konten, nur Rekord in
localStorage (freunde.rekord). Werbefrei. Vorlesen + Anzeige-Einstellungen
(BFSG). Keine Kindernamen im Content. Kinder-/Ko-Nutzungs-App mit eltern.html,
im Eltern-Sammelband.

## 6. Tests

`test/logik.test.mjs`: ≥12 Szenen, eindeutige IDs, genau 3 Optionen mit genau
EINER 2er- und einer 0er-Option, Werte 0/1/2, Abdeckung (Mitspielen/Teilen/
Streit/Gefühle, Hilfe-holen-kein-Petzen), einfache Sprache (≤130 Zeichen),
Wertung/Rang-Logik, Rang in 12er-Runde erreichbar.

## 7. Erweiterungen (Katalog)

Konsolidiert drei Streit-Schlichter-Dubletten; Abzählreim-Zufallshelfer als
faires Los, uk/ru-Vorlesen, Kopplung mit gefuehle-entdecker.
