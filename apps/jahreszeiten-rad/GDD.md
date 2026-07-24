# Kurz-GDD: Jahreszeiten-Rad 🎡

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 22 — «Jahreszeiten-Rad
(Simulator + Content-Pack)». **Engine:** datengetriebenes Rad + Monats-Finder
+ Mini-Quiz (reine Logik). Zielgruppe: 5–7 (Ko-Nutzung) / 8–12.

## 1. Kernaussage

Erlebbarer Jahreslauf: Am Rad drehen und sehen, wie sich Tageslänge (Sonnen-
Mond-Balken), Temperatur, Pflanzen, drei Tier-Strategien (Winterschlaf /
Vogelzug / Winterfell+Vorrat) und die Menschen verändern. Monats-Finder
(3 Monate = 1 Jahreszeit) und Mini-Quiz vertiefen.

## 2. Zielgruppe

Kinder. Nachbarn: nahrungsnetz-werkstatt, uhr-und-kalender-kind,
mathe-entdecker (Zeitbegriffe), klang-detektive.

## 3. Ablauf

1) Rad: 4 Jahreszeiten als Radiogroup + „Weiterdrehen“ (zyklisch).
2) Jahreszeit-Karte: Lichtbalken + Temperatur, Himmel, Pflanzen, 3 Tiere,
   Menschen – alles vorlesbar.
3) Monats-Finder: 12 Monate → Jahreszeit (tippen springt hin).
4) Mini-Quiz (6 Fragen) mit Erklärung.

## 4. Didaktik / Nutzen

Der Sachunterrichts-Klassiker, aber verknüpft statt isoliert: Licht →
Pflanzen → Tiere → Menschen als ein System. Belarussische Naturfeste der
Quelle sind durch deutsche/europäische Äquivalente ersetzt (Ostern,
Sommersonnenwende, Erntedank/Laternenfeste, Weihnachten – bewusst knapp und
säkular formuliert). Naturwissen ist im Test abgesichert (Tageslängen-Ordnung,
Strategien der drei Tiere, Quiz-Antworten gegen die Daten geprüft).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, **speichert nichts**
(nur Anzeige-Einstellung lokal). Vorlesen (BFSG). Kinder-App mit eltern.html,
im Sammelband.

## 6. Tests

`test/logik.test.mjs`: Daten gültig (4 Jahreszeiten, 12 Monate lückenlos,
3 Tiere je Jahreszeit, Quiz-Schema), Naturwissen (Tageslängen-Ordnung,
Winterschlaf/Vogelzug/wach), `jahreszeitFuerMonat` (meteorologisch),
`naechste` (zyklisch), `lichtBalken`, `vergleicheTage`, Quiz-Antworten
stimmen mit Daten überein.

## 7. Erweiterungen (Katalog)

uk/ru-Fassung (Herkunfts-Feste als Option), Tages-/Nachtbogen als Grafik,
Kopplung mit nahrungsnetz-werkstatt (Jahreszeit wirkt aufs Netz).
