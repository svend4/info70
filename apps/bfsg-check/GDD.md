# Kurz-GDD: BFSG-Check ♿

**Einheit aus Katalog:** docs/09 №61 — «BFSG-Check für Kinderseiten».
**Engine:** katalog (kriterien-check) + neu: Kontrast-Rechner-Baustein.
Zielgruppe: Betreiber.

## 1. Kernaussage

Barrierefreiheit selbst prüfen – manuell, ohne externe Tools, mit
eingebautem WCAG-Kontrast-Rechner und exportierbarem Protokoll.

## 2. Zielgruppe

Betreiber von Kinderseiten. Nachbarn: kriterien-check, fragfinn-selbsttest,
barriere-detektive (Kinder-Version), Leichte-Sprache-Schalter.

## 3. Ablauf

Fortschritt + Hinweis → Kontrast-Rechner (zwei Farben, Live-Vorschau,
WCAG-Stufe) → 3 WCAG-Bereiche abhaken (mit Prüf-Hilfen) → Prüfprotokoll
für die Barrierefreiheitserklärung exportieren. Haken lokal + Reset.

## 4. Didaktik / Nutzen

Übersetzt BFSG/WCAG in ausführbare Schritte (Tab-Durchlauf, Alt-Text-Check,
Untertitel). Der Kontrast-Rechner ersetzt Online-Tools und ist echte,
getestete WCAG-Mathematik (Referenz: Schwarz/Weiß = 21:1). Die
Live-Vorschau macht schlechten Kontrast sofort sichtbar.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter) – der Rechner läuft rein lokal;
nur `bfsg.status` in localStorage + Löschknopf; Export per Blob; werbefrei.

## 6. Tests

`test/logik.test.mjs`: hexZuRgb (gültig/ungültig), leuchtdichte
(Schwarz 0/Weiß 1), kontrast (21:1, 1:1, Reihenfolge, ungültig, #777~4,5),
wcagStufe (AA/AAA-Grenzen, große Schrift), Kriterien-Schema + Kernthemen.

## 7. Erweiterungen (Katalog)

Barrierefreiheitserklärungs-Generator (№66) auf der Formular-zu-Dokument-
Engine; Hoher-Kontrast-Theme (№137); Screenreader-Audit-Pack (№138).
