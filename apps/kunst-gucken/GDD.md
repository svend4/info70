# Kunst-Gucken — Game Design Document

**Nr. 60 der Eltern-Werkzeuge (docs/10). Quelle: Praleska S. 88–89.**

## 1. Was es ist

Ein Leitfaden für das gemeinsame Hinschauen mit Kindern von 1 bis 3 Jahren. Kein Spiel, kein
Quiz, keine Checkliste: fünf Achsen, an denen ein Erwachsener etwas sagen kann, und zu jeder drei
Sätze zum Anfangen. Der Gegenstand liegt auf dem Tisch, das Gerät liegt in der Hand des
Erwachsenen – deshalb keine `eltern.html`.

## 2. Nutzung in einem Satz

Was liegt auf dem Tisch? → das Blatt dazu lesen → eine Achse aufklappen → vorlesen oder drucken.

## 3. Die fünf Achsen

In der Reihenfolge, in der die Quelle die Mittel der künstlerischen Ausdruckskraft aufzählt und in
der ein kleines Kind hinschaut: **Farbe → Form → Teile → Material → Klang.** Der Validator erzwingt
diese Reihenfolge; ein Vertauschen macht die Daten ungültig.

Zu jeder Achse: `worauf` (was man überhaupt sehen kann), drei `impulse` (Feststellungen) und eine
`grenze` (wo die Achse aufhört).

## 4. Die fünf Gegenstandstypen

Bilderbuchseite · Holzfigur · etwas aus Ton · Stück Stoff · Kachel oder Teller.

Jeder trägt `woGefunden` (wo ohne Geld zu finden), `besonderes`, `grenze` (Sicherheit) und
2–4 `starkeAchsen` mit Begründung. Der Validator verlangt, dass **jede Achse bei mindestens einem
Gegenstand stark** ist – sonst stünde eine Achse ohne Gelegenheit da.

## 5. Die tragenden Entscheidungen

### 5.1 Es wird nichts abgefragt

„Welche Farbe ist das?“ ist eine Prüfung mit bekannter Antwort. `ABFRAGE` läuft über die 15
Impulse und weist schon das Fragezeichen ab; `PRUEFURTEIL` weist jedes Urteil über die Antwort des
Kindes ab, auch Lob („richtig“, „prima“) – wer gelobt wird, weil er richtig lag, hat beim nächsten
Mal etwas zu verlieren.

Das ist strenger als nötig: auch eine offene Frage wäre keine Prüfung. Sie wäre aber eine
Aufforderung, und ein Kind, das gerade schaut, muss nicht antworten.

Beide Netze laufen **nur über die Impulse**. `keinAbfragen` und die `grenze`-Felder müssen die
Prüffrage nennen dürfen, um sie auszuschließen – Falle A, achtzehntes Mal in diesem Projekt. Der
Validator verlangt sogar, dass `keinAbfragen` ein Beispiel zeigt.

### 5.2 Das Kind wird nicht gedeutet

Allgemeines Ziel Nr. 6 der Quelle – die Kunst nutzen, „um die innere Welt der Kinder zu erkennen
und ihre individuellen Besonderheiten herauszufinden“ – ist **ausdrücklich zurückgewiesen**. Eine
Zeichnung ist kein Befund. Ein solches Werkzeug wäre eine Einstufung von Kindern (docs/02,
EU-KI-Verordnung).

`DEUTUNG` wird in zwei Richtungen benutzt: verboten in jedem Angebotstext, **verpflichtend** im
Text des zurückgewiesenen Ziels. Eine Zurückweisung, die das Zurückgewiesene nicht benennt, ist
keine. `erkennen` steht nicht allein im Netz – „woran Sie erkennen, dass es gerade passt“ ist der
Kern dieser App; getroffen wird die Konstruktion, in der etwas über das Kind ausgesagt wird.

### 5.3 Die Quellbilanz ist gerechnet, nicht behauptet

13 Ziele (nachgezählt: 7 allgemeine, 6 zur Wahrnehmung), jedes mit genau einer von vier
Einordnungen: 5 `gebaut`, 2 `alsGanzes`, 1 `ausgeschlossen`, 5 `anderesThema`.

`pruefeDaten` rechnet in beide Richtungen: jedes gebaute Ziel braucht seine Stücke, jedes Stück
braucht sein Ziel, das es nennt – **und** die Abweichungsnotiz muss die gezählten Zahlen nennen.
In Welle 80 ist die Notiz zweimal von den Daten abgedriftet; dieser Test macht das unmöglich.

### 5.4 Eine eigene Korrektur am Quellenverständnis

Die Quelle nennt grammatisch **vier** Mittel: «цвет, форму основных частей, деталей, материал,
звук» – „деталей“ ist Genitiv und hängt an „форму“. Die Fünfteilung ist die Gliederung dieser App,
nicht der Wortlaut der Quelle, und das steht im Feld `fuenfteilung`. Eine erste Fassung dieser
Daten behauptete, die fünf Achsen stünden „wörtlich“ in der Quelle – das war falsch.

### 5.5 Kein Titel, kein Werk, keine Marke

Keine Buchliste (Entscheidung des Vorlese-Kompasses für den ganzen Korpus: Bucharten statt Titel),
keine Abbildung und kein Name der von der Quelle empfohlenen Werke (bei zwei genannten
Illustratoren ist die Schutzfrist nicht abgelaufen), keine Bezugsquelle. `WERK_ODER_URHEBER` und
`MARKE_ODER_QUELLE` greifen die Konstruktion, nicht das Wort: ein Eigenname lässt sich im Deutschen
lexikalisch nicht erkennen, weil jedes Substantiv groß geschrieben wird (Falle A, Nr. 56).

### 5.6 Kein Speicher

Kein Schlüssel, keine Liste, kein Haken. Ein Haken an einer Achse wäre der Anfang einer Kindakte –
und damit genau das zurückgewiesene Quellziel durch die Hintertür. Ein Test prüft, dass im Code
weder `localStorage` noch `datenKarte` vorkommt.

## 6. Druck

`druck.css` blendet alles Bildschirmzubehör aus und die zugeklappten Achsen **ein**: auf Papier
gibt es kein Aufklappen, also stehen alle fünf da. Impulse 13 pt (im Browser gemessen: 17,3 px),
weil sie laut gelesen werden. Keine Namenszeile, kein Haken, kein Stern (docs/02).

## 7. Barrierefreiheit

Alle Knöpfe ≥ 48 px (gemessen: kein Knopf unter 44 px), `aria-expanded` + `aria-controls` an jeder
Achse, `aria-pressed` an der Gegenstandswahl, Fokus bleibt nach jedem Klick auf dem gedrückten
Knopf, kein Querscrollen bei 360 px. Vorlesen nur mit lokaler Stimme; ohne sie steht an ihrer
Stelle ein Hinweis, und der `voiceschanged`-Listener zeichnet neu, sobald die Stimmliste da ist.

## 8. Grenzen

* Kein Wirkversprechen. Für Kinder unter drei Jahren ist zum Betrachten von Kunst nichts belegt,
  was eine solche Zusage tragen würde.
* Kein Museumsbesuch nötig, keine Anschaffung nötig.
* Kein eigenes Malen und Kneten: das ist ein anderer Unterabschnitt der Quelle und ein eigenes
  Vorhaben.
* Die Sicherheit eines einzelnen Gegenstands prüft diese App nicht – das tut der Spielzeug-Check U3.
