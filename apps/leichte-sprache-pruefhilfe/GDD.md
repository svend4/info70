# Kurz-GDD: Leichte-Sprache-Prüfhilfe 🧩

**Einheit aus Katalog:** docs/09 Ось D Nr. 222 — «Leichte-Sprache-Prüfhilfe».
**Engine:** regelbasierte lokale Textanalyse (reine Logik + kinder-ui).
Zielgruppe: Betreiber, Redaktion, Fachkräfte für Inklusion.

## 1. Kernaussage

Text einfügen, sofort messbare Regeln prüfen: Satzlänge, Wortlänge,
Passiv-Signale, Nominalstil und Fremdwörter – mit konkreten Umformulierungs-
Hinweisen nach den Regeln der Leichten/Einfachen Sprache (angelehnt an
DIN SPEC 33429). Keine KI, keine externen Requests – alles regelbasiert.

## 2. Zielgruppe

Betreiber, die kindgerechte/leichte Texte schreiben. Nachbarn:
Barrierefreiheitserklärungs-Generator, BFSG-Check, Einwilligungs-Prüfpfad,
KI-Kennzeichnungs-Generator, leichte-sprache-werkstatt.

## 3. Ablauf

1) Text ins Feld einfügen (bleibt lokal, `lspruef.text`).
2) Live-Auswertung: Ampel (🟢/🟡/🔴), Kennzahlen, Umformulierungs-Hinweise.
3) Aufklappbare Treffer-Blöcke (Sätze/Wörter/Passiv/Nominalstil/Fremdwörter).
4) Bericht als `.txt` speichern oder kopieren; „Text löschen“.

## 4. Didaktik / Nutzen

Macht Leichte-Sprache-Regeln messbar und lernbar: statt Bauchgefühl konkrete
Zahlen (Ø Satzlänge) und benannte Stellen. Die Treffer sind bewusst als
Hinweise gekennzeichnet – Passiv-Signale und Nominalstil sind Kandidaten zum
Prüfen, keine harten Fehler (ehrliche Heuristik).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), keine KI, Text nur in localStorage
(`lspruef.text`) + „Text löschen“, Bericht-Export lokal per Blob, werbefrei.
Werkzeug für Erwachsene ohne eltern.html.

## 6. Tests

`test/logik.test.mjs`: Regeln-Datei (Grenzwerte, ≥15 Fremdwörter),
`saetzeTeilen`/`woerter`/`wortLaenge`, `langeSaetze`/`langeWoerter` (dedupe,
Bindestrich-Teil), `passivSignale`, `nominalstil` (nur Substantive),
`fremdwoerter` (auch flektiert), `analysiere` (leer→grau, gut→grün,
schwer→rot mit ≥3 Hinweisen), `bericht` (Kopf/Ergebnis/Blöcke).

## 7. Erweiterungen (Katalog)

Silbenzählung/LIX-Wert, eigene Fremdwortliste per Import, Kopplung mit dem
Barrierefreiheitserklärungs-Generator (Abschnitt in Leichter Sprache prüfen).
