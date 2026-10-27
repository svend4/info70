# Kurz-GDD: Link-Kompass 🧭

**Einheit aus Katalog:** docs/09 №50 — «Link-Kompass». **Engine:** quiz-kern
(Content-Pack, inkl. Klassen-Modus).

## 1. Kernaussage

Nicht jeder Link ist gleich. Wer Link-Arten erkennt und vor dem Klicken
prüft, tappt seltener in Fallen.

## 2. Zielgruppe

Kinder 8-12. Nachbarn: koeder-quiz, fake-shop-fahnder, seiten-scanner,
impressum-detektive.

## 3. Ablauf

quiz-kern-Standard: Start → 12er-Runde → binaer/wahl mit Erklärung →
„Ende der Runde“ ohne Wertung. Zusätzlich Klassen-Modus.

## 4. Didaktik

Link-Arten: interner Link, gekennzeichneter externer Link (↗), Download,
App-Store-Link, Werbe-Falle. Prüf-Gewohnheiten: URL vs. Text vergleichen,
kryptische Adressen als Warnzeichen, Blink-Buttons entlarven. Balance-Test:
beide binaer-Antworten kommen vor. Kein Verbot, sondern Einordnung + „im
Zweifel Erwachsene fragen“.

## 5. Politik-Konformität (docs/02)

Netzwerk-Wächter, quiz-kern macht keine Anfragen, Fälle beschrieben (keine
echten Links), werbefrei, Vorlesen, eltern.html. Die App speichert nichts und
kennt keine Punkte, keinen Rekord, keine Ränge; der frühere Schlüssel
`lk.rekord` wird beim Start einmal entfernt.

## 6. Tests

`test/fragen.test.mjs`: quiz-kern-Schema (≥10), Balance (ja+nein),
Typ-Mischung, Kategorie-Abdeckung, Link-Arten (intern/extern/Download/
App-Store/Werbung/URL), keine Ränge in den Daten, App-Code ohne Wertung und
ohne Speicher.

## 7. Erweiterungen (Katalog)

Nachbarpakete: Wer steckt dahinter? (№51), Seiten-Scanner; uk/ru +
Leichte Sprache über kinder-ui.
