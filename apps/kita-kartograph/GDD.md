# Kurz-GDD: Kita-Kartograph 🗺️

**Einheit aus Katalog:** docs/10 (Praleska) Ko-Nutzung Nr. 10 —
«Kita-Kartograph: Wir zeichnen unseren Raum». **Engine:** Legespiel +
Beteiligung mit `kinder-ui`. Zielgruppe: ab 5, Kita und zu Hause.

## 1. Kernaussage

Einen Raum von oben zu denken ist der schwierige Schritt. Wer ihn einmal
gemacht hat, versteht jede Landkarte. Deshalb wird hier nicht gelesen,
sondern **gebaut**.

## 2. Abgrenzung zu `deutschland-kompass`

Dort **liest** das Kind einen fertigen Plan und geht Wege ab. Hier
**baut** es einen eigenen. Andere Richtung, schwieriger, und ohne
Lesekenntnis möglich.

## 3. Der Kern: die Zeichenerklärung baut sich selbst

Ein Plan funktioniert nur, wenn danebensteht, wofür die Zeichen stehen.
`legende(plan, symbole)` liefert deshalb genau die Symbole, die wirklich
liegen — mit Anzahl und in der Reihenfolge der Symbolliste, damit sie
sich beim Antippen nicht umsortiert. Kinder erleben so, dass eine Legende
keine Zierde ist, sondern die Bedingung fürs Gelesenwerden.

Aus demselben Grund ist **jedes Zeichen nur einmal vergeben**: Zwei Dinge
mit demselben Symbol wären auf dem Plan nicht auseinanderzuhalten. Der
Validator prüft das.

## 4. Bedienung

6×6-Raster, zwölf Symbole. Erst ein Zeichen wählen, dann ein Feld
antippen; dasselbe Symbol noch einmal nimmt es weg, ein anderes ersetzt
es. `setzeSymbol` gibt immer einen **neuen** Plan zurück und lässt den
alten unberührt — per Test festgehalten.

Norden wird an eine der vier Kanten gelegt und über den Sonnenaufgang
bestimmt: Wo die Sonne morgens aufgeht, ist Osten. Das ist verlässlicher
als Raten und braucht kein Gerät.

`planText` liest den Plan von oben links nach unten rechts vor — auch das
ist kartographisch: Ein Plan hat eine Leserichtung.

## 5. Robustheit

`ladeZustand()` übernimmt nur **bekannte Symbole auf gültigen Feldern**. Ein
alter oder verfälschter Eintrag würde den Plan sonst unsichtbar
verfälschen. Bei jedem Lesefehler kommt ein leerer Plan mit Norden oben.
`planText` und `legende` überspringen unbekannte ids ebenfalls, statt zu
stören.

## 6. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten.
Gespeichert wird ausschließlich der zuletzt gelegte Plan und die
Himmelsrichtung unter `kartograph.plan`, vollständig löschbar; danach
kehrt der Fokus auf den Löschknopf zurück. **Keine Namen, keine Fotos,
nichts über einzelne Kinder** — ein Raumplan ist keine Aussage über ein
Kind. eltern.html, im Sammelband.

## 7. Tests

`test/logik.test.mjs`: Daten gültig; jedes Zeichen nur einmal
vergeben (Mutation geprüft); Feldrechnung an allen vier Ecken;
`setzeSymbol` legt, ersetzt und nimmt weg, ohne das Original zu ändern,
und lässt den Plan bei ungültigem Feld oder Symbol unverändert; die
Zeichenerklärung zeigt nur Gelegtes, mit Anzahl und stabiler Reihenfolge,
und leert sich wieder; `planText` sortiert nach Feld und ignoriert
unbekannte Symbole; `setzeNorden` lässt den Plan stehen und lehnt
unbekannte Kanten ab; `ladeZustand` verwirft Müll und fällt bei kaputtem
Text auf einen leeren Plan zurück; Gesprächsimpulse sind Fragen und die
Schritte führen in den echten Raum und zur Sonne; kein bewertendes Wort
im Datensatz.

`test/regeln.test.mjs` prüft die Projektregeln aus dem
Bauauftrag GEM-10: keine Eingabefelder, Speicherung nur über
`kartograph.plan` in `localStorage` (Ausnahme, siehe 9), keine Netzaufrufe,
Daten per JSON-Import, keine Zufallsquelle, Grundgerüst mit CSP,
`aria-live` auf `#app`, Netzwerk-Wächter, Knopfhöhe 48 px,
`data-kennung` auf jedem Knopf, Himmelsrichtung ohne Neuaufbau, kein
Druck, keine Bewertung, Seitenangabe je Zeichen und die Testzahl hier.

Die Summe ist 29 Tests (`npm test`).

## 8. Erweiterungen (Katalog)

Zweite Ebene für das Außengelände, Weg-Modus („zeichne deinen Weg zur
Tür“), Übergabe an `klassen-koffer-auswertung`, Symbol-Karten zum
Ausdrucken für die Magnettafel.

## 9. Offen

- Speicherung des letzten Plans (`kartograph.plan`): Die Vorlagenregel
  „keine Speicherung“ und docs/02 Z. 25–26 widersprechen sich. Die App
  speichert derzeit; die Regelprüfung erlaubt genau diesen Schlüssel.
  Entscheidung: Regel präzisieren oder Speicher streichen.
- Ort auf der Karte finden (Katalog, S. 138): liegt in `deutschland-kompass`.
  Entscheidung: Verweis genügt oder eigene Karte.
- Herkunftsländer-Ansicht, Europakarte, Klassen-Koffer-Export, Außengelände
  und Weg-Modus: nicht gebaut.
- Symbol-Karten zum Ausdrucken: nicht gebaut; deshalb keine Druckregeln.
- Altersgrenze: Katalog 5–7, App „ab 5“ ohne Obergrenze.
- Favicon (A3): fehlt, der Browser meldet 404.
- Vorlesefunktion (F2): gebaut, die Entscheidung dazu steht aus.
- Seitenangaben ohne Markierung „noch nicht von einem Menschen geprüft“ (A18).
- Zitatgrenze (A10 b): dieser Bauauftrag verwendet 6 Wörter.
