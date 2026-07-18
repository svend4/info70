# Kurz-GDD: Spiele-Kauf-Kompass 🎮

**Einheit aus Katalog:** docs/09 №223 — «Spiele-Kauf-Kompass». **Engine:**
kriterien-check-Muster mit neuem Katalog. Zielgruppe: Familie (Eltern+Kind
6-15).

## 1. Kernaussage

Vor dem Kauf/der Installation eines Spiels geht die Familie eine kurze
Checkliste durch – Alter, Chat, Kosten, Daten – jede Position mit
kindgerechter Erklärkarte. Am Ende gibt es eine Ampel-Empfehlung und einen
druckbaren Merkzettel.

## 2. Zielgruppe

Eltern und Kind gemeinsam. Nachbarn: berechtigungs-safari, erstes-handy-
kompass, familien-medienvertrag, lootbox-labor/muenz-trick (Kinder-Sicht der
Mechaniken).

## 3. Ablauf

1) 4 Bereiche mit Prüfpunkten abhaken (Checkbox + Erklärkarte + Vorlesen).
2) Fortschritt und Ampel-Empfehlung aktualisieren sich live.
3) Als Merkzettel drucken oder „Zurücksetzen“.

## 4. Didaktik / Nutzen

Macht aus einer Kaufentscheidung ein gemeinsames Gespräch statt eines
Verbots. Die Erklärkarten übersetzen USK/PEGI, Chat-Risiken, Lootboxen und
Datensparsamkeit in kindgerechte Sprache. Der Print-Merkzettel hilft, die
Einstellungen (Chat auf „nur Freunde“, Kaufsperre) gleich umzusetzen.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, Vorlesen. Nur der
Häkchen-Stand (skk.status) liegt lokal, löschbar. Kein Auslesen des Geräts –
reine Anleitungs-Checkliste. eltern.html vorhanden; im Eltern-Sammelband
gelistet.

## 6. Tests

`test/kriterien.test.mjs`: ≥4 Bereiche/≥8 Punkte mit eindeutigen IDs und
Erklärkarten, die vier Prüfdimensionen (alter/kommunikation/kosten/daten),
thematische Abdeckung (USK/PEGI, Chat, Kaufsperre, Lootbox, Daten/Anmeldung).

## 7. Erweiterungen (Katalog)

Spiele-Kauf-Kompass in Leichter Sprache; Verzahnung mit lootbox-labor und
erstes-handy-kompass; uk/ru.
