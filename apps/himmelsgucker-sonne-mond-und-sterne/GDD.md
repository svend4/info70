# Himmelsgucker: Sonne, Mond und Sterne: Kurz-GDD

Grundlage: Bauauftrag CON-6 (`docs/bauauftraege/CON-6-himmelsgucker-sonne-mond-und-sterne.md`), der Katalogeintrag in
docs/10, Z. 453 und der GDD-Entwurf `docs/neue-welle/GDD-CON-6.md`. Dieses GDD beschreibt das Gebaute; wo der Entwurf
und der Bauauftrag sich unterscheiden, gilt der Bauauftrag, Abweichungen stehen in der README.

## 1. Warum
Der Himmel ist für Kinder jeden Tag zu sehen. Die Wörter dafür (voll, halb, Sichel) und das gemeinsame Hinschauen am
Abend brauchen aber eine erwachsene Person und keinen Bildschirm. Die Praleska stellt im Abschnitt „Астрономия (введение)“
(S. 138) die Aufgabe, elementare Vorstellungen von Himmelskörpern zu bilden und ihre Lage zu beobachten; als Ziel der
Beobachtung nennt sie Sonne, Mond und „звездное небо“ (S. 114). Die App gibt dafür drei Karten, eine Frage zu den
Mondgestalten und zwei Blätter für draußen. Der Bildschirm bleibt kurz, das Beobachten dauert länger.

## 2. Wer und Kernerlebnis
Wer: Kinder von 5 bis 7 Jahren zusammen mit einer erwachsenen Person (Ko-Nutzung, Verwendung: Bildschirm und Druck).
Die App ist eine Kinder-App (Kinder als Nutzer, Entscheidung Max 34а): Vorlesen und die Regel „ein Kind wird nicht
bewertet“ gelten.
Kernerlebnis: Das Kind sieht mit einer erwachsenen Person die Karten Sonne, Mond und Sterne, tippt bei einer Frage auf
eine Antwort, hört die Erklärung und geht mit einem Blatt für den Abendhimmel nach draußen.

## 3. Engine und Schleife
Eigene Karten-App auf `kinder-ui` (Weg B des Entwurfs), nicht `quiz-kern`; die Gründe stehen in der README
(Abweichung 1). Die Entscheidung liegt bei Max.
Schleife am Bildschirm: Start, Karte wählen, vorlesen, eine Frage, Erklärung, nächste Frage oder Ende. Beim Mond ist es
eine Runde aus drei Bildern (jede Gestalt einmal, die Wörter wechseln die Reihenfolge); bei Sonne und Sternen eine
Frage mit zwei Antworten. Das Ende („Und jetzt?“) lässt die Wahl: noch eine Karte oder Bildschirm aus.
Schleife im Druck: Blatt wählen, Vorschau, drucken. Zufall nur als Parameter (`zufall`), die einzige Zufallsquelle steht
in `app.mjs`.

## 4. Entscheidungen
- Drei Karten: Die Sonne, Der Mond, Die Sterne (Eigenentwurf). Drei Mondgestalten: Voller Mond, Halber Mond, Mondsichel.
- Drei Optionen je Mondbild-Frage (Pseudocode und Test des Bauauftrags); `mondphasenFrage(karten, zufall, 2)` liefert zwei.
- Antwort ohne Wertung: eine Erklärung, kein „richtig“ oder „falsch“, keine Farbe, kein Zähler. Hat das Kind ein anderes
  Wort angetippt, wird das nur benannt.
- Zwei Blätter, je eine Seite A4 hoch: Mondblatt (Verbinden und Ausmalen) und nummerierte Beobachtungsblätter (Einkreisen
  und Malen), ohne Datum, ohne Namenszeile, ohne Tagesfelder, ohne Kästchen (docs/02 Z. 79–82).
- Die Blätter entstehen in `logik.mjs` als HTML-Text (so nennt es der Pseudocode des Bauauftrags). Jeder Text ist
  maskiert, es gibt nur eigene Elemente, und der Text wird gegen die Druckregeln geprüft; `app.mjs` setzt ihn mit einer
  einzigen Funktion ein. Vorschau und Druck zeigen denselben Text.
- Keine Seitenzahl auf dem Blatt (A18-Standard); die Seiten stehen in den Daten und in der Ansicht „Für Erwachsene“, dort
  mit der Marke.
- Keine Eingabefelder, keine Speicherung, keine Anfragen nach außen (docs/02 Z. 22–24), kein Service Worker.
- Die Raumfahrt ist nicht aufgenommen (offen). Erklärungen zur Gestalt des Mondes und Zahlen gibt es nicht.
- Titel wie im Katalog: „Himmelsgucker: Sonne, Mond und Sterne“.

## 5. Lernziele (prüfbar)
1. Das Kind nennt, wann Sonne und wann Sterne zu sehen sind. Prüfung: Karte und Zwei-Antworten-Frage (Test
   `tageszeitFrage`); „nennt“ prüft nur der Kindertest.
2. Das Kind ordnet die Mondgestalten voll, teilweise und Sichel den passenden Bildern zu (Ko-Nutzung). Prüfung: Test
   `mondphasenFrage` mit fester Zufallsfolge (genau eine richtige Option, drei verschiedene Optionen); das Mondblatt zum Verbinden.
3. Die erwachsene Person druckt ein Beobachtungsblatt für den Abendhimmel ohne Datum und ohne Namenszeile. Prüfung:
   Test über alle Blätter (keine Zeichen der Sperrliste, keine Emojis, kein Datum, keine Namenszeile) und Druckansicht im Browser.

## 6. Inhalt
Sechs Karten in `daten/himmel.json`: drei Himmelskörper (Modul `himmelskoerper`) und drei Mondgestalten (Modul
`mondphasen`), dazu alle Texte der Oberfläche und der Blätter. Jede Karte hat Kennung, Titel, Modul, Erklärung und
entweder eine Seite der Quelle (`quelle.seite`) oder `eigenentwurf: true`; `ladeHimmel` lehnt eine Karte ohne beides ab.
Quelle: S. 138 und S. 114, neun Begriffe in Anführungszeichen mit Seite, je höchstens sechs Wörter, keine ganzen Sätze.
Grenze der Fakten: nur, was S. 138 und S. 114 tragen, dazu schlichte Aussagen zu Tag und Nacht (Eigenentwurf). Keine Zahlen.
Anti-Muster-Test: Der Platz der richtigen Option wechselt, jede Gestalt ist einmal die gesuchte, die Optionen sind
immer die drei Mondtitel.

## 7. Politik (Regeln der Umgebung)
- **Tor 1, kein Kind wird bewertet** (docs/02 Z. 141–146): keine Punkte, kein Rekord, kein Rang, keine Serie, kein Prozent,
  kein „richtig von“, kein „geschafft“, keine Sterne als Belohnung, kein Pokal. `node tools/leistungs-woerter.mjs` meldet
  nur das Wort „Sterne“ als Himmelskörper (Fehlalarm, begründet in der README); `node tools/bewertung-stand.mjs`: „Stand stimmt“.
  Lob und Wertung in Worten („toll“, „super“, „richtig“) schließt ein Test über alle Texte für das Kind aus: Karten,
  Oberfläche und Blätter, mit Gegenprobe (`test/logik.test.mjs`); nur die Ansicht „Für Erwachsene“ ist ausgenommen.
- **Tor 2, Speicherregel:** Die App speichert nichts und hat darum keine Karte „Meine Daten löschen“.
- **Tor 3, Berührziele, 360 px, Fokus:** Knöpfe mindestens 48 px (3rem), kein Überlauf bei 360 px, jeder Knopf mit
  `data-kennung`, Fokus nach Klick auf derselben Kennung, nach einem Wechsel der Ansicht auf der Überschrift
  (`tabindex="-1"`). `node tools/browser-tor.mjs himmelsgucker-sonne-mond-und-sterne`: Exit 0, keine Verletzung.
- **Tor 4, Quiz-Durchlauf:** gilt nur für Apps auf `quiz-kern`; diese App läuft nicht darauf.
- **Tor 5, Druck** (docs/02 Z. 79–82): Fuß und Bildschirmteile verborgen, keine Namenszeile, keine Kästchen, Haken und
  Sternchen, keine Emojis, keine Tagesfelder. Ein Blatt je Seite hängt an der Systemschrift: Das Beobachtungsblatt ist
  247 mm hoch bei 269 mm nutzbarer Höhe (Reserve 22 mm), mit DejaVu Sans ebenso (Chromium, `page.pdf()` und `pdfinfo`,
  README, Abschnitt „Drucken“). `test/regeln.test.mjs` hält die Größen fest, aus denen die Reserve entsteht.
- **Tor 6, Fakten:** Der einzige Satz über Gesundheit und Sicherheit („Nie direkt in die Sonne schauen“) trägt den
  Vermerk „(Eigenentwurf, fachlich nicht geprüft)“. Keine Aussage über Recht oder Geld. Der Zähler der externen Fakten steigt nicht.
- **Tor 7, Vorlesen:** Kinder-App, `vorlesen()` aus `kinder-ui`, auf jeder Ansicht für das Kind, nur mit einer Stimme auf dem Gerät.
- **Tor 8, Seiten der Quelle:** Seiten stehen in den Daten und in der Ansicht „Für Erwachsene“, dort mit der Marke; die
  Blätter tragen keine Seitenzahl. Die App steht nicht in `docs/seitenmarke-stand.json`.
- **Tor 9:** keine Modellnamen, keine fremden Adressen, keine Zitate über sechs Wörter.
- Werbefrei, ohne Konto, ohne Kauf; Content-Security-Policy `default-src 'self'`, Netzwerk-Wächter; Privacy by default.
- Keine Hilfe-Insel: Sachthema Natur, die erwachsene Person ist dabei.

## 8. Aufwand
S bis M. Die Daten sind statisch; Arbeit machen die Texte, die Mondbilder und die beiden Blätter. Wiederverwendet:
`kinder-ui` (`el`, `vorlesen`, `lokaleStimme`, `kinder.css`), `kinderschutz` (`installiereNetzwerkWaechter`).
Vorlagen: `puppentheater-werkstatt` und `baby-spielideen-kartei` (Druck, Regeltests).

## 9. Tests
73 Tests in zwei Dateien. `test/logik.test.mjs` prüft Daten, Zitate und Seiten, Laden, Fragen, Antwort, die Texte für das
Kind ohne Wertungswörter (Karten, Oberfläche und Blätter), Auswahl, Blätter und Bilder. `test/regeln.test.mjs` prüft die
Projektregeln, dazu das Druckbudget. Details in der README.

## 10. Kindertest-Hypothesen
Zu prüfen mit 5 bis 8 Kindern von 5 bis 7 Jahren zusammen mit einer erwachsenen Person (Protokoll docs/05, Methode 5);
Ergebnisse gibt es nicht, es sind Hypothesen:
1. Erkennen die Kinder die Gestalten voll, halb und Sichel auf den Bildern ohne Hilfe? Verwechseln sie „Halber Mond“ und „Mondsichel“?
2. Sagen die Kinder nach den Karten in eigenen Worten, wann man die Sonne und wann die Sterne sieht (Lernziel 1)?
3. Gehen die Familien nach draußen? Können die Kinder die Felder des Beobachtungsblatts (einkreisen, malen) ohne Hilfe nutzen?
   Verstehen sie das Wort „Himmelsrichtung“? Wirkt das Blatt wie eine Hausaufgabe?
4. Reicht der kurze Bildschirm, oder wollen die Kinder „noch mehr“? Klingt etwas wie eine Wertung?

## Offen
- Engine: eigene Karten-App statt `quiz-kern`. Entscheidung Max.
- Drei oder zwei Optionen bei den Mondbildern (Abschnitt 3 des Bauauftrags gegen Pseudocode und Test). Entscheidung Max.
- Altersangabe 5 bis 7 Jahre gegen die Gruppe „ПОЧЕМУЧКИ“ der Quelle (S. 103: viertes und fünftes Lebensjahr; die Gruppe
  „ФАНТАЗЕРЫ“ hat einen eigenen Abschnitt, S. 234). Die Redaktion entscheidet; für jüngere Kinder gelten die Grenzen der Ko-Nutzung.
- Lernziel 1 hat zwei Fragen, die der Bauauftrag nicht beschreibt (Eigenentwurf). Entscheidung Max, ob sie bleiben.
- Raumfahrt: Die Quelle nennt Kosmonauten, der Katalog die ESA; das Ziel trägt das Zeichen * (Aufgaben für ältere Kinder der
  Gruppe, Fußnote S. 113). Keine Karte gebaut.
- Beobachtungsblatt: Die Felder „Himmelsrichtung“ und „Wetter“ überschneiden sich mit `kita-kartograph` und `wetter-forscher`;
  Entscheidung, ob sie bleiben.
- Fachliche Durchsicht der Texte (Astronomie, Sprache, Alter) und des Sicherheitssatzes zur Sonne.
- Kein Erwachsenen-Gate und keine Sitzungsgrenze; der Bauauftrag nennt keine.
- Anzeige-Einstellungen (Kontrast, Schriftgröße) sind nicht eingebunden.
- Hilfe-Insel: nicht vorgesehen; Eintrag unter den bewussten Auslassungen von `hilfe-insel-abdeckung.test.mjs` durch den Koordinator.
- uk und ru: nicht vorhanden, offen.
- Der Test mit Kindern der Zielgruppe (Checkliste vor dem Release) und die Prüfung auf dem Gerät stehen aus.
- Seitenprobe im Prüfablauf: `tools/browser-tor.mjs` zählt Karten im DOM, nicht Seiten im PDF; die Probe mit Chromium ist nur
  von Hand gelaufen (README, Abschnitt „Drucken“). Entscheidung Max oder Integrator, ob sie in die Browser-Prüfung kommt.
- Neuladen ohne Netz ist nicht zugesichert (F4).
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

**Vorlesen:** gebaut (Kinder-App), siehe Tor 7.
