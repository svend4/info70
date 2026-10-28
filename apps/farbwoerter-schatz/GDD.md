# Farbwörter-Schatz: Kurz-GDD

Gebaut nach dem Bauauftrag `docs/bauauftraege/CON-9-farbwoerter-schatz.md` (Stufe 1 der neuen Welle, `docs/plan-neue-welle.md`).
Der Entwurf `docs/neue-welle/GDD-CON-9.md` ist an das Gebaute angepasst und gekürzt; bei Widerspruch gilt der Bauauftrag.

## 1. Warum
Die Praleska nennt auf S. 178 im Abschnitt „Рисование“ (Gruppe „ПОЧЕМУЧКИ“) als Aufgabe, bildhafte Farbnamen
kennenzulernen („вишневый“, „салатовый“, „малиновый“, „лимонный“, „абрикосовый“, „цвет морской волны“, S. 178) und warme
und kalte, kontrastierende, im Ton nahe und neutrale Farben zu unterscheiden (S. 178). Die App überträgt das in Wörter
und eine Karte: eine Farbe hat nicht nur den Namen „rot“, sondern auch einen Namen wie „kirschrot“. Die Bedürfnislage
(ein Erwachsener schaut mit dem Kind Bilder an und malt, und braucht eine kurze Grundlage für das Gespräch über Farben)
ist Eigenentwurf und nicht gemessen. Mischen lehrt die App nicht; das macht `farb-labor`.

## 2. Wer und Kernerlebnis
**Zielgruppe: beide (Ko-Nutzung): Kinder von 3 bis 5 Jahren nur gemeinsam mit einem Erwachsenen, Kinder von 5 bis 7 Jahren.**
Belege: Bauauftrag Abschnitt 2 und Katalog (docs/10, Z. 456); die Gruppe „ПОЧЕМУЧКИ“ ist nach der Quelle „четвертый—пятый годы
жизни“ (S. 103). Für 5 bis 7 Jahre nennt der Bauauftrag keine Seite der Quelle (Eigenentwurf). Kinder sind die Nutzer, also ist die
App eine Kinder-App (Entscheidung Max 34а): Vorlesen gilt (28а), und kein Kind wird bewertet.
Kernerlebnis: Ein Erwachsener und ein Kind wählen eine Farbgruppe, sehen die Karte mit der Farbfläche, dem Namen (zum Beispiel
„kirschrot“) und dem Hinweis „warm“, hören das Wort und drucken auf Wunsch eine Karte auf einem Blatt A4.

## 3. Entscheidungen
- **Motor.** Eigene Karten-App auf kinder-ui, nicht quiz-kern: der Bauauftrag nimmt den Motor nicht an (Abschnitt 3 und 6). Gründe aus dem
  Entwurf: Gruppenwahl, Liste, Farbfläche und Druck liegen außerhalb des Motors, und warm oder kalt ist eine Abmachung, kein „richtig“.
  Die Wahl des Motors bleibt eine Frage an Max (`docs/plan-neue-welle.md`, Abschnitt 5).
- **Bildschirme.** Start (Hinweis für Erwachsene, Quellenhinweis), Gruppen, Liste, Farbkarte, Bildschirm aus, Karten zum Drucken.
  Jeder Schritt ist eine Auswahl aus einer Liste, kein Freitext. Die Reihenfolge der Wörter ist die der Datei; es gibt keinen Zufall.
- **Daten.** `daten/farbwoerter.json`: 14 Farbwörter (warm 4, kalt 4, kontrast 3, neutral 3), vier Gruppen, Texte für Erwachsene, Quellenhinweis.
  Pflichtfelder id, de, gruppe; `uk` ist überall null; `ru` ist der Begriff der Quelle, wo ein Wort aus ihr gebaut ist, sonst null.
- **Hinweis auf der Karte.** warm oder kalt aus der Gruppe, bei kontrast und neutral der Gruppenname (Bauauftrag Abschnitt 5).
- **Grenzfall Grün.** meergrün und tannengrün stehen bei kalt und tragen den Satz, dass Grün zwischen warm und kalt liegt und wer es anders
  einordnet, nicht unrecht hat (wie `farb-labor`, wo Grün „strittig“ heißt).
- **Kontrast als Paar.** Ein Eintrag der Gruppe kontrast hat zwei Namen und zwei Farben; die Fläche zeigt beide nebeneinander.
- **Runde.** Höchstens 6 verschiedene Farbwörter, dann „Bildschirm aus“ mit einer Anregung für das Zimmer (Eigenentwurf, die Zahl ist offen).
  Das ist das feste Sitzungslimit für 3 bis 5 Jahre (docs/10, Rechtsrahmen Punkt 2). „Neue Runde“ ist ein Knopf für Erwachsene.
- **Druck.** Je vorgemerkter Karte ein Blatt A4 hoch: Farbfläche, Name, Hinweis, Satz und die Zeile „Farbwort, Farbfläche und Hinweis:
  Eigenentwurf.“. Keine Seitenzahl (A18-Standard), keine Pflichtmarkierung, keine Namenszeile, keine Zeichen aus der Sperrliste (docs/02 Z. 79–82).
- **Keine Speicherung** und keine Karte „Meine Daten löschen“. **Keine Verbindung nach draußen** (docs/02 Z. 22–24).
- **Keine Bewertung** eines Kindes (docs/02 Z. 141–146): keine Fragen mit Antwort. Gezählt werden nur die angesehenen Farbwörter einer Runde
  und die vorgemerkten Karten.

## 4. Lernziele (prüfbar)
Aus dem Bauauftrag, Abschnitt 2 (Eigenentwurf):
1. Der Erwachsene wählt eine der vier Farbgruppen und sieht nur deren Farbwörter. Prüfung: `gruppeFuer` liefert nur Einträge der Gruppe;
   jede der vier Gruppen hat Einträge; eine leere Gruppe zeigt keinen leeren Bildschirm, sondern einen Satz.
2. Kind und Erwachsener betrachten eine Farbkarte mit Name, Farbfläche und Hinweis warm oder kalt; der Name lässt sich vorlesen.
   Prüfung: `farbkarte` liefert alle drei Angaben; `vorlesetext` nennt Name, Hinweis und Satz. Ob das Kind sich das Wort merkt,
   prüft die App nicht; das zeigt nur ein Kindertest (Abschnitt 9).
3. Der Erwachsene druckt eine Farbwort-Karte je Blatt A4 hoch, ohne Zeichen aus der Sperrliste und ohne Namenszeile. Prüfung: Zahl der
   Blätter gleich Zahl der vorgemerkten Karten, Drucktext ohne Zeichen und ohne Seitenzahl (Tests und Browser-Messung der Druckansicht).

## 5. Inhalt
Warm: kirschrot, himbeerrot, aprikosenfarben, zitronengelb. Kalt: eisblau, nachtblau, meergrün, tannengrün. Kontrast: zitronengelb und nachtblau,
aprikosenfarben und eisblau, schneeweiß und rabenschwarz. Neutral: schneeweiß, aschgrau, rabenschwarz. Die sechs deutschen Namen des
Bauauftrags sind kirschrot, zitronengelb, aprikosenfarben, meergrün, himbeerrot und tannengrün (Eigenentwurf nach docs/10, Z. 456).
Alles darüber hinaus (eisblau, nachtblau, die neutralen Wörter, die Paare) ist Eigenentwurf ohne Quelle und fachlich nicht geprüft.
Die Paare unterscheiden sich in der Helligkeit oder auf der Blau-Gelb-Achse, nicht nur in Rot gegen Grün (ein Test prüft das; Eigenentwurf).
Jedes Wort hat einen Satz zum Bild hinter dem Namen („Kirschrot ist so rot wie eine reife Kirsche.“). Die Farbwerte sind eine Richtung,
keine Messung. Der Anschluss an die Wörter der Quelle: kirschrot und „вишневый“, himbeerrot und „малиновый“, aprikosenfarben und
„абрикосовый“, zitronengelb und „лимонный“, meergrün und „цвет морской волны“ (angenähert); „салатовый“ hat keinen Eintrag.

## 6. Politik und Tore
Die Tore aus `docs/plan-neue-welle.md`, Abschnitt 3, und was dafür gilt:
- **Kein Kind wird bewertet:** keine Punkte, kein Rekord, keine Rangliste, keine Serie, kein Prozent, kein „geschafft“, keine Sterne
  (docs/02 Z. 141–146). Prüfung: `node tools/leistungs-woerter.mjs farbwoerter-schatz` ohne Treffer; `node tools/bewertung-stand.mjs`: „Stand stimmt.“
- **Speicherregel:** die App speichert nichts und hat darum keine Karte zum Löschen (`packages/kinderschutz/test/speicher-regel.test.mjs`).
- **Berührziele, Überlauf, Fokus:** Knöpfe mindestens 3rem, kein Überlauf bei 360 px, Fokus nach Klick auf demselben Knopf und nach einem
  Bildschirmwechsel auf der Überschrift (`node tools/browser-tor.mjs farbwoerter-schatz`).
- **Quiz-Durchlauf:** entfällt; das Werkzeug lehnt eine App ohne quiz-kern ab (Exit 64).
- **Druck:** Fuß und Bildschirmteile verborgen, keine Namenszeile, keine Kästchen, Haken und Sterne (docs/02 Z. 79–82).
- **Fakten:** die App macht keine Aussage über Recht, Geld oder Gesundheit. Warm und kalt als Abmachung und die Einordnung der Farben sind
  Eigenentwurf, fachlich nicht geprüft.
- **Vorlesen:** über `vorlesen()` aus kinder-ui, nur mit einer deutschen Stimme im Gerät; ohne sie steht ein Hinweis statt des Knopfs.
- **Seiten der Quelle:** nur mit der Marke „maschinell geprüft, noch nicht von einem Menschen geprüft“ beim Quellenhinweis; das Blatt trägt keine Seite.
- **Keine Modellnamen, keine fremden Adressen, keine Zitate über sechs Wörter.**
Dazu: Content-Security-Policy `default-src 'self'`, Netzwerk-Wächter, keine Eingabefelder, kein Service Worker, kein Link außer dem Impressum.
Risiken des Themas: Farbnamen verweisen nicht auf Menschen; warm und kalt sind eine Abmachung; Grenzfälle werden genannt; die Farbe ist
nie der einzige Träger (Name als Text, Fläche mit `role="img"` und Beschriftung).

## 7. Aufwand
S, wie im Katalog; die Arbeit liegt in den Wörtern, ihren Gruppen, den Farbwerten und der Prüfung durch Fachleute, weniger im Code. Wiederverwendet:
kinder-ui (`el`, `vorlesen`, `lokaleStimme`, `kinder.css`) und kinderschutz (`installiereNetzwerkWaechter`).

## 8. Tests
68 Tests in zwei Dateien. `test/logik.test.mjs` prüft die Daten gegen die geprüften Begriffe und die Seite, die Gruppen, `farbkarte`,
`vorlesetext`, `druckBlaetter`, die Auswahl und die Runde. `test/regeln.test.mjs` prüft die Projektregeln. Drei Prüfungen am Ende lesen den
Quelltext von `app.mjs`: dass die App die Rundengrenze (das feste Sitzungslimit) und die Auswahl zum Drucken wirklich benutzt und dass
Farbkarte, Start und Liste ihre Hinweise zeigen; eine vierte prüft, dass in allen Dateien der App kein kyrillischer Text steht außer den
erlaubten Begriffen und Titeln.

Browser (360 px, Chromium ohne Oberfläche): `node tools/browser-tor.mjs farbwoerter-schatz` endet mit Exit 0 und ohne Verletzung
(75 Klicks, 718 Berührziele und keines unter 48 px, kein Überlauf, Fokus nach jedem Klick, Speicher leer, nur `localhost`, keine
Konsolenfehler). Die Druckansicht bei 14 vorgemerkten Karten zeigt 14 Blätter ohne Zeichen, ohne Seitenzahl und ohne Marke. Eine eigene
Erkundung aller Klickwege und eigene Abläufe (Rundengrenze, Druck als PDF mit 3 und mit 14 Seiten A4 hoch, Vorlesen mit lokaler Stimme,
mit Netzstimme und ohne Sprachausgabe, Datenfehler) fanden keinen Verstoß. Eine eigene Messung auf Wortumbruch (alle 14 Farbwörter auf Gruppen,
Liste, Farbkarte und Druckvorschau) findet bei 360, 375 und 412 px kein Wort, das mitten im Wort umbricht; der Name unter einer Farbfläche
steht dafür in 0.85rem.

## 9. Kindertest-Hypothesen
Was an 5 bis 8 Kindern von 3 bis 5 und von 5 bis 7 Jahren zusammen mit einem Erwachsenen zu prüfen ist (ohne Namen der Kinder, Protokoll
nach docs/05, Methode 5); Ergebnisse liegen nicht vor, es sind Hypothesen (Eigenentwurf):
1. Verbinden die Kinder den bildhaften Namen mit der Farbfläche (sagen sie „wie eine Kirsche“)? Welche Wörter bleiben fremd?
2. Ist „warm“ und „kalt“ für Farben verständlich, oder klingt es nach „heiß“? Was tun Kinder und Erwachsene bei Grün?
3. Wollen die Kinder das Wort noch einmal hören? Stört die Stimme?
4. Was geschieht zu Hause mit der gedruckten Karte: ausmalen, die Farbe im Zimmer suchen, aufhängen? Verliert sie auf einem Drucker ohne Farbe den Sinn?
5. Reichen 6 Farbwörter je Runde? Liest der Erwachsene den Hinweis „gemeinsam“? Geht die Familie vom Bildschirm weg zur Suche?

## Offen
- Motor: eigene Karten-App (gebaut) oder Pack für quiz-kern; Frage 1 in `docs/plan-neue-welle.md`, Abschnitt 5. Der Katalog, `docs/bauauftraege/index.json`
  und mehrere Dokumente führen den alten Stand („ohne quiz-kern, Regelkonflikt“) und sind nach der Entscheidung anzupassen.
- Kontrast und neutral: der Bauauftrag nennt keine Wörter. Die Einträge sind Eigenentwurf; ob Kontrast ein Paar ist und ob die neutralen
  Wörter, eisblau und nachtblau bleiben, entscheidet Max. Eine Fachprüfung (Kunstpädagogik) der Zuordnung zu warm und kalt und der Farbwerte steht aus.
- uk und ru: nicht vorhanden, offen. Die Seite 178 gibt die Farbwörter nur auf Russisch (in der Textkopie geprüft: keine lateinischen
  Buchstaben außer dem Aufzählungszeichen der Textkopie, keine ukrainischen Sonderbuchstaben). Offen sind: wer die Übersetzung prüft,
  was aus „салатовый“ und tannengrün wird (hell gegen dunkel), ob ein Sprachwechsel kommt, und ob uk und ru nur mit einer Stimme im
  Gerät vorgelesen werden. Das Versprechen des Katalogs „dreisprachig, dieselbe Farbe in drei Sprachen hören“ ist nicht eingelöst.
- Sitzungslimit und Alter: die Zahl 6 und der Weg „Neue Runde“ sind Eigenentwurf. Für 5 bis 7 Jahre nennt docs/10 (Rechtsrahmen Punkt 2) kurze
  selbstständige Sitzungen; hier gilt dieselbe Runde und derselbe Hinweis für Erwachsene.
- Farbwerte: wer sie wählt und auf welchem Gerät sie gelten. Druck: Hintergrundgrafiken; ein Ausmalblatt sieht der Bauauftrag nicht vor.
- Hilfe-Insel: bewusst ohne (Fachlernen Farbe, Erwachsener dabei); der Eintrag unter den Auslassungen von `hilfe-insel-abdeckung.test.mjs` gehört dem Integrator.
- Keine `eltern.html`: der Entwurf nannte sie, der Bauauftrag nicht; die Hinweise für Erwachsene stehen auf dem Startbildschirm.
- Seitenangaben: die Projektregel verlangt für Seitenangaben die Markierung „проверено человеком“ (Entscheidung A18, offen). Die Quelle liegt nur auf
  dem Branch `main`; die Prüfung der Seiten 178 und 103 lief gegen die Textkopie außerhalb des Repos (F3).
- Browser-Prüfung auf dem Gerät und der Kindertest stehen aus.
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

**Vorlesen:** vorgesehen und gebaut (Kinder-App, Entscheidung Max 28а): `vorlesen()` aus kinder-ui, nur mit einer deutschen Stimme im Gerät.
