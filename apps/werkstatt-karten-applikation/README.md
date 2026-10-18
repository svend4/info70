# Werkstatt-Karten: Schneiden, Reissen, Kleben

Werkzeug für Fachkräfte zur Applikation in der Gruppe „Почемучки“ (3 bis 5 Jahre, S. 6).
Drei Technikkarten (Schneiden, Reißen, Kleben), eine Ergänzungskarte und 25 Themenkarten
mit Titeln aus der Quelle. Die Fachkraft wählt Karten aus und druckt sie als Blätter A4
quer, je Karte ein Blatt. Der Bildschirm ist nur die Auswahl; gedruckt wird nur, was
gewählt ist.

Katalog: Katalogeintrag docs/10, Abschnitt Printmaterialien, Einheit №17 (Zeile 483).
Der Titel bleibt wie im Katalog („Reissen“ mit ss); die Technikkarte schreibt „Reißen“.

**Status: erster Stand.** Die Karten sind aus der Quelle belegt, soweit die Seiten angegeben sind.
Die Prüfung im Browser steht aus. Geprüft sind bisher die Daten und die Projektregeln mit `node --test`.
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## Altersgruppe

- Die Quelle nennt für die Gruppe „Почемучки“ 3 bis 5 Jahre (S. 6). Die Applikation steht
  in beiden Untergruppen (S. 9).
- Der Katalogeintrag nennt 4 bis 5 Jahre. Das ist nicht belegt; die App nennt 3 bis 5 Jahre.

## Was belegt ist

- Technikbereiche (S. 181): Schneiden mit geraden und kurvigen Linien, Reißen als
  Quellenbegriff „способом обрывания“, Kleben als Platzieren und Kleben auf Flanellgraph
  und Papier. Die drei Bereiche stehen ohne Reihenfolge.
- Schere: Lehrziel S. 181, Ergebnis der Gruppe S. 197, Sicherheitsbezug S. 126.
- 25 Themen (S. 181): nur die Titel, in Listenfolge. Die deutschen Titel sind Übertragungen.
- Ergänzung: Ziele für Collage und Flora für Gruppe 3 bis 5 auf S. 181. Naturmaterial-Collage
  und die Flora-Technik mit Nadel und Pinzette gehören zur Gruppe 5 bis 7 (S. 282 bis 283)
  und sind nicht als Technik der Gruppe 3 bis 5 aufgeführt.
- Ausgabe der Quelle: Minsk: НИО (Национальный институт образования), 2007. ISBN 978-985-465-244-3.

## Was Eigenentwurf ist

- Aufbau der Karten (Ziel, Material, Schrittfolge) und die Schrittfolgen selbst.
- Der Sicherheitssatz zur Schere; er ist eine Anregung aus S. 126.
- Die deutschen Titel der Themen.
- Die Themengruppen für den Filter. Sie stehen nicht auf den Karten.
- Die Einordnung der Ergänzungskarte.

## Was nicht übernommen wurde

- Der Katalogtext ordnet die Techniken abgestuft ein. Die Quelle nennt die drei Bereiche ohne Reihenfolge.
- Die Katalogübertragungen „Der dicke fette Pfannkuchen“ (Kolobok) und „Laternenumzug“ (Reigen).
  Sie sind keine Quellenäquivalente und werden nicht verwendet.
- Ein Scherentyp (Spitze oder rund) für Gruppe 3 bis 5: die Quelle nennt keinen, die Karten auch nicht.

## Technik

- `index.html`: Grundgerüst, Content-Security-Policy `default-src 'self'`, Stylesheets aus
  `packages/kinder-ui` und `druck.css`.
- `app.mjs`: Oberfläche mit Filtern für Technik und Themen, Auswahlknöpfen und dem Druckknopf
  (`window.print()`). Der Netzwerk-Wächter aus `packages/kinderschutz` läuft.
  Jeder Knopf trägt eine eindeutige `data-kennung`. Nach jedem Neuaufbau bekommt der Knopf
  mit derselben Kennung den Fokus zurück.
- `logik.mjs`: Auswahl, Filter, feste Reihenfolge und Textzeilen. Ohne DOM.
- `daten/karten.json`: alle 29 Karten mit Quelle, Seite und Kennzeichnung. Die Karten kommen
  per JSON-Import mit Typangabe, nicht per `fetch`.
- `druck.css`: `@media print`, A4 quer, Bildschirmelemente ausgeblendet, je Karte ein Blatt,
  Schrittfolgen nummeriert. Auf dem Bildschirm bricht der Titel auch innerhalb eines Wortes um
  (bei 360 px Breite), der Fuß-Link ist mindestens 44 px hoch.

Abweichung von der Vorlage `apps/bewegungslandschaft-stationen`: Die Vorlage lädt ihre Daten
per `fetch`. Diese App lädt sie per Import mit Typangabe, weil keine Anfragen nach außen
erlaubt sind (docs/02 Z. 22–24). Dafür braucht der Browser Unterstützung für Import-Attribute
(`with { type: 'json' }`). Welche Browserversionen das sind, ist nicht geprüft.

## Drucken

Der Knopf „Ausgewählte Karten drucken“ öffnet den Druckdialog des Browsers. Dort die Kopf-
und Fußzeilen ausschalten. Sonst können Datum, Uhrzeit oder die Adresse der Seite auf den
Blättern erscheinen. Die App setzt selbst kein Datum und keine Adresse.

Die Druckbögen haben keine Häkchen, Kästchen, Punkte, Sterne oder Emojis, keine Namenszeile
und kein Tages- oder Wochentagsfeld (docs/02 Z. 79–82). Die Auswahlknöpfe und Filter stehen
nur auf dem Bildschirm und werden nicht gedruckt.

## Keine Speicherung, keine Bewertung von Kindern

- Keine Eingabefelder für Kinder und keine Speicherung: kein Browser-Speicher, kein Cookie.
  Der Filter lebt nur in der geöffneten Seite.
- Keine Bewertung von Kindern (docs/02 Z. 141–146). Das Ergebnis auf S. 197 ist ein Gruppenziel,
  keine Prüfung einzelner Kinder.
- Kein Bildschirm für Kinder. Das Werkzeug ist für die Fachkraft.

## Tests

33 Tests in zwei Dateien: `test/logik.test.mjs` prüft Daten, Seiten, Zitate, Eigenentwurf,
Schere, Filter und Auswahl. `test/regeln.test.mjs` prüft die Projektregeln: keine Eingabefelder,
keine Speicherung, keine externen Adressen, keine Druckzeichen, keine Namenszeile, aria-live auf
`#app`, Fokus nach Klick, Pflichtmarkierung, Verweise auf die Anforderungen, Modellnamen-Freiheit,
Wortwahl und die Testzahl.

```bash
node --test apps/werkstatt-karten-applikation/test/*.test.mjs
```
