# Theater zuhause – Bastel- und Spielheft

Druckbares Heft für Erwachsene, die mit einem Kind von einem bis zu drei Jahren spielen.
Neun Seiten: Umschlag, drei Formen (Fingertheater, Tischtheater, Handpuppe/Kasper) mit
Bastelschritten, fünf kurze Spielszenen. Das Kind braucht dafür keinen Bildschirm; das Heft
ist kein Bildschirm für das Kind und hat kein Eingabefeld.

Katalog: docs/10, Abschnitt „Документы“ (Dokumente), Eintrag „Theater zuhause - Bastel- und Spielheft“
(Dokument Nr. 18). Titel nach dem Auftrag mit Gedankenstrich. Offline nach dem Laden, ohne
Speicherung, ohne Verbindung nach draußen.

**Status: erster Stand.** Geprüft sind die Tests mit `node --test`. Eine Prüfung im Browser
und auf dem Gerät steht noch aus.
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## Was belegt ist

- S. 73: Die Quelle nennt die drei Formen wörtlich: „пальчикового, настольного, театра Петрушки“.
  Sie stellt die Anregung an Eltern, „первых домашних видов театра“ zu schaffen und
  „обыгрыванию несложных произведений для детей“; den Eltern soll „помощь“ gegeben werden.
- S. 72: Bei den Freizeitspielen für die Kleinen nennt die Quelle „персонажи кукольного театра“
  für emotionalen Komfort und den Kontakt zu Erwachsenen und Gleichaltrigen.
- S. 6: Die Gruppe „Малыши“ gehört zum frühen Alter „от одного года до трех лет“.
  Daher die Zielgruppe im Umschlag.
- S. 2: Ausgabe „Минск : НИО, 2007“, ISBN 978-985-465-244-3.

## Was Eigenentwurf ist

- Die Namen Fingertheater, Tischtheater, Handpuppe und Kasper (Übertragung von „театра Петрушки“).
- Die Bastelschritte, die Materialien, die Beschreibungen und der Sicherheitssatz.
- Die fünf Spielszenen: eigene Texte, je fünf Sätze, Rollen benannt, offenes Ende. Sie folgen
  keinem Märchen und enthalten keine fremden Verse.
- Der Hinweis „Für dieses Heft braucht Ihr Kind keinen Bildschirm“. Er steht unter
  „Hinweis für Eltern (Eigenentwurf)“ und nicht bei der Anregung der Quelle. Die Quelle sagt das so nicht.

Jeder Begriff trägt seine Seite und die Kennzeichnung „(Eigenentwurf)“.

## Abweichungen vom Katalogeintrag (docs/10)

- Der Katalog nennt Szenen „nach gemeinfreien Maerchenmustern“ und „auf gemeinfreie deutsche
  und ukrainische Maerchen gestuetzt“. Der Auftrag verlangt eigene Texte ohne fremde Märchen;
  gebaut ist das so.
- Der Katalog nennt eine „bebilderte Anleitung“ und Bastelvorlagen. Gebaut sind die Schritte als
  Text. Zeichnungen und Piktogramme sind nicht gebaut.
- Der Katalog nennt „Druck-PDF / statische Doku“. Gebaut ist der Druck über den Browser
  (`window.print()`), wie es der Auftrag verlangt.

## Was nicht gebaut wurde

- Keine Eingabefelder, keine Namen, keine Notizen über Kinder, keine Einstufung (docs/02 Z. 141–146).
- Keine Speicherung: kein Browser-Speicher, kein Konto, kein Download (Projektregel, ohne docs/02-Zeile).
- Keine Verbindung nach draußen (docs/02 Z. 22–24). Die Daten kommen per JSON-Import.
- Keine uk- und ru-Fassung: uk und ru: nicht vorhanden, offen.
- Kein Vorlesen. Die Zielgruppe sind Erwachsene; ob die Vorlesepflicht der Checkliste für dieses
  Werkzeug gilt, ist offen (docs/fragen-und-hinweise.md, F2).

## Technik

- `index.html`: Grundgerüst, Content-Security-Policy `default-src 'self'`, Stylesheets aus
  `packages/kinder-ui` und `druck.css`. Der Fuß-Link zum Impressum ist mindestens 48 px hoch.
- `app.mjs`: Oberfläche. Filter „Seiten wählen“, Druckknopf (`window.print()`), Netzwerk-Wächter
  aus `packages/kinderschutz`. Jeder Knopf trägt eine `data-kennung`; nach jedem Neuaufbau der
  Anzeige bekommt der Knopf mit derselben Kennung den Fokus zurück.
- `logik.mjs`: Filter, feste Druckreihenfolge, Text je Seite, Satzzählung. Ohne DOM.
- `daten/heft.json`: Umschlag, drei Formen, fünf Szenen, Quellenhinweis, Pflichtmarkierung.
- `druck.css`: `@media print`, A4 hoch, Bildschirmelemente ausgeblendet, jede Seite auf ein Blatt.
  Bei 360 px bricht der Titel auch innerhalb eines Wortes um.

## Filter und Druck

Auf dem Bildschirm wählt die Erwachsene die Seiten: alle, Umschlag, eine der drei Formen oder
die Spielszenen. Der Druck enthält immer das ganze Heft in derselben Reihenfolge, auch wenn der
Filter eine Auswahl zeigt.

Im Druckdialog Kopf- und Fußzeilen ausschalten; sonst können Datum, Uhrzeit oder die Adresse
der Seite auf den Blättern erscheinen. Die App setzt selbst kein Datum und keine Adresse.

## Offen

Siehe `GDD.md`, Abschnitt „## Offen“.

## Tests

42 Tests in zwei Dateien. `test/logik.test.mjs` prüft Aufbau, Quellenzitate und Seiten,
Satzzahl der Szenen, Filter, Druckreihenfolge, Pflichtmarkierung je Seite und die Ziffern im
Druck. `test/regeln.test.mjs` prüft die Projektregeln: keine Eingabefelder, keine Speicherung,
keine externen Adressen, keine Druckzeichen, keine Namenszeile, Pflichtmarkierung je Seite,
aria-live auf `#app`, Fokus nach Klick, Modellnamen-Freiheit, Testzahl.

```bash
node --test apps/theater-zuhause-heft/test/*.test.mjs
```
