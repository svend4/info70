# Bauauftrag PRI-7: Fuehl- und Sortier-Werkstatt: Holz, Papier, Stoff

Status: teilweise · Abschnitt: Printmaterialien Kita · Ziel: neue App laut Index; apps/fuehl-sortier-werkstatt existiert bereits (Abgleich siehe 9. Offen)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 52–53, Abschnitt „ЧЕЛОВЕК И РУКОТВОРНЫЙ МИР“, Gruppe „МАЛЫШИ“.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „ЧЕЛОВЕК И РУКОТВОРНЫЙ МИР“ (S. 52)
  - „фактуры“ (S. 52)
  - „дерево, бумага, ткань“ (S. 52)
  - „основами безопасного поведения“ (S. 53)
  - „старших воспитанников“ (S. 53)
  - „Малыши“ (S. 6)
- Umschrieben, ohne Anführungszeichen:
  - Die Quelle nennt Form, Farbe und Oberfläche als Erfahrungsfelder bei Dingen des Alltags (S. 52).
  - Als Beispiel für den Zweck eines Materials dient ein Pelzmantel, der weich ist und warm hält (S. 52).
  - Sicherheit im Umgang mit scharfen, kalten und heißen Dingen ist als Ziel genannt (S. 53).
  - Ziele mit Sternchen sind in der Quelle für ältere Kinder gekennzeichnet (S. 53, Fußnote 1). Sie sind hier nicht übernommen.
  - Die Gruppe ist für ein bis drei Jahre angelegt (S. 6). Der Katalog nennt 2–3 Jahre; siehe 9. Offen.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder von 2 bis 3 Jahren laut Katalog (docs/10, Z. 479). Eine Fachkraft leitet an. Verwendung: Druck, ohne Bildschirm.
- Lernziele, prüfbar:
  1. Die Fachkraft legt eine Materialkarte aus und nennt das Material. Das Kind betastet mindestens drei Gegenstände aus diesem Material. (Eigenentwurf, Erfahrungsfeld nach S. 52)
  2. Das Kind legt Gegenstände aus Holz, Papier oder Stoff zur passenden Karte. (Eigenentwurf)
  3. Das Kind zeigt, welcher Gegenstand weich ist und welcher hart. (Eigenentwurf, Eigenschaft nach S. 52)

## 3. Funktion

- Blätter: drei Materialkarten (Holz, Papier, Stoff) mit je einem Sortierauftrag (Eigenentwurf). Auf jeder Karte stehen Beispielgegenstände aus dem deutschen Haushalt und ein Sicherheitshinweis (Eigenentwurf nach S. 53).
- Ablauf: Fachkraft legt die Materialkarte hin → Kind fühlt die Gegenstände → Fachkraft nennt Material und Eigenschaft → Kind legt die Gegenstände zur Karte → gemeinsames Aufräumen (Eigenentwurf).
- Was gedruckt wird: je Karte Titel (Material), Beispielgegenstände, Sortierauftrag, Sicherheitshinweis und Pflichtmarkierung. Eine Karte je Blatt A4 hoch.
- Nicht gebaut: warm/kalt als eigene Karte. Der Katalog nennt es in der Hauptzeile (docs/10, Z. 479). Laut Katalogbefund stützt die Quelle es nicht.
- App-Stand: nicht gelesen, weil der Index keine App führt (siehe 9).

## 4. Daten

Datei (geplant): `apps/fuehl-sortier-werkstatt/daten/materialkarten.json`. Schema mit einer Beispielzeile:

```json
{ "id": "holz", "titel": "Holz", "beispiele": ["Holzklötze", "Holzlöffel", "Holzbrett"], "sicherheit": "Keine Teile in den Mund nehmen. Erwachsene bleiben dabei.", "quelle": { "seite": "S. 52" }, "eigenentwurf": true }
```

Die Materialien stammen aus S. 52. Beispiele und Sicherheitsnotiz sind Eigenentwurf.

## 5. Pseudocode

```
materialkarteAusDaten(eintrag) -> Materialkarte
  prüfe: eintrag.titel ist eins von Holz, Papier, Stoff
  prüfe: eintrag.beispiele hat 3 bis 5 Einträge
  prüfe: kein Eintrag hat das Feld kleinesTeil = true
  prüfe: eintrag.sicherheit hat mindestens 30 Zeichen
  gib Materialkarte aus mit titel, beispiele, sicherheit und quelle.seite
sortierauftragErzeugen(karte) -> Sortierauftrag
  erzeuge den Text „Lege die Dinge aus {karte.titel} zur Karte.“ (Eigenentwurf)
  gib Sortierauftrag mit karte.id und karte.beispiele aus
druckBlaetter(karten) -> Blattliste
  für jede Karte: erzeuge ein A4-Blatt hoch mit Titel, Beispielen, Sortierauftrag und Sicherheit
  hänge die Pflichtmarkierung an jede Karte mit quelle.seite an
  prüfe: Anzahl Blätter = Anzahl Karten
  prüfe: kein Zeichen aus ☐☒☑✓✔★☆ und keine Namenszeile im Text
  -> Blattliste
```

## 6. Regeln (docs/02)

- [ ] Speicherung: keine Nutzerdaten, Druckkarten speichern nichts. Wird die Einheit eine App, dann nur localStorage mit eigenen Schlüsseln und Löschknopf, sonst nichts (docs/02, Z. 25).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe mindestens 48 px (docs/02 Z. 50). Entfällt für reine Druckkarten.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht gebaut, offen (Bonus-Wörterliste laut docs/10, Z. 479).

## 7. Tests

- Kein App-Test, solange die Einheit eine Druckfassung ist.
- Prüfung der Quellenangaben: `node tools/bauauftrag-pruefen.mjs <Pfad zur Arbeitskopie>` (Zitate, Abschnitte, Modellnamen).
- Falls eine App entsteht: `test/logik.test.mjs` mit Prüfung der drei Materialkarten (je 3–5 Beispiele, keine kleinen Teile, Sicherheitstext) und `test/regeln.test.mjs` nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`.

## 8. Abnahme

- Druck: Zahl gedruckter Karten gleich Auswahl; keine Zeichen aus Abschnitt 6; Pflichtmarkierung auf jeder Karte.
- Bei App-Fassung zusätzlich: Browser bei 360 px ohne Überlauf, Knöpfe mindestens 48 px, Speicher gleich null.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Ziel und Bestand: Der Index führt `app: null` und den Schritt „neu bauen (Welle)“. docs/10, Z. 478 nennt Welle 93 und `fuehl-sortier-werkstatt`; der Ordner apps/fuehl-sortier-werkstatt existiert. Entscheidung: Ausbau oder Neubau. Der Index ist nicht geändert.
- Altersangabe: Katalog 2–3 Jahre (docs/10, Z. 479), Quelle 1–3 Jahre für die Gruppe (S. 6). Die Abweichung ist offen; Katalog-Verweis A20.
- Sicherheitshinweise und Beispiele sind Eigenentwurf und brauchen eine fachliche Prüfung vor dem Druck.
- Wörterliste de/uk/ru (Bonus laut docs/10, Z. 479): nicht gebaut; uk und ru offen.
- Vorlesefunktion (F2) und Favicon (A3) entfallen ohne App.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard: Auf dem Blatt steht keine Seitenzahl; die Seite steht in Abschnitt 1 und im Feld „quelle“.
