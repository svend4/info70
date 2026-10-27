# Kurz-GDD: Dark-Pattern-Selbstinspektion 🎭

**Einheit aus Katalog:** docs/09 Ось D Nr. 228 — «Dark-Pattern-Selbst­
inspektion». **Engine:** UI-Prüfliste (kriterien-check-Muster) mit vier
Zuständen je Muster. Zielgruppe: Betreiber & Designer.

## 1. Kernaussage

Betreiber und Designer prüfen ihr Angebot Screen für Screen auf manipulative
Muster (Dark Patterns). Jedes Muster kommt mit Beispiel, Wirkung auf Kinder
und fairer Alternative; markiert wird ⚪ ungeprüft / 🔴 gefunden / 🟢 frei /
🔵 behoben. Der Bericht dokumentiert Befunde und die Abstellmaßnahmen.

## 2. Zielgruppe

Betreiber, UX-Designer. Nachbarn: DSA-Selbstaudit, KI-Transparenz-Check,
Vorsorge-Check § 24a JuSchG, dark-pattern-detektiv (Kinder-Variante).

## 3. Ablauf

1) 3 Kategorien (Zeit/Druck, Geld/Kauf, Entscheidung) mit je 4 Mustern.
2) Je Muster einen der vier Zustände wählen (Radiogroup).
3) Bericht: Zählung, offene Befunde mit Abstellmaßnahme, behobene Punkte.
4) Als `.txt` speichern/kopieren, „Zurücksetzen“.

## 4. Didaktik / Nutzen

Macht DSA Art. 25 (Verbot manipulativer Gestaltung) konkret prüfbar und
übersetzt jedes Muster in eine faire Alternative – aus dem Befund wird direkt
die Abstellmaßnahme. Der Zustand „behoben“ dokumentiert Fortschritt.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Bewertung nur in localStorage
(`darkpattern.status`) + „Zurücksetzen“, Bericht-Export lokal per Blob,
werbefrei. Werkzeug für Erwachsene ohne eltern.html. Kein Rechtsrat.

## 6. Tests

`test/logik.test.mjs`: ≥3 Kategorien, ≥10 Muster, eindeutige IDs, jedes
Muster mit Beispiel/Kind-Wirkung/fairer Alternative/Bezug, thematische
Abdeckung (Countdown, versteckte Kosten, Confirmshaming, Endlos, Lootbox),
vier Zustände + Standard „ungeprüft“, `zaehle`/`befunde`/`behobene`,
`bericht` (Zählung, Abstellmaßnahmen, behoben).

## 7. Erweiterungen (Katalog)

Compliance-Koffer (Nr. 232, bündelt Berichte), Screenshot-Anhänge je Befund,
Kopplung mit dem DSA-Selbstaudit (Dark-Pattern-Kriterium).

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
