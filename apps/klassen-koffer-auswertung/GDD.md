# Kurz-GDD: Klassen-Koffer-Auswertung 🧳

**Einheit aus Katalog:** docs/09 Ось E — «Klassen-Koffer-Auswertung für Lehrkräfte».
**Engine:** neu: Import + Aggregation zu Heatmap (Muster Klassen-Koffer).
Zielgruppe: Lehrkräfte.

## 1. Kernaussage

Schülergeräte exportieren anonyme Ergebnis-Dateien (nur Antwortmuster, frei
gewählte Tiernamen), die Lehrkraft importiert sie per Datei und sieht eine
Heatmap „Welche Frage/welches Szenario fiel der Klasse schwer?“ – mit
Druckansicht. Kein Server, keine Konten, nichts Personenbezogenes.

## 2. Zielgruppe

Lehrkräfte. Nachbarn: mitmach-arena (Klassen-Koffer), stundenentwurf-*,
nachrichten-detektive, projektwoche.

## 3. Ablauf

1) Ergebnis-Dateien mehrerer Geräte importieren (validiert, Personendaten abgelehnt).
2) Heatmap-Tabelle: Fragen nach Falsch-Quote sortiert, 🟢/🟡/🔴.
3) Drucken / Bericht kopieren / zurücksetzen.

## 4. Didaktik / Nutzen

Zeigt der Lehrkraft datensparsam, wo die Klasse Förderbedarf hat, ohne
einzelne Kinder zu bewerten (Tiernamen, aggregiert). Grundlage für gezielte
Wiederholung.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei. **Keine Persistenz** –
Import lebt nur im Arbeitsspeicher. Schema lehnt `name`/`klarname` aktiv ab
(DSGVO Art. 5/8). Schulwerkzeug ohne eltern.html.

## 6. Tests

`test/auswertung.test.mjs`: pruefeKoffer (gültig/ungültig/Personendaten),
aggregiere (Zählung, schwierigste zuerst, Tiere/Quelle), stufe-Schwellen,
baueBericht.

## 7. Erweiterungen (Katalog)

Export-Seite in quiz-kern/szenario (Ergebnis-Koffer schreiben), CSV-Export,
Verlaufsvergleich über mehrere Termine, Kopplung mit „Meine Bildschirmwoche“.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
