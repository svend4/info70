# Puppentheater-Werkstatt: Kurz-GDD

## 1. Warum
Fachkräfte in Gruppen mit Kindern von 5 bis 7 Jahren können Figuren und eine kleine Bühne gemeinsam
gestalten. Die Praleska beschreibt auf S. 286 bis 288 Themen für Kinderarbeiten im Kinder-Design (Liste „Рекомендуемая тематика детских работ“), darunter
Afisha (Plakat), Einladungskarten für eine Ausstellung, Elemente für Kulissen, Dekorationen und Puppen
sowie Kleidung für Puppen. Die Werkstatt macht sie als Karte nutzbar: Auftrag ziehen, Stückanfang
ziehen, drucken.

## 2. Wer und Kernerlebnis
Wer: Fachkräfte. Die App ist kein Bildschirm für Kinder; das Blatt geben die Fachkräfte an die Gruppe weiter.
Kernerlebnis: Die Fachkraft drückt „Neuer Vorschlag“, sieht einen Auftrag mit Seitenangabe und einen
Stückanfang, und druckt das Blatt.

## 3. Entscheidungen
- Fünf Gestaltungsaufträge aus S. 286 bis 288, je mit Seitenangabe und Zitat. Die Übertragungen ins Deutsche sind Eigenentwurf.
- Ein Stückanfang aus vier Bausteinen: Figur, Ort, kleines Problem, offenes Ende. Alle Bausteine sind Eigenentwurf.
- Ein Vorschlag ist ein Gestaltungsauftrag und ein Stückanfang, zufällig gezogen. Der Zufall kommt
  in `app.mjs` aus `Math.random` und wird als Parameter `rng` an `logik.mjs` übergeben.
- Ein Blatt A4 hoch mit dem Auftrag, dem Stückanfang, der Quellenzeile und der Pflichtmarkierung.
  Keine Namenszeile, kein Feld für ein Kind, keine Zeichen, keine Punkte, keine Tages- oder Wochentagsfelder
  (docs/02 Z. 79–82).
- Keine Eingabefelder und keine Speicherung (Projektregel, ohne docs/02-Zeile).
- Keine Bewertung von Kindern, keine Einstufung, keine Rangliste (docs/02 Z. 141–146).
- Keine Anfragen nach außen (docs/02 Z. 22–24): Content-Security-Policy, Netzwerk-Wächter, Daten per JSON-Import.
- Der Titel bleibt wie im Katalog: „Puppentheater-Werkstatt“.

## 4. Lernziele (prüfbar)
1. Die Fachkraft bekommt mit „Neuer Vorschlag“ einen Gestaltungsauftrag, dessen Quelle auf dem Blatt mit Seite steht.
2. Der Stückanfang besteht aus vier Teilen, jeder aus einer eigenen Liste. Keiner stammt aus einem fremden Stück.
3. Das Blatt enthält keinen Namen, kein Feld für ein Kind und keine Zeichen; es ist ein Blatt A4 hoch.

## 5. Inhalt
Fünf Gestaltungsaufträge in `daten/werkstatt.json`: Plakat zur Vorstellung, Einladungskarte zur Vorstellung,
Kulisse und Dekoration, Puppe gestalten, Kleidung für eine Puppe. Vier Bausteinlisten für den Stückanfang,
je sechs oder sieben Sätze, selbst geschrieben.

## 6. Politik (docs/02)
- Keine Anfragen nach außen (docs/02 Z. 22–24).
- Druckblatt nach docs/02 Z. 79–82: keine Zeichen, keine Namenszeile.
- Keine Bewertung von Kindern (docs/02 Z. 141–146).
- Projektregeln ohne docs/02-Zeile: keine Speicherung; der Zufall steht nur in `app.mjs`; die Altersangabe
  5 bis 7 Jahre ist eine Lesart (siehe „## Offen“).

## 7. Aufwand
S. Die Daten sind statisch, die Logik ist klein. Der Aufwand liegt bei der fachlichen Prüfung der Texte.

## 8. Tests
39 Tests in zwei Dateien. `test/logik.test.mjs` prüft die Daten gegen die geprüften Zitate und Seiten,
die Bausteine, die Ziehung über den Parameter und den Druckinhalt. `test/regeln.test.mjs` prüft die
Projektregeln. Details in der README.

## Offen
- Altersangabe 5 bis 7 Jahre: Die Quelle nennt die Gruppe „шестой—седьмой годы жизни“ (S. 199) und „пяти-шести лет“ (S. 200).
  Die Angabe 5 bis 7 ist eine Lesart dieser Stellen; eine Fachkraft prüft sie.
- Die Gestaltungsaufträge Plakat und Einladungskarte sind Übertragungen. Die Quelle nennt dazu Ausstellungen
  (S. 288). Der Bezug zur Vorstellung ist Eigenentwurf; eine Fachkraft entscheidet, ob er so bleibt.
- Die deutschen Übertragungen der Begriffe sind Eigenentwurf; eine Fachkraft liest sie gegen.
- Die Bausteine des Stückanfangs sind Eigenentwurf. Eine fachliche Prüfung auf Alter, Sprache und Inhalt steht aus.
- uk und ru: nicht vorhanden, offen. Ob ein Vertep/Batleika-Modul aus docs/10 kommt, ist nicht entschieden;
  es steht nicht auf S. 287 bis 288 und ist nicht gebaut.
- Der Bildungsplan-Bereich aus docs/10 ist nicht geprüft und nicht übernommen.
- Seitenangaben: docs/02 Z. 151–152 verlangt für Seitenangaben die Markierung „проверено человеком“. Das Blatt trägt
  „noch nicht von einem Menschen geprüft“. Die Entscheidung dazu ist A18 in `docs/fragen-und-hinweise.md` (offen).
- Die Zitatprüfung gegen den Quelltext lief außerhalb des Repos (F3). Im Repo steht die Kopie der geprüften Zitate.
- Kein Sicherheitssatz auf dem Blatt: Die Vorlage „Spielideen-Kartei“ hat einen für Kleinteile, hier ist keine
  Quellenaussage dafür belegt. Eine Fachkraft entscheidet, ob ein Hinweis für die Materialien kommt.
- Vorlesefunktion: nicht gebaut. Die Zielgruppe der App sind Fachkräfte; der Geltungsbereich der Checkliste für
  diese Art Werkzeug ist offen, wie in der Vorlage.
- Browser-Prüfung, Prüfung bei 360 px Breite und auf dem Gerät stehen aus.
- Test mit Kindern der Zielgruppe (docs/02, Checkliste) steht aus.
Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
