# Übergabe für die Pause (Stand 28.10.2026, 04:30 UTC)

Wer die Arbeit nach der Pause weiterführt (der Integrator oder eine neue Sitzung), findet hier den Stand, die laufende Arbeit, die Regeln, die Werkzeuge und die Rezepte für die nächsten Schritte. Entscheidungen trifft Max (Projektleiter, spricht Russisch). Seine offenen Fragen stehen nummeriert in `docs/fragen-fuer-max-2026-10-28.md` (Russisch, 43 Punkte, ★ = Empfehlung des Integrators, ohne Antwort ändert sich nichts). Das Protokoll aller Entscheidungen steht in `docs/fragen-und-hinweise.md`, Abschnitt „Entscheidungen des Nutzers (27.10.2026)“.

Max hat angeordnet: keine neuen Aufträge starten, laufende Arbeit zu Ende bringen lassen, auf eine lange Pause vorbereiten, die Fragen nummeriert sammeln.

## 1. Rolle und feste Regeln

Der Integrator committet allein. Schreiber und Prüfer (Agenten) fassen kein git an. Wortlaut von Max, der gilt, bis er etwas anderes sagt:

- „Apps nur nach Prüfung committen und sofort pushen“; „Push nur auf den Arbeitsbranch“ (`claude/children-network-programs-germany-hr0jh9`); kein Force-Push; kein Pull Request, solange Max keinen verlangt (16а: erst nach A7 und 48 px, Entscheidung offen, Frage 38).
- „при красном прогоне не пушить“; vor jedem Push: Tests in einem sauberen Worktree (siehe 7).
- „Ничего не удалять без списка для Макса“; „Удаления строк, цифр и правил только через Макса“; „исключения в стенде подтверждает Макс“.
- „Новые приложения не запускать“, aufgehoben nur für Stufe 1 (Entscheidungen 11а/11б). Stufe 2 und 3 brauchen sein Zeichen.
- Höchstens 8 Agenten gleichzeitig; jeder Workflow-Lauf endet mit einer Zeile: Zahl der Agenten und geleistete Arbeit (19в). Ultracode ist aus: ein Workflow braucht ausdrücklichen Auftrag von Max („ultracode“ oder „workflow“ in seinen Worten).
- Keine Modellnamen in Dateien, Commits oder Pull-Request-Texten des Repos.
- docs/02: Zeilen 22–24, 79–82, 141–146 bleiben stabil; Ergänzungen nur am Dateiende. README und GDD nennen docs/02 nur mit einer dieser Zeilenangaben.

## 2. Stand beim Anhalten

- Branch `claude/children-network-programs-germany-hr0jh9`, Basis `968c622`, darüber der Commit dieser Übergabe. Der Branch ist nach dem Push mit origin gleich.
- Der Arbeitsbaum im Container enthält ungeprüfte Arbeit von Lauf E (siehe 3). Sie ist **nicht** committet und gehört nicht in den nächsten Commit.
- `npm test` im sauberen Worktree: 2960 Tests grün (README Zeile 83 nennt 2960). 228 Apps in `apps/`; Impressum: 163 speichern gar nichts, 65 speichern etwas.
- Quiz-Durchlauf (26 Quiz-Apps × 3 Modi = 78 Läufe) zuletzt grün (Stand Lauf C und Staffel-Korrektur); `quiz-kern` ist seither nicht angefasst worden.
- Stände: `docs/bewertung-stand.json` (bestätigte Ausnahmen: barriere-detektive, seiten-scanner, sharenting-spiegel, lehrkraefte-szenariotraining, kita-familien-bruecke, foerder-navigator, autonomiephase-navigator; vorgeschlagen und offen: staerken-tagebuch), `docs/speicher-stand.json` (leer), `docs/seitenmarke-stand.json` (keine Apps; dokumentierte Ausnahme erste-woerter-tagebuch), `docs/browser-basislinie.json` (ohneKennung 204, klickFehler 0, beruehrung 32, ueberlauf 0, druck 1511, konsole 0, fremdeHosts 0), `docs/externe-fakten-stand.json` (326 blockierende Zeilen).
- Nichts in diesem Stand ist rot.

## 3. Laufende Arbeit: Lauf E (Stufe 1 der neuen Welle)

Lauf E baut vier neue Apps nach Bauauftrag (je ein Schreiber, dann ein unabhängiger Prüfer, bei Befund Nachbesserung und zweite Prüfung). Skript: `docs/arbeitsweise/workflows/lauf-e-neue-apps.js`, Brief: `docs/arbeitsweise/briefs/e-brief.md`, Run-ID `wf_d63b5ad8-45e` (Journal: `/root/.claude/projects/-home-user-info70/<Sitzung>/subagents/workflows/wf_d63b5ad8-45e/journal.jsonl`).

Stand um 04:10 UTC:

| Einheit | Ordner | Schreiber | Prüfer |
|---|---|---|---|
| CON-3 | `apps/meine-familie-woerter-und-rollen-content-pack/` | fertig, 62 Tests (Eigenangabe) | wartet in der Warteschlange |
| CON-6 | `apps/himmelsgucker-sonne-mond-und-sterne/` | fertig, 70 Tests (Eigenangabe) | wartet |
| CON-9 | `apps/farbwoerter-schatz/` | läuft (Ordner angelegt, unfertig) | wartet |
| CON-10 | `apps/musik-woerter-bilderlexikon/` | läuft (Ordner noch nicht angelegt) | wartet |

Ungeprüft im Arbeitsbaum (untracked): die drei vorhandenen App-Ordner und `docs/registrierung/CON-3.json`, `docs/registrierung/CON-6.json`. Die Berichte der beiden fertigen Schreiber stehen in `docs/arbeitsweise/lauf-e-schreiberberichte.json` (Eigenangaben, von niemandem bestätigt; enthalten die Fragen der Schreiber an Max, siehe Frage 31). Beide Schreiber bauten eigene Karten-Apps (Weg B des GDD-Entwurfs), nicht auf `quiz-kern`; das ist die ungeklärte Plan-Frage 1 (`docs/plan-neue-welle.md`, Abschnitt 5).

Die Nebenläufigkeit ist 2 (4 Prozessoren, Laufzeit begrenzt auf Prozessoren minus 2). Die Warteschlange startet erst alle Schreiber, dann die Prüfer. Schätzung nach den bisherigen Schreibern (CON-3: 48 Minuten, CON-6: 69 Minuten): CON-9 etwa um 04:45, CON-10 etwa um 05:15 UTC; danach laufen die vier Prüfer, je zwei gleichzeitig, mit 20 bis 60 Minuten je Prüfer. Das Ende ist also etwa 3 Stunden nach dem Stand dieser Tabelle zu erwarten.

### Fortsetzen

1. **Die Sitzung lebt noch:** auf die Benachrichtigung des Workflows warten; Ergebnis aus der Task-Ausgabe lesen; die Urteile der Prüfer (`ok`, `nachbessern`, `falsch`) einzeln lesen und bei `nachbessern` die Nachbesserung des Skripts abwarten.
2. **Der Container wurde zurückgesetzt:** zuerst `git status --short`. Gibt es noch Ordner `apps/<slug>/` aus der Tabelle, fehlt aber die Journal-Datei, den Workflow neu starten, aber `EINHEITEN` im Skript auf die unfertigen Einheiten kürzen und für fertige Schreiber nur den Prüfer starten (Prompt `pruefPrompt` im Skript). Gibt es das Journal, genügt `Workflow({scriptPath: <Skript>, resumeFromRunId: 'wf_d63b5ad8-45e'})` (gleiches Skript, gleiche Argumente: zwischengespeicherte Ergebnisse kommen sofort). Fehlen die Ordner, müssen die Einheiten neu geschrieben werden (der Brief reicht aus). Die Textkopie der Quelle entsteht mit `tools/quelle-holen.sh /tmp/info70-quelle` (liest `PRALESKA.pdf` aus `origin/main`); der Brief verweist auf `/tmp/info70-quelle/all.txt`.
3. **Max hat noch nicht über Weg B entschieden:** den Prüfer nicht daran scheitern lassen; die Abweichung vom Motor ist im Bericht vermerkt, die Entscheidung gehört Max (Frage 31).

## 4. Annahme einer neuen App (Schritte des Integrators)

Erst wenn der unabhängige Prüfer `ok` sagt und der Integrator selbst alles nachgemessen hat:

1. Im Wurzel-`index.html` die Zeile im Hub, in der Wurzel-`README.md` die Tabellenzeile, in `docs/10-praleska-baukasten.md` den Vermerk der Einheit (Zahl der Tests nach der Ausgabe von `npm test`), in `docs/praleska-katalog.json` die Korrektur (Texte aus `docs/registrierung/<Kennung>.json`) eintragen.
2. `impressum.html`: Gesamtzahl der Apps (228 plus Zahl der neuen), Zahl der Apps, die „gar nichts“ speichern (163 plus die neuen ohne Speicher). Zahlen aus der Ausgabe des Tests `datenschutz-zusage`.
3. `node tools/zahlen.mjs --schreiben` (setzt die Gesamtzahl der Tests im README). **Nicht** ausführen, solange ungeprüfte Ordner im Baum liegen: die Zählung enthielte sie (3092 statt 2960).
4. `tools/bauauftrag-index.mjs`: Einheit in `STATUS_AB_WELLE_92` als `gebaut` eintragen und Slug zuordnen, dann `node tools/bauauftrag-index.mjs` und `node tools/bauauftrag-pruefen.mjs /tmp/info70-quelle/all.txt` (muss 0 Probleme melden).
5. `packages/kinderschutz/test/hilfe-insel-abdeckung.test.mjs`: Apps ohne Hilfe-Insel stehen unter `BEWUSST_OHNE` (CON-6 bittet darum; Frage 31е).
6. Prüfen: `npm test` (im sauberen Worktree, siehe 7), `node --test packages/kinderschutz/test/{speicher-regel,seitenmarke,externe-fakten}.test.mjs`, `node tools/bewertung-stand.mjs` („Stand stimmt“), `node tools/leistungs-woerter.mjs <slug>`, `node tools/browser-tor.mjs <slug>` (Exit 0, neue App ohne Verletzung), für Quiz-Apps `node tools/quiz-durchlauf.mjs <slug> --modus alle`.
7. Commit mit Namen der Einheit, Push. Eine Zeile Bericht an Max (19в).

## 5. Stände, die nur schrumpfen dürfen (Ratschen)

`docs/bewertung-stand.json`, `docs/speicher-stand.json`, `docs/seitenmarke-stand.json`, `docs/browser-basislinie.json`, `docs/externe-fakten-stand.json`. Wachstum (neuer Treffer, neue Ausnahme) braucht den Schalter `--erweitern` und das Zeichen von Max. `docs/browser-basislinie.json` schreibt allein `node tools/browser-basislinie.mjs --schreiben <Messordner> --integrator` aus der Repo-Wurzel; das Delta-Tor `tools/browser-tor.mjs` misst bei einer Erhöhung bis zu dreimal neu und zählt je Kategorie das Minimum (Zufall in einzelnen Apps).

## 6. Regeln, die sich aus Max' Antworten ergeben (für jede neue oder geänderte App)

- Keine Wertung eines Kindes: weder Punkte, Rekord, Rang, Serie, Prozent, „richtig von“, „geschafft“, Sterne noch Pokal, kein Vergleich von Tagen oder Wochen. Erlaubt ist ein neutraler Zähler des Gefundenen („Gefunden: N“). Prüfung `node tools/leistungs-woerter.mjs <app>`; jeder Treffer entfernt oder als Fehlalarm begründet.
- Speicher: speichert die App etwas (`setItem`), hat sie einen Löschknopf für genau ihre Schlüssel; speichert sie nichts, hat sie keine Karte „Meine Daten löschen“. Die Migration alter Schlüssel ist nur als einzelne Zeile `localStorage.removeItem('<Literal>')` zulässig.
- Kein Service Worker (vier Apps räumen alte Registrierungen und Caches beim Start weg).
- Favicon: `<link rel="stylesheet" …kinder.css" /><link rel="icon" type="image/svg+xml" href="…/packages/kinder-ui/img/favicon.svg" />` auf derselben Zeile.
- Seitenangaben der Praleska (S. n) stehen nur mit der Marke „Seitenangaben nicht von einem Menschen geprüft.“ (oder „…der Quelle: nicht von einem Menschen geprüft.“); „maschinell gegen den Quelltext geprüft“ nur, wenn die Seiten in derselben Aufgabe gegen die Textkopie geprüft wurden. Auf Druckblättern keine Seitenzahlen (A18-Standard).
- Fakten über Recht, Geld, Gesundheit: Quelle oder „(Eigenentwurf, fachlich nicht geprüft)“ am Satz; der Zähler externer Fakten darf nicht steigen.
- Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis im Druckinhalt, keine Namenszeile, keine Tagesfelder; Listen für Erwachsene dürfen leere Kästchen behalten (docs/02).
- Vorlesen für Kinder-Apps (98 von 100 haben es; kinderrat und regel-werkstatt fehlt es, Frage 30); Werkzeuge für Erwachsene tragen im GDD den Vermerk „Vorlesen: nicht vorgesehen“.
- Berührziele mindestens 48 px, kein Überlauf bei 360 px, Fokus nach Klick, nach Bildschirmwechsel Fokus auf der Überschrift (`tabindex="-1"`), jeder Knopf mit `data-kennung`.
- Apps mit Eingabefeld für Erwachsene stehen in `docs/erwachsenen-apps.json`; bei jedem Eingabefeld der Hinweis „Keine Namen von Kindern eingeben.“

## 7. Werkzeuge und Prüfungen

| Zweck | Befehl |
|---|---|
| alle Tests | `npm test` (Wurzel); `npm run test:sitzung` (Zählungs-Tests übersprungen, für Agenten) |
| Zahl der Tests prüfen oder setzen | `node tools/zahlen.mjs [--schreiben]` |
| Wertungs-Stand | `node tools/bewertung-stand.mjs [--schreiben]` |
| Wörter der Leistungsbewertung | `node tools/leistungs-woerter.mjs [<app> …] [--zaehlen]` (Bericht, kein Tor) |
| Speicher-, Seitenmarken-, Fakten-Regel | `node --test packages/kinderschutz/test/speicher-regel.test.mjs seitenmarke.test.mjs externe-fakten.test.mjs` |
| Browser-Tor (Delta) | `node tools/browser-tor.mjs <app> … [--parallel N] [--versuche N]` (Exit 0 keine Erhöhung, 1 Erhöhung, 2 nicht gemessen) |
| einzelne Browser-Messung | `node tools/browser-pruefung.mjs <app> - <Ordner>` |
| Basislinie | `node tools/browser-basislinie.mjs --schreiben <Ordner> --integrator [--erweitern]` / `--vergleich <Ordner>` |
| Quiz-Durchlauf | `node tools/quiz-durchlauf.mjs <app> … --modus alle` |
| Bauaufträge | `node tools/bauauftrag-index.mjs`; `node tools/bauauftrag-pruefen.mjs /tmp/info70-quelle/all.txt`; Quelle: `tools/quelle-holen.sh /tmp/info70-quelle` |
| entfernte Zeilen | `node tools/aenderungsumfang.mjs <app> … [--gegen <Stand>]` |
| Commits einer Sitzung | `node tools/pfad-pruefung.mjs <slug> <Kennung> [Bereich]` |

**Sauberer Worktree vor jedem Push** (die Schreiber verschmutzen den gemeinsamen Baum): `git worktree add --detach /tmp/info70-sauber HEAD`, darin `npm test`, danach `git worktree remove --force /tmp/info70-sauber`. Nur ein grüner Lauf erlaubt den Push.

## 8. Was zur Arbeitsweise gelernt wurde

- **Nebenläufigkeit:** reale Grenze 2 Agenten (4 Prozessoren), nicht 8. Die Warteschlange bedient erst alle Schreiber, dann alle Prüfer. Für eine Stufe mit vier Einheiten dauert ein Lauf daher Stunden. Besser: Schreiber und Prüfer je Einheit in einem Schritt hintereinander abarbeiten, damit früh ein Urteil vorliegt.
- **Kosten (Token):** Lauf B 2,4 Mio., Lauf C 6,5 Mio., Lauf D 5,8 Mio., Strang Г (Listen) 3,8 Mio., GDD-Entwürfe 11,9 Mio. in 5 Stunden. Lange Entwürfe sind teuer (GDD-Entwurf für CON-3: über 30 KB). Kurz-GDD unter 14 KB (Frage 36).
- **Gemeinsamer Arbeitsbaum:** Agenten verändern ihn gleichzeitig; Tests, die Zählungen enthalten (Testzahlen, Impressum, Hub), schlagen dann an. Immer im sauberen Worktree prüfen.
- **Stop-Hook:** meldet unversionierte Änderungen. Ungeprüfte Agentenarbeit wird nicht committet (Regel „nach Prüfung“); den Hinweis begründet beantworten.
- **Schlafen im Vordergrund ist gesperrt:** auf Ergebnisse mit einer Hintergrundschleife (`run_in_background`) warten oder auf die Benachrichtigung.
- **Container-Neustart:** tötet laufende Workflows; Journal und Arbeitsbaum bleiben, Wiederaufnahme mit `resumeFromRunId` (siehe 3). Alles Wichtige steht deshalb im Repo (`docs/arbeitsweise/`).
- **Parallele Aufträge am selben Bereich** vermeiden: ein Schreiber ändert nur Dateien seiner Gruppe; der Prüfer prüft nach `git status --short` und Tests, nicht nach den Worten des Schreibers.

## 9. Rezepte, wenn Max antwortet (Nummern wie in `docs/fragen-fuer-max-2026-10-28.md`)

- **1 bis 3 (Inhaltsfehler):** je ein kleiner Auftrag mit Prüfer; Tests, README und GDD der App mitziehen (notruf-held: 7 von 8 Szenen, Test verlangt mindestens 6). Danach `npm test`, Fakten-Zähler, Push.
- **4 bis 8 (Strang Г):** Vorschläge je Zeile in `docs/externe-fakten-vorschlaege.json` (Feld `handlung`: `quelle`, `maschinell`, `eigenentwurf`, `streichen`, `fehlalarm`; Feld `neuer_text`). Pakete zu 4 bis 5 Apps; Schreiber setzt genau die freigegebenen Zeilen, Prüfer vergleicht Zeile für Zeile; danach `externe-fakten-stand.json` mit dem Schreibwerkzeug des Zählers kleiner schreiben (`packages/kinderschutz/src/externe-fakten.mjs`, Test `externe-fakten.test.mjs`). `streichen` nur nach Freigabe einer eigenen Liste. `fehlalarm`: Apps nicht ändern, Zähler und Test anpassen. Den Stand `docs/externe-fakten-stand.json` pflegt der Integrator von Hand: der Test `externe-fakten.test.mjs` meldet gesunkene Bestände (je App unter `apps`, `gesundheit`, `dokumentation`) und verlangt, dass die Summen (`nachherBlockierend`, `nachherDokumentation`, `nachher`, `dateiart`, `kategorien`) stimmen. Hilfsskripte: `docs/arbeitsweise/werkzeuge/g-dump.mjs` (listet die blockierenden Zeilen je App, Eingabe der Pakete) und `g-assemble.py` (baut die Listen aus den Vorschlägen der Schreiber und den Korrekturen der Prüfer; Umgebungsvariablen `SCRATCH` und `JOURNAL`).
- **9 bis 20 (Wertung, Zähler, Texte):** je Punkt ein Auftrag mit Prüfer; bei jedem Entfernen von Zeilen, Zahlen oder Regeln vorher die Liste an Max. Prüfung danach: `leistungs-woerter`, `bewertung-stand`, App-Tests, Browser-Tor.
- **21 (31б):** der Patch liegt unter `docs/arbeitsweise/werkzeuge/31b-data-kennung.patch` (`el('button')` setzt `data-kennung` selbst); Messung aller 228 Apps mit dem Patch: `docs/arbeitsweise/31b-messung.json` (klickFehler 0 → 1298, 61 Apps ohne Fehler). Messwerkzeuge: `werkzeuge/messung-worktree.sh` (Kopie des Repos mit Patch), `messung-parallel.sh`. Erst nach Max' Antwort: Basislinie mit `--erweitern` schreiben.
- **22 bis 30 (Technik):** je ein eigener Auftrag; 22 und 25 ändern die Regel oder das Messverfahren und gehören zusammen mit dem Delta-Tor geprüft (Basislinie sinkt oder bleibt).
- **31 bis 36 (Stufen 2 und 3):** Vorlage ist Lauf E (Skript und Brief in `docs/arbeitsweise/`); für Erweiterungen bestehender Apps gilt zusätzlich: Tests und Browser-Messung vorher und nachher, kein Anwachsen der Stände. Reihenfolge nach Plan: `docs/plan-neue-welle.md`, Abschnitt 2.
- **37 bis 43 (Organisation):** keine Arbeit am Code; Pull Request erst auf Max' Wort.

## 10. Nicht ohne Max

Wachsen eines Standes oder einer Ausnahmeliste; Löschen von Zeilen, Zahlen, Regeln oder Dateien (immer erst eine Liste); Stufe 2 und 3; Pull Request; Push auf einen anderen Branch; Archivieren von Sitzungen; Angaben im Impressum (Herausgeber, Hosting); Verlassen der Rolle, die Max vorgibt.

## 11. Dateien dieser Übergabe

- `docs/uebergabe-pause.md` (diese Datei), `docs/fragen-fuer-max-2026-10-28.md` (Fragen und Vorschläge, Russisch).
- `docs/arbeitsweise/briefs/` (Briefe der Läufe B, C, D, E, Strang Г, GDD), `docs/arbeitsweise/workflows/` (Skripte der Läufe, zum Wiederholen oder als Vorlage), `docs/arbeitsweise/werkzeuge/` (Hilfsskripte: `zeilen.mjs` zeigt die Zeilen, die der Wertungs-Scanner je App beanstandet; `messung-parallel.sh` und `messung-worktree.sh` messen viele Apps mit der Browser-Prüfung; dazu der Patch zu 31б), `docs/arbeitsweise/31b-messung.json`, `docs/arbeitsweise/lauf-e-schreiberberichte.json`. Pfade zum Scratchpad der alten Sitzung sind erloschen; was ein Skript an Ordnern braucht, steht oben im Kopf des Skripts.
