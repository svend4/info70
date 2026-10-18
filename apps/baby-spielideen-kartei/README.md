# Spielideen-Kartei: Was kann mein Baby mit...?

Werkzeug für Eltern und Fachkräfte. 16 Karten zu Handlungen mit Gegenständen aus der
Praleska, S. 40 und 41. Die Erwachsene filtert nach Gegenstand und Handlung, wählt Karten
und druckt sie: je gewählter Karte ein Blatt A4 hoch.

Katalog: docs/10, Abschnitt „Контент-паки к существующим приложениям“, Einheit Content-Pack 2.
Titel beibehalten. Altersgruppe 0 bis 1 Jahr. Die App ist für Erwachsene; das Baby braucht
dafür keinen Bildschirm. Offline nach dem Laden, ohne Speicherung, ohne Verbindung nach draußen.

**Status: erster Stand.** Geprüft sind die Tests mit `node --test`. Eine Prüfung im Browser
und auf dem Gerät steht noch aus.
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## Was belegt ist

- Die Handlungsliste steht auf S. 40 (Quelle „Erkenntnis-praktische Tätigkeit“, S. 39 bis 40).
  Sie hat 17 Nennungen. „нанизывание“ und „кольца пирамидки нанизывает на стержень“ sind eine
  Handlung (Aufreihen). Daraus entstehen 16 Karten.
- Die Liste steht mit „и т. д.“ (S. 40). Sie ist nicht abschließend; die App sagt das.
- Acht Gegenstände: Pyramide, Würfel, Kreisel, Ball, Holzfass, Holzei, Pilz (S. 40), Spielwagen
  (S. 41). Jede Verknüpfung trägt ihre Seite.
- Glossen: вкладывание heißt Einlegen, Ineinanderstecken (nicht einfüllen). строит дом heißt
  Haus bauen. „Turm“ steht nur mit Verweis auf S. 41 („строить башню“).
- Ausgabe der Quelle: Minsk: НИО (Национальный институт образования), 2007,
  ISBN 978-985-465-244-3.

## Was Eigenentwurf ist

Die deutschen Handlungsnamen, Glossen, Gegenstandsnamen, die Spielideen und der Sicherheitssatz.
Jede Übertragung ist als Eigenentwurf gekennzeichnet. Russische Zitate haben höchstens
12 Wörter. Die Quelle ist russischsprachig; uk und ru: nicht vorhanden, offen.

## Was nicht übernommen wurde

- Eine Zahl von Entwicklungsschritten: docs/10 nennt eine, die Quelle auf S. 39 bis 41 belegt sie nicht.
- Normen und Prüfverweise: keine. Der Sicherheitssatz steht als Eigenentwurf ohne Norm.
- Schneebesen und Stapelbecher: stehen nicht in der Quelle auf S. 39 bis 41.
- Die Glosse „einfüllen“ für вкладывание und „Turm“ als Glosse für строит дом: falsch.
- Ein Hinweis auf Verschlucken als Quellenaussage.

## Was nicht gebaut wurde

- Keine Eingabefelder, keine Namen, keine Notizen über Kinder, keine Einstufung
  (docs/02 Z. 141–146 für die Bewertung von Kindern).
- Keine Speicherung: kein Browser-Speicher, kein Konto, kein Download
  (Projektregel, ohne docs/02-Zeile).
- Keine Verbindung nach draußen (docs/02 Z. 22–24).
- Keine Zeichnungen, Bilder oder Piktogramme.
- Keine uk- und ru-Fassung: uk und ru: nicht vorhanden, offen.

## Technik

- `index.html`: Grundgerüst, Content-Security-Policy `default-src 'self'`, Stylesheets aus
  `packages/kinder-ui` und `druck.css`. Der Fuß-Link zum Impressum ist mindestens 44 px hoch.
- `app.mjs`: Oberfläche, Filter, Auswahl und Druckknopf (`window.print()`), Netzwerk-Wächter
  aus `packages/kinderschutz`. Jeder Knopf trägt eine eindeutige `data-kennung`; nach jedem
  Neuaufbau der Anzeige bekommt der Knopf mit derselben Kennung den Fokus zurück.
- `logik.mjs`: Filter, Auswahl, feste Reihenfolge, Textzeilen. Ohne DOM.
- `daten/spielideen.json`: 16 Karten, Gegenstände, Quellenhinweis. Die Daten kommen per
  JSON-Import mit Typangabe, nicht per `fetch`.
- `druck.css`: `@media print`, A4 hoch, Bildschirmelemente ausgeblendet, je Karte ein Blatt.
  Auf dem Bildschirm bricht der Titel bei 360 px auch innerhalb eines Wortes um.

## Drucken

Der Knopf druckt nur die gewählten Karten. Im Druckdialog Kopf- und Fußzeilen ausschalten;
sonst können Datum, Uhrzeit oder die Adresse der Seite auf den Blättern erscheinen. Die App
setzt selbst kein Datum und keine Adresse.

## Offen

Siehe `GDD.md`, Abschnitt „## Offen“.

## Tests

16 Karten werden in 34 Tests geprüft. Die Tests stehen in zwei Dateien: `test/logik.test.mjs`
prüft Daten, Seiten, die 17 Nennungen gegen den Wortlaut der Quelle, Gegenstände, Glossen,
Filter und Auswahl. `test/regeln.test.mjs` prüft die Projektregeln: keine Eingabefelder,
keine Speicherung, keine externen Adressen, keine Druckzeichen, keine Namenszeile,
Pflichtmarkierung je gedruckter Karte, aria-live auf `#app`, Fokus nach Klick,
Modellnamen-Freiheit (keine verbotenen Fachbegriffe aus der Projektregel 6, keine Produktnamen), Testzahl.

```bash
node --test apps/baby-spielideen-kartei/test/*.test.mjs
```
