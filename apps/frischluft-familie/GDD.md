# Frischluft-Familie — Game Design Document

**Nr. 63 der Eltern-Werkzeuge (docs/10). Quelle: Praleska S. 125.**

## 1. Was es ist

Kein Trainingsplan und keine Checkliste, sondern acht Behauptungen und ihre Prüfung. Werkzeug für
Erwachsene; es gibt nichts anzukreuzen, nichts zu speichern und nichts auszuwerten.

## 2. Die tragende Entscheidung: die Bilanz steht vorn

Der Katalogeintrag versprach eine „evidenzbasiert gefilterte“ Übernahme – also die Einordnung, was
die deutsche Präventionsempfehlung **stützt**. Die Prüfung ergab etwas Schärferes: **gestützt ist
keine der acht**, jedenfalls nicht als Infektvorbeugung bei Drei- bis Fünfjährigen. Das steht als
Erstes in der App, nicht im Kleingedruckten, und der Validator erzwingt es: fehlt der Satz „Keine
der acht …“ in `dieEhrlicheBilanz`, sind die Daten ungültig.

Dazu gehört der zweite Satz: **es ist kein Versäumnis, nichts davon zu tun.** Eine App, die acht
Maßnahmen durchgeht und am Ende offenlässt, ob man nun soll oder nicht, erzeugt genau das schlechte
Gewissen, das sie vermeiden wollte.

## 3. Drei Einordnungen, jede mit Quelle

`belegtAnders` (gut, aber aus anderem Grund), `nurEingeschraenkt`, `nichtUebernommen`. Der Validator
verlangt zu **jeder** Maßnahme eine `quelle` – eine Einordnung ohne benennbare Quelle ist eine
Meinung – und zu jeder nicht abgelehnten ein `wasStattdessen`.

Die Verteilung: 3 / 3 / 2. Gut aus anderem Grund sind Draußensein (BIÖG: 1–2 Stunden täglich),
Händewaschen (die am besten belegte Einzelmaßnahme – wegen der Seife, nicht der Temperatur) und
Barfußlaufen (steht in der Knick-Senkfuß-Leitlinie unter Prävention, nicht unter Abhärtung).

## 4. Zahlen: im Zitat ja, im Rat nein

`quellText` gibt die Quelle im Wortlaut wieder, samt ihrer Zahlen („fünf bis zwanzig Minuten“).
`DOSIERUNG` weist jede Anwendungsdauer im **Rat** ab – und zwar auch ausgeschrieben, denn genau so
steht sie in der Quelle. Eine Regel, die nur Ziffern kennt, hätte „fünf Minuten“ durchgelassen;
dieselbe Falle wie bei den Altersangaben in Nr. 57.

Nicht getroffen wird die belegte Gradangabe der Nacht: „nicht wärmer als achtzehn Grad“ ist eine
Empfehlung des BIÖG und gehört in den Rat.

## 5. Die Netzdeckung läuft über Felder, nicht über Listen

Beim Bau gelernt: `massnahmen` als Ganzes auszunehmen, weil `quellText` darin zitiert, nimmt
`wasStattdessen` gleich mit – und das ist ein Rat, der durch die Netze muss. Deshalb gibt es
`NICHT_GEPRUEFT` (Felder der obersten Ebene) **und** `NICHT_GEPRUEFT_FELDER` (einzelne Feldnamen
innerhalb der Listen, hier nur `quellText`). Die Deckung stieg damit von 5 auf über 90 geprüfte
Texte.

## 6. Was oft dazugezählt wird

Kalte Güsse, Sauna und Sonnenbäder stehen in der Quelle **nicht** – aber in den Köpfen. Wer die
Liste liest, sucht danach, also stehen sie da, mit Urteil und Quelle. Besonders die Sauna: es gibt
dazu keine deutsche Fachgesellschaftsempfehlung mit Alter, Temperatur oder Dauer; das einzige
auffindbare Merkblatt eines kinderärztlichen Elternportals stammt aus dem Jahr 2008, nennt keine
Quelle und begründet Sauna unter anderem mit „Erziehung des Willens“.

## 7. Auch das Belegte hat eine Grenze

`wasWirklichHilft` trägt vier Einträge, und jeder muss eine `einschraenkung` haben – der Validator
weist einen Eintrag ohne sie ab. Händewaschen: die oft genannte Wirkungszahl stammt aus gemischten
Gruppen, der kinderspezifische Übersichtsartikel verzichtet bewusst auf eine gemeinsame Zahl.
Rauchfreiheit: die Zahlen stammen aus Untersuchungen an Kindern unter zwei Jahren. Lüften: das
Umweltbundesamt sagt selbst, dass sich der Beitrag zur Infektionsvorbeugung nicht eindeutig belegen
lässt, und seine Richtwerte betreffen Unterrichtsräume.

Eine Liste „was wirklich hilft“ ohne diese Sätze wäre dieselbe Art von Behauptung wie die, die
diese App zurückweist.

## 8. Druck

Ein Blatt, das man der Kita oder den Großeltern in die Hand drücken kann: die Bilanz, die acht
Punkte **mit ihrem Urteil** und das Belegte. Ohne Knöpfe, ohne Haken, ohne Namenszeile.

## 9. Grenzen

* Keine Dosierung, keine Anwendungsanleitung, keine Temperatur für Wasser.
* Keine Aussage zu einem einzelnen Kind, in keiner Form.
* Keine Impfberatung: welche Impfung ansteht, steht im STIKO-Impfkalender und wird in der
  kinderärztlichen Praxis besprochen. Die Grippeimpfung ist in Deutschland für gesunde Kinder nicht
  allgemein empfohlen – eine App darf die Empfehlung nicht ausweiten.
