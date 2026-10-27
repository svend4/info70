# Druckzeichen ☐ ☒ ☑ ✓ ✔ ★ ☆ in den Apps (Messung zu Frage 10в)

Stand: 27.10.2026, Browser-Messung bei 360 px (`tools/browser-pruefung.mjs`, Druckansicht der Bildschirme, die das Werkzeug erreicht) und eine statische Zählung im Quelltext (ohne Tests). Die Messung ist eine Untergrenze: sie sieht nur Bildschirme, die ohne Eingabe erreichbar sind und deren Knöpfe eine `data-kennung` haben. Es wurden keine Dateien geändert.

## 1. Gemessen: diese Zeichen kommen im Druck wirklich vor (11 Apps)

Gesamt: ☐ 259 Zeichen, ☑ 34 Zeichen. Keine ☒ ✓ ✔ ★ ☆ im gemessenen Druck.

| App | Zeichen (Zahl) | Beispiel im Druck | Vorschlag Zielgruppe (zu prüfen) |
|---|---|---|---|
| eingewoehnungs-leitfaden | ☐ (23) | „aft (Eigenentwurf) ☐ Bezugsperson mit d“ | Erwachsene (Eingewöhnung, Checkliste für Eltern und Fachkraft) |
| elternbrief-generator | ☑ (2), ☐ (3) | „. Themen des Monats ☑ 🤸 Bewegung ☑ 💬 S“ | Erwachsene (Fachkräfte; Themenauswahl im Elternbrief) |
| entwicklungs-kompass | ☐ (90) | „nach Merkmal S18.6 ☐ umgesetzt ☐ noch o“ | Erwachsene (Merkmal-Checkliste) |
| familien-budget | ☐ (10) | „ nimmt die Familie? ☐ 🧥 Neue Winterjack“ | Erwachsene (Familienbudget) |
| jmstv-einstufungs-helfer | ☐ (8) | „ 1. Inhaltsmerkmale ☐ Nur harmlose, kind“ | Erwachsene (Betreiber*innen) |
| meilenstein-begleiter | ☐ (6) | „swoche 🔊 Vorlesen ☐ Hebt in Bauchlage “ | Erwachsene (Eltern; Beobachtungsliste) |
| mini-gaertner-begleiter | ☐ (15) | „____ cm Ich habe: ☐ gegossen ☐ gelock“ | Kind (Arbeitsblatt „Ich habe: gegossen, gelockert“): prüfen |
| schulstart-begleiter | ☐ (90) | „ Merkmal sprache-1 ☐ angeboten ☐ noch o“ | Erwachsene (Merkmal-Checkliste) |
| sprich-mit-mir | ☐ (8) | „t wieder abwählen. ☐ Ich antworte auf d“ | zu prüfen (Kind oder Erwachsene) |
| staerken-tagebuch | ☑ (32) | „enken zu lassen – − ☑️ Beobachtet Fragt “ | Erwachsene (Beobachtung) |
| tagesblick-fachkraft | ☐ (6) | „Zeit und Mitsprache ☐ Einzelzeit angebot“ | Erwachsene (Fachkräfte) |

## 2. Im Quelltext vorhanden, aber nicht gemessen (43 weitere Apps)

Das sind Funde in Dateien der App (App-Code, HTML, CSS, `daten/*.json`). Ob sie im Druck erscheinen, ist nicht belegt: ✔ steht häufig in Bildschirmtexten, ☐ in Druckvorlagen, die erst nach Eingaben erscheinen. Eine Messung mit Eingabewegen steht aus.

| App | Dateien und Zeichen (Zahl im Quelltext) |
|---|---|
| aemtli-rad | app.mjs: ✔1 |
| architektur-spaziergang | app.mjs: ✔1 |
| avv-checkliste-hosting | app.mjs: ✔1 |
| barrierefreiheitserklaerung-generator | app.mjs: ✔2 |
| beschwerde-brief-werkstatt | app.mjs: ✔2 |
| bewegungspausen-generator | app.mjs: ✔1 |
| compliance-koffer | app.mjs: ✔1; logik.mjs: ✔1 |
| dark-pattern-labyrinth | daten/stationen.json: ☑3 |
| dark-pattern-selbstinspektion | app.mjs: ✔1 |
| datenschutz-baukasten | app.mjs: ✔2 |
| dsa-selbstaudit | app.mjs: ✔1 |
| einwilligungs-pruefpfad | app.mjs: ✔2; logik.mjs: ✔1 |
| eltern-kompass-generator | app.mjs: ✔1 |
| eltern-rechtebriefe | app.mjs: ✔1 |
| elterngespraech-uebergang | app.mjs: ✔1 |
| erfolgs-momente-kartei | app.mjs: ✓1 |
| erste-woerter-tagebuch | app.mjs: ✔3 |
| fragfinn-selbsttest | app.mjs: ✔1 |
| gruppenklima-check | app.mjs: ✔1 |
| impressum-generator | app.mjs: ✔1 |
| interaktions-konzept-assistent | app.mjs: ✔1 |
| ki-kennzeichnungs-generator | app.mjs: ✔1 |
| ki-transparenz-check | app.mjs: ✔1 |
| kinderrat | app.mjs: ✓1 |
| kita-familien-bruecke | app.mjs: ☐2 |
| klanggeschichten-erzeuger | app.mjs: ✔1 |
| kria-check | app.mjs: ✔1 |
| kriterien-check | app.mjs: ✔1 |
| leichte-sprache-pruefhilfe | app.mjs: ✔1 |
| link-inventar-pruefer | app.mjs: ✔1 |
| meldewege-planer | app.mjs: ✔2 |
| musik-alltags-begleiter | app.mjs: ✔2 |
| musik-jahresplaner | app.mjs: ✓1 |
| musikmomente-1-3 | app.mjs: ✔2 |
| schwungblatt-generator | app.mjs: ☐1 ☑1 |
| seitenstark-qualitaets-check | app.mjs: ✔1 |
| selbstcheck-paedagogik | app.mjs: ✔1 |
| selbststaendigkeits-leiter | app.mjs: ✔1 |
| sicherer-krabbelraum-check | app.mjs: ☐2 ☑2 ✔1 |
| spielzeug-check-u3 | app.mjs: ☐1 ☑1 ✔1 |
| vorsorge-check-juschg | app.mjs: ✔1 |
| wachstums-bewegungs-begleiter | app.mjs: ✔1 |
| werbekennzeichnung | app.mjs: ✔1 |

## 3. Vorschlag nach Entscheidung 10в, dann 10б

- Neutrale Marker (ohne Haken, Sterne und leere Kästchen) nur für Arbeitsblätter, auf denen ein Kind etwas einträgt: aus der gemessenen Liste voraussichtlich `mini-gaertner-begleiter` und, falls ein Kind das Blatt ausfüllt, `sprich-mit-mir`.
- Checklisten für Erwachsene (Eingewöhnung, Merkmal-Listen, Beobachtung, Betreiber*innen) behalten leere Kästchen als dokumentierte Ausnahme; die Ausnahme wird in `docs/02` vermerkt.
- Die 43 nicht gemessenen Apps werden erst nach einer Messung mit Eingabewegen eingeordnet; bis dahin keine Änderung.
