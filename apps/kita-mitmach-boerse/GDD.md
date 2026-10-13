# GDD – Kita-Mitmach-Börse

## Was es ist

Ein Werkzeug für Familien und das Team einer Kita: Welche Angebote aus dem
Familienkapitel der Quelle interessieren die Familien, und wobei können sie mithelfen?
Die Antwort ist eine Datei je Familie, das Team zählt sie zusammen. Es gibt keinen
Server, kein Konto und keine Namen.

## Die tragende Entscheidung 1: keine Namen, kein Freitext

Der Katalogeintrag wollte, dass Eltern „eigene Talente eintragen“. Das ergäbe ein
Verzeichnis von Eltern mit Angaben zu ihnen – und damit genau die Daten, die
`impressum.html` den Familien nicht zusagt. Stattdessen gibt es je Angebot zwei
Häkchen. Die Datei enthält keinen Platz für Text.

## Die tragende Entscheidung 2: die Datei wird geprüft, nicht nur gelesen

Eine Datei mit fremden Feldern (etwa `name`) wird abgewiesen, ebenso eine falsche Art,
eine falsche Version, ein unbekanntes Angebot und ein Wert, der nicht ja oder nein
ist. Damit kann eine Datei nicht unbemerkt Angaben über Personen transportieren. Die
Prüfung ist in `logik.mjs` (`pruefeKoffer`) und ist getestet.

## Die tragende Entscheidung 3: die Zahl 20 ist nicht die Zahl der Quelle

Der Text nennt 13 Formen auf S. 24 und sechs Clubs auf S. 25; die Liste ist offen.
Der Katalog nannte 20 und zusätzlich „Näh-Werkstatt“ und „Großeltern-Klub“. Beides
steht nicht im Text. Die App zählt die Angebote aus den Daten, sie behauptet keine
Gesamtzahl. Die Abweichung steht in `daten/angebote.json` (`quelle.abweichung`).

## Zählung

- Je Familie eine Stimme pro Angebot und Häkchen.
- Dateien mit demselben Code zählen einmal; die zuletzt geladene gilt.
- Die Zählung ist eine Stimmung, keine Erhebung. Zwei Geräte derselben Familie zählen
  doppelt, eine von Hand gebaute Datei zählt mit. Das ist im Team-Bildschirm gesagt.
- Summen zeigen keine Codes und keine Namen. Bei sehr wenigen Familien kann das Team
  selbst entscheiden, die Summen nicht zu zeigen.

## Speicherung

- **Familie:** die eigene Auswahl und ein Zufallscode, in `localStorage` unter einem
  eigenen Schlüssel. Der Löschknopf (Daten-Karte aus `kinder-ui`) entfernt genau diesen
  Schlüssel.
- **Team:** nichts. Geladene Dateien liegen nur im Arbeitsspeicher der offenen Seite
  und sind mit „Geladene Dateien vergessen“ weg.

## Rechtlicher Rahmen

Drei Angaben, je mit Abrufdatum: Art. 14 BayKiBiG (Elternbeirat), § 6 KitaG
Brandenburg (Beteiligung der Eltern), §§ 8, 22a, 45 SGB VIII. Die Anwendung auf eine
Abstimmung über Angebote ist Auslegung; `praxis` sagt das.

## Prüfung

- 12 Tests in `test/logik.test.mjs`: Anzahl und Seiten, kein erfundenes Format, Code,
  Prüfung der Datei, Zählung, Summen ohne Namen.
- Browser bei 360 px: Überlauf 0, Ziele mindestens 44 px, Export nur mit vier Feldern,
  Import, Abweisung, Löschen, keine externen Anfragen. Die einzige Konsolenmeldung ist
  das fehlende `favicon.ico`, das alle Apps im Repository gleich erzeugen.

## Offen

- Eine Kita sollte festlegen, wie die Dateien vom Familien- zum Team-Gerät kommen
  (Stick, Ablage, Abholung). Die App schreibt das nicht vor.
- Ob die Summen je gezeigt werden dürfen, bevor eine Mindestzahl von Familien
  zusammen ist, entscheidet die Einrichtung; die App legt keine Zahl fest.
