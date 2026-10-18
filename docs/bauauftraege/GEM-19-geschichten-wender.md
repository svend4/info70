# Bauauftrag GEM-19: Geschichten-Wender (Stimmungs-Werkstatt)

Status: teilweise · Abschnitt: Gemeinsame Apps 3–5 · Ziel: Ausbau von apps/geschichten-wender/
Blockiert durch: A7 quiz-kern

## 1. Quelle

- Praleska, S. 253 (253–254), Abschnitt „Творчество“ (S. 253), Gruppe „Фантазеры“ (S. 254).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Творчество“ (S. 253)
  - „грустное начало“ (S. 253)
  - „тревожное окончание“ (S. 253)
  - „домысливать часть содержания“ (S. 253)
  - „по аналогии с народными“ (S. 253)
  - „Фантазеры“ (S. 254)
- Umschrieben, ohne Anführungszeichen: Die Seiten nennen Ziele zum Weiterdenken eines vorgegebenen Textes, zum Schreiben eines Anfangs oder Endes mit entgegengesetzter Stimmung und zum Erfinden eigener Märchen nach dem Vorbild von Volks- und Literaturmärchen (S. 253–254).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit (Eigenentwurf) gekennzeichnet. Dazu gehören die drei Operationen (umdrehen, luecke, tausch), die Stufen 1–3 und die Muster-Angaben (GDD §9).
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 5–7 Jahre, nur gemeinsam mit einem Erwachsenen (Katalog: 5–7 mit Erwachsenem und 8–12 eigenständig; gebaut nur die Ko-Nutzung 5–7, siehe 9). Verwendung: Bildschirm und Druck (Familienblatt mit Schreiblinien).
- Lernziele, prüfbar:
  1. Kind denkt eine kurze Geschichte weiter und nennt einen anderen Ausgang oder die fehlende Stelle (Grundlage „домысливать часть содержания“ (S. 253)).
  2. Kind hält drei bis vier Teile einer Geschichte im Kopf und verändert eine Stelle, etwa Anfang oder Ende (Eigenentwurf; Grundlage „грустное начало“ (S. 253) und „тревожное окончание“ (S. 253) als Gegenpaare).
  3. Kind erfindet eine eigene kurze Geschichte nach dem Muster eines Volks- oder Literaturmärchens (Grundlage „по аналогии с народными“ (S. 253); Muster und Stufe 3 sind Eigenentwurf).

## 3. Funktion

- Bildschirme oder Blätter: Gate für Erwachsene, auf dem die Stufe 1–3 mit einer Reihenfolge-Empfehlung und die Vorlage gewählt werden; Aufgabenbildschirm mit der Vorlage (vorlesbar, ein Satz je Teil); Operationen umdrehen, luecke und tausch; Umschalten zwischen Ausgangs- und Tauschfassung durch Antippen; ein Impuls als eine offene Frage; Erwachsenen-Knopf „Wir brauchen zusammen eine Idee“ mit drei Wegen; Druckblatt als Familiendokument mit Schreiblinien (1,1 cm) ohne Namenszeile; Abschluss „Bildschirm aus“; `eltern.html` im Eltern-Sammelband (README, GDD).
- Ablauf: Gate → genau eine Vorlage (`PRO_SESSION = 1`) → Aufgabe der gewählten Stufe → Impuls (Frage) → Erzählung mit Stift auf dem Druckblatt (kein Textfeld) → Abschluss. Aufhören ist jederzeit möglich („Für heute reicht es“).
- Was gedruckt wird: ein Blatt mit Schreiblinien als Familiendokument; kein Zähler, keine Sterne, keine Urkunde. Der Inhalt je Blatt ist in README und GDD nicht genau beschrieben (prüfen).
- Der Katalog verlangt (docs/10, Ko-Nutzung Nr. 19): trauriger Anfang → fröhliches Ende; fehlende Teile weiterdenken; Anfang und Auflösung tauschen; Vorlesen; de, uk, ru; eine isolierte, KI-bereite Erzeugerfunktion. Die App setzt davon um: Weiterdenken, Tausch durch die App selbst, Vorlesen auf Deutsch. Abweichend: kein fröhliches Ende (Zielzustand gestrichen, GDD §5); keine Erzeugerfunktion; kein Stimmungs-Etikett am Bildschirm (GDD §8).
- Lücke: siehe 9.

## 4. Daten

Datei: `apps/geschichten-wender/daten/geschichten.json`. Die Vorlagen tragen die Pflichtfelder `herkunft` (Eigenproduktion und Muster mit Quelle), `teile` (höchstens vier Sätze), `moeglichkeiten` (mindestens drei, paarweise verschiedene `art` aus der Liste WENDUNGEN) sowie bei `art: tausch` die ausgeschriebene Fassung `tauschTeile`. Feldnamen nach GDD; vor dem Ausbau gegen die Datei prüfen. Schema mit Platzhaltern; Herkunftsangabe als Vorschlag (Eigenentwurf):

```json
{ "id": "…", "herkunft": "Eigenproduktion, Muster: … (Quelle)", "stufe": 1, "teile": ["…"], "quelle": { "seite": "S. 253" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
// Namen nach README und GDD (ERLAUBTE_FELDER_VORLAGE, WENDUNGEN, MAX_TEILE, PRO_SESSION, pruefeReihenfolge, getauscht, pruefeImpuls).
// Ein- und Ausgaben sind Eigenentwurf; vor dem Bau gegen app.mjs und logik.mjs abgleichen.
pruefeDaten(vorlage) -> Fehlerliste
  nur Schlüssel aus ERLAUBTE_FELDER_VORLAGE; unbekannter Schlüssel -> Fehler
  teile: höchstens MAX_TEILE = 4; jeder Teil genau ein Satz
  moeglichkeiten: mindestens 3; art paarweise verschieden und aus WENDUNGEN
  stufe 1 = umdrehen, stufe 2 = luecke, stufe 3 = tausch; tausch braucht tauschTeile
  tauschTeile nur bei art "tausch"; Erwachsenentext enthält "kein Fehlversuch"
  herkunft enthält "Eigenproduktion" und das Muster mit Quelle
  keine Verse, Reime oder Refrains; keine Eigennamen (Liste bekannter Märchennamen)
pruefeImpuls(text) -> Fehlerliste
  genau ein "?"; höchstens ein Gefühlszustand; keine "zugleich" und "obwohl"
  kein Sollzustand (zum Beispiel "fröhliches Ende")
  gilt auch für moeglichkeiten[].impuls, die dem Kind vorgelesen werden
pruefeReihenfolge(teile) -> Fehlerliste
  wird für teile und für tauschTeile geprüft
  erster Satz beginnt nicht rückverweisend ("Am Ende", "Danach", "Deshalb")
  jedes Pronomen hat seinen Bezug im selben Satz; unbestimmter Artikel vor bestimmtem
getauscht(vorlage) -> tauschTeile
  gibt die ausgeschriebene Fassung zurück; kein maschineller Satztausch
ideen(vorlage) -> drei Wege
  nur nach dem Erwachsenen-Knopf; mischen() einmal; Satz "Das sind drei von vielen Wegen"
waehleVorlage(vorlagen, art, zuletzt) -> Vorlage
  rotiert innerhalb der gewählten art; "zuletzt" nur im laufenden Bildschirm, nicht gespeichert
vorlesen(text) -> ()
  nur feste App-Texte; stimmeDa() == false -> Hinweis "bitte lies du vor" statt eines toten Knopfs
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). localStorage wird nicht verwendet (README, GDD §10).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Vorlesen über SpeechSynthesis gilt nach GDD §4 als nicht vom Netzwerkwächter erfasst; nur feste Texte.
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Kein Textfeld (GDD §4).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Keine Sterne, keine Stimmungs-Etiketten.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Das Blatt hat keine Namenszeile, auch keine freiwillige (GDD §10).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt). README und GDD belegen nur Deutsch.
- Hinweis zu dieser Einheit: Die Mitte der Geschichte wird nie vorgegeben; die Ideen erscheinen nur auf Knopfdruck des Erwachsenen (GDD §3). Das muss beim Ausbau erhalten bleiben.

## 7. Tests

- `test/logik.test.mjs` (22 Tests, laut README und GDD): Datengültigkeit; drei verschiedene Wege je Vorlage; Wendungen aus geschlossener Liste; Whitelist gegen eingeschmuggelte Felder; Ideen nicht beim Aufgabenstart und gemischt; höchstens vier Teile, jeder ein Satz, jeder einzeln hörbar; Stufen und „kein Fehlversuch“; Tausch durch die App ohne Drag-and-drop, beide Fassungen erreichbar; kein Zielzustand; jeder Impuls eine offene Frage; kein Stimmungs-Etikett; nur Ko-Nutzung 5–7 ohne Allein-Modus; nichts Erzähltes vorgelesen, kein Textfeld; keine KI, keine Netz-API, kein `quiz-kern`; Eigenproduktion ohne Verse und Eigennamen; Lücke nur bei Lücken-Vorlagen; Blatt als Familiendokument; Aufhören überall; `waehleVorlage` rotiert innerhalb der Art; beide Reihenfolgen lesbar.
- `test/regeln.test.mjs`: fehlt in dieser App. Anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs` (Eigenentwurf).

## 8. Abnahme

- `node --test apps/geschichten-wender/test/*.test.mjs` grün (22 Tests, README und GDD stimmen überein).
- Druckblatt: ohne Namenszeile, ohne Belohnungswörter, Linien 1,1 cm.
- Vorlesen: nur Deutsch; ohne deutsche Stimme erscheint der Hinweis statt eines toten Knopfs.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, nur `localhost`.
- Impressum und Datenschutzerklärung vor einem Release (docs/02 Z. 160).
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“. Prüfen, ob „S. 253–254“ auf dem Druckblatt steht.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Abweichung Altersgruppe: Der Katalog nennt 8–12 eigenständig; die App baut nur Ko-Nutzung 5–7 (README, GDD §0). Begründung: Dublette zu `apps/geschichten-werkstatt` und Regelbruch. Entscheidung bestätigen.
- Abweichung Name: „Stimmungs-Werkstatt“ ist aus dem Anzeigenamen entfernt (README). Katalogtext angleichen oder den Zusatz zurückholen.
- Abweichung Zielzustand: „fröhliches Ende“ aus dem Katalog ist gestrichen (GDD §5). Entscheidung bestätigen.
- Erzeugerfunktion (Katalog: isolierte, KI-bereite Funktion): nicht gebaut (README: keine KI). Entscheidung, ob sie später folgt.
- uk und ru: Der Katalog nennt de, uk, ru; README und GDD belegen nur Deutsch. Entscheidung (Vorlage: uk und ru offen).
- Quelle des Musters „Uther 2004“ (GDD §9): nicht in der Arbeitskopie geprüft.
- Zitatgrenze (A10 b): 6 oder 12 Wörter offen. Dieser Auftrag und der Prüfer verwenden 6.
