# Brief Lauf D: ehrliche Marke an Seitenangaben (Entscheidung Max 22а)

Repo: /home/user/info70. Branch claude/children-network-programs-germany-hr0jh9. Gemeinsamer Arbeitsbaum: andere Agenten ändern gleichzeitig andere Apps; fasse nur die Apps deiner Gruppe an.

## Ziel
docs/02 verlangt: Eine Seitenangabe steht nur mit der Markierung „von einem Menschen geprüft“. Unsere Seitenangaben sind nicht von einem Menschen geprüft. Die neueren Apps tragen deshalb
eine ehrliche Marke; die Apps deiner Gruppe haben Seitenangaben (S. n, Seite n, стр. n) ohne Marke. Du ergänzt die Marke (nur Ergänzung; nichts entfernen, nichts umformulieren, keine Seitenangabe streichen).

## Die Marke (Wortlaut, genau so)
- Kurzform für Bildschirm und Seiten: „Seitenangaben nicht von einem Menschen geprüft.“
- Wo die App ausdrücklich eine Quelle nennt (zum Beispiel eine Quellen-Zeile): „Seitenangaben der Quelle: nicht von einem Menschen geprüft.“
- Behaupte NICHT „maschinell geprüft“, es sei denn, du hast es selbst in dieser Aufgabe gegen den Quelltext geprüft (die Textkopie liegt nicht im Repo; tu das nicht).

## Wo die Marke steht
1. Erst klären: Wo SIEHT ein Mensch die Seitenangaben? (a) Auf dem Bildschirm der App (app.mjs-Texte, aus daten/*.json gerenderte Felder, index.html), (b) auf einer Eltern-Seite (eltern.html), (c) im Druck (druck.css, Blätter), (d) nirgends:
   die Angabe steht nur in Daten, die nie angezeigt werden (Validatoren, Tests). Lies app.mjs und logik.mjs, um das zu entscheiden, und schreibe die Entscheidung je Datei in den Bericht.
2. Zu (a): die Marke steht einmal an dem Bildschirm oder der Karte, die die Angaben zeigt, nah an den Angaben (zum Beispiel im Quellenabsatz oder als kleiner Satz unter der Karte), als Text in app.mjs/index.html. Kein neuer Knopf, keine neue Karte, keine Änderung der Logik.
3. Zu (b): ein Satz in eltern.html beim Quellen- oder Hinweisabsatz.
4. Zu (c): steht die Seitenangabe im Druckinhalt, steht die Marke ebenfalls im Druckinhalt (nicht als Bildschirmteil mit der Klasse nur-bildschirm). Die Druckregeln der App (keine Emojis, keine Zeichen ☐☒☑✓✔★☆ im Druck) bleiben eingehalten.
5. Zu (d): eine Seitenangabe in nie angezeigten Daten braucht keine sichtbare Marke. Die Prüfung des Repos (siehe unten) zählt aber jede Nutzerdatei. Dann setzt du die Marke als Text in eine Nutzerdatei, die die App tatsächlich zeigt
   (zum Beispiel eltern.html oder die Fußzeile des Quellenabsatzes), oder, wenn es wirklich keine geeignete Stelle gibt, meldest du das in fragen_fuer_max und änderst nichts.

## Grenzen
- Nur Dateien unter apps/<slug>/ der Apps deiner Gruppe. Nicht: packages/, tools/, docs/ (auch nicht docs/seitenmarke-stand.json), Wurzel-Dateien.
- Kein git add/commit/push/stash/checkout/reset. Keine Modellnamen. Keine neuen Fakten über Recht, Geld oder Gesundheit.
- Tests nicht löschen oder schwächen. Ändert sich die Zahl der Tests (sie sollte es nicht), setze die Zahl in README/GDD der App.
- Die Seitenangabe selbst bleibt, wie sie ist. Footer-Links der Apps nicht anfassen.

## Prüfen
- Die Prüfung des Repos: node --test packages/kinderschutz/test/seitenmarke.test.mjs (meldet, wenn der Stand „schrumpfen muss“; das ist erwartet, der Integrator streicht deine Apps aus docs/seitenmarke-stand.json).
  Genauer für deine App: node -e "import('/home/user/info70/packages/kinderschutz/src/seitenmarke.mjs').then(async m => console.log(JSON.stringify(await m.appBefund('/home/user/info70/apps/<slug>'))))"  → marke muss true sein.
- App-Tests: node --test apps/<slug>/test/*.test.mjs grün.
- Browser nur wenn du app.mjs oder index.html geändert hast: node tools/browser-tor.mjs <slug>  (Exit 0 = keine Erhöhung gegenüber der Basislinie).
- Außerdem: node tools/leistungs-woerter.mjs <slug> zeigt keinen neuen Treffer durch deine Ergänzung.

## Bericht (JSON nach Schema)
Je App: app, wo_sichtbar (a, b, c, d als Text je Datei), ergaenzt (Dateien mit Fundstelle der Marke), marke_wortlaut, tests_vorher, tests_nachher, marke_true (Ergebnis von appBefund), fragen_fuer_max.
