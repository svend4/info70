# Inventar offener Punkte (Stand 29.10.2026)

Dieses Dokument gleicht den Plan vom 18.10.2026 (`docs/plan-praleska-umsetzung.md`) und den Plan vom 27.10.2026 (`docs/plan-neue-welle.md`) mit dem Index (`docs/bauauftraege/index.json`, Stand 27.10), den Ergänzungen vom 29.10 (`docs/bauauftraege/stand-2026-10-29.json`) und dem Bestand im Repository ab. Es ändert und löscht nichts. Es ist die Grundlage für die Frage, was als Nächstes möglich ist.

## 1. Zahlen

- Gruppe 2: 131 Einheiten. Index 27.10: gebaut 63, teilweise 62 (Ausbau), unklar 3, nicht bauen 3, offen 0.
- Gruppe 1 (Plan 18.10, Abschnitt 8): 100 gebaut, 34 teilweise, 3 offen, 2 nicht bauen. Die Gruppe ist nicht Teil der Wellen; ihre Reihenfolge wird separat festgelegt.
- Committet seit dem Stand 27.10: KIN-17 (`d4446a0`), GEM-13 (`73b342a`), GEM-8 (`ecc9fa6`). CON-4 liegt im Arbeitsbaum und wartet auf Entscheidungen.

## 2. Stufe 2 des Plans vom 27.10 (9 Einheiten)

| Einheit | App | Stand 29.10 | Blockiert durch | Was danach möglich ist |
|---|---|---|---|---|
| KIN-17 | uhr-und-kalender-kind | Ausbau committet (`d4446a0`, 28 Tests) | Entscheidung 50 (Wertungsreste) und 51 (Ränge); Speicherregel localStorage (docs/02 Z. 25 bis 26, nicht entschieden); A18 | Löschung der Wertungsreste nach Freigabe; Speicherregel entscheiden |
| GEM-8 | mathe-entdecker | Ausbau committet (`ecc9fa6`, 43 Tests); Prüfung 3: freigabe_empfohlen | Entscheidungen 65 bis 67 (Bestand: Zufall, Wort Stufe, Fokus, Wort Sterne) | Nichts Weiteres ohne Entscheidung |
| GEM-13 | erzaehl-bruecke | Ausbau committet (`73b342a`, 31 Tests); Prüfung abgeschlossen | Entscheidungen 65 bis 67 (Bestand) | Nichts Weiteres ohne Entscheidung |
| CON-4 | deutschland-kompass | Ausbau im Arbeitsbaum, 42 Tests; Prüfung 4: R4-1 erledigt | Entscheidungen 68 (Umfang, Fokus) und 69 (Klammer in GDD §6) | Commit; danach Gesamtzahl im Wurzel-README |
| GEM-14 | grammatik-zwerge | nicht begonnen | Entscheidung 54 (Engine) und 57 (Begriffe, Sternchen); Fachprüfung durch einen Menschen | Ausbau nach `docs/arbeitsweise/briefs/stufe-2-rest.md` |
| GEM-16 | design-entdecker | nicht begonnen | Entscheidung 54 (Engine) und 56 (Bilder) | Ausbau nach `stufe-2-rest.md` |
| GEM-19 | geschichten-wender | nicht begonnen | Entscheidung 53 (Sprachen), 55 (Altersgruppe), 58 (Abweichungen) | Ausbau nach `stufe-2-rest.md` |
| CON-1 | stark-und-gesund | nicht begonnen | Entscheidung 51 (Ränge) und 52 (Gesundheitsaussagen; fachliche Prüfung kann kein Schreiber leisten) | Ausbau nach `stufe-2-rest.md` |
| CON-7 | herkunftssprachen-bruecke | nicht begonnen | Entscheidung 53 und 55; Wortkarten nicht entschieden | Ausbau nach `stufe-2-rest.md` |

## 3. Stufe 3 des Plans vom 27.10 (53 Einheiten)

Nach Plan 27.10: erst nach Abschluss von Stufe 2, in der Reihenfolge des Faktenstands (zuerst geprüfte Quelle, dann Katalogtext, zuletzt nicht prüfbar). Der Start setzt voraus: Entscheidung 49 (Reihenfolge), Entscheidung 64 (Freigabe) und die Durchsicht der Berichte durch Max. Die Einheiten stammen aus dem Index (Stand 27.10). Wo `stand-2026-10-29.json` den Stand überholt, ist das vermerkt.

| ID | Einheit | App | Faktenstand | nächster Schritt (Index) |
|---|---|---|---|---|
| KIN-7 | Rhythmus-Orchester | rhythmus-orchester | Quelle nicht im Repo prüfbar | Ausbau oder Entscheidung (Lücke laut Befund) |
| KIN-11 | Nahrungsnetz-Werkstatt (Oekosystem-Simulator) | nahrungsnetz-werkstatt | Quelle nicht im Repo prüfbar | Ausbau oder Entscheidung (Lücke laut Befund) |
| KIN-18 | Deutschland-Kompass (Einheit 18) | deutschland-kompass | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| GEM-3 | Klang-Detektive (Weiterführung ab 3) | klang-detektive | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| GEM-7 | Sicher unterwegs – Szenario-Trainer Alltag & Straße | sicher-unterwegs | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| GEM-10 | Kita-Kartograph: Wir zeichnen unseren Raum | kita-kartograph, deutschland-kompass | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| GEM-22 | Mess-Labor der kleinen Forscher | mess-labor | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| ELT-2 | Meilenstein-Begleiter 1. Lebensjahr | meilenstein-begleiter | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| ELT-4 | Bewegungs-Kartei Babys erstes Jahr | bewegungs-kartei-erstes-jahr | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| ELT-6 | Erste-Woerter-Tagebuch | erste-woerter-tagebuch | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| ELT-8 | Puste- und Lauschspiel-Kartei | puste-lauschspiel-kartei | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| ELT-9 | Vorlese-Kompass 1-3 | vorlese-kompass | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| ELT-12 | Musik-Alltags-Begleiter fuer Eltern | musik-alltags-begleiter | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| ELT-13 | Ich kann das schon! Selbststaendigkeits-Leiter | selbststaendigkeits-leiter | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| ELT-15 | Kunst-Gucken: Bilderbuch-Dialog-Guide | kunst-gucken | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| ELT-16 | Erste Kuenstler 1-3 - Eltern-Ideenkartei mit Meilenstein-Check | erste-kuenstler | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| ELT-17 | Wachstums- und Bewegungsbegleiter | wachstums-bewegungs-begleiter | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| ELT-19 | Spielend schulreif - Eltern-Navigator | schulanfang-spiel-navigator | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| ELT-21 | Elterngespraech-Begleiter: Uebergang Kita-Grundschule | elterngespraech-uebergang | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| KIT-3 | Gruppenklima-Check | gruppenklima-check | Quelle nicht im Repo prüfbar | Ausbau oder Entscheidung (Lücke laut Befund) |
| KIT-4 | Kita-Wochenplaner Bildungsangebote | kita-wochenplaner | Quelle nicht im Repo prüfbar | Ausbau oder Entscheidung (Lücke laut Befund) |
| KIT-12 | Musikspiele-Kartei U3 | musikspiele-kartei-u3 | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| KIT-14 | Natur-Fuersorge-Karten mit Beobachtungsprotokoll | natur-fuersorge-karten | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| KIT-15 | Spielbegleiter 3-5: Vom Hantieren zum Rollenspiel | spielbegleiter-rollenspiel | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| KIT-17 | Bewegungs-Meilensteine: Beobachtungsbogen 3-5 | bewegungs-richtwerte-3-5 | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| KIT-21 | Musik-Jahresplaner fuer die Kita | musik-jahresplaner | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| KIT-25 | Mini-Oper-Baukasten | mini-oper-baukasten | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| KIT-27 | Kita-Unterstuetzungs-Navigator | kita-unterstuetzungs-navigator | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| CON-2 | Spielideen-Kartei: Was kann mein Baby mit...? | baby-spielideen-kartei | nur Katalogtext | neu bauen (Welle) |
| CON-5 | Tierkinder und ihre Familien (Geschichten-Pack) | tierkinder-vorlesen | nur Katalogtext | neu bauen (Welle) |
| CON-8 | Kreisspiele-Sammlung mehrsprachig | bewegungs-schatzkiste | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| CON-11 | Kindertaenze Europas | kindertaenze-europa | nur Katalogtext | neu bauen (Welle) |
| CON-12 | Puppentheater-Werkstatt (Content-Pack) | puppentheater-werkstatt | nur Katalogtext | neu bauen (Welle) (veraltet, siehe stand-2026-10-29.json) |
| CON-14 | Elternbrief-Generator Krippenjahr | elternbrief-generator | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| CON-16 | Konzept-Mapping Praleska nach DE | – | nur Katalogtext | kein App-Ordner: Dokument fehlt (Bauauftrag Abschnitt 9) |
| CON-18 | Theater zuhause - Bastel- und Spielheft | theater-zuhause-heft | nur Katalogtext | neu bauen (Welle) (veraltet, siehe stand-2026-10-29.json) |
| CON-19 | Rhythmus-Orchester-Handbuch | rhythmus-orchester | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| PRI-2 | Erfolgs-Momente-Kartei | erfolgs-momente-kartei | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| PRI-3 | Reime, Wiegenlieder, Kniereiter - Familienschatz-Paket | familienschatz-reime | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| PRI-4 | Entdecker-Karten: Tiere und Pflanzen vor der Tuer | entdecker-karten-natur | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| PRI-5 | Bewegungslandschaften-Plakate Krippe | bewegungslandschaft-stationen | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| PRI-7 | Fuehl- und Sortier-Werkstatt: Holz, Papier, Stoff | fuehl-sortier-werkstatt | Quelle nicht im Repo prüfbar | neu bauen (Welle) (veraltet, siehe stand-2026-10-29.json) |
| PRI-9 | Mathe-Anfaenge-Spielkartei | mathe-entdecker | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| PRI-10 | Tages- und Jahreszeiten-Ritualkarten | jahreszeiten-rad, uhr-und-kalender-kind | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| PRI-11 | Bewegungsbilder-Karten | tier-tanz-impulse | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| PRI-12 | Mal- und Matsch-Impulskartei 1-3 | erste-kuenstler, morgenkreis-wochenplaner-u3 | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| PRI-13 | Bau-Meister-Karten | morgenkreis-wochenplaner-u3 | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| PRI-14 | Kleine-Helfer-Dienste-Set | tischdienst-trainer, aemtli-rad | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| PRI-15 | Vom Samen zur Pflanze - Anzucht-Kartei fuer die Kita | mini-gaertner-begleiter | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| PRI-16 | Sprachbruecken: Gespraechs-Impulskarten mehrsprachig | sprachbruecken-impulskarten | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |
| PRI-17 | Werkstatt-Karten: Schneiden, Reissen, Kleben | werkstatt-karten-applikation | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| PRI-18 | Sport-Schnupper-Stationen | sport-schnupper-stationen | faktengeprüft | Ausbau oder Entscheidung (Lücke laut Befund) |
| PRI-19 | Schwungblatt-Generator | schwungblatt-generator | nur Katalogtext | Ausbau oder Entscheidung (Lücke laut Befund) |

## 4. Unklar, nicht bauen, fehlendes Dokument

- **unklar** (Entscheidung 61): PRI-6 Frischluft-Rituale-Kartei, CON-13 Trostvers-Generator (personenbezogen), CON-15 Naturschutz-Rat. Ohne Entscheidung gibt es keinen Bauauftrag.
- **nicht bauen** (entschieden): CON-17 Krippen-Portfolio, KIT-18 und KIT-20 Beobachtungsbögen je Kind.
- **CON-16 Konzept-Mapping:** Dokument fehlt. Der Ort ist offen (Vorschlag `docs/konzept-mapping-praleska-de.md`, Bauauftrag Abschnitt 9). Das ist eine Frage des Ortes, keine inhaltliche Entscheidung.

*Ergänzung 29.10.2026 abends:* CON-16 steht im Plan 18.10 und im Index 27.10 als „teilweise“ ohne App („–“). Die Ableitung `tools/gruppe-2-stand.mjs` meldet das als Hinweis. Die Entscheidung über Ort und Art des Ergebnisses ist Frage 74. Ein Dokument unter docs/ wird erst nach dieser Entscheidung angelegt.

## 5. Abgleich der Pläne

- **Serie A** (neue Apps, Plan 18.10): Die Wellen 92 bis 94 sind gebaut (CON-2, CON-3, CON-5, CON-6, CON-9, CON-10, CON-11, CON-12, CON-18, PRI-7, PRI-8). „Danach“: PRI-6, CON-13, CON-15 (unklar). „Zurückgestellt“: CON-17, KIT-18, KIT-20 (nicht bauen). Details: `docs/analyse-plaene-18-10-und-27-10.md`, Abschnitte 2 und 9.
- **Serie B** (Ausbau, 57 im Plan 18.10): Im Plan 27.10 in Stufe 2 und 3 geteilt. Die Reihenfolge wechselt von Altersstufe zu Faktenstand (Entscheidung 49).
- **Serie C** (Faktencheck gebauter Apps, 53 Einheiten): im Plan 27.10 nicht eingeplant (Entscheidung 48).
- **Serie D** (Statuszeilen in docs/10): im Plan 27.10 nicht eingeplant (Entscheidung 48).
- **Widerspruch im Plan 18.10:** Die Tabelle nennt CON-2, CON-5 und CON-11 „offen“, der Text von Welle 92 „gebaut“. Der Index 27.10 führt sie als „teilweise“; das gilt.
- **Kopfzeile des Plans 27.10:** „offen 4“ (CON-3, CON-6, CON-9, CON-10). Inzwischen gebaut (Stufe 1, Lauf E).

*Ergänzung 29.10.2026 abends (Ableitung `tools/gruppe-2-stand.mjs`, Datei `docs/status-gruppe-2-2026-10-29.json`):* Der Plan 18.10 (Tabelle, Abschnitt 6) und der Index 27.10 stimmen für 131 Einheiten bis auf diese Stellen überein, die die Ableitung nennt:
- Von den elf am 18.10 „offen“ Einheiten führt der Index sechs als „teilweise“ (CON-2, CON-5, CON-11, CON-12, CON-18, PRI-7); fünf sind gebaut (CON-3, CON-6, CON-9, CON-10, PRI-8). Die Bilanz 27.10 (63 gebaut, 62 teilweise) passt dazu.
- GEM-17 (Tischdienst-Trainer) ist am 18.10 „teilweise“, im Index 27.10 nicht mehr unter „teilweise“. Die Bilanz zählt sie als gebaut. Eine Quelle für den Wechsel gibt es nicht; die App besteht und hat einen Bauauftrag. Die Ableitung zeigt das als Abweichung.
- CON-16 ist „teilweise“ ohne App (Abschnitt 4, Frage 74).
- Berichtigung zu einer früheren Angabe in diesem Inventar: Die Einheit, die nicht gebaut wird, heißt KIT-18 („Beobachtungsbogen Spiel-Entwicklung 3-5“). KIN-18 (Deutschland-Kompass, Kinder-Apps) ist „teilweise“ und gehört zu Stufe 3.
- Die Stufe-3-Liste umfasst 53 Einheiten, wie der Plan 27.10 sagt; Stufe 1 (4) und Stufe 2 (9) sind eindeutig zugeordnet.

## 6. Gruppe 1 (Plan 18.10, Abschnitt 8)

- **offen:** Türkisch-Paket „Kern-Drei“ und Polnisch-Paket (keine geprüfte Fassung), DGS-Paket (externe Videos). Sie brauchen Quellen, eine Prüfung durch Menschen oder externe Produktion.
- **Partner-Einheiten** (2): nur mit Partner, nicht allein bauen.
- **teilweise** (34): Die Kennungen stehen nicht im Repository, der Index erfasst nur Gruppe 2. Ihre Reihenfolge ist separat festzulegen (Plan 18.10, Abschnitt 8).

## 7. Entscheidungen, die offen sind

Die Empfehlung (★) ist die Option, die in der Fragenliste markiert ist. Sie ist nicht beschlossen, bis Max sie bestätigt.

| Nr. | Thema | Empfehlung (★) | Wirkung |
|---|---|---|---|
| 48 | Serien C und D im Plan 27.10 | wieder einplanen, nach Stufe 3 | Umfang Stufe 3 |
| 49 | Reihenfolge Stufe 3 | nach Faktenstand | Stufe 3 |
| 50 | Entfernen von Wertungsresten | Entfernen freigeben; im Code bei CON-1, CON-4 und CON-7 ist es bereits erledigt (96a1f89) | KIN-17 |
| 51 | Ränge | keine Ränge bauen, Katalogtext angleichen | CON-1, CON-4, KIN-17 |
| 52 | Gesundheitsaussagen CON-1 | fachlich prüfen lassen (nur durch Mensch) | CON-1 |
| 53 | Sprachen uk und ru | zunächst nur Deutsch | GEM-19, CON-7 |
| 54 | Engine GEM-14 und GEM-16 | eigenes Format behalten, Katalog angleichen | GEM-14, GEM-16 |
| 55 | Altersgruppen | Katalog an die App angleichen, wenn die App stimmt | GEM-19, CON-7, GEM-13 |
| 56 | Bilder GEM-13 und GEM-16 | keine Bilder, nur Beschreibungen | GEM-16, GEM-13 |
| 57 | Begriffe GEM-14 | App-Form behalten, Katalog korrigieren, wenn die Quelle stützt | GEM-14 |
| 58 | GEM-19 Abweichungen | Abweichungen bestätigen; Erzeugerfunktion später | GEM-19 |
| 59 | PRI-7 Ausbau oder Neubau | Ausbau | PRI-7 |
| 60 | CON-12 Vertep und Batleika | streichen | CON-12 |
| 61 | Unklare Einheiten | siehe Frage 61 je Einheit | PRI-6, CON-13, CON-15 |
| 62 | Zitatgrenze | sechs Wörter | alle Texte |
| 63 | Index und Registrierung | Koordinator korrigiert nach jedem Ausbau (Datei `stand-2026-10-29.json` angelegt) | Index |
| 64 | Freigabe der Ausbauten | Stufe 2 als Ganzes abschließen | Stufe 3 |
| 65 | Zufall im Bestand, auch in gemeinsamen Paketen | Bestand bleibt; neue Logik zufallsfrei | GEM-8, GEM-13, CON-4, KIN-17 |
| 66 | Wort „Stufe“ (45 Apps), Wort „Sterne“ (m16) | umstellen auf „Schritt“ bzw. Äpfel | viele Apps |
| 67 | Fokus im Bestand, auch im Quiz-Motor | Bestand bleibt; Befund dokumentiert | GEM-13, GEM-8 |
| 68 | CON-4 Umfang und Fokus | Umfang nach Brief; Fokus auf dem Knopf | CON-4 Commit |
| 69 | Klammer (13) in GDD §6 von CON-4 | „(13 Prüfungen)“ | CON-4 Testzahlregel |
| 70 | Rang in `autonomiephase-navigator` (Erwachsenen-App, Punkte und Rang nach Antworten) | а) Wortliste nur für Kinder-Apps ★ | `autonomiephase-navigator`; Entscheidung 51 (neu 29.10. abends, Frage 70) |
| 71 | Rangliste in `barriere-detektive` (Kinder ordnen geprüfte Apps) | б) alphabetisch ohne Platz ★ | `barriere-detektive` (neu 29.10. abends, Frage 71) |
| 72 | Browser-Tor: Knöpfe ohne `data-kennung` messen (Fokusverlust in 178 Apps) | б) Tor misst alle, Basislinie mit neuer Kategorie ★ | Browser-Tor, Basislinie, Bestand (neu 29.10. abends, Frage 72) |
| 73 | Messstelle der Druckprüfung (Start oder Ende nach Klicks) | а) Endzustand für alle, Basislinie neu gesetzt ★ | `docs/browser-basislinie.json` (neu 29.10. abends, Frage 73) |
| 74 | CON-16 „Konzept-Mapping Praleska nach DE“: Ort und Art des Ergebnisses (teilweise ohne App) | а) Konzeptdokument unter docs/, Status „gebaut (Dokument)“ ★ | CON-16, Index (neu 29.10. abends, Frage 74) |
| 75 | Zielgruppe von sechs Apps mit Vorlesefunktion (Vermerk 28а) | а) Zuordnung wie in der GDD ★ | `aemtli-rad`, `netz-pass-urkunde`, `beschwerde-brief-werkstatt`, `familien-notfall-fahrplan`, `familien-medienvertrag`, `spiele-kauf-kompass` (neu 29.10. abends, Frage 75) |

## 8. Ohne Entscheidung möglich (Koordinator, keine App-Änderung)

- Gesamtzahl im Wurzel-README nach dem CON-4-Commit: `node tools/zahlen.mjs --schreiben`.
- Werkzeug `leistungs-woerter.mjs`: Muster „Rang“ fehlt, obwohl Plan-Tor 1 es nennt (Befund B-21). Vorher die Auswirkungen auf Bestandsapps prüfen.
- docs/02 Z. 151 bis 152 gegen die Ergänzung 22а (Befund B-22): datierte Anmerkung.
- Werkzeug `browser-pruefung.mjs` klickt die Zurück-Knöpfe nicht (Befund B-13): erweitern.
- Messstelle „druck“ (Befund B-20): Start- und Endzustand vereinheitlichen, bevor die Basislinie gesenkt wird.
- Gruppe 1: Liste der 34 teilweisen Einheiten aus dem Katalog als Dokument erzeugen. Keine App-Änderung.
- `stand-2026-10-29.json` fortlaufend pflegen, wenn sich eine Einheit ändert.

**Stand 29.10.2026 abends (Erledigung der Punkte oben, datiert; die Zeilen darüber bleiben stehen):**

- Zu „Gesamtzahl im Wurzel-README“: Gesetzt auf 3329 (Stand HEAD a7c7e85; im HEAD vorher 3262, also seit einem früheren Commit veraltet). Der Test `testzahlen` zählt die Arbeitskopie, also mit CON-4 (noch nicht committet); die Zahl wird beim CON-4-Commit mit `node tools/zahlen.mjs --schreiben` auf den neuen Stand gesetzt (Entscheidungen 68 und 69).
- Zu „Werkzeug `leistungs-woerter.mjs`: Muster „Rang““ (B-21): erledigt. Gruppe `rang` ist eingetragen, ein Test ist dabei. Treffer im Bestand: zehn in zwei Apps; Befund in `docs/befund-rang-2026-10-29.md`, neue Fragen 70 und 71.
- Zu „docs/02 Z. 151 bis 152“ (B-22): erledigt. Anmerkung in Zeile 153 (datiert, Ergänzung 22а); die alte Zeile bleibt.
- Zu „Zurück-Knöpfe nicht geklickt“ (B-13): Der Schalter `--alle-knoepfe` ist eingebaut (opt-in, Tor und Basislinie unverändert). Ergebnis für 232 Apps: `docs/befund-browser-kennung-2026-10-29.md`, Daten `docs/browser-alle-knoepfe-2026-10-29.json`. Neue Fragen 72 und 73.
- Zu „Messstelle druck“ (B-20): Ursache gefunden. Die Druckprüfung misst nach der Klick-Suche; ohne Klick ist das der Startzustand (204 Apps). Die Basislinie wird nicht gesenkt, bis Frage 73 entschieden ist.
- Zu „Gruppe 1: Liste der 34 teilweisen Einheiten“: Nicht erzeugbar aus dem Katalog. `docs/ideen-katalog.json` und `docs/09-baukasten-katalog.md` nennen keinen Stand je Einheit; die Zahlen 100, 34, 3 und 2 stehen nur im Plan 18.10 (Abschnitt 8). Die Einzelergebnisse der sechs Gruppe-1-Agenten liegen nicht im Repository. Eine Liste braucht eine neue Inventur (Abschnitt 8 des Plans), also eine Entscheidung über den Aufwand.
- `docs/browser-basislinie.json`: unverändert. Eine Senkung wartet auf Frage 73.

**Stand 29.10.2026 spät (weitere Erledigungen, datiert):**

- Serie D (Plan 18.10, Abschnitt 7): erledigt. Statuszeilen je Abschnitt stehen am Ende von docs/10 (nicht mitten im Text, damit die Zeilennummern erhalten bleiben, auf die 256 Verweise zeigen). Die Zeilen werden aus der Ableitung erzeugt; ein Test (`packages/kinderschutz/test/gruppe-2-stand.test.mjs`) prüft, dass sie stimmen.
- Serie C (Plan 18.10, Abschnitt 7): Werkzeug `tools/app-seiten-pruefen.mjs` mit der Logik in `packages/kinderschutz/src/seiten-pruefung.mjs` (Tests vorhanden). Pilot mit fünf Apps (`ich-schaff-das`, `tier-tanz-impulse`, `staerken-tagebuch`, `klanggeschichten-erzeuger`, `selbstcheck-paedagogik`). Der maschinelle Lauf ergab 36 Verweise; die Prüfung am Text folgt durch einen Prüfagenten. Die Prüfung am Text hat in `klanggeschichten-erzeuger` drei Fehler gefunden und korrigiert (Überschrift «Пение» auf S. 80, Fußnote auf S. 79, „Flöte“ statt „Dudelsack“); Einzelheiten in `docs/serie-c-2026-10-29.md`.
  *Stand 29.10. spät:* Die Prüfung am Text ist für den Pilot abgeschlossen: 29 Angaben in fünf Apps, davon 14 belegt, 6 Übersetzung belegt, 9 falsch (alle in `klanggeschichten-erzeuger`, korrigiert). Welle 2 (`entwicklungs-kompass`, `tagesblick-fachkraft`, `schulstart-begleiter`) läuft. Frage 76 zur Altersangabe von `tier-tanz-impulse`. Der Bericht steht in `docs/serie-c-2026-10-29.md`.
- Befund B-23 (Werkzeug): Inhalt geschlossener `<details>` gilt im Schalter-Modus nicht als sichtbar. Der Klickfehler in `aemtli-rad` ist weg. Ohne Schalter unverändert.
- Befund B-13/B-20: Der Schalter `--alle-knoepfe` ist gemessen (Lauf 3, 232 Apps). Die Zahlen stehen in `docs/befund-browser-kennung-2026-10-29.md`, Abschnitt 9. Entscheidungen 72 und 73 bleiben offen.
- Layout-Befunde im Bestand: `bewegungspausen-generator` und `ornament-werkstatt` laufen bei 360 px nicht mehr über (zwei Stellen mit Kommentar und Datum). Offen bleiben die Ziele unter 48 px (Entscheidung F1) und der Fokusverlust (Entscheidung 72).
- `deutschland-kompass`: 1 px Überlauf im HEAD (Modus-Bildschirm, Schritt 6). Der Fehler ist Bestand und wird mit der Freigabe von CON-4 behoben, nicht vorher.
- Entscheidung 28а: Vermerk in der GDD für zwölf Erwachsenen-Apps gesetzt; sechs offen (Frage 75).
- Gruppe 1, Zählung 100/34/3/2 (Plan 18.10, Abschnitt 8): nicht nachprüfbar. Die Nummern (№) stehen im Text der Katalogdatei verstreut, es gibt keine Liste je Einheit mit Stand. Eine Prüfung braucht eine eigene Inventur; das ist eine Entscheidung über den Aufwand, keine Aufgabe dieser Runde.

## 9. Empfehlung für die nächste Freigabe

1. Entscheidungen 68 und 69: CON-4 committen und die Gesamtzahl setzen.
2. Entscheidungen 51 bis 59: den Rest von Stufe 2 starten (`stufe-2-rest.md`).
3. Entscheidung 64, Option b) „jede Einheit einzeln freigeben“: würde erlauben, Stufe-3-Einheiten ohne offene Entscheidung parallel zu beginnen. Das trifft Max.

*Ergänzung 29.10.2026 abends:* Zusätzlich zu den Entscheidungen 68 und 69 brauchen die Befunde vom Nachmittag Entscheidungen von Max: 70 und 71 (Rang), 72 und 73 (Browser-Prüfung). Ohne sie bleibt der Bestand unverändert; die Befunde sind Auskunft.

Seitenangaben in diesem Dokument (Abschnitt Serie C, 29.10.2026): Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
