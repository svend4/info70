# Kurz-GDD: Sprich mit mir 🗣️

**Einheit aus Katalog:** docs/10 (Praleska), Abschnitt „Инструменты для
родителей“, Nr. 48 — «Sprich mit mir! Sprachanbahnung 0-1 mehrsprachig».
Quelle: «Общение и речь» (S. 37–39).
**Engine:** eigener Impuls-Katalog (reine Logik + JSON-Bank) plus Merkliste.
Zielgruppe: **Eltern von Kindern im ersten Jahr. Kein Bildschirm für das
Kind.**

## 0. Die Quelle wurde gelesen

Nachgezählt in `PRALESKA.pdf` (Zweig `main`), S. 37–39: **ein** Ziel für die
Neugeborenenzeit, **drei** für den 2. bis 6. Monat, **sechs** für den 6. bis
12. — zusammen **zehn** Kommunikationsziele, genau wie der Katalogeintrag
sagt. Der Validator verlangt, dass alle zehn durch mindestens einen Impuls
belegt sind.

Wichtig für die Bewertung der Adaptation: die Ziele der Quelle sind an die
**Fachkraft** gerichtet, nicht an das Kind — sie sagen „fördern“,
„befriedigen“, „nutzen“, „entwickeln“. Übernommen ist genau diese Form. Das
Risiko liegt nicht darin, dass die Quelle Kind-Ziele formuliert, sondern
darin, dass eine Eltern-App aus einem Bildungsziel einer Einrichtung ein
**Soll für ein einzelnes Baby** macht.

## 1. Geordnet nach dem Signal des Kindes, nicht nach der Lebenswoche

Der Katalog sagt „Wochen-Impulse“. Als „Impuls für Lebenswoche N“ gelesen
verlangt das ein gespeichertes Geburtsdatum — personenbezogene Daten über
einen identifizierbaren Säugling — und behauptet einen Entwicklungsfahrplan,
den es nicht gibt.

Der Katalog ist darum nach dem **beobachtbaren Signal** geordnet: *Es schaut
dich an · Es macht einen Laut · Es wendet sich ab · Es greift nach etwas · Es
zeigt oder gibt dir etwas · Es weint.* Jede Idee gehört in die Sekunde **nach**
diesem Signal. „Wochen-Impuls“ bleibt allein eine Dosierung für den
Erwachsenen — *eine* Idee statt zehn —, und „Noch eine Idee“ ist eine
Rotation ohne Gedächtnis.

Mechanisch: kein `new Date`, kein `Date.now`, kein Geburtsdatum, kein
Altersfeld, **kein Eingabefeld**, und ein Validator, der jede Lebenswoche und
jedes Alter in einem Impulstext ablehnt — und umgekehrt verlangt, dass der
Rahmentext „kein Geburtsdatum“ ausspricht.

## 2. Angekreuzt wird ein eigenes Vorhaben, nie ein Zustand des Kindes

Der Katalog nennt „Katalog + Checkliste“. Eine Checkliste über das
Sprachverhalten eines Babys wäre eine zweite, unverankerte Screening-Liste
neben `apps/meilenstein-begleiter` — ohne U3-U6-Mapping, ohne den Satz
„Zeitangaben sind Richtwerte“, und damit zwei Wahrheiten über dasselbe Kind.

Die Checkliste ist deshalb eine **Merkliste eigener Vorhaben**: jeder Satz
beginnt mit „Ich “, der Status ist `moechte-ich` oder `schon-probiert`, und
der Validator weist jeden Satz ab, der nicht mit „Ich “ beginnt.

## 3. Die drei Perioden überlappen ausdrücklich

Etwa 0–4, 2–8, 6–12 Monate. Jedes Fenster mindestens drei Monate breit, die
Überlappung im Validator erzwungen, und jedes Fenster trägt ein `passtWenn`
— die Zuordnung läuft über Verhalten, nicht über Alter. Scharfe Grenzen
behaupten eine Präzision, die die Daten nicht haben, und erzeugen die Frage
„mein Kind ist sieben Monate und macht das aus Abschnitt zwei noch“ — eine
Frage, die diese App gar nicht aufwerfen soll.

## 4. Die Familiensprache ist ein struktureller Platz, keine Behauptung

Die Kernbotschaft steht **nie ohne ihre Sicherung**, und beide stehen im
selben Block, damit sie nicht auf zwei Bildschirme fallen können:

> Mehrsprachigkeit ist kein Grund für eine Sprachstörung – und kein Grund,
> die Familiensprache aufzugeben. Umgekehrt gilt genauso: eine
> Sprachentwicklungsstörung zeigt sich in allen Sprachen eines Kindes.
> Mehrsprachigkeit erklärt sie nicht und verdeckt sie nicht.

Ohne `sicherung` schlägt die Validierung fehl. Der Grund: als pauschale
Beruhigung gelesen („mehrsprachige Kinder sprechen später, machen Sie sich
keine Sorgen“) verzögert dieselbe richtige Botschaft eine nötige Abklärung.

Ein Rat, zu Hause Deutsch zu sprechen, darf **in keiner Form** vorkommen —
auch nicht zitiert, auch nicht zum Widerlegen. Leser überfliegen; der Rat
überlebt den Hedge, die Einordnung nicht. Der Validator lehnt die Hedge-Form
ausdrücklich ab, und ein Test weist nach, dass er es tut.

**Und die App gibt keine Wortlisten.** Wo das eigene Wort hingehört, steht
eine Lücke `______`, und `eigeneWorte: true` erzwingt sie. Kyrillische Schrift
ist außerhalb der Quellenangabe verboten — damit ist die Projektregel „keine
erfundenen uk/ru-Wortlisten“ nicht eine Vorsichtsmaßnahme, sondern eine
Datenbedingung. Für dreisprachige Karten *für Fachkräfte* gibt es
`apps/sprachbruecken-impulskarten`; diese App richtet sich an Eltern, die
ihre Sprache schon sprechen.

Die Botschaft stammt **nicht** aus der Quelle: das Programm ist einsprachig
und sagt zur Familienmehrsprachigkeit in Deutschland nichts. Sie kommt aus
der deutschen Fachdiskussion (Mercator-Institut, Faktencheck
Mehrsprachigkeit, 2022), und das steht in den Daten.

## 5. Ein fester Warnzeichen-Block, ohne Beruhigung

Die gesamte Mechanik („auf den Laut antworten“) setzt voraus, dass das Kind
hört. Der Block steht darum in **jeder** Ansicht, hinter keiner Bedingung und
mit keinem Schalter — ein Test prüft, dass `warnBlock()` im Render-Teil nicht
hinter einer Bedingung steht.

Der schlimmste Satz, den diese App enthalten könnte, ist eine Beruhigung am
fehlenden Lallen oder am fehlenden Reagieren auf Töne. `nichtBeruhigen` sagt
das ausdrücklich — und dieses Feld **muss** die Formulierung nennen, um sie
auszuschließen, weshalb das Beruhigungs-Netz auf Vorspann, Punkten und
`wasTun` läuft und nicht über das ganze Objekt. (Dieselbe Lage wie die Öle in
`apps/bewegungs-kartei-erstes-jahr`; es ist das dritte Mal in dieser Welle,
dass ein ausschließendes Feld das Ausgeschlossene nennen muss.)

## 6. Hören: was bleibt, nicht wie das Verfahren heute heißt

Der Ablauf des Neugeborenen-Hörscreenings in der Kinder-Richtlinie wurde im
**August 2026** geändert. Verfahrensdetails veralten also messbar schnell.
Die App nennt darum nur, was dauerhaft gilt: es gibt ein Screening in den
ersten Lebenstagen; ein unauffälliges Ergebnis schließt eine **später**
auftretende Hörstörung nicht aus; und wer nicht reagiert, braucht einen
Termin und nicht mehr Üben. Der Validator lehnt `TEOAE`, `AABR`,
`Kontroll-AABR` und `Konfirmationsdiagnostik` ausdrücklich ab.

## 7. Bildschirme und der Name der Behörde

Für Kinder unter drei ist Bildschirmzeit nicht empfohlen, und der Grund hat
mit Sprache direkt zu tun: ein Gerät antwortet nicht auf das, was das Kind
gerade tut. Die Quelle wird mit **beiden** Namen genannt — die BZgA ist seit
dem 13. Februar 2025 das **Bundesinstitut für Öffentliche Gesundheit
(BIÖG)**. „BZgA“ allein wäre 2026 veraltet; ohne den früheren Namen findet
aber niemand die Empfehlung wieder. Der Validator verlangt beide.

*Hinweis für den Korpus:* docs/10 schreibt durchgehend „BZgA“. Das ist als
historischer Katalogtext in Ordnung, aber jede App, die die Behörde als
**aktuelle** Quelle nennt, sollte nachziehen.

## 8. Alltagsanker statt Übungstermin

Deutsche Praxis für 0-1 ist alltagsintegrierte Sprachbildung: Wickeln,
Füttern, Tragen, Anziehen **sind** die Sprachsituationen. Jeder Impuls trägt
darum ein `anker`-Feld (Pflicht), und die Wörter `Übung`, `Beschäftigung`,
`Lehrziel`, `Artikulation` kommen nicht vor. Lautbildungsübungen für Kinder
unter einem Jahr sind nicht übernommen — Lallen ist Exploration, kein Fehler,
und in der Quelle selbst gehört die Lautkultur-Übungsreihe erst zum Band 2–3.

Nicht übernommen ist auch der Terminus **«комплекс оживления»**
(„Belebungskomplex“, 3. Monat): ein sowjetischer Fachbegriff ohne deutsches
klinisches Äquivalent, in einem Arztgespräch nicht anschlussfähig. Die
Beobachtungen stehen einzeln und in der Sprache, die
`apps/meilenstein-begleiter` schon benutzt.

## 9. Was gespeichert wird

Genau ein Schlüssel: `smm.merkliste` mit den **eigenen Vorhaben des
Erwachsenen**. Nichts über das Kind, kein Name, kein Datum, kein Alter, kein
Eingabefeld. Löschbar über „Meine Vorhaben löschen“; `localStorage.clear()`
ist nicht erlaubt (es würde die BFSG-Kontrasteinstellung mitnehmen).

Keine Hilfe-Insel: in einem Erwachsenen-Werkzeug adressiert die 116 111
niemanden. Das Elterntelefon steht als Text in den Daten, nicht als Import —
ein Import würde den Abdeckungstest glauben machen, die App trage die
Hilfe-Insel.

## 10. Abgrenzung

| App | besitzt | Nr. 48 hat davon nichts |
|---|---|---|
| `meilenstein-begleiter` | U3-U6-Beobachtung über das Kind, Arztbericht | kein Kind-Zustand, kein Bericht, kein Haken am Kind |
| `vorlese-kompass` | Buch und Vorlesen ab 1 Jahr, auch die Stufe `bis1` | kein Bilderbuch, keine Buchauswahl, kein Vorlese-Inhalt |
| `familienschatz-reime` | Reime, Kniereiter, Wiegenlieder | keine Verstexte |
| `sprachbruecken-impulskarten` | de/uk/ru-Karten für Fachkräfte | übersetzt nichts |
| *Nr. 51 (ungebaut)* | Dokumentation erster Wörter je Sprache | dokumentiert nichts |

Was Nr. 48 allein besitzt: die **vorsprachliche Dialogstruktur** — dem Blick
folgen statt zu führen, auf den Laut antworten, warten, und aufhören **und
wieder anfangen**, wenn das Kind sich abwendet und zurückkommt.

## 11. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter, CSP `default-src 'self'`), ein
löschbarer localStorage-Schlüssel, werbefrei, ohne Anmeldung, kein
Kind-Screen, kein Scoring. Vorlesen nur mit einer Stimme mit
`localService === true`. Erwachsenen-Werkzeug **ohne** `eltern.html` und
**nicht** im Sammelband. Mobile-first, Touch-Ziele ≥ 48 px, Impressum im Fuß.

## 12. Tests

`test/logik.test.mjs` (16): Daten gültig; nach Signal statt nach Lebenswoche
(mit Gegenprobe); drei überlappende Perioden (mit zwei Gegenproben); alle
zehn Quellziele belegt; Merkliste mit „Ich “ als Pflichtform; Familiensprache
nie ohne Sicherung; kein Rat zu Deutsch zu Hause, auch nicht gehedged; keine
erfundenen Wortlisten (kyrillisch nur in der Quelle) und Lücke als Pflicht;
Warnzeichen fest, unausblendbar und ohne Beruhigung (plus der Nachweis, dass
`nichtBeruhigen` sie nennen **muss**); Hören ohne Verfahrensdetails;
BIÖG **und** BZgA in der Quelle; Alltagsanker als Pflicht; Vorlesen nur mit
Gerätestimme; ein Schlüssel, löschbar, kein Scoring (mit Wortsinn-Gegenprobe
für „Punkte“); Abgrenzung, Seite und Politik; Hilfsfunktionen.
