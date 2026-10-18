# Bauauftrag PRI-12: Mal- und Matsch-Impulskartei 1-3

Status: teilweise · Abschnitt: Printmaterialien Kita · Ziel: Druckkartei für 1–3 Jahre als neue Einheit; Abgleich mit apps/erste-kuenstler und apps/morgenkreis-wochenplaner-u3 (siehe 9. Offen)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 89–93, Abschnitte „Рисование“ (S. 89), „Лепка“ (S. 91) und „Аппликация“ (S. 92), Gruppe „МАЛЫШИ“ (S. 90).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Рисование“ (S. 89)
  - „поролоновыми тампонами“ (S. 90)
  - „прорисовка в воздухе“ (S. 90)
  - „рисование на песке“ (S. 90)
  - „Веселые краски“ (S. 91)
  - „Лепка“ (S. 91)
  - „Зернышки для цыплят“ (S. 92)
  - „Большие и маленькие снеговики“ (S. 92)
  - „Аппликация“ (S. 92)
  - „без наклеивания“ (S. 92)
  - „техникой наклеивания“ (S. 92)
  - „Цветы и бабочки“ (S. 93)
- Umschrieben, ohne Anführungszeichen:
  - Die Quelle nennt 30 Themen für Kinderarbeiten beim Malen (S. 91), 12 Themen beim Kneten (S. 92) und 19 Themen beim Legen und Applizieren (S. 93).
  - Beim Malen werden Finger und Schwammtupfer als Mittel genannt; Zeichnen in der Luft und auf Sand steht ebenfalls darin (S. 90).
  - Beim Kneten werden kleine Stücke abgerissen, gerollt und gedrückt; die Quelle nennt ein Brett als Arbeitsfläche und das Befeuchten der Finger mit Wasser (S. 91).
  - Beim Legen werden Formen ohne Kleben auf Papier oder Flanell gelegt (S. 92). Die Klebetechnik ist für ältere Kinder markiert (S. 92, vgl. S. 53).
  - Die Gruppe ist für ein bis drei Jahre angelegt (S. 6).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte und Eltern für Kinder von 1 bis 3 Jahren, angeleitet durch Erwachsene (docs/10, Z. 484). Verwendung: Druck, für Kita und Zuhause.
- Lernziele, prüfbar:
  1. Das Kind macht Spuren auf Papier mit Fingern oder Schwamm, nach Vorführung durch die Fachkraft. (Eigenentwurf, Technik nach S. 90)
  2. Das Kind reißt kleine Stücke Knetmasse ab und drückt oder rollt sie. (Eigenentwurf, Technik nach S. 91)
  3. Das Kind legt Formen auf Papier oder Flanell, ohne sie zu kleben. (Eigenentwurf, Technik nach S. 92)

## 3. Funktion

- Blätter: 61 Impulskarten (30 Malen, 12 Kneten, 19 Legen; docs/10, Z. 484) und vier Technikseiten (Fingerfarbe, Tupfen mit Schwamm, Luftzeichnen, Sand und Schnee; docs/10, Z. 484).
- Jede Impulskarte enthält: deutscher Titel (Eigenentwurf), Material, zwei bis drei Schritte, Sicherheitshinweis (Eigenentwurf) und Pflichtmarkierung.
- Ablauf: Fachkraft wählt eine Karte → legt das Material bereit → das Kind malt, knetet oder legt → Fachkraft räumt das Material weg. Das Ergebnis wird nicht bewertet (docs/02, Z. 141–146).
- Was gedruckt wird: je Impulskarte eine Karte je Blatt A4 hoch; je Technik eine Technikseite.
- Was die Apps schon leisten (gelesen: README und GDD). apps/erste-kuenstler: Eltern-Ideenkartei für 1–3 mit acht Ideenkarten, Bildschirm nur für den Erwachsenen, die offene Karte wird gedruckt, je Material eine Sicherheitsnotiz, keine Speicherung. Salzteig ist dort ausgeschlossen. apps/morgenkreis-wochenplaner-u3: Planer für eine Gruppe 1–3 mit zehn Einheiten pro Woche und Titelbausteinen aus der Quelle (laut README für Malen, Formen und Konstruieren); er speichert im Gerät nichts.
- Lücke: keine Kartei mit 61 Impulskarten, keine Knet- und Legeimpulse als Druck, keine Technikseiten. Der Planer enthält Bausteine, aber keine Druckkarten.

## 4. Daten

Datei (geplant): `apps/erste-kuenstler/daten/impulskarten.json`. Schema mit einer Beispielzeile:

```json
{ "id": "mal-01", "art": "malen", "titel_de": "Fröhliche Farben (Eigenentwurf)", "titel_quelle": "Веселые краски", "material": "Fingerfarbe, Papier", "sicherheit": "Nur Fingerfarben für Kinder verwenden. Erwachsene bleiben dabei.", "quelle": { "seite": "S. 91" }, "eigenentwurf": true }
```

Der Titel aus der Quelle steht nur im Datenfeld `titel_quelle`. Auf dem Blatt steht der deutsche Titel.

## 5. Pseudocode

```
impulsKarteAusDaten(eintrag) -> Karte
  prüfe: art ist eins von malen, kneten, legen
  prüfe: titel_de, material und sicherheit sind nicht leer
  prüfe: sicherheit hat mindestens 30 Zeichen
  prüfe: material enthält kein Salzteig, solange die Entscheidung in 9 offen ist
  gib Karte aus
kartenFuerArt(karten, art) -> Liste<Karte>
  filtere karten mit karte.art = art
  prüfe Anzahl: malen = 30, kneten = 12, legen = 19 (docs/10, Z. 484)
  -> Liste
technikSeiten() -> Liste<Technikseite>
  feste Liste: Fingerfarbe, Schwammtupfen, Luftzeichnen, Sand und Schnee
  prüfe: Anzahl = 4
  -> Liste
druckBlaetter(karten, technik) -> Blattliste
  für jede Karte: erzeuge ein A4-Blatt hoch mit titel_de, material, Schritten und sicherheit
  hänge die Pflichtmarkierung an jede Karte mit quelle.seite an
  für jede Technikseite: erzeuge ein A4-Blatt hoch ohne Karte
  prüfe: Anzahl Blätter = Anzahl Karten + Anzahl Technikseiten
  prüfe: kein Zeichen aus ☐☒☑✓✔★☆ im Text
  -> Blattliste
```

## 6. Regeln (docs/02)

- [ ] Speicherung: keine Nutzerdaten, Druckkarten speichern nichts. Wird die Einheit eine App, dann nur localStorage mit eigenen Schlüsseln und Löschknopf, sonst nichts (docs/02, Z. 25).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes; kein Beobachtungsbogen zu einem Kind (docs/02 Z. 141–146).
- [ ] Sicherheit: je Material eine eigene Notiz mit mindestens 30 Zeichen (Eigenentwurf nach apps/erste-kuenstler).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe mindestens 48 px (docs/02 Z. 50). Entfällt für reine Druckkarten.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht gebaut, offen.

## 7. Tests

- Kein neuer Test durch diese Einheit. Bestand: `apps/erste-kuenstler/test/logik.test.mjs` (21 Tests laut README).
- Prüfung der Druckkarten: `node tools/bauauftrag-pruefen.mjs <Pfad zur Arbeitskopie>`.

## 8. Abnahme

- Druck: 61 Impulskarten und 4 Technikseiten; Blattzahl gleich Auswahl; keine Zeichen; Pflichtmarkierung auf jeder Karte; Sicherheitsnotiz je Material.
- Eine Fachkraft liest die Sicherheitsnotizen gegen (Eigenentwurf).
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Salzteig: Der Katalog nennt „Salzteig statt Ton“ (docs/10, Z. 484). apps/erste-kuenstler schließt Salzteig aus, weil die amtliche Warnung bei größeren Mengen gilt und keine Schwelle nennt. Bis zur Entscheidung steht kein Salzteig auf den Karten.
- Norm für Fingerfarben: Der Katalog nennt EN 71-3 (docs/10, Z. 484), apps/erste-kuenstler nennt EN 71-7. Vor dem Druck klären; nach Eigenentwurf ist EN 71-7 die Norm für Fingerfarben.
- Titel: Die Quelle ist russisch. Die deutschen Titel sind Eigenentwurf und brauchen eine Prüfung.
- Form: eigene Einheit oder Ausbau von apps/erste-kuenstler (Eltern-Ideenkartei). Entscheidung offen.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard: Auf dem Blatt steht keine Seitenzahl; die Seite steht in Abschnitt 1 und im Feld „quelle“.
