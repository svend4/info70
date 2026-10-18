# Kurz-GDD: Barrierefreiheits-Erklärung ♿

**Einheit aus Katalog:** docs/09 №169 — «Barrierefreiheitserklärungs-
Generator». **Engine:** Formular-zu-Text-Generator mit Datei-Import
(Klassen-Koffer-Muster). Zielgruppe: Betreiber.

## 1. Kernaussage

Aus Angaben – oder direkt aus dem importierten BFSG-Check-Prüfprotokoll –
entsteht offline eine fertige Erklärung zur Barrierefreiheit als
Markdown/HTML, mit Leichte-Sprache-Abschnitt und Durchsetzungshinweis.

## 2. Zielgruppe

Betreiber von Kinderseiten (BFSG/EAA-Pflicht seit 2025). Direkter Nachbar:
BFSG-Check (№61, liefert das Protokoll). Gleiche Engine-Familie: Impressum-
und Datenschutz-Generator.

## 3. Ablauf

1) Optional: BFSG-Protokoll (.txt) importieren → Konformitätsstand wird
übernommen.
2) Angaben ausfüllen (Anbieter, URL, Stand, bekannte Barrieren, Kontakt).
3) Vorschau ansehen; als `.md` oder `.html` speichern/kopieren.

## 4. Didaktik / Nutzen

Nimmt die BFSG-Pflichtabschnitte ab und verzahnt sich mit dem BFSG-Check:
Der dort erzeugte Bericht wird zur fertigen Erklärung. Der eingebaute
Leichte-Sprache-Abschnitt erfüllt zugleich einen Kern-Anspruch guter
Kinderseiten.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Angaben nur in localStorage
(bfe.cfg) + Leeren, Datei-Import und Export rein lokal (Blob/FileReader),
werbefrei. Der Markdown→HTML-Wandler escapt Inhalte; die Ausgabe enthält
kein Script und keine externen Ressourcen (Test).

Eingabehinweis „Keine Namen von Kindern eingeben.“ an allen sechs freien
Feldern (Anbieter, URL, Stand, Bekannte Barrieren, Kontakt-Name, Kontakt-
E-Mail): sichtbar, als eigenes Element direkt vor dem Feld, per
aria-describedby verknüpft. Der Feldname bleibt gleich.

Entscheidung: Hinweis an allen freien Feldern. Kontakt-Name, URL und Stand
haben ihn deshalb ebenfalls.

## 6. Tests

`test/logik.test.mjs`: leseBfsgProtokoll (X von Y → Konformität),
baueErklaerung übernimmt Angaben, alle Pflichtabschnitte inkl. Leichter
Sprache + Durchsetzung, Konformitätsvarianten, Platzhalter bei leeren
Angaben, HTML-Struktur ohne Script/externe Bezüge, escapeHtml im Wandler.

`test/eingabe-hinweis.test.mjs`: Hinweistext, Sichtbarkeit (kein
display:none, sr-only, aria-hidden), Platzierung direkt vor dem Feld,
aria-describedby, welche sechs Felder den Hinweis haben (alle freien Felder).
Testzahl: 12 (7 Logik, 5 Hinweis); `npm test` grün.

## 7. Erweiterungen (Katalog)

Eltern-Kompass-Generator (№163), Screenreader-/Tastatur-Audit-Pack (№253)
auf derselben Basis; mehrsprachige Erklärung (de/uk/ru).
