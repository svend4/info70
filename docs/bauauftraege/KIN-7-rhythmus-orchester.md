# Bauauftrag KIN-7: Rhythmus-Orchester

Status: teilweise · Abschnitt: Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290) · Ziel: Ausbau von apps/rhythmus-orchester
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 163 (163–172), Abschnitt „Обучение элементам нотной грамоты, игре на музыкальных инструментах“ auf S. 170, Gruppe „Почемучки“ auf S. 170 und 172.
- Zitate (höchstens 12 Wörter, mit Seite):
  - „прохлопывать, протопывать“ (S. 163)
  - „на музыкальной лесенке“ (S. 163)
  - „обучать игре в ритмическом оркестре“ (S. 170)
  - „с чередованием вступления музыкальных инструментов“ (S. 170)
  - „формировать умение слаженно играть“ (S. 171)
  - „Рекомендуемый музыкальный репертуар для ритмического оркестра“ (S. 172)
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft, 6 Zitate, alle auf der angegebenen Seite gefunden.
- Katalogangaben zu Zielgruppe, Typ und Adaptation stammen aus docs/10 Z. 285.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 5–7 (kurze eigenständige Einheiten), 3–5 nur in Ko-Nutzung, 8–12 als Kernzielgruppe mit Mehrstimmigkeit (Katalog, docs/10 Z. 285). Die GDD der App nennt 5–7 als Hauptgruppe und 8–12 als Vertiefung. Die Gewichtung ist offen (Abschnitt 9).
- Verwendung: Bildschirm, mit Körper-Percussion (klatschen, stampfen, schnipsen). Kein Druck.
- Typ und Aufwand: Simulator + WebAudio, Aufwand L (Katalog).
- Adaptation (Eigenentwurf, übernommen aus docs/10 Z. 285): Rhythmusbausteine aus deutschen Kinderreimen und Abzählversen mit eigenen Texten; uk/ru-Reim-Rhythmen als Herkunftsoption (noch nicht gebaut); visuelles Metronom als Alternative zum Hören.
- Lernziele, prüfbar:
  1. Kind klatscht, stampft oder schnipst einen Vier-Schlag-Takt mit, während das Metronom auf jedem Schlag leuchtet. (Eigenentwurf; Grundlage S. 163)
  2. Kind wartet auf seinen Einsatz und setzt in der Phrase ein. (Eigenentwurf; Grundlage S. 170)
  3. Kind spielt drei Stimmen nacheinander und hört jede Stimme einzeln an. (Eigenentwurf)

## 3. Funktion

- Bildschirme oder Blätter: Startbildschirm mit drei Modi: „Vers mitmachen“, „Rhythmus nachbauen“, „Orchester“.
- Ablauf (App heute, laut GDD):
  - Vers mitmachen: Vers wählen → Verszeilen mit Silben unter jedem Schlag → Rhythmus vorspielen (Metronom und Klatschen) → Vers vorlesen, Tempo 60/80/100 → Mitmach-Knöpfe Klatschen, Stampfen, Schnipsen.
  - Rhythmus nachbauen: App klatscht vier Schläge → Kind legt Bausteine ta, ti-ti, Pause → nach dem vierten Baustein Auflösung im Klartext.
  - Orchester: drei Stimmen mit eigenem Ostinato, einzeln an- und abwählbar; „Nacheinander einsetzen“ spielt vier Phrasen; „Stopp“ bricht ab.
- Katalog verlangt zusätzlich (docs/10 Z. 285): Das Kind tippt Rhythmen zu einer generierten Melodie; Klatschen und Stampfen als Tap-Flächen; wechselnde Einsätze mehrerer Instrumente.
- Heute vorhanden: Tap-Flächen (Klatschen, Stampfen, Schnipsen) und gestaffelte Einsätze. Nicht vorhanden: eine generierte Melodie (Grep auf „Melodie“ in app.mjs, logik.mjs und index.html ohne Treffer). Lücke: siehe Abschnitt 9.
- Was gedruckt wird: nichts. Der Katalog sieht keinen Druck vor.

## 4. Daten

Datei: `apps/rhythmus-orchester/daten/rhythmen.json` (Bausteine, Verse, Stimmen). Das Feld quelle fehlt heute (Grep geprüft). Schema mit einer Beispielzeile:

```json
{ "id": "katze", "titel": "Katzen-Vers", "quelle": { "seite": "S. 170" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
bausteinVon(id) -> Baustein                                (bestehend)
schlaegeVon(muster) -> Zahl                                (bestehend)
baueMuster(waehle, laenge = 4) -> Muster                   (bestehend; waehle ist der uebergebene Zufall)
  Schritt 1: fuer jeden Schlag waehle(BAUSTEINE) aufrufen
  Schritt 2: passtInTakt(muster, laenge) pruefen, sonst neu ziehen
  Schritt 3: nie nur Stille zurueckgeben
erzeugeMelodie(muster, tonleiter, waehle) -> Melodie       (Eigenentwurf, neu)
  Schritt 1: fuer jeden Schlag des Musters einen Ton aus tonleiter mit waehle waehlen
  Schritt 2: Rueckgabe { schlaege: muster, tonhoehen: Liste }
  Schritt 3: pruefeMelodie(melodie, tonleiter) aufrufen; bei Fehlern keine Rueckgabe
pruefeMelodie(melodie, tonleiter) -> Liste der Fehler      (Eigenentwurf, neu)
  Schritt 1: Anzahl tonhoehen gegen schlaegeVon(melodie.schlaege) vergleichen
  Schritt 2: jeden Ton gegen tonleiter pruefen
  Schritt 3: leere Liste bedeutet gueltig; pruefeDaten(daten) ruft diese Pruefung je Melodie auf
spieleMelodie(melodie, bpm, ausgabe) -> keine Rueckgabe    (Eigenentwurf, neu)
  Schritt 1: zeiten = anschlaege(melodie.schlaege, bpm)     (bestehend)
  Schritt 2: je Zeitpunkt einen WebAudio-Oszillator mit tonhoehen[i] starten
  Schritt 3: laufende Wiedergabe mit dem Generationszaehler abbrechen (bestehendes Muster)
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). App-Stand laut README und GDD: speichert nichts.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). App-Stand laut GDD: keine externen Anfragen (NetzwerkWaechter). CSP nicht geprüft.
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Prüfung ausstehend.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). App-Stand laut README: ohne Punkte und ohne Zeitmessung.
- [ ] Druck: entfällt, kein Druckteil.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50). Prüfung ausstehend (Abnahme, Abschnitt 8).
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe. Diese Einheit hat Seitenangaben (Abschnitt 1); die Markierung lautet: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs`: vorhanden, 8 Tests (Grep-Zählung; GDD nennt 8). Prüft Datenbestand, Bausteine, `anschlaege`, `musterRichtig`, `baueMuster`, Silbentext, `stimmenFuerPhrase` und zehn Negativ-Proben von `pruefeDaten`.
- `test/regeln.test.mjs`: fehlt. Die Vorlage verweist auf `apps/puppentheater-werkstatt/test/regeln.test.mjs`. Offen (Abschnitt 9).
- Neue Tests für `erzeugeMelodie`, `pruefeMelodie` und `spieleMelodie` (Eigenentwurf).

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt. Status: nicht ausgeführt. In package.json fehlt ein Skript `test` (Grep). Lauf laut README: `node --test apps/rhythmus-orchester/test/*.test.mjs`. README nennt keine Zahl, GDD nennt 8.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, nur localhost. Ausstehend.
- Druck: entfällt.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog). Ausstehend.

## 9. Offen

- Standard für die Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; die Angaben stehen in Abschnitt 1 und in den Daten als „quelle“. Das Feld quelle fehlt in rhythmen.json noch.
- Lücke (teilweise): Die generierte Melodie aus docs/10 Z. 285 ist nicht umgesetzt. Entscheidung: ausbauen (Abschnitt 5) oder Katalogeintrag ändern.
- Zielgruppe: Der Katalog nennt 8–12 als Kernzielgruppe; GDD und README nennen 5–7 als Hauptgruppe. Entscheidung nötig.
- Vorlesefunktion (F2): Die Regel gilt laut docs/02-Checkliste; apps/rhythmus-orchester/app.mjs ruft vorlesen() auf.
- Favicon (A3): offen, betrifft alle Apps.
