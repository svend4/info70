# Buchecke-Check 📚

Werkzeug für das Kita-Team: Raum, Bestand, tägliche Buchzeit und Pflege der Buchecke. Fünfzehn
Fragen in vier Bereichen, jede mit ihrer Herkunft. Neun Fragen stehen auf S. 155, 186 und 251
der Praleska-Quelle, mit russischem Wortlaut. Sechs sind Eigenentwurf und als solche gekennzeichnet.

Es fragt nach der Gruppe, nie nach einzelnen Kindern. Es gibt keine Namen, keine Notizen über
Kinder und keine Bewertung. Nichts wird gespeichert: die Antworten liegen im Speicher der Seite
und sind nach dem Neuladen weg. Der Team-Bericht ist eine Textdatei oder ein Ausdruck, den das
Team selbst aufbewahrt.

## Was an der Quelle geprüft ist

Der Katalogeintrag Nr. 85 hatte eine Grundlage, die der Text nicht trägt:

- **„14 Ziele der künstlerischen Wahrnehmung“**: Auf S. 155 steht diese Zahl nicht. Der Eintrag
  wird nicht übernommen.
- **Kriterien für eine Buchecke**: Der Text nennt keine. Die Fragen sind deshalb zum Teil Eigenentwurf.
- **„BFSG-konforme Umsetzung“ und „uk/ru-Titel“**: Das sind Aussagen über Bestände und über
  Barrierefreiheit, nicht über die Quelle. Sie werden nicht übernommen. Eine Konformitätsprüfung
  des Werkzeugs gibt es nicht.

Belegt und mit Seite:

- **S. 155** (Gruppe „Почемучки“, 3–5): Buchecke in der Raumgestaltung, Kinder nehmen ein Buch in
  die Hand und blättern darin, tägliche inhaltliche Begegnung mit dem Buch, Hinweis auf Umschlag,
  Bilder und Text.
- **S. 186** (Gruppe „Почемучки“, 3–5, Selbstbedienung): Bücher gemeinsam mit der Fachkraft wieder einkleben.
- **S. 251** (Gruppe „Фантазеры“, 5–7): Buchecke als Lieblingsort, Vorlesen täglich und
  Fortsetzungsgeschichten, Bücher mit demselben Stoff von verschiedenen Illustratoren,
  selbstgemachte Bücher der Kinder.

Das Alter der Gruppen steht auf S. 6: „почемучки“ von drei bis fünf Jahren, „фантазеры“ von fünf
bis sechs oder sieben.

## Was nicht gebaut wird

Die Katalogeinträge Nr. 84 und Nr. 86 beschreiben einen Beobachtungsbogen pro Kind mit Ampel,
Diagnose-Indikatoren und Bericht. Das widerspricht der Regel dieses Projekts: keine Bewertung von
Kindern, keine Kinderdaten auf dem Gerät. Sie sind in `docs/10` mit Begründung vermerkt.

## Starten

Im Projektordner den lokalen Server starten (`node tools/serve.mjs 8099`) und
`http://localhost:8099/apps/buchecke-check/` öffnen. Zum Drucken: „Bericht drucken“.

## Tests

`node --test apps/buchecke-check/test/` prüft die Daten (Herkunft jeder Frage, keine Felder über
Kinder, keine Eintragsmuster in Texten), die Zählung, das Setzen der Antworten und den Bericht.
Es sind 16 Tests in `test/logik.test.mjs`.
