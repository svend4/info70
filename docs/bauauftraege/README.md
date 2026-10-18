# Bauaufträge der Praleska-Gruppe 2

Dieser Ordner enthält je Einheit eine Arbeitsanweisung (Bauauftrag) nach `VORLAGE.md`. Der Bauauftrag beschreibt, was eine App leisten soll, welche Daten sie braucht, welche Pseudocode-Schritte und welche Tests gelten. Er ersetzt nicht den Katalogeintrag in `docs/10-praleska-baukasten.md`, sondern ergänzt ihn.

## Stand

- `index.json`: 131 Einheiten, daraus 68 Bauaufträge (63 teilweise, 5 offen). Sechs Einheiten haben keinen Bauauftrag: 3 unklar (CON-13, CON-15, PRI-6), 3 nicht bauen (KIT-18, KIT-20, CON-17).
- 13 Bauaufträge sind durch A7 (`quiz-kern`) blockiert: CON-1, CON-3, CON-4, CON-6, CON-7, CON-9, CON-10, GEM-8, GEM-13, GEM-14, GEM-16, GEM-19, KIN-17. Die Liste steht in `tools/bauauftrag-index.mjs`.
- Der Stand im Index entspricht dem Plan nach Welle 91 plus den sechs Änderungen der Wellen 92 und 93 (siehe `tools/bauauftrag-index.mjs`).

## Werkzeuge

- `node tools/bauauftrag-index.mjs`: erzeugt `index.json` aus dem Plan neu. Die Änderungen der Wellen 92–93 stehen dort als Tabelle, nicht still im Plan.
- `node tools/bauauftrag-pruefen.mjs [Pfad-zu-all.txt]`: prüft alle Bauaufträge.
  - Alle neun Abschnitte der Vorlage vorhanden.
  - Jedes Zitat „…“ (S. n) steht auf Seite n der Arbeitskopie.
  - Keine Modellnamen.
  - Jede Kennung im Index hat eine Datei.
  - Das Skript braucht die Textkopie der Pralęska. Die Datei `PRALESKA.pdf` liegt auf dem Branch `main` (Commit `c3deddf`); die Textkopie erzeugt `tools/quelle-holen.sh`. Ohne Kopie bricht das Skript mit Exit-Code 2 ab.
- `tools/quelle-holen.sh <Ordner>`: liest `PRALESKA.pdf` aus `origin/main`, erzeugt `all.txt` mit Formfeed zwischen den Seiten und korrigiert die kyrillische Kodierung (Windows-1251). Ausgabe außerhalb des Repos; nichts wird committet.

## Regeln

0. Seitenzahlen beziehen sich auf die gedruckte Seite der PDF. Seite n ist Index n-1 nach dem Split an Formfeed.

1. Ein Bauauftrag beschreibt, was gebaut werden soll. Er enthält keinen Satz aus der Pralęska. Erlaubt sind Seitenangaben, Begriffe und Titel (höchstens 6 Wörter) in Anführungszeichen. Grundlage: docs/10, Abschnitt „Правовая и этическая рамка адаптации“, Punkt 1.
2. Alles, was nicht aus der Quelle stammt, ist mit „(Eigenentwurf)“ gekennzeichnet.
3. Seitenangaben sind maschinell geprüft, nicht von Menschen. Die Pflichtmarkierung steht in Abschnitt 6 und in der App (A18, offen).
4. Standard für neue Apps (Vorschlag, bis A18 entschieden ist): Seitenzahlen erscheinen nicht auf dem Druckblatt, nur in den Daten und in der Dokumentation.
5. Blockierte Einheiten bleiben beschrieben. Sie werden erst gebaut, wenn die Blockade aufgehoben ist.

## Nächste Schritte

Die Schritte der Stufe 0 und die Entscheidungen für die Stufe 1 stehen im Gesprächsverlauf. Die Stufe 1 (Pilot mit drei Sessions in der Cloud) braucht eine Entscheidung zu A10 (Zugang zum Text), ein Budget und eine Entscheidung zur Branch-Regel.
