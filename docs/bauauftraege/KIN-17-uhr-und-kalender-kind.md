# Bauauftrag KIN-17: Uhr- und Kalender-Kind (Einheit 17)

Status: teilweise · Abschnitt: Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) · Ziel: Ausbau von apps/uhr-und-kalender-kind
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 233 (233–234), Abschnitt „Ориентировка во времени“ (S. 233), Gruppe „Фантазеры“ (S. 234).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Ориентировка во времени“ (S. 233)
  - „приборами измерения времени“ (S. 233)
  - „сумерки, рассвет, закат“ (S. 233)
  - „седьмом году жизни“ (S. 233)
- Inhalt in eigenen Worten (S. 233): Kalender mit 7 Tagen je Woche, 4 bis 5 Wochen je Monat, 3 aufeinanderfolgenden Monaten je Jahreszeit und 4 Jahreszeiten je Jahr. Uhrzeit auf die volle Stunde, die halbe Stunde und die Viertelstunde. Tageszeiten wie Dämmerung und Sonnenaufgang. Für das siebte Lebensjahr sind Stoppuhr und Uhr als Messgeräte genannt (S. 233).
- Abweichung vom Katalog: docs/10 vereinfacht auf Wochen gleich Monat. Die Quelle nennt 4 bis 5 Wochen je Monat (S. 233). Dieser Auftrag folgt der Quelle.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Faktenstand laut index.json: nur Katalogtext. Für diesen Auftrag wurde gegen die Textkopie geprüft.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 5–7 (kurze Einheiten), docs/10 Z. 295. Verwendung: Bildschirm.
- Lernziele, prüfbar (Eigenentwurf; die Themen stehen auf S. 233):
  1. Kind liest die Uhrzeit auf einer Analoguhr auf die volle Stunde, die halbe Stunde und die Viertelstunde.
  2. Kind ordnet 7 Tage zur Woche, 4 bis 5 Wochen zum Monat, 3 Monate zur Jahreszeit und 4 Jahreszeiten zum Jahr.
  3. Kind benennt Tageszeiten, auch Dämmerung und Sonnenaufgang.
  4. Kind deutet die Redeweise halb 5 als 4:30.

## 3. Funktion

- Bildschirme: Start mit einer Beispieluhr (3 Uhr) und Erklärung der kleinen und großen Zeiger. Rätselrunde mit 8 Rätseln aus 12, darunter Uhr-Rätsel mit 3 Zeitoptionen und Kalender-Fragen. Auflösung mit Erklärung. Abschluss mit Rang und Rekord und dem Hinweis, auf eine echte Uhr zu schauen.
- Ablauf: Start → Rätsel 1 bis 8 (gemischt) → Antwort → Auflösung mit Vorlesen → Punkte, Rang, Rekord → Abschluss.
- Ist-Stand (README, GDD): Analoguhr in HTML und CSS mit beweglichen Zeigern. uhrText für volle Stunde, halb und Viertel. Kalender mit 7 Tagen, Wochentagen, Wochenende, Tagesphasen Morgen, Mittag, Abend und Nacht sowie 4 Jahreszeiten. Vorlesen. Rekord.
- Der Katalog verlangt (docs/10, Z. 295): Analoguhr, Kalender-Mechanik mit Woche, Monat, Jahreszeit und Jahr, Tageszeiten wie Dämmerung und Sonnenaufgang. Lücken: Monat und Jahreszeit fehlen im Kalender. Dämmerung und Sonnenaufgang fehlen unter den Tageszeiten. Siehe Abschnitt 9.
- Druck: nicht vorgesehen.

## 4. Daten

Datei: `apps/uhr-und-kalender-kind/daten/fragen.json` (vorhanden). Die Felder quelle, thema und eigenentwurf fehlen bisher. Schema mit einer Beispielzeile:

```json
{ "id": "kal-monat-wochen", "thema": "kalender", "frage": "Wie viele Wochen hat ein Monat?", "quelle": { "seite": "S. 233" }, "eigenentwurf": false }
```

## 5. Pseudocode

Vorhanden in logik.mjs: zeigerWinkel, uhrText, uhrOptionen, pruefeFragen, rangFuer. Alle anderen Funktionen sind (Eigenentwurf).

```
kalenderBeziehungen() -> Liste
  Eintraege = [
    {von: Tag, nach: Woche, anzahl: 7},
    {von: Woche, nach: Monat, anzahl: 4 bis 5},
    {von: Monat, nach: Jahreszeit, anzahl: 3},
    {von: Jahreszeit, nach: Jahr, anzahl: 4}]
  Quelle je Eintrag: S. 233 (Feld quelle)
  -> Eintraege

pruefeKalenderFragen(fragen: Frage[], beziehungen: Liste) -> Fehler[]
  für jede Frage mit thema == kalender: Antwort muss zu einem Eintrag in beziehungen passen
  Frage zum Monat: Antwort 3 oder 6 Wochen -> Fehler "Monat"
  quelle.seite ist gesetzt, sonst Fehler "Seitenangabe fehlt"
  -> leere Liste heißt: gültig

uhrText(stunde: 1 bis 12, minute: 0 | 15 | 30 | 45) -> Text
  0 -> volle Stunde
  30 -> halb plus nächste Stunde (halb 5 = 4:30)
  15 -> Viertel nach der Stunde
  45 -> Viertel vor der nächsten Stunde
  Übergang über 12 wird geprüft

tageszeitFrage(begriffe: Liste, zufallsReihe: Zahl[]) -> Frage
  begriff = begriffe[zufallsReihe[0] mod Länge(begriffe)]
  ablenker = zwei weitere Begriffe aus begriffe, ungleich begriff
  -> {frage: Text, optionen: gemischt nach zufallsReihe[1..], richtig: begriff.name}
```

Die Zufallsreihe kommt als Parameter. Die Logikdatei enthält keine Zufallsquelle.

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Ist-Stand: Rekord `uhr.rekord` in localStorage (app.mjs Z. 58, 112–113). Abweichung, siehe Abschnitt 9.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Ist-Stand: NetzwerkWaechter laut README. Abrufe nur lokal (daten/fragen.json).
- [ ] Keine Eingabefelder (Projektregel). Ist-Stand: Bedienung über Schaltflächen laut README.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Ist-Stand: Punkte, Rang und Rekord werden angezeigt (README, rangFuer in logik.mjs). Abweichung, siehe Abschnitt 9.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Nicht zutreffend.
- [ ] Mobile First 360 px; Knöpfe mindestens 48 px (docs/02 Z. 50). In diesem Auftrag nicht gemessen.
- [ ] Lernziele in der README als Liste (docs/02 Z. 42–43). Ist-Stand: nicht als Liste vorhanden.
- [ ] Vorlesen (docs/02 Z. 44). Ist-Stand: vorhanden laut README.
- [ ] Pflichtmarkierung: Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft. (docs/02 Z. 151–152)
- [ ] Keine Modellnamen in Dateien. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen. Der Katalog nennt einen Sprachumschalter de, uk, ru für Zeitbegriffe.

## 7. Tests

- `test/logik.test.mjs` (vorhanden, GDD Abschnitt 6): zeigerWinkel (3:00, 6:30, 9:45, 12:00). uhrText (voll, halb, Viertel, Übergang über 12). Fragenbank (beide Typen, Minuten nur 0, 15, 30, 45, Optionen eindeutig). uhrOptionen (erste Option ist richtig). Kalender-Stichproben (7 Tage, Mittwoch, 4 Jahreszeiten). Kaputte Ablenker werden erkannt. rangFuer.
- Neu: kalenderBeziehungen (Monat 4 bis 5 Wochen, Jahreszeit 3 Monate), pruefeKalenderFragen (Monat mit 3 Wochen wird abgelehnt), tageszeitFrage (gleiche Zufallsreihe ergibt gleiche Frage, richtige Antwort in den Optionen).
- `test/regeln.test.mjs` (neu, nach Vorlage apps/puppentheater-werkstatt/test/regeln.test.mjs): kein localStorage-Aufruf (gilt nach der Entscheidung in Abschnitt 9); kein Eingabefeld; keine Wörter für Punkte oder Rang in Kindertexten.

## 8. Abnahme

- `npm test` im App-Ordner grün. Testzahl in README und GDD stimmt (docs/02 Z. 110–111).
- Browser bei 360 px: Uhr lesbar, kein Überlauf, Knöpfe mindestens 48 px. Die Uhr hat role img und einen sprechenden aria-label.
- Test mit Kindern der Zielgruppe (docs/02 Z. 45–46).
- Registrierung nur durch den Koordinator.

## 9. Offen

- Monat (4 bis 5 Wochen) und Jahreszeit (3 Monate) fehlen im Kalender (S. 233). Der Katalogtext „Wochen = Monat“ ist eine Vereinfachung. Vorschlag: Katalog an die Quelle anpassen.
- Tageszeiten: Dämmerung, Sonnenaufgang und Sonnenuntergang nach S. 233 fehlen. Die App nennt Morgen, Mittag, Abend und Nacht (Eigenentwurf).
- Stoppuhr (S. 233, siebtes Lebensjahr) nicht gebaut. Digitale Uhr als Vergleich (GDD Abschnitt 7) ist optional.
- Rekord in localStorage (uhr.rekord, app.mjs Z. 58, 112–113) sowie Punkte und Rang (rangFuer) stehen gegen docs/02 Z. 141–146 und gegen die Vorlage. Die App hat eigene Logik und nutzt quiz-kern nicht. Entscheidung offen.
- docs/02 Z. 25–26 erlaubt localStorage für Nutzerdaten mit Löschknopf. Die Vorlage verbietet Speicherung. Entscheidung offen.
- Daten: fragen.json ohne Felder quelle, thema und eigenentwurf.
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt. Sie stehen in Abschnitt 1 und in den Daten als quelle. Hier notiert.
- Seitenangaben ohne Markierung „проверено человеком“ (A18, docs/02 Z. 151–152).
- Lernziele fehlen in der README als Liste (docs/02 Z. 42–43).
