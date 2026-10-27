# Kurz-GDD: KRIA-Check ⚖️

**Einheit aus Katalog:** docs/09 №30 (топ-лист) — «KRIA-Check», absorbiert
«Kinderrechte-Folgenabschätzung». **Engine:** katalog (kriterien-check-Muster).

## 1. Kernaussage

Wer ein digitales Angebot für Kinder baut, beschafft oder fördert, prüft
VORHER strukturiert, wie es auf Kinderrechte wirkt — GC25 macht das zur
Pflicht, KRIA-Check macht es machbar.

## 2. Zielgruppe & Rahmen

Erwachsene: Anbieter, Redaktionen, Schulen, Träger, Beschaffungsstellen,
Antragstellende (BzKJ). Kein Kinder-Interface, keine Kinderdaten.

## 3. Ablauf (Loop)

1. 27 Prüfpunkte in 7 GC25-Bereichen abhaken; jede Aussage trägt Rechtsbezug.
2. Bei Unsicherheit: Aufklapp-Hilfe «So prüfst du das» mit konkretem Testweg.
3. Notizfeld für Abwägungen (z. B. Schutz vs. Teilhabe) und Maßnahmen.
4. Bericht entsteht live: erfüllte Punkte, OFFENE Punkte als To-do-Liste,
   Notizen — kopieren oder als `kria-bericht.txt` herunterladen.
5. Wiedervorlage: Prüfpunkt kw-kria verlangt Wiederholung bei Änderungen.

## 4. Didaktik

Das Lernen sitzt in den Hilfe-Texten (Test erzwingt ≥80 Zeichen): Sie
übersetzen Rechtsnormen in ausführbare Prüfschritte («Netzwerk-Tab öffnen»,
«Kind erklären lassen», «Zeit stoppen»). Der Bericht macht Lücken zu
Arbeitsaufträgen statt zu Scham.

## 5. Politik-Konformität (docs/02)

Werbefrei, ohne Konto, keine externen Anfragen (NetzwerkWaechter),
localStorage nur `kria.status`/`kria.notizen` + Löschknopf, Datei-Export
lokal per Blob. Deutsch, mobile-first, Impressum im Footer.
Eingabehinweis „Keine Namen von Kindern eingeben.“ steht sichtbar direkt vor
dem Notizfeld (aria-describedby). Eine Druckfassung gibt es nicht.

## 6. Tests

`test/kriterien.test.mjs`: Schema (7 Bereiche, ≥20 Punkte, eindeutige IDs),
Hilfe-Pflicht ≥80 Zeichen, Rechtsbezug-Pflicht, Abdeckung der 5 Kernthemen
aus dem Katalog (Kindeswohl, Datenminimierung, Dark Patterns, Beschwerdeweg,
Alterseignung) + 116 111, Stop-Liste gegen Datensammel-Sprache.

`test/eingabe-hinweis.test.mjs`: Hinweistext, Sichtbarkeit, Zuordnung Hinweis
zum Notizfeld (aria-describedby). Testzahl gesamt: 8 (vorher 4).

## 7. Förder-/Nachweis-Anschluss

Bericht = Anlage für BzKJ-Antrag (Kindeswohl-Nachweis), fragFINN-/
Seitenstark-Verfahren und Träger-Beschlüsse; Grundstein für die
«Kinderrechte-Charta des Baukastens» (docs/09, Dokument-Einheit).

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
