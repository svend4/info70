# Kurz-GDD: FOMO-Kompass 🧭

**Einheit aus Katalog:** docs/09 №15 — «FOMO-Kompass». **Engine:** szenario
(2/1/0-Muster, wie rechte-kompass).

## 1. Kernaussage

Die Angst, etwas zu verpassen, ist ein eingebauter Hebel – kein
Charakterfehler. Der Kompass macht die Mechanik sichtbar und trainiert
die ruhige Grenze.

## 2. Zielgruppe

Kinder 8-12. Nachbarn: sog-maschine (Halte-Mechaniken erklärt),
takt-pause (Bildschirmzeit), feed-forscher (Algorithmus).

## 3. Ablauf (Loop)

1. 12 Szenarien gemischt; 3 Reaktionen mit Wert 2/1/0.
2. Stärkste Antwort = ruhige Grenze / Selbstschutz (nie Wut-Rückzug).
3. Auflösung: 🔎 benennt die FOMO-Mechanik + 💡 konkreter Tipp.
4. „Ende der Runde“ mit drei Anker-Merksatz; das Kind wird nicht bewertet
   (keine Punkte, kein Rekord, keine Ränge). Die Stufe 2/1/0 steuert nur die
   Rückmeldung zur einen Antwort, es wird nichts gezählt.

## 4. Didaktik

Mechanik-Breite ist Lerninhalt: Streak-Falle, Autoplay-Sog, künstliche
Verknappung (Countdown), Lesebestätigungs-Druck, Like-Zahlen, Nachschau-
Schleife, Benachrichtigungs-Erlaubnis. Entlastung durch Benennen: „Der
Sog ist eingebaut“ nimmt Scham. Handlungswissen statt Verbot: Töne aus,
Handy außer Reichweite, entfolgen, nachfragen statt grübeln.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), die App speichert nichts
(darum keine Karte „Meine Daten löschen“; der alte Schlüssel `fomo.rekord`
wird beim Start einmal entfernt), Vorlesen, mobile-first, eltern.html, 116 111 auf Start-
und Hilfsebene. Plattformneutral (keine Markennamen).

## 6. Tests

`test/szenarien.test.mjs`: Schema + exakt [0,1,2] je Szenario, Mechanik-
und Tipp-Pflicht, Mechanik-Breite (6 Muster), stärkster Zug ist ruhig
(Stop-Liste gegen Wut-Rückzug), 116 111 + „jetzt oder nie“ in der App.
Zwei Abwesenheits-Tests: keine Wertung im Code und in den Daten (kein Zähler,
kein Rekord, keine Ränge), Speicherregel erfüllt (kein setItem, keine Karte,
Migration in einer Zeile).

## 7. Erweiterungen (Katalog)

Klassen-Modus (Klasse stimmt über die beste Reaktion ab); Jugendversion
13+ (Vergleichsdruck, Body-Image – Brücke zu filter-spiegel); uk/ru +
Leichte Sprache über kinder-ui.
