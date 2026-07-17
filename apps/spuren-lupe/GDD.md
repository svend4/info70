# Kurz-GDD: Spuren-Lupe 🔍

**Einheit aus Katalog:** docs/09 №11 — «Spuren-Lupe». **Engine:** simulator
(reine Logik + dünne DOM-Schicht).

## 1. Kernaussage

Daten entstehen auch ohne Eingabe. Die Lupe macht passives Tracking
sichtbar – und beweist zugleich, dass sie selbst nichts sendet.

## 2. Zielgruppe

Kinder 8-12. Nachbarn: daten-schatz (Szenarien), daten-radiergummi
(Löschrecht), berechtigungs-safari (App-Rechte, geplant).

## 3. Ablauf

1. Hinweis-Karte: „Diese App sendet nichts.“
2. Signal-Karte: echte Werte (Gerät, Bildschirm, Sprache, Zeitzone,
   Farbschema) + live hochzählende Dauer und Klicks; je Signal ein
   aufklappbares „Warum ist das wichtig?“.
3. Auflösung: 4 Lektionen (passives Tracking, Fingerabdruck, „sendet
   nichts“, Schutztipps).

## 4. Didaktik

Der Aha-Moment ist der Widerspruch: „Ich habe nichts eingegeben“ vs. eine
volle Liste echter Signale. Verhalten (Dauer, Klicks) als Datum ist der
Kern – deshalb zählen sie live mit. Ehrlichkeits-Move: Eine App über
Tracking, die selbst nicht trackt (Netzwerk-Wächter als Beweis).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), speichert NICHTS, werbefrei,
Vorlesen, mobile-first, eltern.html. Nur lesende, harmlose Browser-APIs;
keine Geolocation/Kamera/Mikrofon-Abfragen, keine Fingerprint-Persistenz.

## 6. Tests

`test/logik.test.mjs`: dauerText (Ein-/Mehrzahl, nie negativ),
geraeteEinschaetzung (als „eher“ formuliert), SIGNALE-Struktur inkl.
Verhaltensspuren (dauer/klicks), Lektionen-Substanz (passives Tracking,
Fingerabdruck, „sendet nichts“, Schutztipps).

## 7. Erweiterungen (Katalog)

Cookie-Fenster-Trainer (ehrlich „Nur nötige“ wählen); Berechtigungs-Safari
(№97) als Familien-Fortsetzung; uk/ru + Leichte Sprache über kinder-ui.
