# Bauauftrag CON-8: Kreisspiele-Sammlung mehrsprachig

Status: teilweise · Abschnitt: Content-Pakete, Funktionen, Dokumente · Ziel: Ausbau von `apps/bewegungs-schatzkiste/` (Zuordnung laut Index; siehe Abschnitt 9)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 165 (165–170), Abschnitt „Развиваемся в деятельности“ (S. 165), Gruppe „ПОЧЕМУЧКИ“ (S. 170).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Хороводы“ (S. 165)
  - „Игры“ (S. 165)
  - „Кот и мыши“ (S. 165)
  - „Зайцы и лиса“ (S. 165)
  - „Белорусские фольклорные игры“ (S. 170)
- Umschrieben, ohne Anführungszeichen: Die Seiten listen Reigen mit Liedern und Spiele mit Rollen, darunter Spiele mit Tieren wie Katze und Maus oder Hase und Fuchs (S. 165). Bei den Liedern sind Komponisten und Textdichter angegeben (S. 165). Der Entwurf übernimmt keine Liedtexte und keine Melodien (Eigenentwurf).
- Die belarussischen Volksspiele (S. 170) werden im Katalog durch deutsche Spiele ersetzt, uk- und ru-Varianten kommen hinzu (docs/10, Z. 455). Diese Ersetzung ist Eigenentwurf.
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка адаптации“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.
- Katalogeintrag: docs/10, Z. 455 (Kreisspiele-Sammlung mehrsprachig). Zielgruppe 3 bis 5, angeleitet durch Erwachsene, Typ M, Erwachsenen-Katalog (filterbar) plus Druck.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte und Eltern. Kinder 3 bis 5 Jahre spielen angeleitet durch Erwachsene; die Kinder nutzen kein Gerät. Verwendung: beides (Bildschirm für den Katalog, Druck einer Karte je Spiel).
- Lernziele, prüfbar (Eigenentwurf):
  1. Erwachsene filtert die Kategorie Kreis- und Ordnungsspiele nach Altersband und Ort und findet die passenden Karten.
  2. Erwachsene druckt die gewählten Karten als Kartei, eine Karte je Blatt.
  3. Erwachsene nennt zu einem Spiel die uk- oder ru-Variante des Spielnamens (offen, siehe Abschnitt 9).

## 3. Funktion

- Bestand (README, GDD): 28 Ideen in sieben Bewegungsarten zu je vier Karten. Filter nach Bewegungsart, Altersband und drinnen oder draußen (`filtereSpiele` in `logik.mjs`). Die Kategorie Kreis- und Ordnungsspiele (Schlüssel `kreis-ordnung`) hat vier Karten; sie beschreiben nur den Spieltyp, ohne Liedtexte (Feld `liedtext` fehlt, Test). Druck als Kartei, eine Karte je Blatt. Kein Score, kein Ranking (`app.mjs` Z. 10).
- Lücke gegen den Katalog: Der Katalog nennt 20 und mehr Kreis- und Rollenspiel-Strukturen, darunter Reigen, Fangspiele mit Rollen und jahreszeitliche Reigen, sowie eine uk- oder ru-Variante je Spiel (docs/10, Z. 455). Der Bestand hat vier Karten in dieser Kategorie und ist nur deutsch (README).
- Ablauf: Filter wählen → Kartenliste → Kartei drucken → Karten in die Kiste legen.
- Was gedruckt wird: eine Karte je Idee auf einem eigenen Blatt mit Titel, Altersband, Dauer, Material, Anleitung (drei bis fünf Schritte), Variante und Inklusionstipp (Bestand).

## 4. Daten

Datei: `apps/bewegungs-schatzkiste/daten/spiele.json` (Bestand: 28 Einträge). Neu: Felder `quelle` und `eigenentwurf`; Ausbau mit weiteren Einträgen in derselben Datei. Schema mit einer Beispielzeile:

```json
{ "id": "kreis-katz-und-maus", "kategorie": "kreis-ordnung", "titel": "Katz und Maus im Kreis", "altersband": "3-5", "quelle": { "seite": "S. 165" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
ladeSpiele(datei) -> Liste<Spiel>
  lies daten/spiele.json
  prüfe je Eintrag: id, kategorie, titel, altersband, anleitung mit 3 bis 5 Schritten
  prüfe je Eintrag: quelle.seite vorhanden ODER eigenentwurf == true
  prüfe: kein Eintrag hat das Feld liedtext
  bricht ab bei Fehler

filtereSpiele(spiele, { kategorie, altersband, ort }) -> Liste<Spiel>
  Bestand aus logik.mjs Z. 10, unverändert
  Kategorie kreis-ordnung wird als Auswahl angeboten

druckeKarte(spiel) -> HTML-Blatt
  ein Blatt A4 hoch; break-inside: avoid
  prüfe Text: keine Zeichen aus ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile
  setze titel, altersband, dauer, material, anleitung, variante, inklusionsTipp ein

druckeKartei(liste) -> HTML
  für jedes Spiel in liste: druckeKarte(spiel)
  Abnahme: Anzahl der Blätter == Länge von liste

uebersetzungZeile(spiel, sprache) -> String | null   (offen, nur nach Entscheidung zu uk/ru)
  gib spiel.titel_uk oder spiel.titel_ru zurück; sonst null
```

## 6. Regeln (docs/02)

- [ ] Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, eigene Schlüssel, Löschknopf für genau diese Schlüssel. Kein sessionStorage, IndexedDB, Cookie, Cache. Der Bestand speichert nichts; der Filter lebt nur im Speicher der Seite (`app.mjs` Z. 9).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24). Der Bestand nutzt NetzwerkWächter und CSP (README).
- [ ] Keine Eingabefelder (Projektregel; docs/02 Z. 17–30 begrenzt Datenerhebung und Kommunikation). Filter nur über Auswahl, kein Freitext.
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes (docs/02 Z. 141–146). Der Bestand hat keinen Score und kein Ranking (`app.mjs` Z. 10). Der Ausbau übernimmt das.
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe und Fußlink mindestens 48 px (docs/02 Z. 50).
- [ ] Pflichtmarkierung „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ Sie steht auf jedem gedruckten Blatt, das eine Seitenangabe trägt. Ob die Karten Seitenangaben drucken, ist offen (A18, Abschnitt 9).
- [ ] Keine Liedtexte, keine Noten (docs/10, Z. 455: nur Spielmechanik und eigene Texte).
- [ ] Keine Modellnamen in Dateien; KI-Begriffe nur wie in der Vorlage. Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht vorhanden, offen. Der Katalog verlangt je Spiel eine Variante (docs/10, Z. 455).

## 7. Tests

- `test/*.test.mjs` (Bestand): der Test „jede der sieben Kategorien hat genau vier Karten“ (GDD, Abschnitt 5) wird angepasst, weil der Ausbau die Anzahl je Kategorie ändert. Der Test auf das fehlende Feld `liedtext` bleibt.
- Neu: jede Karte hat Quelle oder Eigenentwurf-Kennung; anleitung hat drei bis fünf Schritte.
- Neu (Vorlage `apps/puppentheater-werkstatt/test/regeln.test.mjs`): Druck über alle Karten: keine Zeichen aus der Sperrliste, keine Emojis, keine Namenszeile, keine Tagesfelder.

## 8. Abnahme

- `node --test apps/bewegungs-schatzkiste/test/*.test.mjs` grün; Testzahl in README und GDD stimmt.
- Browser bei 360 px: kein Überlauf, Knöpfe mindestens 48 px, Fokus nach Klick, Speicher gleich null, nur `localhost`.
- Druck: Zahl gedruckter Karten gleich Auswahl; keine Zeichen; keine Namenszeile.
- Registrierung nur durch den Koordinator (Hub, README, Impressum, `docs/10`, Katalog).

## 9. Offen

- Zuordnung CON-8 zur App `bewegungs-schatzkiste` (Index): Der Katalogeintrag Kreisspiele (docs/10, Z. 455) umfasst 20 und mehr Strukturen mit Reigen und Rollenspielen. Die App hat vier Karten in dieser Kategorie. Entscheidung nötig: Ausbau dieser App oder eigene App mit neuem Bauauftrag.
- Die Kategorie Fangspiele (vier Karten) überschneidet sich mit den Spielen Katz und Maus sowie Wolf und Schafe aus dem Katalog. Entscheidung, in welcher Kategorie solche Spiele stehen.
- uk- und ru-Varianten je Spiel: offen. Keine Übersetzung ohne Entscheidung.
- Altersband: Die App filtert 1–3, 3–5 und 5–7; der Katalog nennt für Kreisspiele 3 bis 5 (docs/10, Z. 455). Entscheidung, ob der Filter bleibt.
- A18 Seitenangaben: Standard (Vorschlag) ist, dass keine Seitenzahl auf der Karte steht; die Daten tragen `quelle`.
