# Kurz-GDD: Bewegungspausen-Generator ⚡

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 16 — «Bewegungspausen-
Generator (Fiskultminutki)». **Engine:** isolierte Generator-Funktion mit
injizierbarem Zufall (Muster geschichten-werkstatt) + Druck-CSS.
Zielgruppe: Fachkräfte (Kita, „Bewegte Schule“), auch Familien.

## 1. Kernaussage

Würfelt aus einer Baustein-Kartei sofort einsetzbare 7–10-Minuten-Bewegungs-
pausen: fester Ablauf Aufwachen → Power → Koordination → Ruhe, jede Übung mit
Anleitung und eigenem Vers – ohne Material, am Platz. Druckansicht + Text-
Export; das Gerät ist nur Impulsgeber, die Pause selbst ist bildschirmfrei.

## 2. Zielgruppe

Fachkräfte/Lehrkräfte, Familien. Nachbarn: bewegungs-schatzkiste (große
Kartei), kita-wochenplaner, stark-und-gesund, takt-pause.

## 3. Ablauf

1) „Neue Pause würfeln“: je Phase ein Baustein; unter 7 Min wird ein zweiter
   Power-Baustein ergänzt (Korridor 7–10 Min, keine Dubletten).
2) Skript als Karten (Anleitung + Vers + Minuten), vorlesbar.
3) Drucken (druck.css, `bpg-nur-bildschirm`), Text speichern/kopieren.

## 4. Didaktik / Nutzen

Das Fiskultminutki-Prinzip (kurze Bewegungs-Verse zwischen Sitzphasen) als
Generator: sofort einsetzbar, keine Vorbereitung, kein Marktpendant. Fester
Spannungsbogen (aktivieren → fokussieren → beruhigen) bringt die Gruppe in
die Arbeitshaltung zurück. Alle Übungen/Verse sind Eigenproduktion.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, **speichert nichts**
(kein localStorage). Das Kind braucht keinen Bildschirm. eltern.html, im
Sammelband (auch für Familien nutzbar).

## 6. Tests

`test/logik.test.mjs`: Bank gültig (4 Phasen × ≥2 Bausteine, Verse,
Urheberrechts-Hinweis), `erzeugePause` deterministisch (Ablauf-Reihenfolge,
Korridor 7–10, keine Dubletten), 50 Zufallsläufe im Korridor, alle Phasen
vertreten, `skriptText` (nummeriert, Verse, OER-Hinweis).

## 7. Erweiterungen (Katalog)

Themen-Pakete (Jahreszeiten-Verse), uk/ru-Verse, Kopplung mit
kita-wochenplaner und bewegungs-schatzkiste.
