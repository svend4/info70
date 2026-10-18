# Bauauftrag GEM-17: Tischdienst-Trainer

Status: teilweise · Abschnitt: Gemeinsame Apps 3–5 · Ziel: Ausbau von apps/tischdienst-trainer/
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 187 (187), Abschnitt „Развиваемся в деятельности“ (S. 187), Gruppe nicht im Seitenkopf erkennbar (S. 187).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Развиваемся в деятельности“ (S. 187)
  - „обязанности дежурного по столовой“ (S. 187)
  - „сервировать столы“ (S. 187)
- Umschrieben, ohne Anführungszeichen: Die Seite nennt Dienste bei Tisch: Tische in einer festgelegten Reihenfolge decken, Hilfsmittel nach dem Essen wegräumen und Blumen auf die Tische stellen (S. 187). Vor einzelnen Zielen steht ein Sternchen (S. 187); die Bedeutung ist im Text nicht erklärt.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit (Eigenentwurf) gekennzeichnet. Dazu gehören die Sitzungstypen, der sichtbare Vorrat, die Geltungsarten und die Regel für links und rechts.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Kinder 4–7 Jahre, nur gemeinsam mit einem Erwachsenen (Katalog: 4–5 mit Erwachsenem, 5–7 kurz allein; Abweichung, siehe 9). Verwendung: Bildschirm und Druck (Platzset als Schablone).
- Lernziele, prüfbar:
  1. Kind legt die Teile eines Gedecks an die vorgesehene Stelle; am Ende liegt jede Unterlage unter dem Teller. Die Reihenfolge ist keine Lösung (Eigenentwurf; Grundlage „сервировать столы“ (S. 187)).
  2. Kind verteilt Teile eins zu eins an Plätze, ohne zu zählen; was übrig bleibt, ist sichtbar (Eigenentwurf; Grundlage „обязанности дежурного по столовой“ (S. 187)).
  3. Kind unterscheidet links und rechts nur mit dem Anker „von dem Kind, das hier sitzt“ (Eigenentwurf; in der Variante 4–5 ohne Seitenzonen).

## 3. Funktion

- Bildschirme oder Blätter: Gate, auf dem der Erwachsene den Sitzungstyp wählt (austeilen: 3–5 Plätze, eine Teilesorte, 3–5 Handlungen; decken: ein Platz, mehrere Teile, 5–6 Handlungen); Kinderbildschirm mit dem Rahmensatz einmal vor dem Decken; Abschlussbildschirm mit dem Zeichen 🤝, ohne Belohnung; Hinweis „👪“ unter jeder Rückmeldung mit der Grenze der Vereinbarung; `eltern.html` im Eltern-Sammelband (README, GDD §5).
- Ablauf: Gate → Sitzungstyp → Vorrat holen (austeilen: für die ganze Gruppe; decken: für einen Platz) → Teil antippen → Zone antippen → Rückmeldung nach Geltungsart → Abschluss 🤝 → „Bildschirm aus“.
- Was gedruckt wird: ein Platzset als reine Schablone mit derselben Raumlage wie der Bildschirm, ohne Häkchen, Punkte, Sterne, Tagesfelder, Namenszeile und Urkunde (GDD §10; `druck.css` vorhanden). Format und Anzahl je Blatt sind in README und GDD nicht genannt.
- Der Katalog verlangt (docs/10, Ko-Nutzung Nr. 17): den Tisch in richtiger Reihenfolge decken; die Raumlage spielerisch üben; ein druckbares Platzset. Die App hat die Reihenfolge als Lösung gestrichen, den Solo-Modus nicht gebaut, „Besteck links/rechts“ für 4–5 nicht übernommen und das Sternchen-Ziel nicht als Belohnung umgesetzt (README, GDD §1, §8, §9).
- Lücke: siehe 9.

## 4. Daten

Datei: `apps/tischdienst-trainer/daten/tischdienst.json`. Die Datei enthält die Lagen mit Schritten, Zonen und Varianten (`ab`), dazu `liegtUnter`, `spaeterText` (Pflicht), `geltung`, `geltungsbereich` (Pflicht) und `nurGemeinsam` (Pflicht). Feldnamen nach GDD; vor dem Ausbau gegen die Datei prüfen. Schema mit Platzhaltern; Herkunftsangabe als Vorschlag (Eigenentwurf):

```json
{ "id": "…", "geltung": "ausgemacht", "geltungsbereich": "…", "spaeterText": "…", "nurGemeinsam": true, "quelle": { "seite": "S. 187" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
// Namen nach README und GDD. Ein- und Ausgaben sind Eigenentwurf; vor dem Bau gegen app.mjs und logik.mjs abgleichen.
darfJetzt(szene, schritt) -> true
  liest liegtUnter nicht; nichts wird abgelehnt (Endzustand, keine Reihenfolge)
unterlageFehlt(szene) -> Liste
  nennt offene Unterlagen als Hinweis; kein Stopp
legeAb(szene, schritt, zone) -> ergebnis
  geltung "pruefbar":    angenommen; liegt die Unterlage später, spaeterText zeigen (untergeschoben) und grund nennen
  geltung "ausgemacht": bleibt liegen; Figur nennt die Vereinbarung und geltungsbereich; Auswahl "🔄 Umlegen" | "👍 So lassen" (Kind entscheidet)
  geltung "geschmack":   keine Wertung; istAmPlatz(...) -> null
vorratVon(sitzung) -> Anzahl
  "austeilen": figuren + leer (so viele wie Stühle am Tisch)
  "decken":    Vorrat für genau einen Platz
bleibtUebrig(lage) -> bool
  eine Lage ohne Rest wird vom Validator abgelehnt
anzahlReihenfolgen(schritte) -> Zahl
  pruefeDaten verlangt Gleichheit mit n!; Kita-Variante 120 = 5!, zu Hause 720 = 6!
seiteOhneAnker(text) -> bool
  "links", "rechts", "linke", "rechter" nur, wenn im selben Satz "von dem Kind, das hier sitzt" steht
pruefeDaten(lagen) -> Fehlerliste
  mindestens eine Variante "4-5" ohne Seitenzonen
  nurGemeinsam == true
  verboten: "oben", "über", "hinter"; "vor" nur personenbezogen (VOR_PERSONENBEZOGEN)
  verboten in Texten: "wie viele", "eins weniger"; keine Zahlfelder in Antworten
  seiteOhneAnker auf jedem ausgelieferten Text
mischeEinmalProSitzung(schritte) -> Reihenfolge der Knöpfe
  einmal pro Sitzung, nicht bei jeder Darstellung
```

## 6. Regeln (docs/02)

- [ ] Keine Speicherung (localStorage, sessionStorage, IndexedDB, Cookie, Cache) (docs/02 Z. 17–30). localStorage ist im Test verboten (GDD §12).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel). Keine Namen, keine Gruppengröße, keine Angaben zu fehlenden Kindern (GDD §10).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Keine Sterne im Quelltext (GDD §10).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82). Das Platzset ist frei von diesen Zeichen (GDD §10).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen (sofern nicht erstellt). Nach README sind Begriffe dreisprachig; kein Vorlese-Versprechen für uk und ru.
- Hinweis zu dieser Einheit: Die Abmachungen sind Erwachsenen-Material. Der Rahmensatz muss auf dem Kinderbildschirm stehen, nicht nur auf der Elternseite (GDD §7).

## 7. Tests

- `test/logik.test.mjs` (27 Tests, laut README und GDD): Datengültigkeit; `liegtUnter` als Endzustand; Strukturgleichheit statt Schwelle; später gelegte Unterlage wird untergeschoben; Geltungsnamen wie in design-entdecker; Abmachungen ohne Bewertung und Rahmensatz einmal; links und rechts nie ohne Anker; oben, über und hinter gesperrt; 4–5 ohne Seitenzonen; Geschmack ohne Richtig; Artenabdeckung über alle Varianten; Austeilen ohne Zahlen; zwei vollständige Gedecke; nur gemeinsam; Tippen statt Ziehen und kein Zähler; Platzset ohne Belohnungsfelder; Wörter dreisprachig; Abschluss ohne Rangbehauptung; Angebots-Rotation.
- `test/regeln.test.mjs`: fehlt in dieser App. Anlegen nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs` (Eigenentwurf).

## 8. Abnahme

- `node --test apps/tischdienst-trainer/test/*.test.mjs` grün (27 Tests, README und GDD stimmen überein).
- Platzset drucken: keine Zeichen aus docs/02 Z. 79–82; Raumlage wie auf dem Bildschirm.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Tippen ohne Ziehen.
- Impressum und Datenschutzerklärung vor einem Release (docs/02 Z. 160).
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Standard für Seitenangaben (A18, offen): In der App stehen keine Seitenzahlen auf dem Blatt; sie stehen in Abschnitt 1 und in den Daten als „quelle“. Prüfen, ob „S. 187“ auf dem gedruckten Platzset steht.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
- Vorlesefunktion (F2), Favicon (A3).
- Abweichung Solo-Modus: Der Katalog nennt „5–7 kurz allein“; die App baut keinen Solo-Modus (GDD §9). Entscheidung bestätigen oder Solo-Variante bauen.
- Abweichung „Besteck links/rechts“ für 4–5: Die Kita-Variante kommt ohne Seitenzonen aus (GDD §8). Entscheidung bestätigen.
- Abweichung Reihenfolge: Die Quelle nennt eine festgelegte Reihenfolge (S. 187); die App prüft nur den Endzustand (GDD §1). Entscheidung bestätigen; Katalogtext angleichen.
- Sternchen (A11): Auf S. 187 steht vor den Zielen ein Sternchen. Die README liest es als Differenzierungsstufe, nicht als Belohnung; der Text der Quelle erklärt es nicht.
- Format und Anzahl des Platzsets je Blatt: in README und GDD nicht genannt.
- Zitatgrenze (A10 b): 6 oder 12 Wörter offen. Dieser Auftrag und der Prüfer verwenden 6.
- Das Feld `faktenstand` in index.json lautet „Quelle nicht im Repo prüfbar“. Nach B1 ist die Arbeitskopie jetzt erzeugbar; der Eintrag wurde nicht geändert.
