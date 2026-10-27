# GDD – Bewegungs-Richtwerte 4–5

## Was es ist

Ein Nachschlageblatt für Fachkräfte mit Kindern von 4 und 5 Jahren. Es zeigt die Angaben mit Maß aus den
Bewegungsaufgaben der Quelle (S. 128–134), nach Lebensjahr und Bewegungsart. Es ist kein Test, keine Norm
und kein Beobachtungsbogen. Kein Kinderbildschirm.

## Die tragende Entscheidung 1: Richtwerte, keine Norm

Der Text beschreibt Bewegungsaufgaben mit Maß. Er sagt nicht, dass jedes Kind sie erreichen soll. Die App
übernimmt keine Normsprache („muss“, „jedes Kind“, „Pflicht“); eine Prüfung weist sie ab.

## Die tragende Entscheidung 2: kein Bewerten einzelner Kinder

Der Katalog wollte einen Beobachtungsbogen mit Kriterien-Check und Bericht-Export. Das würde einzelne
Kinder bewerten. Das Werkzeug enthält keine Eingabe, keinen Check und keinen Export.

## Die tragende Entscheidung 3: Balancieren ist kein Maß

Die Quelle nennt Übungen im Gleichgewicht, aber keine messbare Größe. Die App führt sie nicht als Angabe.

## Was als Quelle gilt und was als Eigenentwurf

| Teil | Status |
|---|---|
| 25 Angaben nach Aufnahmeregel | Quelle, S. 129–132 |
| Zuordnung zu Lebensjahr und Bewegungsart | Quelle, Abschnitte „für das vierte“ und „fünfte Lebensjahr“ |
| Balancieren | Übung ohne Maß, nicht als Angabe |
| Beobachtungsbogen, Kriterien-Check, Bericht-Export | Eigenentwurf, nicht gebaut |
| Feste Zahl 32 | nach keiner Zählregel belegt, nicht übernommen |

## Prüfung

- 17 Tests in `test/logik.test.mjs`: Einträge und Seiten, feste Felder, keine Normsprache, Balancieren,
  Abweichung, Filter, Gegenproben.
- Die 25 russischen Zitate sind maschinell auf ihren Seiten nachgewiesen (kein Test). Die Auswahl ist nicht vollständig; die Aufnahmeregel steht im Hinweis.
- Browser bei 360 px: Filter, Druck, keine Schaltfläche für Check, Bericht oder Speichern, keine externen
  Anfragen.

## Offen

- Die Zuordnung der 20-Meter-Zeit im Text (S. 131) ist nicht eindeutig; die Angabe ist entsprechend markiert.
- Ob die Werte für deutsche Kitas als Orientierung taugen, prüft nur die Praxis. Eine Angleichung an
  deutsche Motorik-Studien ist nicht geprüft und steht nicht im Werkzeug.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
