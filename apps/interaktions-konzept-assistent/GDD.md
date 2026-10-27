# Kurz-GDD: Interaktions-Konzept-Assistent 🧩

**Einheit aus Katalog:** docs/09 №162 — «Interaktions-Konzept-Assistent».
**Engine:** gefilterte Karten nach foerder-navigator-Muster + Vorlagen-
Export. Zielgruppe: Betreiber.

## 1. Kernaussage

Betreiber wählen die geplanten Interaktionsfunktionen und erhalten sofort
die geltenden Schutz-Anforderungen (Basis + funktionsspezifisch) sowie eine
ausfüllbare Moderationskonzept-Vorlage.

## 2. Zielgruppe

Betreiber, Redaktionen, Schulen, die Interaktion (Kommentare, Upload, Chat …)
planen. Nachbarn: Meldewege-Planer, DSA-Selbstaudit, Seitenstark-Qualitäts-
Check.

## 3. Ablauf

1) Eine oder mehrere Funktionen ankreuzen (mit Risiko-Kennzeichnung).
2) Zusammengeführte, deduplizierte Anforderungen ansehen.
3) Moderationskonzept-Vorlage (Checkliste + Ausfüllfelder) speichern/kopieren.

## 4. Didaktik / Nutzen

Macht aus einer Funktionsentscheidung sofort eine konkrete Pflichtenliste –
Upload (Hochrisiko, Vormoderation zwingend) unterscheidet sich klar von einer
Abstimmung (Niedrigrisiko). Die Vorlage überführt das direkt in ein
dokumentiertes Moderationskonzept.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Auswahl nur in localStorage
(ika.auswahl) + Zurücksetzen, Export lokal per Blob, werbefrei. Der Katalog
und die erzeugte Vorlage enthalten keine externen Links (Test).

## 6. Tests

`test/logik.test.mjs`: ≥4 Funktionen mit eindeutigen IDs + Basis-
Anforderungen, jede Funktion mit Meta/Risiko/eigener Anforderung,
anforderungenFuer (Basis + spezifisch, dedupliziert), Upload = Hochrisiko +
zwingende Vormoderation, hoechstesRisiko, baueModerationskonzept (Auswahl +
Checkliste + Ausfüllfelder + Rechtsrahmen, keine externen Links), Vorlage
auch ohne Auswahl nutzbar, Katalogreihenfolge stabil.

## 7. Erweiterungen (Katalog)

Meldewege-Planer (№177), Eltern-Kompass-Generator (№163); weitere Funktionen
(Livestream, Foren); Verzahnung mit DSA-Selbstaudit.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
