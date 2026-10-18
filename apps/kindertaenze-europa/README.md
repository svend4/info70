# Kindertänze Europas

Werkzeug für Fachkräfte in der Kita: Datenkarten zu Tänzen und Melodie-Angaben aus der
Praleska, Gruppe „Фантазеры“ (5 bis 7 Jahre, S. 6). Die Fachkraft wählt Tanzkarten, filtert
nach Tanzart und druckt je Tanz eine Datenkarte als Blatt A4 quer. Der Bildschirm ist nur die
Auswahl; gedruckt wird nur, was gewählt ist.

Katalog: Einheit Content-Pack 11 in docs/10, Titel „Kindertänze Europas“ beibehalten.
Altersgruppe 5 bis 7 Jahre. Zielgruppe ist die Fachkraft. Familien als Zielgruppe sind in der
Quelle nicht belegt. Kein Bildschirm für Kinder (Projektregel).
Offline nach dem Laden.

**Status: erster Stand.** Die Titel und Melodie-Angaben sind aus der Quelle belegt. Die
Schritte, die Hinweise und die deutschen Namen sind Eigenentwurf. Die Prüfung im Browser steht
noch aus.
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## Was belegt ist

- Die 20 Titel mit Volksmelodie-Angabe auf S. 267 (Absätze „Танцы“ und „Белорусские пляски“),
  in Quellenfolge. Die Titel stehen auf den Karten wörtlich in russischer Schrift, mit
  Seitenangabe.
- Die Tanzarten Menuett und Polonaise mit Komponistenangabe (S. 267). Sie tragen nur die Tanzart
  mit Komponistenangabe, keine Melodie-Angabe.
- Die Melodie-Herkunft je Tanz, zum Beispiel „kroatische Volksmelodie (Quelle S. 267)“. Sie ist
  eine Übertragung der Angabe „нар. мел.“ aus der Quelle.
- Die Bewegungsbegriffe aus S. 265 bis 266 als kurze Zitate mit Seite. Die Quelle nennt sie als
  Aufgaben der Gruppe und ordnet sie keinem einzelnen Tanz zu; die App tut das auch nicht.
- Die Altersgruppe 5 bis 7 Jahre und der Name der Gruppe „Фантазеры“ mit S. 6.

## Was nicht übernommen wurde

- Sirtaki und Reigen: die Quelle nennt sie auf S. 267 nicht. Die Quelle nennt auf S. 259 und S. 266
  „хоровод“, nicht „Reigen“; das ist kein Tanz im Startumfang.
- Herkunftsgeschichten und Angaben zur Herkunft der Tänze: die Quelle nennt keine. Das Feld
  bleibt leer.
- Schrittfolgen aus der Quelle: die Quelle nennt keine. Die Schrittbeschreibungen sind
  Eigenentwurf zur Anregung und keine überlieferte Vorlage.
- Mazurka und die übrigen Tanzarten mit Komponistenangabe auf S. 267: nicht im Startumfang.
  Die Entscheidung liegt bei der Projektleitung (siehe GDD).

## Was nicht gebaut wurde

- Keine Eingabefelder, keine Namen, keine Notizen über Kinder, keine Einstufung
  (docs/02 Z. 141–146 für die Bewertung von Kindern).
- Keine Speicherung: kein Browser-Speicher, kein Konto, kein Download (Projektregel).
- Keine Verbindung nach außen (docs/02 Z. 22–24).
- Keine Zeichnungen und keine Bilder.
- Keine Übersetzungen in Ukrainisch oder Russisch: uk und ru: nicht vorhanden, offen.

## Technik

- `index.html`: Grundgerüst, Content-Security-Policy `default-src 'self'`, Stylesheets aus
  `packages/kinder-ui` und `druck.css`.
- `app.mjs`: Oberfläche, Filter nach Tanzart, Auswahl und Druckknopf (`window.print()`).
  Netzwerk-Wächter aus `packages/kinderschutz`. Jeder Knopf trägt eine eindeutige
  `data-kennung`; nach jedem Neuaufbau bekommt der Knopf mit derselben Kennung den Fokus zurück.
- `logik.mjs`: Auswahl, Filter, feste Reihenfolge und Textzeilen. Ohne DOM.
- `daten/tanze.json`: 22 Tanzkarten mit Quellenzitat, Seite, Melodie-Angabe und Eigenentwurf,
  dazu die Bewegungsbegriffe und die Hinweise zur Quelle.
- `druck.css`: `@media print`, A4 quer, Bildschirmelemente ausgeblendet, je Karte ein Blatt.
  Der Titel bricht auch innerhalb eines Wortes um (bei 360 px Breite), der Fuß-Link ist
  mindestens 44 px hoch.

Abweichung von der Vorlage: Die Daten kommen per JSON-Import mit Typangabe
(`with { type: 'json' }`), nicht per `fetch`, weil die Regel keine Anfrage nach außen erlaubt.
Dafür braucht der Browser Unterstützung für Import-Attribute. Welche Browserversionen das sind,
ist nicht geprüft.

## Drucken

Die Auswahl gilt unabhängig vom Filter: gedruckt wird, was gewählt ist, auch wenn der Filter
es gerade ausblendet.

Der Knopf „Ausgewählte Datenkarten drucken“ öffnet den Druckdialog des Browsers. Dort die
Kopf- und Fußzeilen ausschalten. Sonst können Datum, Uhrzeit oder die Adresse der Seite auf den
Blättern erscheinen. Die App setzt selbst kein Datum und keine Adresse.

## Tests

28 Tests in zwei Dateien: `test/logik.test.mjs` prüft Daten, Startumfang, Seiten, Melodie-Angaben,
Zitatlängen, Schrittbeschreibungen, Filter, Auswahl und Kartentext. `test/regeln.test.mjs` prüft
die Projektregeln: keine Eingabefelder, keine Speicherung, keine externen Adressen, keine
Druckzeichen, keine Namenszeile, keine Felder für Kinder, aria-live auf `#app`, Fokus nach Klick,
Pflichtmarkierung der Seitenangaben, Verweise auf die Anforderungen, Wortwahl, Testzahl.

```bash
node --test apps/kindertaenze-europa/test/*.test.mjs
```
