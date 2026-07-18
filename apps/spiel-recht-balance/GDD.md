# Kurz-GDD: Spiel-Recht-Balance ⚖️

**Einheit aus Katalog:** docs/09 №34 — «Spiel-Recht-Balance». **Engine:**
planer (reine Logik + dünne DOM-Schicht).

## 1. Kernaussage

Der Tag ist eine Balance dreier Rechte, nicht eine Bildschirmzeit-Ampel.
Erholung ist ein Recht (Art. 31) – das Kind reguliert selbst.

## 2. Zielgruppe

Kinder 8-12. Nachbarn: takt-pause (Bildschirmzeit), sog-maschine,
fomo-kompass. Bindet Hilfe-Insel (kinder-ui) ein.

## 3. Ablauf

Für jedes der drei Rechte grob einschätzen (gar nicht/wenig/genug/viel) →
Balance-Balken + Auswertungssatz + Selbst-Plan-Vorschläge für zu kurz
Gekommenes. „Warum drei Rechte?“-Lektion. Hilfe-Insel jederzeit.
Nur heutiger Stand lokal (srb.heute) + „Neuer Tag“.

## 4. Didaktik

Selbstregulation statt Fremdverbot: keine Bewertung, kein „zu viel“,
keine Scham (Test verbietet Verbots-/Scham-Ton). Rahmung als Recht
(Art. 31) statt als Pflicht. Vorschläge sind Selbst-Pläne („Was tust DU
morgen dafür?“). Balance-Bild macht einseitige Tage sichtbar, ohne zu
moralisieren.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), nur `srb.heute` in
localStorage + Löschknopf, werbefrei, Vorlesen, mobile-first, eltern.html,
Hilfe-Insel-Baustein (116 111).

## 6. Tests

`test/logik.test.mjs`: 3 Rechte mit Art.-31-Bezug, zuKurz-Schwelle,
auswertung (Gleichgewicht / viel-Medien-Fall / einzelnes Recht) inkl.
Stop-Liste gegen Verbots-/Scham-Ton, vorschlag je Code, Lektionen-Substanz.

## 7. Erweiterungen (Katalog)

Wochen-Rückblick (Balance über 7 Tage); Verknüpfung mit takt-pause;
uk/ru + Leichte Sprache über kinder-ui.
