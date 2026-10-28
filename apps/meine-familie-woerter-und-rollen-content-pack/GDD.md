# Meine Familie: Wörter und Rollen: Kurz-GDD

Grundlage: der Bauauftrag `docs/bauauftraege/CON-3-meine-familie-woerter-und-rollen-content-pack.md` (er gilt bei Widerspruch) und der
Entwurf `docs/neue-welle/GDD-CON-3.md`, hier an das Gebaute angepasst.

## 1. Warum
Die Praleska nennt im Abschnitt „Ребенок как член семьи“ (S. 117) Aufgaben für die Gruppe „ПОЧЕМУЧКИ“: Verwandtschaftsrollen kennen
(„сын, дочь, внук“, Sohn, Tochter, Enkel, Schwester, Bruder, Neffe), höflich sein (danken, um Verzeihung bitten, Mitgefühl und
Bewunderung zeigen), im Haushalt mitmachen („домашнем труде“) und eine erste Vorstellung vom Familienbudget bekommen („семейном бюджете“).
Eine erwachsene Person, die mit einem Kind von 3 bis 5 Jahren redet, hat dafür keine kurze, fertige Grundlage. Die App gibt sie: ohne
Werbung, ohne Wertung des Kindes, ohne Speicherung. Der Bedarf ist nicht gemessen (offen).

## 2. Wer und Kernerlebnis
Wer: ein Kind von 3 bis 5 Jahren gemeinsam mit einer erwachsenen Person (Ko-Nutzung; Verwendung Bildschirm und Druck). Das ist eine
Kinder-App im Sinn der Entscheidung 34а: Vorlesen und die Regel „kein Kind wird bewertet“ gelten.
Kernerlebnis: Das Kind sieht eine Karte und hört das Wort und den Satz. Bei den Rollen wählt es in einer eigenen Runde Fragen zwischen zwei
Antworten und hört danach die Erklärung. Nach höchstens sechs Karten oder Fragen kommt „Bildschirm aus“ mit Ideen fürs Weitermachen; die
erwachsene Person druckt, wenn sie will, eine Karte auf ein Blatt A4.

## 3. Entscheidungen
- Eine eigene Karten-App (Weg B des Entwurfs) statt `quiz-kern`: Themenwahl, Kartenreihe und Druck liegen außerhalb des Motors, der Motor hat keine
  harte Sitzungsgrenze („Noch einmal“ öffnet eine neue Runde), und sein Startbildschirm bringt Klassen-Modus, Duett und Staffel mit. Folge:
  `node tools/quiz-durchlauf.mjs` gilt für diese App nicht. Das ist eine Entscheidung für diese Einheit; die Frage 1 in `docs/plan-neue-welle.md`
  (Abschnitt 5) bleibt für Max offen.
- Der Quiz ist ein „Rollenquiz“ (Bauauftrag, Abschnitt 3). Er ist eine eigene Runde von sechs Fragen, die der Startbildschirm anbietet, und hängt
  nicht an den Karten (Abweichung vom Ablauf in Abschnitt 3, Grund: die Sitzungsgrenze, siehe unten). Haushalt, Höflichkeit und Familienbudget bekommen
  eine Karte zum Vorlesen und einen Gesprächsimpuls, ohne richtig oder falsch: über Ordnungen in einer Familie wird nicht geurteilt.
- Zwei Antworten je Frage (Abschnitt 3). Der Pseudocode (Abschnitt 5) nennt drei andere Rollen, also vier Antworten; `erzeugeQuizFrage` hat den
  Parameter `anzahlOptionen`, die App nimmt zwei.
- Jede Frage nennt die Beziehung („Was ist ein Junge für seine Mama oder seinen Papa?“). Sonst träfe eine falsche Antwort auch zu: ein Mädchen
  ist Tochter und Schwester zugleich.
- „Mama oder Papa“ statt „die Eltern“: es wird nicht vorausgesetzt, dass zwei Erwachsene da sind. Die Hinweise für Erwachsene sagen, dass
  bei anderen Familien deren Wörter gelten. Die Sätze zu Schwester und Bruder gelten bei „dieselbe Mama oder denselben Papa“; Stief-, Halb- und
  Pflegegeschwister sind offen.
- Die Rückmeldung urteilt nicht über das Kind: „Ja, das passt.“ oder „Schau mal: Hier passt das Wort …“. Keine Farbe für richtig oder falsch.
- Sitzungsgrenze (Eigenentwurf nach docs/10, Rahmen der Adaption: 3 bis 5 nur gemeinsam mit Erwachsenen und mit Grenzen): höchstens sechs Karten
  oder Fragen am Stück, danach die Pause; aus der Pause geht es nur zum Start. Die Grenze steht im Ablauf: Die Runde Fragen beginnt nur mit dem
  Eintrag „Fragen zu den Rollen“ auf dem Startbildschirm, nicht auf den Karten, und von einer Kartenreihe führt nur „Fertig“ in die Pause. Ein
  Knopf zu den Fragen auf den Karten hätte sechs Karten und sechs Fragen ohne Pause aneinandergehängt. Ein Test liest die Wege zwischen den
  Bildschirmen aus dem Quelltext. „Zum Start“ bleibt als Ausgang; einen Zähler gibt es nicht, und eine Sperre, die ein Neuladen überlebt, wäre nur
  mit Speicher möglich, den die App nicht hat (siehe „## Offen“). Kein eigener Gate-Bildschirm: der Hinweis „nur gemeinsam“ steht auf dem
  Startbildschirm und in der Fußzeile.
- Haushaltskarten ohne Gefahren (kein Messer, kein Herd, keine Reinigungsmittel) und ohne Aufgabe nach Geschlecht; Familienbudget ohne Beträge,
  Preise und Waren, damit sich Familien mit wenig Geld nicht angesprochen fühlen. Jede Karte hat einen Gesprächsimpuls für die erwachsene Person,
  als Frage oder als Einladung zum Erzählen. Einige lassen ein Nein zu („Fällt dir ein Sohn ein?“, „Magst du erzählen …?“): Über die eigene Familie
  zu sprechen soll freiwillig bleiben (Eigenentwurf; offenere Fassungen siehe „## Offen“).
- Das Blatt: Kopf, Titel, ein Satz und der Vermerk „Text der Karte (Eigenentwurf)“. Ohne Seitenzahl (A18-Standard), ohne Marke (es steht dort keine
  Seite), ohne Namenszeile, ohne Tagesfeld, ohne Zeichen und Emojis (docs/02 Z. 79–82). Eine Karte je Blatt A4 hoch.
- Seitenangaben stehen in den Daten und in der Quellenzeile auf dem Bildschirm; dort steht die Marke „Seitenangaben nicht von einem Menschen
  geprüft.“ (Entscheidung Max 22а). Die App steht nicht in `docs/seitenmarke-stand.json`.
- Keine Eingabefelder, keine Speicherung, deshalb keine Karte „Meine Daten löschen“ (Entscheidung Max 30б). Kein Service Worker (9б).
- Keine Anfragen nach außen (docs/02 Z. 22–24): Content-Security-Policy, Netzwerk-Wächter, Daten per JSON-Import mit Typangabe.
- Keine Wertung eines Kindes (docs/02 Z. 141–146): kein Punkt, kein Rekord, kein Rang, keine Serie, kein Prozent. Der Zähler „Karte 2 von 6“ zeigt
  nur die Stelle in der Reihe.
- Der Titel der Seite lautet „Meine Familie: Wörter und Rollen“, ohne das interne Wort „Content-Pack“; der Ordnername bleibt wie im Bauauftrag.
- Keine Hilfe-Insel: eine erwachsene Person ist per Konstruktion dabei (wie bei den anderen Apps für 3 bis 5). Ob der Baustein für das Thema
  Familie trotzdem gewünscht ist, steht unter „## Offen“.

## 4. Lernziele (prüfbar)
1. Die erwachsene Person findet im Thema Rollen alle sechs Verwandtschaftsrollen mit je einer Karte. Prüfung: Test der Daten, sechs Karten in fester
   Reihenfolge, je mit `quelle.seite` und `eigenentwurf: true`.
2. Das Kind nennt zu einer Rolle die passende Bezeichnung (Ko-Nutzung). Die App prüft nur die Wahl zwischen zwei Antworten; „nennt“ bestätigt
   nur ein Test mit Kindern (siehe unten).
3. Die erwachsene Person wählt ein Thema (Haushalt, Höflichkeit oder Familienbudget) und liest die Karte vor. Prüfung: das Thema öffnet sich, jede
   Karte hat einen Satz zum Vorlesen und einen Gesprächsimpuls; die Browser-Messung klickt alle Knöpfe.
4. Die erwachsene Person druckt eine Karte auf ein Blatt A4 ohne Namenszeile. Prüfung: n gewählte Karten ergeben n Blätter (Test und Druckansicht im
   Browser), kein Zeichen, kein Emoji, keine Namenszeile, kein Tagesfeld, keine Seitenzahl.

## 5. Inhalt
17 Karten in `daten/`: Rollen 6 (Sohn, Tochter, Enkel, Schwester, Bruder, Neffe), Haushalt 4, Höflichkeit 4, Familienbudget 3. Je Karte ein Satz, ein
Gesprächsimpuls, Quelle (Seite und Begriff) und Vermerk; die Rollenkarten dazu eine Frage. Je Thema drei Ideen für die Pause. Alle Texte sind
Eigenentwurf; die Quelle nennt auf S. 117 nur die Themen. Die Seiten und Begriffe sind in der Bauarbeit maschinell gegen die Textkopie geprüft.
Anti-Muster-Test (Eigenentwurf): jede Rolle ist mindestens einmal die richtige Antwort und einmal ein falsches Angebot, der Platz der richtigen
Antwort wechselt, die richtige Antwort ist weder immer die längste noch immer die kürzeste.

## 6. Politik (Tore aus docs/plan-neue-welle.md, Abschnitt 3)
- Tor 1, kein Kind wird bewertet (docs/02 Z. 141–146): `node tools/leistungs-woerter.mjs meine-familie-woerter-und-rollen-content-pack` ohne Treffer,
  `node tools/bewertung-stand.mjs` ohne neuen Eintrag, beides auch als Test.
- Tor 2, Speicherregel: die App speichert nichts und zeigt keine Karte „Meine Daten löschen“ (`packages/kinderschutz/test/speicher-regel.test.mjs`).
- Tor 3, Berührziele mindestens 48 px, kein Überlauf bei 360 px, Fokus nach Klick: `node tools/browser-tor.mjs` ohne Verletzung.
- Tor 4, Quiz-Durchlauf: gilt nicht, die App nutzt `quiz-kern` nicht (siehe Entscheidungen).
- Tor 5, Druck (docs/02 Z. 79–82): Fuß und Bildschirmteile verborgen, keine Namenszeile, keine Zeichen, keine Emojis, kein Tagesfeld.
- Tor 6, Fakten: Aussagen über Geld stehen nur im Familienbudget und tragen den Vermerk „(Eigenentwurf, fachlich nicht geprüft)“; keine Beträge. Der
  Zähler externer Fakten steigt nicht (`packages/kinderschutz/test/externe-fakten.test.mjs`).
- Tor 7, Vorlesen: jeder Bildschirm für Kinder hat einen Knopf „Vorlesen“ (Start, Karte, Frage, Antwort, Pause). Die Druckauswahl und die Hinweise sind
  Bildschirme für Erwachsene.
- Tor 8, Seiten der Quelle: Marke auf dem Bildschirm, keine Seitenzahl auf dem Blatt (siehe Entscheidungen).
- Tor 9, keine Modellnamen, keine fremden Adressen, keine Zitate über sechs Wörter: Tests.
- Besondere Risiken des Themas (Eigenentwurf, Fachprüfung offen): Familie ist ein persönliches Thema. Die Texte nehmen nicht an, wer in der Familie
  ist (eine Mama oder ein Papa, zwei Mamas, Pflegefamilie, Trennung, Verlust), vergleichen keine Kinder und Familien und formulieren Höflichkeit als
  Angebot („kannst du“), nicht als Vorwurf.

## 7. Aufwand
S bis M. Das Werk ist der Text der Karten und seine Prüfung, nicht der Code: `app.mjs` und `logik.mjs` sind klein, die Daten sind statisch.

## 8. Tests
63 Tests in zwei Dateien. `test/logik.test.mjs` prüft Daten, Seiten, Zitate, das Laden, die Rollenfragen mit festem Zufall, die Antwort, die Vorlesetexte,
die Auswahl und das Blatt. `test/regeln.test.mjs` prüft die Projektregeln, darunter die Wege zwischen den Bildschirmen (Sitzungsgrenze). Details in der README.

## Kindertest-Hypothesen
Was an 5 bis 8 Kindern von 3 bis 5 Jahren gemeinsam mit einer erwachsenen Person zu prüfen ist (Protokoll docs/05, Methode 5); Ergebnisse gibt es
nicht, es sind Hypothesen (Eigenentwurf):
1. Verstehen die Kinder „Enkel“ und „Neffe“ beim Vorlesen? Zeigen sie auf die passende Karte oder erraten sie nach dem Platz der Knöpfe?
2. Wählt das Kind selbst, oder sagt die erwachsene Person vor?
3. Erzählen die Kinder nach Haushalt und Höflichkeit von zu Hause („bei uns ist das so“), oder klingt die Karte wie eine Regel oder ein Vorwurf?
4. Wirken die Karten auf Kinder aus anderen Familienformen fremd? Beobachten, nicht nach der Familie fragen; dazu die Beratung einer Fachkraft.
5. Reichen sechs Karten; geht die Familie nach „Bildschirm aus“ zu einer Tätigkeit über; was geschieht mit dem gedruckten Blatt?

## Offen
- Alter: Bauauftrag und Katalog sagen 3 bis 5 Jahre; die Gruppe „ПОЧЕМУЧКИ“ trägt auf S. 103 die Angabe „четвертый—пятый годы жизни“. Derselbe
  Abschnittstitel „Ребенок как член семьи“ steht aber auch auf S. 214 in der Gruppe „ФАНТАЗЕРЫ“ (Suche in der Textkopie: nur S. 117 und S. 214), und
  S. 117 nennt „старших дошкольников“. Ob 3 bis 5 oder 5 bis 7 gilt und ob „Enkel“ und „Neffe“ für Dreijährige taugen, entscheiden Max und der Kindertest.
- Rollen: der Katalog nennt „Neffe/Nichte“ und Beispiele wie Oma; die Quelle nennt auf S. 117 nur „племянник“ (Suche nach «племянниц» im ganzen Buch: 0
  Treffer). Gebaut sind die sechs Rollen des Bauauftrags; Nichte, Oma, Opa, Tante, Onkel, Mama und Papa sind keine eigenen Karten. Ob sie dazukommen, ist offen.
- Der Beispielsatz im Bauauftrag („Der Sohn ist das Kind der Eltern.“) unterscheidet Sohn und Tochter nicht und setzt zwei Eltern voraus; die Sätze der App
  sind neu geschrieben. Eine Fachkraft liest sie gegen (Sprache, Alter, Familienvielfalt, Stief-, Halb- und Pflegegeschwister, Familien ohne Oma oder Opa).
- Haushalt und Familienbudget: die Auswahl der Aufgaben und die Sätze zu Geld sind Eigenentwurf und fachlich nicht geprüft. Der Katalog nennt eine
  Verbindung zu den Bildungsplänen und zur frühen Verbraucherbildung; beides ist hier nicht belegt und nicht übernommen. Die Grenze zu `familien-budget`
  (8 bis 12 Jahre, mit Beträgen) ist so gezogen: hier nur Wörter, keine Zahlen.
- S. 117 nennt auch Aufgaben, die nicht übernommen wurden: Anschrift, Arbeitsstelle, Berufe und Telefonnummern der Angehörigen („домашнего адреса“,
  „номеров телефонов“) und Verhalten nach dem Geschlecht des Kindes („адекватные полу формы поведения“). Die App sammelt nichts und verteilt keine Aufgabe
  nach Geschlecht (der Katalog verlangt „geschlechtsneutral“). Bitte von Max bestätigen.
- Sitzungsgrenze: sechs Karten oder Fragen am Stück ist ein Eigenentwurf; andere Apps für 3 bis 5 nehmen fünf oder sechs. Die Grenze ist eine
  Führung im Ablauf, keine Sperre: Jede Reihe und jede Runde endet in der Pause, aber „Zum Start“ und Neuladen beginnen neu, denn die App zählt
  nichts mit und speichert nichts. Die Hinweise für Erwachsene bitten, Reihe und Runde nicht ohne Pause aneinanderzuhängen. Ob das als „harte
  Grenze“ (docs/10, Rahmen der Adaption, Punkt 2) genügt oder ob ein Zähler im Arbeitsspeicher der Seite nötig ist (er würde beim Neuladen
  verschwinden), entscheidet Max.
- Gesprächsimpulse: Nur ein Teil sind offene Fragen mit „Was“, „Welche“ oder „Wobei“ („Was brauchst du immer?“). Andere sind Ja-Nein-Fragen („Kennst du
  ein Mädchen, das eine Schwester hat?“) oder Einladungen („Magst du von jemandem erzählen, der so heißt?“). Bei Schwester, Bruder und Neffe geht dem
  Impuls ein Satz wie „Manche Kinder haben eine Schwester, manche nicht.“ voraus; ein Nein ist dort erlaubt, weil Kinder nicht über ihre Familie sprechen
  müssen (Eigenentwurf). Ob offenere Fassungen („Welchen Sohn kennst du?“) mehr Sprechen auslösen, ohne Druck zu machen, zeigt der Kindertest
  (Hypothese 3). Der Test der Daten prüft nur, dass jeder Impuls eine Frage ist.
- Hilfe-Insel: nicht gebaut. Nach `packages/kinderschutz/test/hilfe-insel-abdeckung.test.mjs` gehört der Baustein nicht in die Ko-Nutzung für 3 bis 5, weil eine
  erwachsene Person per Konstruktion dabei ist. Ob er für das Thema Familie trotzdem gewünscht ist (Verlust, Trennung, Gewalt zu Hause), entscheidet Max.
- Der Bauauftrag nennt Blockaden und Entscheidungen, die inzwischen erledigt sind: A7 (der Motor kennt keine Wertung mehr), A3 und A18 (Favicon, Seitenmarke:
  Entscheidungen Max 21а und 22а), A1 (Modellnamen). Der Bauauftrag ist insoweit veraltet; die App folgt den Entscheidungen.
- uk und ru: nicht vorhanden, offen. Der Katalog nennt parallele Verwandtschaftswörter; Übersetzungen entstehen erst nach Prüfung durch Muttersprachler.
- Prüfung auf dem Gerät und Test mit Kindern der Zielgruppe stehen aus.
- Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

**Vorlesen:** gebaut. Kinder-App (Zielgruppe Kinder in Ko-Nutzung): jeder Bildschirm für Kinder liest über `vorlesen()` aus `packages/kinder-ui` vor; die Texte kommen
beim Klick, bevorzugt mit einer geräteinternen Stimme. Die Druckauswahl und die Hinweise sind Bildschirme für Erwachsene (Entscheidung Max 28а).
