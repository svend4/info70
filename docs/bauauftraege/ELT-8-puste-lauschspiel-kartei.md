# Bauauftrag ELT-8: Puste- und Lauschspiel-Kartei

Status: teilweise · Abschnitt: Eltern-Werkzeuge · Ziel: Ausbau von apps/puste-lauschspiel-kartei
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 67 (67–68), Abschnitt „Звуковая культура речи“ (S. 67), Gruppe „МАЛЫШИ“ (S. 68).
- Katalogeintrag: docs/10, Zeile 363, Eintrag Puste- und Lauschspiel-Kartei.
- Faktenstand laut index.json: faktengeprüft.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Звуковая культура речи“ (S. 67): Abschnitt Lautkultur der Sprache.
  - „фонематического слуха“ (S. 67): Gehör für Laute als genanntes Ziel.
  - „слижем с губ варенье“ (S. 67): Lippenspiel, im Bestand nicht enthalten.
  - „Кто как кричит“ (S. 67): Hörspiel, wer ruft wie.
  - „Отгадай, на чем играют“ (S. 68): Hörspiel, Instrument erraten.
  - „подуй на снежинки“ (S. 68): Pustespiel, Schneeflocken.
  - „надуй пузырь“ (S. 68): Pustespiel, Blase aufpusten.
- Keine ganzen Sätze aus dem Buch. Sätze werden ohne Anführungszeichen umschrieben und mit Seitenangabe belegt: Die Quelle nennt Atem- und Hörspiele als Weg zur Lautkultur (S. 67–68).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet. Dazu gehören die deutschen Übungsnamen und die Register-Einteilung.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Eltern und Erzieher, Kinder 2–3 (Katalog). Verwendung: Bildschirm als Kartei-Ansicht, Druck der Karten.
- Lernziele, prüfbar:
  1. Erwachsener findet zu jedem Spiel eine kurze Anleitung und sieht, zu welchem Register es gehört (Eigenentwurf).
  2. Erwachsener erkennt beim Pustespiel, dass es nichts trainiert, und spielt es als Spiel (Eigenentwurf; Zielbezug S. 67–68).
  3. Kind spielt Laut-, Hör- und Pustespiele ohne Punkte, ohne Quiz und ohne Ergebnis (Eigenentwurf; Bezug „Кто как кричит“ (S. 67)).

## 3. Funktion

- Bildschirme oder Blätter: Kartei-Ansicht mit den drei Registern pustespiel, lautspiel und lauschspiel; Karte je Spiel mit Anleitung und Registerhinweis; Druckfassung ohne Haken, Punkte und Namenszeile (druck.css vorhanden).
- Ablauf: Register wählen → spieleIm(daten, register) → Spielkarte mit spielText(spiel) → Anzeige oder Druck.
- Was gedruckt wird: eine Spielkarte je Blatt A4 hoch, mit Registerhinweis; Pustespiele mit dem Satz, dass nichts trainiert wird (Eigenentwurf-Formulierung).
- Bestand laut Datei: zehn Spiele, je drei Pustespiele, Lautspiele und Lauschspiele mit vier Lauschspielen.
- Befund zur Quelle: das Versprechen der Quelle, die Übungen bildeten die Grundlage der Artikulation, ist zurückgenommen (docs/10, Abweichung Welle 79). Das Pustespiel-Register darf kein Wirkversprechen tragen.
- Lücken laut Befund (Ausbau):
  - Die Übung „слижем с губ варенье“ (S. 67) fehlt im Bestand. Die Ausschlussliste der Datei ist zu prüfen, ob sie dort mit Begründung steht.
  - Kartentexte in uk und ru fehlen bewusst (GDD Abschnitt 8).
  - Die Lautfolge der deutschen Konsonanten steht als Beruhigung, nie als Ziel (Eigenentwurf nach deutscher Fachliteratur; die Quelle nennt eine russische Reihenfolge, die nicht übertragbar ist).

## 4. Daten

Datei: `apps/puste-lauschspiel-kartei/daten/kartei.json`. Vorhandene Schlüssel: hinweis, keinTrainingsversprechen, wasBleibt, keinQuiz, keineUebersetzung, abbruch, wennSorge, mehrsprachig, lautstaerke, pusteRegister, spiele (10), physiologisch, lauterwerb, ausgeschlossen, quelle. Jedes Spiel hat id, register, titel und die Pflichtfelder seines Registers. Schema mit einer Beispielzeile für neue Spiele:

```json
{ "id": "p-schneeflocken", "register": "pustespiel", "titel": "Schneeflocken pusten", "quelle": { "seite": "S. 68" }, "eigenentwurf": true }
```

Die Seitenangabe gilt für den Quellbegriff; die deutschen Titel sind Übersetzungen und daher `eigenentwurf: true`.

## 5. Pseudocode

```
pruefeDaten(daten) -> Liste der Fehler (leer = gültig)
  jedes spiel.register ist in REGISTER (pustespiel, lautspiel, lauschspiel)
  jedes Pustespiel hat die Pflichtfassung zum Nichttrainieren (REGISTER_MIT_DEMENTI)
  jedes Lautspiel hat den Sprachgrund (REGISTER_MIT_SPRACHGRUND)
  jedes Lauschspiel entschärft das Raten (REGISTER_MIT_RATEN)
  kein Text trifft WIRKVERSPRECHEN, PRUEFUNG oder UEBUNG_AM_MUND
  jedes Spiel mit eigenentwurf == false hat quelle.seite

spieleIm(daten, register) -> Liste der Spiele des Registers, sortiert nach id

registerMitSpielen(daten) -> Liste der Register mit mindestens einem Spiel

spielVon(daten, id) -> Spiel oder undefined

spielText(spiel) -> { titel, anleitung, registerhinweis }
  keine Punkte, keine Runden, kein Ergebnis im Text (Test)
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Befund: kein localStorage-Schlüssel (app.mjs Zeile 12, Kommentar).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Prüfung in der Abnahme.
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Befund: keine Eingabefelder in app.mjs gefunden.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Befund: Sperrmuster PRUEFUNG in logik.mjs (Zeile 55).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Prüfen an druck.css und an der Druckfassung.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung: Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt; bewusst weggelassen laut GDD Abschnitt 8).

## 7. Tests

- `test/logik.test.mjs` (vorhanden): Register, Pflichtfassungen je Register, Sperrmuster für Wirkversprechen, Prüfung und Übungen am Mund, spielVon, spieleIm, registerMitSpielen, spielText. Ausbau: Prüfung der Ausschlussliste auf „слижем“ als Eintrag mit Begründung.
- `test/regeln.test.mjs` (neu, nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Druck, Namenszeile, Zeichen, Eingabemuster.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein horizontaler Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick, Speicher gleich null, nur localhost.
- Druck: Zahl gedruckter Karten gleich Auswahl; keine Zeichen; Pflichtmarkierung je Karte mit Seitenangabe.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Die Übung „слижем с губ варенье“ (S. 67) fehlt im Bestand. Entscheidung, ob sie in die Ausschlussliste mit Begründung gehört.
- Kartentexte uk und ru: der Katalog verlangt sie, die App lässt sie bewusst weg. Entscheidung, ob nachgeholt oder begründet bleibt.
- Die deutsche Lautfolge ist Eigenentwurf; für Vokale ist keine Erwerbsreihenfolge belegt. Bestätigung offen.
- Hyperventilations-Warnung wird bewusst nicht gedruckt (docs/10, Abweichung Welle 79).
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard für neue Apps: keine Seitenzahl auf dem Druckblatt; Seitenangaben stehen in Abschnitt 1 und in den Daten im Feld quelle.
- Vorlesefunktion (F2), Favicon (A3).
- Offline-Test (F4): Neuladen ohne Netz wird berichtet, ist aber keine Abnahmebedingung.
