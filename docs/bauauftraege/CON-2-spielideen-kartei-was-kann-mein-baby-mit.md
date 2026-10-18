# Bauauftrag CON-2: Spielideen-Kartei: Was kann mein Baby mit...?

Status: teilweise · Abschnitt: Content-Pakete, Funktionen, Dokumente · Ziel: neue App (Index: app leer; siehe Abschnitt 9)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 39 (39–40), Abschnitt „Познавательно-практическая деятельность“ (S. 39), Gruppe „МАЛЮТКИ“ (Kopfzeile „Группа «Малютки»“ (S. 40)).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Познавательно-практическая деятельность“ (S. 39)
  - „Группа «Малютки»“ (S. 40)
  - „репертуар действий“ (S. 40)
  - „перекладывание игрушки из руки в руку“ (S. 40)
  - „постукивание о поверхность“ (S. 40)
  - „нанизывание, вкладывание, открывание“ (S. 40)
  - „строит дом“ (S. 40)
  - „катает по полу“ (S. 40)
  - „и т. д.“ (S. 40)
- Umschrieben ohne Anführungszeichen: Die Quelle beschreibt, wie sich das Halten und Greifen von Gegenständen im zweiten Halbjahr erweitert: erst ein Gegenstand, später zwei oder drei gleichzeitig (S. 40). Gegen Ende des ersten Lebensjahres überträgt das Kind eine gelernte Handlung auf andere Gegenstände (S. 40). Die Handlungen mit Gegenständen werden ab dem zweiten Halbjahr zum Schwerpunkt (S. 41).
- Nicht gefunden – offen:
  - Katalogangabe „10 Entwicklungsschritte“: Suchbegriffe „этап“, „шаг“ auf S. 39–41 ohne Treffer.
  - Katalogangabe „DIN EN 71“ (Sicherheitsfilter): Suchbegriffe „DIN“, „стандарт“, „норм“ auf S. 39–41 ohne Treffer.
  - Katalogangabe „17 benannte Objekthandlungen“: Die Quelle nennt auf S. 40 eine offene Liste; eine feste Zahl ist nicht eindeutig zählbar.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet. Die Sicherheitshinweise sind Eigenentwurf.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft; das Skript meldet für diese Datei keine Fehler.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Eltern von Kindern im ersten Lebensjahr (0 bis 1). Verwendung: Druck (Karten) und Bildschirm nur als Erwachsenen-Katalog. Inhalte für 0 bis 3 Jahre sind nur für Erwachsene und als Druck vorgesehen (docs/10, Rechtsrahmen Punkt 2).
- Lernziele, prüfbar:
  1. Die Erwachsene findet zu einer Handlung mit einem Gegenstand (zum Beispiel Stapeln oder Öffnen) eine Karte mit Quellenseite.
  2. Die Erwachsene druckt nur die gewählten Karten; die Zahl der Blätter stimmt mit der Auswahl überein.
  3. Die Erwachsene sieht bei jeder Karte den Sicherheitshinweis zum Gegenstand (Eigenentwurf).

## 3. Funktion

- Katalog verlangt (docs/10, Eintrag „Spielideen-Kartei: Was kann mein Baby mit...?“, Typ: Erwachsenen-Katalog und Druck-Export, Alter 0 bis 1): die benannten Objekthandlungen und Entwicklungsschritte als Spielideen-Kartei mit sicheren Alltagsgegenständen; digitaler Erwachsenen-Katalog plus Druckkarten. Adaptation laut Katalog: Sicherheitsfilter nach Verschluckgefahr; deutsche Alltagsobjekte; Karten dreisprachig (uk und ru offen).
- App leistet schon: keine. Der Index führt keine App (`app` leer, `naechster_schritt`: neu bauen). Abgleich nötig: apps/baby-spielideen-kartei/ existiert im Repo, und docs/10 (Stand Welle 92) führt eine Kartei dieses Namens als gebaut, mit 16 Druckkarten aus S. 40 (nur de). Die App wurde für diesen Bauauftrag nicht gelesen, weil der Index keine App nennt.
- Lücke: Vor einem Neubau muss der Index mit dem Repo abgeglichen werden (Abschnitt 9).
- Bildschirme (Erwachsenen-Katalog): Liste der Handlungen mit Seite; Karte je Handlung mit Beispielgegenstand und Sicherheitshinweis; Auswahl; Druckansicht.
- Ablauf: Handlung wählen → Karten ansehen → Karten auswählen → drucken.
- Was gedruckt wird (Soll): eine Karte je Blatt A4 hoch mit Handlung, Beispielgegenstand und Sicherheitshinweis (Eigenentwurf). Keine Seitenzahl auf dem Blatt (A18-Standard). Wird eine Seitenangabe gedruckt, steht die Pflichtmarkierung auf der Karte.

## 4. Daten

Datei: `apps/<ordner>/daten/karten.json`. Der Ordner wird nach der Entscheidung in Abschnitt 9 festgelegt. Schema mit einer Beispielzeile (Eigenentwurf im Beispielgegenstand und im Sicherheitshinweis):

```json
{ "id": "handlung-stapeln-01", "handlung": "Stapeln", "beispiel": "Würfel aufeinander stapeln (Eigenentwurf)", "sicherheit": "Nur Gegenstände, die nicht verschluckt werden können (Eigenentwurf, nicht gegen eine Norm geprüft)", "quelle": { "seite": "S. 40" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
ladeKarten(pfad = "daten/karten.json") -> {handlungen, karten}
  Schritt 1: Datei lesen; bei Fehler Abbruch
  Schritt 2: pruefeKarten(daten); bei Fehlern Abbruch
  Schritt 3: handlungen aus dem Feld handlung, in der Reihenfolge von S. 39–40

pruefeKarten(daten) -> Fehlerliste
  Schritt 1: jede Karte hat id, handlung, beispiel, sicherheit, quelle.seite (S. 39 oder S. 40) und eigenentwurf
  Schritt 2: handlung ist Element von HANDLUNGEN (Liste aus S. 39–40)
  Schritt 3: sicherheit ist nicht leer; beispiel enthält keinen Gegenstand aus VERBOTEN (Eigenentwurf)
  Schritt 4: kein Text nennt eine Zahl für Entwicklungsschritte oder eine Norm (Test)
  Schritt 5: Liste der Fehler leer; sonst Testfehler

filtereKarten(karten, handlungIds) -> Karte[]
  Schritt 1: leere handlungIds: alle Karten in Katalogreihenfolge
  Schritt 2: sonst Karten, deren handlung in handlungIds liegt

druckeAuswahl(karten) -> HTML
  Schritt 1: eine Karte je Blatt im Hochformat A4
  Schritt 2: je Karte handlung, beispiel, sicherheit; keine Seitenzahl auf dem Blatt (A18)
  Schritt 3: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile
  Schritt 4: Anzahl Blätter gleich Anzahl ausgewählter Karten (Test)
```

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Werkzeuge ohne Nutzerdaten speichern nichts. Ziel: keine Speicherung; die Karte ist Material, keine Nutzerdaten.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Ziel: keine Anfrage; keine Schrift und kein Skript von außen.
- [ ] Keine Eingabefelder (Projektregel der Vorlage). Ziel: Auswahl nur über Knöpfe.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Ziel: Karten beziehen sich auf Handlungen mit Gegenständen. Bewertet werden darf der Gegenstand (docs/02 Z. 143–144), nicht das Kind.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Ziel: eine Karte je Blatt, keine Zeichen.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50). Ziel: umzusetzen.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ (docs/02 Z. 151–152). Ziel: gilt für jede Karte, auf der eine Seite steht; nach A18 keine Seite auf dem Blatt.
- [ ] Keine Modellnamen in Dateien. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt). Der Katalog verlangt dreisprachige Karten.

## 7. Tests

- `test/logik.test.mjs` (fehlt, anlegen): Karten je Handlung mit Seite 39 oder 40; Handlungsliste vollständig gegen HANDLUNGEN; Filter; Blätterzahl gleich Auswahl; Prüfung der Felder.
- `test/regeln.test.mjs` (fehlt, anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): keine Zeichen im Druck, keine externe Adresse, kein Speicherzugriff, Knopfhöhe 48 px, keine Modellnamen, kein Feld für Kinder.

## 8. Abnahme

- `npm test` im Ordner der App grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: Handlungen und Karten, Knöpfe mindestens 48 px, kein Überlauf, keine externen Anfragen, Speicher gleich null.
- Druck: Blätter gleich Auswahl; keine Zeichen; keine Seitenzahl auf dem Blatt.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Index und Repo: Der Index nennt keine App (`app` leer, `naechster_schritt`: neu bauen); docs/10 (Stand Welle 92) und apps/baby-spielideen-kartei/ zeigen eine gebaute Fassung. Index prüfen; dann entscheiden zwischen Ausbau von apps/baby-spielideen-kartei/ und Neubau.
- Katalogangaben „10 Entwicklungsschritte“, „17 benannte Objekthandlungen“ und „DIN EN 71“ sind in der Quelle nicht belegt (Abschnitt 1). Katalog-Korrektur; die Sicherheitshinweise sind Eigenentwurf und nicht gegen eine Norm geprüft.
- Umfang: Karten nur für die Handlungen auf S. 40; weitere Übertragungen (S. 41) sind offen.
- Liste der sicheren Gegenstände und Verbotsliste (`VERBOTEN`): Eigenentwurf; Abnahme nötig.
- uk- und ru-Karten: offen.
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Zitatgrenze: dieser Bauauftrag nutzt höchstens 6 Wörter (docs/10). A10 fragt, ob 12 gelten sollen (offen).
