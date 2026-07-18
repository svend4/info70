# Kurz-GDD: Fristen-Radar 📅

**Einheit aus Katalog:** docs/09 №246 — «Fristen-Radar mit ICS-Export
(foerder-navigator)». **Engine:** neu: lokale ICS-Erzeugung über der
gemeinsamen Programm-Datenbasis. Zielgruppe: Betreiber.

## 1. Kernaussage

Alle geprüften Förder- und Preis-Fristen nach Termin sortiert – plus eine
lokal erzeugte .ics-Kalenderdatei zum Download. So verpassen Betreiber kein
Einreichfenster, ganz ohne Server.

## 2. Zielgruppe

Betreiber, Träger, Redaktionen. Direkter Nachbar: foerder-navigator (liefert
die Daten). Ergänzt den Kanal „Förderung/Preise“.

## 3. Ablauf

1) Termin-Programme erscheinen nach Frist sortiert mit „noch N Tage“.
2) „Kalender (.ics) herunterladen“ erzeugt eine RFC-5545-Datei mit einem
Termin je Frist.
3) Programme ohne festen Termin werden separat gelistet.

## 4. Didaktik / Nutzen

Verwandelt die statische Programmliste in einen handlungsfähigen Kalender:
Der ICS-Export integriert Fristen in den eigenen Kalender – der stärkste
Hebel gegen verpasste Deadlines. Die Erzeugung ist rein clientseitig und
zeigt vor, dass Kalender-Export ohne Server geht.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter) – die Logik erzeugt nur Text.
Daten kommen same-origin vom foerder-navigator. Kein localStorage, kein
Upload; die .ics-Datei entsteht per Blob im Browser. Werbefrei.

## 6. Tests

`test/logik.test.mjs`: mitTermin (nur „termin“ + ISO), sortiereNachFrist
(aufsteigend), tageBis (ganze Tage, negativ = vorbei), icsDatum/icsEscape,
baueICS (gültige VCALENDAR/VEVENT-Struktur, ein Event je Termin, CRLF,
DTSTAMP), chronologische DTSTART-Reihenfolge – gegen die echten Programmdaten.

## 7. Erweiterungen (Katalog)

Preise-und-Wettbewerbe-Paket (№245, mehr Karten); Erinnerungs-Vorlauf
(VALARM); Verzahnung mit Compliance-Koffer.
