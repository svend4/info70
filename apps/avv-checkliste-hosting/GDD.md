# Kurz-GDD: AVV-Checkliste Hosting 🗄️

**Einheit aus Katalog:** docs/09 №174 — «AVV-Checkliste Hosting».
**Engine:** Content-Pack auf der Kriterien-Check-Engine (Checkliste +
Lücken-Bericht). Zielgruppe: Betreiber.

## 1. Kernaussage

Betreiber prüfen Hosting-Anbieter und AV-Vertrag entlang Art. 28 DSGVO und
erhalten einen Lücken-Bericht als Entscheidungshilfe vor Vertragsschluss –
mit kinderspezifischen Verschärfungen (Datensparsamkeit, keine Analyse).

## 2. Zielgruppe

Betreiber, Schulträger, Vereine vor der Wahl eines Hosters. Nachbarn:
DSA-Selbstaudit, Vorsorge-Check § 24a, kriterien-check, Schulfreigabe-
Dossier (№200).

## 3. Ablauf

1) 4 Bereiche mit je 2–5 Kriterien abhaken (Checkbox + Hilfe-„details“).
2) Fortschritt live.
3) Lücken-Bericht (offene Punkte zuerst) als `.txt` speichern/kopieren.

## 4. Didaktik / Nutzen

Übersetzt die abstrakten Art.-28-Pflichten in eine abhakbare Liste und
macht die kinderspezifischen Zusatzanforderungen (EU-Standort, keine
Tracking-Dienste, kurze Log-Fristen) explizit. Der Lücken-Bericht ist die
Verhandlungsgrundlage mit dem Anbieter.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Haken nur in localStorage
(avv.status) + Zurücksetzen, Bericht-Export lokal per Blob, werbefrei.
Katalog ohne externe Links.

## 6. Tests

`test/kriterien.test.mjs`: ≥4 Bereiche/≥10 Kriterien, Art.-28-Grundlage,
die vier Prüfdimensionen (pflichtinhalte/standort/subunternehmer/kinder),
jedes Kriterium mit Aussage/Hilfe/DSGVO-Bezug, thematische Abdeckung
(Weisung, TOMs, EU-Standort, Drittland, Subunternehmer, Datensparsamkeit).

## 7. Erweiterungen (Katalog)

Schulfreigabe-Dossier „Null-Daten-Nachweis“ (№200, docs/); Verzahnung mit
Vorsorge-Check und DSA-Selbstaudit.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
