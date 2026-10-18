# Bauauftrag GEM-16: Design-Entdecker: praktisch und schön

Status: teilweise · Abschnitt: Gemeinsame Apps 3–5 · Ziel: Ausbau von apps/design-entdecker/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 176 (176–178), Abschnitte „Дизайн предметов бытового назначения“ (S. 178) und „Архитектура“ (S. 178), Gruppe „Почемучки“ (S. 176).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „связи между функциями“ (S. 176)
  - „удобно и красиво“ (S. 176)
  - „чашки, сумки, лампы, стулья“ (S. 176)
  - „детский сад, жилой дом“ (S. 176)
  - „Дизайн предметов бытового назначения“ (S. 178)
  - „Дизайн интерьера“ (S. 178)
  - „памятники архитектуры“ (S. 178)
  - „здание железнодорожного вокзала“ (S. 178)
- Umschrieben, ohne Anführungszeichen: Die Seiten nennen Ziele zum Zusammenhang von Nutzen und Form bei Alltagsgegenständen und Räumen, zur Vielfalt der Gebäudearten und zur Architektur der eigenen Umgebung, zur Verpackungsgrafik sowie zu Gestaltungsmitteln wie Ornament, Form und Farbe (S. 176–178).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit (Eigenentwurf) gekennzeichnet. Dazu gehören die drei Geltungsarten und das Häuser-Rätsel.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 3–5 Jahre gemeinsam mit einem Erwachsenen; 5–7 kurz auch allein (Katalog; README: 3–5 mit einem Erwachsenen, 5–7 kurz und selbständig). Verwendung: Bildschirm mit Gesprächsimpulsen für Erwachsene. Druck ist nicht gebaut.
- Lernziele, prüfbar:
  1. Kind nennt zu einer Alltagsform, zum Beispiel dem Henkel an der Tasse, mindestens zwei Gründe, davon einen positiv formuliert (Eigenentwurf; Grundlage „связи между функциями“ (S. 176)).
  2. Kind unterscheidet Fragen mit Probe, Fragen der Vereinbarung und Geschmacksfragen ohne Antwort (Eigenentwurf; Grundlage „удобно и красиво“ (S. 176) als Unterscheidung von Nutzen und Schönheit).
  3. Kind erkennt Bauformen wie Fachwerk, Backsteinkirche oder Bahnhof; Kita und Bahnhof werden bewusst nicht abgefragt (Eigenentwurf; Grundlage „памятники архитектуры“ (S. 178) und „детский сад, жилой дом“ (S. 176)).

## 3. Funktion

- Bildschirme oder Blätter: Gate für Erwachsene; Frage-Bildschirm mit Geltungsart; eigener Bildschirm für Geschmacksfragen ohne Lösung; Versuche (Proben) mit Plan B; Häuser-Teil mit Vorlese-Knopf; Bildschirm mit Materialgrenzen; Abschluss „Bildschirm aus“ mit drei Offline-Ideen; `eltern.html` im Eltern-Sammelband (README, GDD).
- Ablauf: Gate → höchstens sechs Fragen (`PRO_SESSION = 6`) → Antwortknöpfe, gemischt nur einmal → Rückmeldung nach Geltungsart → Gesprächsimpuls in Frageform → Häuser-Teil → Materialgrenzen → Abschluss.
- Was gedruckt wird: nichts.
- Der Katalog verlangt (docs/10, Ko-Nutzung Nr. 16): Foto- und Zeichnungs-Quiz mit Auswahl und Erklärungen; Gebäudearten; Engine quiz-kern. Abweichung: eigenes datengetriebenes Format statt quiz-kern (GDD, Engine). Die Ersetzung der belarussischen Baudenkmäler durch deutsche Umgebungsarchitektur ist umgesetzt.
- Lücke: Bildmaterial (Foto oder Zeichnung) ist in README und GDD nicht beschrieben. Die Engine weicht vom Katalog ab (siehe 9).

## 4. Daten

Datei: `apps/design-entdecker/daten/design.json`. Pflichtfelder je Frage laut GDD §1: `geltung` (pruefbar, ausgemacht oder geschmack); bei pruefbar `probe`, `erwartet`, `wennAnders` und mindestens zwei `gruende`; bei ausgemacht `geltungsbereich`; bei Materialien `grenze`; bei Gebäuden `merkmalsart`, `warumNicht` und `gegenbeispiel`. Schema mit Platzhaltern; Herkunftsangabe als Vorschlag (Eigenentwurf):

```json
{ "id": "…", "geltung": "pruefbar", "gruende": ["…", "…"], "wennAnders": "…", "quelle": { "seite": "S. 176" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
// Namen nach README und GDD. Rückgaben und Parameter sind Eigenentwurf; vor dem Bau gegen app.mjs und logik.mjs abgleichen.
istRichtig(frage, gewaehlt) -> true | false | null
  frage.geltung == "geschmack" -> null (kein Lösungsfeld, nie false)
  sonst                         -> gewaehlt == frage.richtig
geschmacksFrage(frage) -> Bildschirm
  eigener Bildschirm; keine Zählung, keine Mehrheitsanzeige
  Gesprächsimpuls fragt nach dem Warum, nicht nach der Wahl
pruefeDaten(daten) -> Fehlerliste
  pruefbar: probe, erwartet, wennAnders vorhanden; gruende hat mindestens 2 Einträge; erster Grund ohne "nicht" und "kein"
  ausgemacht: Kindertext enthält "bei uns" und "ausgemacht"; geltungsbereich vorhanden
  geschmack: kein Feld richtig, auch nicht mit false; "schön" und "hässlich" nur in Geschmacksfragen
  probe-Texte: keine Wörter aus GEFAHR (heiß, Herd, Backofen, kochend, Kerze, Messer); Wasserversuche mit maxGrad <= 40
  Kindertexte ohne Jahreszahlen, "Jahrhundert", "Ritter", "Mittelalter"
  merkmalsart == "bauform" nur bei gefragten Gebäuden; Kita und Bahnhof mit warumNicht
  jeder Bauform ein gegenbeispiel; material hat grenze
mischeEinmal(frage) -> optionen
  einmal pro Frage; Knöpfe und Vorlesetext lesen dieselbe Liste
  pruefeDaten: Lösung steht nicht in allen Fragen an derselben Position
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). localStorage wird nicht verwendet (README, GDD §9).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Entfällt, da kein Druck.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).
- Hinweis zu dieser Einheit: Die Regeln zu Geschmack und Begründung sind Teil der Schema-Prüfung und dürfen beim Ausbau nicht gelockert werden.

## 7. Tests

- `test/logik.test.mjs` (14 Tests, laut README und GDD): Datengültigkeit; alle drei Geltungsarten vorhanden; Lösungsverbot bei Geschmack; „schön“ nur bei Geschmack; Geltungsbereich im Kindertext; Zwei-Gründe-Pflicht und Positivform; Gefahrensperre der Proben; Gegenbeispiel-Pflicht; Materialgrenze; Bauform-Beschränkung; Verbot von Jahreszahlen und Ritter-Erzählungen; vollständige Sortenanzeige und wandernde Lösungsposition; Sitzungsgrenze; Ton und Abschluss.
- `test/regeln.test.mjs`: fehlt in dieser App. Anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs` (Eigenentwurf).

## 8. Abnahme

- `node --test apps/design-entdecker/test/*.test.mjs` grün (14 Tests, README und GDD stimmen überein).
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, nur `localhost`.
- Impressum und Datenschutzerklärung vor einem Release (docs/02 Z. 160).
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Quiz-Engine (A7): Der Katalog nennt `quiz-kern`; die App verwendet ein eigenes Format. Katalogtext angleichen oder Abweichung bestätigen.
- Foto- oder Zeichnungsmaterial: vom Katalog genannt, in README und GDD nicht beschrieben. Entscheidung und Prüfung der Bildrechte (Eigenentwurf).
- Zitatgrenze (A10 b): 6 oder 12 Wörter offen. Dieser Auftrag und der Prüfer verwenden 6.
