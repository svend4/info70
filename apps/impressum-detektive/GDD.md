# Kurz-GDD: Impressum-Detektive 🕵️

**Einheit aus Katalog:** docs/09 №45 — «Impressum-Detektive». **Engine:**
quiz-kern (Content-Pack, inkl. Klassen-Modus).

## 1. Kernaussage

Jede seriöse Seite verrät, wer sie betreibt. Wer das Impressum finden und
prüfen kann, erkennt Transparenz – und ihr Fehlen als Warnzeichen.

## 2. Zielgruppe

Kinder 8-12. Nachbarn: koeder-quiz (Betrug), nachrichten-detektive
(Transparenz von Beiträgen), geplant: fake-shop-fahnder, wer-steckt-dahinter.

## 3. Ablauf

quiz-kern-Standard: Start → 12er-Runde aus dem Vorrat → binaer/wahl mit
Erklärung → Ergebnis ohne Punkt und Rang. Zusätzlich Klassen-Modus (mündliches Raten,
gemeinsame Auflösung, ohne Wertung/Daten).

## 4. Didaktik

Drei Kategorien: „Warum Pflicht?“ (DDG § 5, MStV § 18, Transparenz als
Schutz), „Wo versteckt?“ (Footer/Menü, leicht erkennbar, tief versteckt =
Signal), „Echt oder Fake?“ (Pflichtangaben, Fantasie-Adressen, selbst-
gebastelte Siegel). Balance-Test: beide binaer-Antworten kommen vor, damit
das Kind PRÜFT statt pauschal zu urteilen.

## 5. Politik-Konformität (docs/02)

Netzwerk-Wächter in der App, quiz-kern macht keine Anfragen; Fälle sind
nachgestellt (keine echten Seiten), nichts in localStorage (alter Schlüssel `imp.rekord` wird entfernt) +
Löschknopf (im Kern), werbefrei, Vorlesen, eltern.html.

## 6. Tests

`test/fragen.test.mjs`: quiz-kern-Schema (≥16 Fragen), didaktische Balance
(ja+nein), Typ-Mischung, Kategorie-Abdeckung (je ≥3), Rechtsbezug
(DDG/MStV, Footer, Adresse, Warnzeichen).

## 7. Erweiterungen (Katalog)

Nachbarpakete derselben Familie: Fake-Shop-Fahnder (№46), Wer steckt
dahinter? (№51), Seiten-Scanner (№47); uk/ru + Leichte Sprache über
die kinder-ui-Bausteine.
