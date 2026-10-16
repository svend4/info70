# Kurz-GDD: Eingewöhnungs-Leitfaden 🌱

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 3 — Umarbeitung des
früheren «Eingewöhnungs-Tagebuchs». **Engine:** reine Logik mit JSON-Config,
ohne Speicher. Zielgruppe: pädagogische Fachkräfte.

## 1. Kernaussage

Ein Leitfaden zur Eingewöhnung mit vier Phasen (Grundphase, erster
Trennungsversuch, Stabilisierungsphase, Schlussphase). Je Phase gibt es eine
druckbare Checkliste eigener Handlungen der Fachkraft, etwa «Bezugsperson mit
den Eltern besprochen?» oder «Verabschiedung vorbereitet?». Die App fragt nicht
nach einem Kind.

## 2. Kernentscheidungen (Variante A, Entscheidung des Nutzers)

- **Keine Bewertung von Kindern.** Keine Ampel, keine Stufen, kein Score, keine
  Empfehlung zu einem Kind, kein Verlauf je Kind. Grundlage: docs/02, Z. 141–146
  (erlaubt ist die Bewertung eigener Handlungen der Fachkraft).
- **Keine Kinderdaten.** Keine Kürzel, keine Einträge je Kind, kein Koffer
  (Export und Import entfallen), kein Löschknopf (es gibt nichts zu löschen).
- **Nichts wird gespeichert.** Der Zustand ist eine einzige Variable im Speicher
  der Seite und geht beim Neuladen verloren. Einziger Schreibzugriff auf den
  Browser-Speicher: beim Start wird der Altbestand `et.daten` entfernt
  (`removeItem` in `try/catch`, nie geschrieben).
- **Zählen nur eigener Haken je Phase** (z. B. «erledigt: 3 von 6»). Keine
  Gesamtsumme über Phasen, keine Prozentwerte.
- **Druckbogen je Phase.** Vier leere Blätter zum Abhaken von Hand; sie zeigen nichts
  aus der Sitzung. Keine Namenszeile.
- **Keine externen Anfragen.** Netzwerk-Wächter zur Laufzeit, CSP
  `default-src 'self'`, keine fremden Skripte.

## 3. Ablauf

1) Die vier Phasen lesen (Erklärung je Phase).
2) Die Handlungen der Phase abhaken; die Bilanz der Phase zeigt den Stand.
3) Drucken: vier Blätter, eines je Phase.

## 4. Didaktik / Nutzen

Die Eingewöhnung ist in deutschen Kitas üblich. Dass sie oft auf Papier notiert wird, ist nicht aus der Quelle belegt.
Der Leitfaden hilft dabei, die eigenen Schritte der Fachkraft vollständig im
Blick zu haben (Absprachen mit den Eltern, Abschied, Team, Abschluss). Er sagt
nichts über ein Kind aus.

## 5. Herkunft

Konzept-Idee aus Katalog Nr. 3 (docs/10). Phasen, Handlungen und Texte sind
Eigenentwurf, angelehnt an die in Deutschland üblichen Eingewöhnungsmodelle
(Berliner/Münchener Modell). Übernommen wurde nur das Konzept, kein Wortlaut.

## 6. Politik-Konformität (docs/02, EU AI Act)

Keine externen Anfragen, keine Kinderdaten, keine Speicherung, keine Freitexte
und Namen, keine Summen und keine Rangfolge. Die Info-Seite `eltern.html` erklärt dies für
Eltern, Träger und Leitung; die App ist im Eltern-Sammelband aufgeführt.

## 7. Tests

`test/logik.test.mjs` mit 9 Prüfungen: Config (vier Phasen, Fragen an die Fachkraft,
keine Ampel-Felder), `pruefeConfig`, `schluessel`, `bilanz` nur je Phase,
Exporte ohne Summe oder Score, `druckBlatt` ohne Namenszeile, vier Blätter.

`test/quellcode.test.mjs` mit 12 Prüfungen: kein Schreibweg in den Speicher außer dem
Altbestand (try/catch), Netzwerk-Wächter aktiv, keine externen Adressen und
Importe, keine Eingabefelder, keine Begriffe der alten Bewertung, Druckbogen
(`@media print`), keine Namenszeile, keine Modellnamen, `eltern.html` und
`index.html` (Sprache, CSP, Titel), Koffer entfernt.

Gesamt: **21 Tests**, alle grün (`node --test apps/eingewoehnungs-leitfaden/test/*.test.mjs`).

## 8. Erweiterungen (Katalog)

Meilenstein-Begleiter (Nr. 4), Phasen-Vorlagen je Modell, uk/ru-Elterninfo.
