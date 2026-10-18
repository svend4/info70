# Bauauftrag ELT-12: Musik-Alltags-Begleiter fuer Eltern

Status: teilweise · Abschnitt: Eltern-Werkzeuge · Ziel: Ausbau von apps/musik-alltags-begleiter/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 87 (87–88), Abschnitt „Музыка в повседневной жизни“ (S. 87), Gruppe „МАЛЫШИ“ (S. 88).
- Katalogeintrag: docs/10, Zeile 375, Eintrag Musik-Alltags-Begleiter fuer Eltern.
- Faktenstand laut index.json: faktengeprüft.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „ежедневное слушание“ (S. 87): taegliches Hoeren in der Gruppe. Die Dauer steht dort als Spanne in Minuten; der Bauauftrag uebernimmt sie nicht als Vorgabe.
  - „профессиональную помощь родителям“ (S. 88): Hilfe fuer Eltern, das achte Ziel des Abschnitts.
  - „МАЛЫШИ“ (S. 88): Gruppe der Quelle.
- Die Quelle nennt acht Ziele fuer Musik im Alltag (S. 87–88): Musikecke, Musik im Tagesablauf, taegliches Hoeren, Musik zur Morgengymnastik, Bewegung zu Gesang, Experimente mit klingenden Dingen, Feste und die Hilfe fuer Eltern. Umschrieben, ohne Anfuehrungszeichen.
- Keine ganzen Saetze aus dem Buch. Saetze werden ohne Anfuehrungszeichen umschrieben und mit Seitenangabe belegt (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet. Dazu gehoeren die zehn Ritualkarten der App (Eigenentwurf; Bezug zu den Quellzielen im Feld quellZiel), das Notizformat mit drei Feldern und der Wochenrueckblick (Eigenentwurf).
- Die Adaptation im Katalog (uk/ru-Schlaflieder, Bildschirmregel) ist nicht Teil der Quelle und wird in Abschnitt 9 geprueft.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Eltern und Kindertagespflege, Kinder von 1 bis 3 Jahren. Verwendung: beides (Bildschirm fuer den Erwachsenen; Druck ueber druck.css).
- Lernziele, prüfbar:
  1. Erwachsener notiert an einem Tag bis zu drei Angaben zum eigenen Tun: Tag, Gelegenheit, Art. Eine Angabe zur Reaktion des Kindes gibt es nicht (Eigenentwurf; Grundlage: Ziel 3 der Quelle, S. 87).
  2. Erwachsener sieht, an wie vielen der letzten sieben Tage eine Notiz steht, ohne Ampel, ohne Serie und ohne Soll (Eigenentwurf; Grundlage: „ежедневное слушание“ (S. 87)).
  3. Erwachsener nutzt die Hoerinsel ohne feste Dauer; das Mass ist, ob das Kind sich abwendet (Eigenentwurf; die Dauerangabe der Quelle steht auf S. 87 und ist keine Vorgabe).

## 3. Funktion

- Bildschirme oder Blaetter: Startseite mit Sinnhinweis; zehn Ritualkarten, je mit Ausfuehrung fuer den Erwachsenen und Begruendung; Notizformular mit drei Auswahlfeldern (ohne Freitext); Wochenrueckblick mit beschreibender Zahl; Liste der sechs Arten, darunter bewusst Stille; Vorlesen-Knopf nur mit Geraetestimme; Druckfassung.
- Ablauf: Ritualkarte waehlen → Notiz mit tag, gelegenheit und art anlegen → pruefeNotiz(notiz, daten) → speichern → beschneide(notizen, heute, daten) beim Laden und beim Speichern → tageMitNotiz(notizen, heute) fuer die Zahl im Rueckblick.
- Was gedruckt wird: laut druck.css ohne Haken, Namenszeile, Farbe und Bewertung. Inhalt je Blatt ist im Ausbau festzulegen (Abschnitt 9).
- Luecken laut Befund (Ausbau):
  - Der Katalog verlangt Ampel und Tagesstatistik. Nicht gebaut; die App begruendet das selbst (keineAmpel, keineSerie, keinZiel).
  - Der Katalog nennt uk/ru-Schlaflieder. Nicht uebernommen (keineLiederliste, keineUebersetzung); das Herkunftssprachen-Angebot ist offen.
  - Der Katalog nennt eine taegliche Hoerinsel von 1 bis 5 Minuten. Die Dauer steht in der App nur als Angabe der Quelle (minutenInDerQuelle).

## 4. Daten

Datei: `apps/musik-alltags-begleiter/daten/rituale.json`. Listen: rituale (10), arten (6), ausgeschlossen (9). Seitenangabe im Feld `quelle.werk` (S. 87–88). Die Ritualkarten sind Eigenentwurf; ihr Bezug zu den Quellzielen steht im Feld `quellZiel`. Schema mit einer Beispielzeile (Feldnamen wie in der Datei):

```json
{ "id": "r-aufwachen", "name": "Aufwachen", "quellZiel": 2, "wasDuTust": "…", "warumHier": "…", "ohneGeraet": "…" }
```

Das Feld `zeichen` ist ein Bildschirmsymbol und wird im Druck nicht gezeigt (Abnahme, Abschnitt 8).

## 5. Pseudocode

```
pruefeDaten(daten) -> Liste der Fehler (leer = gueltig)
  rituale hat genau 10 Eintraege; id ist eindeutig; quellZiel liegt zwischen 1 und 8
  arten enthaelt a-stille; deren Erklaerung ist nicht leer
  zielAlsGanzes ist Pflichtfeld und benennt die Einloesung von Ziel 8 (Hilfe fuer Eltern)
  minutenInDerQuelle: die Zahl steht nur als Quellenangabe, nie als Vorschrift (DAUER_ALS_VORGABE)
  ausgeschlossen: 9 Eintraege, je mit Begruendung; LIED_IM_TEXT trifft keinen Liedtext

pruefeNotiz(notiz, daten) -> Liste der Fehler
  notiz hat genau die Felder tag, gelegenheit, art
  gelegenheit ist eine id aus daten.rituale; art ist eine id aus daten.arten
  Fremdfeld -> Fehler (kein Feld fuer die Reaktion des Kindes)

beschneide(notizen, heute, daten) -> notizen
  Fenster aus fensterTage(heute): sieben Tage bis heute, lokales Datum (istTag, tagAus)
  Notiz mit Fremdfeld wird verworfen
  Ausgabe gleich Eingabe -> kein Schreibvorgang; sonst notizen unter NOTIZ_SCHLUESSEL speichern

tageMitNotiz(notizen, heute) -> Zahl von 0 bis 7
  zaehle verschiedene tag-Werte im Fenster
  kein Anteil, kein Durchschnitt, keine Serie aufeinanderfolgender Tage

Keine Zufallsquelle in der Logikdatei; Zufall kommt als Parameter.
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). Befund: ein localStorage-Schluessel (NOTIZ_SCHLUESSEL, Wert „mab.notizen“) mit drei Feldern je Notiz und sieben Tagen; Loeschen ueber datenKarte. docs/02 Z. 25 erlaubt Nutzerdaten in localStorage mit Loeschknopf; diese Vorlage verbietet es. Entscheidung offen (Abschnitt 9).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Befund: CSP-Meta in index.html, Zeile 6; app.mjs laedt nur daten/rituale.json (Zeile 20).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Befund: kein `<input>` in index.html und app.mjs.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Befund: keine Ampel, keine Serie, kein Ziel (keineAmpel, keineSerie, keinZiel); der Test verbietet die Funktion „Serie“ beim Namen.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Befund: druck.css vorhanden. Pruefung der Zeichen und des Feldes zeichen steht aus (test/regeln.test.mjs, neu).
- [ ] Mobile First 360 px; Knoepfe und Fusslink mindestens 48 px (docs/02 Z. 50). Befund laut GDD Abschnitt 10: 360 px ohne Querscrollen, Knoepfe ab 48 px. In dieser Einheit nicht gemessen.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Befund: Seitenangaben stehen in Abschnitt 1 und im Feld quelle; die Markierung auf dem Druckblatt ist noch einzubauen.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt). Befund: GDD Abschnitt 9, keine Uebersetzung.

## 7. Tests

- `test/logik.test.mjs` (vorhanden, 28 Tests): Notiz mit genau drei Feldern, Fremdfeld, Stille-Art mit Begruendung, Beschneiden beim Laden und Speichern mit Zurueckschreiben, lokales Datum statt UTC, tageMitNotiz, Verbot von Serie und Anteil, Abdeckung aller acht Quellziele.
- `test/regeln.test.mjs` (neu, nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Druck ohne Zeichen und Emojis, kein externer Request, kein `<input>`, einziger Speicherschluessel „mab.notizen“.

## 8. Abnahme

- `npm test` im App-Ordner gruen; Testzahl 28 in README und GDD stimmt.
- Browser bei 360 px: kein horizontaler Ueberlauf, Knoepfe mindestens 48 px, Fokus nach Klick, Speicher nur „mab.notizen“, nur localhost.
- Druck: keine Zeichen, keine Emojis, Pflichtmarkierung auf dem Blatt, Feld zeichen nicht gedruckt.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Ampel und Tagesstatistik (Katalog): in der App abgesagt. Entscheidung, ob der Katalogeintrag angepasst wird.
- Speicherung: docs/02 Z. 25 und Abschnitt 6 dieser Vorlage widersprechen sich. Entscheidung, welche Regel fuer Eltern-Werkzeuge gilt.
- uk/ru-Schlaflieder (Katalog): nicht uebernommen. Herkunftssprachen-Angebot offen.
- Bildschirmregel: Die Katalog-Adaptation nennt fuer „keine Bildschirmzeit unter 3“ BZgA und WHO. Laut apps/erste-kuenstler/GDD.md Abschnitt 7 ist die Drei-Jahres-Grenze deutsch (BIÖG, AWMF-Leitlinie); die WHO-Leitlinie fuer unter Fuenfjaehrige nennt sie nicht. Ob diese App die Regel enthaelt, ist in dieser Einheit nicht geprueft. Vor dem Bau klaeren, welche Quelle genannt wird.
- Inhalt des Druckblatts (Abschnitt 3) festlegen.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard fuer neue Apps: keine Seitenzahl auf dem Blatt; Seitenangaben stehen in Abschnitt 1 und im Feld quelle der Daten.
- Vorlesefunktion (F2): die App hat sie (nur mit Geraetestimme). Regel fuer Eltern-Werkzeuge offen.
- Favicon (A3).
