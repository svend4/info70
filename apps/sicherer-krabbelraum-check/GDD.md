# Kurz-GDD: Sicherer-Krabbelraum-Check 🧷

**Einheit aus Katalog:** docs/10 (Praleska), Abschnitt „Инструменты для
родителей“, Nr. 50 — «Sicherer-Krabbelraum-Check». Quelle:
«Обеспечение безопасности» (S. 34, vier Ziele).
**Engine:** eigene Kriterien-Liste (reine Logik + JSON-Bank). Zielgruppe:
**Eltern, Kindertagespflege und Krippe. Kein Bildschirm für das Kind.**

## 0. Die vier Quellziele, nachgelesen

Nachgezählt in `PRALESKA.pdf` (Zweig `main`), S. 34 — vier Ziele, genau wie
der Katalog sagt: öko-hygienische Bedingungen (Sauberkeit von Raum, Kleidung,
Spielzeug, Frischluft); das Bedürfnis nach Zuwendung befriedigen; ständigen
Kontakt halten und eine Atmosphäre psychischen Komforts für das Gefühl der
Geschütztheit schaffen; günstige Bedingungen für Bewegung schaffen und für
Sicherheit sorgen — gefährliche Gegenstände entfernen, den Raum nicht mit
Möbeln zustellen, die nicht für Kinder gedacht sind, Stürze verhindern.

Bemerkenswert: dieser Abschnitt der Quelle enthält **keine einzige Zahl** —
keine Raumtemperatur, keine Bettmaße, keine Abstände. Es gab also gar nichts
zu übernehmen, was als deutsche Anforderung hätte gelesen werden können.

## 1. Der Check schaut auf den Raum

Jedes Kriterium hat einen Raum, einen Gegenstand oder eine Handlung daran als
Gegenstand. Keines beschreibt, was das Kind kann, und keines bewertet den
Erwachsenen. Der Validator weist jedes Kriterium ab, dessen Subjekt das Kind
ist — beim Bau hat er genau das zweimal getroffen („Jedes Kind hat seinen
eigenen Schlafplatz“, „Dein Kind trägt nichts um den Hals“), und beide Zeilen
sind umgeschrieben, bis der **Gegenstand** Subjekt war.

Das ist die wahrscheinlichste Abdrift dieser App, weil
`apps/meilenstein-begleiter` dieselbe Zielgruppe hat. Die harte Grenze:
`meilenstein-begleiter` beobachtet das Kind, Nr. 50 beobachtet den Raum.

## 2. Das dritte Ziel ist übersetzt, nicht übernommen

Das dritte der vier Quellziele – «psychische Geborgenheit» – als Kriterium wäre eine Beurteilung von Person und
Bindung — gegen die Projektregel und fachlich nicht prüfbar. Übersetzt ist es
in prüfbare **Raum-Eigenschaften**: eine ruhige Ecke ohne
Durchgangsverkehr; kein laufender Bildschirm und kein Dauerradio im
Krabbelraum; eine Blickachse zu einer vertrauten Person; Abdunkelbarkeit und
Zugluftfreiheit am Schlafplatz. Der Validator verlangt, dass jede Zeile dieses
Bereichs eine solche Eigenschaft nennt, und verbietet `Bindung`,
`feinfühlig`, `liebevoll`, `geborgen fühlt`.

## 3. Es gibt keine Gesamtwertung

„Die Wohnung ist zu 82 Prozent sicher“ ist eine falsche Aggregation nicht
austauschbarer Risiken — eine abgedeckte Steckdose ersetzt kein
Treppenschutzgitter — und eine Einladung, aufzuhören.

`logik.mjs` exportiert darum **keine** Funktion, die über alle Kriterien
summiert. Ein Test prüft die Exportnamen, sucht im Rechenteil nach
`Math.round(... / ... * 100)` und nach `reduce`, und prüft den erzeugten
Bericht auf `n von m` und auf einen Prozentwert. Die Gegenprobe (eine
`gesamtAnteil`-Funktion und ein Prozentwert im Bericht) macht ihn rot.

Das ist nötig, weil die Engine-Vorbilder im Korpus genau das rechnen:
`apps/kria-check` druckt „Erfüllt: n von m“ und `apps/kita-familien-bruecke`
liefert eine Ampel über Punkte. Beide sind richtig für ihren Zweck — ein
Team-Selbstcheck darf sich einen Stand geben. Ein Raum darf es nicht.

**Und eine leere Liste ist keine Freigabe.** Der Bericht sagt bei vollständig
gesetzten Haken „Nichts offen aus dieser Liste“ und direkt danach, dass das
nicht heißt, der Raum sei sicher: die Reichweite des Kindes ändert sich von
Woche zu Woche, und jeder Karton verändert den Raum wieder.

## 4. Zwei strukturell verschiedene Arten

`art: 'einmal'` ist ein Handgriff am Raum — Kippsicherung, Treppenschutzgitter,
Fenstersicherung, Kordeln kürzen, Kleinteile hochräumen — und **abhakbar**.

`art: 'immer'` ist eine Regel für jedes Mal — beim Wickeln eine Hand am Kind,
beim Baden im Griff-Abstand bleiben, heiße Getränke außer Reichweite, nichts
um den Hals, nicht in der Wohnung rauchen — und ausdrücklich **nicht
abhakbar**. Ein Haken daran würde eine Dauerregel als erledigt ausgeben. Im
Markup bekommt eine Dauerregel keinen Knopf, und sie erscheint nie in der
Offen-Liste, egal was angehakt ist.

## 5. Auslöser sind Fähigkeiten, nicht Monate

Das Altersband „0-1“ reicht vom Neugeborenen, das sich nicht bewegt, bis zum
Kind, das Schubladen öffnet. Das Gefahrenprofil macht die **Motorik**, nicht
der Kalender: ein Treppenschutzgitter ist für ein Neugeborenes irrelevant und
für ein robbendes Kind dringend.

Jedes Kriterium trägt darum `ausloeser` aus
`immer | dreht-sich | robbt-kriecht | sitzt-frei | zieht-sich-hoch |
laeuft-an-moebeln`. Der Einstieg fragt „Was kann dein Kind schon?“ — und das
ist ausdrücklich **nur ein Filter**: keine Normwerte, kein Alter, keine
Bewertung. Der Validator lehnt jede Monatsangabe in den Auslösern ab.

## 6. Der Schlafplatz steht zuerst und absolut

Jede „wenn … dann ist auch … in Ordnung“-Klausel ist hier lebensgefährlich:
„Bauchlage ist okay, sobald das Baby den Kopf gut halten kann“, „ein
Bettnestchen schützt vor Stoßen am Gitter“. Der Validator lehnt im
Schlaf-Abschnitt `sobald`, `solange` und „ist okay, wenn“ ab, und er
verlangt, dass die vier tragenden Zeilen vorkommen: Rückenlage, Schlafsack,
eigenes Bett, rauchfreie Wohnung.

Der Abschnitt steht **vor** allen anderen, außerhalb der Reihenfolge der
übrigen Bereiche, und sein Vorspann sagt ausdrücklich, dass er absolut gilt.

## 7. Jede Zeile nennt die Stelle — und keine erfundene Fundstelle

Eine erfundene Fundstelle sieht genauso aus wie eine geprüfte, und in einer
Baby-Sicherheits-App ist das der gefährlichste Fehler. Darum trägt jedes
Kriterium `quelle.gremium` (die zuständige Stelle), aber **keine Seitenzahl**
— und ein Kapitel-, Paragrafen- oder Seitenverweis darf nur dastehen, wenn
`quelle.geprueft === true` ist. Damit ist die Falle strukturell unmöglich und
nicht nur redaktionell vermieden.

Zwei Dokumente sind wirklich nachgesehen und darum als geprüft markiert:

- **DGUV Regel 102-602 „Branche Kindertageseinrichtung“ (07/2019)** ist die
  geltende Regel. Sie hat die **DGUV Regel 102-002 (04/2009)** ersetzt, die zu
  Beginn 2020 zurückgezogen wurde. Der Katalogeintrag in docs/10 nennt noch
  „DGUV-Regeln für Kindertageseinrichtungen“, also die zurückgezogene — eine
  App, die sich darauf beruft, ist in einer Krippe nicht verwendbar. docs/10
  ist entsprechend korrigiert.
- **DIN VDE 0620 (Fassung 2021-02)** für Steckdosen mit erhöhtem
  Berührungsschutz.

Und ein Satz steht in den Daten, nicht im Vorwort: *keine der genannten
Stellen hat diesen Check geprüft oder freigegeben.*

## 8. Steckdosen: die Dose, nicht der Aufkleber

Die Adaptionsnotiz in docs/10 legt „Steckdosensicherung aufkleben“ nahe. Was
belegbar ist: die **Dose mit erhöhtem Berührungsschutz nach DIN VDE 0620**,
nachgerüstet von einer Elektrofachkraft. Dazu zwei Dinge, die ebenfalls
belegbar sind und zusammen gehören: dass eine Steckdose „kindersicher“ sei,
darf nicht mehr behauptet werden — der VDE hat sein Zertifizierungsverfahren
2020 nach einem tödlichen Unfall in einer Kita verschärft —, und auch eine
Dose mit Shutter ist **kein absoluter Schutz**.

Was die App **nicht** behauptet: dass aufgeklebte Nachrüst-Sicherungen
normwidrig seien. Das ließ sich nicht belegen. Die Zeile sagt stattdessen, was
wahr ist: *ob ein aufgeklebter Einsatz schützt, kann dieser Check nicht
beurteilen — frag die Elektrofachkraft.* Eine Vermutung als Tatsache
auszugeben wäre genau der Fehler, den dieser Check vermeiden soll.

## 9. Was fehlt, und warum

- **Keine Erste Hilfe.** Nicht gekürzt und nicht gehedged, sondern abwesend,
  mit einem Satz: dieser Check ist keine Erste-Hilfe-Anleitung, Erste Hilfe am
  Kind lernt man in einem Kurs, im Notfall 112. Der Validator lehnt
  `Heimlich`, `Erbrechen auslösen`, `Salzwasser`, `Reanimation` und `Honig` ab.
- **Keine Überwachungstechnik.** Babyphone, Sensormatte, Atemmonitor und
  Wearable kommen nicht vor — auch nicht als Tipp. Sie sind kein
  Sicherheitsmerkmal eines Raums.
- **Keine Giftnotruf-Nummer.** Es gibt in Deutschland keine bundesweite:
  die Giftinformationszentren sind regional und haben je eigene Nummern. Die
  App sagt das, verweist auf 112 bei bedrohlichen Symptomen und bittet, die
  regionale Nummer einmal selbst herauszusuchen. Der Validator lehnt jede
  Telefonnummer außer 112 (und dem Elterntelefon) ab.
- **Keine Zahlen aus der Quelle.** Es gab keine (siehe 0.), aber die Regel
  steht trotzdem: jede Zahl braucht eine deutsche Stelle.
- **Keine Rangfolge der Unfallursachen.** Die verbreiteten Superlative
  („Stürze sind die häufigste Unfallursache“, „80 bis 90 Prozent der Fälle
  sind vermeidbar“, „ertrinken in 20 Sekunden in 5 Zentimeter Wasser“) sind
  teils nur für andere Altersgruppen richtig, teils ohne Primärquelle. Der
  Check braucht keine Rangfolge: er braucht den richtigen **Satz** an
  Gefahren mit dem richtigen Mechanismus. `kritisch: true` markiert die
  tödliche Teilmenge qualitativ, und der Validator verlangt in jedem
  Lebensgefahr-Bereich mindestens eine solche Zeile.

## 10. Kindertagespflege ist ein eigenes Profil

Eine Privatwohnung mit beruflicher Verantwortung und eigenem
Unfallversicherungsträger fällt weder unter „Zuhause“ noch unter „Krippe“.
`PROFILE = ['zuhause', 'tagespflege', 'krippe']`, und das Profil sagt
ausdrücklich, dass beide Spalten gelten.

## 11. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter, CSP `default-src 'self'`), ein
löschbarer localStorage-Schlüssel (`skc.erledigt`, nur Haken — kein Name, kein
Datum, kein Eingabefeld; das Berichtsfeld ist `readonly`), werbefrei, kein
Kind-Screen, keine Gesamtwertung. Erwachsenen-Werkzeug **ohne** `eltern.html`
und **nicht** im Sammelband. Keine Hilfe-Insel. Druckblatt mit eigenem
`druck.css`, ohne Namenszeile, Haken-Tabelle oder Wert. Mobile-first,
Touch-Ziele ≥ 48 px, Impressum im Fuß.

## 12. Tests

`test/logik.test.mjs` (19): Daten gültig; keine Gesamtwertung (Exportnamen,
Rechenteil, Bericht — mit `gesamtAnteil` als Gegenprobe); eine leere Liste ist
keine Freigabe; Dauerregeln nicht abhakbar und nie in der Offen-Liste; der
Raum als Gegenstand (mit drei Kind-Subjekt-Gegenproben); „psychische
Geborgenheit“ als Raum-Eigenschaft; Schlafplatz zuerst und ohne
Ausnahmeklausel; Auslöser als Fähigkeiten; Kindertagespflege als eigenes
Profil; Stelle statt Fundstelle (mit Gegenprobe); keine Erste Hilfe, keine
Überwachungstechnik, keine erfundene Nummer; kritische Zeilen zuerst und in
jedem Lebensgefahr-Bereich; Steckdosen ohne „kindersicher“ und ohne
unbelegte Gegenbehauptung; ein Schlüssel, löschbar, kein Kind-Datum;
die Fähigkeiten als kumulative Leiter (`stufenBis` namentlich, Monotonie je
Profil, die oberste Stufe zeigt alles, jede angebotene Fähigkeit schaltet
etwas frei, und die Steckdose hängt an keiner Stufe); Druckblatt und
Politik; Hilfsfunktionen.
