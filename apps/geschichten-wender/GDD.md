# Kurz-GDD: Geschichten-Wender 🔄

**Einheit aus Katalog:** docs/10 (Praleska), Abschnitt „Ko-Nutzung“, Nr. 19 —
«Geschichten-Wender (Stimmungs-Werkstatt)». Buchquelle: „Twortschestwo“,
S. 253–254.
**Engine:** eigenes datengetriebenes Vorlagen-Format (bewusst **nicht**
`quiz-kern`: der bringt Punkte, einen Rekord im `localStorage`, „⭐“ und
Ränge mit). Zielgruppe: **5–7, nur gemeinsam mit einem Erwachsenen.**

Der Zusatz „Stimmungs-Werkstatt“ ist im Anzeigenamen weggelassen: die App
baut **Handlung** um, nicht Stimmung — und „Stimmung“ ist für dieses Alter
ohnehin kein verfügbares Wort (ein aggregierender Oberbegriff, während
froh/traurig/wütend als Einzelzustände an konkreten Figuren verfügbar sind).

## 0. Abgrenzung — zweifach

`apps/erzaehl-bruecke` würfelt Held, Ort und Problem und gibt eine leere
Vierstufen-Form: **Konstruktion aus nichts.** Diese App setzt eine fertige
kurze Geschichte voraus und lässt daran eine Operation ausführen:
**Transformation von etwas Vorhandenem.** Darum gibt es hier keine
Held/Ort/Problem-Würfel, sondern `vorlagen` — ein Würfel wäre die falsche
Mechanik für die Katalogvorgabe und eine Dublette.

`apps/geschichten-werkstatt` ist die 8–12-App für Geschichten und hat
„Anders erzählen“ bereits. Der Katalog nennt für diese Einheit auch
„8–12 eigenständig“ — das wäre eine Dublette **und** ein Regelbruch: die
ganze Didaktik hier setzt einen Erwachsenen voraus, der vorliest und
mitschreibt. Darum `ZIELGRUPPE = 'ko-nutzung 5-7'`, kein Allein-Modus, und
die Elternseite verweist für ältere Geschwister auf die Werkstatt. Der
Validator erzwingt die Zielgruppe.

Und **nicht unter 5**: eine vorgegebene Geschichte im Gedächtnis halten
*und* sie gleichzeitig verändern überschreitet darunter die Kapazität. Die
Alterskennzeichnung wird nicht auf 3 heruntergezogen, nur weil das Projekt
eine 3–7-Leiste hat.

## 1. Es gibt keine Musterlösung

„Weiterdenken“ (*domysliwat*) ist **divergent**: die Vorlage hat nie eine
echte Mitte gehabt. Ein Bau, der „die echte Mitte“ zurückhält und am Ende
auflöst, macht aus einer Kreativaufgabe ein Ratequiz und lehrt das Kind,
dass seine Erfindung die falsche war.

`pruefeDaten` verlangt pro Vorlage **≥ 3 `moeglichkeiten` mit paarweise
verschiedener `art`**. Und `art` kommt aus der geschlossenen Liste
`WENDUNGEN` — sonst wären „helfer-kommt“ und „helfer-kommt-2“ zwei
„verschiedene“ Wege, also Zeichenketten- statt Inhaltsverschiedenheit.

## 2. Whitelist, keine Verbotsliste

Eine Blacklist (`loesung`, `richtig`, `musterloesung`, …) lässt jedes
Synonym passieren: `original`, `vorbild`, `echteMitte`, `zielEnde`,
`beispiel`, `sollStimmung`. Darum sind `ERLAUBTE_FELDER_VORLAGE`,
`_TEIL` und `_MOEGLICHKEIT` **Positivlisten**, und jeder unbekannte
Schlüssel wird abgewiesen. Ein Test schmuggelt dreizehn solcher Felder
einzeln ein und verlangt für jedes einen Fehler.

## 3. Die Möglichkeiten sind Erwachsenen-Material

Steht eine Fortsetzung sichtbar auf dem Bildschirm, **bevor** das Kind
erfunden hat, erfindet es nicht — es wählt. Fünfjährige behandeln ein
angebotenes Ende als das vorgesehene (Autorität des Mediums plus Weg des
geringsten Aufwands), und gerade weil kein Feld „Lösung“ heißt, wirkt es
trotzdem so.

Darum erscheinen sie nie beim Aufgabenstart, sondern erst hinter dem
ausdrücklichen Erwachsenen-Knopf „Wir brauchen zusammen eine Idee“ — und
dann **alle drei gleichzeitig**, per `mischen()` ungeordnet, mit dem
gesprochenen Satz „Das sind drei von vielen Wegen“ und „keine davon ist die
vorgesehene“. Ein Test prüft, dass der Aufgabenbildschirm die
`moeglichkeiten` nicht einmal berührt.

## 4. Nichts Erzähltes geht durch die Sprachausgabe — und es gibt kein Textfeld

`vorlesen()` benutzt `SpeechSynthesis`. Web-Speech-Stimmen sind **nicht**
garantiert geräteintern (auf vielen Geräten sind sie netzbasiert), und
`installiereNetzwerkWaechter()` patcht nur `fetch`, `XMLHttpRequest` und
`WebSocket` — `speechSynthesis` liegt außerhalb, und die CSP greift dort
auch nicht. Vorgelesen werden deshalb **ausschließlich die festen Texte der
App**; das Zurücklesen des Diktats macht der Mensch, und die App sagt das.
Fehlt eine deutsche Stimme, zeigt `stimmeDa()` „bitte lies du vor“ statt
eines toten Knopfs — in dieser App *ist* die Vorlage die Aufgabe.

**Kein Eingabefeld.** Ein Textfeld wird vom Browser selbst wiederhergestellt
(Session-Restore, Back-Forward-Cache), Autofill merkt sich Eingaben, und
mobile Tastaturen nehmen getippte Wörter in ihr Lernwörterbuch auf — „es
wird nichts gespeichert“ wäre damit ohne Zusatzmaßnahmen keine wahre
Aussage. Die saubere Lösung ist Papier und Stift auf dem Druckblatt.

## 5. Kein Zielzustand

„Mach ein fröhliches Ende“ nennt einen Soll-Zustand. Kinder dieses Alters
lesen eine Aufgabe vom Gerät als „es gibt eine Art, wie ich das machen
soll“ — können aber selbst nicht beurteilen, ob ihr Ende „fröhlich genug“
ist. Es entstünde ein Kriterium, das sie nicht prüfen können und an dem sie
trotzdem gemessen würden. Außerdem sind traurig endende Geschichten nicht
defekt.

Darum sind die Fragen **Handlungsfragen** („Was könnte passieren, damit es
anders ausgeht?“), und `pruefeDaten` lehnt Sollzustands-Formulierungen ab.
Kein Bestätigen, kein Einordnen, kein Nachfordern, keine Smiley-Abfrage,
keine Selbsteinschätzung. Bleibt das Ende traurig oder drastisch, folgt ohne
Bemerkung der nächste Schritt.

## 6. Höchstens vier Erzählteile

Das Kind **hört** die Vorlage und muss sie behalten *und* verändern;
realistisch sind drei bis vier gleichzeitig gehaltene Erzählelemente. Ein
Prosablock von 60–90 Wörtern trüge sechs bis zehn Aussagen — die Aufgabe
wäre nur scheinbar gestellt, und das Kind erzählte stattdessen eine neue
Geschichte. `MAX_TEILE = 4`, jeder Teil **genau ein Satz** (Validator
zählt die Satzzeichen), mit einem Zeichen vorn als Anker für die ganze
Vorlage (so auch in der getauschten Fassung) und jeder einzeln wieder
hörbar.

## 7. Die drei Operationen sind nicht altersgleich

| `stufe` | `art` | Leistung |
|---|---|---|
| 1 | `umdrehen` | einen neuen Ausgang erzeugen — im Stadium *focused chain* möglich |
| 2 | `luecke` | Anfang UND Ausgang halten und dazwischen eine Brücke erzeugen |
| 3 | `tausch` | erkennen, dass die Auflösung sich rückwärts auf das Problem bezieht (*true narrative*, typisch erst ab 5–6) |

Der Erwachsene wählt im Gate, mit klartextlicher Reihenfolge-Empfehlung.
Der Validator erzwingt die Stufen und verlangt, dass der Erwachsenentext von
`tausch` den Satz „kein Fehlversuch“ enthält: **eine neu erfundene
Geschichte statt einer umgebauten ist der normale Entwicklungsstand** und
wird nicht noch einmal eingefordert.

**Den Tausch führt die APP aus.** Ein Sortier-Widget hätte die
Umstrukturierung in eine Anordnungsaufgabe mit *richtiger* Reihenfolge
verwandelt — verdeckte Bewertung —, und gezieltes Ziehen und Ablegen ist auf
Touch mit 5–6 unzuverlässig: ein verrutschter Finger erzeugt ein Ergebnis,
das das Kind nicht gemeint hat. Im ganzen Korpus benutzt kein `app.mjs`
`draggable`. Beide Fassungen bleiben mit je einem Antippen hörbar, sonst ist
der Vergleich zweier Zustände nicht möglich.

**Aber ein maschineller Satztausch liefert kein Deutsch.** Die erste Fassung
vertauschte Satz 1 mit Satz 4 und ließ die Mitte stehen. Heraus kam: „Am Ende
stand vor seiner Tür ein Korb … Das Kind gab die Hälfte ab … Ein Kind hatte nur
noch ein Stück Brot.“ Also „Am Ende“ als Anfang, „seiner“ ohne jeden Bezug, und
„das Kind“ bestimmt, **bevor** „ein Kind“ eingeführt ist — es sehen also zwei
Kinder aus. Ein Fünfjähriger kann daraus keine Vorstellung bauen, und die App
fragt danach „Wie kam es dazu?“. Dasselbe landete auf dem Druckblatt.

Darum steht die vertauschte Fassung **ausgeschrieben** in den Daten
(`tauschTeile`, nur bei `art: 'tausch'` erlaubt und dort Pflicht), und
`getauscht()` gibt sie zurück — ohne stillen Rückfall auf den maschinellen
Tausch. `pruefeReihenfolge()` prüft **beide** Reihenfolgen auf Bezüge, die nach
vorn zeigen: der erste Satz beginnt nicht rückverweisend („Am Ende“, „Danach“,
„Deshalb“) und enthält kein Pronomen, dessen Bezug nicht im selben Satz schon
eingeführt ist („Eine alte Frau hatte **ihren** Schlüssel verloren“ ist
einwandfrei, „Am Ende stand vor **seiner** Tür“ nicht); und wer in einer
Reihenfolge überhaupt unbestimmt eingeführt wird, muss dort auch zuerst
unbestimmt vorkommen. Nomen, die nie eingeführt werden (die Luft, der Boden,
die Tür), bleiben unberührt — sie sind situativ eindeutig.

## 8. Kein Stimmungs-Etikett am Bildschirm

„Stimmung“ ist ein Rezipienten-Konstrukt, mitbestimmt von Stimme, Tempo,
Pausen und Vorerfahrung — derselbe Text ist für ein Kind „spannend“ und für
das andere „gruselig“, und beide haben recht. Ein Etikett neben der
Geschichte wäre für das Kind die Setzung einer Autorität; den Konflikt „die
App sagt traurig, ich finde es lustig“ lösen Fünfjährige nicht
pluralistisch, sie übernehmen.

`ausgangsstimmung` bleibt darum im Datenmodell (für Auswahl und
Elternseite), wird aber im Kind-Bildschirm **nicht** gerendert. Das Gefühl
kommt als **Zustand der Figur in der Erzählung** vor („Das Kind war traurig,
weil …“) — eine Tatsache der Geschichte, keine Interpretation.

Jeder Impuls ist dazu **eine** offene Frage (genau ein `?`), nennt höchstens
**einen** Gefühlszustand und enthält keine eingebettete Fremdperspektive
(„was denkt X, dass Y …“ — Theory of Mind zweiter Ordnung, typisch erst ab
6–7) und keine Gleichzeitigkeits-Konstruktion („zugleich“, „obwohl“) —
gemischte Gefühle werden erst im Schulalter verstanden. `pruefeImpuls()`
setzt das durch, auch für die Fragen der Aufgabenarten.

Dort steht jetzt auch die Sollzustands-Prüfung. Sie lag zuerst als eigene Zeile
in der `arten`-Schleife und lief damit allein auf den drei `kindFrage`-Strings
— die achtzehn `moeglichkeiten[].impuls` werden dem Kind aber **wörtlich**
vorgelesen (`ideenBildschirm`), also hätte ein Sollzustand dort das Kind
erreicht, ohne dass der Validator etwas meldet. Und der Griff nach der
Fremdperspektive traf zuerst nur `denkt|glaubt|meint`, also das Präsens,
während die Vorlagen durchweg in der Vergangenheit erzählen und die
vorhandenen Gedanken-Impulse im Partizip stehen („gedacht haben“) — die
Formulierung, die beim Weiterschreiben von selbst entsteht, lag genau im
blinden Fleck.

## 9. Eigenproduktion, Muster benannt

Gemeinfreie Stofftypen und bloße Motive sind frei. Geschützt ist die
konkrete Ausgestaltung – der Wortlaut und, bei individuell geprägten Werken,
auch Handlungsgang und Figurenkonstellation: der BGH nahm in „Laras Tochter“
(I ZR 65/96, 29.04.1999) eine unfreie Bearbeitung an, **ohne** dass Wortlaut
übernommen war. „Geschützt ist immer nur die konkrete Form“ wäre als
allgemeiner Rechtssatz also falsch. Die Praxis hier ist davon unberührt: es
werden ausschließlich traditionelle Märchentypen als Muster benannt und keine
Handlung eines modernen Werks nachgebaut. Der Wortlaut der Grimm-Fassungen ist
gemeinfrei (Wilhelm † 1859, Jacob † 1863), moderne Nacherzählungen und
Übersetzungen sind es nicht. Jede Vorlage trägt darum ein Pflichtfeld
`herkunft`, das „Eigenproduktion“ ausspricht und das Muster mit Quelle
nennt (Uther 2004).

Drei Sperren: **keine Verse, Reime oder Refrains** (dort reproduziert man
unbewusst — gerade die gereimten Zeilen sind das Einprägsamste eines
Märchens); **keine Eigennamen**, Figuren bleiben generische Rollen (eine
benannte Figur kann eigenständig geschützt sein); **kein Ton**. Ein Test
verbietet die Felder und prüft auf die bekannten Märchennamen.

## 10. Blatt, Abbruch, Sitzung

`PRO_SESSION = 1`: **eine** Transformation pro Sitzung. Eine kreative
Transformation braucht 5–10 Minuten dichte Zuwendung; mehrere Vorlagen
hintereinander erzeugen Abbruch statt Übung.

**Aufhören ist aus jedem Zustand erreichbar** („Für heute reicht es“) und
lässt nichts unerledigt wirken — sonst erzeugt die Abschlussregel selbst
Sitzungsverlängerung. Drucken geht auch nach einem Abbruch.

Das Blatt ist ein **Familiendokument** mit echten Schreiblinien
(`1.1cm` im Druck): kein Urkunden-Wortlaut, keine Sterne, Sticker oder
Medaillen, keine Wochentabelle, kein Zähler erledigter Vorlagen und **keine
Namenszeile**: die Freigabe-Checkliste in docs/02 verbietet sie auf einem
Druckblatt ausdrücklich, und das gilt auch für eine freiwillig gemeinte
Autorenzeile — vorgedruckt macht sie aus dem Blatt ein vergleichbares. Wer
seinen Namen draufschreiben will, hat das ganze Blatt dafür. Darauf der Satz „bitte nicht ins Netz stellen“ —
Kinder haben ein Recht darauf, gefragt zu werden (docs/11). Ein Test prüft
das Druck-Markup gegen Belohnungswörter.

Kein `localStorage`: ein Fortschrittsmerker wäre gleichzeitig ein
Punktestand **und** gespeicherte Daten über die Tätigkeit des Kindes.

## 11. Tests

`test/logik.test.mjs` (22): Daten gültig; drei verschiedene Wege je Vorlage
(plus Gegenproben mit einer und mit zwei gleichartigen); Wendungen aus
geschlossener Liste; Whitelist gegen dreizehn eingeschmuggelte Felder; die
Ideen stehen nicht beim Aufgabenstart und werden gemischt; höchstens vier
Teile, jeder ein Satz, jeder einzeln hörbar; Stufen und „kein Fehlversuch“;
Tausch von der App, ohne Drag-and-drop, beide Fassungen erreichbar; kein
Zielzustand; jeder Impuls eine offene Frage ohne Gefühls-Akrobatik; kein
Stimmungs-Etikett; nur Ko-Nutzung 5–7 ohne Allein-Modus; nichts Erzähltes
vorgelesen und kein Textfeld; keine KI, keine Netz-API, kein `quiz-kern`;
Eigenproduktion ohne Verse und Eigennamen; Lücke nur bei Lücken-Vorlagen;
Blatt als Familiendokument; Aufhören überall; Abschluss und Sicherheit;
`waehleVorlage` rotiert innerhalb der Art; beide Reihenfolgen für sich lesbar
(mit den drei Mängeln des maschinellen Tauschs als Gegenprobe und dem
erlaubten Pronomen-Fall); Fremdperspektive auch in der Vergangenheit.
