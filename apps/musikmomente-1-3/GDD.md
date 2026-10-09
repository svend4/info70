# GDD: Musikmomente 1–3

**Katalog:** docs/10 («Praleska»), Abschnitt «Eltern-Werkzeuge», Nr. 55.
**Quelle:** Praleska (Пралеска), Minsk 2007, «Музыкальная деятельность», S. 78–80.
**Zielgruppe:** Erwachsene (Eltern, Kindertagespflege, Krippe); Bezugskind 1–3.
**Form:** Erwachsenen-Katalog mit Werklisten und Druckansicht. Kein Audio.

## 0. Die Quelle, nachgezählt

Der Katalog nennt „14 Lernziele, 70 Repertoire-Stücke, Ё-Differenzierung“.
Alle drei Angaben sind in `PRALESKA.pdf` (Branch `main`) nachgezählt und
stimmen exakt:

- **14 Ziele** auf S. 78–80: 5 allgemeine, 6 zum Hören, 3 zum Singen — die
  drei, die noch auf S. 80 stehen.
- **70 Hör-Stücke**: 23 vokale, 47 instrumentale. Der 48. Titel der
  Instrumentalliste, «Сказка о глупом мышонке», ist die Quelle von vier
  Gerchik-Stücken und kein eigenes Stück.
- **Ё** ist in der Fußnote der Quelle wörtlich erklärt: «задачи для детей с
  относительно высоким уровнем музыкальности» — Aufgaben für Kinder mit
  relativ hohem Niveau der Musikalität.

Die sechs Hörziele der Quelle sind: Freude und emotionale Antwort;
vielfältige Musik verschiedener Epochen; kontrastierende Instrumentenklänge
unterscheiden (дудочка—барабан, треугольник—барабан, металлофон—триола);
Eindrücke ausdrücken; erste Vorstellung der primären Gattungen Marsch, Tanz,
Lied **auf der Ebene des Wiedererkennens**; Höhe, Dauer und Stärke
differenzieren.

## 1. Tragend: Gemeinfreiheit wird gerechnet, nicht behauptet

Kein Werk trägt ein Feld `gemeinfrei`. `istGemeinfrei()` rechnet die
Schutzdauer gegen `stand.jahr`, und `pruefeDaten()` lehnt jedes Werk ab, das
sie nicht als frei ausrechnen kann — die App lädt dann nicht. Vorbild ist
`apps/kunst-entdecker`, wo dieselbe Regel über die Lizenz läuft („Lizenz ist
nicht CC0 – nicht verwendbar“).

Drei Wege mit eigener Arithmetik:

1. `komposition` — 70 Jahre nach dem Tod, gerechnet ab dem Ende des
   Todesjahres (§ 64 UrhG). `todesjahr` ist Pflicht.
2. `unbekannter-urheber` — 70 Jahre nach dem Erscheinen (§ 66 UrhG), für
   Werke, deren Urheber nicht feststeht. `erscheinungsjahr` ist Pflicht.
3. `volksweise` — Volksgut hat keinen Urheber mehr. **Aber** ein namentlich
   genannter Satz ist ein eigenes Werk, darum ist das Feld `bearbeiter`
   verboten; mit Bearbeiter rechnet die Funktion das Stück als nicht frei.

Die Grenze liegt am Stand 2026 bei **1955**, und das ist kein Rechenspiel:
**Gretschaninow starb 1956** und steht in der Quellliste — am 9. Oktober 2026
ist er noch nicht frei, erst ab 1. Januar 2027. Nicht frei sind außerdem
Schostakowitsch (1975), Kabalewski (1987), Swiridow (1998) und Gerchik
(2007). Von den 15 namentlich genannten Komponisten der Quelle bleiben
dadurch neun, und von 70 Stücken stehen 11 hier.

## 2. Werk und Aufnahme fallen auseinander

Bei Musik ist das die Lücke, in die man ohne Nachdenken tritt: eine
gemeinfreie Komposition macht eine **Einspielung** davon nicht frei, denn
Tonstudio und Mitwirkende haben eigene Rechte. Im Korpus stand dazu bisher
kein Wort — alle Klang-Apps synthetisieren lokal und umgehen die Frage. Weil
diese App keine Audiodatei liefert, ist das technisch gelöst; es muss aber
**im Text stehen**, sonst liest die Werkliste wie eine Freigabe.

Dazu: kein Label, kein Interpret, kein Shop, kein Streaming-Dienst (werbefrei,
docs/02). Nur Werk und Komponist.

## 3. Eine falsche Zuschreibung wird genannt, nicht übernommen

Die Quelle führt «Колыбельная песня» unter Mozarts Namen. Das ist das
bekannte Wiegenlied „Schlafe, mein Prinzchen, schlaf ein“, und es gilt heute
als falsche Zuschreibung — in Mozarts Werkverzeichnis steht es nur im Anhang
der zweifelhaften Stücke; als Urheber wird meist Bernhard Flies genannt,
zeitweise Friedrich Fleischmann, sicher ist es nicht. In den Daten steht
darum **kein Komponistenname**, sondern das Erscheinungsjahr 1795, die Art
`unbekannter-urheber` und ein Feld `zuschreibung`, das die Lage erklärt.
Gemeinfrei ist das Stück trotzdem — über § 66, nicht über § 64.

## 4. Hier wird nichts abgefragt

Das Genre-Erkennen abzufragen ist `apps/musik-detektive` (4–6, Ko-Nutzung),
hoch gegen tief und laut gegen leise ist `apps/klang-detektive` (ab 3). Beide
synthetisieren ihre Klänge selbst und haben Punkte bzw. einen Rekord. Diese
App stellt vor und bewegt; ein Kind, das ein Genre nicht erkennt, hat nichts
verfehlt. Das Prüfvokabular ist in **beiden** Textregistern gesperrt.

Die Quelle selbst gibt das her: sie verlangt die Gattungen ausdrücklich nur
„auf der Ebene des Wiedererkennens und des Ausführens entsprechender
Bewegungen“ — nicht als Abfrage.

## 5. Das Ё der Quelle ist nicht übernommen

Dort bezeichnet es Aufgaben für Kinder mit „relativ hohem Niveau der
Musikalität“: eine Einteilung von Kindern nach Fähigkeit. Nach docs/02 ist
das ausgeschlossen, und es ist genau das Feld, in dem die europäische
KI-Verordnung das Einordnen von Kindern nicht zulässt. Aus der Idee ist eine
**Vertiefung** geworden, die an einer beobachteten Handlung hängt:
`wennDuSiehst` muss mit „Ihr Kind …“ beginnen und eine Handlung benennen; der
Validator weist Formulierungen ab, die stattdessen eine Eigenschaft des
Kindes beschreiben (`begabt`, `talentiert`, `Niveau`, `musikalisches Kind`).
Und jede Vertiefung muss in `nichtAls` selbst sagen, was sie nicht ist.

## 6. Zwei Register im Text

Die Lehre aus Welle 77, und sie hat beim Bau dieser App zweimal zugeschlagen.

- **Anweisung** (`wasDuTust`, `ohneWorte`, `dannProbiere`): hier ist eine
  Zahl eine Wiederholungs- oder Zeitvorgabe und ein Taktwort eine Forderung.
  Die scharfen Netze `ABZAEHLEN` und `TAKT` laufen nur hier.
- **Beschreibung** (`wasDeinKindVielleichtTut`, `woran`, `wasDuBemerkst`):
  hier ist eine Zahl eine Tatsache — „drei Töne abwärts“ beschreibt die
  Melodie von „Schlaf, Kindlein, schlaf“ — und ein Taktwort eine Verneinung:
  „Es wird nicht im Takt sein, und das muss es auch nicht.“ Genau dieser Satz
  ist der Grund für die App, und ein Netz auf das Wort hätte ihn verboten.

Zusätzlich gilt in beiden Registern: `TAKT_FORDERUNG` — der Takt darf
beschrieben und verneint, aber nirgends **verlangt** werden; das Verbot zielt
auf die Konstruktion mit Modalverb, nicht auf das Wort.

`ABZAEHLEN` ist auf die Konstruktion verengt (Ziffer, `-mal`-Form,
Zeiteinheit). Eine **Menge von Material** bleibt erlaubt, sonst wäre „zwei
Stücke hintereinander anstellen“ verboten — also die Anweisung, die den
Kontrast überhaupt hörbar macht.

## 7. Der behauptete Kontrast muss in den Daten liegen

`ACHSEN` nennt für jedes Kontrastpaar, woran der Unterschied nachzurechnen
ist. Vier Achsen laufen über die `eigenschaft` beider Werke (hoch/tief,
laut/leise, lang/kurz, schnell/langsam), die fünfte über die `gattung`
(Marsch/Tanz). Ein Paar, dessen Achse in den Werken nicht auseinanderliegt,
ist ein Datenfehler. In Welle 77 klangen drei Karten gleich, obwohl der Text
einen Unterschied behauptete — hier ist das nicht ausdrückbar.

## 8. Der Altersfilter — und der Fehler, der beim Bau auftrat

`BAENDER` sind die Werte, die ein Moment in den **Daten** trägt; „1-3“ heißt
dort „gilt über die ganze Spanne“. `FILTER` sind die **Knöpfe**, und dort ist
`alle` keine Spanne, sondern „zeig mir alles“. Solange beides dieselbe Liste
war, gab „Alles zeigen“ vier Momente heraus, während „2-3 Jahre“ sechs zeigte
— der kumulative Fehler aus Welle 78, eine App später und in anderer Gestalt.
Die Browser-Probe hat ihn gefunden, kein Test.

Drei Invarianten halten es jetzt (docs/02): `alle` zeigt genau alles, kein
Filter zeigt mehr als `alle`, und **jedes Band hat mindestens einen eigenen
Moment**. Die dritte Invariante fand beim Bau sofort eine zweite Lücke: für
1–2 Jahre gab es keinen eigenen Moment, der Knopf wäre eine Kopie von „alle“
gewesen. Daraus ist `m-auf-dem-arm` entstanden — die Form, die in diesem
Alter trägt.

## 9. Was fehlt, und warum

- **Kein Audio.** Keine Dateien, keine Oszillatoren.
- **Keine Tagesstatistik, keine Ampel, kein Haken.** Ein Hör-Ritual zu
  protokollieren wäre ein Protokoll über ein Kind — und es ist das Revier
  einer anderen, noch nicht gebauten Katalog-Einheit.
- **Keine Liedtexte.** Die Felder `liedtext`, `text` und `strophe` sind
  verboten; eine Zeile fremden Textes wäre eine Übernahme.
- **Keine dB-Zahl.** Die Lautstärkeregel ist die Zimmerstimme: wer sich im
  selben Raum ohne Stimmheben unterhalten kann, hat es richtig eingestellt.
  Eine Zahl, die man ohne Messgerät nicht prüfen kann, hilft nicht.
- **Keine Kopfhörer.**
- **Keine Werklisten in anderen Sprachen.** Kyrillisch ist nur im
  Originaltitel und in der Quellenangabe erlaubt, und nichts Kyrillisches
  wird vorgelesen.
- **Keine Werkangabe (Opus, KV, Satz).** Eine solche Angabe ist nach docs/02
  eine Fundstelle und dürfte nur mit Prüfvermerk dastehen. Geprüft ist die
  Seitenangabe der Quelle, nicht jede Opuszahl — also steht keine da.

## 10. Abweichung vom Katalog

Der Katalog verlangt „Repertoire auf gemeinfreie Klassik umgestellt“ und
nennt Mozart, Beethoven, Haydn, Schumann und Saint-Saëns als „bereits im
Original-Kanon“. Das stimmt, aber es ist unvollständig: der Kanon enthält
ebenso Komponisten, die **nicht** frei sind, und die Angabe „gemeinfreie
Klassik“ hätte sich nicht von selbst erfüllt. Darum rechnet die App.

Umgekehrt steht die Nachbar-Einheit Nr. 54 (`vorlese-kompass`) auf der
Gegenposition: sie hat ihre „kuratierte Liste gemeinfreier Titel“ bewusst
**nicht** gebaut und nennt nur Buchtypen, mit der Begründung „keine Werbung,
kein Lizenz-Risiko“. Nr. 55 nennt Werke. Der Unterschied ist tragbar, weil
hier die Freiheit jedes einzelnen Titels nachgerechnet wird und weil Werk und
Aufnahme ausdrücklich getrennt sind — beides konnte Nr. 54 für Buchtitel so
nicht leisten.

Die belarussischen Volksmelodien des Repertoires (11 Titel) sind nicht
übernommen; der Katalog sieht ihren Ersatz durch deutsche oder ukrainische
Volkstänze vor. Übernommen ist eine ukrainische («Коло»); deutsche
Volksweisen stehen als Wiegenlieder dabei. Ein eigener Moment lädt
ausdrücklich dazu ein, die Musik der eigenen Familie zu hören — und sagt,
dass die App dazu keine Liste führt.

## 11. Politik-Konformität (docs/02)

- [x] Keine Werbung, keine Käufe, keine kommerziellen Links — und keine
      Bezugsquelle im Text (eigenes Netz `BEZUGSQUELLE`).
- [x] Keine externen Anfragen: CSP `default-src 'self'` plus
      `installiereNetzwerkWaechter()`; keine URL in den Daten.
- [x] Keine personenbezogenen Daten: die App speichert **nichts**, also auch
      keinen Löschknopf nötig.
- [x] `hilfeInsel` nicht eingebunden: Fachlernen Musik, kein Risikothema —
      dieselbe Einordnung wie `musik-detektive` und `klang-detektive`.
- [x] Mobile-first ab 360 px, Touch-Ziele ≥ 48 px, Vorlesen nur mit
      geräteinterner Stimme, Impressum im Fuß.
- [x] Druckknopf ⇒ eigenes `druck.css`; das Blatt trägt keine Haken, Punkte,
      Sterne, Tagesfelder und keine Namenszeile. Was für jeden Moment gilt
      (Lautstärke, Abbruch, Werk/Aufnahme), steht in einem Nur-Druck-Block,
      weil das Vorwort nicht mitgedruckt wird.
- [x] Altersangabe steht im Schema (`altersband`), nicht nur im Satz.
- [x] Kein Scoring, kein Ranking, keine Einteilung von Kindern.

## 12. Tests

`test/logik.test.mjs` (19): Daten gültig; Gemeinfreiheit gerechnet statt
behauptet (mit vier Gegenproben: Feld `gemeinfrei`, Todesjahr 1956, fehlendes
Todesjahr, Volksweise mit Bearbeiter); die Grenze liegt genau bei 1955 und der
Satz sagt es; die falsche Zuschreibung ist genannt und Mozart steht nicht als
Komponist; hier wird nichts abgefragt (Gegenprobe in beiden Registern); zwei
Register für Zahlen — in der Beschreibung erlaubt, in der Anweisung nicht,
**und** die Gegenprobe, dass eine Materialmenge erlaubt bleibt; Takt
verneinen erlaubt, verlangen nicht (beide Richtungen); das Kontrastpaar trägt
seinen Kontrast (Gegenproben für Eigenschafts- und Gattungsachse und für ein
Werk gegen sich selbst); der Altersfilter mit den drei Invarianten; keine
Bezugsquelle, kein Wirkversprechen (und das zurückweisende Feld darf es
nennen); Werk und Aufnahme getrennt, auch auf dem Papier; Kyrillisch nur im
Originaltitel, nichts davon vorgelesen; die Vertiefung hängt an einer
Handlung; die Quellbilanz wird nachgerechnet (drei Gegenproben); kein totes
Werk und keine leere Gattung; jeder Moment lässt das Kind offen und erlaubt
das Aufhören; Lautstärke ohne Messgerät und Kleinteile benannt; Druckblatt und
Politik; Hilfsfunktionen.
