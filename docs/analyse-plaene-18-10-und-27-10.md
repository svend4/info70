# Analyse: Plan vom 18.10.2026 und Plan vom 27.10.2026 (Stand 28.10.2026)

Dieses Dokument ist ein Nachtrag. Es ändert keine der beiden Pläne und löscht nichts. Quellen: `docs/plan-praleska-umsetzung.md`
(18.10), `docs/plan-neue-welle.md` (27.10), `docs/bauauftraege/index.json` (Stand 27.10), die Bauaufträge
`docs/bauauftraege/<Kennung>-*.md` und der Bestand der Apps im Repo. Jede Einheit der beiden Pläne, die noch nicht fertig war,
ist mit Index, Bauauftrag und Bestand abgeglichen. Die Fragen an Max stehen als Nachtrag „З“ in
`docs/fragen-fuer-max-2026-10-28.md` (Nummern 48 ff.).

## 1. Zahlen: Index gegen Bestand

- Index (27.10): 131 Einheiten der Gruppe 2 · gebaut 63 · teilweise 62 · offen 0 · unklar 3 · nicht bauen 3.
- Plan 18.10: gebaut 53 · teilweise 57 · offen 11 · unklar 3 · nicht bauen 3 (und 4 Varianten A innerhalb „gebaut“).
- Plan 27.10 (Kopfzeile, Stand vor Lauf E): gebaut 59 · teilweise 62 · offen 4 · unklar 3 · nicht bauen 3. Die vier offenen sind CON-3, CON-6, CON-9 und CON-10; sie sind seit Stufe 1 gebaut. Damit gilt der Index: gebaut 63, offen 0.
- Veraltet im Index (Bestand geprüft):
  - CON-18 „Theater zuhause“: Status „teilweise“, App `theater-zuhause-heft` gebaut (59 Tests, Druckprüfung, Commit `30fc97a`).
  - CON-12: Index-Feld `app` leer, obwohl `apps/puppentheater-werkstatt/` gebaut ist (40 Tests). Korrektur durch den Koordinator.
    **Nachprüfung 28.10:** Diese Angabe stimmt nicht. Im committeten Index (`docs/bauauftraege/index.json`) ist das Feld `app` für CON-12 gesetzt (`puppentheater-werkstatt`). Veraltet sind Status „teilweise“ und der nächste Schritt „neu bauen (Welle)“.
  - CON-16: Index-Feld `app` leer; die Einheit ist „Konzept-Mapping“ und hat keinen App-Ordner. Das ist richtig, aber so zu lesen.
  - KIN-17: „teilweise“; am 28.10. ausgebaut (28 Tests, Commit `d4446a0`, lokal).
  - PRI-7: „teilweise“, App `fuehl-sortier-werkstatt` existiert (43 Tests); Entscheidung „Ausbau oder Neubau“ ist offen.

## 2. Abgleich Serie A (neue Apps) des Plans vom 18.10

| Welle / Einheit | Plan 18.10 | Stand am 28.10 | Was noch fehlt |
|---|---|---|---|
| Welle 92: CON-2, CON-5, CON-11 | gebaut | gebaut, Index „teilweise“ (Lücken offen) | Ausbau nach Stufe 3 |
| Welle 93: CON-12 Puppentheater-Werkstatt | Generator bauen | gebaut (`puppentheater-werkstatt`), Index „teilweise“ | Entscheidungen im Bauauftrag Abschnitt 9: Altersangabe 5–7, Vertep und Batleika belegen oder streichen, Eintrittskarten → „einladung“, uk und ru |
| Welle 93: CON-18 Theater zuhause | bauen | gebaut (`theater-zuhause-heft`) | Index aktualisieren; Ausbau-Lücken nach Stufe 3 |
| Welle 93: PRI-7 Fühl- und Sortier-Werkstatt | bauen (Druck, 2–3 Jahre) | App existiert (`fuehl-sortier-werkstatt`) | Entscheidung Ausbau oder Neubau; Altersangabe 2–3 (Katalog) gegen 1–3 (Quelle, A20); Sicherheitshinweise fachlich prüfen; Wörterliste de/uk/ru |
| Welle 94: PRI-8 Kleine Forscher ohne Bildschirm | bauen | gebaut (`kleine-forscher-ohne-bildschirm`, 49 Tests) | fachliche Prüfung der Sicherheitstexte (aus dem Index) |
| „Danach“: PRI-6 Frischluft-Rituale | nach Entscheidung | unklar, kein Bauauftrag | Entscheidung Max (Nachtrag, Frage 61) |
| „Danach“: CON-13 Trostvers-Generator | nach Entscheidung | unklar, kein Bauauftrag; personenbezogenes Datum (Kindernamen) | Entscheidung Max (Frage 61) |
| „Danach“: CON-15 Naturschutz-Rat | nach Entscheidung | unklar, kein Bauauftrag | Entscheidung Max (Frage 61) |
| Zurückgestellt (quiz-kern): CON-3, CON-6, CON-9, CON-10 | zurückgestellt | gebaut in Stufe 1 (Lauf E) | Fragen 31 und 44–47 (Abnahme) |
| Zurückgestellt: CON-17 Krippen-Portfolio, KIT-18, KIT-20 | nicht bauen | nicht bauen (Index) | keine |

Hinweis (28.10, Nachprüfung): Der Plan vom 18.10 widerspricht sich selbst. Die Tabelle in Abschnitt 6 führt CON-2, CON-5 und CON-11 als „offen“ (Zeilen 158, 161, 167). Der Text in Abschnitt 7 nennt Welle 92 „gebaut, geprüft, nachgebessert“ (Zeile 200). Die Zählung „offen 11“ in Abschnitt 1 folgt der Tabelle. Die Angabe „gebaut“ in der Tabelle oben folgt dem Text.

## 3. Abgleich Serie B, C und D des Plans vom 18.10

- **Serie B (Ausbau, 57 Einheiten).** 18.10: nach Altersstufen geordnet (zuerst Lücken 2–3 und 3–5). 27.10: aufgeteilt in
  Stufe 2 (neun Einheiten, die durch A7 entsperrt sind) und Stufe 3 (53 Einheiten, nach Faktenstand geordnet). **Unterschied:**
  Die Reihenfolge wechselt von Altersstufe zu Faktenstand.
- **Serie C (Faktencheck gebauter Apps).** 18.10: 53 Einheiten, drei bis fünf Apps pro Welle. 27.10: nicht eingeplant. Der
  Faktencheck ist nur noch Tor für neue Apps und Ordnungskriterium in Stufe 3. **Lücke:** Die Faktenprüfung der bereits gebauten
  Apps hat keinen Termin mehr. Frage an Max (Nachtrag, Frage 48).
- **Serie D (Statuszeilen in docs/10).** 18.10: je Abschnitt zwei Zeilen. 27.10: nicht erwähnt. Frage an Max (Nachtrag, Frage 48).

## 4. Was der Plan vom 27.10 neu regelt

- **Tore für jede neue App oder Erweiterung** (Abschnitt 3): kein Kind wird bewertet; Speicherregel; Berührziele 48 px und
  360 px; Quiz-Durchlauf; Druck; Fakten mit Quelle oder Vermerk; Vorlesen; Seitenmarke; keine Modellnamen, keine fremden Adressen,
  keine Zitate über sechs Wörter. Der 18.10-Plan kannte diese Tore nicht in dieser Form.
- **Ablauf** (Abschnitt 4): ein Schreiber und ein unabhängiger Prüfer je Auftrag, höchstens acht Agenten gleichzeitig, der
  Integrator committet allein. Der 18.10-Plan beschrieb nur einen Zyklus je App.
- **Entscheidungen vor Stufe 1** (Abschnitt 5): quiz-kern oder eigene Apps. Antwort: eigene Karten-Apps (Lauf E); Engine-Wahl
  bleibt offen (Frage 31).

## 5. Wo die Pläne auseinandergehen (Zusammenfassung)

1. **Welle 93 und 94.** 18.10: PRI-7, CON-12, CON-18 und PRI-8 sind die nächsten Apps. 27.10: PRI-8 ist gebaut und nicht mehr in
   einer Welle; CON-12, CON-18 und PRI-7 gehören zu den 53 Ausbau-Einheiten der Stufe 3.
2. **quiz-kern.** 18.10: vier Content-Packs zurückgestellt. 27.10: gebaut (Stufe 1). A7 hat die Blockade aufgehoben.
3. **Ausbau-Reihenfolge.** 18.10: Altersstufen. 27.10: entsperrte Apps zuerst (Stufe 2), dann Faktenstand (Stufe 3).
4. **Serie C und D** fehlen im Plan vom 27.10.
5. **Tore und Ablauf** sind im Plan vom 27.10 neu und verbindlicher.
6. **Blockierende Entscheidungen.** 18.10 (Abschnitt 5): quiz-kern (erledigt durch A7), A18 Seitenmarke (offen),
   Katalogtext A19 (offen), Beobachtungsbögen A13 (nicht bauen), Trostvers (offen). 27.10 (Abschnitt 5): quiz-kern für die vier
   Packs (beantwortet: eigene Apps), drei unklare Aufträge (offen).

## 6. Stufe 2 (Plan vom 27.10): Stand am 28.10

| Einheit | App | Stand | Begründung |
|---|---|---|---|
| KIN-17 | uhr-und-kalender-kind | fertig, lokal committet (`d4446a0`), nicht gepusht | Token für den Push fehlt |
| GEM-8 | mathe-entdecker | Ausbau in Arbeit (Mini-Simulator „Reihen legen“, Themen, Tests) | Brief `docs/arbeitsweise/briefs/stufe-2-ausbau.md` |
| GEM-13 | erzaehl-bruecke | Ausbau in Arbeit (Weil-Satz-Impulse prüfen und ergänzen) | ebenda |
| CON-4 | deutschland-kompass | Ausbau in Arbeit (Modus Stufenfolge); Punktzähler bleibt bis zur Löschfreigabe | ebenda; Freigabe braucht Löschung |
| GEM-14 | grammatik-zwerge | blockiert durch Entscheidungen | Katalogtext „hinter“, Sternchen (A11), Fachprüfung, Engine |
| GEM-16 | design-entdecker | blockiert durch Entscheidungen | Bildmaterial und Bildrechte, Engine |
| GEM-19 | geschichten-wender | blockiert durch Entscheidungen | Altersgruppe 8–12 gegen 5–7, Name, „fröhliches Ende“, Erzeugerfunktion, uk und ru |
| CON-1 | stark-und-gesund | blockiert durch Löschung und Fakten | Rekord und Ränge im Bestand (Empfehlung: entfernen), Ränge im Katalog, Gesundheitsfakten unbelegt, Test mit Kindern |
| CON-7 | herkunftssprachen-bruecke | blockiert durch Löschung und Entscheidungen | Punkte, Rang und Rekord im Bestand (Empfehlung: entfernen), Altersgruppe 4–7 gegen 8–12, Wortkarten |

## 7. Arbeitsliste (Stand 28.10)

1. Stufe 2 abschließen: GEM-8, GEM-13, CON-4 (Schreiber laufen; danach unabhängige Prüfung, dann Commit).
2. Freigaben für Löschungen (Max, Koordinator): CON-1, CON-4 (Punktzähler), CON-7. Erst nach Freigabe Stufe 2 vollständig.
3. Entscheidungen Max: Nachtrag-Fragen 48 ff. (Altersgruppen, Begriffe, Bildrechte, Gesundheitsfakten, Engine, Serie C und D).
4. Index korrigieren (Koordinator, `tools/bauauftrag-index.mjs`): CON-18, CON-12 (app), PRI-7, KIN-17, GEM-8, GEM-13, CON-4.
5. Stufe 3 (53 Einheiten, nach Faktenstand): erst nach Abschluss von Stufe 2.
6. Unklar: PRI-6, CON-13, CON-15 (Entscheidungen; danach Bauaufträge nachtragen).
7. Serie C (Faktencheck gebauter Apps) und Serie D (docs/10): Entscheidung Max, ob sie wieder eingeplant werden.

## 8. Verbindlich bleibt

Kein Kind wird bewertet. Nichts wird gelöscht, bevor Max den Umfang bestätigt hat. Änderungen sind zuerst ergänzend. Schreiber
und Prüfer arbeiten getrennt; der Integrator committet allein.

## 9. Liste: Einheiten ohne App (Stand 28.10.2026)

Frage: Welche Einheiten der Gruppe 2 sind noch nicht als App geschrieben, und in welchem Dokument stehen beide Fassungen (18.10 und 27.10)?

Antwort in Kürze: Die Fassung vom 18.10 steht in `docs/plan-praleska-umsetzung.md`, die vom 27.10 in `docs/plan-neue-welle.md`. Im Repo gibt es keine Datei, die beide Fassungen vollständig enthält. `docs/fragen-und-hinweise.md` nennt beide Daten, aber nicht den Plan vom 27.10. Dieser Abschnitt und Abschnitt 2 stellen beide Fassungen gegenüber. Ohne App sind sechs Einheiten; beide Pläne ordnen sie gleich ein. Eine Einheit (CON-16) hat im Index den Status „teilweise“, aber weder App noch Datei.

Geprüft am 28.10.2026: der Index (`docs/bauauftraege/index.json`), das Verzeichnis `apps/` (jedes App-Feld des Index gegen den Ordner geprüft) und beide Pläne. „Zeile“ meint die Zeile der jeweiligen Plandatei, nicht eine Seite des Praleska-Buchs. Eine Seitenangabe aus dem Buch kommt in diesem Abschnitt nicht vor.

### 9.1 Ohne App: sechs Einheiten

| Kennung | Einheit | Plan 18.10 | Plan 27.10 | Was offen ist | Bauauftrag |
|---|---|---|---|---|---|
| PRI-6 | Frischluft-Rituale-Kartei | unklar (Tabelle, Zeile 181); Serie A „Danach“ (Zeile 203) | unklar (Zeile 23); Entscheidung 2 (Zeile 45) | Entscheidung Max, Nachtrag Frage 61 | keiner |
| CON-13 | Trostvers-Generator (personalisierte Wiegenreime) | unklar (Tabelle, Zeile 169); „Danach“ (Zeile 203); Kindernamen als personenbezogenes Datum (Zeile 56) | unklar (Zeile 23); Entscheidung 2 (Zeile 45) | Entscheidung Max, Nachtrag Frage 61 | keiner |
| CON-15 | Naturschutz-Rat: Rote Liste & unser Planet (Klassen-Koffer) | unklar (Tabelle, Zeile 171); „Danach“ (Zeile 203) | unklar (Zeile 23); Entscheidung 2 (Zeile 45) | Entscheidung Max, Nachtrag Frage 61 | keiner |
| CON-17 | Krippen-Portfolio „Erste Erfahrungen“ | nicht bauen (Tabelle, Zeile 173); „Zurückgestellt“ (Zeile 204); Beobachtungsbögen je Kind (Zeile 55) | nicht bauen (Zeile 24) | keine offene Entscheidung; Grund: Freitexte je Kind | keiner |
| KIT-18 | Beobachtungsbogen „Spiel-Entwicklung 3–5“ | nicht bauen (Tabelle, Zeile 147); „Zurückgestellt“ (Zeile 204); Beobachtungsbögen je Kind (Zeile 55) | nicht bauen (Zeile 24) | keine offene Entscheidung; Grund: Beobachtungsbogen je Kind | keiner |
| KIT-20 | Beobachtungsbogen Musikalische Entwicklung 3–5 | nicht bauen (Tabelle, Zeile 149); „Zurückgestellt“ (Zeile 204); Beobachtungsbögen je Kind (Zeile 55) | nicht bauen (Zeile 24) | keine offene Entscheidung; Grund: Beobachtungsbogen je Kind | keiner |

Zu den drei unklaren Einheiten (Nachtrag, Frage 61): PRI-6 Vorschlag „nur Rituale ohne Gesundheitsversprechen“; CON-13 Empfehlung „nur ohne Namen oder mit Einwilligung“; CON-15 Empfehlung „als Klassen-Koffer ohne Wertung“. Ohne Entscheidung von Max wird keine dieser drei gebaut (Plan 27.10, Zeile 23).

Zu den drei nicht zu bauenden Einheiten: Der Plan vom 18.10 begründet sie mit dem Grundsatz, keine Kinderbewertung zu bauen (Zeile 33: „Regel- oder Politikgrund“; Zeile 55: Beobachtungsbögen je Kind, betrifft auch das Krippen-Portfolio). Eine Entscheidung ist nicht offen.

Hinweis: Abschnitt 5 des Plans vom 18.10 nennt die Trostvers-Einheit „Funktion 1“ (Zeile 56). Die Tabelle führt sie als Nr. 13 (Zeile 169). Vermutlich ein Schreibfehler; nicht geprüft.

**CON-16 Konzept-Mapping Praleska nach DE** (kein App-Ordner, Index „teilweise“). Der Bauauftrag (Abschnitt 9, Zeilen 110 und 111) sagt, dass das Dokument fehlt. Der Vorschlag ist `docs/konzept-mapping-praleska-de.md`; der Ort ist eine Entscheidung. Im Plan vom 18.10 steht die Einheit als „teilweise“ (Tabelle, Zeile 172). Im Plan vom 27.10 wird sie nicht namentlich genannt; rechnerisch gehört sie zu den 62 „teilweise“ und damit zu Stufe 3 (62 − 9 = 53). Sie ist also kein App-Fehlen, aber ein Dokument-Fehlen.

### 9.2 Offen laut Tabelle 18.10, am 28.10 gebaut oder teilweise (elf Einheiten)

Diese Liste zeigt, was sich zwischen den beiden Fassungen geändert hat. Die Statuszeile stammt aus der Tabelle des Plans vom 18.10 (Zeilen 158 bis 183); der Stand am 28.10 aus dem Index (27.10) und dem Bestand.

| Kennung | Einheit | Plan 18.10 (Tabelle) | Stand 28.10 | App |
|---|---|---|---|---|
| CON-2 | Spielideen-Kartei: Was kann mein Baby mit…? | offen (Zeile 158) | teilweise | `baby-spielideen-kartei` |
| CON-3 | Meine Familie – Wörter und Rollen | offen (Zeile 159) | gebaut (Stufe 1) | `meine-familie-woerter-und-rollen-content-pack` |
| CON-5 | Tierkinder und ihre Familien | offen (Zeile 161) | teilweise | `tierkinder-vorlesen` |
| CON-6 | Himmelsgucker: Sonne, Mond und Sterne | offen (Zeile 162) | gebaut (Stufe 1) | `himmelsgucker-sonne-mond-und-sterne` |
| CON-9 | Farbwörter-Schatz | offen (Zeile 165) | gebaut (Stufe 1) | `farbwoerter-schatz` |
| CON-10 | Musik-Wörter-Bilderlexikon | offen (Zeile 166) | gebaut (Stufe 1) | `musik-woerter-bilderlexikon` |
| CON-11 | Kindertänze Europas | offen (Zeile 167) | teilweise | `kindertaenze-europa` |
| CON-12 | Puppentheater-Werkstatt | offen (Zeile 168) | teilweise | `puppentheater-werkstatt` |
| CON-18 | Theater zuhause – Bastel- und Spielheft | offen (Zeile 174) | Index „teilweise“; App gebaut (Index veraltet) | `theater-zuhause-heft` |
| PRI-7 | Fühl- und Sortier-Werkstatt: Holz, Papier, Stoff | offen (Zeile 182) | teilweise (Ausbau oder Neubau offen) | `fuehl-sortier-werkstatt` |
| PRI-8 | Kleine Forscher ohne Bildschirm | offen (Zeile 183) | gebaut | `kleine-forscher-ohne-bildschirm` |

Zu CON-2, CON-5 und CON-11: Der Plan vom 18.10 führt sie im Text (Abschnitt 7) als gebaut, in der Tabelle als offen (siehe Hinweis in Abschnitt 2).

### 9.3 Teilweise, mit App: 62 Einheiten

Diese Einheiten haben eine App, aber nicht den vollen Umfang. Sie sind nicht „nicht geschrieben“. Die vollständige Liste steht im Index (`docs/bauauftraege/index.json`, Liste `bauauftraege`, Status „teilweise“). Die Reihenfolge steht in Abschnitt 6 (Stufe 2: neun Einheiten) und im Plan vom 27.10 (Stufe 3: 53 Einheiten).

### 9.4 Noch zu klären

- Index: CON-18 (Status), CON-12 (Status und nächster Schritt), PRI-7 und KIN-17 sind im Index veraltet (Frage 63).
- Prüfung der App-Felder: Alle 62 Einträge der Liste `bauauftraege` mit Status „teilweise“ verweisen auf vorhandene Ordner unter `apps/`. Bei GEM-10, PRI-10, PRI-12 und PRI-14 nennt das Feld zwei Apps; beide Ordner sind vorhanden. Ausnahme ist CON-16 (kein App-Feld, Dokument fehlt).
- Die Entscheidungen für PRI-6, CON-13 und CON-15 stehen aus (Frage 61). Erst danach gibt es Bauaufträge.
