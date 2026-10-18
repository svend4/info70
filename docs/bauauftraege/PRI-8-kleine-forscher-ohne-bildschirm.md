# Bauauftrag PRI-8: Kleine Forscher ohne Bildschirm

Status: offen · Abschnitt: Printmaterialien Kita · Ziel: neue Druckkartei (im Index keine App)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 63–64, Abschnitt „ПОЗНАВАТЕЛЬНО-ПРАКТИЧЕСКАЯ ДЕЯТЕЛЬНОСТЬ“ (S. 63), Gruppe „МАЛЫШИ“ (S. 64).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „песок, глина, камушки“ (S. 63)
  - „сухой и влажный песок“ (S. 63)
  - „пирамидок из колечек“ (S. 64)
  - „достать палочкой“ (S. 64)
  - „совочком“ (S. 64)
  - „Я сам“ (S. 64)
- Umschrieben, ohne Anführungszeichen:
  - Die Umgebung soll um Stoffe wie Sand, Ton und Steine erweitert werden, die Kinder praktisch erkunden können (S. 63).
  - Als Versuch genannt wird das Untersuchen von trockenem und nassem Sand sowie von Ton, der mit Wasser begossen wird (S. 63).
  - Stapeln und Ineinanderstecken von Teilen zählt die Quelle zu den Handlungen mit Gegenständen (S. 63–64).
  - Ein unter den Schrank gerollter Ball wird mit einem Stab geholt (S. 64).
  - Sand mit einer Schaufel in einen Eimer füllen gilt als einfache Werkzeughandlung (S. 64).
  - Neugier und eigenes Ausprobieren sind als Ziele genannt (S. 64).
  - Die Gruppe ist für ein bis drei Jahre angelegt (S. 6).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Erzieherinnen, Erzieher und Eltern für Kinder von 1 bis 3 Jahren (docs/10, Z. 480). Verwendung: Druck, offline, ohne Bildschirm für das Kind (docs/10, Z. 185–189).
- Lernziele, prüfbar:
  1. Die Fachkraft legt Sand, Ton oder Wasser bereit und führt den Versuch vor. Das Kind fasst das Material an und beobachtet, was passiert. (Eigenentwurf, Erfahrungsfeld nach S. 63)
  2. Das Kind stapelt Teile übereinander oder steckt sie ineinander. (Eigenentwurf, Handlung nach S. 63–64)
  3. Das Kind holt mit einem Werkzeug einen Gegenstand in Reichweite. (Eigenentwurf, Handlung nach S. 64)

## 3. Funktion

- Blätter: eine Karte je Versuchsthema (Eigenentwurf): Sand trocken, Sand nass, Ton, Wasser, Stapeln, Ineinanderlegen, Werkzeug. Das sind sieben Karten. Die Zahl ist offen (siehe 9).
- Ablauf: Fachkraft legt das Material bereit → liest die Karte → zeigt die Handlung vor → Kind probiert aus → Fachkraft sagt, was passiert ist. Das Ergebnis wird nicht bewertet (docs/02, Z. 141–146).
- Was gedruckt wird: je Karte Titel, Lernziel für Erwachsene, Material, Sicherheitshinweis und Pflichtmarkierung. Eine Karte je Blatt A4 hoch.
- Materialanpassung: Knete statt Lehm, damit das Material in der deutschen Kita vorhanden ist (docs/10, Z. 480; Eigenentwurf).

## 4. Daten

Datei (geplant, nur falls eine App entsteht): `apps/kleine-forscher-ohne-bildschirm/daten/karten.json`. Ohne App: Druckdatei nach gleichem Schema. Beispielzeile:

```json
{ "id": "sand-nass", "titel": "Sand nass", "material": "Sand, Wasser, Schüssel", "sicherheit": "Kein Wasser in den Mund. Erwachsene bleiben dabei.", "quelle": { "seite": "S. 63" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
versuchKarteAusDaten(eintrag) -> Karte
  prüfe: eintrag.titel, eintrag.material und eintrag.lernziel sind nicht leer
  prüfe: eintrag.sicherheit hat mindestens 30 Zeichen
  prüfe: eintrag.quelle.seite hat die Form „S. n“ oder eintrag.eigenentwurf = true
  gib Karte aus mit titel, material, lernziel, sicherheit und quelle
kartenFuerThemen(karten, themen) -> Liste<Karte>
  für jedes thema in themen: finde die Karte mit karte.id = thema
  wenn keine gefunden: Fehler „Thema fehlt: {thema}“
  -> Liste in der Reihenfolge von themen
druckBlaetter(karten) -> Blattliste
  für jede Karte: erzeuge ein A4-Blatt hoch
  hänge die Pflichtmarkierung an, wenn quelle.seite gesetzt ist
  prüfe: Anzahl Blätter = Anzahl Karten
  prüfe: kein Zeichen aus ☐☒☑✓✔★☆ im Text
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
- [ ] Versuche mit Wasser nur unter Aufsicht; die Sicherheitstexte sind Eigenentwurf (siehe 9).
- [ ] Keine Modellnamen in Dateien; Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht gebaut, offen.

## 7. Tests

- Kein App-Test, solange die Einheit eine Druckfassung ist.
- Prüfung der Quellenangaben: `node tools/bauauftrag-pruefen.mjs <Pfad zur Arbeitskopie>` (Zitate, Abschnitte, Modellnamen).

## 8. Abnahme

- Druck: Zahl gedruckter Karten gleich Auswahl; keine Zeichen aus Abschnitt 6; Sicherheitshinweis und Pflichtmarkierung auf jeder Karte.
- Vor dem Druck liest eine Fachkraft mit U3-Erfahrung die Sicherheitshinweise gegen (Eigenentwurf).
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Form: Der Index führt keine App und den Schritt „neu bauen (Welle)“. Entscheidung: Druckkarte oder App.
- Anzahl der Karten: sieben Themen im Entwurf, Zahl offen.
- Sicherheitshinweise zu Sand, Ton und Wasser sind Eigenentwurf und nicht geprüft.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard: Auf dem Blatt steht keine Seitenzahl; die Seite steht in Abschnitt 1 und im Feld „quelle“.
