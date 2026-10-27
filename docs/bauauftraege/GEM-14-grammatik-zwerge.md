# Bauauftrag GEM-14: Grammatik-Zwerge

Status: teilweise · Abschnitt: Gemeinsame Apps 3–5 · Ziel: Ausbau von apps/grammatik-zwerge/
Blockiert durch: keine (A7 am 27.10.2026 umgesetzt)

Stand 27.10.2026: A7 ist umgesetzt. Der Motor `quiz-kern` speichert nichts und kennt keinen Rekord, keine Punkte und keine Ränge mehr; die Quiz-Apps laufen ohne Wertung durch (Quiz-Durchlauf). Aussagen zu A7 weiter unten stammen aus der Zeit davor.

## 1. Quelle

- Praleska, S. 141 (141–142), Abschnitt „Грамматический строй речи“ (S. 141), Gruppe „Почемучки“ (S. 142).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Грамматический строй речи“ (S. 141)
  - „пространственные предлоги“ (S. 141)
  - „различных падежах“ (S. 141)
  - „навыками словообразования“ (S. 142)
  - „Почемучки“ (S. 142)
- Umschrieben, ohne Anführungszeichen: Die Seiten nennen Ziele zu Ortsangaben mit Präpositionen (S. 141–142), zum Gebrauch von Substantiven in verschiedenen Fällen (S. 141) und zur Wortbildung mit Suffixen und Präfixen (S. 142).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit (Eigenentwurf) gekennzeichnet. Dazu gehören die Pluralmuster und die Komposita (Zusammensetzungen); die Quelle nennt für Wortbildung Suffixe und Präfixe (S. 142), nicht Komposita.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 4–6 Jahre, nur gemeinsam mit einem Erwachsenen; ausdrücklich geeignet für Kinder mit ukrainischer oder russischer Familiensprache (DaZ). Verwendung: Bildschirm. Druck ist nicht gebaut.
- Lernziele, prüfbar:
  1. Kind wählt zu einer Szene das passende Ortswort (auf, unter, in, neben, zwischen) mit dem Dativ-Artikel (Eigenentwurf; Grundlage „пространственные предлоги“ (S. 141)).
  2. Kind bildet die Mehrzahl eines Substantivs aus sechs Mustern (-e, -e mit Umlaut, -er, -(e)n, -s, Umlaut) (Eigenentwurf; Grundlage „различных падежах“ (S. 141) als Form-Lernen).
  3. Kind setzt zwei Wörter zu einem zusammen und nennt das Grundwort (Eigenentwurf; Grundlage „навыками словообразования“ (S. 142)).

## 3. Funktion

- Bildschirme oder Blätter: Gate für Erwachsene; drei Spiele: „Wo ist es?“ (neun Szenen, fünf Ortswörter), „Einer und viele“ (neun Aufgaben, sechs Muster), „Zwei Wörter werden eins“ (neun Wörter, davon drei mit Bindelaut, zum Beispiel Sonnenblume, Straßenbahn, Hundehütte); Bildschirm „Was hier immer so ist?“ mit vier Regeln und ihren Grenzen; Abschluss „Bildschirm aus“ mit drei Offline-Ideen; `eltern.html` im Eltern-Sammelband (README, GDD).
- Ablauf: Erwachsener öffnet das Gate → höchstens sechs Aufgaben (`PRO_SESSION = 6`) → nach jeder Aufgabe ein Gesprächsimpuls in Frageform → Rückmeldung (richtig; „Fast – gut gedacht!“ bei `fastRichtig` mit Nennung der Form) → Pflichtabschluss.
- Was gedruckt wird: nichts.
- Der Katalog verlangt (docs/10, Ko-Nutzung Nr. 14): Präpositionen auf, unter, hinter, neben mit Bildszene; Pluralbildung; Wortbildung über Komposita; Engine quiz-kern. Abweichungen: „vor“ und „hinter“ sind gesperrt (GDD §2), `quiz-kern` ist nicht verwendet (GDD §5).
- Lücke: Der Katalogtext nennt „hinter“, die App sperrt es. Die Begründung steht im GDD und in `eltern.html`. Der Katalogtext ist noch nicht angeglichen (siehe 9).

## 4. Daten

Datei: `apps/grammatik-zwerge/daten/grammatik.json`. Die Datei enthält die Ortswörter, die Mehrzahl-Aufgaben, die Komposita und die Regeln mit ihren Grenzen (`gilt`). Schema mit einem Ausschnitt; `fastRichtig` ist das Feld der Über-Generalisierung (GDD §6, Schlüsselnamen gegen die Datei prüfen). Herkunftsangabe als Vorschlag (Eigenentwurf):

```json
{ "fastRichtig": "die Balls", "quelle": { "seite": "S. 141" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
// Funktionsnamen nach GDD §4 und README. Signaturen sind Eigenentwurf; vor dem Bau gegen logik.mjs abgleichen.
ortsangabe(wort, behaelter) -> Text
  berechnet den Dativ-Artikel aus behaelter (Genus aus den Daten)
  wort == "in" nur, wenn behaelter weiblich ist; sonst Fehler ("in dem Korb", nicht "im Korb" als Regel)
  Ergebnis wird berechnet, nie gespeichert
pruefeDaten(daten) -> Fehlerliste
  GESPERRTE_PRAEPOSITIONEN = {vor, hinter}: als Aufgabe -> Fehler
  jedes angebotene Ortswort ist mindestens einmal Lösung
  "zwischen" nur mit zwei gleichen Dingen
  Mehrzahl: mindestens 4 Arten; Einzahl != Mehrzahl; Sperrliste (Löffel, Wort, Bank, Radio, Milch)
  Komposita: teil1 + fuge + teil2 === wort; istEin nennt das Grundwort; genus === genusTeil2
  mindestens ein Wort mit Fugenlaut
  alle drei Artikel in beiden sichtbaren Bereichen
  jede Regel: gilt hat mindestens 25 Zeichen
  Lösung steht nicht in allen Aufgaben an derselben Position
  fastRichtig steht unter den falschen Antworten; nachvollziehbar ist ein angebotenes Wort, nie die Lösung
mischeEinmal(aufgabe) -> antworten
  einmal pro Aufgabe; Knöpfe und Vorlesetext lesen dieselbe Liste
antworte(aufgabe, gewaehlt) -> {status, text}
  gewaehlt == Lösung            -> status "richtig"
  gewaehlt == fastRichtig       -> status "fast", Text "Fast – gut gedacht!" plus Form des Wortes
  sonst                         -> status "falsch", neutraler Text, ohne Punkte
sitzungEnde(zaehler) -> bool
  zaehler >= PRO_SESSION (6) -> Abschluss "Bildschirm aus" mit drei Offline-Ideen
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Die App nutzt localStorage nicht (README, GDD §9).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Entfällt, da kein Druck.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).
- Hinweis zu dieser Einheit: Die Ortsangaben sind gerechnet, nicht gespeichert. Die Vorlesefunktion liest dieselbe Liste wie die Knöpfe. Beides muss erhalten bleiben.

## 7. Tests

- `test/logik.test.mjs` (16 Tests, laut README und GDD): Datengültigkeit; Sperre von vor und hinter; Vollständigkeit der Ortswörter; Dativ-Berechnung; Regeln für in und zwischen; Mehrzahl-Arten und Sperrliste; `fastRichtig`; wandernde Lösungsposition; `nachvollziehbar` bei zwischen; Fugen-Rechenprobe und Gegenbeispiel-Pflicht; Regelgrenzen; Genus-Balance; Sitzungsgrenze; Antwortprüfung; Ton und Abschluss.
- `test/regeln.test.mjs`: fehlt in dieser App. Anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs` (Eigenentwurf).

## 8. Abnahme

- `node --test apps/grammatik-zwerge/test/*.test.mjs` grün (16 Tests, README und GDD stimmen überein).
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, nur `localhost`.
- Impressum und Datenschutzerklärung vor einem Release (docs/02 Z. 160).
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Katalogtext „hinter“ (docs/10, Nr. 14) gegen die gesperrte Form in der App: Katalogtext angleichen oder Abweichung bestätigen.
- Quiz-Engine (A7): Der Katalog nennt `quiz-kern`, die App verwendet bewusst keinen. Entscheidung dokumentieren.
- Mehrzahl-Muster und Komposita sind Eigenentwurf. Fachliche Prüfung durch eine Lehrkraft für Deutsch als Zweitsprache ist offen.
- Zitatgrenze (A10 b): 6 oder 12 Wörter offen. Dieser Auftrag und der Prüfer verwenden 6.
- Sternchen vor einzelnen Zielen (A11): Die Seiten 141 und 142 haben solche Sternchen; ihre Bedeutung steht nicht im Text.
