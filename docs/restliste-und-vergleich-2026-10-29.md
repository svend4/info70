# Restliste und Vergleich der Pläne vom 18.10 und 27.10 (Stand 29.10.2026)

Dieses Dokument ist ein Nachtrag. Es ändert keinen Plan, keine App und keinen Bauauftrag und löscht nichts. Es hält fest, was aus dem Plan vom 18.10 (`docs/plan-praleska-umsetzung.md`) noch offen ist, was der Plan vom 27.10 (`docs/plan-neue-welle.md`) als nächste Schritte verlangt, worin sich beide unterscheiden und welche Entscheidungen den Rest freigeben.

Quellen: `docs/status-gruppe-2-2026-10-29.json` (131 Einheiten; Felder `status_18_10`, `status_27_10`, `status` für den Stand 29.10, `faktenstand`, `stufe`, `stufe_3_reihenfolge`), `docs/fragen-fuer-max-2026-10-28.md` (Fragen 48 bis 83), `docs/analyse-ausbau-2026-10-29.md` und `.json` (Analyse der 62 Einheiten „teilweise“), `docs/serie-c-2026-10-29.md`, `docs/uebergabe-2026-10-29.md`, `docs/inventar-offene-punkte-2026-10-29.md`, `docs/arbeitsweise/briefs/stufe-2-rest.md`.

## 1. Stand in Zahlen

Gruppe 2 hat 131 Einheiten. Die Übergänge vom Plan 18.10 zum Stand 29.10 (Anzahl der Einheiten):

| Plan 18.10 | Stand 29.10 | Anzahl | Einheiten |
|---|---|---|---|
| gebaut | gebaut | 53 | — |
| gebaut (Variante A) | gebaut | 4 | KIT-1, KIT-2, KIT-8, KIT-23 |
| offen | gebaut | 5 | CON-3, CON-6, CON-9, CON-10, PRI-8 (Stufe 1 und PRI-8) |
| offen | teilweise | 6 | CON-2, CON-5, CON-11, CON-12, CON-18, PRI-7 |
| teilweise | gebaut | 1 | GEM-17 tischdienst-trainer |
| teilweise | teilweise | 56 | — |
| unklar | unklar | 3 | CON-13, CON-15, PRI-6 |
| nicht bauen | nicht bauen | 3 | KIT-18, KIT-20, CON-17 |

Stand 29.10: gebaut 63, teilweise 62, unklar 3, nicht bauen 3. Im Plan 27.10 stehen 62 Einheiten als „teilweise“ (Stufe 2: 9, Stufe 3: 53), dazu die drei unklaren und die drei nicht zu bauenden. Alle übrigen Einheiten erwähnt der Plan 27.10 nicht.

## 2. Restliste aus dem Plan vom 18.10

Der Plan vom 18.10 hat vier Serien (Abschnitt 7 des Plans). Der Stand am 29.10:

**Serie A, neue Apps.**
- Welle 92 (CON-2, CON-5, CON-11): gebaut, bleiben „teilweise“ (Lücken offen; uk und ru nicht erfunden). Offen: Entscheidung 53, Bauauftrag CON-2 und CON-5 „neu bauen“ im Index (Analyse B), CON-11 Altersgruppe und Quelle.
- Welle 93: CON-12 Puppentheater-Werkstatt (teilweise, Bauauftrag veraltet; Entscheidung 60), CON-18 Theater zuhause (teilweise, Stufe 3), PRI-7 Fühl- und Sortier-Werkstatt (teilweise, Frage 59: ausbauen oder neu bauen; Altersangabe A20).
- Welle 94: PRI-8 Kleine Forscher ohne Bildschirm: gebaut. Offen: Fachprüfung der Sicherheitstexte (`docs/fragen-und-hinweise.md`, PRI-8).
- „Danach“: PRI-6 (unklar, Frage 61), CON-13 Trostvers (unklar, Frage 61), CON-15 Naturschutz-Rat (unklar, Frage 61). Kein Bau vor der Entscheidung.
- „Zurückgestellt“: Content-Pack 3, 6, 9, 10 (CON-3, CON-6, CON-9, CON-10): gebaut in Lauf E, 27.10. Dokument 17 (Krippen-Portfolio, CON-17) und Kita-Dokumente 18 und 20 (KIT-18, KIT-20): „nicht bauen“ (27.10).

**Serie B, Ausbau.** 57 Einheiten „teilweise“ (18.10); heute 62 (27.10: 9 in Stufe 2, 53 in Stufe 3). Die Analyse der 62 Einheiten steht in `docs/analyse-ausbau-2026-10-29.md`. Offen: Entscheidungen 49 bis 69, 74 bis 76, 78 bis 83; CON-4 wartet auf 68 und 69 (Arbeitsstand unkommittiert); Stufe 3 wartet auf 48, 49 und 64.

**Serie C, Faktencheck gebauter Apps.** Die Status-Datei zählt 49 gebaute Einheiten mit dem Faktenstand „nur Katalogtext“ oder „Quelle nicht im Repo prüfbar“. Der Plan 18.10 nennt 53; die Differenz ist nicht geklärt (Zählregel offen).
- Seitenangaben geprüft: 13 Einheiten (Pilot fünf, Welle 2 drei, Welle 3 fünf; `docs/serie-c-2026-10-29.md`).
- Ausbau-Überschneidung: jahreszeiten-rad (KIN-12, Ausbau-Einheit PRI-10), tischdienst-trainer (GEM-17, PRI-14), mini-gaertner-begleiter (KIT-22, PRI-15), bewegungs-schatzkiste (PRI-1, CON-8). Diese vier Apps werden erst mit ihrer Ausbau-Einheit geprüft.
- Welle 4 (Zahlen und Altersangaben, nur lesend, 31 Apps): Ergebnis am 29.10.2026 in `docs/serie-c-2026-10-29.md`, Abschnitt 3b (15 mit Abweichung, 11 offen, 5 unauffällig; Entscheidungen 79, 84, 85).
- Der Befund der Welle 3 zum Werkzeug (JSON-Einträge über mehrere Zeilen) wird vor einer Neuzählung behoben (Werkzeug in Arbeit, siehe Abschnitt 5).

**Serie D, Dokumentation.** Erledigt: Statuszeilen am Ende von `docs/10` (Ableitung `tools/gruppe-2-stand.mjs --docs10`, Commit cf40161).

## 3. Restliste aus dem Plan vom 27.10

**Stufe 1** (CON-3, CON-6, CON-9, CON-10): gebaut (Lauf E). Offen: Fragen 79 (Altersangaben gegen die Quellengruppen) und 80 (tannengrün, Seitenangabe); Serie-C-Befunde sind korrigiert (Commit d8058fc).

**Stufe 2** (9 Einheiten, Ausbau entsperrter Apps):

| Einheit | App | Stand | Blockiert durch |
|---|---|---|---|
| KIN-17 | uhr-und-kalender-kind | committet (d4446a0); Bauauftrag und Index veraltet | Korrektur der Dokumente (Koordinator) |
| GEM-8 | mathe-entdecker | committet (ecc9fa6) | Dokumente; Frage 53 (Sprachen) für Zahlwörter |
| GEM-13 | erzaehl-bruecke | committet (73b342a) | Fragen 53 bis 56, 62, 65 bis 67 |
| CON-4 | deutschland-kompass | Arbeitsstand unkommittiert, npm test grün (42 Tests) | Fragen 68, 69 (Commit) |
| GEM-14 | grammatik-zwerge | Ausbau offen | Fragen 54 und 57 (Brief stufe-2-rest) |
| GEM-16 | design-entdecker | Ausbau offen | Fragen 54 und 56 |
| GEM-19 | geschichten-wender | Ausbau offen | Fragen 53, 55, 58 |
| CON-1 | stark-und-gesund | Ausbau offen | Fragen 51, 52; 50 (Wertungsreste) |
| CON-7 | herkunftssprachen-bruecke | Ausbau offen | Fragen 53, 55; 50 |

Gemeinsamer Stand: Die Entscheidung 64 (Stufe 2 als Ganzes abschließen) nennt die Fragen 50 bis 60 als Voraussetzung. Der Brief `docs/arbeitsweise/briefs/stufe-2-rest.md` sagt: Bis zur Entscheidung wird an diesen Apps nichts geändert; zulässig ist nur Vorbereitung. Die Quellenprüfung dafür steht in `docs/vorbereitung-stufe-2-2026-10-29.md` (liegt vor, Stand 29.10.2026; Ergänzungen bei den Fragen 52 und 55 bis 58).

**Stufe 3** (53 Einheiten): nach der Reihenfolge des Faktenstands (Frage 49, Status-Datei, Feld `stufe_3_reihenfolge`):
- 22 Einheiten mit geprüfter Quelle (Faktenstand „faktengeprüft“), zuerst. Die ersten acht: ELT-4, ELT-6, ELT-8, ELT-12, ELT-13, ELT-15, ELT-16, ELT-21.
- 26 Einheiten mit Katalogtext.
- 5 Einheiten ohne prüfbare Quelle.
Freigabe: Frage 64 (Stufe 2 zuerst) und Frage 48 (Serie C nach Stufe 3, ★) sind offen. Zwischen den Stufen liest Max die Berichte (Plan 27.10, Abschnitt 4).

**Unklar** (drei, je Entscheidung): PRI-6 (Frage 61 a), CON-13 (Frage 61 b, Kindernamen), CON-15 (Frage 61 c, Klassen-Koffer).

**Nicht bauen** (drei): KIT-18, KIT-20, CON-17 (Begründung dokumentiert).

**Ohne App**: CON-16 Konzept-Mapping (Frage 74, Art des Ergebnisses).

## 4. Vergleich: was der Plan vom 27.10 gegenüber dem Plan vom 18.10 anders regelt

| Punkt | Plan 18.10 | Plan 27.10 | Auswirkung heute |
|---|---|---|---|
| Umfang | alle 131 Einheiten in vier Serien A bis D | nur der Ausbau (62), unklar (3), nicht bauen (3); Serie C und D fehlen | Serie C und D laufen weiter nach Entscheidung 48 |
| Reihenfolge Ausbau | nach Altersstufen (Serie B) | Stufe 2 (entsperrte Apps), dann Stufe 3 nach Faktenstand | Frage 49 (★ nach Faktenstand) |
| Welle 93 und 94 | PRI-7, CON-12, CON-18, PRI-8 | PRI-8 gebaut; CON-12, CON-18, PRI-7 in Stufe 3 | Entscheidungen 59 und 60 |
| quiz-kern | vier Content-Packs zurückgestellt | gebaut; A7 erledigt; Engine-Wahl offen (Frage 31) | Stufe 1 gebaut (Lauf E) |
| Tore | nicht in dieser Form | neun Pflichten („Tore“) für jede neue App oder Erweiterung (Abschnitt 3) | gelten für alle Einheiten ab Stufe 2 |
| Ablauf | ein Zyklus je App | ein Schreiber und ein unabhängiger Prüfer je Auftrag, höchstens acht Agenten gleichzeitig, Integrator committet allein (Abschnitt 4) | gilt für Stufe 2 und 3 |
| Blockierende Entscheidungen | quiz-kern (erledigt), A18 Seitenmarke (offen), A19 Katalogtext (entschieden 23а), A13 (nicht bauen), Trostvers (offen) | quiz-kern beantwortet, drei unklare Aufträge offen | Liste in Abschnitt 5 |
| Seitenmarke | Entscheidung A18 offen | Tor 8: Seitenangaben nur mit Vermerk | A18 bleibt offen (Standard für ältere Apps) |
| Zählung | 53 gebaut, 57 teilweise, 11 offen | 62 teilweise (Stufen 2 und 3) | Index muss angeglichen werden (Plan 27.10, Abschnitt 7, Punkt 4) |

Wo die Pläne sich nicht unterscheiden: unklar (drei) und nicht bauen (drei) sind in beiden Plänen gleich. Der Plan 27.10 ist für Tore und Ablauf verbindlicher; wo er schweigt, gilt der Plan 18.10 (Serie C, Serie D).

## 5. Entscheidungen, die den Rest freigeben

Die Empfehlungen (★) stehen in den Fragen. Keine davon ist entschieden, außer den unten genannten. Eine Löschung ist nach der Anweisung „nichts löschen“ nicht umsetzbar; diese Optionen bleiben geparkt.

| Frage | Thema | ★ | Freigibt | Hinweis |
|---|---|---|---|---|
| 48 | Serie C und D nach Stufe 3 | a) (nach Stufe 3) | Serie C-Wellen; die Fortführung des Plans 18.10 hat der Nutzer am 29.10. verlangt | Pilot und Welle 2 bis 4 laufen vor Stufe 3; Einordnung bleibt offen |
| 49 | Reihenfolge Stufe 3 | a) nach Faktenstand | Stufe 3 | Vorschlag liegt vor |
| 50 | Wertungsreste (Stufe 2) | a) Entfernen | CON-1, CON-7 | Löschung: geparkt; b) nach Stufe 2 wäre mit dem Stand vereinbar |
| 51 | Ränge | a) keine Ränge, Katalog angleichen | CON-1, CON-4 | Dokumentänderung |
| 52 | Gesundheitsaussagen (CON-1) | a) fachlich prüfen | CON-1 | Vorbereitung in Arbeit |
| 53 | uk und ru | a) zunächst nur Deutsch | 41 Einheiten | Größte Einzelfrage; CON-7 hat uk-Inhalte schon |
| 54 | Engine der Ausbauten | a) eigenes Format, Katalog angleichen | GEM-13, GEM-14, GEM-16 | |
| 55 | Altersgruppen | a) Katalog an die App angleichen, wenn die App stimmt | GEM-13, GEM-19, CON-7, CON-19, PRI-9, PRI-10, PRI-13 | Altersfrage in Serie C (Frage 79) |
| 56 | Bilder | a) keine Bilder, nur Beschreibungen | GEM-13, GEM-16 | |
| 57 | Begriffe GEM-14 | a) App-Form behalten | GEM-14 | Vorbereitung prüft die Sternchen |
| 58 | GEM-19 Abweichungen | a) bestätigen, Erzeugerfunktion später | GEM-19 | |
| 59 | PRI-7 ausbauen oder neu bauen | a) ausbauen; Altersangabe 1 bis 3 | PRI-7 | Index sagt „neu bauen“ |
| 60 | CON-12 Vertep und Batleika | a) streichen | CON-12 | Löschung: geparkt |
| 61 | PRI-6, CON-13, CON-15 | je Einheit | drei unklare | |
| 62 | Zitatgrenze sechs Wörter | a) sechs | alle Apps | Angewendet; Bestätigung offen |
| 64 | Freigabe der Ausbauten | a) Stufe 2 als Ganzes nach 50 bis 60 | Stufe 3 | Gate |
| 65 bis 67 | Zufall, Wort „Stufe“, Fokus (GEM-13) | a) Bestand bleibt | GEM-13 | 66 a) ersetzt Wörter: Löschung, geparkt; b) bleibt |
| 68 | CON-4 Umfang des Modus | a) Umfang des Briefs annehmen | CON-4 Commit | |
| 69 | Testzahl-Regel (CON-4) | a) Klammer „(13 Prüfungen)“ | CON-4 Commit | Änderung einer Zählung; Konsistenz prüfen |
| 74 | CON-16 Art des Ergebnisses | a) Konzeptdokument | CON-16 | |
| 75 | Vorlesefunktion, Zielgruppe | a) Zuordnung wie GDD | PRI-14 | Ergänzung: sechs weitere Apps (Frage 83) |
| 76 | Altersangabe tier-tanz-impulse | a) 5 bis 7 | PRI-11 | |
| 78 | Wörtlich übernommene Stellen | a) kürzen oder umformulieren | 12 Apps in den 62 Einheiten (44 Stellen) | Kürzung ist Löschung: geparkt; Entscheidung nötig |
| 79 | Altersangaben vier Apps | a) angleichen; b) begründen | Serie C | |
| 80 | tannengrün, Seitenangabe | a) bleibt, Hinweis | farbwoerter-schatz | |
| 81 | Pflicht-Nachzug, Druckverstöße | a) Druck additiv; Rest je Einheit | Stufe 2 und 3 | Stufe-2-Apps bekommen den Nachzug mit ihrer Einheit |
| 82 | aemtli-rad, Register | a) Register ergänzen | Register | Angabe bleibt mit Anmerkung |
| 83 | Vermerk 28а | a) in allen Erwachsenen-Werkzeugen | acht bis neun GDD | Liste in der Analyse, Abschnitt 3.3 |

Mindestentscheidung, um Stufe 2 zu schließen: 50 (b), 51 bis 58, 68 und 69. Für Stufe 3 zusätzlich 49 und 64. Für die Serie C: 79 und 80.

## 6. Umsetzungsreihenfolge nach dem Plan 27.10

1. Stufe 2 Rest (GEM-14, GEM-16, GEM-19, CON-1, CON-7) mit dem Brief `stufe-2-rest.md`, sobald 50 bis 58 entschieden sind. Je Einheit ein Schreiber und ein unabhängiger Prüfer; Pflicht-Testdatei und Testskript; Testzahl in README und GDD; Koordinator committet.
2. CON-4 committen, sobald 68 und 69 entschieden sind; danach die Wurzel-README-Zählung nachziehen (`node tools/zahlen.mjs --schreiben`).
3. Bericht an Max, Freigabe Stufe 3 (Fragen 49 und 64).
4. Stufe 3 in Wellen zu höchstens acht Einheiten, in der Reihenfolge von Frage 49. Jede Welle beginnt mit der Textkopie-Prüfung der Seitenangaben. Sieben Wellen decken 53 Einheiten.
5. Unklare Einheiten (PRI-6, CON-13, CON-15) nach Frage 61; CON-16 nach Frage 74.
6. Serie C: Welle 4 (Zahlen und Altersangaben, siehe Abschnitt 2) und danach die übrigen Apps der Population; Abschluss nach Entscheidung 79.

## 7. Was in dieser Sitzung erledigt ist

- Serie C, Welle 3: Korrekturen (Commit d8058fc).
- Analyse der 62 Einheiten (Commit bb28d12).
- Laufend: Werkzeug für JSON-Prüfung der Seitenangaben, Welle 4 Zahlen und Altersangaben (31 Apps), Vorbereitung Stufe 2 (Quellenprüfung für 52 und 55 bis 58).

Stufe 2 und Stufe 3 sind nicht begonnen, weil die Entscheidungen fehlen. Das ist die Voraussetzung, die der Brief und der Plan 27.10 setzen.

Seitenangaben in diesem Dokument (Nachtrag 29.10.2026): Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
