# Kurz-GDD: Arbeitsblätter in Leichter Sprache 🧩

**Einheit aus Katalog:** docs/09 Ось E — «Arbeitsblatt-Werkstatt in Leichter Sprache».
**Engine:** Leichte-Sprache-Bibliothek (liest `daten/arbeitsblaetter.json`) + Vorlesen.
Zielgruppe: Lehrkräfte / Inklusion, Kinder mit Lese-/Lernbeeinträchtigung.

## 1. Kernaussage

Zu jedem Stundenentwurf ein Arbeitsblatt in Leichter Sprache: kurze Sätze,
große Piktogramme, Vorlese-Fassung über die Web-Speech-Funktion der kinder-ui.
Macht die komplette Schul-Linie BFSG-konform auch für Kinder mit Lese- oder
Lernbeeinträchtigung.

## 2. Zielgruppe

Lehrkräfte / Förderpädagogik. Nachbarn: alle stundenentwurf-*, oer-vorlage,
projektwoche.

## 3. Ablauf

1) Arbeitsblatt wählen (Piktogramm + Titel).
2) Begriffe mit Bild + einfacher Erklärung, kurze Sätze, eine Aufgabe.
3) Vorlesen / Drucken / zum Stundenentwurf springen.

## 4. Didaktik / Nutzen

Teilhabe (UN-KRK Art. 23, UN-BRK Art. 24): identische Lerninhalte, aber
sprachlich zugänglich. Vorlesen unterstützt Kinder, die (noch) nicht lesen.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, **speichert nichts**.
BFSG/EAA (kurze Sätze, Piktogramme, Vorlesen). Nur regelkonforme Blätter
werden angezeigt (Laufzeit-Filter). Schulwerkzeug ohne eltern.html.

## 6. Tests

`test/logik.test.mjs`: ≥4 Blätter mit Piktogramm/Bezug, alle erfüllen die
Leichte-Sprache-Regeln, jeder Satz kurz, Kernbegriffe (Kettenbrief/Passwort/
Algorithmus) abgedeckt, vorleseText enthält Titel/Aufgabe, Regelprüfung
findet lange Sätze, alle Bezug-Apps existieren.

## 7. Erweiterungen (Katalog)

Mehr Blätter je neuem Stundenentwurf, Symbol-/Metacom-Piktogramme,
Sprachwahl (de-ls/uk/ru), Kopplung mit oer-vorlage (Differenzierung).
