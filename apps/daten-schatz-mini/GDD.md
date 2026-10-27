# Kurz-GDD: Daten-Schatz Mini 🗝️

**Einheit aus Katalog:** docs/09 Ось A / Nr. 165 — «Daten-Schatz Mini (6-8)».
**Engine:** neu: einfacher 2-Antworten-Sortierer (Piktogramme, Vorlesen).
Zielgruppe: 6–8.

## 1. Kernaussage

Die 6-8-Variante von daten-schatz: Name, Adresse, Fotos – was ist geheim?
Mit großen Piktogrammen, automatischem Vorlesen und nur zwei Antworten.
Ziel: erste Unterscheidung „darf jeder wissen / bleibt geheim“.

## 2. Zielgruppe

Kinder 6–8. Nachbarn: daten-schatz (8–12), smarte-ohren, foto-ampel,
nachrichten-detektive-junior.

## 3. Ablauf

1) Karte mit Piktogramm + kurzer Satz, wird vorgelesen.
2) Zwei Knöpfe: „🌍 Darf jeder wissen“ / „🔒 Bleibt geheim“.
3) Rückmeldung + einfache Erklärung zu jeder Karte; am Ende „Ende der Runde“
   ohne Bewertung (keine Punkte, kein Rekord, keine Ränge).

## 4. Didaktik / Nutzen

Datensparsamkeit für Erstleser*innen: konkret, bildhaft, hörbar. Schutzdaten
(Passwort, Adresse, Schule, allein zu Hause, Nacktfoto) klar als geheim.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei. Es wird nichts
gespeichert, darum gibt es keine Karte „Meine Daten löschen“; der frühere
Eintrag (Schlüssel dsm.rekord) wird beim Start einmal entfernt. Vorlesen
(BFSG). Kind-nah → eltern.html, im Eltern-Sammelband.

## 6. Tests

`test/sachen.test.mjs`: Zielgruppe 6-8, ≥8 vollständige Karten, Balance
(geheim/offen je ≥3), Leichte Sprache (kurze Sätze), Kern-Schutzdaten
(Passwort/Adresse) sind geheim, keine Bewertung und kein Speicher im
App-Code (Abwesenheits-Tests), Speicherregel (kein setItem, keine Karte).

## 7. Erweiterungen (Katalog)

Mehr Karten, Symbol-/Piktogramm-Sets, Kopplung mit daten-schatz (8-12) als
Aufstieg, Familien-Variante.
