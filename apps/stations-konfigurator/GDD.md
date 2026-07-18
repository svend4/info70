# Kurz-GDD: Stations-Konfigurator 🧭

**Einheit aus Katalog:** docs/09 Ось E — «Stations-Konfigurator für Lernstationen».
**Engine:** neu: Konfig-Schicht (URL-Hash) + Laufzettel-Generator.
Zielgruppe: Lehrkräfte (Kinder 8–12).

## 1. Kernaussage

Eine kleine Konfig-Schicht, mit der die Lehrkraft jede App auf ein Modul
festpinnt (Deep-Link mit URL-Hash) und daraus Lernstationen baut – plus
druckbarer Laufzettel pro Runde und ein teilbarer Konfig-Link. Komplett
offline, keine neuen Datenflüsse.

## 2. Zielgruppe

Lehrkräfte, die Stationsarbeit mit 2–4 Tablets organisieren. Nachbarn:
projektwoche, stundenentwurf-*, klassen-koffer-auswertung.

## 3. Ablauf

1) Stationen anlegen (Name, App, Modul, Aufgabe, Minuten).
2) Deep-Link je Station (App auf Modul gepinnt, Navigation gesperrt).
3) Laufzettel drucken/kopieren; Konfig-Link zum Teilen kopieren.
4) Geteilten Link öffnen -> Stationen sind wieder da.

## 4. Didaktik / Nutzen

Macht jedes Tablet zur fertigen Lernstation ohne Konten oder Setup;
Laufzettel strukturiert die Rotation. Das Pinnen/Sperren in der App ist als
Vertrag (Hash-Parameter) definiert; App-seitige Umsetzung ist Ausbaustufe.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei. Lokal gespeichert wird
nur die aktuelle Stationsliste (`sk.stationen`), löschbar. Konfig-Link ist
ein reiner URL-Hash (kein Server). Schulwerkzeug ohne eltern.html.

## 6. Tests

`test/konfigurator.test.mjs`: baueStation/pruefeStation, stationsLink
(Modul+gesperrt), kodiere/dekodiere-Round-Trip (Umlaute/Emoji), konfigLink/
ausHash-Round-Trip, kaputter Hash -> [], gesamtdauer, baueLaufzettel.

## 7. Erweiterungen (Katalog)

App-seitiges Lesen des gesperrt-Hash (Navigationssperre je App), QR-Code für
den Konfig-Link, Kopplung mit klassen-koffer-auswertung und projektwoche.
