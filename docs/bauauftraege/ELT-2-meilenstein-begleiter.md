# Bauauftrag ELT-2: Meilenstein-Begleiter 1. Lebensjahr

Status: teilweise · Abschnitt: Eltern-Werkzeuge · Ziel: Ausbau von apps/meilenstein-begleiter
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 26 (26–31), Abschnitt „ХАРАКТЕРИСТИКА ПСИХИЧЕСКОГО И ФИЗИЧЕСКОГО РАЗВИТИЯ ДЕТЕЙ“ (S. 26), Gruppe „МАЛЮТКИ“ (S. 26).
- Katalogeintrag: docs/10, Zeile 347, Eintrag Meilenstein-Begleiter 1. Lebensjahr.
- Faktenstand laut index.json: nur Katalogtext.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Улыбка ребенка“ (S. 27): soziales Lächeln als erste Form des Kontakts.
  - „Комплекс оживления“ (S. 28): Belebungskomplex, etwa im dritten Monat.
  - „акт хватания“ (S. 29): Greifakt, in der Regel im fünften Monat.
  - „первые слова“ (S. 29): erste Wörter, die Quelle nennt 4 bis 20.
  - „начальная ходьба“ (S. 30): erste Schritte gegen Ende des ersten Jahres.
- Keine ganzen Sätze aus dem Buch. Sätze werden ohne Anführungszeichen umschrieben und mit Seitenangabe belegt: Die Quelle beschreibt die Entwicklung als Zusammenspiel von Kind und Erwachsenem (S. 27).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Eltern von Kindern im ersten Lebensjahr. Verwendung: Bildschirm für Erwachsene. Kein Bildschirm für das Kind.
- Lernziele, prüfbar:
  1. Erwachsener sieht je U-Fenster die Meilensteine und markiert „beobachtet“ oder lässt sie offen (Eigenentwurf; Indikatoren wie „Комплекс оживления“ (S. 28)).
  2. Erwachsener kopiert vor dem U-Termin eine Gesprächsvorlage, ohne Diagnose und ohne Daten des Kindes (Eigenentwurf).
  3. Erwachsener liest, dass die Spanne der Entwicklung groß ist und dass die Richtwerte keine Norm sind (Eigenentwurf).

## 3. Funktion

- Bildschirme oder Blätter: Auswahl des U-Fensters, Checkliste mit Haken je Meilenstein, Vorbereitung für das Arztgespräch (nur Anzeige, Kopieren), Zurücksetzen. Kein Druckblatt.
- Ablauf: U-Fenster wählen → Meilenstein abhaken oder offen lassen (Klick nimmt den Haken zurück) → Fortschritt je Fenster → Bericht für das Arztgespräch → kopieren oder vorlesen.
- Was gedruckt wird: nichts.
- Bestand laut README: vier Fenster U3 bis U6 mit je etwa sechs Meilensteinen aus den Bereichen Motorik, Sehen, Hören, Sozial, Trinken, Essen.
- Lücken laut Befund (Ausbau):
  - U2 fehlt. Der Katalog nennt U2 bis U6 (docs/10, Zeile 347).
  - Erklärtexte fehlen. Der Katalog nennt Erklärtexte; die Daten haben je Meilenstein nur ein Feld `text`, ohne Erklärung.
  - uk und ru fehlen. Der Katalog nennt die Sprachen de, uk, ru; der GDD führt die uk/ru-Fassung als Erweiterung.
  - Die Bericht-Vorschau ist ein schreibgeschütztes Textfeld (app.mjs Zeile 52), kein Eingabefeld.

## 4. Daten

Datei: `apps/meilenstein-begleiter/daten/meilensteine.json`. Vorhandene Felder: art, version, hinweis, fenster. Jedes Fenster hat id, name und meilensteine (je id, bereich, text). Neue Felder je Meilenstein (Ausbau): erklaerung und quelle. Schema mit einer Beispielzeile:

```json
{ "id": "u2-1", "bereich": "Sozial", "text": "…", "erklaerung": "…", "quelle": { "seite": "S. 27" }, "eigenentwurf": false }
```

Feld `quelle` nur, wenn der Eintrag aus S. 26–31 stammt. Sonst `eigenentwurf: true`. Die deutschen U-Fenster sind Eigenentwurf nach Katalog (Zuordnung U2–U6).

## 5. Pseudocode

```
alleIds(katalog) -> Liste aller Meilenstein-Ids
  sammelt fenster[].meilensteine[].id

pruefeKatalog(katalog) -> Liste der Fehler (leer = gültig)
  fenster-Ids sind genau u2, u3, u4, u5, u6
  jede Meilenstein-Id beginnt mit der Fenster-Id und ist eindeutig (alleIds)
  jeder Meilenstein hat text und erklaerung (nicht leer)
  jeder Meilenstein mit eigenentwurf == false hat quelle.seite
  kein Text enthält eine Altersangabe in Wochen oder Monaten als Maßstab

zaehleFenster(fenster, beobachtet) -> { gesamt: Zahl, beobachtet: Zahl }
  beobachtet zählt Ids mit beobachtet[id] == true

offene(fenster, beobachtet) -> Liste der Meilenstein-Ids ohne Haken

bericht(katalog, beobachtet, fensterId, datum) -> Text
  Kopf: Hinweis auf das U-Heft, keine Namen, keine Geburtsdaten
  datum wird als Parameter übergeben, nicht im Modul ermittelt
  je gewähltem Fenster: markierte und offene Meilensteine
  Schluss: Hinweis, die Kinderarztpraxis anzusprechen
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter. Die Speicherung der Haken ist nicht Teil dieses Pseudocodes (siehe 9. Offen).

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Befund: die App speichert Haken im localStorage unter dem Schlüssel mb.beobachtet (app.mjs Zeilen 17–18). Konflikt, siehe 9. Offen.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Befund: Netzwerk-Wächter laut README; Prüfung in der Abnahme.
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Befund: das Textfeld für den Bericht ist schreibgeschützt (app.mjs Zeile 52); die Haken sind Schaltflächen.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Befund: keine Bewertung; der Hinweis verweist an die Kinderarztpraxis.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Nicht zutreffend, solange kein Druck gebaut wird.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung: Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden): Katalog gültig (U3 bis U6, eindeutige Ids mit Präfix, Warnhinweis), Bereichs-Abdeckung (Motorik, Sprache, Sozial, Greifen), zaehleFenster, offene, bericht (U-Heft-Hinweis, Checkboxen, einzelnes Fenster wählbar). Ausbau: U2 und Erklärtexte prüfen.
- `test/regeln.test.mjs` (neu, nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`).

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein horizontaler Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick, Speicher gleich null, nur localhost (gilt, sobald die Speicherfrage entschieden ist).
- Druck: entfällt in dieser Einheit.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Konflikt Speicherung: docs/02 Zeile 25 erlaubt localStorage für Nutzerdaten mit Löschknopf. Diese Vorlage und die Sitzungsanleitung verbieten Speichern. Die App speichert die Haken unter mb.beobachtet. Entscheidung vor dem Ausbau: Speicherung erlauben oder Haken nur für die Sitzung halten.
- U2 fehlt in der App. Entscheidung, ob U2 in diese App kommt.
- Erklärtexte: Umfang und Quelle sind offen.
- uk und ru: offen (Katalog nennt die Sprachen, GDD führt sie als Erweiterung).
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard für neue Apps: keine Seitenzahl auf dem Druckblatt; Seitenangaben stehen in Abschnitt 1 und in den Daten im Feld quelle.
- Vorlesefunktion (F2): die App hat eine Vorlesefunktion; die Regel für Eltern-Werkzeuge ist offen. Favicon (A3).
- Offline-Test (F4): Neuladen ohne Netz wird berichtet, ist aber keine Abnahmebedingung.
