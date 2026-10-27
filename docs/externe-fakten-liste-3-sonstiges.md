# Externe Fakten, Liste 3: Sonstiges

Stand 27.10.2026, Strang Г: Normen (DIN, EN, ISO), Verbände und Studien ohne Fundstelle.

**11 Zeilen in 8 Apps.** Vorschläge je Handlung: Quelle und Vermerk „maschinell nachgelesen“ 2, Vermerk „Eigenentwurf, fachlich nicht geprüft“ 1, Fehlalarm, nichts ändern 8.

Befunde, die über fehlende Fundstellen hinausgehen (falsche oder unsichere Aussagen), sind in `docs/externe-fakten-befunde.md` gesammelt. Die Liste ändert nichts am Repo. Jede Zeile hat genau einen Vorschlag; Änderungen und Streichungen geschehen erst nach dem „да“ von Max (je Liste oder je App). Den vollen Wortlaut aller Vorschläge enthält `docs/externe-fakten-vorschlaege.json` (Feld `neuer_text`).

| Handlung | Bedeutung |
|---|---|
| Quelle ergänzen | die Aussage ist belegbar; die Fundstelle steht in der Spalte „Quelle / Neuer Text“ |
| Quelle und Vermerk | die Norm wurde gegen den Wortlaut nachgelesen; Quelle plus vorgeschlagener Vermerk „Wortlaut maschinell nachgelesen, nicht durch Menschen geprüft“ |
| Vermerk Eigenentwurf | eigener, fachlich nicht geprüfter Text; „(Eigenentwurf, fachlich nicht geprüft)“ wird angehängt, der Inhalt bleibt |
| Streichen | die Zeile trägt nichts, was die App braucht, und ist nicht zu belegen |
| Fehlalarm | der Zähler irrt (andere Bedeutung, Verneinung, Prüfmuster); die Zeile bleibt, der Zähler wird angepasst |

## bot-oder-buddy (1)

| Zeile | Text | Vorschlag | Quelle / Neuer Text | Begründung |
|---|---|---|---|---|
| `daten/dialog.json:161` | "bot": "Egal, was du fühlst: Ich fühle es zu 100 % mit! Traurig? Ich auch! Fröhlich? Ich auch! Wir sind wie Zwillinge! 👯", | Fehlalarm, nichts ändern |  | „100 %“ steht in der erfundenen Antwort eines Bots, der das Spiegeln als Trick vorführt, und ist keine Behauptung über Recht, Geld oder Gesundheit; das Feld hinweis in der nächsten Zeile entlarvt sie. |

## daten-schatz (1)

| Zeile | Text | Vorschlag | Quelle / Neuer Text | Begründung |
|---|---|---|---|---|
| `daten/szenarien.json:112` | "situation": "Im Spiel blinkt ein Countdown: „MEGA-DEAL! Nur noch 9:59 Minuten: Super-Paket 70 % billiger!“", | Fehlalarm, nichts ändern |  | „70 % billiger“ ist ein erfundener Werbetext in einer Übungssituation (Countdown-Trick) und keine Preisbehauptung. |

## lootbox-labor (2)

| Zeile | Text | Vorschlag | Quelle / Neuer Text | Begründung |
|---|---|---|---|---|
| `app.mjs:82` | el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Willkommen im Lootbox-Labor! Du bekommst ${START_TASCHENGEL… | Fehlalarm, nichts ändern |  | 1, 9 und 90 Prozent sind die selbst gesetzten Wahrscheinlichkeiten des Simulators (logik.mjs) und keine Behauptung über die Wirklichkeit. |
| `eltern.html:15` | <p>Lootboxen sind Zufalls-Kisten in Spielen: Man bezahlt einen festen Preis, was herausfällt, entscheidet der Zufall. Der BzKJ-Gefährdungsatlas führt… | Quelle und Vermerk „maschinell nachgelesen“ | <p>Lootboxen sind Zufalls-Kisten in Spielen: Man bezahlt einen festen Preis, was herausfällt, entscheidet der Zufall. Der BzKJ-Gefährdungsatlas führt solche Kostenfallen und glücksspielähnlichen Mechaniken als eigenes Risiko-Phänomen (Quelle: BzKJ, Gefährdung… | Der Gefährdungsatlas führt Kostenfallen (mit Lootboxen) und simuliertes Online-Glücksspiel als eigene Phänomene; die Prozentwerte der Zeile sind Spielparameter. **Hinweis:** Der Atlas führt zwei getrennte Phänomene (Kostenfallen; Simuliertes Online-Glücksspiel), im Text steht „eigenes Risiko-Phänomen“ im Singular. |

## muenz-trick (3)

| Zeile | Text | Vorschlag | Quelle / Neuer Text | Begründung |
|---|---|---|---|---|
| `eltern.html:21` | <li><strong>„+20% extra!“</strong> lässt große Pakete günstiger wirken – damit mehr gekauft wird als gebraucht.</li> | Fehlalarm, nichts ändern |  | „+20% extra!“ ist das Lockangebot im nachgebauten Shop der App, also Spieldaten und keine Behauptung über Geld in der Wirklichkeit. **Hinweis:** Zeile 15 derselben Seite nennt den BzKJ-Gefährdungsatlas ohne Fundstelle (Kapitel „Kostenfallen“, S. 162–163, 2. Auflage 2022); der Zähler erfasst das nicht. |
| `logik.mjs:10` | { juwelen: 550, cent: 399, lockung: '+10% extra!' }, | Fehlalarm, nichts ändern |  | Die Zeichenkette „+10% extra!“ ist die Beschriftung eines Pakets im nachgebauten Shop (Spieldaten) und keine Behauptung. |
| `logik.mjs:11` | { juwelen: 1200, cent: 799, lockung: '+20% extra!' }, | Fehlalarm, nichts ändern |  | Die Zeichenkette „+20% extra!“ ist die Beschriftung eines Pakets im nachgebauten Shop (Spieldaten) und keine Behauptung. |

## sprich-mit-mir (1)

| Zeile | Text | Vorschlag | Quelle / Neuer Text | Begründung |
|---|---|---|---|---|
| `logik.mjs:188` | fehler.push('bildschirm.quelle: die Behörde heißt seit Februar 2025 BIÖG – „BZgA“ allein ist veraltet'); | Fehlalarm, nichts ändern |  | Die Zeile ist die Fehlermeldung des Daten-Prüfers (Prüfmuster) und erscheint nur bei fehlerhaften Daten; die Namensangabe selbst stimmt (BMG-Pressemitteilung vom 13.02.2025: Umbenennung der BZgA in BIÖG per Ministererlass). |

## stark-und-gesund (1)

| Zeile | Text | Vorschlag | Quelle / Neuer Text | Begründung |
|---|---|---|---|---|
| `eltern.html:15` | <p>Ein Quiz zum gesunden Alltag von Kindern: tägliche Bewegung (rund eine Stunde), ausreichend Schlaf (etwa 9–11 Stunden), eine bunte, wasserbasierte… | Vermerk „Eigenentwurf, fachlich nicht geprüft“ | <p>Ein Quiz zum gesunden Alltag von Kindern: tägliche Bewegung (rund eine Stunde), ausreichend Schlaf (etwa 9–11 Stunden), eine bunte, wasserbasierte Ernährung, Zeit draußen im Tageslicht, bewusste Bildschirm-Pausen, Hygiene und das Achten auf Körpersignale w… | Die Zahlen (rund eine Stunde Bewegung, 9 bis 11 Stunden Schlaf) und die Berufung auf BIÖG und DGE stehen ohne Fundstelle. **Hinweis:** Fachliche Prüfung nötig: Das BIÖG nennt für 7 bis 18 Jahre 1,5 Stunden Bewegung (kindergesundheit-info.de), die eine Stunde ist der WHO-Wert, und für 9 bis 11 Stunden Schlaf wurde in der Suche keine … |

## uhr-und-kalender-kind (1)

| Zeile | Text | Vorschlag | Quelle / Neuer Text | Begründung |
|---|---|---|---|---|
| `app.mjs:31` | style: 'position:absolute;bottom:50%;left:50%;width:${breite}px;height:${hoehe}px;margin-left:-${breite / 2}px;background:${farbe};border-radius:${br… | Fehlalarm, nichts ändern |  | Die Prozentwerte stehen im Stil der Uhrzeiger (transform-origin:50% 100%), den der Zähler nicht als CSS erkennt. **Hinweis:** Mit transform-origin in der CSS-Eigenschaftsliste des Zählers entfällt die Zeile (an einer Kopie geprüft). |

## wachstums-bewegungs-begleiter (1)

| Zeile | Text | Vorschlag | Quelle / Neuer Text | Begründung |
|---|---|---|---|---|
| `daten/begleiter.json:118` | "bioeg": "Das Bundesinstitut für Öffentliche Gesundheit (BIÖG, bis zum 13. Februar 2025 Bundeszentrale für gesundheitliche Aufklärung) sagt es Eltern… | Quelle und Vermerk „maschinell nachgelesen“ | BIÖG, kindergesundheit-info.de, Seite „Wie viel Bewegung ist gut?“ (Seitendatum 30.09.2026: 0 bis 3 Jahre so viel wie möglich; 4 bis 6 Jahre 3 Stunden und mehr; 7 bis 18 Jahre 1,5 Stunden und mehr); BIÖG, Themendossier „Kinder und Jugendliche brauchen täglich… | Die Altersblöcke, die Stunden und der Namenswechsel stehen im Wortlaut bei BIÖG und Bundesgesundheitsministerium. Gegenprobe: Handlung bleibt, aber die Fundstelle ist zu berichtigen: Die Zahlen stimmen mit den BIÖG-Seiten überein, doch der Monat „Januar 2025“… **Hinweis:** Die BIÖG-Texte sind selbst uneinheitlich (kindergesundheit-info: 7 bis 18 Jahre, Medienservice 2025: 6 bis 18 Jahre), und der Satz zum älteren Themenblatt ist nicht belegt. *(durch die Gegenprobe geändert)* |
