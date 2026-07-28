# Kurz-GDD: Grammatik-Zwerge 🧩

**Einheit aus Katalog:** docs/10 (Praleska), Abschnitt „Ko-Nutzung (3–5, nur
gemeinsam mit einem Erwachsenen)“, Nr. 14 — «Grammatik-Zwerge».
**Engine:** eigenes datengetriebenes Sprachspiel (bewusst **nicht** `quiz-kern`,
siehe 5). Zielgruppe: 4–6, ausschließlich Ko-Nutzung, ausdrücklich DaZ-tauglich.

## 1. Kernaussage

Drei Sprachspiele in einer sehr kurzen Sitzung: **Wo ist es?** (Ortswörter),
**Einer und viele** (Mehrzahl) und **Zwei Wörter werden eins**
(Zusammensetzungen). Höchstens sechs Aufgaben, danach ist Schluss.

## 2. Was die App weglässt – und warum

**„vor“ und „hinter“ sind gesperrt.** Der Katalog nennt sie, aber beide hängen
davon ab, wo der Betrachter steht und ob das Bezugsding eine eigene Vorderseite
hat. Ohne räumliche Tiefe (Verdeckung) gibt es zwei sprachlich richtige
Antworten — eine App, die dann eine davon als falsch meldet, ist unfair.
`GESPERRTE_PRAEPOSITIONEN` steht im Code, `pruefeDaten` weist solche Aufgaben
zurück, ein Test hält beides fest. Die Auslassung steht im Datensatz
(`hinweis`) und in `eltern.html` mit Begründung und Alltagsersatz.

## 3. Die Szenen werden gezeichnet

Zwei Emoji nebeneinander kodieren nur links und rechts. „in“ und „auf“ wären
damit nicht auseinanderzuhalten, und dieselbe Emoji-Grafik sieht je nach Gerät
anders aus. Deshalb ist das Bezugsding ein **gezeichneter Kasten** (Rahmen +
Fläche) mit sichtbarer Beschriftung; nur das gesuchte Ding ist ein Emoji, und
es trägt immer sein Wort mit Artikel daneben.

## 4. Die Invarianten im Validator

| Regel | Warum |
|---|---|
| Nur `auf/unter/in/neben/zwischen`, `vor/hinter/über/an` gesperrt | siehe 2 |
| Jedes angebotene Ortswort ist mindestens einmal Lösung | sonst stehen tote Knöpfe da |
| Ortsangabe wird **gerechnet** (`ortsangabe()`), nicht gespeichert | Bild und Satz können nicht auseinanderlaufen |
| `in` nur mit weiblichem Behälter | sonst müsste es „im Korb“ statt „in dem Korb“ heißen |
| `zwischen` nur mit zwei gleichen Dingen | sonst ist die Szene mehrdeutig |
| Mindestens 4 Mehrzahl-Arten | sonst lernt das Kind „viele heißt -e“ |
| Ein- ≠ Mehrzahlform, Sperrliste für Nullplural/Dubletten | „ein Löffel – viele Löffel“ ist keine hörbare Aufgabe |
| `fastRichtig` muss unter den **falschen** Antworten stehen | siehe 6 |
| `teil1 + fuge + teil2 === wort` | fängt Tilgung und Umlaut (Schulhof, Bücherregal) |
| `istEin` muss das Grundwort nennen, `genus === genusTeil2` | die Rechtsköpfigkeit wird geprüft, nicht behauptet |
| Mindestens ein Wort **mit** Fugenlaut | „Wort + Wort“ ohne Gegenbeispiel wäre zu groß |
| Alle drei Artikel in beiden sichtbaren Bereichen | eine einseitige Wortliste lehrt eine falsche Regel |
| Jede Regel hat ein nichtleeres `gilt` von ≥ 25 Zeichen | eine Regel ohne ihre Grenze behauptet zu viel |
| Die Lösung steht nicht in allen Aufgaben an derselben Stelle | siehe 6a |
| `nachvollziehbar` muss ein angebotenes Wort sein und nie die Lösung | siehe 6 |

## 5. Kein quiz-kern

`quiz-kern` bringt Punkte, einen Rekord in localStorage und Ränge mit. Für ein
vierjähriges Kind ist das ein Wettbewerb um eine Zahl, die es nicht deuten
kann. Richtig und falsch gibt es (es sind Fragen über die Sprache), aber
folgenlos: kein Punktestand, kein Rang, nichts gespeichert.

## 6. „Die Balls“ ist kein Fehler

Eine übergeneralisierte Mehrzahl zeigt, dass ein Kind eine Regel gebildet hat.
Jede Mehrzahl-Aufgabe führt deshalb ein Feld `fastRichtig` mit genau dieser
Form; wird sie gewählt, zeigt die App **kein** Fehlersignal, sondern
„👍 Fast – gut gedacht!“ und nennt dann die Form dieses Wortes.

Dasselbe gilt bei den Ortswörtern: Wer bei zwei Kisten „neben“ sagt, hat
hingesehen, nur nicht genau genug. Das Feld heißt dort `nachvollziehbar` und
trägt seinen eigenen Text.

## 6a. Vorlesetext und Knöpfe kommen aus EINER gemischten Liste

Für ein Kind, das nicht liest, **ist** der Vorlesetext die Aufgabe. Würde die
App die Daten roh vorlesen, während die Knöpfe gemischt sind, käme die Lösung
im Vorlesetext systematisch zuerst. Deshalb wird pro Frage genau einmal
gemischt, und dieselbe Liste trägt beides. Als zweite Sicherung verlangt der
Validator, dass die Lösung in den Daten nicht überall an derselben Stelle
steht.

## 7. Ko-Nutzungs-Muster

Erwachsenen-Gate → `PRO_SESSION = 6` → nach jeder Aufgabe ein Gesprächsimpuls
in Frageform (Validator) → Pflichtabschluss „Bildschirm aus“ mit drei
Offline-Ideen. Keine Punkte, kein Rekord, kein Rang, nichts gespeichert.

## 8. Abgrenzung

`erste-woerter-lesewerkstatt` arbeitet an Buchstaben und Lauten,
`reim-radar`/`reim-werkstatt` am Klang der Wörter, `woerter-sortierer` an der
Bedeutung (Oberbegriffe, Gegensätze). Hier geht es um die **Form**: Ortswörter,
Mehrzahl, Wortbildung.

## 9. Politik (docs/02)

Werbefrei, ohne Anmeldung, keine externen Anfragen
(`installiereNetzwerkWaechter`, CSP `default-src 'self'`), **kein**
localStorage, deutsche Oberfläche, `eltern.html`, Impressum im Fuß, Vorlesen
über die Gerätestimme.

## 10. Tests

16 Tests in `test/logik.test.mjs`: Datengültigkeit, Sperre von vor/hinter,
Vollständigkeit der Ortswörter, Dativ-Berechnung, „in“/„zwischen“-Regeln,
Mehrzahl-Arten und Sperrliste, `fastRichtig`, wandernde Lösungsposition,
`nachvollziehbar` bei „zwischen“, Fugen-Rechenprobe und Gegenbeispiel-Pflicht,
Regelgrenzen, Genus-Balance, Sitzungsgrenze, Antwortprüfung, Ton und
Abschluss.
