# Bauauftrag ELT-13: Ich kann das schon! Selbststaendigkeits-Leiter

Status: teilweise · Abschnitt: Eltern-Werkzeuge · Ziel: Ausbau von apps/selbststaendigkeits-leiter/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 94 (94–96), Abschnitt „ПРИОБЩАЕМСЯ К ТРУДУ“ (S. 94), Gruppe „МАЛЫШИ“ (S. 94).
- Katalogeintrag: docs/10, Zeile 378, Eintrag Ich kann das schon! Selbststaendigkeits-Leiter.
- Faktenstand laut index.json: faktengeprüft.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Задачи (общие)“ (S. 94): allgemeiner Teil mit sechs Zielen.
  - „Самообслуживание“ (S. 94): Selbstbedienung, sechs Ziele.
  - „Хозяйственно-бытовой труд“ (S. 95): Haushalt, fuenf Ziele.
  - „Труд в природе“ (S. 96): Natur, vier Ziele.
  - „Ручной труд“ (S. 96): Handarbeit, zwei Ziele.
  - „дежурного по столовой“ (S. 95): Dienst am Esstisch, nicht uebernommen.
  - „украшении групповой комнаты“ (S. 95): Schmuck zum Fest, nicht uebernommen.
- Die Quelle zaehlt 23 paedagogische Ziele in fuenf Teilen (S. 94–96). Der Katalog spricht von etwa 23 Fertigkeiten; diese Lesart ist falsch (Abschnitt 3).
- Keine ganzen Saetze aus dem Buch. Saetze werden ohne Anfuehrungszeichen umschrieben und mit Seitenangabe belegt: Nach Zaehlung der App beschreiben neun der 23 Ziele eine Handlung des Kindes (S. 94–96).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet. Dazu gehoeren die Stufen, die Gelegenheiten fuer den Erwachsenen, die Zeilentexte, die drei amtlichen Altersangaben (Fundstelle laut App: Kinder-Richtlinie des G-BA, nicht die Praleska) und die Ausschlussbegruendungen.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Eltern und Kindertagespflege, Kinder von etwa 2 bis 3 Jahren. Verwendung: beides (Bildschirm fuer den Erwachsenen; Druck ueber druck.css).
- Lernziele, prüfbar:
  1. Erwachsener sieht bei jeder der 18 Zeilen eine von drei Stufen (noch nicht, manchmal, sicher) und nimmt sie durch erneutes Antippen zurueck (Eigenentwurf; Grundlage: Ziele zur Selbstbedienung, S. 94–95).
  2. Erwachsener schafft fuer eine Zeile in der Stufe „manchmal“ eine Gelegenheit, statt das Kind anzuleiten; die App zeigt Zeilen, deren Voraussetzung sicher ist (Eigenentwurf; Grundlage: Ziele zur Selbstbedienung, S. 94–95).
  3. Erwachsener erkennt, dass es keine Gesamtstufe gibt und dass amtliche Altersangaben nur fuer drei Zeilen gelten (Eigenentwurf; Fundstelle ausserhalb der Praleska).

## 3. Funktion

- Bildschirme oder Blaetter: Startseite mit Sinnhinweis; 18 Zeilen in vier Bereichen, je mit Stufenwahl (○ ◐ ●) und Gelegenheit fuer den Erwachsenen; Ansicht „manchmal“; Ansicht „als Naechstes“; Druckblatt ohne Stufen.
- Ablauf: Zeile waehlen → Stufe setzen mit setzeStufe(stand, zeileId, stufe); dieselbe Stufe nochmals entfernt den Eintrag → beschneide(stand, daten) beim Laden und Speichern → inBewegung(stand, daten) und naechsteGelegenheiten(stand, daten) fuer die beiden Ansichten.
- Was gedruckt wird: die Zeilen mit ihren Gelegenheiten, ohne Stufen-Kreise (druck.css; GDD Abschnitt 10). Inhalt je Blatt ist im Ausbau festzulegen (Abschnitt 9).
- Luecken laut Befund (Ausbau):
  - Der Katalog verlangt Ampel-Fortschritt. Nicht gebaut; die App begruendet das selbst (keine Gesamtstufe, keine Ampel).
  - Der Katalog nennt einen Bericht. In logik.mjs gibt es eine Funktion bericht; ihr Umfang und ihre Ausgabe sind in dieser Einheit nicht geprueft (Abschnitt 9).
  - Der Katalog nennt de/uk/ru. Nicht gebaut: uk- und ru-Fassungen fehlen (GDD Abschnitt 8).
  - Die Katalogzahl „ca. 23 Fertigkeiten“ ist korrigiert: 23 Ziele, davon neun Handlungen des Kindes. Die App uebernimmt die Zahl 23 nicht als Anzahl von Fertigkeiten.

## 4. Daten

Datei: `apps/selbststaendigkeits-leiter/daten/leiter.json`. Listen: zeilen (18), bereiche (4), ausgeschlossen (13), stufenTexte. Seitenangabe im Feld `quelle.werk` (S. 94–96); die neun Handlungen des Kindes stehen in `quelle.kindHandlungen`. Zeilentexte sind Eigenentwurf. Schema mit einer Beispielzeile (Feldnamen wie in der Datei):

```json
{ "id": "an-schuhe-aus", "bereich": "anziehen", "quellZiel": 1, "vorher": null, "was": "…", "gelegenheit": "…", "amtlich": null }
```

## 5. Pseudocode

```
pruefeDaten(daten) -> Liste der Fehler (leer = gueltig)
  zeilen hat genau 18 Eintraege; id ist eindeutig; bereich ist ein Wert aus bereiche
  vorher verweist auf eine Zeile im selben Bereich oder ist null
  jede Zeile ist von einer Wurzel aus erreichbar (zeilenIm, zeileVon); Kreis und Verweis ins Leere sind Fehler
  amtlich ist nur bei drei Zeilen gesetzt; jede Angabe hat Toleranz und Fundstelle (ALTERSANGABE)
  quelle.kindHandlungen: 9 Eintraege; jeder steht in genau einer Zeile oder in ausgeschlossen
  DREIUNDZWANZIG und LOB_ALS_GRUND: Treffer = Fehler

zeileVon(daten, id) -> Zeile (Fehler, wenn unbekannt)

setzeStufe(stand, zeileId, stufe) -> stand
  stufe ist ein Wert aus STUFEN: noch-nicht, manchmal, sicher
  ist dieselbe Stufe bereits gesetzt, wird der Eintrag entfernt
  keine Funktion haelt eine erreichte Stufe fest (kein Math.max)

beschneide(stand, daten) -> stand
  entfernt Schluessel, zu denen es keine Zeile in daten.zeilen gibt
  Ausgabe gleich Eingabe -> kein Schreibvorgang; sonst stand unter ssl.stand speichern

inBewegung(stand, daten) -> Liste der Zeilen mit Stufe manchmal

naechsteGelegenheiten(stand, daten) -> Liste der Zeilen
  nur Zeilen ohne Stufe, deren vorher-Zeile auf sicher steht
  Zeile ohne vorher gilt nie als naechste

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Befund: ein localStorage-Schluessel „ssl.stand“ mit Zeile → Stufe, beschnitten beim Laden und Speichern; datenKarte loescht. Gleiche Abweichung wie in ELT-12 (docs/02 Z. 25 gegen diese Vorlage). Entscheidung offen (Abschnitt 9).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Befund: CSP-Meta in index.html, Zeile 6; app.mjs laedt nur daten/leiter.json (Zeile 21).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Befund: kein `<input>`.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Befund: keine Gesamtstufe und keine Ampel; Stufen nur als Formen (○ ◐ ●), keine Farbe; der Test verbietet Gesamtstufe-Konstruktionen beim Namen.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Befund: auf dem Papier keine Stufen (GDD Abschnitt 10). Pruefung offen (test/regeln.test.mjs, neu).
- [ ] Mobile First 360 px; Knoepfe und Fusslink mindestens 48 px (docs/02 Z. 50). Befund laut GDD Abschnitt 10: 360 px ohne Querscrollen, Knoepfe ab 48 px. In dieser Einheit nicht gemessen.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Befund: Seitenangaben in Abschnitt 1 und im Feld quelle; Markierung auf dem Druckblatt noch einzubauen.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt). Befund: GDD Abschnitt 8.

## 7. Tests

- `test/logik.test.mjs` (vorhanden, 24 Tests): Kreis und Bereichssprung in der Kette, Alter ohne amtliche Fundstelle, fehlende Toleranzgrenze, abweichender amtlicher Wortlaut, Erwachsener in der Zeile „was“, Uebung in „gelegenheit“, Freude als Grund, Fehllesung der 23 Fertigkeiten, Fremdfeld im Speicher, kyrillische Schrift.
- `test/regeln.test.mjs` (neu, nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Druck ohne Stufen und Zeichen, kein externer Request, kein `<input>`, einziger Speicherschluessel „ssl.stand“.

## 8. Abnahme

- `npm test` im App-Ordner gruen; Testzahl 24 in README und GDD stimmt.
- Browser bei 360 px: kein horizontaler Ueberlauf, Knoepfe mindestens 48 px, Fokus nach Klick, Speicher nur „ssl.stand“, nur localhost.
- Druck: keine Stufen auf dem Blatt, keine Zeichen, Pflichtmarkierung je Blatt mit Seitenangabe.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Ampel-Fortschritt (Katalog): in der App abgesagt. Entscheidung, ob der Katalogeintrag angepasst wird.
- Bericht (Katalog): die App hat eine Funktion bericht; Umfang und Ausgabe sind nicht geprueft. Entscheidung, ob der Katalog-Bericht gebaut oder gestrichen wird.
- Speicherung: wie in ELT-12 (docs/02 Z. 25 gegen Abschnitt 6 dieser Vorlage). Entscheidung offen.
- Altersangaben: Die Kinder-Richtlinie wird regelmaessig geaendert (GDD Abschnitt 6). Vor dem Druck die aktuelle Fassung pruefen.
- uk/ru-Fassungen: offen.
- Vorlesefunktion (F2), Favicon (A3). Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard fuer neue Apps: keine Seitenzahl auf dem Blatt; Seitenangaben stehen in Abschnitt 1 und im Feld quelle der Daten.
