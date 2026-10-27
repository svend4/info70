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

## 7. Erweiterungen (Katalog)

„Stell die Uhr“-Modus (Zeiger ziehen), 5-Minuten-Schritte für 8–12,
digitale Uhr als Vergleich, uk/ru-Zeitbegriffe.
