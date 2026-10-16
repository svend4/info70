# Musik-Jahresplaner für Fachkräfte

Ein Werkzeug für Erwachsene: für Musikfachkräfte und das Kita-Team, die ihr Jahr
mit Musik planen. Katalogeintrag: docs/10, Nr. 87 („Musik-Jahresplaner für die Kita“).
Quelle: Praleska, Musikteil der Gruppe «ПОЧЕМУЧКИ», S. 160–174.

## Was die App ist

- Ein Überblick über die **fünf Bereiche** der Quelle, mit Überschrift und Seite.
- Eine **eigene Stückliste** der Fachkraft: Titel, Bereich, Monat und Herkunft. Sie bleibt nur bis zum Neuladen der Seite.
  Die Herkunft wählt man aus vier festen Optionen.
- Eine **Monatsübersicht**: Die Fachkraft hakt von Hand an, welche Bereiche sie im
  Monat angesprochen hat. Das ist eine Erinnerung, keine Bewertung.
- Eine **Zählung je Monat** der eigenen Einträge, zum Beispiel „Oktober: 3 Stücke“.
- **Feste als Anregung**: die Beispiele aus S. 174 und eigene Vorschläge.
- Ein **Jahresbogen zum Ausdrucken**: zwölf Monate mit den fünf Bereichen und leeren
  Linien zum Ausfüllen von Hand.

## Was die App nicht ist

- **Keine Liederliste.** Kein Stück aus dem Buch steht in der App. Aus der Quelle
  stehen nur die fünf Bereichsüberschriften und die fünf Festbeispiele von S. 174 drin.
- **Keine Bewertung von Kindern oder Gruppen.** Es gibt keine Ampel, keine Rangliste,
  kein Soll, keine Quote und keine Gesamtzahl.
- **Kein Werkzeug für Kinder.** Es gibt keinen Kinder-Bildschirm und darum keine
  `eltern.html`.
- **Keine Herkunftsprüfung.** Die App sagt nicht, ob ein Werk gemeinfrei oder
  lizenziert ist. Sie fragt nur nach der Herkunft; die Fachkraft prüft.
- **Kein Konto, keine Anmeldung, keine Anbindung ans Netz.** Die Seite stellt keine
  Anfrage an fremde Adressen.

Bitte keine Namen von Kindern und keine Beobachtungen über einzelne Kinder
eintragen. Das Feld „Titel“ verlangt einen Eintrag und begrenzt seine Länge; den
Inhalt prüft die App nicht.

## Was gespeichert wird

- Auf diesem Gerät, im Browser, unter dem Schlüssel `mjp.stand`: nur die Häkchen der
  Monatsübersicht, ohne Titel. Mehr nicht. Die Stückliste mit ihren Titeln wird nie gespeichert;
  sie gilt nur bis zum Neuladen. Titel sind frei und könnten einen Namen enthalten.
- Der Knopf „Meine Daten löschen“ entfernt genau diesen Schlüssel.
- Ist der Speicher gesperrt, etwa im privaten Fenster, funktioniert die Seite
  trotzdem. Der Plan gilt dann nur bis zum Neuladen, und die Seite sagt das.

## Quellen und Eigenentwurf

Die Überschriften und Seiten stammen aus der Quelle. Die deutschen Bezeichnungen
sind Eigenbenennungen.

| Bereich (Eigenbenennung) | Überschrift der Quelle | Seiten |
|---|---|---|
| Hören | Слушание музыки | 160–162 |
| Singen | Пение | 162–165 |
| Musikalisch-rhythmische Tätigkeit und Tanz | Музыкально-ритмическая деятельность | 166–170 |
| Spiel auf Instrumenten | Обучение элементам нотной грамоты, игре на музыкальных инструментах | 170–172 |
| Musik im Alltag | Музыка в повседневной жизни | 172–174 |

**Feste** (S. 174): Die Quelle nennt Feste als Aufgabe der Musik im Alltag, und
zwar 1–2 Mal im Monat, im Sommer wöchentlich. Die Beispiele dort sind
„Новый год“, „Мамин день — 8 Марта“, „Осень золотая“, „Праздник урожая“ und
„Весна-красна“. Die deutschen Übersetzungen sind Eigenentwurf.

**Eigenentwurf, nicht aus der Quelle:**

- die deutschen Bereichsbezeichnungen und die Übersetzungen der Festnamen;
- die Festvorschläge Erntedank, St. Martin, Advent, Fasching und Frühlingsfest,
  jeweils als „Vorschlag, nicht aus der Quelle“ gekennzeichnet;
- die Monatsübersicht mit den Häkchen und die Zählung je Monat;
- die vier Herkunftsoptionen;
- die Oberfläche, der Jahresbogen und die Hinweistexte.

Die Quelle nennt drei Feste ausdrücklich als saisonal („сезонные праздники-развлечения“, S. 174),
ordnet sie aber keinem Monat zu. Die App ordnet ebenfalls keinen Monat zu; die Fachkraft wählt ihn selbst.

## Starten

Im Wurzelverzeichnis des Repos:

```
node tools/serve.mjs
```

Dann im Browser die Adresse localhost, Port 8070, Pfad `/apps/musik-jahresplaner/` öffnen. Zum
Drucken den Knopf „Jahresbogen drucken“ nutzen; der Browser zeigt dann nur den
Jahresbogen.

## Tests

```
node --test apps/musik-jahresplaner/test/*.test.mjs
```

Die App hat 34 Tests in `test/logik.test.mjs`. Sie prüfen die Quellangaben
wörtlich, die festen Optionen, die Prüfregeln der Stückliste, das Bereinigen des
gespeicherten Stands, die Druckregeln und die Abwesenheit externer Adressen.
Die Oberfläche selbst ist nicht durch Unit-Tests abgedeckt; siehe GDD.md.
