# Kurz-GDD: Elternbrief-Generator ✉️

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 17 — «Elternbrief-
Generator Krippenjahr». **Engine:** Formular-zu-Text-Generator (Muster
impressum-/datenschutz-generator). Zielgruppe: Fachkräfte (Krippe, 1–3 J.).

## 1. Kernaussage

Monat, Altersband (1–2 / 2–3) und Themen wählen → fertiger Elternbrief
„Was Ihr Kind jetzt lernt“ plus je eine bildschirmfreie Spielidee für zu
Hause. Immer über die Gruppe, nie über einzelne Kinder.

## 2. Zielgruppe

Fachkräfte. Nachbarn: eingewoehnungs-leitfaden, entwicklungs-kompass,
meilenstein-begleiter (Eltern-Seite), vorlese-kompass, familienschatz-reime.

## 3. Ablauf

1) Monat + Altersband wählen (Vorbelegung: aktueller Monat).
2) Themen ankreuzen (Bewegung/Sprache/Selbstständigkeit/Miteinander/Sinne).
3) Optional Einrichtung/Gruppe eintragen (Hinweis: keine Kindernamen).
4) Brief live im Textfeld; kopieren, als .txt speichern, „Zurücksetzen“.

## 4. Didaktik / Nutzen

Elterninformation ist beim Fachkräftemangel einer der größten Zeitfresser –
der Generator liefert monatlich wiederkehrenden Nutzen und verwertet die
Zielkataloge doppelt (je Altersband eigene Texte). Spielideen sind bewusst
bildschirmfrei (BZgA-Linie unter 3). Betont die Entwicklungs-Streuung
(„Anregungen, keine Messlatte“).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), keine Kindernamen (Brief betrifft
die Gruppe; UI-Hinweis), Auswahl nur in localStorage („ebg.auswahl“) +
„Zurücksetzen“. Werbefrei. Fachkraft-Werkzeug OHNE eltern.html (der Brief
selbst IST die Elternkommunikation), nicht im Sammelband.

## 6. Tests

`test/logik.test.mjs`: Bank gültig (2 Bänder × ≥4 Themen, Lern-Text +
Spielidee je Band, Gruppen-Hinweis), Spielideen bildschirmfrei,
`normalisiereName` (Trim/60), `baueBrief` (Kopf, nur gewählte Themen,
Altersband-Texte unterscheiden sich, leer ohne Themen, ohne Kopf ohne Namen).

## 7. Erweiterungen (Katalog)

uk/ru-Briefe (nur mit geprüfter Übersetzung), weitere Monatsthemen
(Jahreszeiten), Kopplung mit vorlese-kompass/familienschatz-reime als
Spielideen-Quelle.
