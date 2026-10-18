# Bauauftrag KIT-27: Kita-Unterstützungs-Navigator

Status: teilweise · Abschnitt: Kita-Werkzeuge (Fachkräfte) · Ziel: Ausbau von apps/kita-unterstuetzungs-navigator/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 312 (312–317), Abschnitt „Психологическая служба в дошкольном учреждении“ (Anhang der Quelle), Gruppe: keine (Anhang).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Психологическая служба в дошкольном учреждении“ (S. 312)
  - „Приоритетные задачи педагога-психолога“ (S. 312)
  - „Работа с детьми“ (S. 313)
  - „Декларация прав ребенка“ (S. 313)
  - „социометрической структуры группы“ (S. 313)
  - „способностей и одаренности“ (S. 314)
  - „воспитанников, имеющих трудности“ (S. 314)
  - „диагностика психологической готовности детей к школе“ (S. 314)
  - „Работа с родителями“ (S. 315)
  - „Работа с педагогами“ (S. 315)
  - „определение типа педагогического взаимодействия“ (S. 316)
  - „эмоционального выгорания педагогов“ (S. 317)
  - „психолого-педагогической совместимости“ (S. 317)
- Umschrieben ohne Anführungszeichen: Die Quelle nennt 32 Aufgaben in vier Blöcken, als Aufzählungspunkte ohne Nummern (S. 312–317). Eine Zählung nach Aufzählungspunkten ergibt je Block 4, 10, 6 und 12 Punkte (Eigenzählung, S. 312–317). Der psychologische Dienst nennt Zentren für einzelne Kinder (psychologisch, medizinisch, medizinisch-pädagogisch) als Anlaufstelle (S. 314).
- Nicht gefunden – offen:
  - Gesetzesverweise (Katalog verweist auf Rechtsbezüge): Suchbegriffe „закон“, „статья“, „кодекс“, „конвенц“ auf S. 312–317 ohne Treffer. Der einzige Rechtsbezug ist die Deklaration der Rechte des Kindes (S. 313).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet. Die Fragen der App sind Eigenentwurf nach den Aufgaben.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft; das Skript meldet für diese Datei keine Fehler.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte und Träger einer Kita. Verwendung: Bildschirm (Checkliste) und Druck (leerer Bogen, Bericht).
- Lernziele, prüfbar:
  1. Die Einrichtung sieht je Frage die Quellenseite und wählt eine von vier Antworten; ein zweiter Druck auf dieselbe Antwort nimmt sie zurück.
  2. Die Einrichtung sieht die Zählung je Block (geregelt, teilweise, nicht geregelt, Träger oder extern, ohne Antwort), ohne Gesamtsumme und ohne Prozentzahl.
  3. Die Einrichtung druckt einen leeren Bogen oder den Bericht; beide enthalten keine Namen und keine Kästchen.

## 3. Funktion

- Katalog verlangt (docs/10, Eintrag Nr. 93, Typ: Erwachsenen-Katalog, Checkliste, Bericht): eine Checkliste nach dem Anhang mit 32 Aufgaben in vier Blöcken. Die Einrichtung prüft, welche Unterstützungsaufgaben geregelt sind, und erhält einen Bericht je Block. Adaptation laut Katalog: Anlaufstellen als Kategorien mit leeren Kontaktzeilen (Eigenentwurf); keine Gesetzesverweise, weil keine geprüft sind; keine Speicherung, keine Verbindung nach außen.
- App leistet schon (README, GDD, `logik.mjs`):
  - 24 Aufgaben als Fragen in vier Blöcken (`BLOECKE`), je Frage mit Seite (S. 312–317);
  - acht Aufgaben ausgeschlossen, mit Seite und Grund (`AUSGESCHLOSSEN`); eine Aufgabe teilweise übernommen (S. 317, `TEILWEISE_AUSGESCHLOSSEN`);
  - vier Antworten (`ANTWORTEN`) und Zählung je Block (`zaehleBlock`), keine Summe über alle Blöcke, keine Ampel, keine Prozentzahl, keine Rangfolge;
  - Bericht als Text: Druck, und Download als Textdatei nur auf Knopfdruck (die App legt nichts ab);
  - leerer Druckbogen mit allen Fragen, Antwortoptionen als Text und fünf Anlaufstellen mit leeren Zeilen;
  - fünf Anlaufstellen-Kategorien (`ANLAUFSTELLEN`) ohne Kontaktdaten;
  - 37 Tests in zwei Dateien.
- Lücke und offene Punkte:
  - Die 24 Fragen sind nicht gegen eine zweite Lesung der Quelle geprüft (GDD, Offen 3).
  - Grenzfälle: Hilfe für Kinder mit besonderem Förderbedarf (S. 314) und Typ des Zusammenwirkens einzelner Fachkräfte (S. 316) sind ausgeschlossen; Angebote für Eltern und Team bleiben drin (README).
  - Rechtsbezüge fehlen; sie sind nicht geprüft.
- Bildschirme: Blockliste mit je Frage vier Antwortknöpfen; Zählung je Block; Vorschau des Berichts; Anlaufstellen mit je einer Kontaktzeile; Druckknöpfe.
- Ablauf: Block wählen → Antwort je Frage setzen → Zählung prüfen → Bericht drucken oder als Textdatei laden.
- Was gedruckt wird (Soll):
  - Bericht: je Block die Zählung; je Frage mit der Antwort nicht geregelt eine Zeile mit Seitenangabe; keine Namen, keine Kontaktdaten.
  - Druckbogen: alle Fragen mit Seitenangabe, Antwortzeile und Optionen als Text; Anlaufstellen mit leeren Zeilen; keine Kästchen, keine Häkchen.

## 4. Daten

Keine Datendatei. Die Daten stehen in `apps/kita-unterstuetzungs-navigator/logik.mjs` (`BLOECKE`, `AUSGESCHLOSSEN`, `TEILWEISE_AUSGESCHLOSSEN`, `ANLAUFSTELLEN`). Ziel-Form für eine Auslagerung, Vorlage-Form mit einer Beispielzeile (die Frage ist Eigenentwurf):

```json
{ "id": "kin-03", "block": "Arbeit mit Kindern", "frage": "Gibt es vorbeugende Maßnahmen für die Gruppe?", "quelle": { "seite": "S. 313" }, "eigenentwurf": true }
```

Datei bei Auslagerung: `apps/kita-unterstuetzungs-navigator/daten/aufgaben.json`. Ist-Stand: Die Aufgaben stehen im Code; die Ausschlüsse führen Seite und Grund.

## 5. Pseudocode

```
ladeBloecke() -> Bloecke
  Schritt 1: BLOECKE lesen: genau vier Blöcke mit Überschrift und Seite (S. 312, S. 313, S. 315, S. 315–317)
  Schritt 2: je Block fragen[] mit id, frage und seite; Summe 24 Fragen (Test)
  Schritt 3: AUSGESCHLOSSEN (acht Einträge mit seite und grund) und Fragen sind disjunkt (Test)
  Schritt 4: TEILWEISE_AUSGESCHLOSSEN (S. 317) gilt nur für die Frage zum Klima im Team

antwortSetzen(antworten, frageId, option) -> antworten
  Schritt 1: option ist Element von ANTWORTEN (vier Werte); sonst antworten unverändert zurückgeben
  Schritt 2: hat frageId bereits option, die Antwort entfernen (zweiter Druck nimmt zurück)
  Schritt 3: sonst antworten[frageId] = option

zaehleBlock(block, antworten) -> {geregelt, teilweise, nicht_geregelt, traeger_extern, ohne_antwort}
  Schritt 1: nur Fragen des Blocks zählen
  Schritt 2: ohne_antwort = Anzahl Fragen des Blocks minus gesetzte Antworten
  Schritt 3: keine Summe über Blöcke, keine Prozentzahl, keine Rangfolge

berichtText(bloecke, antworten, datum) -> Text
  Schritt 1: standText(datum) als Kopfzeile
  Schritt 2: je Block zaehleBlock ausgeben
  Schritt 3: je Frage mit Antwort nicht_geregelt eine Zeile mit seite
  Schritt 4: keine Namen, keine Kontaktzeilen der Anlaufstellen, keine Prozentzeichen

druckeLeerbogen(bloecke, anlaufstellen) -> HTML
  Schritt 1: je Frage Text, seite, Optionen als Text und eine Antwortzeile
  Schritt 2: ANLAUFSTELLEN (fünf Kategorien) mit leeren Kontaktzeilen
  Schritt 3: keine Kästchen, keine Häkchen, keine Sterne, keine Namenszeile

kontaktEintragen(kategorie, eingabe) -> Text
  Schritt 1: eingabe nur im Speicher der Seite halten
  Schritt 2: Kontakt nie in berichtText übernehmen
```

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Werkzeuge ohne Nutzerdaten speichern nichts. Ist-Stand: nichts gespeichert; Textdatei nur auf Knopfdruck (README). Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Ist-Stand: CSP `default-src 'self'` und Netzwerk-Wächter (README).
- [ ] Keine Eingabefelder (Projektregel der Vorlage). Ist-Stand: ein Eingabefeld je Anlaufstelle (Kontaktzeile); Entscheidung in Abschnitt 9.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Ist-Stand: keine Ampel, keine Summe, keine Rangfolge; Zählung nur je Block (README).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Ist-Stand: keine Kästchen, Häkchen, Sterne und keine Namenszeile (README, Test `regeln.test.mjs`).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50). Ist-Stand: nicht belegt; offen.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ (docs/02 Z. 151–152). Ist-Stand: Bericht und Druckbogen nennen Seiten je Frage, die Markierung fehlt. Entscheidung in Abschnitt 9.
- [ ] Keine Modellnamen in Dateien (Test `regeln.test.mjs`). Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden): genau 24 Aufgaben mit Seiten, Blocknamen, Burnout-Frage mit Hinweis, Ausschlüsse mit Seiten, Zählung je Block, Bericht ohne Prozentzeichen, keine Summe in der Schnittstelle.
- `test/regeln.test.mjs` (vorhanden): Quelltext ohne fremde Adresse, nichts gespeichert, genau ein Eingabefeld, keine Kontaktdaten, keine Modellnamen, keine Rechtsnormen, keine Ampel, keine Prozentzahl, keine Kästchen, Häkchen, Sterne oder Emojis, keine Zeile für einen Namen, Druckbogen ohne Bildschirmzustand, Druck-CSS eingebunden.
- Zu ergänzen: Test für Seitenangabe und Pflichtmarkierung auf Bericht und Druckbogen (nach der Entscheidung in Abschnitt 9).

## 8. Abnahme

- `node --test apps/kita-unterstuetzungs-navigator/test/*.test.mjs` grün; Testzahl 37 in README und GDD stimmt.
- Browser bei 360 px: Blöcke, Antwortknöpfe mindestens 48 px, Zählung, Berichtsvorschau, kein Überlauf, keine externen Anfragen, Speicher gleich null.
- Druck: Bericht und Druckbogen ohne Kästchen; Seitenangaben und Markierung gemäß Entscheidung.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Grenzfälle: Hilfe für Kinder mit besonderem Förderbedarf (S. 314) und Typ des Zusammenwirkens (S. 316) sind ausgeschlossen. Entscheidung, ob eine Frage auf Teamebene möglich ist (README, Grenzfälle).
- Teil der Aufgabe auf S. 317 (Verträglichkeit einzelner Fachkräfte mit einer Gruppe): nicht übernommen; die Frage zum Klima im Team bleibt.
- Vollständigkeit der 24 Fragen: Gegencheck mit der Quelle auf S. 312–317 steht aus. Erprobung mit drei bis fünf Fachkräften und einer Trägervertretung (GDD, Offen).
- Anlaufstellen: fünf Kategorien sind Eigenentwurf; die Quelle nennt nur Zentren für einzelne Kinder (S. 314). Entscheidung, ob eine lokale Liste vorgesehen ist.
- Rechtsbezüge: Der Katalog verweist auf Gesetze; nicht geprüft, daher nicht in den Texten (GDD, Offen 5).
- Seitenangaben im Bericht und auf dem Druckbogen: A18 verlangt keine Seitenzahl auf dem Blatt. Entscheidung: Seiten entfernen oder die Pflichtmarkierung ergänzen.
- Kontaktzeile als Eingabefeld: Regel „keine Eingabefelder“ klären (Abschnitt 6).
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Zitatgrenze: dieser Bauauftrag nutzt höchstens 6 Wörter (docs/10). A10 fragt, ob 12 gelten sollen (offen).
