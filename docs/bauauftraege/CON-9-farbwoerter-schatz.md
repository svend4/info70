# Bauauftrag CON-9: Farbwörter-Schatz

Status: offen · Abschnitt: Content-Pakete, Funktionen, Dokumente · Ziel: neue App `apps/farbwoerter-schatz/`
Blockiert durch: A7 quiz-kern

## 1. Quelle

- Praleska, S. 178 (Einzelseite), Abschnitt „Рисование“ (S. 178), Gruppe „ПОЧЕМУЧКИ“ (S. 178).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Рисование“ (S. 178)
  - „образными названиями цветов“ (S. 178)
  - „вишневый“ (S. 178)
  - „салатовый“ (S. 178)
  - „малиновый“ (S. 178)
  - „лимонный“ (S. 178)
  - „абрикосовый“ (S. 178)
  - „цвет морской волны“ (S. 178)
  - „теплыми и холодными“ (S. 178)
- Umschrieben, ohne Anführungszeichen: Die Seite nennt als Ziel, die Grundfarben zu festigen, bildhafte Farbnamen kennenzulernen und warme, kalte, kontrastierende und neutrale Farben zu unterscheiden (S. 178).
- Die deutschen Farbnamen (kirschrot, zitronengelb, aprikosenfarben, meergrün, himbeerrot, tannengrün) sind Eigenentwurf nach docs/10, Z. 456. Die Quelle nennt nur die russischen Begriffe.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.
- Katalogeintrag: docs/10, Z. 456 (Farbwörter-Schatz). Zielgruppe 3 bis 5 (Ko-Nutzung) und 5 bis 7, Typ S.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 3 bis 5 Jahre nur gemeinsam mit einem Erwachsenen (docs/10, Rechtsrahmen Punkt 2), und Kinder 5 bis 7 Jahre. Verwendung: Bildschirm (gemeinsame Nutzung) und Druck (Farbwort-Karte).
- Lernziele, prüfbar (Eigenentwurf):
  1. Erwachsener wählt eine von vier Farbgruppen (warm, kalt, kontrastierend, neutral) und sieht nur deren Farbwörter (`gruppeFuer`).
  2. Kind und Erwachsener betrachten eine Farbkarte mit Namen, Farbfläche und Hinweis warm oder kalt. Die Vorlesefunktion folgt nach Entscheidung F2.
  3. Erwachsener druckt eine Farbwort-Karte je A4-Blatt hoch, ohne Zeichen aus der Sperrliste und ohne Namenszeile.

## 3. Funktion

- Bildschirme oder Blätter: (1) Startansicht mit dem Hinweis, dass die App gemeinsam mit einem Erwachsenen genutzt wird (Eigenentwurf); (2) Auswahl der vier Farbgruppen; (3) Farbwort-Liste je Gruppe; (4) Farbkarte; (5) Druckvorschau.
- Ablauf: Gruppe wählen → Farbwort wählen → Farbkarte zeigen → vorlesen (F2 offen) → optional drucken. Jeder Schritt ist eine Auswahl aus einer Liste, kein Freitext (Eigenentwurf).
- Keine Punkte, kein Rekord, kein Rang, keine Auswertung eines Kindes (docs/02, Z. 141–146). Der Katalog nennt als Träger den quiz-kern (docs/10, Z. 456). Die App nimmt ihn nicht an. Die Entscheidung steht in Abschnitt 9.
- Was gedruckt wird: eine Farbwort-Karte je Blatt A4 hoch mit dem deutschen Farbnamen, der Farbfläche und dem Hinweis warm oder kalt. Russische und ukrainische Namen erst nach Entscheidung (Abschnitt 9). Keine Seitenzahl auf dem Blatt (A18-Standard). Keine Namenszeile.

## 4. Daten

Datei: `apps/farbwoerter-schatz/daten/farbwoerter.json` (neu). Schema mit einer Beispielzeile:

```json
{ "id": "kirschrot", "de": "kirschrot", "ru": "вишневый", "uk": null, "gruppe": "warm", "quelle": { "seite": "S. 178" }, "eigenentwurf": true }
```

- Feld `gruppe` nur aus: `warm`, `kalt`, `kontrast`, `neutral`.
- Feld `uk` bleibt `null`, bis die Übersetzung geprüft ist (offen, Abschnitt 9).
- Einträge zu den Begriffen aus Abschnitt 1 tragen `quelle.seite` „S. 178“. Die deutschen Namen tragen `eigenentwurf: true`.

## 5. Pseudocode

```
ladeFarbwoerter(daten) -> Liste<Farbwort>
  prüfe je Eintrag: id, de, gruppe in {warm, kalt, kontrast, neutral}
  bricht ab, wenn ein Pflichtfeld fehlt
  gib daten.farbwoerter in Dateireihenfolge zurück

pruefeFarbwoerter(daten) -> Liste<Fehler>
  Fehler, wenn ein Eintrag weder quelle.seite noch eigenentwurf == true hat
  Fehler, wenn quelle.seite nicht „S. 178“ ist (Quellbereich dieser Einheit)
  Fehler, wenn gruppe nicht in den vier Werten steht

gruppeFuer(farbwoerter, gruppe) -> Liste<Farbwort>
  gib alle Einträge mit eintrag.gruppe == gruppe zurück; leere Liste bei unbekannter Gruppe

farbkarte(farbwort, sprache) -> { name, flaeche, hinweis, sprache }
  sprache ∈ {de, ru, uk}
  name = farbwort.de bei de; farbwort.ru bei ru; farbwort.uk bei uk; null, wenn der Wert null ist
  hinweis = „warm“ oder „kalt“ aus gruppe; bei kontrast und neutral der Gruppenname (Eigenentwurf)

druckBlaetter(karten) -> Liste<Blatt>
  je Karte ein Blatt A4 hoch; Karten mit name == null werden nicht gedruckt
  prüft Zeichen: keine aus ☐☒☑✓✔★☆, keine Emojis (\p{Extended_Pictographic})
  erzeugt keine Namenszeile
  Pflichtmarkierung nur, wenn ein Blatt eine Seitenangabe trägt (A18-Standard: keine)

vorlesetext(farbkarte) -> String
  nur nach Entscheidung F2; gibt name und hinweis als Text zurück
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Die App speichert keine Nutzerdaten (Eigenentwurf).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 17–30 begrenzt Datenerhebung und Kommunikation). Nur Auswahl aus Listen.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Kein quiz-kern (A7).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Sie steht auf jedem gedruckten Blatt mit Seitenangabe. Ohne menschliche Prüfung erfüllt keine Seitenangabe die Regel docs/02 Z. 151–152 (Verweis nur mit „проверено человеком“). Deshalb trägt das Blatt keine Seitenangabe (A18).
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen. Der Katalog nennt de, uk und ru (docs/10, Z. 456).

## 7. Tests

- `test/logik.test.mjs`: Bank gültig (Pflichtfelder, vier Gruppen); `gruppeFuer` liefert nur die gewählte Gruppe; `farbkarte` liefert `null` für uk, solange uk leer ist; `druckBlaetter` erzeugt je Karte ein Blatt; `pruefeFarbwoerter` findet Einträge ohne Quelle und ohne Eigenentwurf-Kennung.
- `test/regeln.test.mjs`: Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs` (Druck ohne Zeichen aus der Sperrliste, ohne Namenszeile; Knopfhöhe 3rem; kein Import von `quiz-kern`).

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick (bei Bildschirmwechsel auf der Überschrift), Speicher gleich null, nur `localhost`.
- Druck: eine Farbwort-Karte je Blatt; keine Zeichen; keine Namenszeile; Zahl gedruckter Karten gleich Auswahl.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Blockade A7 (quiz-kern): Die Engine speichert Rekord und Rang (docs/fragen-und-hinweise.md, A7). Der Katalog nennt quiz-kern als Träger (docs/10, Z. 456). Der Bauauftrag nimmt ihn nicht an. Bauen erst nach Entscheidung A7.
- Vorlesefunktion (F2): gilt die Regel für diese Werkzeuge?
- Übersetzung uk und ru: offen. Die Quelle liefert nur den russischen Begriff.
- Seitenangabe auf dem Druckblatt: Standard für neue Apps (A18). Keine Seitenzahl auf dem Blatt; die Angaben stehen in Abschnitt 1 und in den Daten als `quelle`.
- Alter 3 bis 5: nur mit Erwachsenem und festen Sitzungslimits (docs/10, Rechtsrahmen Punkt 2).
- Ordner `apps/farbwoerter-schatz/` existiert nicht. Der Slug folgt dem Einheitsnamen (Eigenentwurf).
