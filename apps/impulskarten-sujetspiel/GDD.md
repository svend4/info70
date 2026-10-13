# GDD – Impulskarten für das sujetabbildende Spiel (1–3 Jahre)

## Was es ist

Eine Kartei für Fachkräfte der Kita-Gruppe „Малыши“ (Kinder von 1 bis 3 Jahren). Jede Karte
zeigt eine kleine Spielsituation mit Puppe, Stofftier oder Spielzeug, in der das Kind einen
Ausweg finden soll, ohne dass ein Erwachsener die Lösung vorgibt. Die Karten werden gedruckt.
Es gibt keinen Kinderbildschirm.

## Die tragende Entscheidung 1: sechs Aufgaben für die Fachkraft

Die Quelle formuliert die sechs Punkte auf S. 68–69 als „Задачи“, Aufgaben des Erziehers (S. 7).
Der Katalog nannte sie Lernziele der Kinder. Die App übernimmt die Formulierung der Quelle:
Sie zeigt die Aufgaben mit Seite und russischem Wortlaut, und die Prüfung lehnt jeden Satz ab,
der sie als Kinder-Lernziel ausweist.

## Die tragende Entscheidung 2: keine Lösung für den Erwachsenen

Eine Karte hat kein Feld für eine Lösung. Die Prüfung lehnt unbekannte Felder ab und erkennt
häufige Lösungsformulierungen in Titel und Situation. Das ist keine Garantie: ob eine Situation
die Lösung verrät, entscheidet die Fachkraft beim Lesen. Das folgt aus S. 69: Die Kinder sollen „без помощи взрослых находить выход“.

## Die tragende Entscheidung 3: kein Titel „Rollenspiel“

Das sujetabbildende Spiel steht in der Quelle im Merkmal „к трем годам“ (S. 99–100). Den Übergang
zum Rollenspiel nennt der Text am Ende des vierten Lebensjahres (S. 104). Eine Kartei für 1–3
Jahre heißt deshalb „Impulskarten für das sujetabbildende Spiel“.

## Was als Quelle gilt und was als Eigenentwurf

| Teil | Status |
|---|---|
| Sechs Aufgaben | Quelle, S. 68–69 |
| Spielproblemsituation als Mittel | Quelle, S. 69 |
| Handlungskette, Nebeneinander-Spiel als Ziel | Quelle, S. 69; Entwicklungsmerkmale S. 46 (Kette), S. 47 und S. 100 (Nebeneinander) |
| Karte 6 (Puppe mit Ersatzgegenstand füttern) | Quelle, S. 100 |
| Karten 1–5, 7–9 (Situationen) | Eigenentwurf |
| Format, Kartenzahl, Druckbild | Eigenentwurf |
| Tagespflege als Zielgruppe | nicht in der Quelle, daher nicht genannt |

## Was die App nicht tut

- Keine Gesamtzahl von Karten oder Spielformen: die Quelle nennt dazu keine Zahl, die man
  übernehmen könnte.
- Keine Hinweise, wie man Handlungsketten aufbaut oder Nebeneinander-Spiel anregt. Die Quelle
  nennt nur das Ziel; das Verfahren wäre erfunden.
- Keine Speicherung, keine Anmeldung, keine externen Anfragen.

## Prüfung

- 21 Tests in `test/logik.test.mjs`: Aufgaben und Seiten, Titel, Lösungsverbot, Quellenpflicht je
  Karte, Abdeckung aller Aufgaben, Filter und die Abweisung fehlerhafter Daten.
- Browser bei 360 px: neun Karten am Anfang, Filter, Druck nur mit den Karten, Ziele mindestens
  44 px, kein Überlauf, keine externen Anfragen.

## Offen

- Die Übertragungen „Impulskarten“, „Spielproblemsituation“ und „sujetabbildend“ sind eigen. Die
  Quelle ist eine russische Ausgabe; eine Gegenprüfung mit deutschen Fachtexten steht aus.
- Ob die Karten in einer deutschen Kita passen, prüft nur die Praxis.
