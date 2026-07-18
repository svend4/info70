# Kurz-GDD: Meilenstein-Begleiter 🍼

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 4 — «Meilenstein-
Begleiter 1. Lebensjahr». **Engine:** Checkliste je U-Fenster (reine Logik +
JSON-Bank). Zielgruppe: Eltern.

## 1. Kernaussage

Beobachtungshilfe fürs erste Lebensjahr, angelehnt an die U-Untersuchungen
U3–U6: Eltern haken ab, was sie beobachtet haben, und erhalten eine
Gesprächs-Vorbereitung fürs Arzt-Gespräch (gelbes U-Heft). Keine Diagnose,
kein Screening-Ersatz, keine Kind-Daten.

## 2. Zielgruppe

Eltern (Erst-Eltern-Segment). Nachbarn (Elternwerkzeuge): autonomiephase-
navigator; Fachkraft-Nachbarn: eingewoehnungs-tagebuch, entwicklungs-kompass.

## 3. Ablauf

1) U-Fenster wählen (U3/U4/U5/U6) – Fortschritt je Fenster sichtbar.
2) Meilensteine abhaken (Klick zurücknehmbar), Vorlesen möglich.
3) Vorbereitung fürs Arzt-Gespräch kopieren; „Zurücksetzen“.

## 4. Didaktik / Nutzen

Dockt an die U-Untersuchungen an und bedient das große Erst-Eltern-Segment.
Bleibt als reine, lokale Beobachtungshilfe ohne Diagnose und ohne Kind-Screen
rechtlich unkritisch. Betont die große Streuung der Entwicklung und verweist
konsequent an die Kinderärztin/den Kinderarzt.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), keine Namen, keine Kind-Daten – nur
anonyme Haken in localStorage („mb.beobachtet“) + „Zurücksetzen“. Werbefrei.
Werkzeug für Eltern OHNE eltern.html (ist selbst das Elternwerkzeug), nicht im
Sammelband. Bewusst KEIN Kind-Screen.

## 6. Tests

`test/logik.test.mjs`: Katalog gültig (U3–U6, eindeutige Ids mit Präfix,
Warnhinweis), Bereichs-Abdeckung (Motorik/Sprache/Sozial, Greifen),
`zaehleFenster`/`offene`, `bericht` (U-Heft-Hinweis, Checkboxen, einzelnes
Fenster wählbar).

## 7. Erweiterungen (Katalog)

U7/U7a/U8/U9 als weitere Fenster (2.–5. Jahr), druckbare Fassung, uk/ru-Version,
Kopplung mit dem Autonomiephase-Navigator.
