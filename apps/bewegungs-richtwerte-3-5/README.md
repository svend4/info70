# Bewegungs-Richtwerte 4–5 📏

Ein Nachschlageblatt für Fachkräfte mit Kindern von 4 und 5 Jahren (Gruppe „Почемучки“): Angaben
mit Maß aus den Bewegungsaufgaben der Quelle (Praleska, S. 128–134), nach Lebensjahr und Bewegungsart.
Es sind Richtwerte aus dem Text, keine Norm und keine Bewertung einzelner Kinder.

## Was an der Quelle geprüft ist

Der Katalogeintrag (Nr. 83) hatte fünf Angaben, die der Text so nicht trägt:

- **„32 messbare Zielwerte“**: Eine feste Zahl lässt sich nach keiner Zählregel bestätigen. Die Seiten
  enthalten rund fünfzig Stellen mit Zahl und Maßeinheit, darunter Tageszeiten, die keine Bewegungsaufgaben sind.
- **„Balancieren“ als messbarer Wert**: Die Quelle nennt Übungen im Gleichgewicht (S. 132–133), aber
  keine messbare Größe. Die App führt Balancieren deshalb nicht als Angabe.
- **Norm für jedes Kind**: Der Text sagt nicht, dass jedes Kind die Werte erreichen soll.
- **Beobachtungsbogen mit Verlaufs- und Kriterien-Check, Bericht-Export**: Die Quelle sieht dafür kein
  Verfahren vor. Ein solcher Check wäre eine Bewertung einzelner Kinder; er wird hier nicht gebaut.
- **Abschnitt „Beobachtungsbogen“ im Programm**: nicht im Text.

Belegt und mit Seite: 24 Angaben mit Maß, verteilt auf Laufen, Springen, Kriechen und Klettern sowie
Werfen, Rollen und Fangen (S. 129–132). Das Prellen zehnmal hintereinander steht auf S. 132.

## So funktioniert es

- Filter nach Lebensjahr (4 oder 5) und nach Bewegungsart.
- Jede Angabe mit der Seite und dem russischen Wortlaut. Die deutsche Fassung ist eine Übertragung.
- „Diese Angaben drucken“ druckt nur die Auswahl.
- Keine Eingabe, keine Namen, keine Speicherung.

## Grenzen – ehrlich

- Einige Angaben lassen die Zuordnung offen: Bei „20 und 30 m … (примерно за 9,5 с)“ bleibt unklar,
  welche Strecke die Zeit trägt. Der Text ist so markiert.
- Die Angaben sind Aufgabenbeschreibungen. Ob sie als Richtwert für eine Gruppe taugen, entscheidet die
  Fachkraft mit ihrer Beobachtung im Alltag.

## Prüfung

- `node --test apps/bewegungs-richtwerte-3-5/test/*.mjs` – 13 Tests: 24 Angaben, Lebensjahr 4 und 5,
  Seiten 129–132, feste Felder, keine Normsprache, kein Balancieren als Maß, Abweichung nennt 32, Norm und
  Kriterien-Check, Filter, Gegenproben.
- Alle 24 russischen Zitate sind maschinell auf ihren Seiten nachgewiesen.
- Browser bei 360 px: 24 Angaben, Filter nach Jahr und Art, Druck nur mit Angaben, keine Schaltfläche für
  Kriterien-Check, Bericht oder Speichern, keine externen Anfragen.

## Starten

`index.html` über einen statischen Server öffnen, zum Beispiel `node tools/serve.mjs`.
