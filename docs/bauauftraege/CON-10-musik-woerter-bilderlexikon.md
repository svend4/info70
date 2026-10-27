# Bauauftrag CON-10: Musik-Wörter-Bilderlexikon

Status: offen · Abschnitt: Content-Pakete, Funktionen, Dokumente · Ziel: neue App `apps/musik-woerter-bilderlexikon/`
Blockiert durch: keine (A7 am 27.10.2026 umgesetzt)

Stand 27.10.2026: A7 ist umgesetzt. Der Motor `quiz-kern` speichert nichts und kennt keinen Rekord, keine Punkte und keine Ränge mehr; die Quiz-Apps laufen ohne Wertung durch (Quiz-Durchlauf). Aussagen zu A7 weiter unten stammen aus der Zeit davor.

## 1. Quelle

- Praleska, S. 260 (Einzelseite), Abschnitt „Развиваемся в деятельности“ (S. 259), Gruppe „ФАНТАЗЕРЫ“ (S. 260).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „музыкальными терминами“ (S. 260)
  - „солист“ (S. 260)
  - „аккомпанемент“ (S. 260)
  - „дирижер“ (S. 260)
  - „композитор“ (S. 260)
  - „мелодия“ (S. 260)
  - „опера“ (S. 260)
  - „арфе“ (S. 260)
  - „контрабасе“ (S. 260)
  - „виолончели“ (S. 260)
  - „клавесине“ (S. 260)
  - „органе“ (S. 260)
  - „фортепиано“ (S. 260)
  - „кларнете“ (S. 260)
- Umschrieben, ohne Anführungszeichen: Die Seite zählt Fachbegriffe zu Gesang, Orchester, Form, Tempo und Ausdruck auf. Es sind 16 Begriffe, wenn die Vokal- und Instrumentalmusik sowie das Blas- und das Streichorchester je einzeln gezählt werden (S. 260, Zählung: Eigenentwurf). Sieben Orchesterinstrumente sind genannt (S. 260).
- Die deutschen Begriffe und die Erklärungen in einfacher Sprache sind Eigenentwurf (docs/10, Z. 457: Deutsche Fachbegriffe in einfacher Sprache).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.
- Katalogeintrag: docs/10, Z. 457 (Musik-Wörter-Bilderlexikon). Zielgruppe 5 bis 9, Typ S.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 5 bis 9 Jahre (docs/10, Z. 457). Die Quelle ordnet die Seite der Gruppe „ФАНТАЗЕРЫ“ zu, deren Altersstufe 5 bis 7 Jahre ist (S. 199–200). Die Altersspanne bleibt offen (Abschnitt 9). Verwendung: Bildschirm (Lexikon, gemeinsam mit Erwachsenen oder allein) und Druck (Lexikon-Karten).
- Lernziele, prüfbar (Eigenentwurf):
  1. Kind wählt einen Begriff aus einer Liste und sieht Wort, Bildfeld und eine kurze Erklärung in einfacher Sprache (`begriffKarte`).
  2. Erwachsener zeigt die sieben Instrumente in einer eigenen Ansicht und liest ihre Erklärung vor.
  3. Erwachsener druckt eine Lexikon-Karte je A4-Blatt hoch, ohne Zeichen aus der Sperrliste und ohne Namenszeile.

## 3. Funktion

- Bildschirme oder Blätter: (1) Startliste mit den Kategorien Musik, Orchester, Instrumente; (2) Begriffsliste je Kategorie; (3) Begriffskarte mit Wort, Bild und Erklärung; (4) Instrumentenansicht; (5) Druckvorschau.
- Ablauf: Kategorie wählen → Begriff wählen → Begriffskarte zeigen → vorlesen (F2 offen) → optional drucken. Jeder Schritt ist eine Auswahl, kein Freitext (Eigenentwurf).
- Keine Punkte, keine Auswertung, kein Rekord und kein Rang (docs/02, Z. 141–146). Der Katalog nennt als Träger den quiz-kern (docs/10, Z. 457). Die App nimmt ihn nicht an. Die Entscheidung steht in Abschnitt 9.
- Bilder: eigene Zeichnungen im App-Ordner, keine externen Medien (docs/10, Z. 457). Bis zur Zeichnung steht ein Platzhalter mit dem Begriff (Eigenentwurf).
- Was gedruckt wird: eine Lexikon-Karte je Blatt A4 hoch mit Wort, Bild und Erklärung. Keine Seitenzahl auf dem Blatt (A18-Standard). Keine Namenszeile.

## 4. Daten

Datei: `apps/musik-woerter-bilderlexikon/daten/begriffe.json` (neu). Schema mit einer Beispielzeile:

```json
{ "id": "solist", "de": "Solist", "ru": "солист", "uk": null, "kategorie": "musik", "bild": "bilder/solist.svg", "erklaerung": "…", "quelle": { "seite": "S. 260" }, "eigenentwurf": true }
```

- Feld `kategorie` nur aus: `musik`, `orchester`, `instrument`.
- Feld `bild` ist ein Pfad innerhalb des App-Ordners.
- Feld `uk` bleibt `null`, bis die Übersetzung geprüft ist (offen).
- Die Begriffe aus Abschnitt 1 tragen `quelle.seite` „S. 260“. Erklärungen und deutsche Begriffe tragen `eigenentwurf: true`.

## 5. Pseudocode

```
ladeBegriffe(daten) -> Liste<Begriff>
  prüfe je Eintrag: id, de, kategorie in {musik, orchester, instrument}, bild
  bricht ab, wenn bild nicht unter apps/musik-woerter-bilderlexikon/ liegt (keine externen Medien)
  gib daten.begriffe in Dateireihenfolge zurück

pruefeBegriffe(daten) -> Liste<Fehler>
  Fehler, wenn die Zahl der Einträge mit quelle.seite == "S. 260" und kategorie != instrument nicht 16 ist
  Fehler, wenn die Zahl der Einträge mit kategorie == instrument und quelle.seite == "S. 260" nicht 7 ist
  Fehler, wenn ein Eintrag weder quelle.seite noch eigenentwurf == true hat
  Fehler, wenn ein Instrument ohne Quelle nicht eigenentwurf == true hat

begriffeFuer(begriffe, kategorie) -> Liste<Begriff>
  gib alle Einträge mit kategorie == kategorie zurück

begriffKarte(begriff, sprache) -> { wort, erklaerung, bild, sprache }
  sprache ∈ {de, ru, uk}
  wort = begriff.de bei de; begriff.ru bei ru; begriff.uk bei uk; null, wenn der Wert null ist
  erklaerung = begriff.erklaerung (Eigenentwurf, höchstens zwei Sätze)
  bild = begriff.bild

druckBlaetter(karten) -> Liste<Blatt>
  je Karte ein Blatt A4 hoch mit wort, erklaerung und bild; Karten mit wort == null werden übersprungen
  prüft Zeichen: keine aus ☐☒☑✓✔★☆, keine Emojis (\p{Extended_Pictographic})
  erzeugt keine Namenszeile
  Pflichtmarkierung nur, wenn ein Blatt eine Seitenangabe trägt (A18-Standard: keine)

vorlesetext(karte) -> String
  nur nach Entscheidung F2; gibt wort und erklaerung als Text zurück
```

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Die App speichert keine Nutzerdaten (Eigenentwurf).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Bilder liegen im App-Ordner.
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 17–30). Nur Auswahl aus Listen.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Kein quiz-kern (A7).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Sie steht auf jedem gedruckten Blatt mit Seitenangabe. Ohne menschliche Prüfung erfüllt keine Seitenangabe die Regel docs/02 Z. 151–152. Deshalb trägt das Blatt keine Seitenangabe (A18).
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen. Der Katalog nennt Begriffspaare de, uk und ru (docs/10, Z. 457).

## 7. Tests

- `test/logik.test.mjs`: Bank gültig (Pflichtfelder, drei Kategorien); `pruefeBegriffe` zählt 16 Begriffe und 7 Instrumente aus S. 260; `begriffeFuer` liefert nur die Kategorie; `begriffKarte` liefert `null` für uk, solange uk leer ist; `druckBlaetter` überspringt Karten ohne Wort.
- `test/regeln.test.mjs`: Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs` (Druck ohne Zeichen aus der Sperrliste, ohne Namenszeile; Knopfhöhe 3rem; kein Import von `quiz-kern`; kein Bild außerhalb des App-Ordners).

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick (bei Bildschirmwechsel auf der Überschrift), Speicher gleich null, nur `localhost`.
- Druck: eine Lexikon-Karte je Blatt; keine Zeichen; keine Namenszeile; Zahl gedruckter Karten gleich Auswahl.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Blockade A7 (quiz-kern): Die Engine speichert Rekord und Rang (docs/fragen-und-hinweise.md, A7). Der Katalog nennt quiz-kern als Träger (docs/10, Z. 457). Der Bauauftrag nimmt ihn nicht an. Bauen erst nach Entscheidung A7.
- Altersspanne: Katalog 5 bis 9 (docs/10, Z. 457); die Quelle S. 260 gehört zur Gruppe „ФАНТАЗЕРЫ“ (5 bis 7 Jahre, S. 199–200). Entscheidung nötig.
- Vorlesefunktion (F2): gilt die Regel für diese Werkzeuge?
- Übersetzung uk und ru: offen.
- Bilder: Zeichnungen sind noch nicht erstellt. Platzhalter bis dahin (Eigenentwurf).
- Seitenangabe auf dem Druckblatt: Standard für neue Apps (A18). Keine Seitenzahl auf dem Blatt; die Angaben stehen in Abschnitt 1 und in den Daten als `quelle`.
- Ordner `apps/musik-woerter-bilderlexikon/` existiert nicht. Der Slug folgt dem Einheitsnamen (Eigenentwurf).
