# GDD — Das Gespräch vor der Schule

## Was es ist

Ein Werkzeug für Eltern vor der Einschulung. Es stellt **keine Frage über das
Kind**. Es hilft, Fragen zu stellen — in der Kita und in der Grundschule.
Werkzeug für Erwachsene, darum kein Kinderbildschirm und keine `eltern.html`.

## Die tragende Entscheidung: die Richtung der Frage ist umgedreht

Die Quelle (S. 300–311) trägt nachgezählt **141 Merkmale in 13 Feldern**:
7 + 7 + 21 + 21 + 9 + 9 + 10 + 8 + 10 + 20 + 7 + 4 = 133 in zwölf Feldern, plus
8 Vorbedingungen des Lernens = 141. Die Zahlen des Katalogeintrags (12 + 8)
stimmen also.

Der Eintrag wollte daraus eine „Checkliste in Elternsprache". Kein einziges der
141 Merkmale ist als Punkt zum Ankreuzen übernommen, und der Grund steht im
**ersten Feld der Quelle selbst**: es fragt unter anderem, ob „Anzeichen von
hoher Ängstlichkeit, Depressivität, Ungeschütztheit" fehlen. Das ist eine
klinische Frage. Sie zu Hause anzukreuzen heißt, am eigenen Kind ein Screening
zu machen — ohne Ausbildung und ohne jemanden, der das Ergebnis einordnet. Das
zweite Feld verlangt Größe, Gewicht und Brustumfang „nicht unter dem
Altersdurchschnitt". Das dritte fragt nach den Staatssymbolen eines anderen
Landes.

Übernommen ist die **Gliederung**. Umgedreht ist die **Richtung**: aus „Kann Ihr
Kind das?" wird „Was haben Sie beobachtet?", gefragt werden die Fachkräfte.
Dieselbe Umkehrung trägt Nr. 62 für die vier Fragen der Quelle an das Kind.

Für Fachkräfte gibt es den Beobachtungsbogen schon — `schulstart-begleiter`, mit
drei Stufen und ohne Scoring. Eine Elternfassung davon wäre keine Hilfe, sondern
dieselbe Liste in einer Hand, die sie nicht einordnen kann.

## Zwölf Felder, je fünf Angaben

```
quellFrage       → was die Liste der Quelle prüft (mit Beispiel)
nichtUebernommen → die abgelehnte Frage, ZITIERT, und warum
ihreFrage        → die Frage, die Eltern stellen           (endet mit ?)
wasSieErzaehlen  → was Eltern selbst beitragen: eine Situation
wohinEsGehoert   → wohin die Sache gehört, wenn sie wohin gehört
```

Die stärkste Frage ist die aus dem Feld „Mithelfen": *Was macht mein Kind bei
Ihnen allein, was es zu Hause nicht allein macht?* Die Kita sieht ein Kind in
einer Lage, in der Eltern es nie sehen — und das ist keine Bewertung, sondern
eine Auskunft.

## Neu: DIE AUSNAHME MUSS SICH VERDIENEN

Seit Nr. 60 halten die Apps fest, welches Feld von welchem Textnetz ausgenommen
ist und warum (Falle A: ein Feld, das etwas ausschließt, muss es benennen
dürfen). Hier kommt die **Gegenrichtung** hinzu:

```js
export const AUSNAHME_MUSS_ENTHALTEN = Object.freeze({
  wasEsIst:         ['KINDFRAGE', 'BEWERTUNG'],
  keinBericht:      ['BEWERTUNG'],
  ausgeschlossen:   ['BEWERTUNG'],
  quelle:           ['KYRILLISCH'],
  nichtUebernommen: ['KINDFRAGE'],
})
```

Ein ausgenommenes Feld **muss** die Konstruktion enthalten, für die es
ausgenommen ist. Sonst ist die Ausnahme keine Ausnahme, sondern eine Lücke — und
genau so eine Lücke entsteht still, wenn jemand den Text umschreibt und das
Zitat dabei verliert. `warumKeineCheckliste` steht nicht in der Tabelle, weil es
seine Ausnahme anders verdient: der Validator verlangt, dass es die klinische
Frage der Quelle namentlich nennt.

## Das Netz, das die Anrede unterscheidet

`KINDFRAGE` trifft „Kann **Ihr** Kind", „Liegt **Ihr** Kind", „**Ihr** Kind
sollte" — die Anrede der zweiten Person, mit der eine App Eltern über ihr Kind
ausfragt. Es trifft **nicht** „Was macht **mein** Kind bei Ihnen allein?": so
sprechen Eltern von ihrem Kind, wenn sie selbst fragen, und genau das soll dieses
Werkzeug ermöglichen. „Kann **mein** Kind **schon** lesen?" trifft es wieder —
das ist dieselbe Checkliste in der Ichform.

## Zwölf Rechtsfragen, jede mit Paragraf

Einschulung ist Landesrecht; der Validator verlangt deshalb, dass mindestens
**zwei** Antworten je **zwei** Bundesländer nennen — sonst klingt ein Beispiel
wie eine bundesweite Regel (Vorbild: Nr. 64). Dazu zwei inhaltliche Zwänge: die
Antwort auf „wer entscheidet" muss die **Schulleitung** nennen, und die Antwort
auf das Urteil „schulfähig" muss sagen, dass die Untersuchung keines ausspricht,
sondern Befund und **Empfehlung**.

Der stärkste Satz dieses Teils ist ein Zitat aus der Fachliteratur: die alten
Schulreife-Konzepte wurden verlassen, weil sie einer Überprüfung nicht
standhielten, und es stelle sich „nicht mehr die Frage, ob, sondern mit welchen
Hilfen und welcher Förderung ein Kind einzuschulen ist".

Drei Fragen sind nach der Faktenprüfung hinzugekommen:

- **Darf die Kita ihre Unterlagen an die Schule geben?** Nur mit Einwilligung;
  eine gesetzliche Übermittlungsbefugnis gibt es nicht. Drei Punkte, die selten
  richtig dargestellt werden: die Einwilligung ist gegenüber der **Kita** zu
  erklären, sie darf **nicht im Betreuungsvertrag** mitstecken, und sie ist
  jederzeit widerruflich. In Nordrhein-Westfalen erhält die Schule die
  Dokumentation nur **zur Einsichtnahme**, nicht als Kopie.
- **Kann ich jemanden mitbringen, der übersetzt?** Einen allgemeinen Anspruch
  auf einen Dolmetscher gibt es nicht — ein Kita-Gespräch ist meist nicht
  einmal ein Verwaltungsverfahren. Bei Hör- oder Sprachbehinderung dagegen
  besteht ein echter, kostentragender Anspruch auf Gebärdensprache oder andere
  Kommunikationshilfen. Diese beiden Fälle trennt die App scharf.
- **Muss mein Kind vor der Schule lesen können?** Nein — mit Belegkette aus
  Lehrplänen, der Vereinbarung der Kultusministerkonferenz zur Grundschule und
  der altersgebundenen Schulpflicht. Und mit der ehrlichen Angabe, dass keine
  amtliche Stelle diesen Satz ausdrücklich so schreibt: das Ergebnis folgt aus
  den Quellen zusammen. Umgekehrt steht hier auch nicht, frühes Lesen schade.
- **Bekomme ich die Unterlagen über mein Kind zu sehen?** Ja — Auskunft und
  eine Kopie der personenbezogenen Daten, nicht Einsicht in die ganze Akte;
  die erste Kopie unentgeltlich, fremde Namen geschwärzt. In
  Nordrhein-Westfalen wird die Dokumentation beim Ende der Betreuung
  ausgehändigt, ohne Antrag und ohne Entgelt.

### Was die zweite Runde der Faktenprüfung umgedreht hat

Zwei Antworten waren **falsch** und sind korrigiert:

- **Das Ergebnis der Untersuchung in Bayern.** Die erste Fassung sagte, ein
  ausdrücklicher Anspruch auf ein schriftliches Ergebnis sei dort nicht zu
  finden. Es gibt ihn: die Schulgesundheitspflegeverordnung regelt ihn unter
  der Überschrift „Ergebnis der Schuleingangsuntersuchung". Die App zitiert
  diese Vorschrift jetzt über ihre **Überschrift** und nicht nur über ihre
  Nummer — eine Änderungsverordnung verschiebt sie zum 1. August 2027 um einen
  Paragrafen weiter, und eine App, die die Nummer nennt, wäre an diesem Tag
  falsch.
- **Die Freiwilligkeit der Angaben.** Sie gilt nicht überall. In Brandenburg
  haben Kinder und Eltern die erforderlichen Angaben **zu machen**, begrenzt
  allein dadurch, dass darüber hinausgehende Fragen zur Persönlichkeitssphäre
  nicht gestellt werden dürfen. Die erste Fassung verallgemeinerte das
  Datenschutzblatt eines Gesundheitsamtes — genau der Fehler, den diese App
  sonst verfolgt.

Drei weitere Korrekturen:

- Die schleswig-holsteinische Fundstelle für das Einwilligungserfordernis war
  **keine Einwilligungsnorm**, sondern die Definition des Wortes „Eltern" — die
  Klammer im Erlass stand hinter dem Wort, nicht hinter der Rechtsfolge. Das
  Erfordernis folgt aus dem Erlass selbst.
- Es gibt **einwilligungsfreie Meldepflichten** der Kita für einzelne Daten.
  Die Behauptung, kein Bundesland erlaube eine Übermittlung ohne Einwilligung,
  hielt nicht: in Nordrhein-Westfalen geht ein Datensatz an das Schulamt für
  die Sprachstandsfeststellung, in Bayern eine Meldung an die Grundschule bei
  Verstoß gegen eine Sprachförderpflicht. Für die
  **Entwicklungsdokumentation** bleibt es bei der Einwilligung.
- Der Anspruch auf **Gebärdensprache** richtet sich gegen den Leistungsträger
  im Sozialverwaltungsverfahren und erreicht eine **Grundschule nicht**: die
  Schule ist kein Leistungsträger, Schulbesuch keine Sozialleistung. Dort gilt
  das Gleichstellungsgesetz des Landes. Und das Argument, im Sozialrecht könne
  eine Behörde eine Übersetzung verlangen, betraf **Dokumente**, nicht das
  Dolmetschen in einem Gespräch — es ist gestrichen.

## Die acht Vorbedingungen — vollständig, mit Gegenrede

Sie stehen im Wortlaut da, auch die unbequemen: Lautanalyse von Wörtern
„praktisch jeder Schwierigkeit", alle Vokalbuchstaben, silbenweises Lesen. Zu
jeder steht, was hier gilt, und **wer Schulstoff nennt, braucht dafür eine
Quelle** — das prüft der Validator über das Muster `SCHULSTOFF`. Der
entscheidende belegte Punkt: das verbreitetste Verfahren der
Schuleingangsuntersuchung nennt seine drei Indikatoren selbst
„Vorläuferfähigkeiten für Lesen und Schreiben" beziehungsweise „für Rechnen" —
geprüft wird also nicht das Lesen, sondern was ihm vorausgeht.

Nach der Faktenprüfung sind drei dieser Gegenreden genauer geworden, und zwar
in beide Richtungen:

- **Risikokinder:** für sie ist im deutschen Sprachraum kein Nutzen
  nachgewiesen — das ist **fehlende Evidenz, kein Nachweis eines Schadens**.
  Die Effekte sind nicht von Null zu unterscheiden, bei vier bis fünf Studien;
  international findet man dort eher größere Effekte. Die erste Fassung
  schrieb „das Gegenteil ist der Befund", und das war ein Fehlschluss.
- **Lautbewusstheit** erklärt im deutschen Sprachraum etwa ein Zehntel der
  Unterschiede im späteren Lesen — weniger als in englischsprachigen Studien;
  in Sprachen mit regelmäßiger Schrift sagte eher das Lesen die Lautbewusstheit
  voraus als umgekehrt. Sie ist **Begleiterin, nicht Vorbedingung**. Übungen
  verbessern die Lautbewusstheit selbst; der Übertrag auf das Lesen ist
  langfristig klein, beim Entschlüsseln nicht nachweisbar, und bei
  Risikostichproben war er nicht zu finden.
- **Buchstabenkenntnis** sagt das spätere Lesen sogar *besser* vorher als die
  Lautbewusstheit (Sekundärzitat, nicht im Original geprüft). Daraus folgt
  nicht, dass Üben das bewirkt — Vorhersage und Wirkung werden hier regelmäßig
  verwechselt. International halten Programme zur phonemischen Bewusstheit ihre
  Wirkung durchaus, Vorschul- und Kindergartenprogramme eher nicht; die App
  nennt jetzt beide Hälften dieses Befunds statt nur der einen.
- **Silbenweises Lesen**: in einer Studie, die deutsch- und englischsprachige
  Kinder verglich, waren die meisten deutschsprachigen Kinder zu Schulbeginn
  noch Nichtleser — das ist dort allerdings eine Randbemerkung zu den Grenzen
  der Studie, kein eigener Befund, und so steht es auch in der App.

Übungen dazu gibt es in dieser App nicht, und das ist eine Entscheidung, keine
Auslassung. Die Zahlen stehen jeweils im `quelle`-Feld desselben Punktes, nicht
im Elterntext.

## Einsprachig, und der Grund ist kein Zeitmangel

Der Eintrag wollte de/uk/ru. Hier stehen Rechtsbegriffe — Einwilligung,
Zurückstellung, Schuleingangsuntersuchung. Eine ungeprüfte Übersetzung davon
wäre schlimmer als keine: sie klingt verbindlich und ist es nicht. Der Validator
verlangt, dass der Absatz `dreiSprachen` alle drei Sprachen **benennt** —
verschwiegen wird die Absage nicht.

## Daten und Technik

- `logik.mjs` ist rein: keine DOM-, keine Netz-, keine Speicherzugriffe.
- Umgekehrte Prüfung wie in Nr. 60–65: `angebotsTexte` liefert den **Rest**.
  Die Bilanz 133 + 8 = 141 ist die Probe darauf, dass die Felder der Quelle
  nachgezählt und nicht geschätzt sind; ein verschobener Wert fällt auf.
- `KOENNENSALTER` kennt auch ausgeschriebene Zahlen (Lehre aus Welle 80).
- `VORHERSAGE` enthält den Stamm „prognos" **nicht**: eine Quellenangabe darf
  die prognostische Güte einer Studie nennen, ohne selbst eine Vorhersage zu
  sein. Getroffen wird die Konstruktion.
- Das Druckblatt trägt Ihre Fragen und **Linien für die Antworten** — ohne
  Haken, ohne Punkte, ohne Namenszeile (docs/02) und ohne eine einzige Angabe
  über das Kind. Ohne Auswahl stehen alle Fragen darauf: ein leeres Blatt wäre
  kein Blatt.
- Gespeichert wird `eub-fragen`: welche Fragen Sie mitnehmen wollen. Mit
  `datenKarte` samt Löschknopf.
- 18 Tests.

Quelle: «Пралеска» © НИО 2007, S. 300–311 — übernommen sind Konzept und
Gliederung, alle Formulierungen sind Eigenproduktion. Der Katalogeintrag nennt
S. 301–311 und „Учебная деятельность, S. 311"; nachgelesen beginnt der Abschnitt
auf S. 300, und die Überschrift auf S. 311 lautet „**Предпосылки** учебной
деятельности" — die Vorbedingungen, nicht die Lerntätigkeit selbst.
