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

## 5. Abgleich der Pläne

- **Serie A** (neue Apps, Plan 18.10): Die Wellen 92 bis 94 sind gebaut (CON-2, CON-3, CON-5, CON-6, CON-9, CON-10, CON-11, CON-12, CON-18, PRI-7, PRI-8). „Danach“: PRI-6, CON-13, CON-15 (unklar). „Zurückgestellt“: CON-17, KIT-18, KIT-20 (nicht bauen). Details: `docs/analyse-plaene-18-10-und-27-10.md`, Abschnitte 2 und 9.
- **Serie B** (Ausbau, 57 im Plan 18.10): Im Plan 27.10 in Stufe 2 und 3 geteilt. Die Reihenfolge wechselt von Altersstufe zu Faktenstand (Entscheidung 49).
- **Serie C** (Faktencheck gebauter Apps, 53 Einheiten): im Plan 27.10 nicht eingeplant (Entscheidung 48).
- **Serie D** (Statuszeilen in docs/10): im Plan 27.10 nicht eingeplant (Entscheidung 48).
- **Widerspruch im Plan 18.10:** Die Tabelle nennt CON-2, CON-5 und CON-11 „offen“, der Text von Welle 92 „gebaut“. Der Index 27.10 führt sie als „teilweise“; das gilt.
- **Kopfzeile des Plans 27.10:** „offen 4“ (CON-3, CON-6, CON-9, CON-10). Inzwischen gebaut (Stufe 1, Lauf E).

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

## 8. Ohne Entscheidung möglich (Koordinator, keine App-Änderung)

- Gesamtzahl im Wurzel-README nach dem CON-4-Commit: `node tools/zahlen.mjs --schreiben`.
- Werkzeug `leistungs-woerter.mjs`: Muster „Rang“ fehlt, obwohl Plan-Tor 1 es nennt (Befund B-21). Vorher die Auswirkungen auf Bestandsapps prüfen.
- docs/02 Z. 151 bis 152 gegen die Ergänzung 22а (Befund B-22): datierte Anmerkung.
- Werkzeug `browser-pruefung.mjs` klickt die Zurück-Knöpfe nicht (Befund B-13): erweitern.
- Messstelle „druck“ (Befund B-20): Start- und Endzustand vereinheitlichen, bevor die Basislinie gesenkt wird.
- Gruppe 1: Liste der 34 teilweisen Einheiten aus dem Katalog als Dokument erzeugen. Keine App-Änderung.
- `stand-2026-10-29.json` fortlaufend pflegen, wenn sich eine Einheit ändert.

## 9. Empfehlung für die nächste Freigabe

1. Entscheidungen 68 und 69: CON-4 committen und die Gesamtzahl setzen.
2. Entscheidungen 51 bis 59: den Rest von Stufe 2 starten (`stufe-2-rest.md`).
3. Entscheidung 64, Option b) „jede Einheit einzeln freigeben“: würde erlauben, Stufe-3-Einheiten ohne offene Entscheidung parallel zu beginnen. Das trifft Max.

