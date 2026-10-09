# Erste Künstler 1–3 — Game Design Document

**Nr. 61 der Eltern-Werkzeuge (docs/10). Quelle: Praleska S. 101–102.**

## 1. Was es ist

Eine Ideenkartei für das erste eigene Tun von Kindern zwischen 1 und 3: kritzeln, mit den Fingern
malen, formen, kleben, bauen, eine Socke sprechen lassen. Kein Spiel, kein Quiz – und
ausdrücklich **keine Checkliste**. Das Gerät ist in der Hand des Erwachsenen, darum keine
`eltern.html`.

## 2. Nutzung in einem Satz

Was sehen Sie gerade? → die Karte dazu aufklappen → drei Schritte, woran Sie sehen, dass es passt,
wann Schluss ist, und was Sie brauchen → bei Bedarf drucken.

## 3. Die tragende Entscheidung: keine Checkliste

Der Katalogeintrag wollte „19 Meilensteine … als Checkliste plus Bericht“. Beides ist gestrichen,
und zwar nicht aus Geschmack, sondern aus zwei nachprüfbaren Gründen:

1. **Der Zeitpunkt in der Quelle.** Die Merkmalsliste ist überschrieben mit „zum Ende des dritten
   Lebensjahres“. Sie beschreibt den Zustand am Ende der Spanne. Eine Checkliste „für 1 bis 3“
   würde daraus einen Weg machen, den die Quelle nicht behauptet.
2. **Es gibt keine deutsche Referenz.** Die Grenzsteine der Entwicklung kennen keinen Bereich
   „künstlerische Entwicklung“; bis drei Jahre stehen dort zum Malen zwei Punkte (Stifthaltung im
   24. Monat unter Hand-Finger-Motorik; im 36. Monat, ob das Kind auf Nachfrage sagt, was es gemalt
   hat – unter kognitiver Entwicklung). Ihre Autoren schreiben selbst, dass sie kein
   Diagnoseinstrument sind. Die Kinder-Richtlinie des G-BA hat zur U7 einen einzigen Malpunkt (die
   flache Spirale), zur U7a keinen, und die Stifthaltung erst zur U8 nach dem dritten Geburtstag.

**Korrektur nach der Gegenprobe:** die erste Fassung schloss mit „zu Singen, Zuhören, Kneten und
Fingermalen steht in beiden nichts“. Im Richtlinientext selbst nachgelesen ist das falsch – zur U7a
steht unter „Perzeption/Kognition“ der Punkt „Kann zuhören und konzentriert spielen, Als-Ob-Spiele.“,
und „Singen“ kommt viermal vor, allerdings nur als Mittel („lässt sich durch Wiegen, Singen oder
Ansprache … beruhigen“), nie als etwas, das das Kind tut. Der Schluss braucht diesen pauschalen
Negativbefund gar nicht: es gibt bis drei Jahre kein Merkmal dafür, WIE ein Kind singt, formt oder
malt. Genau so steht es jetzt in der App, und ein Test hält die zurückgezogene Fassung draußen.

Der Validator erzwingt, dass **beide** Gründe in der App stehen: fehlt „Grenzsteine“ oder „dritten
Lebensjahr“ im Text, sind die Daten ungültig. Eine Entscheidung ohne ihre Begründung ist eine
Meinung.

## 4. Ordnung: nach der Gelegenheit, nicht nach Alter

Jede Karte beginnt mit `wennSie` – dem, was der Erwachsene schon sieht. Das ist die direkte
Konsequenz aus Punkt 3: ohne Referenzliste gibt es keine Reihenfolge nach Alter, wohl aber eine
nach Anlass. `ALTERSSTUFUNG` weist jede Monats- und Jahresangabe an einer einzelnen Karte ab; die
Spanne 1 bis 3 steht nur im Rahmen.

## 5. Die Bilanz der 19 Merkmale

4 (Sprache) + 8 (Musik) + 7 (Kunst) = 19, nachgezählt. Vier Einordnungen: 7 `ideeDa`,
6 `anderesWerkzeug`, 5 `nichtUebernommen`, 1 `beschreibend`.

`pruefeDaten` rechnet beide Richtungen: ein `ideeDa`-Merkmal ohne Karte, eine Karte, die ein
`nichtUebernommen`-Merkmal für sich beansprucht, und ein Verweis auf eine App, die es nicht gibt,
machen die Daten ungültig. Die fünf `nichtUebernommen` sind die musikalischen Merkmale, die
Instrumente (Metallofon, Xylofon, Triangel) oder „vom Programm vorgesehene“ Tanzbewegungen
voraussetzen: dieser Korpus schafft nichts an und hat keinen Lehrplan.

## 6. Sicherheit steht an jedem Material

In diesem Alter kommt alles in den Mund. Jedes der zehn Materialien trägt seinen eigenen Satz
(mindestens 30 Zeichen, vom Validator erzwungen), und totes Material – eines, das keine Karte
benutzt – ist ein Datenfehler.

Drei Stellen sind beim Bau eigens geprüft worden:

* **Fingerfarbe.** Genannt ist EN 71-7 als Norm, nicht als Gesetz; genannt ist, was sie verlangt
  (Bitterstoff, Stoffgrenzen, pH, Aufsichtshinweis auf der Packung), und ausdrücklich nicht, dass
  die Farbe deshalb unbedenklich wäre. Ein Test verbietet die Wörter „gesetzlich“, „essbar“ und
  „ungiftig“ in bejahender Form – mit Lookbehind, damit die Verneinung stehen bleiben darf.
* **Salzteig** ist ausgeschlossen, ohne eine Mengenschwelle zu erfinden: die amtliche Warnung
  nennt keine, also nennt die App auch keine. Ein Test weist jede Gramm- und Löffelangabe ab.
* **Plastiktüte** ist an zwei Stellen ausdrücklich ausgeschlossen (Material und Karte), weil die
  Tütenpuppe die naheliegendste und gefährlichste Variante der Handpuppe ist.

## 7. Die Bildschirmregel, richtig zugeordnet

Der Katalogeintrag wollte „BZgA-Empfehlung ‚keine Bildschirmzeit unter 3‘ direkt in der App“.
Gebaut ist das – mit der Korrektur, die die Prüfung ergeben hat: die Drei-Jahres-Grenze ist
**deutsch** (BIÖG, vormals BZgA; AWMF-Leitlinie 027-075 der DGKJ). Die WHO-Leitlinie für Kinder
unter fünf Jahren kennt sie nicht: sie rät Einjährigen von Bildschirmzeit ab und lässt
Zweijährigen bis zu einer Stunde. Derselbe Fehler stand in der App „Sprich mit mir!“ (die WHO
war dort als Beleg für die Drei-Jahres-Grenze genannt) und ist in dieser Welle berichtigt worden.

## 8. Kein Speicher, kein Bericht

Ein Haken an einer Idee wäre der Anfang einer Kindakte, ein Bericht wäre ein Bericht über ein Kind.
Tests prüfen, dass im Code weder `localStorage` noch `datenKarte` noch ein Export vorkommt.

## 9. Druck

Gedruckt wird die **offene** Karte, nicht die ganze Kartei (`.ek-idee:not(.ek-offen)` wird
ausgeblendet) – anders als in Nr. 60, wo ein Blatt alle fünf Achsen trägt, ist hier jede Karte für
sich eine Tätigkeit. Schritte 13 pt (gemessen: 17,3 px). Keine Namenszeile, kein Haken.

## 10. Barrierefreiheit

Alle Knöpfe ≥ 48 px (gemessen: keiner unter 44 px), `aria-expanded` + `aria-controls` an jeder
Karte, Fokus bleibt nach dem Klick auf dem Knopf, kein Querscrollen bei 360 px, nur eine Karte
zugleich offen. Vorlesen nur mit lokaler Stimme, mit `voiceschanged`-Listener.

## 11. Grenzen

* Kein Wirkversprechen – auch nicht zur Feinmotorik.
* Keine Lieder und keine Liedtexte (Rechtslage wie in Nr. 59).
* Kein eigenes Urteil über ein Kind, in keiner Form.
* Was ein einzelner Gegenstand aushält, prüft der Spielzeug-Check U3.
