# Bauauftrag GEM-13: Erzaehl-Bruecke

Status: teilweise · Abschnitt: Gemeinsame Apps 3–5 · Ziel: Ausbau von apps/erzaehl-bruecke/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 143 (143), Abschnitt „Развитие связной речи“ (S. 143), Gruppe nicht im Seitenkopf erkennbar (S. 143).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Развитие связной речи“ (S. 143)
  - „структуры связного текста“ (S. 143)
  - „рассказы по содержанию картинки“ (S. 143)
- Umschrieben, ohne Anführungszeichen: Die Seite nennt Ziele zum Nacherzählen und zum Erfinden von Geschichten nach einem Bild, zur Ursache-Folge-Verknüpfung in Sätzen und zum Aufbau eines Textes aus Anfang, Fortsetzung und Schluss (S. 143).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit (Eigenentwurf) gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder ab 5 Jahren (Katalog: 5–7, kurz auch allein; App-README und GDD: 5–8), Verwendung: Bildschirm als Gerüst, Erzählen laut und ohne Aufnahme.
- Lernziele, prüfbar:
  1. Kind erzählt eine Geschichte laut mit Anfang, Fortsetzung und Schluss; die App zeigt dafür vier Stufen (Eigenentwurf, Grundlage S. 143).
  2. Kind verknüpft zwei Ereignisse mit einem Grund in einem Satz mit „weil“ (Eigenentwurf, Grundlage: Ursache-Folge-Verknüpfung auf S. 143).
  3. Kind erzählt in jeder Familiensprache; die App nimmt nichts auf (Eigenentwurf nach README).

## 3. Funktion

- Bildschirme oder Blätter: Startbildschirm mit Erklärung „du erzählst laut, der Computer hört nicht zu“ (vorlesbar); „Geschichte würfeln“ mit Startsatz und vier Stufen mit Impulsfragen; Knopf „Überraschung einbauen“ mit einem Zufallsimpuls; „Neue Geschichte“ und „Start“; `eltern.html` im Eltern-Sammelband (README, GDD §3).
- Ablauf: Start mit Hinweis → Held, Ort und Problem werden gewürfelt → Startsatz → Stufe „Es war einmal“ → „Eines Tages“ → „Aber dann“ → „Am Ende“, je mit Impuls → optional Überraschung → neue Geschichte oder Ende.
- Was gedruckt wird: nichts.
- Der Katalog verlangt (docs/10): Bildimpuls mit Wimmelbild-Szene; Erwachsener bestätigt per Antippen; Weil-Satz-Anstöße wie „Im Winter ziehen wir uns warm an, weil …“. Diese Funktionen sind in README und GDD nicht beschrieben (siehe 9).
- Lücke: Bildimpuls nur als Erweiterung „Bild-Karten statt Text“ (GDD §7). Der Altersbereich der App geht bis 8, der Katalog bis 7. Die Bestätigung durch einen Erwachsenen ist nicht beschrieben.

## 4. Daten

Datei: `apps/erzaehl-bruecke/daten/bausteine.json`. Die Datei enthält `version`, `hinweis` und die Bank mit Helden, Orten, Problemen und der vierstufigen Treppe `anfang`, `los`, `aber`, `ende`. Die Einträge sind heute Textlisten. Vorschlag für eine Herkunftsangabe je Eintrag (Eigenentwurf; alle Bausteine sind Eigenproduktion nach GDD §4):

```json
{ "id": "held-igel", "text": "ein mutiger kleiner Igel", "quelle": { "seite": "S. 143" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
// Funktionsnamen nach README und GDD (waehleElemente, startSatz, baueGeruest, pruefeBausteine).
// Ein- und Ausgaben sind Eigenentwurf; vor dem Bau gegen logik.mjs abgleichen.
waehleElemente(bank, zufall) -> {held, ort, problem}
  zufall(n) liefert einen Index 0..n-1; im Test ein fester Wert (Zufall als Parameter)
  held    = bank.helden[zufall(len(bank.helden))]
  ort     = bank.orte[zufall(len(bank.orte))]
  problem = bank.probleme[zufall(len(bank.probleme))]
startSatz(elemente) -> Text
  setzt held, ort und problem in den Satz "Es war einmal ..."
baueGeruest(elemente, bank) -> [startSatz, anfang, los, aber, ende]
  je Stufe ein Impuls aus der Treppe, vorlesbar
  Impulse sind Fragen oder Satzanfänge ohne Bewertung
pruefeBausteine(bank) -> Fehlerliste
  helden, orte, probleme nicht leer
  Treppe genau vier Stufen in der Reihenfolge anfang, los, aber, ende
  Hinweis "kein Aufnehmen" vorhanden
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Die App speichert nichts (README).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Entfällt, da kein Druck.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).
- Hinweis zu dieser Einheit: Kein Mikrofon, keine Aufnahme, kein localStorage (README). Das muss beim Ausbau erhalten bleiben.

## 7. Tests

- `test/logik.test.mjs`: Bank gültig (Helden, Orte, Probleme; vierstufige Treppe anfang, los, aber, ende); „kein Aufnehmen“-Hinweis; `waehleElemente` mit injizierbarem Zufall; `startSatz` und `baueGeruest` (Startsatz plus vier Impulsstufen).
- `test/regeln.test.mjs`: fehlt in dieser App. Anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs` (Eigenentwurf).
- Testzahl: GDD und README nennen keine Zahl. Bei der Abnahme eintragen.

## 8. Abnahme

- `node --test apps/erzaehl-bruecke/test/*.test.mjs` grün.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, nur `localhost`.
- Keine Medienabfrage (Mikrofon, Kamera) im Quelltext; Prüfung durch Suche im Code (Eigenentwurf).
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Quiz-Engine (A7): Der Katalog nennt `quiz-kern`; die App nutzt einen eigenen Baustein-Generator (GDD, Engine). Entscheidung, ob der Katalogtext angeglichen wird.
- Altersbereich: App 5–8, Katalog 5–7. Entscheidung.
- Bildimpuls (Wimmelbild) und Bestätigung durch einen Erwachsenen: in README und GDD nicht belegt. Bild-Karten nur als Erweiterung. Entscheidung.
- Weil-Satz-Anstöße: in README und GDD nicht belegt. Im Quelltext prüfen; `app.mjs` wurde für diesen Auftrag nicht gelesen.
- uk/ru-Impulse: nur als Erweiterung im GDD (§7).
- Zitatgrenze (A10 b): 6 oder 12 Wörter offen. Dieser Auftrag und der Prüfer verwenden 6.
- Sternchen vor einzelnen Zielen (A11): S. 143 hat ein solches Sternchen; die Bedeutung steht nicht im Text.
