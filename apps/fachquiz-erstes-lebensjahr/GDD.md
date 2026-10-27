# GDD – Fachquiz Entwicklung im ersten Lebensjahr

## Was es ist

Ein Quiz für die Ausbildung in Erzieherberufen und Kinderpflege sowie für Tagespflege.
Es prüft Quellenwissen zum ersten Lebensjahr aus dem Praleska-Kapitel (S. 26–43,
Einleitung S. 5). Es ist ein Lernwerkzeug für Fachkräfte. Es enthält keine Frage über ein
bestimmtes Kind und kein Kinder-Bildschirm.

## Die tragende Entscheidung: die Quelle wird nicht geglättet

Der Katalog hatte die Zahl 25 Meilensteine, eine Verbindung (Lisina – Komplex) und
einen Fachbegriff („Belebungskomplex“) behauptet, die der Text nicht trägt. Die Zahl der
Kommunikationsformen ist kein Widerspruch: der Text beschreibt mehrere Formen, zählt sie
aber nicht ausdrücklich. Das Quiz übernimmt keine dieser Behauptungen als Fakt.
Die richtigen Antworten sind die des Textes; wo der Text sich widerspricht, zeigt das
Quiz den Widerspruch und löst ihn nicht auf.

## Zahlen und Belege

| Aussage | Stand im Text | Seite |
|---|---|---|
| Merkmale am Jahresende | 22 Aufzählungspunkte | S. 42–43 |
| Komplex der Belebung | etwa dritter Monat, bis vierter stark zunehmend; Genitivform S. 38 | S. 28 |
| Gezieltes Greifen | Aufgabe für unter Dreimonatige, aber Beschreibung im fünften Monat | S. 34, S. 39 |
| Drei Gegenstände gleichzeitig | neun bis zehn Monate | S. 40 |
| Bewegungsaufgaben | bis 3 Monate, 3 bis 6–7, 6–7 bis 12 | S. 34–35 |
| Situativ-geschäftliche Form | zweites Halbjahr, Verständigung über Dinge | S. 28 |
| Übergangsform personal-geschäftlich | zweites Halbjahr, Zuwendung zuerst | S. 37–38 |
| Lisina-Zitat | Einleitung, Übergang zwischen Tätigkeiten | S. 5 |

## Was offen bleibt

- **„(4—20)“ bei den ersten Wörtern (S. 29):** im Text in Klammern, nicht eindeutig.
  Das Quiz fragt nicht danach. Eine Klärung braucht die Originalausgabe.
- **Greifen:** der Widerspruch zwischen S. 34 und S. 39 ist im Text. Die Quelle löst ihn
  nicht; das Quiz auch nicht.
- **Gelbes Heft (U-Untersuchungen):** nicht im Quiz. Die Fenster stammen nicht aus der
  Praleska-Quelle und sind hier nicht gegengeprüft.

## Prüfung

- 8 Tests in `test/fragen.test.mjs`: Schema (quiz-kern), Seitenangaben im erlaubten
  Bereich, Widersprüche benannt, Katalogzahlen nicht als Fakt, Mindestvorrat für Runde,
  keine Ränge in den Daten, kein Speicher im App-Code.
- Browser bei 360 px: volle Runde, Ende der Runde ohne Wertung, kein Überlauf, Knöpfe 55 px,
  keine externen Anfragen.
