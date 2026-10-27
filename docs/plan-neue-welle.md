# Plan: neue Welle (Entwurf, kein Code)

Stand: 27.10.2026. Entscheidung Max 11а: jetzt nur Pläne und GDD-Entwürfe, kein Code; Start der Welle später (11б) mit höchstens 8 Agenten gleichzeitig. Dieser Plan nutzt `docs/bauauftraege/index.json` (131 Einheiten der Gruppe 2: gebaut 57, teilweise 63, offen 5, unklar 3, nicht bauen 3).

## 1. Was sich geändert hat

Dreizehn Bauaufträge waren durch „A7 quiz-kern“ blockiert (Bauaufträge und Index sind am 27.10.2026 angepasst) (Rekord und Ränge im Motor). A7 ist umgesetzt: der Motor kennt keinen Rekord, keine Punkte und keine Ränge mehr, und alle 26 Quiz-Apps laufen ohne Wertung durch (Quiz-Durchlauf grün). Damit ist die Blockade aufgehoben:

| Gruppe | Aufträge |
|---|---|
| neu (offen) | CON-3 Meine Familie – Wörter und Rollen · CON-6 Himmelsgucker · CON-9 Farbwörter-Schatz · CON-10 Musik-Wörter-Bilderlexikon |
| Ausbau (teilweise) | KIN-17 Uhr- und Kalender-Kind · GEM-8 Mathe-Entdecker · GEM-13 Erzähl-Brücke · GEM-14 Grammatik-Zwerge · GEM-16 Design-Entdecker · GEM-19 Geschichten-Wender · CON-1 Stark und gesund · CON-4 Mein Ort, mein Land, unsere Erde · CON-7 Herkunftssprachen-Brücke |

Der fünfte offene Auftrag, PRI-8 „Kleine Forscher ohne Bildschirm“, war nie blockiert; seine Fachprüfung der Sicherheitstexte steht aus (`docs/fragen-und-hinweise.md`, PRI-8).

## 2. Reihenfolge

| Stufe | Inhalt | Warum |
|---|---|---|
| 1 | CON-3, CON-6, CON-9, CON-10 und PRI-8 (fünf neue Apps) | Ohne Bauauftrag-Blockade, klar umrissen. CON-9 stand als „ohne quiz-kern (Regelkonflikt)“; der Konflikt ist weg, die Wahl der Engine ist eine Frage an Max. |
| 2 | Ausbau der neun entsperrten Apps | Die Lücke laut Befund steht im Bauauftrag; die Apps laufen schon auf dem neuen Motor. |
| 3 | Die übrigen 54 Ausbau-Aufträge in der Reihenfolge ihres Faktenstands: zuerst Einträge mit geprüfter Quelle (38 von 131), danach die mit Katalogtext, zuletzt solche, deren Quelle nicht im Repo prüfbar ist | Neue Funktionen auf ungeprüften Fakten erhöhen die Schuld im Strang Г. |
| – | CON-13 Trostvers-Generator, CON-15 Naturschutz-Rat, PRI-6 Frischluft-Rituale | „Unklar“: braucht eine Entscheidung von Max (`docs/offene-punkte-kita.md`, H), kein Bau davor. |
| – | KIT-18, KIT-20, CON-17 | „Nicht bauen“ (Beobachtungsbogen je Kind, Krippen-Portfolio); bleibt. |

## 3. Pflichten für jede neue App (Tore)

1. Kein Kind wird bewertet: weder Punkte, Rekord, Rang, Serie, Prozent, „richtig von“, „geschafft“, Sterne noch Pokal. Erlaubt ist ein neutraler Zähler des Gefundenen. Prüfung: `node tools/leistungs-woerter.mjs <app>` ohne unerklärten Treffer; Wertungs-Stand ohne neue Einträge.
2. Speicherregel: Speicher ⇒ Löschknopf, kein Speicher ⇒ keine Karte „Meine Daten löschen“ (`packages/kinderschutz/test/speicher-regel.test.mjs`).
3. Berührziele mindestens 48 px, kein Überlauf bei 360 px, Fokus nach Klick; Delta-Tor `node tools/browser-tor.mjs <app>` ohne Erhöhung.
4. Quiz-Apps: `node tools/quiz-durchlauf.mjs <app> --modus alle` grün.
5. Druck: Fuß und Bildschirmteile verborgen, keine Namenszeile; auf Kinderblättern keine Kästchen, Haken und Sterne (`docs/02`, Ergänzungen vom 27.10.2026).
6. Fakten: jede Aussage über Recht, Geld oder Gesundheit hat eine Quelle oder den Vermerk „(Eigenentwurf, fachlich nicht geprüft)“ (Zähler externer Fakten).
7. Vorlesen für Kinder-Apps; Werkzeuge für Erwachsene tragen im GDD den Vermerk dazu.
8. Seiten der Quelle: nur mit dem Vermerk „maschinell geprüft, noch nicht von einem Menschen geprüft“.
9. Keine Modellnamen, keine fremden Adressen, keine Zitate über sechs Wörter.

## 4. Ablauf einer Stufe (11б)

Je Auftrag ein Schreiber und ein unabhängiger Prüfer (Workflow), höchstens 8 Agenten gleichzeitig; der Integrator allein committet und führt Tests, Quiz-Durchlauf und Delta-Tor aus, bevor gepusht wird. Eine Stufe ist eine Gruppe von höchstens acht Aufträgen; zwischen den Stufen liest Max die Berichte. GDD-Entwürfe für Stufe 1 liegen unter `docs/neue-welle/` (siehe dort).

## 5. Entscheidungen, die Max vor Stufe 1 treffen sollte

1. Dürfen die vier Inhaltspakete (CON-3, CON-6, CON-9, CON-10) auf `quiz-kern` laufen (empfohlen), oder als eigene Karten-Apps?
2. Soll PRI-8 vor der Fachprüfung der Sicherheitstexte gebaut werden (mit dem Vermerk „fachlich nicht geprüft“)?
3. Die drei „unklar“-Aufträge (CON-13, CON-15, PRI-6): bauen, ändern oder streichen?
