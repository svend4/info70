# Befund Browser-Prüfung: Knöpfe ohne Kennung (Stand 29.10.2026)

Dieser Befund gehört zum Inventar vom 29.10.2026 (`docs/inventar-offene-punkte-2026-10-29.md`, Befunde B-13 und B-20). Er beschreibt, was die Browser-Prüfung im Bestand misst, wenn sie auch Knöpfe ohne `data-kennung` klickt. Das Tor und die Basislinie `docs/browser-basislinie.json` sind unverändert. Die Zahlen sind maschinell gemessen und nicht von einem Menschen geprüft.

## 1. Ausgangslage

Die Klick-Suche in `tools/browser-pruefung.mjs` klickt nur Knöpfe mit `data-kennung`. Die Basislinie zeigt, was das für den Bestand heißt: In 204 von 228 Apps findet die Suche auf dem Startbildschirm keinen solchen Knopf. Dort meldet das Werkzeug „Keine Knöpfe mit data-kennung auf dem Startbildschirm: Klicks nicht gemessen“, und die Basislinie zählt das als eine Verletzung (Kategorie `ohneKennung`). Für diese Apps prüft das Tor also weder Klicks noch den Fokus nach einem Klick.

Zwei Folgen:
- B-13: „Zurück“-Knöpfe sind meist ohne Kennung (`knopf(...)` oder `el('button', …)` ohne `data-kennung`). Sie werden deshalb nie geklickt, und die Rückkehr von einem Bildschirm ist ungeprüft.
- B-20: Die Druckprüfung misst nach der Klick-Suche, also im Endzustand. Ohne Klick ist der Endzustand der Startbildschirm. Die Basislinie `druck` misst deshalb für 204 Apps den Startbildschirm und für 24 Apps den Endzustand. Das ist keine einheitliche Messstelle.

## 2. Was geändert wurde

- `tools/browser-pruefung.mjs` hat einen Schalter `--alle-knoepfe`. Mit ihm bekommt jeder Knopf ohne Kennung im Lauf die Kennung `auto:<Text>#<Nummer>`. Der Text ohne Zustandszeichen (☐ ☑ ✓ …) und ohne Ziffern, höchstens 40 Zeichen; die Nummer zählt gleiche Texte auf dem Bildschirm. Ohne den Schalter arbeitet das Werkzeug wie bisher; geprüft am 29.10. an fünf Apps (gleiche Verletzungen).
- Der JSON-Bericht hat ein Feld `alleKnoepfe`. `tools/browser-basislinie.mjs --schreiben` lehnt einen Messordner mit einer solchen Messung ab (Test `packages/kinderschutz/test/browser-basislinie.test.mjs`).
- Neu: `docs/browser-alle-knoepfe-2026-10-29.json` mit einer Zeile je App (Lauf am 29.10., alle 232 Apps mit `index.html`).
- Nicht geändert: Tor (`tools/browser-tor.mjs`), Basislinie, Kategorien, Tests.

Ein erster Lauf (v1) zeigte, dass sich die Kennung an Zustandszeichen hängt: Ein Kontrollkästchen „☐ Winterjacke“ wird nach dem Klick „☑ Winterjacke“ und zählt als neuer Knopf. In `familien-budget` ergab das 300 Klicks auf denselben Schalter. Die Zustandszeichen und Ziffern sind deshalb aus dem Text genommen. Die Zahlen unten stammen aus dem zweiten Lauf (v2).

## 3. Grenzen der Messung

- Eine Messung je App, kein Wiederholen. Die Apps mit Zufall (z. B. `tischdienst-trainer`) zeigen zwischen den Läufen 49 bis 53 Klicks.
- Die Klickgrenze von 300 Klicken ist bei zehn Apps erreicht. Die Messung dieser Apps ist unvollständig (Liste unten).
- `deutschland-kompass` wurde in der Arbeitskopie gemessen, also mit CON-4 (noch nicht committet). Die Überlauf-Zahl dieser App gilt für die Arbeitskopie.
- Die Schlüssel sind Text. Zwei Knöpfe mit gleichem Text auf einem Bildschirm werden über die Nummer unterschieden; ob das je Bildschirm der richtige Knopf ist, prüft das Werkzeug nicht.

## 4. Ergebnisse (v2, 232 Apps)

| Größe | Wert |
|---|---|
| gemessene Apps | 232 |
| ohne Verletzung | 29 |
| mit Verletzung | 203 |
| nicht gemessen | 0 |
| Klickgrenze 300 erreicht (unvollständig) | 10 |
| Klicks insgesamt | 7 422 |
| davon auf Knöpfen ohne Kennung | 6 008 |
| Apps mit Fokusverlust nach Klick | 178 |
| Fokusverlust-Fälle insgesamt | 4 472 |
| Fokusverlust bei Knöpfen mit Kennung | 0 |
| Klicks auf „Zurück“-Knöpfe (Apps) | 112 (49) |
| neue Überlauf-Funde bei 360 px (Apps) | 3 |
| Berührziele unter 48 px, Funde in Apps (gegen Basislinie) | 16 (5 neu) |
| Klickfehler | 1 |
| Konsolenfehler, fremde Hosts, HTTP-Fehler | 0 |

Druck (Zeichen im Endzustand gegen Basislinie): Summe 1 307 gegen 1 511. Bei 133 Apps gleich, bei 61 kleiner, bei 34 größer; vier Apps haben keinen Eintrag in der Basislinie (`farbwoerter-schatz`, `himmelsgucker-sonne-mond-und-sterne`, `meine-familie-woerter-und-rollen-content-pack`, `musik-woerter-bilderlexikon`).

## 5. Befund: Fokus nach Klick

Bei 178 Apps verliert der Fokus nach einem Klick auf einen Knopf ohne Kennung seine Stelle und liegt auf `body` oder auf einem anderen Knopf. Bei Knöpfen mit Kennung tritt das in keiner App auf.

Die Ursache zeigt der Quelltext. Ein Beispiel: In `apps/anzeige-einstellungen/app.mjs` setzt jeder Klick auf eine Einstellung `setze(...)`, und `setze` ruft `render()`, das `app.replaceChildren(...)` aufruft. Der angeklickte Knopf wird entfernt und neu gebaut; der Fokus geht verloren. Derselbe Ablauf steckt in vielen Apps. Die Vorlage `puppentheater-werkstatt` (Test `test/regeln.test.mjs`, Z. 179 bis 193) merkt den Fokus und setzt ihn nach dem Neuaufbau wieder. Ein gemeinsamer Baustein in `packages/kinder-ui` könnte das für viele Apps zugleich leisten; das ist eine Entscheidung, weil es viele Apps ändert.

Am stärksten betroffen (Klicks gesamt, Fokusverlust): `blasen-duell` (300 von 300, Klickgrenze), `verschwoerungs-werkstatt` (300 von 300, Klickgrenze), `selbststaendigkeits-leiter` (265 von 300), `architektur-spaziergang` (240 von 300), `elterngespraech-uebergang` (239 von 300). Die vollständige Liste steht in `docs/browser-alle-knoepfe-2026-10-29.json`.

## 6. Befund: „Zurück“-Knöpfe

Die Suche klickt jetzt 112 Mal auf „Zurück“-Knöpfe in 49 Apps. Die meisten stehen in `schulanfang-spiel-navigator` (35), `sprich-mit-mir` (12) und `beschwerde-lotse` (7). Ob die Rückkehr den richtigen Bildschirm zeigt, prüft das Werkzeug nur über Fokus und Änderung, nicht über den Inhalt.

## 7. Weitere Funde (nur Befund, keine Änderung)

- Überlauf bei 360 px, neu gefunden: `bewegungspausen-generator` (65 px und 53 px, Bildschirm „Bewegungspausen-Generator“), `ornament-werkstatt` (111 px), `deutschland-kompass` (1 px, Schritt 8, Arbeitskopie).
- Berührziele, neu gefunden: `kita-mitmach-boerse` (38), `musikmomente-1-3` (12), `morgenkreis-wochenplaner-u3` (10), `ornament-werkstatt` (10 Punkt-Knöpfe „·“ mit 39,6 px), `sicherer-krabbelraum-check` (2).
- Klickfehler: `aemtli-rad`, Klick auf „🔊 Vorlesen“ scheitert am Zeitlimit von 2 Sekunden.
- Klickgrenze erreicht (Messung unvollständig): `architektur-spaziergang`, `blasen-duell`, `elterngespraech-uebergang`, `kita-wochenplaner`, `schulanfang-spiel-navigator`, `selbststaendigkeits-leiter`, `spielzeug-check-u3`, `sprich-mit-mir`, `verschwoerungs-werkstatt`, `wachstums-bewegungs-begleiter`.

## 8. Was daraus folgt (nicht entschieden)

- Frage 72: Soll das Tor künftig alle Knöpfe messen? Dann braucht die Basislinie eine neue Kategorie für den Fokusverlust, und die Erhöhungen werden für den Bestand sichtbar.
- Frage 73: Messstelle der Druckprüfung. Solange sie nicht entschieden ist, bleibt `druck` in der Basislinie, wie sie ist. Der Schalter verschiebt die Zahlen je App; eine Senkung wäre ohne Entscheidung nicht sauber begründbar.
- Die Funde in Abschnitt 7 sind Ausbesserungen im Bestand und brauchen eine Freigabe, bevor eine App geändert wird.
- Der Bestand bleibt unverändert, bis Max die Entscheidungen 65 und 67 getroffen hat.
