# Kurz-GDD: DSA-Selbstaudit 🚦

**Einheit aus Katalog:** docs/09 №168 — «DSA-Selbstaudit Minderjährigen-
schutz». **Engine:** Checkliste auf dem kriterien-check-Muster, erweitert um
eine 3-Zustands-Ampel. Zielgruppe: Betreiber.

## 1. Kernaussage

Betreiber bewerten die DSA-Pflichten zum Minderjährigenschutz per Ampel
(🟢 erfüllt / 🔴 offen / ⚪ nicht anwendbar) und erhalten einen Ampel-Bericht,
der offene Punkte priorisiert.

## 2. Zielgruppe

Betreiber, Plattformbetreiber, Schulen. Nachbarn: KI-Transparenz-Check,
Seitenstark-Qualitäts-Check, Meldewege-Planer, Vorsorge-Check § 24a JuSchG.

## 3. Ablauf

1) 4 Bereiche mit je 2–3 Kriterien durchgehen.
2) Je Kriterium einen der drei Ampel-Zustände wählen (Radiogroup).
3) Ampel-Bericht ansehen, als `.txt` speichern/kopieren, „Zurücksetzen“.

## 4. Didaktik / Nutzen

Die Ampel bildet die Realität besser ab als Ja/Nein: „nicht anwendbar“
trennt echte Lücken von irrelevanten Punkten, sodass der Bericht ehrlich
zeigt, was wirklich offen ist. Übersetzt DSA Art. 14/16/20/25/27/28 und
§ 24a JuSchG in konkrete Prüfpunkte.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Bewertung nur in localStorage
(dsaa.status) + Zurücksetzen, Bericht-Export lokal per Blob, werbefrei.
Der Katalog enthält keine externen Links.

## 6. Tests

`test/logik.test.mjs`: ≥4 Bereiche, ≥8 Kriterien, eindeutige IDs,
Ampel-Hinweis, jedes Kriterium mit Aussage/Hilfe/DSA-Bezug, thematische
Abdeckung (Art. 28, Profiling-Targeting, Dark Patterns, Melde-/Beschwerde,
AGB kindverständlich), Ampel: drei Zustände + Standard „offen“, zaehle
mischt korrekt, ampelBericht zählt/übernimmt/listet offene Punkte.

## 7. Erweiterungen (Katalog)

Vorsorge-Check § 24a JuSchG (№175), AVV-Checkliste Hosting (№174); Ampel
als wiederverwendbarer Baustein für weitere Audits.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
