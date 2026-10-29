# Übergabe: Stand 29.10.2026

Zweck: Dieses Dokument hält den Stand der Arbeit fest, damit eine neue Sitzung ohne den Gesprächsverlauf weitermachen kann. Maßgeblich sind die Commits im Repository, die Dokumente unter docs/ und die Dateien unter `/mnt/session/outputs/`.

## 1. Commits

- Lokal liegen 18 Commits vor `origin/claude/children-network-programs-germany-hr0jh9` (Basis `65ac326`). Aktuelle Liste: `git log --oneline 65ac326..HEAD`.
- Auf GitHub ist davon noch nichts angekommen: In der Sitzung fehlte ein `authorization_token` für `svend4/info70`.

## 2. Einheiten (Gruppe 2, Stufe 2)

| Einheit | App | Stand | Tests | Commit |
|---|---|---|---|---|
| KIN-17 | uhr-und-kalender-kind | committet | 28 | d4446a0 |
| GEM-13 | erzaehl-bruecke | committet, Prüfung abgeschlossen | 31 | 73b342a |
| GEM-8 | mathe-entdecker | committet, Prüfung 3: freigabe_empfohlen | 43 | ecc9fa6 |
| CON-4 | deutschland-kompass | nicht committet; Arbeitsstand in `con4-arbeitsstand.tgz`; Prüfung 4: nach R4-1 freigabefähig, abhängig von 68 und 69 | 42 | – |

## 3. Offene Entscheidungen für Max

In `docs/fragen-fuer-max-2026-10-28.md`, Abschnitt „И“ und den Nachträgen 48 bis 69:

- **65** Zufall im Bestand, auch in gemeinsamen Paketen (`mischen()`, quiz-kern).
- **66** Wort „Stufe“ (45 Apps) und „Sterne“ (m16, Bestand).
- **67** Fokus im Bestand (erzaehl-bruecke) und im Quiz-Motor.
- **68** CON-4: Umfang nach Brief (vier Ebenen) oder nach Bauauftrag; Fokus nach dem Kopfknopf auf dem Knopf (Empfehlung: Brief-Umfang, Knopf-Fokus).
- **69** CON-4: Klammer „(13)“ in GDD §6 (Empfehlung: „(13 Prüfungen)“).

## 4. Zählwerte

- docs/10: erzaehl-bruecke 31, mathe-entdecker 43, deutschland-kompass 42. Die CON-4-Zahl passt erst nach dem CON-4-Commit zum Code.
- Wurzel-README, Zeile „Полный прогон“: steht noch auf 3262. Nach dem CON-4-Commit mit `node tools/zahlen.mjs --schreiben` setzen.

## 5. Regeln (Kurzfassung)

- Kein Kind wird bewertet. Keine Wertungswörter in Texten für Kinder.
- Bestehende Zeilen werden nicht gelöscht oder ersetzt. Änderungen als Ergänzung oder als datierte Anmerkung neben der alten Zeile. Eigene, noch nicht committete Texte dürfen überarbeitet werden.
- Seitenangaben nur mit dem Vermerk „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ im selben Dokument.
- Testzahlen in README, GDD und docs/10 stimmen mit dem Stand überein.
- Schreiber ändern nur ihre App. Der Koordinator committet, auch Dokumente und Zählwerte.

## 6. Dateien außerhalb des Repositorys

- `/mnt/session/outputs/info70-claude-children-network.bundle`: Git-Bundle mit den Commits bis zu dem Commit, der dieses Dokument enthält.
- `/mnt/session/outputs/con4-arbeitsstand.tgz`: unkommittierter Stand von `apps/deutschland-kompass`.
- `/mnt/session/outputs/con4-pruefung-bericht-*.json`: Prüfberichte zu CON-4.
- `/mnt/session/outputs/ANLEITUNG-lokal.md`: Schritte für das Hochladen vom eigenen Rechner.
- `docs/analyse-plaene-18-10-und-27-10.md`: Analyse beider Pläne, Abschnitt 9 nennt die Einheiten ohne App.

## 7. Nächste Schritte

1. Entscheidungen 68 und 69 treffen.
2. CON-4 committen: `git add -- apps/deutschland-kompass`, danach Commit. Den Stand aus dem Archiv einspielen, falls er nicht im Arbeitsbaum liegt.
3. Gesamtzahl im Wurzel-README setzen: `node tools/zahlen.mjs --schreiben`. Danach `node --test packages/kinderschutz/test/testzahlen.test.mjs` ausführen; alle Befunde müssen weg sein.
4. Hochladen auf GitHub: siehe `ANLEITUNG-lokal.md`.

## 8. Nachtrag 29.10.2026 abends

Die Abschnitte 1 bis 7 bleiben stehen. Dieser Nachtrag gilt für den Stand danach.

**Commits.** Auf GitHub liegt `a7162d6`. Lokal liegen darüber die sechs Commits unten und die Commits dieses Nachtrags (zählbar mit `git rev-list --count a7162d6..HEAD`): `62c6014` (Brief Stufe 2, Rest), `b01c68a` (Inventar), `c87c6b6` (Wortliste „Rang“, Befund B-21), `a7c7e85` (Browser-Prüfung mit Schalter `--alle-knoepfe`, Befund B-13 und B-20), `35fc220` (Anmerkung docs/02, Fragen 70 bis 73, Inventar), `bf32ad6` (docs/10 Z. 137 auf 13 Tests zurückgesetzt, weil die 42 zur Arbeitskopie gehören). Das Bundle `/mnt/session/outputs/info70-claude-children-network.bundle` enthält alle Commits seit `a7162d6` (`HEAD ^a7162d6`); es wurde in einem Klon von `a7162d6` geprüft.

**Zählwerte.** Tests im Commit `bf32ad6`: 3329, alle grün bis auf einen Test, der nur im Export ohne `.git` fehlschlägt (`aenderungsumfang`, Befund im Export, nicht im Repository). Das README nennt 3329. In der Arbeitskopie sind es 3358; die drei Befunde von `testzahlen` in der Arbeitskopie hängen alle an CON-4: README (3358), `GDD.md` von deutschland-kompass (Frage 69) und docs/10 Z. 137 (42 nach dem Commit von CON-4).

**Neue Befunde (maschinell gemessen, nicht von einem Menschen geprüft).**
- `docs/befund-rang-2026-10-29.md`: zehn Treffer des Wortes „Rang“ in zwei Apps (`autonomiephase-navigator`, `barriere-detektive`). Entscheidungen 70 und 71.
- `docs/befund-browser-kennung-2026-10-29.md` und `docs/browser-alle-knoepfe-2026-10-29.json`: Die Browser-Prüfung misst ohne den Schalter nur Knöpfe mit Kennung. Mit dem Schalter verlieren in 178 von 232 Apps Fokus nach einem Klick den Fokus; 49 Apps haben „Zurück“-Knöpfe, die bisher nie geklickt wurden. Entscheidungen 72 und 73.
- Gruppe 1: Die Liste der 34 teilweisen Einheiten lässt sich aus dem Katalog nicht erzeugen (Inventar, Abschnitt 8).

**Nächste Schritte (ergänzt).**
1. Entscheidungen 68 und 69 treffen (CON-4).
2. CON-4 committen (`git add -- apps/deutschland-kompass`), danach `node tools/zahlen.mjs --schreiben` (README auf die Arbeitskopie), in `docs/10-praleska-baukasten.md` Z. 137 von „13 тестов“ auf „42 тестов“ setzen und die Notiz „Zählung 29.10. abends“ dort stehen lassen. Danach `node --test packages/kinderschutz/test/testzahlen.test.mjs` ohne Befund.
3. Entscheidungen 70 bis 73 treffen. Bis dahin bleibt der Bestand unverändert.
4. Hochladen: nur mit neuer Freigabe und einem Token für diese Sitzung oder vom eigenen Rechner aus, siehe `ANLEITUNG-lokal.md`.

## 9. Nachtrag 29.10.2026 spät: Plan 18.10 weitergeführt

Die Abschnitte 1 bis 8 bleiben stehen.

**Commits seit `a7162d6`.** Die Liste steht im Befehl `git log --oneline a7162d6..HEAD`. Neu in diesem Nachtrag: Befunde und Layout im Browser-Werkzeug (B-23, zwei Layout-Korrekturen mit datierten Kommentaren), der kanonische Stand der Gruppe 2 mit den Statuszeilen am Ende von docs/10 (Serie D), das Werkzeug und der Pilot der Serie C (fünf Apps, drei Korrekturen in klanggeschichten-erzeuger), der Vermerk zur Vorlese-Pflicht (Entscheidung 28а) für neun weitere Erwachsenen-Werkzeuge.

**Wo die Arbeit nach dem Plan 18.10 steht.**
- Serie D: erledigt (`docs/10`, Abschnitt am Dateiende; Quelle `tools/gruppe-2-stand.mjs --docs10`).
- Serie C: Pilot mit fünf Apps abgeschlossen (`docs/serie-c-2026-10-29.md`). Welle 2 mit drei Apps (`entwicklungs-kompass`, `tagesblick-fachkraft`, `schulstart-begleiter`) lief zum Zeitpunkt dieses Nachtrags; das Ergebnis ist in diesem Dokument nachzutragen, sobald es vorliegt.
- Serie A: abgeschlossen bis auf die Einheiten, die auf Entscheidungen warten (PRI-6, CON-13, CON-15 unklar; Frage 61).
- Serie B (Ausbau): Stufe 1 gebaut, Stufe 2 bis auf CON-4 (Commit wartet auf 68 und 69) und die Entscheidungen 51 bis 59. Stufe 3 wartet auf 48, 49 und 64.
- Gruppe 1 (Plan 18.10, Abschnitt 8): Die Zählung 100 gebaut, 34 teilweise, 3 offen, 2 nicht bauen ist nicht nachprüfbar. Eine Prüfung braucht eine Inventur (Entscheidung über den Aufwand).

**Neue Fragen für Max:** 74 (CON-16, Ort und Art des Ergebnisses), 75 (Zielgruppe von sechs Apps mit Vorlesefunktion), 76 (Altersgruppe von `tier-tanz-impulse`). Ergänzungen zu den Fragen 48, 49, 72 und 73 stehen bei den Fragen.

**Zählwerte.** HEAD nach diesen Commits: die Zahl steht im README; sie wird mit `node tools/zahlen.mjs` auf einem Export von HEAD bestimmt (ohne die noch nicht committete Arbeit an CON-4). In der Arbeitskopie sind es mehr, weil CON-4 (42 Tests in der App) dazukommt. Die drei roten Befunde von `testzahlen` in der Arbeitskopie hängen weiter an CON-4 (README, `GDD.md` von deutschland-kompass, docs/10 Z. 137).

**Nächste Schritte ohne neue Entscheidung.**
1. Welle 2 der Serie C auswerten und das Ergebnis in `docs/serie-c-2026-10-29.md` und in die GDD der drei Apps eintragen (Pflichtmarkierung wie in den Pilot-Apps).
2. Zählregel für `tier-tanz-impulse` in README und GDD ausschreiben (die Zahlen 24 und 23 stimmen laut Prüfung).
3. Weitere Apps der Serie C nach demselben Verfahren; die Liste der Kandidaten steht in `docs/status-gruppe-2-2026-10-29.json` (gebaut, Faktenstand „nur Katalogtext“ oder „Quelle nicht im Repo prüfbar“).
4. Die sechs Apps aus Frage 75 mit der Zielgruppe klären, bevor der Vermerk gesetzt wird.
5. Die Layout-Stelle in `deutschland-kompass` (1 px, Modus-Bildschirm, im HEAD) mit der Freigabe von CON-4 beheben.

**Stand der Messung.** Der Schalter `--alle-knoepfe` misst 232 Apps (Lauf 3, `docs/befund-browser-kennung-2026-10-29.md`, Abschnitt 9). Der Fokusverlust in 178 Apps bleibt bis zur Entscheidung 72 Bestand.

Seitenangaben in diesem Abschnitt: Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
