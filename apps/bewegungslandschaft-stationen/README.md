# Bewegungslandschaften-Plakate Krippe

Werkzeug für Fachkräfte in der Krippe: sieben Stationskarten für den Bewegungsraum
und eine Karte „Aufsicht und Umgebung“. Die Fachkraft wählt Karten aus und druckt
sie als Blätter A4 quer, je Karte ein Blatt. Der Bildschirm ist nur die Auswahl;
gedruckt wird nur, was gewählt ist.

Katalog: Katalogeintrag docs/10, Abschnitt Printmaterialien, Titel beibehalten.
Altersgruppe 1 bis 3 Jahre, offline nach dem Laden. Kein Bildschirm für Kinder unter
3 Jahren (Projektregel, ohne docs/02-Zeile).

**Status: erster Stand.** Die Karten sind aus der Quelle belegt. Die Prüfung im Browser
ist maschinell in Chromium erfolgt; die Prüfung auf dem Gerät steht noch aus.
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## Was belegt ist

- Übungen und Maße aus der Praleska, S. 57 bis 60. Jede Karte nennt ihre Seite,
  jede Maßzeile ebenfalls.
- Die Zahlen sind unverändert übernommen: Kriechen zwischen Schnüren (S. 58),
  Stehleiter 1,2 m (S. 58), 1,5 m (S. 59), Gymnastikleiter 1,7 bis 2 m (S. 60),
  schiefe Ebene Höhe 10 bis 30 cm, Breite 15 bis 20 cm, Länge 150 bis 200 cm (S. 59),
  Zielwurf horizontal Ziel 50 cm, Abstand 50 bis 60 cm (S. 59), Zielwurf vertikal
  Ziel 50 bis 60 cm, Abstand 80 bis 100 cm, auf Augen- und Brusthöhe (S. 60),
  Durchkriechen und Balancierweg (S. 60).
- Aufsicht (S. 57): das Kind nicht aus dem Blick der Erwachsenen lassen; potenziell
  gefährliche Gegenstände aus der Reichweite entfernen. Der Wortlaut ist übertragen
  und als Übertragung gekennzeichnet.
- Ausgabe der Quelle, wie auf der Titelseite der Textdatei: Minsk: НИО
  (Национальный институт образования), 2007, ISBN 978-985-465-244-3.

Die Übungsnamen, die Durchführungen und der Wortlaut der Maßangaben sind
Eigenentwurf. Jede Karte trägt diese Kennzeichnung. Jede Stationskarte trägt in der
Fußzeile den Satz „Übungsmaß laut Quelle, keine Sicherheitsgrenze.“

## Was nicht übernommen wurde

- Aufbaupläne und Zeichnungen: die Quelle hat keine Abbildungen.
- Das Wort „Tunnel“: die Quelle sagt Durchkriechen.
- DGUV- und andere Sicherheitsvorschriften mit Quellenverweis: sie stehen nicht in der Quelle.
- Maße als Sicherheitsgrenzen oder Höchstwerte: die Karten sagen, dass es Übungsmaße sind.
- Der Querverweis „digitaler Bewegungs-Baukasten“: einen solchen Eintrag gibt es nicht.
- Die Angabe „auf 100 bis 125 cm“ (S. 60): der Bezugspunkt ist unklar, deshalb fehlt sie.

## Was nicht gebaut wurde

- Keine Zeichnungen, keine Piktogramme, keine Bilder.
- Keine Eingabefelder, keine Namen, keine Notizen über Kinder, keine Einstufung
  (docs/02 Z. 141–146 für die Bewertung von Kindern).
- Keine Speicherung: kein Browser-Speicher, kein Konto, kein Download
  (Projektregel, ohne docs/02-Zeile).
- Keine Verbindung nach außen (docs/02 Z. 22–24).

## Technik

- `index.html`: Grundgerüst, Content-Security-Policy `default-src 'self'`, Stylesheets aus `packages/kinder-ui` und `druck.css`.
- `app.mjs`: Oberfläche und Druckknopf (`window.print()`), Netzwerk-Wächter aus `packages/kinderschutz`.
  Jeder Knopf trägt eine eindeutige `data-kennung`; nach jedem Neuaufbau der Anzeige bekommt der
  Knopf mit derselben Kennung den Fokus zurück.
- `logik.mjs`: Auswahl, feste Reihenfolge, Textzeilen. Ohne DOM.
- `daten/stationen.json`: alle acht Karten mit Quelle, Seite und Kennzeichnung.
- `druck.css`: `@media print`, A4 quer, Bildschirmelemente ausgeblendet, je Karte ein Blatt.
  Auf dem Bildschirm: Titel bricht auch innerhalb eines Wortes um (bei 360 px Breite),
  Fuß-Link mindestens 48 px hoch.

Abweichung von der Vorlage: Die Vorlage lädt ihre Daten per `fetch`. Diese App lädt
die Karten per JSON-Import mit Typangabe, weil die Regel kein `fetch` im Quelltext erlaubt.
Dafür braucht der Browser einen aktuellen Browser mit Unterstützung für Import-Attribute
(`with { type: 'json' }`). Welche Browserversionen das sind, ist nicht geprüft.

## Drucken

Der Knopf „Stationskarten drucken“ öffnet den Druckdialog des Browsers. Dort die
Kopf- und Fußzeilen ausschalten. Sonst können Datum, Uhrzeit oder die Adresse der Seite
auf den Blättern erscheinen. Die App setzt selbst kein Datum und keine Adresse.

## Tests

31 Tests in zwei Dateien: `test/logik.test.mjs` prüft Daten, Seiten, Zahlen, Ausgabe
der Quelle, Kennzeichnung und Auswahl. `test/regeln.test.mjs` prüft die Projektregeln:
keine Eingabefelder, keine Speicherung, keine externen Adressen, keine Druckzeichen,
keine Namenszeile, Modellnamen-Freiheit, aria-live auf `#app`, Fokus nach Klick,
Pflichtmarkierung der Seitenangaben, Umbruch des Titels und Höhe des Fuß-Links, Testzahl.

```bash
node --test apps/bewegungslandschaft-stationen/test/*.test.mjs
```
