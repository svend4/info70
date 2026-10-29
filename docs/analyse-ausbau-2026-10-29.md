# Analyse: Ausbau der Gruppe 2 (62 Einheiten „teilweise“), Stand 29.10.2026

Dieses Dokument ist ein Nachtrag. Es ändert keine App, keinen Bauauftrag und keinen Plan und löscht nichts. Es fasst die drei Analysen der Einheiten zusammen, die der Index vom 27.10.2026 als „teilweise“ führt: Gruppe A mit 21 Einheiten, Gruppe B mit 22 und Gruppe C mit 19. Die vollständigen Befunde je Einheit stehen in `docs/analyse-ausbau-2026-10-29.json`. Dort sind getrennt: Stand der App, Lücken, Teilarbeiten ohne Entscheidung, offene Entscheidungen, Fachprüfung, Empfehlung und Hinweise.

Die Analysen haben nur gelesen. Der Koordinator hat die wichtigsten Aussagen gegen den Quelltext geprüft; was geprüft ist und was nicht, steht in Abschnitt 6.

Seitenangaben in diesem Dokument: Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## 1. Ergebnis in Kürze

- Von den 62 Einheiten gehören 9 zu Stufe 2 und 53 zu Stufe 3 (Plan vom 27.10, Abschnitt 2).
- Die Analysen empfehlen: 34 Einheiten „teilweise sofort“, 14 „wartet auf Entscheidung“, 12 „Bauauftrag veraltet oder widersprüchlich“, 2 „wartet auf Fachprüfung“. Keine Einheit ist „sofort ohne Entscheidung“.
- Alle 34 Einheiten mit möglicher Teilarbeit gehören zu Stufe 3. In Stufe 2 gibt es keine Einheit, die ohne Entscheidung oder ohne Korrektur des Bauauftrags weitergebaut werden kann.
- Nach dem Plan vom 27.10 (Abschnitt 2 und 4) liest Max die Berichte zwischen den Stufen. Stufe 2 ist nicht abgeschlossen, Stufe 3 ist nicht freigegeben (Fragen 49 und 64). Deshalb wurde in dieser Sitzung keine Einheit ausgebaut. Die Teilarbeiten (Feld `ohne_entscheidung` in der JSON-Datei) sind Vorschläge.
- Die Reihenfolge der Stufe 3 (Frage 49) ist im Feld `stufe_3_reihenfolge` von `docs/status-gruppe-2-2026-10-29.json` abgeleitet: zuerst 22 Einheiten mit geprüfter Quelle, dann 26 mit Katalogtext, zuletzt 5 ohne prüfbare Quelle.

## 2. Stufe 2 (9 Einheiten)

| Kennung | App | Stand laut Analyse | Wartet auf | Hinweis |
|---|---|---|---|---|
| KIN-17 | uhr-und-kalender-kind | Ausbau im Code vorhanden (Rekord und Rang entfernt); Bauauftrag veraltet, Index „teilweise“ | Korrektur von Bauauftrag und Index (Koordinator) | Analyse A |
| GEM-8 | mathe-entdecker | committet; „Reihen legen“ gebaut | Fragen 13, 18, 22, 53, 65, 66, 67; A7 | „Toll gerechnet!“ (13), Stern in Frage m16 (66) |
| GEM-13 | erzaehl-bruecke | committet | Fragen 53 bis 56, 62, 65 bis 67; A11 | Sternchen vor einem Ziel ohne Erklärung (A11) |
| GEM-14 | grammatik-zwerge | Ausbau offen | Fragen 14, 20, 54, 57, 62 | Stern-Emoji als Lob (20) |
| GEM-16 | design-entdecker | Ausbau offen | Fragen 20, 54, 56, 62 | Stern-Emoji bei richtiger Antwort (20) |
| GEM-19 | geschichten-wender | Ausbau offen | Fragen 36, 53, 55, 58, 62; A18 | Altersgruppe 8 bis 12 gegen 5 bis 7 (55) |
| CON-1 | stark-und-gesund | Ausbau offen | Fragen 50 bis 53, 62, 64 | Analyse B nennt eine fehlende Migrationszeile; das ist falsch (Abschnitt 6) |
| CON-4 | deutschland-kompass | Arbeitsstand unkommittiert, npm test grün (42 Tests) | Fragen 68 und 69 (Commit), 51, 53, 65, 66 | dieselbe App wie KIN-18 (Gruppe A) |
| CON-7 | herkunftssprachen-bruecke | Ausbau offen | Fragen 53, 55, 64 | Analyse B: bis zur Entscheidung nicht ändern |

## 3. Befunde über den Bestand

### 3.1 Pflicht-Testdatei und Testskript

Die 62 Einheiten betreffen 58 Apps. Mehrere Einheiten teilen sich eine App (zum Beispiel KIN-18 und CON-4 bei deutschland-kompass). Ohne `test/regeln.test.mjs` sind 33 Apps, ohne Skript `test` in `package.json` (dann bricht `npm test` ab) sind 34 Apps. Die Analysen zählten je Gruppe 14, 12 und 9 Apps; maßgeblich ist die Zählung über alle 58 Apps durch den Koordinator. Die Listen:

Ohne `test/regeln.test.mjs` (33): `rhythmus-orchester`, `nahrungsnetz-werkstatt`, `klang-detektive`, `sicher-unterwegs`, `grammatik-zwerge`, `design-entdecker`, `geschichten-wender`, `meilenstein-begleiter`, `bewegungs-kartei-erstes-jahr`, `erste-woerter-tagebuch`, `vorlese-kompass`, `selbststaendigkeits-leiter`, `kunst-gucken`, `wachstums-bewegungs-begleiter`, `schulanfang-spiel-navigator`, `elterngespraech-uebergang`, `gruppenklima-check`, `spielbegleiter-rollenspiel`, `bewegungs-richtwerte-3-5`, `musik-jahresplaner`, `mini-oper-baukasten`, `stark-und-gesund`, `herkunftssprachen-bruecke`, `bewegungs-schatzkiste`, `elternbrief-generator`, `familienschatz-reime`, `jahreszeiten-rad`, `tier-tanz-impulse`, `morgenkreis-wochenplaner-u3`, `aemtli-rad`, `mini-gaertner-begleiter`, `sprachbruecken-impulskarten`, `schwungblatt-generator`.

Ohne Testskript in `package.json` (34): `rhythmus-orchester`, `nahrungsnetz-werkstatt`, `klang-detektive`, `sicher-unterwegs`, `grammatik-zwerge`, `design-entdecker`, `geschichten-wender`, `meilenstein-begleiter`, `bewegungs-kartei-erstes-jahr`, `erste-woerter-tagebuch`, `vorlese-kompass`, `selbststaendigkeits-leiter`, `kunst-gucken`, `wachstums-bewegungs-begleiter`, `schulanfang-spiel-navigator`, `elterngespraech-uebergang`, `gruppenklima-check`, `spielbegleiter-rollenspiel`, `bewegungs-richtwerte-3-5`, `musik-jahresplaner`, `mini-oper-baukasten`, `kita-unterstuetzungs-navigator`, `stark-und-gesund`, `herkunftssprachen-bruecke`, `bewegungs-schatzkiste`, `elternbrief-generator`, `familienschatz-reime`, `jahreszeiten-rad`, `tier-tanz-impulse`, `morgenkreis-wochenplaner-u3`, `aemtli-rad`, `mini-gaertner-begleiter`, `sprachbruecken-impulskarten`, `schwungblatt-generator`.

Die SESSION-ANLEITUNG (Schritt 3) verlangt die Datei `test/regeln.test.mjs` für jede neue App und ihre Übernahme in jeden Ausbau. Ob der Bestand vorab nachzuziehen ist, ist Frage 81.

### 3.2 Lernziele in der README

51 von 58 Apps enthalten in der README das Wort „Lernziel“ nicht (Groß- und Kleinschreibung gleich). docs/02, Abschnitt 4, nennt die Angabe der Lernziele in der README; dort ist die Zielgruppe 8 bis 12 Jahre genannt. Ob der Punkt für die Apps der Praleska gilt, ist nicht entschieden (Frage 81).

### 3.3 Vermerk „keine Vorlese-Pflicht“ (Entscheidung 28а)

Nach den Analysen fehlt der Vermerk in den GDD dieser Werkzeuge für Erwachsene:

- ELT-4 bewegungs-kartei-erstes-jahr, ELT-8 puste-lauschspiel-kartei, ELT-9 vorlese-kompass, ELT-12 musik-alltags-begleiter, ELT-15 kunst-gucken. Der Koordinator hat geprüft: alle fünf richten sich laut README an Erwachsene. Die Wortfolge „Vorlese-Pflicht“ fehlt in den GDD aller fünf.
- CON-18 theater-zuhause-heft, PRI-5 bewegungslandschaft-stationen, PRI-7 fuehl-sortier-werkstatt (nach Analysen B und C).
- CON-2 baby-spielideen-kartei: die GDD nennt das Vorlesen als offen mit ungeklärtem Geltungsbereich.

Der Wortlaut der Vermerke weicht in den Apps ab („Vorlesen-Vermerk“, „nicht vorgesehen“). Deshalb ist die Liste nicht vollständig geprüft. Frage 75 nennt sechs andere Apps. Frage 83 führt die Entscheidung.

### 3.4 Emojis im Druck

Nach den Analysen (Lesen des Codes, nicht im Browser geprüft) stehen im Druck Emojis bei:

- PRI-15 mini-gaertner-begleiter: Überschriften im Pflanztagebuch-Druck,
- PRI-16 sprachbruecken-impulskarten: Situations-, Flaggen- und Taubenzeichen sowie das Titel-Emoji,
- PRI-19 schwungblatt-generator: Muster-Überschriften und Blatttitel.

Die SESSION-ANLEITUNG (Schritt 4) verbietet Emojis in Titeln und Überschriften im Druck. Die vorgesehene additive Lösung ist, sie mit der Klasse `nur-bildschirm` zu kennzeichnen und in `druck.css` auszublenden; der Text bleibt am Bildschirm. Frage 81.

### 3.5 Wertungsreste und verbotene Wörter

- mathe-entdecker: „Toll gerechnet!“ als Rundenlob (Frage 13); Stern als Gegenstand in Frage m16, Wort laut Regeln verboten (Frage 66).
- Stern-Emoji als Lob in grammatik-zwerge, design-entdecker und rhythmus-orchester (Frage 20).
- Wort „Stufe“ für Bildschirme oder Muster in GEM-13 und PRI-19 (Frage 66).

### 3.6 Fokus nach Klick

Die Messung mit `--alle-knoepfe` (Lauf 3, 29.10.2026, Auskunft, kein Tor) zeigt Fokusverluste bei Klicks ohne Kennung. Die Zahlen aus `docs/browser-alle-knoepfe-2026-10-29.json` (Koordinator geprüft): Fokusverluste je Klicks ohne Kennung bei mini-gaertner-begleiter 90 von 91, jahreszeiten-rad 72 von 79, morgenkreis-wochenplaner-u3 64 von 64, sprachbruecken-impulskarten 11 von 14, schwungblatt-generator 9 von 10, tier-tanz-impulse 7 von 13, familienschatz-reime 3 von 4, aemtli-rad 3 von 5, mathe-entdecker 1 von 1. Ob die Messung als Verletzung des Tors gilt, ist offen (Fragen 67 und 72).

### 3.7 Wörtlich übernommene Stellen (Frage 78)

Die Prüfung `tools/wortgleich-pruefen.mjs` findet in den 62 Einheiten zwölf Apps mit 44 Fundstellen. Gruppe B nannte sechs Apps mit 28 Stellen; Gruppe A ergänzt drei Apps mit 11 Stellen, Gruppe C drei Apps mit fünf Stellen. Die Liste ohne Textwiedergabe steht in `docs/befund-woertlich-2026-10-29.md`.

| App | Fundstellen | Einheit(en) |
|---|---|---|
| `bewegungs-richtwerte-3-5` | 17 | KIT-17 |
| `kunst-gucken` | 6 | ELT-15 |
| `spielbegleiter-rollenspiel` | 4 | KIT-15 |
| `bewegungs-kartei-erstes-jahr` | 3 | ELT-4 |
| `erste-kuenstler` | 3 | ELT-16, PRI-12 |
| `elterngespraech-uebergang` | 2 | ELT-21 |
| `puste-lauschspiel-kartei` | 2 | ELT-8 |
| `sport-schnupper-stationen` | 2 | PRI-18 |
| `werkstatt-karten-applikation` | 2 | PRI-17 |
| `kindertaenze-europa` | 1 | CON-11 |
| `morgenkreis-wochenplaner-u3` | 1 | PRI-12, PRI-13 |
| `musik-jahresplaner` | 1 | KIT-21 |
| **Summe** | **44** | 12 Apps |

### 3.8 Bauaufträge, Index und Register

- Der Bauauftrag beschreibt den Vorzustand (nach Analysen): KIN-17, GEM-10, GEM-22, KIT-4, KIT-14, CON-2, CON-11, CON-12, PRI-7, PRI-9, PRI-10, PRI-14.
- Der Index vom 27.10 führt CON-2, CON-5, CON-11 und CON-12 als „neu bauen“, obwohl die Apps existieren (Analyse B). PRI-7 steht im Index als „neu bauen“; ob ausbauen oder neu bauen, ist Frage 59.
- KIN-17, GEM-8 und GEM-13 sind committet, der Index führt sie als „teilweise“. Das ist in `docs/analyse-plaene-18-10-und-27-10.md`, Abschnitt 7, Punkt 4, schon als Aufgabe des Koordinators genannt.
- Entschiedene Punkte stehen in Bauaufträgen als offen (nach Analyse B: Speicherung 30б, Eingaben für Erwachsene in KIT-4).
- Testzahlen in Bauaufträgen und README weichen von `npm test` ab (nach Analyse A: GEM-10 nennt 29, npm test zeigt 34; ELT-8 nennt 42, npm test zeigt 44).
- `docs/erwachsenen-apps.json` führt `aemtli-rad` als „ohne Kinderdaten“. Die App speichert Vornamen oder Spitznamen von Kindern lokal und druckt den Wochenplan mit diesen Namen (vom Koordinator geprüft). Frage 82.

### 3.9 Seitenangaben und Zitate

Die Analysen haben Seitenangaben und Zitate nicht gegen die Textkopie geprüft, außer Frage 78 und ELT-21 (Analyse B). Die Textkopie ist außerhalb des Repos mit `tools/quelle-holen.sh` zu erzeugen (SESSION-ANLEITUNG, Schritt 1). Vor jedem Ausbau ist diese Prüfung nachzuholen. Die Seitenangaben in den Analysen sind darum nur als Angaben der Analysen zu lesen.

## 4. Entscheidungen, auf die die Einheiten warten

Die Zuordnung ist eine Stichwortsuche in den Analysen: Eine Nummer steht bei einer Einheit, wenn die Analyse sie dort nennt. Sie ist kein Ersatz für die Prüfung der Einheit.

| Frage | Thema | Einheiten (Anzahl) |
|---|---|---|
| Frage 13 | Lob am Rundenende („Toll gerechnet!“ u. a.) | GEM-8 (1) |
| Frage 14 | Dreistufige Rückmeldung | GEM-14 (1) |
| Frage 18 | Texte des Motors quiz-kern | GEM-8 (1) |
| Frage 20 | Stern-Emoji als Lob in Rückmeldungen | KIN-7, GEM-14, GEM-16 (3) |
| Frage 22 | Fokus nach Wechsel des Bildschirms (Motor) | GEM-8, PRI-9 (2) |
| Frage 24 | Seitenmarke auf Mehrseitendruck | KIT-21, KIT-25, KIT-27, PRI-3 (4) |
| Frage 27 | Feld `quelle.geprueft: true` | ELT-6, ELT-16, ELT-17, ELT-19, ELT-21, KIT-12, KIT-14, KIT-15, KIT-17, PRI-12, PRI-13 (11) |
| Frage 36 | Länge der GDD | GEM-19 (1) |
| Frage 50 | Wertungsreste entfernen (Stufe 2) | CON-1 (1) |
| Frage 51 | Ränge | KIN-17, GEM-3, GEM-7, CON-1, CON-4 (5) |
| Frage 52 | Gesundheitsaussagen (CON-1) | CON-1 (1) |
| Frage 53 | Sprachen uk und ru | KIN-7, KIN-11, KIN-17, GEM-3, GEM-7, GEM-8, GEM-13, GEM-19, ELT-2, ELT-4, ELT-6, ELT-9, ELT-12, ELT-13, ELT-15, ELT-16, ELT-17, ELT-19, ELT-21, KIT-12, CON-1, CON-2, CON-4, CON-5, CON-7, CON-8, CON-11, CON-12, CON-14, CON-18, CON-19, PRI-3, PRI-7, PRI-9, PRI-10, PRI-12, PRI-13, PRI-14, PRI-16, PRI-17, PRI-19 (41) |
| Frage 54 | Engine für die Ausbauten | KIN-17, GEM-13, GEM-14, GEM-16, ELT-6 (5) |
| Frage 55 | Altersgruppen | GEM-13, GEM-19, CON-7, CON-19, PRI-9, PRI-10, PRI-13 (7) |
| Frage 56 | Bilder (GEM-13, GEM-16) | GEM-13, GEM-16 (2) |
| Frage 57 | Begriffe in GEM-14 | GEM-14 (1) |
| Frage 58 | Abweichungen in GEM-19 | GEM-19 (1) |
| Frage 59 | PRI-7: Ausbau oder Neubau | GEM-3, PRI-7 (2) |
| Frage 60 | CON-12 Puppentheater-Werkstatt | CON-12 (1) |
| Frage 62 | Zitatgrenze (A10 b) | GEM-10, GEM-13, GEM-14, GEM-16, GEM-19, GEM-22, ELT-21, KIT-3, KIT-4, KIT-12, KIT-14, KIT-15, KIT-17, KIT-21, KIT-25, KIT-27, CON-1, CON-2, CON-11 (19) |
| Frage 64 | Freigabe der Ausbauten | CON-1, CON-7 (2) |
| Frage 65 | Zufall im Bestand (GEM-13) | KIN-18, GEM-8, GEM-13, CON-4, PRI-9 (5) |
| Frage 66 | Wort „Stufe“ und Sterne im Bestand | GEM-8, GEM-13, ELT-12, ELT-13, CON-4, PRI-9, PRI-19 (7) |
| Frage 67 | Fokus nach Klick im Bestand | GEM-8, GEM-13 (2) |
| Frage 68 | CON-4: Umfang des Modus | KIN-18, CON-4 (2) |
| Frage 69 | Testzahl-Regel (CON-4) | CON-4 (1) |
| Frage 74 | CON-16: Art des Ergebnisses | CON-16 (1) |
| Frage 75 | Zielgruppe der Apps mit Vorlesefunktion (28а) | PRI-14 (1) |
| Frage 76 | Altersangabe tier-tanz-impulse | PRI-11 (1) |
| Frage 78 | Wörtlich übernommene Stellen | ELT-4, ELT-8, ELT-15, ELT-16, ELT-21, KIT-15, KIT-17, KIT-21, CON-11, PRI-12, PRI-13, PRI-17, PRI-18 (13) |
| A7 | quiz-kern (laut Dokumenten erledigt) | GEM-8 (1) |
| A10 | Text der Pralęska im Repo (Datei auf main) | KIT-21 (1) |
| A11 | Lesart widersprüchlicher Quellenstellen | GEM-10, GEM-13, PRI-18 (3) |
| A18 | Standard für Seitenangaben auf Druckblättern (offen) | KIN-7, KIN-11, GEM-3, GEM-7, GEM-10, GEM-19, GEM-22, ELT-2, ELT-4, ELT-8, ELT-12, ELT-13, ELT-15, ELT-16, ELT-17, ELT-19, ELT-21, KIT-4, KIT-12, KIT-14, KIT-15, KIT-17, KIT-21, KIT-25, KIT-27, CON-2, CON-4, CON-5, CON-8, CON-11, CON-12, CON-14, CON-18, CON-19, PRI-2, PRI-3, PRI-4, PRI-5, PRI-7, PRI-12, PRI-13, PRI-14, PRI-15, PRI-16, PRI-17, PRI-18 (46) |
| A19 | Katalogtext Erfolgs-Momente (entschieden 27.10) | PRI-2 (1) |
| A20 | Altersbereich PRI-7 | PRI-7 (1) |
| Entscheidung 30б | Speicherung (laut Analyse B entschieden, im Bauauftrag offen) | KIN-11 (1) |

Frage 49 (Reihenfolge der Stufe 3) und Frage 64 (Freigabe) betreffen alle 53 Einheiten der Stufe 3 und stehen deshalb in keiner Zeile.

## 5. Vorschlag für die nächsten Schritte (nicht ausgeführt)

1. Max entscheidet die Fragen 81 bis 83. Für Stufe 2 fehlen die Entscheidungen 50 bis 60 (nach Frage 64, Option a) sowie 68 und 69; danach kann Stufe 2 abgeschlossen werden. Frage 49 (Reihenfolge) und Frage 64 (Freigabe) entscheiden über Stufe 3.
2. Koordinator, ohne Entscheidung und additiv: datierte Anmerkungen in den Bauaufträgen mit veraltetem Stand (Abschnitt 3.8), Korrektur des Index für KIN-17, GEM-8 und GEM-13 über `tools/bauauftrag-index.mjs`, Anmerkungen zu den Testzahlen.
3. Wenn Max Frage 81 a) zustimmt: additive Druckkorrektur bei PRI-15, PRI-16 und PRI-19 (Klasse `nur-bildschirm`, `druck.css`), je App ein Schreiber und ein unabhängiger Prüfer, der Koordinator committet.
4. Stufe 2 abschließen, sobald die Entscheidungen da sind. CON-4 committet der Koordinator erst nach den Fragen 68 und 69.
5. Stufe 3 erst nach Freigabe. Je Einheit: vorab Bauauftrag aktualisieren, Textkopie prüfen (Seiten und Zitate), dann Schreiber und Prüfer getrennt, Koordinator committet. Löschungen gibt es nicht; Änderungen sind additiv.

## 6. Prüfung durch den Koordinator

Geprüft (eigene Lesung oder Befehl):

- Frage 59 ist offen (`docs/fragen-fuer-max-2026-10-28.md`); die ★-Empfehlung „Ausbau“ ist keine Entscheidung.
- `aemtli-rad`: Speicherung im localStorage mit Löschknopf („Klassenliste löschen“), Wochenplan-Druck mit `window.print`, Registereintrag „ohne Kinderdaten“.
- Zählungen über die 58 Apps: 33 ohne `test/regeln.test.mjs`, 34 ohne Testskript, 51 ohne das Wort „Lernziel“ in der README.
- Frage 78: zwölf Apps mit 44 Fundstellen (Zuordnung über `docs/befund-woertlich-2026-10-29.md`).
- Fokusverluste: Zahlen aus `docs/browser-alle-knoepfe-2026-10-29.json` stimmen mit den Analysen überein.
- Fragen 13 und 20 im Dokument: Wortlaut stimmt mit der Analyse überein.
- PRI-19: die GDD (Zeile 25) erwähnt eine Namenszeile; der Code druckt keine (`app.mjs`, Zeile 42). Das ist ein Widerspruch in der Dokumentation und braucht eine Klärung.

Korrigiert:

- Analyse B nennt bei CON-1 eine fehlende Migrationszeile für den alten Schlüssel `sug.rekord`. Das ist falsch: Die Entfernung steht im Motor `packages/quiz-kern/src/quiz.mjs` (Zeilen 56 bis 58, mit Test in `quiz.test.mjs`, Zeile 76). Die App ruft den Motor mit dem Schlüssel auf; die Zeile in `app.mjs` (Zeile 15) ist die Konfiguration.
- Analyse B nennt bei Frage 78 sechs Apps mit 28 Stellen. Über alle 62 Einheiten sind es zwölf Apps mit 44 Stellen (Abschnitt 3.7).
- Der Vermerk 28а fehlt laut Analysen bei weiteren Apps, als Frage 75 nennt (Abschnitt 3.3).

Nicht geprüft:

- die Druckinhalte (Emojis, Namenszeile) außer dem Hinweis zu PRI-19 (Lesen des Codes, nicht im Browser),
- die Pflichtmarkierung auf den Tätigkeitskarten von PRI-2,
- die Lücken-Listen und die Fachprüfungs-Punkte je Einheit (sie stehen in der JSON-Datei),
- der Abgleich des CON-4-Arbeitsstands mit `/mnt/session/outputs/con4-arbeitsstand.tgz` (Analyse B).

## 7. Grenzen

- Drei Analysen, je eine Gruppe. Die Analysen haben Dateien gelesen und `npm test` nur lesend in den App-Ordnern ausgeführt. Keine Commits, keine Änderung im Repo; der Koordinator hat den Stand von `git status` geprüft (nur der unkommittierte Arbeitsstand von CON-4 ist geändert).
- Keine neue Browser-Messung. Die Messungen stammen aus Lauf 3.
- Der Stand der Analysen ist der Stand von `d8058fc` und `9d939f7`.

## 8. Alle 62 Einheiten (Übersicht)

Die Spalte „Verweise“ nennt Fragen als F, Anmerkungen A und Entscheidungen E. Die Zeile „erste Teilarbeit“ ist gekürzt; die vollständige Liste steht in der JSON-Datei.

| Kennung | App | Stufe | Empfehlung | Verweise (Analyse) | Teilarbeiten | erste Teilarbeit |
|---|---|---|---|---|---|---|
| KIN-7 | rhythmus-orchester | 3 | teilweise sofort | F20, F53, A18 | 4 | Testskript in package.json ergänzen (node --test test/*.test.mjs); Testzahl in README und GD … |
| KIN-11 | nahrungsnetz-werkstatt | 3 | teilweise sofort | F53, A18, E30б | 5 | test/regeln.test.mjs nach der Vorlage puppentheater-werkstatt anlegen |
| KIN-17 | uhr-und-kalender-kind | 2 | Bauauftrag veraltet | F51, F53, F54 | 3 | Bauauftrag KIN-17 an den HEAD-Stand anpassen (Abschnitte 3, 6, 7 und 9: Rekord, Rang, Speich … |
| KIN-18 | deutschland-kompass | 3 | teilweise sofort | F65, F68 | 4 | test/regeln.test.mjs und Testskript im HEAD anlegen; erst nach Abstimmung mit dem CON-4-Arbe … |
| GEM-3 | klang-detektive | 3 | teilweise sofort | F51, F53, F59, A18 | 6 | Instrumentenfrage nach Abschnitt 5 (instrumentFrage) bauen, mit mindestens zwei Klangfarben |
| GEM-7 | sicher-unterwegs | 3 | teilweise sofort | F51, F53, A18 | 4 | Szenarien zu Augenschutz und zum Verlassen des Geländes nach Abschnitt 3 anlegen, mit Quelle … |
| GEM-8 | mathe-entdecker | 2 | wartet auf Entscheidung | F13, F18, F22, F53, F65, F66, F67, A7 | 2 | Bauauftrag GEM-8 an den HEAD-Stand anpassen (A7 erledigt, Reihen legen gebaut, Testdateien v … |
| GEM-10 | kita-kartograph | 3 | Bauauftrag veraltet | F62, A11, A18 | 3 | Bauauftrag GEM-10 an den HEAD-Stand anpassen (Druck, Speicher mit Löschknopf nach Entscheidu … |
| GEM-13 | erzaehl-bruecke | 2 | wartet auf Entscheidung | F53, F54, F55, F56, F62, F65, F66, F67, A11 | 3 | Liste mit Modellnamen aus test/regeln.test.mjs (Z. 237 bis 238) entfernen oder umformulieren |
| GEM-14 | grammatik-zwerge | 2 | wartet auf Entscheidung | F14, F20, F54, F57, F62 | 1 | Nur Vorbereitung ohne App-Änderung: Quellenstellen S. 141 und 142 prüfen; Test-Entwürfe auße … |
| GEM-16 | design-entdecker | 2 | wartet auf Entscheidung | F20, F54, F56, F62 | 1 | Nur Vorbereitung ohne App-Änderung: Quellenstellen S. 176 bis 178 prüfen; Test-Entwürfe auße … |
| GEM-19 | geschichten-wender | 2 | wartet auf Entscheidung | F36, F53, F55, F58, F62, A18 | 1 | Nur Vorbereitung ohne App-Änderung: Muster-Quelle „Uther 2004“ prüfen; Test-Entwürfe außerha … |
| GEM-22 | mess-labor | 3 | Bauauftrag veraltet | F62, A18 | 2 | Bauauftrag GEM-22 an den HEAD-Stand anpassen (Lupe und Lineal gebaut, Druck-CSS vorhanden, T … |
| ELT-2 | meilenstein-begleiter | 3 | teilweise sofort | F53, A18 | 3 | test/regeln.test.mjs nach der Vorlage anlegen; Testskript in package.json; Testzahl in READM … |
| ELT-4 | bewegungs-kartei-erstes-jahr | 3 | teilweise sofort | F53, F78, A18 | 4 | Druckfassung messen: jede übernommene Karte vollständig auf dem Blatt; Druckregeln (keine Ze … |
| ELT-6 | erste-woerter-tagebuch | 3 | teilweise sofort | F27, F53, F54 | 4 | Hinweis „Keine Namen von Kindern eingeben.“ an die Eingabefelder setzen |
| ELT-8 | puste-lauschspiel-kartei | 3 | wartet auf Fachprüfung | F78, A18 | 3 | Lernziele aus Abschnitt 2 als Liste in die README |
| ELT-9 | vorlese-kompass | 3 | teilweise sofort | F4, F7, F53 | 4 | test/regeln.test.mjs nach der Vorlage anlegen; Testskript in package.json; Testzahl in READM … |
| ELT-12 | musik-alltags-begleiter | 3 | wartet auf Entscheidung | F53, F66, A18 | 3 | Lernziele aus Abschnitt 2 als Liste in die README |
| ELT-13 | selbststaendigkeits-leiter | 3 | teilweise sofort | F53, F66, A18 | 4 | test/regeln.test.mjs anlegen (Druck ohne Stufen und Zeichen, kein externer Abruf, kein Einga … |
| ELT-15 | kunst-gucken | 3 | teilweise sofort | F53, F78, A18 | 4 | Knopfgrößen im Browser messen; Knöpfe unter 48 px anheben, soweit es Knöpfe und nicht Links … |
| ELT-16 | erste-kuenstler | 3 | wartet auf Entscheidung | F27, F53, F78, A18 | 3 | Bauauftrag-Abschnitte 6, 8 und 9 aktualisieren: Favicon ist erledigt, die Pflichtmarke ist i … |
| ELT-17 | wachstums-bewegungs-begleiter | 3 | teilweise sofort | F27, F53, A18 | 4 | Skript test in package.json ergänzen und test/regeln.test.mjs nach der Vorlage anlegen (Druc … |
| ELT-19 | schulanfang-spiel-navigator | 3 | teilweise sofort | F4, F27, F53, A18 | 3 | Skript test in package.json ergänzen; test/regeln.test.mjs nach der Vorlage anlegen. |
| ELT-21 | elterngespraech-uebergang | 3 | teilweise sofort | F27, F53, F62, F78, A18 | 4 | Skript test in package.json ergänzen; test/regeln.test.mjs nach der Vorlage anlegen (Druckbl … |
| KIT-3 | gruppenklima-check | 3 | teilweise sofort | F62 | 3 | Auswertung (Bericht, Status, Zurücksetzen) nach logik.mjs auslagern; test/logik.test.mjs anl … |
| KIT-4 | kita-wochenplaner | 3 | Bauauftrag veraltet | F62, A18 | 3 | Bauauftrag-Abschnitte 6 und 9 an die Entscheidung KIT-4 vom 18.10 angleichen: Speicher mit L … |
| KIT-12 | musikspiele-kartei-u3 | 3 | wartet auf Entscheidung | F27, F53, F62, A18 | 2 | Bauauftrag-Abschnitte 6, 7 und 9 aktualisieren: test/regeln.test.mjs ist vorhanden; die Knop … |
| KIT-14 | natur-fuersorge-karten | 3 | Bauauftrag veraltet | F27, F62, A18 | 2 | Bauauftrag Abschnitt 9 aktualisieren: das Protokoll ist entschieden (nicht bauen), die Wortl … |
| KIT-15 | spielbegleiter-rollenspiel | 3 | teilweise sofort | F27, F62, F78, A18 | 3 | test/regeln.test.mjs nach der Vorlage anlegen; Skript test in package.json ergänzen. |
| KIT-17 | bewegungs-richtwerte-3-5 | 3 | teilweise sofort | F27, F62, F78, A18 | 3 | Schema angleichen: seite und zitat unter quelle führen und das Feld eigenentwurf setzen, ohn … |
| KIT-21 | musik-jahresplaner | 3 | teilweise sofort | F24, F62, F78, A10, A18 | 3 | test/regeln.test.mjs nach der Vorlage anlegen; Skript test ergänzen. |
| KIT-25 | mini-oper-baukasten | 3 | teilweise sofort | F24, F62, A18 | 3 | test/regeln.test.mjs nach der Vorlage anlegen; Skript test ergänzen. |
| KIT-27 | kita-unterstuetzungs-navigator | 3 | teilweise sofort | F24, F62, A18 | 2 | Skript test in package.json ergänzen, damit npm test die 37 Tests ausführt. |
| CON-1 | stark-und-gesund | 2 | wartet auf Entscheidung | F50, F51, F52, F53, F62, F64 | 4 | Bis zur Entscheidung 51 und 52 nichts an der App ändern; vorbereitend nur test/logik.test.mj … |
| CON-2 | baby-spielideen-kartei | 3 | Bauauftrag veraltet | F53, F62, A18 | 2 | Bauauftrag korrigieren: ‚App leistet schon: keine‘, ‚Ziel: neue App‘, die Angabe zu fehlende … |
| CON-4 | deutschland-kompass | 2 | wartet auf Entscheidung | F51, F53, F65, F66, F68, F69, A18 | 2 | Keine Änderung an der Arbeitskopie vor den Entscheidungen 68 und 69; danach der Commit durch … |
| CON-5 | tierkinder-vorlesen | 3 | teilweise sofort | F53, A18 | 2 | pruefeBausteine (neu) mit Test anlegen: jeder Baustein hat eine Quelle im Bereich S. 113–114 … |
| CON-7 | herkunftssprachen-bruecke | 2 | wartet auf Entscheidung | F53, F55, F64 | 3 | Bis zur Entscheidung 53 und 55 nichts an der App ändern; vorbereitend test/logik.test.mjs un … |
| CON-8 | bewegungs-schatzkiste | 3 | wartet auf Entscheidung | F53, A18 | 2 | Felder quelle und eigenentwurf je Eintrag ergänzen (Quelle S. 165 oder S. 170, sonst Eigenen … |
| CON-11 | kindertaenze-europa | 3 | Bauauftrag veraltet | F53, F62, F78, A18 | 3 | Schema an den Bauauftrag angleichen (herkunft, quelle.seite, eigenentwurf je Eintrag), ohne … |
| CON-12 | puppentheater-werkstatt | 3 | Bauauftrag veraltet | F53, F60, A18 | 2 | Bauauftrag Abschnitt 2, 3 und 5 an den Ist-Stand anpassen: Vorlesen ist für diese Erwachsene … |
| CON-14 | elternbrief-generator | 3 | teilweise sofort | F53, A18, E18 | 3 | Druckfunktionen druckText (ohne Emoji, ohne Namenszeile, Kopf nur mit Einrichtungs- und Grup … |
| CON-16 | — | 3 | wartet auf Entscheidung | F74 | 0 | — |
| CON-18 | theater-zuhause-heft | 3 | teilweise sofort | F53, A18 | 3 | Druckknopf an druckeHeft/pruefeMarkierung anschließen; den betroffenen Test in regeln.test.m … |
| CON-19 | rhythmus-orchester | 3 | teilweise sofort | F53, F55, A18 | 1 | test/regeln.test.mjs nach der Vorlage puppentheater-werkstatt anlegen; test-Skript in packag … |
| PRI-2 | erfolgs-momente-kartei | 3 | teilweise sofort | A18, A19, E23а | 2 | Pflichtmarkierung (Wortlaut laut Bauauftrag Abschnitt 6) in die Fußzeile jeder Tätigkeitskar … |
| PRI-3 | familienschatz-reime | 3 | teilweise sofort | F24, F53, A18 | 2 | Hinweis „Keine Namen von Kindern eingeben.“ an Titel- und Textfeld setzen |
| PRI-4 | entdecker-karten-natur | 3 | teilweise sofort | A18 | 1 | GDD Z. 57 korrigieren: Favicon ist eingebunden (index.html Z. 9), kein 404 |
| PRI-5 | bewegungslandschaft-stationen | 3 | wartet auf Fachprüfung | A18 | 1 | GDD und README um den Vorlesen-Vermerk nach 28а ergänzen (Werkzeug für Fachkräfte, keine Vor … |
| PRI-7 | fuehl-sortier-werkstatt | 3 | Bauauftrag veraltet | F53, F59, A18, A20 | 3 | GDD Z. 82 und README Z. 102 korrigieren: Favicon ist eingebunden, die Seite liefert kein 404 |
| PRI-9 | mathe-entdecker | 3 | Bauauftrag veraltet | F22, F53, F55, F65, F66 | 1 | Bauauftrag an den Stand vom 28.10 angleichen: keine Punkte, kein Rekord, keine Ränge im Best … |
| PRI-10 | jahreszeiten-rad, uhr-und-kalender-kind | 3 | Bauauftrag veraltet | F53, F55 | 2 | jahreszeiten-rad: test/regeln.test.mjs anlegen und ein test-Skript in package.json ergänzen |
| PRI-11 | tier-tanz-impulse | 3 | teilweise sofort | F76 | 2 | test/regeln.test.mjs (Pflicht) anlegen und ein test-Skript in package.json ergänzen |
| PRI-12 | erste-kuenstler, morgenkreis-wochenplaner-u3 | 3 | wartet auf Entscheidung | F27, F53, F78, A18 | 1 | Bauauftrag korrigieren: erste-kuenstler hat 43 Tests (README Z. 102), nicht 21; die Angabe E … |
| PRI-13 | morgenkreis-wochenplaner-u3 | 3 | teilweise sofort | F27, F53, F55, F78, A18 | 1 | test/regeln.test.mjs anlegen (Projektregeln) und ein test-Skript in package.json ergänzen |
| PRI-14 | tischdienst-trainer, aemtli-rad | 3 | Bauauftrag veraltet | F53, F75, A18 | 1 | Eintrag aemtli-rad in docs/erwachsenen-apps.json korrigieren: die App ist eine Schul-App mit … |
| PRI-15 | mini-gaertner-begleiter | 3 | teilweise sofort | A18 | 3 | Im Pflanztagebuch-Druck die Emoji-Überschriften entfernen (app.mjs Z. 98 Überschrift mit Emo … |
| PRI-16 | sprachbruecken-impulskarten | 3 | teilweise sofort | F53, A18 | 2 | Im Druck keine Emojis: Situations-Emoji (app.mjs Z. 21), Flaggen-Emoji (Z. 23), Taube (Z. 24 … |
| PRI-17 | werkstatt-karten-applikation | 3 | teilweise sofort | F53, F78, A12, A18 | 2 | Quellenhinweis „Zeile 483“ auf „Zeile 489“ korrigieren: README Z. 9, daten/karten.json Z. 4, … |
| PRI-18 | sport-schnupper-stationen | 3 | teilweise sofort | F78, A11, A18 | 2 | Browser-Abnahme (360 px) und Druckvorschau messen; Abweichungen beheben |
| PRI-19 | schwungblatt-generator | 3 | teilweise sofort | F53, F66 | 6 | Emojis aus dem Druckblatt entfernen: Muster-Überschriften (app.mjs Z. 38) und der Blatttitel … |

Seitenangaben in diesem Dokument: Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
