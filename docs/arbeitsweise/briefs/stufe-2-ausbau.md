# Brief Stufe 2 (Plan vom 27.10.2026): Ausbau GEM-8, GEM-13, CON-4

Repo: /workspace/svend4-info70, Branch claude/children-network-programs-germany-hr0jh9. Gemeinsamer Arbeitsbaum: andere Agenten
arbeiten gleichzeitig an anderen Apps. Du änderst nur die App deiner Einheit (Abschnitt unten).

## Lies zuerst
1. Den Bauauftrag deiner Einheit: docs/bauauftraege/<ID>-*.md, Abschnitte 2 bis 9. Die Blockade „A7“ ist aufgehoben (Stand
   27.10.2026: quiz-kern speichert nichts, kennt keinen Rekord, keine Punkte und keine Ränge mehr; nur die Migrationszeile bleibt).
2. docs/plan-neue-welle.md, Abschnitt 3 (die Tore für jede neue App und jede Erweiterung).
3. Diese Datei: Abschnitte „Harte Grenzen“, „Regeln“, „Prüfen“, „Bericht“ und den Abschnitt deiner Einheit.
4. Die App selbst: README.md, GDD.md, app.mjs, logik.mjs (falls vorhanden), index.html, daten/, test/.

## Harte Grenzen
- Nur Dateien unter apps/<slug>/ deiner Einheit. Nicht ändern: packages/, tools/, docs/ (auch docs/bauauftraege/,
  docs/bewertung-stand.json, docs/browser-basislinie.json, docs/speicher-stand.json, docs/registrierung/), Wurzel-Dateien
  (README.md, index.html, impressum.html) und andere Apps.
- Nicht ausführen: git add, commit, push, stash, checkout, reset, restore; tools/zahlen.mjs mit --schreiben;
  tools/browser-basislinie.mjs mit --schreiben; tools/bauauftrag-index.mjs. Der Integrator macht das.
- Nichts löschen und nichts ersetzen. Nur ergänzen (neue Dateien, Funktionen, Daten, Tests, Absätze). Ist eine bestehende
  Aussage veraltet, bleibt die alte Zeile stehen; daneben kommt eine datierte Anmerkung („Stand 28.10.2026: …“). Keinen Test löschen.
- Kein Eingabefeld (input, textarea, select, form, contenteditable). Bedienung nur mit Schaltflächen.
- Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache). Ausnahme nur eine Zeile
  `try { localStorage.removeItem('<alter Schlüssel>'); } catch {}`, falls die App einen alten Schlüssel hat.
- Keine Netzaufrufe und keine fremden Adressen (https://, //domain, www.). fetch nur mit einem Pfad in Anführungszeichen
  (`./` oder `daten/`).
- Kein Zufall im Code der App (Math.random, crypto.getRandomValues). Zufallsreihen kommen als Parameter in die Logik.
  Anmerkung 29.10.2026: Im Bestand von `erzaehl-bruecke` steht `Math.random` an zwei Stellen (`logik.mjs`, `app.mjs`). Sie bleiben bis zur Entscheidung Max (Frage 65). Neue Zeilen dürfen keinen Zufall nutzen.
- Keine Wertung eines Kindes: keine Punkte, Rekord, Rang, Rangliste, Serie, Prozent, „richtig von“, „geschafft“, Sterne,
  Noten, Pokal. Erlaubt ist ein neutraler Zähler des Gefundenen („Gefunden: 3 von 8“).
- Seitenangaben („S. n“) nur mit dem Vermerk im selben Dokument: „Seitenangaben maschinell gegen den Quelltext geprüft,
  noch nicht von einem Menschen geprüft.“ Eigene Inhalte sind als „(Eigenentwurf)“ gekennzeichnet; in daten/*.json als
  `"eigenentwurf": true`. Quellenangaben als `"quelle": { "seite": "S. n" }`.
- Wörtliche Zitate aus der Praleska: höchstens sechs Wörter; keine ganzen Sätze aus dem Buch. Keine Modellnamen in Dateien.
- Keine neuen Aussagen über Recht, Geld oder Gesundheit.
- Testzahl: Zähle die Zeilen, die mit `test(` beginnen, in test/*.mjs. README und GDD der App nennen genau diese Zahl.

## Regeln
- Wenn der Code sich ändert, passe README.md und GDD.md an (und eltern.html und index.html, falls vorhanden). Der Satz über
  die Speicherung folgt dem Code.
- Verneinte Nennungen („keine Punkte“) sind erlaubt; die Prüfung mit tools/leistungs-woerter.mjs ist die Grundlage.

## Prüfen (alles muss laufen, bevor du berichtest)
- `cd apps/<slug> && npm test` grün; Zahl der Tests vorher und nachher nennen.
- `node tools/leistungs-woerter.mjs <slug>`: jeder Treffer ist entfernt oder begründet; nichts unerklärt lassen.
- `node tools/browser-tor.mjs <slug> --ausgabe /tmp/<slug>-tor`: Exit 0 verlangt. Ausgabe nur nach /tmp.
- `node --test packages/kinderschutz/test/speicher-regel.test.mjs`: nur deine App betrachten.
- Quiz-Apps (Motor quiz-kern): `node tools/quiz-durchlauf.mjs <slug> --modus alle --ausgabe /tmp/<slug>-quiz`.
- Vierwort-Prüfung deiner geänderten Dateien: `python3 /tmp/kin17-probe/vierwort.py <Dateien>` (Ausgabe leer = gut).
- Änderungsumfang: `node tools/aenderungsumfang.mjs <slug>` (zeigt entfernte Zeilen; du entfernst nichts).

## Bericht
Am Ende deiner Antwort ein JSON-Block nach diesem Schema (knapp, nur Belege):
{ "einheit": "<ID>", "app": "<slug>", "was_getan": "…", "geaendert": [{ "datei": "…", "zeilen_neu": 0 }],
  "tests_vorher": 0, "tests_nachher": 0, "pruefungen": [{ "befehl": "…", "exit": 0, "ergebnis": "…" }],
  "treffer_leistung": ["…"], "grund_ausnahme": "…", "abweichungen_vom_bauauftrag": ["…"],
  "offen_fuer_max": ["…"], "nicht_geprueft": ["…"] }

---

## Einheit GEM-8 (apps/mathe-entdecker)
Bauauftrag: docs/bauauftraege/GEM-8-mathe-entdecker.md, Abschnitte 3 bis 9.
1. Mini-Simulator „Reihen legen“ (Abschnitte 3 und 5): erstelleReihe(objekte mit 3 bis 5 Objekten, regel: groesse oder farbe,
   zufallsReihe), pruefeReihe(gelegt, regel) mit {ok, fehlerIndex} und pruefeMatheFragen(fragen) mit einer Fehlerliste
   (Themen linien, wochentage und jahreszeiten fehlen als Fehler; Abdeckung je Thema; quelle.seite fehlt als Fehler; Mindestvorrat
   12). Die Logik liegt in logik.mjs und hat keine Zufallsquelle.
2. Daten (Abschnitt 4): Felder quelle, thema und eigenentwurf zu jeder Frage ergänzen (bestehende Werte bleiben). Neue Fragen für
   die fehlenden Themen linien (S. 137), wochentage und jahreszeiten (S. 138), links und rechts (S. 137) und reihen (S. 137).
   Jede neue Frage erfüllt das quiz-kern-Schema (pruefeFragen in packages/quiz-kern/src/quiz.mjs).
3. Oberfläche: zusätzlicher Modus „Reihen legen“ mit Schaltflächen (Objekt anhängen, Rückknopf, Prüfen, Vorlesen). Rückmeldung
   ohne Wertung („Die Reihe stimmt.“ oder „Schau dir die Reihe noch einmal an.“), Auflösung mit Vorlesen. Kein Speicher. Die
   bestehenden Quiz-Modi (Einzel, Duett, Staffel) bleiben unverändert; quiz-durchlauf muss grün bleiben.
4. README: Lernziele als Liste (Abschnitt 2 des Bauauftrags, sechs Ziele; docs/02 Z. 42–43). Themen ergänzen (Linienarten,
   Wochentage und Jahreszeiten, links und rechts), ohne bestehende Zeilen zu löschen.
5. Tests: test/logik.test.mjs neu (erstelleReihe: Lücke an der richtigen Stelle, gleiche Zufallsreihe ergibt die gleiche Aufgabe;
   pruefeReihe: Länge und Ordnung; pruefeMatheFragen: fehlende Themen und fehlende Seitenangabe als Fehler, Mindestvorrat).
   test/regeln.test.mjs neu, nach der Vorlage apps/puppentheater-werkstatt/test/regeln.test.mjs (kein Speicheraufruf außer der
   Migration, kein Abruf außerhalb daten/, keine Anzeige von Punkten oder Rang). test/fragen.test.mjs bleibt unverändert.
6. Testzahl in README und GDD.
Nicht umsetzen (Entscheidung offen, nur melden): uk- und ru-Zahlwörter (Bauauftrag Abschnitt 9). Die Engine nicht ändern. Prüfen, ob die
README-Aussage „Rang und Punkte“ nach A7 noch zutrifft; wenn nicht: datierte Anmerkung ergänzen, die alte Zeile bleibt.
Zu klären und zu berichten: `node tools/leistungs-woerter.mjs mathe-entdecker` meldet „rekord“ in app.mjs und „Sterne, ⭐“ in
daten/fragen.json. Stelle lesen und einordnen (Zähler, Erklärung oder Wertung?). Nichts ersetzen. Bei einer Wertung: exakte
Zeile und Vorschlag unter offen_fuer_max.
Abnahme: npm test grün. 360 px und Knopfhöhe 48 px: nenne, was du gemessen hast. Test mit Kindern steht aus (nennen).

## Einheit GEM-13 (apps/erzaehl-bruecke)
Bauauftrag: docs/bauauftraege/GEM-13-erzaehl-bruecke.md, Abschnitte 3 bis 9.
1. Lücke aus Abschnitt 9: „Weil-Satz-Anstöße: in README und GDD nicht belegt. Im Quelltext prüfen; app.mjs wurde nicht gelesen.“
   Zuerst app.mjs, logik.mjs und daten/ lesen. Sind Weil-Satz-Anstöße vorhanden: dokumentieren (README, GDD) und testen.
   Wenn nicht: nach Abschnitt 3 des Bauauftrags ergänzen (Anfang „Weil …“, das Kind ergänzt; Vorlesen).
2. Lernziele als Liste in README (docs/02 Z. 42–43), soweit der Bauauftrag Abschnitt 2 sie nennt.
3. Tests: vorhandene Tests bleiben. Neu: Vollständigkeit der Impulse, Eigenentwurf-Kennzeichnung, keine Wertung.
4. test/regeln.test.mjs neu nach der Vorlage, falls die App keine hat.
5. Testzahl in README und GDD.
Nicht umsetzen (Entscheidung offen, melden): Bildimpuls (Wimmelbild; Bildrechte und Bestätigung durch Erwachsene), Altersbereich
5 bis 8 gegen Katalog 5 bis 7, uk- und ru-Impulse (nur als Erweiterung im GDD), Sternchen bei S. 143 (A11).
Prüfen: npm test, leistungs-woerter, browser-tor. quiz-durchlauf entfällt (kein quiz-kern).

## Einheit CON-4 (apps/deutschland-kompass)
Bauauftrag: docs/bauauftraege/CON-4-deutschland-kompass.md, Abschnitte 3 bis 9.
Achtung: Die App teilt sich KIN-18 (Bauauftrag KIN-18, teilweise). Bestehende Modi, Daten und Funktionen dürfen nicht verändert
werden.
1. Neuer Modus: Bundesland → Deutschland → Europa → Erde. Der Modus heißt in der App „Vom Ort zur Erde“, nicht „Stufenfolge“:
   das Wort „Stufe“ gilt als Bewertung (docs/02 Z. 141–146), und die Wertungsprüfung erkennt den Wortstamm. Eigene Logikdatei
   (logik-ebenen.mjs) und eigene Daten (daten/ebenen.json). Im Text und in Dateinamen des Modus kein Wort mit dem Stamm „Stuf“. Alle Inhalte sind Eigenentwurf (Bauauftrag Abschnitt 9: die Quelle nennt Heimatkunde und
   Menschheit als Familie, S. 120, nicht die Reihenfolge der Ebenen).
   Korrektur 29.10.2026: Das Satzende oben trifft nicht zu. `tools/leistungs-woerter.mjs` prüft „Stufe“ nicht (seine Liste: Punkte, Rekord, Serie, Prozent, „richtig von“, „geschafft“, Sterne und Pokale, Vergleich). Das Verbot für neue Texte für Kinder gilt trotzdem; es wird von Hand oder im Regeltest geprüft. Bestandsstellen werden nicht geändert (Frage 66).
2. Reine Logik mit Tests (test/ebenen.test.mjs): Reihenfolge der Ebenen, jede Ebene mit Inhalt und Eigenentwurf-Kennzeichnung,
   keine Wertungswörter in den Ebenen-Daten.
3. Oberfläche: Schaltfläche „Vom Ort zur Erde“ im Startbildschirm; Vorlesen; im neuen Modus kein Punkt, kein Rang, kein Rekord.
4. Ränge nicht bauen (Empfehlung der Bauaufträge; Entscheidung offen).
5. Der bestehende Punktzähler (app.mjs Zeilen 26, 155, 199) bleibt unverändert. Nicht entfernen. Die App ist deshalb noch nicht für
   Kinder freigegeben (Tor 1). Die Treffer von `node tools/leistungs-woerter.mjs deutschland-kompass` mit genauem Grund unter
   grund_ausnahme und offen_fuer_max melden.
   Anmerkung 29.10.2026: Gegenstandslos. Der Zähler ist seit 96a1f89 (27.10.2026) entfernt; siehe Abnahme unten.
6. test/regeln.test.mjs: prüfe den NEUEN Modus (seine Dateien und den Abschnitt in index.html) auf Speicher, Netz, Zufall, Eingabe
   und Wertung. Der bestehende Punktzähler darf keinen roten Test auslösen; er steht im GDD als offen. Kein Test, der Bestehendes
   rot macht.
7. Testzahl in README und GDD.
Prüfen: npm test, leistungs-woerter, browser-tor. Die vollständige Abnahme gilt erst, wenn der Punktzähler entfernt ist
   Anmerkung 29.10.2026: Der Punktzähler ist mit Commit 96a1f89 (27.10.2026) entfernt. Die Abnahme hängt nicht mehr am Zähler, sondern an den Entscheidungen (Fragen 65 bis 68).
(Freigabe durch den Koordinator).
