# Kurz-GDD: Erfinder-Werkstatt 🛠️

**Einheit aus Katalog:** docs/10 (Praleska) Kinder-Apps Nr. 16 —
«Erfinder-Werkstatt: Neue Dinge gestalten». **Engine:** eigener
Generator + Simulator mit `kinder-ui`. Zielgruppe: 8–12 eigenständig.

## 1. Kernaussage

„Sei mal kreativ“ ist keine Anleitung. Erfinden geht fast immer so: etwas
nehmen, das es schon gibt, und **genau eine** Eigenschaft verändern. Die
Werkstatt macht dieses Vorgehen sichtbar und wiederholbar — wer es
verstanden hat, braucht die App nicht mehr.

## 2. Modus 1: Neu entwerfen

12 Alltagsgegenstände × 8 Veränderungskarten = **96 Aufträge**. Die
Karten decken die Katalog-Methoden ab: Größe ändern, Material tauschen,
ein Teil weglassen, etwas dazubauen, zusammenklappbar machen, umdrehen,
leiser/lauter machen, für jemand anderen bauen.

Zu jedem Auftrag stellt die App vier Leitfragen, in die der Gegenstand
grammatisch korrekt eingesetzt wird: `akkusativ()` bildet der→den,
die→die, das→das, sodass „Wer soll **den Tisch** benutzen?“ und „Wer soll
**die Lampe** benutzen?“ herauskommt. Der Validator verlangt für jeden
Gegenstand einen brauchbaren Artikel, und ein Test stellt sicher, dass
nach dem Einsetzen **kein Platzhalter** stehen bleibt.

`baueAuftrag` bekommt die Zufallsquelle als Parameter (Katalogvorgabe
„isolierte Erzeugerfunktion“) und ist damit im Test vollständig
festlegbar. Zwei Aufträge hintereinander sind nie identisch — über 300
Ziehungen geprüft.

**Gezeichnet wird auf Papier.** Es gibt keine Eingabefelder; die App gibt
den Anstoß und die Fragen, nicht das Werkzeug. Deshalb speichert sie
auch nichts.

Eine Karte fällt bewusst aus der Reihe: „Bau es für jemand anderen“
nennt ausdrücklich eine Hand, die nicht greifen kann, jemanden, der
nichts sieht, und ein Kind im Rollstuhl — per Test festgehalten.

## 3. Modus 2: Natur & Technik — die tragende Unterscheidung

Zehn Paare, und jedes trägt ein Feld `art`:

- **`abgeschaut`** — jemand hat wirklich hingesehen und nachgebaut.
  Klettverschluss ← Klettenfrucht (de Mestral, 1950er), selbstreinigende
  Fassade ← Lotosblatt (Barthlott), Rillenfolie am Flugzeug ← Haihaut,
  Lilienthals Gleiter ← Storchenflügel (Buch von 1889), Wabenplatte ←
  Bienenwabe.
- **`aehnlich`** — sieht nur so aus. Hubschrauber und Libelle, U-Boot und
  Fisch, Pinzette und Krebsschere, Ultraschall und Fledermaus (gleiches
  Prinzip, aber die Übernahme ist nicht belegt) — und **das Rad**, für
  das es in der Natur überhaupt kein Vorbild gibt, weil sich ein
  Körperteil nicht endlos drehen kann.

Bei einem `aehnlich`-Paar lautet die richtige Antwort immer „Niemand —
…“, und das nur ähnliche Lebewesen steht als Ablenker daneben. Sonst
würde die App auf die Frage „Wovon ist das abgeschaut?“ ausgerechnet die
Verwechslung belohnen, die sie auflösen soll; der Validator erzwingt es.

Die Haihaut-Karte nennt bewusst die **Rillenfolie am Flugzeug** und nicht
den Schwimmanzug: Die schnellen Anzüge wurden nicht wegen einer
Haihaut-Struktur verboten, sondern weil ihr Material den Körper
zusammenpresste und Auftrieb gab. Genau das steht als Richtigstellung in
der Erklärung — ein Bionik-Mythos in einer App, die Bionik-Mythen
auflöst, wäre besonders peinlich.

Der Validator erzwingt diese Trennung, damit die App aus Ähnlichkeit
keine Erfindungsgeschichte macht:

| Regel | Warum |
| --- | --- |
| `abgeschaut` braucht ein `beleg`-Feld ≥80 Zeichen | sonst wäre es eine Behauptung |
| `aehnlich` darf **kein** `beleg` tragen | sonst schmuggelt sich eine Erfindungsgeschichte ein |
| `aehnlich` muss in der Erklärung „nicht abgeschaut“ (o. ä.) sagen | das Kind muss den Unterschied lesen, nicht raten |
| beide Sorten müssen vorkommen | eine reine Bioniksammlung wäre die halbe Wahrheit |

Ein Test prüft zusätzlich, dass jeder Beleg etwas Konkretes nennt — eine
Jahreszahl, eine Person, ein Patent, eine Verwendung — statt vage zu
bleiben.

## 4. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten,
**kein localStorage** — es gibt nichts zu löschen, weil nichts anfällt.
Vorlesefunktion für Auftrag und Erklärung (BFSG). eltern.html, im
Sammelband.

## 5. Tests

`test/logik.test.mjs` (9): Daten gültig und ≥60 Kombinationen; Artikel
werden korrekt in den Akkusativ gesetzt und jeder Gegenstand trägt einen
gültigen; `baueAuftrag` ersetzt jeden Platzhalter; keine zwei gleichen
Aufträge hintereinander (300 Ziehungen mit echtem Zufall); jede
Bionik-Frage zeigt genau drei verschiedene Möglichkeiten inklusive des
Vorbilds; die vier Validator-Regeln zur `art`-Trennung greifen wirklich
(je eine Mutation pro Regel); im echten Datensatz stehen ≥4 echte
Vorbilder und ≥4 Ähnlichkeitsfälle, die Belege nennen Konkretes,
Klettverschluss und Rad sind korrekt einsortiert; die Karten decken die
Katalog-Methoden ab und die Barrierefreiheits-Karte nennt konkrete
Nutzergruppen.

## 6. Erweiterungen (Katalog)

Druckbares Auftragsblatt mit Feldern für die vier Leitfragen
(`quiz-karten-druck`), Modus „zwei Gegenstände verschmelzen“, Brücke zu
`mathe-entdecker` (Maße und Proportionen am eigenen Entwurf) und zu
`ornament-werkstatt` (Gestaltung der Oberfläche).
