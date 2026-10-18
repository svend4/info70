# Bauauftrag PRI-15: Vom Samen zur Pflanze - Anzucht-Kartei fuer die Kita

Status: teilweise · Abschnitt: Printmaterialien Kita · Ziel: Ausbau von apps/mini-gaertner-begleiter oder neue Anzucht-Kartei (Entscheidung offen)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 113 (113–114), Abschnitt „Как животные и растения растут“ (S. 113), Gruppe „Почемучки“ (S. 6, S. 114).
- Katalog: docs/10, Zeile 487, Abschnitt Printmaterialien Kita, Nr. 15. Der Katalog nennt S. 113–114 und zwei Lernziele (Samen, Zwiebel, Wachstumsbedingungen).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Как животные и растения растут“ (S. 113)
  - „Почемучки“ (S. 6)
  - „из семян, луковиц“ (S. 114)
  - „питательная почва“ (S. 114)
  - „ростки“ (S. 114)
- Umschrieben, ohne Anführungszeichen: Die Quelle nennt für Pflanzen: Sie wachsen aus Samen und Zwiebeln. Sie brauchen nährhaltigen Boden, Wasser, Licht und Wärme. Im Winter wachsen sie nicht. Junge Pflanzen sind weich und zart (S. 114). Pflanzen drehen Blätter und Blüten zur Sonne und können nicht weggehen (S. 113).
- Stern-Markierung: Die Wachstumsaufgaben stehen im Quelltext mit Stern. Die Fußnote auf S. 113 kennzeichnet mit Stern die Aufgaben für ältere Kinder der Gruppe. Das betrifft die Zielgruppe (Abschnitt 2 und 9).
- Quellenbefund: nicht gefunden – offen: Der Katalog-Slogan „zart wie ein Keimling“ ist deutsch. Der Quelltext ist russisch; Suchbegriff Keimling ohne Treffer. Die russische Entsprechung „ростки“ (S. 114) ist kein Slogan. Der Slogan wird nicht übernommen.
- Quellenbefund: Kresse und Tulpe stehen nicht im Quelltext (Suchbegriffe: кресс, тюльпан, ohne Treffer). Die Quelle nennt Samen und Zwiebeln, keine Arten. Die Arten sind Eigenentwurf nach dem Katalog.
- Der Stand laut index.json ist „nur Katalogtext“. Die Zitate hier sind gegen die Arbeitskopie geprüft.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet: die Bilder der Bedingungskarten, die Anzuchtschritte, die Pflanzenauswahl, der Beobachtungsbogen, das Kartenformat.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 3 bis 5 Jahre (Katalog, docs/10 Zeile 487: „3-5“; Quelle: Gruppe „Почемучки“, S. 6: drei bis fünf Jahre). Einschränkung: Die Wachstumsaufgaben sind mit Stern als Aufgaben für ältere Kinder markiert (S. 113–114). Entscheidung in Abschnitt 9.
- Verwendung: Druck, offline. Die Fachkraft begleitet; die Kinder säen und beobachten am Fensterbrett oder im Garten (Eigenentwurf).
- Lernziele, prüfbar:
  1. Die Fachkraft druckt vier Bedingungskarten (Licht, Wärme, Wasser, Boden) und eine Pflanzkarte für Samen oder Zwiebel (Eigenentwurf nach S. 114).
  2. Das Kind zeigt an den Karten, was eine Pflanze zum Wachsen braucht (Eigenentwurf nach S. 114).
  3. Das Kind zeichnet die aufgegangene Pflanze auf dem Beobachtungsbogen. Die Fachkraft notiert die Höhe in Zentimetern. Bewertet wird nur die Pflanze, nie das Kind (docs/02 Z. 141–146).

## 3. Funktion

- Bildschirme oder Blätter: Bildschirm für die Fachkraft mit der Pflanzenwahl (Kresse, Bohne, Tulpenzwiebel, Eigenentwurf), Vorschau und Druckknopf. Blätter: vier Bedingungskarten, eine Pflanzkarte, ein Beobachtungsbogen mit vier Feldern. Je Karte ein Blatt A4 hoch.
- Ablauf: Pflanze wählen → Karten drucken → Samen oder Zwiebel setzen → Bedingungskarten an den Standort hängen → Beobachtungsbogen führen (Eigenentwurf).
- Was gedruckt wird: Bedingungskarte mit Titel, einem Satz zur Quelle (S. 114, umschrieben) und einem Bild (Eigenentwurf). Pflanzkarte mit drei Schritten (Eigenentwurf). Beobachtungsbogen ohne Name und ohne Datum, mit den Feldern Zeichnung, Höhe in Zentimetern und Notiz (Eigenentwurf). Pflichtmarkierung nach Abschnitt 6. Seitenzahlen stehen nicht auf dem Blatt (A18, Abschnitt 9).

## 4. Daten

Datei: `apps/<ordner>/daten/anzucht.json` (der Ordner folgt der Entscheidung in Abschnitt 9). Schema mit einer Beispielzeile:

```json
{ "id": "beduerfnis-licht", "titel": "Licht", "text": "…", "bild": "…", "quelle": { "seite": "S. 114" }, "eigenentwurf": true }
```

Pflicht: vier Bedingungen mit den ids `licht`, `waerme`, `wasser`, `boden`; `quelle.seite` S. 114. `eigenentwurf: true` für Titel, Text und Bild.

## 5. Pseudocode

```
ladeAnzucht(json) -> {beduerfnisse: Karte[4], pflanzen: Pflanze[]}     (neu, Eigenentwurf)
  beduerfnisse: genau die ids licht, waerme, wasser, boden; sonst FEHLER_BEDUERFNIS
  je Karte: quelle.seite == "S. 114"; sonst FEHLER_QUELLE
  pflanzen: je Eintrag art in {"Samen", "Zwiebel"}, name, schritte (3); sonst FEHLER_ART
waehlePflanze(pflanzen, id) -> Pflanze                                 (neu)
  unbekannte id -> FEHLER_UNBEKANNT
baueBedingungskarten(beduerfnisse) -> Blatt[4]                         (neu)
  je Blatt: titel, bild, text, PFLICHTSATZ
baueBeobachtungsbogen(pflanze) -> Blatt                                (neu)
  vier Felder: zeichnung, hoehe_cm, notiz; kein Name-, Datums- oder Tagesfeld
pruefeDruck(blaetter) -> Fehler[]                                      (neu)
  kein Zeichen aus ☐☒☑✓✔★☆ und kein Emoji
  PFLICHTSATZ auf jeder Bedingungskarte und auf der Pflanzkarte
```

Keine Zufallsquelle nötig. Die Reihenfolge der Bedingungen folgt der Reihenfolge Licht, Wärme, Wasser, Boden.

## 6. Regeln (docs/02)

- [ ] Speicherung: keine. Die Einheit hält keine Nutzerdaten; die Regel docs/02, Z. 25 (localStorage mit Löschknopf) gilt nur für Nutzerdaten. Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen (docs/02 Z. 22–24). CSP `default-src 'self'` ist Eigenentwurf der Apps; docs/02 verlangt nur das Verbot externer Anfragen.
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 19–20 schließt Konten und personenbezogene Daten aus).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung (Einheit mit Seitenangaben), auf jeder gedruckten Karte: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs`: vier Bedingungen mit Quelle S. 114; Pflanzen nur mit Art Samen oder Zwiebel; `ladeAnzucht` lehnt eine fehlende Bedingung ab; `baueBeobachtungsbogen` enthält kein Name- und kein Datumsfeld; `pruefeDruck` findet den Pflichtsatz auf jeder Karte.
- `test/regeln.test.mjs`: Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, keine Anfrage außer localhost.
- Druck: Zahl gedruckter Blätter gleich Auswahl; keine Zeichen; Pflichtmarkierung je Bedingungskarte.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Ziel: Ausbau von apps/mini-gaertner-begleiter oder neue Anzucht-Kartei. Die App ist ein Planer für Hochbeet und Kita-Garten mit acht Kulturen für Kinder von 4 bis 7 Jahren; die Anzucht aus Samen und Zwiebel für die Fensterbank ist dort nicht gebaut.
- Altersfrage: Katalog 3–5, Quelle „Почемучки“ 3–5 (S. 6). Die Wachstumsaufgaben sind mit Stern als Aufgaben für ältere Kinder markiert (S. 113–114). Die Redaktion entscheidet, ob die Karten für 3–5 oder erst für 4–5 gelten.
- Arten Kresse, Bohne und Tulpenzwiebel: nicht im Quelltext; Auswahl ist Eigenentwurf.
- Slogan „zart wie ein Keimling“: nicht gefunden – offen; nicht übernommen.
- Bilder der Bedingungskarten: Die Quelle liefert keine Bildvorlagen. Zeichnungen oder Piktogramme sind Eigenentwurf; Entscheidung der Redaktion.
- Beobachtungsbogen: Eigenentwurf. Offen ist, ob die Kinder zeichnen oder die Fachkraft notiert.
- Speicherung: keine (Abschnitt 6). Entscheidung dieser Einheit.
- Standard für Seitenangaben (A18, offen): Auf dem Blatt stehen keine Seitenzahlen; die Seiten stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18; docs/02 Z. 151–152).
- Vorlesefunktion (F2), Favicon (A3).
