# Farbwörter-Schatz

Bildhafte Farbnamen zum gemeinsamen Anschauen. Für Kinder von 3 bis 5 Jahren nur zusammen mit einem
Erwachsenen und für Kinder von 5 bis 7 Jahren. Der Ablauf besteht aus Auswahlen aus Listen, ohne Eingabe:
eine der vier Farbgruppen wählen (warm, kalt, Kontrast, neutral), ein Farbwort wählen, die Farbkarte
ansehen (Name, Farbfläche, Hinweis), sich den Namen vorlesen lassen und auf Wunsch Karten zum Drucken
vormerken. Gedruckt wird je Karte ein Blatt A4 hoch. Ohne Speicherung, ohne Verbindung nach draußen.
Ein Neuladen ohne Netz ist nicht zugesichert: die App hat keinen Service Worker (F4).

Katalog: docs/10, Z. 456, Abschnitt „Контент-паки к существующим приложениям“ (Content-Packs), Eintrag
„Farbwörter-Schatz“, Content-Pack 9. Titel beibehalten. Der Katalog nennt als Träger den quiz-kern. Die App
nimmt ihn nicht an (Bauauftrag CON-9, Abschnitt 3 und 6): sie ist eine eigene Karten-App auf kinder-ui, wie die
Vorlagen baby-spielideen-kartei und puppentheater-werkstatt. Die Wahl des Motors ist eine offene Frage an Max
(docs/plan-neue-welle.md, Abschnitt 5).

**Status: erster Stand.** Geprüft sind die Tests mit `node --test` (68 Tests) und die Browser-Messung bei 360 px mit
`node tools/browser-tor.mjs farbwoerter-schatz` (Chromium ohne Oberfläche): Exit 0 ohne Verletzung; 75 Klicks auf 28
Kennungen, 718 gemessene Berührziele und keines unter 48 px, kein Überlauf, der Fokus liegt nach jedem Klick auf demselben
Knopf oder auf der Überschrift, Speicher leer, nur `localhost`, keine Konsolenfehler. Die Druckansicht zeigt bei 14
vorgemerkten Karten 14 Blätter ohne Zeichen, ohne Seitenzahl und ohne Marke; als PDF sind es 14 Seiten A4 hoch. Eine eigene
Erkundung aller Klickwege (295 Pfade, 48 Zustände) fand keinen Verstoß. Eine eigene Messung auf Wortumbruch (alle 14
Farbwörter auf Gruppen, Liste, Farbkarte und Druckvorschau) findet bei 360, 375 und 412 px kein Wort, das mitten im Wort
umbricht; der Name unter einer Farbfläche steht dafür in 0.85rem. Das Neuladen ohne Netz schlägt fehl (nicht
zugesichert, F4). Eine Prüfung auf dem Gerät und mit Kindern steht noch aus.
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## Bildschirme und Ablauf

1. **Start.** „Am besten gemeinsam“: ein Hinweis, dass die App zusammen mit einem Erwachsenen genutzt wird,
   die Hinweise für Erwachsene und der Quellenhinweis. Knopf „Wir sind zusammen – los!“.
2. **Gruppen.** Die vier Gruppen als Knöpfe mit kleinen Farbflecken: Warme, Kalte, Kontrast- und Neutrale Farben.
3. **Liste.** Die Farbwörter der gewählten Gruppe in der Reihenfolge der Datei. Eine Gruppe ohne Wörter sagt das.
4. **Farbkarte.** Name, Farbfläche, Hinweis (warm, kalt, Kontrast oder neutral), ein Satz zum Bild hinter dem Namen,
   der Satz zum Grenzfall bei Grün, „Vorlesen“, „Weitere Farbwörter“. Für Erwachsene: die Karte zum Drucken vormerken.
5. **Bildschirm aus.** Nach höchstens 6 verschiedenen Farbwörtern in einer Runde (Eigenentwurf, die Zahl ist offen)
   oder auf Knopfdruck: eine Anregung, im Zimmer oder draußen etwas in diesen Farben zu suchen. Für Erwachsene:
   eine neue Runde.
6. **Karten zum Drucken.** Vorschau der vorgemerkten Karten, „Drucken“, „Alle Karten wählen“, „Auswahl leeren“,
   je Karte „Diese Karte nicht drucken“. Die Auswahl liegt nur im Arbeitsspeicher der Seite.

Ein Bildschirmwechsel setzt den Fokus auf die Überschrift des neuen Bildschirms. Ein Klick, der nur den Stand
der Seite ändert (vormerken, Auswahl leeren), lässt den Fokus auf demselben Knopf; fällt der Knopf dabei weg, geht
der Fokus auf die Überschrift.

## Altersangabe

Der Katalog nennt 3 bis 5 Jahre (nur gemeinsam mit einem Erwachsenen) und 5 bis 7 Jahre. Die Quelle stellt die
Seite in die Gruppe „ПОЧЕМУЧКИ“, deren Altersangabe „четвертый—пятый годы жизни“ lautet (S. 103). Das entspricht
nach der üblichen Zählweise der Lebensjahre 3 bis 5 Jahren (Lesart, Eigenentwurf). Für 5 bis 7 Jahre nennt der
Bauauftrag keine Seite der Quelle; diese Altersangabe ist Eigenentwurf. Für 3 bis 5 Jahre gilt nach docs/10,
Rechtsrahmen Punkt 2: nur gemeinsam mit einem Erwachsenen und mit festen Sitzungslimits.

## Was belegt ist

- Abschnitt „Рисование“ (S. 178), Gruppe „ПОЧЕМУЧКИ“ (S. 178). Die Seite nennt als Ziel, bildhafte Farbnamen
  kennenzulernen: „вишневый“, „салатовый“, „малиновый“, „лимонный“, „абрикосовый“, „цвет морской волны“ (S. 178).
  Die Aufzählung ist offen („и т. д.“, S. 178).
- Dieselbe Seite nennt als Ziele, die Namen der Grundfarben und der Farben des Spektrums zu festigen und warme und
  kalte, kontrastierende, im Ton nahe und neutrale Farben kennenzulernen (S. 178). Es ist eine Aufgabe des Malens;
  die App überträgt sie in Wörter und Karten (Eigenentwurf).
- Quelle: Praleska, Programm der Vorschulerziehung (Titel übertragen), Minsk: НИО, 2007.
- Die Begriffe und die Seiten 178 und 103 sind in dieser Arbeit gegen die Textkopie der Quelle geprüft (maschinell,
  außerhalb des Repos, mit demselben Vergleich wie `tools/bauauftrag-pruefen.mjs`: Seite n ist der n-te Abschnitt der
  Textkopie, geteilt an den Seitenumbrüchen; Satzzeichen und Groß- und Kleinschreibung zählen nicht). Die Seitenangaben
  stehen in den Daten (`quelle.seite`), im Quellenhinweis auf dem Startbildschirm und in den Dokumenten, nicht auf dem Blatt.

## Was Eigenentwurf ist

- Alle deutschen Farbnamen. Die sechs Namen des Bauauftrags (kirschrot, zitronengelb, aprikosenfarben,
  meergrün, himbeerrot, tannengrün) folgen docs/10, Z. 456. Dazu kommen eisblau, nachtblau, schneeweiß, aschgrau
  und rabenschwarz.
- Die Farbwerte der Flächen: eine Richtung, keine Messung. Jeder Bildschirm und jeder Drucker verschiebt sie.
- Die Gruppen, die Zuordnung der Wörter zu den Gruppen, die drei Kontrast-Paare, die Hinweise warm, kalt,
  Kontrast und neutral, alle Sätze und der Satz zum Grenzfall bei Grün.
- Die Zuordnung zu den russischen Begriffen. Das Feld `ru` enthält den Begriff der Quelle, keine geprüfte
  Übersetzung: kirschrot und „вишневый“, himbeerrot und „малиновый“, aprikosenfarben und „абрикосовый“,
  zitronengelb und „лимонный“, meergrün und „цвет морской волны“ (angenähert). tannengrün hat keinen
  Begriff, und „салатовый“ steht nur im Quellenhinweis: ein helles Grün ist nicht tannengrün. Alle sechs Namen des
  Bauauftrags tragen `quelle.seite` „S. 178“ (Bauauftrag, Abschnitt 4): die Seite belegt die Aufgabe „bildhafte
  Farbnamen“, nicht den deutschen Namen. Die übrigen Einträge tragen nur `eigenentwurf: true`.
- Anmerkung 29.10.2026 (Welle 3): Der Eintrag tannengrün trägt `eigenentwurf: true` bereits (eine Agentenprüfung hatte das
  Fehlen gemeldet; das war falsch). Offen ist, ob die Seitenangabe „S. 178“ bei tannengrün bleibt, weil die Seite keinen Begriff
  für tannengrün nennt (Frage 80). Die Daten werden dazu nicht geändert, bis Max entscheidet.
- Die Kennzeichnung steht auf der Farbkarte, auf dem Blatt (Zeile „Farbwort, Farbfläche und Hinweis: Eigenentwurf.“),
  im Fuß und beim Quellenhinweis.

uk und ru: nicht vorhanden, offen. Die Quelle ist russischsprachig; die deutschen Fassungen sind Eigenentwurf.
Die Oberfläche zeigt weder ru noch uk: es gibt keinen Sprachwechsel, und die deutsche Stimme läse Kyrillisch falsch.

## Abweichungen vom Bauauftrag

1. **Kontrast und neutral.** Der Bauauftrag nennt für diese beiden Gruppen keine Wörter (die sechs Namen sind
   warme oder grüne Töne). Damit keine Gruppe leer bleibt und das Lernziel 1 für alle vier gilt, stehen dort
   Einträge nur als Eigenentwurf, ohne Quelle: drei Kontrast-Paare (zitronengelb und nachtblau, aprikosenfarben
   und eisblau, schneeweiß und rabenschwarz) und drei neutrale Wörter (schneeweiß, aschgrau, rabenschwarz). Die
   Paare unterscheiden sich in der Helligkeit oder auf der Blau-Gelb-Achse, nicht nur in Rot gegen Grün; ein Test
   prüft das (Eigenentwurf, nicht fachlich geprüft). Jede Zeile lässt sich aus `daten/farbwoerter.json` streichen;
   die App sagt dann „Für diese Gruppe gibt es noch keine Farbwörter.“ Die Tests verlangen heute je Gruppe mindestens
   ein Farbwort (Lernziel 1) und sind in diesem Fall anzupassen.
2. **Kontrast ist ein Paar.** Ein Eintrag der Gruppe kontrast hat die Felder `teile` (zwei Namen) und `farbe` (zwei
   Hex-Werte), weil Kontrast ein Verhältnis zwischen zwei Farben ist, das Feld `gruppe` aber am einzelnen Eintrag
   steht. `farbkarte` liefert deshalb `flaeche` als Liste: eine Farbe, bei einem Paar zwei.
3. **kalt.** Der Bauauftrag nennt dafür nur zwei grüne Namen (meergrün, tannengrün). Grün gilt als Grenzfall: die
   beiden Wörter tragen den Satz „Grün liegt zwischen warm und kalt …“ auf der Karte, im Vorlesetext und auf dem
   Blatt. Zusätzlich stehen eisblau und nachtblau als klar kalte Wörter.
4. **Runde und Bildschirm aus.** Der Bauauftrag verlangt in Abschnitt 9 für 3 bis 5 Jahre feste Sitzungslimits (docs/10,
   Rechtsrahmen Punkt 2), nennt in Abschnitt 3 aber keinen Schritt dazu. Gebaut ist `PRO_SITZUNG` (6 verschiedene
   Farbwörter je Runde, Eigenentwurf, die Zahl ist offen), danach „Bildschirm aus“. Wer noch ein Farbwort wählt,
   kommt zu „Bildschirm aus“; „Neue Runde“ ist ein Knopf für Erwachsene.
5. **pruefeFarbwoerter.** Die Regel „Fehler, wenn quelle.seite nicht S. 178 ist“ gilt nur, wenn quelle.seite da ist.
   Ein Eintrag mit eigenentwurf: true und ohne Quelle ist gültig; der Bauauftrag erlaubt das in der ersten Regel.
   Zusätzlich prüft die Funktion Hex-Werte, doppelte Kennungen, den Satz, ru ohne Quelle und die Paare.
6. **Pflichtmarkierung.** Das Blatt trägt keine Seitenangabe (A18-Standard) und darum keine Pflichtmarkierung; die
   Vorlagen puppentheater-werkstatt und kleine-forscher-ohne-bildschirm drucken sie je Blatt. Die Marke steht beim
   Quellenhinweis auf dem Startbildschirm, in den Daten, in dieser Datei und im GDD.
7. **Vorlesen.** Der Bauauftrag schreibt „folgt nach Entscheidung F2“. Gebaut ist es nach der Regel für Kinder-Apps
   (Entscheidung Max 28а), mit `vorlesen()` aus kinder-ui und nur mit einer deutschen Stimme im Gerät.
8. **Keine eltern.html.** Der GDD-Entwurf nannte sie, der Bauauftrag und die Vorlagen nicht. Die Hinweise für
   Erwachsene stehen auf dem Startbildschirm.
9. **Keine Mischlehre und kein Quiz.** Das Mischen von Farben macht `farb-labor`.

## Was nicht gebaut wurde

- Keine Fragen mit Antwort, kein Quiz, keine Bewertung, keine Rückmeldung über ein Kind (docs/02 Z. 141–146):
  keine Punkte, kein Rekord, keine Rangliste, keine Sterne. Gezählt werden nur die angesehenen Farbwörter einer
  Runde und die vorgemerkten Karten.
- Keine Eingabefelder, keine Namen von Kindern, kein Feld für ein Kind.
- Keine Speicherung: kein Browser-Speicher, kein Konto, keine Karte „Meine Daten löschen“.
- Keine Verbindung nach draußen (docs/02 Z. 22–24): Content-Security-Policy, Netzwerk-Wächter, Daten per JSON-Import.
- Keine uk- und ru-Fassung, kein Sprachwechsel (siehe oben).
- Kein Zufall und keine Uhr: die Reihenfolge ist die der Datei.
- Keine Hilfe-Insel: Fachlernen Farbe, ein Erwachsener ist dabei (wie `farb-labor`).
- Kein Ausmalblatt: der Bauauftrag sieht nur die Farbwort-Karte vor.

## Technik

- `index.html`: Grundgerüst, Content-Security-Policy `default-src 'self'`, Stylesheets aus `packages/kinder-ui`
  (mit dem gemeinsamen Favicon auf derselben Zeile) und `druck.css`. Der Fuß-Link zum Impressum ist mindestens
  48 px hoch.
- `app.mjs`: die sechs Bildschirme, der Netzwerk-Wächter aus `packages/kinderschutz`, Vorlesen über `vorlesen()` und
  `lokaleStimme()` aus kinder-ui. Jeder Knopf trägt eine eindeutige `data-kennung`; nach jedem Neuaufbau bekommt der
  Knopf mit derselben Kennung den Fokus zurück, nach einem Bildschirmwechsel die Überschrift (`tabindex="-1"`).
- `logik.mjs`: `ladeFarbwoerter`, `pruefeFarbwoerter`, `gruppeFuer`, `farbkarte`, `vorlesetext`, `druckBlaetter`
  und die Hilfen für die Auswahl und die Runde. Ohne DOM, ohne Zufall, ohne Uhr.
- `daten/farbwoerter.json`: die Farbwörter (id, de, ru, uk, gruppe, farbe, satz, quelle, eigenentwurf), die
  vier Gruppen, die Texte für Erwachsene und der Quellenhinweis. Die Daten kommen per JSON-Import mit Typangabe,
  nicht per `fetch`.
- `druck.css`: Bildschirm und Druck. Im Druck verschwindet jeder Bildschirmteil (`fws-nur-bildschirm`), übrig bleiben
  die vorgemerkten Karten, je Karte ein Blatt A4 hoch, nie zerrissen. Die Fläche druckt mit
  `print-color-adjust: exact` und einem schwarzen Rand.

## Drucken

Der Knopf „Drucken“ druckt die vorgemerkten Karten. Ein Blatt zeigt die Farbfläche (bei einem Kontrast-Paar zwei), den
Namen, den Hinweis, den Satz und die Zeile „Farbwort, Farbfläche und Hinweis: Eigenentwurf.“. Es hat keine Seitenzahl,
keine Namenszeile, keine Tagesfelder und keine Zeichen aus `docs/druck-symbole-liste.md`. Im Druckdialog Kopf- und
Fußzeilen ausschalten; sonst können Datum, Uhrzeit oder die Adresse der Seite auf dem Blatt erscheinen. Der Name und
der Hinweis tragen die Information auch auf einem Drucker ohne Farbe.

## Offen

Siehe `GDD.md`, Abschnitt „## Offen“. Dazu:

- Die Einträge der Gruppen kontrast und neutral, eisblau, nachtblau und alle Zuordnungen zu warm und kalt sind Eigenentwurf
  und fachlich nicht geprüft; ob sie bleiben, entscheidet Max (Kunstpädagogik, Sprache und Alter).
- Seitenangaben: Die Projektregel verlangt für Seitenangaben die Markierung „проверено человеком“ (Entscheidung A18 in
  `docs/fragen-und-hinweise.md`, offen). Die Marke „noch nicht von einem Menschen geprüft“ steht beim Quellenhinweis;
  das Blatt trägt keine Seitenangabe.
- Die Quelle liegt nur auf dem Branch `main`; die Prüfung gegen die Textkopie lief außerhalb des Repos (F3).
- Browser-Prüfung auf dem Gerät und der Test mit Kindern der Zielgruppe stehen aus.
- Bei 320 px Breite (die Anforderung des Projekts ist 360 px) brechen „aprikosenfarben“ und „rabenschwarz“ in den Knöpfen der Gruppe
  Kontrastfarben und „aprikosenfarben“ unter der Farbfläche noch mitten im Wort um.

## Tests

Die Tests stehen in zwei Dateien: `test/logik.test.mjs` prüft die Daten gegen die geprüften Begriffe und die Seite,
die Gruppen, die Farbkarte, den Vorlesetext, die Druckblätter, die Auswahl und die Runde. `test/regeln.test.mjs`
prüft die Projektregeln: keine Eingabefelder, keine Speicherung, keine externen Adressen, kein Zufall, keine
Druckzeichen, keine Namenszeile, keine Seitenzahl auf dem Blatt, die Marke beim Quellenhinweis, die Kennzeichnung als
Eigenentwurf, Knopfhöhe, Fokus, Vorlesen, uk und ru, keine Bewertung, externe Fakten, die erlaubten Zeilenangaben zu den Projektregeln,
die Zitate und die Testzahl. Drei Prüfungen am Ende lesen den Quelltext von `app.mjs` und halten fest, dass die App die Runde
(das feste Sitzungslimit), die Auswahl zum Drucken und den Weg zurück wirklich benutzt und dass Farbkarte, Start und Liste
ihre Hinweise zeigen; eine vierte prüft, dass in allen Dateien der App kein kyrillischer Text steht außer den erlaubten
Begriffen und Titeln. Insgesamt sind es 68 Tests.

```bash
node --test apps/farbwoerter-schatz/test/*.test.mjs
```
