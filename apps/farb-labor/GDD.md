# Kurz-GDD: Farb-Labor 🎨

**Einheit aus Katalog:** docs/10 (Praleska), Abschnitt „Ko-Nutzung“, Nr. 21 —
«Farb-Labor».
**Engine:** eigener datengetriebener Simulator (bewusst **nicht** `quiz-kern`:
kein Rekord, keine Punkte, keine Ränge). Zielgruppe: 5–7 gemeinsam mit einem
Erwachsenen.

## 1. Zwei Orte, zwei Ergebnisse

Ein Bildschirm **leuchtet** und mischt Licht *additiv* — rotes plus grünes
Licht gibt Gelb, alle drei geben Weiß. Ein Farbkasten leuchtet nicht: jede
Buntfarbe nimmt dem auffallenden Licht etwas weg, zwei Buntfarben werden
dunkler und stumpfer — rot plus grün gibt **Braun**.

Die gefährlichste Bauweise wäre, *eine* Mischregel zu rechnen und für beide
Welten zu benutzen. Das Kind entdeckte am Bildschirm „Rot und Grün macht
Gelb“, trüge es an den Maltisch, bekäme Braun — und der Erwachsene
korrigierte die **richtige** Beobachtung des Kindes als Fehler. Das ist der
schädlichste mögliche Ausgang dieser App.

Für 5–7 ist „additiv vs. subtraktiv“ als Begriffspaar nicht haltbar. Haltbar
sind **zwei Orte**: „am Bildschirm“ und „im Farbkasten“. Eine
Ortsunterscheidung können Fünfjährige, eine Systemtheorie nicht.

## 2. Die Asymmetrie steht im Schema

Jede Mischung trägt `traeger`:

| `traeger` | Darf gerechnet werden? | Pflichtfelder | Validator |
|---|---|---|---|
| `licht` | **ja**, es ist nachprüfbar | `wasPassiert` | `istAdditiv`: Ergebnis = geklammerte Summe im linearen Licht, **und** heller als beide Zutaten |
| `pigment` | **nein**, Redaktionswert | `mengeAendert`, `giltFuer`, `wennAnders`, `suchauftrag`, `gespraech` | `istSubtraktiv`: Ergebnis **dunkler** als die hellere Zutat |

`#FF0000 + #00FF00 = #FFFF00`, `#FF0000 + #0000FF = #FF00FF`,
`#00FF00 + #0000FF = #00FFFF` — exakt, der Test rechnet es nach.

| Pigment-Mischung | L(Zutaten) | L(Ergebnis) |
|---|---|---|
| Gelb + Blau → Grün | 0,579 / 0,068 | 0,155 |
| Gelb + Rot → Orange | 0,579 / 0,165 | 0,278 |
| Rot + Blau → Violett | 0,165 / 0,068 | 0,068 |
| Rot + Grün → Braun | 0,165 / 0,155 | 0,072 |

`app.mjs` enthält weder Kanalarithmetik noch `mix-blend-mode` — ein Test
verbietet beides im Anwendungscode. Die Helligkeitsrechnung lebt
ausschließlich im Validator.

Pigmentwerte sind **Richtung, nicht Messung**: `herkunftDerWerte` sagt das
selbst (Pflichtfeld, Validator prüft das Wort „Messung“), und `wennAnders`
hält es im Kindertext („sieht dein Grün anders aus? Dann stimmt dein Grün“).

## 3. Die tragende Invariante: dasselbe Paar an beiden Orten

Mindestens ein Farbton-Paar muss in **beiden** Trägern vorkommen und dort
**verschieden** ausgehen — sonst behauptet die App stillschweigend doch eine
einzige Mischregel. Ist-Stand: `rot+gruen` → Licht Gelb / Pigment Braun, und
`rot+blau` → Licht Pink / Pigment Violett. Daraus wird ein eigener
Rätsel-Bildschirm: *beide* Antworten sind richtig, es kommt auf den Ort an.
Die Karten in `zweiOrte` müssen auf echte Mischungen mit identischem
Farbton-Paar zeigen (Validator).

Licht und Pigment werden nie **miteinander** gemischt: Zutaten und Ergebnis
einer Mischung müssen demselben Träger gehören.

## 4. Jede Mischung muss erreichbar sein

Der Browser-Durchlauf fand, was kein Test sah: „Rot und Grün gibt Braun“ war
unerreichbar, weil der Kasten nur die drei Grundfarben anbot — Grün liegt da
nicht drin. Deshalb **wächst der Kasten** um die selbst gemischten Farben,
die weiter als Zutat vorkommen (`offeneFarben`), angeboten wird nur, wofür es
ein geprüftes Ergebnis gibt (`partnerFuer` — keine Sackgasse), und
`erreichbareMischungen` bildet den transitiven Abschluss: eine Mischung, bei
der kein Kind je ankommt, lässt `pruefeDaten` scheitern.

Gezählt werden **fertige** Mischungen, nicht verschiedene — sonst käme ein
Kind, das dasselbe Paar dreimal nimmt, nie zum Ende.

## 5. Vier weitere Ehrlichkeiten, alle im Schema erzwungen

| Regel | Warum | Validator |
|---|---|---|
| `mengeAendert` ist Pflicht | „das“ eine Grün gibt es nicht; ein Kind mit anderem Grün hat nichts falsch gemacht | fehlt → Fehler |
| `nurBei` ist Pflicht bei hell/dunkel | Deckweiß und Wasser sind **zwei verschiedene Vorgänge** (Wasser lässt das Papier durchscheinen und hellt auf dunklem Papier gar nicht auf) | fehlt → Fehler; beide Richtungen nötig |
| `warmKalt.geltung === 'ausgemacht'` | warm/kalt ist nicht messbar, und eine blaue Flamme ist heißer als eine gelbe | anderer Wert → Fehler |
| mindestens eine `strittigeFarbe` | eine Einteilung ohne Grenzfall sieht klarer aus als sie ist | leere Liste → Fehler |

Dazu: **„Mischen macht dunkler“ steht nie als allgemeines Gesetz da** — falsch
für Licht und, sobald Deckweiß im Spiel ist, auch im Kasten. Jeder
Pigment-Text mit „dunkler“ muss „Buntfarben“ einschränken (Test).

Und: **„aus drei Grundfarben kann man alle Farben mischen“ ist falsch** in
beiden Systemen. `nichtMischbar` ist Pflichtfeld, muss „nicht alle“ sagen und
nennt Beispiele (Weiß, leuchtendes Türkis, Gold, Neon).

## 6. Kein Quiz bei warm/kalt

Wie die Geschmacksfragen im Design-Entdecker ist `warmKaltBildschirm()` ein
eigener Bildschirm **ohne jeden Begriff von „richtig“**. Es gibt nichts
anzuklicken; gezeigt werden beide Listen, die Grenzfälle und ein
Gesprächsimpuls.

Es gibt auch **keinen Entmischen-Knopf**: Mischen ist nicht umkehrbar, und ein
Schritt-zurück würde das Gegenteil des Wasserglases lehren. Erlaubt ist nur
„von vorn wählen“, solange noch nichts gemischt wurde (Test).

## 7. Barrierefreiheit: Farbe trägt nie allein

Rund jeder zwölfte Junge sieht Rot und Grün anders. Jede Farbfläche ist ein
`role="img"` mit `aria-label` und trägt ihren Namen sichtbar daneben; kein
Schritt verlangt, zwei Farben zu unterscheiden, um weiterzukommen; es gibt
keine Benennungsaufgabe. Der Validator verlangt `name` zu jeder Farbe.
`zeige()` fokussiert `button:not([disabled])` — eine schon gewählte oder
unmögliche Farbe ist deaktiviert, und `focus()` auf einem deaktivierten Knopf
täte nichts.

## 8. Dreisprachig, aber ohne stille 1:1-Liste

`ukName`/`ruName` sind für Pigmentfarben Pflicht. Eine stille Paarliste wäre
sachlich falsch: Ukrainisch und Russisch haben für Blau **zwei**
Grundfarbwörter (синій/блакитний, синий/голубой), und neben фиолетовый stehen
лиловый und сиреневый. Mindestens eine Farbe muss das als `sprachHinweis`
sagen (Validator); die Wörter werden nur angezeigt, nie vorgelesen — ohne
uk/ru-Stimme auf dem Gerät läse eine deutsche Stimme Kyrillisch.

## 9. Ablauf

Erwachsenen-Gate (Ehrlichkeitssatz, „Material bereitlegen“) →
`PRO_SESSION = 3` Pigment-Mischungen (zwei Farben wählen → Vorhersage mit
Namen, Mengenhinweis, Nachmisch-Auftrag, `wennAnders`, Suchauftrag,
Gesprächsimpuls, Farbnamen de/uk/ru) → **Zwei-Orte-Rätsel** (Frage zuerst,
dann „beide Antworten sind richtig“) → Hell/Dunkel (alle drei Karten auf
einem Bildschirm, damit die zwei Wege zum Aufhellen immer beide sichtbar
sind) → warm/kalt → „nicht alle Farben lassen sich mischen“ →
**Bildschirm aus** mit fünf Malaufträgen und sechs Sicherheitshinweisen.

Das Ergebnis wird ausdrücklich als **Vorhersage** gezeigt: „So ungefähr wird
es … Genau siehst du es erst auf dem Papier.“

## 10. Sicherheit des Offline-Teils

Gerät weg, bevor das Wasser kommt; Pinselwasser in ein Schraubglas auf die
andere Tischseite (nie in einen Becher, der wie ein Trinkbecher aussieht);
nur Kinderfarben mit CE (Schulmalfarben EN 71-3, Fingerfarben EN 71-7); nicht
ins Gesicht malen und keine Farbe durch einen Strohhalm pusten; Geschwister
unter drei bekommen etwas Eigenes; Hände waschen vor dem Essen. `sicherheit`
ist Pflichtfeld mit mindestens vier Hinweisen.

## 11. Grenzen, die bewusst bleiben

- Gelb/Rot/Blau sind die Grundfarben des *Malkastens*, nicht die
  physikalisch exakte Dreiheit (Druck: Cyan/Magenta/Gelb). Das steht im
  Eltern-Kompass, nicht im Kindertext — für den Farbkasten ist RYB richtig.
- Primär-/Sekundärfarbe und Farbkreis sind Ordnungsmodelle und bleiben auf
  der Elternseite: Klasseninklusion („Grün ist Mischfarbe **und** Farbe“) ist
  vor etwa 7 unzuverlässig.
- Die Hex-Werte sind für einen Schulmalkasten gewählt und nie an einem
  bestimmten Kasten gemessen. Mit Aquarell, Acryl oder Fingerfarben sehen
  dieselben Mischungen anders aus.

## 12. Tests

`test/logik.test.mjs` (20): Daten gültig; zwei Orte mit verschiedenem
Ergebnis (plus Gegenprobe ohne gemeinsames Paar); Pigment subtraktiv (plus
addiertes Hex); Licht nachgerechnet (plus verdrehtes Hex); die App rechnet
keine Pigment-Mischung; Licht und Pigment nie gemischt; `zweiOrte` vergleicht
dasselbe Paar; alle drei Grundfarben-Paare, keines doppelt; Mengenhinweis und
kein Teile-Verhältnis; warm/kalt als Abmachung mit Grenzfällen; hell/dunkel
mit zwei Wegen und `nurBei`; „dunkler“ nie als Gesetz; „nicht alle Farben“;
Farbe nie einziger Träger; dreisprachig gegen feste Tabelle plus
`sprachHinweis`; Sitzungsgrenze mit Rotation; Ton, Sicherheit und Abschluss
am Papier; Erreichbarkeit jeder Mischung; keine Sackgasse im Angebot; der
Zähler zählt fertige Mischungen.
