# Bauauftrag GEM-22: Mess-Labor der kleinen Forscher

Status: teilweise · Abschnitt: Gemeinsame Apps 3–5 · Ziel: Ausbau von apps/mess-labor
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 288 (288–290), Abschnitt „ПОЗНАВАТЕЛЬНО-ПРАКТИЧЕСКАЯ ДЕЯТЕЛЬНОСТЬ“ (S. 288), Gruppe „ФАНТАЗЕРЫ“ (S. 288).
- Katalogeintrag: docs/10, Zeile 334, Abschnitt Gemeinsame Apps, Eintrag Mess-Labor der kleinen Forscher.
- Faktenstand laut index.json: nur Katalogtext.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „ПОЗНАВАТЕЛЬНО-ПРАКТИЧЕСКАЯ ДЕЯТЕЛЬНОСТЬ“ (S. 288): Abschnittstitel, Rahmen des Forschens mit Messmitteln.
  - „широкому экспериментированию“ (S. 288): Ziel, breites Experimentieren als Form des Erkennens zu fördern.
  - „элементарные измерительные приборы“ (S. 289): Auftrag, einfache Messgeräte einzusetzen.
  - „весы, градусник, увеличительное стекло“ (S. 289): Geräteaufzählung (Waage, Thermometer, Lupe).
  - „кружки (большая и маленькая)“ (S. 289): Messbecher in zwei Größen.
  - „линейку“ (S. 289): Lineal.
- Keine ganzen Sätze aus dem Buch. Sätze werden ohne Anführungszeichen umschrieben und mit Seitenangabe belegt: Das Ziel ist, dass Kinder Messgeräte selbst benutzen lernen (S. 289).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 5–7 gemeinsam mit einem Erwachsenen, Kinder 8–12 allein (Katalog und GDD). Verwendung: Bildschirm für den Forschungskreis, danach ein Versuch ohne Bildschirm (Eigenentwurf).
- Lernziele, prüfbar:
  1. Kind wählt zu einem Experiment eine Vermutung und sagt sie, bevor es ausprobiert (Eigenentwurf; Zielbezug „широкому экспериментированию“ (S. 288)).
  2. Kind nennt die Messgeräte Waage, Messbecher, Lineal, Thermometer und Lupe und ordnet jedem ein Experiment zu (Geräteliste S. 289, Eigenentwurf bei der Zuordnung).
  3. Erwachsener führt die reale Messung durch, das Kind beobachtet und vergleicht (Eigenentwurf: Ko-Nutzung).
  4. Kind erlebt eine widerlegte Vermutung als Ergebnis, nicht als Fehler (Eigenentwurf).

## 3. Funktion

- Bildschirme oder Blätter: ein Bildschirm mit Experimentwahl, Vermutung, Anweisung zum Ausprobieren, Ergebnis und Vergleich. Kein Druckblatt in dieser Einheit (siehe 9. Offen).
- Ablauf: Experiment wählen → drei Vermutungen zur Frage → Material und Anleitung, Erwachsenenhinweis bei Wasser und Küche → Anweisung, das Gerät wegzulegen und den Versuch wirklich zu machen → Ergebnis aus drei Optionen → Vergleich mit der Vermutung → Forscher-Satz und Erkenntnis.
- Was gedruckt wird: nichts.
- Bestand laut README, acht Experimente: fuss-hand (Schnur an Fuß und Unterarm), orange (Schale mit und ohne), apfel-kartoffel (Gewicht mit den Händen oder einer Küchenwaage), becher-flasche (Volumen mit dem Becher), schritte (Raum in Schritten), rampe (Rollen auf Rampe), eis (Schmelzen von Eis), fenster-boden (Temperatur im Raum).
- Lücken laut Befund (Ausbau):
  - Lupe fehlt. Kein Experiment nutzt die Lupe, obwohl die Quelle sie nennt (S. 289). Eigenentwurf-Vorschlag: Oberfläche eines Haushaltsgegenstands vergrößert betrachten und die Vermutung über Details festhalten.
  - Lineal fehlt als Gerät. Länge wird mit Schnur und Schritten gemessen; das Lineal nennt nur die Quelle (S. 289).
  - Thermometer nur als Zusatz („falls vorhanden“) bei Hand-Temperatur; die Messung mit Gerät ist optional.

## 4. Daten

Datei: `apps/mess-labor/daten/experimente.json`. Vorhandene Schlüssel: version, hinweis, schritte, experimente (8 Einträge). Neue Einträge für Lupe und Lineal nach diesem Schema:

```json
{ "id": "lupe-oberflaeche", "titel": "Lupe und Oberfläche", "quelle": { "seite": "S. 289" }, "eigenentwurf": true }
```

Die acht bestehenden Experimente sind Eigenentwurf (`eigenentwurf: true`). Die Geräteaufzählung stammt aus S. 289 und wird im Feld `quelle` der Geräte-Zuordnung vermerkt.

## 5. Pseudocode

```
pruefeExperimente(daten) -> Liste der Fehler (leer = gültig)
  Anzahl daten.experimente >= 10 (acht Bestand, Lupe, Lineal)
  id jedes Experiments ist eindeutig
  jedes Experiment hat frage, material, anleitung, vermutungen (genau 3),
    ergebnisse (genau 3), erkenntnis (mindestens 60 Zeichen)
  wenn material oder anleitung Wasser oder Küche nennt: erwachsenenHinweis vorhanden
  Geräte-Abdeckung: je mindestens ein Experiment für Waage, Messbecher,
    Schnur oder Lineal, Thermometer, Lupe
  jedes Experiment mit eigenentwurf == false hat quelle.seite

vergleicheVermutung(vermutungIndex, ergebnisIndex) -> { treffer: bool, text: string }
  treffer = (vermutungIndex == ergebnisIndex)
  text bei Abweichung: Forschungserfolg, keine Beschämung
  text enthält keine Wörter aus der Beschämungsliste (Test)

forscherSatz(experiment, vermutungIndex, ergebnisIndex) -> string
  Eingabe: Experiment aus daten.experimente, Indizes 0 bis 2
  Rückgabe: Satz aus vergleicheVermutung plus experiment.erkenntnis
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Befund: die App speichert nichts (README, GDD Abschnitt 5).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Befund: Netzwerk-Wächter laut README; Prüfung in der Abnahme.
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Befund: keine Eingabefelder in app.mjs gefunden.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Befund: die App vergleicht die Vermutung, nicht das Kind.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Nicht zutreffend, solange kein Druck gebaut wird.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung: Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden): Bank gültig (mindestens 6 Experimente, je 3 Vermutungen und Ergebnisse, Erkenntnis mindestens 60 Zeichen), Hinweis auf Erwachsene bei Wasser- und Küchen-Experimenten, Mess-Themen-Abdeckung (Länge, Gewicht, Volumen, Zeit, faire Messung, Einheiten), vergleicheVermutung, forscherSatz. Ausbau: Mindestzahl auf 10 anheben, Geräte-Abdeckung für Lupe und Lineal ergänzen.
- `test/regeln.test.mjs` (neu, nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`).

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein horizontaler Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick, Speicher gleich null, nur localhost.
- Druck: entfällt in dieser Einheit.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Lupe-Experiment fehlt. Inhalt und Material sind zu entscheiden (Eigenentwurf-Vorschlag in Abschnitt 3).
- Lineal: entscheiden, ob Schnur und Schritte genügen oder ein Lineal-Experiment ergänzt wird.
- Altersgruppe: Katalogeintrag und GDD nennen 5–7 gemeinsam, 8–12 allein; der Katalogabschnitt und index.json nennen 3–5. Entscheidung, welche Angabe gilt.
- Druckfassung (Forscher-Heft mit Protokollbogen, GDD Abschnitt 7) ist nicht Teil dieser Einheit. Entscheidung.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard für neue Apps: keine Seitenzahl auf dem Druckblatt; Seitenangaben stehen in Abschnitt 1 und in den Daten im Feld quelle.
- Vorlesefunktion (F2), Favicon (A3).
- Offline-Test (F4): Neuladen ohne Netz wird berichtet, ist aber keine Abnahmebedingung.
