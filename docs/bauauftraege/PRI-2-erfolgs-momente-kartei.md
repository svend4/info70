# Bauauftrag PRI-2: Erfolgs-Momente-Kartei

Status: teilweise · Abschnitt: Printmaterialien Kita · Ziel: Ausbau von apps/erfolgs-momente-kartei
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 15 (15–16), Abschnitt „Расти здоровым, малыш!“ (S. 15), keine Gruppenangabe im Seitenkopf.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „ситуации успеха“ (S. 15)
  - „совместной, значимой для детей деятельности“ (S. 15)
  - „психологического здоровья“ (S. 15)
  - „признанию их сверстниками“ (S. 16)
  - „самоуважения“ (S. 16)
- Umschrieben, ohne Anführungszeichen: Erfolg in einer gemeinsamen, für Kinder bedeutsamen Tätigkeit macht beliebt und stärkt das Selbstbild (S. 15–16). Die Fachkraft unterstützt das psychische Wohlbefinden der Gruppe (S. 15). Die Gruppierung der Kinder nach Merkmalen auf S. 15 wird nicht übernommen (docs/02 Z. 141–146).
- Quellenbefund: nicht gefunden – offen: Der Katalog verknüpft die Kartei mit einem Resilienz-Konzept der Bildungspläne. Suchbegriffe резильен und стойкость: kein Treffer auf S. 15–16. Dieser Bezug fehlt im Bauauftrag.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet: die Tätigkeiten (zum Beispiel Morgenkreis, Garderobe, Ausflug), die offenen Rollen, die Impulsfragen, die Übertragungen auf der Quellenkarte.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte in der Kita (Katalog: Material für Fachkräfte, Altersstufe 3 bis 7 der Gruppe). Verwendung: Druck. Der Bildschirm dient nur der Auswahl. Kinder sind keine Nutzer.
- Lernziele, prüfbar:
  1. Die Fachkraft wählt Karten und druckt je Karte ein Blatt A4 hoch.
  2. Die Fachkraft findet zu jeder Tätigkeit eine offene Rolle für alle Kinder und zwei bis drei Impulsfragen zu Raum, Material, Zeit und Gruppengröße.
  3. Keine Karte bewertet ein Kind oder stuft es ein.

## 3. Funktion

- Bildschirme oder Blätter: Bildschirm mit der Auswahl (acht Tätigkeitskarten und eine Quellenkarte). Blätter: je gewählter Karte ein Blatt A4 hoch.
- Ablauf: Karten auswählen → Vorschau prüfen → „Ausgewählte Karten drucken“ → Karten in der Gruppe nutzen (Eigenentwurf).
- Was gedruckt wird: Titel „Erfolgs-Momente-Kartei“. Je Tätigkeitskarte: die Tätigkeit (Eigenentwurf), die Zeile „Grundgedanke“ mit Seite (S. 15 oder S. 16), die offene Rolle für alle Kinder und zwei bis drei Impulsfragen mit Seitenangabe und Bedingung. Die Quellenkarte nennt drei Belege (S. 15, S. 16). Auf jeder Karte steht die Pflichtmarkierung (Abschnitt 6).
- Ausbau gegenüber dem Stand: Die App deckt acht Tätigkeitskarten und eine Quellenkarte ab. Offen sind die Fachkräfte-Durchsicht, der Browser-Test bei 360 px und der Druck auf dem Gerät.

## 4. Daten

Datei: `apps/erfolgs-momente-kartei/daten/karten.json` (vorhanden). Schema mit einer Beispielzeile:

```json
{ "id": "morgenkreis", "titel": "Morgenkreis", "quelle": { "seite": "S. 15" }, "eigenentwurf": true }
```

Bestehende Felder bleiben. Die Impulsfragen tragen je eine Seitenangabe und eine Bedingung aus `BEDINGUNGEN`.

## 5. Pseudocode

```
pruefeKarten(daten) -> Fehler[]                 (vorhanden)
  prueft das Feld SEITE je Karte, Impulsfragen nach BEDINGUNGEN (Raum, Material, Zeit, Gruppengröße)
  lehnt Fragen nach einem bestimmten Kind ab
auswahlUmschalten(auswahl, id) -> auswahl       (vorhanden)
druckKarten(daten, auswahl) -> Karte[]          (vorhanden)
  nur gewaehlte Karten, Reihenfolge wie daten.karten
druckZeilen(karten) -> Zeile[]                  (vorhanden)
  je Karte: Konkrete Tätigkeit, Grundgedanke mit S. 15 oder S. 16
pruefeMarkierung(zeilen) -> Fehler[]            (neu, Eigenentwurf)
  jede Karte mit Seitenangabe traegt die Pflichtmarkierung; leere Liste = bestanden
druckTexte(karten) -> Text[]                    (vorhanden)
  Grundlage der Tests fuer die Druckausgabe
```

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Werkzeuge ohne Nutzerdaten speichern nichts. Die App speichert nichts. Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen (docs/02 Z. 22–24). CSP `default-src 'self'` ist Eigenentwurf, docs/02 verlangt nur das Verbot externer Anfragen.
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 19–20 schließt Konten und personenbezogene Daten aus).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Seitenangaben nur mit Markierung (docs/02 Z. 151–152). Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs`: Kartenset (IDs eindeutig, Seitenangaben S. 15 oder S. 16, Eigenentwurf-Kennzeichnung, Zitatlänge), Auswahl, `druckZeilen`, `druckTexte`, `pruefeMarkierung` (neu).
- `test/regeln.test.mjs`: Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, nur `localhost`.
- Druck: Zahl der Karten gleich der Auswahl; keine Zeichen; Pflichtmarkierung auf jeder Karte mit Seitenangabe.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- A19: Der Katalogtext „unsichere Kinder“ bleibt offen. Die App übernimmt diese Gruppierung nicht.
- A18: Seitenangaben auf dem Blatt. Heute druckt die App „Grundgedanke: S. 15“ und „S. 16“. Der Standard sieht keine Seitenzahl auf dem Blatt vor; die Entscheidung ist offen.
- Resilienz- und Bildungsplan-Bezug: nicht belegt.
- Fachkräfte-Durchsicht der Karten. Die Übertragungen aus dem Russischen sind nicht gegengelesen.
- Vorlesefunktion (F2), Favicon (A3).
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
