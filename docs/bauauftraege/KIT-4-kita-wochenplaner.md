# Bauauftrag KIT-4: Kita-Wochenplaner Bildungsangebote

Status: teilweise · Abschnitt: Kita-Werkzeuge (Fachkräfte) · Ziel: Ausbau von apps/kita-wochenplaner/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 8 (8–10), Abschnitt „Примерный перечень занятий“, Gruppen „Малыши“, „Почемучки“, „Фантазеры“ (Seiten 8–10).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Примерный перечень занятий“ (S. 8)
  - „Малыши“ (S. 8)
  - „Почемучки“ (S. 9)
  - „Фантазеры“ (S. 10)
  - „Рекомендуемый объем образовательной нагрузки“ (S. 10)
- Umschrieben ohne Anführungszeichen (Seiten 9–10): Zahl der Angebote je Woche je Gruppe (Gruppe 1 bis 3 Jahre: 10; Gruppe 3 bis 5 Jahre: 12 und 15; Gruppe 5 bis 7 Jahre: 17). Richtwerte für die Dauer je Angebot: 10 bis 15 Minuten, 15 bis 20 Minuten und 20 bis 25 Minuten je Gruppe. Die Quelle warnt vor Überlastung der Kinder (S. 10).
- Freispiel-Vorrang, Ausgewogenheits-Check, Aushang und Team-Datei sind Eigenentwurf.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft; das Skript meldet für diese Datei keine Fehler.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte (Erzieher*innen, Kita-Leitung) für Gruppen von 1 bis 7 Jahren (Katalog; Quelle: Gruppen „Малыши“, „Почемучки“, „Фантазеры“). Verwendung: beides (Bildschirm zum Planen, Druck als Aushang für die Eltern).
- Lernziele, prüfbar:
  1. Die Fachkraft sieht in einem Blick, welche der sechs Bildungsbereiche in der Woche Angebote haben, und erkennt einen leeren Bereich (Eigenentwurf).
  2. Die Fachkraft erkennt Angebote, die über dem Richtwert ihrer Altersgruppe liegen. Der Richtwert ist in Abschnitt 9 offen (Quelle: Spannen 10–15, 15–20, 20–25 Minuten).
  3. Bei mehr als drei Angeboten an einem Tag erscheint der Hinweis, dass freies Spiel Vorrang hat (Eigenentwurf).

## 3. Funktion

- Katalog verlangt (docs/10, Eintrag KIT-4): Planungswerkzeug mit altersgerechten Richtwerten für Anzahl und Dauer von Angeboten; Ausgewogenheits-Check über die Bildungsbereiche. Adaptation: Raster auf die Bildungsbereiche der Länder-Bildungspläne; Richtwerte nur als Empfehlung mit Freispiel-Vorrang; Überlastungs-Hinweis der Quelle; keine Wettbewerbs-Events.
- App leistet schon (README, GDD, `logik.mjs`):
  - Wochenraster Montag bis Freitag;
  - Angebot mit Tag, Bereich (sechs Bereiche, Eigenentwurf), Altersgruppe (1–3, 3–5, 5–7 Jahre) und Minuten;
  - Balken je Bereich;
  - Hinweise: Richtwert je Altersgruppe, mehr als drei Angebote am Tag, leerer Bereich der Woche;
  - Aushang über `druck.css`;
  - Team-Datei packen, prüfen, vereinigen (`koffer.mjs`).
- Bildschirme: Wochenansicht; Formular für ein Angebot; Ausgewogenheits-Check; Export und Import der Team-Datei; Druckansicht als Aushang.
- Ablauf: Tag wählen → Bereich, Altersgruppe und Minuten eingeben → Angebot in der Woche sehen → Hinweise prüfen → Aushang drucken oder Datei exportieren → Team-Datei importieren (Pläne werden zusammengeführt, nichts wird überschrieben).
- Was gedruckt wird: Aushang mit dem Wochenplan Montag bis Freitag und dem Wochentitel; keine Namen, keine Kinderdaten; eine Seite A4 hoch.
- Lücke: Die Anzahl-Richtwerte je Woche (10, 12, 15, 17) fehlen in der App. Die Minuten-Richtwerte sind einheitliche Werte (10, 20, 25) statt der Spannen der Quelle. Die Bildungsbereiche sind nicht auf Landespläne abgebildet. Offen in Abschnitt 9.

## 4. Daten

Datei: `apps/kita-wochenplaner/daten/bereiche.json`. Schema: `bereiche[{id, name, emoji, beispiele}]`, `altersgruppen[{id, name, maxMinutenProAngebot, warntext}]`, `tagesHinweis{maxAngeboteProTag, warntext}`, `wochenHinweis{warntext}`. Schema mit einer Beispielzeile:

```json
{ "id": "1-3", "name": "1 bis 3 Jahre", "maxMinutenProAngebot": 10, "quelle": { "seite": "S. 10" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
ladeBereiche(pfad = "daten/bereiche.json") -> {bereiche, altersgruppen, tagesHinweis, wochenHinweis}
  Schritt 1: Datei lesen; bei Fehler Abbruch
  Schritt 2: bereiche hat 6 Einträge; altersgruppen hat 3 Einträge (1-3, 3-5, 5-7)
  Schritt 3: maxMinutenProAngebot ist je Altersgruppe gesetzt (Wert nach Abschnitt 9)

minutenJeBereich(angebote, tag?) -> {bereichId: Minuten}
  Schritt 1: angebote nach tag filtern, falls tag angegeben
  Schritt 2: Minuten je bereichId summieren; fehlende Bereiche sind 0

angeboteFuerTag(plan, tag) -> Angebot[]
  Schritt 1: tag muss Montag bis Freitag sein; sonst Fehler
  Schritt 2: Angebote in Reihenfolge des Plans zurückgeben

pruefePlan(plan, daten) -> Hinweis[]
  Schritt 1: je Angebot: minuten > maxMinutenProAngebot der Altersgruppe ergibt Hinweis mit warntext
  Schritt 2: je Tag: Anzahl Angebote > tagesHinweis.maxAngeboteProTag ergibt Hinweis mit Freispiel-Text
  Schritt 3: je Bereich ohne Angebot in der Woche ergibt wochenHinweis mit dem Namen des leeren Bereichs
  Schritt 4: kein Score, keine Rangfolge; Rückgabe ist eine Liste von Hinweisen

packeKoffer(plan) -> Datei
  Schritt 1: KOFFER_ART und KOFFER_VERSION setzen
  Schritt 2: plan serialisieren; keine Felder mit Namen

pruefeKoffer(datei) -> plan oder Fehler
  Schritt 1: Art und Version prüfen
  Schritt 2: Angebote gegen das Schema prüfen

vereinigeKoffer(lokalerPlan, datei) -> plan
  Schritt 1: Angebote mit bekannter id bleiben unverändert
  Schritt 2: neue Angebote aus der Datei werden angehängt; nichts wird überschrieben

speicherePlan(plan) -> void
  Schritt 1: nur ausführen, wenn die Speicher-Entscheidung in Abschnitt 9 positiv ist
  Schritt 2: localStorage-Schlüssel kwp.plan; Zugriff in try/catch
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Hinweis: die App speichert `kwp.plan` in localStorage (app.mjs Z. 24–27) mit Löschknopf (Z. 183); siehe Abschnitt 9.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Konflikt: der Planer braucht Eingaben (Tag, Bereich, Altersgruppe, Minuten); siehe Abschnitt 9.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Der Planer bewertet den Plan, nicht Kinder; die Oberfläche bittet, keine Kindernamen einzutragen.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Die Markierung gilt für jede Anzeige mit Seitenangabe. Der Aushang trägt nach dem A18-Standard keine Seitenangabe.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden): minutenJeBereich, angeboteFuerTag, pruefePlan. Richtwert-Tests nach der Entscheidung in Abschnitt 9 anpassen.
- `test/koffer.test.mjs` (vorhanden): packeKoffer, pruefeKoffer, vereinigeKoffer; Angebote bleiben beim Zusammenführen erhalten.
- `test/daten.test.mjs` (vorhanden): sechs Bereiche, drei Altersgruppen, Freispiel-Text im Tageshinweis, keine Bewertungsbegriffe.
- `test/regeln.test.mjs` (fehlt, anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`).

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick, nur `localhost`. Speicher gleich null gilt erst nach der Entscheidung in Abschnitt 9.
- Druck: Aushang zeigt nur den Wochenplan; keine Zeichen; keine Namenszeile.
- Import: Pläne werden zusammengeführt, nichts wird überschrieben.
- Registrierung nur durch den Koordinator.

## 9. Offen

- Richtwert Minuten: die App nutzt je Altersgruppe 10, 20 und 25 Minuten (`daten/bereiche.json`, README). Die Quelle nennt Spannen von 10 bis 15, 15 bis 20 und 20 bis 25 Minuten (S. 10). Entscheidung: Obergrenze oder Untergrenze; die Quellenangabe entsprechend anpassen.
- Anzahl-Richtwerte: die Quelle nennt 10, 12, 15 und 17 Angebote je Woche (S. 9–10). Die App hat keinen Wochen-Richtwert. Entscheidung: ergänzen oder streichen.
- Speicherung: `kwp.plan` liegt in localStorage mit Löschknopf. docs/02 Z. 25–26 erlaubt localStorage für Nutzerdaten mit Löschknopf; Abschnitt 6 verbietet Speicherung. Entscheidung nötig.
- Eingabefelder: der Planer braucht Eingaben. Die Regel „Keine Eingabefelder“ in Abschnitt 6 ist eine Projektregel; sie ist für Erwachsenen-Werkzeuge zu entscheiden.
- Ausgewogenheits-Check, Hinweis bei mehr als drei Angeboten am Tag und die sechs Bereiche sind Eigenentwurf. Die Bereiche sind nicht auf Landespläne abgebildet (GDD, Praxistest).
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Zitatgrenze: dieser Bauauftrag nutzt 6 Wörter (docs/10). A10 fragt, ob 12 gelten sollen (offen).
