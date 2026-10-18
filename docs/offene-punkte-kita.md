# Offene Punkte: Werkzeuge für Kita und Fachkräfte

Stand: nach Welle 89 (Commit 2b4be04). Dieses Blatt ist der Ort für alles, was noch offen ist:
Entscheidungen, Nacharbeiten, Vorschläge und bekannte Lücken. Er wird bei jeder Welle
aktualisiert. Die Nummern sind stabil, damit man in Nachrichten darauf verweisen kann.

## A. Entscheidungen, die bei der Fachkraft oder im Team liegen

- **A1. Namen von Modellen in Tests.** `apps/unser-konzert-zaehlhilfe/test/regeln.test.mjs`,
  `apps/kita-unterstuetzungs-navigator/test/regeln.test.mjs`, `apps/tagesblick-fachkraft/test/regeln.test.mjs`
  und `apps/schatzkarten-generator/test/aufbau.test.mjs` enthalten Listen mit Modellnamen.
  Das widerspricht der Regel „keine Modellidentifikatoren in Dateien des Repos“. Eine Ersetzung durch
  eine allgemeinere Prüfung schwächt die Schutzwirkung, deshalb ist sie nicht ohne Entscheidung erfolgt.
  Varianten: (a) so lassen; (b) Muster für Kennungen wie `name-5-5` ohne Familiennamen; (c) Prüfung streichen.
- **A2. Druck ohne Knopf.** Zählhilfe: Strg+P druckt beide Bögen. Navigator: Strg+P druckt eine leere Seite.
  Vorschlag: ohne Auswahl den leeren Bogen zeigen (Änderung in der CSS).
- **A3. favicon.ico 404.** Keine App im Repo hat ein Icon. Die Browserprüfung meldet das jedes Mal.
  Entscheidung: für alle Apps gemeinsam lösen oder unverändert lassen.
- **A4. Zurücksetzen im Navigator.** Es gibt keinen Knopf, der alle Antworten auf einmal löscht.
- **A5. Datumszeile auf dem leeren Druckbogen des Navigators.** Sie bleibt, weil sie ein einzelnes
  Datum ist und kein Feld je Tag. Entfernen oder behalten?
- **A6. Zählhilfe, Ergänzungen.** „Entfernen“ eines Vorschlags und die Ablehnung doppelter Titel stehen
  nicht im Auftrag. Bestätigen oder streichen?
- **A7. Zählhilfe, Textdatei.** Die Datei ist ein Download, den die Fachkraft auslöst, und enthält nur Titel
  und Art. Der Auftrag verbietet Speichern. Bestätigen?
- **A8. Zählhilfe, Name des Katalogeintrags.** Die Zeile heißt „Unser Konzert – Mitbestimmen“, gebaut ist
  eine Zählhilfe. Eintrag umbenennen oder Zusatz lassen?
- **A9. Navigator, Grenzfälle** (GDD, Offen 1): Angebote für Einzelne oder Gruppen bleiben drin; die Hilfe
  für Kinder mit besonderem Förderbedarf und das Zusammenwirken einzelner Fachkräfte bleiben draußen. Die Frage
  zu Einzelgesprächen mit Fachkräften (t7) bleibt drin. Wer das anders sieht, ändert `logik.mjs` und die Tests.
- **A10. Navigator, Adressat der Burnout-Frage.** Sie steht als Frage der Einrichtung. Soll sie ausdrücklich an
  Leitung und Träger gehen? Eine solche Vorgabe gibt es weder in docs/02 noch in docs/10.
- **A11. Navigator, Impressum.** Ein Verweis auf Impressum und Datenschutz fehlt. docs/02 Abschnitt 5 verlangt
  ihn für den öffentlichen Start.
- **A12. Angebots-Kompass (`entwicklungs-kompass`)** (GDD, Entscheidungen des Teams):
  1. Ordnername bleibt `entwicklungs-kompass`, Titel ist Angebots-Kompass. Umbenennen würde Hub, Sammelband,
     Wurzel-README und GDD-Verweise betreffen.
  2. §22a SGB VIII und Bildungspläne sind entfernt, weil nicht gegen docs/ belegt. Wieder aufnehmen?
  3. Zuordnung der Prüfpunkte zu den Merkmalen ist eigener Entwurf, z. B. Feinmotorik unter S18.7.
  4. Merkmal-Auswahl: S17.3, S18.1 und S19.1 liegen nahe an der Einstufung, die S18.5 ausschließt.
  5. Leere Kästchen auf dem Druckbogen: docs/02 Z. 79–80 nennt Haken auf dem Papier. Team entscheidet.
- **A13. Verworfene Einträge №84 und №86** (Beobachtungsbögen je Kind). Die Entscheidung gegen den Bau steht in
  docs/10 und in docs/02 Z. 141–146. Bestätigen?
- **A14. Gelöschte Altdaten von Kindern.** In den vier Apps der Welle 88 werden alte Daten beim ersten Start
  unwiderruflich entfernt. Bestätigen, dass das so gewollt ist?
- **A15. Musik-Jahresplaner.** Die eigene Stückliste (nur Monatsmarken gespeichert) wird beim Neuladen
  geleert. Ist das so gewollt?
- **A16. Schatzkarten-Generator.** Zielalter und ein Test des Ausdrucks (PDF) stehen aus.
- **A17. Mini-Oper-Baukasten.** Titel „Mini-Oper-Baukasten (offline, ohne KI)“ bestätigen.
- **A18. Seitenangaben in allen Apps (systemisch).** Die Checkliste in docs/02 verlangt: Eine Seitenangabe
  steht nur mit der Markierung „проверено человеком“ (deutsch: „von einem Menschen geprüft“). Unsere Seiten
  sind maschinell gegen die Textdatei geprüft. Die neuen Apps tragen deshalb die ehrliche Markierung „maschinell
  geprüft, noch nicht von einem Menschen“. Entscheidung: menschliche Prüfung der Seiten nachholen oder die
  Seitenangaben entfernen. Betrifft viele ältere Apps, nicht nur Welle 90.
- **A19. Katalogtext Nr. 2 (Erfolgs-Momente) führt die verbotene Gruppierung.** docs/10 (Zeile 466) und
  docs/praleska-katalog.json (Zeile 270) beschreiben die Karten als Hilfe für „unsichere Kinder mit niedrigem
  Selbstwert“. Die App übernimmt das nicht (Regel 3). Empfehlung: den Katalogtext an Regel 3 angleichen. Entscheidung
  der Projektleitung.

## B. Nacharbeiten (Arbeit ist begonnen oder fehlt noch)

- **B1. Zählhilfe, Druck mit echten Fachkräften.** Der Ausdruck ist automatisch geprüft (PDF, leere Seite,
  Zeichen, Namenszeile), aber nicht mit Fachkräften getestet. GDD, Offen 3.
- **B2. Navigator, Gegenprüfung der 24 Fragen.** Die Gegenprüfung hat Wortlaut-Abweichungen gefunden, eine
  zweite vollständige Lesung der Quelle (S. 312–317) steht aus. GDD, Offen 3.
- **B3. Navigator, Rechtsbezüge.** Die Kinderrechte-Deklaration und die Gesetzesverweise im Katalog sind nicht
  geprüft und deshalb nicht im Text.
- **B4. Navigator, Anlaufstellen.** Fünf Textfelder erscheinen auf dem Bildschirm, damit Kontaktzeilen von Hand
  ausgefüllt werden können. Das ist ein Grenzfall zu Regel 3. Entscheidung, ob das genügt.
- **B5. Navigator, Erprobung** mit drei bis fünf Fachkräften und einer Trägervertretung (GDD, Offen 6).
- **B6. Zählhilfe, Erprobung der Eigenentwürfe** (Art „Festprogramm“, Beschriftungen, Meldungen). GDD, Offen 3.
- **B7. Kita-Mitmach-Börse.** Die Einrichtung legt fest, wie Dateien vom Familien- zum Team-Gerät kommen, und
  ab welcher Zahl von Familien Summen gezeigt werden dürfen (GDD, Offen).
- **B8. Morgenkreis-Wochenplaner U3.** Die Lernbereiche „Sprache und Kommunikation“, „Umwelt“ und
  „Sensomotorik“ haben keine Bausteine. Die Monatsregel für Lepka braucht einen Kalender, den der Planer nicht
  führt. Deutsche Übertragung der Titel ist eigene Prüfung.
- **B9. Musikspiele-Kartei U3.** Deutsche Übertragung der Titel und Gemeinfreiheit der deutschen Kinderlieder
  sind nicht geprüft. Bis dahin draußen.
- **B10. Natur-Fürsorge-Karten.** Bedeutung der Angaben „S“ und „Erwachsene (Kinder 2–3)“ ist nicht geklärt.
  OCR-Fehler im Text (z. B. S. 96) sind möglich.
- **B11. Impulskarten und Rollenspiel-Begleiter.** Übertragungen der Begriffe sind eigen; Gegenprüfung mit
  deutschen Fachtexten steht aus. Die Praxis entscheidet über Passung.
- **B12. Bewegungs-Richtwerte 3–5.** Zuordnung der 20-Meter-Zeit (S. 131) ist unklar und als solche markiert.
  Angleich an deutsche Motorik-Studien ist nicht geprüft.
- **B13. Eigenentwurf-Prüfpunkte der Welle 88** (Tagesblick, Eingewöhnungs-Leitfaden, Schulstart-Begleiter,
  Musik-Jahresplaner, Schatzkarten, Mini-Oper). Fachliche Durchsicht durch eine Fachkraft steht aus.
- **B14. Alte Exportdateien auf Geräten.** Die Eltern-Seiten sollen sie löschen. Ob der Hinweis auf jeder
  betroffenen Seite steht, ist nicht systematisch geprüft.

## C. Vorschläge

- **C1. Statuszeile für jeden Abschnitt des Katalogs.** Nur „Werkzeuge für Kita“ und „Eltern“ haben eine.
  Die Abschnitte „Печатные материалы“ (19), „Контент-паки“ (12), „Функции“ (3) und „Документы“ (4) führen
  keinen Stand. Ohne Statuszeile lässt sich der Fortschritt nicht prüfen.
- **C2. Anzahl „gar nichts“ im Impressum** hängt an der Zahl der Ordner. Bei jedem neuen Ordner ändern sich
  die Zahlen; der Test meldet das. Vorschlag: Hinweis in die Checkliste der Welle.
- **C3. Gesamtzahl der Apps im Wurzel-README.** Dort steht „201 приложений“, es gibt aber 216 Ordner unter `apps/`.
- **C4. Nummern „кат.№N“ im Wurzel-README** meinen nicht immer denselben Katalog („кат.№2“ steht bei sehr
  unterschiedlichen Apps). Vorschlag: eine einheitliche Nummerierung je Abschnitt.
- **C5. Modellnamen in alten Commits.** Alte Commit-Nachrichten und einige Dateien enthalten Modellnamen. Nicht
  umgeschrieben; die Entscheidung dazu hängt an A1.
- **C6. Regel für leere Kästchen.** docs/02 Z. 79–80 sollte eindeutig sagen, ob leere Quadrate auf Druckbögen
  erlaubt sind. Heute ist es uneinheitlich (A12.5).

## D. Pläne und Lücken, die bekannt sind

- **D1. Ausdruck der Schatzkarten** ist nicht als PDF geprüft (A16).
- **D2. Mini-Oper-Netzwerkprüfung** prüft nur den Text, nicht das Verhalten.
- **D3. feed-forscher und kettenbrief-stopper** speichern die Sprache über das gemeinsame Paket. Das Impressum sagt
  „gar nichts“. Das passt nicht zusammen.
- **D4. Printblätter älterer Apps** sind nicht systematisch auf docs/02 Z. 79–82 geprüft (Kästchen, Punkte,
  Namenszeile). Das wäre ein eigener Prüfgang.
- **D5. Browser-Test für die Welle 89** ist gemacht; ein Test für den Ausdruck mit echtem Drucker nicht.

## E. Stand des Katalogs

- Werkzeuge für Kita: 25 von 27 gebaut. Offen sind №84 und №86 (nicht gebaut, siehe A13).
- Die übrigen Abschnitte sind in Arbeit: Inventar der Einheiten gegen die Apps läuft; die nächste Welle wird
  daraus gewählt.

## F. Inventar der übrigen Katalogabschnitte (Stand Welle 90)

Zuordnung der Einheiten zu vorhandenen Apps, geprüft von Lesern des Repos. „Unklar“ heißt: Es gibt eine
ähnliche App, aber sie deckt die Einheit nicht ab (andere Altersstufe, andere Form oder anderer Umfang).
Dafür muss entschieden werden, ob ausgebaut oder neu gebaut wird.

- **Печатные материалы für Kita (19):**
  - gebaut: 1, 3, 16, 19
  - offen: 2, 5, 17, 18 (Wellen 90 und folgende)
  - unklar: 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15. Dazu gehören Frischluft-Rituale, Mathe-Anfänge für 2–3 Jahre,
    Mal- und Matsch-Kartei (vorhanden: 8 Karten statt rund 61 Impulse) und die Anzucht-Kartei.
- **Контент-паки (12):**
  - gebaut: 1, 7
  - offen: 2, 3, 6, 10, 11, 12
  - unklar: 4, 5, 8, 9
- **Функции (3):**
  - gebaut: 2 (Elternbrief-Generator)
  - unklar: 1 (Trostverse mit dem Kindernamen: personenbezogen, Entscheidung nötig), 3 (Naturschutz-Rat:
    Abstimmung der Kinder; die App „mitmach-arena“ ist ein Klassenrat-Werkzeug. Entscheidung nach A13 nötig)
- **Документы (4):**
  - gebaut: 4 (Rhythmus-Orchester)
  - offen: 1 (Konzept-Mapping, internes Dokument), 3 (Theater-Heft, Druck)
  - Entscheidung nötig: 2 (Krippen-Portfolio: Beobachtungsbogen je Kind, vergleichbar mit №84 und №86 → nach A13
    nicht bauen)

## G. Welle 90 (Stand nach Prüfung und Nachbesserung)

Gebaut, alle drei als „teilweise“ im Katalog markiert:

- **Erfolgs-Momente-Kartei** (Katalog Printmaterialien №2): Karten zu gemeinsamen Tätigkeiten.
  Offen: Durchsicht durch Fachkräfte (B-Punkt); Katalogtext mit „unsicheren Kindern“ (A19).
- **Entdecker-Karten: Tiere und Pflanzen vor der Tür** (№4): Druck-Kartenset für 1–3 Jahre.
  Offen: Igel, Eichhörnchen, Amsel und Reh (A-Entscheidung, Quelle nennt sie nicht).
- **Bewegungslandschaften-Stationen** (№5): Stationskarten mit Übungsmaßen. Offen: DGUV-Vorgaben
  extern prüfen; Fallhöhe und Untergrund nicht belegt.

Alle drei: Seitenangaben nur maschinell geprüft (A18). Der Browser-Lauf bei 360 px ist automatisiert; der
Druck mit echtem Drucker und mit Fachkräften steht aus. Die Fehler aus der Gegenprüfung sind umgesetzt.
