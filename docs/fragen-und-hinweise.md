# Fragen, Hinweise und Nacharbeiten

Stand: 18.10.2026, nach Welle 91. Dieses Dokument ergänzt `docs/offene-punkte-kita.md` (Entscheidungen zu einzelnen Einheiten) und `docs/plan-praleska-umsetzung.md` (Plan der Gruppe 2). Hier stehen Fragen zum Gesamtprojekt, zum Prozess, zu bereits gebauten Apps und die Ergebnisse der Nachprüfung.

## A. Fragen, die Sie entscheiden müssen

- **A1. Namen von Modellen in Tests** (vier Dateien, siehe `offene-punkte-kita.md`, A1). Offen seit Welle 89. **Entschieden 27.10.2026 (Max 20а): bewusste Ausnahme, die Listen bleiben.**
- **A2. Druck ohne Auswahl** (Zählhilfe, Navigator): Ein Standardbogen oder kein Standard?
- **A3. favicon.ico 404.** Keine der 221 Apps hat ein Icon. Ein gemeinsames Icon für alle oder unverändert?
- **A4. Zurücksetzen im Navigator.** Soll es einen Knopf geben, der alle Antworten löscht?
- **A5. Datumszeile** auf dem leeren Druckbogen des Navigators: bleiben oder streichen?
- **A6. Zählhilfe, Ergänzungen** („Entfernen“ und Ablehnung doppelter Titel): bestätigen oder streichen?
- **A7 (neu). Quiz-Engine `quiz-kern`.** 26 Apps importieren `quiz-kern` im Code (geprüft am 20.10.2026); neun weitere Nennungen stehen nur in Dokumenten oder in der Paketbeschreibung und haben keinen Code daraus. Der Engine speichert den Rekord im localStorage und vergibt Ränge nach Punkten (`packages/quiz-kern/src/quiz.mjs`, Zeilen 252–255). Beides widerspricht den Projektregeln, weil Rekorde und Ränge Kinder einstufen. Zwei Wege: (a) Engine ändern, Rekord und Rang weglassen oder auf die Sitzung beschränken; (b) die 26 Apps anpassen. Empfehlung: (a), danach das Impressum für die betroffenen Apps neu zählen. Entscheidung nötig, bevor neue Apps auf diesem Engine entstehen.
- **A8 (neu). Gruppenabstimmungen mit Kindern** (Naturschutz-Rat, Funktion 3; Zählhilfe Unser Konzert). Die Zählhilfe zählt Handzeichen je Vorschlag, nicht je Kind. Ist das für die Gruppenebene zulässig? Bisher gilt: ja, ohne Namen und ohne Verknüpfung mit einzelnen Kindern.
- **A9 (neu). Trostvers-Generator mit Kindernamen** (Funktion 1): Der Name eines Kindes wäre ein personenbezogenes Datum. Nein, oder nur ohne Name?
- **A10 (neu). Text der Pralęska im Repository.** Das Lehrbuch ist urheberrechtlich geschützt. Stand nach Prüfung: Die Datei `PRALESKA.pdf` liegt bereits auf dem Branch `main` (Commit `c3deddf`, PR #3). Die Arbeitskopie ist mit ihr identisch. Der Auftraggeber hat mitgeteilt, dass der Text zur Prüfung verwendet wird, nicht wörtlich: Die Repository-Texte sind abgeleitet („производные из PDF“, Kopf von docs/10), mit Adaptation an deutsche und europäische Regeln. Offen bleibt: (a) ob die Datei auf `main` öffentlich bleibt; (b) ob die Grenze „höchstens 12 Wörter“ für Zitate gilt, die wir in Bauaufträgen verwenden. Vorschlag: ja, und die Kopie wird nur lokal in einem Ordner außerhalb des Repos erzeugt (`tools/quelle-holen.sh`).
- **A11 (neu). Lesart von Quellenstellen, die widersprüchlich sind:** Hockey in der Sportliste (S. 229 und 246 gegen den Absatz zur Technik, Schläger und Scheibe), der Gruppensatz „упрощенным правилам“ (S. 229) und die Sternchen vor einzelnen Zielen (S. 181, 282, 283; die Quelle erklärt sie nicht im Text, eine Fußnote S. 113 deutet auf Aufgaben für eine Gruppe hin).
- **A12 (neu). Ergebnisindikator S. 197** („умеет резать ножницами“): Merkmal eines Kindes (Überschrift S. 189). Auf Karten nicht zulässig, bis die Redaktion entscheidet. Bestätigen?
- **A20 (neu). Altersbereich der Fühl- und Sortier-Werkstatt.** Der Katalog nennt 2 bis 3 Jahre; die Quelle definiert die Gruppe „Малыши“ auf S. 6 als „от одного года до трех лет“ (1 bis 3). Die App übernimmt 2 bis 3 und sagt das auf dem Bildschirm. Welche Angabe gilt, entscheidet die Redaktion; die Angabe ist in `apps/fuehl-sortier-werkstatt/README.md` markiert.
- **A18 (erweitert).** Die Pflichtmarkierung „maschinell geprüft“ steht jetzt auf allen neuen Karten. Für die über 200 älteren Apps mit Seitenangaben fehlt sie. Human-Prüfung nachholen oder Seitenangaben entfernen? Die Regel in `docs/02` Z. 151–152 verlangt für Seitenangaben die Markierung „проверено человеком“. Die Apps der Welle 93 (Puppentheater, Theater zuhause, Fühl-Werkstatt) tragen sie nicht; sie sind daher betroffen wie alle übrigen Apps mit Seitenangaben.
- **A19.** Katalogtext Nr. 2 (Erfolgs-Momente) beschreibt die verbotene Gruppierung. Den Katalogtext angleichen? **Entschieden 27.10.2026 (Max 23а): angeglichen.**

## B. Prozess und Repository

- **B1. Quelle nicht im Repo.** Gelöst im Ablauf: Die Datei liegt auf `main`, und `tools/quelle-holen.sh` erzeugt die Textkopie jederzeit neu, auch in einer neuen Cloud-Sitzung. Der Scratchpad ist nicht mehr nötig. Siehe A10.
- **B2. Prüfskripte liegen außerhalb des Repos.** Die Browserprüfungen (Playwright) sind im Scratchpad und nicht reproduzierbar. Vorschlag: ein Prüfskript im Ordner `tools/`, das jede App bei 360 px prüft und die Ergebnisse ausgibt.
- **B3. Zahlen im Impressum und im Wurzel-README** werden bei jeder Welle von Hand gesetzt. Die Tests fangen Abweichungen auf, aber der Ablauf ist mühsam. Vorschlag: Checkliste im Dokument `docs/02` oder automatische Aktualisierung.
- **B4. Wurzel-README veraltet.** Dort steht „201 приложений (200 рабочих MVP + 1 прототип)“. Tatsächlich gibt es 221 Ordner mit `index.html`.
- **B5. Statuszeilen in docs/10.** Nur die Abschnitte Kita und Eltern haben eine. Die Abschnitte Kinder-Apps, gemeinsame Apps, Pakete, Funktionen, Dokumente und Druckmaterialien nicht. Ohne Statuszeile ist der Fortschritt schwer zu sehen (Serie D im Plan).
- **B6. Nummern „кат.№N“ im Wurzel-README** meinen nicht immer denselben Katalog. „кат.№2“ steht bei sehr unterschiedlichen Apps. Vorschlag: eine einheitliche Nummerierung je Abschnitt.
- **B7. Alte Commits mit Modellnamen.** Ältere Commit-Nachrichten und einige Dateien enthalten Modellnamen. Nicht umgeschrieben (Entscheidung zu A1).
- **B8. Commit-Rhythmus.** In mehreren Wellen gab es Zwischenstands-Commits, bevor die Prüfung fertig war. Vorschlag: pro Welle ein Commit nach Prüfung, außer der Stop-Hook verlangt früher einen Commit.
- **B9. Verlorene Hintergrundarbeit.** Ein Containerneustart hat in Welle 91 einen Lauf mit Nachbesserungen verloren. Er wurde erneut gestartet. Solche Läufe sind über `scriptPath` wieder aufnehmbar.
- **B10. Fest verdrahtete Erwartungen in Prüfskripten.** Das Browser-Skript der Werkstatt-Karten rechnete mit 29 Karten. Die Erwartung wurde auf 30 angepasst; das Skript sollte die Anzahl aus den Daten lesen.

## C. Technische Befunde an bestehenden Apps

- **C1. `quiz-kern`** (siehe A7). Betroffen sind 26 Apps, darunter viele Kinder-Quiz.
- **C2. Fokus nach Klick.** Ein Fehler in der Anzeige-Funktion: Die Anzeige wird beim Klick vollständig ersetzt, der Fokus geht verloren. Er ist in den neuen Apps behoben (`data-kennung`). In den älteren Apps mit demselben Muster ist er wahrscheinlich noch da. Eine Prüfung aller Apps mit Knöpfen steht aus (Serie C).
- **C3. Fußlink unter 44 px.** Gleiches Problem: In den neuen Apps behoben, in den älteren nicht geprüft.
- **C4. `aria-live="polite"` auf `#app`.** Das Vorlesen liest bei jeder Änderung den ganzen Bereich vor. Mit echter Hilfstechnik nicht geprüft. Vorschlag: eigene kurze Statusmeldung für Änderungen.
- **C5. Druck im Browser.** Kopf- und Fußzeilen mit Datum und Adresse erscheinen, solange der Druckdialog sie nicht ausschaltet. Die README weist darauf hin; die App kann das nicht steuern.
- **C6. Import mit Attribut `with { type: 'json' }`.** Setzt aktuelle Browser voraus. Entscheidung, ob ältere Geräte unterstützt werden müssen.
- **C7. Impulsfragen mit Seitenangabe** (Erfolgs-Momente): Die Frage ist Eigenentwurf, trägt aber eine Seitenangabe. Die Verifikation hat das nicht als Regelverstoß gewertet; ein klarer Hinweis auf jeder Frage wäre trotzdem ehrlicher.
- **C8. Navigator, fünf Textfelder auf dem Bildschirm** für Kontaktzeilen der Anlaufstellen. Grenzfall zur Regel 3: Die Felder werden nicht gespeichert und nicht gedruckt. Entscheidung, ob das genügt (`offene-punkte-kita.md`, B4).

## D. Forschungsgruppe (docs/09 und ideen-katalog.json)

- **D1.** 107 von 139 Einträgen nennen Quellen, die nicht im Repo liegen (Rechtsrahmen, Studien). Eine Quellenprüfung steht aus.
- **D2.** Offen: Türkisch-Paket „Kern-Drei“, Polnisch-Paket für Grenzregionen, DGS-Gebärdensprache (externe Videos, Aufwand L).
- **D3.** Zwei Einheiten der Achse A sind nur mit einem medienpädagogischen Partner zulässig und werden nicht allein gebaut.
- **D4.** Die Apps `feed-forscher` und `kettenbrief-stopper` speichern die Sprache über das gemeinsame Paket; das Impressum sagt „gar nichts“. Das passt nicht zusammen (bekannt, offen).

## E. Ergebnisse der Nachprüfung (Welle 92)

- Die Inventur von 270 Einheiten (131 in Gruppe 2, 139 in Gruppe 1) wurde gegen die Ordner geprüft. In Gruppe 2 existieren alle genannten Apps.
- Vier Kita-Einheiten waren als „nicht gebaut“ eingetragen, obwohl sie in Variante A gebaut sind. Korrigiert.
- Die Zahl „gebaut“ in Gruppe 2 (53 plus 4 in Variante A) ist eine Einschätzung aus README und GDD. Eine Zeile-für-Zeile-Prüfung fehlt; sie ist Teil von Serie C.
- Der Faktenstand ist die größte Lücke: Nur 38 von 131 Einheiten der Gruppe 2 haben einen Vermerk, dass die Quelle geprüft wurde.

## F. Ergänzungen aus Welle 92

- **F1. Touch-Größe 48 px** (docs/02, Checkliste „touch ≥ 48 px“). Die Footer-Links der Apps der Wellen 90–92 hatten 44 px; nachgebessert auf 48 px. Ältere Apps: unbekannt, wahrscheinlich ebenso. Entscheidung: Repo-weit prüfen und angleichen (Serie C), oder die Regel auf Kinder-Apps begrenzen?
- **F2. Vorlesefunktion („есть озвучивание“, docs/02 Checkliste).** 116 von 224 Apps rufen `vorlesen()` auf, 108 nicht. Die neuen Fachkraft- und Eltern-Werkzeuge haben keine. Entscheidung: gilt die Regel für Kinder-Apps oder für alle? Bei Fachkraft-Werkzeugen wird die Ausnahme im GDD begründet.
- **F3. Prüfskripte.** Die Gegenprüfung der Zitate (38 Angaben) fand nur außerhalb des Repos statt; im Repo gibt es für Quellenprüfungen nur Konstanten. Siehe B1 und A10.
- **F4. Offline nach dem Laden.** `docs/02` (Checkliste) verlangt „Работает офлайн после загрузки“. Tatsächlich haben nur 4 von 227 Apps einen Service Worker. Ein Neuladen ohne Netz kann daher fehlschlagen; das hat die Browserprüfung der Welle 93 gemessen. Entscheidung: Service Worker für alle Apps (ein gemeinsamer Cache, mit Löschknopf für das Gerät), oder die Checkliste auf „ohne Verbindung nach draußen“ begrenzen. Bis dahin sagen die neuen Apps ausdrücklich, dass ein Neuladen ohne Netz nicht zugesichert ist.

## Entscheidungen des Nutzers (18.10.2026)

Die Entscheidungen stammen vom Nutzer (Макс) über die Beobachtungssitzung. Die Umsetzung steht jeweils dabei.

- **F4 (entschieden).** Die Checkliste in `docs/02` lautet jetzt „Без обращений наружу; повторная загрузка офлайн не гарантируется“. Es gibt keinen Service Worker: der Cache ist nach der Speicherregel der Anleitung verboten, und das Risiko veralteter Versionen steigt. Wenn Offline-Betrieb in Kitas ohne WLAN zur echten Anforderung wird, ist das eine eigene Infrastruktur-Einheit.
- **A7 (entschieden, Umsetzung läuft).** Entscheidung Max: Variante (a), bestätigt („да“). Stand: Einzel-Modus im `quiz-kern` umgesetzt (Rekord, Punkte, Ränge und ihr Speichern entfernt; alter Schlüssel wird einmal gelöscht). Duett umgesetzt: ohne Punkte, ohne Pokal, ohne „liegt vorn“ und ohne Unentschieden. Die Galerie ✅/⬜ je Person entfällt; der Vorschlag dazu steht im Bericht. Offen: Staffel (Entscheidung Max), dann die Gruppen der Apps mit eigenem Rekord, Rang oder Zähler (`docs/bewertung-stand.json`). Ursprüngliche Festlegung: Variante (a): `quiz-kern` ohne Rekord und Rang als Standard. Auf dem Abschlussbildschirm und im Duett keine Punkte und kein Pokal-Symbol. Beim Start wird ein alter Rekord einmal gelöscht (`removeItem`). Tests: `localStorage` wirft bei jedem Zugriff; das Ergebnis enthält nicht „Punkte“, „Rekord“ oder „Rang“. Alle 26 quiz-kern-Apps werden getestet (Modus einzel und duett, `tools/quiz-durchlauf.mjs`), die Impressum-Zahl wird per Skript neu gezählt. Eigene Einheit, nicht parallel zu den Workern, erst nach grünem Stand.
- **KIT-4 (entschieden).** Speicherung in `localStorage` (`kwp.plan`) mit Löschknopf und Eingabefelder für Erwachsene sind erlaubt. Die Apps für Erwachsene mit Eingabefeldern stehen in `docs/erwachsenen-apps.json`; ein Test schlägt an, wenn eine App mit Eingabefeld dort fehlt. Bei jedem Eingabefeld steht der Hinweis „Keine Namen von Kindern eingeben.“
- **GEM-22 (entschieden).** Im Druck ist der Bildschirm ausgeblendet; das Emoji im Titel steht nur am Bildschirm. Zahl der Experimente: zehn, davon acht aus der Quelle und zwei eigene.
- **KIT-14 (entschieden).** Die vier Aufgaben stehen oberhalb der Hinweis-Box. Ein Protokoll je Kind wird nicht gebaut.
- **PRI-5 (offen).** Weder registriert noch gelöscht, bis der Widerspruch zu „Übungsmaß laut Quelle“ nach dem Quelltext aufgelöst ist. Ein Test verbietet die Kombination.
- **PRI-8 (registriert mit offenem Punkt).** Die Fachprüfung der Sicherheitstexte steht aus.

## Entscheidungen des Nutzers (27.10.2026): Fragen 1–37

Max hat die 37 Fragen (Teile 1–5) beantwortet. Antwortzeile: 37в, 36а, 35а, 34а, 33а, 32а, 31а dann 31б, 30б, 29а, 28а, 27а, 26а, 25а, 24а, 23а, 22а, 21а, 20а, 19в, 18а, 17а, 16а, 15а, 14в, 13а, 12а, 11а dann 11б, 10в dann 10б, 9б, 8б, 7а, 6а, 5в,б, 4а, 3а, 2б, 1б. Stand je Punkt: **fertig**, **läuft**, **wartet** (auf Max oder auf einen vorigen Schritt).

- **1б (fertig).** Rangsymbol-Wächter bleibt streng; das Emoji auf dem Staffel-Endbildschirm hat keine Klasse `k-gross`, die Größe steht im Stil (wie beim Duett). Quiz-Durchlauf: 26 Apps × 3 Modi grün.
- **2б (fertig).** Ausnahme bestätigt: seiten-scanner. In den drei Abstimmungen (ergebnis-plakat, mitmach-arena, wahlkabine) steht „Meiste Stimmen: …“ statt 🏆; danach findet der Scanner dort nichts mehr, eine Ausnahme ist nicht nötig. Offen für Max: Die wahlkabine erlaubt Namen von Mitschüler*innen (Klassensprecher-Wahl) ohne den Hinweis „Keine Namen eintragen“ der mitmach-arena.
- **3а (fertig).** Ausnahmen bestätigt und im Quelltext belegt (kein Kind wird bewertet): sharenting-spiegel, lehrkraefte-szenariotraining, kita-familien-bruecke, foerder-navigator.
- **4а (fertig).** Umbenannt statt Ausnahme, Verhalten unverändert: quiz-karten-druck, tier-tanz-impulse, eltern-kompass-generator, schulanfang-spiel-navigator, selbstcheck-paedagogik, interaktions-konzept-assistent, kita-mitmach-boerse.
- **5в,б (fertig).** Für „Auf Anweisung Max“ bei elterngespraech-trainer und gesunder-koerper-ampel gibt es im Repo keine Quelle außer `docs/bewertung-stand.json` selbst. Daher б: beide Einträge verlassen die bestätigten Ausnahmen; die Treffer werden umbenannt.
- **6а, 8б (fertig), 7а (Frage an Max).** autonomiephase-navigator: Ausnahme; die Löschkarte war schon vorhanden. familien-datenschatz: 💎 und Zahlen auf beiden Seiten entfernt, Antworten und „einig/unterschiedlich“ bleiben. staerken-tagebuch bleibt „vorgeschlagen“: haeufigsteFelder vergleicht die Felder und wählt die zwei häufigsten für die Spielideen, das widerspricht der Bedingung „kein Vergleich der Felder“.
- **9б (fertig).** Service Worker entfernt: sw.js, Registrierung, `docs/sw-cache-stand.json`, `tools/sw-stand.mjs`, die Wächter-Module und -Tests in kinderrechte-entdecker, koeder-quiz, nachrichten-detektive, stark-und-gesund. Zusatz des Integrators: Die vier Apps räumen beim Start alte Registrierungen und Caches weg, sonst liefert ein Gerät mit altem Service Worker weiter die alte Fassung aus. Ein neuer Test (`kein-service-worker`) hält beides fest.
- **10в dann 10б (10в fertig, 10б für das gemessene Kinderblatt fertig).** Liste in `docs/druck-symbole-liste.md`: ☐ und ☑ drucken wirklich in 11 Apps; Kinderblatt ist mini-gaertner-begleiter (jetzt „Zutreffendes einkreisen“); sprich-mit-mir ist zu klären. 43 weitere Apps tragen die Zeichen nur im Quelltext (nicht gemessen). Listen für Erwachsene behalten leere Kästchen (in docs/02 vermerkt).
- **11а dann 11б (wartet).** Jetzt nur Pläne und GDD-Entwürfe für die neue Welle (kein Code); danach Start mit höchstens 8 Agenten.
- **12а, 13а, 14в, 15а (wartet).** Externe Fakten (Strang Г): zuerst nur Liste (327 blockierende Zeilen in 97 Apps; Recht und Geld vor Gesundheit; je Zeile ein Vorschlag), Änderungen erst nach Max' „да“ je Liste. Gesundheitszeilen bekommen „(Eigenentwurf, fachlich nicht geprüft)“. spielzeug-check-u3 behält 54 % und 95 % mit demselben Zusatz. Der TKG-Hinweis in familien-notfall-fahrplan bleibt.
- **16а, 18а (erledigt ohne Arbeit).** Kein Pull Request; keine Sitzung wird archiviert.
- **17а (liegt bei Max).** Leserechte für seine Umgebung kann nur der Sitzungsinhaber vergeben.
- **19в.** Jeder Workflow-Lauf endet mit einer Zeile: Zahl der Agenten und geleistete Arbeit. Läuft die Arbeit ohne Entscheidung aus, steht in einer Zeile, worauf gewartet wird.
- **20а (fertig).** Die Modellnamen-Listen in vier Tests (unser-konzert-zaehlhilfe, kita-unterstuetzungs-navigator, tagesblick-fachkraft, schatzkarten-generator) sind eine bewusste Ausnahme im Register; die Geschichte wird nicht umgeschrieben.
- **21а, 22а (wartet auf den 48-px-Durchgang).** Ein gemeinsames eingebettetes Favicon zusammen mit dem 48-px-Durchgang; ehrliche Maschinenkennzeichnung auf den Seiten-Links der alten Apps.
- **23а, 25а (fertig).** Katalogtext korrigieren (docs/10 Zeile 466, docs/praleska-katalog.json Zeile 270) nach Regel 3; Wortlaut schlägt der Integrator vor. ELT-16 bleibt wie gebaut, der Katalogeintrag wird angepasst. **24а.** ELT-8 nur auf Deutsch.
- **26а (wartet).** GDD-Entwürfe für zehn Apps (nur Dokumente).
- **27а (fertig).** Impressum von feed-forscher und kettenbrief-stopper: „nur die Sprache wird gespeichert“, Zahlen per Skript, Löschknopf prüfen.
- **28а (Regel in docs/02 fertig, Messung fertig).** Von 100 Apps in den Kinder-Bereichen des Hubs rufen 98 vorlesen() auf; ohne sind kinderrat und regel-werkstatt. Der GDD-Vermerk für Werkzeuge der Erwachsenen steht noch aus. **29а.** Max schickt kleine Posten später.
- **30б (fertig).** Regel und Test `speicher-regel` mit `docs/speicher-stand.json` (leer); die gemeinsame Karte wird in Kinder-Apps ohne Speicher entfernt (Lauf C). Karte „Meine Daten löschen“ nur dort entfernen, wo die App nichts speichert (kein `setItem`); wo sie speichert, bleibt sie. Test: Speicher ⇒ Löschknopf, kein Speicher ⇒ kein Löschknopf.
- **31а fertig (`tools/browser-tor.mjs`), 31б wartet auf Max:** `data-kennung` im gemeinsamen `el` macht die bisher nicht gemessenen Klicks sichtbar und erzeugt dadurch klickFehler (Stichprobe 0 → 4 je App, familienrat 300); das ist Schuld, die eine Erweiterung der Basislinie braucht. Der Patch liegt bereit. Ursprünglicher Text: Erst ein Delta-Tor (keine neuen Funde gegenüber der Basisdatei, die Basis wird nur kleiner), dann gemeinsame Ursachen beheben (data-kennung in quiz-kern und kinder-ui als reine Ergänzung; Druckzeichen). **32а.** Falschmeldungen des Quiz-Durchlaufs per Test beheben, ohne den Wächter zu lockern.
- **33а (fertig).** Zähler-Ausnahme eng erweitert: nur Zeilen `localStorage.removeItem('<Literal>')`; `setItem` und `getItem` zählen weiter; Test „Migration schreibt nichts“.
- **34а–37в (fertig, Lauf C).** 26 Apps = Kind; berechtigungs-safari und takt-pause Sonderfälle. berechtigungs-safari: neutral „Gefunden: N“, keine Punkte, Detektiv-Punkte, Punktestand, Pokal; Löschknopf bleibt; GDD, eltern.html, README angleichen. takt-pause wie familien-bildschirmzeit: neutraler einfarbiger Anzeiger, kein „gefeiert“ oder „geschafft“, keine Wochenübersicht (`tp.woche`); Timer, Ideen, neutrale Tageszeile und Löschknopf bleiben; Katalogname und README angleichen. Erlaubt sind neutrale Zähler „gesammelt/gefunden“; verboten sind Leistungsbewertung (Punkte, Rekord, Serien, Prozent, „richtig von“, „geschafft“, Sterne, Pokale, Tages- oder Wochenvergleich), per Wortlisten-Skript geprüft.
