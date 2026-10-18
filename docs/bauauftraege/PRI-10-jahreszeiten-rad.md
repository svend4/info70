# Bauauftrag PRI-10: Tages- und Jahreszeiten-Ritualkarten

Status: teilweise · Abschnitt: Printmaterialien Kita · Ziel: Ausbau von apps/jahreszeiten-rad und apps/uhr-und-kalender-kind laut Index; Druckfassung als neue Einheit offen (siehe 9. Offen)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 63, Abschnitt „Ориентировка во времени“ (S. 63), Gruppe „МАЛЫШИ“ (S. 62).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Ориентировка во времени“ (S. 63)
  - „частей суток“ (S. 63)
  - „утро, день, ночь, вечер“ (S. 63)
  - „собственную, наиболее характерную“ (S. 63)
  - „наиболее яркие характерные проявления“ (S. 63)
  - „МАЛЫШИ“ (S. 62)
- Umschrieben, ohne Anführungszeichen:
  - Tageszeiten werden über die eigene, für die jeweilige Zeit typische Tätigkeit des Kindes eingeführt (S. 63).
  - Jahreszeiten sollen in knapper, für Kinder zugänglicher Form über markante Erscheinungen des Jahres erfasst werden (S. 63).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Erzieherinnen, Erzieher und Eltern für Kinder von 2 bis 3 Jahren (docs/10, Z. 482). Verwendung: Druck, offline.
- Lernziele, prüfbar:
  1. Die Fachkraft ordnet Morgen, Tag, Abend und Nacht je eine eigene Tätigkeit zu. (Eigenentwurf, Tageszeiten nach S. 63)
  2. Die Fachkraft benennt je Jahreszeit zwei bis drei sichtbare Merkmale; das Kind zeigt auf eines davon. (Eigenentwurf, Jahreszeiten nach S. 63)

## 3. Funktion

- Blätter: vier Tageszeitkarten (Morgen, Tag, Abend, Nacht; entspricht der Quelle, S. 63) mit je einer Tätigkeit, zum Beispiel anziehen, Mittag essen, Schlaflied (docs/10, Z. 482; Eigenentwurf). Dazu vier Jahreszeitenkarten mit je zwei bis drei Merkmalen (Eigenentwurf).
- Ablauf: Fachkraft zeigt die Tageszeitkarte im Morgenkreis oder beim Übergang → benennt die Tätigkeit → das Kind zeigt auf die Karte. Bei den Jahreszeiten zeigt die Fachkraft ein Merkmal und benennt es. Es gibt keine Bewertung.
- Was gedruckt wird: je Karte Bild (Eigenentwurf), Wort und Tätigkeit beziehungsweise Merkmale. Eine Karte je Blatt A4 hoch.
- Was die Apps schon leisten (apps/jahreszeiten-rad und apps/uhr-und-kalender-kind, README und GDD gelesen). jahreszeiten-rad: Bildschirm für 5–7 und 8–12 mit Rad aus vier Jahreszeiten, Tageslängen-Balken, Monats-Finder und Mini-Quiz; es speichert nichts. uhr-und-kalender-kind: Bildschirm für 5–7 mit Analoguhr, Tagesphasen (Morgen, Mittag, Abend, Nacht), Woche und Jahr; der Rekord liegt im localStorage (`uhr.rekord`).
- Lücke: keine Tätigkeitskarten für die Tageszeiten, keine Druckfassung, keine Fassung für 2–3 Jahre (docs/10, Z. 482).

## 4. Daten

Datei (geplant): `apps/jahreszeiten-rad/daten/ritualkarten.json`. Schema mit einer Beispielzeile:

```json
{ "id": "tag-morgen", "typ": "tageszeit", "titel": "Morgen", "taetigkeit": "Anziehen", "quelle": { "seite": "S. 63" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
tageszeitKarten(liste) -> Liste<Karte>
  filtere typ = „tageszeit“
  prüfe: genau vier Karten mit titel Morgen, Tag, Abend und Nacht
  prüfe: jede Karte hat ein Feld taetigkeit mit mindestens einem Wort
  -> Liste
jahreszeitKarten(liste) -> Liste<Karte>
  filtere typ = „jahreszeit“
  prüfe: genau vier Karten, jede mit zwei bis drei merkmale
  prüfe: kein Datum und kein Monatsname im Text
  -> Liste
druckBlaetter(karten) -> Blattliste
  für jede Karte: erzeuge ein A4-Blatt hoch mit titel, taetigkeit oder merkmale und bild
  hänge die Pflichtmarkierung an jede Karte mit quelle.seite an
  prüfe: Anzahl Blätter = Anzahl Karten
  prüfe: kein Zeichen aus ☐☒☑✓✔★☆ und kein Namensfeld im Text
  -> Blattliste
```

## 6. Regeln (docs/02)

- [ ] Speicherung: keine Nutzerdaten, Druckkarten speichern nichts. Wird die Einheit eine App, dann nur localStorage mit eigenen Schlüsseln und Löschknopf, sonst nichts (docs/02, Z. 25).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Bestehende App apps/uhr-und-kalender-kind zeigt Punkte, Rang und Rekord (GDD §3). Das widerspricht docs/02 Z. 141–146. Die Entscheidung steht in 9. Offen; diese Einheit ändert die App nicht.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe mindestens 48 px (docs/02 Z. 50). Entfällt für reine Druckkarten.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht gebaut, offen (Wortkarten laut docs/10, Z. 482).

## 7. Tests

- Kein neuer Test durch diese Einheit. Bestand: `apps/jahreszeiten-rad/test/logik.test.mjs` (GDD §6) und `apps/uhr-und-kalender-kind/test/logik.test.mjs` (GDD §6).
- Prüfung der Druckkarten: `node tools/bauauftrag-pruefen.mjs <Pfad zur Arbeitskopie>`.

## 8. Abnahme

- Druck: vier Tageszeit- und vier Jahreszeitenkarten; Zahl gedruckter Karten gleich Auswahl; keine Zeichen; Pflichtmarkierung auf jeder Karte.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Bewertung in der App: apps/uhr-und-kalender-kind zeigt Punkte, Rang und Rekord (GDD §3). docs/02 Z. 141–146 verbietet das für Kinder. Entscheidung offen.
- Zielgruppe: Apps für 5–7 und 8–12, Katalog für 2–3. Die Druckfassung ist eine neue Einheit.
- Bilder der Karten sind Eigenentwurf; Bildquelle und Lizenz sind offen.
- Wortkarten de/uk/ru (Katalog-Adaptation): nicht gebaut; offen.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard: Auf dem Blatt steht keine Seitenzahl; die Seite steht in Abschnitt 1 und im Feld „quelle“.
