# Übergabe für die Pause (Stand 28.10.2026, 07:40 UTC)

Wer die Arbeit nach der Pause weiterführt (der Integrator oder eine neue Sitzung), findet hier den Stand, die Regeln, die Werkzeuge und die Rezepte für die nächsten Schritte. Entscheidungen trifft Max (Projektleiter, spricht Russisch). Seine offenen Fragen stehen nummeriert in `docs/fragen-fuer-max-2026-10-28.md` (Russisch, 47 Punkte, ★ = Empfehlung des Integrators, ohne Antwort ändert sich nichts). Das Protokoll aller Entscheidungen steht in `docs/fragen-und-hinweise.md`, Abschnitt „Entscheidungen des Nutzers (27.10.2026)“.

Max hat angeordnet: keine neuen Aufträge starten, laufende Arbeit zu Ende bringen lassen, auf eine lange Pause vorbereiten, die Fragen nummeriert sammeln. Alles ist erledigt: es läuft nichts mehr, der Arbeitsbaum ist sauber.

## 1. Rolle und feste Regeln

Der Integrator committet allein. Schreiber und Prüfer (Agenten) fassen kein git an. Wortlaut von Max, der gilt, bis er etwas anderes sagt:

- „Apps nur nach Prüfung committen und sofort pushen“; „Push nur auf den Arbeitsbranch“ (`claude/children-network-programs-germany-hr0jh9`); kein Force-Push; kein Pull Request, solange Max keinen verlangt (16а: erst nach A7 und 48 px, Entscheidung offen, Frage 38).
- „при красном прогоне не пушить“; vor jedem Push: Tests in einem sauberen Worktree (siehe 7).
- „Ничего не удалять без списка для Макса“; „Удаления строк, цифр и правил только через Макса“; „исключения в стенде подтверждает Макс“.
- „Новые приложения не запускать“, aufgehoben nur für Stufe 1 (Entscheidungen 11а/11б, erledigt). Stufe 2 und 3 brauchen sein Zeichen.
- Höchstens 8 Agenten gleichzeitig (real laufen zwei); jeder Workflow-Lauf endet mit einer Zeile: Zahl der Agenten und geleistete Arbeit (19в). Ultracode ist aus: ein Workflow braucht ausdrücklichen Auftrag von Max („ultracode“ oder „workflow“ in seinen Worten).
- Keine Modellnamen in Dateien, Commits oder Pull-Request-Texten des Repos (auch nicht in Verbotslisten von Tests, es sei denn, die Ausnahme 20а nennt den Test).
- docs/02: Zeilen 22–24, 79–82, 141–146 bleiben stabil; Ergänzungen nur am Dateiende. README und GDD nennen docs/02 nur mit einer dieser Zeilenangaben.

## 2. Stand beim Anhalten

- Branch `claude/children-network-programs-germany-hr0jh9`, nach dem Push mit origin gleich. Der Arbeitsbaum ist sauber, keine Agenten laufen.
- `npm test` (Wurzel, auch im sauberen Worktree): 3231 Tests grün (2960 vor Stufe 1 plus 63 + 73 + 68 + 67 der vier neuen Apps). 232 Apps in `apps/`; Impressum: 167 speichern gar nichts, 65 speichern etwas (`impressum.html`, geprüft vom Test `datenschutz-zusage`).
- Quiz-Durchlauf (26 Quiz-Apps × 3 Modi = 78 Läufe) zuletzt grün (Stand Lauf C und Staffel-Korrektur); `quiz-kern` ist seither nicht angefasst worden. Die vier neuen Apps sind keine Quiz-Apps (`tools/quiz-durchlauf.mjs` meldet Exit 64).
- Stände: `docs/bewertung-stand.json` (bestätigte Ausnahmen: barriere-detektive, seiten-scanner, sharenting-spiegel, lehrkraefte-szenariotraining, kita-familien-bruecke, foerder-navigator, autonomiephase-navigator; vorgeschlagen und offen: staerken-tagebuch), `docs/speicher-stand.json` (leer), `docs/seitenmarke-stand.json` (keine Apps; dokumentierte Ausnahme erste-woerter-tagebuch), `docs/browser-basislinie.json` (ohneKennung 204, klickFehler 0, beruehrung 32, ueberlauf 0, druck 1511, konsole 0, fremdeHosts 0; die vier neuen Apps ohne Verletzung), `docs/externe-fakten-stand.json` (Stand 327, gezählt 326: `takt-pause` ist gesunken; der Test meldet „Stand nachziehen“, ein Schrumpfen ist erlaubt; die Summen in `dateiart`, `kategorien`, `nachher*` müssen dabei stimmen).
- Nichts in diesem Stand ist rot.

## 3. Lauf E (Stufe 1) ist abgeschlossen

Lauf E hat vier neue Apps nach Bauauftrag gebaut: 16 Agenten (je Einheit Schreiber, Prüfer, Nachbesserung, Zweitprüfer), 6,7 Mio. Token, 2268 Werkzeugaufrufe, 4 h 15 min (02:47 bis 07:02 UTC). Skript `docs/arbeitsweise/workflows/lauf-e-neue-apps.js`, Brief `docs/arbeitsweise/briefs/e-brief.md`, Run-ID `wf_d63b5ad8-45e`. Ergebnis mit allen Befunden: `docs/arbeitsweise/lauf-e-ergebnis.json` (die früheren, ungeprüften Berichte der Schreiber vor den Prüfungen: `lauf-e-schreiberberichte.json`).

| Einheit | Ordner | Tests | Erstprüfung | Zweitprüfung |
|---|---|---|---|---|
| CON-3 | `apps/meine-familie-woerter-und-rollen-content-pack/` | 63 | nachbessern (Sitzungsgrenze umgehbar) | ok |
| CON-6 | `apps/himmelsgucker-sonne-mond-und-sterne/` | 73 | nachbessern (Druckreserve 2,3 mm, Test-Lücken) | ok |
| CON-9 | `apps/farbwoerter-schatz/` | 68 | nachbessern (Wort bricht mitten im Wort um) | nachbessern, vom Integrator behoben |
| CON-10 | `apps/musik-woerter-bilderlexikon/` | 67 | nachbessern (Eigenentwurf-Vermerk, Zählung, Tests) | ok |

Alle vier sind eigene Karten-Apps (Weg B), nicht auf `quiz-kern`; ohne Speicher, ohne Wertung, mit Vorlesen, Druck ein Blatt je Karte. Die Prüfer arbeiteten mit Mutationsproben, eigenen Browser-Läufen, PDF-Messung und Quellenabgleich gegen die Textkopie; die Erstprüfung deckte in jeder Einheit echte Mängel auf (zwei Prüfrunden sind den Aufwand wert).

Was der Integrator nach der Zweitprüfung selbst getan hat: bei CON-9 die Modellnamen aus dem Verbotsmuster des Tests genommen (Muster wie in den Vorlagen), die Knopfhöhen-Prüfung auf jede Klasse `…knopf` verallgemeinert und dem Test „Farbkarte und Start“ die Wege Start → Gruppe → Liste → Karte als Quelltext-Prüfungen hinzugefügt (Testzahl unverändert 68); bei CON-3 und CON-10 die Modellnamen-Muster der Tests ebenso entfernt; in der Registrierung von CON-10 „(Zählung: Eigenentwurf)“ ergänzt. Danach: App-Tests, Wurzel-Tests (3231 grün), Wertungs-, Speicher-, Seitenmarken-, Fakten-Stand, Browser-Tor (4 Apps, 0 Erhöhungen, Exit 0), Bauauftrag-Prüfer (68 von 68, 0 Probleme).

Hinweise der Prüfer ohne Pflicht (offene kleine Arbeiten, nach Max' Antworten zu 31 und 44–47):
- CON-3: der Test „Sitzungsgrenze nicht zu umgehen“ ist ein Quelltext-Test (von 55 Mutationen überlebt eine); GDD: zweite Quellenseite S. 103 in Abschnitt 3 nennen, „die Browser-Messung klickt alle Knöpfe“ abschwächen.
- CON-6: die Verdrahtung in `app.mjs` ist nur über Quelltextmuster gesichert (5 von 7 Verdrahtungs-Mutanten bleiben grün); die Wortliste für Lob im Kindertext-Test kennt „klasse“, „großartig“ nicht; die Ansicht „Für Erwachsene“ zeigt Projekttext („Katalog und Bauauftrag“, „(offen)“) und gehört nach Max' Antwort gekürzt; README „DejaVu rund 14 % breiter“ gilt nur für die fetten Wörter.
- CON-9: Höhen im Druck (Farbfläche 125 mm) nur durch PDF-Messung gesichert; bei 320 px brechen vier Wörter (so in der README, Mindestbreite ist 360 px).
- CON-10: Druckgeometrie ohne Test („Bild 250 mm“ ließe ein Blatt auf zwei Seiten laufen; ein Test „Druckbudget“ wie in CON-6 fehlt); der Hinweis „keine deutsche Stimme“ erscheint achtmal in der Instrumentenansicht; die Beschriftung der Umschalter ändert sich bei `aria-pressed`; Zeichen in Escape-Schreibweise fänden die Tests nicht.

Offen für Max: Frage 31 (Weg B, Alter, Hilfe-Insel, Eintrag in `BEWUSST_OHNE` — nicht vom Integrator eingetragen), 44 bis 47.

## 4. Annahme einer neuen App (Schritte des Integrators, so bei Stufe 1 ausgeführt)

Erst wenn der unabhängige Prüfer `ok` sagt und der Integrator selbst nachgemessen hat:

1. Wurzel-`index.html`: die `hub_zeile` aus `docs/registrierung/<Kennung>.json` im Abschnitt „Stark werden (Kinder)“ einfügen (Kinder-Apps, bei Eltern und Fachkräften der passende Abschnitt). Wurzel-`README.md`: eine Zeile am Ende der App-Tabelle im Format `| \`slug\` | Beschreibung auf Russisch | Quelle |` (Quelle: `пакеты №N` für CON-N, `PRI-N` oder `кат.№N`); die Zeilen der Registrierung folgen oft dem Statusformat und müssen umgeformt werden.
2. `docs/10-praleska-baukasten.md`: an die Zeile der Einheit „ *Bau Stufe 1 (Lauf E, 28.10.2026):* <docs10_notiz>“ anhängen. `docs/praleska-katalog.json` (Schreibweise: `json.dumps(…, ensure_ascii=False, indent=2)` plus Zeilenende; das ist byte-genau die vorhandene Form): im Eintrag unter `ideen` das Feld `korrektur` mit `katalog_korrektur` ergänzen.
3. `impressum.html`: „speichern N gar nichts“ um die neuen Apps ohne Speicher erhöhen (Test `datenschutz-zusage` zeigt die Sollzahl).
4. `tools/bauauftrag-index.mjs`: Einheit in `STATUS_AB_WELLE_92` auf `gebaut` und in `APP_AB_WELLE_92` den Slug eintragen, dann `node tools/bauauftrag-index.mjs` und `node tools/bauauftrag-pruefen.mjs <Textkopie>` (muss 0 Probleme melden).
5. `node tools/zahlen.mjs --schreiben` (setzt die Gesamtzahl der Tests im README). Nicht ausführen, solange ungeprüfte Ordner im Baum liegen: die Zählung enthielte sie.
6. Prüfen: `npm test` (im sauberen Worktree), `node tools/bewertung-stand.mjs` („Stand stimmt“), `node tools/leistungs-woerter.mjs <slug>`, `node tools/browser-tor.mjs <slug>` (Exit 0, neue App ohne Verletzung), für Quiz-Apps `node tools/quiz-durchlauf.mjs <slug> --modus alle`.
7. Commit mit Namen der Einheit, Push, eine Zeile Bericht an Max (19в).

Die Textkopie der Quelle entsteht mit `tools/quelle-holen.sh <Zielordner außerhalb des Repos>` (liest `PRALESKA.pdf` aus `origin/main`); in dieser Sitzung lag sie im Scratchpad unter `…/scratchpad/quelle/all.txt`, die Briefe in `docs/arbeitsweise/briefs/` nennen `/tmp/info70-quelle/all.txt` als Zielort.

## 5. Stände, die nur schrumpfen dürfen (Ratschen)

`docs/bewertung-stand.json`, `docs/speicher-stand.json`, `docs/seitenmarke-stand.json`, `docs/browser-basislinie.json`, `docs/externe-fakten-stand.json`. Wachstum (neuer Treffer, neue Ausnahme) braucht den Schalter `--erweitern` und das Zeichen von Max. `docs/browser-basislinie.json` schreibt allein `node tools/browser-basislinie.mjs --schreiben <Messordner> --integrator` aus der Repo-Wurzel; das Delta-Tor `tools/browser-tor.mjs` misst bei einer Erhöhung bis zu dreimal neu und zählt je Kategorie das Minimum (Zufall in einzelnen Apps).

## 6. Regeln, die sich aus Max' Antworten ergeben (für jede neue oder geänderte App)

- Keine Wertung eines Kindes: weder Punkte, Rekord, Rang, Serie, Prozent, „richtig von“, „geschafft“, Sterne noch Pokal, kein Vergleich von Tagen oder Wochen. Erlaubt ist ein neutraler Zähler des Gefundenen („Gefunden: N“). Prüfung `node tools/leistungs-woerter.mjs <app>`; jeder Treffer entfernt oder als Fehlalarm begründet (CON-6: „Sterne“ als Himmelskörper).
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
| Browser-Tor (Delta) | `node tools/browser-tor.mjs <app> … [--parallel N] [--versuche N] [--ausgabe <Ordner>]` (Exit 0 keine Erhöhung, 1 Erhöhung, 2 nicht gemessen) |
| einzelne Browser-Messung | `node tools/browser-pruefung.mjs <app> - <Ordner>` |
| Basislinie | `node tools/browser-basislinie.mjs --schreiben <Ordner> --integrator [--erweitern]` / `--vergleich <Ordner>` |
| Quiz-Durchlauf | `node tools/quiz-durchlauf.mjs <app> … --modus alle` |
| Bauaufträge | `node tools/bauauftrag-index.mjs`; `node tools/bauauftrag-pruefen.mjs <Textkopie>`; Quelle: `tools/quelle-holen.sh <Ordner>` |
| entfernte Zeilen | `node tools/aenderungsumfang.mjs <app> … [--gegen <Stand>]` |
| Commits einer Sitzung | `node tools/pfad-pruefung.mjs <slug> <Kennung> [Bereich]` |

**Sauberer Worktree vor jedem Push** (die Schreiber verschmutzen den gemeinsamen Baum): `git worktree add --detach /tmp/info70-sauber HEAD`, darin `npm test`, danach `git worktree remove --force /tmp/info70-sauber`. Nur ein grüner Lauf erlaubt den Push.

## 8. Was zur Arbeitsweise gelernt wurde

- **Nebenläufigkeit:** reale Grenze 2 Agenten (4 Prozessoren), nicht 8. Die Warteschlange bedient erst alle Schreiber, dann alle Prüfer, ein Urteil liegt deshalb erst nach allen Schreibern vor (Lauf E: die Schreiber brauchten je 48 bis 70 Minuten). Besser: Schreiber und Prüfer je Einheit nacheinander abarbeiten.
- **Kosten (Token):** Lauf B 2,4 Mio., Lauf C 6,5 Mio., Lauf D 5,8 Mio., Strang Г (Listen) 3,8 Mio., GDD-Entwürfe 11,9 Mio. in 5 Stunden, Lauf E 6,7 Mio. in 4 h 15 min. Lange Entwürfe sind teuer (GDD-Entwurf für CON-3: über 30 KB). Kurz-GDD unter 14 KB (Frage 36).
- **Gemeinsamer Arbeitsbaum:** Agenten verändern ihn gleichzeitig; Tests, die Zählungen enthalten (Testzahlen, Impressum, Hub), schlagen dann an. Immer im sauberen Worktree prüfen. Die Aufgabenliste (Task-Werkzeug) wird von den Agenten geteilt und wird dadurch unübersichtlich; sie ist kein Arbeitsnachweis.
- **Stop-Hook:** meldet unversionierte Änderungen. Ungeprüfte Agentenarbeit wird nicht committet (Regel „nach Prüfung“); den Hinweis begründet beantworten.
- **Schlafen im Vordergrund ist gesperrt:** auf Ergebnisse mit einer Hintergrundschleife (`run_in_background`) warten oder auf die Benachrichtigung.
- **Container-Neustart:** tötet laufende Workflows; Journal und Arbeitsbaum bleiben, Wiederaufnahme mit `Workflow({scriptPath, resumeFromRunId})`. Alles Wichtige steht deshalb im Repo (`docs/arbeitsweise/`).
- **Parallele Aufträge am selben Bereich** vermeiden: ein Schreiber ändert nur Dateien seiner Gruppe; der Prüfer prüft nach `git status --short` und Tests, nicht nach den Worten des Schreibers.
- **Modellnamen in Verbotslisten von Tests** kamen in drei von vier neuen Apps vor (Vorlage: bewusst nicht prüfen); der Brief sollte die Regel 10 mit dem Zusatz „auch nicht in Testmustern“ nennen.

## 9. Rezepte, wenn Max antwortet (Nummern wie in `docs/fragen-fuer-max-2026-10-28.md`)

- **1 bis 3 (Inhaltsfehler):** je ein kleiner Auftrag mit Prüfer; Tests, README und GDD der App mitziehen (notruf-held: 7 von 8 Szenen, Test verlangt mindestens 6). Danach `npm test`, Fakten-Zähler, Push.
- **4 bis 8 (Strang Г):** Vorschläge je Zeile in `docs/externe-fakten-vorschlaege.json` (Feld `handlung`: `quelle`, `maschinell`, `eigenentwurf`, `streichen`, `fehlalarm`; Feld `neuer_text`). Pakete zu 4 bis 5 Apps; Schreiber setzt genau die freigegebenen Zeilen, Prüfer vergleicht Zeile für Zeile; danach den Stand `docs/externe-fakten-stand.json` von Hand kleiner schreiben (der Test `externe-fakten.test.mjs` meldet gesunkene Bestände je App unter `apps`, `gesundheit`, `dokumentation` und verlangt stimmige Summen `nachherBlockierend`, `nachherDokumentation`, `nachher`, `dateiart`, `kategorien`). `streichen` nur nach Freigabe einer eigenen Liste. `fehlalarm`: Apps nicht ändern, Zähler und Test anpassen. Hilfsskripte: `docs/arbeitsweise/werkzeuge/g-dump.mjs` (listet die blockierenden Zeilen je App, Eingabe der Pakete) und `g-assemble.py` (baut die Listen aus den Vorschlägen der Schreiber und den Korrekturen der Prüfer; Umgebungsvariablen `SCRATCH` und `JOURNAL`).
- **9 bis 20 (Wertung, Zähler, Texte):** je Punkt ein Auftrag mit Prüfer; bei jedem Entfernen von Zeilen, Zahlen oder Regeln vorher die Liste an Max. Prüfung danach: `leistungs-woerter`, `bewertung-stand`, App-Tests, Browser-Tor. `docs/arbeitsweise/werkzeuge/zeilen.mjs` zeigt die Zeilen, die der Wertungs-Scanner je App beanstandet.
- **21 (31б):** der Patch liegt unter `docs/arbeitsweise/werkzeuge/31b-data-kennung.patch` (`el('button')` setzt `data-kennung` selbst); Messung aller 228 Apps mit dem Patch: `docs/arbeitsweise/31b-messung.json` (klickFehler 0 → 1298, 61 Apps ohne Fehler). Messwerkzeuge: `werkzeuge/messung-worktree.sh` (Kopie des Repos mit Patch), `messung-parallel.sh`. Erst nach Max' Antwort: Basislinie mit `--erweitern` schreiben.
- **22 bis 30 und 45 (Technik):** je ein eigener Auftrag; 22, 25 und 45 ändern die Regel oder das Messverfahren und gehören zusammen mit dem Delta-Tor geprüft (Basislinie sinkt oder bleibt).
- **31 und 44 bis 47 (Stufe 1 nacharbeiten):** je nach Antwort kleine Aufträge an die vier Apps (Ordner und Hinweise in 3); `BEWUSST_OHNE`-Einträge erst nach Max' Wort.
- **32 bis 36 (Stufen 2 und 3):** Vorlage ist Lauf E (Skript und Brief in `docs/arbeitsweise/`); für Erweiterungen bestehender Apps gilt zusätzlich: Tests und Browser-Messung vorher und nachher, kein Anwachsen der Stände. Reihenfolge nach Plan: `docs/plan-neue-welle.md`, Abschnitt 2.
- **37 bis 42 (Organisation):** keine Arbeit am Code; Pull Request erst auf Max' Wort.

## 10. Nicht ohne Max

Wachsen eines Standes oder einer Ausnahmeliste; Löschen von Zeilen, Zahlen, Regeln oder Dateien (immer erst eine Liste); Stufe 2 und 3; Einträge in `BEWUSST_OHNE`; Pull Request; Push auf einen anderen Branch; Archivieren von Sitzungen; Angaben im Impressum (Herausgeber, Hosting); Verlassen der Rolle, die Max vorgibt.

## 11. Dateien dieser Übergabe

- `docs/uebergabe-pause.md` (diese Datei), `docs/fragen-fuer-max-2026-10-28.md` (Fragen und Vorschläge, Russisch).
- `docs/arbeitsweise/briefs/` (Briefe der Läufe B, C, D, E, Strang Г, GDD), `docs/arbeitsweise/workflows/` (Skripte der Läufe, zum Wiederholen oder als Vorlage), `docs/arbeitsweise/werkzeuge/` (Hilfsskripte und der Patch zu 31б), `docs/arbeitsweise/31b-messung.json`, `docs/arbeitsweise/lauf-e-ergebnis.json` (Ergebnis und Befunde von Lauf E), `docs/arbeitsweise/lauf-e-schreiberberichte.json` (frühe Berichte der Schreiber, vor den Prüfungen). Pfade zum Scratchpad der alten Sitzung sind erloschen; was ein Skript an Ordnern braucht, steht oben im Kopf des Skripts.
