# Bauauftrag ELT-9: Vorlese-Kompass 1-3

Status: teilweise · Abschnitt: Eltern-Werkzeuge · Ziel: Ausbau von apps/vorlese-kompass
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 73 (73–78), Abschnitt „Художественное восприятие“ (S. 73), Gruppe „МАЛЫШИ“ (S. 74).
- Katalogeintrag: docs/10, Zeile 366, Eintrag Vorlese-Kompass 1-3.
- Faktenstand laut index.json: nur Katalogtext.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „золотому фонду мировой детской литературы“ (S. 73): Kinderliteratur als Bestand.
  - „многократного восприятия“ (S. 74): wiederholtes Erleben desselben Werks.
  - „Рекомендуемые произведения“ (S. 75): Abschnitt mit empfohlenen Werken.
  - „Белорусские народные песенки и потешки“ (S. 75): Volkslieder und Reime, Gruppe der Quelle.
  - „Русские народные песенки и потешки“ (S. 76): dieselbe Gruppe, russischer Teil.
  - „Литературные сказки“ (S. 77): literarische Märchen.
  - „Произведения белорусских поэтов“ (S. 77): Werke der Dichter.
  - „Произведения русских писателей“ (S. 78): Werke russischer Autoren.
- Keine ganzen Sätze aus dem Buch. Sätze werden ohne Anführungszeichen umschrieben und mit Seitenangabe belegt: Die Quelle nennt sechs Formen, dasselbe Werk wiederholt zu lesen und zu erzählen (S. 74).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet. Dazu gehören die sieben Schritte der Methode und die Buchtypen.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Eltern, Kinder 1–3. Verwendung: Bildschirm; Vorlesen über die vorhandene Vorlesefunktion.
- Lernziele, prüfbar:
  1. Erwachsener kennt eine Methode aus sieben Schritten zum dialogischen Vorlesen (Eigenentwurf; Grundlage: wiederholtes Erleben „многократного восприятия“ (S. 74)).
  2. Erwachsener wählt je Altersfenster (bis 1, 1–2, 2–3) Buchtypen, nicht konkrete Titel (Eigenentwurf; Auswahlbasis der Quelle „Рекомендуемые произведения“ (S. 75)).
  3. Erwachsener weiß, dass Vorlesen in jeder Familiensprache zählt (Eigenentwurf).

## 3. Funktion

- Bildschirme oder Blätter: Sinn-Hinweis, Methodenkarte mit sieben Schritten und Vorlesen-Knopf, Altersfenster als Auswahl mit Tipp, Kanon der Buchtypen.
- Ablauf: Methodenkarte zeigen → methodeText(daten) zum Vorlesen → Altersfenster wählen → naechsterIndex(aktuell, laenge) zum Weiterschalten → Kanon mit Begründung je Typ.
- Was gedruckt wird: nichts. Eine druckbare Methodenkarte ist Erweiterung (GDD Abschnitt 7).
- Bestand laut Datei: sieben Schritte (methode.schritte), drei Altersfenster (bis1, 1-2, 2-3), fünf Buchtypen (kanon: Alltag, Tiere und Fahrzeuge, Reim und Wimmelbuch, Gefühle, mehrsprachig). Keine Titel und keine Cover.
- Lücken laut Befund (Ausbau):
  - Der Katalog nennt 13 Kanon-Kategorien als Auswahllogik (docs/10, Zeile 366). Der Bestand hat fünf Buchtypen.
  - Der Katalog nennt 204 Werke (docs/10, Zeile 366). Die App nennt bewusst keine Titel (GDD Abschnitt 5). Die Zahl ist nicht im Auftrag gezählt.
  - Die Quelle nennt sechs Formen des wiederholten Lesens (S. 74). Der Katalog spricht von sieben Stufen; die siebte ist Eigenentwurf.
  - uk- und ru-Fassung fehlt (GDD Abschnitt 7).

## 4. Daten

Datei: `apps/vorlese-kompass/daten/kompass.json`. Vorhandene Schlüssel: version, hinweis, methode (name, schritte mit sieben Einträgen), altersstufen (drei Einträge: bis1, 1-2, 2-3), kanon (fünf Einträge mit id, emoji, art, warum). Schema mit einer Beispielzeile für neue Kanon-Einträge:

```json
{ "id": "tiere", "art": "Tier- und Fahrzeugbuch", "quelle": { "seite": "S. 75" }, "eigenentwurf": true }
```

Buchtypen sind Eigenentwurf (`eigenentwurf: true`). Die Seitenangabe zeigt die Auswahlbasis der Quelle. Titel gehören nicht in die Daten.

## 5. Pseudocode

```
pruefeKompass(daten) -> Liste der Fehler (leer = gültig)
  methode.schritte hat genau 7 Einträge (Eigenentwurf, siehe Abschnitt 3)
  altersstufen-Ids sind genau bis1, 1-2, 2-3; jede Stufe hat Text und Tipp
  kanon: Anzahl ausbauen auf 13 Kategorien (Zielwert offen, siehe 9. Offen)
  kanon-Ids sind eindeutig; art und warum sind nicht leer
  kein Eintrag enthält Buchtitel-Muster (Anführungszeichen mit Werkangabe, Verlag, ISBN)
  jeder Kanon-Eintrag mit eigenentwurf == false hat quelle.seite

methodeText(daten) -> Text
  nummeriert alle Schritte aus methode.schritte, ohne Eingabewerte

naechsterIndex(aktuell, laenge) -> Index
  Ergebnis ist aktuell + 1, nach dem letzten Index wieder 0
  ohne Zufall; laenge kommt als Parameter
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Befund: kein localStorage in app.mjs; die README nennt keinen Bedarf.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Befund: installiereNetzwerkWaechter() in app.mjs Zeile 8.
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Befund: keine Eingabefelder in app.mjs gefunden.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Befund: keine Bewertung.
- [ ] Keine konkreten Buchtitel und keine Cover (GDD Abschnitt 5, Urheberrecht).
- [ ] Druck: nicht zutreffend, solange keine Druckfassung gebaut wird.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung: Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden): Daten gültig (sieben Schritte, mindestens drei Altersstufen, mindestens vier Kanon-Typen), Abdeckung (offene Fragen, Wiederholung, Mehrsprachigkeit, Bibliothek), methodeText nummeriert alle sieben Schritte, naechsterIndex. Ausbau: Kanon-Zahl prüfen, Buchtitel-Muster ausschließen.
- `test/regeln.test.mjs` (neu, nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`).

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein horizontaler Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick, Speicher gleich null, nur localhost.
- Vorlesen: der Knopf spricht die Methode vor; keine Zahl in der Ausgabe außer der Nummerierung.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Kanon: fünf Buchtypen im Bestand, 13 Kategorien im Katalog. Entscheidung, ob 13 Kategorien gebaut oder der Katalog angepasst wird.
- 204 Werke: der Katalog nennt die Zahl, die App nennt bewusst keine Titel. Entscheidung, ob die Zahl im Katalog bleibt.
- Sieben Schritte: die Quelle nennt sechs Formen des wiederholten Lesens (S. 74). Entscheidung, ob „sieben Schritte“ als Eigenentwurf benannt wird.
- uk- und ru-Fassung und Herkunftssprachen-Brücke: offen.
- Vorlesefunktion (F2): die App hat eine; die Regel für Eltern-Werkzeuge ist offen.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard für neue Apps: keine Seitenzahl auf dem Druckblatt; Seitenangaben stehen in Abschnitt 1 und in den Daten im Feld quelle.
- Favicon (A3).
- Offline-Test (F4): Neuladen ohne Netz wird berichtet, ist aber keine Abnahmebedingung.
