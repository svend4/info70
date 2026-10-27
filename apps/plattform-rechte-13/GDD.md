# Kurz-GDD: Plattform-Rechte 13+ ⚖️

**Einheit aus Katalog:** docs/09 №147 — «Plattform-Rechte-Pack 13+».
**Engine:** quiz-kern (Altersvariante 13-15 des Kinderrechte-Entdeckers).
Zielgruppe: Jugendliche 13-15.

## 1. Kernaussage

Jugendliche lernen die konkreten Knöpfe und Fristen, mit denen sie ihre
Rechte auf Plattformen durchsetzen: Moderation begründen lassen,
Widerspruch, Auskunft, Löschung, Werbeverbot, KI-Kennzeichnung.

## 2. Zielgruppe

13-15 Jahre. Nachbarn: kinderrechte-entdecker (8-12), mini-rechte-entdecker
(6-8), stark-im-chat-plus (13+), feed-forscher-profi (13-15). Bildet die
obere Altersstufe der Kinderrechte-Linie.

## 3. Ablauf

quiz-kern-Standard: 12 Fragen aus 14, binaer + wahl, Erklärung nach jeder
Antwort, am Ende „Ende der Runde“ ohne Wertung, Klassen-Modus.

## 4. Didaktik / Nutzen

Macht abstrakte EU-Rechtsakte (DSA, DSGVO, AI Act) handhabbar: Jede Frage
zeigt ein konkretes Recht und wie man es nutzt. So wird aus „ich fühle mich
ungerecht behandelt“ ein Widerspruch nach DSA Art. 20 oder eine Löschanfrage
nach DSGVO Art. 17.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei. Die App speichert
nichts und kennt keine Punkte, keinen Rekord, keine Ränge; der frühere
Schlüssel pr13.rekord wird beim Start einmal entfernt. eltern.html
vorhanden; im Eltern-Sammelband gelistet.

## 6. Tests

`test/fragen.test.mjs`: quiz-kern-Schema gültig (≥12 Fragen), Zielgruppe
13-15 ohne Ränge in den Daten, inhaltliche Abdeckung
(DSA Art. 17/20/28, DSGVO Art. 15/8, Alter 16, AI Act), beide binaer-
Antworten kommen vor, App-Code ohne Wertung und ohne Speicher.

## 7. Erweiterungen (Katalog)

Plattform-Rechte in Leichter Sprache; uk/ru; Verzahnung mit stark-im-chat-
plus und dem KI-Transparenz-Check (Betreiber-Sicht).
