# Kurz-GDD: Familien-Datenschatz 👨‍👩‍👧

**Einheit aus Katalog:** docs/09 Ось F Nr. 271 — «Familien-Datenschatz».
**Engine:** szenario-Muster (beste/auchOk) als Familien-Duett + Vergleich.
Zielgruppe: Eltern+Kind 8–12.

## 1. Kernaussage

Ein Szenario-Duett auf einem Gerät: Kind und Eltern entscheiden nacheinander
(die Wahl des Kindes bleibt verdeckt), danach wird verglichen – mit Erklärung
und Gesprächsimpuls. Bewusst wird auch elterliche Überwachung (Ortung,
heimliches Mitlesen, Sharenting) als Privatsphäre-Frage des Kindes behandelt
(UN-KRK Art. 16). Kein Gewinner – die Unterschiede sind der Gesprächsanlass.

## 2. Zielgruppe

Familie. Nachbarn: daten-schatz (Einzelspiel), foto-ampel, sharenting-spiegel,
familienrat, familien-medienvertrag, generationen-quiz.

## 3. Ablauf

1) Start erklärt das Duett-Prinzip (Vorlesen).
2) Pro Situation: Kind wählt → Eltern wählen (verdeckt) → Auflösung mit
   Punkten beider, fairer Wahl, Erklärung und Gesprächsimpuls.
3) Runde von 8 Situationen (aus 12), am Ende beide Punktzahlen + Einigkeit +
   Familien-Botschaft. „Noch eine Runde“ / „Start“.

## 4. Didaktik / Nutzen

Verlagert Datenschutz vom Einzel-Quiz ins Familiengespräch. Der verdeckte
Vergleich macht Unterschiede sichtbar, ohne Sieger/Verlierer. Der Twist –
elterliche Überwachung als Privatsphäre-Frage – nimmt das Kind als
Rechtssubjekt ernst (Art. 16) und lädt Eltern zur Selbstreflexion ein.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), keine Konten, nichts wird
hochgeladen; nur Anzeige-Einstellung liegt löschbar im localStorage (kinder-ui).
Werbefrei. Kinder-/Familien-App mit eltern.html, im Eltern-Sammelband gelistet.

## 6. Tests

`test/logik.test.mjs`: ≥10 Szenarien, eindeutige IDs, gültige beste/auchOk
(beste nicht in auchOk), Felder (Situation/Erklärung/Gesprächsimpuls),
thematische Abdeckung (Art. 16/Ortung/Chat/Sharenting), `bewerte` (2/1/0),
`vergleiche` (Punkte beider + einig), `rundeErgebnis` (Summen/Einigkeit/Max),
`familienBotschaft` (kein Gewinner).

## 7. Erweiterungen (Katalog)

Weitere Familien-Situationen, Kopplung mit familienrat (Beschluss aus dem
Gespräch), Wechselmodus wie im Generationen-Quiz.
