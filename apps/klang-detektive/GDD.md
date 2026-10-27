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
3) Auflösung mit Erklärung + „Nochmal hören“; am Ende „Ende der Runde“ und die Wahl
   „Noch einmal“ oder „Start“. Das Kind wird nicht bewertet: kein Punktestand, kein
   Rekord, keine Ränge, nur die Rückmeldung zu jeder Antwort mit Erklärung.

## 4. Didaktik / Nutzen

Musikalische Frühbildung scheitert oft an fehlender Fachlichkeit der Teams;
lokal synthetisierte Klänge (WebAudio) umgehen sämtliche Musikrechte-Probleme
und brauchen kein Vorwissen. Konsolidiert die wiederkehrenden Hör-Quiz-
Dubletten der Quelle zu einem gestuften Produkt.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Klänge per WebAudio (kein externes
Audio, kein Netzwerk), die App speichert nichts (ein früher gespeicherter alter
Eintrag wird beim Start einmal entfernt); darum keine Karte „Meine Daten löschen“. Werbefrei.
Anzeige-Einstellungen (BFSG). Kinder-App mit eltern.html, im Sammelband.
BFSG-Hinweis: rein auditives Quiz – Erklärungen sind vorlesbar; für gehörlose
Kinder ist es nicht geeignet (ehrlich in der Eltern-Info benannt).

## 6. Tests

`test/logik.test.mjs`: Fragenbank selbstkonsistent (`pruefeFragen`: korrekt ==
`erwarteteAntwort` aus Parametern UND Wortlaut), alle 5 Merkmale vertreten,
`erwarteteAntwort` beachtet Polarität (höher/tiefer, lauter/leiser, …),
Inkonsistenz wird erkannt; Abwesenheits-Tests: keine Rang-Funktion, keine Ränge in
den Daten, kein Zähler im App-Code; Speicherregel: kein Speicher, keine Karte,
Eltern-Seite sagt „speichert nichts“.

## 7. Erweiterungen (Katalog)

Timbre-Erweiterung (Instrumenten-Nachahmung), Rhythmus-Nachklatschen,
uk/ru-Vorlesen; Ausbaustufe 8–12 mit Intervallen.
