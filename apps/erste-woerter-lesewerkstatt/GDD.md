# Kurz-GDD: Erste-Wörter-Lesewerkstatt 🔤

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 25 — «Erste-Wörter-
Lesewerkstatt». **Engine:** dreistufiges Hör-/Lese-Quiz mit reiner Logik
(Lautgetreu-Prüfung, Silbenteilung, Options-Generatoren). Zielgruppe: 5–7.

## 1. Kernaussage

Erstes Lesen nach dem Stufenmodell, auf die deutsche Silbenmethode umgestellt:
1) Vokale hören, 2) offene Silben hören (KV aus 8 häufigen Konsonanten),
3) lautgetreue Wörter lesen (OMA, SOFA, TOMATE) mit Silbenbögen und
Bild-Selbstkontrolle. Runden sind bewusst kurz (8 Aufgaben → „Lese-Pause“).

## 2. Zielgruppe

Vorschule/Klasse 1. Nachbarn: reim-radar (phonologische Vorstufe),
uhr-und-kalender-kind, mathe-entdecker.

## 3. Ablauf

1) Runde bauen: 2 Vokal- + 3 Silben-Höraufgaben + 3 Wort-Leseaufgaben
   (leicht → schwer).
2) Hören: „🔊 Anhören“ (Web Speech) → aus 3 Schriftbildern wählen.
3) Lesen: Wort groß + Silbenbögen → passendes Bild aus 3 wählen;
   Silben anhörbar. Auflösung stets ermutigend.
4) Ende nach 8 Aufgaben mit aktivem Pause-Impuls; Rekord lokal.

## 4. Didaktik / Nutzen

Silbenbasiertes, lautgetreues Anfangslesen mit Bild-Selbstkontrolle entspricht
dem deutschen Silben-/Fibelansatz und schließt an reim-radar an. Lautgetreue
Wortbank ist technisch abgesichert (keine Dehnungs-h, keine Doppelbuchstaben,
nur Anfangs-Alphabet – per `istLautgetreu` im Test). Zeitbegrenzung als
Feature: kurze Runde, klares Ende, Pause wird ausgesprochen.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Stimme nur lokal (Web Speech),
nur Rekord in localStorage (lese.rekord). Werbefrei. Anzeige-Einstellungen
(BFSG). Kinder-App mit eltern.html, im Sammelband.

## 6. Tests

`test/logik.test.mjs`: Material gültig (5 Vokale, 8 Konsonanten, KV-Silben,
lautgetreue Wörter), `istLautgetreu` (FAHNE/BALL/QUARK abgelehnt, HOSE ok),
`hoerOptionen`/`bildOptionen` (3 eindeutige, richtige an 0), `silbenTeilen`
(O-MA, TO-MA-TE, MOND ganz; Silben ergeben das Wort für die ganze Bank).

## 7. Erweiterungen (Katalog)

Stufe 4 (KVKK-Wörter), Groß-/Kleinschreibung als Schalter, uk/ru-Modus für
zweisprachige Kinder, druckbare Silbenkarten (quiz-karten-druck-Muster).
