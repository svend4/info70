# Tierkinder – Vorlesen

Werkzeug für Erwachsene: Vorlesetexte für Kinder von 3 bis 5 Jahren. Die Erwachsene
wählt Tierart, Ort und Jungtier-Thema. Die App setzt daraus einen Vorlesetext aus festen
eigenen Bausteinen zusammen. „Vorlesetext drucken“ druckt diesen einen Text auf ein
Blatt A4 hoch, ohne Zeichen und ohne Namenszeile.

**Status: erster Stand.** Die Bausteine sind Eigenentwurf. Der Sachbezug ist auf die
Seiten 113 bis 114 der Quelle bezogen und maschinell geprüft.
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## Titel

Der Katalog nennt die Einheit „Tierkinder und ihre Familien (Geschichten-Pack)“ (docs/10,
Content-Pakete). Die App heißt „Tierkinder – Vorlesen“, weil sie keine Geschichten
erzeugt und keine übernimmt. Sie setzt feste Bausteine zusammen, die Erwachsene
vorlesen. Eine Erzeugerfunktion im Sinne des Katalogs gibt es nicht.

Der Katalog spricht außerdem von Gute-Nacht-Geschichten. Die Quelle sagt das nicht.
Der Schluss des Vorlesetextes ist Eigenentwurf ohne Quelle.

## Katalog und Altersgruppe

- Katalogeintrag docs/10, Abschnitt Content-Pakete zu bestehenden Apps, Einheit Content-Pack 5.
  „Einheit Content-Pack 5“ ist die Projektkennung dieser App im Katalog. Die Angabe steht im
  Katalog, nicht in der Quelle, und wird auf dem Blatt nicht gedruckt.
- Altersgruppe 3 bis 5 Jahre, Vorlesen durch Erwachsene (Katalogangabe).
- Die App ist ein Werkzeug für Erwachsene. Kein Bildschirm für Kinder (Projektregel ohne eigene Fundstelle).
- Offline nach dem Laden.

## Was aus der Quelle belegt ist

Praleska, S. 113 bis 114, Abschnitte über Ernährung und über das Wachsen der Tiere (im Quelltext mit Sternchen markiert):

- Tierarten: Fuchs, Wolf, Vogel und Kuh (S. 113 und 114), Bär (S. 114), Huhn über den Stall (S. 114).
- Orte: Bau für Fuchs und Wolf (S. 114, „нора“; die Quelle nennt dazu keine Lage, der Satz
  zum Bau ist Eigenentwurf), Höhle für den Bären (S. 114, „берлога“),
  Nest für Vögel (S. 114, „гнезда“), Stall für Haustiere (S. 114, „коровник, курятник“).
- Jungtier-Themen (S. 114): Eltern wärmen und schützen die Jungen; Jungtiere kommen im
  Frühling und im Sommer, damit sie bis zum Winter groß werden; die kleinen Tiere werden
  groß und bekommen selbst Nachwuchs.
- Die Quelle ordnet auf S. 7 ihre Inhalte überwiegend als Aufgaben für Erziehende ein.
  Auf S. 113 bis 114 stehen Aufgaben, keine Geschichten.
- Die Abschnitte auf S. 113 bis 114 sind in der Quelle für ältere Kinder der Gruppe markiert
  (Fußnote 1 auf S. 113: die Sternchen * kennzeichnen Aufgaben für ältere Kinder der Gruppe).
  Das steht auch im Hinweis auf dem Druckblatt.

Die Quelle nennt auf S. 112 Tiere aus der näheren Umgebung (Übertragung, kein Zitat).
Das Wort „heimisch“ wird nicht verwendet.

Ausgabe der Quelle, wie auf der Titelseite der Textdatei: Minsk: НИО (Национальный
институт образования), 2007. ISBN 978-985-465-244-3. Die Titelseite nennt das Institut als
„НАЦИОНАЛЬНЫЙ ИНСТИТУТ ОБРАЗОВАНИЯ“ in Minsk. „Nationales Institut für Bildung (Minsk)“ ist
die deutsche Übertragung dieser Angabe; die Quellenzeile des Druckblatts nennt sie ebenso.

## Was Eigenentwurf ist

- Alle Sätze des Vorlesetextes sind neu geschrieben. Es gibt keine Übernahme, keine
  Nacherzählung und keine Übersetzung.
- Eigenentwurf sind: die Einleitungen, die Wörter „Kälber“ und „Küken“, die Sätze zu Ort
  und Jungtier-Thema, der Schluss und die Kuschel-Sachfrage.
- Jeder Absatz trägt auf dem Blatt seine Kennzeichnung: „Eigenentwurf. Sachbezug:
  Praleska, S. n.“ oder „Eigenentwurf, ohne Quelle.“ Die Kuschel-Sachfrage trägt „Kuschel-Sachfrage.“ davor.

## Was nicht übernommen wurde

- Geschichtentexte, Märchen- oder Gedichtfassungen: die Quelle hat keine.
- Winterschlaf: Der Quelltext sagt auf S. 113 nur, dass Tiere und Insekten, die im Winter
  kein Futter finden, unter dem Schnee schlafen. Das Wort Winterschlaf steht dort nicht.
  Die App nutzt die Stelle nicht.
- Hirsch, Wisent und Luchs (S. 113 als Verwandte der Haustiere): nicht aufgenommen, die
  Auswahl ist offen (siehe GDD.md, „## Offen“).
- Hase, Kaninchen und Maus: keine Ortsangabe für Tiere auf S. 113 bis 114. Nicht aufgenommen.
- Der Katalogtitel mit „Geschichten-Pack“ wird nicht im Katalog geändert. Das bleibt dem Katalog überlassen.

## Was nicht gebaut wurde

- Keine Eingabefelder, keine Namen von Kindern, keine Einstufung und keine Bewertung
  (docs/02 Z. 141–146).
- Keine Sprachausgabe, keine Bilder, keine Zeichnungen.
- Keine Speicherung: kein Browser-Speicher, kein Konto, kein Download (Projektregel ohne eigene Fundstelle).
- Keine Verbindung nach außen (docs/02 Z. 22–24).
- Keine ukrainische und keine russische Fassung. Im Quelltext steht: uk und ru: nicht vorhanden, offen.

## Technik

- `index.html`: Grundgerüst, Content-Security-Policy `default-src 'self'`, Stylesheets aus
  `packages/kinder-ui` und `druck.css`.
- `app.mjs`: Oberfläche und Druckknopf (`window.print()`), Netzwerk-Wächter aus `packages/kinderschutz`.
  Jeder Knopf trägt eine eindeutige `data-kennung`. Nach jedem Neuaufbau bekommt der Knopf
  mit derselben Kennung den Fokus zurück.
- `logik.mjs`: Zuordnung Tierart zu Ort, Auswahl, Vorlesetext, Pflichtmarkierung. Ohne DOM.
- `daten/bausteine.json`: alle Bausteine mit Seite, Quellenbegriff und Vermerk.
- `druck.css`: `@media print`, A4 hoch, nur der eine Vorlesetext. Auf dem Bildschirm
  bricht der Titel auch innerhalb eines Wortes um (bei 360 px Breite), der Fuß-Link ist mindestens 48 px hoch.

Die Bausteine kommen per JSON-Import mit Typangabe (`with { type: 'json' }`), nicht per `fetch`.
Dafür braucht der Browser Unterstützung für Import-Attribute. Welche Browserversionen das sind,
ist nicht geprüft.

## Drucken

Der Knopf „Vorlesetext drucken“ öffnet den Druckdialog des Browsers. Dort Kopf- und
Fußzeilen ausschalten, sonst können Datum, Uhrzeit oder die Adresse der Seite auf dem
Blatt erscheinen. Die App setzt selbst kein Datum und keine Adresse.

## Tests

33 Tests in zwei Dateien. `test/logik.test.mjs` prüft Daten, Seiten, Zuordnung, Text und
Pflichtmarkierung für alle 18 Kombinationen. `test/regeln.test.mjs` prüft die Projektregeln:
keine Eingabefelder, keine Speicherung, keine externen Adressen, keine Druckzeichen,
keine Namenszeile, keine unzulässigen Begriffe und keine Modellnamen, aria-live auf `#app`,
Fokus nach Klick, Pflichtmarkierung, Umbruch des Titels, Höhe des Fuß-Links, uk und ru,
die Docs-Verweise und die Testzahl.

```bash
node --test apps/tierkinder-vorlesen/test/*.test.mjs
```

Offene Punkte stehen in `GDD.md` unter „## Offen“.
