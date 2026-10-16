# GDD – Vom Hantieren zum Rollenspiel

## Was es ist

Karten zum Drucken für Fachkräfte mit Kindern von 3 bis 5 Jahren, zum Übergang vom gegenständlichen
Spiel zum Rollenspiel. Sieben Aufgaben aus der Quelle, Fakten zum Übergang, eine Checkliste als
Eigenentwurf. Kein Kinderbildschirm.

## Die tragende Entscheidung 1: die Aufgaben der Quelle, für die Fachkraft

Die Quelle formuliert die Punkte auf S. 145–146 als „Задачи“ für den Erzieher. Die App zeigt sie so
und ersetzt sie nicht durch Lernziele der Kinder.

## Die tragende Entscheidung 2: keine erfundenen Spielideen, keine Verlaufsdokumentation

Der Katalog nannte Spielideen je Entwicklungsschritt und eine kurze Verlaufsdokumentation. Der Text
nennt beides nicht. Die App erfindet keine Spielideen und baut keine Dokumentation des Spielverlaufs.

## Die tragende Entscheidung 3: kein Diagnoseteil

Der Abschnitt auf S. 146 beschreibt, Rollenspiele auch zu nutzen, um Kinder mit emotionalem Unbehagen
zu erkennen. Das ist Beobachten einzelner Kinder. Es wird nicht übernommen und steht so in der Abweichung.

## Was als Quelle gilt und was als Eigenentwurf

| Teil | Status |
|---|---|
| Sieben Aufgaben | Quelle, S. 145–146 |
| Übergang am Ende des vierten Lebensjahres | Quelle, S. 104 |
| Diade und Triade als erste Spielgruppen | Quelle, S. 104 |
| Altersangabe 3 bis 5 für „Почемучки“ | Quelle, S. 6 |
| Checkliste | Eigenentwurf |
| Spielideen je Entwicklungsschritt | nicht im Text, daher nicht gebaut |
| Verlaufsdokumentation, Diagnoseteil | nicht übernommen |

## Prüfung

- 16 Tests in `test/logik.test.mjs`: Aufgaben und Seiten, Fakten, keine Felder nach Kind, keine Lernziele,
  Abweichung, Gegenproben.
- Die russischen Zitate sind maschinell auf den angegebenen Seiten nachgewiesen (kein Test). Die Prüfung der Felder erkennt Feldnamen und Muster, nicht jeden Satz über ein Kind.
- Browser bei 360 px: Karten, Druck, Knöpfe mindestens 44 px, keine externen Anfragen.

## Offen

- Die Checkliste sollte von einer Fachkraft aus einer deutschen Kita gelesen werden, bevor sie in der
  Ausbildung eingesetzt wird.
- Die Übertragung „Rollenspiel“, „Diade“ und „Triade“ ist eine eigene Übersetzung.
