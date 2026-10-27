# Kurz-GDD: Meldewege-Planer 📮

**Einheit aus Katalog:** docs/09 №177 — «Meldewege-Planer». **Engine:**
Planungs-/Formular-zu-Dokument-Werkzeug (Konfiguration → Doku + i18n-Texte).
Zielgruppe: Betreiber.

## 1. Kernaussage

Betreiber bauen Schritt für Schritt einen kindgerechten Meldeweg auf und
erhalten sofort das Ergebnis: fertige kindgerechte Melde-Texte (de/uk/ru)
und eine ausdruck-/kopierbare Prozess-Dokumentation für die eigene Aufsicht.

## 2. Zielgruppe

Betreiber, Redaktionen, Schulen mit interaktiven Kinderangeboten.
Nachbarn: KI-Transparenz-Check, DSA-Selbstaudit, Interaktions-Konzept-
Assistent. Kinder-Pendants: beschwerde-lotse, stark-im-chat.

## 3. Ablauf

1) Auslöser ankreuzen (was gemeldet werden kann).
2) Reaktionszeit + Ansprech-Rolle festlegen.
3) Rückmeldung an das Kind wählen (Bestätigung / Ergebnis).
4) Kindgerechte Melde-Texte in de/uk/ru und Prozess-Doku
speichern/kopieren.

## 4. Didaktik / Nutzen

Übersetzt DSA Art. 16/20 und § 24a JuSchG in einen konkreten, kindgerechten
Ablauf. Kernbotschaft für Kinder: „Melden ist kein Petzen“, plus immer der
Verweis auf die Nummer gegen Kummer 116 111. Die Doku dient als Nachweis
für BzKJ-Aufsicht und Förderanträge.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Konfiguration nur in
localStorage (mwp.cfg) + Zurücksetzen, Export lokal per Blob, werbefrei.
Das Ansprechpartner-Feld ist eine Rolle, kein Kindername; die erzeugten
Texte enthalten keine externen Links (Test). Unter dem Feld steht der Hinweis
„Keine Namen von Kindern eingeben.“ (aria-describedby).

## 6. Tests

`test/logik.test.mjs`: Auslöser/Reaktionszeiten mit eindeutigen IDs und
Pflicht-Anlässen (mobbing/kontakt/inhalt), i18n-Vollständigkeit (de/uk/ru
gleiche Schlüssel), jede Sprache mit 116 111 und „kein Petzen“,
baueMeldetexte je Sprache nicht leer und ohne externe Links, baueProzessDoku
übernimmt Auswahl und nennt DSA/JuSchG/116 111, leere Konfiguration liefert
Grundgerüst mit offenen Punkten.
`test/eingabe-hinweis.test.mjs`: Hinweistext, Sichtbarkeit, Zuordnung zum
Feld Ansprechperson; Label „kein Kindername“ unverändert. Testzahl gesamt: 10
(vorher 6).

## 7. Erweiterungen (Katalog)

Interaktions-Konzept-Assistent (№162), DSA-Selbstaudit (№168); weitere
Sprachen; Verzahnung mit beschwerde-lotse (Kinder-Sicht).

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
