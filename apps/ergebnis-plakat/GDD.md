# Kurz-GDD: Ergebnis-Plakat 📊

**Einheit aus Katalog:** docs/09 Ось G — «Ergebnis-Plakat (mitmach-arena)».
**Engine:** neu: Balkendiagramm-Druckansicht aus dem Klassen-Koffer.
Zielgruppe: Klasse/Lehrkraft (Kinder 8–12).

## 1. Kernaussage

Ein Abstimmungsergebnis wird als großformatiges Balkendiagramm fürs
Klassenzimmer gedruckt – rein clientseitig aus dem Klassen-Koffer der
mitmach-arena. Lernziel: Ergebnisse gehören allen und werden transparent
gemacht.

## 2. Zielgruppe

Klasse/Lehrkraft. Nachbarn: mitmach-arena, klassen-koffer-auswertung,
kinderrat, familienrat.

## 3. Ablauf

1) Klassen-Koffer-Datei importieren (oder laufende Umfrage laden / Beispiel).
2) Großes Balkendiagramm mit %, Gewinner 🏆 / Gleichstand.
3) Plakat drucken (Balkenfarben werden mitgedruckt).

## 4. Didaktik / Nutzen

Macht demokratische Ergebnisse sichtbar und feierlich; schließt den Kreis
Abstimmung → Ergebnis → Aushang. Ergänzt den Klassenrat.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei. **Speichert nichts**
(liest nur den Koffer bzw. die laufende Umfrage read-only). Druckwerkzeug
ohne eltern.html.

## 6. Tests

`test/plakat.test.mjs`: baueBalken (Sortierung, Prozente, eindeutiger
Gewinner, Gleichstand, keine Stimmen) und Format-Kompatibilität mit dem
mitmach-arena Klassen-Koffer (pruefeKoffer).

## 7. Erweiterungen (Katalog)

Mehrere Diagrammtypen, QR-Code auf dem Plakat, Kopplung mit dem Klassenrat-
Themenpaket und der Klassen-Koffer-Auswertung.
