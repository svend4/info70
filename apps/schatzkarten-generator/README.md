# Schatzkarten-Generator

Ein Werkzeug für **Erwachsene**. Sie erzeugen Orientierungskarten zum Drucken für Spiele draußen oder im Raum: eine Raster-Karte mit Zeichen, Wegkarten mit Richtung und Schritten, eine Zeichen-Legende und ein Lösungsblatt, das nur für Erwachsene gedacht ist.

## Was die App ist

- Ein Erstellungs- und Druckwerkzeug. Die Gittergröße ist 4×4 bis 8×8 Felder.
- Der Ort wird aus vier festen Optionen gewählt: Gruppenraum, Außengelände, Park, Wohnung. Er steht nur als Überschrift auf der Karte, nie als Adresse oder Name.
- Die Anzahl der Zeichen ist 0 bis 6. Die Zeichen stammen aus einer festen Liste (Textzeichen, keine Bilder).
- Start und Ziel setzt der Zufall. Der Weg dazwischen ist der kürzeste Weg über benachbarte Felder. Die Wegbeschreibung entsteht aus Richtung und Schritten.
- Ausgabe: Raster-Karte, Wegkarten (eine Karte für die Startposition und eine je Abschnitt), Zeichen-Legende und Lösungsblatt. Druck über den Browser oder als Textdatei zum Herunterladen.

## Was die App nicht ist

- **Keine App für Kinder.** Kinder spielen mit dem Ausdruck, nicht am Gerät.
- Kein Spiel auf dem Bildschirm. Keine Punkte, keine Bewertung, keine Rangfolge von Kindern.
- Kein Konto, keine Anmeldung, kein Teilen im Netz.
- Keine Vorgabe von Spielregeln aus der Quelle. Der Ablauf ist ein Eigenentwurf (siehe unten).
- Keine Namen von Kindern, keine Adressen, keine Bilder aus fremden Quellen.

## Was gespeichert wird

**Nichts.** Die Eingaben liegen nur im Speicher der Seite und sind weg, sobald die Seite geschlossen oder neu geladen wird. Die App nutzt weder `localStorage` noch Cookies. Sie sendet keine Anfragen an fremde Server; der Netzwerkwächter aus `packages/kinderschutz` blockiert solche Anfragen zur Laufzeit. Textdateien landen nur dort, wo der Browser Downloads ablegt.

## Quellen und Eigenentwurf

Quelle: Programm der vorschulischen Bildung «Пралеска» (Bildungsministerium der Republik Belarus, 2007).

Aus der Quelle übernommen sind nur die Spielnamen und die Seitenanker:

- **S. 246**, Abschnitt „Подвижные игры“, Aufgabenliste. Spielnamen «С картой в путь» (eigene Übersetzung: „Mit der Karte unterwegs“) und «Спрячь предмет и опиши путь к нему» (eigene Übersetzung: „Versteck den Gegenstand und beschreibe den Weg“). Die Quelle nennt nur die Namen. Ein drittes Spiel derselben Aufgabe wird in der App nicht verwendet und deshalb hier nicht genannt.
- **S. 6**: Altersgruppen. «Почемучки» ist das jüngere Vorschulalter von drei bis fünf Jahren, «Фантазеры» das ältere von fünf bis sechs oder sieben Jahren.
- **S. 233 und 234**, Gruppe «Фантазеры»: Orientierung auf einem Blatt anhand von neun Punkten (Ecken, Seiten, Mitte) und das Lesen eines Plans.
- **S. 138**, Gruppe «Почемучки»: einen Plan mit Zeichen (Symbolen) anfertigen.
- **S. 245**: Plan-Schema als Grundlage für Rätsel.
- **S. 247**: selbstständige Spiele im Freien bei verschiedenen Jahreszeiten.
- **S. 302**: Als Entwicklungsindikator steht dort das Kennen allgemein üblicher Zeichen, darunter Verkehrszeichen. Die App verwendet **keine** Verkehrszeichen als Spielmaterial.

**Eigenentwurf der App, nicht aus der Quelle:** die Raster-Karte mit Koordinaten (Spalten A bis H, Zeilen ab 1) und der Startmarke mit Pfeil nach vorn; die sechs festen Zeichen (Kreis, Dreieck, Raute, Quadrat, Herz, Sonne); die Wegkarten mit Drehungen „geradeaus“, „rechts“, „links“, „umdrehen“; das Lösungsblatt; die Textdateien; der Ablauf des Spiels, einschließlich des Vorschlags, den Gegenstand auf dem Ziel zu verstecken; die Mindestlänge des Weges (Abstand von Start und Ziel: Gittergröße minus 1); die Ortsoptionen als Überschrift.

**Vorschlag, nicht aus der Quelle:** die Zielgruppe der Wegkarten (Kinder von etwa fünf bis sieben Jahren). Die Gruppenangabe auf S. 6 ist die Grundlage; die Zuordnung zur App ist ein Vorschlag.

## Richtungen und Druck

- Die Startmarke zeigt nach vorn (oben auf dem Blatt). Links und rechts gelten **immer** von dem Kind aus, das auf dem Start steht und nach vorn schaut. Die Wegkarten nennen keine Richtung nach dem Bildschirmrand.
- Gedruckt werden Raster, Zeichen und Wegkarten, **ohne Lösung**. Das Lösungsblatt hat einen eigenen Druckbereich und wird nur über den Knopf „Lösungsblatt drucken“ gedruckt. Bei einem Druck über den Browser ohne Knopf bleibt es weg.
- Der Druck enthält keine Kästchen, keine Häkchen und keine Zeile für einen Namen.

## Lernziele (Vorschlag der App)

Die Kinder folgen einer Wegbeschreibung auf dem Gelände und finden den Gegenstand. Sie halten die Karte richtig herum, mit dem Pfeil nach vorn. Die Anknüpfung an die Quelle liegt bei den Seiten 233/234 (Orientierung auf dem Blatt, Plan lesen) und 138 (Plan mit Zeichen).

## Tests

Die Tests laufen ohne Abhängigkeiten. Es sind 23 Tests: 18 prüfen die Logik (Gitter, Start und Ziel, Weg, Wegbeschreibung, Ausgaben, Grundregeln), 5 prüfen den Aufbau (HTML, Druck-CSS, Quelltext ohne fremde Adressen und ohne Speicher, Quellenhinweis).

## Starten

```bash
npm run dev   # dann im Browser (Port 8070): /apps/schatzkarten-generator/
node --test apps/schatzkarten-generator/test/*.test.mjs
```

Offene Punkte und Entscheidungen stehen in `GDD.md`.
