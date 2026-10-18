# Plan: Umsetzung des Katalogs nach Pralęska (Gruppe 2)

Stand: 18.10.2026, nach Welle 91. Dieser Plan ist die Arbeitsgrundlage für die nächsten Wellen. Offene Fragen und Hinweise stehen separat in `docs/fragen-und-hinweise.md`; Entscheidungen zu einzelnen Einheiten in `docs/offene-punkte-kita.md`.

## 1. Zwei Gruppen

- **Gruppe 1 – Forschungs-Baukasten.** `docs/09-baukasten-katalog.md` (Achsen A bis H, 139 Einheiten) und `docs/ideen-katalog.json` (139 Ideen, Top-30). Grundlage sind Recherchen und Rechtsrahmen (UN-KRK, fragFINN, DSGVO, JMStV, BFSG, AI Act). Die Gruppe stammt nicht aus der Pralęska.
- **Gruppe 2 – Dokumente der Pralęska.** `docs/10-praleska-baukasten.md` (131 Einheiten in acht Abschnitten, Zeilen 279 bis 490) und `docs/praleska-katalog.json` (131 Ideen, 8 Beobachtungen, Top-30). Grundlage ist das russische Lehrbuch der Pralęska (Programm für die vorschulische Erziehung). Dieser Plan betrifft diese Gruppe.

**Wo der Text der Pralęska liegt:** nicht im Repository. Die Arbeitskopie (Formfeed-getrennt, gedruckte Seite = Formfeed-Anzahl davor + 1) liegt außerhalb des Repos unter `scratchpad/quelle/all.txt`. Das ist ein Risiko: Ohne Kopie im Repo lassen sich Seitenangaben nicht erneut prüfen. Vorschlag in `docs/fragen-und-hinweise.md`, Punkt B1.

## 2. Stand der Gruppe 2

Insgesamt **131 Einheiten**: gebaut 53 (davon 4 in Variante A ohne Kinderbezug), teilweise 57, offen 11, unklar 3, nicht bauen 3.

| Abschnitt | Einheiten | gebaut | gebaut (Variante A) | teilweise | offen | unklar | nicht bauen |
|---|---|---|---|---|---|---|---|
| Детские приложения (5-7 и 8-12) | 23 | 19 | 0 | 4 | 0 | 0 | 0 |
| Приложения совместного использования (3-5) | 22 | 12 | 0 | 10 | 0 | 0 | 0 |
| Инструменты для родителей | 21 | 9 | 0 | 12 | 0 | 0 | 0 |
| Инструменты для воспитателей/Kita | 27 | 12 | 4 | 9 | 0 | 0 | 2 |
| Контент-паки (12), Функции (3), Документы (4) | 19 | 0 | 0 | 7 | 9 | 2 | 1 |
| Печатные материалы для Kita | 19 | 1 | 0 | 15 | 2 | 1 | 0 |

Die Zahlen stammen aus einer Inventur mit vierzehn Agenten (acht für Gruppe 2, sechs für Gruppe 1) und wurden danach geprüft (Abschnitt 4).

**Bedeutung der Begriffe.**
- *gebaut*: Eine App mit demselben Gegenstand, demselben Umfang und derselben Altersstufe existiert.
- *teilweise*: Ein Teil ist gebaut; Umfang oder Altersstufe weichen ab. Das ist die häufigste Lage und keine Mängelmeldung.
- *gebaut (Variante A)*: Die Kita-Einheit ist in einer Form ohne Kinderbewertung gebaut (Entscheidung nach docs/offene-punkte-kita.md, A13 und A14).
- *offen*: Kein Beleg für eine App.
- *unklar*: Eine ähnliche App existiert, die Zuordnung ist nicht sicher; eine Entscheidung ist nötig.
- *nicht bauen*: Regel- oder Politikgrund (Beobachtungsbogen je Kind, Krippen-Portfolio mit Freitexten).

## 3. Faktenstand

- Gruppe 2: 38 Einträge mit ausdrücklichem Vermerk im GDD oder README (Quelle gegen den Text geprüft). 66 Einträge nur mit Katalogtext. 27 Einträge, bei denen die Seitenangabe nur im Einzelfall gegen die Textkopie gestichprobt wurde.
- Gruppe 1: 2 Einträge mit Vermerk, 30 nur mit Katalogtext, 107 mit Quellen, die nicht im Repo liegen.
- Der Faktenstand ist die wichtigste Lücke. Die meisten gebauten Apps der Gruppe 2 haben keine geprüfte Quellenfassung. Das ist Arbeit für eigene Wellen (Abschnitt 7, Serie C).

## 4. Prüfung der Inventur

- **Fehlende Varianten.** Der Inventur-Agent fand vier Kita-Einheiten nicht (Nr. 1, 2, 8, 23): Ihre Apps haben neue Namen (`entwicklungs-kompass`, `tagesblick-fachkraft`, `eingewoehnungs-leitfaden`, `schulstart-begleiter`). Korrigiert: Status „gebaut (Variante A)“.
- **Ordner-Prüfung.** Alle 255 Ordner-Verweise in den Inventur-Ergebnissen wurden geprüft. Für Gruppe 2 existieren alle genannten Ordner. In Gruppe 1 fehlen elf Verweise: Sie zeigen auf gemeinsame Pakete (`kinder-ui`, `quiz-kern`) und auf `docs/11`. Das ist keine Fehlzuordnung, sondern eine Zuordnung zu Bausteinen, nicht zu Apps.
- **Eigene „teilweise“-Einträge.** Einige „teilweise“-Einträge (z. B. Erfolgs-Momente, Entdecker-Karten, Bewegungslandschaften, Werkstatt-Karten, Sport-Schnupper) sind selbst gebaut. Wir haben sie „teilweise“ genannt, weil der Katalog Passagen enthält, die die Quelle nicht trägt.
- **Stichprobe.** Die Angaben „gebaut“ wurden nicht Zeile für Zeile geprüft; die Agenten haben README und GDD gelesen und den Gegenstand verglichen. Eine vollständige Prüfung aller 53 „gebaut“-Einträge ist Teil von Serie C.
- **Quiz-Engine.** 35 Apps hängen an `quiz-kern`. Die Inventur hat dieses Regelproblem nicht als eigenen Befund geführt. Das Regelproblem (Rekord im localStorage, Ränge nach Punkten) gilt für alle diese Apps und ist in `docs/fragen-und-hinweise.md`, Punkt C1, ausführlich beschrieben.

## 5. Blockierende Entscheidungen

Diese Punkte bestimmen, welche Einheiten ohne Risiko gebaut werden können:
1. **quiz-kern** (C1 in `fragen-und-hinweise.md`): Der Engine speichert Rekorde im localStorage und vergibt Ränge. Neue Apps auf dieser Engine sind nicht zulässig, bis das geklärt ist. Betroffen sind Einheiten wie Content-Pack 3 (Verwandtschaft), 6 (Himmelsgucker), 9 (Farbwörter) und 10 (Musik-Lexikon).
2. **Prüfung der Seiten durch einen Menschen** (A18): Gilt für alle Apps mit Seitenangaben, auch für die neuen.
3. **Katalogtext Nr. 2 (A19)** beschreibt die verbotene Gruppierung „unsichere Kinder“.
4. **Beobachtungsbögen je Kind** (A13): Nicht bauen; betrifft Kita 18 und 20 sowie Krippen-Portfolio (Dokumente Nr. 17).
5. **Trostvers mit Kindernamen** (Funktion 1): Personenbezogenes Datum; Entscheidung nötig.

## 6. Einheiten im Detail (Gruppe 2)

Lesart: „Nächster Schritt“ ist die nächste Aktion für diese Einheit. Die Spalte „Faktenstand“ zeigt, wie die Quelle geprüft ist.

| Nr. | Abschnitt | Einheit | Status | App(s) | Faktenstand | Nächster Schritt |
|---|---|---|---|---|---|---|
| 1 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Ich schaff das! - Dranbleiben-Trainer | gebaut | ich-schaff-das | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 2 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Gefuehle-Entdecker | gebaut | gefuehle-entdecker | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 3 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Wer wohnt wo? - Lebensraum-Haeuser | gebaut | wer-wohnt-wo | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 4 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Ein Tier zu Gast - Verantwortungs-Trainer | gebaut | tier-zu-gast | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 5 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Freunde in der Gruppe - Sozial-Trainer | gebaut | freunde-in-der-gruppe | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 6 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Tonleiter-Treppe | gebaut | tonleiter-treppe | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 7 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Rhythmus-Orchester | teilweise | rhythmus-orchester | Quelle nicht im Repo prüfbar | Ausbau oder Entscheidung (Lücke laut Befund) |
| 8 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Ornament-Werkstatt: Muster legen | gebaut | ornament-werkstatt | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 9 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Mensch-Tier-Pflanze: Was uns verbindet (Vergleichs-Quiz) | gebaut | mensch-tier-pflanze | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 10 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Der Koerper-Entdecker: Was in dir steckt (Gesundheits-Quiz) | gebaut | koerper-entdecker | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 11 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Nahrungsnetz-Werkstatt (Oekosystem-Simulator) | teilweise | nahrungsnetz-werkstatt | Quelle nicht im Repo prüfbar | Ausbau oder Entscheidung (Lücke laut Befund) |
| 12 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Jahreszeiten-Rad (Simulator + Content-Pack) | gebaut | jahreszeiten-rad | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 13 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Hoeflich & Fair: Sprach-Etikette (Einheit 13) | gebaut | hoeflich-fair | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 14 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Gesunder-Körper-Ampel (Selbstbeobachtung) (Einheit 14) | gebaut | gesunder-koerper-ampel | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 15 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Familien-Budget: klein anfangen (Simulator) (Einheit 15) | gebaut | familien-budget | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 16 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Erfinder-Werkstatt: Neue Dinge gestalten (Kreativ-Modul) (Einheit 16) | gebaut | erfinder-werkstatt | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 17 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Uhr- und Kalender-Kind (Einheit 17) | teilweise | uhr-und-kalender-kind | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 18 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Deutschland-Kompass (Einheit 18) | teilweise | deutschland-kompass | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 19 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Märchen, Gedicht oder Fabel? (Einheit 19) | gebaut | maerchen-gedicht-fabel | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 20 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Reim-Werkstatt (Einheit 20) | gebaut | reim-werkstatt | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 21 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Kunst-Entdecker (Einheit 21) | gebaut | kunst-entdecker | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 22 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Erste-Wörter-Lesewerkstatt (Einheit 22) | gebaut | erste-woerter-lesewerkstatt | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 23 | Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …) | Warum heisst das so? Wort-Quiz (Einheit 23) | gebaut | warum-heisst-das-so | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 1 | Gemeinsame Apps 3–5 | Gemeinsam gesund essen | gebaut | gemeinsam-gesund-essen | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 2 | Gemeinsame Apps 3–5 | Dinge des Alltags – Quiz-Content-Pack (Ko-Nutzung) | gebaut | dinge-des-alltags | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 3 | Gemeinsame Apps 3–5 | Klang-Detektive (Weiterführung ab 3) | teilweise | klang-detektive | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 4 | Gemeinsame Apps 3–5 | Meine fünf Helfer – Körper-Entdecker | gebaut | fuenf-helfer | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 5 | Gemeinsame Apps 3–5 | Wetter- und Jahreszeiten-Forscher | gebaut | wetter-forscher | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 6 | Gemeinsame Apps 3–5 | Wie bewegen sich Tiere und Pflanzen? | gebaut | wie-bewegt-sich | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 7 | Gemeinsame Apps 3–5 | Sicher unterwegs – Szenario-Trainer Alltag & Straße | teilweise | sicher-unterwegs | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 8 | Gemeinsame Apps 3–5 | Mathe-Entdecker: Zahlen, Formen, Reihen | teilweise | mathe-entdecker | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 9 | Gemeinsame Apps 3–5 | Notruf-Held: 112 und 110 üben | gebaut | notruf-held | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 10 | Gemeinsame Apps 3–5 | Kita-Kartograph: Wir zeichnen unseren Raum | teilweise | kita-kartograph, deutschland-kompass | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 11 | Gemeinsame Apps 3–5 | Reim-Radar | gebaut | reim-radar | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 12 | Gemeinsame Apps 3–5 | Woerter-Sortierer | gebaut | woerter-sortierer | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 13 | Gemeinsame Apps 3–5 | Erzaehl-Bruecke | teilweise | erzaehl-bruecke | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 14 | Gemeinsame Apps 3–5 | Grammatik-Zwerge | teilweise | grammatik-zwerge | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 15 | Gemeinsame Apps 3–5 | Klang-Detektive (Musik-Hoer-Quiz, 4-6) | gebaut | musik-detektive | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 16 | Gemeinsame Apps 3–5 | Design-Entdecker: praktisch und schön | teilweise | design-entdecker | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 17 | Gemeinsame Apps 3–5 | Tischdienst-Trainer | teilweise | tischdienst-trainer | Quelle nicht im Repo prüfbar | Ausbau oder Entscheidung (Lücke laut Befund) |
| 18 | Gemeinsame Apps 3–5 | Gesund-Ampel | gebaut | gesunder-koerper-ampel | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 19 | Gemeinsame Apps 3–5 | Geschichten-Wender (Stimmungs-Werkstatt) | teilweise | geschichten-wender | Quelle nicht im Repo prüfbar | Ausbau oder Entscheidung (Lücke laut Befund) |
| 20 | Gemeinsame Apps 3–5 | Tier-Tanz-Impulse | gebaut | tier-tanz-impulse | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 21 | Gemeinsame Apps 3–5 | Farb-Labor | gebaut | farb-labor | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 22 | Gemeinsame Apps 3–5 | Mess-Labor der kleinen Forscher | teilweise | mess-labor | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 1 | Eltern-Werkzeuge | Staerken-Tagebuch fuer Eltern | gebaut | staerken-tagebuch | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 2 | Eltern-Werkzeuge | Meilenstein-Begleiter 1. Lebensjahr | teilweise | meilenstein-begleiter | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 3 | Eltern-Werkzeuge | Sprich mit mir! Sprachanbahnung 0-1 mehrsprachig | gebaut | sprich-mit-mir | faktengeprüft | keiner (Quelle geprüft) |
| 4 | Eltern-Werkzeuge | Bewegungs-Kartei Babys erstes Jahr | teilweise | bewegungs-kartei-erstes-jahr | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 5 | Eltern-Werkzeuge | Sicherer-Krabbelraum-Check | gebaut | sicherer-krabbelraum-check | faktengeprüft | keiner (Quelle geprüft) |
| 6 | Eltern-Werkzeuge | Erste-Woerter-Tagebuch | teilweise | erste-woerter-tagebuch | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 7 | Eltern-Werkzeuge | Autonomiephase-Navigator ('Trotzphase') | gebaut | autonomiephase-navigator | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 8 | Eltern-Werkzeuge | Puste- und Lauschspiel-Kartei | teilweise | puste-lauschspiel-kartei | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 9 | Eltern-Werkzeuge | Vorlese-Kompass 1-3 | teilweise | vorlese-kompass | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 10 | Eltern-Werkzeuge | Musikmomente 1-3 | gebaut | musikmomente-1-3 | faktengeprüft | keiner (Quelle geprüft) |
| 11 | Eltern-Werkzeuge | Spielzeug-Check U3 | gebaut | spielzeug-check-u3 | faktengeprüft | keiner (Quelle geprüft) |
| 12 | Eltern-Werkzeuge | Musik-Alltags-Begleiter fuer Eltern | teilweise | musik-alltags-begleiter | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 13 | Eltern-Werkzeuge | Ich kann das schon! Selbststaendigkeits-Leiter | teilweise | selbststaendigkeits-leiter | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 14 | Eltern-Werkzeuge | Reim- und Klanggeschichten-Erzeuger | gebaut | klanggeschichten-erzeuger | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 15 | Eltern-Werkzeuge | Kunst-Gucken: Bilderbuch-Dialog-Guide | teilweise | kunst-gucken | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 16 | Eltern-Werkzeuge | Erste Kuenstler 1-3 - Eltern-Ideenkartei mit Meilenstein-Check | teilweise | erste-kuenstler | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 17 | Eltern-Werkzeuge | Wachstums- und Bewegungsbegleiter | teilweise | wachstums-bewegungs-begleiter | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 18 | Eltern-Werkzeuge | Frischluft-Familie: Abhaertung kritisch adaptiert | gebaut | frischluft-familie | faktengeprüft | keiner (Quelle geprüft) |
| 19 | Eltern-Werkzeuge | Spielend schulreif - Eltern-Navigator | teilweise | schulanfang-spiel-navigator | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 20 | Eltern-Werkzeuge | Architektur-Spaziergang-Begleiter | gebaut | architektur-spaziergang | faktengeprüft | keiner (Quelle geprüft) |
| 21 | Eltern-Werkzeuge | Elterngespraech-Begleiter: Uebergang Kita-Grundschule | teilweise | elterngespraech-uebergang | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 1 | Kita-Werkzeuge (Fachkräfte) | Entwicklungs-Kompass Kita (digitaler Beobachtungsbogen) | gebaut (Variante A) | entwicklungs-kompass | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 2 | Kita-Werkzeuge (Fachkräfte) | Wohlfuehl-Ampel Gruppe | gebaut (Variante A) | tagesblick-fachkraft | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 3 | Kita-Werkzeuge (Fachkräfte) | Gruppenklima-Check | teilweise | gruppenklima-check | Quelle nicht im Repo prüfbar | Ausbau oder Entscheidung (Lücke laut Befund) |
| 4 | Kita-Werkzeuge (Fachkräfte) | Kita-Wochenplaner Bildungsangebote | teilweise | kita-wochenplaner | Quelle nicht im Repo prüfbar | Ausbau oder Entscheidung (Lücke laut Befund) |
| 5 | Kita-Werkzeuge (Fachkräfte) | Selbstcheck paedagogisches Ich | gebaut | selbstcheck-paedagogik | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 6 | Kita-Werkzeuge (Fachkräfte) | Kita-Familien-Bruecke (Erziehungspartnerschaft-Check) | gebaut | kita-familien-bruecke | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 7 | Kita-Werkzeuge (Fachkräfte) | Szenario-Trainer Elterngespraech | gebaut | elterngespraech-trainer | faktengeprüft | keiner (Quelle geprüft) |
| 8 | Kita-Werkzeuge (Fachkräfte) | Eingewoehnungs-Tagebuch | gebaut (Variante A) | eingewoehnungs-leitfaden | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 9 | Kita-Werkzeuge (Fachkräfte) | Kita-Mitmach-Boerse (Eltern-Beteiligung) | gebaut | kita-mitmach-boerse | faktengeprüft | keiner (Quelle geprüft) |
| 10 | Kita-Werkzeuge (Fachkräfte) | Fachquiz Entwicklung im 1. Lebensjahr | gebaut | fachquiz-erstes-lebensjahr | faktengeprüft | keiner (Quelle geprüft) |
| 11 | Kita-Werkzeuge (Fachkräfte) | Rollenspiel-Impulskarten | gebaut | impulskarten-sujetspiel | faktengeprüft | keiner (Quelle geprüft) |
| 12 | Kita-Werkzeuge (Fachkräfte) | Musikspiele-Kartei U3 | teilweise | musikspiele-kartei-u3 | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 13 | Kita-Werkzeuge (Fachkräfte) | Morgenkreis-Wochenplaner U3 | gebaut | morgenkreis-wochenplaner-u3 | faktengeprüft | keiner (Quelle geprüft) |
| 14 | Kita-Werkzeuge (Fachkräfte) | Natur-Fuersorge-Karten mit Beobachtungsprotokoll | teilweise | natur-fuersorge-karten | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 15 | Kita-Werkzeuge (Fachkräfte) | Spielbegleiter 3-5: Vom Hantieren zum Rollenspiel | teilweise | spielbegleiter-rollenspiel | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 16 | Kita-Werkzeuge (Fachkräfte) | Bewegungspausen-Generator (Fiskultminutki) | gebaut | bewegungspausen-generator | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 17 | Kita-Werkzeuge (Fachkräfte) | Bewegungs-Meilensteine: Beobachtungsbogen 3-5 | teilweise | bewegungs-richtwerte-3-5 | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 18 | Kita-Werkzeuge (Fachkräfte) | Beobachtungsbogen "Spiel-Entwicklung 3-5" | nicht bauen | – | faktengeprüft | nicht bauen – Begründung dokumentiert |
| 19 | Kita-Werkzeuge (Fachkräfte) | Buchecke-Check | gebaut | buchecke-check | faktengeprüft | keiner (Quelle geprüft) |
| 20 | Kita-Werkzeuge (Fachkräfte) | Beobachtungsbogen Musikalische Entwicklung 3-5 | nicht bauen | – | faktengeprüft | nicht bauen – Begründung dokumentiert |
| 21 | Kita-Werkzeuge (Fachkräfte) | Musik-Jahresplaner fuer die Kita | teilweise | musik-jahresplaner | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 22 | Kita-Werkzeuge (Fachkräfte) | Mini-Gaertner-Begleiter | gebaut | mini-gaertner-begleiter | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 23 | Kita-Werkzeuge (Fachkräfte) | Schulstart-Begleiter: Beobachtungsbogen zur Schulfaehigkeit | gebaut (Variante A) | schulstart-begleiter | Quelle nicht im Repo prüfbar | Faktencheck gegen Quelle nachholen |
| 24 | Kita-Werkzeuge (Fachkräfte) | Schatzkarten-Generator | gebaut | schatzkarten-generator | faktengeprüft | keiner (Quelle geprüft) |
| 25 | Kita-Werkzeuge (Fachkräfte) | Mini-Oper-Baukasten | teilweise | mini-oper-baukasten | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 26 | Kita-Werkzeuge (Fachkräfte) | Unser Konzert – Mitbestimmen | gebaut | unser-konzert-zaehlhilfe | faktengeprüft | keiner (Quelle geprüft) |
| 27 | Kita-Werkzeuge (Fachkräfte) | Kita-Unterstuetzungs-Navigator | teilweise | kita-unterstuetzungs-navigator | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 1 | Content-Pakete, Funktionen, Dokumente | Content-Pack: Stark und gesund | teilweise | stark-und-gesund | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 2 | Content-Pakete, Funktionen, Dokumente | Spielideen-Kartei: Was kann mein Baby mit...? | offen | – | nur Katalogtext | neu bauen (Welle) |
| 3 | Content-Pakete, Funktionen, Dokumente | Meine Familie - Woerter und Rollen (Content-Pack) | offen | – | nur Katalogtext | neu bauen (Welle) |
| 4 | Content-Pakete, Funktionen, Dokumente | Mein Ort, mein Land, unsere Erde (Content-Pack) | teilweise | deutschland-kompass | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 5 | Content-Pakete, Funktionen, Dokumente | Tierkinder und ihre Familien (Geschichten-Pack) | offen | – | nur Katalogtext | neu bauen (Welle) |
| 6 | Content-Pakete, Funktionen, Dokumente | Himmelsgucker: Sonne, Mond und Sterne | offen | – | nur Katalogtext | neu bauen (Welle) |
| 7 | Content-Pakete, Funktionen, Dokumente | Herkunftssprachen-Bruecke uk/ru | teilweise | herkunftssprachen-bruecke | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 8 | Content-Pakete, Funktionen, Dokumente | Kreisspiele-Sammlung mehrsprachig | teilweise | bewegungs-schatzkiste | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 9 | Content-Pakete, Funktionen, Dokumente | Farbwörter-Schatz | offen | – | nur Katalogtext | neu bauen – ohne quiz-kern (Regelkonflikt) |
| 10 | Content-Pakete, Funktionen, Dokumente | Musik-Woerter-Bilderlexikon | offen | – | nur Katalogtext | neu bauen (Welle) |
| 11 | Content-Pakete, Funktionen, Dokumente | Kindertaenze Europas | offen | – | nur Katalogtext | neu bauen (Welle) |
| 12 | Content-Pakete, Funktionen, Dokumente | Puppentheater-Werkstatt (Content-Pack) | offen | – | nur Katalogtext | neu bauen (Welle) |
| 13 | Content-Pakete, Funktionen, Dokumente | Trostvers-Generator (personalisierte Wiegenreime) | unklar | – | nur Katalogtext | Entscheidung treffen (offene-punkte-kita.md, H) |
| 14 | Content-Pakete, Funktionen, Dokumente | Elternbrief-Generator Krippenjahr | teilweise | elternbrief-generator | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 15 | Content-Pakete, Funktionen, Dokumente | Naturschutz-Rat: Rote Liste & unser Planet (Klassen-Koffer) | unklar | – | nur Katalogtext | Entscheidung treffen (offene-punkte-kita.md, H) |
| 16 | Content-Pakete, Funktionen, Dokumente | Konzept-Mapping Praleska nach DE | teilweise | – | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 17 | Content-Pakete, Funktionen, Dokumente | Krippen-Portfolio 'Erste Erfahrungen' | nicht bauen | – | nur Katalogtext | nicht bauen – Begründung dokumentiert |
| 18 | Content-Pakete, Funktionen, Dokumente | Theater zuhause - Bastel- und Spielheft | offen | – | nur Katalogtext | neu bauen (Welle) |
| 19 | Content-Pakete, Funktionen, Dokumente | Rhythmus-Orchester-Handbuch | teilweise | rhythmus-orchester | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 1 | Printmaterialien Kita | Bewegungs-Schatzkiste (Druck-Kartei) | gebaut | bewegungs-schatzkiste | nur Katalogtext | Faktencheck gegen Quelle nachholen |
| 2 | Printmaterialien Kita | Erfolgs-Momente-Kartei | teilweise | erfolgs-momente-kartei | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 3 | Printmaterialien Kita | Reime, Wiegenlieder, Kniereiter - Familienschatz-Paket | teilweise | familienschatz-reime | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 4 | Printmaterialien Kita | Entdecker-Karten: Tiere und Pflanzen vor der Tuer | teilweise | entdecker-karten-natur | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 5 | Printmaterialien Kita | Bewegungslandschaften-Plakate Krippe | teilweise | bewegungslandschaft-stationen | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 6 | Printmaterialien Kita | Frischluft-Rituale-Kartei | unklar | – | nur Katalogtext | Entscheidung treffen (offene-punkte-kita.md, H) |
| 7 | Printmaterialien Kita | Fuehl- und Sortier-Werkstatt: Holz, Papier, Stoff | offen | – | Quelle nicht im Repo prüfbar | neu bauen (Welle) |
| 8 | Printmaterialien Kita | Kleine Forscher ohne Bildschirm | offen | – | Quelle nicht im Repo prüfbar | neu bauen (Welle) |
| 9 | Printmaterialien Kita | Mathe-Anfaenge-Spielkartei | teilweise | mathe-entdecker | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 10 | Printmaterialien Kita | Tages- und Jahreszeiten-Ritualkarten | teilweise | jahreszeiten-rad, uhr-und-kalender-kind | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 11 | Printmaterialien Kita | Bewegungsbilder-Karten | teilweise | tier-tanz-impulse | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 12 | Printmaterialien Kita | Mal- und Matsch-Impulskartei 1-3 | teilweise | erste-kuenstler, morgenkreis-wochenplaner-u3 | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 13 | Printmaterialien Kita | Bau-Meister-Karten | teilweise | morgenkreis-wochenplaner-u3 | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 14 | Printmaterialien Kita | Kleine-Helfer-Dienste-Set | teilweise | tischdienst-trainer, aemtli-rad | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 15 | Printmaterialien Kita | Vom Samen zur Pflanze - Anzucht-Kartei fuer die Kita | teilweise | mini-gaertner-begleiter | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 16 | Printmaterialien Kita | Sprachbruecken: Gespraechs-Impulskarten mehrsprachig | teilweise | sprachbruecken-impulskarten | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| 17 | Printmaterialien Kita | Werkstatt-Karten: Schneiden, Reissen, Kleben | teilweise | werkstatt-karten-applikation | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 18 | Printmaterialien Kita | Sport-Schnupper-Stationen | teilweise | sport-schnupper-stationen | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| 19 | Printmaterialien Kita | Schwungblatt-Generator | teilweise | schwungblatt-generator | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |

## 7. Plan der Wellen

**Serie A – neue Apps (Gruppe 2, Status „offen“ oder „unklar“ mit klarer Entscheidung).** Reihenfolge: Katalogreihenfolge, ohne quiz-kern und ohne offene Entscheidung.

- **Welle 92 (gebaut, geprüft, nachgebessert):** Content-Pack 2 *Spielideen-Kartei* (`baby-spielideen-kartei`, 16 Karten, nur Deutsch), Content-Pack 5 *Tierkinder* (`tierkinder-vorlesen`, Bausteine ohne KI), Content-Pack 11 *Kindertänze* (`kindertaenze-europa`, 22 Karten). Alle drei bleiben „teilweise“: uk/ru nicht erfunden, Lücken offen (siehe `fragen-und-hinweise.md`, F).
- **Welle 93:** Content-Pack 12 *Puppentheater-Werkstatt* (Generator), Dokumente Nr. 18 *Theater zuhause* (Heft für Eltern), Printmaterial 7 *Fühl- und Sortier-Werkstatt* (2–3 Jahre, Druck).
- **Welle 94:** Printmaterial 8 *Kleine Forscher ohne Bildschirm* (1–3 Jahre, Druck).
- **Danach:** Printmaterial 6 sowie Funktionen Nr. 13 (Trostvers) und Nr. 15 (Naturschutz-Rat) nach Entscheidung (Abschnitt 5).
- **Zurückgestellt:** Content-Pack 3, 6, 9, 10 wegen quiz-kern; Dokumente Nr. 17 (Krippen-Portfolio) und Kita Nr. 18 und 20 wegen Regel 3.

**Serie B – Ausbau (57 Einheiten „teilweise“).** Lücken nach Altersstufe: Zuerst Einheiten, deren Lücke eine fehlende Altersstufe 2–3 oder 3–5 ist, weil dort am meisten Bedarf besteht. Jede Erweiterung läuft als eigene Welle mit Faktencheck.

**Serie C – Faktencheck gebauter Apps (53 Einheiten „gebaut“ mit Vermerk „nur Katalogtext“ oder „Quelle nicht im Repo prüfbar“).** Pro Welle drei bis fünf Apps: Seitenangaben gegen die Textkopie, Zahlen, Altersangaben. Ergebnis in den GDD der Apps.

**Serie D – Dokumentation.** Statuszeilen für alle Abschnitte in docs/10 (heute nur Kita und Eltern). Zwei Zeilen je Abschnitt: Stand und Liste offener Einheiten.

## 8. Gruppe 1 in Kürze

Gruppe 1 hat 100 gebaut, 34 teilweise, 3 offen, 2 nicht bauen. Offen sind das Türkisch-Paket „Kern-Drei“ und das Polnisch-Paket (keine geprüfte Fassung), das DGS-Paket (externe Videos) sowie zwei Partner-Einheiten („nur mit Partner“), die nicht allein gebaut werden. Die Einheiten der Gruppe 1 sind nicht Teil der Wellen dieses Plans; ihre Reihenfolge wird separat festgelegt.
