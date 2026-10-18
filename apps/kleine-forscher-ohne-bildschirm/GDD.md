# Kleine Forscher ohne Bildschirm: Kurz-GDD

## 1. Warum
Für Kinder von 1 bis 3 Jahren beschreibt die Praleska im Abschnitt „ПОЗНАВАТЕЛЬНО-ПРАКТИЧЕСКАЯ ДЕЯТЕЛЬНОСТЬ“
(S. 63) Erfahrungen mit Sand, Ton und Wasser sowie Handlungen mit Gegenständen (S. 63 bis 64): Stapeln,
Ineinanderstecken, ein Ball mit einem Stab holen, Sand mit einer Schaufel füllen. Die Fachkraft braucht
dafür Karten, die sie ausdrucken und bereitlegen kann. Die App macht sieben Versuchskarten daraus.

## 2. Wer und Kernerlebnis
Wer: Fachkräfte und Eltern. Das Kind sieht keinen Bildschirm; die Karte liegt auf Papier.
Kernerlebnis: Die Fachkraft wählt die Versuche, die sie vorbereitet, druckt sie aus, legt das Material
bereit, liest die Karte und zeigt die Handlung vor.

## 3. Entscheidungen
- Sieben Versuchskarten: Sand trocken, Sand nass, Ton, Wasser, Stapeln, Ineinanderlegen, Werkzeug (Eigenentwurf).
- Eine Karte je Blatt A4 hoch. Die Auswahl steuert, wie viele Blätter gedruckt werden.
- Auf dem Blatt: Titel, Quellenzeile ohne Seitenzahl, Begriffe mit Übertragung, Material, Lernziel,
  Sicherheitshinweis und Pflichtmarkierung.
- Die Seitenzahl steht in den Daten (`quelle.seite`), nicht auf dem Blatt (Bauauftrag Abschnitt 9).
- Keine Eingabefelder, keine Speicherung, kein Zufall, keine Anfragen nach außen.
- Keine Bewertung von Kindern (docs/02 Z. 141–146).
- Druckblatt: keine verbotenen Zeichen, keine Namenszeile, kein Tagesfeld (docs/02 Z. 79–82).
- Knete statt Lehm, damit das Material in der deutschen Kita vorhanden ist (Eigenentwurf).

## 4. Lernziele (prüfbar)
1. Die Fachkraft legt Sand, Ton oder Wasser bereit und führt den Versuch vor; das Kind fasst das Material an.
2. Das Kind stapelt Teile übereinander oder steckt sie ineinander.
3. Das Kind holt mit einem Werkzeug einen Gegenstand in Reichweite.

## 5. Inhalt
Sieben Karten in `daten/karten.json`. Je Karte: Titel, Begriffe mit Übertragung (nur bei fünf Karten),
Material, Lernziel, Sicherheitshinweis und Seite. Die Sicherheitshinweise sind Eigenentwurf.

## 6. Politik (docs/02)
- Keine Anfragen nach außen (docs/02 Z. 22–24).
- Druckblatt nach docs/02 Z. 79–82: keine Zeichen, keine Namenszeile.
- Keine Bewertung von Kindern (docs/02 Z. 141–146).
- Projektregeln ohne docs/02-Zeile: keine Speicherung, kein Zufall, keine Seitenzahl auf dem Blatt.

## 7. Aufwand
S. Die Daten sind statisch, die Logik ist klein. Der Aufwand liegt bei der fachlichen Prüfung der Sicherheitshinweise.

## 8. Tests
49 Tests in zwei Dateien. `test/logik.test.mjs` prüft die Daten gegen den Bauauftrag (Quellen,
Zitate, Pflichtfelder, Sicherheitshinweise), die Auswahl und die Druckblätter. `test/regeln.test.mjs`
prüft die Projektregeln. Details in der README.

## Offen
- Die Sicherheitshinweise zu Sand, Ton und Wasser sind Eigenentwurf und nicht geprüft. Eine Fachkraft mit U3-Erfahrung liest sie gegen.
- Anzahl der Karten: sieben Themen im Entwurf; die Zahl ist offen.
- Form: Druckkarte als App gebaut; der Index führte keine App (Bauauftrag Abschnitt 9).
- Die deutschen Übertragungen der Zitate sind Eigenentwurf; eine Fachkraft liest sie gegen.
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard: Auf dem Blatt steht keine Seitenzahl.
- uk und ru: nicht gebaut, offen.
- Neuladen ohne Netz: gemessen, keine Abnahmebedingung (F4).

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
