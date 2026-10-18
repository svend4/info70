# Bauauftrag PRI-13: Bau-Meister-Karten

Status: teilweise · Abschnitt: Printmaterialien Kita · Ziel: Ausbau von apps/morgenkreis-wochenplaner-u3 oder neue Karten-App (Entscheidung offen)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 93 (93–94), Abschnitt „Конструирование“ (S. 93), Gruppe „Малыши“ (S. 94).
- Katalog: docs/10, Zeile 485, Abschnitt Printmaterialien Kita, Nr. 13. Der Katalog nennt S. 93–94, zehn Ziele und acht Bauthemen.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Конструирование“ (S. 93)
  - „Рекомендуемая тематика детских работ“ (S. 94)
  - „Дорожки“ (S. 94)
  - „Заборчик“ (S. 94)
  - „Ворота“ (S. 94)
  - „Гараж для машинки“ (S. 94)
  - „Столик и стульчик для куклы“ (S. 94)
  - „Кроватка для куклы Маши“ (S. 94)
  - „Горка“ (S. 94)
  - „Башня“ (S. 94)
  - „и др.“ (S. 94)
  - „Малыши“ (S. 6)
- Umschrieben, ohne Anführungszeichen: Die Quelle nennt zehn Ziele des Konstruierens (S. 93–94). Dazu gehören Interesse am Baumaterial, das Unterscheiden von Farbe, Form und Größe, das Wiedererkennen von Bauten aus dem Alltag, räumliche Orientierung, erste gemeinsame Bauversuche, das Betrachten eines Vorbilds mit dem Benennen seiner Teile, das Benennen fertiger Bauten und das gemeinsame Einräumen des Materials (S. 93–94). Die Themen sind Empfehlungen (S. 93–94); zwei davon sind Puppenmöbel (S. 94).
- Quellenbefund: Die Quelle enthält keine Fotos und keine Schrittfolgen. Beides ist Eigenentwurf. Der Katalog spricht von Foto-Schrittkarten.
- Die Hinweise des Katalogs zur deutschen Baukasten-Tradition, zu Wortschatzseiten de/uk/ru und zum Bezug Mathematik/Raum sind Katalog-Adaption (Eigenentwurf), nicht Quelle.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet: die Schrittkarten, die Vorbildbilder, die Sprachimpulse, das Kartenformat.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 2 bis 3 Jahre, angeleitet durch Erwachsene (Katalog, docs/10 Zeile 485). Die Quelle nennt die Gruppe „Малыши“ (S. 6: ein bis drei Jahre). Verwendung: Druck. Der Bildschirm dient nur der Auswahl durch die Fachkraft.
- Lernziele, prüfbar:
  1. Die Fachkraft wählt eines von acht Bauthemen und druckt die Schrittkarte dazu (Eigenentwurf).
  2. Das Kind betrachtet das Vorbild auf der Karte und zeigt die Teile, die es erkennt (Eigenentwurf nach S. 93: Vorbild betrachten, Teile benennen).
  3. Nach dem Bauen benennt das Kind die fertige Konstruktion, die Fachkraft nennt sie mit (Eigenentwurf nach S. 94: Bauten benennen).

## 3. Funktion

- Bildschirme oder Blätter: Bildschirm für die Fachkraft mit der Liste der acht Bauthemen, Vorschau und Druckknopf. Blatt: eine Schrittkarte je Bauthema.
- Ablauf: Thema wählen → Vorschau prüfen → drucken → Karte neben den Bauplatz legen (Eigenentwurf).
- Was gedruckt wird: Titel des Bauthemas (deutsche Übertragung, Eigenentwurf), Vorbild-Bild (Eigenentwurf, siehe Abschnitt 9), drei bis fünf nummerierte Bauschritte (Eigenentwurf), drei Sprachimpulse: Teile benennen, Ähnlichkeiten vergleichen, gemeinsam einräumen (Eigenentwurf nach S. 93–94), Pflichtmarkierung nach Abschnitt 6. Eine Karte je Blatt A4 hoch. Seitenzahlen stehen nicht auf dem Blatt (A18, Abschnitt 9).

## 4. Daten

Datei: `apps/morgenkreis-wochenplaner-u3/daten/bauthemen.json` (bei Ausbau dieser App) oder gleichnamige Datei in einem neuen Ordner. Schema mit einer Beispielzeile:

```json
{ "id": "bau-weg", "titel": "Weg", "quellenTitel": "Дорожки", "quelle": { "seite": "S. 94" }, "schritte": ["…", "…", "…"], "eigenentwurf": true }
```

Pflicht: `quelle.seite` für alle acht Themen (S. 94). `eigenentwurf: true` für Titel, Schritte und Impulse, weil sie nicht aus der Quelle stammen.

## 5. Pseudocode

```
ladeBauthemen(json) -> Bauthema[8]                  (neu, Eigenentwurf)
  json.themen hat genau 8 Eintraege; sonst FEHLER_ANZAHL
  je Thema: id, titel, quellenTitel, quelle.seite == "S. 94"; sonst FEHLER_QUELLE
  je Thema: schritte hat 3 bis 5 Eintraege; sonst FEHLER_SCHRITTE
  Reihenfolge wie in json.themen (entspricht der Liste S. 94)
waehleThemen(themen, ids) -> Bauthema              (neu)
  ids hat genau eine Kennung; unbekannt -> FEHLER_UNBEKANNT
impulse = ["Teile benennen", "Ähnlichkeiten vergleichen", "gemeinsam einräumen"]   (Konstante, Eigenentwurf)
baueSchrittkarte(thema, impulse) -> Karte           (neu)
  Karte = {titel: thema.titel, bild: thema.bild, schritte: thema.schritte, impulse, fuss: PFLICHTSATZ}
pruefeSchrittkarte(karte) -> Fehler[]               (neu)
  kein Feld fuer Name, Datum, Häkchen oder Zähler (docs/02 Z. 79–82)
  Text enthält keines der Zeichen ☐☒☑✓✔★☆ und keine Emojis
  fuss == PFLICHTSATZ
druckeSchrittkarte(karte) -> Blatt                  (neu)
  ein Blatt A4 hoch; Bedienelemente per druck.css ausgeblendet
```

Keine Zufallsquelle nötig: die Reihenfolge der acht Themen folgt der Quelle (S. 94).

## 6. Regeln (docs/02)

- [ ] Speicherung: keine. Die Einheit hält keine Nutzerdaten; die Regel docs/02, Z. 25 (localStorage mit Löschknopf) gilt nur für Nutzerdaten. Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen (docs/02 Z. 22–24). CSP `default-src 'self'` ist Eigenentwurf der Apps; docs/02 verlangt nur das Verbot externer Anfragen.
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 19–20 schließt Konten und personenbezogene Daten aus).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung (Einheit mit Seitenangaben), auf jeder gedruckten Karte: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs`: acht Themen mit Quelle S. 94; drei bis fünf Schritte je Thema; `ladeBauthemen` lehnt sieben oder neun Themen ab; `waehleThemen` lehnt unbekannte Kennungen ab; `baueSchrittkarte` trägt den Pflichtsatz; `pruefeSchrittkarte` lehnt Namens- und Zählfelder ab.
- `test/regeln.test.mjs`: Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, keine Anfrage außer localhost.
- Druck: Zahl gedruckter Karten gleich Auswahl; keine Zeichen; Pflichtmarkierung je Karte.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Ziel: Ausbau von apps/morgenkreis-wochenplaner-u3 oder neue Karten-App. Die Morgenkreis-App hat nur den Bereich „Formen, Konstruieren, Kleben“ mit Titelbausteinen (S. 94, laut ihrer README). Schrittkarten gibt es dort nicht.
- Fotos: Der Katalog nennt Foto-Schrittkarten, die Quelle hat keine Fotos. Aufnahme, Bildrechte und Darstellung des Vorbilds sind offen.
- Zwei der acht Bauthemen sind Puppenmöbel (S. 94); die Liste endet mit „и др.“ (S. 94). Die Auswahl der acht Themen ist Entscheidung der Redaktion.
- Altersangabe: Katalog 2–3, Quelle „Малыши“ 1–3 (S. 6). Entscheidung der Redaktion.
- Übersetzungen uk/ru für Titel, Schritte und Impulse: offen.
- Speicherung: keine (Abschnitt 6). Entscheidung dieser Einheit.
- Standard für Seitenangaben (A18, offen): Auf dem Blatt stehen keine Seitenzahlen; die Seiten stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18; docs/02 Z. 151–152).
- Vorlesefunktion (F2), Favicon (A3).
