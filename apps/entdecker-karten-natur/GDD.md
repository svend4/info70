# Entdecker-Karten: Tiere und Pflanzen vor der Tür (Kurz-GDD)

## 1. Warum

Fachkräfte in der Kita gehen mit Kindern draußen auf Beobachtungsgang. Dafür fehlt oft ein kleines Kartenset, das sich ohne Gerät ausdrucken lässt und einen belegten Ausgangspunkt gibt. Die Quelle (Praleska, S. 50 bis 51) nennt als Ziel, Tiere und Pflanzen der nächsten Umgebung mit allen Sinnen wahrzunehmen. Dafür liefert das Werkzeug die Karten.

## 2. Wer und Versprechen

Nutzerin und Nutzer sind Fachkräfte. Kinder im Alter von 1 bis 3 Jahren beobachten, sie bedienen das Werkzeug nicht. Das Versprechen: ein Blatt mit sechs Karten zum Ausschneiden. Jede Karte nennt einen Begriff und ein bis drei Dinge zum Beobachten, jeweils mit Seitenangabe.

## 3. Engine und Ablauf

Die Engine ist ein filterbares Kartenset mit Druckansicht. Ablauf: Gruppe wählen, Vorschau prüfen, Kartenbogen drucken, ausschneiden, in die Materialkiste legen. Technik: Vanilla-ES-Module, `packages/kinder-ui` (Hilfsfunktion `el`), `packages/kinderschutz` (Netzwerk-Wächter), `druck.css` mit `@media print`.

## 4. Lernziele (für die Fachkraft, prüfbar)

1. Die Fachkraft wählt eine Gruppe und druckt einen Kartenbogen.
2. Sie nennt zu einer Tierkarte drei Beobachtungen (sehen, hören, bewegen), ohne ein Kind zu bewerten.
3. Sie weicht bei einem Tier, das draußen nicht zu sehen ist, auf ein Bild oder die Nachahmung des Lauts aus (Eigenentwurf).

## 5. Inhalt

Das Kartenset hat 19 Karten: 7 Tiere, 3 Pflanzen, 6 Stoffe, 3 Jahreszeiten. Alle Karten stehen auf S. 51, das Ziel auf S. 50. Jede Karte hat Gruppe, Titel, Seite und Anregungen. Jede Anregung trägt Seite und Kennzeichnung (S. 51, Eigenentwurf). Das Schema steht in `daten/karten.json`. Dort trägt jede Gruppe ihre Quellenangabe.

## 6. Politik (docs/02)

- Keine externen Anfragen: CSP `default-src 'self'; style-src 'self' 'unsafe-inline'` und der Netzwerk-Wächter.
- Nichts wird gespeichert: kein localStorage, kein Cookie. Der Filter lebt nur im Speicher der Seite.
- Keine Bewertung und keine Einstufung von Kindern. Keine Eingabefelder für Namen, Notizen oder Beobachtungen.
- Druckbogen: keine Häkchen, Kästchen, Sterne, Punkte-Zeichen oder Emojis; keine Tages- oder Wochentagsfelder; keine Namenszeile. Gedruckt werden nur die Karten, die Bedienelemente sind ausgeblendet.
- Kein Kinderbildschirm.

## 7. Entscheidungen

- **Tierliste:** die sieben Tiere aus der Quellenliste. Die Vorschläge des Katalogs (Igel, Eichhörnchen, Amsel, Reh) sind nicht übernommen, weil die Quelle sie nicht nennt.
- **Anregungen:** Eigenentwurf, jede mit Seitenangabe und Kennzeichnung.
- **Pflanzen:** nur benennen und draußen suchen. Keine Bewegungs- oder Lautanregung.
- **Stoffe:** anfassen und beobachten, mit Quelle S. 51.
- **Blatt:** sechs Karten je A4-Blatt, zwei Spalten, drei Reihen. Gestrichelte Rahmen dienen als Schneidelinien. Kein Bild, kein Ton, kein Foto.
- **Altersangabe:** 1 bis 3 Jahre, aus dem Katalogeintrag (fachkraftgeleitet, offline).
- **Titel:** mit „Tür“ geschrieben (im Katalog als „Tuer“ umschrieben).

## 8. Tests

31 Tests in zwei Dateien: `test/logik.test.mjs` (Daten, Quelle je Eintrag, Seitenform, Kennzeichnung, Filter, Blätter) und `test/regeln.test.mjs` (Projektregeln am Quelltext: keine Felder über Kinder, keine Eingabefelder, keine Speicherung, keine externen Adressen, Netzwerk-Wächter, CSP, keine Druckzeichen, keine Namenszeile im Druck, `aria-live` auf `#app`, verbotene Wörter, keine Bewertung, Modellnamen-Freiheit).

## Offen

- **Auswahl der Tiere:** redaktionelle Entscheidung. Ergänzen oder nicht: Igel, Eichhörnchen, Amsel, Reh? Die Quelle nennt sie nicht. Eine Ergänzung bräuchte einen eigenen Beleg und eine neue Seitenangabe.
- **Kartenformat:** Karten, Gruppen, Anregungen und Blattaufteilung sind Eigenentwurf und nicht aus der Quelle belegt.
- **Durchsicht durch eine Fachkraft** steht aus: Verständlichkeit, Altersgerechtheit und Ablauf draußen.
- **Repo-Zählungen:** Mit dieser App ändern sich die Gesamtzahl der Tests im Wurzel-README und die Zahl der Apps im Impressum. Diese Dateien hat die App nicht geändert; sie müssen nachgezogen werden.
