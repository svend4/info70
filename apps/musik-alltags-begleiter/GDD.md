# Kurz-GDD: Musik-Alltags-Begleiter 🎶

**Zielgruppe:** Eltern und Kindertagespflege, Kinder von 1 bis 3 Jahren.
Werkzeug für Erwachsene; das Kind sieht keinen Bildschirm, darum keine
`eltern.html`.
**Gegenstand:** das eigene Tun des Erwachsenen.
**Quelle:** Praleska 2007, S. 87–88, «Музыка в повседневной жизни» (8 Ziele,
nachgezählt). Katalog docs/10, Nr. 57.

## 1. Notiert wird das Tun des Erwachsenen

Eine gespeicherte Notiz trägt genau drei Angaben: `tag`, `gelegenheit`, `art`.
`pruefeNotiz` weist jede weitere ab, und `beschneide` wirft eine Notiz mit
Fremdfeld weg, auch wenn sie am Interface vorbei in den Speicher geraten ist.
Es gibt **kein** Feld für die Reaktion des Kindes.

Daran hängt mehr als Datensparsamkeit: `apps/musikmomente-1-3` lehnt es ab,
ein Hör-Ritual zu protokollieren. Beide Sätze sind wahr, weil der Gegenstand
verschieden ist — dort wäre das Kind in der Zeile, hier ist es der Erwachsene.
Der Kommentar und das GDD von Nr. 55 sind entsprechend geschärft, damit der
Korpus sich nicht selbst widerspricht.

## 2. Keine Ampel, keine rote Stufe, keine Serie

Der Katalogeintrag wollte „Ampel und Tagesstatistik“ — nicht gebaut, und die
Absage steht in der App selbst (`keineAmpel`, `keineSerie`, `keinZiel`), nicht
nur hier. Eine Ampel über sieben Tage ist eine Note für den Erwachsenen; eine
rote Stufe markiert genau den Tag, an dem nichts ging; eine Serie bestraft die
Unterbrechung. Es gibt keine Funktion, die aufeinanderfolgende Tage
zusammenrechnet — ein Test verbietet sie am Namen. Gezählt wird beschreibend:
an wie vielen der letzten sieben Tage eine Notiz steht, ohne Anteil, ohne
„von sieben“, ohne Durchschnitt, ohne Soll.

## 3. Eine der sechs Arten ist Stille

`a-stille` — „bewusst Stille gelassen“. Das ist die strukturelle Sperre
dagegen, die Liste als „mehr ist besser“ zu lesen: wer den Ton ausmacht, hat
auch etwas getan, und ein Tag mit einer Stille-Notiz ist ein Tag mit Notiz.
Der Validator verlangt, dass diese Art selbst sagt, warum sie dasteht.

## 4. Sieben Tage, dann weg

`beschneide` läuft beim Laden **und** beim Speichern; Älteres wird gelöscht,
nicht archiviert. Doppeltes Antippen derselben Gelegenheit mit derselben Art
an einem Tag erzeugt keine Menge.

> **Abweichung beim Bau (Welle 80) — ein Defekt der Browserprobe.** Die erste
> Fassung beschnitt nur die Liste im Arbeitsspeicher. Wer die Seite öffnete
> und nichts notierte, hatte danach die alten Einträge weiter im
> `localStorage` — die Zusage „beim Öffnen gelöscht, nicht archiviert“ war
> falsch, und eine Notiz von 2020 mit einem Fremdfeld überlebte das Neuladen.
> Gefunden hat das die Browserprobe, nicht der Test. Jetzt wird das
> Beschnittene sofort zurückgeschrieben, und zwar nur, wenn sich etwas
> geändert hat (sonst löste reines Lesen bei gesperrtem Speicher eine Warnung
> aus). Ein Test hält genau diese Zeile.

Der Tag kommt aus der **lokalen** Zeit (`tagAus`): `toISOString()` nennt um
00:30 in Deutschland noch den Vortag — also gerade dann, wenn jemand das
Einschlaflied notiert.

## 5. Die Minutenangabe der Quelle

Die Quelle nennt „von 1–2 bis 5 Minuten“ täglichen Hörens in der Gruppe. Die
Zahl steht als **Angabe der Quelle** da, nicht als Vorgabe: für das Zuhören zu
Hause mit einem Kind unter drei Jahren ist keine Dauer belegt, und das Maß ist,
dass das Kind sich abwendet. `DAUER_ALS_VORGABE` trifft dieselbe Zahl in einer
vorschreibenden Konstruktion innerhalb der Zeilen — der Registerschnitt aus
Nr. 55, auf die Dauer angewandt. Die Hör-Insel sagt ihre fehlende Dauer an der
Zeile selbst, nicht nur im Vorwort.

## 6. Keine Lieder

Die freien Werke stehen in `apps/musikmomente-1-3`, die Reime und Wiegenlieder
in `apps/familienschatz-reime`. Zwei Listen wären zwei Wahrheiten über
dasselbe. Die ukrainischen und russischen Wiegenlieder des Katalogeintrags sind
**ausdrücklich weggelassen** statt stillschweigend falsch geschrieben: eine
ungegengelesene Übersetzung wäre eine Behauptung. `LIED_IM_TEXT` verbietet
Liedtext, Strophe und Titelkonstruktionen in den Zeilen.

## 7. Die acht Quellziele, einzeln verbucht

| Ziel | Status |
|---|---|
| 2 Musik kommt natürlich in den Tag | gebaut, tragend |
| 3 tägliches Hören | gebaut als Hör-Insel, ohne Minuten |
| 5 rhythmische Bewegung zum Singen des Erwachsenen | gebaut |
| 6 Experimentieren mit klingenden Dingen | gebaut als Handlung des Erwachsenen |
| 8 fachliche Hilfe für die **Eltern** | von der App als Ganzes eingelöst (`zielAlsGanzes`) |
| 1 Musikecke mit Instrumenten | ausgeschlossen: Einkaufszettel + Kleinteilgefahr |
| 4 Musik zur Morgengymnastik/im Sport | ausgeschlossen: Kita-Setting, Bewegung 3–7 ist Nr. 62 |
| 7 benannte Feste | ausgeschlossen: der 8. März ist in Deutschland kein allgemeiner Feiertag |

Der Validator verlangt, dass **jedes** der acht Ziele in einer Zeile steht, im
Ausschluss begründet ist oder als Ganzes eingelöst erklärt wird — und dass ein
als nicht übernommen erklärtes Ziel nicht doch in einer Zeile auftaucht
(Bauart aus Nr. 49). `zielAlsGanzes` braucht eine Begründung, die das Wort
„Einlösung“ enthält, sonst ist es eine Ausrede.

## 8. Der Erwachsene ist der Handelnde — computergeprüft

Jedes `wasDuTust` und jedes `wasSieTun` muss „Sie“ enthalten. Steht der
Erwachsene nicht im Satz, beschreibt die Zeile etwas anderes — und dieses
Etwas wäre das Kind. `REAKTION_DES_KINDES` trifft die Frage („Hat es
gefallen?“, „Wie hat Ihr Kind reagiert?“) und die Zuschreibung („Ihr Kind sang
mit“).

> **Falle A, zwölftes Mal.** Das Netz gegen die Reaktion des Kindes muss im
> Absagefeld `keineReaktion` erlaubt sein, weil dieses Feld die Frage nennen
> MUSS, um sie auszuschließen. Die Netze laufen darum nur über Gelegenheiten
> und Arten, nie über die Zusagefelder und nie über die Ausschlussliste.

## 9. Was fehlt, und warum

- Keine Lieder, keine Titel, keine Übersetzung.
- Kein Audio: die App spielt nichts.
- Keine Dauer, kein Soll, keine Häufigkeitsempfehlung.
- Kein Feld für Namen, Alter, Geburtsdatum, Freitext — kein `<input>`.
- Keine Feste, keine Instrumentenliste.
- Keine Bewegungs-Ampel für 3–7 (Nr. 62).

## 10. Politik-Konformität (docs/02)

- werbefrei, ohne Konten, ohne externe Anfragen;
- ein localStorage-Schlüssel `mab.notizen` mit drei Feldern je Notiz und
  sieben Tagen Reichweite, `datenKarte` löscht ihn, kein `localStorage.clear()`;
- deutsche UI, russisches README, deutsches GDD;
- mobile-first, 360 px ohne Querscrollen, Knöpfe ≥ 48 px;
- `Vorlesen` nur mit Gerätestimme;
- Druck über eigenes `druck.css`, ohne Haken, Namenszeile und Farbe;
- Impressum im Fuß; Elterntelefon in der App.

## 11. Tests

`node --test apps/musik-alltags-begleiter/test/logik.test.mjs` (28 Tests), fast
jeder mit Gegenprobe.
