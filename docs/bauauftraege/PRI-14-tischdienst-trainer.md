# Bauauftrag PRI-14: Kleine-Helfer-Dienste-Set

Status: teilweise · Abschnitt: Printmaterialien Kita · Ziel: Ausbau von apps/tischdienst-trainer oder apps/aemtli-rad, oder neue Druck-App (Entscheidung offen)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 94 (94–96), Abschnitt „ПРИОБЩАЕМСЯ К ТРУДУ“ (S. 94), Gruppe „Малыши“ (S. 94, S. 96).
- Katalog: docs/10, Zeile 486, Abschnitt Printmaterialien Kita, Nr. 14. Der Katalog verweist auf S. 95 („Hauswirtschaftlicher Dienst / Tischdienst“).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „ПРИОБЩАЕМСЯ К ТРУДУ“ (S. 94)
  - „Самообслуживание“ (S. 94)
  - „Хозяйственно-бытовой труд“ (S. 95)
  - „раздаточный стол“ (S. 95)
  - „обязанности дежурного по столовой“ (S. 95)
  - „Труд в природе“ (S. 96)
  - „полить комнатные растения“ (S. 96)
- Umschrieben, ohne Anführungszeichen: Die Quelle beschreibt Hilfsaufgaben für Kinder dieser Gruppe. Dazu gehören Stühle an die Tische stellen, Stifte, Pinsel und Papier für die Arbeit bereitlegen und nach dem Essen Besteck, Brotkörbe und Serviettenhalter zum Abgabetisch bringen (S. 95). Zimmerpflanzen gießen steht bei der Arbeit in der Natur (S. 96). Ziel ist, dass das Kind Hilfe anbietet und Dank erfährt (S. 94).
- Quellenbefund: Die Quelle nennt Aufgaben, aber keine Piktogramme und keine Ansteck-Buttons. Beides ist Eigenentwurf. Der Katalog nennt „Blumen gießen“; die Quelle nennt Zimmerpflanzen (S. 96).
- Der Stand laut index.json ist „nur Katalogtext“. Die Zitate hier sind gegen die Arbeitskopie geprüft.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet: die Piktogramme, die Ansteck-Buttons, die Anleitung für das Team, die deutschen Namen der Dienste, das Kartenformat.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 2 bis 3 Jahre in der Kita-Gruppe (Katalog, docs/10 Zeile 486: „2-3“; Quelle: Gruppe „Малыши“, S. 6: ein bis drei Jahre). Die Fachkraft richtet die Tafel ein. Verwendung: Druck. Der Bildschirm dient nur der Vorbereitung durch die Fachkraft; es gibt keinen Kinderbildschirm.
- Lernziele, prüfbar:
  1. Die Fachkraft druckt eine Dienste-Tafel mit drei bis fünf Diensten, Piktogrammen und Ansteck-Buttons (Eigenentwurf).
  2. Das Kind sieht auf der Tafel, welcher Dienst ansteht, und nimmt den passenden Button. Es gibt keinen Namen und keine Zuordnung zu einem Kind (Eigenentwurf nach S. 94: Interesse an der Hilfe für Erwachsene).
  3. Die Fachkraft zeigt die Aufgabe am Beispiel und bedankt sich. Sie bewertet kein Kind (docs/02 Z. 141–146; S. 94: Dank ausdrücken).

## 3. Funktion

- Bildschirme oder Blätter: Bildschirm für die Fachkraft mit fünf Diensten zur Auswahl (Tischdienst, Stifte austeilen, Stühle stellen, Besteck zurückbringen, Pflanzen gießen), Vorschau und Druckknopf. Blätter: (1) Dienste-Tafel A4 hoch mit Piktogramm und Dienstname je Dienst, (2) Ansteck-Buttons als runde Felder je Dienst, (3) Anleitung für das Team auf einer Seite.
- Ablauf: Dienste wählen → Vorschau prüfen → drucken → Tafel aufhängen, Buttons ausschneiden → Kinder nehmen den Button des Dienstes (Eigenentwurf).
- Was gedruckt wird: Tafel mit Piktogramm und deutschem Dienstnamen, Buttons mit Piktogramm, Anleitung mit Quellenhinweis ohne Seitenzahl (A18, Abschnitt 9). Die Pflichtmarkierung aus Abschnitt 6 steht auf der Anleitung. Keine Namenszeile, keine Tagesfelder, keine Häkchen (docs/02 Z. 79–82).

## 4. Daten

Datei: `apps/<ordner>/daten/dienste.json` (der Ordner folgt der Entscheidung in Abschnitt 9). Schema mit einer Beispielzeile:

```json
{ "id": "dienst-tisch", "titel": "Tischdienst", "piktogramm": "tisch", "anleitung": "…", "quelle": { "seite": "S. 95" }, "eigenentwurf": true }
```

Pflicht: `quelle.seite` mit S. 95 oder S. 96. `eigenentwurf: true` für Titel, Piktogramm und Anleitung. Keine Felder für Name, Kind, Datum oder Notiz.

## 5. Pseudocode

```
ladeDienste(json) -> Dienst[5]                       (neu, Eigenentwurf)
  json.dienste hat genau 5 Eintraege; sonst FEHLER_ANZAHL
  je Dienst: id, titel, piktogramm, anleitung; quelle.seite in {"S. 95", "S. 96"}; sonst FEHLER_QUELLE
  kein Feld namens name, kind, geburtstag, notiz, datum; sonst FEHLER_FELD
waehleDienste(dienste, ids) -> Dienst[3..5]          (neu)
  Anzahl ausserhalb 3 bis 5 -> FEHLER_ANZAHL; unbekannte id -> FEHLER_UNBEKANNT
baueTafel(auswahl) -> Blatt                          (neu)
  je Dienst eine Zeile: piktogramm und titel; keine Namens- oder Tagesfelder
baueButtons(auswahl) -> Blatt                        (neu)
  je Dienst ein runder Button mit piktogramm und titel
baueAnleitung(auswahl) -> Blatt                      (neu)
  je Dienst ein Satz aus dienst.anleitung; letzte Zeile PFLICHTSATZ
pruefeDruck(blaetter) -> Fehler[]                    (neu)
  kein Zeichen aus ☐☒☑✓✔★☆ und kein Emoji
  PFLICHTSATZ genau einmal, auf der Anleitung
```

Keine Zufallsquelle nötig. Die Reihenfolge der Dienste folgt der Liste in Abschnitt 3.

## 6. Regeln (docs/02)

- [ ] Speicherung: keine. Die Einheit hält keine Nutzerdaten; die Regel docs/02, Z. 25 (localStorage mit Löschknopf) gilt nur für Nutzerdaten. Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen (docs/02 Z. 22–24). CSP `default-src 'self'` ist Eigenentwurf der Apps; docs/02 verlangt nur das Verbot externer Anfragen.
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 19–20 schließt Konten und personenbezogene Daten aus).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung (Einheit mit Seitenangaben), auf der gedruckten Anleitung: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs`: fünf Dienste mit Quelle S. 95 oder S. 96; `ladeDienste` lehnt Namens- und Datumsfelder ab; `waehleDienste` akzeptiert 3 bis 5 und lehnt 2 und 6 ab; `baueTafel` enthält kein Namens- und kein Tagesfeld; `pruefeDruck` findet den Pflichtsatz genau einmal.
- `test/regeln.test.mjs`: Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, keine Anfrage außer localhost.
- Druck: fünf Dienste je Auswahl ohne Zeichen; Pflichtmarkierung genau einmal auf der Anleitung.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Ziel: Ausbau von apps/tischdienst-trainer, Ausbau von apps/aemtli-rad oder neue Druck-App. Der Tischdienst-Trainer übt das Decken eines Platzes mit Erwachsenen (4–7 Jahre). Das ist eine andere Aufgabe als eine Dienste-Tafel. Aemtli-Rad ist eine Schul-App für Klassen 6 bis 12 und speichert die Klassenliste mit Vornamen und Spitznamen lokal (aemtli.cfg). Das passt nicht zur Kita-Regel ohne Namen.
- Blumen gießen: Der Katalog nennt Blumen, die Quelle nennt Zimmerpflanzen (S. 96). Die Aufgabe bleibt bei „Pflanzen gießen“.
- Piktogramme: Der Katalog nennt sie, die Quelle nicht. Gestaltung und Verständlichkeit prüft eine Fachkraft.
- Ansteck-Buttons: Ob Kinder Buttons tragen, entscheidet das Team.
- Auswahl der Dienste: Der Katalog nennt drei Beispiele; die Quelle nennt mehr (S. 95–96). Die Auswahl der fünf Dienste ist Entscheidung der Redaktion.
- uk/ru-Beschriftung: laut Katalog optional, offen.
- Speicherung: keine (Abschnitt 6). Entscheidung dieser Einheit.
- Standard für Seitenangaben (A18, offen): Auf dem Blatt stehen keine Seitenzahlen; die Seiten stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18; docs/02 Z. 151–152).
- Vorlesefunktion (F2), Favicon (A3).
