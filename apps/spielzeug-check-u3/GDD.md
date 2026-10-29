# Kurz-GDD: Spielzeug-Check U3 🧸

**Zielgruppe:** Eltern und Kindertagespflege. Werkzeug für Erwachsene; das Kind
sieht keinen Bildschirm, darum gibt es keine `eltern.html`.
**Gegenstand:** EIN Spielzeug für ein Kind unter drei Jahren.
**Quelle:** Praleska 2007, S. 69–70, «Дидактические игры» (7 Ziele,
6 Spielzeugarten – nachgezählt). Katalog docs/10, Nr. 56.

## 0. Was die Quelle hergibt – und was nicht

Der Abschnitt trägt **7 Ziele** und nennt **6 Spielzeugarten**: zerlegbare
Pyramide, Steckpilze, Bälle, Matrjoschka, Schnittbild aus zwei bis drei Teilen,
Paarbilder. Beide Zahlen sind nachgezählt und stehen in `quelle.zahlen`; der
Validator vergleicht sie mit den Daten, damit dieses Dokument nicht mehr
behaupten kann als die Daten geben.

Nicht übernommen ist das **Wirkversprechen**, das im Quellbegriff
„autodidaktisch“ mitklingt (Ziel 4: Spielzeug zum Selbstunterrichten). Zwei
Arten sind verallgemeinert: Matrjoschka → Stapelbecher und Nistwürfel,
Steckpilze → Steckbrett; beides ist im deutschen Handel die übliche Form
derselben Sache, und beides steht als Abweichung in `quelle.abweichung`.

## 1. Der Gegenstand ist ein OBJEKT

Der Raum gehört `apps/sicherer-krabbelraum-check`, das Kind gehört
`apps/meilenstein-begleiter`. Hier beschreibt jede der 19 Zeilen eine
Eigenschaft des Gegenstands oder einen Handgriff daran. Eine dritte Liste über
dasselbe Kind wäre eine dritte Wahrheit darüber.

## 2. Die zwei Pflichtfelder sind der Kern

`wieZuPruefen` und `prueferGrenze` sind Pflicht – `pruefeDaten` weist jede
Zeile ab, der eines fehlt. Eine Zeile ohne Hausprüfung ist keine Prüfung; eine
Hausprüfung ohne benannte Grenze beruhigt, ohne zu prüfen. Am Bildschirm steht
`wieZuPruefen` immer, die Grenze einen Tipp entfernt (`⛔ Wo diese Prüfung
endet`), und auf dem Papier steht bei jeder kritischen Zeile beides.

## 3. Es gibt keine Gesamtwertung

Kein Prozentwert, kein „n von m“, keine Ampel, kein „bestanden“. `logik.mjs`
exportiert keine summierende **Funktion**; der Test prüft die Funktionen und
nimmt die Netze aus, weil `GESAMTWERTUNG` nach dem benannt ist, was es
verbietet. Begründung in `keinErgebnis` und als Ausschluss Nr. x06: die
Gefahren sind nicht gegeneinander aufrechenbar, und eine gemischte Liste aus
Sicherheit und Eignung wird als Gesamturteil gelesen – dort kippt ein Check
zur Kaufberatung. Gleiche Bauart wie Nr. 50.

## 4. Zwei strukturell verschiedene Arten

`einmal` ist ein Handgriff an diesem Spielzeug und abhakbar. `immer` ist eine
Regel für jedes Spielen und ausdrücklich **nicht** abhakbar – ein Haken würde
eine Dauerregel als erledigt ausgeben. Die Dauerregeln stehen auch auf dem
gedruckten Zettel, und zwar unter einer eigenen Überschrift.

## 5. Die drei Kennzeichen-Zeilen tragen die Aufklärung

| Zeile | Was der Validator erzwingt |
|---|---|
| CE (k01) | „KEINE Prüfung“ **und** „Erklärung des Herstellers“ in `prueferGrenze`; `kritisch: false` |
| GS (k02) | das **Symbol** der GS-Stelle muss in `was` oder `wieZuPruefen` das Prüfbare sein; `prueferGrenze` nennt die Fünfjahresbefristung und die veröffentlichte Bescheinigungsliste; Paragraf 21 ist als Fundstelle verboten |
| U3-Symbol (k03) | „WARUM“ in `was`; „nicht automatisch“ in `warum` |

Inhaltlich: CE ist die Erklärung des Herstellers; bei vollständiger Anwendung
der harmonisierten Normen genügt seine eigene Fertigungskontrolle, eine
Prüfstelle ist dann **nicht** beteiligt, und die Behörden nehmen Konformität
an, statt sie festzustellen. GS ist freiwillig, aber mit Baumusterprüfung und
Fertigungsüberwachung – und deutsches Recht, nicht EU-weit. Das U3-Symbol heißt
nur „für unter Dreijährige gefährlich“; die Gefahr muss angegeben sein, **darf
aber im Beipackzettel stehen** – ohne diesen Satz würde die App ein
rechtmäßiges Spielzeug als mangelhaft ausgeben. Umgekehrt entlässt der Hinweis
den Hersteller nicht aus der Verantwortung.

Dazu kommt k04: Name und Anschrift des Herstellers plus Typ-, Chargen- oder
Seriennummer. Das ist der praktische Teil – ohne Anschrift gibt es niemanden,
der zurückrufen kann.

> **Abweichung beim Bau, nachgetragen (Welle 80).** Die GS-Zeile war in zwei
> Punkten falsch, und beide standen mit Prüfvermerk da. Erstens die Fundstelle:
> Paragraf 21 ProdSG regelt die **Befugnis** einer GS-Stelle, nicht die
> Zuerkennung des Zeichens — das ist Paragraf 20, die Pflichten der Stelle
> stehen in Paragraf 22, und die Gestaltung in der **Anlage**. Zweitens die
> Sachaussage: verlangt ist nicht der NAME der Prüfstelle, sondern ihr
> **Symbol**, in der linken oberen Ecke des Zeichens (oder links daneben und es
> berührend), mit eindeutigem Rückschluss auf die Stelle. Beides ist jetzt im
> Gesetzestext nachgelesen. Zusätzlich aufgenommen, weil es der einzige echte
> Nachweisweg ist: jede GS-Stelle muss eine Liste aller von ihr ausgestellten
> Bescheinigungen veröffentlichen (Paragraf 22 Absatz 1), und die Zuerkennung
> ist auf höchstens fünf Jahre befristet (Paragraf 20 Absatz 5).

## 6. Die Zahlen sind die Zahlen der Norm

Der Text von **EN 71-1 (Fassung 2011 + Änderung A3)** lag beim Bau vor und ist
nachgelesen, in einer frei zugänglichen Wiedergabe. Übernommen sind:
Prüfzylinder 31,7 mm mit schrägem Boden 25,4/57,1 mm (Abschnitt 8.2);
Schablone E 44,5 mm in einer 6,4 mm dicken Platte (8.32); Schnurlängen
220/300/380/800 mm (5.4); Verpackungsfolie 0,038 mm (6); becherförmige Teile
64–102 mm bei unter 177 ml und mehr als 13 mm Tiefe (5.12); Magnete (4.23);
Kanten und Spitzen (4.7/4.8); Ausnahmen bei Luftballons (5.1) und der
Warnhinweis für Bettspielzeug (7.11).

Zwei Regeln halten das ehrlich:

- **`MASSZAHL`/`HERKUNFT`:** eine Maßzahl darf nur in einem Feld stehen, das im
  **gleichen** Feld sagt, wessen Zahl sie ist. „Nehmen Sie 44,5 mm“ wäre eine
  Anweisung dieser App, „die Norm zieht die Grenze bei 44,5 mm“ ist eine
  Tatsache über die Norm. Das ist der Registerschnitt aus Nr. 55, auf Maße
  angewandt.
- **Maß nur mit `geprueft: true`**, ohne Ausnahme. Der Satz „der Normtext lag
  nicht vor“ entschuldigt keine Zahl, sondern verbietet sie. Darum nennen b01
  (Batteriefach) und m02 (Schadstoffe) **weder Zahl noch Stelle** und sagen
  selbst, dass hier niemand nachgelesen hat.

`quelle.norm` nennt die Fassung, sagt, dass es neuere gibt, und listet, was
nicht nachgelesen ist; alle vier Punkte sind Testbedingungen. **Nachgetragen
(Welle 80):** harmonisiert — also konformitätsvermutungsstiftend — ist heute
EN 71-1:2014+A1:2018, nicht die hier nachgelesene Ausgabe, und die
Abschnittsnummern wandern zwischen den Ausgaben. Darum trägt jede Fundstelle
ihre Fassung („Fassung 2011+A3"), und ein Validatorsatz erzwingt das. Und
`quelle.rechtsstand` hält fest, dass die Richtlinie 2009/48/EG mit Wirkung vom
1. August 2030 aufgehoben wird, dass dann die Verordnung (EU) 2025/2509 gilt
und dass Bezugnahmen nach der Entsprechungstabelle in Anhang VIII zu lesen
sind: die Artikelnummern dieser App verfallen zu einem bekannten Datum, die
Sachaussagen nicht. Ausschluss x07
weist „Normzahlen ohne Fassungsangabe“ ausdrücklich zurück – eine erfundene
Fundstelle sieht aus wie eine geprüfte (docs/02).

## 7. Die Kugel-Zeile: eigene Prüfung, eigene Grenze

Für Bälle gilt nicht der Prüfzylinder, sondern Schablone E. Ein Ball, der ganz
hindurchfällt, ist ein „kleiner Ball“; Spielzeug für Kinder unter drei Jahren
darf keiner sein und keinen herausnehmbaren enthalten. Zu Hause messbar ist der
**kleinste** Durchmesser, und genau das verlangt der Validator – zusammen mit
drei Grenzen: jede Lage, nicht drücken, und die **ausdrückliche Ausnahme der
Norm für weiche, gefüllte Bälle**.

> **Abweichung beim Bau (Welle 80).** Diese Zeile sagte zuerst „für Kugeln gibt
> es keine Hausprüfung, die trägt“, und der Validator erzwang diesen Satz. Das
> war richtig, solange die Maße nicht vorlagen. Nachdem der Normtext
> nachgelesen war, wurde es falsch – und eine falsche Grenzangabe ist kein
> kleiner Fehler, sondern genau die Sorte Satz, die diese App bekämpft. Der
> Validator ist umgeschrieben: Schwelle, kleinster Durchmesser, Ausnahme und
> Lage sind jetzt Pflicht, der alte Satz ist weg.

## 8. Die Klopapierrolle – nur im Ausschluss, mit beiden Richtungen

Zu streng: Hülsen haben innen etwa 40–45 mm gegen 31,7 mm, und die Rolle ist
ein offenes Rohr, während das Teil vollständig in einen unten geschlossenen
Zylinder mit schrägem Boden passen muss. Zu lax – die gefährliche Richtung:
Bälle werden mit der größeren Schablone beurteilt; eine Rolle mit 40 mm lässt
einen Ball von 43 mm nicht durch, der nach der Norm trotzdem ein kleiner Ball
ist. Der Validator verlangt beide Richtungen und das Wort „Schablone“ und
verbietet der Rolle jedes Vorkommen in einer Prüfung.

## 8a. Der Gegenstand, der im Körper wächst

Nachgetragen nach dem Review: eine kritische Dauerregel zu **quellenden
Materialien** (Wasserperlen, Dekokugeln aus Superabsorber, Quellspielzeug).
Superabsorbierende Polymere nehmen Wasser bis zum Hundertfachen ihres Volumens
auf und quellen im Körper auf bis zum Sechzigfachen; die endoskopische Bergung
kann dadurch erheblich erschwert oder unmöglich werden. Diese Zeile ist der
deutlichste Fall der ganzen App: **hier versagt jede Größenprüfung**, weil
Prüfzylinder und Schablone den Gegenstand so messen, wie er jetzt ist, nicht
so, wie er im Körper wird. Der Validator verlangt genau diesen Satz, das
Ausmaß des Quellens und `kritisch: true`. Die Hausprüfung, die hier wirklich
etwas zeigt, ist ein Glas Wasser und eine Stunde Geduld. Quelle: AWMF 001/031,
Version 2.0, Stand 12/2024 (Volltext gelesen; diese Angabe ist nicht bestätigt).

Aus derselben Leitlinie stammen drei Sätze im Notfallfeld: eine Knopfzelle in
der Speiseröhre ist ein Notfall und soll unmittelbar entfernt werden,
idealerweise innerhalb von zwei Stunden; in einer Auswertung tödlicher Verläufe
war die Diagnose in 54 Prozent der Fälle nicht gestellt worden, und bei 95
Prozent davon hatte niemand die Ingestion beobachtet (die beiden Prozentzahlen sind fachlich nicht geprüft, Entscheidung Max 14в: sie bleiben mit diesem Vermerk). **Nicht** übernommen ist
die Vorbehandlung mit Sucralfat oder Honig: das ist eine ärztliche Maßnahme auf
dem Weg zur Bergung, Honig ist bei Säuglingen unter einem Jahr wegen Botulismus
ausdrücklich nicht zu geben, und eine gedruckte Dosierung würde im Ernstfall
die Fahrt verzögern. Der Verzicht steht als Ausschluss x08 in den Daten, und
das Notfallfeld lehnt Hausmittel ausdrücklich ab.

## 9. Kein Wirkversprechen

Dass selbstkorrigierendes Material die Entwicklung von Kindern unter drei
Jahren voranbringt, ist nicht belegt: keine Wirksamkeitsstudie, und die
Übersichten zur Montessori-Pädagogik betreffen Kinder ab etwa drei Jahren,
zeigen kleine Effekte bei großer Streuung und lassen offen, ob Material,
Selbsttätigkeit oder Fachkraft wirkt. Verkleinertes Sinnesmaterial für
Krippenkinder ist in der Montessori-Fachwelt selbst strittig. Übernommen ist
nur das beschreibend Belegte: was Kinder dieses Alters mit solchem Material
**tun** – fünf Becher der Größe nach ordnen gelingt zuverlässig etwa ab zwei
Jahren, das Abnehmen kommt lange vor dem Ordnen. Die Spannen stehen als
Spannen; `pruefeDaten` verlangt „etwa“ oder „in Stufen“ und weist jede
Sollvorgabe an das Kind ab.

## 10. Keine Marke – aber der Hersteller

`MARKE_ODER_PREIS` trifft Preis, Marke, Modell, Shop, „empfehlenswertes
Produkt“. Das Wort **Hersteller** ist herausgenommen und steht in einem eigenen,
**case-sensitiven** Netz `HERSTELLER_GENANNT`: verboten ist, einen bestimmten
Hersteller zu NENNEN (dem Wort folgt ein Eigenname), nicht über ihn als
Rechtsakteur zu sprechen.

> **Falle A, zehntes Mal.** Das Netz mit `\bHersteller\b` hat beim Bau genau
> die zwei Felder erschlagen, die die Aufklärung tragen. Und ein elftes Mal im
> eigenen Test: ein Wortnetz über den ganzen Bericht meldete die **Absage** an
> die Wertung als Verstoß, weil sie „Prozentwert“, „Ampel“ und „bestanden“
> nennen muss. Richtig ist beide Male, auf die **Konstruktion** zu zielen.

## 11. Politik-Konformität (docs/02)

- werbefrei, ohne Konten, **ohne externe Anfragen** (CSP + `installiereNetzwerkWaechter`);
- **ein** localStorage-Schlüssel `szu3.erledigt` (nur Haken an Eigenschaften
  eines GEGENSTANDS – kein Name, kein Alter, kein Datum; es gibt kein
  `<input>`), `datenKarte` löscht ihn, kein `localStorage.clear()`, und bei
  leerem Stand verschwindet der Schlüssel;
- deutsche UI, russisches README, deutsches GDD;
- mobile-first, 360 px ohne Querscrollen, Knöpfe ≥ 48 px (Querverweise im
  Satz sind inline – Ausnahme von WCAG 2.5.8);
- `Vorlesen` nur mit einer Stimme, die auf dem Gerät liegt;
- Druck über eigenes `druck.css`: kein Haken, kein Name, keine Wertung auf dem
  Papier – aber bei kritischen Zeilen die Hausprüfung und ihre Grenze;
- Impressum im Fuß.

## 12. Tests

`node --test apps/spielzeug-check-u3/test/logik.test.mjs` (44 Tests). Fast jede
Zusage hat eine Gegenprobe: eine Mutation der Daten muss `pruefeDaten` rot
machen. Geprüft werden unter anderem beide Pflichtfelder, die Fundstelle nur
mit Prüfvermerk, die Maßzahl nur mit Herkunft im gleichen Feld und nur mit
geprüfter Quelle, die vier Zusagen der Kugel-Zeile, beide Irrtumsrichtungen der
Klopapierrolle, „Hersteller“ erlaubt gegen „Hersteller Musterwerk“ verboten,
kyrillische Schrift nur in der Quellenangabe, der eine löschbare Schlüssel und
der Inhalt des Druckblatts.

## Vorlesen (Entscheidung 28а)

Keine Vorlese-Pflicht. Dieses Werkzeug richtet sich an Erwachsene. Die Zeile „есть озвучивание“ der Checkliste in `docs/02-anforderungen.md` gilt für Kinder-Apps (Ergänzung 28а vom 27.10.2026, am 29.10.2026 in die GDD übernommen).
