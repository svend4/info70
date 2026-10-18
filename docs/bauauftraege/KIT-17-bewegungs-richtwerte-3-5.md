# Bauauftrag KIT-17: Bewegungs-Meilensteine: Beobachtungsbogen 3-5

Status: teilweise · Abschnitt: Kita-Werkzeuge (Fachkräfte) · Ziel: Ausbau von apps/bewegungs-richtwerte-3-5/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 128 (128–134), Abschnitt „Развитие движений“, Gruppe „ПОЧЕМУЧКИ“.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Развитие движений“ (S. 128)
  - „Для детей четвертого года жизни“ (S. 128)
  - „Для детей пятого года жизни“ (S. 131)
  - „Группа «ПОЧЕМУЧКИ»“ (S. 128)
  - „Ходьба“ (S. 128)
  - „Бег“ (S. 129)
  - „Прыжки“ (S. 129)
  - „Лазанье“ (S. 129)
  - „Бросание, катание, ловля“ (S. 129)
  - „прыгать в длину с места“ (S. 131)
  - „примерно за 9,5 с“ (S. 131)
  - „отбивать мяч об пол“ (S. 132)
  - „Упражнения в равновесии“ (S. 132)
  - „Упражнения на развитие физических качеств“ (S. 132)
- Umschrieben ohne Anführungszeichen: Die Quelle gibt je Lebensjahr (viertes und fünftes) Bewegungsaufgaben mit Strecken, Abständen und Zeiten an (S. 128–132). Übungen im Gleichgewicht stehen auf S. 132–133, ohne messbare Größe (S. 132–133). Das zehnmalige Prellen steht als Ziel auf S. 132 (S. 132).
- Nicht gefunden – offen:
  - Katalogangabe „32 messbare Zielwerte“: keine Zählregel belegt. Suchbegriffe: Zahlen mit Maßeinheit auf S. 128–134; eine Gesamtzahl steht nicht im Text.
  - Beobachtungsbogen, Kriterien-Check, Bericht-Export: Suchbegriffe „наблюд“, „протокол“, „отчет“ auf S. 128–134. Einziger Treffer ist „под наблюдением взрослых“ (S. 134), also Aufsicht, kein Bogen.
  - Angaben für das dritte Lebensjahr (Katalog „3-5“): Suchbegriff „третьего года жизни“ auf S. 120–134 ohne Treffer.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft; das Skript meldet für diese Datei keine Fehler.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte (Erzieherinnen und Erzieher) mit Kindern im vierten und fünften Lebensjahr (Stand der App; der Katalog nennt 3–5, siehe Abschnitt 9). Verwendung: Bildschirm (Auswahl, Liste) und Druck (Auswahl).
- Lernziele, prüfbar:
  1. Die Fachkraft wählt Lebensjahr 4 oder 5 und eine Bewegungsart und sieht nur die passenden Angaben.
  2. Die Fachkraft druckt nur die gewählte Auswahl; die Zahl der Angaben auf dem Blatt stimmt mit der Auswahl überein.
  3. Die Fachkraft sieht bei jeder Angabe, dass sie ein Richtwert aus dem Text ist und keine Norm für jedes Kind (Eigenentwurf).

## 3. Funktion

- Katalog verlangt (docs/10, Eintrag KIT-17, Typ: Erwachsenen-Katalog, Checkliste, Bericht): Die Messwerte als strukturierter Beobachtungsbogen mit Kriterien-Check und Bericht-Export für Entwicklungsgespräche. Keine Kinder-App. Adaptation laut Katalog: Werte als Beobachtungskorridore, lokal gespeichert, Export nur durch die Fachkraft.
- App leistet schon (README, GDD, `logik.mjs`):
  - 25 Angaben mit Maß aus S. 129–132, nach Lebensjahr (4, 5) und vier Bewegungsarten (`ARTEN`). Jede Angabe trägt Seite und russischen Wortlaut; der deutsche Text ist eine Übertragung (Eigenentwurf).
  - Balancieren ist keine Angabe (S. 132–133).
  - Filter nach Lebensjahr und Bewegungsart; Druck nur der gewählten Angaben.
  - Keine Eingabe, keine Namen, keine Speicherung, keine Anfrage an fremde Adressen (README).
- Lücke: Beobachtungsbogen, Kriterien-Check und Bericht-Export sind nicht gebaut. Sie würden einzelne Kinder bewerten (docs/02, Z. 141–146). Die Lücke steht als Entscheidung in Abschnitt 9.
- Bildschirme: eine Seite mit Auswahl Lebensjahr (4 oder 5), Auswahl Bewegungsart (vier Knöpfe), Liste der Angaben, Druckknopf für die Auswahl.
- Ablauf: Lebensjahr wählen → Bewegungsart wählen → Angaben lesen → Auswahl drucken.
- Was gedruckt wird (Soll): die gewählten Angaben als Liste; je Angabe Lebensjahr, Bewegungsart, deutscher Text (Eigenentwurf) und russischer Wortlaut (Quelle). Keine Seitenzahl auf dem Blatt (A18-Standard, Abschnitt 9). Keine Zeichen, keine Namenszeile.

## 4. Daten

Datei: `apps/bewegungs-richtwerte-3-5/daten/richtwerte.json` (vorhanden, 25 Angaben). Schema mit einer Beispielzeile (Vorlage-Form):

```json
{ "id": "lauf-4-01", "jahr": 4, "art": "Laufen", "text": "Strecke von 10 bis 20 m schnell laufen (Eigenentwurf, Übertragung)", "zitat": "пробегая быстро 10—20 м", "quelle": { "seite": "S. 129" }, "eigenentwurf": true }
```

Ist-Stand: Die Datei führt `seite` und `zitat` auf oberster Ebene, nicht unter `quelle`. Der Ausbau gleicht die Form an die Vorlage an oder begründet die Abweichung (Abschnitt 9). Die Schlüssel stehen in `EINTRAG_SCHLUESSEL`: id, jahr, art, text, zitat, seite.

## 5. Pseudocode

```
ladeRichtwerte(pfad = "daten/richtwerte.json") -> daten
  Schritt 1: Datei lesen; bei Fehler Abbruch mit Meldung, dass die Daten fehlen
  Schritt 2: pruefeDaten(daten) aufrufen; bei nicht leerer Fehlerliste Abbruch
  Schritt 3: daten enthält genau 25 Eintraege (Gegenprobe im Test)

pruefeDaten(daten) -> Fehlerliste
  Schritt 1: jeder Eintrag hat alle Schluessel aus EINTRAG_SCHLUESSEL: id, jahr, art, text, zitat, seite
  Schritt 2: jahr ist 4 oder 5; art ist Element von ARTEN (vier Werte)
  Schritt 3: seite liegt zwischen S. 129 und S. 132
  Schritt 4: text und zitat enthalten keine Normsprache (Muster: muss, jedes Kind, Pflicht)
  Schritt 5: kein Eintrag nennt Balancieren als Maß
  Schritt 6: Liste der Fehler leer; sonst Testfehler

eintraegeFuer(daten, {jahr, art}) -> Eintrag[]
  Schritt 1: jahr null bedeutet alle Jahre; art null bedeutet alle Arten
  Schritt 2: Filter in der Reihenfolge von daten.eintraege
  Schritt 3: keine Sortierung nach Leistung und keine Rangfolge

druckeAuswahl(eintraege) -> HTML
  Schritt 1: leere Auswahl erzeugt kein Blatt, sondern einen Hinweis am Bildschirm
  Schritt 2: je Eintrag eine Zeile mit jahr, art, text (deutsch, Eigenentwurf) und zitat (russisch)
  Schritt 3: keine Seitenzahl auf dem Blatt (A18); keine Zeichen ☐☒☑✓✔★☆; keine Namenszeile
```

Nicht gebaut und nicht als Funktion vorgesehen: Beobachtungsbogen, Kriterien-Check, Bericht-Export (docs/02, Z. 141–146; Abschnitt 9).

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Werkzeuge ohne Nutzerdaten speichern nichts. Ist-Stand: keine Speicherung (README). Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Ist-Stand: keine Anfrage an fremde Adressen (README).
- [ ] Keine Eingabefelder (Projektregel der Vorlage; docs/02 Z. 19–20 zu Registrierung). Ist-Stand: keine Eingabe (README).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Ist-Stand: nur Richtwerte; der Beobachtungsbogen ist nicht gebaut.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Ist-Stand: Druck nur mit Angaben (README); Zeichenprüfung offen.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50). Ist-Stand: 360 px laut README geprüft; Knopfhöhe nicht belegt.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ (docs/02 Z. 151–152). Ist-Stand: Seitenangaben stehen auf dem Bildschirm; die Markierung fehlt noch.
- [ ] Keine Modellnamen in Dateien. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden, laut README 17 Tests): 25 Angaben, Lebensjahr 4 und 5, Seiten 129–132, feste Felder, keine Normsprache, kein Balancieren als Maß, Abweichung zur Katalogzahl 32, Filter, Gegenproben.
- `test/regeln.test.mjs` (fehlt, anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): keine externe Adresse, keine Speicherung, keine Eingabefelder, keine Zeichen im Druck, Knopfhöhe 48 px, keine Modellnamen.

## 8. Abnahme

- `node --test apps/bewegungs-richtwerte-3-5/test/*.mjs` grün; Testzahl 17 in README und GDD stimmt.
- Browser bei 360 px: 25 Angaben, Filter nach Jahr und Art, Knöpfe mindestens 48 px, kein Überlauf, keine externen Anfragen, Speicher gleich null.
- Druck: Zahl gedruckter Angaben gleich Auswahl; keine Zeichen; keine Namenszeile.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Beobachtungsbogen, Kriterien-Check, Bericht-Export: nicht gebaut (docs/02, Z. 141–146). Entscheidung: Lücke bleibt, oder der Katalog wird als anderes Werkzeug ohne Bewertung einzelner Kinder neu gefasst.
- Katalogzahl „32 messbare Zielwerte“ ist nicht belegt. Katalog-Korrektur (Befund der App).
- Balancieren ist keine messbare Größe (S. 132–133). Katalog-Korrektur.
- Altersgruppe: Katalog „3-5“, Quelle S. 128–134 nennt nur das vierte und fünfte Lebensjahr. Angaben für das dritte Lebensjahr fehlen; Entscheidung, ob sie an anderer Stelle der Quelle stehen.
- Die Zeitangabe „примерно за 9,5 с“ (S. 131) lässt die Strecke offen; die App markiert sie.
- Eignung für deutsche Kitas: nicht geprüft (Motorik-Studien).
- Schema: Die Datei führt `seite` und `zitat` oben, die Vorlage verlangt `quelle.seite` (Abschnitt 4).
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Zitatgrenze: dieser Bauauftrag nutzt höchstens 6 Wörter (docs/10). A10 fragt, ob 12 gelten sollen (offen).
