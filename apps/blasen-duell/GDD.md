# Kurz-GDD: Blasen-Duell 🫧

**Einheit aus Katalog:** docs/09 Ось G — «Blasen-Duell: zwei Feeds nebeneinander (feed-forscher)».
**Engine:** neu: reine Feed-Simulation (blase.mjs), Split-Screen.
Zielgruppe: 8–12 (Variante 13–15).

## 1. Kernaussage

Split-Screen auf einem Gerät: Zwei Kinder tippen unterschiedliche Interessen
an; derselbe gewichtete Empfehlungs-Algorithmus erzeugt zwei völlig
verschiedene Feeds. Personalisierung wird als Trennung von Sichtweisen
erlebbar.

## 2. Zielgruppe

Kinder 8–12. Nachbarn: feed-forscher, sog-maschine, filter-spiegel,
stundenentwurf-feed.

## 3. Ablauf

1) Beide Kinder tippen auf ihrer Seite Videos an.
2) Jede Seite zeigt ihre wachsende Blase (dominantes Thema, %).
3) Vergleichs-Karte: „zwei verschiedene Welten“ + Lektion + Vorlesen; Reset.

## 4. Didaktik / Nutzen

Zeigt Personalisierung/Filterblasen im direkten Vergleich (stärker als ein
einzelner Feed). Anschluss an Demokratiebildung (Perspektivwechsel).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, **speichert nichts**
(kein localStorage). Keine echten Videos. Kind-nah → eltern.html, im Sammelband.

## 6. Tests

`test/blase.test.mjs`: neueBlase (gleichgewichtet), tippe (nur getipptes
Thema, unveränderlich), dominant (nach Tipps), ziehe (deterministisch mit
injizierter Zufallsquelle; dominantes Thema füllt den Feed), verschieden.

## 7. Erweiterungen (Katalog)

Variante 13–15 mit „Meinungsblasen“ (Nachrichten statt Themen), dritte
Spalte „gemischter Feed“, Kopplung mit feed-forscher.
