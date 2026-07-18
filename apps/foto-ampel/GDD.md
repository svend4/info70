# Kurz-GDD: Foto-Ampel 📸

**Einheit aus Katalog:** docs/09 №220 — «Foto-Ampel». **Engine:** szenario
(Entscheidungsbaum-Variante), reine logik.mjs + dünne DOM-Schicht.
Zielgruppe: Familie (Eltern+Kind 6-12).

## 1. Kernaussage

Vor dem Teilen eines Fotos führt eine Ampel-Entscheidungsstrecke die Familie
zu Grün/Gelb/Rot – mit kindgerechter Begründung. Einwilligung wird als
eigenes Recht erfahrbar, das auch gegenüber den Eltern gilt.

## 2. Zielgruppe

Eltern+Kind 6-12. Nachbarn: darf-ich-posten (Quiz), daten-schatz, familien-
medienvertrag, sharenting-spiegel (Eltern-Sicht). 

## 3. Ablauf

1) Schritt für Schritt Ja/Nein antworten (die Einverständnis-Frage erscheint
nur, wenn andere Personen drauf sind).
2) Ampel-Ergebnis mit Gründen und Tipp; Vorlesen.
3) „Nächstes Foto prüfen“ startet neu.

## 4. Didaktik / Nutzen

Übersetzt Recht am eigenen Bild, verräterische Hintergründe und die
Dauerhaftigkeit von Uploads in eine erlebbare Ampel. Kernbotschaft: Dein Nein
zählt – auch bei Eltern-Fotos. Der Entscheidungsbaum macht die Abwägung
sichtbar statt sie zu verbieten.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, Vorlesen. Es werden
KEINE Fotos hochgeladen und NICHTS gespeichert – die Antworten leben nur im
Seitenspeicher. eltern.html vorhanden; im Eltern-Sammelband gelistet.

## 6. Tests

`test/logik.test.mjs`: vier Schritte mit eindeutigen IDs, relevanteFragen
(Einverständnis nur mit anderen Personen), fertig-Erkennung, bewerte
(Peinliches→Rot, ohne Einverständnis→Rot, Hintergrund→Gelb, sicher→Grün),
Kinderrecht (bei Rot auch Eltern-Fotos ablehnbar).

## 7. Erweiterungen (Katalog)

Foto-Ampel in Leichter Sprache; uk/ru; Verzahnung mit darf-ich-posten und
sharenting-spiegel.
