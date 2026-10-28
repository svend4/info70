# Brief Lauf E: eine neue App nach Bauauftrag bauen (Stufe 1 der neuen Welle, Entscheidung Max 11б)

Repo: /home/user/info70, Branch claude/children-network-programs-germany-hr0jh9. Gemeinsamer Arbeitsbaum: andere Agenten bauen gleichzeitig andere Apps. Du baust genau EINE Einheit.
Der Integrator committet. Du führst kein git add, commit, push, stash, checkout, reset, restore aus.

## Lies zuerst (in dieser Reihenfolge)
1. docs/bauauftraege/SESSION-ANLEITUNG.md (Ablauf; ihre Git-Schritte 1 und 6 gelten NICHT für dich, der Rest schon) und docs/bauauftraege/VORLAGE.md.
2. Den Bauauftrag deiner Einheit (docs/bauauftraege/<Kennung>-*.md) und den GDD-Entwurf docs/neue-welle/GDD-<Kennung>.md (er nennt Zielgruppe, Daten, Tore und offene Fragen; er ist ein Entwurf, der Bauauftrag gilt bei Widerspruch).
3. docs/plan-neue-welle.md, Abschnitt 3 (Tore für jede neue App) und docs/02-anforderungen.md (die Ergänzungen vom 27.10.2026 am Ende).
4. Die Vorlagen: apps/baby-spielideen-kartei und apps/puppentheater-werkstatt (Dateien, Stil, test/regeln.test.mjs mit den Druck-, Namen-, Eingabe- und Netzregeln, Knopfhöhe, Zufall nur in app.mjs).

## Was du lieferst
- apps/<slug>/ mit: index.html, app.mjs, logik.mjs, druck.css, daten/*.json, package.json, README.md, GDD.md (aus dem Entwurf, an das Gebaute angepasst), eltern.html wenn die Vorlage-App eine hat und die Zielgruppe Eltern ist, test/logik.test.mjs, test/regeln.test.mjs.
  Der Ordnername steht im Bauauftrag („Ziel: neue App“).
- docs/registrierung/<Kennung>.json (Format wie docs/registrierung/PRI-8.json).
- Nichts anderes: nicht index.html (Wurzel), README.md (Wurzel), impressum.html, docs/10, docs/praleska-katalog.json, docs/plan-*, docs/fragen-und-hinweise.md, docs/bauauftraege, packages/, tools/, andere Apps.
  Das Eintragen in Hub, Wurzel-README, Impressum und Katalog macht der Integrator nach deinem Registrierungstext.

## Regeln, die seit dem Bauauftrag dazugekommen sind (gelten für dich)
1. Keine Wertung eines Kindes: weder Punkte, Rekord, Rang, Serie, Prozent, „richtig von“, „geschafft“, Sterne noch Pokal (Prüfung: node tools/leistungs-woerter.mjs <slug>; jeder Treffer ist entfernt oder als Fehlalarm begründet). Neutraler Zähler des Gefundenen ist erlaubt.
2. Speicher: speichert die App etwas (localStorage.setItem), hat sie einen Löschknopf für genau ihre Schlüssel (kinder-ui/js/daten-karte.mjs); speichert sie nichts, hat sie keine Karte „Meine Daten löschen“. Die Bauaufträge dieser Stufe sehen keinen Speicher vor.
3. Kein Service Worker. Kein sw.js, keine Registrierung.
4. Die Zeile mit dem Stylesheet in index.html (und eltern.html) trägt auf DERSELBEN Zeile das gemeinsame Favicon:
   <link rel="stylesheet" href="../../packages/kinder-ui/css/kinder.css" /><link rel="icon" type="image/svg+xml" href="../../packages/kinder-ui/img/favicon.svg" />
   Die Grundgerüst-Tests dürfen außer Stylesheets nur genau diesen Link zulassen (siehe apps/baby-spielideen-kartei/test/regeln.test.mjs; übernimm die Prüfung der Vorlage, sie ist bereits darauf angepasst).
5. Fakten über Recht, Geld, Gesundheit: jede Aussage hat eine Quelle aus dem Bauauftrag oder den Vermerk „(Eigenentwurf, fachlich nicht geprüft)“ am Satz (der Zähler externer Fakten, packages/kinderschutz/test/externe-fakten.test.mjs, darf nicht steigen).
6. Seitenangaben: Die Quelle ist die Praleska; die Textkopie liegt unter /tmp/info70-quelle/all.txt.
   Prüfe Zitate und Seiten mit: node tools/bauauftrag-pruefen.mjs /tmp/info70-quelle/all.txt (der Bauauftrag ist geprüft; neue Zitate in deiner App prüfst du selbst gegen die Textkopie).
   Auf dem Druckblatt stehen keine Seitenzahlen (A18-Standard); stehen Seitenangaben in den Daten, dann ist die Marke „Seitenangaben nicht von einem Menschen geprüft.“ an der Stelle sichtbar, an der die Quelle genannt wird
   (die Prüfung packages/kinderschutz/test/seitenmarke.test.mjs zählt jede Nutzerdatei; deine App darf dort nicht neu auftauchen). „Maschinell gegen den Quelltext geprüft“ schreibst du nur, wenn du die Seiten selbst in dieser Aufgabe gegen die Textkopie geprüft hast.
7. Berührziele mindestens 48 px (3rem), kein Überlauf bei 360 px, Fokus nach Klick; jeder Knopf trägt data-kennung (die Vorlage-Apps tun das); nach einem Bildschirmwechsel steht der Fokus auf der Überschrift des neuen Bildschirms (tabindex="-1", .focus()).
8. Druck: Fuß und Bildschirmteile in druck.css verborgen (Klasse nur-bildschirm), keine Zeichen ☐☒☑✓✔★☆, keine Emojis im Druckinhalt, keine Namenszeile, keine Tagesfelder; eine Karte je Blatt A4 hoch, wenn der Bauauftrag Karten vorsieht.
9. Vorlesen: für Kinder-Apps (Zielgruppe Kinder oder beide) über vorlesen() aus kinder-ui. Zielgruppe nur Erwachsene: im GDD der Vermerk „Vorlesen: nicht vorgesehen. Werkzeug für Erwachsene …“.
10. Keine Modellnamen, keine fremden Adressen, keine Zitate über 6 Wörter aus der Praleska (Begriffe und Titel mit Seite), keine ganzen Sätze aus dem Buch. Was nicht aus der Quelle stammt: „(Eigenentwurf)“.
11. Nenne docs/02 in README und GDD nur mit einer der Zeilenangaben Z. 22–24, Z. 79–82 oder Z. 141–146 (App-Tests prüfen das).
12. Testzahl in README und GDD der App stimmt exakt mit der Zahl der Tests überein (node --test packages/kinderschutz/test/testzahlen.test.mjs prüft das für alle Apps).

## Prüfen (alles muss laufen, bevor du berichtest)
- node --test apps/<slug>/test/*.test.mjs grün.
- npm run test:sitzung (alle Testdateien; die zwei Zählungs-Tests sind übersprungen). Die Wurzel-Tests können wegen deiner neuen App an folgenden Stellen anschlagen, das ist erwartet und gehört dem Integrator: Gesamtzahl der Tests im Wurzel-README, Zahlen im Impressum, Hub-Eintrag. Jeder andere Fehler ist deiner.
- node tools/browser-tor.mjs <slug>  (für eine neue App zählt jede Verletzung als Erhöhung: Ziel ist ein Lauf ohne Verletzung, Exit 0; nenne die Zahlen). Prüfe die Druckansicht im Browser (druck.zeichen leer, pflichtZeilen wie im Bauauftrag).
- node tools/leistungs-woerter.mjs <slug>, node tools/bewertung-stand.mjs (muss „Stand stimmt“ sagen), node --test packages/kinderschutz/test/speicher-regel.test.mjs.

## Bericht (JSON nach Schema)
kennung, slug, was_gebaut (Dateien, Umfang), tests (Zahl), browser (Ergebnis je Punkt), abweichungen_vom_bauauftrag (mit Grund), offene_punkte, registrierung (Pfad), fragen_fuer_max.
