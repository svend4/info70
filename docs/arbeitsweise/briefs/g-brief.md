# Brief Strang Г: externe Fakten, nur Liste (Entscheidung Max 12а, 13а, 14в, 15а)

Repo: /home/user/info70. Du änderst KEINE Datei im Repo. Du liest und schreibst nur deinen Bericht (JSON nach Schema).

## Aufgabe
Eine Eingabedatei listet Zeilen aus App-Dateien (Nutzerdateien: HTML, MJS, daten/*.json), die der Zähler externer Fakten
(packages/kinderschutz/src/externe-fakten.mjs) als blockierend zählt: eine positive Behauptung über Recht, Geld (Förderung), Gesundheit
oder eine Norm, ohne Fundstelle und ohne Vermerk. Für JEDE Zeile schlägst du eine Handlung vor. Max entscheidet je Liste; nichts wird
geändert, bevor er „да“ sagt.

Je Zeile: lies die Datei um die Zeile (etwa 15 Zeilen davor und danach, bei JSON das ganze Objekt), verstehe, was behauptet wird und
wo die App es verwendet (Kind sieht es, Erwachsener liest es, Daten für Prüfmuster). Dann wähle genau eine Handlung:

- `quelle` : die Zeile ist eine Behauptung, für die es eine belegbare Quelle gibt; nenne die konkrete Fundstelle (Gesetz, Paragraf, Behörde
  mit Seite oder Dokument) im Feld `quelle_vorschlag`. Nenne nur eine Quelle, bei der du dir sicher bist; sonst wähle `eigenentwurf`.
- `maschinell` : die Norm oder Angabe kann gegen den Wortlaut (zum Beispiel gesetze-im-internet.de) nachgelesen werden; Vermerk
  „maschinell nachgelesen, nicht durch Menschen geprüft“ plus Fundstelle (`quelle_vorschlag`). Setze das nur, wenn du den Wortlaut kennst oder
  über die Suche belegen kannst. Rufe keine Seite ab, die Maschinen nicht lesen dürfen (robots); umgehe das nie.
- `eigenentwurf` : die Zeile ist ein eigener, fachlich nicht geprüfter Text; Vermerk „(Eigenentwurf, fachlich nicht geprüft)“ anhängen
  (Entscheidung 13а für Gesundheit; Inhalt geht nicht verloren).
- `streichen` : die Zeile trägt nichts, was die App braucht, und ist nicht zu belegen; Vorschlag zur Streichung (nur Vorschlag).
- `fehlalarm` : der Zähler irrt (das Wort steht in anderer Bedeutung, die Zeile ist verneint oder ist Prüfmuster); nenne den Grund.

Spezialfälle: spielzeug-check-u3: die Zahlen 54 % und 95 % bleiben mit dem Zusatz „fachlich nicht geprüft“ (Entscheidung 14в), Handlung
`eigenentwurf`. familien-notfall-fahrplan: der Hinweis auf § 164 TKG mit dem Vermerk „maschinell nachgelesen, nicht durch Menschen geprüft“
bleibt (Entscheidung 15а), Handlung `fehlalarm` oder `maschinell` mit Grund „bleibt“.

## Regeln
- Keine neuen Fakten über Recht, Geld oder Gesundheit erfinden. Wenn du eine Quelle nicht sicher kennst: `eigenentwurf` oder `streichen`.
- Medizinische Zahlen und Aussagen über Kinder: im Zweifel `eigenentwurf` (nicht `streichen`, wenn die App sonst Inhalt verliert), und in
  `hinweis` begründen, warum eine fachliche Prüfung nötig ist.
- Kein Modellname, keine Zitate über 6 Wörter aus der Praleska.
- `neuer_text` nur, wenn du den genauen neuen Wortlaut der Zeile vorschlägst (zum Beispiel mit Vermerk am Ende); sonst leer.

## Bericht
Je Zeile genau ein Eintrag mit denselben app, datei, zeile wie in der Eingabe, plus handlung, quelle_vorschlag, neuer_text, grund (ein Satz),
hinweis (leer oder ein Satz für Max). Die Reihenfolge der Eingabe bleibt.
