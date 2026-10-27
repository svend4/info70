# Kurz-GDD: Kita-Familien-Brücke 🤝

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 30 — «Kita-Familien-
Brücke (Erziehungspartnerschaft-Check)». **Engine:** kriterien-check
(Erwachsenen-Katalog + Checkliste + Bericht, reine Logik für Ampel/
Maßnahmen). Zielgruppe: Erzieher*innen / Kita-Leitung.

## 1. Kernaussage

Die 12 Kooperationsziele des Familienkapitels werden zum Selbstcheck für
Kita-Teams, übersetzt in den deutschen Fachbegriff Erziehungspartnerschaft
(verankert in allen Landes-Bildungsplänen): Wie gut kennen wir die
Familien, informieren wir, beteiligen wir – und mit welcher Haltung?
Ampel-Auswertung je Bereich, Maßnahmenkatalog, druckbarer Team-Bericht.

## 2. Zielgruppe

Kita-Teams und Leitungen (QM/Teamsitzung). Nachbarn: selbstcheck-
paedagogik, gruppenklima-check, eingewoehnungs-leitfaden,
elternbrief-generator, kriterien-check.

## 3. Ablauf

1) Intro: Was ist Erziehungspartnerschaft, Schutz-Hinweis (bewertet wird
   Teampraxis, nie Familien/Kinder), am besten gemeinsam in der Teamsitzung.
2) 12 Aussagen nacheinander (4 Bereiche × 3): These + „Woran erkennbar“-
   Beispiele; Skala Trifft zu (2) / Teilweise (1) / Noch nicht (0);
   zurück-Knopf.
3) Auswertung: Ampel gesamt und je Bereich (≥80 % grün, ≥50 % gelb),
   ausdrücklich „Gesprächsanlass, kein Zeugnis“.
4) Maßnahmenkatalog für alles < 2 (je Kriterium 2 konkrete Vorschläge);
   Empfehlung: höchstens 2–3 Maßnahmen je Runde.
5) Team-Bericht drucken (druck.css): Ampeln + Ankreuzliste „Das nehmen
   wir uns vor“ mit Verantwortlich/Bis-Feldern – ausgefüllt auf Papier.

## 4. Didaktik / Nutzen

Erziehungspartnerschaft ist in den Bildungsplänen/-programmen aller
Länder als Ziel beschrieben (Verbindlichkeit je nach Land
unterschiedlich), über § 22a SGB VIII gesetzlich unterlegt und
QM-Thema der Träger. Buchgetreue Kernidee übernommen: der **Abschied von der
Experten-Belehrungshaltung** als eigene Reflexionsdimension („Wir sehen
Eltern als Experten für ihr Kind“) – vom Validator erzwungen. Vier
Bereiche: Kennen & Vertrauen, Informieren & Transparenz, Beteiligen &
Mitwirken, Haltung & Augenhöhe.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, **speichert
nichts** (Bericht wird gedruckt, Namen/Termine nur auf Papier). Bewertet
ausschließlich Teampraxis – niemals einzelne Familien, Eltern oder Kinder
(kein Scoring von Personen; testgeprüft: alle Thesen beschreiben
Teampraxis). eltern.html erklärt Eltern ihre Rechte; im Sammelband.

## 6. Tests

`test/logik.test.mjs` (7): Katalog gültig (4×3=12, je Kriterium ≥2
Woran/Maßnahmen, Skala 2/1/0); Haltungs-Dimension „Eltern als Experten“
verankert (inkl. Validator-Negativprobe); Thesen beschreiben Teampraxis;
`ampel`-Grenzen (80 %/50 %, 0/0→rot); `bewerte` (alles grün / gemischt,
offen-Zähler); `massnahmenKatalog` (nur < 2, leer bei alles-grün).

## 7. Erweiterungen (Katalog)

Träger-Vergleich als Papier-Workshop (bewusst nicht digital),
Eltern-Perspektiv-Fragebogen als Druckbogen, Verlaufs-Vergleich zweier
Runden über Datei-Koffer.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
