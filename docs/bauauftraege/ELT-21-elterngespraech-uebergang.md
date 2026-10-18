# Bauauftrag ELT-21: Elterngespraech-Begleiter: Uebergang Kita-Grundschule

Status: teilweise · Abschnitt: Eltern-Werkzeuge · Ziel: Ausbau von apps/elterngespraech-uebergang/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 311 (300–311), Abschnitt „ОСНОВНЫЕ ПОКАЗАТЕЛИ РАЗВИТИЯ ДЕТЕЙ“, Gruppe: keine (Altersstufe „к концу седьмого года жизни“ (S. 300)).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Основные показатели развития детей“ (S. 301)
  - „Здоровье и физическое развитие“ (S. 300)
  - „Психологическое здоровье“ (S. 300)
  - „Трудовая деятельность“ (S. 311)
  - „Предпосылки учебной деятельности“ (S. 311)
  - „звуковой анализ“ (S. 311)
  - „все гласные буквы“ (S. 311)
- Die acht Vorbedingungen auf S. 311 sind umschrieben, nicht wörtlich: Interesse am Erkennen, Haltung zum lernenden Spiel, Vorlaeuferfaehigkeiten fuer Mathematik und Lesen, Lautanalyse, Vokale, Silbenlesen, allgemeine Lernfaehigkeiten, Wunsch zu lernen und in die Schule zu gehen.
- Die zwölf Felder der App sind eine Gliederung der Indikator-Bereiche auf S. 300–311 (Eigenentwurf in den Namen).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet. Dazu gehören die Rechtsfragen, Paragrafen und Landesangaben sowie die Umkehr der Fragen.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: <ausstehend>.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Eltern von Kindern kurz vor der Einschulung (Katalog: Kinder 5–7; Quelle: Stand „к концу седьмого года жизни“, S. 300). Verwendung: beides (Bildschirm zur Vorbereitung, Druck als Fragenblatt für das Gespraech).
- Lernziele, pruefbar:
  1. Eltern finden zu jedem der zwölf Felder eine eigene Frage an die Fachkraft und einen Satz, was sie selbst berichten koennen (Eigenentwurf).
  2. Eltern sehen bei jeder der zwölf Rechtsfragen, welches Bundesland gilt; die Antwort nennt mindestens einen Paragrafen. Validator: mindestens zwei Antworten, je zwei Laender.
  3. Das Druckblatt enthaelt nur Fragen und Antwortlinien, ohne Haken, Punkte, Namenszeile oder Angabe zu einem Kind.

## 3. Funktion

- Katalog verlangt (docs/10, Eintrag ELT-21): Checkliste in Elternsprache zu den zwölf Indikator-Bereichen plus acht Lernvoraussetzungen, mit Erklaertexten, Staerken-Blick, Gespraechsleitfaden, Kriterien-Check und Bericht; Sprachen de, uk, ru. Adaptation: Bezug auf die Schuleingangsuntersuchung und Vorlaeuferfaehigkeiten; keine Diagnose-Anmutung; Hinweis auf Kinderarzt.
- App leistet schon (README, GDD, `logik.mjs`):
  - zwölf Felder mit Frage der Quelle, abgelehnter Frage, eigener Frage der Eltern, eigener Erzaehlung und dem Hinweis, wohin die Sache gehoert (Eigenentwurf);
  - acht Vorbedingungen mit Hinweis, was in Deutschland gilt;
  - zwölf Rechtsfragen mit Landesbezug (Eigenentwurf);
  - Druckblatt mit Fragen und Antwortlinien;
  - nur Deutsch.
- Bildschirme: Startseite mit Einleitung; Uebersicht der zwölf Felder; Feldansicht; Vorbedingungen; Rechtsfragen; Druckansicht.
- Ablauf: Feld oeffnen → Frage an die Fachkraft lesen → eigene Erzaehlung lesen → Feld zur Auswahl merken (optional) → Druckblatt → Ausdruck mit den gewaehlten Fragen.
- Was gedruckt wird: die gewaehlten Fragen (ohne Auswahl alle zwölf) mit drei Antwortlinien je Frage; eine Seite A4 hoch; keine Seitenangabe auf dem Blatt (A18-Standard).
- Luecke: keine Checkliste, kein Bericht, keine uk/ru-Fassung. Offen in Abschnitt 9.

## 4. Daten

Datei: `apps/elterngespraech-uebergang/daten/gespraech.json`. Schema mit einer Beispielzeile:

```json
{ "id": "f-seelisch", "titel": "Seelisches Wohlbefinden", "quelle": { "seite": "S. 300" }, "eigenentwurf": true }
```

Ist-Schluessel der App: `gespraechsfelder[]` (id, zeichen, name, quellPunkte, quellFrage, nichtUebernommen, ihreFrage, wasSieErzaehlen, wohinEsGehoert), `lernvoraussetzungen[]` (nr, kurz, wasHierGilt), `rechtliches[]` (id, zeichen, frage, antwort, quelle). Die Feldnamen sind Eigenentwurf.

## 5. Pseudocode

```
ladeGespraech(pfad = "daten/gespraech.json") -> {felder, vorbedingungen, rechtsfragen}
  Schritt 1: Datei lesen; bei Fehler Abbruch mit Meldung
  Schritt 2: felder hat 12 Eintraege, vorbedingungen hat 8, rechtsfragen hat 12
  Schritt 3: jede rechtsfrage nennt mindestens einen Paragrafen in antwort oder quelle

merkmaleGezaehlt(felder, vorbedingungen) -> 141
  Schritt 1: summe = Summe der quellPunkte ueber alle felder
  Schritt 2: gib summe + Anzahl vorbedingungen zurueck (Test erwartet 133 + 8 = 141)

feldVon(felder, id) -> Feld
  Schritt 1: id suchen; unbekannte id ergibt Fehler, kein Standardfeld

elternfragen(felder, auswahlIds) -> Frage[]
  Schritt 1: ist auswahlIds leer, alle zwoelf Felder in Quellenreihenfolge nehmen
  Schritt 2: je Feld {id, name, ihreFrage, wasSieErzaehlen, wohinEsGehoert} ausgeben
  Schritt 3: keine Felder mit Namen, Geburtsdatum oder Angaben zu einem Kind

angebotsTexte(felder, rechtsfragen) -> Text[]
  Schritt 1: alle Texte der App sammeln
  Schritt 2: jeden Text auf das Muster „Ihr Kind“ in der Anrede (Netz KINDFRAGE) pruefen; Treffer ist ein Testfehler
  Schritt 3: nichtUebernommen darf nur die abgelehnte Frage enthalten

druckBlatt(fragen) -> HTML
  Schritt 1: je Frage Fragetext und drei Antwortlinien
  Schritt 2: keine Zeichen ☐☒☑✓✔★☆, keine Namenszeile, keine Seitenangabe
  Schritt 3: Anzahl Fragen auf dem Blatt gleich Laenge von elternfragen(...)

speichereAuswahl(auswahlIds) -> void
  Schritt 1: nur ausfuehren, wenn die Speicher-Entscheidung in Abschnitt 9 positiv ist
  Schritt 2: localStorage-Schluessel eub-fragen; leere Auswahl entfernt den Schluessel
  Schritt 3: jeder Zugriff in try/catch; ohne Speicher bleibt die Auswahl im Arbeitsspeicher
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Hinweis: die App speichert `eub-fragen` in localStorage (app.mjs Z. 28–43); siehe Abschnitt 9.
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Die Markierung gilt für jede Anzeige mit Seitenangabe. Das Druckblatt traegt nach dem A18-Standard keine Seitenangabe.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden, laut README 21 Tests): zwölf Felder, acht Vorbedingungen, zwölf Rechtsfragen, Bilanz 133 + 8 = 141, Netzmuster KINDFRAGE, Ausnahmeliste AUSNAHME_MUSS_ENTHALTEN.
- `test/regeln.test.mjs` (fehlt, anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Druckblatt ohne Zeichen und Namenszeile, Knopfhoehe 48 px, keine Modellnamen.
- Testzahl in README und GDD nach dem Ausbau angleichen.

## 8. Abnahme

- `npm test` im App-Ordner gruen; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Ueberlauf, Knoepfe mindestens 48 px, Fokus nach Klick, nur `localhost`. Speicher gleich null gilt erst nach der Entscheidung in Abschnitt 9.
- Druck: Zahl gedruckter Fragen gleich Auswahl; keine Zeichen; keine Namenszeile.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Speicherung: die App speichert die Auswahl `eub-fragen` in localStorage mit Loeschknopf. docs/02 Z. 25–26 erlaubt localStorage fuer Nutzerdaten mit Loeschknopf; Abschnitt 6 verbietet Speicherung. Entscheidung nötig: erlauben oder entfernen.
- Katalog-Abweichungen: keine Checkliste, kein Bericht, keine uk/ru-Fassung. Begruendung in der GDD: die Checkliste wuerde wie eine Diagnose wirken; Rechtsbegriffe waeren unuebersetzt verbindlich. Entscheidung: Ausbau oder Katalog-Korrektur.
- Vorbedingungen: die README nennt die acht Punkte „дословно“ uebernommen. Das widerspricht docs/10, Rechtsrahmen Punkt 1. Umschreiben und pruefen.
- Vokale: die Quelle nennt „все гласные буквы“ mit der Einschraenkung „(или 5 из них)“ (S. 311). Die App-Dokumentation nennt „alle Vokalbuchstaben“. Angleichen.
- Feld `nichtUebernommen`: die abgelehnte Frage ist in eigenen Worten formuliert (Eigenentwurf), kein Zitat. Bei der Abnahme pruefen, dass kein Satz der Quelle enthalten ist.
- Rechtsangaben (Paragrafen, Landesrecht) stammen nicht aus der Quelle. Vor dem Druck auf Aktualitaet pruefen (docs/02 Z. 153).
- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Zitatgrenze: dieser Bauauftrag nutzt 6 Woerter (docs/10). A10 fragt, ob 12 gelten sollen (offen).
