# Bauauftrag PRI-3: Reime, Wiegenlieder, Kniereiter - Familienschatz-Paket

Status: teilweise · Abschnitt: Printmaterialien Kita · Ziel: Ausbau von apps/familienschatz-reime (Druckheft als Export)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 36 (36, 43, 76–77), Abschnitt „Мир прекрасного“ (S. 36), Gruppe „Малютки“ (S. 36).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Мир прекрасного“ (S. 36)
  - „колыбельной“ (S. 36)
  - „рифмованными народными потешками“ (S. 36)
  - „колыбельные песни“ (S. 43)
  - „Русские народные песенки и потешки“ (S. 76)
  - „Ладушки“ (S. 76)
  - „Скок-по-скок“ (S. 76)
  - „Колыбельная песня“ (S. 77)
- Umschrieben, ohne Anführungszeichen: Die Quelle sieht Wiegenlieder, Reime und Volksverse als Mittel zur Bindung und zur Sprachentwicklung (S. 36, S. 43). Russische Volksverse und Kniereiter-artige Verse stehen als Titelliste auf S. 76.
- Quellenbefund: nicht gefunden – offen: Der deutsche Kniereiter-Vers des Katalogs (Typ Hoppe-hoppe-Reiter) steht nicht in der Quelle. Suchbegriffe скачк und Скачи: kein Treffer.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet: die Beispieltexte, die Erklärungen „warum und wie“, die deutschen Kniereiter-Verse, der Kulturtransfer belarussisch zu deutsch.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Eltern und Erzieherinnen (Katalog: Kinder 0 bis 3). Verwendung: beides. Der Erwachsenen-Katalog ist am Bildschirm, das Druckheft auf Papier. Kein Bildschirm für Kinder.
- Lernziele, prüfbar:
  1. Erwachsene findet vier Arten (Kniereiter, Fingerspiel, Wiegenlied, Reim) mit Erklärung zu „warum“ und „wie“.
  2. Erwachsene druckt ein Heft mit Anleitung und den Beispielversen; die Zahl der Blätter entspricht der Auswahl.
  3. Die Familiensammlung bleibt am Bildschirm und erscheint nicht im Druckheft.

## 3. Funktion

- Bildschirme oder Blätter: Bildschirm mit den vier Arten, den Beispielen („Noch eins“) und der lokalen Familiensammlung. Druck: Titelblatt, je Art eine Seite mit Erklärung, Beispielseiten mit den eigenen Texten. Je Seite ein Blatt A4 hoch.
- Ablauf: Art wählen → Beispiele auswählen → Druckknopf → Heft drucken → Vorlesen (Eigenentwurf).
- Was gedruckt wird: Titelblatt ohne Symbol (das Herz im Bildschirmtitel entfällt im Druck). Je Art Erklärung „warum und wie“ mit Seitenangabe zur Quelle (S. 36, S. 43, S. 76, S. 77). Beispielseiten mit eigenen Texten (Eigenentwurf). Auf jeder Seite mit Seitenangabe steht die Pflichtmarkierung (Abschnitt 6).
- Ausbau gegenüber dem Stand: Die App hat die Arten, die Beispiele und die lokale Sammlung. Fehlt ist der Druck-Export. Die Bildschirmfunktionen bleiben unverändert.

## 4. Daten

Datei: `apps/familienschatz-reime/daten/schatz.json` (vorhanden). Schema mit einer Beispielzeile:

```json
{ "id": "kniereiter-1", "art": "kniereiter", "titel": "Beispiel Kniereiter", "quelle": { "seite": "S. 76" }, "eigenentwurf": true }
```

Die Quellenangabe bezieht sich nur auf den Titel oder die Erwähnung. Der Text ist immer Eigenentwurf oder gemeinfrei. Familiensammlung in `schatz.eigene` (localStorage) wird nicht gedruckt.

## 5. Pseudocode

```
pruefeSchatz(daten) -> Fehler[]                 (vorhanden)
  vier Arten vollstaendig; Beispiele mit eigenentwurf == true
artName(daten, artId) -> Text                   (vorhanden)
naechsterIndex(aktuell, laenge) -> Index        (vorhanden)
baueHeft(daten, auswahlArten, auswahlBeispiele) -> Blatt[]   (neu, Eigenentwurf)
  Titelblatt ohne Symbol; je Art: artName(), Erklaerung, Quellenzeile
  Beispielseiten nur aus daten.beispiele mit eigenentwurf == true
  Familiensammlung wird nicht uebernommen
pruefeMarkierung(blaetter) -> Fehler[]          (neu, Eigenentwurf)
  Blaetter mit Seitenangabe muessen die Pflichtmarkierung tragen
druckeHeft(blaetter) -> Druckzeilen             (neu, Eigenentwurf)
  keine Zeichen aus ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile
normalisiereEintrag(roh) -> Eintrag / eintragOk(eintrag) -> Bool   (vorhanden, nur Sammlung)
```

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Die Familiensammlung liegt unter `schatz.eigene` mit Löschknopf. Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen (docs/02 Z. 22–24). CSP `default-src 'self'` ist Eigenentwurf, docs/02 verlangt nur das Verbot externer Anfragen.
- [ ] Keine Eingabefelder: Die Vorlage verlangt das. Die Familiensammlung der App hat Eingabefelder für Eltern. Entscheidung offen (Abschnitt 9).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Seitenangaben nur mit Markierung (docs/02 Z. 151–152). Pflichtmarkierung auf jeder gedruckten Seite mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs`: Schatz-Daten (vier Arten, Beispiele mit `eigenentwurf`), `baueHeft` (Auswahl gleich Blätter), `pruefeMarkierung` (neu), Druckfassung ohne Familiensammlung.
- `test/regeln.test.mjs`: Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null außer der Familiensammlung, nur `localhost`.
- Druck: Zahl der Blätter gleich der Auswahl; keine Zeichen; Pflichtmarkierung auf jeder Seite mit Seitenangabe; keine Familiensammlung im Druck.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Eingabefelder: Die Familiensammlung braucht Eingabefelder. Die Vorlage verbietet sie. Der Koordinator entscheidet, ob das für ein Eltern-Werkzeug gilt.
- Kniereiter- und Wiegenlied-Texte: nur Eigenentwurf oder gemeinfreie Überlieferung. Die Quelle belegt nur Titel und Liste (S. 76, S. 77). Urheberrecht je Text prüfen.
- Kulturtransfer belarussisch zu deutsch: Entscheidung beim Koordinator.
- uk/ru-Fassung des Heftes: offen (Katalog: Herkunftssprachen-Schiene).
- A18: Seitenangaben auf dem Blatt. Vorlesefunktion (F2), Favicon (A3).
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
