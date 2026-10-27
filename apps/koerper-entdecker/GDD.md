# Kurz-GDD: Der Körper-Entdecker 🫀

**Einheit aus Katalog:** docs/10 (Praleska) Kinder-Apps Nr. 10 —
«Der Koerper-Entdecker: Was in dir steckt». **Engine:** `quiz-kern`
(Einzel-, Klassen-, Duett- und Staffel-Modus, Vorlesen).
Zielgruppe: 5–7 in Ko-Nutzung, 8–12 eigenständig.

## 1. Kernaussage

Der eigene Körper ist das nächstliegende und zugleich unsichtbarste
Forschungsfeld: Man spürt das Herz klopfen, sieht es aber nie. Das Quiz
macht das Innere zum Thema und knüpft jede Frage an etwas, das sich am
eigenen Körper nachprüfen lässt — Faust ballen, Puls zählen, Hand auf
den Bauch legen.

## 2. Zielgruppe und Abgrenzung

5–7 gemeinsam mit einem Erwachsenen, 8–12 allein. Nachbar-App ist
`stark-und-gesund`; die Aufteilung ist bewusst: dort geht es um
**Gewohnheiten** (Bewegung, Schlaf, Essen, Bildschirmpausen), hier um
**Anatomie und Funktion**. Nur vier von 18 Fragen berühren die
Gesundheitsbotschaft, und die bleibt schlicht: bewegen, frische Luft,
Wasser, Schlaf.

## 3. Ablauf

18 Fragen im Vorrat, 12 pro Runde in zufälliger Reihenfolge — gemischte
binäre Aussagen („Stimmt / Stimmt nicht“) und Wahlfragen mit drei
Antworten. Nach jeder Antwort erscheint die Erklärung. Am Ende steht
„Ende der Runde“, ohne Wertung des Kindes: keine Punkte, kein Rekord, keine
Ränge.

## 4. Didaktik / Nutzen

Adaption laut Katalog: die Themenstruktur Herz – Atmung – Verdauung –
Skelett – Wachstum, umgesetzt für den deutschen Sachunterricht. Die
Sucht- und Alkoholhinweise des Originals sind, wie im Katalog
vorgesehen, zu einer altersgemäßen Frage „Was tut deinem Körper gut?“
entschärft.

Sechs Punkte sind bewusst sauber gezogen, weil sie regelmäßig
verschwimmen:

- **Die Lunge hat keinen eigenen Muskel.** Sie wird bewegt — vom
  Zwerchfell (k06, per Test festgenagelt).
- **Muskeln können nur ziehen, nie schieben.** Deshalb arbeiten sie
  paarweise als Gegenspieler (k11).
- **Die Verdauung beginnt im Mund**, nicht erst im Magen (k07).
- **Babys haben mehr Knochen als Erwachsene**, nicht weniger — über 300,
  von denen viele zusammenwachsen (k10).
- **Milchzähne sind keine Wegwerfzähne**: Sie halten den Platz für die
  bleibenden Zähne frei (k18).
- **„Wachstumsschmerzen“ kommen nicht vom Wachsen.** Das Längenwachstum
  an der Wachstumsfuge ist nicht spürbar; das abendliche Ziehen in den
  Beinen trägt den Namen zu Unrecht. Die Erklärung weist den Volksglauben
  ausdrücklich zurück, statt ihn zu bestätigen (k17, per Test gesichert —
  auch deshalb, weil „das wächst sich aus“ die reflexhafte Antwort ist,
  die eine ärztliche Abklärung verzögert).

Alle Zahlen sind gerundete Standardwerte und ausdrücklich als „ungefähr“
formuliert, weil sie von Kind zu Kind schwanken: Ruhepuls etwa 80–100,
Schlafbedarf etwa 9–11 Stunden, rund 206 Knochen, Dünndarm fünf bis
sechs Meter. Ein Test hält genau diese Werte fest, damit eine spätere
Datenänderung sie nicht stillschweigend verschiebt.

**Bewusste Grenze:** Die App diagnostiziert nicht und empfiehlt nichts
Medizinisches. Ein Test verbietet die Wörter *Diagnose, Medikament,
Tablette, Therapie* im Datensatz; ein zweiter verbietet
Körperbewertung (*dick, Übergewicht, abnehmen, Diät, Kalorien*) und
Angstmache. eltern.html verweist ausdrücklich auf die kinderärztliche
Praxis.

**BFSG:** Vorlesefunktion aus `quiz-kern` deckt Nichtleser ab; jede
Frage und jede Erklärung ist einzeln vorlesbar.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten. Die App
speichert nichts und kennt keine Punkte, keinen Rekord und keine Ränge; der
frühere Schlüssel `koerper.rekord` wird beim Start einmal entfernt.
eltern.html, im Sammelband.

## 6. Tests

`test/fragen.test.mjs` (9): Schema gültig bei erhöhter Latte (≥16 Fragen,
Erklärung ≥80 Zeichen); die Daten haben keine Ränge; App-Code ohne
Ergebnissatz, ohne Speicher und ohne Löschkarte, Eltern-Seite ohne
Löschknopf; binäre Fragen enthalten beide Antworten und
die richtige Wahlantwort steht nicht immer an derselben Stelle; alle
neun Organ-Kategorien kommen vor; die belegten Zahlenwerte sind
festgenagelt (Ruhepuls 80–100, 206 Knochen, über 300 beim Baby, 9–11
Stunden Schlaf, Dünndarm fünf bis sechs Meter); die sechs typischen
Irrtümer sind aufgelöst — einschließlich der Zurückweisung des
Wachstumsschmerz-Volksglaubens; Ton ohne
Beschämung, Körperbewertung, Angstmache und ohne medizinische Beratung;
jede Erklärung ≥120 Zeichen mit Satzzeichen, ids in Reihenfolge.

## 7. Erweiterungen (Katalog)

Puls-Messstation als eigene Mini-Ansicht (vor/nach dem Hüpfen),
Skelett-Zuordnung mit selbst gezeichneten Silhouetten, Brücke zu
`mensch-tier-pflanze` (dieselben Lebenszeichen bei Tier und Pflanze)
und zu `stark-und-gesund` (aus dem Wissen wird Gewohnheit).
