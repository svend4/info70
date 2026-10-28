# Musik-Wörter-Bilderlexikon

Kinder blättern allein oder zusammen mit einer erwachsenen Person durch 23 Wörter aus der Musik: 16 Fachwörter
(Solist, Dirigent, Melodie, Rhythmus, Tempo, Oper und andere) und sieben Instrumente (Harfe, Kontrabass,
Violoncello, Cembalo, Orgel, Klavier, Klarinette). Zu jedem Wort gehören ein Bild, eine kurze Erklärung in
einfacher Sprache und der Knopf „Vorlesen“. Erwachsene wählen Wörter aus und drucken je Wort ein Blatt A4 hoch.

Katalog: docs/10, Z. 457 (Eintrag „Musik-Woerter-Bilderlexikon“, Zielgruppe 5 bis 9, Typ S). Bauauftrag:
`docs/bauauftraege/CON-10-musik-woerter-bilderlexikon.md`. Titel beibehalten. Ohne Speicherung, ohne Wertung,
ohne Verbindung nach draußen. Ein Neuladen ohne Netz ist nicht zugesichert: die App hat keinen Service Worker (F4).

**Status: erster Stand.** Geprüft sind die Tests mit `node --test` (siehe „Tests“), die Browser-Messung bei 360 px
(`node tools/browser-tor.mjs musik-woerter-bilderlexikon`, Exit 0, keine Verletzung) und die Druckansicht im Browser
(1, 3 und 23 gewählte Wörter ergeben genau 1, 3 und 23 Seiten A4 hoch). Eine Prüfung auf dem Gerät mit echter
Sprachausgabe, die fachliche Durchsicht der Erklärungen und der Zeichnungen und der Test mit Kindern stehen aus.
Die Klickkette des Messwerkzeugs erreicht 30 Ansichten (Start, drei Listen, 23 Karten, Instrumente, Karten drucken, Für
Erwachsene), aber nicht die Knöpfe „Für den Druck wählen“ und „Karten drucken“ auf den Karten; „Gewählte Karten drucken“
und „Auswahl leeren“ sind dort ohne Auswahl aus und werden übersprungen, es druckt also nichts mit gewählten Karten. Was
diese Knöpfe tun, hält `test/regeln.test.mjs` am Quelltext fest (Test „Druckbereich …“, mit Mutationsprobe). Im Browser
sind sie, das Vorlesen mit nachgebauter Sprachausgabe und die Tastatur mit einem eigenen Lauf außerhalb des Repos geprüft,
dessen Skript nicht im Repo liegt (32 Ansichten bei 360 und 320 px: kein Überlauf, alle Berührziele mindestens 48 px, der
Vermerk zum Eigenentwurf in jedem Fuß).
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## Was die App tut

- **Start:** drei Themen als Knöpfe mit Bild (Musik 11 Wörter, Orchester 5, Instrumente 7) und „Vorlesen“; in einem
  Kasten für Erwachsene „Karten drucken“, „Für Erwachsene“ und „Alle sieben Instrumente zusammen ansehen“.
- **Liste:** die Wörter des Themas als Knöpfe mit kleinem Bild, in der Reihenfolge der Quelle. Beim Thema Instrumente
  außerdem der Knopf zur Instrumentenansicht.
- **Karte:** das Wort als Überschrift, ein großes Bild, die Erklärung, „Vorlesen“, „Nächstes Wort“ und „Vorheriges
  Wort“ (am Ende der Liste geht es von vorn weiter) und „Zurück zur Liste“. Darunter ein Kasten „Für Erwachsene“ mit
  „Für den Druck wählen“ und „Karten drucken“.
- **Instrumentenansicht:** alle sieben Instrumente untereinander, je mit Bild, Erklärung und „Vorlesen“, dazu „Alle
  vorlesen“. Die erwachsene Person zeigt die Instrumente und liest die Erklärung vor oder lässt sie vorlesen.
- **Karten drucken:** Wörter wählen (je Thema „Alle … wählen“ und jedes Wort einzeln), Zähler des Gewählten, Vorschau,
  „Drucken“ und „Auswahl leeren“. Jedes gewählte Wort ist ein Blatt A4 hoch.
- **Für Erwachsene:** worum es geht, woher die Wörter kommen (mit Seiten und der Marke; die Zahl 16 trägt den Vermerk
  „Zählung: Eigenentwurf“), für welches Alter, Vorlesen, Drucken, Sprachen und Daten.
- **Fuß jeder Ansicht:** die Zeile „Werbefrei, ohne Anmeldung …“, die Quelle mit Seite und der Marke, der Vermerk „Wort,
  Erklärung und Bild: Eigenentwurf, fachlich nicht geprüft.“ und der Link zum Impressum. Der Vermerk steht also auch auf
  Start, Liste und Instrumentenansicht, wo Wörter, Bilder und Erklärungen stehen, die nicht aus der Quelle sind.
- Es gibt keine Fragen, keine Punkte und keine Auswertung. Jede Auswahl ist ein Knopf aus einer Liste, kein Freitext.

## Was belegt ist

- Abschnitt „Развиваемся в деятельности“ (S. 259), Gruppe „ФАНТАЗЕРЫ“ (S. 260). Die Seite 260 nennt als Aufgabe das
  Beherrschen von „музыкальными терминами“ (S. 260) und zählt sie auf; die Aufzählung endet mit „и др.“ (S. 260), sie ist
  also nicht abschließend. Sieben Instrumente stehen namentlich auf der Seite, dazu „и других инструментах“ (S. 260)
  ohne Namen. Wer die Seite liest, zählt 16 Fachwörter, wenn Vokal- und Instrumentalmusik sowie Blas- und Streichorchester
  je einzeln gezählt werden (Zählung: Eigenentwurf, wie im Bauauftrag).
- Alle 23 Wörter der Daten tragen `quelle.seite` „S. 260“ und das Wort, wie es auf der Seite steht (`quelle.text`, je
  höchstens sechs Wörter, keine ganzen Sätze aus dem Buch). Die sieben Instrumente stehen in der Quelle im Präpositiv
  („арфе“); das Feld `ru` hat die Grundform.
- In dieser Aufgabe gegen die Textkopie der Quelle geprüft (Textkopie aus `tools/quelle-holen.sh`, außerhalb des Repos,
  F3): jedes `quelle.text` steht auf S. 260, die 16 Fachwörter stehen in der Reihenfolge der Liste, die sieben Instrumente
  in der Reihenfolge der Quelle; Abschnitt (S. 259) und Gruppe (S. 260) stehen auf diesen Seiten; die Altersangaben
  „шестой—седьмой годы жизни“ (S. 199) und „пяти-шести лет“ (S. 200) stehen auf diesen Seiten. Das Skript für die Prüfung
  liegt nicht im Repo; die Tests prüfen, dass die Daten den geprüften Wortlauten entsprechen. Die Seiten sind von keinem
  Menschen geprüft (A18).

| Kennung | Wort in den Daten | Wortlaut der Quelle (S. 260) |
| --- | --- | --- |
| `vokalmusik` | Vokalmusik | „вокальная“ |
| `instrumentalmusik` | Instrumentalmusik | „инструментальная музыка“ |
| `solist` | Solist | „солист“ |
| `begleitung` | Begleitung | „аккомпанемент“ |
| `dirigent` | Dirigent | „дирижер“ |
| `komponist` | Komponist | „композитор“ |
| `interpret` | Interpret | „исполнитель“ |
| `melodie` | Melodie | „мелодия“ |
| `rhythmus` | Rhythmus | „ритм“ |
| `tempo` | Tempo | „темп“ |
| `dynamik` | Dynamik | „динамика“ |
| `ballett` | Ballett | „балет“ |
| `oper` | Oper | „опера“ |
| `konzert` | Konzert | „концерт“ |
| `blasorchester` | Blasorchester | „духовой“ |
| `streichorchester` | Streichorchester | „струнный оркестры“ |
| `harfe` | Harfe | „арфе“ |
| `kontrabass` | Kontrabass | „контрабасе“ |
| `violoncello` | Violoncello | „виолончели“ |
| `cembalo` | Cembalo | „клавесине“ |
| `orgel` | Orgel | „органе“ |
| `klavier` | Klavier | „фортепиано“ |
| `klarinette` | Klarinette | „кларнете“ |

## Was Eigenentwurf ist

- Alle deutschen Wörter und alle Erklärungen (ein bis zwei kurze Sätze, einfache Sprache) mit dem Vermerk „Wort,
  Erklärung und Bild: Eigenentwurf, fachlich nicht geprüft.“ im Fuß jeder Ansicht und auf dem Blatt. Die Katalogzeile
  nennt eine Nähe zur Leichten Sprache; die App ist kein Text in Leichter Sprache und trägt kein Siegel (Eigenentwurf,
  fachlich nicht geprüft).
- Die Zählung 16 Fachwörter (Vokal- und Instrumentalmusik sowie Blas- und Streichorchester je einzeln): In der Ansicht
  „Für Erwachsene“ steht sie mit dem Vermerk „(Zählung: Eigenentwurf)“, nicht als Aussage der Quelle.
- Die 23 Zeichnungen (SVG, selbst gezeichnet, ohne Vorlage und ohne fremde Medien).
- Die Zuordnung der Wörter zu den Themen: Der Bauauftrag legt nur `solist` auf `musik` fest. Gebaut ist der Vorschlag
  des GDD-Entwurfs: Musik (11) Vokalmusik, Instrumentalmusik, Solist, Komponist, Interpret, Melodie, Rhythmus, Tempo,
  Dynamik, Ballett, Oper; Orchester (5) Begleitung, Dirigent, Konzert, Blasorchester, Streichorchester; Instrumente (7).
- Die Reihenfolge der Ansichten, der Aufbau von Karte und Blatt, alle Texte der Oberfläche.
- Das deutsche Wort „Interpret“ für „исполнитель“ (das Wort ist offen), die Grundformen der Instrumente in `ru`.

## Abweichungen vom Bauauftrag

1. **Zeichnungen statt Platzhalter:** Abschnitt 3 und 9 sehen bis zur Zeichnung einen Platzhalter mit dem Begriff vor.
   Gebaut sind 23 einfache Zeichnungen (erste Fassung). Sie lassen sich durch Dateien mit demselben Namen ersetzen.
2. **Sechste Ansicht „Für Erwachsene“:** Abschnitt 3 nennt fünf Bildschirme. Die sechste trägt die Quelle mit Seiten und
   Marke, die Altersangabe und die Hinweise, die nicht auf eine Kinderkarte gehören. Eine `eltern.html` gibt es nicht.
3. **Vorlesen ist gebaut:** Abschnitt 3 und 9 führen F2 als offen; die Entscheidung 28а (Kinder-Apps lesen vor) gilt.
4. **Druckvorschau mit Auswahl:** Mehrere Wörter wählen, Vorschau, drucken; die Zahl der Blätter ist die Zahl der
   gewählten Wörter (Abnahme, Abschnitt 8).
5. **Kein Zufall:** Der Bauauftrag verlangt Zufall nur als Parameter; die App braucht keinen. Die Reihenfolge ist die der Datei.
6. **Signaturen:** `ladeBegriffe(daten)` und `pruefeBegriffe(daten)` bekommen den Inhalt von `daten/begriffe.json`
   (die App lädt ihn per JSON-Import) und lesen keine Datei. `begriffKarte` liefert genau `{ wort, erklaerung, bild,
   sprache }`. `druckBlaetter(karten)` bekommt solche Karten, dazu optional `bildText` und `thema`; ein Blatt hat
   `wort`, `erklaerung`, `bild`, `bildText` und `thema`, sonst nichts. Dazu kommen die Hilfen der Oberfläche (Auswahl,
   Nachbarwort, Vorlesetexte) in `logik.mjs`.
7. **`ru` ist gefüllt, aber nicht zu sehen:** Das Schema in Abschnitt 4 hat ein Beispiel mit `ru`. Die Daten tragen das
   russische Wort der Quelle; die Oberfläche zeigt es nicht, solange eine Person, die Russisch spricht, es nicht geprüft
   hat (Abschnitt 6 und 9: nicht vorhanden, offen). `uk` ist überall `null`. uk und ru: nicht vorhanden, offen.
8. **Engine:** Katalog und GDD-Entwurf nennen `quiz-kern` als Weg A. Der Bauauftrag nimmt ihn nicht an (Abschnitt 3 und 7);
   gebaut ist eine eigene Karten-App auf `kinder-ui` (Weg B des GDD-Entwurfs). Gründe: Der Motor zeigt keine Bilder, hat
   keine Liste mit Begriffskarte, keine Instrumentenansicht und keinen Druck; ein Lexikon hat keine Fragen.
   `tools/quiz-durchlauf.mjs` gilt für diese App nicht.

## Was nicht übernommen wurde

- Die anderen Instrumente des Symphonieorchesters und die Volksinstrumente, die die Seite ohne Namen nennt; der
  Bauauftrag nimmt sie nicht auf. Eigene Instrumente („7+“ im Katalog) sind nicht gebaut.
- Klangbeispiele: Die App hat keinen Ton außer dem Vorlesen. Es gibt keine fremden Aufnahmen und keine Medien von außen.
- Eine Frage, ein Quiz, ein Zähler für richtig oder falsch: Das Lexikon fragt nichts ab.
- Eine Verbindung zu Bildungsplänen und eine Aussage über Barrierefreiheit nach einer Norm: nicht belegt.
- Eine uk-Fassung und eine Anzeige der ru-Wörter (siehe Abweichung 7).

## Was nicht gebaut wurde

- Keine Eingabefelder, keine Namen, kein Feld für ein Kind, keine Notizen über Kinder, keine Einstufung. Keine
  Bewertung, Punkte, Rangliste (docs/02 Z. 141–146).
- Keine Speicherung: kein Browser-Speicher, kein Konto, kein Download, keine Karte „Meine Daten löschen“ (Projektregel:
  wer nichts speichert, hat keinen Löschknopf). Die Auswahl für den Druck lebt nur im Arbeitsspeicher der Seite.
- Keine Verbindung nach draußen (docs/02 Z. 22–24). Kein Service Worker.
- Keine `eltern.html`, keine Hilfe-Insel (Fachlernen Musik; der Koordinator trägt die App unter den bewussten Auslassungen
  von `hilfe-insel-abdeckung.test.mjs` ein), keine Anzeige-Einstellungen (Kontrast, Schriftgröße) wie in anderen Apps.
- Kein Erwachsenen-Gate und keine Sitzungsgrenze: Der Bauauftrag nennt keine.

## Technik

- `index.html`: Grundgerüst, Content-Security-Policy `default-src 'self'`, Stylesheets aus `packages/kinder-ui` und
  `druck.css`, das gemeinsame Favicon auf der Zeile des Stylesheets. Der Hauptbereich `#app` ist ein Bildschirmteil; der
  Druckbereich `#druckbereich` liegt außerhalb davon.
- `app.mjs`: sechs Ansichten (Start, Liste, Karte, Instrumente, Druck, Erwachsene), Vorlesen, Auswahl, Vorschau, der
  Druckknopf (`window.print()`), der Netzwerk-Wächter aus `packages/kinderschutz`. Jeder Knopf entsteht in `knopf()` und
  trägt eine `data-kennung`, je Ansicht eindeutig. Nach einem Wechsel der Ansicht bekommt die Überschrift
  (`tabindex="-1"`) den Fokus; bleibt der Knopf (Auswahl, „Vorheriges“ und „Nächstes Wort“), bekommt er ihn zurück. Alle
  Bilder kommen aus einer Funktion, `bild()`, der Fuß aus einer Funktion, `fuss()`; er schließt jede Ansicht ab (Quelle mit
  Marke, Vermerk zum Eigenentwurf, Impressum). Die Vorschau der Blätter auf der Seite „Karten drucken“ ist für Hilfstechnik
  verborgen (`aria-hidden`), damit nicht bei jeder Auswahl alle Blätter vorgelesen werden. Die kyrillischen Titel der Quelle
  in der Ansicht „Für Erwachsene“ tragen `lang="ru"` (`sprachStuecke()` in `logik.mjs`). Kein Zufall, keine Uhr.
- `logik.mjs`: Laden und Prüfen der Wörter, Kategorien, Karte, Nachbarwort, Auswahl, Blätter, Vorlesetexte. Ohne DOM,
  ohne Zufall, ohne Uhr, ohne Import. Ein Bild ist nur ein SVG unter `bilder/`; alles andere bricht das Laden ab.
- `daten/begriffe.json`: 23 Wörter mit Kennung, Wort (`de`, `ru`, `uk`), Kategorie, Bild, Bildtext, Erklärung, Quelle und
  `eigenentwurf`, dazu alle Texte der Oberfläche. Die Daten kommen per JSON-Import mit Typangabe, nicht per `fetch`.
- `bilder/`: 23 SVG-Zeichnungen, eine je Wort. Ohne Skript, ohne Text, ohne Verweis nach außen.
- `druck.css`: Bildschirm und `@media print`, A4 hoch, Bildschirmteile ausgeblendet, ein Blatt je Wort. Auf dem Bildschirm
  bricht die Überschrift bei 360 px auch innerhalb eines Wortes um.

## Vorlesen

Die App ist eine Kinder-App (Kinder als Nutzer, Entscheidung Max 34а). Start, Liste, Karte und Instrumentenansicht haben
einen Knopf „Vorlesen“ über `vorlesen()` aus `kinder-ui`, nur mit einer deutschen Stimme, die auf dem Gerät liegt
(`lokaleStimme('de')`, kein Netz). Gibt es keine, steht ein Hinweis statt des Knopfs. Vorgelesen wird das Wort mit der
Erklärung, auf der Liste die Namen der Wörter; Hinweise für Erwachsene und Vermerke werden nicht vorgelesen. Beim
Wechsel der Ansicht wird das Vorlesen abgebrochen. Wie die Stimmen Wörter wie Violoncello und Cembalo sprechen, ist auf
Geräten nicht geprüft. Die Druckvorschau ist für Erwachsene und hat kein Vorlesen.

## Zeichnungen

Die 23 Zeichnungen sind eine erste Fassung (Eigenentwurf): flache Farben mit dunkler Kontur, ohne Text, auf einer Fläche
von 200 mal 200. Die Figuren haben verschiedene Hauttöne und Haare, keine reale Person und kein bekanntes Gesicht. Jede
Zeichnung hat einen Bildtext (`bildText`, auch als Titel in der SVG-Datei); auf Knöpfen ist das Bild Schmuck (leeres
`alt`), denn das Wort steht als Text daneben. Die Zeichnungen sind fachlich nicht geprüft: ob ein Instrument erkennbar
und richtig gezeichnet ist, entscheidet eine Fachperson der Musikpädagogik. Wer sie ersetzen will, legt Dateien mit
demselben Namen in `bilder/` ab; die Tests prüfen Dateinamen, Größe und dass nichts nach außen verweist.

## Drucken

Der Knopf „Gewählte Karten drucken“ druckt nur die gewählten Wörter, je Wort ein Blatt A4 hoch: Kopfzeile mit dem Namen
der App und dem Thema, das Wort, das Bild, die Erklärung und der Vermerk zum Eigenentwurf. Ohne gewähltes Wort ist der
Knopf aus. Im Druckdialog Kopf- und Fußzeilen ausschalten; sonst können Datum oder Adresse der Seite auf dem Papier
stehen. Die App setzt selbst kein Datum und keine Adresse. Auf dem Blatt stehen keine Zeichen (keine Kästchen, Haken,
Sternchen-Zeichen, Punkte, Pfeile), keine Emojis, keine Namenszeile, keine Tagesfelder und keine Seitenzahl der Quelle
(docs/02 Z. 79–82; A18-Standard für neue Apps). Weil das Blatt keine Seitenangabe trägt, trägt es auch nicht die Marke.
Die Seiten stehen in den Daten und in der App dort, wo die Quelle genannt wird (Fuß auf jedem Bildschirm, Ansicht „Für
Erwachsene“), jeweils mit der Marke.

## Wortliste der Wertung

`node tools/leistungs-woerter.mjs musik-woerter-bilderlexikon`: keine Treffer. `node tools/bewertung-stand.mjs`:
„Stand stimmt.“ Die App steht in keiner Liste der Ausnahmen. Das Wort „Noten“ gehört zur Musik und ist keine Schulnote;
der Regeltest der Vorlage ist darauf zugeschnitten (Schulnote, Zeugnisnote, „Note 1“ bis „Note 6“ bleiben verboten).

## Offen

Siehe `GDD.md`, Abschnitt „## Offen“. Dazu:

- Altersspanne: Katalog und Bauauftrag nennen 5 bis 9 Jahre, die Quelle gehört zur Gruppe „ФАНТАЗЕРЫ“ (S. 199 bis 200,
  gelesen als 5 bis 7 Jahre). Für 8 bis 9 Jahre gibt es keinen Beleg. Entscheidung Max.
- Zeichnungen: behalten, neu zeichnen lassen oder durch Platzhalter ersetzen; Stil, Hauttöne, Lizenz.
- Fachliche Durchsicht der Erklärungen und der Zeichnungen (Musikpädagogik); Test mit Kindern.
- Das Wort für „исполнитель“ (Interpret) und die Zuordnung zu den Themen (Konzert bei Orchester, Oper und Ballett bei
  Musik); Abstimmung von Tempo, Dynamik, Rhythmus und Oper mit `rhythmus-orchester`, `klang-detektive` und
  `mini-oper-baukasten`.
- ru: das russische Wort der Quelle zeigen (und wie), sobald eine Person, die Russisch spricht, es geprüft hat. uk: Wörter
  und Prüfung. uk und ru: nicht vorhanden, offen.
- Vorlesen auf Geräten prüfen (Aussprache von Violoncello, Cembalo, Kontrabass, Klarinette).
- Hilfe-Insel: nicht vorgesehen; Eintrag unter den bewussten Auslassungen von `hilfe-insel-abdeckung.test.mjs` durch den Koordinator.
- Seitenangaben: A18. Die Marke steht dort, wo die Seiten stehen; die Blätter tragen keine Seitenzahl.
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## Tests

Die Tests stehen in zwei Dateien: `test/logik.test.mjs` prüft die Daten gegen die geprüften Wortlaute und Seiten, das Laden
und seine Abweisungen, die Zählung (16 Fachwörter, sieben Instrumente), die Kategorien, die Karte in allen Sprachen, die
Erklärungen (Länge, einfache Sprache, keine Wertung), die Bilder (Dateien, Größe, nichts nach außen), die Auswahl, das
Nachbarwort, die Blätter und die Vorlesetexte. `test/regeln.test.mjs` prüft die Projektregeln: keine Eingabefelder, keine
Speicherung, keine externen Adressen, kein Zufall, Favicon-Zeile, kein Service Worker, kein `quiz-kern`, keine
Druckzeichen, keine Namenszeile, keine Seitenzahl auf dem Blatt, Marke bei der Quelle, Eigenentwurf-Kennzeichnung (auf dem
Blatt und im Fuß jeder Ansicht), den Druckbereich (die Vorschau trägt `aria-hidden`; was „Für den Druck wählen“, der Knopf
eines Wortes, „Alle wählen“ und „Auswahl leeren“ tun), externe Fakten, Fokus nach Klick und nach einem Wechsel der Ansicht,
Vorlesen, die Wortliste der Wertung, Knopfhöhe, Bilder aus dem App-Ordner, Verweise auf die Zeilen der Projektregeln,
Testzahl. Sie prüfen den Quelltext; ob ein Test eine Änderung bemerkt, wurde mit einer Mutationsprobe in einer Kopie außerhalb
des Repos geprüft (21 Änderungen an Vorschau, Auswahl- und Druck-Knöpfen, Fuß und Zählungssatz: alle fanden die Tests; auf
dem Stand davor fand kein Test eine der anwendbaren Änderungen).
Gegenüber der Vorlage `puppentheater-werkstatt` sind diese Regeltests angepasst: Zufall (die ganze App hat keinen, nicht nur
`logik.mjs`), uk und ru (die Daten tragen die Schlüssel, die Oberfläche zeigt sie nicht), Wörter der Bewertung („Noten“ ist
Musik), Pflichtmarkierung (sie steht bei der Quelle, nicht auf dem Blatt), externe Fakten (`druck.css` ist ausgenommen, es
enthält nur Maße, keine Aussagen) und Fokus (alle Knöpfe entstehen in `knopf()`).
Insgesamt sind es 67 Tests.

```bash
node --test apps/musik-woerter-bilderlexikon/test/*.test.mjs
```
