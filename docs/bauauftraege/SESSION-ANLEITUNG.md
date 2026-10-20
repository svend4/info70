# Anleitung für eine Sitzung: eine Einheit nach Bauauftrag

Diese Anleitung ist für eine Sitzung gedacht, die genau eine Einheit der Praleska-Gruppe 2 baut oder ausbaut. Die Kennung der Einheit steht im Startauftrag (z. B. `PRI-8`). Der Bauauftrag ist `docs/bauauftraege/<Kennung>-*.md`.

## Grenzen der Sitzung

- Du änderst nur `apps/<slug>/` und `docs/registrierung/<Kennung>.json`.
- Du änderst nicht: `index.html`, `README.md` (Wurzel), `impressum.html`, `docs/10-praleska-baukasten.md`, `docs/praleska-katalog.json`, `docs/plan-praleska-umsetzung.md`, `docs/fragen-und-hinweise.md`, `packages/`, andere Apps, andere Bauaufträge.
- Du registrierst nichts im Hub, in der Wurzel-README oder im Impressum. Das macht der Koordinator (die Hauptsitzung), nachdem alle Sitzungen gemerged sind.
- Du schreibst keine Modellnamen in Dateien, keine ganzen Sätze aus der Praleska, keine Zitate über 6 Wörter (docs/10, Rechtsrahmen, Punkt 1).
- Du verwendest `quiz-kern` nicht (A7 offen). Du baust keine Seitenzahlen auf das Druckblatt (A18: Standard für neue Apps).
- Speicherung nur wie docs/02, Z. 25: Nutzerdaten im localStorage, mit Löschknopf für die eigenen Schlüssel; kein sessionStorage, IndexedDB, Cookie, Cache. Werkzeuge ohne Nutzerdaten speichern nichts. Keine Anfragen nach außen.

## Schritt 1: Ausgangslage prüfen

```bash
git fetch origin claude/children-network-programs-germany-hr0jh9
git merge --ff-only origin/claude/children-network-programs-germany-hr0jh9   # nur Fast-Forward
test -f docs/bauauftraege/<Kennung>-*.md || { echo "Bauauftrag fehlt, stoppen"; exit 1; }
git fetch origin main                           # Quelle ist auf main, Commit c3deddf
tools/quelle-holen.sh "$TMPDIR/info70-quelle"   # Textkopie außerhalb des Repos
node tools/bauauftrag-pruefen.mjs "$TMPDIR/info70-quelle/all.txt"
npm run test:sitzung                            # Tests ohne die zwei Zählungs-Tests
```

Schlägt `merge --ff-only` fehl, stoppe und melde es. Ändere den Checkout nicht von Hand (kein `git checkout -- …`, kein `stash`): dann fehlt die Bauauftrag-Datei, und du stoppst, statt auf einem alten Stand zu bauen.

Wenn `npm run test:sitzung` vor deiner Arbeit rot ist, berichte das und stoppe. Baue nicht auf einem roten Stand auf. Die beiden Zählungs-Tests (Testzahlen und Impressum) sind nicht Teil dieser Prüfung; der Koordinator setzt die Zahlen (`npm run zahlen`).

## Schritt 2: Bauauftrag lesen

1. `docs/bauauftraege/VORLAGE.md` (neun Abschnitte).
2. Den Bauauftrag der Kennung. Halte die Abschnitte 2 bis 9 als Liste fest, die du abarbeitest.
3. Wenn der Bauauftrag „Blockiert durch“ nennt und die Blockade nicht aufgehoben ist: stoppe und melde das.

## Schritt 3: Bauen oder ausbauen

- Neue App (`Status: offen`): Ordner `apps/<slug>/` nach dem Muster von `apps/baby-spielideen-kartei/` und `apps/puppentheater-werkstatt/`. Pflichtdateien: `index.html`, `app.mjs`, `logik.mjs`, `druck.css`, `daten/*.json`, `package.json`, `README.md`, `GDD.md`, `test/logik.test.mjs`, `test/regeln.test.mjs`.
- Ausbau (`Status: teilweise`): die bestehende App aus dem Bauauftrag (Feld `app`) erweitern. Keine Datei außerhalb der App ändern.
- Die Regeln aus `test/regeln.test.mjs` der Puppentheater-App übernehmen (Druck über alle Einträge, Namenmuster, Zeichen aus Unicode-Blöcken, Eingabe- und Netzmuster, Knopfhöhe 3rem, Zufall nur in `app.mjs`).
- Testzahl in README und GDD der App auf die tatsächliche Zahl setzen.

## Schritt 4: Tests und Browser

```bash
cd apps/<slug> && npm test && cd -                       # Tests der App grün
node tools/serve.mjs 8099 &                              # Testserver (im Hintergrund)
node tools/browser-pruefung.mjs <slug> 8099 "$TMPDIR/info70-pruefung"
```

Das Messskript endet mit Fehlercode 1, wenn es eine Verletzung findet, und mit 2, wenn es nichts messen konnte. Ein Lauf mit Fehlercode ist keine Abnahme.

Prüfe das Ergebnis gegen die Abnahme (Abschnitt 8 des Bauauftrags):

- kein horizontaler Überlauf bei 360 px,
- Knöpfe und Links mindestens 48 px hoch,
- Fokus nach Klick auf derselben Kennung,
- Speicher gleich null, nur `localhost`,
- im Druck keine Zeichen und keine Namenszeile, Bildschirmteile ausgeblendet,
- Zahl gedruckter Karten gleich Auswahl.

Eine Abweichung behebst du. Die Messung „Neuladen ohne Netz“ ist keine Abnahmebedingung (F4); sie wird berichtet.

- Externe Fakten (Normen, Studienzahlen, Erste-Hilfe-Angaben, Aussagen von Behörden oder Verbänden) stehen nur mit einer Quelle aus dem Praleska-Buch oder mit dem Vermerk „(Eigenentwurf, fachlich nicht geprüft)“ am Satz. Der Test „externe Fakten“ in `regeln.test.mjs` prüft das.
- Vor jedem Satz „Die Quelle nennt keine …“ suchst du per grep in der Textkopie und nennst das Ergebnis im Bericht. Ohne Treffer-Nachweis steht der Satz nicht.

**Fokus nach einem Bildschirmwechsel (Lehre aus Pilot 1):**
- Verschwindet der angeklickte Knopf, weil der Bildschirm wechselt, steht der Fokus auf der Überschrift des neuen Bildschirms (`tabindex="-1"` und `.focus()`), nicht auf dem Körper der Seite.
- Der Browser-Lauf meldet diesen Fall als Abweichung, wenn der Fokus anders liegt. Begründe die Abweichung im Bericht oder behebe sie.

**Druckprüfung ist Pflicht (Lehre aus Pilot 1, siehe `docs/bauauftraege/PILOT-1.md`):**
- Die Tests der App enthalten die Druckprüfungen aus `apps/puppentheater-werkstatt/test/regeln.test.mjs`: keine Zeichen aus den Blöcken ☐☒☑✓✔★☆ und keine Emojis (`\p{Extended_Pictographic}`) im Druckinhalt, keine Namenszeile, Bildschirmteile ausgeblendet.
- Emojis in Titeln und Überschriften gelten im Druck als verboten. Auf dem Bildschirm sind sie erlaubt.
- Druckt die App Seitenangaben, steht die Pflichtmarkierung „Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.“ auf jedem gedruckten Blatt.
- Die App braucht ein eigenes Druckblatt mit `druck.css` und `@media print`. Druck des ganzen Bildschirms ist nicht zulässig.
- Bildschirmteile, die im Druck nicht erscheinen sollen (auch Emojis), tragen die Klasse `nur-bildschirm` und werden in `druck.css` mit `display: none !important` ausgeblendet. Ein Emoji im Druckinhalt zählt als Verstoß, auch wenn es nur in einer Überschrift steht.
- Im Bericht stehen die Werte `druck.zeichen` (muss leer sein) und `druck.pflichtZeilen` (muss der Zahl der Blätter mit Seitenangabe entsprechen).

## Schritt 5: Registrierungsdatei schreiben

`docs/registrierung/<Kennung>.json` mit diesen Feldern:

```json
{
  "id": "PRI-8",
  "slug": "kleine-forscher-ohne-bildschirm",
  "titel": "Kleine Forscher ohne Bildschirm",
  "status_neu": "gebaut",
  "app": "kleine-forscher-ohne-bildschirm",
  "tests_app": 0,
  "hub_zeile": "<HTML-Zeile für index.html>",
  "readme_zeile": "<Tabellenzeile für README.md>",
  "docs10_notiz": "<Satz für den Bau-Vermerk in docs/10>",
  "katalog_korrektur": "<Text für das Feld korrektur>"
}
```

Die Datei enthält nur Text, die Koordinator-Sitzung übernimmt ihn.

## Schritt 6: Committen und pushen

```bash
git add apps/<slug> docs/registrierung/<Kennung>.json
git commit -m "Sitzung <Kennung>: <Titel>" -m "<Kurzbericht>" -m "Claude-Session: <URL>"
node tools/pfad-pruefung.mjs <slug> <Kennung>    # prüft ALLE Commits der Sitzung (origin/Branch..HEAD), Umbenennungen als Löschung + Neuanlage; bricht ab bei fremden Pfaden
for i in 1 2 3; do
  git pull --rebase origin claude/children-network-programs-germany-hr0jh9 && \
  git push -u origin claude/children-network-programs-germany-hr0jh9 && break
  sleep $((i * 5))
done
```

Pushe nur auf die Arbeitsbranche, nicht auf `main`. Höchstens drei Versuche; nie `--force`. Wenn der Rebase Konflikte zeigt, stoppe und melde sie; löse sie nicht selbst in fremden Dateien. Schlägt der Push nach drei Versuchen fehl, stoppe und melde den Stand.

Die Branch-Regel gilt: nur die Arbeitsbranche, keine neue Branch ohne Erlaubnis.

## Schritt 7: Bericht

Am Ende antwortest du mit einem Kurzbericht in dieser Form:

- Kennung, Titel, Status (gebaut oder Ausbau).
- Ergebnis `npm test` der App und `npm run test:sitzung` der Wurzel (die Zählungs-Tests sind dort ausgenommen, bis der Koordinator die Zahlen setzt).
- Browser-Messung: Ergebnis je Punkt (ok oder Abweichung mit Wert).
- Offene Punkte aus dem Bauauftrag, die du nicht lösen konntest, und Gründe.
- Zeit und, falls sichtbar, Token-Verbrauch der Sitzung (für die Messung im Pilot).

## Was zwischen Push und Koordinator passiert

Nach deinem Push kann die Wurzel-Testsuite rot sein: Die Testzahl in der Wurzel-README und die Impressum-Zahl stimmen dann nicht mehr. Das ist beabsichtigt. Der Koordinator setzt beides in einem Commit nach dem Merge. Du korrigierst diese beiden Stellen nicht selbst.
