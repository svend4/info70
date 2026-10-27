# Kurz-GDD: Darf ich das posten? 📮

**Einheit aus Katalog:** docs/09 №18 — «Darf ich das posten?». **Engine:**
quiz-kern (Content-Pack, inkl. Klassen-Modus).

## 1. Kernaussage

Beim Posten zählen die Rechte der anderen. Recht am eigenen Bild und
Urheberrecht – praktisch angewendet an Alltagsfällen, mit dem
Perspektivwechsel als stärkster Regel.

## 2. Zielgruppe

Kinder 8-12. Gegenstück zu rechte-kompass/kinderrechte-entdecker (eigene
Rechte). Nachbarn: stark-im-chat, filter-spiegel, beschwerde-lotse.

## 3. Ablauf

quiz-kern-Standard: Start → 12er-Runde → binaer/wahl mit Kindersprache-
Erklärung → „Ende der Runde“ ohne Wertung. Zusätzlich Klassen-Modus.

## 4. Didaktik

Vier Fallgruppen: Foto von anderen (fragen, löschen auf Wunsch, Kinder →
Eltern), fremde Inhalte (teilen ja, als eigenes ausgeben nein), Musik &
Video (freie Musik/selbst gemacht), Peinliches (nicht weiterleiten).
Balance-Test: beide binaer-Antworten kommen vor, damit das Kind ABWÄGT
statt „alles verboten“. Kernregel: „Wäre das okay, wenn es von MIR wäre?“

## 5. Politik-Konformität (docs/02)

Netzwerk-Wächter in der App, quiz-kern macht keine Anfragen, werbefrei,
Vorlesen, eltern.html. Fälle sind erfunden, keine echten Personen/Marken.
Die App speichert nichts und kennt keine Punkte, keinen Rekord, keine Ränge;
der frühere Schlüssel `dip.rekord` wird beim Start einmal entfernt.

## 6. Tests

`test/fragen.test.mjs`: quiz-kern-Schema (≥14 Fragen), Balance (ja+nein),
Typ-Mischung, Abdeckung der vier Fallgruppen, Kernbegriffe (Recht am
eigenen Bild, Urheberrecht, fragen, Perspektivwechsel), keine Ränge in den
Daten, App-Code ohne Wertung und ohne Speicher.

## 7. Erweiterungen (Katalog)

Nachbarpakete: App-Rechte-Quiz (№53), Chat-Rechte-Pack (№35); uk/ru +
Leichte Sprache über kinder-ui.
