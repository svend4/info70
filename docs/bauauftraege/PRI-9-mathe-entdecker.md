# Bauauftrag PRI-9: Mathe-Anfaenge-Spielkartei

Status: teilweise · Abschnitt: Printmaterialien Kita · Ziel: Ausbau von apps/mathe-entdecker laut Index; Druckkartei für 2–3 Jahre als neue Einheit offen (siehe 9. Offen)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 62–63, Abschnitt „Математика (введение)“ (S. 62), Gruppe „МАЛЫШИ“ (S. 62).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Количество и счет“ (S. 62)
  - „много“ (S. 62)
  - „один“ (S. 62)
  - „Геометрические фигуры и форма предметов“ (S. 62)
  - „сериационного ряда“ (S. 62)
  - „Ориентировка в пространстве“ (S. 62)
  - „впереди, сбоку, сзади“ (S. 62)
  - „Ориентировка во времени“ (S. 63)
  - „утро, день, ночь, вечер“ (S. 63)
- Umschrieben, ohne Anführungszeichen:
  - Die Quelle gliedert den Stoff in fünf Bereiche: Mengen und Zählen, Größe, Figuren, Orientierung im Raum und Orientierung in der Zeit (S. 62–63).
  - Gruppen werden nach einem Merkmal gebildet, Paare durch praktisches Zuordnen (S. 62).
  - Aus mehreren Gegenständen wird eine Reihe nach Größe gelegt, zunächst mit deutlichen Unterschieden (S. 62).
  - Dreizehn geometrische Figuren, von Kreis bis Pyramide, sollen benannt und angefasst werden (S. 62).
  - Tageszeiten werden über die eigene Tätigkeit des Kindes eingeführt, Jahreszeiten über deutliche Merkmale (S. 63).
  - Die Gruppe ist für ein bis drei Jahre angelegt (S. 6). Der Katalog nennt 2–3 Jahre (docs/10, Z. 481).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte für Kinder von 2 bis 3 Jahren (docs/10, Z. 481). Verwendung: Druck, offline.
- Lernziele, prüfbar:
  1. Das Kind unterscheidet viel und eins bei Gruppen von Gegenständen. (Eigenentwurf, Bereich Mengen nach S. 62)
  2. Das Kind bildet Paare aus zwei gleichen Gegenständen. (Eigenentwurf, Handlung nach S. 62)
  3. Die Fachkraft benennt die Lage eines Gegenstands (vorne, seitlich, hinten), das Kind zeigt darauf. (Eigenentwurf, Bereich Raum nach S. 62)

## 3. Funktion

- Blätter: Spielkarten je Bereich (fünf Bereiche), je Bereich drei bis fünf Alltagsspiele (docs/10, Z. 481). Dazu eine Formenkarte mit 13 Figuren. Kern: Kreis, Dreieck, Quadrat. Die übrigen zehn Figuren als Bonus (docs/10, Z. 481; Eigenentwurf).
- Ablauf: Fachkraft wählt einen Bereich → zieht eine Karte → legt Gegenstände aus dem Gruppenraum bereit → spielt mit dem Kind → benennt den Begriff.
- Was gedruckt wird: je Karte Bereich, Spielidee, Material aus dem Kita-Alltag, Sprachimpuls und Pflichtmarkierung. Eine Karte je Blatt A4 hoch.
- Was die App schon leistet (apps/mathe-entdecker, README und GDD gelesen): ein Vorlese-Quiz für 5–7 Jahre mit 16 Aufgaben, eine Runde umfasst 10. Abgedeckt sind Zählen bis 10, Formen, Reihen, Größe, Richtungen, Halbieren und Tageszeiten. Es gibt keine Konten und keine externen Anfragen, der Rekord liegt im localStorage (`mathe.rekord`).
- Lücke: Die App richtet sich an Kinder von 5–7 und zeigt Punkte, Rang und Rekord (GDD §3). Es fehlen eine Druckfassung, Karten für Fachkräfte mit 2–3-Jährigen und die Begriffskarten uk/ru (docs/10, Z. 481).

## 4. Daten

Datei (geplant): `apps/mathe-entdecker/daten/mathe-anfaenge.json`. Schema mit einer Beispielzeile:

```json
{ "id": "menge-viel-eins-01", "bereich": "Menge", "titel": "Viel und eins", "spielidee": "Spielzeug in eine Kiste legen, dann ein einzelnes herausnehmen.", "quelle": { "seite": "S. 62" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
kartenFuerBereich(karten, bereich) -> Liste<Karte>
  filtere karten mit karte.bereich = bereich
  prüfe: mindestens 3 Karten je Bereich, sonst Fehler „zu wenig Karten in {bereich}“
  -> Liste
formenKarten(figuren) -> Liste<Formkarte>
  kern = [kreis, dreieck, quadrat] mit bonus = false
  rest = die übrigen zehn Figuren mit bonus = true
  prüfe: Anzahl = 13
  -> kern + rest
druckBlaetter(karten, auswahl) -> Blattliste
  für id in auswahl: hole die Karte mit dieser id und erzeuge ein A4-Blatt hoch
  hänge die Pflichtmarkierung an jede Karte mit quelle.seite an
  prüfe: Anzahl Blätter = Länge von auswahl
  prüfe: kein Zeichen aus ☐☒☑✓✔★☆ im Text
  -> Blattliste
```

## 6. Regeln (docs/02)

- [ ] Speicherung: keine Nutzerdaten, Druckkarten speichern nichts. Wird die Einheit eine App, dann nur localStorage mit eigenen Schlüsseln und Löschknopf, sonst nichts (docs/02, Z. 25).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Bestehende App apps/mathe-entdecker zeigt Punkte, Rang und Rekord (GDD §3). Das widerspricht docs/02 Z. 141–146. Die Entscheidung steht in 9. Offen; diese Einheit ändert die App nicht.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe mindestens 48 px (docs/02 Z. 50). Entfällt für reine Druckkarten.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht gebaut, offen (Begriffskarten laut docs/10, Z. 481).

## 7. Tests

- Kein neuer Test im App-Ordner durch diese Einheit. Bestand: `apps/mathe-entdecker/test/fragen.test.mjs` (GDD §6).
- Prüfung der Druckkarte: `node tools/bauauftrag-pruefen.mjs <Pfad zur Arbeitskopie>`.

## 8. Abnahme

- Druck: je Bereich mindestens drei Karten; 13 Formen mit Kern; Pflichtmarkierung auf jeder Karte; keine Zeichen aus Abschnitt 6.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Bewertung in der App: apps/mathe-entdecker zeigt Punkte, Rang und Rekord (GDD §3, README „Ранги, рекорд“). docs/02 Z. 141–146 verbietet das für Kinder. Entscheidung: Rang und Punkte entfernen oder die App anders ausrichten.
- Zielgruppe: App für 5–7, Druck für 2–3 (Katalog). Die App spricht eine andere Altersgruppe an als diese Einheit.
- Entscheidung Ziel: Ausbau der App oder neue Druckkartei. Der Index nennt die App, der Katalog nennt „Druck-PDF aus erwachsenen-katalog“.
- Begriffskarten de/uk/ru: nicht gebaut; uk und ru offen.
- Formenkarte: Kern aus drei Figuren ist Eigenentwurf nach docs/10, Z. 481.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard: Auf dem Blatt steht keine Seitenzahl; die Seite steht in Abschnitt 1 und im Feld „quelle“.
