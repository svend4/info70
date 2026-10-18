# Bauauftrag ELT-16: Erste Kuenstler 1-3 - Eltern-Ideenkartei mit Meilenstein-Check

Status: teilweise · Abschnitt: Eltern-Werkzeuge · Ziel: Ausbau von apps/erste-kuenstler/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 101 (101–102), Abschnitt „Художественная деятельность“ (S. 101), Gruppe „МАЛЫШИ“ (S. 102).
- Katalogeintrag: docs/10, Zeile 387, Eintrag Erste Kuenstler 1-3 - Eltern-Ideenkartei mit Meilenstein-Check.
- Faktenstand laut index.json: faktengeprüft.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Основные показатели развития детей“ (S. 101): Titel der Merkmalsliste.
  - „к концу третьего года жизни“ (S. 96): Zeitbezug der Liste. Sie beschreibt den Stand am Ende der Spanne, nicht einen Weg (Abschnitt 3).
  - „Художественно-речевая деятельность“ (S. 101): vier Merkmale.
  - „Музыкальная деятельность“ (S. 101): acht Merkmale.
  - „Восприятие искусства и изобразительная деятельность“ (S. 102): sieben Merkmale.
- Die Quelle nennt 19 Merkmale in drei Bereichen (4, 8 und 7; S. 101–102). Die Katalogzahl „9 Formen der Aktivität“ findet sich in diesem Abschnitt nicht.
- Keine ganzen Sätze aus dem Buch. Die Merkmale werden ohne Anführungszeichen umschrieben, zum Beispiel Umgang mit Stift und Pinsel, Malen mit den Fingern, einfache Formen aus Material (S. 102).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet. Dazu gehören die acht Ideenkarten mit ihren Schritten, die zehn Materialien mit Sicherheitstexten, die Einordnung der Merkmale (Karte, andere App, nicht übernommen, beschreibend) und die Hinweise zur Bildschirmregel.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Eltern und Kindertagespflege, Kinder von 1 bis 3 Jahren. Verwendung: beides (Bildschirm für den Erwachsenen; Druck der offenen Karte).
- Lernziele, prüfbar:
  1. Erwachsener wählt eine Karte nach dem, was er gerade sieht, nicht nach Alter (Eigenentwurf; Grundlage: Abschnitt „Художественная деятельность“ (S. 101)).
  2. Erwachsener weiß, dass es keine Checkliste gibt und die Merkmale den Stand am Ende der Spanne beschreiben (Eigenentwurf; Grundlage: „к концу третьего года жизни“ (S. 96)).
  3. Erwachsener druckt eine Karte mit Schritten und dem Sicherheitshinweis zum gewählten Material (Eigenentwurf).

## 3. Funktion

- Bildschirme oder Blätter: Hinweis (kein Bildschirm für das Kind); acht Karten mit „wennSie“ (was der Erwachsene schon sieht), drei Schritten, Hinweis auf das Ende und Materialangaben; Materialkarte mit Sicherheitstext je Material (zehn Einträge); Merkmal-Übersicht mit 19 Merkmalen und Einordnung ohne Haken; Druck der offenen Karte.
- Ablauf: Karte wählen (ideenKarte) → karte(daten, ideeId) für Schritte und Hinweise → materialVon(daten, id) für den Sicherheitstext → drucken; gedruckt wird nur die offene Karte.
- Was gedruckt wird: die offene Karte mit Schritten in 13 pt und der immer gültigen Sicherheitsregel (sicherheitImmer; GDD Abschnitt 9 und 10a).
- Lücken laut Befund (Ausbau):
  - Der Katalog verlangt eine Checkliste mit 19 Meilensteinen und einen Bericht. Nicht gebaut: der Zeitpunkt der Quelle und das Fehlen einer deutschen Referenzliste (GDD Abschnitt 3).
  - Die Offline-Spielideen des Katalogs: acht Karten (Kritzeln, Fingermalen, Formen, Kleben, Bauen, Socke) statt der Katalogliste; Abgleich mit dem Katalog offen.
  - Liedvorschläge und uk/ru-Familienlieder des Katalogs: nicht gebaut (keine Liedtexte, keine Titel ohne Prüfung; GDD Abschnitt 11).
  - Die Bildschirmregel „keine Bildschirmzeit unter 3“: als Hinweis gebaut (keinBildschirm). Quelle siehe Abschnitt 9.

## 4. Daten

Datei: `apps/erste-kuenstler/daten/ideen.json`. Listen: ideen (8), material (10), merkmale (19), ausgeschlossen (6). Seitenangabe im Feld `quelle.werk` (S. 101–102). Die Merkmalstexte sind Umschreibungen (Eigenentwurf, Quellenangabe im Feld quelle). Schema mit einer Beispielzeile (Feldnamen wie in der Datei):

```json
{ "id": "m01", "bereich": "sprache", "nr": 1, "text": "…", "einordnung": "anderesWerkzeug", "apps": ["vorlese-kompass", "kunst-gucken"] }
```

## 5. Pseudocode

```
pruefeDaten(daten) -> Liste der Fehler (leer = gültig)
  merkmale: 19 Einträge; Bereiche sprache 4, musik 8, kunst 7 (nachgezählt, S. 101–102)
  einordnung je Merkmal genau eine von ideeDa, anderesWerkzeug, nichtUebernommen, beschreibend (EINORDNUNGEN)
  ideeDa-Merkmal und Karte verweisen aufeinander; nichtUebernommen darf keine Karte beanspruchen
  anderesWerkzeug.apps nennt nur App-Ordner, die es gibt
  CHECKLISTE und EINSTUFUNG: Treffer im Angebotstext = Fehler (kein Haken, keine Stufe)
  material: 10 Einträge; jeder wird von mindestens einer Karte benutzt; sicherheit hat mindestens 30 Zeichen
  Plastiktüte und Salzteig: ausgeschlossen, im Material und auf den Karten nicht zugelassen
  NICHT_GEPRUEFT: nur benannte Ausnahmen; angebotsTexte(daten) umfasst alle übrigen Texte

merkmalVon(daten, id) -> Merkmal
ideeVon(daten, id) -> Karte
ideenFuer(daten, bereich) -> Liste der Karten zu einem Bereich
materialVon(daten, id) -> Material mit Sicherheitstext
karte(daten, ideeId) -> Text für Bildschirm und Druck: wennSie, Schritte, Hinweis auf das Ende, Material, sicherheitImmer
  sicherheitImmer steht auf der Karte und im Druck
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Befund: kein localStorage in app.mjs und logik.mjs; keine Liste, kein Haken, kein Bericht (keinMeilenstein, GDD Abschnitt 8).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Befund: CSP-Meta in index.html, Zeile 6; app.mjs lädt nur daten/ideen.json (Zeile 17).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Befund: kein `<input>`.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Befund: keine Checkliste, kein Haken, keine Stufe; Netz EINSTUFUNG.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Befund: nur die offene Karte, Schritte in 13 pt, keine Namenszeile (GDD Abschnitt 9); Prüfung offen (test/regeln.test.mjs, neu).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50). Befund: GDD Abschnitt 10 nennt 48 px als Ziel und zugleich „gemessen: keiner unter 44 px“. Das belegt die Einhaltung nicht; nachmessen (Abschnitt 9).
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Befund: Seitenangaben in Abschnitt 1 und im Feld quelle; Markierung auf der Karte noch einzubauen.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt). Befund: keine Liedtexte, keine uk/ru-Familienlieder (GDD Abschnitt 11).

## 7. Tests

- `test/logik.test.mjs` (vorhanden, 21 Tests): Einordnung der 19 Merkmale in beide Richtungen, Verweise auf vorhandene Apps, Mindestlänge der Materialsicherheit, Verbote (Plastiktüte, Salzteig, Mengenangaben), Zeitbezug der Quelle im Text, Altersangaben nur im Rahmen; jede Netzprüfung mit Gegenprobe.
- `test/regeln.test.mjs` (neu, nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Druck nur mit offener Karte, Sicherheitsregel auf dem Blatt, keine Zeichen, kein externer Request, kein `<input>`.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl 21 in README und GDD stimmt.
- Browser bei 360 px: kein horizontaler Überlauf, Knöpfe mindestens 48 px (nachmessen), Fokus nach Klick, Speicher leer, nur localhost.
- Druck: nur die offene Karte, Sicherheitsregel auf dem Blatt, keine Zeichen; Pflichtmarkierung auf dem Blatt.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Checkliste mit 19 Meilensteinen und Bericht (Katalog): gestrichen. Entscheidung, ob der Katalogeintrag angepasst wird.
- Liedvorschläge und uk/ru-Familienlieder (Katalog): nicht gebaut. Herkunftssprachen-Angebot offen.
- Bildschirmregel: Der Katalog nennt BZgA und WHO. Laut GDD Abschnitt 7 ist die Drei-Jahres-Grenze deutsch (BIÖG, AWMF-Leitlinie 027-075); die WHO-Leitlinie für unter Fünfjährige nennt sie nicht. Quelle vor dem Druck korrigieren.
- Offline-Ideen: Abgleich der acht Karten mit der Katalogliste offen.
- Knopfgröße: 44 statt 48 px laut GDD Abschnitt 10; nachmessen.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard für neue Apps: keine Seitenzahl auf dem Blatt; Seitenangaben stehen in Abschnitt 1 und im Feld quelle der Daten.
- Vorlesefunktion (F2): die App hat sie (nur mit Gerätestimme). Regel für Eltern-Werkzeuge offen.
- Favicon (A3).
