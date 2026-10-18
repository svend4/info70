# Bauauftrag PRI-11: Bewegungsbilder-Karten

Status: teilweise · Abschnitt: Printmaterialien Kita · Ziel: Ausbau von apps/tier-tanz-impulse laut Index; Zielform ist eine Druckkartei für 1–3 Jahre (Entscheidung siehe 9. Offen)
Blockiert durch: keine

## 1. Quelle

- Praleska, S. 83–85, Abschnitte „Музыкально-ритмическая деятельность“ (S. 83) und „Танцевальное творчество“ (S. 84), Gruppe „МАЛЫШИ“ (S. 84).
- Begriffe und Titel in Anführungszeichen, höchstens 6 Wörter, mit Seite:
  - „Музыкально-ритмическая деятельность“ (S. 83)
  - „художественно-игровых образов“ (S. 83)
  - „мишка идет“ (S. 83)
  - „стрекоза летит“ (S. 83)
  - „Танцевальное творчество“ (S. 84)
  - „Рекомендуемый музыкальный репертуар“ (S. 84)
  - „Гавот“ (S. 84)
  - „танцевально-игрового творчества“ (S. 85)
- Umschrieben, ohne Anführungszeichen:
  - Kinder bewegen sich zur Musik nach Figuren und Bildern: ein Bär geht, ein Hase hüpft, eine Puppe tanzt, eine Libelle fliegt (S. 83).
  - Das Tempo wechselt zwischen schnell, mittel und langsam; die Bewegung endet mit dem Ende der Musik (S. 83).
  - Freies Improvisieren zur Musik soll den eigenen Eindruck ausdrücken (S. 84).
  - Die Quelle nennt Musikstücke mit Komponisten und Volksliedern. Die Auswahl für die Karten trifft diese Einheit selbst (S. 84–85; Eigenentwurf).
  - Die Gruppe ist für ein bis drei Jahre angelegt (S. 6).
- Keine ganzen Sätze aus dem Buch. Sätze werden mit Seitenangabe umschrieben (docs/10, „Правовая и этическая рамка“, Punkt 1: ни одного дословного текста).
- Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
- Seitenangaben werden gegen die Arbeitskopie geprüft (`tools/bauauftrag-pruefen.mjs`). Ergebnis: geprüft.

## 2. Zielgruppe und Lernziele

- Zielgruppe: Fachkräfte und Eltern für Kinder von 1 bis 3 Jahren, angeleitet durch Erwachsene (docs/10, Z. 483). Verwendung: Druck; die Musik spielt der Erwachsene, das Kind sieht kein Gerät.
- Lernziele, prüfbar:
  1. Das Kind bewegt sich zu einem Bewegungsbild, zum Beispiel wie ein Bär geht oder ein Schmetterling fliegt. (Eigenentwurf, Bilder nach S. 83)
  2. Das Kind wechselt das Tempo, wenn die Fachkraft mit Piktogramm und Hinweis zeigt, wie. (Eigenentwurf, Tempo nach S. 83)
  3. Das Kind bleibt stehen, wenn die Musik endet. (Eigenentwurf, Schluss nach S. 83)

## 3. Funktion

- Blätter: ca. 38 Bewegungskarten laut Katalog (docs/10, Z. 483). Jede Karte enthält ein Piktogramm (Eigenentwurf), einen Bewegungsimpuls in einem Satz, einen Tempo- und Dynamikhinweis und einen Musikvorschlag aus gemeinfreien Werken (Eigenentwurf; Beispiele Mozart, Tschaikowski, deutsche Volksweisen).
- Ablauf: Fachkraft zieht eine Karte → zeigt das Piktogramm → spricht den Impuls vor → startet die Musik auf dem eigenen Gerät → stoppt mit dem Musikende (Eigenentwurf).
- Was gedruckt wird: je Karte Piktogramm, Impuls, Tempo, Dynamik und Musikvorschlag. Eine Karte je Blatt A4 hoch.
- Was die App schon leistet (apps/tier-tanz-impulse, GDD und README gelesen): Bildschirm-App für 3–5 und 5–7; der Erwachsene bedient das Gerät, das Kind bewegt sich im Raum. Die Karten haben eine Geltung (naturgetreu, im Spiel ausgemacht, unbelebt), es gibt Rhythmus über WebAudio, eine Sitzung mit höchstens fünf Karten und Sicherheitshinweise für draußen.
- Lücke: keine Druckfassung, keine Karten ohne Ton, keine Fassung für 1–3 Jahre. Nach docs/10, Z. 185–189 ist für 1–3 nur Druck und Werkzeug für Erwachsene vorgesehen.

## 4. Daten

Datei (geplant): `apps/tier-tanz-impulse/daten/bewegungsbilder.json`. Schema mit einer Beispielzeile:

```json
{ "id": "baer-stapft", "titel": "Der Bär stapft", "piktogramm": "baer", "tempo": "langsam", "dynamik": "laut", "impuls": "Stapfe langsam wie ein Bär.", "musik": "Gavotte, Mozart (gemeinfrei)", "quelle": { "seite": "S. 83" }, "eigenentwurf": true }
```

## 5. Pseudocode

```
bewegungsKarteAusDaten(eintrag) -> Karte
  prüfe: titel, piktogramm, impuls und musik sind nicht leer
  prüfe: tempo ist eins von langsam, mittel, schnell
  prüfe: dynamik ist eins von leise, laut
  prüfe: impuls besteht aus genau einem Satz (ein Satzzeichen am Ende)
  prüfe: impuls enthält weder „links“ noch „rechts“
  gib Karte aus mit titel, piktogramm, impuls, tempo, dynamik und musik
bewegungsKartenDruck(karten) -> Blattliste
  für jede Karte: erzeuge ein A4-Blatt hoch mit Piktogramm, impuls, tempo, dynamik und musik
  hänge die Pflichtmarkierung an jede Karte mit quelle.seite an
  prüfe: Anzahl Blätter = Anzahl Karten
  prüfe: kein Zeichen aus ☐☒☑✓✔★☆ im Text
  -> Blattliste
```

## 6. Regeln (docs/02)

- [ ] Speicherung: keine Nutzerdaten, Druckkarten speichern nichts. Wird die Einheit eine App, dann nur localStorage mit eigenen Schlüsseln und Löschknopf, sonst nichts (docs/02, Z. 25).
- [ ] Keine Anfragen nach außen; CSP `default-src 'self'` (docs/02 Z. 22–24).
- [ ] Keine Eingabefelder (docs/02 Z. 17–30, Projektregel).
- [ ] Keine Bewertung, Punkte, Rangliste, Stufe, Name eines Kindes; die Bewegung des Kindes wird nicht beurteilt (docs/02 Z. 141–146).
- [ ] Für 1–3 Jahre nur Druck und Werkzeug für Erwachsene, kein Bildschirm für das Kind (docs/10, Z. 185–189).
- [ ] Musik nur aus gemeinfreien Werken; Aufnahmen und Liedtexte der Quelle nicht übernommen (docs/10, Z. 181–184).
- [ ] Druck: keine Zeichen ☐☒☑✓✔★☆, keine Emojis, keine Namenszeile, keine Tagesfelder (docs/02 Z. 79–82).
- [ ] Mobile First 360 px; Knöpfe mindestens 48 px (docs/02 Z. 50). Entfällt für reine Druckkarten.
- [ ] Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe: „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“
- [ ] Keine Modellnamen in Dateien; Modellnamen-Entscheidung A1 bleibt offen.
- [ ] uk und ru: nicht gebaut, offen.

## 7. Tests

- Kein neuer Test durch diese Einheit. Bestand: `apps/tier-tanz-impulse/test/logik.test.mjs` (25 Tests laut GDD §10).
- Prüfung der Druckkarten: `node tools/bauauftrag-pruefen.mjs <Pfad zur Arbeitskopie>`.

## 8. Abnahme

- Druck: Zahl gedruckter Karten gleich Auswahl; je Karte Piktogramm und Musikvorschlag; Pflichtmarkierung auf jeder Karte; keine Zeichen aus Abschnitt 6.
- Eine Fachkraft liest je Karte den Impuls gegen (Eigenentwurf).
- Registrierung nur durch den Koordinator (Hub, README, Impressum, docs/10, Katalog).

## 9. Offen

- Zielform: Druckkartei für 1–3 (Katalog) oder Ausbau der App tier-tanz-impulse (3–5 und 5–7, Bildschirm). Entscheidung offen.
- Musik: Die Komponisten sind gemeinfrei. Für Aufnahmen gilt das nicht automatisch; sie müssen eigens geprüft werden. Die Aufnahmen der Quelle werden nicht verwendet.
- Anzahl: ca. 38 Karten laut Katalog (docs/10, Z. 483) als Richtwert.
- Piktogramme sind Eigenentwurf; Bildquelle und Lizenz sind offen.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard: Auf dem Blatt steht keine Seitenzahl; die Seite steht in Abschnitt 1 und im Feld „quelle“.
