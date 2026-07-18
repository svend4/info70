# Kurz-GDD: Eltern-Rechtebriefe ✉️

**Einheit aus Katalog:** docs/09 №189 — «Eltern-Rechtebriefe». **Engine:**
Formular-zu-Text-Generator. Zielgruppe: Eltern und Fachkräfte.

## 1. Kernaussage

Fertige Musterbriefe zum Ausüben der DSGVO-Rechte des Kindes: Auskunft
(Art. 15), Löschung (Art. 17), Widerruf der Einwilligung (Art. 7) – mit
Ausfüllhilfe und Kopier-Funktion.

## 2. Zielgruppe

Eltern und Fachkräfte (Erwachsene, kein eltern.html). Nachbarn:
datenschutz-baukasten, ombuds-landkarte, daten-radiergummi (Kinder-Sicht des
Löschrechts).

## 3. Ablauf

1) Recht wählen (Auskunft / Löschung / Widerruf).
2) Angaben ausfüllen (nur für den Brief).
3) Brief kopieren, als `.txt` speichern oder drucken.

## 4. Didaktik / Nutzen

Senkt die Hürde, Betroffenenrechte tatsächlich wahrzunehmen: der Brief
enthält den richtigen Artikel, den Fristhinweis (ein Monat, Art. 12 Abs. 3)
und den Hinweis auf das Beschwerderecht (Art. 77). Beim Löschantrag wird das
besonders starke Kinder-Löschrecht (Erwägungsgrund 65) betont.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei. Es wird NICHTS
gespeichert – die Angaben leben nur im Seitenspeicher (Test: kein setItem).
Export/Druck lokal. Muster ohne Gewähr, keine Rechtsberatung.

## 6. Tests

`test/logik.test.mjs`: drei Muster mit richtigen Artikeln (15/17/7),
baueBrief übernimmt Angaben + Betreff + Fristhinweis + Art. 77, Löschantrag
mit Kinder-Löschrecht (Erwägungsgrund 65), Widerruf setzt den Zweck ein,
Platzhalter bei leeren Angaben, keine externen Links, Datenvermeidung.

## 7. Erweiterungen (Katalog)

Weitere Muster (Berichtigung Art. 16, Widerspruch Art. 21); mehrsprachig
(de/uk/ru); Verzahnung mit ombuds-landkarte (Beschwerdestellen).
