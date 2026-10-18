# Sport-Schnupper-Stationen

Werkzeug für Fachkräfte in der Kita: Stationskarten zu Sportspielen, Sportübungen, benannten Spielen und Wettbewerbsformen aus der Praleska, zum Ausdrucken. Die Fachkraft wählt Karten aus und druckt sie als Blätter A4 quer, je Karte ein Blatt. Der Bildschirm ist nur die Auswahl; gedruckt wird nur, was gewählt ist.

Katalog: Katalogeintrag docs/10, Z. 484 (Einheit 18), Abschnitt Printmaterialien für Kita, Titel beibehalten. Altersgruppe 5 bis 7 Jahre (Gruppe „Фантазеры“, Quelle S. 6). Die Einordnung als Kita oder Vorschule ist Eigenentwurf. Offline nach dem Laden. Kein Bildschirm für Kinder (Projektregel, ohne docs/02-Zeile).

**Status: erster Stand.** Die Karten sind aus der Quelle belegt, die Regeltexte sind Eigenentwurf. Die Prüfung erfolgte am Quelltext und mit den Tests; eine Prüfung der Darstellung im Browser und auf dem Gerät steht aus.
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## Was belegt ist

- 8 Sportspiele, Aufzählung S. 229: Городки (Gorodki), Баскетбол (Basketball), Настольный теннис (Tischtennis), Бадминтон (Badminton), Ручной мяч (Handball), Футбол (Fußball), хоккей на траве (Hockey, Sportart offen), Русская лапта (Lapta).
- 5 Sportübungen, S. 230: Катание на санках (Schlittenfahren), Скольжение по ледяным дорожкам (Gleiten auf vereisten Bahnen), Ходьба на лыжах (Skilaufen), Катание на двухколесном велосипеде (Fahrradfahren), Подготовка к плаванию (Vorbereitung auf das Schwimmen).
- 6 benannte Spiele, S. 230: «Кто первый повернется», «Слалом», «Догони», «Шире шаг», «Не задень», «По следам».
- 2 Wettbewerbsformen, S. 230: «Кто быстрее прокатит мяч», «Кто большее количество раз отобьет мяч об пол».
- Ziel der Quelle: Spiele nach vereinfachten Regeln und elementare Wettbewerbe (S. 229–230). Sportfeste und Gesundheitstage (S. 226). Olympische Thematik (S. 225).
- Ausgabe: Minsk: НИО (Национальный институт образования), 2007, ISBN 978-985-465-244-3.

Jede Karte nennt ihre Seite. Die Zeile „Ziel: Spiel nach vereinfachten Regeln (S. 229–230)“ steht auf jeder Spiel-, Übungs- und Wettbewerbskarte. Jede Regel- und Übungsform ist als Eigenentwurf überschrieben.

## Was nicht übernommen wurde

- Technik-Piktogramme: die Quelle hat keine Bilder.
- Regeltexte als Quellenaussage: alle Regeln sind Eigenentwurf.
- Ersatz-Spielnamen aus dem Katalog (Wikingerschach, Dosenwerfen, Brennball, Floorball) als Quellenzuordnung.
- Eishockey: die Quelle nennt in der Liste Feldhockey, im Technik-Absatz steht Schläger und Scheibe. Die Sportart bleibt offen (siehe GDD).
- Team Deutschland, Special Olympics und Verbandsverweise: nicht in der Quelle.
- Sicherheitsaussagen zu Winter- und Wasserübungen: nicht in der Quelle.

## Was nicht gebaut wurde

- Keine Rangliste, keine Punkte, keine Zählfelder für einzelne Kinder. Die Wettbewerbe sind als Spielform ohne Rangliste (Eigenentwurf) gekennzeichnet.
- Keine Eingabefelder, keine Namen, keine Notizen über Kinder, keine Einstufung (docs/02 Z. 141–146).
- Keine Speicherung: kein Browser-Speicher, kein Konto, kein Download (Projektregel, ohne docs/02-Zeile).
- Keine Verbindung nach außen (docs/02 Z. 22–24).
- Keine Zeichen, Kästchen, Punkte oder Namenszeilen auf dem Druck (docs/02 Z. 79–82).

## Technik

- `index.html`: Grundgerüst, Content-Security-Policy `default-src 'self'`, Stylesheets aus `packages/kinder-ui` und `druck.css`.
- `app.mjs`: Oberfläche und Druckknopf (`window.print()`), Netzwerk-Wächter aus `packages/kinderschutz`. Jeder Knopf trägt eine eindeutige `data-kennung`; nach jedem Neuaufbau bekommt der Knopf mit derselben Kennung den Fokus zurück.
- `logik.mjs`: Auswahl, feste Reihenfolge, Textzeilen. Ohne DOM.
- `daten/stationen.json`: alle 22 Karten mit Quelle, Seite und Kennzeichnung. Die Karten kommen per JSON-Import mit Typangabe, ohne `fetch`.
- `druck.css`: `@media print`, A4 quer, Bildschirmelemente ausgeblendet, je Karte ein Blatt. Auf dem Bildschirm bricht der Titel auch innerhalb eines Wortes um (bei 360 px Breite), der Fuß-Link ist mindestens 44 px hoch.

## Drucken

Der Knopf „Stationskarten drucken“ öffnet den Druckdialog des Browsers. Dort die Kopf- und Fußzeilen ausschalten; sonst können Datum, Uhrzeit oder die Adresse der Seite auf den Blättern erscheinen. Die App setzt selbst kein Datum und keine Adresse.

## Tests

32 Tests in zwei Dateien: `test/logik.test.mjs` prüft Daten, Seiten, Namen aus der Quelle, Kennzeichnung, Wettbewerbe ohne Rangliste und Auswahl. `test/regeln.test.mjs` prüft die Projektregeln: keine Eingabefelder, keine Speicherung, keine externen Adressen, keine Druckzeichen, keine Namenszeile, Modellnamen-Freiheit, aria-live auf `#app`, Fokus nach Klick, Pflichtmarkierung der Seitenangaben, Umbruch des Titels, Höhe des Fuß-Links und Testzahl.

```bash
node --test apps/sport-schnupper-stationen/test/*.test.mjs
```
