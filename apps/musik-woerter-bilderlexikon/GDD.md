# Musik-Wörter-Bilderlexikon: Kurz-GDD

Grundlage: Bauauftrag CON-10 (`docs/bauauftraege/CON-10-musik-woerter-bilderlexikon.md`), der Katalogeintrag in docs/10,
Z. 457 und der GDD-Entwurf `docs/neue-welle/GDD-CON-10.md`. Dieses GDD beschreibt das Gebaute; wo der Entwurf und der
Bauauftrag sich unterscheiden, gilt der Bauauftrag, Abweichungen stehen in der README.

## 1. Warum
Kinder hören Wörter wie Dirigent, Solist, Oper oder Harfe, haben aber kein kurzes Wörterbuch mit Bild und einfacher
Erklärung, weder für sich noch für die erwachsene Person neben ihnen (Bedürfnis: Eigenentwurf, nicht gemessen, offen).
Die Praleska stellt im Abschnitt „Развиваемся в деятельности“ (S. 259) für die Gruppe „ФАНТАЗЕРЫ“ die Aufgabe, dass
Kinder „музыкальными терминами“ (S. 260) lernen und Instrumente kennenlernen. Die App gibt dafür ein Lexikon: 16
Fachwörter und sieben Instrumente, je mit Bild, kurzer Erklärung und Vorlesen, dazu Karten zum Drucken. Ohne Werbung, ohne
Wertung des Kindes, ohne Speicherung.

## 2. Wer und Kernerlebnis
Wer: beide, Kinder und erwachsene Personen. Zielgruppe nach Katalog und Bauauftrag: Kinder von 5 bis 9 Jahren; die Quelle
ordnet die Seite der Gruppe „ФАНТАЗЕРЫ“ zu, deren Alter als 5 bis 7 Jahre gelesen wird (S. 199 bis 200, Lesart); die
Spanne ist offen. Verwendung: Bildschirm (allein oder zusammen) und Druck. Die App ist eine Kinder-App (Kinder als
Nutzer, Entscheidung Max 34а): Vorlesen und die Regel „ein Kind wird nicht bewertet“ gelten.
Kernerlebnis (Eigenentwurf): Das Kind wählt ein Thema, tippt auf ein Wort, sieht das Wort, das Bild und die Erklärung,
hört sie vorlesen und blättert weiter; die erwachsene Person kann die Wörter, die ihr gefallen, auf ein Blatt A4 drucken.

## 3. Engine und Schleife
Eigene Karten-App auf `kinder-ui` (Weg B des Entwurfs), nicht `quiz-kern`; der Bauauftrag nimmt den Motor nicht an, die
Gründe stehen in der README (Abweichung 8). Schleife am Bildschirm: Thema wählen, Wort wählen, Karte, Vorlesen, nächstes
Wort oder zurück zur Liste, auf Wunsch drucken. Jeder Schritt ist eine Auswahl aus einer Liste, es gibt keinen Freitext.
Ansichten: Start, Liste, Karte, Instrumentenansicht, Karten drucken (mit Vorschau), Für Erwachsene. Kein Zufall: Die
Reihenfolge der Wörter ist die der Datei, und die ist die der Quelle.

## 4. Entscheidungen
- 23 Wörter: 16 Fachwörter von S. 260 (Vokalmusik, Instrumentalmusik, Solist, Begleitung, Dirigent, Komponist, Interpret,
  Melodie, Rhythmus, Tempo, Dynamik, Ballett, Oper, Konzert, Blasorchester, Streichorchester) und die sieben Instrumente
  (Harfe, Kontrabass, Violoncello, Cembalo, Orgel, Klavier, Klarinette). Die Zählung 16 gilt, wenn Vokal- und
  Instrumentalmusik sowie Blas- und Streichorchester einzeln gezählt werden (Eigenentwurf, wie im Bauauftrag).
- Drei Themen: Musik (11), Orchester (5), Instrumente (7). Nur `solist` in `musik` legt der Bauauftrag fest; der Rest ist
  der Vorschlag des Entwurfs (Eigenentwurf, offen).
- Die Karte zeigt das Wort, ein Bild und höchstens zwei kurze Sätze (Eigenentwurf, fachlich nicht geprüft). Die
  Instrumentenansicht zeigt alle sieben Instrumente zusammen, die Instrumentenliste ein Wort nach dem anderen.
- Die Bilder sind eigene Zeichnungen im App-Ordner (`bilder/`, SVG, keine Medien von außen). Der Bauauftrag nennt bis zur
  Zeichnung einen Platzhalter; gebaut ist eine erste Fassung aller 23 Zeichnungen (Abweichung 1 der README).
- Druck: je gewähltem Wort ein Blatt A4 hoch mit Wort, Bild, Erklärung und dem Vermerk zum Eigenentwurf; keine Seitenzahl
  der Quelle (A18-Standard), keine Namenszeile, keine Zeichen, keine Tagesfelder (docs/02 Z. 79–82).
- Der Vermerk „Wort, Erklärung und Bild: Eigenentwurf, fachlich nicht geprüft.“ steht im Fuß jeder Ansicht und auf jedem
  Blatt, denn jede Ansicht zeigt Wörter, Bilder oder Erklärungen, die nicht aus der Quelle sind (auch Start, Liste und
  Instrumentenansicht, die die erwachsene Person vorliest). Die Zahl der 16 Fachwörter trägt in der Ansicht „Für
  Erwachsene“ den Vermerk „Zählung: Eigenentwurf“.
- Sprachen: Die Oberfläche ist deutsch. `ru` trägt das Wort der Quelle, `uk` ist überall `null`; angezeigt wird nur
  Deutsch. `begriffKarte(begriff, sprache)` kennt de, ru und uk; `druckBlaetter` überspringt Karten ohne Wort.
- Keine Eingabefelder, keine Speicherung, keine Anfragen nach außen (docs/02 Z. 22–24), kein Service Worker.
- Titel wie im Katalog: „Musik-Wörter-Bilderlexikon“.

## 5. Lernziele (prüfbar)
Aus Abschnitt 2 des Bauauftrags (Eigenentwurf); danach, womit es geprüft wird:
1. Das Kind wählt einen Begriff aus einer Liste und sieht Wort, Bildfeld und eine kurze Erklärung in einfacher Sprache
   (`begriffKarte`). Prüfung: jeder Eintrag hat Wort, Bild im App-Ordner und eine Erklärung von höchstens zwei Sätzen;
   „versteht das Kind das Wort“ prüft nur der Kindertest (Abschnitt 10).
2. Die erwachsene Person zeigt die sieben Instrumente in einer eigenen Ansicht und liest ihre Erklärung vor. Prüfung: die
   Ansicht zeigt genau die sieben Einträge mit S. 260 und der Kategorie `instrument` (`pruefeBegriffe`); jede hat einen
   Vorlese-Knopf; im Browser geklickt.
3. Die erwachsene Person druckt eine Karte je Blatt A4 hoch, ohne Zeichen der Sperrliste und ohne Namenszeile. Prüfung:
   Tests über alle 23 Blätter (keine Zeichen, keine Emojis, keine Namenszeile, keine Seitenzahl) und die Druckansicht im
   Browser (1, 3 und 23 gewählte Wörter ergeben 1, 3 und 23 Seiten A4 hoch).

## 6. Inhalt
23 Wörter in `daten/begriffe.json`. Jeder Eintrag hat Kennung, deutsches Wort, `ru`, `uk`, Kategorie, Bild, Bildtext,
Erklärung, `quelle` (`seite` „S. 260“ und `text`, das Wort der Quelle) und `eigenentwurf: true`; `ladeBegriffe` lehnt
einen Eintrag ohne Pflichtfeld oder mit einem Bild außerhalb von `bilder/` ab. Quelle: S. 259, S. 260 und für das Alter
S. 199 bis 200, die Begriffe in Anführungszeichen mit Seite, je höchstens sechs Wörter, keine ganzen Sätze aus dem Buch.
Grenze der Inhalte: nur Musikwörter und schlichte Erklärungen, keine Zahlen, keine Aussage über Gesundheit, Recht oder
Geld, keine Jahreszahlen, keine Namen von Personen. Die Erklärungen sind Eigenentwurf und brauchen eine Fachprüfung
(Musikpädagogik), die nicht stattgefunden hat. Auf der Seite stehen außerdem andere Instrumente des Symphonieorchesters
und Volksinstrumente ohne Namen; sie sind nicht aufgenommen.

## 7. Politik (Regeln der Umgebung)
- **Tor 1, kein Kind wird bewertet** (docs/02 Z. 141–146): keine Punkte, kein Rekord, kein Rang, keine Serie, kein Prozent,
  kein „richtig von“, kein „geschafft“, keine Sterne, kein Pokal. `node tools/leistungs-woerter.mjs
  musik-woerter-bilderlexikon`: keine Treffer; `node tools/bewertung-stand.mjs`: „Stand stimmt.“ Der einzige Zähler nennt
  die Zahl der gewählten Karten und die Zahl der Wörter eines Themas.
- **Tor 2, Speicherregel:** Die App speichert nichts und hat darum keine Karte „Meine Daten löschen“
  (`packages/kinderschutz/test/speicher-regel.test.mjs`).
- **Tor 3, Berührziele, 360 px, Fokus:** Knöpfe mindestens 48 px (3rem), kein Überlauf bei 360 px, jeder Knopf mit
  `data-kennung`, Fokus nach Klick auf derselben Kennung, nach einem Wechsel der Ansicht auf der Überschrift
  (`tabindex="-1"`). `node tools/browser-tor.mjs musik-woerter-bilderlexikon`: Exit 0, keine Verletzung.
- **Tor 4, Quiz-Durchlauf:** gilt nur für Apps auf `quiz-kern`; diese App läuft nicht darauf.
- **Tor 5, Druck** (docs/02 Z. 79–82): Fuß und Bildschirmteile verborgen, keine Namenszeile, keine Kästchen, Haken und
  Sternchen-Zeichen, keine Emojis, keine Tagesfelder; eine Karte je Blatt A4 hoch.
- **Tor 6, Fakten:** keine Aussage über Recht, Geld oder Gesundheit. Die Erklärungen sind Musikwörter und tragen den Vermerk
  „Eigenentwurf, fachlich nicht geprüft“ im Fuß jeder Ansicht und auf dem Blatt. Der Zähler der externen Fakten steigt nicht.
- **Tor 7, Vorlesen:** Kinder-App, `vorlesen()` aus `kinder-ui` auf Start, Liste, Karte und Instrumentenansicht, nur mit
  einer deutschen Stimme auf dem Gerät. Die Druckvorschau ist für Erwachsene.
- **Tor 8, Seiten der Quelle:** Die Seiten stehen in den Daten und dort, wo die Quelle genannt wird (Fuß, Ansicht „Für
  Erwachsene“), mit der Marke; die Blätter tragen keine Seitenzahl. Die App steht nicht in `docs/seitenmarke-stand.json`.
- **Tor 9:** keine Modellnamen, keine fremden Adressen, keine Zitate über sechs Wörter.
- Werbefrei, ohne Konto, ohne Kauf; Content-Security-Policy `default-src 'self'`, Netzwerk-Wächter; Privacy by default.
- Keine Hilfe-Insel: Fachlernen Musik, wie bei `tonleiter-treppe` und `rhythmus-orchester`.
- Bilder: jedes Bild mit Bildtext (`alt`), das Wort steht immer als Text daneben; kleine Bilder in Knöpfen sind Schmuck.
Risiken des Themas (Eigenentwurf): Zu einfache Erklärungen werden falsch; Figuren ohne Klischee und ohne reale Gesichter;
Zeichnungen von Instrumenten müssen erkennbar und richtig sein. Beides prüft eine Fachperson.

## 8. Aufwand
S bis M. Die Daten sind statisch und die Logik ist klein; Arbeit machen die 23 Zeichnungen, die Erklärungen und die
Prüfungen. Wiederverwendet: `kinder-ui` (`el`, `vorlesen`, `lokaleStimme`, `kinder.css`), `kinderschutz`
(`installiereNetzwerkWaechter`). Vorlagen: `baby-spielideen-kartei` und `puppentheater-werkstatt` (Druck, Regeltests).

## 9. Tests
67 Tests in zwei Dateien. `test/logik.test.mjs` prüft Daten, Wortlaute und Seiten, Laden, Zählung, Kategorien, Karte,
Erklärungen, Bilder, Auswahl, Blätter und Vorlesetexte. `test/regeln.test.mjs` prüft die Projektregeln. Details in der README.

## 10. Kindertest-Hypothesen
Zu prüfen mit 5 bis 8 Kindern, allein und mit einer erwachsenen Person (Protokoll docs/05, Methode 5; ohne Namen von
Kindern); Ergebnisse gibt es nicht, es sind Hypothesen (Eigenentwurf):
1. Verstehen die Kinder die Erklärung in ein bis zwei Sätzen ohne Hilfe? Welche Wörter (Begleitung, Komponist,
   Interpret) bleiben fremd?
2. Findet ein Kind, das noch nicht liest, ein Wort über das Bild und das Vorlesen? Nutzt es die Liste oder verliert es sich?
3. Helfen die Bilder bei den abstrakten Wörtern (Tempo, Dynamik, Rhythmus, Melodie) oder verwirren sie? Erkennt ein Kind
   das Instrument im Bild?
4. Fehlt der Klang? Erwartet ein Kind, dass das Instrument erklingt, und was tut die erwachsene Person dann?
5. Spricht die Stimme Violoncello, Cembalo, Kontrabass und Klarinette brauchbar? Will das Kind das Wort noch einmal hören?
6. Was machen die Familien mit dem gedruckten Blatt: aufhängen, „Orchester spielen“, zeigen? Klingt etwas wie eine Prüfung
   („Weißt du, wer ein Dirigent ist?“)?

## Offen
- Altersspanne: 5 bis 9 Jahre (Katalog) gegen 5 bis 7 Jahre (Quelle, Gruppe „ФАНТАЗЕРЫ“, S. 199 bis 200). Allein oder mit einer
  erwachsenen Person? Braucht ein Kind von 5 bis 7 Jahren ein Gate oder eine Sitzungsgrenze? Entscheidung Max.
- Engine: eigene Karten-App statt `quiz-kern` (nach dem Bauauftrag); ein Quiz zu denselben Wörtern wäre ein zweiter Schritt.
- Zeichnungen: behalten oder ersetzen, Stil, Hauttöne der Figuren, Lizenz; ob ein Klangbeispiel zu jedem Instrument kommen soll.
- Wörter: das deutsche Wort für „исполнитель“ (Interpret), die Zuordnung der 15 übrigen Fachwörter zu den Themen, eigene
  Instrumente („7+“) und Volksinstrumente der Herkunftsländer.
- Das Wort „Orchesterinstrument“ im Katalog gegen die Daten: Cembalo, Orgel und Klavier sind Tasteninstrumente; ob sie als
  Orchesterinstrumente gelten, entscheidet eine Fachperson der Musikpädagogik.
- Fachliche Durchsicht (Musikpädagogik): Erklärungen, Zeichnungen, Aussprache durch die Stimme; Abstimmung der Wörter Tempo,
  Dynamik, Rhythmus und Oper mit `rhythmus-orchester`, `klang-detektive` und `mini-oper-baukasten`.
- ru: das Wort der Quelle zeigen, sobald es geprüft ist (Schalter, Vorlesen nur mit einer Stimme für die Sprache). uk: Wörter
  und Prüfung. uk und ru: nicht vorhanden, offen.
- Kein Erwachsenen-Gate, keine Anzeige-Einstellungen (Kontrast, Schriftgröße).
- Hilfe-Insel: nicht vorgesehen; Eintrag unter den bewussten Auslassungen von `hilfe-insel-abdeckung.test.mjs` durch den Koordinator.
- Der Test mit Kindern der Zielgruppe (Checkliste vor dem Release) und die Prüfung auf dem Gerät stehen aus.
- Neuladen ohne Netz ist nicht zugesichert (F4).
- Die Quelle liegt nicht im Repo; die Prüfung der Seiten lief außerhalb (F3) und ist nicht von einem Menschen gemacht (A18).
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

**Vorlesen:** gebaut (Kinder-App), siehe Tor 7.
