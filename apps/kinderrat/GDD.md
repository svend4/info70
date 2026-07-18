# Kurz-GDD: Kinderrat 🗳️

**Einheit aus Katalog:** docs/09 №31 — «Kinderrats-Modul». **Engine:**
beteiligung (mitmach-arena-Muster, Sitzungsmodus, Datei-Export).

## 1. Kernaussage

Ein formales Beteiligungsverfahren zum Erleben: Tagesordnung, Redeliste,
Abstimmung mit Begründung, Protokoll – demokratische Form, kindgerecht.

## 2. Zielgruppe

Klasse 8-12 am Beamer, geführt von Lehrkraft. Nachbarn: mitmach-arena
(Abstimmen), regel-werkstatt (Regeln), projektwoche.

## 3. Ablauf

Titel/Datum → Redeliste (erste Person dran) → Tagesordnung (Vorschläge
oder eigene) → je TOP: dafür/dagegen/enthalten zählen, Ergebnis
automatisch, Begründung eintragen → Protokoll-Text + Klassen-Koffer
Export/Import. Sitzung lokal (kr.sitzung) + „Neue Sitzung“.

## 4. Didaktik

Form schult Demokratie: Ausreden lassen (Redeliste), Mehrheit ermitteln
(Abstimmung), UND begründen, warum – der Begründungsschritt hebt es über
reines Abstimmen hinaus. Protokoll macht Beschlüsse verbindlich und
nachvollziehbar. Datei-Austausch statt Server (fragFINN-konform).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Austausch nur über selbst
weitergegebene Dateien, nur `kr.sitzung` in localStorage + Löschknopf,
Hinweis „nur Vornamen“, werbefrei, eltern.html.

## 6. Tests

`test/koffer.test.mjs`: ergebnis (3 Fälle), istBehandelt (Abstimmung +
Begründung), packeProtokoll (Ergebnis eingerechnet, gültig), protokollText
(TOP/Abstimmung/Ergebnis/Begründung), pruefeProtokoll (fremd/kaputt),
Startvorschläge.

## 7. Erweiterungen (Katalog)

Klassenrat-Handbuch (№40) als Anleitung; Rollenkarten (Leitung/Zeit/
Protokoll); Druck-Protokoll; uk/ru + Leichte Sprache.
