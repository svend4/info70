# Bauauftrag KIT-3: Gruppenklima-Check

Status: teilweise · Abschnitt: Kita-Werkzeuge (Fachkräfte) · Ziel: Ausbau von apps/gruppenklima-check/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 15 (15–18), Abschnitt „Расти здоровым, малыш!“, Gruppe: keine (allgemeiner Teil, nicht gruppenspezifisch).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „непринятые“ (S. 15)
  - „детском обществе“ (S. 15)
  - „благоприятного микроклимата“ (S. 15)
  - „ситуации успеха“ (S. 15)
  - „социометрический статус“ (S. 18)
- Die Quelle nennt auf S. 15 Kinder, die in der Gruppe nicht angenommen sind, und den Nutzen von Erfolgssituationen. Auf S. 18 sieht sie eine Diagnose des sozialen Status einzelner Kinder vor. Diese Diagnose wird nicht übernommen; der Bezug steht ohne Anführungszeichen.
- Bereiche, Aussagen, Impulse und Team-Bericht sind Eigenentwurf.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: <ausstehend>.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte (Erzieher*innen, Kita-Leitung) für Gruppen mit Kindern von 3 bis 7 Jahren (Katalog). Verwendung: Bildschirm; der Team-Bericht wird kopiert (Eigenentwurf).
- Lernziele, prüfbar:
  1. Die Fachkraft beantwortet 20 Aussagen in vier Bereichen zu je fünf Aussagen mit „trifft zu“ oder „noch nicht“. Es gibt keine Angabe zu einzelnen Kindern (Eigenentwurf).
  2. Zu jeder offenen Aussage zeigt die App einen Impuls zum Handeln, der sich ausklappen laesst (Eigenentwurf).
  3. Der Team-Bericht listet die offenen Aussagen je Bereich, ohne Prozentwert und ohne Rangfolge (Eigenentwurf).

## 3. Funktion

- Katalog verlangt (docs/10, Eintrag KIT-3): Beobachtungs-Checkliste zum Klima der Kindergruppe; welche Kinder nicht angenommen wirken; wer Erfolgssituationen braucht; Bericht mit Handlungsimpulsen. Adaptation: keine soziometrischen Tests mit Kindern; keine kindbezogenen Rankings.
- App leistet schon (README, GDD, `app.mjs`):
  - vier Bereiche (Zugehoerigkeit, Konfliktkultur, Beteiligung, Erfolgserleben) mit je fuenf Aussagen (Eigenentwurf);
  - aufklappbarer Impuls je Aussage;
  - Haekchen mit Fortschrittsanzeige;
  - Knopf „Zuruecksetzen“;
  - Team-Bericht zum Kopieren;
  - Leitungsseite `eltern.html`.
  Kein Kinderbezug.
- Bildschirme: Startseite mit den vier Bereichen; Bereichsansicht mit Aussagen und Impulsen; Bericht; Leitungsseite `eltern.html`.
- Ablauf: Bereich oeffnen → Aussage als zutreffend markieren oder offen lassen → Impuls oeffnen → Bericht ansehen → Bericht kopieren.
- Was gedruckt wird: nichts. Kein Druckblatt vorgesehen.
- Luecke: Der Katalog fragt nach einzelnen Kindern; die App fragt nur nach dem Klima der Gruppe (bewusste Abweichung, begruendet in der README). Offen in Abschnitt 9.

## 4. Daten

Datei: `apps/gruppenklima-check/daten/kriterien.json`. Schema: `bereiche[]` mit `id`, `titel` und `aussagen[]` mit `id`, `text`, `impuls`. Schema mit einer Beispielzeile (Text und Impuls sind Eigenentwurf, die Seite ist die Bezugsseite):

```json
{ "id": "zugehoerigkeit-1", "text": "Die Gruppe hat ein Ritual, bei dem alle mitmachen.", "impuls": "Plane ein Ritual, bei dem jedes Kind einen festen Platz hat.", "quelle": { "seite": "S. 15" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
ladeKriterien(json) -> {bereiche}
  Schritt 1: json.bereiche hat genau 4 Eintraege
  Schritt 2: je Bereich genau 5 aussagen; alle 20 ids sind eindeutig
  Schritt 3: kein text und kein impuls enthaelt einen Namen oder ein Kinder-Etikett (Wortliste im Test); Treffer bricht ab

ladeStatus(speicher) -> {aussageId: boolean}
  Schritt 1: Schluessel 'gk.status' in try/catch lesen; bei Fehler oder fehlendem Eintrag {}
  Schritt 2: nur ids uebernehmen, die in ladeKriterien vorkommen

setzeStatus(status, aussageId, wert) -> status
  Schritt 1: aussageId muss in den 20 ids sein; sonst Fehler
  Schritt 2: wert ist boolean; Kopie des Status mit geaendertem Eintrag zurueckgeben
  Schritt 3: nur schreiben, wenn die Speicher-Entscheidung in Abschnitt 9 positiv ist

berichtFuerTeam(bereiche, status) -> Text
  Schritt 1: je Bereich die Aussagen ohne Haekchen auflisten (Titel und Text)
  Schritt 2: zu jeder offenen Aussage den impuls aus den Daten anhaengen
  Schritt 3: kein Prozentwert, keine Rangfolge, kein Feld fuer Kinder; Textende: „Gruppenklima, keine Bewertung einzelner Kinder“

setzeZurueck(speicher) -> status
  Schritt 1: Schluessel 'gk.status' in try/catch entfernen
  Schritt 2: gib {} zurueck
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Hinweis: die App speichert `gk.status` in localStorage (app.mjs Z. 16–17) mit Zuruecksetzen (Z. 86); siehe Abschnitt 9.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Die App hat Haekchen, keine Textfelder.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Fortschritt ohne Prozentwert; Bericht ohne Kinderbezug.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Kein Druck vorgesehen.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Die Markierung gilt für jede Anzeige mit Seitenangabe.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/kriterien.test.mjs` (vorhanden): Schema 4 Bereiche × 5 Aussagen, eindeutige ids.
- `test/logik.test.mjs` (fehlt, anlegen): ladeKriterien, ladeStatus, setzeStatus, setzeZurueck, berichtFuerTeam. Die Auswertung liegt heute in `app.mjs` und wird fuer die Tests in `logik.mjs` ausgelagert (Eigenentwurf).
- `test/regeln.test.mjs` (fehlt, anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`).

## 8. Abnahme

- `npm test` im App-Ordner gruen; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Ueberlauf, Knoepfe mindestens 48 px, Fokus nach Klick, nur `localhost`. Speicher gleich null gilt erst nach der Entscheidung in Abschnitt 9.
- Kein Druck. Team-Bericht ist kopierbar und enthaelt keine Angabe zu einem Kind.
- Registrierung nur durch den Koordinator.

## 9. Offen

- Speicherung: `gk.status` liegt in localStorage (Haekchen, Zuruecksetzen). docs/02 Z. 25–26 erlaubt localStorage fuer Nutzerdaten mit Loeschknopf; Abschnitt 6 verbietet Speicherung. Entscheidung nötig.
- Gruppen- statt Kinderebene: der Katalog fragt, welche Kinder nicht angenommen wirken; die App bewertet nur das Gruppenklima (README, „Этический стержень“). Entscheidung: Katalog-Korrektur oder Ausbau.
- Auswertung liegt in `app.mjs` statt in `logik.mjs`. Vor dem Ausbau auslagern, damit die Tests greifen.
- Bereiche, Aussagen und Impulse sind Eigenentwurf. Die Quelle liefert nur den Bezug (S. 15, S. 18).
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Zitatgrenze: dieser Bauauftrag nutzt 6 Woerter (docs/10). A10 fragt, ob 12 gelten sollen (offen).
