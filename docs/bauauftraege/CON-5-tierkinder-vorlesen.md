# Bauauftrag CON-5: Tierkinder und ihre Familien (Geschichten-Pack)

Status: teilweise · Abschnitt: Content-Pakete, Funktionen, Dokumente · Ziel: Ausbau von `apps/tierkinder-vorlesen/` (Index-Feld `app` ist leer, der Ordner existiert; siehe Abschnitt 9)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 113 (113–114), Abschnitt „Как животные и растения растут“ (S. 113), Gruppe „ПОЧЕМУЧКИ“ (S. 114).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Как животные и растения растут“ (S. 113)
  - „нору“ (S. 114)
  - „берлогу“ (S. 114)
  - „гнезда“ (S. 114)
  - „весной и летом“ (S. 114)
- Umschrieben, ohne Anführungszeichen: Die Seiten enthalten Aufgaben für Erziehende, keine Geschichten (S. 113–114). Fuchs und Wolf bauen einen Bau, der Bär eine Höhle, Vögel ein Nest, Haustiere bekommen einen Stall, den der Mensch baut (S. 114). Eltern wärmen und schützen ihre Jungen, und Jungtiere kommen im Frühling oder Sommer zur Welt, damit sie bis zum Winter groß werden (S. 114).
- Die Sternchen markieren Aufgaben für ältere Kinder der Gruppe (Fußnote, S. 113).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.
- Katalogeintrag: docs/10, Z. 452 (Tierkinder und ihre Familien). Zielgruppe 3 bis 5, Vorlesen durch Erwachsene, Typ S.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 3 bis 5 Jahre, vorgelesen von Erwachsenen (Eltern und Fachkräfte). Verwendung: beides (Bildschirm für Erwachsene, Druck eines Vorlesetextes auf ein Blatt).
- Lernziele, prüfbar (Eigenentwurf):
  1. Erwachsene wählt Tierart, Ort und Jungtier-Thema; der Ort wird nur aus den passenden Orten angeboten (`orteFuer`, `waehleOrt`).
  2. Erwachsene liest den Vorlesetext vor; jeder Absatz trägt seine Kennzeichnung (Sachbezug mit Seite oder „Eigenentwurf, ohne Quelle“).
  3. Erwachsene druckt einen Vorlesetext als ein A4-Blatt hoch, ohne Zeichen und ohne Namenszeile.

## 3. Funktion

- Bestand (README und GDD der App): Auswahl aus sechs Tierarten, dann der Ort nur nach Zuordnung (Bau, Höhle, Nest, Stall), dann eines von drei Jungtier-Themen. Das ergibt 18 gültige Kombinationen (GDD). Der Vorlesetext entsteht aus festen eigenen Bausteinen, nicht aus freier Erzeugung. Kein Bildschirm für Kinder.
- Ablauf: Tierart → Ort → Jungtier-Thema → `vollstaendig` prüft → `vorlesetext` zeigt den Text → vorlesen oder drucken.
- Lücke gegen den Katalog: Der Katalog nennt ein Vorlage-Set mit Geschichten-Generator als isolierte Erzeugerfunktion und Gute-Nacht-Geschichten (docs/10, Z. 452). Die App erzeugt keine Geschichten und hat keine Erzeugerfunktion (README, Abschnitt Titel). Die Entscheidung steht in Abschnitt 9.
- Was gedruckt wird: ein Vorlesetext je Blatt A4 hoch. Die Pflichtmarkierung steht auf dem Blatt (`PFLICHTMARKIERUNG`, `logik.mjs` Z. 7). Der Bestand zeigt die Seite am Absatz (GDD); der A18-Standard verlangt das nicht. Siehe Abschnitt 9.

## 4. Daten

Datei: `apps/tierkinder-vorlesen/daten/bausteine.json` (Bestand). Das Feld `seite` steht je Baustein, das Feld `eigenentwurf` wird für Sätze ohne Quelle neu ergänzt. Schema mit einer Beispielzeile aus dem Bestand:

```json
{ "id": "fuchs", "name": "Fuchs", "seite": "S. 113–114", "begriff": "лиса", "orte": ["bau"], "einleitung": "Heute hören wir von Fuchs-Eltern und ihren Kleinen." }
```

## 5. Pseudocode

```
startzustand() -> Zustand
  gib { tierart: null, ort: null, jungtier: null } zurück

waehleTierart(daten, zustand, id) -> Zustand
  prüfe id gegen daten.tierarten (sechs Einträge)
  setze zustand.tierart = id; setze zustand.ort = null, wenn der Ort nicht mehr passt

orteFuer(daten, tierartId) -> Liste<Ort>
  gib die Orte aus daten.tierarten[tierartId].orte zurück (nur die Zuordnung des Bestands)

waehleOrt(daten, zustand, id) -> Zustand
  wenn id nicht in orteFuer(daten, zustand.tierart): gib zustand unverändert zurück
  sonst setze zustand.ort = id

waehleJungtier(daten, zustand, id) -> Zustand
  prüfe id gegen die drei Jungtier-Themen in daten

vollstaendig(daten, zustand) -> Boolean
  true, wenn tierart, ort und jungtier gesetzt sind

vorlesetext(daten, zustand) -> { absaetze, pflicht }
  bricht ab, wenn vollstaendig(daten, zustand) falsch ist
  setze einleitung, Sachbezug mit Feld seite, Jungtier-Satz und Kuschel-Sachfrage (Eigenentwurf)
  pflicht = PFLICHTMARKIERUNG

vorlesetextAlsText(text) -> String
  verbindet die Absätze; ohne Zeichen aus ☐☒☑✓✔★☆, ohne Emojis

alleKombinationen(daten) und anzahlBausteine(daten)
  Bestand: prüfen alle 18 Kombinationen

pruefeBausteine(daten) -> Liste<Fehler>   (neu)
  Fehler, wenn ein Baustein weder seite im Bereich S. 113–114 noch eigenentwurf == true hat
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Im Bestand gibt es in den Moduldateien keinen Speicheraufruf; die App speichert nichts.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24; die CSP-Umsetzung ist Eigenentwurf). Offline nach dem Laden (Bestand).
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 17–30 begrenzt Datenerhebung und Kommunikation). Kein Freitext; der Text entsteht nur aus Bausteinen (GDD).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Kein Namensfeld; der Kindname-Slot des Katalogs entfällt (siehe Abschnitt 9).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Sie steht auf jedem gedruckten Blatt mit Seitenangabe. Die Seitenangabe auf dem Blatt ist offen (A18, Abschnitt 9).
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (Bestand: „uk und ru: nicht vorhanden, offen.“). Der Katalog nennt eine dreisprachige Ausgabe (docs/10, Z. 452).

## 7. Tests

- `test/logik.test.mjs` (Bestand): alle 18 Kombinationen sind gültig; `orteFuer` liefert nur die zugeordneten Orte; `vollstaendig` ist erst nach den drei Auswahlen wahr.
- `test/regeln.test.mjs` (Bestand): Druck ohne Zeichen aus der Sperrliste, ohne Namenszeile.
- Neu: `pruefeBausteine` prüft, dass jeder Baustein Quelle oder Eigenentwurf-Kennung hat und Quellseiten nur S. 113–114 nennen.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick, Speicher gleich null, nur `localhost`.
- Druck: ein Vorlesetext je Blatt; keine Zeichen; keine Namenszeile.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Index-Feld `app` für CON-5 ist leer, obwohl `apps/tierkinder-vorlesen/` im Repo liegt. Korrektur durch den Koordinator (`tools/bauauftrag-index.mjs`). Diese Sitzung ändert den Index nicht.
- Geschichten-Generator (docs/10, Z. 452) gegen feste Bausteine der App: Entscheidung nötig. Die Gute-Nacht-Form stammt nicht aus der Quelle (README, Abschnitt Titel).
- Seitenangabe auf dem Druckblatt: GDD und Bausteindaten zeigen die Seite am Absatz. Der A18-Standard für neue Apps verlangt keine Seitenzahl auf dem Blatt. Entscheidung A18.
- Kindname-Slot aus dem Katalog (docs/10, Z. 452) entfällt: Namen sind auf dem Blatt nicht zulässig (docs/02 Z. 79–82).
- Fassung in uk und ru: offen.
