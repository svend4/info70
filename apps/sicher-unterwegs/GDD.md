# Kurz-GDD: Sicher unterwegs 🚦

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 7 — «Sicher unterwegs –
Szenario-Trainer Alltag & Straße». **Engine:** Szenario-Trainer +
Vorlesen. Zielgruppe: 5–7 (Ko-Nutzung), Weiterführung 8–12.

## 1. Kernaussage

Szenario-Trainer zu Alltags- und Verkehrssicherheit: pro Situation drei
Optionen mit Rückmeldung und kindgerechter Erklärung. Themen: Straße/Ampel, fremde
Personen, Feuer und Notruf (112/110), Gift/Medikamente, fremde Tiere,
Werkzeug, Küche, Wasser, Strom, Fahrradhelm.

## 2. Zielgruppe

Vorschule/Grundschule. Nachbarn: notruf-held (112/110 üben), reim-radar,
gefuehle-entdecker, stark-und-gesund.

## 3. Ablauf

1) Start (Vorlesen), Hinweis auf 112/110.
2) 12 Situationen aus 14 (gemischt), je 3 Optionen, Erklärung + Vorlesen.
3) Ende der Runde ohne Auswertung (kein Punktestand, keine Ränge, kein Rekord);
   Gesprächsimpuls für Erwachsene.

## 4. Didaktik / Nutzen

Verkehrs- und Sicherheitserziehung ist Pflichtthema aller Bildungspläne, aber
für 5–7 kaum als App vorhanden. Die Rückmeldung zu jeder Antwort macht „ganz
sicher / halb / gefährlich“ erlebbar; das Kind wird dabei nicht bewertet. Deutsche Realität (Ampel, Zebrastreifen, 112/110). Alle
Szenen sind Eigenproduktion (kein Buchtext aus der Quelle).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), keine Konten, die App speichert
nichts (keine Karte „Meine Daten löschen“, kein Löschknopf); der alte
Rekord-Schlüssel wird beim Start einmal in einer Zeile entfernt. Werbefrei. Vorlesen + Anzeige-Einstellungen
(BFSG). Kinder-/Ko-Nutzungs-App mit eltern.html, im Eltern-Sammelband.

## 6. Tests

`test/logik.test.mjs`: ≥12 Szenen, eindeutige IDs, keine Ränge in den Daten,
genau 3 Optionen mit genau EINER 2er- und einer 0er-Option, Werte 0/1/2 (für die
Rückmeldung), Abdeckung (Straße/Fremde/112/110/Gift/Tiere), einfache Sprache
(≤120 Zeichen/Satz), Rückmeldung zu jeder Antwort, Abwesenheit von Punkten,
Rang und Rekord im App-Code, Speicherregel (nichts gespeichert, keine Karte,
alter Schlüssel in einer Zeile entfernt).

## 7. Erweiterungen (Katalog)

Absorbiert vier Sicherheits-Dubletten; Kopplung mit notruf-held, uk/ru-Vorlesen
für Familien mit Migrationsgeschichte, Content-Pack „Schulweg“.
