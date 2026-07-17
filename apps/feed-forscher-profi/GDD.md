# Kurz-GDD: Feed-Forscher Profi 🌀

**Einheit aus Katalog:** docs/09 №7 (топ-лист) — «Feed-Forscher Profi
(13-15)». **Engine:** simulator (reine Logik + dünne DOM-Schicht).

## 1. Kernaussage

Der Feed wird nicht falscher - er wird schärfer. Radikalisierung ist
eine Treppe aus kleinen Angeboten, die je eine Spur über dem letzten
Klick liegen. Wer das einmal im Simulator erlebt hat, erkennt es im
echten Feed wieder.

## 2. Zielgruppe

Jugendliche 13-15. Anschluss nach unten: feed-forscher (8-12,
Themen-Blase). Nachbarn: sog-maschine (Halte-Mechaniken),
verschwoerungs-werkstatt (Muster-Prebunking).

## 3. Ablauf (Loop)

1. Themenwelt wählen (4 neutrale Welten).
2. Feed aus 4 Karten mit Stufen-Badge (1-5, Farbskala); eine Karte ist
   IMMER der Köder eine Stufe über dem Profil.
3. Klick → Profil driftet Richtung klick+0.8; Temperatur-Anzeige steigt;
   Hinweis erklärt, was der Algorithmus "notiert" hat.
4. Gegensteuern jederzeit: Nicht-interessiert / Themen-Mix.
5. Blase geschlossen (Profil ≥ 4) → Einsichts-Bildschirm ("Du hast NIE
   Stufe 5 gesucht") → Lektionen (DSA Art. 27/38/34-35) oder Blase
   aufbrechen und weiterforschen.

## 4. Didaktik

Asymmetrie ist Lehrinhalt: Klicks nach oben ziehen stärker (0.5-Faktor
auf klick+0.8) als Signale nach unten (-0.9/-1.6) - genau das frustriert
im echten Feed, hier wird es benannt. Die Einsicht "nie gesucht, nur
angenommen" nimmt Jugendlichen die Scham und gibt ihnen die Mechanik.
Abstrakte Muster statt echter Ideologien: Prebunking der FORM.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), speichert NICHTS, werbefrei,
Vorlesen, mobile-first, ab-13-Kennzeichnung, eltern.html mit
Echt-Feed-Hausaufgabe. Stop-Liste per Test: keine Parteien, Plattformen,
Verschwörungs-Marken.

## 6. Tests

`test/logik.test.mjs`: Stufen/Themen-Schema, Köder-Invariante
(algorithmusZiel > klick), Treppen-Beweis (geschlossene Blase in ≤8
Runden ohne Stufe-5-Suche), Feed-Karten-Invariante (Köder oberhalb des
Profils), Ausstiegs-Beweis (offen in ≤3 Mix-Schritten), Zonen-Grenzen,
Stop-Liste, Lektionen-Substanz (DSA-Artikel, Treppe, Geld-Frage).

## 7. Erweiterungen (Katalog)

Klassen-Modus (Klasse steuert per Abstimmung einen Feed am Beamer);
"Zwei Feeds"-Vergleich (profiliert vs. chronologisch nebeneinander);
uk/ru-Lokalisierung über mini-i18n wie beim kleinen feed-forscher.
