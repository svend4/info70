# Befund: wörtlich übernommene Stellen aus der Pralęska in Apps (Stand 29.10.2026)

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

**Ausgangslage.** Der Rechtsrahmen in `docs/10-praleska-baukasten.md`, Abschnitt „Правовая и этическая рамка“, Punkt 1 verlangt: Aus dem Buch werden nur nicht geschützte Begriffe, Strukturen und Methoden übernommen, „ни одного дословного текста“. Die Grenze von sechs Wörtern für Zitate (Frage 62) ist noch nicht entschieden; die Prüfung der Bauaufträge nutzt sie bereits (`tools/bauauftrag-pruefen.mjs`).

**Was geprüft wurde.** `tools/wortgleich-pruefen.mjs` sucht in allen Dateien der Apps (`.md`, `.mjs`, `.html`, `.json`) kyrillische Zitate (in «», „“ oder "") mit mindestens 20 Zeichen und vergleicht jede Folge von sieben aufeinanderfolgenden Wörtern mit dem Text der Pralęska (Normalform: ohne Satzzeichen, Groß und Klein, Trennstriche am Zeilenende). Eine Fundstelle heißt: Die Folge steht wörtlich im Buch. Die Prüfung findet keine Übersetzungen und keine Paraphrasen; deshalb ist die Zahl eine Untergrenze.

**Ergebnis.** 62 Fundstellen in 17 Apps; die Seiten liegen auf 24 Seiten des Buches. Die Texte selbst stehen in diesem Dokument nicht, um keinen wörtlichen Text zu wiederholen; die Fundstellen lassen sich mit `node tools/wortgleich-pruefen.mjs <all.txt>` reproduzieren.

Wichtig für die Einordnung: Viele Stellen sind Felder `zitat` in den Datendateien. Die App zeigt sie teils am Bildschirm an (z. B. `impulskarten-sujetspiel`: die Zeile unter jeder Karte nennt die Quelle und den Zitattext; `bewegungs-richtwerte-3-5`: Normen mit Zitat). Das ist keine Randnotiz, sondern eine Veröffentlichung von Buchtext.

## Übersicht je App

| App | Fundstellen | Dateien |
|---|---|---|
| `bewegungs-richtwerte-3-5` | 17 | `daten/richtwerte.json` |
| `impulskarten-sujetspiel` | 6 | `daten/karten.json` |
| `kunst-gucken` | 6 | `GDD.md`, `README.md`, `daten/achsen.json` |
| `buchecke-check` | 5 | `daten/checkliste.json` |
| `spielbegleiter-rollenspiel` | 4 | `daten/karten.json` |
| `bewegungs-kartei-erstes-jahr` | 3 | `GDD.md`, `README.md`, `daten/kartei.json` |
| `erste-kuenstler` | 3 | `README.md`, `daten/ideen.json`, `logik.mjs` |
| `fachquiz-erstes-lebensjahr` | 3 | `README.md`, `daten/fragen.json` |
| `schatzkarten-generator` | 3 | `GDD.md`, `README.md`, `app.mjs` |
| `elterngespraech-uebergang` | 2 | `README.md`, `daten/gespraech.json` |
| `puste-lauschspiel-kartei` | 2 | `GDD.md`, `daten/kartei.json` |
| `sport-schnupper-stationen` | 2 | `README.md`, `daten/stationen.json` |
| `werkstatt-karten-applikation` | 2 | `daten/karten.json`, `test/logik.test.mjs` |
| `kindertaenze-europa` | 1 | `daten/tanze.json` |
| `kita-mitmach-boerse` | 1 | `daten/angebote.json` |
| `morgenkreis-wochenplaner-u3` | 1 | `daten/plan.json` |
| `musik-jahresplaner` | 1 | `GDD.md` |

## Fundstellen

| App | Datei:Zeile | Wörter | Seite im Buch |
|---|---|---|---|
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:29` | 7 | S. 129 |
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:45` | 11 | S. 129 |
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:53` | 13 | S. 129 |
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:61` | 14 | S. 129 |
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:77` | 7 | S. 131 |
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:85` | 10 | S. 131 |
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:101` | 12 | S. 131 |
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:109` | 15 | S. 132 |
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:117` | 11 | S. 131 |
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:141` | 13 | S. 132 |
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:149` | 14 | S. 132 |
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:157` | 13 | S. 129 |
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:165` | 8 | S. 131 |
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:173` | 8 | S. 131 |
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:181` | 19 | S. 132 |
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:189` | 11 | S. 132 |
| `bewegungs-richtwerte-3-5` | `daten/richtwerte.json:197` | 18 | S. 132 |
| `impulskarten-sujetspiel` | `daten/karten.json:20` | 11 | S. 68 |
| `impulskarten-sujetspiel` | `daten/karten.json:26` | 14 | S. 69 |
| `impulskarten-sujetspiel` | `daten/karten.json:32` | 9 | S. 69 |
| `impulskarten-sujetspiel` | `daten/karten.json:38` | 7 | S. 69 |
| `impulskarten-sujetspiel` | `daten/karten.json:44` | 13 | S. 69 |
| `impulskarten-sujetspiel` | `daten/karten.json:50` | 12 | S. 69 |
| `kunst-gucken` | `daten/achsen.json:8` | 7 | S. 89 |
| `kunst-gucken` | `daten/achsen.json:334` | 7 | S. 88 |
| `kunst-gucken` | `GDD.md:72` | 7 | S. 89 |
| `kunst-gucken` | `README.md:26` | 14 | S. 88 |
| `kunst-gucken` | `README.md:64` | 7 | S. 89 |
| `kunst-gucken` | `README.md:109` | 7 | S. 88 |
| `buchecke-check` | `daten/checkliste.json:19` | 9 | S. 155 |
| `buchecke-check` | `daten/checkliste.json:25` | 9 | S. 155 |
| `buchecke-check` | `daten/checkliste.json:31` | 19 | S. 251 |
| `buchecke-check` | `daten/checkliste.json:59` | 12 | S. 155 |
| `buchecke-check` | `daten/checkliste.json:77` | 12 | S. 251 |
| `spielbegleiter-rollenspiel` | `daten/karten.json:12` | 13 | S. 104 |
| `spielbegleiter-rollenspiel` | `daten/karten.json:32` | 14 | S. 145 |
| `spielbegleiter-rollenspiel` | `daten/karten.json:50` | 13 | S. 146 |
| `spielbegleiter-rollenspiel` | `daten/karten.json:56` | 9 | S. 146 |
| `bewegungs-kartei-erstes-jahr` | `daten/kartei.json:13` | 10 | S. 35 |
| `bewegungs-kartei-erstes-jahr` | `GDD.md:5` | 10 | S. 35 |
| `bewegungs-kartei-erstes-jahr` | `README.md:5` | 10 | S. 35 |
| `erste-kuenstler` | `daten/ideen.json:185` | 9 | S. 96 |
| `erste-kuenstler` | `logik.mjs:2` | 10 | S. 96 |
| `erste-kuenstler` | `README.md:109` | 9 | S. 96 |
| `fachquiz-erstes-lebensjahr` | `daten/fragen.json:56` | 9 | S. 5 |
| `fachquiz-erstes-lebensjahr` | `daten/fragen.json:117` | 9 | S. 42 |
| `fachquiz-erstes-lebensjahr` | `README.md:12` | 9 | S. 42 |
| `schatzkarten-generator` | `app.mjs:197` | 7 | S. 246 |
| `schatzkarten-generator` | `GDD.md:44` | 7 | S. 246 |
| `schatzkarten-generator` | `README.md:31` | 7 | S. 246 |
| `elterngespraech-uebergang` | `daten/gespraech.json:307` | 9 | S. 300 |
| `elterngespraech-uebergang` | `README.md:8` | 9 | S. 300 |
| `puste-lauschspiel-kartei` | `daten/kartei.json:252` | 8 | S. 68 |
| `puste-lauschspiel-kartei` | `GDD.md:13` | 8 | S. 68 |
| `sport-schnupper-stationen` | `daten/stationen.json:289` | 8 | S. 230 |
| `sport-schnupper-stationen` | `README.md:15` | 8 | S. 230 |
| `werkstatt-karten-applikation` | `daten/karten.json:55` | 8 | S. 126 |
| `werkstatt-karten-applikation` | `test/logik.test.mjs:137` | 8 | S. 126 |
| `kindertaenze-europa` | `daten/tanze.json:13` | 7 | S. 265 |
| `kita-mitmach-boerse` | `daten/angebote.json:81` | 7 | S. 24 |
| `morgenkreis-wochenplaner-u3` | `daten/plan.json:48` | 8 | S. 9 |
| `musik-jahresplaner` | `GDD.md:50` | 8 | S. 170 |


## Was bereits geändert wurde (29.10.2026, nicht gelöscht, aber ersetzt)

Drei Stellen sind bei der Serie-C-Prüfung in dieser Sitzung ersetzt worden, ohne dass dafür eine Entscheidung vorlag:
- `schulstart-begleiter`, README: der ganze russische Satz aus Seite 205 wurde entfernt; der Begriff «Готовность к школе» bleibt, die Aussage ist als eigene Übertragung beschrieben (Korrektur datiert).
- `klanggeschichten-erzeuger`, README: die achtwörtige russische Fußnote auf S. 79 ist als deutsche Übertragung formuliert (Korrektur in der Serie-C-Notiz der App).
- `entwicklungs-kompass`, README und `daten/indikatoren.json`: zwei Zitate mit je sieben Wörtern und ein Wortlaut in den Daten sind auf fünf Wörter und eine Auslassung gekürzt.

Diese drei Änderungen widersprechen der Regel „ohne Löschung“ im Wortlaut. Sie sind im Sinne von Rechtsrahmen Punkt 1 gemacht. Max bestätigt sie oder setzt sie zurück (Frage 78).

## Offen

Die übrigen 62 Fundstellen bleiben unverändert, bis Max entschieden hat (Frage 78). Ein Umbau berührt Anzeigen in 17 Apps und die Tests der Apps. Die Optionen stehen in Frage 78 (`docs/fragen-fuer-max-2026-10-28.md`).
