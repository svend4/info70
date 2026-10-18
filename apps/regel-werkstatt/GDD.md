# Kurz-GDD: Regel-Werkstatt 🛠️

**Einheit aus Katalog:** docs/09 №16 — «Regel-Werkstatt». **Engine:**
beteiligung (mitmach-arena-Muster: Datei-Austausch, kein Server).

## 1. Kernaussage

Selbst ausgehandelte Regeln wirken. Die Klasse sammelt, stimmt ab und
beschließt eigene Medienregeln – und hängt sie als Plakat auf.

## 2. Zielgruppe

Kinder 8-12 (Klasse/Familie). Nachbarn: mitmach-arena (Abstimmen),
familien-medienvertrag (Familie), projektwoche (Tag 5: Charta).

## 3. Ablauf

1. Gruppenname; 2) Vorschläge sammeln (Startvorschläge editierbar);
3) Abstimmen (👍, Balken, stabile Sortierung); 4) sichern:
Plakat drucken + Klassen-Koffer exportieren/importieren/vereinigen.
Fortschritt lokal (rw.werkstatt) + „Neu anfangen“.

## 4. Didaktik

Demokratie als Erlebnis, nicht als Vortrag: Vorschlag → Stimme → sichtbares
Ergebnis. Der Klassen-Koffer erlaubt echte Mehrgeräte-Beteiligung ohne
Konten/Chats (fragFINN-konform). Das Plakat macht den Beschluss
verbindlich (Datum, Unterschriften).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Austausch nur über selbst
weitergegebene Dateien, nur `rw.werkstatt` in localStorage + Löschknopf,
werbefrei, Druck-CSS (pw-nur-bildschirm/pw-nur-druck), eltern.html.
Kinder-Eingaben: an Gruppenname und Regelvorschlag steht sichtbar der Hinweis
„Keine Namen von Mitschüler*innen eintragen.“, per aria-describedby mit dem Feld
verknüpft (nicht im Feldnamen).

## 6. Tests

`test/koffer.test.mjs`: sortiere (stabil), packeKoffer/pruefeKoffer
(gültig vs. fremd/kaputt), vereinigeKoffer (addieren + anhängen),
Startvorschläge (sinnvolle Medienthemen, kurze Sätze).
`test/regeln.test.mjs`: Hinweis „Keine Namen von Mitschüler*innen eintragen.“ an
Gruppenname und Regelvorschlag (Text einmal, aria-describedby auf vorhandene ids,
direkt vor dem Feld, nicht im Feldnamen, nicht versteckt). Testzahl: 9 (`npm test`).

## 7. Erweiterungen (Katalog)

Klassenrat-Themenpaket (№118) als Vorlagen-Set; Netz-Pass-Urkunde als
Beschluss-Beleg; uk/ru + Leichte Sprache über kinder-ui.
