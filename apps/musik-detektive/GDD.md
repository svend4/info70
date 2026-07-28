# Kurz-GDD: Musik-Detektive 🎼

**Einheit aus Katalog:** docs/10 (Praleska), Abschnitt „Ko-Nutzung“, Nr. 15 —
«Klang-Detektive (4–6, Musik-Hör-Quiz)».
**Engine:** WebAudio-Synthese + datengetriebenes Hör-Rätsel (reine Logik
rechnet Puls, Singbarkeit und Vergleichbarkeit nach). Zielgruppe: 4–6,
ausschließlich Ko-Nutzung.

## 1. Abgrenzung zum bestehenden `klang-detektive`

Die vorhandene App (`klang-detektive`, Katalog Nr. 3) fragt einzelne
**Klangeigenschaften** ab: hoch/tief, laut/leise, schnell/langsam,
rauf/runter, weich/scharf. Hier geht es um den **Charakter eines ganzen
Stücks**: Lied, Marsch oder Tanz — und um Stimmungsvergleiche. Deshalb eine
eigene App und ein eigener Name.

## 2. Alles ist Eigenproduktion

Fünf Muster, alle in C-Dur, alle mit demselben Oszillatortyp und derselben
Grundlautstärke, alle aus Dreiklangs- und Skalenfiguren. Kein fremdes Audio,
keine fremde Melodie, keine externe Anfrage. Unterschieden wird ausschließlich
über: **Puls-Gruppierung, Tempo, Artikulation, Begleitmuster, Atempausen**.
Diese Variablenkontrolle ist der Punkt — sonst lernt ein Kind das auffälligste
statt des gemeinten Merkmals.

## 3. Der Puls entscheidet, nicht der Takt und nicht das Tempo

`gruppierungVon(schlaegeProTakt)` rechnet: 2 und 4 → Zweier, 3 → Dreier. Ein
Marsch muss in Zweiern zählen, ein Tanz in Dreiern — sonst braucht das Stück
eine ausgeschriebene `ausnahme`. „Marsch = 2/4“ wäre schlicht falsch (es gibt
Märsche im 6/8), „schnell = Marsch“ ebenfalls: Muster D ist derselbe Marsch bei
60 statt 112, und die richtige Antwort bleibt Marsch. Ein Test verlangt, dass
zwischen dem schnellsten und langsamsten Marsch mindestens 40 bpm liegen.

## 4. „Lied“ wird gerechnet

`istSingbar()` prüft aus der Notenliste: alle Töne zwischen c′ (261,63 Hz) und
h′ (493,88 Hz) **und** spätestens nach zwei Takten eine Pause von mindestens
einem Schlag. Ein Stück, das „Lied“ heißt und das nicht erfüllt, lädt nicht.
Damit ist Singbarkeit nachgerechnet und nicht behauptet.

Nebenbei fängt die Tonliste die klassische Verwechslung ab: **H4 = 493,88 Hz**
(deutsch h), **B4 = 466,16 Hz** (deutsch b). Beide stehen mit eigenem Namen im
Code, ein Test hält sie auseinander.

## 5. Die drei eingebauten Ehrlichkeiten

| Invariante | Warum |
|---|---|
| Es MUSS ein Stück mit ≥ 2 Sorten geben (Marschlied), und Rätsel dürfen es nicht verwenden | Lied/Marsch/Tanz überschneiden sich systematisch. Eine Einfachauswahl behauptet sonst eine Trennschärfe, die es nicht gibt. |
| Stimmungsfragen dürfen **kein** Feld `korrekt` und keine `richtig`-Antwort haben | Gefühl ist nicht wahrheitsfähig. Punkte darauf wären Scheinobjektivität und lehren Kinder, ihrer Wahrnehmung zu misstrauen. |
| Ein Vergleichspaar unterscheidet sich in **genau einem** Merkmal — und bei allem außer dem Tongeschlecht muss die Melodie buchstäblich dieselbe sein | Sonst schreibt die App eine Wirkung einer Ursache zu, die sie nie isoliert vorgeführt hat. |

Dazu: jede Tempoangabe ist ein Bereich (`bpmVon < bpmBis`), jede Regel trägt
ihre eigene Grenze (`gilt`), und die Selbstauskunft „x von y Rätseln gehen ohne
Hören“ wird aus `ohneHoerenLoesbar` **gerechnet**.

## 5a. Zwei Nachbesserungen aus dem Review

**Die Puls-Punkte gab es zuerst überall.** Sie zeigen schon vor dem ersten Ton,
ob zwei oder drei Schläge im Takt sind — und genau danach fragen die
Muster-Rätsel indirekt. Jetzt trägt nur, wer sie braucht: Bei `typ:
'gruppierung'` sind sie der erklärte Zweitkanal, bei `typ: 'muster'` fehlen sie,
und in der Rückmeldung stehen sie immer. Das deckt sich mit dem, was der
Datensatz über sich ohnehin sagt (`ohneHoerenLoesbar`).

**Muster C zählt in Zweiern — wie ein Marsch.** Wer danach „marschieren“
antwortet, hat die Regel richtig angewendet und nur das zweite Merkmal
übersehen. Deshalb trägt q3 ein Feld `nachvollziehbar` und die App zeigt
„👍 Fast – gut gehört!“ statt eines Fehlersignals. Die Marsch-Regel nennt jetzt
beide Merkmale: in Zweiern zählen **und** ohne Pause durchgehen.

## 6. Zweiter Kanal: Puls-Punkte

`zeitplan()` liefert Noten UND Schläge aus derselben Quelle; die App baut daraus
den Klang und die mitlaufenden Punkte. Sie können deshalb nicht auseinanderlaufen.
Zwei oder drei Punkte pro Takt, der erste größer, **Größenänderung statt
Blinken** — ein Helligkeitswechsel läge beim Walzer bei 2,5 Hz und damit nah an
der WCAG-Grenze 2.3.1. Damit sind die Takt-Aufgaben auch ohne Hören lösbar; die
Muster- und Stimmungsaufgaben nicht, und genau das sagt die App.

## 6a. Die erste Walzer-Melodie war ein Zitat

Sie lautete G-A-G-F-E-F-G — Ton für Ton der Anfang von „London Bridge Is
Falling Down“. Genau davor warnt die Vorklärung: Naheliegende kindgerechte
Tonfolgen kollidieren leicht mit bekannten Incipits, und das unterläuft das
erklärte Ziel „keine fremden Melodien“ dort, wo man es nicht vermutet. Die
Melodie ist jetzt A-G-F-E-D-E-F, und ein Test hält alle drei Tonfolgen fest, so
dass jede Änderung wieder von Hand geprüft werden muss.

## 7. Audio-Hygiene

Fester Deckel `MAX_LAUTSTAERKE = 0.22` im Master-Gain, mindestens 12 ms
Ein- und Ausblenden pro Note (sonst knackt es), `triangle` für die Melodie und
`sine` für die Begleitung statt scharfer Rechteckwellen, Probeton auf dem
Startbildschirm, Empfehlung Lautsprecher statt Kopfhörer. Ausdrücklich: **kein
Hörtest, keine Musikalitätsmessung.**

## 8. Ko-Nutzungs-Muster

Erwachsenen-Gate → `PRO_SESSION = 5` → nach jeder Aufgabe ein Bewegungs- und
Gesprächsimpuls in Frageform (Validator) → Mischform-Bildschirm als Pointe →
Pflichtabschluss „Bildschirm aus“ mit drei Offline-Ideen. Keine Punkte, kein
Rekord, kein Rang, nichts gespeichert.

## 9. Politik (docs/02)

Werbefrei, ohne Anmeldung, keine externen Anfragen
(`installiereNetzwerkWaechter`, CSP `default-src 'self'`), **kein**
localStorage, deutsche Oberfläche, `eltern.html`, Impressum im Fuß.

## 10. Tests

15 Tests in `test/logik.test.mjs`: Datengültigkeit, Tonnamen H/B,
Puls-Rechnung und Etikett-Konsistenz, Singbarkeitsrechnung, Mischform-Pflicht,
Selbstkonsistenz der Rätsel, Tempo-Spannweite der Märsche, Lösungsverbot bei
Stimmungsfragen, Ein-Merkmal-Vergleichspaare, festgehaltene Tonfolgen,
`nachvollziehbar` bei Muster C, Zeitplan (Klang und Puls aus einer Quelle,
Oktavlage, Artikulation), gerechnete Zugänglichkeitsauskunft, Pegel und
Sitzungsgrenze, Ton und Abschluss.
