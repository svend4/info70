# Kurz-GDD: Ornament-Werkstatt 🧵

**Einheit aus Katalog:** docs/10 (Praleska) Kinder-Apps Nr. 8 —
«Ornament-Werkstatt». **Engine:** Muster-Fortsetzung (Regelaufgaben) +
freies Legen auf Raster-Vorlagen. Zielgruppe: 5–7 kurze Einheiten,
Vertiefung 8–12.

## 1. Kernaussage

Ornamente sind gebaute Mathematik. Zwei Ideen stecken darin, beide werden
geübt: die **Periode** (ein kleines Stück wiederholt sich) und die
**Spiegelachse** (links wie rechts). Modus 1 „Muster fortsetzen“ zeigt
eine Reihe aus sechs Kacheln und ein Fragefeld; vier Antworten stehen zur
Wahl, danach wird die Regel im Klartext genannt. Modus 2 „Selbst legen“
gibt fünf Vorlagen (Bordüre, Teppich, Teller, Hemd, Osterei), sechs
Formen (Raute, Quadrat, Kreis, Dreieck, Kreuz, Stern) und vier Farben;
ein Spiegel-Schalter setzt jede Kachel automatisch auch auf die
gegenüberliegende Seite.

## 2. Zielgruppe

Kinder 5–7 (kurz, gern mit Erwachsenem), 8–12 (Vertiefung: eigene Regeln
erfinden, Symmetrie prüfen). Nachbarn: formen-fuchs (Formen erkennen),
muster-meister (Reihen), falt-werkstatt (Symmetrie im Papier),
rhythmus-orchester (Periode im Klang).

## 3. Ablauf

1) Muster fortsetzen: Reihe + ❓ → vier Antwortkacheln (gemischt) →
   Rückmeldung nennt die Regel und erklärt sie („Zwei gleiche, dann eine
   andere“) → nächste Aufgabe. Ein Zähler sagt, wie viele Muster
   fortgesetzt wurden; er verschwindet beim Schließen.
2) Selbst legen: Vorlage wählen → Form und Farbe wählen → Felder tippen →
   „↔️ Spiegel prüfen“ sagt, ob links und rechts gleich sind →
   „🧽 Alles leeren“. Jede Vorlage behält ihr Werk, solange die Seite
   offen ist; ein Radiergummi nimmt einzelne Kacheln zurück.

## 4. Didaktik / Nutzen

Adaption laut Katalog: Ornament als Muster mit Regel, nicht als Dekor.
Muster fortsetzen ist eine Vorstufe des Rechnens — wer eine Regel erkennt
und weiterführt, denkt algebraisch, lange bevor Buchstaben auftauchen.
Deshalb wird die Regel nach jeder Antwort **benannt**; das Aussprechen
zählt mehr als der Treffer.

Fachlich abgesichert per Validator/Tests: `naechsteKachel` liest die
Periode aus der gezeigten Reihe und liefert genau die Kachel, die
`baueAufgabe` als Lösung setzt — der Zusammenhang ist für alle vier
Regeln als Testinvariante festgeschrieben, damit keine unlösbare Aufgabe
entstehen kann. Die drei Ablenker entstehen aus der zweiten Kachel und
zwei Kreuzungen (Form A + Farbe B, Form B + Farbe A); da sich die beiden
Kacheln immer in Form **und** Farbe unterscheiden, kann kein Ablenker
versehentlich richtig sein. Die Umrisse aller Vorlagen müssen
spiegelsymmetrisch sein, sonst zeigte der Spiegel-Schalter auf ein Feld,
das es nicht gibt — auch das prüft der Validator.

**BFSG:** Jede Kachel trägt ihren Namen als `aria-label` („Raute in
Rot“), die Reihe lässt sich vorlesen, der Status steht als Text
(`aria-live`). Formen sind zusätzlich durch die Form unterscheidbar,
nicht nur durch Farbe.

**Eigenproduktion:** Formen und Vorlagen sind eigens für diese App
entworfen; sie zitieren keine bestimmte Stickerei und kein geschütztes
Motiv. Aus dem Katalog stammt nur das Prinzip (Ornament = Regel +
Wiederholung + Spiegelung).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten,
**speichert nichts** — gelegte Ornamente bleiben nur, solange die Seite
offen ist. Keine Zeitmessung, keine Bewertung, kein Punktestand außer dem
flüchtigen Zähler der Sitzung. eltern.html, im Sammelband.

## 6. Tests

`test/logik.test.mjs` (8): Vorlagen gültig (5 Stück, Umrisse
spiegelsymmetrisch, genug Felder, ids in Reihenfolge); `musterFolge` für
alle vier Regeln und `periodeVon` als kleinste Periode; `naechsteKachel`
inkl. leerer und fehlender Reihe; `baueAufgabe` mit injiziertem Wähler
deterministisch, Lösung folgt aus dem Gezeigten, Lösung zuerst; Ablenker
nie richtig und nie doppelt; `spiegelIndex`/`istSymmetrisch` inkl.
ungerader Spaltenzahl; Kachel-Hilfen und unbekannte ids; acht
Negativ-Proben des Validators (Zeile zu kurz, schiefer Umriss, zu wenige
Felder, fremde Zeichen, zu breit, fehlende Gestaltungsidee, doppelte ids,
zu wenige Vorlagen).

## 7. Erweiterungen (Katalog)

Eigene Regeln erfinden und vom Kind fortsetzen lassen, Drehsymmetrie
(Teller vierteln), Muster als Kästchenpapier-Vorlage drucken,
Farb-Palette der Jahreszeiten, Bordüren aneinanderhängen zu einem langen
Band.
