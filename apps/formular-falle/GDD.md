# Kurz-GDD: Formular-Falle 📝

**Einheit aus Katalog:** docs/09 №48 — «Formular-Falle». **Engine:**
szenario (2/1/0), Content-Pack.

## 1. Kernaussage

Formulare sind die häufigste Datenfalle. Ein gutes Kinder-Formular fragt
nur Spitzname + Passwort – alles darüber ist ein Grund zum Abbrechen.

## 2. Zielgruppe

Kinder 8-12. Nachbarn: daten-schatz, spuren-lupe, seiten-scanner,
dark-pattern-labyrinth. Bindet Hilfe-Insel ein.

## 3. Ablauf

Start → 8 nachgebaute Formulare → 3 Handlungen (alles ausfüllen / nur
Spitzname / abbrechen & Eltern fragen) mit 2/1/0 → Auflösung: Erklärung +
Warnung-Label. „Ende der Runde“ mit Abschluss-Faustregel; das Kind wird nicht
bewertet (keine Punkte, kein Rekord, keine Ränge). Die Stufe 2/1/0 steuert nur
die Rückmeldung zur einen Antwort. Hilfe-Insel jederzeit.

## 4. Didaktik

Verbotene Abfragen (Adresse, Telefon, Foto, Schule) + Warnsignale
(Sternchen-Pflichtfeld, vorangekreuztes Häkchen, versteckte Kosten,
überzogene App-Rechte, schwer gemachtes Löschen). Ein Szenario zeigt ein
GUTES Formular (nur Spitzname) für den Kontrast, damit das Kind nicht
„alles ist Falle“ lernt. Sichere Reaktion ist immer benannt.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), die App speichert nichts (darum
keine Karte „Meine Daten löschen“; der alte Schlüssel `ff.rekord` wird beim
Start einmal entfernt), werbefrei, Vorlesen, mobile-first, eltern.html,
Hilfe-Insel (116 111). Formulare erfunden, nichts wird eingegeben/übertragen.

## 6. Tests

`test/szenarien.test.mjs`: Schema (keine Ränge), je Szenario Warnung+Erklärung +
2/1/0 (genau eine 2, mind. eine 0), positives Kontrast-Beispiel,
Abdeckung (Adresse/Telefon/Foto/Schule/Pflichtfeld/Häkchen/Abo),
Hilfe-Insel eingebunden. Zwei Abwesenheits-Tests: keine Wertung im Code und in
den Daten (kein Zähler, kein Rekord, keine Ränge), Speicherregel erfüllt (kein
setItem, keine Karte, Migration in einer Zeile).

## 7. Erweiterungen (Katalog)

Klassen-Modus; Druck-Merkzettel „Was gebe ich nie an?“; uk/ru + Leichte
Sprache über kinder-ui.
