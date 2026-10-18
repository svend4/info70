# Bauauftrag CON-16: Konzept-Mapping Praleska nach DE

Status: teilweise · Abschnitt: Content-Pakete, Funktionen, Dokumente · Ziel: Dokument, kein App-Ordner (Ort offen, siehe Abschnitt 9)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 3 bis 11 (3–11), Abschnitt „ВВЕДЕНИЕ“ (S. 3). Gruppe: keine (Einleitung und Rahmenkonzept). Die Bereichsnamen stehen zusätzlich auf S. 50 bis 52.
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „ВВЕДЕНИЕ“ (S. 3)
  - „Пралеска“ (S. 3)
  - „Концепция развития дошкольного образования“ (S. 3)
  - „основные задачи“ (S. 3)
  - „принципы“ (S. 3)
  - „стратегические позиции“ (S. 11)
  - „ЧЕЛОВЕК И ОБЩЕСТВО“ (S. 51)
  - „ЧЕЛОВЕК И РУКОТВОРНЫЙ МИР“ (S. 52)
- Umschrieben, ohne Anführungszeichen: Die Einleitung nennt die Programmfassung als humanistisch ausgerichtetes Grundprogramm für Kitas. Ziel, Hauptaufgaben und Prinzipien bleiben in der neuen Fassung unverändert (S. 3). Das Programm setzt strategische Positionen und legt keinen Plan nach Quartalen fest. Die Fachkraft ergänzt es mit den Traditionen der eigenen Region (S. 11).
- Umschrieben: Die Ziele sind in Bereiche gegliedert: das Ich und die Welt, die Natur, die Gesellschaft und die vom Menschen gemachte Dingwelt (S. 50–52). Der Bereich Bewegung steht auf S. 58.
- Die Zuordnung zu den Landesbildungsplänen und zu den Rechtsnormen ist Eigenentwurf. Die Bildungspläne stehen nicht im Quelltext.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.
- Katalogeintrag: docs/10, Z. 497 (Konzept-Mapping Praleska nach DE). Zielgruppe intern (Team), Typ S. Hinweis aus docs/10 (Z. 236): Das Konzept-Mapping ist „das strategische Fundament“ für die Bildungsbereiche und soll als erstes Arbeitspaket entstehen.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Team und Leitung des Projekts; intern. Verwendung: Dokument im Repo, lesbar als Text. Kein Druck, kein Bildschirm für Kinder.
- Lernziele, prüfbar (Eigenentwurf):
  1. Team findet zu jedem Praleska-Konzept (Ziele, Prinzipien, Bereichsstruktur) eine Zeile mit Seite und Feld des Landesbildungsplans.
  2. Team prüft zu jeder Zeile, ob nur eine Idee oder Struktur übernommen wird und kein Text, Lied oder Gedicht (docs/10, Z. 497).
  3. Team sieht zu jeder Zeile, welcher Bauauftrag die Idee nutzt (Spalte „genutzt in“).

## 3. Funktion

- Dokument mit vier Teilen (Eigenentwurf):
  1. Rahmen und Quelle: Zusammenfassung der Seiten 3 bis 11 mit den Zitaten aus Abschnitt 1.
  2. Mapping-Tabelle: Spalten Konzept | Seite | Feld im Landesbildungsplan (je Bundesland) | Rechtsnorm | genutzt in (Kennung).
  3. Urheberrechts-Checkliste (docs/10, Z. 497).
  4. Liste der 16 Landesbildungspläne mit Stand und Fundstelle (offen, Recherche durch Mensch).
- Ablauf: Konzept wählen → Quellzeile mit Seite prüfen → Feld im Landesbildungsplan eintragen → Rechtsnorm eintragen → Kennung des genutzten Bauauftrags eintragen.
- Rechtsnormen nach docs/10, Z. 497: DSGVO, JuSchG und JMStV, BFSG, EU AI Act und BzKJ (Eigenentwurf: Auswahl je Zeile).
- Keine Druckfunktion. Keine Seitenzahl ohne Pflichtmarkierung (Abschnitt 6).

## 4. Daten

Kein App-Ordner. Datei: `docs/konzept-mapping-praleska-de.md` (Eigenentwurf; Ort in Abschnitt 9). Falls Zeilen später maschinell gelesen werden, gilt das Schema mit einer Beispielzeile:

```json
{ "id": "ziele-allgemein", "konzept": "Ziele", "quelle": { "seite": "S. 3" }, "bildungsplan": "offen (je Land)", "rechtsnorm": ["DSGVO Art. 8"], "genutzt_in": [], "eigenentwurf": true }
```

- Feld `quelle.seite` nur S. 3 bis 11, S. 50 bis 52 oder S. 58.
- Feld `bildungsplan` bleibt „offen (je Land)“, bis die Recherche je Bundesland abgeschlossen ist.
- Feld `genutzt_in` trägt Kennungen aus `index.json`, zum Beispiel CON-14.

## 5. Pseudocode

```
ladeZeilen(datei) -> Liste<Zeile>
  liest die Tabelle aus docs/konzept-mapping-praleska-de.md (eine Zeile je Konzept)
  bricht ab, wenn eine Zeile weder Seitenangabe noch eigenentwurf == true hat

pruefeZeile(zeile) -> Liste<Fehler>
  Fehler, wenn quelle.seite nicht in S. 3 bis 11, S. 50 bis 52 oder S. 58 liegt
  Fehler, wenn ein Zitat in der Zeile mehr als 6 Wörter hat
  Fehler, wenn genutzt_in eine Kennung enthält, die nicht in index.json steht

pruefeUrheberrecht(zeile) -> Boolean
  true, wenn zeile.art in {idee, struktur, methodik}
  false, wenn zeile.art in {text, lied, gedicht}; die Zeile wird nicht übernommen

zeilenFuer(zeilen, konzept) -> Liste<Zeile>
  gib alle Zeilen mit zeile.konzept == konzept zurück

abdeckung(zeilen, bundesland) -> { gedeckt, offen }
  gedeckt: Zeilen mit bildungsplan != "offen (je Land)" für bundesland
  offen: alle übrigen Zeilen
```

Keine Zufallsquelle; das Dokument ist statisch.

## 6. Regeln (docs/02)

- [ ] Speicherung: nicht zutreffend. Das Dokument speichert keine Nutzerdaten, keine Browserdaten und keine Cookies.
- [ ] Keine Anfragen nach außen: die Recherche der Landesbildungspläne erfolgt durch Menschen und ist kein Teil des Dokuments (Eigenentwurf).
- [ ] Keine Eingabefelder: nicht zutreffend.
- [ ] Keine Bewertung von Kindern (docs/02 Z. 141–146). Das Mapping bewertet Konzepte, keine Kinder.
- [ ] Seitenangaben: docs/02 Z. 151–152 verlangt für jede Seiten-, Kapitel- oder Paragraphenangabe die Markierung „проверено человеком“. Solange keine Prüfung durch einen Menschen stattfindet, trägt jede Seitenangabe die Pflichtmarkierung unten.
- [ ] Pflichtmarkierung „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Sie steht am Anfang des Dokuments und bei jeder Tabellenzeile mit Seitenangabe.
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] Keine Rechtsberatung: das Dokument ordnet Normen zu, es bewertet sie nicht. Die Einordnung prüft ein Mensch (Eigenentwurf).
- [ ] Keine Zahlen oder Ämter ohne Prüfung auf Aktualität (docs/02 Z. 153–154).

## 7. Tests

- Kein Code. Die Zitate in Abschnitt 1 werden mit `tools/bauauftrag-pruefen.mjs` gegen die Arbeitskopie geprüft.
- Gegenlesen durch eine zweite Person (Eigenentwurf) vor dem Merge.

## 8. Abnahme

- Jede Zeile hat eine Seitenangabe oder die Kennung „Eigenentwurf“.
- Alle Zitate haben höchstens 6 Wörter und stehen auf der angegebenen Seite (`tools/bauauftrag-pruefen.mjs` ohne Fehler für CON-16).
- Spalte Landesbildungsplan je Bundesland ausgefüllt oder mit „offen (je Land)“ markiert.
- Urheberrechts-Checkliste vollständig abgehakt.
- Registrierung nur durch den Koordinator (`docs/10`, Katalog, Index).

## 9. Offen

- Ort des Dokuments: Vorschlag `docs/konzept-mapping-praleska-de.md` (Eigenentwurf). Entscheidung nötig.
- Index-Status „teilweise“ ohne Datei: Suche nach „Konzept-Mapping“ in `docs/`, `apps/` und `packages/` findet nur Erwähnungen (`docs/10`, `docs/plan-praleska-umsetzung.md`, `docs/offene-punkte-kita.md`, `docs/praleska-katalog.json`, `docs/bauauftraege/index.json`). Ein Dokument fehlt. Korrektur des Status durch den Koordinator.
- Die 16 Landesbildungspläne stehen nicht im Quelltext. Die Zuordnung braucht eine Recherche durch einen Menschen. Diese Sitzung führt keine Anfragen nach außen.
- Seitenangabe auf Druckblättern: nicht vorgesehen (Dokument). Standard für neue Apps (A18) bleibt offen.
- Seitenbereich: Der Katalog nennt S. 3 bis 11. Die Bereichsnamen (S. 50 bis 52) und die Bewegung (S. 58) gehören zum Mapping, sind aber nicht im Katalogbereich. Entscheidung nötig.
- Rechtsnormen (DSGVO, JuSchG und JMStV, BFSG, EU AI Act, BzKJ): Einordnung und Stand durch einen Menschen prüfen.
