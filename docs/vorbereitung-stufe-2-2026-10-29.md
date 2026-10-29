# Vorbereitung Stufe 2: Quellenprüfung für die Entscheidungen 52 und 55 bis 58

**Stand:** 29.10.2026

**Zweck:** Grundlage für die Entscheidungen 52 und 55 bis 58 aus `docs/fragen-fuer-max-2026-10-28.md`. Dieses Dokument ändert keine App. Es ist die einzige neue Datei; `apps/` bleibt unberührt.

## Methode

- Quelle: Textkopie `/tmp/quelle/all.txt`. Seite n ist der n-te Abschnitt zwischen den Formfeeds; das ergibt 320 Seiten, wie die PDF.
- Gegenprobe 1: Die PDF hat eine Textschicht, deren Zeichen um 848 verschoben kodiert sind. Nach Rückrechnung ist sie lesbar. Die Abwesenheitsbefunde unten stimmen mit beiden Textquellen überein.
- Gegenprobe 2: Bildansicht der PDF für S. 10, 113, 141, 142 und 160. Die gedruckten Seitenzahlen stimmen mit der Zählung überein.
- Zeichenfehler der Textkopie: Das Zeichen, das die Textkopie auf S. 79, 160 und 259 als „Ё“ liest, ist im Bild ein leeres Quadrat „□“ (Fußnote S. 160).
- „Belegt“ heißt: Die Quelle enthält die Aussage. „Nicht belegt“ heißt: Der Begriff wurde in beiden Textschichten nicht gefunden. Das ist kein Urteil über die Richtigkeit der Aussage.
- Zitate aus dem Buch: höchstens sechs Wörter. Sonst Umschreibung. „S.“ bezeichnet Buchseiten, „Z.“ die Zeile der jeweils genannten Repo-Datei.

## A. GEM-14 grammatik-zwerge (Frage 57)

**Frage:** Erklärt die Quelle die Sternchen vor Zielen auf S. 141 und 142? Gibt es eine Legende oder Fußnote auf diesen oder den Nachbarseiten? Steht das Ortswort „hinter“ auf S. 141 und 142?

**Befund:**
- **Sternchen erklärt (belegt):** Fußnote auf S. 113, am Bild bestätigt. Die Fußnote beginnt mit „Здесь и далее знаком *“ und erklärt sinngemäß, das Sternchen markiere Aufgaben für die älteren Kinder der Gruppe. Dieselbe Fußnote steht auf S. 53 (Gruppe „Малыши“) und S. 210 (Gruppe „Фантазеры“).
- **Legende auf S. 141–142 oder den Nachbarseiten (nicht belegt):** Auf S. 140, 141, 142 und 143 steht keine Fußnote. S. 143 hat zwei Sternchen, aber keine Erklärung. Die nächste Erklärung steht auf S. 113, in derselben Gruppe „Почемучки“ (S. 103–198).
- **Wo die Sternchen stehen:** S. 141 vor dem Ziel zum Wortursprung; S. 142 vor dem Ziel zum Bewusstsein der eigenen Aussprache. Die Ziele zu räumlichen Präpositionen auf S. 141–142 haben kein Sternchen (am Bild bestätigt).
- **„hinter“ (belegt als „за“):** Das Wort selbst steht im russischen Text nicht. Die räumliche Entsprechung „за“ steht in der Liste „пространственные предлоги“ auf S. 141 (Ende) und S. 142 („за шкафом“, „из-за дерева“). Außerdem S. 142: „спрятаться за пианино“.
- **Liste der räumlichen Präpositionen (S. 141–142):** за, под, над, в, из(-за), около. Nicht in dieser Liste stehen „на“ (auf) und „между“ (zwischen); die App-Ortswörter „auf“ und „zwischen“ haben deshalb keine Stütze in dieser Liste.
- **Nebenbefund:** Die App sperrt „über“ (`apps/grammatik-zwerge/logik.mjs` Z. 34). Die Quelle nennt dafür „над“ in derselben Liste.
- **Zusatz (App-Altersangabe):** S. 141–142 gehören zur Gruppe „Почемучки“ (3 bis 5 Jahre, S. 6). Die App nennt 4 bis 6 Jahre (`apps/grammatik-zwerge/daten/grammatik.json`, README Z. 3).

**Bedeutung:** Der Befund stützt „hinter“ als Ortswort der Quelle und damit den Katalogtext (Option b), nicht die Katalogkorrektur nach Option a) für dieses Wort; die Sperre der App folgt aus der Szenenlogik (GDD Abschnitt 2), nicht aus der Quelle, und der Bauauftrag GEM-14 (Z. 109) muss korrigiert werden, weil die Bedeutung der Sternchen auf S. 113 steht.

**Unsicherheit:**
- Die Reichweite der Fußnote („Здесь и далее“, sinngemäß „hier und weiter“) ist eine Auslegung; ob sie jede Aufgabe auf S. 141–142 erfasst, prüft der Fachprüfer.
- Die Deutung „за“ = „hinter“ folgt aus den Beispielen; eine Übersetzungsprüfung steht aus.
- Die Bildansicht umfasst S. 113, 141, 142 und 160. Die Fußnoten auf S. 53, 79, 210 und 259 wurden nur über die Textschichten gelesen.

## B. GEM-16 design-entdecker (Fragen 54 und 56)

**Frage:** Nennt die Quelle S. 176–178 Bauformen (Fachwerk, Backstein, Bahnhof, Kita) und Versuchsmaterial (Hitze, Wasser, Messer, Kerze)?

**Befund (S. 176–178; Textkopie und PDF-Textschicht stimmen überein):**
- **Kita: belegt.** S. 176 nennt in der Aufzählung der Gebäude „детский сад“ (Kindergarten), dazu Wohnhaus, Theater und Laden.
- **Bahnhof: belegt.** S. 178 nennt in der Liste der Baudenkmäler „здание железнодорожного вокзала“ (zweimal).
- **Fachwerk: nicht belegt.** Auf S. 176–178 kein Wort dafür; im ganzen Buch nicht gefunden.
- **Backstein: nicht belegt.** „кирпичик“ kommt nur als geometrische Form (S. 93) und als Turngerät (S. 60) vor.
- **Hitze: nicht belegt als Versuchsmaterial.** S. 178 spricht von warmen und kalten Farben. S. 213 nennt unter „Тепло. Огонь“ Wärmequellen (Sonne, Strom, Feuer) als Wissensthema, ohne Versuch.
- **Wasser: nicht belegt auf S. 176–178.** Versuche mit Wasser stehen anderswo: S. 63 („политый водой“, Ton und Sand, Gruppe „Малыши“) und S. 213 (schwimmende und sinkende Gegenstände, Gruppe „Фантазеры“).
- **Messer: nicht belegt als Versuchsmaterial.** Anderswo nur als Besteck (S. 187) und als Gartengerät (S. 294).
- **Kerze: nicht belegt auf S. 176–178.** Anderswo nur als Zeichenmittel (S. 309, „свечой“, in einer Liste mit Stiften und Tusche).
- **Bildmaterial (Frage 56):** S. 177 nennt empfohlene Kunstwerke mit Künstlernamen (Buchgrafik, Kleinplastik, Kunsthandwerk). Fotos werden nicht genannt. Nach `pdfimages` sind auf S. 176–178 keine Bilder eingebettet.
- **Katalog:** Der Katalogeintrag „Design-Entdecker“ (`docs/praleska-katalog.json`, Feld adaptionDE) nennt Fachwerkhaus und Backsteinkirche als deutsche Ersetzung belarussischer Baudenkmäler. Das ist eine Entscheidung der Katalogfassung, nicht der Quelle.
- **Zusatz:** Der Bauauftrag GEM-16 nennt Bahnhof in Lernziel 3 (Z. 31) zugleich als Bauform und als nicht abgefragt. Die App ordnet Bahnhof als Ortskenntnis ein (`apps/design-entdecker/daten/design.json`, Eintrag g-bahnhof). S. 176–178 gehören zur Gruppe „Почемучки“ (3 bis 5 Jahre); die App nennt 3 bis 5 mit Erwachsenem und 5 bis 7 allein.

**Bedeutung:**
- Frage 54 (Engine): Der Befund betrifft die Engine nicht; er ändert weder Option a) noch Option b).
- Frage 56 (Bilder): Der Befund stützt Option a) (nur Beschreibungen, keine Bilder), weil die Quelle für Bilder nur Künstlernamen nennt; für Option b) (eigene Zeichnungen mit Freigabe) gibt es keine Quellenstütze.

**Unsicherheit:**
- Die Abwesenheitsbefunde stimmen in Textkopie und PDF-Textschicht überein. S. 176–178 wurden nicht am Bild geprüft.
- Die Bildrechte der genannten Kunstwerke sind aus dem Buch nicht zu klären.

## C. GEM-19 geschichten-wender (Frage 58)

**Frage:** Erscheint „Uther“ in der Textkopie (Literaturangabe)? Was steht auf S. 253 und 254? Erscheinen „Stimmungs-Werkstatt“ oder „fröhliches Ende“ in der Quelle?

**Befund:**
- **„Uther“: nicht belegt.** Keine Treffer in der Textkopie und in der PDF-Textschicht, auch nicht in kyrillischer Umschrift. Das Buch enthält keine Literaturliste; es gibt nur Empfehlungslisten (z. B. S. 254). Die Zahl „2004“ steht nur im Impressum (S. 320).
- **Fundstellen im Repo:** `apps/geschichten-wender/daten/geschichten.json` (fünf Felder `herkunft`, Z. 38, 110, 147, 184, 235), README Z. 193, GDD Z. 203, `test/logik.test.mjs` Z. 302 und `docs/10` Z. 53 (Korrekturnotiz). Eine Quelle außerhalb des Buchs liegt im Repo nicht vor.
- **S. 253 (Abschnitt „Творчество“, Gruppe „Фантазеры“):** Kreatives Erzählen: Texte weiterdenken, eigene Märchen und Reime erfinden, Textteile mit gegensätzlicher Stimmung schreiben (Beispiele: „грустное начало“ mit „веселое окончание“ und umgekehrt), Anregungen durch Figuren und Bilder.
- **S. 254 (Beginn der Gruppe „Фантазеры“):** Ziele zum kreativen Gestalten von Natur- und Märchenfiguren, zum Theaterspiel, zu Bühne und Kostümen und zu eigenen Büchern aus Kinderreimen und Märchen. Danach folgen Listen empfohlener Volkslieder, Märchen und Reime aus Belarus, Russland und der Welt.
- **„Stimmungs-Werkstatt“: nicht belegt.** Weder der Name noch eine russische Entsprechung („мастерская“) kommt vor.
- **„fröhliches Ende“: belegt als Beispiel.** S. 253 nennt in der Übung „веселое окончание“ neben „грустное начало“ und das umgekehrte Paar.
- **Zusatz zu Frage 55:** S. 253–254 gehören zu „Фантазеры“ (5 bis 6–7 Jahre, S. 6). Das stützt die App-Angabe 5 bis 7 mit Erwachsenem (GDD Z. 8). Für 8 bis 12 Jahre gibt es im Buch keine Stelle; der Katalog nennt dafür „8-12 eigenständig“ (`docs/10` Z. 327).

**Bedeutung:** Der Befund belegt das Thema des Stimmungswechsels, aber nicht den Namen; damit stützt er für das „fröhliche Ende“ Option b); für den Namen „Stimmungs-Werkstatt“ liefert die Quelle keine Stütze für Option b), weil sie den Namen nicht nennt.

**Unsicherheit:**
- Die Literaturprüfung beruht auf Textkopie und PDF-Textschicht. Die Bildansicht wurde für S. 253–254 nicht durchgeführt.
- Das Verzeichnis „Uther 2004“ selbst wurde nicht geprüft; es liegt nicht im Repo.

## D. CON-1 stark-und-gesund (Frage 52)

**Frage:** Enthalten die Seiten 13 bis 20 Aussagen zu Schlaf, Bildschirmpausen, Getränken und Hygiene?

**Befund S. 13–20 (Textkopie und PDF-Textschicht stimmen überein):**
- **Schlaf: nicht belegt.** Die Suchbegriffe „сон“, „спать“, „спит“ und Formen ergeben keine Treffer. S. 14 nennt einen „режим дня“ (Tagesablauf) ohne Schlafangabe.
- **Bildschirmpausen: nicht belegt.** „экран“, „компьютер“, „телевизор“ und „планшет“ ergeben keine Treffer.
- **Getränke: nicht belegt.** „вода“ kommt nur als Naturelement vor (S. 13: „Солнце, воздух, земля, вода“), ohne Trinkempfehlung.
- **Hygiene: nicht belegt.** „гигиен“, „руки“, „мыть“ und „зубы“ ergeben keine Treffer.
- **Allgemein belegt auf S. 13–14:** ausgewogene Ernährung und jodiertes Salz (S. 13), Bewegung (S. 13–14), Abhärtung (S. 14), Naturkontakt und frische Luft (S. 13), Tagesablauf (S. 14).

**Befund außerhalb S. 13–20 (zur Kenntnis; die Frage bezieht sich auf 13–20):**
- **Schlaf:** S. 224 (Gruppe „Фантазеры“, 5 bis 7 Jahre) zählt „крепкий сон“ zu den Gesundheitszeichen. S. 225 nennt als Ziel, rechtzeitig schlafen zu gehen.
- **Bildschirm:** S. 225 rät, nicht zu viel fernzusehen. S. 123 (Gruppe „Почемучки“) verlangt, die Computerzeit streng zu regeln. S. 220 (Gruppe „Фантазеры“, mit Sternchen für die älteren Kinder) nennt „режим работы на компьютере“.
- **Getränke:** S. 224 und S. 126 nennen „пить только кипяченую воду“ als Sicherheitsregel. S. 33 (Gruppe „Малютки“, 0 bis 1 Jahr) nennt wenige Schlucke Wasser in jeder Wachphase.
- **Hygiene:** S. 97 (Gruppe „Малыши“) nennt Händewaschen vor dem Essen und nach der Toilette sowie Zähneputzen. S. 190 (Gruppe „Почемучки“) nennt Grundlagen der Hygienekultur. S. 224 nennt als Gewohnheit, nach jeder Verschmutzung die Hände zu waschen; S. 225 nennt Zähneputzen ohne Erinnerung.
- **Zahlen aus CON-1** („60 Minuten Bewegung“, „9 bis 11 Stunden Schlaf“, „Pause alle 20 Minuten“, „zwei Minuten Zähneputzen“): im Buch nicht belegt. Die Suche nach Stunden- und Minutenangaben ergab dazu keine Treffer.

**Katalog:** Der Katalogeintrag „Content-Pack: Stark und gesund“ (`docs/praleska-katalog.json`) nennt als Quelle S. 13–14 und als Themen Schlaf und Abhärtung. S. 13–14 belegen den Schlaf nicht.

**App-Stellen mit Gesundheitsaussagen (nur Beschreibung, keine Zitate):**
- `apps/stark-und-gesund/daten/fragen.json` (Zielgruppe 8–12): 16 Fragen (g01 bis g16). Themen: Bewegung (g01, g11, g16), Schlaf (g02, g12), Ernährung (g03, g05, g13, g14), Trinken (g04, g10), Tageslicht (g06), Bildschirmpausen (g07), Hygiene (g08, g15), Abhärtung (g09). Konkrete Zahlen oder Regeln stehen in g01 (Bewegungsdauer am Tag), g02 (Schlafdauer), g07 (Pausenintervall), g08 (Dauer des Händewaschens), g15 (Dauer des Zähneputzens), g06 (Vitamin D, Kurzsichtigkeit) und g09 (Ursache von Erkältungen).
- `README.md`: Z. 3–7 (Themenliste mit Zahlen), Z. 18–21 (Grundlage BZgA und DGE, mit Zahlen), Z. 22–24 (Bildschirmpausen als Brücke zu einer anderen App), Z. 36–42 (Lernziele 1 bis 4).
- `GDD.md`: §1 Z. 4–5 (Grundlage BZgA und DGE), §2 Z. 11–13 (Alter 8–12), §4 Z. 22–27 (Lernziele mit Zahlen), §5 Z. 32–33 (Themen), §6 Z. 45–49 (Risiken, Hinweis auf den Kinderarzt), §7 Z. 52 (UN-KRK Art. 24).
- Weitere Stellen außerhalb des Prüfauftrags: `eltern.html` Z. 15 (Themen; nennt BIÖG, früher BZgA, und DGE als Grundlage) und Z. 36 (Kinderarzt bei ernsten Sorgen); `manifest.webmanifest` Z. 4 (Beschreibung mit Schlaf); `package.json` Z. 5; `app.mjs` Z. 20 (Einleitung mit Schlaf); `test/fragen.test.mjs` Z. 24–25 (Test verlangt Schlaf mit 9 bis 11 Stunden und Bewegung mit etwa 60 Minuten).
- Tor 6 (Brief): Im Material steht kein Vermerk „(Eigenentwurf, fachlich nicht geprüft)“. BZgA und DGE sind als Grundlage genannt, ohne Nachweis im Repo.

**Bedeutung:** Der Befund stützt Option a) (fachliche Prüfung vor dem Ausbau) für die Zahlen und Einzelaussagen, für die es im Buch keine Stelle gibt; weil die Themen selbst auf anderen Seiten belegt sind, schließt er b) (streichen) und c) (Ausbau ohne sie) nicht aus.

**Unsicherheit:**
- Die Befunde zu S. 13–20 stützen sich auf Textkopie und PDF-Textschicht; eine Bildansicht fand nicht statt.
- Die Befunde außerhalb S. 13–20 gelten für Kinder bis etwa 6 bis 7 Jahre; die App richtet sich an 8- bis 12-Jährige. Ob sich die Aussagen übertragen lassen, ist fachlich zu prüfen.
- BZgA und DGE sind im Repo nicht belegt; ihre Empfehlungen wurden nicht geprüft.

## E. CON-7 herkunftssprachen-bruecke (Fragen 53 und 55)

**Frage:** Welche Altersangaben nennen App und Katalog? Verbindet die Quelle Herkunftssprachen oder Zweisprachigkeit mit einer Altersgruppe?

**Altersangaben:**
- App: README Z. 3 (8 bis 12 Jahre, auch Eltern), GDD Z. 5 (Zielgruppe 8 bis 12, auch Eltern und Herkunftssprache), `daten/fragen.json` (Zielgruppe „8-12“).
- Katalog: Eintrag „Herkunftssprachen-Bruecke uk/ru“ in `docs/praleska-katalog.json` und `docs/10` Z. 454: „Eltern + Kinder 4-7“, Quelle „S. 143–144“.

**Befund (Quelle):**
- **Herkunftssprachen (Familiensprachen zugewanderter Familien): nicht belegt.** Die Suche nach Migration, Zuwanderung, fremdsprachigen Kindern und Familien ergab keine Treffer. Die Achtung vor nationalen Kulturen anderer Völker (S. 120, 217) betrifft Kultur, nicht Sprache.
- **Zweisprachigkeit (двуязычие, билингв): nicht belegt.**
- **„родной язык“ (Muttersprache): belegt in allen Altersgruppen, aber nur als allgemeine Sprachentwicklung.** Fundstellen: S. 45 und 46 (2 bis 3 Jahre), S. 142 und 193 (3 bis 5 Jahre), S. 205 und 306 (5 bis 7 Jahre).
- **Sprachbezüge mit Altersgruppen:**
  - 2 bis 3 Jahre (Gruppe „Малыши“, S. 44): In einigen Fällen erwerben Kinder mehrere Sprachen zugleich (S. 45, Wortlaut „нескольких языков одновременно“). Belarussische Rede verstehen und einfache Stücke wiedergeben (S. 66).
  - 3 bis 5 Jahre (Gruppe „Почемучки“): Unterscheidung „белорусской и русской речи“ (S. 140, 194). Russische und belarussische Wörter vergleichen und Verwechslungen vorbeugen (S. 144). Belarussisch-Lernziele (S. 143–144). Stundentafel S. 9: eine Sprachstunde für Belarussisch (Fußnote 2, Wortlaut „по обучению белорусскому языку“).
  - 5 bis 7 Jahre (Gruppe „Фантазеры“, S. 199–310): Achtung vor dem Reichtum der russischen und belarussischen Sprache (S. 237). Belarussisch für einfache Mitteilungen (S. 306). Stundentafel S. 10, am Bild bestätigt: von zwei Sprachstunden pro Woche ist eine Belarussisch (Fußnote 2 an der Zeile „Развитие общения и речи“).
  - 8 bis 12 Jahre: nicht belegt. Die Quelle endet bei 6 bis 7 Jahren (S. 6).
- **Ukrainisch (Frage 53):** erscheint nur als Herkunft von Liedern, Tänzen und Märchen (25 Stellen auf 19 Seiten, z. B. S. 76 und 254), nicht als Lernsprache der Kinder.

**Bedeutung:**
- Frage 53 (Sprachen): Der Befund stützt Russisch und Belarussisch als Sprachen der Quelle, nicht Ukrainisch als Lernsprache. Option a) (zunächst nur Deutsch) bleibt damit möglich; Option b) (uk und ru jetzt) hat für Ukrainisch keine Quellenstütze. Das gilt sinngemäß für alle Einheiten mit uk und ru.
- Frage 55 (Altersgruppe): Die Quelle trägt die App-Angabe 8 bis 12 nicht. Option b) (App anpassen) hat eine Quellenstütze; Option a) (Katalog an die App angleichen, wenn die App stimmt) hat keine, weil die App-Altersgruppe nicht gestützt ist.

**Unsicherheit:**
- Die Fußnote „2“ auf S. 9 ist nur in der Textkopie gelesen; auf S. 10 ist sie am Bild bestätigt.
- Der Sprachvergleich auf S. 144 ist russisch–belarussisch. Die Übertragung auf Deutsch–Russisch–Ukrainisch ist ein Eigenentwurf des Katalogs („Umkehrung der Ausgangslage“).
- Der belarussische Text auf S. 143–144 wurde nur in den Textschichten gelesen, nicht am Bild.

## Gesamtbefund

1. Die Quelle erklärt das Sternchen auf S. 113 als Zeichen für Aufgaben der älteren Kinder in der Gruppe „Почемучки“ (3 bis 5 Jahre) und stützt „hinter“ als Ortswort („за“); die Sperre von „hinter“ in der App ist damit eine eigene Entscheidung, und der Bauauftrag GEM-14 muss bei den Sternchen korrigiert werden.
2. Für GEM-16 nennt die Quelle Kita und Bahnhof (S. 176 und 178), aber nicht Fachwerk und Backstein; Hitze, Wasser, Messer und Kerze fehlen auf S. 176–178, während Wasser und Wärme auf anderen Seiten (S. 63, 213) als Wissensthemen stehen.
3. Für GEM-19 gibt es in der Quelle kein „Uther“ und keine „Stimmungs-Werkstatt“; das „fröhliche Ende“ steht als Übung auf S. 253 in beiden Richtungen, und S. 253–254 gehören zu den 5- bis 7-Jährigen.
4. Für CON-1 sind Schlaf, Bildschirmpausen, Getränke und Hygiene auf S. 13–20 nicht belegt, auf anderen Seiten aber schon; die konkreten Zahlen der App stehen nicht im Buch, und der Katalogeintrag nennt für diese Themen S. 13–14, wo sie fehlen.
5. Für CON-7 verbindet die Quelle Herkunftssprachen und Zweisprachigkeit mit keiner Altersgruppe; sie nennt Belarussisch- und Russisch-Lernziele für 1 bis 7 Jahre, nicht für 8 bis 12, so dass die App-Altersangabe nicht gestützt ist.

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
