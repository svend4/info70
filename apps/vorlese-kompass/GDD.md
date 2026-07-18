# Kurz-GDD: Vorlese-Kompass 🧭

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 14 — «Vorlese-Kompass
1-3». **Engine:** Content-Guide (reine Logik + JSON). Zielgruppe: Eltern.

## 1. Kernaussage

Anleitung zum dialogischen Vorlesen von 1 bis 3 Jahren: eine 7-Schritte-Methode,
Altersfenster mit passenden Inhalten und Tipps, und ein Kanon geeigneter
Buchtypen (statt konkreter, urheberrechtlich geschützter Titel) – kostenlos aus
der Bibliothek. Vorlesen in jeder Familiensprache ist ausdrücklich wertvoll.

## 2. Zielgruppe

Eltern. Nachbarn: familienschatz-reime, reim-radar, herkunftssprachen-bruecke,
autonomiephase-navigator.

## 3. Ablauf

1) Sinn-Hinweis (Vorlesen als Sprach-/Bindungszeit, mehrsprachig).
2) 7-Schritte-Methode (dialogisch), vorlesbar.
3) Altersfenster 1–3 als Tabs (was passt, Tipp), vorlesbar.
4) Kanon von Buchtypen mit Begründung.

## 4. Didaktik / Nutzen

Der Vorlesemonitor zeigt: ein Drittel der Eltern liest kaum vor. Eine klare,
niedrigschwellige Methode plus Buchtyp-Kanon (ohne Titel-Empfehlungen, damit
lizenz- und werbefrei) senkt die Hürde. Betont die Familiensprache und die
kostenlose Bibliothek als Bezugsquelle.

## 5. Politik-Konformität (docs/02, Urheberrecht)

Keine konkreten Buchtitel/Cover (nur Buchtypen) – keine Werbung, kein Lizenz-
risiko. Keine externen Anfragen (NetzwerkWaechter), keine Konten, keine
Datenerhebung (kein localStorage nötig). Werkzeug für Eltern OHNE eltern.html,
nicht im Sammelband (kein Kinder-Screen).

## 6. Tests

`test/logik.test.mjs`: Daten gültig (genau 7 Schritte, ≥3 Altersstufen, ≥4
Kanon-Typen), Abdeckung (offene Fragen/dialogisch, Wiederholung, Mehr-
sprachigkeit, Bibliothek), `methodeText` nummeriert alle 7, `naechsterIndex`.

## 7. Erweiterungen (Katalog)

Skalierung bis 7 Jahre, druckbare Methoden-Karte, uk/ru-Fassung, Kopplung mit
familienschatz-reime.
