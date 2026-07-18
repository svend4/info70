# Kurz-GDD: Seiten-Scanner 🔦

**Einheit aus Katalog:** docs/09 №135 (auch №47 verwandt) — «Seiten-Scanner».
**Engine:** katalog (Checkliste + Ampel), Kinder-Version des kriterien-check.

## 1. Kernaussage

Kinder prüfen selbst, ob eine Seite sicher ist – an denselben Merkmalen,
die fragFINN/Seitenstark verlangen, kindgerecht formuliert.

## 2. Zielgruppe

Kinder 8-12. Nachbarn: impressum-detektive, fake-shop-fahnder,
kriterien-check (Erwachsenen-Original). Bindet Hilfe-Insel ein.

## 3. Ablauf

Seite in anderem Fenster öffnen → 9 Ja/Nein-Fragen beantworten → Ampel
(🟢/🟡/🔴) + Tipps zu den unsicheren Antworten. Aktueller Scan lokal
(ss.scan) + „Neue Seite prüfen“.

## 4. Didaktik

Die sichere Antwort ist NICHT immer „ja“ (Impressum ja = gut; nach echtem
Namen fragen: nein = gut) – erzwingt echtes Abwägen (Test). Ampel statt
Zensur: das Kind bewertet, die App gibt Orientierung. Jede unsichere
Antwort führt zu einem konkreten Handlungstipp, kein Verbot.

## 5. Politik-Konformität (docs/02)

Liest die geprüfte Seite NICHT aus (Kind bewertet selbst). Keine externen
Anfragen (NetzwerkWaechter), nur `ss.scan` in localStorage + Löschknopf,
werbefrei, Vorlesen, mobile-first, eltern.html, Hilfe-Insel (116 111).

## 6. Tests

`test/logik.test.mjs`: 8-10 Fragen mit Pflicht-Checks (impressum/name/
werbung/fremdchat), sichere Antwort ja/nein gemischt (≥2 je Seite),
sicherePunkte/warnungen, Ampel-Grenzen (grün/gelb/rot).

## 7. Erweiterungen (Katalog)

Druck-Merkzettel „Meine Seiten-Checkliste“; Verknüpfung mit fake-shop-
fahnder; uk/ru + Leichte Sprache über kinder-ui.
