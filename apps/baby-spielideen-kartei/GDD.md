# Spielideen-Kartei: Was kann mein Baby mit...?: Kurz-GDD

## 1. Warum
Eltern und Fachkräfte suchen für Babys im ersten Lebensjahr einfache Spielideen mit
Alltagsgegenständen. Die Praleska beschreibt die Handlungen mit Gegenständen auf S. 40 und 41.
Die Kartei macht sie als Karten nutzbar: filtern, wählen, drucken.

## 2. Wer und Kernerlebnis
Wer: Eltern und Fachkräfte. Das Baby nutzt das Werkzeug nicht.
Kernerlebnis: Die Erwachsene wählt einen Gegenstand oder eine Handlung, sieht die Karte mit
ihrer Seitenangabe und druckt die gewählten Karten.

## 3. Entscheidungen
- 16 Karten. Die Quelle nennt auf S. 40 17 Nennungen; „нанизывание“ und „кольца пирамидки
  нанизывает на стержень“ sind eine Handlung (Aufreihen).
- Jede Karte trägt Handlung, Quellenangabe, Begriffe mit Seite, Gegenstand mit Seite,
  Spielidee und Sicherheitssatz (Eigenentwurf) sowie die Pflichtmarkierung.
- Quellenangabe: „Praleska, S. 40“. Zwei Karten tragen „Praleska, S. 40–41“, weil eine ihrer
  Angaben auf S. 41 liegt: Aufeinanderlegen (Verweis „строить башню“) und Auf dem Boden rollen
  (Spielwagen, „коляску“). Die Angabe folgt aus den Seiten der Karte; test/logik.test.mjs prüft das.
- Der Druck zeigt nur die gewählten Karten, je Karte ein Blatt A4 hoch. Keine Zeichen,
  Kästchen, Punkte, Sterne oder Emojis; keine Namenszeile, kein Tages- oder Wochentagsfeld
  (docs/02 Z. 79–82).
- Keine Eingabefelder und keine Speicherung (Projektregel, ohne docs/02-Zeile).
- Keine Bewertung von Kindern, keine Einstufung, keine Rangliste (docs/02 Z. 141–146).
- Keine Anfragen nach außen (docs/02 Z. 22–24): Content-Security-Policy, Netzwerk-Wächter,
  Daten per JSON-Import.
- Der Titel bleibt wie im Katalog: „Spielideen-Kartei: Was kann mein Baby mit...?“.
- Keine Zahl von Entwicklungsschritten, keine Norm, kein Verschluckhinweis als Quellenaussage.

## 4. Lernziele (prüfbar)
1. Die Erwachsene findet über Gegenstand oder Handlung die passende Karte; jede Karte nennt ihre Seite.
2. Die Erwachsene druckt nur die gewählten Karten, je Karte ein Blatt.
3. Auf keiner Karte und in keinem Druck steht ein Kind; es gibt kein Feld dafür.

## 5. Inhalt
16 Karten, Daten in `daten/spielideen.json`. Gegenstände: Pyramide, Würfel, Kreisel, Ball,
Holzfass, Holzei, Pilz (S. 40) und Spielwagen (S. 41). Die Handlungsliste endet mit „и т. д.“ (S. 40).

## 6. Politik (docs/02)
- Keine Anfragen nach außen (docs/02 Z. 22–24).
- Druckblatt nach docs/02 Z. 79–82: keine Zeichen, keine Namenszeile.
- Keine Bewertung von Kindern (docs/02 Z. 141–146).
- Projektregeln ohne docs/02-Zeile: keine Speicherung; kein Bildschirm für Kinder, das Werkzeug
  ist für Erwachsene.

## 7. Aufwand
S bis M. Die Karten sind statisch. Der Filter lebt nur in der geöffneten Seite.

## 8. Tests
34 Tests in zwei Dateien. `test/logik.test.mjs` prüft Daten, Seiten, die Nennungen gegen den
Wortlaut der Quelle, Gegenstände, Glossen, Filter und Auswahl. `test/regeln.test.mjs` prüft die
Projektregeln. Details in der README.

## Offen
- Zahl 17 oder 16 auf den Karten: Die Quelle nennt 17 Nennungen auf S. 40; zwei davon bilden
  eine Handlung (Aufreihen), also 16 Karten. Eine Fachkraft entscheidet, ob das so bleibt.
- Fachprüfung der Gegenstandsliste: acht Gegenstände aus S. 40 und 41. Offen ist die Zuordnung
  von Würfel und Ball zu Festhalten (S. 40, beim Greifen genannt), von Holzei und Pilz zu
  Öffnen und Schließen (S. 40, als Übertragung genannt) und von Spielwagen zu Rollen (S. 41).
- Die Handlungsliste endet mit „и т. д.“ (S. 40). Weitere Handlungen sind nicht belegt;
  die App nennt keine.
- Entwicklungsschritte ohne Quelle: docs/10 nennt eine Zahl von Entwicklungsschritten. Die
  Quelle auf S. 39 bis 41 belegt sie nicht; die App nennt keine.
- Der Sicherheitssatz „Kleine Teile nur mit Erwachsenen; Gegenstände vor jeder Nutzung prüfen
  (Eigenentwurf).“ ist Eigenentwurf ohne Norm. Eine fachliche Prüfung steht aus.
- Glossen, Spielideen und Gegenstandsnamen sind Eigenentwurf; eine Fachkraft liest sie gegen.
- uk und ru: nicht vorhanden, offen.
- Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- Browser-Prüfung und Prüfung auf dem Gerät stehen aus.
- Vorlesefunktion (docs/02, Checkliste „есть озвучивание“): Die Zielgruppe der App sind Erwachsene.
  Vorlesen ist nicht gebaut. Der Geltungsbereich der Checkliste für diese Art Werkzeug ist offen
  (Frage in docs/fragen-und-hinweise.md, F2).
