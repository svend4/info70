# Kurz-GDD: Vorsorge-Check § 24a 🛡️

**Einheit aus Katalog:** docs/09 №175 — «Vorsorge-Check Paragraf 24a
JuSchG». **Engine:** Checkliste auf dem kriterien-check-Muster mit
3-Zustands-Ampel (geteiltes Muster mit DSA-Selbstaudit). Zielgruppe:
Betreiber.

## 1. Kernaussage

Betreiber bewerten die Vorsorgemaßnahmen des § 24a JuSchG per Ampel
(🟢/🔴/⚪) und erhalten einen Ampel-Bericht, der als Dokumentation für
BzKJ-Aufsicht und Förderanträge dient.

## 2. Zielgruppe

Betreiber, die unter die Vorsorgepflichten fallen. Nachbarn: DSA-Selbstaudit,
Meldewege-Planer, Interaktions-Konzept-Assistent, Eltern-Kompass-Generator.

## 3. Ablauf

1) 4 Bereiche mit je 2–3 Kriterien durchgehen.
2) Je Kriterium Ampel-Zustand wählen (Radiogroup).
3) Ampel-Bericht ansehen, als `.txt` speichern/kopieren, „Zurücksetzen“.

## 4. Didaktik / Nutzen

Übersetzt die abstrakten Vorsorgemaßnahmen (§ 24a Abs. 2) in konkrete
Prüfpunkte: sichere Voreinstellungen, Melde-/Abhilfeverfahren, Einordnungs-
und Elterninformationen, Verzicht auf Risiko-Features. Die Ampel trennt
echte Lücken (rot) von nicht anwendbaren Punkten (grau).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Bewertung nur in localStorage
(vcj.status) + Zurücksetzen, Bericht-Export lokal per Blob, werbefrei.
Katalog ohne externe Links.

## 6. Tests

`test/logik.test.mjs`: ≥4 Bereiche/≥8 Kriterien, § 24a-Grundlage,
die vier Vorsorge-Dimensionen (voreinstellungen/melden/information/risiko),
jedes Kriterium mit Aussage/Hilfe/Bezug, thematische Abdeckung (Defaults,
Melden, Eltern, Standort, Chat, 116 111), Ampel (3 Zustände/Standard offen/
zaehle), ampelBericht zählt/übernimmt/listet offene Punkte.

## 7. Erweiterungen (Katalog)

AVV-Checkliste Hosting (№174), Schulfreigabe-Dossier (№200); Ampel-Modul
für weitere Audits wiederverwendbar.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
