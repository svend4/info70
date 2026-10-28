# Brief für Schreiber und Prüfer (Lauf C: Wertung aus Kinder-Apps nehmen, Entscheidungen Max 34–37, 30б, 33а)

Repo: /home/user/info70, Branch claude/children-network-programs-germany-hr0jh9. Du arbeitest in einem gemeinsamen Arbeitsbaum:
andere Agenten ändern gleichzeitig andere Apps. Fasse nur die Apps deiner Gruppe an.

## Harte Grenzen
- Nur Dateien unter apps/<slug>/ der Apps deiner Gruppe (App-Code, daten/, test/, index.html, eltern.html, README.md, GDD.md, package.json).
- Nicht anfassen: packages/, tools/, docs/ (auch docs/bewertung-stand.json, docs/speicher-stand.json, docs/browser-basislinie.json),
  Wurzel-Dateien (README.md, impressum.html, index.html), Footer-Links der Apps, sw.js (gibt es nicht mehr).
- Kein git add, commit, push, stash, checkout, reset, restore. Der Integrator committet.
- Keine Modellnamen in Dateien. Keine Zitate über 6 Wörter aus der Praleska.
- Nichts entfernen, was nicht in deinem Auftrag steht. Tests nie löschen: ein Test, der Rekord, Rang, Punkte oder Ampel prüft, wird
  ein Abwesenheits-Test (prüft, dass es fehlt) oder ein Test auf das neutrale Verhalten.
- Keine neuen Fakten über Recht, Geld oder Gesundheit schreiben.

## Regeln der Entscheidungen (Max)
- Kinder werden nicht bewertet. Verboten für Kinder-Apps: Punkte, Punktestand, Rekord, Rang/Rangliste, Serien („N Tage in Folge“),
  Prozent, „richtig von“, „geschafft“, Sterne, Pokal 🏆, Vergleich von Tagen oder Wochen. Erlaubt: ein neutraler Zähler des Gesammelten
  oder Gefundenen („Gefunden: 3 von 8“, was im Inhalt geöffnet wurde). Bericht über Treffer: node tools/leistungs-woerter.mjs <app>.
- Erwachsene Nutzer und Objekte (Websites, Plakate, Vorschläge) dürfen bewertet werden; dann bleibt die App eine bestätigte Ausnahme
  im Wertungs-Stand (das trägt der Integrator ein, du lieferst den Grund).
- Speicherregel (Entscheidung 30б): speichert die App (localStorage.setItem im App-Code oder Sprachwahl aus kinder-ui/js/sprache.mjs),
  hat sie einen Löschknopf („Meine Daten löschen“ über datenKarte aus kinder-ui/js/daten-karte.mjs oder ein eigener Knopf mit removeItem).
  Speichert sie nichts mehr, hat sie keine Karte „Meine Daten löschen“ und keinen Löschknopf. Prüfung: node --test packages/kinderschutz/test/speicher-regel.test.mjs
  (alle Apps gegen docs/speicher-stand.json; nur Verletzungen anderer Apps deiner Gruppe sind erlaubt, nicht neue).
- Migration (Entscheidung 33а): hat die App früher einen Rekord gespeichert, bleibt oder kommt EINE Zeile
  try { localStorage.removeItem('<alter Schlüssel als Literal>'); } catch {}   (oder ohne try). Nichts anderes mit diesem Schlüssel.
- Das Wort im Verbot zählt für den Wertungs-Stand (packages/kinderschutz/src/bewertung-stand.mjs) als Treffer. Beschreibe, was die
  App NICHT tut, nur mit Verneinung höchstens drei Wörter davor („keine Punkte“, „kein Rekord“).


## Auftrag Lauf C: Ergebnis-Wertung eines Kindes aus der App nehmen
Alle Apps dieses Laufs sind Kinder-Apps (Entscheidung 34а). Kein Kind wird bewertet: weg mit Rekord, Rang, Rangliste, Punkten, Ampel als Bewertung,
Prozent, „richtig von“, „geschafft“, Sternen, Pokal, Serien, Tages- und Wochenvergleich. Bleiben darf: Frage N von M (Fortschritt der Runde),
Rückmeldung zu jeder Antwort mit Erklärung, die Spielregel, ein neutraler Zähler des Gefundenen („Gefunden: 3 von 8“).
„Geschafft!“ als Titel am Ende ersetzt du durch ein neutrales Wort („Fertig“, „Ende der Runde“).

### Quiz-Apps (Strang А): ablaufend über packages/quiz-kern
Der Motor wertet schon nichts mehr (kein Rekord, keine Punkte, keine Ränge, keine Karte „Meine Daten löschen“; er entfernt beim Start nur den alten
Rekord-Schlüssel aus der Konfiguration rekordSchluessel). Entferne in der App die toten Reste: die Funktion ergebnisSatz in den Texten der Konfiguration,
raenge und andere Rang- oder Punkteschwellen in daten/*.json, den Titel „Geschafft!“; behalte die Zeile rekordSchluessel: '…' (Migration, allein in einer Zeile).
Tests: ein Test, der daten.raenge liest, wird ein Abwesenheits-Test (die Daten haben keine raenge). Texte der App (README, GDD, eltern.html, index.html) sagen, dass
nichts gespeichert wird und dass die App weder Punkte noch Rekord noch Ränge kennt (verneint, höchstens drei Wörter davor). Hat die App neben dem Quiz etwas
Eigenes (Karten, Bildschirme), sieh den ganzen App-Code durch.
Läuft die App nach der Änderung im Browser bis zum Ende? node tools/quiz-durchlauf.mjs <app> --modus alle (Exit 0 und keine rote Prüfung).

### Andere Kinder-Apps (Strang Б)
Prüfe app.mjs, logik.mjs, daten/*.json, index.html, eltern.html, README, GDD, Tests. Entferne die Wertung und ihre Speicherung („ nichts speichern für Punkte“, Entscheidung A7).
Speicherregel (30б): speichert die App danach nichts mehr (kein setItem im App-Code, keine Sprachwahl über sprache.mjs), entferne die Karte „Meine Daten löschen“ samt Import
und Satz im Text; die App darf dann keinen Löschknopf haben. Speichert sie noch etwas anderes (Einträge des Kindes, Einstellungen), bleibt Speicher und Karte; die Karte
beschreibt (Parameter was) dann nur noch, was wirklich gespeichert wird. Hat die App früher einen Rekord gespeichert und kennt den alten Schlüssel, entferne ihn einmal beim Start mit EINER Zeile
try { localStorage.removeItem('<Schlüssel als Literal>'); } catch {}   (33а; nicht als Konstante, nicht als Teil einer größeren Zeile).
Ersetze Tests der Wertung durch Abwesenheits-Tests; füge einen Test hinzu: speichert die App (setItem) → Löschknopf vorhanden; speichert sie nichts → keine Karte.
Berichte in fragen_fuer_max, wenn eine Zahl für die Spielmechanik nötig ist (zum Beispiel ein Fortschrittsbalken): im Zweifel ändern nichts, fragen.

### Sonderfall berechtigungs-safari (Entscheidung 35а)
Neutraler Zähler „Gefunden: N“ (die Zahl der gefundenen „Datenkraken“ über die Stationen). Entfernen: „Punkte“, „Detektiv-Punkte“, „Punktestand“ und den Pokal 🏆.
Die Zahl darf im Browser bleiben (kleine Speicherung), die Schaltfläche „Safari zurücksetzen“ bleibt. Texte in GDD, eltern.html, README angleichen (kein „Punktestand“; GDD sagt, das Ziel ist die Handlung nach der Prüfung).

### Sonderfall takt-pause (Entscheidung 36а)
Wie familien-bildschirmzeit: der Ampel-Anzeiger wird ein neutraler Zeit-Anzeiger in einer Farbe (kein Rot/Gelb/Grün als Bewertung). Entfernen: die Bewertungstexte („die Pause wird gefeiert“,
„gefeiert“, „geschafft“) und die Wochenübersicht samt Speicher tp.woche. Bleiben: Timer, Ideen für Pausen, eine neutrale Tageszeile, der Löschknopf (er löscht, was noch gespeichert wird;
speichert die App danach nur noch die Tageszeile, bleibt der Knopf). Ersetze das Wort Ampel im Namen der App in README, GDD, index.html, eltern.html (der Katalogname wird vom Integrator angepasst, melde den neuen Namen).
Alte Schlüssel (tp.woche) entfernst du einmal beim Start mit je EINER Zeile removeItem mit Literal.


## Lehren aus Lauf B (gelten auch hier)
- Entfernt wird nur die gemeinsame Karte „Meine Daten löschen“ (Import aus kinder-ui/js/daten-karte.mjs), und nur, wenn die App nach deiner Änderung nichts mehr speichert.
  Eine eigene Funktion oder ein Hinweistext („Diese Seite speichert nichts“, Karte „Ihre Daten“) ist keine solche Karte und bleibt, wenn er nicht ausdrücklich im Auftrag steht.
- „Prozent“ als CSS-Wert (width:100%) und das Wort „Punkte“ in Aufzählungen, Prüfmustern und Verboten sind Fehlalarme des Berichts; nicht ändern, kurz melden.
  Ein Prozentwert, den das Kind als Ergebnis sieht, ist dagegen Wertung und kommt weg.
- node tools/aenderungsumfang.mjs meldet umformulierte und umbenannte Zeilen als Entfernung (Exit 1 ist dann normal). Prüfe, dass jeder Befund erklärbar ist; melde keine Karte, keinen Knopf und keinen Speicher, die du entfernt hast, ohne Grund.
- Die Testzahlen in README.md und GDD.md der App stimmen mit der Zahl der Tests überein (node --test packages/kinderschutz/test/testzahlen.test.mjs prüft das). Die Zeilen in docs/10 und im Wurzel-README zieht der Integrator nach; schreibe die neue Zahl in den Bericht.
- Was die App für Erwachsene anbietet, ist keine Kinder-Wertung; die Klasse aller Apps dieses Laufs ist aber „Kind“ (Entscheidung 34а). Zweifel gehören in fragen_fuer_max.

## Werkzeuge (nur lesen und messen)
- Scanner-Zeilen einer App: node /home/user/info70/docs/arbeitsweise/werkzeuge/zeilen.mjs <app>
- Bericht Leistungsbewertung: node tools/leistungs-woerter.mjs <app>
- Änderungsumfang gegen HEAD: node tools/aenderungsumfang.mjs <app>   (Exit 1 bei Befunden; erlaubt sind entfernte Zeilen mit Rekord, Rang,
  Punkte, Ampel, Prozent, Pokal; andere Entfernungen, Karten, Knöpfe und Speicher werden gemeldet: melde sie im Bericht mit Grund)
- App-Tests: node --test apps/<slug>/test/*.test.mjs   (nenne die Zahl vorher und nachher; nenne sie in README/GDD der App, wenn dort eine
  Testzahl steht und sie sich ändert: node --test packages/kinderschutz/test/testzahlen.test.mjs prüft das für alle Apps)
- Browser: node tools/browser-pruefung.mjs <app> - <ausgabeordner>  und  node tools/browser-basislinie.mjs --vergleich <ausgabeordner>
  (der Ordner enthält nur die Datei dieser App; Exit 1 = neue Verletzung gegenüber der Basislinie). Nur für Apps mit geändertem Code oder neuem Knopf.

## Texte
Wenn der Code sich ändert, ändere README.md, GDD.md, eltern.html und index.html der App passend: der Satz über den Speicher folgt dem Code
(was wird gespeichert, wo, wie löscht man es). Keine Aussage über Rekord, Rang, Punkte, Pokal, Prozent außer verneint.

## Bericht (JSON nach Schema)
Je App: app, was_getan (kurz), geaendert (Dateien), tests_vorher, tests_nachher, scanner_nachher (true = Scanner findet noch etwas),
grund_ausnahme (ein deutscher Satz für den Wertungs-Stand, wenn die App Ausnahme bleibt, sonst leer), entfernt (was entfernt wurde),
hinzugefuegt (was neu ist), fragen_fuer_max (Zweifel, Abweichungen vom Auftrag; leer, wenn keine). Bei Zweifel: nicht ändern, fragen.
