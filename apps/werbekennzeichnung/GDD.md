# Kurz-GDD: Werbekennzeichnung 🏷️

**Einheit aus Katalog:** docs/09 №155 — «Werbekennzeichnungs-Vorschau».
**Engine:** neu: UI-Vorschau mit Vorlagen-Galerie. Zielgruppe: Betreiber.

## 1. Kernaussage

Betreiber sehen sofort, wie korrekte Werbekennzeichnung nach JMStV/MStV
aussieht – als Live-Vorschau, mit Negativ-Beispielen und HTML zum Einbauen.

## 2. Zielgruppe

Betreiber von Kinderseiten. Nachbarn: impressum-generator, fragfinn-
selbsttest, anzeige-oder-nicht (Kinder-Version).

## 3. Ablauf

Anzeigentyp wählen (Banner / gesponserter Beitrag / Produktplatzierung) →
richtige Vorlage als gerenderte Vorschau + Regeln → Negativ-Beispiele mit
Begründung → Copy-Paste-HTML kopieren.

## 4. Didaktik / Nutzen

Zeigt das Trennungsgebot konkret: Wortlaut („Anzeige“/„Werbung“), Position
(am Anfang/über dem Banner), Deutlichkeit (nicht in Hashtags versteckt).
Auch Gratis-Produkte/Kooperationen sind kennzeichnungspflichtig. Negativ-
Beispiele machen typische Fehler sichtbar.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), speichert nichts. Die Vorschau
rendert NUR eigene, vertrauenswürdige Vorlagen (Test: kein Script, keine
externen Ressourcen/Links). Werbefrei.

## 6. Tests

`test/vorlagen.test.mjs`: 3 Typen + eindeutige Codes + Rechtsbezug,
je Beschreibung/Regeln/richtige Vorlage/Negativ-Beispiele, klares
Werbe-Label in jeder Vorlage, Sicherheit (kein Script/keine externen Verweise).

## 7. Erweiterungen (Katalog)

Mehr Typen (Affiliate, Gewinnspiel); Verknüpfung mit impressum-generator;
Datenschutzerklärung-Baukasten (№58) auf derselben Vorlagen-Idee.
