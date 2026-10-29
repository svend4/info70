# Befund „Rang“ in der Wortliste (Stand 29.10.2026)

Dieser Befund gehört zum Inventar vom 29.10.2026 (`docs/inventar-offene-punkte-2026-10-29.md`, Befund B-21). Er beschreibt, was die Erweiterung der Wortliste um „Rang“ im Bestand findet. Eine App wurde dafür nicht geändert.

## 1. Ausgangslage

Plan-Tor 1 im Plan vom 27.10 (`docs/plan-neue-welle.md`, Abschnitt 3, Punkt 1) nennt „Rang“ unter den Wörtern, die kein Kind bewerten. Das Werkzeug `tools/leistungs-woerter.mjs` hatte dafür keine Gruppe. Es konnte „Rang“ deshalb in keiner App melden, und die Prüfung „ohne unerklärten Treffer“ war für dieses Wort leer.

## 2. Was geändert wurde

- `packages/kinderschutz/src/leistungs-woerter.mjs`: neue Gruppe `rang` für Rang, Ränge, Rangliste, Rangfolge, Rangordnung und Rangplatz als ganze Wörter. Ein Unterstrich davor zählt als Teil eines Bezeichners, deshalb trifft `STATUS_RANG` nicht.
- `packages/kinderschutz/test/leistungs-woerter.test.mjs`: ein Test für die neue Gruppe (Treffer, Verneinung „keine Ränge“, Bezeichner, Vorrang).
- Geändert wurde keine App, kein Wertungs-Stand (`docs/bewertung-stand.json`) und keine Basislinie.

Die Gruppe ist ein Bericht, kein Tor. Sie fällt in `tools/leistungs-woerter.mjs --zaehlen` in die Summe.

## 3. Befund im Bestand

Nach der Erweiterung meldet das Werkzeug zehn Treffer der Gruppe `rang` in zwei Apps. Die Zählung schließt Kommentare aus und lässt Wörter hinter einer Verneinung weg (`keine Ränge`).

| App | Stelle | Was dort steht | Wer es sieht | Offen |
|---|---|---|---|---|
| `autonomiephase-navigator` | `app.mjs` Z. 98 und 99 | Am Ende der Auswertung zeigt die App einen Rang: Emoji und Titel nach der Punktzahl (vier Stufen aus `daten/szenarien.json`, Titel „auf dem Weg“ bis „gelassen & klar“). Z. 95 ist die Variable dazu. | Eltern (Erwachsenen-App) | Frage 70 und Entscheidung 51 |
| `barriere-detektive` | `app.mjs` Z. 142 | Überschrift „Eure Fairness-Rangliste“. Die Liste ordnet die geprüften Apps nach Checklisten-Punkten, „fairste zuerst“ (`logik.mjs` Z. 35, Funktion `rangliste`). Der Einstieg heißt „Fairste App küren“ (Z. 93). | Kinder 8 bis 12 | Frage 71 |
| `barriere-detektive` | `app.mjs` Z. 9, 93, 139, 149, 150; `logik.mjs` Z. 35 | Funktionsname und Kennungen (`bd-rangliste`, `bd-rangliste-vorlesen`, `bd-rangliste-zurueck`). Sie sind nicht sichtbar. | niemand | keine eigene Entscheidung; die Kennungen bleiben |

Ein Fehlalarm wurde ausgeschlossen: `apps/foerder-navigator/logik.mjs` hat die Konstante `STATUS_RANG` (Sortierreihenfolge der Fristen). Das ist kein Rang eines Menschen.

Die Stelle `autonomiephase-navigator` zeigt außerdem Punkte, einen Rekord und ein Sternsymbol (🌟 als Emoji der obersten Stufe). Diese Wörter stehen seit langem im Bestand und sind im Werkzeug bereits gemeldet; sie gehören zu Frage 70.

## 4. Tests

Die Tests, die die Wortliste benutzen, bleiben grün: `apps/himmelsgucker-sonne-mond-und-sterne`, `apps/musik-woerter-bilderlexikon`, `apps/meine-familie-woerter-und-rollen-content-pack` (je Test auf keinen Treffer) und `apps/deutschland-kompass/test/wertung-muster.mjs` (Gruppen aller Muster, auch für die noch nicht committete Arbeit an CON-4). Der Test `packages/kinderschutz/test/testzahlen.test.mjs` ist rot wegen der Gesamtzahl im README und wegen Frage 69; die Gesamtzahl wird beim Commit von CON-4 gesetzt.

## 5. Was daraus folgt

- Entscheidung 51 (Ränge) bleibt offen. Sie betraf bisher CON-1, CON-4 und KIN-17; jetzt gehören `autonomiephase-navigator` und `barriere-detektive` dazu.
- Frage 70: Gilt die Wortliste für Apps für Erwachsene, deren Wertung nur das eigene Handeln der Erwachsenen betrifft?
- Frage 71: Darf eine Rangliste geprüfter Apps in einer Kinder-App stehen?

Die Zählung ist maschinell. Die Stellen oben hat der Koordinator am Quelltext nachgesehen. Eine fachliche Prüfung durch einen Menschen steht aus.
