# Kurz-GDD: Tischdienst-Trainer 🍽️

**Einheit aus Katalog:** docs/10 (Praleska), Abschnitt „Ko-Nutzung“, Nr. 17 —
«Tischdienst-Trainer». Buchquelle: S. 187, Pflicht des Tischdienstes
(hauswirtschaftlicher Dienst, „Sternchen-Ziel“).
**Engine:** eigener datengetriebener Simulator (bewusst **nicht** `quiz-kern`).
Zielgruppe: **4–7, nur gemeinsam mit einem Erwachsenen.**

Die Geltungsarten heißen wie in `apps/design-entdecker`: `pruefbar` |
`ausgemacht` | `geschmack`. Eine zweite Namensfamilie für dieselbe
Unterscheidung hätte die Projekt-Tradition zersplittert und geteilte Tests
unmöglich gemacht.

## 1. `liegtUnter` ist ein Endzustand, keine Reihenfolgebedingung

Physisch zwingend ist nur, dass die Decke **am Ende** unten liegt — nicht,
dass sie zuerst kommt: man hebt den Teller an und schiebt sie darunter.
Genau das tun Fünfjährige am echten Tisch, und es funktioniert. Eine App,
die die Decke zuletzt ablehnt, behauptet eine Unwahrheit an der einzigen
Stelle, an der sie überhaupt etwas behaupten darf — und ein Kind könnte sie
zu Recht anfechten.

**Folge:** `darfJetzt` liest `liegtUnter` gar nicht. Es wird nichts
abgelehnt; die später gelegte Unterlage wird sichtbar untergeschoben
(`spaeterText`, Pflichtfeld). `unterlageFehlt()` meldet nur, dass sie noch
kommen muss.

## 2. Die Invariante ist eine Strukturgleichheit, keine Schwelle

Eine Schwelle „mehr als eine Reihenfolge“ wäre wirkungslos: bei 6 Schritten
gibt es 720 Permutationen, und ein Datenstand, der 718 ablehnt und zwei
zulässt, bestünde sie — wäre aber faktisch *die* eine richtige Reihenfolge.

`pruefeDaten` verlangt deshalb `anzahlReihenfolgen(v) === n!`
(**Kita 120 / 120, zu Hause 720 / 720**) und zusätzlich, dass jeder Schritt
an *jeder* Position stehen kann. Ein Test sichert, dass `darfJetzt` keine
Vorbedingung liest, und zeigt mit einer Gegenrechnung, dass die Gleichheit
keine Identität ist (eine verkettete Variante ergibt 1).

## 3. Die Szene ist egozentrisch, nicht „aus Sicht der Figur“

„Aus Sicht der sitzenden Figur“ ist noch keine Bauanweisung: sitzt die Figur
oben im Bild und schaut das Kind an, ist Figur-rechts auf dem Bildschirm
links — und genau die Perspektivübernahme wäre wieder verlangt, die vor 7–8
nicht verfügbar ist.

Deshalb liegt der **Sitzplatz immer unten am Bildschirm**: Bildschirm-links
= Figur-links = Kind-links. Keine zweite Sitzrichtung, auch nicht als Stufe.
`blickrichtung` muss „immer unten am Bildschirm“ enthalten.

`seiteOhneAnker()` prüft **jeden ausgelieferten Text** satzweise — Schritte,
Zonen, `rahmenSatz`, `ehrlichkeit`, `fuerAndere`, `ohneRichtig` und
`blickrichtung`: `links`/`rechts` (auch die flektierten Formen „linke“,
„rechter“) darf nur vorkommen, wenn im selben Satz `von dem Kind, das hier
sitzt` steht. Die erste Fassung hatte drei Verstöße, weil nur die
Zonen-Objekte geprüft wurden — und `blickrichtung` selbst verletzte die
Regel („dort sitzt“), obwohl der Satz auch auf dem gedruckten Platzset steht.

## 4. `oben`, `über` und `hinter` sind gesperrt

Wie `GESPERRTE_PRAEPOSITIONEN` in `apps/grammatik-zwerge` (Ko-Nutzung Nr. 14,
dieselbe Altersgruppe): in einer flachen Draufsicht gibt es zwei
verteidigbare Antworten — aus Sicht der sitzenden Person steht das Glas nicht
über dem Teller, sondern weiter weg. Zwei Apps derselben Reihe dürfen sich
hier nicht widersprechen. Die Zone heißt `weiterWeg`. Erlaubt: auf, unter,
in, neben; `vor` **nur personenbezogen** (eine Person hat eine Vorderseite,
ein Teller nicht) — `VOR_PERSONENBEZOGEN` setzt das durch.

**`\b` greift an einem Umlaut nicht.** Die erste Fassung benutzte
`/\büber\b/`. In JavaScript ist `\w` nur `[A-Za-z0-9_]`, also ist „ü“ ein
Nicht-Wortzeichen: „über“ am Satzanfang wurde **nie** erkannt, und in
„darüber“ schlug die Regel **falsch** an. Jedes gesperrte Wort hat deshalb
jetzt ein eigenes Muster, das vorne und hinten über Nicht-Buchstaben
abgrenzt. Ein Test hält beide Fehlfälle als Vorbedingung fest.

## 5. Zwei Sitzungstypen, getrennte Budgets

| Typ | Inhalt | Handlungen |
|---|---|---|
| `austeilen` | 3–5 Plätze, EINE Teilesorte, Eins-zu-eins | 3–5 |
| `decken` | genau EIN Platz, mehrere Teile | 5–6 |

Niemals in derselben Sitzung — zusammen wären es 15–30 Handlungen. Der
Erwachsene wählt am Anfang.

**Beim Austeilen wird nicht gezählt.** „Heute fehlt eines, also brauchst du
eins weniger“ ist Subtraktion und mit 4–5 nicht verfügbar; eine Zahlenfrage
wäre eine andere, schwerere Aufgabe. `pruefeDaten` lehnt `wie viele`,
`eins weniger` und Zahlen-Antwortfelder in den Lagen ab. Die wechselnde
Anzahl entsteht rein sichtbar (heute vier Figuren, nächstes Mal drei).

**Und es gibt einen sichtbaren Vorrat.** Die erste Fassung ließ nur Kinder
antippen; mehr als nötig konnte man gar nicht verteilen, „es bleibt nichts
übrig“ trat immer ein, und damit war die Eins-zu-eins-Zuordnung überhaupt
nicht geprüft — wer sich nicht verzählen kann, lernt am Zuordnen nichts.
Jetzt holt das Kind einen Stapel für die **ganze Gruppe** (`vorratVon` =
`figuren + leer`, so viele wie Stühle am Tisch). Am Ende hat jedes Kind eins
und der Rest liegt sichtbar daneben: *das* ist die Erfahrung „heute sind
nicht alle da“. Gezählt wird dabei nichts — man sieht es. `bleibtUebrig()`
ist Validator-Bedingung: eine Lage ohne Rest wird abgelehnt.

## 6. Rückmeldung nach Geltungsart gestaffelt

| Geltung | Reaktion |
|---|---|
| `pruefbar` | wird angenommen; später gelegt → untergeschoben mit `spaeterText`; `grund` ist zum Selberprüfen formuliert |
| `ausgemacht` | **bleibt liegen**; die Figur sagt die Abmachung und bietet „🔄 Umlegen“ / „👍 So lassen“ an — das Kind entscheidet |
| `geschmack` | keine Wertung, kein Lösungsfeld, `istAmPlatz` gibt `null` |

Ein kommentarloses Zurückgleiten wäre für ein Vierjähriges nicht „neutral“,
sondern „kaputt“ oder „ich darf das nicht“. Und auf Konventionsschritte
angewandt machte es die Abmachung technisch ununterscheidbar von der Physik.

## 7. Der Geltungssatz steht einmal, nicht sechsmal

Ein Teilstring-Test auf jeden Kindertext wäre eine Scheinprüfung und hätte
sechs Mal „bei uns ist ausgemacht“ pro Sitzung erzwungen — den Etikette-
Vortrag, der vermieden werden soll. Stattdessen: `rahmenSatz` einmal vor dem
Decken („So ist das bei uns in Deutschland ausgemacht. Bei dir zu Hause kann
es anders sein — und dann ist es dort richtig.“), und je Schritt ein kurzer
Kindertext **ohne Bewertungsvokabular** (Validator). Die ausführliche
Begründung steht im `geltungsbereich` für Erwachsene.

Er muss im Kinderbildschirm stehen und nicht nur auf der Elternseite: ein
Kind dieses Alters hat einen belastbaren Gegenbeleg, nämlich den eigenen
Tisch zu Hause.

## 8. 4–5 ohne links/rechts

Begriffsfolge: in/auf/unter → neben → zwischen → links/rechts. Der
Katalogeintrag nennt „Besteck links/rechts“ für 4–5 — das wäre für die
Hauptzielgruppe planmäßig unlösbar. Darum trägt jede Variante `ab`, die
Kita-Variante (`4-5`) kommt ohne Seitenzonen aus, und `pruefeDaten` verlangt,
dass mindestens eine Variante ohne Seitenzonen existiert. Gezeichnet werden
nur die Zonen, die die gewählte Variante braucht.

## 9. Kein Solo-Modus

Der Katalog sagt „5–7 kurz allein“. Das geht hier nicht: die
Konventionsschritte sind nur vertretbar, weil ein Erwachsener die örtliche
Abmachung kennt (Messer ja/nein, Becher oder Glas, wie viele Teile). Allein
ausgeliefert würde aus „bei uns ausgemacht“ doch wieder „so ist es richtig“.
`nurGemeinsam` ist Pflichtfeld und steht im Gate.

## 10. Datenschutz und Papier

Kein Eingabefeld für Namen, Gruppengröße oder wer heute fehlt — das ist eine
Angabe über ein drittes, namentlich benanntes Kind und im Kita-Kontext
gesundheitsnah. Die Lagen sind anonyme Festdaten; ein Test verbietet
`localStorage` ganz.

Das Platzset ist eine reine Schablone: **keine** Häkchen-, Punkte-, Stern-
oder Tagesfelder, keine Namenszeile, keine Urkunde. Sonst wäre es das
Belohnungs- und Vergleichssystem auf Papier, mit Kindernamen an der Wand.
Ein Test prüft das Druck-Markup.

Und es zeigt **dieselbe** Raumlage wie der Bildschirm. Die erste Fassung nahm
die Reihenfolge aus der Zonen-Liste und druckte Teller und Gabel vertauscht —
eine Schablone, die das Kind genau falsch legen lässt. Jetzt stehen beide
Reihen explizit als `[nebenLinks, mitte, nebenRechts, neben]`, und ein Test
vergleicht die gerenderte Reihenfolge beider Stellen.

Im ganzen Anwendungscode kommt **kein Stern** vor (Test). Die erste Fassung
setzte ein 🌟 genau auf den Fertig-Bildschirm des Austeilens — in einer App,
die zwei Bildschirme vorher „keine Punkte und keine Sterne“ zusagt und deren
Buchvorlage an genau dieser Stelle mit einem Sternchen-Ziel arbeitet. Jetzt
markiert 🤝 das Fertigsein, ohne zu belohnen.

## 11. Tippen statt Ziehen

Zwei Tipper: Teil wählen, Zone wählen. Ziehen ist für Vierjährige
unzuverlässig (Hand verdeckt das Ziel, Scrollen fängt die Gestur ab), mit
Tastatur nicht bedienbar und bricht bei Bildschirmlupe; im ganzen Korpus
benutzt kein `app.mjs` `draggable`. Zonen sind **immer** echte Knöpfe mit
`aria-label`, ≥ 48 px; ohne Teil in der Hand lesen sie ihre Frage vor, und
**mit** Teil in der Hand zählt der Vorlese-Knopf alle Felder auf — sonst wäre
links und rechts genau dann nur über Schrift unterscheidbar, wenn es darauf
ankommt. Präzision geht nie in die Prüfung ein.

Die Reihenfolge der Sachen-Knöpfe wird **einmal pro Sitzung** gemischt. Vorher
rief `deckBildschirm()` `angeboteneSchritte()` bei jeder Darstellung auf, und
die Knöpfe sprangen bei jedem Tipp neu durcheinander.

`geltungsbereich` ist Pflichtfeld — und wird jetzt auch angezeigt: nach jeder
Ablage steht die Einschränkung der Abmachung als `👪`-Zeile unter der
Rückmeldung. Vorher war das Feld getestet, aber unsichtbar, und die
Einschränkung erreichte niemanden.

## 12. Tests

`test/logik.test.mjs` (27): Daten gültig; `liegtUnter` als Endzustand (alle
n! Reihenfolgen, Unterlage auch zuletzt); Strukturgleichheit statt Schwelle
samt Gegenrechnung und Quellprüfung von `darfJetzt`; später gelegte Decke
wird untergeschoben; Geltungsnamen wie design-entdecker; Abmachungen ohne
Bewertung und Rahmensatz einmal; links/rechts nie ohne Anker in **keinem**
Text; `oben`/`über` gesperrt; 4–5 ohne Seitenzonen; Geschmack technisch ohne
Richtig; Artenabdeckung über alle Varianten (eine Variante ohne Deko bleibt
grün); Austeilen ohne Zahlen; zwei vollständige Gedecke; nur gemeinsam;
Tippen statt Ziehen und kein Zähler; Platzset ohne Belohnungsfelder; Wörter
dreisprachig und kein Vorlese-Versprechen für uk/ru; Abschluss ohne
Häufigkeits-Rangbehauptung; Angebots-Rotation.
