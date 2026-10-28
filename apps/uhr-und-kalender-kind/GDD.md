# Kurz-GDD: Uhr- und Kalender-Kind ⏰

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 24 — «Uhr- und
Kalender-Kind». **Engine:** CSS-Analoguhr + gemischtes Rätsel-Quiz (reine
Logik für Zeigerwinkel und Uhrzeit-Sprache). Zielgruppe: 5–7.

## 1. Kernaussage

Analoguhr lesen (volle Stunde, „halb“, „Viertel nach/vor“ – kindgerechte
deutsche Uhrzeit-Sprache) und Kalender verstehen (7 Tage = Woche,
Tagesphasen, 4 Jahreszeiten = Jahr). Die Uhr wird mit beweglichen Zeigern
rein per HTML/CSS gezeichnet.

## 2. Zielgruppe

Vorschule/Klasse 1. Nachbarn: jahreszeiten-rad, mathe-entdecker, reim-radar.

## 3. Ablauf

1) Start zeigt eine Beispiel-Uhr (3 Uhr) und erklärt kleine/große Zeiger.
2) 8 Rätsel aus 12 (gemischt): Uhr-Rätsel (Uhr-Bild + 3 Zeit-Optionen,
   gemischt) und Kalender-Fragen; alles vorlesbar.
3) Auflösung mit richtiger Zeit + Erklärung; am Ende „Ende der Runde“ ohne
   Bewertung (keine Punkte, kein Rekord, keine Ränge); Abschluss-Impuls
   „schau auf eine echte Uhr“.

## 4. Didaktik / Nutzen

Uhr und Kalender sind ein garantierter Dauerbrenner am Übergang Vorschule/
Klasse 1 mit stabiler Eltern-Nachfrage. Die kolloquiale deutsche Uhrzeit-
Sprache („halb 5“ = 4:30) ist als reine Funktion implementiert und getestet –
genau die Stelle, an der Kinder (und Apps) sonst stolpern.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), keine Bilder von außen (Uhr ist
HTML/CSS mit `role=img` + sprechendem aria-label), die App speichert nichts
und hat deshalb keine Karte „Meine Daten löschen“; der alte Schlüssel
`uhr.rekord` wird beim Start einmal entfernt (Migration). Das Kind wird nicht
bewertet. Werbefrei. Vorlesen + Anzeige-Einstellungen (BFSG). Kinder-App mit
eltern.html, im Sammelband.

## 6. Tests

`test/logik.test.mjs`: `zeigerWinkel` (3:00/6:30/9:45/12:00), `uhrText`
(voll/halb/Viertel, Übergang über 12), Fragenbank gültig (beide Typen,
Minuten nur 0/15/30/45, Optionen eindeutig), `uhrOptionen` (erste = richtig),
Kalender-Wissen-Stichproben (7 Tage, Mittwoch, 4 Jahreszeiten), kaputte
Ablenker werden erkannt; Abwesenheit von Rang-Funktion und `raenge` in den
Daten; Speicherregel (kein `setItem`, keine Karte „Meine Daten löschen“,
Migration nur als eine Zeile `removeItem`).

Stand: 28 Tests in zwei Dateien, siehe Abschnitt 8.

## 7. Erweiterungen (Katalog)

„Stell die Uhr“-Modus (Zeiger ziehen), 5-Minuten-Schritte für 8–12,
digitale Uhr als Vergleich, uk/ru-Zeitbegriffe.

## 8. Teststand und Quellenprüfung

28 Tests in zwei Dateien: 20 in `test/logik.test.mjs` und 8 in `test/regeln.test.mjs`. Neu im Ausbau nach KIN-17: `kalenderBeziehungen` und `pruefeKalenderFragen` (Monat mit 4 bis 5 Wochen, Jahreszeit mit 3 Monaten), `zahlen` (Zahlwörter, Zusammensetzungen, halbe Werte), `tageszeitFrage` (gleiche Zufallsreihe, gleiche Frage, alle Ablenker-Paare) sowie die Fragen k07 bis k11 zu Monat, Jahreszeit, Sonnenaufgang, Sonnenuntergang und Dämmerung.

Offen: `tageszeitFrage` ist noch nicht in die App verdrahtet (die Tageszeit-Fragen kommen aus `daten/fragen.json`). Die Regelprüfung steht in `test/regeln.test.mjs`; sie lässt nur die Migrationszeile `removeItem` zu (Entscheidung 33а). Die Prüfung der Kalenderfragen läuft im Test, nicht beim Start der App (`app.mjs` prüft nur `pruefeFragen`). Die Stoppuhr (S. 233) ist nicht gebaut. Die Kennzeichnung der Uhr-Fragen u01 bis u06 fehlt: sie tragen weder `quelle` noch `eigenentwurf` (Bauauftrag KIN-17, Z. 42 und 117). Ein Test mit Kindern der Zielgruppe steht aus.

Seitenangaben: „S. 233“ steht bei k01, k05 und k07 bis k11. Geprüft wurde der Kern dieser Fragen, also die Kernzahl und der Kernbegriff, durch eine Stichwortsuche auf S. 233 der Arbeitskopie (Textkopie des PRALESKA-PDF, erzeugt mit `tools/quelle-holen.sh`, außerhalb des Repos; Stand 28.10.2026). Gefunden wurden 7 Tage (k01), 4 Jahreszeiten (k05), 4 bis 5 Wochen (k07), 3 Monate (k08), Sonnenaufgang (восход, k09), Sonnenuntergang (закат, k10) und Dämmerung (сумерки, k11). Nicht geprüft sind die Erklärungen. Die Namen der Wochentage (k01) und der Jahreszeiten (k05) in den Erklärungen stehen nicht auf S. 233; sie sind eigene Formulierungen.
Die Fragen k02, k03, k04 und k06 sind eigene Entwürfe (`eigenentwurf: true`) und tragen keine Seitenangabe. Bei k06 steht das Stichwort Dämmerung auf S. 233, die richtige Antwort „Am Abend“ nicht.
Kennzeichnung: Der Bauauftrag (Abschnitt 1, Z. 19) verlangt „(Eigenentwurf)“ für alles, was nicht aus der Quelle stammt. Das Datenfeld `eigenentwurf` steht bei den Kalenderfragen k01 bis k11; die App zeigt es nicht. Ob `eltern.html` die Eigenentwürfe nennen soll, ist eine Entscheidung für Max.
Keine Folge von vier Wörtern aus dem Buch in der App: Am 28.10.2026 geprüft, ob in README, GDD, Quelltext, Daten oder Tests eine Folge von vier Wörtern aus der Textkopie vorkommt. Ergebnis: keine. Einzelne Stichworte aus dem Buch stehen oben unter Seitenangaben. Die Bauaufträge in `docs/bauauftraege` nennen Begriffe mit Seitenangabe und eine Grenze von höchstens 6 Wörtern; das Werkzeug `tools/bauauftrag-pruefen.mjs` prüft sie. Woher die Zahl 6 stammt, ist nicht eindeutig: docs/10 Punkt 1 verlangt nur, dass kein Text wörtlich übernommen wird. Das ist für den Koordinator zu klären.
Die Wertungsprüfung in `test/regeln.test.mjs` ist eine Stichprobe. Ihre bisher bekannten Grenzen (nicht erkannt und Fehlalarme) stehen im Kopf der Datei; die Liste ist nicht vollständig.

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
