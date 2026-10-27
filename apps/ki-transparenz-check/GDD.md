# Kurz-GDD: KI-Transparenz-Check 🤖

**Einheit aus Katalog:** docs/09 №68 — «KI-Transparenz-Check». **Engine:**
Content-Pack auf der Kriterien-Check-/fragFINN-Selbsttest-Engine
(Checkliste + Bericht-Export). Zielgruppe: Betreiber.

## 1. Kernaussage

Wer KI in einem Kinderangebot einsetzt, geht die Pflichten der EU-KI-
Verordnung (AI Act) Punkt für Punkt durch: Verbote (Art. 5),
Risiko-Einstufung, Transparenz (Art. 50), Dokumentation. Ergebnis ist ein
lokaler Prüfbericht als Vorbereitung – kein offizielles Konformitätsurteil.

## 2. Zielgruppe

Betreiber, Redaktionen, Schulen, die KI (Chatbot, Empfehlungen,
Bildgeneratoren, Alterseinschätzung) in Kinderangeboten nutzen. Nachbarn:
kriterien-check, fragfinn-selbsttest, bfsg-check, impressum-/datenschutz-
Generator. Kinder-Pendant: bot-oder-buddy, deepfake-spuernase.

## 3. Ablauf

1) 4 Bereiche mit je ~3 Kriterien durchgehen (Checkbox + Hilfe-„details“).
2) Fortschritt live; Notizfeld für offene Punkte.
3) Prüfbericht: als `.txt` speichern/kopieren, „Zurücksetzen“. Offene
Punkte werden gesondert gelistet.

## 4. Didaktik / Nutzen

Übersetzt den abstrakten AI Act in konkrete Ja/Nein-Fragen mit
Kinderfokus: das Verbot, die Verletzlichkeit von Kindern auszunutzen
(Art. 5 lit. b), die klare KI-Kennzeichnung für Kinder (Art. 50) und die
Kindeswohl-Folgenabschätzung (UN-KRK GC 25, DSA Art. 28). Hilfe zur
Selbsthilfe, ausdrücklich keine Rechtsberatung.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Haken/Notiz nur in localStorage
(kitc.status, kitc.notiz) + Zurücksetzen, Bericht-Export lokal per Blob,
werbefrei. Eingabehinweis „Keine Namen von Kindern eingeben.“ am Notizfeld. Der Katalog (daten/kriterien.json) enthält keine externen Links.

## 6. Tests

`test/kriterien.test.mjs`: 4 AI-Act-Bereiche, eindeutige IDs, ≥10
Kriterien, Hinweis als Selbst-Check, jedes Kriterium mit Aussage/Hilfe/
Bezug (AI Act/DSGVO/DSA/UN-KRK), thematische Abdeckung (Art. 5, Art. 50,
Hochrisiko, KI-Kennzeichnung, Datensparsamkeit), Verbote mit Kinder-Bezug. `test/eingabe-hinweis.test.mjs`: Hinweis „Keine Namen
von Kindern eingeben.“ am Notizfeld (sichtbar, direkt vor dem Feld, aria-describedby),
Feldname „Notizen“ unverändert. Gesamt 10 Tests (vorher 5).

## 7. Erweiterungen (Katalog)

KI-Kennzeichnungs-Generator (№69, Kennzeichnungstexte de/uk/ru),
Meldewege-Planer (№74); Verzahnung mit datenschutz-baukasten (№58).

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
