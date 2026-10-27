# Kurz-GDD: Kunst-Entdecker 🎨

**Einheit aus Katalog:** docs/10 (Praleska) Kinder-Apps Nr. 21 —
«Kunst-Entdecker». **Engine:** eigene Galerie + Ratemodi mit `kinder-ui`.
Zielgruppe: 5–7 in Ko-Nutzung, Ausbau 8–12.

## 1. Kernaussage

Zwei Fragen genügen, um vor jedem Kunstwerk auskunftsfähig zu sein:
**Womit ist es gemacht?** (Gattung) und **was ist zu sehen?** (Genre).
Beides lässt sich an neun echten Museumswerken üben — und danach vor
jedem Original wieder anwenden.

## 2. Die drei Modi

- **Galerie** — alle neun Werke als Kacheln, jedes groß anzusehen mit
  einem „Hinsehen“-Text, der sagt, worauf sich der Blick lohnt.
- **Welche Gattung?** — Malerei, Grafik, Skulptur.
- **Welches Genre?** — Porträt, Landschaft, Stillleben.

Angeboten werden stets **alle drei** Möglichkeiten der jeweiligen Sorte.
Würde die App nur die zutreffenden anbieten, wäre die Auswahl selbst
schon ein Hinweis; ein Test hält das fest. Nach jeder Antwort zeigt die App die
Lösung mit Erklärung; das Kind wird nicht bewertet: kein Zähler der richtigen
Antworten, keine Punkte, kein Rekord, keine Ränge.

## 3. Herkunft der Bilder — der Grund für genau eine Quelle

Alle Werke stammen aus der **Open-Access-Sammlung des Metropolitan
Museum of Art** und stehen unter **CC0**. Jedes trägt Künstler, Titel,
Jahr, Einrichtung, Inventarnummer und Lizenz mit sich; der Validator
verlangt alle fünf Angaben und lehnt jede Lizenz ab, die nicht CC0 ist.

**Warum CC0 und nicht einfach „ist doch gemeinfrei“?** Rechtlich zwingend
wäre CC0 seit 2021 nicht mehr: **§ 68 UrhG** stellt klar, dass
originalgetreue Reproduktionen gemeinfreier visueller Werke keinen
eigenen Schutz genießen. Der Gesetzgeber hat damit die frühere
Rechtsprechung überholt — der BGH hatte 2018 im Fall der
Reiss-Engelhorn-Museen noch Lichtbildschutz nach § 72 UrhG angenommen,
und genau darauf reagiert § 68 (Umsetzung von Art. 14 der Richtlinie
(EU) 2019/790).

Die Entscheidung für CC0 bleibt trotzdem, aus zwei praktischen Gründen:
Sie klärt zusätzlich die **Nutzungsbedingungen** der Einrichtung, die von
der urheberrechtlichen Lage unabhängig sind, und sie liefert je Werk eine
nachprüfbare Herkunft, die die App auch anzeigt. Der Grund steht im Feld
`hinweis` **in den Daten**, nicht nur in der Dokumentation, und ein Test
prüft ihn — samt der richtigen Fundstelle.

Die Bilder sind auf 420 px verkleinert und als `data:`-URI eingebettet
(zusammen rund 460 kB). Die App lädt nichts nach und stellt keine einzige
Anfrage; ein Test sucht in den Daten nach Adressen und lässt nur die
Museums-Objektseiten als reine Belegangabe durchgehen.

**CSP:** Wegen der eingebetteten Bilder trägt diese App
`img-src 'self' data:`. Die Ausnahme bleibt eng — Bilder führen keinen
Code aus. `tools/serve.mjs` sendet dieselbe Ergänzung, sonst blockierte
der Dev-Server die eigenen Bilder.

## 4. Zwei eingebaute Ehrlichkeiten

- **Nicht alles passt in drei Schubladen.** Dürers *Rhinozeros* ist ein
  Tierbild — weder Porträt noch Landschaft noch Stillleben. Es trägt
  `genre: null`, kommt im Gattungs-Rätsel vor und im Genre-Rätsel nicht.
  Ein Test verlangt ausdrücklich, dass es mindestens ein Werk ohne Genre
  gibt: eine Sammlung, in der alles glatt aufgeht, wäre gelogen.
- **Die vierte Gattung wird gezeigt, aber nicht abgefragt.** Architektur
  passt nicht ins Museum; gezeigt wird Schinkels Fassadenzeichnung. Sie
  trägt die Sondergattung `architektur-tafel` und wird nie zur Frage,
  denn das Blatt *ist* Grafik und *zeigt* Architektur — es hätte zwei
  richtige Antworten. Die App sagt das dem Kind auf der Tafel selbst.

## 5. Aufhänger für das Gespräch

Dürer hat **nie ein Nashorn gesehen**. Er arbeitete nach einer
Beschreibung und einer fremden Skizze — daher die Panzerplatten und das
Hörnchen auf dem Rücken, das es nicht gibt. Ein Test nagelt diesen Text
fest; er ist der beste Einstieg der Sammlung und passt zur Linie von
`erfinder-werkstatt` (abgeschaut vs. nur ähnlich).

## 6. Werkzeug

`werkzeug/bilder-bauen.mjs` holt die Bilder über die Met-API, prüft
`isPublicDomain`, verkleinert über eine Canvas und schreibt
`daten/werke.json`. Es ist ein Einmal-Werkzeug und **kein Laufzeit-Code**;
mitgeliefert, damit die Bildherkunft reproduzierbar bleibt. Die
Zuordnungen und Texte stehen in `daten/werke.quelle.json`.

## 7. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten,
**kein localStorage**, also auch keine Karte „Meine Daten löschen“.
Jedes Bild trägt einen Alternativtext mit Titel und Künstler, jede
Galerie-Kachel ein `aria-label`; Vorlesefunktion für Bildtexte (BFSG).
eltern.html, im Sammelband.

## 8. Tests

`test/logik.test.mjs` (11): Daten gültig; jedes Bild ist eine eingebettete
data-URI und in den Daten steht keine Adresse außer den Museums-Belegen;
die Herkunft ist bei jedem Werk vollständig und CC0, und der Validator
weist eine Nicht-CC0-Lizenz sowie eine unvollständige Herkunft zurück;
die Architektur-Tafel kommt in keinem Ratemodus vor und darf kein Genre
tragen; jede Gattung hat ein Werk, jedes Genre mindestens zwei, und es
gibt mindestens ein Werk ohne Genre; `baueFrage` liefert über je 300
Ziehungen drei verschiedene Optionen mit der Lösung darunter, nie die
Tafel, nie zweimal dasselbe Werk; die Optionen sind immer alle drei
Sorten; `gattungVon`/`genreVon`; die Bildtexte sind ausführlich und der
Dürer-Irrtum steht drin; Abwesenheits-Test (kein Zähler, keine Punkte, kein
Rekord, keine Ränge im App-Code); Speicherregel (kein Speicher, darum keine
Löschkarte, Eltern-Seite sagt „speichert nichts“).

## 9. Erweiterungen (Katalog)

Weitere Werke als Content-Pack (dieselbe CC0-Regel), Modus „zwei Werke
vergleichen“, Brücke zu `ornament-werkstatt` (Muster in der Kunst) und
zu `erfinder-werkstatt` (nach der Natur arbeiten oder nach Hörensagen),
Museumsbesuch-Karte zum Ausdrucken.
