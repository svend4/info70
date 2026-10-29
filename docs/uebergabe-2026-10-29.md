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
