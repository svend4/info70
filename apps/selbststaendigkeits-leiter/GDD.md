# Kurz-GDD: Selbstständigkeits-Leiter 🪜

**Zielgruppe:** Eltern und Kindertagespflege, Kinder von etwa 2 bis 3 Jahren.
Werkzeug für Erwachsene; das Kind sieht keinen Bildschirm, darum keine
`eltern.html`.
**Quelle:** Praleska 2007, S. 94–96, «Трудовое воспитание» (23 Ziele in fünf
Teilen, nachgezählt). Katalog docs/10, Nr. 58.

## 1. Es gibt keine Gesamtstufe

Der Katalogeintrag wollte „Ampel-Fortschritt“. Eine Ampel über die
Selbstständigkeit eines Kindes ist eine Einstufung des Kindes — nach docs/02
und nach der EU-KI-Verordnung ausgeschlossen —, und eine rote Stufe sagt
Eltern eines Zweijährigen, ihr Kind sei zurück. Dazu kommt ein
Rechenfehler: die Zeilen messen nichts Gemeinsames. `logik.mjs` exportiert
keine summierende Funktion, und der Test prüft die **Funktionsnamen**.

> **Falle A, vierzehntes Mal — und diesmal im Test selbst.** Das Namensnetz
> `/stand$/` traf `pruefeStand`, also genau die Funktion, die den
> gespeicherten Stand prüft, und `/folge/` traf
> `bereicheInReihenfolge`. Gebannt sind jetzt die Konstruktionen
> (`gesamtstand`, `gesamtstufe`, `inFolge`, `folgeTage`), nicht die Wörter.

## 2. Drei Stufen als Formen, in beide Richtungen

`noch-nicht` / `manchmal` / `sicher`, angezeigt als ○ ◐ ● — keine Farbe, kein
🔴. `noch nicht` heißt „noch nicht gesehen“. Und jede Stufe lässt sich
zurücknehmen: noch einmal auf dieselbe Stufe tippen löscht den Eintrag. Es
gibt keinen Code, der eine erreichte Stufe festhält (ein Test verbietet
`Math.max` und Verwandtes) — Kinder wollen nach Umzug, Krankheit oder einem
Geschwisterkind oft wieder nicht, und eine Leiter, die nur nach oben geht,
würde das zu einem Rückschritt erklären.

## 3. Der Nutzen steckt in „manchmal“

`inBewegung()` liefert, was `manchmal` steht; `naechsteGelegenheiten()`
liefert, was noch nicht gesehen ist, dessen **Voraussetzung** aber schon
sicher ist. Das ist eine Ableitung aus der Kette, keine Prognose und kein
Soll — und eine Zeile ohne Voraussetzung gilt nie als „nächste“, sonst
stünden beim ersten Öffnen vier Aufgaben da.

Die Gelegenheit ist ein **Angebot, keine Lektion**: `pruefeDaten` weist jede
Gelegenheit ab, in der „üben“, „trainieren“ oder „beibringen“ steht.

## 4. Das Kind handelt, der Erwachsene stellt bereit

`was` darf kein „Sie“ und kein „du“ enthalten, `gelegenheit` muss „Sie“
enthalten. Beides ist Validatorbedingung. Ohne diese Trennung wäre aus der
Leiter eine Übungsanleitung geworden — und genau das ist der Unterschied zur
Arbeitserziehung der Quelle, die an mehreren Stellen den Erwachsenen
beschreibt.

## 5. Die Leiter ist eine Kette von Voraussetzungen

`vorher` zeigt auf die leichtere Zeile (ausziehen vor anziehen). Der Validator
prüft: genau ein Anfang je Bereich, keine Kette über Bereichsgrenzen, kein
Kreis, und `zeilenIm()` muss alle Zeilen des Bereichs erreichen. Damit hat die
Liste eine Ordnung, ohne ein Alter zu behaupten.

## 6. Drei amtliche Sätze — und drei Lesefehler, die sie abräumen

Im Volltext der Kinder-Richtlinie des Gemeinsamen Bundesausschusses
nachgelesen:

| Zeile | Untersuchung | Zeitraum | Toleranz | Rubrik |
|---|---|---|---|---|
| „Kann mit dem Löffel selber essen.“ | U7 | 21.–24. Lebensmonat | 20.–27. | Soziale/emotionale Kompetenz |
| „Öffnet große Knöpfe selbst.“ | U7a | 34.–36. Lebensmonat | 33.–38. | Perzeption/Kognition |
| „Beteiligt sich an häuslichen Tätigkeiten, will mithelfen.“ | U7a | 34.–36. Lebensmonat | 33.–38. | Soziale/emotionale Kompetenz |

- **Es sind SPÄTE Grenzen, keine Durchschnitte.** Wer sie als
  Normalerwartung liest, dreht ihren Sinn um. Das Grenzsteinprinzip benennt
  den Zeitpunkt, zu dem die große Mehrheit der Kinder den Schritt erreicht
  hat — nicht den Mittelwert.
- **Zu jedem Zeitraum gehört eine Toleranzgrenze.** `amtlich.toleranz` ist
  Pflichtfeld; ohne sie liest sich das Fenster als Punktalter.
- **Die Sätze stehen dort nicht unter „Selbstständigkeit“.** Der Löffel steht
  unter sozialer/emotionaler Kompetenz, der Knopf unter
  Perzeption/Kognition. Eine amtliche Selbstständigkeits-Skala gibt es nicht,
  und die App sagt das.

Dazu zwei Haltbarkeitsangaben: das Wort „Grenzstein“ kommt in der Richtlinie
**nicht** vor (Volltextsuche negativ), und die Richtlinie wird regelmäßig
geändert — zu den Dokumentationsbögen laufen Stellungnahmeverfahren. Die
nachgelesene Fassung kann also nicht die letzte sein; `quelle.amtlich` sagt
das, und ein Test hält es.

Jede andere Zeile trägt **keine Zahl**. `ALTERSANGABE` weist jede
Altersangabe in einer Zeile ohne amtliche Fundstelle ab.

## 7. „23 lebenspraktische Fertigkeiten“ ist eine Fehllesung

Der Quellabschnitt trägt **23 pädagogische ZIELE** in fünf Teilen (Allgemein
6, Selbstbedienung 6, Haushalt 5, Natur 4, Handarbeit 2). Eine Handlung des
**Kindes** benennen nur **vier** davon: beide Handarbeits-Ziele betreffen das
Interesse am Tun des Erwachsenen, drei von vier Naturzielen das Zusehen, und
zwei Selbstbedienungs-Ziele sind Aufgaben des Erwachsenen. Umgekehrt trägt ein
einziges Ziel acht Handgriffe. `quellZiel` indexiert darum die **vier** Ziele
mit Kind-Handlung, nicht die 23 — und der Validator verlangt, dass alle vier
in Zeilen vorkommen (Bauart aus Nr. 49). `DREIUNDZWANZIG` verbietet die
Formulierung in jeder Zeile; im Ausschluss x02 muss sie stehen.

## 8. Was nicht übernommen ist

- **Der Dienst am Esstisch** — eine Kita-Rolle mit Dienstplan.
- **„Damit die Erwachsenen sich freuen“ als Motiv** der Selbstbedienung: das
  macht das Gefallen des Erwachsenen zum Zweck der Hygiene. `LOB_ALS_GRUND`
  weist jede so gebaute Begründung ab.
- **Der positive Status in der Gleichaltrigengruppe** als Ziel.
- **Belohnungstafel, Sterne, Serie.**
- **„Hilf mir, es selbst zu tun“ als Montessori-Zitat** — keine belegbare
  Fundstelle; der Gedanke steht hier ohne Namen.
- **uk/ru-Fassungen** — eine ungegengelesene Übersetzung wäre eine
  Behauptung, und bei amtlichen Wortlauten zusätzlich eine falsche Wiedergabe.
- **Aus dem Handarbeits-Abschnitt nichts**, weil beide Ziele dort das Tun des
  Erwachsenen betreffen.

## 9. Sicherheit: Gefahr und Vorsorge, keine Behandlung

Gleiche Entscheidung wie in Nr. 50: **keine Erste-Hilfe-Anleitung**. Halb
erinnerte Anleitungen sind das Problem; genannt werden ein Kurs, die 112 und
— bei Vergiftungsverdacht — das **regionale** Giftinformationszentrum, weil es
keine bundesweite Nummer gibt. Ein Test verbietet Behandlungswörter in den
`grenze`-Feldern.

Die vier Grenzen, die Zeilen tragen:

- **heißes Wasser:** der Erwachsene stellt den Hahn. Keine Temperaturangabe —
  die Leitlinie zu Verbrennungen und Verbrühungen im Kindesalter enthält kein
  Präventionskapitel und keine Temperatur; die umlaufenden Zahlen stammen aus
  Verbandsempfehlungen und Installationsnormen (Ausschluss x09).
- **Putzmittel:** Tuch und Wasser, nie ein Mittel. Haushaltsprodukte stehen
  bei Vergiftungsunfällen von Kindern an erster Stelle, das Risikofenster
  liegt in diesem Alter, und nichts wird in eine Getränkeflasche umgefüllt.
- **Gießen:** die Gefahr ist die Pflanze, nicht das Gießen. Besonders giftige
  Arten stehen in einer im Bundesanzeiger veröffentlichten Liste und gehören
  nicht dorthin, wo ein Kind spielt.
- **Händewaschen:** kaltes Wasser genügt, es kommt auf die Seife und die
  Dauer an (20 bis 30 Sekunden nach der bayerischen
  Rahmenhygieneempfehlung für die Kindertagesbetreuung, mit Handrücken,
  Fingerzwischenräumen, Daumen und Nägeln); Händedesinfektion ist bei Kindern
  nach derselben Empfehlung weder sinnvoll noch erforderlich. Die Empfehlung
  bezeichnet sich selbst als rechtlich nicht bindend und stammt aus der
  Pandemiezeit — beides steht dabei.

## 10. Politik-Konformität (docs/02)

- werbefrei, ohne Konten, ohne externe Anfragen;
- ein localStorage-Schlüssel `ssl.stand` mit ausschließlich Zeile → Stufe,
  beschnitten beim Laden **und** beim Speichern und beim Laden
  zurückgeschrieben (der Defekt, den die Browserprobe in Nr. 57 fand);
  `datenKarte` löscht, kein `localStorage.clear()`;
- deutsche UI, russisches README, deutsches GDD;
- mobile-first, 360 px ohne Querscrollen, Knöpfe ≥ 48 px;
- `Vorlesen` nur mit Gerätestimme;
- Druck über eigenes `druck.css`, und auf dem Papier stehen **keine Stufen** —
  ein Blatt mit drei Kreisen pro Zeile wäre ein Befund über ein Kind;
- kein `<input>`: kein Name, kein Alter, kein Datum, kein Freitext;
- Impressum im Fuß.

## 11. Tests

`node --test apps/selbststaendigkeits-leiter/test/logik.test.mjs` (20 Tests),
fast jeder mit Gegenprobe: Kreis und Bereichssprung in der Kette, Alter ohne
amtliche Fundstelle, fehlende Toleranzgrenze, abweichender amtlicher
Wortlaut, Erwachsener in `was`, Übung in `gelegenheit`, Freude als Grund,
Fehllesung „23 Fertigkeiten“, Fremdfeld im Speicher, kyrillische Schrift.
