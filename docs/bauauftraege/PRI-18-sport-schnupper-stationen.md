# Bauauftrag PRI-18: Sport-Schnupper-Stationen

Status: teilweise · Abschnitt: Printmaterialien Kita · Ziel: Ausbau von apps/sport-schnupper-stationen
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 229 (229–230), Abschnitt „Спортивные игры“ (S. 229), Abschnitt „Спортивные упражнения“ (S. 230), Gruppe „Фантазеры“ (S. 6, S. 230).
- Katalog: docs/10, Zeile 490, Abschnitt Printmaterialien Kita, Nr. 18. Der Katalog nennt 5 bis 7 Jahre, 8 Sportspiele, 5 Sportübungen und 8 benannte Spiele.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Спортивные игры“ (S. 229)
  - „городками“ (S. 229)
  - „русской лаптой“ (S. 229)
  - „хоккеем на траве“ (S. 229)
  - „играм по упрощенным правилам“ (S. 229)
  - „элементарные соревнования“ (S. 229)
  - „Спортивные упражнения“ (S. 230)
  - „Кто первый повернется“ (S. 230)
  - „Слалом“ (S. 230)
  - „кто быстрее прокатит мяч“ (S. 230)
  - „Фантазеры“ (S. 6)
- Umschrieben, ohne Anführungszeichen: Die Quelle nennt acht Sportspiele (S. 229): Gorodki, Basketball, Tischtennis, Badminton, Handball, Fußball, Hockey und Lapta. Fünf Sportübungen sind Schlittenfahren, Gleiten auf vereisten Bahnen, Skilaufen, Fahrradfahren und Vorbereitung aufs Schwimmen (S. 230). Dazu kommen sechs benannte Spiele und zwei Wettbewerbsformen (S. 230). Ein Wettbewerb zählt, wie oft der Ball in einer Zeit auf den Boden geschlagen wird (S. 230). Das Ziel ist, Spiele nach vereinfachten Regeln und elementare Wettbewerbe anzubieten (S. 229).
- Quellenbefund Hockey: Die Liste auf S. 229 nennt „хоккеем на траве“ (Feldhockey). Der Technik-Absatz nennt Schläger und Scheibe (S. 229). S. 246 nennt für dieselbe Altersgruppe „хоккей“ ohne Zusatz. Die Sportart bleibt offen (Abschnitt 9).
- Quellenbefund: Auf S. 229–230 stehen keine Sicherheitsregeln für die Stationen. Sicherheit ist Eigenentwurf.
- Quellenbefund: Der Katalogname „Wer prellt öfter?“ hat im Quelltext keine Entsprechung: nicht gefunden – offen. Die Quelle nennt den Wettbewerb nur umschrieben (S. 230).
- Katalog-Begriffe ohne Entsprechung im Quelltext: Eishockey, Floorball, Wikingerschach, Dosenwerfen, Brennball, Team Deutschland, Special Olympics, DOSB. Sie sind nicht übernommen.
- Der Stand laut index.json ist „faktengeprüft“.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet: die Regeltexte, der Sicherheitssatz, die deutschen Titel in Klammern, die Einordnung als Kita oder Vorschule, die Ziel-Zeile.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 5 bis 7 Jahre (Katalog, docs/10 Zeile 490; Quelle: Gruppe „Фантазеры“, S. 6: fünf bis sieben Jahre). Fachkräfte in Kita oder Vorschule (Eigenentwurf). Verwendung: Druck. Der Bildschirm dient der Auswahl. Kinder nutzen das Werkzeug nicht.
- Lernziele, prüfbar:
  1. Die Fachkraft wählt Stationen aus 22 Karten und druckt je Karte ein Blatt A4 quer.
  2. Auf jeder Karte stehen Quellenseite und der Eigenentwurfs-Hinweis zu den Regeln. Die Ziel-Zeile steht nur auf den Sportspielkarten.
  3. Es gibt keine Rangliste, keine Punkte und keine Zählung für einzelne Kinder (docs/02 Z. 141–146).

## 3. Funktion

- Bildschirme oder Blätter: Bildschirm mit der Auswahl der 22 Karten (Übersicht, acht Sportspiele, fünf Sportübungen, sechs benannte Spiele, zwei Wettbewerbe), Auswahlknöpfen und Druckknopf. Blatt: je Karte ein Blatt A4 quer.
- Ablauf: Stationen wählen → drucken (Kopf- und Fußzeilen im Browserdialog ausschalten) → Karten an die Stationen legen (Eigenentwurf).
- Was gedruckt wird: Titel (deutsche Übertragung in Klammern, Eigenentwurf), Quellenzeile mit Seite, Aufgaben laut Quelle (übertragen), Regeltexte (Eigenentwurf), Sicherheitssatz (Eigenentwurf, auf jeder Karte), Pflichtmarkierung nach Abschnitt 6.
- Übersichtskarte: Ziel der Quelle (S. 229), Gesundheitstage (S. 226), olympische Thematik (S. 225).
- Stand gegenüber dem Katalog: Nicht gebaut sind die Technik-Piktogramme; Bilder der Quelle sind nicht übernommen. Die Ersatz-Spielnamen des Katalogs sind nicht übernommen.

## 4. Daten

Datei: `apps/sport-schnupper-stationen/daten/stationen.json` (vorhanden). Schema mit einer Beispielzeile (Feldnamen wie in der App):

```json
{ "id": "gorodki", "art": "sportspiel", "titel": "Городки (Gorodki)", "quelle": "Praleska, S. 229", "abschnitte": [{ "ueberschrift": "Quelle", "zeilen": [{ "text": "…", "seite": "S. 229" }] }], "fuss": "…" }
```

`art` ist `uebersicht`, `sportspiel`, `sportuebung`, `benanntes-spiel` oder `wettbewerb`. Jede Zeile aus der Quelle trägt `seite`. Eigenentwurf ist als solcher gekennzeichnet.

## 5. Pseudocode

```
alleKennungen(daten) -> Kennung[]                   (vorhanden)
umschalten(auswahl, kennung) -> Auswahl             (vorhanden)
gewaehlteKarten(daten, auswahl) -> Karte[]          (vorhanden)
kannDrucken(karten) -> boolean                      (vorhanden)
zeileText(zeile) -> string                          (vorhanden)
  Zeile mit Seite, so wie sie gedruckt wird
kartenText(karte) -> string                         (vorhanden)
  Zeilen: titel, quelle, Abschnitte, fuss, PFLICHTSATZ als letzte Zeile
```

Keine Zufallsquelle nötig. Die Reihenfolge der Karten ist fest.

## 6. Regeln (docs/02)

- [ ] Speicherung: keine. Die App speichert nichts; die Regel docs/02, Z. 25 (localStorage mit Löschknopf) gilt nur für Nutzerdaten. Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen (docs/02 Z. 22–24). CSP `default-src 'self'` ist Eigenentwurf der Apps; docs/02 verlangt nur das Verbot externer Anfragen.
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 19–20 schließt Konten und personenbezogene Daten aus).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50). Die Prüfung im Browser steht aus (Abschnitt 9).
- [ ] Pflichtmarkierung (Einheit mit Seitenangaben), auf jeder gedruckten Karte: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden): Daten, Seiten, Namen aus der Quelle, Kennzeichnung, Ziel-Zeile nur auf den Sportspielen, Sicherheitssatz, Wettbewerbe ohne Rangliste, Auswahl.
- `test/regeln.test.mjs` (vorhanden): Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`: keine Eingabefelder, keine Speicherung, keine externen Adressen, keine Druckzeichen, keine Namenszeile, Pflichtmarkierung auf jeder Karte.
- Testzahl laut App-README: 33.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, keine Anfrage außer localhost.
- Druckvorschau: Zahl gedruckter Karten gleich Auswahl; keine Zeichen; Pflichtmarkierung je Karte; Kopf- und Fußzeilen des Browsers im Ausdruck ausgeschaltet.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Hockey: Die Liste auf S. 229 nennt „хоккеем на траве“, der Technik-Absatz nennt Schläger und Scheibe, S. 246 nennt „хоккей“. Die Karte lässt die Sportart offen; eine Fachkraft legt sie fest.
- Ziel-Zeile: Der Satz „играм по упрощенным правилам“ steht auf S. 229 vor der Einzelliste und ist durch Silbentrennung geteilt. Bei Basketball steht das Wort einzeln. Ob die Zeile für alle acht Sportspiele gilt, ist eine fachliche Lesart.
- Sicherheit: Die Quelle nennt für Sportspiele, Übungen und Wettbewerbe keine Sicherheitsregeln. Die Karten sagen das; es wird keine Regel gesetzt.
- Eignung der Winter- und Wasserübungen (S. 230: Schlittenfahren, Gleiten, Skilaufen, Vorbereitung aufs Schwimmen) für eine deutsche Kita: fachliche Entscheidung.
- Katalogbegriffe ohne Entsprechung in der Quelle (Eishockey, Floorball, Wikingerschach, Dosenwerfen, Brennball, Team Deutschland, Special Olympics, DOSB, Technik-Piktogramme, „Wer prellt öfter?“): nicht übernommen. Ob der Katalogeintrag angepasst wird, ist offen.
- Katalogzahl „8 benannte Spiele“: S. 230 nennt sechs Spielnamen und zwei Wettbewerbsformen. Der Katalogeintrag ist nicht geändert.
- Gleichgewichtsübungen (S. 228) und „волчок“ (S. 230) sind nicht aufgenommen; Entscheidung offen.
- Regeltexte sind Eigenentwurf; eine Fachkraft liest sie gegen.
- Nicht geprüft: Darstellung bei 360 px im Browser, Druckvorschau, Prüfung auf dem Gerät.
- Altersgruppe: Quelle 5 bis 7 (S. 6); die Einordnung als Kita oder Vorschule ist Eigenentwurf.
- Standard für Seitenangaben (A18, offen): Auf dem Blatt stehen keine Seitenzahlen; die Seiten stehen in Abschnitt 1 und in den Daten als „quelle“. Die App druckt die Seite je Karte und je Zeile. Entscheidung, welcher Stand gilt.
- Seitenangaben ohne Markierung „проверено человеком“ (A18; docs/02 Z. 151–152).
- Vorlesefunktion (F2), Favicon (A3).
