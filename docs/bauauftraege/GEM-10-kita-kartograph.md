# Bauauftrag GEM-10: Kita-Kartograph: Wir zeichnen unseren Raum

Status: teilweise · Abschnitt: Gemeinsame Apps 3–5 · Ziel: Ausbau von apps/kita-kartograph/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 138 (138), Abschnitt „География (введение)“ (S. 138), Gruppe „Почемучки“ (S. 138).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „География (введение)“ (S. 138)
  - „план группы, участка“ (S. 138)
  - „сторонах света“ (S. 138)
  - „географической картой“ (S. 138)
- Umschrieben, ohne Anführungszeichen: Die Seite nennt Ziele zur Orientierung im Raum der Einrichtung, zum Plan einer Gruppe oder eines Geländes mit Zeichen, zu den Himmelsrichtungen mit dem Sonnenaufgang als Osten und zur Landkarte (S. 138).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit (Eigenentwurf) gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder ab 5 Jahren (Katalog: 5–7), Verwendung: Bildschirm, gemeinsam in der Kita oder zu Hause. Druck ist nicht gebaut.
- Lernziele, prüfbar:
  1. Kind legt einen Raumplan aus Zeichen auf einem 6×6-Raster und sieht danach nur die Zeichen, die tatsächlich gelegt sind (Eigenentwurf, Grundlage S. 138).
  2. Kind bestimmt eine Himmelsrichtung über den Sonnenaufgang und legt Norden an eine Kante des Plans (Eigenentwurf, Grundlage S. 138).
  3. Kind liest den Plan in fester Richtung vor, oben links nach unten rechts (Eigenentwurf).

## 3. Funktion

- Bildschirme oder Blätter: Startbildschirm mit Raster 6×6 und zwölf Zeichen; Auswahl der Nordkante; Zeichenerklärung, die nur gelegte Zeichen mit Anzahl zeigt; Löschknopf mit Rückkehr des Fokus; Vorlesen des Plans (`planText`); `eltern.html` im Eltern-Sammelband (README, GDD).
- Ablauf: Zeichen wählen → Feld antippen → gleiches Zeichen erneut antippen nimmt es weg, anderes Zeichen ersetzt es → Norden an eine der vier Kanten legen → Zeichenerklärung prüfen → Plan vorlesen lassen oder löschen.
- Was gedruckt wird: nichts. Die Symbol-Karten zum Ausdrucken sind nur als Erweiterung im GDD (§8) genannt.
- Der Katalog verlangt (S. 138 als Grundlage): Kinder legen mit einfachen Zeichen einen Raumplan und finden ihren Ort auf der Karte; Ergebnis-Export in den Klassen-Koffer; Deutschland-/Europakarte statt der Karte von Belarus; optional Herkunftsländer-Ansicht (Eigenentwurf als Adaptation).
- Lücke: Der Ort auf der Karte fehlt in dieser App. Die Karte liegt in `apps/deutschland-kompass` (Modus 2 und 3). Export, Herkunftsländer-Ansicht, Außengelände und Weg-Modus sind nicht gebaut (siehe 9).

## 4. Daten

Datei: `apps/kita-kartograph/daten/symbole.json`. Die Datei enthält `version`, `zielgruppe`, `hinweis` (jedes Zeichen nur einmal) und die Liste `symbole`. Schema mit einer Beispielzeile; die Felder `id`, `name`, `emoji` stehen so in der Datei, `quelle` und `eigenentwurf` sind ein Vorschlag (Eigenentwurf):

```json
{ "id": "tuer", "name": "Tür", "emoji": "🚪", "quelle": { "seite": "S. 138" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
// Funktionsnamen nach README und GDD (setzeSymbol, legende, planText, lade).
// Parameter, Rückgaben und setzeNorden sind Eigenentwurf; vor dem Bau gegen logik.mjs abgleichen.
setzeSymbol(plan, feld, symbolId) -> plan'
  prüfe feld in 0..35 und symbolId in symbole; sonst plan unverändert zurückgeben
  wenn plan[feld] == symbolId -> plan' ist Kopie mit plan'[feld] = leer
  sonst                       -> plan' ist Kopie mit plan'[feld] = symbolId
  plan bleibt unverändert
legende(plan, symbole) -> Liste aus {id, name, emoji, anzahl}
  zähle je symbolId die belegten Felder
  nimm nur Zeichen mit anzahl > 0
  Reihenfolge = Reihenfolge in symbole (nicht sortieren)
planText(plan) -> Text
  gehe Felder 0..35 zeilenweise durch (oben links bis unten rechts)
  überspringe unbekannte symbolId
  je belegtem Feld ein Satz mit Name und Zeile/Spalte
setzeNorden(plan, kante) -> plan'
  kante aus {oben, rechts, unten, links}; sonst Fehler
  Himmelsrichtung zusammen mit plan speichern
lade(speicher) -> plan
  liest den letzten Plan aus der Quelle, die in Abschnitt 9 offen ist
  übernimmt nur bekannte symbolId auf gültigen Feldern
  bei Lesefehler (try/catch) -> leerer Plan
pruefeDaten(symbole) -> Fehlerliste
  jede id genau einmal; jedes Zeichen höchstens einmal vergeben
  keine bewertenden Wörter im Datensatz
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Entfällt, solange kein Druck gebaut ist.
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt).
- Hinweis zu dieser Einheit: Die App speichert den letzten Plan und die Himmelsrichtung unter `kartograph.plan` mit Löschknopf (README, GDD §6). Die Vorlagenzeile „Keine Speicherung“ widerspricht dem Wortlaut von docs/02 Z. 25–26, dort ist localStorage für Nutzerdaten mit vollständiger Löschung erlaubt. Entscheidung offen (siehe 9).

## 7. Tests

- `test/logik.test.mjs` (laut GDD 8 Prüfungen): Daten gültig; jedes Zeichen nur einmal vergeben; Feldrechnung an den vier Ecken; `setzeSymbol` legt, ersetzt und nimmt weg, ohne das Original zu ändern; Zeichenerklärung zeigt nur Gelegtes mit Anzahl und stabiler Reihenfolge; `planText` sortiert nach Feld und ignoriert unbekannte Symbole; Gesprächsimpulse sind Fragen; kein bewertendes Wort im Datensatz.
- `test/regeln.test.mjs`: fehlt in dieser App. Anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs` (Eigenentwurf).
- Testzahl: GDD nennt 8, README nennt keine Zahl. Bei der Abnahme in README und GDD gleich eintragen.

## 8. Abnahme

- `node --test apps/kita-kartograph/test/*.test.mjs` grün.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher nur `kartograph.plan` und nach dem Löschknopf leer, nur `localhost`.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Speicherung des letzten Plans (`kartograph.plan`): Vorlagenregel „Keine Speicherung“ und docs/02 Z. 25–26 widersprechen sich. Entscheidung: Vorlagenregel präzisieren oder Speicher streichen.
- Ort auf der Karte finden (Katalog, S. 138): liegt in `apps/deutschland-kompass`. Entscheidung: Verweis genügt oder eigene Karte in dieser App.
- Herkunftsländer-Ansicht und Europakarte: im Katalog optional, nicht gebaut. Entscheidung.
- Klassen-Koffer-Export und Symbol-Karten zum Ausdrucken: nur im GDD (§8) genannt, nicht gebaut.
- Altersgrenze: Katalog 5–7, App „ab 5“ ohne Obergrenze (README, GDD). Entscheidung.
- Zitatgrenze (A10 b): In `docs/fragen-und-hinweise.md` steht zur Wahl zwischen 6 und 12 Wörtern. Dieser Bauauftrag und der Prüfer verwenden 6.
- Sternchen vor einzelnen Zielen (A11): S. 138 hat solche Sternchen; ihre Bedeutung steht nicht im Text.
- Das Feld `faktenstand` in index.json lautet „nur Katalogtext“. Die Arbeitskopie ist nach B1 jetzt erzeugbar; der Eintrag wurde nicht geändert.
