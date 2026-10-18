# Bauauftrag PRI-4: Entdecker-Karten: Tiere und Pflanzen vor der Tuer

Status: teilweise · Abschnitt: Printmaterialien Kita · Ziel: Ausbau von apps/entdecker-karten-natur
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 50 (50–51), Abschnitt „Человек и природа“ (S. 50), Gruppe „Малыши“ (S. 50).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Многообразие живой природы“ (S. 50)
  - „Они живут рядом с тобой“ (S. 51)
  - „кошка, собака, корова, курица“ (S. 51)
  - „дерево, куст и трава“ (S. 51)
  - „ярким признакам“ (S. 51)
  - „свойствами воды“ (S. 51)
  - „яркими признаками сезонов“ (S. 51)
  - „Многообразие неживой природы“ (S. 51)
- Umschrieben, ohne Anführungszeichen: Ziel ist, Tiere und Pflanzen der nächsten Umgebung mit allen Sinnen wahrzunehmen (S. 50). Tiere werden an Aussehen, Bewegung und Lauten erkannt (S. 51). Stoffe der unbelebten Natur wie Wasser, Schnee, Eis, Sand, Ton und Steine werden im Spiel erkundet (S. 51).
- Quellenbefund: nicht gefunden – offen: Die Katalog-Adaptation nennt Igel, Eichhörnchen, Amsel und Reh. Suchbegriffe ёж, белка, дрозд, косуля, олень: kein Treffer auf S. 50–51. Diese Tiere sind nicht übernommen.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet: das Kartenformat, die Anregungen (sehen, hören, bewegen), der Sicherheitssatz zu Steinen, Sand und Ton, die Blattaufteilung.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte in der Kita; Kinder 1 bis 3 Jahre (Katalog; Quelle S. 50, Gruppe „Малыши“). Fachkraftgeleitet, offline. Verwendung: Druck. Der Bildschirm dient nur der Auswahl. Kein Kinderbildschirm.
- Lernziele, prüfbar:
  1. Die Fachkraft wählt eine Gruppe (Tiere, Pflanzen, Stoffe, Jahreszeiten) und druckt einen Kartenbogen mit sechs Karten je A4-Blatt.
  2. Die Fachkraft nennt zu einer Tierkarte drei Beobachtungen (sehen, hören, bewegen), ohne ein Kind zu bewerten.
  3. Bei einem Tier, das draußen nicht zu sehen ist, weicht die Fachkraft auf ein Bild oder den Laut aus (Eigenentwurf).

## 3. Funktion

- Bildschirme oder Blätter: Bildschirm mit Gruppenfilter, Vorschau und Druckknopf. Blätter: Kartenbogen A4 mit sechs Karten in zwei Spalten und drei Reihen, gestrichelte Schneidelinien. Blattkopf mit Titel, Gruppe, Blattnummer, Ziel und Hinweis. Der Sicherheitssatz steht nur auf Blättern mit Steinen, Sand oder Ton.
- Ablauf: Gruppe wählen → Vorschau prüfen → drucken → ausschneiden → in die Materialkiste legen (Eigenentwurf).
- Was gedruckt wird: 19 Karten in vier Gruppen (7 Tiere, 3 Pflanzen, 6 Stoffe, 3 Jahreszeiten). Je Karte Begriff, Quellenzeile „S. 51“, Anregungen (Eigenentwurf) mit Seitenangabe. Auf jedem Blatt mit Seitenangabe steht die Pflichtmarkierung (Abschnitt 6).
- Ausbau gegenüber dem Stand: Die App ist als erster Stand gebaut. Offen sind der Browser-Test auf dem Gerät, die Fachkraft-Durchsicht und der Fehlerweg bei einem Netzausfall im Browser.

## 4. Daten

Datei: `apps/entdecker-karten-natur/daten/karten.json` (vorhanden). Schema mit einer Beispielzeile:

```json
{ "id": "tiere-katze", "gruppe": "Tiere", "titel": "Katze", "quelle": { "seite": "S. 51" }, "eigenentwurf": true }
```

Bestehende Felder bleiben. Der Eintrag `sinne` trägt das Ziel mit S. 50.

## 5. Pseudocode

```
kartenAusAntwort(antwort) -> Karte[]            (vorhanden)
  fehlerhaftes JSON oder Fehlerstatus -> FEHLER_LADEN
filtereKarten(karten, gruppe) -> Karte[]        (vorhanden)
zaehleJeGruppe(karten) -> {Tiere: 7, Pflanzen: 3, Stoffe: 6, Jahreszeiten: 3}   (vorhanden)
  Pruefung: Summe == 19
blaettern(karten, KARTEN_PRO_BLATT = 6) -> Blatt[]   (vorhanden)
blattKopf({gruppe, nummer, gesamt}) -> Kopf     (vorhanden)
kartenFuss(karte) -> Fuss                       (vorhanden)
  Format: "Begriff: Quelle S. 51"
sicherheitsHinweis(karten) -> Text | null       (vorhanden)
  nur wenn eine Karte in KLEINTEIL_KARTEN liegt
pruefeMarkierung(blaetter) -> Fehler[]          (neu, Eigenentwurf)
  jede Karte mit Seitenangabe traegt die Pflichtmarkierung
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

- `test/logik.test.mjs`: Daten (19 Karten, 7 + 3 + 6 + 3), Quelle je Eintrag, Seitenform, Kennzeichnung und Fußzeile, `filtereKarten`, `blaettern`, `sicherheitsHinweis`, Fehlerweg beim Laden, `pruefeMarkierung` (neu). Neue Prüfung: keine Tierkarte außerhalb der Quellenliste S. 51.
- `test/regeln.test.mjs`: Projektregeln nach Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`.

## 8. Abnahme

- `npm test` im App-Ordner grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe ≥ 48 px, Fokus nach Klick, Speicher gleich null, nur `localhost`.
- Druck: sechs Karten je Blatt; keine Zeichen; Pflichtmarkierung je Blatt; Sicherheitssatz nur auf Blättern mit Steinen, Sand oder Ton.
- Netzausfall (fetch wirft): Fehlerweg im Browser geprüft oder im Bericht als offen geführt.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Igel, Eichhörnchen, Amsel und Reh: Der Katalog widerspricht sich. Die Adaptation nennt sie, der Vermerk zu Welle 90 streicht sie. Die App folgt dem Vermerk. Entscheidung bei Koordinator und Fachkraft.
- Sicherheitssatz zu Kleinteilen (Steine, Sand, Ton): Eigenentwurf; eine Fachkraft prüft ihn.
- Kartenformat und Anregungen: Eigenentwurf, nicht aus der Quelle belegt.
- A18: Seitenangaben auf dem Blatt (Fußzeile „Quelle S. 51“).
- Repo-Zählungen (Wurzel-README, Impressum): Koordinator.
- Seitenangaben ohne Markierung „проверено человеком“ (A18).
