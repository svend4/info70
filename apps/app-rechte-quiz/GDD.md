# Kurz-GDD: App-Rechte-Quiz 🔑

**Einheit aus Katalog:** docs/09 №53 — «App-Rechte-Quiz». **Engine:**
quiz-kern (Content-Pack, inkl. Klassen-Modus).

## 1. Kernaussage

Passt die Berechtigung zur Aufgabe der App? Wer diesen Abgleich macht,
sagt bei unnötigen Rechten „Nein“.

## 2. Zielgruppe

Kinder 8-12. Ergänzt berechtigungs-safari (Familie, echtes Handy).
Nachbarn: spuren-lupe, daten-schatz, formular-falle.

## 3. Ablauf

quiz-kern-Standard: Start → 12er-Runde → binaer (Passt/Passt nicht) und
wahl mit Erklärung → Rang + Rekord. Zusätzlich Klassen-Modus.

## 4. Didaktik

Der Abgleich Berechtigung ↔ Aufgabe ist das Kernwerkzeug. Balance-Test:
es gibt passende (Kamera-App→Kamera) UND unpassende (Taschenlampe→Kontakte)
Fälle, damit das Kind ABWÄGT statt pauschal „Nein“. Zusätzlich: Rechte
sind jederzeit rücknehmbar (Einstellungen). Ein Grenzfall (Rechen-App mit
Sprachaufgaben) übt echtes Überlegen.

## 5. Politik-Konformität (docs/02)

Netzwerk-Wächter, quiz-kern macht keine Anfragen, Fälle beschrieben, nur
`arq.rekord` + Löschung, werbefrei, Vorlesen, eltern.html.

## 6. Tests

`test/fragen.test.mjs`: quiz-kern-Schema (≥12), Balance (ja+nein bei
„Passt das?“), Typ-Mischung, Berechtigungs-Abdeckung (Mikrofon/Kamera/
Standort/Kontakte) + Kern-Regel + Rücknehmbarkeit, Rang-Erreichbarkeit.

## 7. Erweiterungen (Katalog)

Verknüpfung mit berechtigungs-safari; uk/ru + Leichte Sprache über
kinder-ui.
