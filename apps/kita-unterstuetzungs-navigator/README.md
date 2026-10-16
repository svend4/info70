# Kita-Unterstützungs-Navigator

Checkliste für **Fachkraft und Träger**. Sie fragt, welche psychologisch-pädagogischen
Unterstützungsaufgaben die Einrichtung abdeckt. Grundlage ist der Anhang
„Психологическая служба в дошкольном учреждении“ der Praleska, Seiten 312 bis 317
(Katalog Nr. 93, docs/10-praleska-baukasten.md).

Übernommen sind **24 Aufgaben** in vier Blöcken. Zu jeder Frage gibt es vier Antworten:
**geregelt**, **teilweise**, **nicht geregelt**, **Träger oder extern**. Gezählt wird je Block.
Der Bericht als Text kann gedruckt oder als Textdatei gespeichert werden. Außerdem gibt es
einen leeren Druckbogen zum Ausfüllen von Hand.

## Was die App nicht ist

- Keine Bewertung von Kindern, Familien oder einzelnen Fachkräften. Die Fragen betreffen die Einrichtung,
  das Team, die Gruppen und die Eltern insgesamt (docs/02, Z. 141–146).
- Kein Urteil über die Einrichtung: keine Ampel, keine Prozentzahl, keine Summe über alle Fragen,
  keine Rangfolge. Die Zählung bleibt innerhalb eines Blocks.
- Kein Diagnoseinstrument und keine Beratung. Die App stellt Fragen und zählt Antworten.
- Kein Verzeichnis von Anlaufstellen mit Kontaktdaten. Genannt werden nur Kategorien.
- Keine Rechtsauskunft. Es gibt keine Gesetzesverweise, weil keine geprüft ist.

## Was gespeichert wird

**Nichts.** Die Antworten liegen in einer Variablen im Speicher der Seite und in den Eingabefeldern
der Anlaufstellen. Nach dem Neuladen sind sie weg. Die App benutzt weder `localStorage` noch
`sessionStorage`, IndexedDB oder Cookies.

Der Bericht wird nur auf ausdrücklichen Knopfdruck als Textdatei auf das Gerät geladen. Diese Datei
legt die App nicht selbst ab. Die Kontaktzeilen der Anlaufstellen stehen nicht im Bericht.

## Quelle und Eigenentwurf

Quelle ist der Anhang der Praleska, Seiten 312 bis 317. Die vier Blocknamen sind die Überschriften der
Quelle. Die deutsche Übersetzung in Klammern ist Eigenentwurf.

| Block (Überschrift der Quelle) | Seiten | übernommen |
|---|---|---|
| Приоритетные задачи педагога-психолога (Vorrangige Aufgaben) | 312–313 | 4 |
| Работа с детьми (Arbeit mit Kindern) | 313–314 | 5 |
| Работа с родителями (Arbeit mit Eltern) | 315 | 5 |
| Работа с педагогами (Arbeit mit dem Team) | 315–317 | 10 |

Die Fragen und Hinweise sind Eigenentwurf nach der jeweiligen Aufgabe. Bei jeder Frage steht die Seite
der Quelle. Zitate aus der Quelle gibt es nicht; die App übernimmt nur die Blocküberschriften.

Die Quelle nennt 32 Aufgaben in vier Blöcken, als Aufzählungspunkte ohne Nummern. 24 davon sind übernommen (siehe unten).

## Ausgeschlossene Aufgaben

Aufgaben, die einzelne Kinder, einzelne Familien oder einzelne Fachkräfte betreffen, sind nicht
übernommen. Die Auswahl folgt dem Wortlaut der Aufgabe. Der Grund steht jeweils dabei.

| Seite | Aufgabe der Quelle (Kurzfassung, Eigenentwurf) | Grund |
|---|---|---|
| 313 | Soziometrische Aufgabe: Stellung einzelner Kinder in der Gruppe | ordnet einzelne Kinder nach ihrer Stellung ein |
| 314 | Erkennung der Begabung einzelner Kinder, mit Diagnose | stellt Merkmale einzelner Kinder fest |
| 314 | Diagnostik der Schulreife | diagnostiziert einzelne Kinder |
| 314 | Hilfe für Kinder mit besonderem Förderbedarf | ordnet Kinder nach einem Förderbedarf ein |
| 314 | Einordnung einzelner Kinder nach Schwierigkeiten | Kategorien einzelner Kinder |
| 315 | Beratung zu konkreten Familien mit besonderen Merkmalen der Kinder | betrifft einzelne Familien und ordnet Kinder ein |
| 316 | Einordnung des Zusammenwirkens einzelner Fachkräfte nach einem Typ | ordnet einzelne Fachkräfte ein |
| 316 | Analyse der Arbeit einer Fachkraft im Auftrag der Verwaltung | analysiert eine einzelne Fachkraft |

**Teilweise übernommen:** Aufgabe auf Seite 317 zur Verträglichkeit von Fachkräften mit einer Gruppe.
Übernommen ist nur der Teil zum Klima im Team. Die Verträglichkeit einzelner Fachkräfte fehlt.

Die Liste steht im Quelltext als `AUSGESCHLOSSEN` und `TEILWEISE_AUSGESCHLOSSEN` in `logik.mjs`.

## Die Fragen je Block

- **Vorrangige Aufgaben (S. 312–313):** Entwicklung jedes Kindes, psychische Gesundheit von Kindern
  und Fachkräften, Rechte des Kindes, psychologisches Wissen aller Beteiligten.
- **Arbeit mit Kindern (S. 313–314):** vorbeugende Maßnahmen für die Gruppe, Eingewöhnung,
  Entwicklungsangebote auf Anforderung, Umgebung, Beobachtung des Spiels.
- **Arbeit mit Eltern (S. 315):** psychologische Information, Beratung zur Eingewöhnung, Angebote zum
  Verstehen des Kindes, Information über Altersbesonderheiten, Anregungen für Spiel zu Hause.
- **Arbeit mit dem Team (S. 315–317):** psychologisches Wissen, Beratung, Empfehlungen, Hilfsmittel,
  Entwicklung von Angeboten, gemeinsame Haltung, berufliche Weiterentwicklung, Überlastung im Team,
  pädagogische Konferenzen, psychologisches Klima im Team.

**Frage zur Überlastung (S. 317):** Sie steht nur auf Einrichtungsebene als „Gibt es Bedingungen, die
Überlastung im Team vorbeugen?“. Der Hinweis dazu lautet: „Bei Überlastung einzelner Personen entscheiden
Leitung und Träger. Dieses Werkzeug bewertet keine Person.“ (Eigenentwurf)

## Grenzfälle, die du prüfen solltest

1. **Angebote für Einzelne oder Gruppen** (S. 315 Eltern, S. 316 berufliche Weiterentwicklung): übernommen,
   weil der Gegenstand die Eltern oder das Team insgesamt ist. Es geht um Angebote, nicht um eine Einordnung.
2. **Hilfe für Kinder mit besonderem Förderbedarf** (S. 314): ausgeschlossen, weil sie Kinder nach einem
   Bedarf einordnet. Wer nur das allgemeine Förderangebot meint, kann die Aufgabe übernehmen.
3. **Typ des Zusammenwirkens** (S. 316): ausgeschlossen, weil jede Fachkraft einem Typ zugeordnet wird.
   Eine Frage auf Teamebene wäre möglich.
4. **Teil der Aufgabe auf S. 317:** die Verträglichkeit einzelner Fachkräfte mit einer Gruppe ist nicht
   Teil der Fragen. Die Frage zum Klima im Team bleibt.

## Antworten und Zählung

Jede Frage hat die vier Antworten. Ein zweiter Druck auf dieselbe Antwort nimmt sie zurück. Je Block
steht eine Zählung, zum Beispiel:

`geregelt: 2, teilweise: 1, nicht geregelt: 3, Träger oder extern: 0, ohne Antwort: 0`

Die Zählung je Block ergibt die Zahl seiner Fragen. Eine Zusammenfassung über alle Blöcke gibt es nicht.

## Bericht und Druck

- **Bericht drucken:** Druckt nur den Bericht. Er zählt je Block und nennt die Fragen mit „nicht geregelt“
  mit Seite. Er enthält keine Namen und keine Angaben zu einzelnen Kindern, Familien oder Personen.
- **Bericht als Textdatei speichern:** Lädt denselben Text als Datei herunter.
- **Leeren Druckbogen drucken:** Alle Fragen mit Seitenangabe, je Frage eine Zeile für die Antwort
  und die Optionen als Text. Außerdem gibt es die Anlaufstellen mit leeren Zeilen. Der Bogen enthält
  keine Kästchen und keine Häkchen. Er zeigt keine Antworten vom Bildschirm.

`druck.css` blendet beim Drucken die Bildschirmseite aus. `body[data-druck]` bestimmt, welches Blatt erscheint.

## Anlaufstellen

Die Liste nennt fünf Kategorien: Kita-Fachberatung, Erziehungsberatungsstelle für Familien,
Frühförderstelle, Schulpsychologischer Dienst und Fachberatung des Trägers. Zu jeder Kategorie gibt
es die Zeile „Kontakt (von Hand eintragen)“. Die App kennt keine Adresse und keine Telefonnummer.

## Technik

- ES-Module, keine Abhängigkeiten. Die Bausteine kommen aus `packages/kinder-ui` (`el`) und
  `packages/kinderschutz` (Netzwerk-Wächter, beim Start aufgerufen).
- `index.html` mit CSP `default-src 'self'; style-src 'self' 'unsafe-inline'`. Keine fremden Schriften,
  Skripte oder Adressen.
- `logik.mjs` ist reine Logik ohne DOM: Blöcke, Fragen, Ausschlüsse, Zählung, Bericht.
- `app.mjs` baut die Seite einmal auf. Eine Antwort ändert nur die Knöpfe ihrer Frage (`aria-pressed`),
  die Zählung ihres Blocks und die Berichtsvorschau.
- Die Knöpfe haben als `aria-label` den sichtbaren Text, dann die Frage.

## Tests

37 Tests in zwei Dateien:

- `test/logik.test.mjs`: genau die 24 Aufgaben mit Seiten, Blocknamen, Burnout-Frage mit Wortlaut und
  Hinweis, Ausschlüsse mit Seiten, Zählung je Block, Bericht ohne Prozentzeichen, keine Summe in der
  Schnittstelle.
- `test/regeln.test.mjs`: Quelltext. Keine fremde Adresse, nichts gespeichert, genau ein Eingabefeld (bei
  den Anlaufstellen), keine Kontaktdaten, keine Modellnamen, keine Rechtsnormen, keine Ampel und keine
  Prozentzahl, keine Kästchen, Häkchen, Sterne oder Emojis, keine Zeile für einen Namen, Druckbogen ohne
  Bildschirmzustand, Druck-CSS eingebunden, Sprache und Richtlinien in `index.html`.

Lauf im Wurzelordner des Repos:

```bash
node --test apps/kita-unterstuetzungs-navigator/test/*.test.mjs
```

## Starten

Im Wurzelordner des Repos `npm run dev` ausführen. Der Server meldet seinen Port. Dann die Seite
`/apps/kita-unterstuetzungs-navigator/` öffnen.

## Quellen

- Praleska, Anhang „Психологическая служба в дошкольном учреждении“, S. 312–317. Geprüft auf diesen Seiten.
- docs/02-anforderungen.md, Z. 22 (keine externen Anfragen) und Z. 141–146 (keine Bewertung eines Kindes).
- docs/10-praleska-baukasten.md, Katalog Nr. 93.

Offene Punkte stehen in `GDD.md`.
