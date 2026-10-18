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
Hinweis „nur Initiale oder Nummer“, werbefrei, eltern.html. Das Redeliste-Feld
ist auf 3 Zeichen begrenzt; der Hinweis „Nur Initiale oder Nummer, keine
Namen.“ steht sichtbar direkt vor dem Feld und ist per aria-describedby
verknüpft. Bereits gespeicherte Namen (kr.sitzung) werden beim Update nicht
gelöscht; sie bleiben bis „Neue Sitzung“.

## 6. Tests

`test/koffer.test.mjs`: ergebnis (3 Fälle), istBehandelt (Abstimmung +
Begründung), packeProtokoll (Ergebnis eingerechnet, gültig), protokollText
(TOP/Abstimmung/Ergebnis/Begründung), pruefeProtokoll (fremd/kaputt),
Startvorschläge.

`test/regeln.test.mjs` (Quelltext-Prüfung): Redeliste maxlength 3, Hinweis
sichtbar und per aria-describedby verknüpft, eltern.html/README/GDD ohne
die frühere Angabe. Gesamt: 9 Tests (`npm test`).

## 7. Erweiterungen (Katalog)

Klassenrat-Handbuch (№40) als Anleitung; Rollenkarten (Leitung/Zeit/
Protokoll); Druck-Protokoll; uk/ru + Leichte Sprache.
