# Buchecke-Check 📚

Werkzeug für das Kita-Team: Raum, Bestand, tägliche Buchzeit und Pflege der Buchecke. Fünfzehn
Fragen in vier Bereichen, jede mit ihrer Herkunft. Neun Fragen stehen auf S. 155, 186 und 251
der Praleska-Quelle, mit russischem Wortlaut. Sechs sind Eigenentwurf und als solche gekennzeichnet.

Es fragt nach der Gruppe, nie nach einzelnen Kindern. Es gibt keine Eingabefelder, also keine Namen
und keine Notizen über Kinder, und keine Bewertung. Nichts wird gespeichert: die Antworten liegen
im Speicher der Seite und sind nach dem Neuladen weg. Der Team-Bericht ist eine Textdatei oder ein
Ausdruck, den das Team selbst aufbewahrt.

## Was an der Quelle geprüft ist

- **„14 Ziele der künstlerischen Wahrnehmung“** (Katalog Nr. 85): belegt. Die Aufgabenliste
  „Художественное восприятие / Задачи“ hat 14 Punkte auf S. 153–155. Die Buchecke-Aufgabe ist der
  elfte Punkt (S. 155). Die Fragen dieses Werkzeugs stützen sich auf diese Liste.
- **Kriterien für eine Buchecke**: Der Text nennt keine. Deshalb sind sechs Fragen Eigenentwurf.
- **„BFSG-konforme Umsetzung“ und „uk/ru-Titel“**: Das sind Aussagen über Bestände und über
  Barrierefreiheit, nicht über die Quelle. Sie werden nicht übernommen. Die Eigenentwurf-Frage zu
  Familiensprachen ist eine Frage an das Team, keine Behauptung über die Quelle. Eine
  Konformitätsprüfung des Werkzeugs gibt es nicht.

Belegt und mit Seite:

- **S. 155** (Gruppe „Почемучки“, 3–5): Buchecke in der Raumgestaltung, Kinder nehmen ein Buch in
  die Hand und blättern darin, tägliche inhaltliche Begegnung mit dem Buch, Hinweis auf Umschlag,
  Bilder und Text.
- **S. 186** (Gruppe „Почемучки“, 3–5, Abschnitt „Хозяйственно-бытовой труд“): Bücher gemeinsam mit
  der Fachkraft wieder einkleben.
- **S. 251** (Gruppe „Фантазеры“, 5–7): Buchecke als Lieblingsort, Vorlesen täglich und
  Fortsetzungsgeschichten, Bücher mit demselben Stoff von verschiedenen Illustratoren,
  selbstgemachte Bücher der Kinder.

Das Alter der Gruppen steht auf S. 6: „почемучки“ von drei bis fünf Jahren, „фантазеры“ von fünf
bis sechs oder sieben.

Der Wortlaut der Zitate ist einmal von Hand gegen die Seiten geprüft (Stand 16.10.2026). Der Test
im Repo prüft nur die Form: russischer Text, Mindestlänge. Er prüft nicht den Inhalt.

## Was nicht gebaut wird

Die Katalogeinträge Nr. 84 und Nr. 86 beschreiben Beobachtungsbögen pro Kind: Diagnose-Indikatoren
bei Nr. 84, eine Ampel-Einschätzung bei Nr. 86. Das widerspricht der Release-Regel in `docs/02`
(Z. 141–146): „Приложение не выставляет ребёнку оценку“. Sie werden nicht gebaut. Die Begründung
steht in `docs/10`.

## Starten

Im Projektordner den lokalen Server starten (`node tools/serve.mjs 8099`) und
`http://localhost:8099/apps/buchecke-check/` öffnen. Zum Drucken: „Bericht drucken“.

## Tests

`node --test apps/buchecke-check/test/logik.test.mjs` prüft die Daten (Herkunft jeder Frage,
Kennungen, keine Felder über Kinder, keine Eintragsmuster in Texten), die Zählung, das Setzen der
Antworten und den Bericht. Es sind 22 Tests in `test/logik.test.mjs`.
