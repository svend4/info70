# Kurz-GDD: Datenschutz-Baukasten 🔒

**Einheit aus Katalog:** docs/09 №58 — «Datenschutzerklärung-Baukasten».
**Engine:** Formular-zu-Dokument-Generator (wie Impressum-Generator №57).
Zielgruppe: Betreiber.

## 1. Kernaussage

Aus einer Baustein-Auswahl entstehen offline ZWEI abgestimmte Texte: eine
juristische Datenschutzerklärung (DSGVO) und eine Kinder-Version in
einfacher Sprache. Art. 12 DSGVO verlangt Verständlichkeit „insbesondere
für Kinder“ – genau diese Lücke schließt die Kinder-Version.

## 2. Zielgruppe

Betreiber von Kinderseiten. Nachbarn: impressum-generator (gleiche Engine),
kriterien-check, fragfinn-selbsttest. Kinder-Version passt zu den
Kinderrechte-Apps (daten-radiergummi, daten-schatz).

## 3. Ablauf

1) Ankreuzen, welche Funktionen die Seite hat (5 Bausteine).
2) Zwei Textfelder aktualisieren sich live: juristisch + kindgerecht.
3) Beide als `.txt` speichern oder kopieren, „Auswahl leeren“.
Grundgerüst (Datenminimierung + Betroffenenrechte) ist immer dabei.

## 4. Didaktik / Nutzen

Übersetzt die DSGVO in ein ausfüllbares Formular und liefert zugleich die
oft fehlende kindgerechte Version (Art. 12). Weniger Bausteine =
datensparsamer – das Ankreuzen macht Datenminimierung erlebbar. Klar als
Hilfe zur Selbsthilfe gekennzeichnet (keine Rechtsberatung).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Auswahl nur in localStorage
(dsb.auswahl) + Löschknopf, Export lokal per Blob, werbefrei. Die
generierten Texte enthalten keine externen Links und kein Script (Test).

## 6. Tests

`test/logik.test.mjs`: Baustein-Codes eindeutig + vollständig,
Grundgerüst mit Datenminimierung/Betroffenenrechten ohne Auswahl,
gewählte Bausteine erscheinen in BEIDEN Texten mit richtiger
Rechtsgrundlage, Kinder-Sätze kürzer als juristische (≤16 Wörter),
keine externen Links/Skripte.

## 7. Erweiterungen (Katalog)

Werbekennzeichnungs-Vorschau (№59), Cookie-/Consent-Hinweis-Baustein,
weitere Rechtsgrundlagen; uk/ru-Version der Kinder-Fassung.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
