# Bauauftrag PRI-5: Bewegungslandschaften-Plakate Krippe

Status: teilweise · Abschnitt: Printmaterialien Kita · Ziel: Ausbau von apps/bewegungslandschaft-stationen
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 58 (57–60), Abschnitt „Развитие движений“ (S. 58), Gruppe „Малыши“ (S. 58).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Развитие движений“ (S. 58)
  - „Ходьба и равновесие“ (S. 58)
  - „Ползание, лазанье“ (S. 58)
  - „подлезании под веревку“ (S. 58)
  - „лестницу-стремянку“ (S. 58)
  - „Бросание, катание, ловля“ (S. 58)
  - „высота 10—30 см“ (S. 59)
  - „Прыжки“ (S. 60)
  - „из поля зрения взрослых“ (S. 57)
- Umschrieben, ohne Anführungszeichen: Die Quelle nennt Übungen für Gehen und Gleichgewicht, Kriechen und Klettern, Werfen und Fangen sowie Springen (S. 58–60). Die Aufsicht umfasst das Kind nicht aus dem Blick lassen und gefährliche Gegenstände aus der Reichweite nehmen (S. 57). Die Zahlen für Höhen, Abstände und Ziele stehen je auf S. 58 bis 60; sie werden unverändert übernommen.
- Quellenbefund: nicht gefunden – offen: Der Katalog nennt Aufbaupläne, Zeichnungen, einen Tunnel und DGUV-Vorgaben. Suchbegriffe схема, чертеж, рисунок, туннель, безопасность: kein Treffer auf S. 57–60. Diese Punkte sind nicht übernommen.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet: die Übungsnamen auf den Karten, die Durchführungen, der Wortlaut der Maßzeilen, die Fußzeile „Übungsmaß laut Quelle“, die Aufsichtskarte im Wortlaut.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte in der Krippe; Kinder 1 bis 3 Jahre (Katalog, offline). Verwendung: Druck (Plakate und Stationskarten). Der Bildschirm dient nur der Auswahl. Kein Bildschirm für Kinder unter 3.
- Lernziele, prüfbar:
  1. Die Fachkraft wählt Stationen und druckt je Karte ein Blatt A4 quer.
  2. Jede Maßzeile auf einer Stationskarte trägt eine Seitenangabe.
  3. Keine Karte und kein Druck enthält ein Kind, eine Einstufung oder ein Eingabefeld.

## 3. Funktion

- Bildschirme oder Blätter: Bildschirm mit der Auswahl von acht Karten (sieben Stationen, eine Aufsichtskarte). Blätter: je gewählte Karte ein Blatt A4 quer.
- Ablauf: Karten wählen → Vorschau prüfen → „Stationskarten drucken“ → im Browserdialog Kopf- und Fußzeilen ausschalten → Karten aufhängen (Eigenentwurf).
- Was gedruckt wird: Stationsname, Übungen mit Maßen als Übungsmaß (keine Sicherheitsgrenze), Seitenangabe je Maßzeile, Fußzeile „Übungsmaß laut Quelle, keine Sicherheitsgrenze.“ Die Aufsichtskarte mit den Hinweisen von S. 57, umschrieben. Auf jedem Blatt mit Seitenangabe steht die Pflichtmarkierung (Abschnitt 6).
- Ausbau gegenüber dem Stand: Die App ist als erster Stand gebaut. Offen sind der Browser-Test auf dem Gerät, die Prüfung der DGUV-Vorgaben durch eine Fachstelle und der Bezugspunkt der Angabe auf S. 60.

## 4. Daten

Datei: `apps/bewegungslandschaft-stationen/daten/stationen.json` (vorhanden). Schema mit einer Beispielzeile:

```json
{ "id": "zielwurf-vertikal", "titel": "Zielwurf vertikal", "quelle": { "seite": "S. 60" }, "eigenentwurf": true }
```

Jede Maßzeile trägt ihre Seitenangabe im Feld `quelle`. Der Eintrag `quellenHinweis` nennt den Bereich S. 57 bis 60.

## 5. Pseudocode

```
alleKennungen(daten) -> Kennung[]               (vorhanden)
umschalten(auswahl, kennung) -> auswahl         (vorhanden)
gewaehlteKarten(daten, auswahl) -> Karte[]      (vorhanden)
  feste Reihenfolge aus daten.stationen
kannDrucken(karten) -> Bool                     (vorhanden)
  mindestens eine Karte gewaehlt
zeileText(zeile) -> Text                        (vorhanden)
  Maßzeile mit Seitenangabe "S. n"
kartenText(karte) -> Text[]                     (vorhanden)
pruefeMasse(karte) -> Fehler[]                  (neu, Eigenentwurf)
  jede Masszahl hat ein Feld quelle mit S. 58 bis 60
  Zahlen stimmen mit der Tabelle der Quelle ueberein (Tabelle im Test)
pruefeMarkierung(karten) -> Fehler[]            (neu, Eigenentwurf)
  Blaetter mit Seitenangabe tragen die Pflichtmarkierung
```

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Werkzeuge ohne Nutzerdaten speichern nichts. Die App speichert nichts. Die Entscheidung je Einheit steht in Abschnitt 9.
- [ ] Keine Anfragen nach außen (docs/02 Z. 22–24). CSP `default-src 'self'` ist Eigenentwurf, docs/02 verlangt nur das Verbot externer Anfragen.
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 19–20 schließt Konten und personenbezogene Daten aus).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Seitenangaben nur mit Markierung (docs/02 Z. 151–152). Pflichtmarkierung auf jedem Blatt mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).

## 7. Tests

- `test/logik.test.mjs`: Daten (sieben Stationen und eine Aufsichtskarte, Seiten 57 bis 60), Maßzahlen gegen die Quellenseiten, Ausgabe der Quelle, Auswahl, `kannDrucken`, `pruefeMasse` und `pruefeMarkierung` (neu).
- `test/regeln.test.mjs`: Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, nur `localhost`.
- Druck: je gewählte Karte ein Blatt; keine Zeichen; Pflichtmarkierung je Blatt mit Seitenangabe; Fußzeile „Übungsmaß laut Quelle“ auf jeder Stationskarte.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- DGUV-Vorgaben und Sicherheitsregeln für Bewegungsräume: extern zu prüfen. Die Quelle enthält sie nicht.
- Der Wurf mit einer Hand auf eine waagerechte Zielweite (S. 60, Umschreibung) hat keinen klaren Bezugspunkt. Die Angabe fehlt deshalb.
- Fußzeile „Übungsmaß laut Quelle“ auf den Karten Kriechen, Durchkriechen und Balancierweg: Die Quelle nennt dort keine Maße. Der Wortlaut ist offen; eine Fachkraft entscheidet.
- Aufsicht: nur S. 57 belegt. Weitere Aufsichtsregeln sind nicht belegt.
- A18: Seitenangaben auf dem Blatt.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
