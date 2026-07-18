# Kurz-GDD: Schulstart-Begleiter 🎒

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 2 — «Schulstart-
Begleiter: Beobachtungsbogen zur Schulfähigkeit». **Engine:** Beobachtungsbogen
(Muster apps/entwicklungs-kompass: reine Logik + JSON-Bank + Datei-Koffer).
Zielgruppe: pädagogische Fachkräfte (letztes Kita-Jahr).

## 1. Kernaussage

Lokaler Beobachtungsbogen zur Schulfähigkeit: fünf Reifebereiche mit je sechs
beobachtbaren Merkmalen (30), je Kind in drei Stufen dokumentiert
(noch nicht / in Ansätzen / sicher). Ergebnis ist ein rein textlicher Bericht
fürs Übergangs- und Elterngespräch. Beobachtung, keine Diagnose, kein
Screening-Ersatz, keine Schulreife-Note.

## 2. Zielgruppe

Fachkräfte. Nachbarn: entwicklungs-kompass, kita-wochenplaner,
gruppenklima-check, wohlfuehl-ampel, reim-radar, mathe-entdecker.

## 3. Ablauf

1) Kürzel je Kind anlegen (keine Namen, max 3 Zeichen).
2) Fünf Bereiche mit je sechs Merkmalen in drei Stufen dokumentieren
   (Klick zurücknehmbar). Fortschritt = Doku-Stand, keine Bewertung.
3) Text-Bericht kopieren; Datei-Koffer sichern/einlesen (füllt nur Lücken).

## 4. Didaktik / Nutzen

Der Übergang Kita–Grundschule ist in jedem Bundesland Pflichtthema. Der Bogen
füllt die Lücke zwischen informellen Notizen und ärztlicher Untersuchung –
strukturiert entlang der schulrelevanten Vorläuferfähigkeiten (phonologische
Bewusstheit, Mengen, Graphomotorik, Arbeitsverhalten, soziale Reife). Absorbiert
zwei Dubletten (131 Indikatoren). Alle Merkmale sind Neuformulierungen.

## 5. Politik-Konformität (docs/02, EU AI Act)

Keine externen Anfragen (NetzwerkWaechter), Kinder nur als Kürzel (technischer
3-Zeichen-Deckel, auch beim Import), localStorage nur „ssb.daten“ + „Alle Daten
löschen“, Sicherung nur als private Datei. **KEIN Score, keine Rangfolge, keine
Schulreife-Note, kein Vergleich** – reine Dokumentation je Kind. Werbefrei.
Fachkraft-Werkzeug mit eltern.html (Info für Eltern/Träger/Leitung), im Sammelband.

## 6. Tests

`test/indikatoren.test.mjs`: Katalog gültig (3 Stufen, 5×6), Schulreife-
Abdeckung, „keine Diagnose/Screening“-Hinweis. `test/logik.test.mjs`: Kürzel-
Deckel, `zaehleDokumentiert`, `berichtFuerKind` (Kopf aus Katalog, keine
Zahlenwertung). `test/kompass.test.mjs`: Koffer-Roundtrip, eigene Art,
Ablehnung fremder Art / langer Kürzel / unbekannter Stufe/Indikatoren,
`vereinigeKoffer` (eigener Vorrang, Lücken füllen, Original unverändert).

## 7. Erweiterungen (Katalog)

Eingewöhnungs-Tagebuch (Nr. 3) und Meilenstein-Begleiter (Nr. 4) auf demselben
Muster; druckbarer Förderbericht; uk/ru-Elterninfo.
