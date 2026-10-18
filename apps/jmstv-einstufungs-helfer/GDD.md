# Kurz-GDD: JMStV-Einstufungs-Helfer 🔞

**Einheit aus Katalog:** docs/09 Ось D Nr. 225 — «JMStV-Einstufungs-Helfer».
**Engine:** geführter Prüfpfad (datengetrieben) + age-de.xml-Generator.
Zielgruppe: Betreiber.

## 1. Kernaussage

Betreiber kreuzen Inhaltsmerkmale und Interaktionsrisiken an; der Helfer
empfiehlt eine Altersstufe (ab 0/6/12/16/18), listet die technischen Mittel
des JMStV (Label, Zeitsteuerung, Altersverifikation) und erzeugt ein
technisches **age-de.xml-Label** plus Meta-Tag zum Download.

## 2. Zielgruppe

Betreiber, Redaktion. Nachbarn: DSA-Selbstaudit, Vorsorge-Check § 24a JuSchG,
Einwilligungs-Prüfpfad, KI-Transparenz-Check, jugendschutz-quiz-fachkraefte.

## 3. Ablauf

1) Inhaltsmerkmale ankreuzen (jedes mit minStufe), Interaktionsrisiken wählen.
2) URL eintragen. Live: empfohlene Stufe = Maximum, Chat hebt auf mind. ab 12.
3) Technische Mittel je Stufe + Interaktions-Mittel ansehen.
4) age-de.xml + Meta-Tag herunterladen/kopieren; Prüfbericht als `.txt`.

## 4. Didaktik / Nutzen

Übersetzt § 4/5 JMStV und die Altersstufen in eine nachvollziehbare
Einstufung und liefert direkt das technische Label, das anerkannte
Jugendschutzprogramme auslesen. Stufe 18 wird als für Kinderangebote
grundsätzlich unzulässig markiert (ehrliche Warnung).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Auswahl nur in localStorage
(`jmstv.auswahl`) + „Zurücksetzen“, Downloads lokal per Blob, werbefrei. Eingabehinweis „Keine Namen von Kindern
eingeben.“ am URL-Feld.
Werkzeug für Erwachsene ohne eltern.html. Kein Rechtsrat; das age-de.xml ist
ein Template, dessen Element-Namen gegen die offizielle Spezifikation zu
prüfen sind.

## 6. Tests

`test/logik.test.mjs`: Stufen/Merkmale/Interaktion, `empfohleneStufe`
(null ohne Auswahl, Maximum, Chat→12), `technischeMittel` (gestuft),
`stufeLabel`, `ageDeXml` (wohlgeformt, minimum-age, URL-Fallback),
`metaTag`, `bericht` (Stufe/Mittel/Label + 18er-Warnung).
`test/eingabe-hinweis.test.mjs`: Hinweis „Keine Namen von Kindern eingeben.“
am URL-Feld (sichtbar, direkt vor dem Feld, aria-describedby), Feldname
unverändert. Gesamt 13 Tests (vorher 8).

## 7. Erweiterungen (Katalog)

Compliance-Koffer (Nr. 232, bündelt Berichte), Kopplung mit dem
Interaktions-Konzept-Assistent, weitere Stufen-Feinlogik.
