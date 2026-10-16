# GDD – Buchecke-Check

## Was es ist

Ein Team-Werkzeug für die Buchecke einer Kita-Gruppe. Es prüft Raum, Bestand, tägliche Buchzeit
und Pflege in fünfzehn Fragen und erzeugt einen Team-Bericht. Es gibt keinen Kinderbildschirm und
kein Eingabefeld, weder für einzelne Kinder noch für freien Text.

## Die tragende Entscheidung 1: Gruppe und Raum, nicht Kind

Der Katalog nannte eine Kriterienliste mit täglicher Buchzeit. Die Quelle beschreibt die Buchecke
als Teil der Gruppe (S. 155, S. 251), nicht als Leistung einzelner Kinder. Das Werkzeug bleibt
darum bei der Gruppe.

Die Prüfung der Daten fängt Felder über Kinder ab (`kindername`, `notiz`, `protokoll` und ähnliche)
und Beschriftungen wie „Notiz:“, „Nachname:“ oder „Entwicklung:“ in Texten. Das ist eine Sperre
gegen Versehen beim Pflegen der Datei. Sie erkennt nicht jeden Satz über ein Kind, etwa „Mia (4 Jahre)
braucht Hilfe“. Die eigentliche Sicherung ist die Bauweise: keine Eingabefelder, und alle Texte
stammen aus einer festen Datei.

## Die tragende Entscheidung 2: nichts wird gespeichert

Die Antworten liegen im Speicher der Seite und sind nach dem Neuladen weg. Der Bericht ist eine
Datei, die das Team selbst speichert, oder ein Ausdruck. Es gibt kein `localStorage`. Das ist eine
eigene Entscheidung und strenger als die Policy: `docs/02` (Z. 25) erlaubt localStorage für
Nutzerdaten mit Löschknopf. Keine Anfragen nach außen (`docs/02`, Z. 22–24). Der
Datenschutz-Korpus-Test sieht die App als speicherfrei.

## Die tragende Entscheidung 3: jede Frage trägt ihre Herkunft

Eine Frage hat entweder „S. N (Gruppe, Alter)“ mit russischem Wortlaut oder „Eigenentwurf“. Eine
Frage ohne eines von beidem wird abgelehnt. Die Prüfung im Repo kontrolliert die Form. Der Wortlaut
der neun Zitate ist einmal von Hand gegen den Quelltext geprüft, Stand 16.10.2026; diese Prüfung
liegt außerhalb des Repos, weil der Quelltext nicht im Repo liegt. Die Abweichung vom Katalog steht
im Werkzeug selbst, nicht nur in der Dokumentation.

## Die Fragen

- **Ort und Zugang** (S. 155, S. 251, Eigenentwurf): Buchecke im Raum, Bücher in die Hand nehmen
  (f1–f4 stammen aus Punkt 11 der Liste auf S. 153–155), Lieblingsort, Sitzplatz und Licht als Eigenentwurf.
- **Tägliche Buchzeit und Begleitung** (S. 155, S. 251): tägliche Begegnung mit dem Buch,
  Hinweis auf Umschlag, Bilder und Text, tägliches Vorlesen mit Fortsetzung.
- **Bestand und Auswahl** (S. 251, Eigenentwurf): Bücher mit demselben Stoff von verschiedenen
  Illustratoren, selbstgemachte Bücher, Familiensprachen als Eigenentwurf.
- **Pflege** (S. 186, Eigenentwurf): gemeinsames Einkleben, Zuständigkeit im Team, regelmäßige
  Prüfung, Aussortieren als Eigenentwurf.

## Bewusst weggelassen

- Das Ampel-Urteil (Katalog Nr. 86) und der Bericht pro Kind (Nr. 84 und Nr. 86). Die Release-Regel in
  `docs/02` (Z. 141–146) verbietet dem Kind eine Bewertung.
- Eine Mengenangabe („mindestens einmal im Monat“): Die Quelle nennt keine Häufigkeit. Das Team
  legt sie fest.

## Offen

Vier früher gebaute Apps vergeben je Kind eine Ampel oder Stufe und speichern diese Einträge in
`localStorage`: wohlfuehl-ampel, entwicklungs-kompass, eingewoehnungs-tagebuch und schulstart-begleiter
(Katalog Nr. 89). Das widerspricht `docs/02` (Z. 141–146). Diese App ändert sie nicht. Die Entscheidung
liegt beim Team.

Zur Live-Region: Der Projekt-Test verlangt `aria-live` auf `#app` in jeder App. Die Antworten bauen die
Seite nicht neu auf; nur die Zustände der Knöpfe, die Bilanz und der Druckbericht ändern sich. Die Bilanz
wird dabei mitgelesen. Meldungen nach dem Speichern laufen zusätzlich über die Region `role="status"`
außerhalb von `#app`.

## Tests

24 Tests in `test/logik.test.mjs`: Daten, Herkunft, Kennungen, Kinderdaten-Ablehnung, Zustandswechsel,
Zählung und Bericht.
