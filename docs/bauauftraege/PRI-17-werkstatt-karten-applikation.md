# Bauauftrag PRI-17: Werkstatt-Karten: Schneiden, Reissen, Kleben

Status: teilweise · Abschnitt: Printmaterialien Kita · Ziel: Ausbau von apps/werkstatt-karten-applikation (Lücke: Browser-Prüfung und Altersangabe)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 181 (181), Abschnitt „Аппликация“ (S. 181), Gruppe „Почемучки“ (S. 6). Ergänzungen auf S. 282–283.
- Katalog: docs/10, Zeile 489, Abschnitt Printmaterialien Kita, Nr. 17. Der Katalog nennt 4 bis 5 Jahre und drei Technikstufen.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Аппликация“ (S. 181)
  - „обучать технике работы с ножницами“ (S. 181)
  - „прямолинейное и криволинейное вырезание“ (S. 181)
  - „на фланелеграфе, листе бумаги“ (S. 181)
  - „способом обрывания“ (S. 181)
  - „элементы флористики“ (S. 181)
  - „в создании коллажей“ (S. 181)
  - „Рекомендуемая тематика детских работ“ (S. 181)
  - „Приключения Колобка“ (S. 181)
  - „Жар-птица“ (S. 181)
  - „при работе с ножницами“ (S. 126)
  - „природный материал“ (S. 282)
  - „пинцетом“ (S. 283)
  - „Почемучки“ (S. 6)
- Umschrieben, ohne Anführungszeichen: Die Quelle nennt drei Techniken ohne feste Reihenfolge: Schneiden gerader und kurviger Linien, Reißen als Abreißtechnik und Kleben von Formen auf Flanellgraph und Papier (S. 181). Collage und Flora stehen als Ziele auf S. 181; die Einordnung als Ergänzung ist Eigenentwurf. Naturmaterial wird mit Pinzette für kleine, zerbrechliche Teile verarbeitet (S. 283).
- Stern-Markierung: Die Schere-Aufgabe auf S. 181 steht mit Stern. Die Fußnote auf S. 113 kennzeichnet mit Stern die Aufgaben für ältere Kinder der Gruppe. Die Flora- und Collage-Aufgaben auf S. 283 sind ebenfalls mit Stern markiert.
- Quellenbefund: Die Quelle nennt keine drei Technikstufen (S. 181). Der Katalog nennt sie; die Stufen sind nicht übernommen.
- Quellenbefund: Die Katalog-Übertragungen „Der dicke fette Pfannkuchen“ (Kolobok) und „Laternenumzug“ (Reigen) sind keine Quellenäquivalente. Sie werden nicht verwendet.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet: der Kartenaufbau, Material und Schrittfolgen der Techniken, die deutschen Themenübertragungen, die Themengruppen für den Filter, die Einordnung der Ergänzungen und der Sicherheitssatz zur Schere (Anregung aus S. 126).
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte in Kita oder Familie. Kinder 3 bis 5 Jahre nach der Quelle (S. 6: Gruppe „Почемучки“). Der Katalog nennt 4 bis 5 Jahre (docs/10 Zeile 489); die Abweichung steht in Abschnitt 9. Verwendung: Druck. Der Bildschirm dient der Auswahl. Kinder nutzen das Werkzeug nicht.
- Lernziele, prüfbar:
  1. Die Fachkraft wählt Technik- und Themenkarten und druckt genau die gewählten, je Karte ein Blatt A4 quer.
  2. Jede gedruckte Karte nennt ihre Quelle mit Seite oder ist als Eigenentwurf gekennzeichnet.
  3. Auf keiner Karte und in keinem Druck steht ein Kind; es gibt kein Feld dafür.

## 3. Funktion

- Bildschirme oder Blätter: Bildschirm mit Filtern für Technik und Themengruppe, Auswahlknöpfen, Zählzeile und Druckknopf. Blätter: Technikkarte (Ziel, Material, nummerierte Schritte), Ergänzungskarte oder Themenkarte; je Karte ein Blatt A4 quer. Insgesamt 30 Karten: drei Technikkarten, zwei Ergänzungskarten und 25 Themenkarten.
- Ablauf: Filter wählen → Karten anhaken → Vorschau prüfen → drucken (Kopf- und Fußzeilen im Browserdialog ausschalten) → an den Arbeitsplatz legen.
- Was gedruckt wird: Kartentitel, Quellenzeile, Zeilen mit Seitenangabe, Fußzeile und Pflichtmarkierung nach Abschnitt 6.
- Stand gegenüber dem Katalog: Gebaut sind die Karten, Filter, Auswahl und Druck. Nicht gebaut sind die drei Technikstufen (Quelle nennt keine), die zweisprachigen Kartentitel de/uk/ru und die Übertragung „Der dicke fette Pfannkuchen“.

## 4. Daten

Datei: `apps/werkstatt-karten-applikation/daten/karten.json` (vorhanden). Schema mit einer Beispielzeile (Feldnamen wie in der App):

```json
{ "id": "schneiden", "art": "technik", "technik": "schneiden", "titel": "Schneiden", "quelle": "Praleska, S. 181 …", "abschnitte": [{ "ueberschrift": "Ziel (Quelle)", "zeilen": [{ "text": "…", "seite": "S. 181" }] }], "fuss": "…" }
```

`art` ist `technik`, `ergaenzung` oder `thema`. Jede Zeile mit Quellenbezug trägt `seite`; Eigenentwurf ist im Text oder in der Quellenzeile gekennzeichnet.

## 5. Pseudocode

```
alleKennungen(daten) -> Kennung[]                   (vorhanden)
sichtbar(daten, filter) -> Karte[]                  (vorhanden)
  filter.technik wirkt auf art "technik"; filter.gruppe wirkt auf art "thema"
umschalten(auswahl, kennung) -> Auswahl             (vorhanden)
gewaehlteKarten(daten, auswahl) -> Karte[]          (vorhanden)
kannDrucken(karten) -> boolean                      (vorhanden)
  true, sobald mindestens eine Karte gewaehlt ist
kartenText(karte) -> string                         (vorhanden)
  Zeilen: titel, quelle, Abschnitte mit Seiten, fuss, PFLICHTSATZ als letzte Zeile
```

Keine Zufallsquelle nötig. Die Reihenfolge der Karten ist fest.

## 6. Regeln (docs/02)

- [ ] Speicherung: keine. Die App speichert nichts; die Regel docs/02, Z. 25 (localStorage mit Löschknopf) gilt nur für Nutzerdaten. Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen (docs/02 Z. 22–24). CSP `default-src 'self'` ist Eigenentwurf der Apps; docs/02 verlangt nur das Verbot externer Anfragen.
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 19–20 schließt Konten und personenbezogene Daten aus).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Die Karten enthalten keine Merkmale einzelner Kinder; der Indikator auf S. 197 ist nicht aufgenommen.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50). Die Prüfung im Browser steht aus (Abschnitt 9).
- [ ] Pflichtmarkierung (Einheit mit Seitenangaben), auf jeder gedruckten Karte: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs` (vorhanden): Daten, Seiten, Zitate, Kennzeichnung der Eigenentwürfe, Schere, Filter, Auswahl.
- `test/regeln.test.mjs` (vorhanden): Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`: keine Eingabefelder, keine Speicherung, keine externen Adressen, keine Druckzeichen, keine Namenszeile, Pflichtmarkierung auf jeder gedruckten Karte.
- Testzahl laut App-README: 33. Neue Prüfungen für den Ausbau: Stufen-Auswahl und zweisprachige Titel, falls gebaut.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, keine Anfrage außer localhost.
- Druckvorschau: Zahl gedruckter Karten gleich Auswahl; keine Zeichen; Pflichtmarkierung je Karte; Kopf- und Fußzeilen des Browsers im Ausdruck ausgeschaltet.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Browser-Prüfung bei 360 px, Druckvorschau und Fokus stehen aus (App-README).
- Altersgruppe: Quelle 3 bis 5 (S. 6), Katalog 4 bis 5 (docs/10 Zeile 489). Die App nennt 3 bis 5. Entscheidung der Redaktion.
- Schere: Die Aufgabe steht auf S. 181 mit Stern (ältere Kinder der Gruppe, Fußnote S. 113). Die App nennt sie als Lehrziel für 3 bis 5 ohne diesen Hinweis. Entscheidung, ob die Schere-Karten für 4 bis 5 gelten oder der Hinweis auf der Karte steht.
- Scherentyp (Spitze oder rund) für die Gruppe: nicht in der Quelle; die Karten nennen keinen Typ.
- Technikstufen: Katalog nennt drei Stufen, Quelle nennt keine Reihenfolge (S. 181). Die App folgt der Quelle.
- Kartentitel uk/ru: laut Katalog vorgesehen, nicht gebaut.
- Themenübertragungen: Gemeinfreiheit der deutschen Übertragungen ist ungeprüft. Die Übertragung des Kolobok wird nicht verwendet.
- Indikator auf S. 197: beschreibt Merkmale einzelner Kinder und steht deshalb nicht auf den Karten. Die Redaktion entscheidet über eine Aufnahme.
- Standard für Seitenangaben (A18, offen): Auf dem Blatt stehen keine Seitenzahlen; die Seiten stehen in Abschnitt 1 und in den Daten als „quelle“. Die App druckt dagegen je Zeile die Seite. Entscheidung, welcher Stand gilt.
- Quellenhinweis der App: Sie nennt Katalog Zeile 483. Die Einheit steht in docs/10 in Zeile 489. Korrektur offen; die App ist nicht geändert.
- Seitenangaben ohne Markierung „проверено человеком“ (A18; docs/02 Z. 151–152).
- Vorlesefunktion (F2), Favicon (A3).
