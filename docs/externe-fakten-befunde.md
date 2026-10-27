# Externe Fakten: Befunde, die über fehlende Fundstellen hinausgehen

Stand: 27.10.2026, Strang Г (Entscheidung Max 12а). Beim Nachlesen der 326 Zeilen haben die Schreiber und die unabhängige Gegenprobe Stellen gefunden, an denen die App nicht nur eine Fundstelle braucht, sondern etwas Falsches, Veraltetes oder Stärkeres als die Quelle sagt. Diese Seite ordnet sie nach Dringlichkeit. Nichts davon ist im Repo geändert; jede Zeile steht mit ihrem Vorschlag in den Listen (`docs/externe-fakten-liste-1-recht-geld.md`, `…-2-gesundheit.md`, `…-3-sonstiges.md`; voller Wortlaut in `docs/externe-fakten-vorschlaege.json`).

## A. Kinder sehen eine falsche oder unsichere Aussage (zuerst entscheiden)

| App und Stelle | Befund | Vorschlag |
|---|---|---|
| `notruf-held`, `daten/situationen.json:22` (Szene n07) | Die Szene „Im Treppenhaus ist dichter Rauch“ rät: „Raus gehen und von draußen die 112 rufen.“ Das BBK rät dagegen: nie durch verrauchte Räume oder Treppenhäuser flüchten (Seite „Was tun, wenn es brennt?“, am 27.10.2026 gelesen). Der Rat kann im Fall „Kind in der Wohnung, Rauch im Treppenhaus“ falsch sein. | Szene n07 streichen, bis die Feuerwehr den Text geprüft hat. Es bleiben 7 von 8 Szenen; der Test verlangt mindestens 6; README und GDD nennen 8 und werden angepasst. |
| `kinderrechte-entdecker`, `daten/fragen.json:24` | „Deutschland hat ihn 1992 unterschrieben“ stimmt nicht: unterzeichnet am 26. Januar 1990, Ratifikationsurkunde am 6. März 1992 hinterlegt, in Kraft seit 5. April 1992 (BGBl. 1992 II S. 990). | Satz ändern in „Deutschland hat ihn 1990 unterschrieben und 1992 bestätigt“. |
| `stark-im-chat-plus`, `daten/szenarien.json:127` | Der Text lässt Plattformen Falschmelder „sperren“. Art. 23 Abs. 2 DSA verlangt, die Bearbeitung von Meldungen häufiger Falschmelder auszusetzen. | Satz an den Wortlaut anpassen (Aussetzen der Bearbeitung, nicht Sperren der Person). § 126a StGB bleibt belegt. |
| `barriere-spuernasen`, `logik.mjs:54` | „Genau das verlangt …“ trägt Art. 23 UN-KRK nicht; der Artikel spricht von aktiver Teilnahme von Kindern mit Behinderung am Leben der Gemeinschaft. | Satz enger am Wortlaut („Dazu passt das Recht auf Teilhabe …“), Fundstelle in ein Feld `quelle`. |

## B. Apps für Eltern, Fachkräfte und Betreiber*innen: falsche Fundstelle oder Aussage stärker als die Quelle

| App und Stelle | Befund |
|---|---|
| `elternabend-kit` `daten/kit.json:69`, README Z. 15, GDD Z. 16; `kria-check` `daten/kriterien.json:50` | „§ 10b JuSchG“ für sichere Voreinstellungen ist falsch. § 10b regelt entwicklungsbeeinträchtigende Medien; Voreinstellungen stehen als mögliche Vorsorgemaßnahme in § 24a Abs. 2 Nr. 6 JuSchG, die Pflicht zu geeigneten Maßnahmen folgt aus Art. 28 Abs. 1 DSA. |
| `vorsorge-check-juschg` `app.mjs:46`, `daten/kriterien.json` | Die Nummern in `bezug` und in den Hilfetexten weichen von § 24a Abs. 2 JuSchG ab (Nr. 6 sind die Voreinstellungen, Nr. 1 das Melde- und Abhilfeverfahren). Das Etikett „Was § 24a hier verlangt“ behauptet eine Pflicht; Abs. 2 nennt Maßnahmen, die „in Betracht kommen“. |
| `selbststaendigkeits-leiter` `app.mjs:116` | Der Vermerk zum Stand der G-BA-Kinder-Richtlinie („zuletzt geändert am 15.05.2025“) ist überholt. Die Lesefassung gilt seit 1.1.2026; spätere Änderungen (18.06.2026, Beschluss vom 20.08.2026) berühren die drei zitierten Sätze nicht. Vorschlag: den Vermerk durch „Lesefassung in Kraft seit 01.01.2026“ mit Fundstelle ersetzen. |
| `vorlese-kompass` `daten/kompass.json:3` | „Kostenlos in jeder Bibliothek“ ist nicht haltbar (viele Stadtbibliotheken verlangen von Erwachsenen eine Jahresgebühr). |
| `foerder-navigator` `index.html:7` | „geprüften“ Angaben: die Daten stammen aus einer maschinellen Recherche ohne Prüfung durch Menschen („ohne Gewähr“). Nur die Anteilsfinanzierung des BzKJ (höchstens 80 %) wurde gegen das Förderprogramm 2026 gelesen. |
| `kria-check` `app.mjs:116` | Im Förderprogramm 2026 der BzKJ ist keine Folgenabschätzung als Anlage erwähnt; ob Anträge einen solchen Bericht annehmen, ist nicht belegt. |
| `leichte-sprache-werkstatt` `app.mjs:47`, `daten/arbeitsblaetter.json:2`, GDD Z. 11 | „BFSG-konform“: § 1 BFSG nennt bestimmte Produkte und Dienstleistungen; ob ein Arbeitsblatt-Werkzeug dazugehört, ist nicht belegt. |
| `sharenting-spiegel` `daten/szenarien.json:57` | Art. 16 UN-KRK schützt das Privatleben und die Ehre und nennt kein Recht am eigenen Bild; näher liegt § 22 KUG mit § 1626 Abs. 2 BGB. Juristische Prüfung nötig. |
| `lehrkraefte-szenariotraining` `daten/szenarien.json:73` | „Die DSGVO gilt auch für Fotos unter Schüler*innen“ ist nicht belegt (Haushaltsausnahme, Art. 2 Abs. 2 Buchst. c DSGVO). |
| `plattform-rechte-13` `daten/fragen.json:66, 82, 145` | „Besonders starke Löschrechte“ ist eine Zuspitzung (nur Art. 17 Abs. 1 Buchst. f betrifft Kinderdaten); ein „Recht auf verlässliche Information“ steht nicht in Art. 50 KI-VO (der Artikel trifft Anbieter und beruflich handelnde Betreiber); „sogar gegenüber den eigenen Eltern“ ist eine Auslegung. |
| `familien-datenschatz` `daten/szenarien.json:4, 24, 32` | „Verletzt dein Recht“ und „dein Chat ist privat“ sind stärker als die Quelle („verhältnismäßig“, „nicht ohne das Wissen des Kindes“). |
| `elternabend-kit` `daten/kit.json:57` | „Auch gegenüber den eigenen Eltern“ steht nicht wörtlich in Art. 16 UN-KRK, § 22 KUG, § 1626 Abs. 2 BGB; juristische Prüfung. |
| `datenschutz-baukasten` `logik.mjs:15` | Dass lit. f die richtige Grundlage für ein Kontaktformular ist, ist eine Einschätzung (je nach Anfrage kommt lit. b in Betracht); bei Kindern verlangt lit. f eine strengere Abwägung. |
| `spiral-stopper` `eltern.html:15` | „Was Forschung zu Hassrede zeigt“ ist im Gefährdungsatlas nicht belegt (das Wort Gegenrede kommt dort nicht vor). |
| `wachstums-bewegungs-begleiter` `daten/begleiter.json:118` | Die Altersangaben der BIÖG-Texte sind selbst uneinheitlich (7 bis 18 Jahre in einem Text, 6 bis 18 Jahre in einem anderen). |

## C. Sicherheit und Gesundheit bei Kindern unter drei Jahren: Fachprüfung nötig

`spielzeug-check-u3` (mehrere Zeilen, darunter 143, 240, 242, 243, 380: Normabschnitte tragen nur einen Teil der Aussage; „keine losen Magnete“ ist strenger als die Norm), `erste-kuenstler` (Zeilen 100, 136, 141, 161, 166, 171: Verschlucken und Ersticken, Maßstab Prüfzylinder EN 71-1), `bewegungs-kartei-erstes-jahr:399`, `fuehl-sortier-werkstatt:139` (der Vermerk steht dort in altem Wortlaut), `musikmomente-1-3:13` (Dezibelwerte). Vorschlag: der Vermerk „(Eigenentwurf, fachlich nicht geprüft)“ am Satz (Entscheidung 13а); die Fachprüfung bleibt offen.

## Wie es weitergeht

Max antwortet je Liste oder je App mit „да“, „нет“ oder einer Ausnahme. Danach setzt ein Schreiber mit unabhängigem Prüfer genau die Zeilen um, die freigegeben sind (Tests, Wertungs-Stand und Zähler externer Fakten bleiben grün; der Zähler sinkt). Abschnitt A empfehle ich unabhängig von den Listen sofort zu entscheiden.
