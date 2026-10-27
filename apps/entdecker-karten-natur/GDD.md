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

- Keine externen Anfragen (docs/02 Z. 22–24): CSP `default-src 'self'; style-src 'self' 'unsafe-inline'` und der Netzwerk-Wächter.
- Nichts wird gespeichert: kein localStorage, kein Cookie. Der Filter lebt nur im Speicher der Seite.
- Keine Bewertung und keine Einstufung von Kindern (docs/02 Z. 141–146, Release-Regel). Keine Eingabefelder für Namen, Notizen oder Beobachtungen.
- Druckbogen (docs/02 Z. 79–82): keine Häkchen, Kästchen, Sterne, Punkte-Zeichen oder Emojis; keine Tages- oder Wochentagsfelder; keine Namenszeile. Gedruckt werden der Blattkopf (Titel, Gruppe, Blattnummer, Ziel, Hinweis für die Fachkraft) und die Karten; die Bedienelemente sind ausgeblendet.
- Keine Bildschirme für Kinder unter 3 Jahren: Projektregel, ohne docs/02-Zeile. Das Werkzeug ist für die Fachkraft.

## 7. Entscheidungen

- **Tierliste:** die sieben Tiere aus der Quellenliste. Die Vorschläge des Katalogs (Igel, Eichhörnchen, Amsel, Reh) sind nicht übernommen, weil die Quelle sie nicht nennt.
- **Anregungen:** Eigenentwurf, jede mit Seitenangabe und Kennzeichnung.
- **Pflanzen:** nur benennen und draußen suchen. Keine Bewegungs- oder Lautanregung.
- **Stoffe:** anfassen und beobachten, mit Quelle S. 51.
- **Blatt:** sechs Karten je A4-Blatt, zwei Spalten, drei Reihen. Gestrichelte Rahmen dienen als Schneidelinien. Kein Bild, kein Ton, kein Foto.
- **Altersangabe:** 1 bis 3 Jahre, aus dem Katalogeintrag (fachkraftgeleitet, offline).
- **Titel:** mit „Tür“ geschrieben (im Katalog als „Tuer“ umschrieben).
- **Kleinteile:** Steine, Sand und Ton tragen auf dem Blatt den Satz „Steine, Sand und Ton nur mit der Fachkraft; kleine Teile von Kleinkindern fernhalten (Eigenentwurf, keine Quellenaussage).“. Der Satz steht nur auf Blättern, die eine dieser Karten enthalten.
- **Pflichtmarkierung:** Jedes gedruckte Blatt mit Seitenangabe trägt unten die Markierung „noch nicht von einem Menschen geprüft“ (Lehre aus Pilot 1). Der Bildschirm-Fuß trägt sie ebenfalls.
- **Fußzeile je Karte:** „Begriff: Quelle S. 51“ und „Beobachtungsanregung: Eigenentwurf“; bei Pflanzen „Benennen: Quelle S. 51“ und „draußen suchen: Eigenentwurf“.

## 8. Tests

40 Tests in zwei Dateien: `test/logik.test.mjs` (Daten, Quelle je Eintrag, Tierliste aus der Quelle, Seitenform, Kennzeichnung und Fußzeile, Filter, Blätter, Sicherheitssatz, Pflichtmarkierung je Blatt, Fehlerweg beim Laden) und `test/regeln.test.mjs` (Projektregeln am Quelltext: keine Felder über Kinder, keine Eingabefelder, keine Speicherung, keine externen Adressen, Netzwerk-Wächter mit Fehlerweg, CSP, keine Druckzeichen, keine Namenszeile im Druck, Blattkopf, Footer-Link 48 px, Pflichtmarkierung je Blatt im Druck, Knopfhöhe 3rem, Zufall nur in `app.mjs`, `aria-live` auf `#app`, verbotene Wörter, keine Bewertung, Fokus nach Neuaufbau, Modellnamen-Freiheit).

## Offen

- Die Auswahl der Tiere (Igel, Eichhörnchen, Amsel, Reh) bleibt offen; die Quelle nennt sie nicht. Eine Ergänzung bräuchte einen eigenen Beleg und eine neue Seitenangabe.
- **Kartenformat:** Karten, Gruppen, Anregungen und Blattaufteilung sind Eigenentwurf und nicht aus der Quelle belegt.
- **Durchsicht durch eine Fachkraft** steht aus: Verständlichkeit, Altersgerechtheit und Ablauf draußen.
- **Sicherheitssatz** zu Kleinteilen (Steine, Sand, Ton; 1 bis 3 Jahre) ist Eigenentwurf; eine Fachkraft soll ihn prüfen.
- **Fehlerweg:** Fehlerstatus, ungültiges JSON und ein Netzausfall (fetch wirft) zeigen im Browser die Meldung „Die Karten konnten nicht geladen werden“. Im Test und im Browser geprüft.
- **Favicon:** Die App hat keins; der Browser fragt `favicon.ico` an und bekommt 404 (A3, Bauauftrag Abschnitt 9).
- Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- **Repo-Zählungen:** Mit dieser App ändern sich die Gesamtzahl der Tests im Wurzel-README und die Zahl der Apps im Impressum. Diese Dateien hat die App nicht geändert; sie müssen nachgezogen werden.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
