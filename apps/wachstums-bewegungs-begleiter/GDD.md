# Wachsen und Bewegen — Game Design Document

**Nr. 62 der Eltern-Werkzeuge (docs/10). Quelle: Praleska S. 126–127, dazu S. 222 und S. 224–225.**

## 1. Was es ist

Kein Planer und keine Statistik, sondern vier umgedrehte Fragen plus die Orientierungswerte zur
Bewegung mit ihrer Herkunft. Werkzeug für Erwachsene; das Kind sieht keinen Bildschirm, darum keine
`eltern.html`.

## 2. Die tragende Entscheidung: die Fragen sind umgedreht

Die Quelle fragt das Kind nach seinem eigenen Körper – Haltung, Füße, Wachsen, Bewegung – und will
beim Älteren ausdrücklich das Interesse an „mir, meinem Wuchs, Gewicht, meiner Haltung, meinem Fuß,
meinem Herz“ wecken. Diese App dreht jede Frage zur Frage an die Erwachsenen und nennt dazu, wohin
die ursprüngliche Frage gehört.

Der Validator erzwingt die Umdrehung wörtlich: in jedem Block muss „Die Frage an die Erwachsenen
lautet“ stehen. Ohne diesen Satz ist es wieder eine Prüfung am Kind.

## 3. Jede Zahl bei ihrer Quelle – und die Handlungsseite zahlenfrei

`bloecke` und `gelegenheiten` dürfen **keine mehrstellige Zahl** enthalten; `MEHRSTELLIGE_ZAHL`
weist sie ab. Jede Zahl lebt in `bewegungswerte` oder `werteHinweise`, und dort verlangt der
Validator zu jedem Wert eine Quelle **mit Jahreszahl** und eine Einschränkung.

Das ist strenger als nötig und genau deshalb nützlich: eine Zahl, die auf der Handlungsseite
auftaucht, hat ihre Herkunft verloren.

## 4. Die Katalogzahl stimmt nicht

Der Eintrag nennt „WHO/BZgA-Bewegungsempfehlung (180 Min/Tag für 3-5)“. Den Altersblock 3–5 gibt es
in keiner Quelle; die Angabe verschmilzt zwei Dokumente:

* WHO 2019: 3–4 Jahre, ≥180 Minuten jeder Intensität, davon ≥60 Minuten mittel bis hoch.
* WHO 2020: ab 5 Jahren, ≥60 Minuten mittel bis hoch im **Wochendurchschnitt**, plus an 3 Tagen
  intensiv sowie muskel- und knochenstärkend.
* Nationale Empfehlungen 2016 (Rütten/Pfeifer): 4–6 Jahre 180 Minuten und mehr **ohne**
  Intensitätsvorgabe; 6–11 Jahre 90 Minuten, davon 60 aus Alltagsbewegung.

`werteFuerAlter` gibt deshalb für ein Alter **mehrere** Werte zurück, und die App zeigt sie alle.
Für sechs Jahre sind es drei – die Quellen widersprechen sich dort, und das sagt die App, statt zu
wählen.

Dazu stehen die Einschränkungen, die sonst wegfallen: die WHO stuft ihre eigene Empfehlung als
„starke Empfehlung bei sehr niedriger Evidenzqualität“ ein, die 180 Minuten stammen aus einem
Expertenkonsens, die deutschen Empfehlungen sind von 2016 und werden bis Anfang 2027 fortgeschrieben
— „Bewegungsempfehlungen 2025“ gibt es nicht.

## 5. Belege statt Meinung

Die Umdrehung wäre ohne Belege eine Meinung. `fachliches` trägt vier Sätze mit Leitlinienangabe; der
Validator verlangt zu jedem eine Quelle mit Jahr und einen existierenden Block. Der Kern stammt aus
der S2k-Leitlinie „Kindlicher Knick-Senkfuß“ (AWMF-Register 187-053, 2022):

* Ein weicher Knick-Senkfuß gehört in diesem Alter fast immer zur normalen Entwicklung.
* Der schmerzlose, bewegliche Fuß braucht weder Einlagen noch Krankengymnastik; unter sechs Jahren
  ist das ausführliche Elterngespräch der Weg.
* Was die Leitlinie zur Vorbeugung nennt – tägliche Bewegung, weiche Schuhe mit genug Länge und
  Weite, Barfußlaufen auf wechselndem Untergrund –, ist genau die Frage an die Erwachsenen.
* **Der Zehenspitzengang ist in der Leitlinie ein Untersuchungszeichen, keine Übung.** Die Quelle
  schlägt ihn zur Kräftigung vor; dauerhafter Zehenspitzengang kann auf eine neurologische Ursache
  hinweisen. Ein Warnzeichen zur Übung umzudeuten wäre der falsche Weg – deshalb steht er in der
  Ausschlussliste.

## 6. Keine Ampel, keine Körperdaten

`AMPEL` weist Ampel, Punkte und Prozent ab, `KOERPERMASS` weist BMI, Perzentile und jede cm- und
kg-Angabe ab, `EINSTUFUNG` auch die freundlich gemeinte Variante („Ihr Kind bewegt sich zu wenig“).
Alle vier `kein…`-Absätze müssen in der **Gegenrichtung** benennen, was sie ausschließen – ein
Absatz „Das macht diese App nicht“ macht die Daten ungültig.

Gespeichert wird genau ein Tag. Ein Verlauf wäre eine Kurve über ein Kind; `ladeHeute` verwirft
jeden Eintrag, dessen Tag nicht der heutige ist, und das Datum kommt aus der **lokalen** Zeit, nicht
aus `toISOString` (Review Welle 80).

## 7. Druck

Ein Zettel für die Küche: die Orientierungswerte des gewählten Alters samt Quelle und die acht
Gelegenheiten als Liste – **ohne Haken**, weil ein Blatt mit Haken eine Bewertung auf Papier wäre
(docs/02). Die vier Blöcke stehen nicht auf dem Zettel; sie sind zum Lesen, nicht zum Aufhängen.

## 8. Barrierefreiheit

Alle Knöpfe ≥ 48 px (gemessen: keiner unter 44 px), `aria-expanded` + `aria-controls` an den
Blöcken, `aria-pressed` an Alter und Gelegenheiten, Fokus bleibt nach jedem Klick, kein
Querscrollen bei 360 px, `voiceschanged`-Listener fürs Vorlesen.

## 9. Grenzen

* Keine Diagnose, keine Einschätzung, kein Vergleich mit anderen Kindern.
* Keine Aussage zu Kindern mit Behinderung oder chronischer Erkrankung: die WHO-Leitlinie 2019
  schließt diese Gruppen ausdrücklich aus ihrem Geltungsbereich aus.
* Keine Übungen. Was Füße und Haltung angeht, steht in der Leitlinie Bewegung, Schuhwerk und
  Barfußlaufen – nicht ein Übungsprogramm.
