# Kurz-GDD: Schulfreigabe-Dossier „Null-Daten-Nachweis“ 🛡️

**Einheit aus Katalog:** docs/09 Ось E — «Schulfreigabe-Dossier Null-Daten-Nachweis».
**Engine:** Formular-zu-Dokument (Muster impressum-generator).
Zielgruppe: schulische Datenschutzbeauftragte / Schulträger.

## 1. Kernaussage

Ein vorgefertigtes Prüfdossier, das Schulen die Freigabe erleichtert:
technische Erklärung (CSP self, keine externen Requests, kein Tracking,
löschbares localStorage), Muster-Verfahrensbeschreibung „keine Verarbeitung
personenbezogener Daten“, Länder-Checkliste und BFSG/EAA-Erklärung.

## 2. Zielgruppe

DSB / Schulträger. Nachbarn: dsa-selbstaudit, bfsg-check, vorsorge-check-
juschg, impressum-generator, oer-vorlage.

## 3. Ablauf

1) Optionale Angaben eintippen (Schule, Träger, DSB, Angebot, Datum).
2) Live-Vorschau des Dossiers (5 Abschnitte).
3) Drucken / Text kopieren.

## 4. Didaktik / Nutzen

Senkt die größte reale Einführungshürde (Schuldatenschutz) mit einem
fertigen, prüffähigen Nachweis. Deckt die Null-Daten-Architektur des
Baukastens dokumentarisch ab.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei. Datensparsamkeit:
Eingaben bleiben im Arbeitsspeicher, **kein localStorage** – nur Druck.
Werkzeug für Erwachsene, ohne eltern.html. Eingabehinweise „Keine Namen von
Kindern eingeben.“ über dem Formular und an jedem der fünf Felder
(aria-describedby); im Druck ausgeblendet (druck.css, Klasse sd-hinweis).

## 6. Tests

`test/dossier.test.mjs`: zentrale Aussagen (CSP/keine externen/kein Tracking/
löschbar/keine personenbezogenen Daten/Verfahrensbeschreibung/BFSG),
Platzhalter bei leeren Feldern, ausgefüllte Werte, Determinismus, ≥8
Prüfpunkte als [x], escapeHtml/HTML-Fassung.
`test/eingabe-hinweis.test.mjs`: Hinweistext, Sichtbarkeit, Zuordnung je Feld
(aria-describedby), Feldnamen unverändert, Ausblendung im Druck. Testzahl
gesamt: 13 (vorher 6).

## 7. Erweiterungen (Katalog)

Länderspezifische Checklisten-Varianten, PDF-Export mit Signaturfeld,
Bündelung mit dem Compliance-Koffer (Betreiber-Achse).
