# GDD – Buchecke-Check

## Was es ist

Ein Team-Werkzeug für die Buchecke einer Kita-Gruppe. Es prüft Raum, Bestand, tägliche Buchzeit
und Pflege in fünfzehn Fragen und erzeugt einen Team-Bericht. Es gibt keinen Kinderbildschirm und
kein Feld für einzelne Kinder.

## Die tragende Entscheidung 1: Gruppe und Raum, nicht Kind

Der Katalog nannte eine Kriterienliste mit täglicher Buchzeit. Die Quelle beschreibt die Buchecke
als Teil der Gruppe (S. 155, S. 251), nicht als Leistung einzelner Kinder. Das Werkzeug bleibt
darum bei der Gruppe. Die Prüfung der Daten lehnt Felder über Kinder ab (`kindername`, `notiz`,
`protokoll` und ähnliche) und Texte, die wie ein Eintrag über ein Kind aussehen („Notiz: …“).

## Die tragende Entscheidung 2: nichts wird gespeichert

Die Antworten liegen im Speicher der Seite und sind nach dem Neuladen weg. Der Bericht ist eine
Datei, die das Team selbst speichert, oder ein Ausdruck. Es gibt kein `localStorage` und keine
Anfrage nach außen (docs/02). Der Datenschutz-Korpus-Test sieht die App als speicherfrei.

## Die tragende Entscheidung 3: jede Frage trägt ihre Herkunft

Eine Frage hat entweder „S. N (Gruppe, Alter)“ mit russischem Wortlaut oder „Eigenentwurf“. Eine
Frage ohne eines von beidem wird abgelehnt. Die Zitate sind gegen die Seiten der Quelle geprüft
(neun Zitate, alle gefunden). Die Abweichung vom Katalog steht im Werkzeug selbst, nicht nur in
der Dokumentation.

## Die Fragen

- **Ort und Zugang** (S. 155, S. 251, Eigenentwurf): Buchecke im Raum, Bücher in die Hand nehmen,
  Lieblingsort, Sitzplatz und Licht als Eigenentwurf.
- **Tägliche Buchzeit und Begleitung** (S. 155, S. 251): tägliche Begegnung mit dem Buch,
  Hinweis auf Umschlag, Bilder und Text, tägliches Vorlesen mit Fortsetzung.
- **Bestand und Auswahl** (S. 251, Eigenentwurf): Bücher mit demselben Stoff von verschiedenen
  Illustratoren, selbstgemachte Bücher, Familiensprachen als Eigenentwurf.
- **Pflege** (S. 186, Eigenentwurf): gemeinsames Einkleben, Zuständigkeit im Team, regelmäßige
  Prüfung, Aussortieren als Eigenentwurf.

## Bewusst weggelassen

- Das „Ampel“-Urteil und der Bericht pro Kind (Katalog Nr. 84 und 86): Verstoß gegen die Regel
  keine Bewertung von Kindern.
- Die „14 Ziele der künstlerischen Wahrnehmung“: Die Zahl steht auf S. 155 nicht.
- Eine Mengenangabe („mindestens einmal im Monat“): Die Quelle nennt keine Häufigkeit. Das Team
  legt sie fest.

## Tests

16 Tests in `test/logik.test.mjs`: Daten, Herkunft, Kinderdaten-Ablehnung, Zustandswechsel,
Zählung und Bericht.
