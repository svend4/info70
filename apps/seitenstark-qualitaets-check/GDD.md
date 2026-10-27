# Kurz-GDD: Seitenstark-Qualitäts-Check ⭐

**Einheit aus Katalog:** docs/09 №156 — «Seitenstark-Qualitäts-Check».
**Engine:** zweites Content-Pack auf der Kriterien-Check-/fragFINN-Selbsttest-
Engine (Checkliste + Export). Zielgruppe: Betreiber.

## 1. Kernaussage

Betreiber gehen die Seitenstark-Qualitätsmerkmale Punkt für Punkt durch und
erhalten als Ergebnis einen Maßnahmenplan: offene Punkte zuerst, mit
konkretem nächsten Schritt je Kriterium.

## 2. Zielgruppe

Betreiber, Redaktionen von Kinderseiten, die Seitenstark-Qualität anstreben
(Mitgliedschaft als Verbreitungskanal). Nachbarn: fragfinn-selbsttest,
kriterien-check, bfsg-check, impressum-/datenschutz-Generator, meldewege-
planer.

## 3. Ablauf

1) 5 Bereiche mit je 2–3 Kriterien abhaken (Checkbox + Hilfe-„details“).
2) Fortschritt live.
3) Maßnahmenplan: offene Punkte mit `→ Hilfe`-Schritt zuerst, dann Erfüllt;
als `.txt` speichern/kopieren, „Zurücksetzen“.

## 4. Didaktik / Nutzen

Übersetzt die Seitenstark-Qualitätsansprüche in konkrete Ja/Nein-Fragen und
liefert – anders als eine reine Checkliste – direkt einen priorisierten
Maßnahmenplan. Verzahnt mit den passenden Werkzeugen des Baukastens
(Impressum-/Datenschutz-Generator, BFSG-Check, Meldewege-Planer).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Haken nur in localStorage
(ssqc.status) + Zurücksetzen, Plan-Export lokal per Blob, werbefrei. Der
Katalog (daten/kriterien.json) enthält keine externen Links.

## 6. Tests

`test/kriterien.test.mjs`: ≥5 Bereiche, eindeutige IDs, ≥10 Kriterien,
Selbst-Check-Hinweis, die fünf Dimensionen (transparenz/redaktion/
interaktion/werbung/barrierefreiheit), jedes Kriterium mit Aussage/Hilfe/
Bezug, thematische Abdeckung (Impressum, Moderation, Meldeweg, Werbung,
Barrierefreiheit, Datensparsamkeit).

## 7. Erweiterungen (Katalog)

DSA-Selbstaudit (№168), Interaktions-Konzept-Assistent (№162); Verzahnung
mit Barrierefreiheitserklärungs-Generator (№169).

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
