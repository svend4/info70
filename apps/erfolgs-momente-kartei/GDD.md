# Kurz-GDD: Erfolgs-Momente-Kartei

**Einheit aus Katalog:** docs/10 (Praleska, Katalog-Konstruktor №2), Eintrag „Erfolgs-Momente-Kartei“, Titel beibehalten. **Engine:** reine Logik in `logik.mjs`; die Vorschau rendert deren Zeilen (`druckZeilen`). **Zielgruppe:** Fachkräfte in der Kita. Kinder sind nicht die Zielgruppe; die Katalogangabe 3 bis 7 beschreibt die Altersstufe der Gruppe.

## 1. Kernaussage

Fachkräfte finden Druckkarten zu gemeinsamen Tätigkeiten der ganzen Gruppe. Jede Karte gibt eine offene Rolle, die alle Kinder übernehmen können, und zwei bis drei Impulsfragen an die Fachkraft zur Lage: Raum, Material, Zeit, Gruppengröße. Die Karten fragen nach der Situation, nicht nach einzelnen Kindern.

## 2. Zielgruppe

Die Fachkraft. Die Karten sind Material für die Fachkraft, kein Bildschirm für Kinder. Unter 3 Jahren keine Bildschirme für Kinder (Projektregel, ohne docs/02-Zeile).

## 3. Entscheidungen

- **Neun druckbare Karten:** acht Tätigkeitskarten und eine Quellenkarte. Die Quellenkarte kommt zu den acht Tätigkeitskarten hinzu, weil nur sie Belege aus der Quelle trägt.
- **Jede Karte trägt ihre Markierung.** Tätigkeitskarten tragen „Konkrete Tätigkeit: Eigenentwurf“ und eine Zeile „Grundgedanke“ mit Seite (S. 15 oder S. 16). Die Quelle nennt keine der acht Tätigkeiten. Jede Impulsfrage trägt Seite und Bedingung. Die Quellenkarte trägt Seiten und markiert ihre Übertragungen als Eigenentwurf.
- **Impulse fragen nach der Lage.** `pruefeKarten` lehnt Fragen nach einem bestimmten Kind ab: Artikelformen (das, dem, des, den, dieses, diesem, dieser, eines, einem, ein) vor Kind, Kindes oder Kinde, auch mit einem Adjektiv dazwischen, und einzelne Kinder im Plural.
- **Keine Gruppierung nach Kindern.** Die Quelle nennt auf S. 15 bis 16 Gruppen von Kindern nach Merkmalen. Diese Gruppierung wird nicht übernommen, weil sie Kinder einstuft (docs/02 Z. 141–146, Release-Regel: keine Bewertung von Kindern). Die Quellenkarte gibt nur den allgemeinen Satz von S. 15 wieder.
- **Keine Eingabe.** Es gibt keine Felder, keine Namen, keine Notizen. Die Auswahl lebt nur im Zustand der Seite und wird nicht gespeichert.
- **Druck nur aus den Zeilen.** Gedruckt wird ausschließlich, was `druckZeilen` aus den Karten macht; die Vorschau setzt jede Zeile als Absatz. `druckTexte` ist die Liste der Texte dieser Zeilen, und die Tests prüfen genau diese Texte. Häkchen und Auswahlknöpfe sind Bildschirmteile und werden über `druck.css` ausgeblendet.
- **Keine Druckzeichen.** Keine Häkchen, Kästchen, Punkte, Sterne, Emojis, Namenszeile und keine Tages- oder Wochentagsfelder auf dem Papier (docs/02 Z. 79–82, Druckbögen).
- **Fokus.** Jeder Knopf trägt eine eindeutige `data-kennung`. Nach dem Neuaufbau der Anzeige liegt der Fokus wieder auf dem Knopf, der ihn vorher hatte.
- **Kein Elternteil.** Das Werkzeug richtet sich an die Fachkraft.

## 4. Politik-Konformität (docs/02)

Der Netzwerk-Wächter ist eingebunden und wird beim Start aufgerufen. Die Content-Security-Policy des Projekts steht im `index.html`. Es gibt keine Speicher-API und keine Abrufe außer den eigenen Daten. Die Seite steht im Projekt, ohne Anmeldung und ohne Verbindung nach außen.

Fundstellen in docs/02: keine Anfragen nach außen Z. 22–24; Druckbögen Z. 79–82; keine Bewertung von Kindern Z. 141–146.

## 5. Tests

Die Suite führt 23 Tests aus. `test/logik.test.mjs` prüft das Kartenset (IDs eindeutig, Seitenangaben, Eigenentwurf-Kennzeichnung, Zitatlänge), die Gegenproben der Prüfung (jede Artikelform, Plural, Gegenprobe ohne Treffer), Auswahl, Druckform, Druckzeilen und Druck-Texte. `test/regeln.test.mjs` prüft die Projektregeln: keine Felder über Kinder, keine Speicherung, keine externen Adressen, Netzwerk-Wächter, CSP, Druckzeichen, Namenszeile, Markierung je Karte und Prüfangabe, Druck-CSS mit Footer-Link (48 px), aria-live und Fokus, Wortliste in den ausgelieferten Dateien, Modellnamen (nur über allgemeine Begriffe geprüft) und die Testzahl.

## Offen

- Die Karten sind Eigenentwurf und brauchen eine Durchsicht durch Fachkräfte.
- Test mit Fachkräften steht aus. Der Release-Test mit Kindern nach docs/02 Abschnitt 4 gilt für diese App nicht, weil die Zielgruppe Fachkräfte sind.
- Der Katalogeintrag docs/10 Nr. 2 führt als Beschreibung „unsichere Kinder mit niedrigem Selbstwert“. Die App übernimmt diese Gruppierung NICHT. Die Karten stufen kein Kind ein.
- Pflichtmarkierung: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Diese Angabe steht im Footer der App und auf der Quellenkarte; die Seitenangaben sind nicht von einem Menschen geprüft.
- Die Impulsfragen tragen eine Seitenangabe, die Fragen selbst sind Eigenentwurf. Ob die angegebene Seite eine Frage stützt, ist nicht geprüft.
- Der Bezug zu den Bildungsplänen der Länder ist nicht belegt.
- Der Eintrag enthält keinen Resilienz-Bezug, weil die Quelle keinen nennt.
- Die Übertragungen aus der russischsprachigen Quelle sind nicht gegengeprüft; eine Gegenprüfung mit deutschen Fachtexten steht aus.
- Ob neun Karten reichen oder mehr Tätigkeiten gebraucht werden, zeigt die Praxis.
- Ob das Werkzeug in die Liste der Apps mit Hilfe-Insel gehört, entscheidet das Projekt. Es steht dort nicht.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
