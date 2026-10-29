# Kurz-GDD: Tier-Tanz-Impulse 🐿️

**Einheit aus Katalog:** docs/10 (Praleska), Abschnitt „Ko-Nutzung“, Nr. 20 —
«Tier-Tanz-Impulse». Buchquelle: S. 267–268 (24 Bewegungsetüden, 23
Charaktertänze).
**Engine:** eigenes datengetriebenes Kartendeck mit WebAudio-Rhythmus
(bewusst **nicht** `quiz-kern`). Zielgruppe: 3–5 und 5–7, **der Erwachsene
bedient das Gerät**.

Das Kind sieht den Bildschirm gar nicht. Seine Bewegung wird **überhaupt
nicht beurteilt** — wahrheitsfähig ist allein, was die Karte über das Tier
behauptet.

## 1. Keine Karte behauptet eine Bewegung, die das Tier nicht zeigt

Der Katalog nennt „Igel schleicht“. Das ist falsch: ein Igel trippelt mit der
Nase am Boden, hält häufig an und schnüffelt — und ist dabei **gut hörbar**
(Rascheln, Schnaufen). Er ist schneller als erwartet und rollt sich bei
Gefahr ein, statt zu fliehen. Wer wirklich schleicht, ist der Fuchs: er duckt
sich und setzt die Pfoten ganz langsam, bevor er auf eine Maus springt.

Die Fuchs-Karte im Deck zeigt aber **nicht** das. Ihr `woran` beschreibt, dass
er die Pfoten fast in eine Linie setzt, so dass die Spur im Schnee aussieht wie
eine Schnur, und sagt selbst „zügig unterwegs, nicht langsam“ — das ist
**Schnüren**, in der Jägersprache der ruhige Trab des Raubwilds, und kein
Anschleichen. Beide Gangarten stehen getrennt in `belegteBewegungen` des
Fuchses, und die bisherige Prüfung sah nur, dass das `verb` irgendwo in der
Liste steht. Die Karte heißt darum jetzt „Der Fuchs schnürt“, und eine Regel
hält das fest: sagt ein `woran` „das nennt man X“ und X ist eine **andere**
belegte Bewegung desselben Tiers, zeigt die Karte das falsche Merkmal unter
der Überschrift „So macht das Tier es wirklich“.

Jede Karte trägt darum `geltung`:

| `geltung` | Bedingung | Pflichtfelder |
|---|---|---|
| `naturgetreu` | `verb` steht **wörtlich** in `belegteBewegungen` des Tiers | `woran` (prüfbares Merkmal), **kein** `wirklich` |
| `ausgemacht` | `verb` steht dort **nicht** | `kindText` mit „im Spiel“/„machen wir aus“, `wirklich` (die echte Bewegung), **kein** `woran` |
| `unbelebt` | kein Tier, kein Absichtsverb im Text | `figur`, `impulsQuelle` ∈ {luft, wind, erwachsener} |

Alle drei Arten müssen vorkommen — **insbesondere mindestens eine
`ausgemacht`**, sonst behauptet die App durchweg eine Naturtreue, die sie
nicht hat. Tests mutieren in beide Richtungen: „schleichen“ in die
Igel-Belege eintragen schlägt fehl, und es bei einer naturgetreuen Karte zu
entfernen auch.

Die Geltung steht in der Anzeige **vor** dem Kartentext („🤝 Das machen wir
im Spiel so aus“), damit eine Spielabmachung nicht wie eine Tierbeobachtung
aussieht.

## 2. Rhythmus, nicht Melodie: höchstens zwei Tonhöhen

In Welle 74 war eine selbst komponierte Walzer-Melodie Note für Note der
Anfang von „London Bridge Is Falling Down“ — naheliegende diatonische
Figuren in engem Umfang treffen bekannte Incipits genau dort, wo man es
nicht erwartet. `MAX_TONHOEHEN = 2` macht eine erkennbare Melodie
**strukturell unmöglich**.

Für Bewegung ist das kein Verlust: Rhythmus, Dynamik und Artikulation tragen
die Qualität vollständig. Eine Tonfolge zu bauen, wo ein Trippel-Puls
genügt, wäre überflüssiges Risiko.

## 3. Tempo und Dynamik sind nicht gekoppelt

Ein naiver Datensatz macht Igel, Storch und Schneeflocke alle „langsam +
leise“ — dann klingen zwei Karten gleich, und das Kind lernt die falsche
Regel „langsam heißt leise“. `pruefeDaten` verlangt Gegenbeispiele in beide
Richtungen: **Storchenklappern** (langsam + deutlich) und
**Eichhörnchen-Galopp** (schnell + leise).

Dazu: zwei Karten dürfen nicht gleich klingen. Der Klang-Schlüssel ist
Tempo/Dynamik/Artikulation/Muster **plus Tonhöhe** — hoch gegen tief ist für
dieses Alter der deutlichste Unterschied überhaupt (darauf baut
`apps/klang-detektive`). Sie muss dann aber wirklich weit auseinanderliegen:
bei sonst gleichem Klang mindestens eine **Quinte** (Faktor 1,4). Schnecke
(G2) und Schneeflocke (C5) liegen zwei Oktaven auseinander; ein Ganzton
reicht nicht und lässt die Prüfung scheitern. *Diese Regel hat beim Bau
einen echten Datenfehler gefunden: drei Karten klangen identisch.*

## 4. Nie Taktgenauigkeit

Drei- bis Fünfjährige können sich nicht zuverlässig auf einen äußeren Puls
synchronisieren; das gelingt erst allmählich und bleibt bis ins Schulalter
ungenau, bei langsamen Tempi am schlechtesten. Eine App, die den Takt
verlangt oder gar anzeigt, misst ein Defizit, das die Entwicklung erklärt.
`pruefeDaten` lehnt das Wortfeld (`Takt`, `auf den Schlag`, `mitzählen`,
`abzählen`) in den Daten ab.

Weitere Altersgrenzen im Schema: **genau ein** `bewegungsAuftrag` pro Karte
(exakt ein Satz, Validator zählt die Satzzeichen) — drei Anweisungen
hintereinander hält dieses Alter nicht. Kein Rechts/Links, kein Abzählen,
kein Einbeinstand, keine gegengleiche Koordination.

Diese drei standen zunächst nur im Text. Eine Karte sagte „Hüpf **dreimal** und
bleib dann stehen“ — strukturgleich mit dem Gegenbeispiel „vier Schritte, dann
drehen“, das die Elternseite ausdrücklich ausschließt — und kam durch jede
Prüfung, weil dort kein Taktwort steht, sondern eine Zahl. Ein Drei- bis
Fünfjähriger kann seine Sprünge nicht mitzählen, *während* er springt: er zählt,
ohne zu springen, oder springt, ohne zu zählen — und der Erwachsene sieht ein
Kind, das es „nicht richtig“ macht. Die Zahl trägt ohnehin der Rhythmus
(`muster [1,1,1,0]`). `pruefeDaten` trennt dafür zwei Register.

In den Feldern, die dem Kind sagen, was es **tun** soll — `bewegungsAuftrag`,
`wortImpuls`, `titel`, `kindText` —, sind Ziffern und Zahlwörter verboten. In
den Feldern, die ihm das **Tier beschreiben** — `woran` und `wirklich`, und
`kindTextVon()` gibt `woran` als Kindtext jeder naturgetreuen Karte zurück —,
ist eine beobachtete Menge dagegen eine Tatsache und keine Aufforderung: „Sie
macht zwei, drei Hüpfer, bleibt stehen und legt den Kopf schräg“ macht die
Beobachtung gerade überprüfbar, und sie zu entzahlen würde sie vager machen.
Verboten bleibt dort das Zählen als **Tätigkeit** („zähl mit, wie oft …“).
Seite und Einbeinstand sind in **jedem** Kindfeld verboten, auch im
beschreibenden. `klatschImpuls` und `erwachsenenHinweis` sprechen zum
Erwachsenen — „drei Drehungen, dann hinsetzen“ muss dort sagbar bleiben.

Und kein Zeigewort ohne Bezug: „dann dreh dich **dorthin**“ nannte nirgends ein
Dorthin — nicht im Kartentext, nicht im Wort-, nicht im Klatschimpuls —, und
der Erwachsene soll gerade nichts vormachen. Ein Kind bleibt dann stehen und
sucht die fehlende Angabe bei ihm. Die Richtung steht jetzt im
Erwachsenen-Satz, der Auftrag ist in sich vollständig.

## 4b. Ein Tempo, das der Hinweis behauptet, ist das Tempo der Karte

Ein `erwachsenenHinweis` sagte „Laut und langsam gehören hier zusammen“ auf
einer Karte mit `tempo: mittel` — und `karteBildschirm` druckt zwei Zeilen
darüber „mittelschnell“. Der Erwachsene liest zwei unvereinbare Angaben und
bremst das Scharren auf das falsche Tempo. Das von GDD §3 gemeinte
Gegenbeispiel ist eine **andere** Karte: das Storchenklappern (langsam + laut).
`pruefeDaten` vergleicht darum jedes Tempo-Wort, das der Hinweis über *diese*
Karte sagt (erkennbar am Selbstbezug „hier“, „diese“), mit ihrem `tempo`.
Zitate in „…“ fallen vorher weg — eine angeführte Redewendung ist keine Aussage
über die Karte —, und ein Vergleich ohne Selbstbezug bleibt möglich („langsam
und kontrolliert ist schwerer als schnell“).

## 5. Ohne Ton gleichwertig

Jede Karte braucht `wortImpuls` **und** `klatschImpuls` (Pflichtfelder) —
die App geht vollständig stumm, und der stille Knopf steht im Gate zuerst
und gleich groß. Ein Test prüft die Reihenfolge. Der sichtbare Puls läuft
auch ohne Ton, aus **demselben** `zeitplan()` wie der Ton: sie können nicht
auseinanderlaufen.

Audio-Hygiene wie `apps/musik-detektive`: Deckel `MAX_LAUTSTAERKE = 0.22`,
**genau einmal** angewandt – `staerke` in den Daten ist ein *Anteil* des
Deckels (0 < s ≤ 1), `zeitplan()` multipliziert ihn mit dem Deckel, und der
Master-Gain steht auf 1. Solange der Deckel an beiden Stellen stand, lag die
Spitze bei 0,2 · 0,22 = 0,044 – ein Viertel dessen, was `musik-detektive` mit
demselben Deckel ausgibt, und für eine App, die quer durch ein Zimmer hörbar
sein muss, zu leise. Dazu ≥ 12 ms Attack/Release, `triangle`, ein Probeton auf
demselben Weg wie ein echter Schlag, Lautsprecher statt Kopfhörer. Ein zweites
Antippen legt sich nicht über das erste: `spiele()` ruft zuerst `stopAlles()` –
auf Touch ist der Doppeltipp der Normalfall. Der Puls rampt **Größe und Deckkraft**, er blinkt nicht: bei
138 bpm läge ein An/Aus-Puls bei 2,3 Hz und damit nahe an der Flackergrenze
(WCAG 2.3.1, 3–55 Hz). `stopAlles()` fährt die eingeplanten Oszillatoren
herunter, nicht nur die Timer.

## 6. Eine Jahreszeit pro Sitzung

Nicht Stimmung, sondern Richtigkeit: **Igel halten Winterschlaf**, und ein
Igel im Schnee ist ein Notfall, kein Winterbild. Der Igel trägt deshalb
`jahreszeit: [fruehling, sommer, herbst]` und erscheint im Winter-Deck nicht.
Eichhörnchen halten keinen Winterschlaf — die Karte sagt das. Jede
Jahreszeit braucht ≥ 3 Karten mit ≥ 2 Tempi und ≥ 2 Dynamiken, damit kein
Deck einförmig wird.

## 7. Für den Storch und für das Eichhörnchen gibt es kein Zeichen

🦩 wäre ein Flamingo, also ein anderes Tier. Darum trägt jedes Tier ein
`zeichenArt` (`tier` | `bewegung`); bei `bewegung` ist `zeichenGrund`
Pflicht und wird angezeigt. Dieselbe Linie wie die Bebilderungs-Regel in
`apps/woerter-sortierer`.

Beim Eichhörnchen lag derselbe Fall, nur unauffälliger: U+1F43F heißt in
Unicode **CHIPMUNK**, ist also ein Streifenhörnchen, und ein
Eichhörnchen-Emoji gibt es nicht. Mit `zeichenArt: 'tier'` hätte die App das
Zeichen groß gezeigt, mit `aria-label` „Das Eichhörnchen galoppiert“ — und den
korrigierenden Satz gerade **unterdrückt**, weil `zeichenGrund` nur bei
`bewegung` erscheint. 🐦 bleibt dagegen: das ist das generische Zeichen für
„Vogel“, und eine Amsel ist ein Vogel; der Flamingo war das Zeichen einer
**anderen Art**. Das sind zwei verschiedene Fälle, und nur der zweite ist eine
Falschaussage.

## 8. Ablauf

Gate (Fläche frei, Grenze laut sagen, barfuß) → Ton oder ohne (stiller Weg
zuerst) → ggf. Probeton → Jahreszeit → bis zu `PRO_SESSION = 5` Karten
(Geltung, Kindertext, bei `ausgemacht` die echte Bewegung, Bewegungsauftrag,
Tempo/Dynamik/Artikulation in Kinderworten, Ort, Puls-Reihe, „was du sagst“,
„was du klatschst“, Erwachsenen-Hinweis) → **Bildschirm aus** mit vier
Offline-Ideen und zwölf Sicherheitshinweisen. Dieselben zwölf stehen
aufklappbar schon **im Gate** — sie standen zuerst nur im Schluss, unter der
Überschrift „Vorher einmal lesen“, also nach den Karten, und zwei von ihnen
sind genau die, die vorher gelten müssen: beide Füße am Boden beim
Stehenbleiben, und das Deckeln der Drehungen. „Für heute reicht es“ ist auf
jeder Karte erreichbar.

## 9. Draußen: schauen, nicht anfassen

Igel sind besonders geschützt (BNatSchG), tragen Flöhe und Zecken und können
Salmonellen übertragen; ein tagaktiver, torkelnder Igel ist krank. Der
Validator lehnt Schluss-Ideen mit `sammel|fütter|aufheben|fangen|streicheln`
ab.

## 10. Tests

`test/logik.test.mjs` (25): Daten gültig; „Igel schleicht“ als Abmachung mit
Gegenprobe in beide Richtungen; alle drei Geltungsarten; naturgetreu mit
prüfbarem Merkmal; unbelebt ohne Absicht und mit äußerer Impulsquelle;
höchstens zwei Tonhöhen (plus Melodie-Gegenprobe); Tempo und Dynamik
entkoppelt (plus gekoppelte Gegenprobe); zwei Karten klingen nicht gleich;
keine Taktgenauigkeit und keine Bewertung; genau ein Bewegungsauftrag; ohne
Ton vollständig; eine Jahreszeit pro Sitzung und kein Igel im Winter; jede
Karte nennt ihren Ort; Storch-Zeichen begründet; Lautstärke gedeckelt und
Puls gerampt; Ton und Puls aus derselben Quelle; Sitzungsgrenze mit
Rotation; offline beobachten statt anfassen; `kindTextVon` je Geltung; die
vier Altersgrenzen als Schema-Regel mit drei Gegenproben; kein Zeigewort ohne
Bezug; Tempo-Behauptung gegen Karten-Tempo (plus die erlaubte Vergleichsform);
🐿️ als Streifenhörnchen; Sicherheit vor der ersten Bewegung; „weniger
Bewegung“ macht den Puls nicht zum An/Aus-Sprung. Die Zahl der Tests in GDD und
README prüft ein Korpus-Test für alle Apps, die eine nennt
(`packages/kinderschutz/test/testzahlen.test.mjs`).

## Seitenangaben (Serie C, Pilot 29.10.2026)

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

Geprüft wurden alle Seitenangaben dieser Datei gegen die Textkopie der Pralęska (`tools/app-seiten-pruefen.mjs`, Urteil je Angabe im Lauf vom 29.10.2026). Das ist eine maschinelle Prüfung, keine Prüfung durch einen Menschen.

Ergebnis: Die Seiten 267 und 268 stimmen. Die Übungen beginnen auf S. 267, die Tanzliste steht auf S. 268. Nachgezählt: 24 Übungsbezeichnungen (je Titel bzw. Bewegung) und 23 Tanz-Einträge. Die Zählregel steht in dieser Datei noch nicht ausgeschrieben; sie wird nachgetragen.

Offen (Frage 76): Die Altersangabe 3 bis 5 in dieser Datei stützen diese Seiten nicht. S. 268 steht unter der Überschrift «Фантазеры»; S. 6 der Quelle ordnet diese Gruppe dem älteren Vorschulalter zu, von fünf bis sechs oder sieben Jahren. Bis zur Entscheidung bleibt die Angabe unverändert.
