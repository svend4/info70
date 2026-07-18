# Kurz-GDD: Beschwerde-Brief-Werkstatt ✉️

**Einheit aus Katalog:** docs/09 №144 — «Beschwerde-Brief-Werkstatt».
**Engine:** Formular-zu-Dokument (Brief-Generator). Zielgruppe: Kinder 8-12
mit Lehrkraft (Unterrichtseinheit).

## 1. Kernaussage

Kinder formulieren Schritt für Schritt eine echte Beschwerde oder Petition
und erhalten einen fertig strukturierten Brief – an Schulleitung,
Klassenrat, Petitionsausschuss oder Kinderkommission.

## 2. Zielgruppe

Klasse 3–6, im Unterricht. Nachbarn: kinderrat, mitmach-arena,
rechte-kompass, beschwerde-lotse. Schulmaterial-Familie: projektwoche,
elternabend-kit.

## 3. Ablauf

1) Adressat wählen (mit Hinweis, wofür er zuständig ist).
2) Betreff, Anliegen, Begründung, Vorschlag ausfüllen (offene Teile werden
angezeigt).
3) Namen für den Brief eintippen (nicht gespeichert); Brief speichern/
kopieren/vorlesen.

## 4. Didaktik / Nutzen

Vermittelt Aufbau, Ton und Adressatengerechtheit einer wirksamen Eingabe
und macht erfahrbar, dass Art. 12/13 UN-KRK auch gegenüber Schule und Staat
gelten – Petitionen an den Bundestag sind ohne Mindestalter möglich. Die
strukturierten Satzanfänge senken die Schreibhürde.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, Vorlesen. Der
Absender-Name lebt nur im Seitenspeicher und wird NICHT gespeichert (Test:
absender nie in setItem); nur der Entwurf-Text ohne Name liegt lokal
(bbw.entwurf) + „Neu“. Kein eltern.html (Schulmaterial, wie projektwoche).

## 6. Tests

`test/logik.test.mjs`: Adressaten (Schulleitung/Petitionsausschuss/
Kinderkommission) mit eindeutigen IDs, Petition ohne Mindestalter,
fehlendeFelder, baueBrief (Angaben + richtige Anrede/Schluss + Art. 12/13),
Platzhalter bei leeren Angaben, Datensparsamkeit (Absender nie gespeichert).

## 7. Erweiterungen (Katalog)

Klassenrat-Handbuch (№143), Stationenlernen (№142); Vorlagen-Bibliothek für
häufige Anliegen; uk/ru-Fassung.
