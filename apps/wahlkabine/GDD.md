# Kurz-GDD: Geheime Wahl 🗳️

**Einheit aus Katalog:** docs/09 №205 — «Wahlkabinen-Modus „Geheime Wahl“».
**Engine:** neu: versiegelte Zähler-Abstimmung (privacy by design).
Zielgruppe: Schule/Beteiligung 8-12.

## 1. Kernaussage

Ein Gerät wird herumgereicht; jede Stimme wird sofort als bloßer Zähler
versiegelt, das Ergebnis erscheint erst nach der letzten Stimme. Kinder
erleben Wahlgeheimnis und Wahlgrundsätze am eigenen Votum.

## 2. Zielgruppe

Klassen 8-12 (Klassensprecher-Wahl, Abstimmungen). Nachbarn: mitmach-arena,
kinderrat, aemtli-rad, regel-werkstatt.

## 3. Ablauf

1) Frage, Antworten und Wählerzahl eingeben.
2) Gerät herumreichen: jede*r wählt geheim, Stimme wird versiegelt.
3) Nach der letzten Stimme: Ergebnis mit Balken, Gewinner oder Gleichstand.

## 4. Didaktik / Nutzen

Macht das Wahlgeheimnis technisch erlebbar: Es gibt kein Feld „wer hat was
gewählt“ – nur Zähler. Die gemischte Optionsreihenfolge und das späte
Aufdecken zeigen, warum geheime Wahlen fair sind (UN-KRK Art. 12,
Demokratiebildung).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei. Gespeichert wird nur
die laufende Wahl (wk.wahl) mit reinen Zählern, löschbar – keine Zuordnung
Stimme→Person (Test sichert das ab). Kein eltern.html (Schulwerkzeug).

## 6. Tests

`test/logik.test.mjs`: neueWahl (Zähler 0, keine Personen-Zuordnung),
stimmeAb (nur gewählter Zähler steigt), fertig/offen (erst nach letzter
Stimme, keine Überstimmen), ergebnis (sortiert, eindeutiger Gewinner),
Gleichstand-Erkennung.

## 7. Erweiterungen (Katalog)

Ergebnis-Plakat (№241), Klassenrat-Themenpaket (№240); Stichwahl bei
Gleichstand; Export ins Klassenrat-Protokoll.
