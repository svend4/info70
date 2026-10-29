# Brief: Stufe 2, Rest (GEM-14, GEM-16, GEM-19, CON-1, CON-7)

Stand: 29.10.2026. Dieser Brief ergänzt `docs/arbeitsweise/briefs/stufe-2-ausbau.md`. Dort stehen die allgemeinen Regeln (Harte Grenzen, Regeln, Prüfen, Bericht). Er gilt erst, wenn die jeweils genannte Entscheidung in `docs/fragen-fuer-max-2026-10-28.md` vorliegt. Bis dahin wird an diesen Apps nichts geändert.

Grundregeln, wie im Haupt-Brief: Bestehende Zeilen werden nicht gelöscht oder ersetzt. Änderungen als Ergänzung oder als datierte Anmerkung neben der alten Zeile. Ein Schreiber ändert nur seine App. Der Koordinator committet.

## Was ohne Entscheidung möglich ist

Nur Vorbereitung: den Bauauftrag lesen, die Quellenstellen prüfen, Tests entwerfen. An den Apps selbst wird nichts geändert, bevor die Entscheidung vorliegt.

## Einheiten

### GEM-14 grammatik-zwerge

- Bauauftrag: `docs/bauauftraege/GEM-14-grammatik-zwerge.md`
- Wartet auf:
  - Entscheidung 54 (Engine): ★ eigenes Format behalten und den Katalog angleichen.
  - Entscheidung 57 (Begriffe, Sternchen): ★ App-Form behalten und den Katalog korrigieren, wenn die Quelle das stützt. Die Bedeutung der Sternchen vor S. 141 und 142 klärt der Prüfer aus der Quelle.
  - Fachprüfung durch einen Menschen. Das kann kein Schreiber leisten; ohne sie bleibt das als Vermerk stehen.
- Nach der Entscheidung: Ausbau laut Bauauftrag, Abschnitte 3 bis 9. Quellenangaben nur mit dem Vermerk im selben Dokument.

### GEM-16 design-entdecker

- Bauauftrag: `docs/bauauftraege/GEM-16-design-entdecker.md`
- Wartet auf:
  - Entscheidung 54 (Engine): ★ wie bei GEM-14.
  - Entscheidung 56 (Bilder): ★ in diesem Ausbau keine Bilder, nur Beschreibungen.
- Nach der Entscheidung: Ausbau ohne Bildmaterial. Die Bildrechte bleiben im GDD unter „Offen“.

### GEM-19 geschichten-wender

- Bauauftrag: `docs/bauauftraege/GEM-19-geschichten-wender.md`
- Wartet auf:
  - Entscheidung 53 (Sprachen): ★ zunächst nur Deutsch; uk und ru später mit Prüfung durch eine Lehrkraft.
  - Entscheidung 55 (Altersgruppe): ★ den Katalog an die App angleichen, wenn die App stimmt (App 5 bis 7).
  - Entscheidung 58 (Abweichungen): ★ die Abweichungen bestätigen; die Erzeugerfunktion (KI-bereit) kommt später.
- Nach der Entscheidung: keine neue Funktion. Altersgruppe und Katalog angleichen, Abweichungen datiert im GDD festhalten.

### CON-1 stark-und-gesund

- Bauauftrag: `docs/bauauftraege/CON-1-stark-und-gesund.md`
- Wartet auf:
  - Entscheidung 51 (Ränge): ★ keine Ränge bauen; den Katalogtext angleichen.
  - Entscheidung 52 (Gesundheitsaussagen): a) fachliche Prüfung vor dem Ausbau ist die Empfehlung, kann aber kein Schreiber leisten. Umsetzbar sind nur b) (Inhalte streichen) oder c) (Ausbau ohne sie), wenn Max eine davon wählt.
- Hinweis: Punkte und Rekord sind seit Commit 96a1f89 aus dem Code entfernt. Der Migrationsschlüssel `sug.rekord` bleibt, er ist erlaubt.
- Bis zur Entscheidung zu 52 gilt Tor 6: Aussagen über Gesundheit brauchen eine Quelle oder den Vermerk „(Eigenentwurf, fachlich nicht geprüft)“.

### CON-7 herkunftssprachen-bruecke

- Bauauftrag: `docs/bauauftraege/CON-7-herkunftssprachen-bruecke.md`
- Wartet auf:
  - Entscheidung 53 (Sprachen): ★ zunächst nur Deutsch.
  - Entscheidung 55 (Altersgruppe): ★ den Katalog an die App angleichen, wenn die App stimmt (App 8 bis 12; Katalog nennt 4 bis 7 und Eltern).
- Hinweis: Punkte, Ergebnissatz, Rekord und Ränge sind aus dem Code entfernt (Commit 96a1f89). Der Migrationsschlüssel `herkunft.rekord` bleibt.
- Die Wortkarten sind in den Fragen nicht entschieden. Der Schreiber meldet sie als offen, wenn der Bauauftrag sie verlangt.

## Gemeinsam

- Stufe 2 als Ganzes abschließen, sobald die Entscheidungen 50 bis 60 vorliegen (Frage 64, ★).
- Jede Einheit: ein Schreiber und ein unabhängiger Prüfer. Die Tore aus `docs/plan-neue-welle.md`, Abschnitt 3, gelten.
- Bericht je Einheit im Format des Haupt-Briefs. Testzahl in README und GDD mitziehen.
