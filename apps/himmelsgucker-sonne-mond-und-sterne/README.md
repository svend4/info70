# Himmelsgucker: Sonne, Mond und Sterne

Kinder von 5 bis 7 Jahren schauen zusammen mit einer erwachsenen Person auf drei Karten (Sonne, Mond,
Sterne), beantworten eine Frage zu den Mondgestalten und können zwei Blätter für den Abendhimmel
ausdrucken. Der Bildschirm ist kurz, das Beobachten am Himmel geschieht draußen. Die erwachsene Person
liest vor (oder nutzt den Knopf „Vorlesen“); das Kind tippt auf Karten und Antworten.

Katalog: docs/10, Z. 453 (Eintrag „Himmelsgucker: Sonne, Mond und Sterne“). Bauauftrag: `docs/bauauftraege/CON-6-himmelsgucker-sonne-mond-und-sterne.md`.
Titel beibehalten. Ohne Speicherung, ohne Wertung, ohne Verbindung nach draußen. Ein Neuladen ohne Netz ist
nicht zugesichert: die App hat keinen Service Worker (F4).

**Status: erster Stand.** Geprüft sind die Tests mit `node --test`, die Browser-Messung bei 360 px
(`node tools/browser-tor.mjs himmelsgucker-sonne-mond-und-sterne`, Exit 0, keine Verletzung) und von Hand die Zahl der
Seiten im PDF (Chromium, mehrere Schriften, Abschnitt „Drucken“). Eine Prüfung auf dem Gerät, die fachliche Durchsicht
der Texte und der Test mit Kindern stehen aus.
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## Was die App tut

- **Start:** drei Karten (Die Sonne, Der Mond, Die Sterne), dazu „Blätter zum Drucken“ und „Für Erwachsene“.
- **Karte:** ein Bild und wenige kurze Sätze, „Vorlesen“, darunter ein Kasten „Für Erwachsene“ (Gesprächsanlass,
  Hinweis, Kennzeichnung als Eigenentwurf). Der Kasten wird nicht vorgelesen.
- **Frage:** Bei Sonne und Sternen eine Frage mit zwei Antworten („Wann siehst du …?“: „Am Tag“ oder „In der Nacht“).
  Beim Mond eine Runde mit drei Mondbildern: Das Kind sieht ein Bild und wählt aus drei Wörtern (Voller Mond, Halber
  Mond, Mondsichel). Jede Gestalt kommt in einer Runde genau einmal dran, die Reihenfolge der Wörter wechselt.
- **Antwort:** Überschrift, Bild und Erklärung. Es gibt kein „richtig“ und kein „falsch“, keine Farbe, keinen Zähler.
  Hat das Kind ein anderes Wort angetippt, steht nur „Du hast … angetippt.“
- **Ende:** „Und jetzt?“ mit zwei Wegen: noch eine Karte oder Bildschirm aus und zusammen nach draußen schauen.
- **Für Erwachsene:** Worum es geht, Quelle mit Begriffen und Seiten (mit der Marke), Altersangabe, Sicherheit, was
  nicht enthalten ist, Sprachen und Daten.
- **Blätter zum Drucken:** Mondblatt (drei Mondbilder zum Verbinden und Ausmalen) und Beobachtungsblatt für den
  Abendhimmel (Mondgestalt, Himmelsrichtung und Wetter zum Einkreisen, ein Kasten zum Malen). Die Beobachtungsblätter
  sind nummeriert, von 1 bis 3 wählbar. Auswahl, Vorschau, drucken. Jedes Blatt ist eine Seite A4 hoch.

## Was belegt ist

- Abschnitt „Астрономия (введение)“ (S. 138), Gruppe „ПОЧЕМУЧКИ“. Die Seite verlangt, dass Kinder elementare
  Vorstellungen von Himmelskörpern gewinnen und ihre Lage beobachten. Sie beschreibt Auf- und Untergang von Sonne
  und Mond, die Wärme der Sonne und die Gestalt des Mondes von voll bis Sichel.
- Begriffe, je mit Seite (alle höchstens sechs Wörter, ohne ganze Sätze aus dem Buch):
  „Астрономия (введение)“ (S. 138), „Солнце, Луна, звезды“ (S. 138), „всходят и заходят“ (S. 138),
  „солнечные лучи“ (S. 138), „полная, неполная, серпом“ (S. 138) und die Einzelwörter „полная“, „неполная“, „серпом“
  (S. 138), „звездное небо“ (S. 114). Die Seiten und Wortlaute sind in dieser Aufgabe gegen die Textkopie der Quelle
  geprüft (Textkopie aus `tools/quelle-holen.sh`, außerhalb des Repos). Die Prüfung läuft nicht im Repo (F3); die Tests
  prüfen, dass die Daten den geprüften Wortlauten entsprechen.
- Zur Altersangabe, ebenfalls gegen die Textkopie geprüft: Die Gruppe „ПОЧЕМУЧКИ“ wird auf S. 103 mit dem vierten und
  fünften Lebensjahr beschrieben; die Gruppe „ФАНТАЗЕРЫ“ hat einen eigenen Abschnitt „Астрономия (введение)“ (S. 234)
  mit anderen Inhalten (Sonne, Planeten, Raumfahrt, Geräte) und ohne Mondgestalten. Die Fußnote auf S. 113 erklärt das
  Zeichen * als Aufgaben für ältere Kinder der Gruppe; das Ziel zur Raumfahrt auf S. 138 trägt es.

## Was Eigenentwurf ist

- Alle deutschen Texte, Fragen und Erklärungen, die Bilder (SVG, selbst gezeichnet), die Reihenfolge der Bildschirme,
  die Gesprächsanlässe und die beiden Blätter. Jede Übertragung eines Begriffs steht mit „(Eigenentwurf)“. Die
  Blattköpfe und die Kästen auf den Karten nennen den Eigenentwurf.
- Die Namen der Mondgestalten: „Voller Mond“, „Halber Mond“, „Mondsichel“. Die Quelle nennt drei Wörter
  („полная, неполная, серпом“); die mittlere Gestalt als halber Kreis ist Eigenentwurf.
- Die Zwei-Antworten-Fragen zu Sonne und Sternen (Lernziel 1) und der Satz, dass die helle Seite des Mondes rechts
  oder links liegen kann.
- Der Sicherheitssatz „Nie direkt in die Sonne schauen“ steht mit dem Vermerk „(Eigenentwurf, fachlich nicht geprüft)“.

## Abweichungen vom Bauauftrag

1. **Engine:** Katalog und Bauauftrag nennen `quiz-kern`; gebaut ist eine eigene Karten-App auf `kinder-ui` (Weg B des
   GDD-Entwurfs). Gründe: Der Start mit drei Karten, die Bilder der Mondgestalten und die Druckauswahl liegen außerhalb
   des Motors; er verlangt mindestens zehn Fragen, der Bauauftrag hat drei Mondgestalten; seine Antworten sind nur Text.
   Die Funktionen des Pseudocodes (`ladeHimmel`, `mondphasenFrage`, `beantworteMondphase`, `druckeBeobachtungsblatt`)
   stehen in `logik.mjs`. Der Quiz-Durchlauf (`tools/quiz-durchlauf.mjs`) gilt für diese App nicht.
2. **Zwei oder drei Antworten:** Abschnitt 3 des Bauauftrags nennt eine Zwei-Antworten-Frage, Pseudocode und Test nennen
   drei Optionen. Gebaut sind drei (`ANZAHL_OPTIONEN` in `logik.mjs`); `mondphasenFrage(karten, zufall, 2)` liefert zwei.
   Die Zwei-Antworten-Frage gibt es bei Sonne und Sternen.
3. **Signaturen:** `ladeHimmel(datei)` bekommt den Inhalt von `daten/himmel.json` (die App lädt ihn per JSON-Import) und
   liest keine Datei selbst. `mondphasenFrage(karten, zufall, anzahl)` hat als dritten Parameter die Zahl der Optionen
   (Standard 3). `druckeBeobachtungsblatt(anzahl, daten)` liefert wie im Pseudocode HTML-Text; der zweite Parameter ist
   der Inhalt der Datei, ohne ihn gilt die mitgelieferte. Die Funktion prüft den Text gegen die Druckregeln und bricht bei
   einem Verstoß ab.
4. **Eine Runde aus drei Fragen:** `mondphasenRunde` lässt jede Gestalt einmal dran kommen. Der Pseudocode zieht eine
   zufällige Gestalt (`mondphasenFrage`); sie steht daneben zur Verfügung.
5. **Lernziel 1** hat zwei Fragen (Sonne, Sterne), die im Bauauftrag nicht beschrieben sind.
6. **Kein Kästchen, kein Datum:** Die Zuordnung auf dem Mondblatt geschieht durch Verbinden und Ausmalen, auf dem
   Beobachtungsblatt durch Einkreisen und Malen; die Blätter sind nummeriert statt datiert (Vorschläge aus Abschnitt 9).
7. **Keine Seitenzahl auf dem Blatt (A18-Standard):** Die Blätter tragen keine Seitenangabe und darum nicht die Marke.
   Die Seiten stehen nur in der Ansicht „Für Erwachsene“ und in den Daten, dort mit der Marke.

## Was nicht übernommen wurde

- Die Raumfahrt (die Quelle nennt Kosmonauten, der Katalog Astronautinnen und Astronauten der ESA): keine Karte, kein Bild.
  Offen; das Ziel trägt auf S. 138 das Zeichen * (Aufgaben für ältere Kinder der Gruppe, Fußnote S. 113).
- Erklärungen, warum der Mond seine Gestalt ändert, „zunehmend“ und „abnehmend“, Zahlen und Entfernungen: ohne
  fachliche Prüfung nicht aufgenommen.
- Fremde Texte, Lieder, Geschichten und Bilder: keine. Keine Seitenzahlen auf dem Blatt.
- Eine uk- und ru-Fassung: uk und ru: nicht vorhanden, offen.

## Was nicht gebaut wurde

- Keine Eingabefelder, keine Namen, kein Feld für ein Kind, keine Notizen über Kinder, keine Einstufung. Keine
  Bewertung, Punkte, Rangliste (docs/02 Z. 141–146).
- Keine Speicherung: kein Browser-Speicher, kein Konto, kein Download, keine Karte „Meine Daten löschen“
  (Projektregel: wer nichts speichert, hat keinen Löschknopf).
- Keine Verbindung nach draußen (docs/02 Z. 22–24). Kein Service Worker.
- Keine `eltern.html`: Die Hinweise für Erwachsene stehen in der App (Ansicht „Für Erwachsene“ und Kasten auf den Karten).
- Keine Anzeige-Einstellungen (Kontrast, Schriftgröße) wie in den Vorlagen; offen.
- Kein Erwachsenen-Gate und keine Sitzungsgrenze: Die Ansichten sind kurz, der Bauauftrag nennt keine.

## Technik

- `index.html`: Grundgerüst, Content-Security-Policy `default-src 'self'`, Stylesheets aus `packages/kinder-ui` und
  `druck.css`, das gemeinsame Favicon auf der Zeile des Stylesheets. Der Hauptbereich ist ein Bildschirmteil; das
  Druckblatt liegt in einem eigenen Bereich außerhalb davon.
- `app.mjs`: Ansichten (Start, Karte, Frage, Antwort, Ende, Erwachsene, Druck), Vorlesen, Auswahl und Vorschau, der
  Druckknopf (`window.print()`), der Netzwerk-Wächter aus `packages/kinderschutz`. Jeder Knopf entsteht in der
  Funktion `knopf()` und trägt eine `data-kennung`. Nach einem Wechsel der Ansicht bekommt die Überschrift
  (`tabindex="-1"`) den Fokus; bleibt der Knopf, bekommt er ihn zurück. Dies ist die einzige Datei mit Zufall: Der
  Zufall steht einmal in `app.mjs` und wird als Funktion an `logik.mjs` übergeben. Die Bilder und die Blätter gehen
  als HTML-Text durch eine einzige Funktion, `setzeHtml()` (die einzige Stelle mit `innerHTML`), in die Seite; alles
  andere baut `el()` aus `kinder-ui`.
- `logik.mjs`: Laden und Prüfen der Karten, Fragen, Antwort, Auswahl für den Druck und die Blätter. Die Blätter
  entstehen als HTML-Text (`blattHtml`, `druckeBeobachtungsblatt`, `druckBlaetterHtml`): jeder Text geht durch
  `maskiere()`, es gibt nur eigene Elemente (Absätze, Überschriften, Felder, SVG) und keine Eingabe, keinen Verweis,
  kein Skript. Geprüft wird der Text gegen die Druckregeln (`pruefeBlattHtml`). Ohne DOM, ohne eigene Zufallsquelle,
  ohne Uhr. Der HTML-Text der Blätter dient für den Druckbereich und für die Vorschau; er trägt keine Kennung, die
  doppelt vorkäme.
- `bilder.mjs`: die Bilder als SVG-Text (Sonne, Mond, drei Mondgestalten, Sternenhimmel). Ohne DOM, ohne Zufall.
  Im Druck gibt es nur die drei einzelnen Mondgestalten, schwarze Linie auf weißem Grund mit grauer dunkler Fläche.
- `daten/himmel.json`: Karten mit Begriffen und Seiten, Fragen, alle Texte der Oberfläche und der Blätter. Die
  Daten kommen per JSON-Import mit Typangabe, nicht per `fetch`.
- `druck.css`: Bildschirm und `@media print`, A4 hoch, Bildschirmteile ausgeblendet, ein Blatt je Seite mit Reserve für
  breitere Schriften (Zeilenhöhe 1,3, die Reihe der Mondgestalten als Raster in einer Zeile, Abschnitt „Drucken“). Auf dem
  Bildschirm bricht der Titel bei 360 px auch innerhalb eines Wortes um.

## Vorlesen

Die App ist eine Kinder-App (Kinder als Nutzer, Entscheidung Max 34а). Jede Ansicht für das Kind hat einen Knopf
„Vorlesen“ über `vorlesen()` aus `kinder-ui`, mit einer Stimme, die auf dem Gerät liegt (`lokaleStimme`). Gibt es keine,
steht ein Hinweis statt des Knopfs. Vorgelesen werden nur die Sätze für das Kind, keine Hinweise für Erwachsene und
keine Vermerke.

## Drucken

Der Knopf „Blätter drucken“ druckt nur die gewählten Blätter, je Blatt eine Seite A4 hoch: zuerst das Mondblatt, dann
die Beobachtungsblätter nach Nummer. Ohne gewähltes Blatt ist der Knopf aus. Im Druckdialog Kopf- und Fußzeilen
ausschalten; sonst können Datum oder Adresse der Seite auf dem Papier stehen. Die App setzt selbst kein Datum und
keine Adresse. Auf den Blättern stehen keine Zeichen (keine Kästchen, Haken, Sternchen-Zeichen, Punkte, Pfeile),
keine Emojis, keine Namenszeile, keine Tagesfelder und keine Seitenzahl der Quelle (docs/02 Z. 79–82).

**Ein Blatt je Seite hängt an der Schrift.** Die App setzt keine eigene Schrift, sie nimmt die Systemschrift aus
`kinder.css`. Eine breitere Schrift bricht Zeilen um und macht ein Blatt höher; passt es nicht mehr auf die Seite, läuft
es trotz `break-inside: avoid` auf eine zweite. Die nutzbare Höhe ist 269 mm (297 mm minus 2 mal 14 mm Rand), die Breite
180 mm. Gemessen wurde mit Chromium im Druckmedium sowie mit `page.pdf()` und `pdfinfo`, für das Mondblatt und drei
Beobachtungsblätter (erwartet: vier Seiten). „Vorher“ ist der Stand der ersten Abgabe; `system-ui` ist in dieser
Umgebung Inter:

| Schrift | Beobachtungsblatt vorher | nachher | Seiten vorher | Seiten nachher |
|---|---|---|---|---|
| Inter, Liberation Sans, FreeSans | 266,7 mm | 247,0 mm | 4 | 4 |
| Carlito | 261,4 mm | 242,4 mm | 4 | 4 |
| DejaVu Sans (rund 14 % breiter als Inter) | 282,6 mm | 247,0 mm | 7 | 4 |

Die Reserve des Beobachtungsblatts ist jetzt 22,0 mm (vorher 2,3 mm). Das Mondblatt ist 219,0 mm hoch (vorher 225,4 mm,
mit DejaVu Sans 223,6 mm). Mit DejaVu Sans und zusätzlichem Zeichenabstand bleibt es bei einer Seite je Blatt bis 0,15 em
(Blatt 265,1 mm); bei 0,20 em sind es wieder sieben Seiten. Die Reserve entsteht aus der Zeilenhöhe 1,3 statt 1,5 im
Blatt und aus der Reihe „Voller Mond, Halber Mond, Mondsichel, Kein Mond zu sehen“: Diese Reihe besteht jetzt aus vier
gleich breiten Spalten, ein langes Wort bricht in seiner Spalte um, und die letzte Wahl rutscht nicht mehr in eine zweite
Zeile (das kostete vorher 16 mm). Der Kasten zum Malen blieb bei 42 mm.

Nicht gemessen sind Firefox und Safari, Schriften außerhalb dieser Liste (etwa Verdana), anderes Papier als A4 und ein
Rand, den man im Druckdialog ändert. Eine Änderung an Schriftgrößen, Rändern, Bildern, Feldern oder am Kasten braucht eine
neue Messung. Schutz: `test/regeln.test.mjs` hält die Größen fest, aus denen die Reserve entsteht (Seitenrand,
Grundschrift, Zeilenhöhe, Kasten höchstens 45 mm, keine feste Höhe im Druck, die Reihe der Mondgestalten in einer Zeile),
und schlägt bei 13 Änderungen an, darunter ein Kasten von 90 mm (das sind 7 statt 4 Seiten; die 70 früheren Tests blieben
dabei grün). Der Test misst keine Seiten; die Seitenprobe mit Chromium gehört in den Prüfablauf (siehe „Offen“).

## Wortliste der Wertung

`node tools/leistungs-woerter.mjs himmelsgucker-sonne-mond-und-sterne` meldet das Wort „Sterne“ in der Gruppe
`sterneUndPokale`: 1 Treffer in `index.html` (der Titel der App aus dem Katalog) und 12 Treffer in `daten/himmel.json`
(Titel der Karte und Kindertexte). Das ist ein Fehlalarm: Gemeint ist der Himmelskörper, nicht eine Belohnung. Die App
vergibt keine Sterne, zeigt kein Stern-Zeichen (auch nicht im SVG: die Bilder haben vierzackige Funken) und zählt
nichts. Der Test „Sterne“ in `test/regeln.test.mjs` hält das fest: Jeder Treffer muss dieses Wort sein und in diesen
zwei Dateien stehen, im Code (`app.mjs`, `logik.mjs`, `bilder.mjs`, `druck.css`) steht es nicht, und neben dem Wort
steht kein Wort der Belohnung. Das Muster `\bSterne?\b` der Vorlagen ist deshalb durch diesen Test ersetzt.
Alle anderen Gruppen der Wortliste haben keinen Treffer; `node tools/bewertung-stand.mjs` sagt „Stand stimmt.“

## Offen

Siehe `GDD.md`, Abschnitt „## Offen“. Dazu:

- Engine: eigene Karten-App statt `quiz-kern` (Abweichung 1). Entscheidung Max.
- Zwei oder drei Antworten bei den Mondbildern (Abweichung 2). Entscheidung Max.
- Altersangabe: Katalog und Bauauftrag nennen 5 bis 7 Jahre, die Quelle stellt den Abschnitt in die Gruppe „ПОЧЕМУЧКИ“
  (S. 103: viertes und fünftes Lebensjahr); die Gruppe „ФАНТАЗЕРЫ“ hat einen eigenen Abschnitt (S. 234). Die Redaktion entscheidet.
- Fachliche Durchsicht der Texte (Astronomie, Sprache, Alter) und des Sicherheitssatzes zur Sonne; Test mit Kindern.
- Raumfahrt (Kosmonauten gegen ESA) und die Bildauswahl dazu.
- Die Blätter gehen als HTML-Text über `innerHTML` in die Seite, weil der Pseudocode `druckeBeobachtungsblatt` als HTML
  beschreibt. Jeder Text ist maskiert, die Stelle ist einzeln (`setzeHtml()`) und getestet. Entscheidung Max, ob das so
  bleibt oder die Blätter wieder als Elemente mit `el()` gebaut werden.
- Hilfe-Insel: nicht vorgesehen (Sachthema Natur, die erwachsene Person ist dabei). Der Koordinator trägt die App in
  `packages/kinderschutz/test/hilfe-insel-abdeckung.test.mjs` unter den bewussten Auslassungen ein.
- Seitenangaben: A18. Die Marke steht dort, wo die Seiten stehen; die Blätter tragen keine Seitenzahl.
- Seitenprobe im Prüfablauf: `tools/browser-tor.mjs` zählt die Karten im DOM (`druck.sichtbareKarten`), nicht die Seiten im
  PDF. Die Probe mit Chromium (`page.pdf()` und `pdfinfo`, mehrere Schriften) ist hier nur von Hand gelaufen; in den Tests
  stehen nur die Größen, aus denen die Reserve entsteht (Abschnitt „Drucken“). Entscheidung Max oder Integrator, ob die
  Seitenzahl in die Browser-Prüfung kommt; das gilt für jede App mit Druckblättern.
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## Tests

Die Tests stehen in zwei Dateien: `test/logik.test.mjs` prüft die Daten gegen die geprüften Zitate und Seiten, das
Laden, die Fragen mit festen Zufallsfolgen, die Antwort ohne Wertung, die Texte für das Kind ohne Wertungswörter (Karten,
Oberfläche und Blätter, mit Gegenprobe), die Auswahl, die Blätter (als Daten und als HTML-Text: wohlgeformt, nur eigene
Elemente, jeder Text maskiert, auch ein feindlicher Text in jedem Feld) und die Bilder.
`test/regeln.test.mjs` prüft die Projektregeln: keine Eingabefelder, keine Speicherung, keine externen Adressen, Zufall
nur in `app.mjs`, Favicon-Zeile, kein Service Worker, keine Druckzeichen, keine Namenszeile, keine Seitenzahl auf dem
Blatt, Marke bei der Quelle, Eigenentwurf-Kennzeichnung, externe Fakten, das Druckbudget (mit Gegenprobe), Fokus nach
Klick (auch dass `focus()` aufgerufen wird) und nach einem Wechsel der Ansicht, Vorlesen, Antwort ohne Wertung, die
Wortliste, Knopfhöhe, Testzahl.
Insgesamt sind es 73 Tests.

```bash
node --test apps/himmelsgucker-sonne-mond-und-sterne/test/*.test.mjs
```
