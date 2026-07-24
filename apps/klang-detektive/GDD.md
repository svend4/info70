# Kurz-GDD: Klang-Detektive 🎧

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 20 — «Klang-Detektive».
**Engine:** WebAudio-Synthese + datengetriebenes Hör-Quiz (reine Logik prüft
Selbstkonsistenz). Zielgruppe: 3–5 (Ko-Nutzung) / 5–7.

## 1. Kernaussage

Hör-Quiz zur Gehörbildung mit lokal erzeugten Klängen: hoch/tief, laut/leise,
schnell/langsam, rauf/runter (Glissando), weich/scharf (Wellenform). Kind hört
so oft es mag und wählt die Antwort. Alle Töne werden im Browser synthetisiert.

## 2. Zielgruppe

Vorschule. Nachbarn: reim-radar, mathe-entdecker, gefuehle-entdecker,
sicher-unterwegs.

## 3. Ablauf

1) Start (Ohren-Schutz-Hinweis).
2) 8 Rätsel aus 12: „🔊 Klang anhören“ (WebAudio), dann antworten.
3) Auflösung mit Erklärung + „Nochmal hören“; Punkte, Rang, Rekord.

## 4. Didaktik / Nutzen

Musikalische Frühbildung scheitert oft an fehlender Fachlichkeit der Teams;
lokal synthetisierte Klänge (WebAudio) umgehen sämtliche Musikrechte-Probleme
und brauchen kein Vorwissen. Konsolidiert die wiederkehrenden Hör-Quiz-
Dubletten der Quelle zu einem gestuften Produkt.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Klänge per WebAudio (kein externes
Audio, kein Netzwerk), nur Rekord in localStorage (klang.rekord). Werbefrei.
Anzeige-Einstellungen (BFSG). Kinder-App mit eltern.html, im Sammelband.
BFSG-Hinweis: rein auditives Quiz – Erklärungen sind vorlesbar; für gehörlose
Kinder ist es nicht geeignet (ehrlich in der Eltern-Info benannt).

## 6. Tests

`test/logik.test.mjs`: Fragenbank selbstkonsistent (`pruefeFragen`: korrekt ==
`erwarteteAntwort` aus Parametern UND Wortlaut), alle 5 Merkmale vertreten,
`erwarteteAntwort` beachtet Polarität (höher/tiefer, lauter/leiser, …),
Inkonsistenz wird erkannt, `rangFuer`.

## 7. Erweiterungen (Katalog)

Timbre-Erweiterung (Instrumenten-Nachahmung), Rhythmus-Nachklatschen,
uk/ru-Vorlesen; Ausbaustufe 8–12 mit Intervallen.
