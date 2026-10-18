# Bauauftrag KIT-21: Musik-Jahresplaner für die Kita

Status: teilweise · Abschnitt: Kita-Werkzeuge (Fachkräfte) · Ziel: Ausbau von apps/musik-jahresplaner/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 160 (160–174), Abschnitte „Слушание музыки“ bis „Музыка в повседневной жизни“ (Musikteil), Gruppe „ПОЧЕМУЧКИ“.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Группа «ПОЧЕМУЧКИ»“ (S. 160)
  - „Слушание музыки“ (S. 160)
  - „Рекомендуемый музыкальный репертуар“ (S. 161)
  - „Пение“ (S. 162)
  - „Музыкально-ритмическая деятельность“ (S. 166)
  - „Обучение элементам нотной грамоты“ (S. 170)
  - „Музыка в повседневной жизни“ (S. 172)
  - „Новый год“ (S. 174)
  - „Мамин день — 8 Марта“ (S. 174)
  - „Осень золотая“ (S. 174)
  - „Праздник урожая“ (S. 174)
  - „Весна-красна“ (S. 174)
  - „сезонные праздники-развлечения“ (S. 174)
  - „1—2 раза в месяц“ (S. 174)
- Umschrieben ohne Anführungszeichen: Die Quelle gliedert den Musikteil in fünf Bereiche: Hören, Singen, musikalisch-rhythmische Tätigkeit, Spiel auf Instrumenten und Musik im Alltag (S. 160–174). Zu jedem Bereich stehen Repertoirelisten, die offen enden (S. 161–173). Feste sind eine Aufgabe der Musik im Alltag; im Sommer sind sie wöchentlich vorgesehen (S. 174).
- Nicht gefunden – offen:
  - Katalogangabe „über 280 Stücke“: Suchbegriff „280“ auf S. 160–174 ohne Treffer; die Quelle nennt keine Gesamtzahl.
  - Festvorschläge Advent, St. Martin und Fasching: Suchbegriffe „адвент“, „рождество“, „мартин“, „масленица“ auf S. 160–174 ohne Treffer. Erntedank und Frühlingsfest entsprechen sinngemäß den Festen „Праздник урожая“ und „Весна-красна“ (S. 174).
  - Jahreskreis-Zuordnung (Herbst, Advent, Frühling): Die Quelle ordnet die Feste keinem Monat zu (S. 174).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft; das Skript meldet für diese Datei keine Fehler.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Erwachsene, Musikfachkräfte und das Kita-Team. Verwendung: Bildschirm (Plan, Stückliste) und Druck (Jahresbogen).
- Lernziele, prüfbar:
  1. Die Fachkraft sieht die fünf Bereiche der Quelle mit Überschrift und Seite (S. 160–174).
  2. Die Fachkraft trägt eigene Stücke mit Bereich, Monat und Herkunft ein; die Zählung je Monat stimmt mit den Einträgen überein.
  3. Die Fachkraft druckt den Jahresbogen; er enthält keine Eingabeelemente, keine Häkchen und keine Namen.

## 3. Funktion

- Katalog verlangt (docs/10, Eintrag Nr. 87, Typ: Erwachsenen-Katalog, Checkliste): einen durchsuchbaren Katalog nach der Struktur der Quelle mit gemeinfreiem Repertoire, eine Jahreskreis-Zuordnung und eine Checkliste der abgedeckten Bereiche je Monat. Adaptation laut Katalog: deutsche Kinder- und Kreislieder statt belarussischer Volkslieder; Festvorschläge.
- App leistet schon (README, GDD, `logik.mjs`):
  - fünf Bereiche mit Quelle-Überschrift und Seiten (`BEREICHE`; Tabelle im README);
  - eigene Stückliste der Fachkraft: Titel (höchstens 120 Zeichen, `TITEL_MAX`), Bereich, Monat, Herkunft (vier feste Optionen, `HERKUNFT`); die Stückliste gilt nur bis zum Neuladen;
  - Monatsübersicht mit Häkchen je Monat und Bereich; Zählung je Monat ohne Gesamtzahl und ohne Quote;
  - fünf Festbeispiele aus S. 174 (`FESTE_QUELLE`) und fünf eigene Festvorschläge, gekennzeichnet als „Vorschlag, nicht aus der Quelle“;
  - Jahresbogen zum Drucken: zwölf Monate, fünf Bereiche, leere Linien;
  - keine Liederliste, keine Anfrage an fremde Adressen, nur die Häkchen werden gespeichert (`mjp.stand`).
- Lücke:
  - Kein Repertoire: Die Liste mit Titeln aus S. 161–173 ist nicht gebaut. Gemeinfreiheit ist nicht belegt; die Quelle nennt Autorinnen und Autoren (A10, Abschnitt 9).
  - Keine Jahreskreis-Zuordnung: Die Quelle gibt keine vor.
  - Keine Suche über ein Repertoire, weil keines vorhanden ist.
  - Die Monatshäkchen sind Erinnerung (Eigenentwurf), keine Auswertung.
- Bildschirme: Bereichsübersicht; Stückliste mit Anlegen und Entfernen; Monatsübersicht mit Häkchen; Festseite; Druckknopf für den Jahresbogen.
- Ablauf: Stück anlegen (Titel, Bereich, Monat, Herkunft) → Häkchen im Monat setzen → Jahresbogen drucken.
- Was gedruckt wird (Soll): der Jahresbogen mit zwölf Monaten und den fünf Bereichen als Zeilen zum Ausfüllen von Hand. Keine Zählung, keine Namen, keine Kästchen. Eingabeelemente fallen im Druck weg (`druck.css`).

## 4. Daten

Keine Datendatei. Die Festbeispiele stehen als Konstante in `apps/musik-jahresplaner/logik.mjs` (`FESTE_QUELLE`, `FEST_SEITE` = 174). Der gespeicherte Stand liegt im Browser unter dem Schlüssel `mjp.stand` und enthält nur die Häkchen. Ziel-Form für eine Auslagerung der Festbeispiele, Vorlage-Form mit einer Beispielzeile:

```json
{ "id": "fest-neujahr", "titel": "Новый год", "quelle": { "seite": "S. 174" }, "uebersetzung": "Neujahr (Eigenentwurf)", "eigenentwurf": true }
```

Datei bei Auslagerung: `apps/musik-jahresplaner/daten/feste.json`. Eine Auslagerung ist nur nötig, wenn weitere Feste dazukommen.

## 5. Pseudocode

```
ladeStand(text) -> Stand
  Schritt 1: Wert unter SCHLUESSEL "mjp.stand" aus localStorage lesen; Zugriff in try/catch
  Schritt 2: bei Fehler oder fehlendem Eintrag: leererStand()
  Schritt 3: normalisiereStand(roh) übernimmt nur die Häkchen; Titel werden verworfen

speichereHaken(stand) -> Ergebnis
  Schritt 1: gespeicherterStand(stand) bildet nur die Häkchen, ohne Titel
  Schritt 2: localStorage.setItem(SCHLUESSEL, ...) in try/catch
  Schritt 3: bei Fehler Hinweistext (Eigenentwurf): der Stand gilt nur bis zum Neuladen

pruefeStueck(eingabe) -> Fehlerliste
  Schritt 1: titel ist nicht leer und hat höchstens TITEL_MAX (120) Zeichen
  Schritt 2: bereich ist Element von BEREICHE (fünf IDs)
  Schritt 3: monat ergibt über gueltigerMonat(monat) einen Wert von 1 bis 12
  Schritt 4: herkunft ist Element von HERKUNFT (vier Optionen)

fuegeStueckHinzu(stand, eingabe) -> Stand
  Schritt 1: pruefeStueck(eingabe); bei Fehlern den Stand unverändert zurückgeben
  Schritt 2: id = naechsteId(stand.stuecke); Eintrag anhängen
  Schritt 3: Titel bleiben im Speicher der Seite und gehen nicht in speichereHaken

umschalteHaken(stand, monat, bereich) -> Stand
  Schritt 1: schluessel = hakenSchluessel(monat, bereich)
  Schritt 2: istHaken(stand, monat, bereich) wahr: Haken entfernen; sonst setzen
  Schritt 3: speichereHaken(neuer Stand)

zaehleProMonat(stand) -> {1 bis 12: Anzahl}
  Schritt 1: je Stueck das Feld monat zählen
  Schritt 2: Ausgabe je Monat; keine Gesamtzahl, keine Quote, keine Bewertung

festeAnregungen() -> Liste
  Schritt 1: FESTE_QUELLE (fünf Einträge, seite 174) mit Kennzeichnung der Übersetzung als Eigenentwurf
  Schritt 2: FESTE_VORSCHLAEGE mit KENNZEICHNUNG_VORSCHLAG
  Schritt 3: keinem Monat zuordnen; die Fachkraft wählt den Monat

druckGliederung() -> Gliederung
  Schritt 1: zwölf Monate (MONATE) mal fünf Bereiche (BEREICHE)
  Schritt 2: je Zelle eine leere Linie; keine Häkchen, keine Titel, keine Zählung
```

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Werkzeuge ohne Nutzerdaten speichern nichts. Ist-Stand: nur die Häkchen unter `mjp.stand`; Löschknopf vorhanden (README, GDD). Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Ist-Stand: keine Anfrage an fremde Adressen (GDD, Browserprobe).
- [ ] Keine Eingabefelder (Projektregel der Vorlage). Ist-Stand: Eingabefelder für Stücke vorhanden (Titel, Bereich, Monat, Herkunft); Erwachsenen-Werkzeug; Entscheidung in Abschnitt 9.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Ist-Stand: keine Ampel, keine Rangliste, keine Gesamtzahl (GDD).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Ist-Stand: Jahresbogen ohne Häkchen, Kästchen und Namenszeile (GDD).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50). Ist-Stand: Browserprobe bei 390 px (GDD); 360 px und Knopfhöhe offen.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ (docs/02 Z. 151–152). Ist-Stand: Der Jahresbogen trägt keine Seitenangabe; die Markierung ist für die Anzeige ergänzen, sobald Seiten erscheinen.
- [ ] Keine Modellnamen in Dateien. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden, laut README und GDD 34 Tests): Quellangaben wörtlich, feste Optionen, Prüfregeln der Stückliste, Bereinigen des gespeicherten Stands, Druckregeln, keine externen Adressen.
- `test/regeln.test.mjs` (fehlt, anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Speicherschlüssel nur `mjp.stand`, Druckbogen ohne Eingabeelemente, keine Zeichen im Druck, keine Modellnamen.
- Die Oberfläche ist nicht durch Unit-Tests abgedeckt (GDD); die Browserprobe ist Pflicht.

## 8. Abnahme

- `node --test apps/musik-jahresplaner/test/*.test.mjs` grün; Testzahl 34 in README und GDD stimmt.
- Browser bei 360 px: Stück anlegen, Häkchen setzen, Neuladen, Entfernen, Löschknopf, Druckansicht ohne Eingabeelemente, kein Überlauf.
- Druck: Jahresbogen zeigt keine Zählung, keine Namen, keine Häkchen.
- Registrierung nur durch den Koordinator. Zahl der speichernden Apps im Impressum prüfen (GDD, Abschnitt 5).

## 9. Offen

- Repertoire: nur nach Rechteprüfung (A10). Gemeinfreiheit ist für mehrere Autorinnen und Autoren der Quelle nicht belegt (Befund der App).
- Festvorschläge Erntedank, St. Martin, Advent, Fasching und Frühlingsfest: übernehmen, streichen oder ergänzen (GDD, Offen).
- Reihenfolge der Monate: Januar bis Dezember. Ein Kitajahr ab September wäre eine eigene Entscheidung.
- Deutsche Bereichsbezeichnungen (Eigenbenennung, zur Abnahme).
- Überschrift des Bereichs Instrumente: Die Quelle nennt auf S. 170 „Обучение элементам нотной грамоты“ (S. 170) mit dem Zusatz „игре на музыкальных инструментах“ (S. 170). Die App zeigt die Fassung der Quelle; bitte bestätigen.
- Eingabefelder im Erwachsenen-Werkzeug: Regel klären (Vorlage: keine Eingabefelder).
- Katalogeintrag Nr. 87: Die Gesamtzahl „über 280“ ist nicht belegt; die Jahreskreis-Zuordnung ist nicht aus der Quelle. Katalog-Korrektur.
- Export der Stückliste nur als Druck; eine Datei-Ausgabe ist nicht vorgesehen. Gewünscht? (GDD, Offen).
- Feste im Plan: eigene Planungseinträge oder nur Anregung? (GDD, Offen).
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Zitatgrenze: dieser Bauauftrag nutzt höchstens 6 Wörter (docs/10). A10 fragt, ob 12 gelten sollen (offen).
