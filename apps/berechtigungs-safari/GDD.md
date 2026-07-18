# Kurz-GDD: Berechtigungs-Safari 🧭

**Einheit aus Katalog:** docs/09 №97 — «Berechtigungs-Safari». **Engine:**
katalog (kriterien-check-Muster), reine Anleitung.

## 1. Kernaussage

Viele Apps holen mehr Rechte, als sie brauchen. Die Familie geht sie
gemeinsam am echten Handy durch – und schaltet die unnötigen aus.

## 2. Zielgruppe

Eltern + Kind (8-12), gemeinsam. Nachbarn: spuren-lupe (passive Daten),
daten-schatz (Szenarien), smarte-ohren (6-8, Geräte).

## 3. Ablauf

Startkarte mit Finde-Hinweis (Android/iOS) + Punktestand → 6 Stationen
(Was heißt das? / sinnvoll / verdächtig / Detektiv-Frage / Zähler für
gefundene Datenkraken) → Abschluss: gemeinsam ausschalten. Fortschritt
lokal (safari.fund) + Zurücksetzen.

## 4. Didaktik

Schnitzeljagd-Rahmen macht ein trockenes Thema spielbar. Jede Station
kontrastiert sinnvoll (grün) vs. verdächtig (rot) – das Kriterium
„passt die Berechtigung zur Aufgabe der App?“ statt Verbotslogik. Ziel
ist Handeln (ausschalten), nicht Punkte. Gemeinsam mit Erwachsenen als
Vertrauens- und Gesprächsanlass.

## 5. Politik-Konformität (docs/02)

Reine Anleitung: fragt KEINE echten Berechtigungen ab, liest nichts vom
Gerät (Test verbietet navigator.permissions/getUserMedia/geolocation/
contacts). Keine externen Anfragen (NetzwerkWaechter), nur `safari.fund`
in localStorage + Löschknopf, werbefrei, Vorlesen, eltern.html mit
Plattform-Anleitung.

## 6. Tests

`test/daten.test.mjs`: ≥5 Stationen inkl. Pflicht mikrofon/standort/
kontakte, je Erklärung + sinnvoll + verdächtig + Frage, Finde-Hinweis
(Android/iOS) + Abschluss (ausschalten), Politik-Wächter gegen echte
Geräte-Abfragen im Code.

## 7. Erweiterungen (Katalog)

Erstes-Handy-Kompass (№98) als Übergabe-Checkliste; Druck-Urkunde
„Safari geschafft“; uk/ru + Leichte Sprache über kinder-ui.
