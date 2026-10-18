# Fragen, Hinweise und Nacharbeiten

Stand: 18.10.2026, nach Welle 91. Dieses Dokument ergänzt `docs/offene-punkte-kita.md` (Entscheidungen zu einzelnen Einheiten) und `docs/plan-praleska-umsetzung.md` (Plan der Gruppe 2). Hier stehen Fragen zum Gesamtprojekt, zum Prozess, zu bereits gebauten Apps und die Ergebnisse der Nachprüfung.

## A. Fragen, die Sie entscheiden müssen

- **A1. Namen von Modellen in Tests** (vier Dateien, siehe `offene-punkte-kita.md`, A1). Offen seit Welle 89.
- **A2. Druck ohne Auswahl** (Zählhilfe, Navigator): Ein Standardbogen oder kein Standard?
- **A3. favicon.ico 404.** Keine der 221 Apps hat ein Icon. Ein gemeinsames Icon für alle oder unverändert?
- **A4. Zurücksetzen im Navigator.** Soll es einen Knopf geben, der alle Antworten löscht?
- **A5. Datumszeile** auf dem leeren Druckbogen des Navigators: bleiben oder streichen?
- **A6. Zählhilfe, Ergänzungen** („Entfernen“ und Ablehnung doppelter Titel): bestätigen oder streichen?
- **A7 (neu). Quiz-Engine `quiz-kern`.** 35 Apps hängen daran. Der Engine speichert den Rekord im localStorage und vergibt Ränge nach Punkten (`packages/quiz-kern/src/quiz.mjs`, Zeilen 252–255). Beides widerspricht den Projektregeln, weil Rekorde und Ränge Kinder einstufen. Zwei Wege: (a) Engine ändern, Rekord und Rang weglassen oder auf die Sitzung beschränken; (b) die 35 Apps anpassen. Empfehlung: (a), danach das Impressum für die betroffenen Apps neu zählen. Entscheidung nötig, bevor neue Apps auf diesem Engine entstehen.
- **A8 (neu). Gruppenabstimmungen mit Kindern** (Naturschutz-Rat, Funktion 3; Zählhilfe Unser Konzert). Die Zählhilfe zählt Handzeichen je Vorschlag, nicht je Kind. Ist das für die Gruppenebene zulässig? Bisher gilt: ja, ohne Namen und ohne Verknüpfung mit einzelnen Kindern.
- **A9 (neu). Trostvers-Generator mit Kindernamen** (Funktion 1): Der Name eines Kindes wäre ein personenbezogenes Datum. Nein, oder nur ohne Name?
- **A10 (neu). Text der Pralęska im Repository.** Das Lehrbuch ist urheberrechtlich geschützt. Die Textkopie liegt nur im Scratchpad. Vorschlag: keine vollständige Kopie ins Repo, sondern Seitenangaben und kurze Zitate (höchstens 12 Wörter) mit Verweis auf das Original. Einverstanden?
- **A11 (neu). Lesart von Quellenstellen, die widersprüchlich sind:** Hockey in der Sportliste (S. 229 und 246 gegen den Absatz zur Technik, Schläger und Scheibe), der Gruppensatz „упрощенным правилам“ (S. 229) und die Sternchen vor einzelnen Zielen (S. 181, 282, 283; die Quelle erklärt sie nicht im Text, eine Fußnote S. 113 deutet auf Aufgaben für eine Gruppe hin).
- **A12 (neu). Ergebnisindikator S. 197** („умеет резать ножницами“): Merkmal eines Kindes (Überschrift S. 189). Auf Karten nicht zulässig, bis die Redaktion entscheidet. Bestätigen?
- **A13 (neu). Altersbereich der Fühl- und Sortier-Werkstatt.** Der Katalog nennt 2 bis 3 Jahre; die Quelle definiert die Gruppe „Малыши“ auf S. 6 als „от одного года до трех лет“ (1 bis 3). Die App übernimmt 2 bis 3 und sagt das auf dem Bildschirm. Welche Angabe gilt, entscheidet die Redaktion; die Angabe ist in `apps/fuehl-sortier-werkstatt/README.md` markiert.
- **A18 (erweitert).** Die Pflichtmarkierung „maschinell geprüft“ steht jetzt auf allen neuen Karten. Für die über 200 älteren Apps mit Seitenangaben fehlt sie. Human-Prüfung nachholen oder Seitenangaben entfernen? Die Regel in `docs/02` Z. 151–152 verlangt für Seitenangaben die Markierung „проверено человеком“. Die Apps der Welle 93 (Puppentheater, Theater zuhause, Fühl-Werkstatt) tragen sie nicht; sie sind daher betroffen wie alle übrigen Apps mit Seitenangaben.
- **A19.** Katalogtext Nr. 2 (Erfolgs-Momente) beschreibt die verbotene Gruppierung. Den Katalogtext angleichen?

## B. Prozess und Repository

- **B1. Quelle nicht im Repo.** Die Arbeitskopie der Pralęska liegt im Scratchpad. Ein Container-Neustart kann sie kosten. Siehe A10.
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

- **C1. `quiz-kern`** (siehe A7). Betroffen sind 35 Apps, darunter viele Kinder-Quiz.
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
