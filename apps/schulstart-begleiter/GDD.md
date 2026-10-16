# Kurz-GDD: Schulstart-Begleiter 🎒

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 2, «Schulstart-Begleiter». Stand v0.2.0:
Checkliste mit Angeboten des Erwachsenen. Die Vorgängerfassung (Beobachtungsbogen je Kind,
Schlüssel `ssb.daten`) ist entfallen. Der Name bleibt, weil andere Apps auf den Ordner verweisen.
Zielgruppe: pädagogische Fachkräfte (letztes Kita-Jahr).

## 1. Kernaussage

Eine Checkliste für Fachkräfte: fünf Bereiche mit je sechs Angeboten des Erwachsenen für den
Schulstart (Raum, Material, Spiele, eigenes Handeln). Jedes Angebot wird als **angeboten**,
**noch offen** oder **trifft nicht zu** markiert. Gezählt wird je Bereich. Ausgegeben wird ein
Druckbogen für die Teambesprechung. Kein Kind wird erfasst, bewertet oder verglichen.

## 2. Zielgruppe und Kernerlebnis

Fachkräfte und Team. Kein Kinder-Bildschirm. Ein Satz: «Ich hake in fünf Bereichen ab, welche
Angebote für den Schulstart bei uns angeboten werden, und drucke den Bogen für die Besprechung.»

## 3. Ablauf

1. Bereich öffnen und je Angebot eine der drei Auswahlmöglichkeiten wählen. Ohne Wahl gilt „noch offen“.
2. Die Zählung des Bereichs (z. B. „angeboten: 3 von 6“) aktualisiert sich. Es gibt keine Summe
   über alle Bereiche und keine Prozentwerte.
3. Druckbogen drucken. Der Bogen enthält keinen Namen und keine Angaben zu Kindern.

## 4. Motor und Technik

Dünner DOM-Layer (`app.mjs`) über reiner Logik (`logik.mjs`) und einem JSON-Katalog
(`daten/indikatoren.json`). Bausteine: `kinder-ui` (`el`, `lokaleStimme`, `vorlesen`, CSS) und
`kinderschutz` (`installiereNetzwerkWaechter()`, beim Start aufgerufen). Der Zustand ist eine
Variable der Seite. Beim Klick werden nur die Knöpfe der Zeile, die Bilanz des Bereichs und die
Druckzeilen aktualisiert.

## 5. Lernziele (prüfbar)

1. Fachkraft kann die Angebote in fünf Bereichen prüfen und jedes als angeboten, noch offen oder
   trifft nicht zu markieren.
2. Das Team kann den Druckbogen nutzen und die Zählung je Bereich lesen, ohne Gesamtzahl und ohne
   Prozentwert.
3. Fachkraft kann erklären, warum die Seite nichts über Kinder erfasst, nichts speichert und nichts
   bewertet (docs/02, Z. 141–146).

## 6. Politik-Konformität (docs/02)

[x] Werbefrei, keine Käufe, keine Konten, keine Links zu kommerziellen Seiten
[x] Keine Kinderdaten: kein Name, kein Kürzel, keine Angabe je Kind, kein Eingabefeld
[x] Keine Speicherung auf dem Gerät: kein `setItem`, kein `sessionStorage`, keine IndexedDB,
    keine Cookies. Nur das Entfernen des Altbestands `ssb.daten` beim Start.
[x] Keine externen Anfragen: CSP `default-src 'self'` und `installiereNetzwerkWaechter()`
[x] Keine Bewertung eines Kindes: keine Ampel, keine Stufe, keine Punkte, keine Prozent,
    keine Rangfolge (docs/02, Z. 141–146)
[x] Keine Zeile für den Namen auf dem Druckbogen
[x] Modellnamen: keine in Dateien, Kommentaren oder Texten (Test in `test/quellcode.test.mjs`)
[x] Barrierefreiheit: Umschalter mit `aria-pressed`, jeder Knopf trägt das Angebot im `aria-label`
[x] Vorlesen nur mit einer Stimme auf dem Gerät (`localService`), sonst Hinweis
[x] Druckbogen: `druck.css` mit `@media print`
[x] `eltern.html` für Träger und Leitung, Titel und `lang` erhalten, im Sammelband
[x] Impressum und Datenschutz verlinkt (`../../impressum.html`), Footer-Link zu `eltern.html` erhalten

## 7. Kernentscheidungen (Stand v0.2.0)

- **Variante A (Entscheidung des Nutzers):** Die App bewertet kein Kind mehr und speichert keine
  Kinderdaten auf dem Gerät. Die Zielgruppe sind die Angebote des Erwachsenen.
- **Drei Auswahlmöglichkeiten ohne Rangfolge:** angeboten, noch offen, trifft nicht zu.
- **Zählung nur je Bereich** (z. B. „angeboten: 3 von 6“). Keine Summe über alle Bereiche, keine
  Prozentwerte. „trifft nicht zu“ zählt nicht als angeboten.
- **Eigenentwürfe mit Merkmal-Kennung:** Jedes Angebot nennt genau ein Merkmal (`quelleMerkmal`,
  z. B. `sprache-1`) und trägt die Kennzeichnung „Eigenentwurf nach Merkmal sprache-1“.
- **Keine Speicherung:** Der Zustand lebt nur im Speicher der Seite. Beim Start wird der Altbestand
  `ssb.daten` einmal entfernt (try/catch, nur Entfernen).
- **Kein Export, kein Import, kein Koffer.** `kompass.mjs` und sein Test sind entfernt. Alte
  Sicherungsdateien werden nicht mehr gelesen.
- **Kein Kinderbericht, kein Kopieren.** Der Druckbogen ist eine Checkliste, kein Bericht.
- **Vorlesen** nur mit einer Stimme, die auf dem Gerät liegt. Sonst bleibt es still, und die
  Seite zeigt einen Hinweis.
- **Keine Rechtsangaben.** Der frühere Verweis auf § 35 Abs. 3 SchulG NRW in `eltern.html` ist
  entfernt, weil er nicht als geprüft in `docs/` steht (siehe Offen, Punkt 1).

## 8. Tests

29 Tests in drei Dateien: `test/indikatoren.test.mjs` (Katalog: Schema, Kennungen, Auswahl,
Merkmale, Sprache der Angebote, keine Beobachtungs-Verben und keine Bewertungswörter),
`test/logik.test.mjs` (Katalogprüfung, Zählung je Bereich, Auswahl, Druckmarken, Altbestand) und
`test/quellcode.test.mjs` (keine Speicherwege, keine Adressen, keine Kinder- und Koffer-Begriffe,
Seitenaufbau, Druck, Startverdrahtung, eltern.html, Modellnamen).

```bash
node --test apps/schulstart-begleiter/test/*.test.mjs
```

Ergebnis: 29 von 29 grün.

## 9. Offen (Entscheidungen des Nutzers oder des Teams)

1. **Rechtsangabe:** Soll der Verweis auf § 35 Abs. 3 SchulG NRW in `eltern.html` wieder
   aufgenommen werden? docs/02, Z. 151–152, lässt eine Paragrafen-Angabe nur mit der Markierung
   «проверено человеком» zu. Diese Markierung fehlt, deshalb bleibt er ohne Prüfung entfernt.
2. **Durchsicht der Zuordnung:** Die Zuordnung der 30 Angebote zu den Merkmalen ist ein Eigenentwurf.
   Eine Durchsicht durch eine Fachkraft ist offen. Die Wortlaute der früheren Merkmale stehen in
   der Git-Historie bis f16a54b.
3. **Rücksetzen ohne Löschen:** Der frühere Löschknopf ist entfallen. Ein Knopf „Alle Angaben
   leeren“ (nur der Speicher der Seite) wäre möglich, widerspricht aber der Liste der entfallenden
   Funktionen. Entscheidung offen.
4. **Name:** Der Name „Schulstart-Begleiter“ bleibt. Eine Umbenennung würde Hub, Sammelband und die
   Verweise aus anderen Apps betreffen (siehe unten).
5. **Teamtest:** Sind die 30 Angebote für eine Gruppe vollständig genug? Wird der Druckbogen in der
   Besprechung genutzt?

## 10. Außerhalb des Ordners (nicht geändert)

Diese Stellen sind nicht Teil des Ordners und wurden nicht geändert. Sie müssen gesondert
angepasst werden:

- `README.md` (Wurzel), Zeile 185: Beschreibung `Лист наблюдения школьной зрелости (5×6, кюрцель, без скоринга)`
  passt nicht mehr (kein Kürzel, kein Beobachtungsbogen mehr).
- `README.md` (Wurzel), Zeile 83: die Gesamtzeile „Полный прогон“ nennt 1870. Gezählt werden beim Lauf
  dieser Änderung über alle Apps und Pakete 1912. Für diese App hat sich der Anteil von 11 auf 29
  Prüfungen erhöht. Der Test `packages/kinderschutz/test/testzahlen.test.mjs` schlägt an.
- `index.html` (Hub), Zeile 174: Linktext `🎒 Schulstart-Begleiter – Beobachtungsbogen zur Schulfähigkeit`.
  Das Linkziel `apps/schulstart-begleiter/` bleibt gültig.
- `impressum.html`, Zeile 55: `98 gar nichts` und `113`. Der Test
  `packages/kinderschutz/test/datenschutz-zusage.test.mjs` erwartet nach dieser Änderung
  `102 gar nichts` und `109` speichernde Apps (diese App speichert nicht mehr).
- `apps/eltern-sammelband/daten/apps.json`, Zeile 96: Eintrag `schulstart-begleiter` bleibt gültig,
  weil `eltern.html` vorhanden ist.
- `apps/elterngespraech-uebergang/app.mjs`, Zeile 244 (`Beobachtung durch Fachkräfte: Schulstart-Begleiter`)
  und `apps/elterngespraech-uebergang/GDD.md`, Zeile 30 (`Für Fachkräfte gibt es den Beobachtungsbogen
  schon`): Wortwahl passt nicht mehr.
- `apps/schulanfang-spiel-navigator/app.mjs`, Zeile 151 (`Für Fachkräfte, mit Beobachtungsbogen`),
  `apps/schulanfang-spiel-navigator/GDD.md`, Zeile 71 (`enthält einen Beobachtungsbogen`) und
  `apps/schulanfang-spiel-navigator/README.md`, Zeile 81 (`с листом наблюдения`): Wortwahl passt nicht mehr.
  Der Test `apps/schulanfang-spiel-navigator/test/logik.test.mjs` prüft nur das Vorhandensein und bleibt grün.
- `apps/buchecke-check/GDD.md`, Zeile 58: nennt `schulstart-begleiter` unter den Apps mit
  `localStorage`. Das ist falsch geworden.
- `apps/entwicklungs-kompass/GDD.md`, Zeile 111: „eigene Kopie von `logik.mjs` und `kompass.mjs`“.
  `kompass.mjs` gibt es in dieser App nicht mehr.
- `docs/10-praleska-baukasten.md`, Zeile 173: nennt für `schulstart-begleiter` die alte Zahl mit den
  alten Dateinamen (indikatoren, logik, kompass). Der Test `packages/kinderschutz/test/testzahlen.test.mjs`
  erwartet nach dieser Änderung die Zahl 29 und schlägt an. Zeile 173 beschreibt außerdem Koffer, Bericht
  und Stufen des alten Stands. Eine neue Wellen-Notiz oder eine Korrektur ist nötig.
- `docs/10-praleska-baukasten.md`, Zeile 436: Eintrag „Erwachsenen-Katalog+Checkliste+Bericht“ und
  „Digitaler Beobachtungs- und Berichtsbogen“ beschreibt den alten Stand.
- `docs/praleska-katalog.json`, Zeile 32 und 1135: Titel `Schulstart-Begleiter: Beobachtungsbogen zur
  Schulfaehigkeit`. Der Titel ist unverändert gültig; die Beschreibung des Eintrags ist zu prüfen.
