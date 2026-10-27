# Kurz-GDD: Impressum-Generator 📄

**Einheit aus Katalog:** docs/09 №57 — «Impressum-Generator». **Engine:**
neu: Formular-zu-Dokument-Generator (wiederverwendbar). Zielgruppe: Betreiber.

## 1. Kernaussage

Aus Rechtsform + Feldern entsteht offline ein rechtssicheres Impressum als
Text/HTML – inklusive der oft vergessenen MStV-Angabe.

## 2. Zielgruppe

Betreiber von Kinderseiten. Nachbarn: kriterien-check, fragfinn-selbsttest,
impressum-detektive (Kinder-Version). Basis für Datenschutzerklärung-
Baukasten (№58).

## 3. Ablauf

1) Rechtsform wählen (Privat/Verein/gGmbH/Schule) + Redaktions-Schalter.
2) Felder ausfüllen (Live-Validierung der Pflichtfelder).
3) Fertiges Impressum: Text/HTML-Export, Kopieren, Leeren.
Plus Hinweis-Block „bei Kinderseiten oft vergessen“. Entwurf lokal.

## 4. Didaktik / Nutzen

Übersetzt § 5 DDG und § 18 MStV in ein ausfüllbares Formular. Rote
Rahmen zeigen fehlende Pflichtangaben. Der Redaktions-Schalter macht die
bei Kinderseiten häufig vergessene MStV-Verantwortung sichtbar. Klar als
Hilfe zur Selbsthilfe gekennzeichnet (keine Rechtsberatung).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Entwurf nur in localStorage
(impgen.entwurf) + Löschknopf, Export lokal per Blob, werbefrei. Das
generierte HTML enthält kein Script (Test). Eingabehinweis „Keine Namen von
Kindern eingeben.“ an allen freien Feldern (alle Felder sind Freitext: Name,
Anschrift, E-Mail, Telefon, Vertretung, Register, USt-ID, Schulträger,
Redaktion).

## 6. Tests

`test/logik.test.mjs`: Rechtsform-/Feld-Konsistenz, sichtbareFelder
(Redaktion), pflichtFelder (Telefon/USt-ID optional), fehlendeFelder,
baueImpressum (§ 5 DDG + Pflichtangaben), § 18 MStV bei Redaktion,
HTML-Ausgabe (h1/p, kein Script), Hinweise. `test/eingabe-hinweis.test.mjs`:
Hinweis „Keine Namen von Kindern eingeben.“ an allen Feldern des Katalogs und an
allen sichtbaren Feldern je Rechtsform (auch E-Mail, Telefon, Vertretung, USt-ID);
sichtbares Element direkt vor dem Feld, aria-describedby, Feldname unverändert.
Gesamt 14 Tests (vorher 8).

## 7. Erweiterungen (Katalog)

Datenschutzerklärung-Baukasten (№58) auf derselben Engine;
Werbekennzeichnungs-Vorschau (№59); weitere Rechtsformen.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
