# Kurz-GDD: Familien-Budget 💶

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 23 — «Familien-Budget:
klein anfangen (Simulator)». **Engine:** deterministischer Auswahl-Simulator
(reine Logik). Zielgruppe: 8–12.

## 1. Kernaussage

Einnahmen/Ausgaben-Simulator mit Spielgeld: erst die festen Kosten der
Familie sehen, dann mit dem freien Rest (300 €) Bedürfnisse, Wünsche und
Sparen abwägen – auch die Bedürfnisse anderer Familienmitglieder. Bewertung:
Bedürfnisse zuerst, Sparen ist klug, Überziehen geht nicht.

## 2. Zielgruppe

Kinder 8–12. Nachbarn: muenz-trick, lootbox-labor, spiele-kauf-kompass
(Kostenfallen-Cluster), familien-datenschatz.

## 3. Ablauf

1) Feste Kosten als Aufstellung (Einkommen → was übrig bleibt).
2) 10 Posten (4 Bedürfnisse, 5 Wünsche, 1 Spartopf) ankreuzen; Live-Rest.
3) „Monat abschließen“ → Stufe (super/gut/überlegen/überzogen) + Hinweise,
   vorlesbar. „Neu planen“.

## 4. Didaktik / Nutzen

Finanzielle Grundbildung wird von OECD/Verbraucherzentralen angemahnt;
kindgerechte deutschsprachige Angebote für 8–12 fehlen fast völlig. Kern-
unterscheidung Bedürfnis/Wunsch plus Sparen; bewusst knappes Budget (die
Summe aller Posten übersteigt es – per Test gesichert), damit echtes Abwägen
nötig ist. Keine realen Produkte/Preise, keine Kaufappelle (UWG-sicher).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, KEINE echten Käufe,
**speichert nichts** (nur Anzeige-Einstellung lokal). Kinder-App mit
eltern.html, im Sammelband.

## 6. Tests

`test/logik.test.mjs`: Daten gültig (Arten-Mix, Budget knapper als Posten-
Summe, Spielgeld-Hinweis), `festeSumme`/`frei`, Überziehen erkannt,
Bedürfnis-vor-Wunsch-Hinweis, Stufe „super“ (Bedürfnisse + Spartopf
bezahlbar), Stufe-Logik bei exakt aufgebrauchtem Budget, Reinheit der
Bewertungsfunktion.

## 7. Erweiterungen (Katalog)

Mehrere Monate mit Spartopf-Fortschritt, unerwartete Ereignisse (Waschmaschine
kaputt → wozu Rücklagen gut sind), Kopplung mit muenz-trick.
