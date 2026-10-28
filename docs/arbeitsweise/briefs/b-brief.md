# Brief für Schreiber und Prüfer (Lauf B: Entscheidungen Max 2–8, 30б)

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
