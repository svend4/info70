# Kurz-GDD: Mathe-Entdecker 🔢

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 6 — «Mathe-Entdecker:
Zahlen, Formen, Reihen». **Engine:** @info70/quiz-kern (binär + wahl, Vorlesen).
Zielgruppe: 5–7 (kurze Einheiten, 4–5 in Ko-Nutzung).

## 1. Kernaussage

Frühe mathematische Bildung als Vorlese-Quiz: Mengenvergleich, Zählen bis 10,
Formen und ihre Ecken, Reihen/Muster fortsetzen, Größenvergleich,
Raumrichtungen, gerechtes Teilen (Hälfte) und Tageszeiten.

## 2. Zielgruppe

Vorschule 5–7. Nachbarn: reim-radar, uhr-und-kalender-kind (geplant),
sicher-unterwegs, gefuehle-entdecker.

## 3. Ablauf

1) Start (Vorlesen), gemeinsames Mitsprechen.
2) 10 Aufgaben aus 16 (quiz-kern mischt, Vorlesen je Aufgabe).
   Stand 28.10.2026: 26 Aufgaben (zehn neue, siehe Abschnitt 8); Runde weiter 10.
3) „Ende der Runde“ ohne Wertung; Duett-/Staffel-/Klassen-Modus vom quiz-kern geerbt.
   Stand 28.10.2026: Der Endbildschirm zeigt „Toll gerechnet!“ (app.mjs, fertigTitel). Den Titel entscheidet Max (`docs/fragen-fuer-max-2026-10-28.md`, Frage 13). Der Modus „Reihen legen“ steht in Abschnitt 8.

## 4. Didaktik / Nutzen

Deckt den eigenen Bildungsbereich „Mathematische Bildung“ aller Länder ab und
macht Mathe im Alltag sichtbar (zuordnen statt raten, Formen suchen). Aus 26
operationalisierten Praleska-Lernzielen abgeleitet; alle Aufgaben sind
Eigenproduktion (kein Buchtext aus der Quelle).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), keine Konten. Die App speichert
nichts und kennt keine Punkte, keinen Rekord, keine Ränge; der frühere
Schlüssel mathe.rekord wird beim Start einmal entfernt. Werbefrei. Vorlesen
(BFSG). Kinder-App mit eltern.html, im Eltern-Sammelband. Emojis als
Mengenbilder (keine externen Assets).

## 6. Tests

`test/fragen.test.mjs`: quiz-kern-Schema gültig (pruefeFragen), Mischung
binär/wahl (ja UND nein), Abdeckung (Mengen/Zählen/Formen/Reihen, Ecken,
mehr/weniger), keine Ränge in den Daten, App-Code ohne Wertung und ohne
Speicher, Mindestvorrat 12.

Stand 28.10.2026: dazu `test/logik.test.mjs` (Logik und Fragenbank) und `test/regeln.test.mjs` (Regeln der App). Die Testzahl steht in Abschnitt 8.

## 7. Erweiterungen (Katalog)

Ausbaulinie „Zahlenland bis 20“ (8–12), Mini-Simulator zum Legen von Reihen,
uk/ru-Zahlwörter als Herkunftssprachen-Chance.

Stand 28.10.2026: Der Mini-Simulator „Reihen legen“ ist gebaut (Abschnitt 8). „Zahlenland bis 20“ und die uk/ru-Zahlwörter bleiben offen.

## 8. Stand 28.10.2026: Ausbau GEM-8 (Eigenentwurf)

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

**Lernziele.** Sechs prüfbare Ziele (Eigenentwurf, Bauauftrag Abschnitt 2), als Liste in der README: Mengen vergleichen, bis 10 zählen, Hälfte, Reihen fortsetzen, Ecken und Seiten zählen, Wochentage in der Reihenfolge und eine Tageszeit.

**Daten.** Die Fragen in `daten/fragen.json` stehen in ihren Zeilen. Je Frage-Kennung trägt der Block `quellen` das Thema (`thema`), die Seite (`"quelle": { "seite": "S. n" }`) und `eigenentwurf: true`. Die Datei trägt die Seitenmarkierung als Feld `pflichtmarkierung`. Neu sind m17 bis m26, am Anfang der Liste: Linien (S. 137), Wochentage und Jahreszeiten (S. 138), links und rechts (Thema „richtung“, S. 137) und Reihen (S. 137). Bestehende Zeilen wurden nicht geändert.

**Logik** (`logik.mjs`, ohne Zufallsquelle): `erstelleReihe` legt die freie Stelle an die Stelle der Zahlenreihe (Parameter `zufallsReihe`); `pruefeReihe` prüft 3 bis 5 Objekte und die steigende Rangzahl; `neueAufgabe` macht aus einer festen Zahlenreihe Regel, Anzahl und Objekte; `folgeZu` gibt die Reihe der Aufgabe n (n mod 12, zwölf feste Reihen); `pruefeMatheFragen` prüft Schema, Thema, Seitenangabe, Eigenentwurf und den Vorrat (je Thema eine Frage, mindestens 12). `mitQuellen` führt dafür den Block `quellen` mit den Fragen zusammen.

**Oberfläche.** Der Modus „Reihen legen“ hat eine eigene Ansicht neben dem Quiz. Die Knöpfe: In die Lücke legen (je Teil ein Knopf), Teil zurücknehmen, Reihe prüfen, Auflösung zeigen, Neue Reihe, Vorlesen, Zum Quiz. Die Aufgaben folgen einer festen Reihe: die Aufgabe n nimmt die Zahlenreihe n mod 12 (`folgeZu`), ohne Zufall. Der Quiz-Motor (Bestand) nutzt weiter `mischen` von kinder-ui; die Entscheidung dazu liegt bei Max (Frage 65). Die Farben der Teile zeigen nur die Helligkeit.

**Wortliste (tools/leistungs-woerter.mjs).** Zwei Treffer, beide begründet: `rekord` in `app.mjs` ist der alte Schlüssel `mathe.rekord` für die Entfernung beim Start; nichts wird angezeigt. `⭐` in m16 ist ein zu zählender Gegenstand („Weniger Sterne?“), kein Ergebnis und keine Wertung.

Stand 29.10.2026: m16 steht als Bestand, Frage 66. Das Wort „Sterne“ bleibt bis zur Entscheidung von Max; der Regeltest zählt es je Datei gegen den Stand in HEAD. Für das Zeichen ⭐ gilt dasselbe (7 in m16).

**Tests.** `test/fragen.test.mjs` (unverändert), `test/logik.test.mjs` (Logik und Fragenbank), `test/regeln.test.mjs` (Regeln der App, nach der Vorlage puppentheater-werkstatt; prüft auch, dass Kindertexte das in Frage 66 genannte Wort nicht enthalten). Testzahl: 43 Tests.

**Offen (Entscheidungen, nicht umgesetzt).**

- Zahlwörter in uk und ru: nicht vorhanden, Entscheidung offen (Bauauftrag Abschnitt 9).
- Titel am Rundenende „Toll gerechnet!“ (app.mjs, fertigTitel): Max entscheidet (`docs/fragen-fuer-max-2026-10-28.md`, Frage 13).
- Seitenangaben: Die Arbeitsanweisung für den Ausbau verlangt den Vermerk „maschinell geprüft“. docs/02 (Z. 151–152) verlangt für Seitenangaben die Markierung „проверено человеком“. Standard A18 ist offen.
- Testdatei: Die Vorlage nennt `test/logik.test.mjs`; vorhanden war `test/fragen.test.mjs`. Entschieden: `fragen.test.mjs` bleibt, die beiden anderen kommen dazu.
- Kinder-Test (docs/02 Z. 45–46) steht aus. Die Farbreihe (hell bis dunkel) ist bei Farbsehschwäche zu prüfen.
- Zahlenland bis 20 (Katalog) bleibt offen.
- Zufall im Bestand: Der Quiz-Motor nutzt `mischen` von kinder-ui (`Math.random` in packages/kinder-ui/js/komponenten.mjs:91). Entscheidung bei Max (Frage 65).
- Stand 29.10.2026, Abweichung zu Brief GEM-8, Punkt 2: thema, quelle und eigenentwurf stehen im Block `quellen` (je Frage-Kennung), nicht je Frage. Grund: Die Bestandszeilen dürfen nach dem Brief docs/arbeitsweise/briefs/stufe-2-ausbau.md (Einheit GEM-8) nicht geändert werden. Die neuen Fragen m17 bis m26 stehen am Anfang der Liste; `mitQuellen` führt die Angaben mit den Fragen zusammen.
- Stand 29.10.2026, weitere Abweichungen zum Bauauftrag: Die Schaltfläche heißt „In die Lücke legen“ statt „Objekt anhängen“ (Brief GEM-8, Punkt 3), weil das Teil in die freie Stelle gelegt wird. Lernziel 6 ist an die Aufgaben angepasst: Wochentage in der Reihenfolge und eine Tageszeit. Für die Reihenfolge der Tageszeiten gibt es keine Aufgabe.
- Stand 29.10.2026: m14 (Bestandstext, daten/fragen.json Zeile 57) erklärt „Ein Würfel (Viereck) bleibt liegen.“ Das ist ungenau: Ein Würfel ist ein Körper, kein Viereck. Der Bestandstext bleibt unverändert; die Entscheidung liegt bei Max.
- Stand 29.10.2026: docs/02 Z. 173 (Entscheidung 22а) erlaubt die Maschinen-Marke, wenn die Prüfung belegt ist. Der Nachweis für die 26 Seitenangaben liegt im Repo noch nicht vor; die Prüfung lief gegen die Textkopie unter /tmp.
