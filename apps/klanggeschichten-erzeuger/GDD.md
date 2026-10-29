# Kurz-GDD: Reim- und Klanggeschichten-Erzeuger 🎭

**Zielgruppe:** Eltern und Kindertagespflege, Kinder von 1 bis 3 Jahren.
Werkzeug für Erwachsene; das Kind sieht keinen Bildschirm, darum keine
`eltern.html`. Die App speichert nichts.
**Quelle:** Praleska 2007, S. 80–81 «Пение» (Abschnitt
«Песенно-игровое и песенно-инструментальное творчество», 4 Ziele) und S. 86
«Игра на музыкальных инструментах» (6 Ziele). Katalog docs/10, Nr. 59.

## 1. Alles ist Eigenproduktion – und das ist geprüft, nicht behauptet

Kein überliefertes Fingerspiel, kein Liedtext, keine Strophe, auch nicht in
Teilen. Der Grund ist nicht Höflichkeit: bei vielen bekannten Texten ist nicht
ohne Weiteres zu klären, ob eine Fassung frei ist – an Sammlung, Bearbeitung
und Melodie können eigene Rechte bestehen.

Prüfbar gemacht ist das über die **Endlichkeit des Ausgaberaums**:
`alleTexte()` zählt alle 6 Stoffe × 3 Formen × ihre Umfänge × 8 Varianten auf,
das sind **288 Texte mit 1776 Zeilen**, und ein Test vergleicht jede Zeile
gegen `bekannteAnfaenge`, eine Liste von 27 bekannten deutschen Reim- und
Liedanfängen. Derselbe Test schmuggelt einen solchen Anfang in eine Vorlage und
prüft, dass die Probe ihn findet – eine Sperre, die nichts mehr findet, wäre
keine.

## 2. Deterministisch

`Math.random` kommt nicht vor; der Zufall hängt an `(stoff, form, umfang,
variante)` über eine kleine Hashfunktion. Dieselbe Auswahl gibt immer denselben
Text – sonst fände niemand den Reim wieder, der gestern gut lief, und der
Ausgaberaum wäre nicht aufzählbar. Die Variante läuft im Kreis (8 Schritte).

> **Falle A, siebzehntes Mal, und wieder im Test.** Der Test prüfte
> `logikQuelle` auf `Math.random` – und traf den KOMMENTAR, der es verbietet.
> Geprüft wird jetzt die Datei ohne Kommentare.

## 3. Drei Formen, jede mit einer computergeprüften Zusage

| Form | Zusage | Prüfung |
|---|---|---|
| Klanggeschichte | „es braucht kein Instrument“ | jede Figur trägt `koerperklang`; die Zahl der Bilder ist die bestellte |
| Frage und Antwort | „die zweite Zeile reimt sich“ | `reimtSich()` rechnet nach: gemeinsame Endung ≥ 2 Zeichen mit einem Vokal darin; dasselbe Wort gilt nicht |
| Kettenreim | „jede Zeile nimmt die davor mit“ | Relativpronomen = Artikel des eigenen Nomens; jede Zeile länger als die davor |

> **Was die Reimprobe beim Bau gefunden hat.** Zwei meiner Paare reimten sich
> nicht („schaut/kaum“, „mit/Schritt“) – beide umgeschrieben. Und eine erste,
> strengere Fassung der Regel (der Vokal müsse am ANFANG der gemeinsamen
> Endung stehen) verwarf „rauf/drauf“, einen echten Reim. Die Regel ist keine
> Verslehre, sondern ein Stolperdraht gegen die eigene Nachlässigkeit.

## 4. Keine Einteilung von Kindern

Die Fußnote auf S. 79 der Quelle sagt, was ihr Zeichen bedeutet: „Aufgaben für
Kinder mit relativ hohem Niveau der Musikalität“. Zwei der zehn Ziele dieser
beiden Abschnitte tragen es – darunter **genau die Märchen-Improvisation**, auf
die der Katalogeintrag zielt. Übernommen ist die Aufgabe, nicht die Einteilung:
jede Form nennt `woranSieSehen`, also eine beobachtbare Handlung.

Das Netz `EINTEILUNG` hat **kein** abschließendes `\b` bei den Adjektiven:
`musikalisch\b` kann „musikalische“ nicht treffen, weil zwischen „h“ und „e“
keine Wortgrenze liegt – dieselbe Falle wie `\b` neben einem Umlaut (docs/02).
Der Test hat das beim Bau gefunden.

## 5. Die Märchen der Quelle: die FORM, nicht der Text

«Курочка Ряба» und «Репка» sind als Stoff Volksgut, eine bestimmte Nachdichtung
ist es nicht, und die Grenze lässt sich von außen nicht sicher ziehen.
Übernommen ist die Form der **wachsenden Kette**; die Ketten hier sind eigene
(der Eimer → der Hahn → die Katze → der Hund → die Gans).

## 6. Was nicht übernommen ist

- **Das Repertoire beider Abschnitte** – überwiegend nicht gemeinfrei; bei
  einem genannten Stück steht der Text von S. Marschak († 1964).
- **Die Instrumentenliste** (Flöte, Trommel, Glöckchen, Xylophon,
  Metallophon): in einer Eltern-App ein Einkaufszettel, und bei unter
  Dreijährigen kommt die Kleinteilgefahr dazu – dafür gibt es Nr. 56.
- **uk/ru-Fassungen**: ein Reim, der im Deutschen trägt, trägt in einer anderen
  Sprache nicht, und eine ungegengelesene Übersetzung wäre eine Behauptung.
- **Jedes Wirkversprechen** zur Sprachentwicklung.
- **Jede Minuten- und Wiederholungszahl**; das Maß ist das Abwenden.
- **Jede Dezibelzahl**; die Regel ist die Zimmerstimme wie in Nr. 55.

## 7. Politik-Konformität (docs/02)

- werbefrei, ohne Konten, ohne externe Anfragen;
- **kein localStorage** – wer einen Text behalten will, druckt ihn;
- deutsche UI, russisches README, deutsches GDD;
- mobile-first, 360 px ohne Querscrollen, Knöpfe ≥ 48 px;
- `Vorlesen` nur mit Gerätestimme, mit `voiceschanged`-Listener;
- Druck über eigenes `druck.css` in **Vorlesegröße** (14pt, Zeilenabstand 1.6),
  ohne Haken, Namenszeile und Stern;
- kein `<input>`;
- Impressum im Fuß.

## 8. Tests

`node --test apps/klanggeschichten-erzeuger/test/logik.test.mjs` (18 Tests),
darunter die vollständige Durchzählung des Ausgaberaums, die Reimprobe über
alle 18 Paare, die Grammatikprobe über alle 24 Kettenglieder, die Probe auf
kleine Satzanfänge über alle 1776 Zeilen und Gegenproben für jede Zusage.

## Vorlesen (Entscheidung 28а)

Keine Vorlese-Pflicht. Dieses Werkzeug richtet sich an Erwachsene. Die Zeile „есть озвучивание“ der Checkliste in `docs/02-anforderungen.md` gilt für Kinder-Apps (Ergänzung 28а vom 27.10.2026, am 29.10.2026 in die GDD übernommen).

## Seitenangaben (Serie C, Pilot 29.10.2026)

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

Geprüft wurden alle Seitenangaben dieser Datei gegen die Textkopie der Pralęska (`tools/app-seiten-pruefen.mjs`, Urteil je Angabe im Lauf vom 29.10.2026). Das ist eine maschinelle Prüfung, keine Prüfung durch einen Menschen.

Ergebnis: 21 Angaben in 31 Fundstellen; drei Angaben waren falsch, alle drei sind korrigiert:

- «Пение» steht auf S. 80, nicht auf S. 81. Der Abschnitt mit den 4 Zielen bleibt auf S. 81, daher jetzt „S. 80–81“. Geändert in README, GDD, app.mjs (Kommentar), logik.mjs (Kommentar), daten/stoffe.json und package.json. Vorher überall „S. 81“ für «Пение».
- Die Fußnote zum Zeichen steht auf S. 79, nicht auf S. 80. Geändert in README, GDD, app.mjs (Kommentar), logik.mjs (Prüfung und Kommentar), test/logik.test.mjs (Prüfung), daten/stoffe.json und package.json. Vorher überall „S. 80“ für die Fußnote.
- „Dudelsack“ war eine falsche Übertragung von дудочка. Gemeint ist eine einfache Flöte (S. 79, 86, 87). Geändert zu „Flöte“ in GDD und daten/stoffe.json.

Die alten Angaben stehen hier, damit der Verlauf nachvollziehbar bleibt.
