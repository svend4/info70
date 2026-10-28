# Meine Familie: Wörter und Rollen

Karten zum Vorlesen für Kinder von 3 bis 5 Jahren, nur gemeinsam mit einer erwachsenen Person.
Vier Themen: **Rollen** (sechs Verwandtschaftsrollen, dazu eine Runde Fragen mit zwei Antworten und einer
Erklärung danach), **Haushalt**, **Höflichkeit** und **Familienbudget**. Nach höchstens sechs Karten oder
Fragen kommt die Pause „Bildschirm aus“ mit Ideen ohne Bildschirm. Die Erwachsenen können einzelne Karten
drucken: eine Karte je Blatt A4 hoch, mit Titel und einem Satz, ohne Namenszeile und ohne Seitenzahl.

Katalog: docs/10, Z. 450 („Meine Familie - Woerter und Rollen (Content-Pack)“, Content-Pack 3). Bauauftrag
CON-3. Der Titel der Seite lautet „Meine Familie: Wörter und Rollen“; das Wort „Content-Pack“ ist ein internes
Wort und steht nur im Ordnernamen. Ohne Wertung, ohne Speicherung, ohne Verbindung nach draußen.
Ein Neuladen ohne Netz ist nicht zugesichert: die App hat keinen Service Worker (F4).

**Status: erster Stand.** Geprüft sind die Tests mit `node --test`, die Browser-Messung bei 360 px Breite
(`node tools/browser-tor.mjs`) und die Druckansicht. Eine Prüfung auf dem Gerät, ein Test mit Kindern
der Zielgruppe und die fachliche Prüfung der Texte stehen aus.
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## Ablauf

1. **Start**: vier Themen mit Titel und Zahl der Karten, dazu der Eintrag „Fragen zu den Rollen“ (6 Fragen), „Vorlesen“,
   „Karten drucken“ und „Hinweise für Erwachsene“.
2. **Kartenreihe** je Thema: eine Karte mit Titel und einem Satz, „Vorlesen“, „Zurück“ und „Weiter“, darunter ein
   Gesprächsimpuls für die erwachsene Person („Zum Weiterreden“). Auf der letzten Karte steht „Fertig“ statt „Weiter“, und das
   führt in die Pause. Auf den Karten gibt es keinen Knopf zu den Fragen.
3. **Rollenfragen**: nur vom Startbildschirm aus, nie mitten in einer Kartenreihe. Sechs Fragen, jede Rolle einmal, in
   zufälliger Reihenfolge. Zwei Antworten, nach dem Antippen die Erklärung („Ja, das passt.“ oder „Schau mal: Hier passt das
   Wort …“) und der Satz der Rollenkarte. Nach der sechsten Antwort führt „Fertig“ in die Pause.
4. **Pause „Bildschirm aus“** nach jeder Reihe und nach jeder Runde, erreichbar nur über „Fertig“: Ideen ohne Bildschirm, dann
   nur noch „Zum Start“.
5. **Karten drucken** (für Erwachsene): Karten wählen, „Gewählte Karten drucken“. Der Zähler sagt nur, wie viele Karten gewählt sind.
6. **Hinweise für Erwachsene**: Gebrauch, Sitzungsgrenze und Pause, Familienvielfalt, Quelle mit Seitenmarke, Sprachen.

Nach jedem Bildschirmwechsel steht der Fokus auf der Überschrift des neuen Bildschirms. Jeder Bildschirm für Kinder hat
einen Knopf „Vorlesen“ (Web Speech über `packages/kinder-ui`, bevorzugt mit einer geräteinternen Stimme). Die Druckauswahl und die Hinweise sind
Bildschirme für Erwachsene und lesen nicht vor.

## Was belegt ist

Quelle: Praleska, Abschnitt „Ребенок как член семьи“ (S. 117), Kapitel „Я и мир вокруг меня“ (S. 117), Gruppe „ПОЧЕМУЧКИ“
(S. 114). Die Karten stützen sich auf Begriffe dieser Seite, je mit Seitenangabe in den Daten (`quelle.seite`, `quelle.begriff`):

- Rollen: „сын, дочь, внук“ (S. 117) für Sohn, Tochter und Enkel; „сестра, брат, племянник“ (S. 117) für Schwester, Bruder und Neffe.
- Haushalt: „распределении домашнего труда“ (S. 117) für die Karte „Alle helfen mit“; „домашнем труде“ (S. 117) für Aufräumen und
  Tischdecken. Die Karte „Blumen gießen“ stützt sich auf „полить цветы“ (S. 103), ein Beispiel der Quelle für Aufgaben der
  Gruppe „ПОЧЕМУЧКИ“ in der Familie.
- Höflichkeit: „благодарить“, „просить прощения“, „высказывать сочувствие“, „восхищение“ (alle S. 117) für Danke sagen,
  Entschuldigung sagen, Mitfühlen und trösten, Etwas toll finden.
- Familienbudget: „семейном бюджете“ (S. 117) für Brauchen und wünschen und für Sparen; „бережливым“ (S. 117) für Sorgsam sein.
- Die Gruppe „ПОЧЕМУЧКИ“ trägt auf S. 103 die Altersangabe „четвертый—пятый годы жизни“. Bauauftrag und Katalog sagen 3 bis 5 Jahre.

Die Seitenangaben und alle Zitate sind in der Bauarbeit maschinell gegen die Textkopie der Quelle geprüft worden (außerhalb des
Repos, Seite n ist der n-te Abschnitt der Textkopie). Zitate haben höchstens sechs Wörter.

## Was Eigenentwurf ist

Alle Texte der Karten: die Sätze, die Fragen, die Gesprächsimpulse, die Ideen der Pause und die Hinweise. Die Quelle nennt auf
S. 117 nur die Themen, keine Sätze für Kinder. Jede Karte trägt die Kennung `eigenentwurf: true` und den Vermerk
„(Eigenentwurf)“, die Karten des Familienbudgets und seine Pause „(Eigenentwurf, fachlich nicht geprüft)“. Der Vermerk steht
auf dem Bildschirm in der Quellenzeile und auf dem Blatt als letzte Zeile („Text der Karte (Eigenentwurf).“).

Die Benennung der vier Themen ist Eigenentwurf (Bauauftrag, Abschnitt 3). Ebenso die Wörter „Oma“, „Opa“, „Tante“ und „Onkel“ in den
Sätzen zu Enkel und Neffe: Suche in der Textkopie: auf S. 117 keine Treffer für «бабушк», «дедушк», «тет», «дяд»; die Wörter
dienen nur dazu, Enkel und Neffe zu erklären. Die weibliche Form steht jeweils im Satz (Enkelin, Nichte), nicht als eigene Karte.

## Was nicht übernommen wurde

- Eine Karte „Nichte“: der Katalog nennt „Neffe/Nichte“. Die Quelle nennt auf S. 117 nur «племянник»; Suche nach «племянниц» im ganzen Buch:
  0 Treffer. Der Bauauftrag verlangt sechs Rollen. Die Nichte steht nur im Satz zum Neffen.
- Weitere Familienwörter (Mama, Papa, Oma, Opa, Tante, Onkel, Cousin): nicht als Karten; offen.
- Aufgaben von S. 117, die Angaben über Menschen sammeln würden: Anschrift, Arbeitsstelle, Berufe und Telefonnummern der
  Angehörigen („домашнего адреса“, „номеров телефонов“, S. 117). Die App sammelt nichts.
- Aufgaben, die Verhalten nach dem Geschlecht des Kindes meinen („адекватные полу формы поведения“, S. 117). Die Haushaltskarten
  verteilen keine Aufgabe nach Geschlecht; der Katalog verlangt das (geschlechtsneutral).
- Die Altersangabe 5 bis 7 für denselben Abschnittstitel: er steht auch auf S. 214 in der Gruppe „ФАНТАЗЕРЫ“ (Suche in der Textkopie:
  nur S. 117 und S. 214). Die App folgt Bauauftrag und Katalog (3 bis 5); siehe „Offen“.
- Summen, Preise, Waren und Zahlen im Familienbudget: S. 117 nennt keine Ziffer außer der Seitenzahl (Suche in der Textkopie).
- Fassungen in Ukrainisch und Russisch: uk und ru: nicht vorhanden, offen. Der Katalog nennt parallele Verwandtschaftswörter;
  Übersetzungen entstehen erst mit einer Prüfung durch Muttersprachler.

## Was nicht gebaut wurde

- Keine Eingabefelder, keine Namen, kein Feld für ein Kind, keine Notizen über Kinder, keine Einstufung. Keine Wertung eines Kindes:
  keine Punkte, kein Rekord, kein Rang, keine Serie, kein Prozent, kein „geschafft“, keine Sterne (docs/02 Z. 141–146). Der Zähler
  „Karte 2 von 6“ zeigt nur die Stelle in der Reihe.
- Keine Speicherung: kein Browser-Speicher, kein Cookie, kein Cache, kein Konto. Deshalb auch keine Karte „Meine Daten löschen“.
- Keine Verbindung nach draußen (docs/02 Z. 22–24). Kein Service Worker.
- Keine Bilder, Zeichnungen oder Emojis. Der Bildschirm besteht aus Schrift, Farbe je Thema und großen Knöpfen.
- Keine Hilfe-Insel (Krisennummer): eine erwachsene Person ist per Konstruktion dabei, wie bei den anderen Apps für 3 bis 5. Ob der Baustein für das
  Thema Familie trotzdem gewünscht ist, steht unter „Offen“.
- Kein `eltern.html`: die Hinweise für Erwachsene sind ein Bildschirm der App.
- Keine Sperre und kein Zähler für die Sitzungsgrenze. Die Grenze steht im Ablauf: Jede Reihe und jede Runde endet in der Pause, aus
  der Pause geht es nur zum Start, und die Fragen beginnen nur auf dem Startbildschirm. „Zum Start“ ist ein Ausgang: Wer ihn
  wählt oder die Seite neu lädt, kann neu beginnen, denn die App merkt sich nichts (eine Sperre, die ein Neuladen überlebt, bräuchte
  Speicher). Die Hinweise für Erwachsene bitten, eine Kartenreihe und eine Runde Fragen nicht ohne Pause aneinanderzuhängen.

## Technik

- `index.html`: Grundgerüst, Content-Security-Policy `default-src 'self'`, Stylesheets aus `packages/kinder-ui` und `druck.css`,
  das gemeinsame Favicon auf der Zeile des Stylesheets.
- `app.mjs`: sieben Bildschirme, die Rollenfragen, die Pause, die Druckauswahl und der Netzwerk-Wächter aus `packages/kinderschutz`.
  Jeder Knopf entsteht in der einen Funktion `knopf()` und trägt eine `data-kennung`, die auf jedem Bildschirm eindeutig ist; bleibt der
  Knopf nach dem Klick (Auswahl zum Druck), bekommt er den Fokus zurück, wechselt der Bildschirm, geht der Fokus auf die Überschrift.
  Dies ist die einzige Datei mit Zufall: `Math.random` steht hier einmal und wird als Funktion übergeben.
- `logik.mjs`: `ladeModule`, `startZeilen`, `erzeugeQuizFrage`, `erzeugeRunde`, `beantworteQuizFrage`, `druckeKarte`, Auswahl und
  Vorlesetexte. Ohne DOM, ohne eigene Zufallsquelle: der Zufall kommt als Parameter `zufall` (Zahlen von 0 bis unter 1).
- `daten/`: `rollen.json`, `haushalt.json`, `hoeflichkeit.json`, `budget.json` (je Thema die Karten und die Ideen der Pause) und `texte.json`
  (Texte der Oberfläche, Hinweise, Seitenmarke). Die Daten kommen per JSON-Import mit Typangabe, nicht per `fetch`.
  Dafür braucht der Browser Unterstützung für Import-Attribute; welche Browserversionen das sind, ist nicht geprüft.
- `druck.css`: Bildschirm und `@media print`: A4 hoch, Bildschirmteile ausgeblendet (`mfw-nur-bildschirm`), eine Karte je Blatt.
  Auf dem Bildschirm bricht die Überschrift bei 360 px auch innerhalb eines Wortes um.

Jede Karte hat die Felder `id`, `titel`, `modul`, `erklaerung` (ein Satz), `gespraech`, `quelle` (`seite`, `begriff`), `eigenentwurf` und `vermerk`;
die Rollenkarten dazu `frage`. `ladeModule` bricht ab, wenn ein Eintrag weder `quelle.seite` noch `eigenentwurf: true` hat.

## Drucken

Die Karten werden im Bildschirm „Karten drucken“ gewählt; gedruckt wird, was gewählt ist, ein Blatt A4 hoch je Karte mit Kopf
(„Meine Familie: Rollen“), Titel, einem Satz und dem Vermerk zum Text. Auf dem Blatt stehen keine Seitenzahl, keine Namenszeile, kein
Tagesfeld, keine Zeichen und keine Emojis. Im Druckdialog Kopf- und Fußzeilen ausschalten; sonst können Datum, Uhrzeit oder die Adresse
der Seite auf den Blättern erscheinen. Die App setzt selbst kein Datum und keine Adresse.

## Tests

63 Tests in zwei Dateien: `test/logik.test.mjs` prüft Daten, Seiten und Zitate, das Laden und Ablehnen von Einträgen, den Startbildschirm,
den Zufall als Parameter, die Rollenfragen (eine richtige Antwort, andere Rollen, Anti-Muster), die Antwort ohne Zähler, die Vorlesetexte,
die Quellenzeile mit Marke, die Auswahl und das Blatt. `test/regeln.test.mjs` prüft die Projektregeln: keine Eingabefelder, keine
Speicherung, keine externen Adressen, Zufall nur in `app.mjs`, Grundgerüst mit Favicon, keine Druckzeichen, keine Namenszeile, Blatt ohne
Seitenzahl, Seitenmarke, Eigenentwurf-Kennzeichnung, `druck.css`, Knopfhöhe, Fokus nach Klick und nach Bildschirmwechsel, Vorlesen,
Sitzungsgrenze und ihre Wege (von einer Kartenreihe führt nur „Fertig“ in die Pause, die Fragen beginnen nur auf dem Startbildschirm),
Hinweise für Erwachsene, Modellnamen-Freiheit, Wertungswörter, externe Fakten, Verweise auf die Anforderungen, Zitatlänge, Testzahl.

```bash
node --test apps/meine-familie-woerter-und-rollen-content-pack/test/*.test.mjs
```

## Offen

Siehe `GDD.md`, Abschnitt „## Offen“. Dazu:

- Alter: Bauauftrag und Katalog sagen 3 bis 5 Jahre. Der Abschnitt „Ребенок как член семьи“ steht auch in der Gruppe „ФАНТАЗЕРЫ“ (S. 214); ob
  „Enkel“ und „Neffe“ für Dreijährige taugen, zeigt erst ein Test mit Kindern.
- Fachprüfung aller Texte (Sprache, Alter, Familienvielfalt: Stief-, Halb- und Pflegegeschwister, Familien ohne Oma oder Opa, Verlust).
- Die Rollenfragen haben zwei Antworten (Abschnitt 3 des Bauauftrags); der Pseudocode in Abschnitt 5 nennt drei andere Rollen, also vier
  Antworten. `erzeugeQuizFrage` kann beides (`anzahlOptionen`), die App nimmt zwei.
- Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft. Auf dem Bildschirm steht die Marke
  „Seitenangaben nicht von einem Menschen geprüft.“ neben jeder Quellenzeile (Entscheidung Max 22а).
- Browser-Prüfung: gemessen bei 360 px und im Druck; Prüfung auf dem Gerät und Test mit Kindern der Zielgruppe stehen aus.
