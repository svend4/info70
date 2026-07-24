# Kurz-GDD: Nahrungsnetz-Werkstatt 🕸️

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 21 — «Nahrungsnetz-
Werkstatt (Ökosystem-Simulator)». **Engine:** deterministischer Ein-Schritt-
Simulator (reine Logik). Zielgruppe: 8–12 (5–7 in Ko-Nutzung).

## 1. Kernaussage

Ökosystem-Simulator zu Wald, Wiese und Teich: eine Art im Bestand verändern,
und Räuber/Beute passen sich einen Schritt an. Kindgerechte Erklärung der
Kettenwirkung, Warnung wenn ein Glied verschwindet. „Alles hängt zusammen“ (BNE).

## 2. Zielgruppe

Kinder 8–12. Nachbarn: jahreszeiten-rad (geplant), mathe-entdecker,
gemeinsam-gesund-essen, klang-detektive.

## 3. Ablauf

1) Lebensgemeinschaft wählen (Wald/Wiese/Teich) – „wer frisst wen“ sichtbar.
2) Bei einer Art „➕ mehr / ➖ weniger“; Bestände (0–5) als Balken.
3) Erklärung des Schrittes (Folgen + Verschwinden-Warnung), vorlesbar;
   „↩️ Zurück ins Gleichgewicht“.

## 4. Didaktik / Nutzen

BNE ist Querschnittsauftrag der Länderstrategien; ein deutschsprachiger
Nahrungsketten-Simulator für 8–12 hat kaum Konkurrenz. Bewusst stark
vereinfachtes Ein-Schritt-Modell (mehr Beute → mehr Räuber; mehr Räuber →
weniger Beute) – die Modell-Grenze wird dem Kind ehrlich gesagt. Mittel-
europäische Arten; Rote Liste Deutschland (🛡️) statt belarussischer Beispiele.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, **speichert nichts**
(nur Anzeige-Einstellung lokal). Kinder-App mit eltern.html, im Sammelband.

## 6. Tests

`test/logik.test.mjs`: Netze gültig (Produzent, Ketten auf echte Arten,
Nahrung für Nicht-Produzenten), Arten/Rote-Liste, `startBestand`, Klassiker
„Wolf weg → Reh steigt“, „mehr Reh → Wolf steigt, Pflanze sinkt“, Clamp 0..max
+ Original unverändert, `erklaere` (Richtung/Folgen/Verschwinden-Warnung),
`artName`.

## 7. Erweiterungen (Katalog)

Mehrschritt-Simulation mit Nachschwingen, Zersetzer-Ebene, weitere Biotope,
Kopplung mit jahreszeiten-rad; „Rote Liste“-Infokarten.
