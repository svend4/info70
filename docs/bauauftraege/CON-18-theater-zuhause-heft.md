# Bauauftrag CON-18: Theater zuhause - Bastel- und Spielheft

Status: teilweise · Abschnitt: Content-Pakete, Funktionen, Dokumente · Ziel: Ausbau von apps/theater-zuhause-heft
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 72 (72–73), Abschnitt „Художественно-речевая деятельность“ (S. 72), Gruppe „Малыши“ (S. 72).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „персонажи кукольного театра“ (S. 72)
  - „пальчикового, настольного, театра Петрушки“ (S. 73)
  - „домашних видов театра“ (S. 73)
  - „побуждать родителей“ (S. 73)
  - „ранний возраст“ (S. 6)
- Umschrieben, ohne Anführungszeichen: Die Quelle nennt drei häusliche Theaterformen, Fingertheater, Tischtheater und das Theater Petruschka (S. 73). Sie regt an, Eltern dabei zu unterstützen. Die deutschen Namen Fingertheater, Tischtheater, Handpuppe und Kasper sind Eigenentwurf.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet: Bastelschritte, Materialien, die Namen Handpuppe und Kasper, die fünf Szenen, der Hinweis „kein Bildschirm nötig“.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Eltern mit einem Kind von 1 bis 3 Jahren (Katalog; Quelle S. 6 und S. 72), Verwendung: Druck. Der Bildschirm dient nur der Auswahl.
- Lernziele, prüfbar:
  1. Erwachsene findet über den Filter die Form oder die Szene, die sie sucht.
  2. Erwachsene druckt das ganze Heft; die Blätter liegen in fester Reihenfolge vor (Umschlag, drei Formen, fünf Szenen).
  3. Erwachsene bastelt eine Form nach den Schritten auf der Seite und spielt damit eine Szene (Eigenentwurf).
  4. Kein Feld und kein Text fragt nach einem Kind oder ordnet es ein.

## 3. Funktion

- Bildschirme oder Blätter: Bildschirm mit Filter (alle, Formen, Szenen) und Druckknopf. Druckblätter: Umschlag, drei Formseiten, fünf Szenenseiten. Das sind neun Blätter, je Blatt ein A4-Blatt hoch.
- Ablauf: Filter wählen → Seite lesen → Druckknopf → das ganze Heft in fester Reihenfolge drucken → basteln und spielen (Eigenentwurf).
- Was gedruckt wird: Umschlag mit Titel und Zielgruppe. Je Formseite Bastelschritte (Eigenentwurf) und die Quellenzeile „Praleska, S. 73“. Je Szenenseite Rollen und Text (Eigenentwurf). Auf jeder Seite mit Seitenangabe steht die Pflichtmarkierung (Abschnitt 6).
- Ausbau gegenüber dem Stand: Die App ist als erster Stand gebaut. Zu prüfen sind Browser bei 360 px, der Druck und die Pflichtmarkierung. Bilder und Zeichnungen werden nicht gebaut (Abschnitt 9).

## 4. Daten

Datei: `apps/theater-zuhause-heft/daten/heft.json` (vorhanden). Schema mit einer Beispielzeile:

```json
{ "id": "form-fingertheater", "titel": "Fingertheater", "quelle": { "seite": "S. 73" }, "eigenentwurf": true }
```

Bestehende Felder bleiben. Das Schema der App ist maßgeblich, wenn es abweicht.

## 5. Pseudocode

```
filtern(daten, filter) -> Seite[]               (vorhanden)
  filter aus filterWerte(daten), Standard "alle"
seiteBloecke(daten, seite) -> Block[]           (vorhanden)
  Block: Titel, Text, Quellenzeile je Seite
druckSeiten(daten) -> Blatt[]                   (vorhanden)
  Reihenfolge: Umschlag, Form 1 bis 3, Szene 1 bis 5
  Pruefung: Anzahl Blaetter == 9
pruefeMarkierung(blaetter) -> Fehler[]          (neu, Eigenentwurf)
  fuer jedes Blatt mit quelle.seite: Pflichtmarkierung im Blatttext vorhanden?
  sonst Fehler mit Blattnummer; leere Liste = bestanden
druckeHeft(daten) -> Druckzeilen                (neu, Eigenentwurf)
  blaetter = druckSeiten(daten)
  pruefeMarkierung(blaetter) muss leer sein
  keine Zeichen aus ☐☒☑✓✔★☆ und keine Emojis in den Druckzeilen
```

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Werkzeuge ohne Nutzerdaten speichern nichts. Das Heft speichert nichts. Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen (docs/02 Z. 22–24). CSP `default-src 'self'` ist Eigenentwurf, docs/02 verlangt nur das Verbot externer Anfragen.
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 19–20 schließt Konten und personenbezogene Daten aus).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Seitenangaben nur mit Markierung (docs/02 Z. 151–152). Pflichtmarkierung auf jeder gedruckten Seite mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs`: Heft-Daten (neun Seiten, feste Reihenfolge, Quelle „S. 73“ bei den Formseiten), `filtern`, `druckSeiten`, `pruefeMarkierung` (neu).
- `test/regeln.test.mjs`: Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, nur `localhost`.
- Druck: neun Blätter bei vollem Heft; keine Zeichen; Pflichtmarkierung auf jeder Seite mit Seitenangabe.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Index führt `app: null`, obwohl `apps/theater-zuhause-heft` vorhanden ist. Zuordnung im Index klären (`tools/bauauftrag-index.mjs`). Diese Sitzung ändert den Index nicht.
- Bebilderte Anleitung und Zeichnungen: nicht gebaut. Bildquelle und Lizenz offen.
- A18: Seitenangaben auf dem Blatt. Heute steht „Praleska, S. 73“ auf den Formseiten; der Standard sieht keine Seitenzahl auf dem Blatt vor.
- uk/ru-Fassung: offen.
- F4: Neuladen ohne Netz ist nicht zugesichert (kein Service Worker).
- Vorlesefunktion (F2), Favicon (A3).
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
