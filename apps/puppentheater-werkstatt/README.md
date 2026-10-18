# Puppentheater-Werkstatt

Werkzeug für Fachkräfte in Gruppen mit Kindern von 5 bis 7 Jahren. Jeder Vorschlag besteht aus
einem Gestaltungsauftrag aus der Praleska (mit Seitenangabe) und einem Stückanfang aus eigenen
Bausteinen. „Neuer Vorschlag“ zieht neu; „Blatt drucken“ druckt den Vorschlag als ein Blatt A4 hoch.

Katalog: docs/10, Abschnitt „Контент-паки к существующим приложениям“ (Content-Packs), Eintrag
„Puppentheater-Werkstatt (Content-Pack)“, Content-Pack 12. Titel beibehalten. Die App ist für
Erwachsene; die Gruppe setzt den Auftrag um. Offline nach dem Laden, ohne Speicherung, ohne
Verbindung nach draußen.

**Status: erster Stand.** Geprüft sind die Tests mit `node --test`. Eine Prüfung im Browser,
bei 360 px Breite und auf dem Gerät steht noch aus.
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## Altersangabe

docs/10 nennt 5 bis 7 Jahre. Die Quelle nennt die Gruppe „ФАНТАЗЕРЫ“ die älteste im Kindergarten
(„самые старшие в детском саду“, S. 199). Ihre Altersangaben lauten „шестой—седьмой годы жизни“
(S. 199) und „пяти-шести лет“ (S. 200). Die Angabe 5 bis 7 Jahre ist die Lesart dieser Stellen
nach der üblichen Zählweise der Lebensjahre (Eigenentwurf); die Quelle nennt sie nicht in dieser
Form. Eine Fachkraft prüft sie.

## Was belegt ist

- Abschnitt „Детский дизайн“ (Kinder-Design), Gruppe „ФАНТАЗЕРЫ“, S. 286 bis 288.
- Gestaltungsaufträge, je mit Seitenangabe:
  - Plakat: „Афиша для выставки“ (S. 288) und „создание афиши для музыкального «концерта»“ (S. 287).
  - Einladungskarte: „Пригласительные билеты для выставки“ (S. 288). Die Quelle meint eine Ausstellung.
  - Kulisse und Dekoration: „разработка элементов дизайна кукол, кулис, декораций“ (S. 288).
  - Puppe gestalten: „элементов дизайна кукол“ (S. 288).
  - Kleidung für eine Puppe: „Одежда для кукол“ (S. 288) und „одежды для кукол“ (S. 287).
- Die Quelle ist eine Programmschrift: Praleska, Minsk: НИО, 2007, ISBN 978-985-465-244-3 (S. 1 und S. 2).

## Was Eigenentwurf ist

- Alle deutschen Titel und Aufgaben der Gestaltungsaufträge.
- Die deutschen Übertragungen der Begriffe („Plakat, Ankündigung“, „Einladungskarten; in der Quelle für eine Ausstellung“,
  „Elemente für Kulissen und Dekorationen gestalten“, „Elemente der Puppengestaltung“, „Kleidung für Puppen“).
- Alle Bausteine des Stückanfangs: Figur, Ort, kleines Problem, offenes Ende. Je Liste sechs oder
  sieben Sätze, selbst geschrieben. Keine fremden Märchen, keine fremden Stücktexte, keine Lieder.
- Die Kennzeichnung auf dem Blatt: „(Eigenentwurf)“ steht bei jeder Übertragung und bei jedem Teil,
  der nicht aus der Quelle stammt.

Russische Zitate haben höchstens 12 Wörter. Die Quelle ist russischsprachig; die deutschen Fassungen sind
Eigenentwurf. uk und ru: nicht vorhanden, offen.

## Abweichungen von docs/10

- docs/10 nennt „Eintrittskarten“. Die Quelle nennt „Пригласительные билеты для выставки“ (S. 288),
  also Einladungskarten für eine Ausstellung. Die App bietet deshalb „Einladungskarte zur Vorstellung“ an;
  der Bezug zur Vorstellung ist Eigenentwurf.
- docs/10 nennt eine Adaptation mit der deutschen Kasperle- und Schattentheater-Tradition und einem optionalen
  Vertep/Batleika-Modul für uk/ru-Familien. Beides steht nicht auf S. 287 bis 288 und ist nicht aufgenommen.
- docs/10 nennt einen Bildungsplan-Bereich „Aesthetik und Darstellendes Spiel“. Die Quelle nennt ihn nicht;
  die App zeigt ihn nicht.

## Was nicht übernommen wurde

- Keine Stücktexte, keine Märchen, keine Lieder aus fremden Quellen.
- Kein Vertep- oder Batleika-Modul (steht nicht auf S. 287 bis 288).
- Keine uk- und ru-Fassung: uk und ru: nicht vorhanden, offen.
- Keine automatische Texterzeugung. Die Bausteine stehen fest in der Datei und werden nur zusammengesetzt.
- Keine Zahlen von Entwicklungsschritten, keine Norm, kein Sicherheitshinweis als Quellenaussage.

## Was nicht gebaut wurde

- Keine Eingabefelder, keine Namen, kein Feld für ein Kind, keine Notizen über Kinder, keine Einstufung.
  Keine Bewertung, Punkte, Rangliste (docs/02 Z. 141–146).
- Keine Speicherung: kein Browser-Speicher, kein Konto, kein Download.
- Keine Verbindung nach draußen (docs/02 Z. 22–24).
- Keine Bilder, Zeichnungen oder Piktogramme.

## Technik

- `index.html`: Grundgerüst, Content-Security-Policy `default-src 'self'`, Stylesheets aus
  `packages/kinder-ui` und `druck.css`. Der Fuß-Link zum Impressum ist mindestens 48 px hoch.
- `app.mjs`: Oberfläche, der Knopf „Neuer Vorschlag“, der Druckknopf (`window.print()`), der
  Netzwerk-Wächter aus `packages/kinderschutz`. Jeder Knopf trägt eine eindeutige `data-kennung`;
  nach jedem Neuaufbau bekommt der Knopf mit derselben Kennung den Fokus zurück.
  Dies ist die einzige Datei mit Zufall: `Math.random` steht hier einmal und wird als Funktion übergeben.
- `logik.mjs`: Ziehung, Textzusammenbau und Druckzeilen. Ohne DOM, ohne eigene Zufallsquelle;
  der Zufall kommt als Parameter `rng` (Zahlen von 0 bis unter 1). Damit läuft die Logik in Tests
  mit festen Werten.
- `daten/werkstatt.json`: die fünf Gestaltungsaufträge mit Zitaten und Seiten, die Bausteine und der Wortlaut
  der Hinweise. Die Daten kommen per JSON-Import mit Typangabe, nicht per `fetch`.
- `druck.css`: `@media print`, A4 hoch, Bildschirmelemente ausgeblendet, ein Blatt je Vorschlag.
  Auf dem Bildschirm bricht der Titel bei 360 px auch innerhalb eines Wortes um.

## Drucken

Der Knopf druckt den angezeigten Vorschlag. Im Druckdialog Kopf- und Fußzeilen ausschalten;
sonst können Datum, Uhrzeit oder die Adresse der Seite auf dem Blatt erscheinen. Die App setzt
selbst kein Datum und keine Adresse.

## Offen

Siehe `GDD.md`, Abschnitt „## Offen“.

## Tests

Die Tests stehen in zwei Dateien: `test/logik.test.mjs` prüft die Daten gegen die geprüften
Zitate und Seiten, die Bausteine, den Zufall über den Parameter und den Druckinhalt.
`test/regeln.test.mjs` prüft die Projektregeln: keine Eingabefelder, keine Speicherung, keine
externen Adressen, Zufall nur in `app.mjs`, keine Druckzeichen, keine Namenszeile, Pflichtmarkierung
je Blatt, Eigenentwurf-Kennzeichnung, Fokus nach Klick, Modellnamen-Freiheit, Testzahl.
Insgesamt sind es 38 Tests.

```bash
node --test apps/puppentheater-werkstatt/test/*.test.mjs
```
