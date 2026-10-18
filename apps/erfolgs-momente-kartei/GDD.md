# Kurz-GDD: Erfolgs-Momente-Kartei

**Einheit aus Katalog:** docs/10 (Praleska, Katalog-Konstruktor №2), Eintrag „Erfolgs-Momente-Kartei“, Titel beibehalten. **Engine:** reine Logik in `logik.mjs`, die Druckvorschau rendert nur deren Text. Zielgruppe: Fachkräfte in der Kita (Kinder 3 bis 7).

## 1. Kernaussage

Fachkräfte finden Druckkarten zu gemeinsamen Tätigkeiten der ganzen Gruppe. Jede Karte gibt eine offene Rolle, die alle Kinder übernehmen können, und zwei bis drei Impulsfragen an die Fachkraft zur Lage: Raum, Material, Zeit, Gruppengröße. Die Karten fragen nach der Situation, nicht nach einzelnen Kindern.

## 2. Zielgruppe

Die Fachkraft. Die Karten sind Material für die Gruppe, kein Bildschirm für Kinder (docs/02, Regel 5).

## 3. Entscheidungen

- **Neun druckbare Karten:** acht Tätigkeitskarten und eine Quellenkarte. Die Quellenkarte kommt zu den acht Tätigkeitskarten hinzu, weil nur sie Belege aus der Quelle trägt.
- **Jede Karte trägt ihre Markierung.** Tätigkeitskarten tragen „Eigenentwurf“ und ihre Anregung mit Seite. Jede Impulsfrage trägt Seite und Bedingung. Die Quellenkarte trägt Seiten und markiert ihre Übertragungen als Eigenentwurf.
- **Impulse fragen nach der Lage.** `pruefeKarten` lehnt Fragen nach einem bestimmten Kind ab.
- **Keine Gruppierung nach Kindern.** Die Quelle gruppiert auf S. 15 bis 16 Kinder nach Merkmalen. Diese Gruppierung wird nicht übernommen, weil sie Kinder einstuft (docs/02, Regel 3).
- **Keine Eingabe.** Es gibt keine Felder, keine Namen, keine Notizen. Die Auswahl lebt nur im Zustand der Seite und wird nicht gespeichert.
- **Druck nur aus dem Text.** Gedruckt wird ausschließlich, was `druckTexte` aus den Karten macht. Häkchen und Auswahlknöpfe sind Bildschirmteile und werden über `druck.css` ausgeblendet.
- **Keine Druckzeichen.** Keine Häkchen, Kästchen, Punkte, Sterne, Emojis, Namenszeile und keine Tages- oder Wochentagsfelder auf dem Papier (docs/02, Regel 4).
- **Kein Elternteil.** Das Werkzeug richtet sich an die Fachkraft.

## 4. Politik-Konformität (docs/02)

Der Netzwerk-Wächter ist eingebunden und wird beim Start aufgerufen. Die Content-Security-Policy des Projekts steht im `index.html`. Es gibt keine Speicher-API und keine Abrufe außer den eigenen Daten. Die Seite steht im Projekt, ohne Anmeldung und ohne Verbindung nach außen.

## 5. Tests

Die Suite führt 23 Tests aus. `test/logik.test.mjs` prüft das Kartenset, die Seitenangaben, die Eigenentwurf-Kennzeichnung, die Zitatlänge, die Gegenprobe der Prüfung sowie Auswahl, Druckform und DruckText. `test/regeln.test.mjs` prüft die Regeln: keine Felder über Kinder, keine Speicherung, keine externen Adressen, Netzwerk-Wächter, CSP, Druckzeichen, Namenszeile, Markierung je Karte, Druck-CSS, aria-live, Wortliste, Modellnamen (nur über allgemeine Begriffe geprüft) und die Testzahl.

## Offen

- Die Karten sind Eigenentwurf und brauchen eine Durchsicht durch Fachkräfte.
- Der Bezug zu den Bildungsplänen der Länder ist nicht belegt.
- Der Eintrag enthält keinen Resilienz-Bezug, weil die Quelle keinen nennt.
- Die Übertragungen aus der russischsprachigen Quelle sind nicht gegengeprüft; eine Gegenprüfung mit deutschen Fachtexten steht aus.
- Ob neun Karten reichen oder mehr Tätigkeiten gebraucht werden, zeigt die Praxis.
- Ob das Werkzeug in die Liste der Apps mit Hilfe-Insel gehört, entscheidet das Projekt. Es steht dort nicht.
