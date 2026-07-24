# Kurz-GDD: Erzähl-Brücke 🌉

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 19 — «Erzähl-Brücke».
**Engine:** Baustein-Generator mit injizierbarem Zufall (Muster geschichten-
werkstatt). Zielgruppe: 5–8, gern in Ko-Nutzung.

## 1. Kernaussage

Würfelt Held + Ort + Problem und zeigt eine vierstufige „Erzähl-Treppe“
(Es war einmal / Eines Tages / Aber dann / Am Ende) mit Impulsfragen plus
Überraschungs-Karten. Das Kind erzählt die Geschichte LAUT selbst – die App
liefert nur das Gerüst. Kein Mikrofon, keine Aufnahme, nichts gespeichert.

## 2. Zielgruppe

Kinder/Familie. Nachbarn: geschichten-werkstatt (App schreibt Text),
reim-radar, familienschatz-reime, vorlese-kompass.

## 3. Ablauf

1) Start erklärt „du erzählst laut, der Computer hört nicht zu“ (Vorlesen).
2) „Geschichte würfeln“: Startsatz + 4 Treppenstufen mit Impulsen (je vorlesbar).
3) „Überraschung einbauen“ (Zufalls-Impuls), „Neue Geschichte“, „Start“.

## 4. Didaktik / Nutzen

Erzählfähigkeit ist ein zentraler Vorläufer der Bildungssprache. Die Mechanik
„Kind erzählt mündlich, App liefert nur das Gerüst, keine Aufnahme“ ist
datenschutz-vorbildlich und stärkt zugleich freie Sprachproduktion – in jeder
Familiensprache. Alle Bausteine sind Eigenproduktion.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), KEIN Mikrofon/keine Aufnahme,
speichert nichts (kein localStorage). Werbefrei. Vorlesen (BFSG). Kinder-App
mit eltern.html, im Sammelband.

## 6. Tests

`test/logik.test.mjs`: Bank gültig (Helden/Orte/Probleme, 4-stufige Treppe
anfang/los/aber/ende), „kein Aufnehmen“-Hinweis, `waehleElemente`
(injizierbar), `startSatz`/`baueGeruest` (Startsatz + 4 Impuls-Stufen).

## 7. Erweiterungen (Katalog)

uk/ru-Impulse, Bild-Karten statt Text, Kopplung mit familienschatz-reime;
Würfel für Genre (Märchen/Abenteuer/Alltag).
