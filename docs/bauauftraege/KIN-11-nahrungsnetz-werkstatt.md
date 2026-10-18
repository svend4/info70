# Bauauftrag KIN-11: Nahrungsnetz-Werkstatt (Oekosystem-Simulator)

Status: teilweise · Abschnitt: Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) · Ziel: Ausbau von apps/nahrungsnetz-werkstatt
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 211 (211–212), Abschnitt „Природные сообщества“ (S. 211), Gruppe „Фантазеры“ (S. 212).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Природные сообщества“ (S. 211)
  - „Наш общий дом“ (S. 211)
  - „этажи леса“ (S. 211)
  - „пищевые цепочки“ (S. 212)
  - „клевер—косуля—волк“ (S. 212)
  - „Красная книга Беларуси“ (S. 212)
- Inhalt in eigenen Worten: In jeder Lebensgemeinschaft stehen 3 bis 4 typische Tiere und Pflanzen (S. 211). Je Gemeinschaft gibt es 1 bis 2 Nahrungsketten (S. 212). Der Schutz seltener Arten ist ein eigenes Thema (S. 212).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Faktenstand laut index.json: Quelle nicht im Repo prüfbar. Die Datei liegt auf main (docs/fragen-und-hinweise.md, B1). Für diesen Auftrag wurde gegen die Textkopie geprüft.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 8–12 eigenständig, 5–7 in Ko-Nutzung (docs/10, Katalogeintrag; GDD Abschnitt 2). Verwendung: Bildschirm.
- Lernziele, prüfbar (Eigenentwurf; die Quelle liefert die Themen, S. 211–212):
  1. Kind nennt zu einer Nahrungskette, welches Glied von welchem Glied lebt.
  2. Kind ordnet die Glieder einer Kette in der Reihenfolge Pflanze, Pflanzenfresser, Fleischfresser.
  3. Kind sieht nach einer Änderung eines Bestands die Folge für das nächste Glied.
  4. Kind erkennt, dass das Modell vereinfacht ist. Die App sagt das ausdrücklich (README).

## 3. Funktion

- Bildschirme: Auswahl der Lebensgemeinschaft (Wald, Wiese, Teich). Ansicht mit Arten und Beständen von 0 bis 5 als Balken. Erklärfeld mit der Kettenwirkung und einer Warnung, wenn ein Glied verschwindet, vorlesbar. Schaltfläche für den Rückweg zum Gleichgewicht (Eigenentwurf).
- Ablauf: Lebensgemeinschaft wählen → Art wählen → mehr oder weniger → ein Simulationsschritt (simuliere) → Erklärung (erklaere) → Rückweg zum Ausgangsbestand.
- Ist-Stand (README, GDD): drei Gemeinschaften mit mitteleuropäischen Arten. Rote-Liste-Markierung für geschützte Arten. Ein Simulationsschritt. Erklärung der Kettenwirkung. Vorlesen. Hinweis auf das vereinfachte Modell. Werbefrei, ohne Konten, ohne externe Anfragen.
- Der Katalog verlangt (docs/10, Z. 289): Kinder bauen 1 bis 2 Nahrungsketten, verschieben Bestände und sehen die Folgen. Die App erfüllt das Verschieben und das Sehen der Folgen. Die Ketten stehen fest in daten/netze.json, das Kind baut keine Kette selbst. Diese Lücke steht unter Abschnitt 9.
- Die Etagen des Waldes (S. 211) erscheinen in der App nicht. Das ist eine optionale Erweiterung (Eigenentwurf).
- Druck: nicht vorgesehen.

## 4. Daten

Datei: `apps/nahrungsnetz-werkstatt/daten/netze.json` (vorhanden). Die Felder quelle und eigenentwurf fehlen bisher (Abschnitt 9). Schema mit einer Beispielzeile. Die deutschen Arten sind eine Anpassung des Beispiels auf S. 212 (Eigenentwurf):

```json
{ "id": "wald-klee-reh-wolf", "titel": "Klee – Reh – Wolf", "quelle": { "seite": "S. 212" }, "eigenentwurf": true }
```

## 5. Pseudocode

Vorhanden in logik.mjs: simuliere, erklaere, startBestand, pruefeNetze. Alle anderen Funktionen sind (Eigenentwurf).

```
pruefeKettenQuelle(netz: {id, gemeinschaft, glieder: Art[], quelle: {seite}}, arten: Art[]) -> Fehler[]
  glieder hat 2 bis 3 Einträge, sonst Fehler "Kettenlänge"
  jedes Glied steht in arten, sonst Fehler "unbekannte Art" mit dem Namen
  quelle.seite ist gesetzt, sonst Fehler "Seitenangabe fehlt"
  -> leere Liste heißt: gültig

baueKettenAufgabe(netze: Netz[], gemeinschaft: wald | wiese | teich, zufallsReihe: Zahl[]) -> Aufgabe
  kandidaten = netze mit netz.gemeinschaft == gemeinschaft
  netz = kandidaten[zufallsReihe[0] mod Länge(kandidaten)]
  gemischt = netz.glieder mit Fisher-Yates-Mischung nach zufallsReihe[1..]
  -> {netzId: netz.id, glieder: gemischt, richtig: netz.glieder}

pruefeReihenfolge(gewaehlt: Art[], richtig: Art[]) -> {ok: Boolean, fehlerIndex: Zahl | null}
  Länge ungleich -> {ok: false, fehlerIndex: 0}
  für i von 0 bis Länge - 1: gewaehlt[i] ungleich richtig[i] -> {ok: false, fehlerIndex: i}
  -> {ok: true, fehlerIndex: null}

erklaereFehler(fehlerIndex: Zahl, richtig: Art[], netze: Netz[]) -> Text
  art = richtig[fehlerIndex]
  nahrung = Nahrungsbeziehung von art laut netze
  -> vorlesbarer Satz: welches Glied von welchem lebt

simuliere(bestand: Bestand, eingriff: {art, menge}) -> Bestand
  ein Schritt: mehr Beute, mehr Räuber; mehr Räuber, weniger Beute
  Werte auf 0 bis max begrenzen; die Eingabe bleibt unverändert
```

Die Zufallsreihe kommt als Parameter. Die Logikdatei enthält keine Zufallsquelle.

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Ist-Stand: kein Speicheraufruf in app.mjs und logik.mjs gefunden. README und GDD nennen eine lokale Anzeige-Einstellung; die geteilten Bausteine sind nicht geprüft. Zur Abweichung zu docs/02 Z. 25–26 siehe Abschnitt 9.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Ist-Stand: NetzwerkWaechter laut README. Der einzige Abruf ist daten/netze.json (lokal).
- [ ] Keine Eingabefelder (Projektregel; docs/02 enthält dazu keine Zeile). Ist-Stand: Bedienung über Schaltflächen laut README.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Ist-Stand: keine Punkte und keine Ränge gefunden. Der Ausbau führt keine Rangliste ein.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Nicht zutreffend, kein Druck geplant.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50). In diesem Auftrag nicht gemessen; Browser-Prüfung in Abschnitt 8.
- [ ] Lernziele in der README als Liste (docs/02 Z. 42–43). Ist-Stand: nicht erfüllt. Die README beschreibt Funktionen, keine Lernziele.
- [ ] Vorlesen (docs/02 Z. 44). Ist-Stand: vorhanden laut README. F2 entfällt für diese App.
- [ ] Pflichtmarkierung: Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft. (docs/02 Z. 151–152)
- [ ] Keine Modellnamen in Dateien. Modellnamen-Entscheidung A1 bleibt offen (docs/fragen-und-hinweise.md).
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden, GDD Abschnitt 6): Netze gültig (Produzent, Ketten auf echte Arten, Nahrung für Nicht-Produzenten). Arten und Rote Liste. startBestand. Wolf weg, Reh steigt. Mehr Reh, Wolf steigt und Pflanze sinkt. Begrenzung auf 0 bis max, Original unverändert. erklaere (Richtung, Folgen, Warnung). artName.
- Neu: pruefeKettenQuelle (Länge 2 bis 3, unbekannte Art, fehlende Seite), baueKettenAufgabe (gleiche Zufallsreihe ergibt gleiche Aufgabe), pruefeReihenfolge (Längenfehler, erster Fehlerindex).
- `test/regeln.test.mjs` (neu, nach Vorlage apps/puppentheater-werkstatt/test/regeln.test.mjs): kein Speicheraufruf in app.mjs und logik.mjs; kein Eingabefeld; einziger Abruf daten/netze.json; keine Wörter für Punkte oder Rang in Kindertexten.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt (docs/02 Z. 110–111). Ist-Stand: weder README noch GDD nennen eine Zahl.
- Browser bei 360 px: kein Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick, Speicher gleich null, nur localhost.
- Druck: nicht zutreffend.
- Test mit Kindern der Zielgruppe vor dem Release (docs/02 Z. 45–46).
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Lücke Funktion: Das Kind baut keine Kette (docs/10 Z. 289). Entscheidung: Kettenbau als Ausbau oder Katalogtext anpassen.
- Erweiterungen aus GDD Abschnitt 7 (Mehrschritt-Simulation, Zersetzer-Ebene, Kopplung mit jahreszeiten-rad) gehören nicht zu diesem Auftrag.
- Etagen des Waldes (S. 211): optional, nicht in der App.
- Daten: netze.json ohne Felder quelle und eigenentwurf.
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt. Sie stehen in Abschnitt 1 und in den Daten als quelle. Hier notiert.
- Seitenangaben ohne Markierung „проверено человеком“ (A18, docs/02 Z. 151–152).
- Speicherung: docs/02 Z. 25–26 erlaubt localStorage für Nutzerdaten mit Löschknopf. Die Vorlage verbietet Speicherung. Entscheidung offen. Die geteilten Bausteine (kinder-ui) sind zu prüfen.
- Lernziele fehlen in der README als Liste (docs/02 Z. 42–43).
