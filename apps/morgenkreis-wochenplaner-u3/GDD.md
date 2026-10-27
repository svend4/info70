# GDD – Morgenkreis- und Wochenplaner U3

## Was es ist

Ein Planer für eine Gruppe mit Kindern von 1 bis 3 Jahren. Er verteilt zehn Einheiten pro Woche
auf sieben Bereiche und ordnet jede Einheit, wo möglich, einem Titelbaustein der Quelle zu. Er
zählt die Planung gegen die Richtwerte der Quelle und speichert den Plan nur als Datei.

## Die tragende Entscheidung 1: die Richtwerte sind Richtwerte

Die Quelle nennt je Bereich eine Zahl Einheiten pro Woche (S. 8–9) und die Summe zehn. Der
Planer zeigt die Abweichungen, blockiert aber nicht. Eine Gruppe, die anders plant, verstößt
nicht gegen die Quelle; sie plant nur anders.

## Die tragende Entscheidung 2: nur Zählwerte, keine Namen, kein Freitext

Der Plan enthält Tage, Bereiche und Bausteine. Eine Datei mit einem Feld, das nach einem Kind
aussieht (Name, Geburtsdatum, Notiz und ähnliches), wird abgewiesen. So wird der Plan nie zum
Protokoll über ein Kind (docs/02).

## Die tragende Entscheidung 3: Wochentage und Höchstzahl sind eigen

Die Quelle nennt keine Wochentage und keinen Ablauf des Morgenkreises. Fünf Tage und höchstens
vier Einheiten pro Tag stehen in den Daten und sind als Eigenentwurf gekennzeichnet.

## Was als Quelle gilt und was als Eigenentwurf

| Teil | Status |
|---|---|
| Sieben Richtwerte, zusammen zehn | Quelle, S. 8–9 |
| Monatsregel Lepka | Quelle, S. 9 (als Hinweis) |
| Bewegungsbausteine | Quelle, S. 70–71 |
| Musikbausteine | Quelle, S. 81–86 (Gattungen der Kartei 78) |
| Malen, Formen, Konstruieren | Quelle, S. 91–94 |
| Fünf Tage, Höchstzahl vier pro Tag | Eigenentwurf |
| Morgenkreis als Format | nicht in der Quelle, daher nicht vorhanden |
| Planer-Selbstbeobachtung, Datei-Export | Eigenschaften der App |

## Was die App nicht tut

- Keine Abrechnung der Einheiten gegen Kinder, keine Anwesenheit, keine Beobachtung.
- Keine Speicherung im Gerät; der Plan lebt im Speicher der Seite und in der Datei.
- Keine Verbindung nach außen.

## Prüfung

- 21 Tests in `test/logik.test.mjs`: Richtwerte und Summe, Musik-Bausteine, Operationen am Plan,
  Datei mit Form, Abweisung bei Namensfeld, falscher Art, Version, Tagesreihenfolge, fremdem
  Baustein und zu vielen Einheiten; Abweichung ist keine Ablehnung.
- Browser bei 360 px: alle Bedienelemente mindestens 44 px, Export, Import (abgewiesen und
  angenommen), keine Speicherung, keine externen Anfragen.

## Offen

- Der Lernbereich „Sprache und Kommunikation“, „Umwelt“ und „Sensomotorik“ hat keine Bausteine.
  Die Quelle nennt dazu keine Titel in den Listen, die wir gelesen haben; eine Suche steht aus.
- Die Monatsregel für Lepka braucht einen Kalender, den der Planer nicht führt.
- Die Titel sind russische und belarussische Originale; die deutsche Übertragung ist eine eigene
  Prüfung.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
