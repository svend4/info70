# Fühl- und Sortier-Werkstatt: Holz, Papier, Stoff

Druckkarten für eine Material-Werkstatt. Werkzeug für Fachkräfte und Eltern: Die Fachkraft
leitet an, das Kind braucht dafür keinen Bildschirm. Die Erwachsene filtert nach Material
oder Sortierauftrag, wählt Karten und druckt sie: je gewählter Karte ein Blatt A4 hoch.

Katalog: docs/10, Abschnitt „Печатные материалы для Kita (офлайн)“, Nr. 7. Zielgruppe:
Fachkräfte und Eltern; die Fachkraft leitet an. Altersangabe 2 bis 3 Jahre aus dem Katalog; die
Quelle nennt für Малыши 1 bis 3 (S. 6, siehe A20). Ohne Speicherung. Ohne Verbindung nach draußen.
Ein Neuladen ohne Netz ist nicht zugesichert: die App hat keinen Service Worker (F4 in docs/fragen-und-hinweise.md).

**Status: erster Stand.** Geprüft sind die Tests mit `node --test`. Eine Prüfung im Browser,
im Druckdialog und auf dem Gerät steht noch aus.
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## Inhalt

- Drei Materialkarten: Holz, Papier, Stoff. Jede mit Lernziel (S. 52), Begriff aus der Quelle,
  zwei bis drei Gegenständen (Eigenentwurf), einer Frage (Eigenentwurf) und der Quellenzeile
  „Quelle: Praleska, S. 52“.
- Vier Sortieraufträge: nach Farbe (S. 52), nach Form (S. 53), nach Material (S. 52),
  nach weich / hart (Eigenentwurf; das Beispiel steht auf S. 52). Jeder mit Aufgabe und Frage (Eigenentwurf).
- Eine Sicherheitskarte (S. 53, Ziel ohne Sternchen) mit dem Hinweis „Kleinteile außer Reichweite
  lassen (Eigenentwurf, Fachkraft prüft).“

## Was belegt ist

Quelle: Praleska, Abschnitt „ЧЕЛОВЕК И РУКОТВОРНЫЙ МИР“ in der Gruppe „Малыши“ (S. 52 und 53).

- S. 52: „сделанных из различного материала (дерево, бумага, ткань)“ (Materialkarten, Sortierung
  nach Material). Die Materialwörter „дерево“, „бумага“, „ткань“ stehen dort ebenfalls.
- S. 52: „имеющих одинаковый и разный цвет“ (Sortierung nach Farbe).
- S. 52: „шубка — из меха, она мягкая“ (Beispiel für weich: Fell; die Sortierung nach weich / hart ist Eigenentwurf).
- S. 53: „по форме, цвету, величине, назначению“ (Sortierung nach Form).
- S. 53: „быть осторожными с острыми, холодными, горячими предметами“ (Sicherheitskarte).
- S. 6: „от одного года до трех лет“ (Altersbereich der Gruppe „Малыши“).
- Die Zitate sind um Trennstriche am Zeilenende bereinigt; die Seiten sind maschinell gegen den Quelltext geprüft (Prüfung außerhalb des Repos, F3).
- Die Sternchen-Ziele (Fußnote auf S. 53: Sternchen für ältere Kinder) stehen nicht in der App.
- Ausgabe: Minsk: НИО (Национальный институт образования), 2007. ISBN 978-985-465-244-3 (S. 2).

## Was Eigenentwurf ist

Die deutschen Titel, Begriffe, Übertragungen der Lernziele, Gegenstände, Aufgaben, Fragen und
der Sicherheitshinweis. Jede Übertragung trägt „(Eigenentwurf)“. Auch „hart“ als Gegenbegriff
und „glatt oder rau“ in der Frage zu Holz und Stoff sind Eigenentwurf. Der Sortierauftrag „nach weich / hart“ ist Eigenentwurf; die Quelle nennt auf S. 52 nur das Beispiel „шубка — из меха, она мягкая“. Russische Zitate haben
höchstens 12 Wörter. Die Quelle ist russischsprachig; uk und ru: nicht vorhanden, offen.

## Abweichungen vom Katalog

- **Alter.** Der Katalog nennt 2 bis 3 Jahre. Die Quelle nennt für die Gruppe „Малыши“ den
  Bereich „от одного года до трех лет“ (S. 6). Die App übernimmt 2 bis 3 aus dem Katalog und
  sagt auf dem Bildschirm, woher die Angabe stammt. Die Abweichung ist offen (siehe GDD; A20 in `docs/fragen-und-hinweise.md`).
- **warm / kalt** aus dem Katalogeintrag ist kein Sortierauftrag. Die Quelle nennt auf S. 52
  und 53 keine Sortierung nach Temperatur; „kalt“ und „heiß“ stehen nur im Sicherheitsziel (S. 53).
- **Wortliste de/uk/ru** aus dem Katalog ist nicht gebaut. uk und ru: nicht vorhanden, offen.
- **BNE-Bezug** (Materialien wiederverwenden) aus dem Katalog ist nicht gebaut.
- **Titel.** Der Katalog schreibt „Fuehl-“ in ASCII-Umschrift; die App schreibt „Fühl-“.

## Was nicht gebaut wurde

- Keine Eingabefelder, keine Namen, keine Notizen über Kinder, keine Wertung und keine Einstufung
  (docs/02 Z. 141–146).
- Keine Speicherung: kein Browser-Speicher, kein Konto, kein Download (Projektregel).
- Keine Verbindung nach draußen (docs/02 Z. 22–24).
- Keine Zeichnungen, Bilder oder Piktogramme.
- Keine Entwicklungsstufen, keine Norm und keine Zahl, die nicht in der Quelle steht.

## Technik

- `index.html`: Grundgerüst, Content-Security-Policy `default-src 'self'`, Stylesheets aus
  `packages/kinder-ui` und `druck.css`. Der Fuß-Link zum Impressum ist mindestens 48 px hoch.
- `app.mjs`: Oberfläche, Filter, Auswahl und Druckknopf (`window.print()`), Netzwerk-Wächter aus
  `packages/kinderschutz`. Jeder Knopf trägt eine eindeutige `data-kennung`; nach jedem Neuaufbau
  bekommt der Knopf mit derselben Kennung den Fokus zurück. Die App hat keinen Zufall: `Math.random`
  steht in ihren Dateien nicht. Das geteilte Modul `packages/kinder-ui/js/komponenten.mjs` hat eine
  Funktion `mischen()` mit `Math.random`; diese App ruft sie nicht auf.
- `packages/kinderschutz`: `pruefeSpeicherNutzung()` hat `localStorage` als Standardwert. Diese App ruft
  die Funktion nicht auf. Die Speicherprüfung in `test/regeln.test.mjs` liest nur die Dateien der App
  (ohne `test/`), nicht die Pakete; der Test wird nicht auf die Pakete ausgeweitet.
- `logik.mjs`: Filter, Auswahl, Kartenaufbau und Kartentext. Ohne DOM, ohne Zufall, ohne Uhr.
- `daten/werkstatt.json`: acht Karten, Materialien, Sortierungen, Quellen- und Altershinweis.
  Die Daten kommen per JSON-Import mit Typangabe, nicht per `fetch`.
- `druck.css`: `@media print`, A4 hoch, Bildschirmelemente ausgeblendet, je Karte ein Blatt.
  Auf dem Bildschirm bricht der Titel bei 360 px auch innerhalb eines Wortes um.

## Drucken

Der Knopf druckt nur die gewählten Karten. Ohne gewählte Karte ist der Knopf aus, und ein
Hinweis steht da. Im Druckdialog Kopf- und Fußzeilen ausschalten; sonst können Datum, Uhrzeit
oder die Adresse der Seite auf den Blättern erscheinen. Die App setzt selbst kein Datum und
keine Adresse.

## Offen

Siehe `GDD.md`, Abschnitt „## Offen“. Dazu:

- Seitenangaben: docs/02 Z. 151–152 verlangt die Markierung „проверено человеком“ für Seitenangaben. Das Blatt trägt
  „noch nicht von einem Menschen geprüft“. Entscheidung A18 in `docs/fragen-und-hinweise.md` (offen).
- Die Zitatprüfung gegen den Quelltext lief außerhalb des Repos (F3); im Repo stehen die festgehaltenen Zitate.
- Vorlesefunktion: docs/02 Z. 44 und 77 verlangen sie. Der Geltungsbereich für Fachkraft-Werkzeuge ist offen
  (F2 in `docs/fragen-und-hinweise.md`); gebaut ist sie nicht.
- Favicon: die Seite liefert 404, wie in allen Apps (A3).

## Tests

Die 43 Tests stehen in zwei Dateien. `test/logik.test.mjs` prüft die Daten, die Zitate gegen die
festgehaltene Zitat-Tabelle, die Sternchen-Ziele, Filter, Auswahl und Druck. `test/regeln.test.mjs`
prüft die Projektregeln: keine Eingabefelder, keine Speicherung, keine externen Adressen, keine
Druckzeichen, keine Namenszeile, Pflichtmarkierung je gedruckter Karte, Knopfhöhe 48 px, kein Zufall,
aria-live auf `#app`, Fokus nach Klick, keine Wertung von Kindern, die Begriffsprüfung (Modellnamen bewusst nicht geprüft, A1) und
die Testzahl in diesem Dokument.

```bash
node --test apps/fuehl-sortier-werkstatt/test/*.test.mjs
```
