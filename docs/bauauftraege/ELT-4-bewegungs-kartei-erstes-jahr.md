# Bauauftrag ELT-4: Bewegungs-Kartei Babys erstes Jahr

Status: teilweise · Abschnitt: Eltern-Werkzeuge · Ziel: Ausbau von apps/bewegungs-kartei-erstes-jahr
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 34 (34–36), Abschnitte „Развитие движений“ (S. 34) und „Гимнастические упражнения и массаж“ (S. 35), Gruppe „МАЛЮТКИ“ (S. 34).
- Sicherheitsziele: Abschnitt „Обеспечение безопасности“ (S. 34). Im Katalog als eigene Einheit geführt (laut README Nr. 50).
- Katalogeintrag: docs/10, Zeile 351, Eintrag Bewegungs-Kartei Babys erstes Jahr.
- Faktenstand laut index.json: faktengeprüft.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Развитие движений“ (S. 34): Bewegungsentwicklung mit Zielen nach drei Altersstufen.
  - „Обеспечение безопасности“ (S. 34): Sicherheit und Umgebung, vier Ziele.
  - „Гимнастические упражнения и массаж“ (S. 35): Gymnastik und Massage, 16 Maßnahmen, Altersspanne (S. 35–36).
  - „от 1,5 мес. до года“ (S. 35): Altersspanne des Abschnitts.
- Keine ganzen Sätze aus dem Buch. Sätze werden ohne Anführungszeichen umschrieben und mit Seitenangabe belegt: Die Ziele sind nach beobachtbaren Fähigkeiten geordnet, nicht nach Monatsstufen (S. 34–35).
- Zählung im Auftrag: die Aufzählungspunkte der Bewegungsziele ergeben 26 (S. 34–35). Die Maßnahmen der Gymnastik ergeben laut Katalog 16 (S. 35–36).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Eltern und Tagespflege, Kinder 0–1. Verwendung: Bildschirm für Erwachsene, Druck als Kartenset.
- Lernziele, prüfbar:
  1. Erwachsener findet zu drei Altersstufen (bis 3 Monate, 3 bis 6–7 Monate, 6–7 bis 12 Monate) Bewegungsziele in Form beobachtbarer Fähigkeiten (S. 34–35).
  2. Erwachsener erkennt, welche Maßnahmen aus der Gymnastikliste nicht übernommen werden und warum, und führt keine passiven Bewegungen am Kind aus (Eigenentwurf; Ausschlussliste).
  3. Erwachsener kennt die Sicherheitsziele für Raum und Umgebung (S. 34; Formulierung Eigenentwurf).

## 3. Funktion

- Bildschirme oder Blätter: Kartei-Ansicht nach dem Können des Kindes (sechs Stufen, Feld koennen), Karte je Bewegungsziel mit Vorbereitung für den Erwachsenen, Ausschlussliste mit Begründung, Druckfassung (druck.css vorhanden).
- Ablauf: Erwachsener wählt das Können des Kindes → kartenFuer(daten, koennenId) liefert die Karten → karteText(karte) erzeugt den Text → Anzeige oder Druck.
- Was gedruckt wird: eine Karte je Bewegungsziel, je Blatt A4 hoch. Keine Bilder: die Katalogzusage „bebildert“ ist gestrichen (docs/10, Welle 78).
- Bestand laut README und Datei: 16 Karten (karten), sechs Stufen des Könnens (koennen), 13 ausgeschlossene Maßnahmen mit Begründung (ausgeschlossen), 3 Dinge, die nicht ins Haus gehören (nichtImHaus).
- Stand des Befunds: von 26 Bewegungszielen übernommen 21; nicht übernommen die Ziele 6, 11, 16, 17 und 20, weil dort der Erwachsene das Kind in der Pose hält (S. 34–35). Von 16 Gymnastik-Maßnahmen übernommen 3 (eine vollständig, zwei teilweise), 13 ausgeschlossen (S. 35–36). Kein Massageöl, keine passiven Bewegungen, keine Reflexauslösung.
- Lücken laut Befund (Ausbau): keine offene Lücke bei den Bewegungszielen. Prüfen: ob jede übernommene Karte in der Druckfassung vollständig steht.

## 4. Daten

Datei: `apps/bewegungs-kartei-erstes-jahr/daten/kartei.json`. Vorhandene Schlüssel u. a.: art, version, zielgruppe, hinweis, keinPlan, koennen (6), karten (16), ausgeschlossen (13), nichtImHaus (3), quelle, bodenregel. Eine Karte hat id, koennen, quellZiel (Liste der Ziel-Nummern), titel, ausgangslage, rolle, ort und Vorbereitungsschritte. Schema mit einer Beispielzeile für neue Karten:

```json
{ "id": "b17", "koennen": "k3", "quellZiel": [12], "titel": "…", "quelle": { "seite": "S. 35" }, "eigenentwurf": false }
```

Feld `quelle` nur bei Zielen aus S. 34–36. Die Formulierungen der Karten sind Eigenentwurf (`eigenentwurf: true`), die Ziele selbst stammen aus der Quelle.

## 5. Pseudocode

```
pruefeDaten(daten) -> Liste der Fehler (leer = gültig)
  Menge aller quellZiel-Nummern der übernommenen Karten == Zielmenge 1..26 (ohne nicht übernommene)
  übernommen + nicht übernommen == 26
  Gymnastik: 3 übernommen + 13 in ausgeschlossen == 16
  jede Karte: ausgangslage in AUSGANGSLAGEN, rolle in ROLLEN, ort in ORTE
  ausgangslage bauchlage-wach: schlafhinweis enthält Rücken und Schlaf
  kein Feld enthält GESPERRTES_VOKABULAR oder GESPERRTE_WIRKUNG
  kein Feld enthält GEFAEHRLICHE_ZUBEREITUNG
  jede Karte mit eigenentwurf == false hat quelle.seite

karteVon(daten, id) -> Karte oder undefined

kartenFuer(daten, koennenId) -> Liste der Karten für das gewählte Können
  filtert karten nach koennen == koennenId
  Reihenfolge nach quellZiel, nicht zufällig

karteText(karte) -> { titel, schritte, hinweis }
  nur Text, keine Zahlen in Anweisungen (Test)

fensterSatz(daten, id) -> Satz zur Altersstufe, Monate als Richtwert
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Befund: kein localStorage-Schlüssel (app.mjs Zeile 12, Kommentar).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Prüfung in der Abnahme.
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Befund: keine Eingabefelder in app.mjs gefunden.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Befund: keine Bewertung; das Können ist eine Auswahl des Erwachsenen.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Prüfen an der Druckfassung (druck.css).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung: Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden): Prüfung der Daten nach pruefeDaten, Sperrlisten, Abdeckung der Ausgangslagen, karteVon, kartenFuer, karteText. Ausbau: Zahlen 26, 16 und 13 als feste Erwartung prüfen.
- `test/regeln.test.mjs` (neu, nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`).

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein horizontaler Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick, Speicher gleich null, nur localhost.
- Druck: Zahl gedruckter Karten gleich Auswahl; keine Zeichen; Pflichtmarkierung je Karte mit Seitenangabe.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Die fünf nicht übernommenen Bewegungsziele (6, 11, 16, 17, 20) und die 13 ausgeschlossenen Maßnahmen sind begründet, aber nicht von einem Menschen bestätigt. Entscheidung.
- Sicherheitsziele (S. 34) sind als eigene Einheit im Katalog geführt; keine Doppelung in dieser App.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard für neue Apps: keine Seitenzahl auf dem Druckblatt; Seitenangaben stehen in Abschnitt 1 und in den Daten im Feld quelle.
- Vorlesefunktion (F2), Favicon (A3).
- uk und ru: offen.
- Offline-Test (F4): Neuladen ohne Netz wird berichtet, ist aber keine Abnahmebedingung.
