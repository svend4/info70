# GDD – Musikspiele-Kartei U3

## Was es ist

Eine Kartei für Fachkräfte mit Kindern von 1 bis 3 Jahren. Sie ordnet die Musikspiele der Quelle
(Praleska, Gruppe „Малыши“, S. 81–86) nach deren eigenen Gattungen und zeigt je Gattung das
Prinzip, die Seite und einige Titel. Zum Drucken; kein Kinderbildschirm.

## Die tragende Entscheidung 1: Gattungen als Zusammenfassung der Quelle

Der Katalog nannte eine Filterlogik nach Alter, Dauer, Gruppengröße und Ort. Die Quelle kennt
diese Filter für die einzelnen Spiele nicht. Die Kartei gliedert deshalb nach dreizehn Gattungen,
die die Überschriften und Aufgaben der Quelle zusammenfassen. Vier davon sind Aufgabenstichworte,
keine Überschriften; die Namen sind eigen gefasst, die Seiten stimmen. Das Alter wird nur gezeigt, wo der Text es
nennt.

## Die tragende Entscheidung 2: keine Summe

Der Katalog nannte „ca. 50“, „46“ und „9“ in einem Eintrag. Die Zahlen hängen an einer Zählregel,
und die Listen sind offen („и др.“). Die App nennt keine Gesamtzahl. Die Prüfung lehnt Texte ab,
die eine Zählung im Prinzip oder im Hinweis tragen.

## Die tragende Entscheidung 3: Titel, keine Texte und keine Noten

Ein Beispiel ist ein Titel mit Seite. Autoren- und Notenangaben aus den Listen („муз.“, „сл.“,
„обр.“) werden nicht übernommen. Eine Prüfung weist sie ab. Die Grenze davor ist ausdrücklich
gesetzt, weil `\b` in JavaScript bei kyrillischen Buchstaben nicht greift.

## Was als Quelle gilt und was als Eigenentwurf

| Teil | Status |
|---|---|
| Dreizehn Gattungen und ihre Seiten | Zusammenfassung der Überschriften und Aufgaben, S. 81–86 |
| Titel je Gattung (Auswahl) | Quelle, mit Seite |
| Alter, wo der Text es nennt (Melodie Frage–Antwort, dritte Lebensjahr) | Quelle, S. 81 |
| Formulierung des Spielprinzips | Eigenentwurf |
| Filter nach Dauer, Gruppengröße, Ort | nicht in der Quelle, daher nicht vorhanden |
| „gemeinfreie deutsche Kinderlieder“ | nicht geprüft, nicht enthalten |

## Was die App nicht tut

- Keine Gesamtzahl von Spielen, Formen oder Reigen.
- Keine Lieder, keine Texte, keine Noten.
- Keine Speicherung, keine Anmeldung, keine externen Anfragen.

## Prüfung

- Insgesamt 38 Tests: 17 Logik-Tests in `test/logik.test.mjs` (Gattungen und Seiten, Titel ohne
  Autorenangabe, kein Feld für Dauer, Gruppengröße oder Ort, keine Summe, Filter und die Abweisung
  fehlerhafter Daten) und 21 Prüf-Tests in `test/regeln.test.mjs` (Druckregeln, Eingabe, Speicher,
  Netz, Knopfhöhe, Fokus).
- Browser bei 360 px: dreizehn Karten, Filter, Druck, Knöpfe mindestens 48 px, keine externen
  Anfragen.

## Offen

- Die Titel sind russische und belarussische Originale. Eine deutsche Übertragung der Titel
  steht aus und wäre eine eigene Prüfung.
- Ob die deutschen Kinderlieder des Katalogs gemeinfrei sind, ist nicht geprüft. Bis dahin
  bleiben sie draußen.
- Die Pflichtmarkierung „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ steht auf dem Bildschirm dort, wo Seitenangaben stehen. Das Druckblatt trägt keine Seitenangabe.
- uk und ru: nicht vorhanden, offen.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
