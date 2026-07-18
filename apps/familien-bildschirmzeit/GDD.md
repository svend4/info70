# Kurz-GDD: Familien-Bildschirmzeit-Wette ⏱️

**Einheit aus Katalog:** docs/09 Ось F — «Familien-Bildschirmzeit-Wette».
**Engine:** neu: Selbstauskunft-Ampel je Familienmitglied (planer-Verwandt).
Zielgruppe: Eltern+Kind 8–15.

## 1. Kernaussage

Alle – auch die Eltern – setzen sich eigene Ampel-Ziele und tragen selbst
ein, wie die Woche lief. Keine Fernüberwachung: nur Selbstauskunft, Vergleich
freiwillig im Familienrat. Sichere Voreinstellungen statt Kontrolle.

## 2. Zielgruppe

Familien. Nachbarn: takt-pause, familienrat, familien-medienvertrag,
fomo-kompass.

## 3. Ablauf

1) Personen mit eigenem Ziel hinzufügen (auch Eltern).
2) Woche über täglich die eigene Ampel setzen (🟢/🟡/🔴), Zyklus per Tipp.
3) Wochenbilanz + Rückmeldung; Übersicht für den Familienrat drucken.

## 4. Didaktik / Nutzen

Selbstregulation und Augenhöhe: Kinder schätzen die eigene Nutzung ein,
Eltern machen sichtbar mit. Bezug UN-KRK Art. 31, Datensparsamkeit (keine
ausgelesenen Nutzungszeiten).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei. Lokal nur die laufende
Woche (`fbz.wette`), löschbar. Nur Selbstauskunft (Datenmodell ohne
Fremdüberwachung, Test sichert das). Kind-nah → eltern.html, im Sammelband.

## 6. Tests

`test/wette.test.mjs`: TAGE/AMPEL, fuegeMitglied (leerer Name), setzeTag
(ungültige Werte), wochenBilanz, bewertung-Schwellen, familienBilanz
(je Mitglied, keine Überwachungsfelder), entferneMitglied.

## 7. Erweiterungen (Katalog)

Wochenverlauf über mehrere Wochen, Kopplung mit takt-pause (Ampel-Import),
Familienbeschluss aus dem Familienrat als Ziel übernehmen.
