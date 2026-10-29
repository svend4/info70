# Kurz-GDD: Familienschatz 💛

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 13 — «Reime, Wiegen-
lieder, Kniereiter – Familienschatz-Paket». **Engine:** Content-Guide + lokale
Sammel-Liste (reine Logik + JSON). Zielgruppe: Eltern/Familie.

## 1. Kernaussage

Reime, Kniereiter, Fingerspiele und Wiegenlieder stärken Bindung und Sprache –
ohne Bildschirmzeit fürs Kind. Die App erklärt die Methode (warum/wie je Art),
bietet eigene Beispieltexte zum Vorlesen und einen lokalen „Familien-Lieder-
schatz“ zum Selbstsammeln in jeder Familiensprache.

## 2. Zielgruppe

Eltern/Familie. Nachbarn: reim-radar, vorlese-kompass, herkunftssprachen-bruecke,
autonomiephase-navigator.

## 3. Ablauf

1) Kurzer Sinn-Hinweis (Bindung/Sprache, mehrsprachig einladen).
2) Vier Arten (Kniereiter/Fingerspiel/Wiegenlied/Reim) mit warum/wie.
3) Beispiele durchblättern („Noch eins“), vorlesen.
4) Eigene Verse/Lieder sammeln (Titel + Text, lokal, einzeln löschbar), vorlesen.
5) Karte „Meine Daten löschen“: entfernt die ganze Sammlung vom Gerät.

## 4. Didaktik / Nutzen

Gemeinfreie/eigene Kniereiter und Wiegenlieder bedienen Bindungs- und Sprach-
förderung ohne jedes Lizenzrisiko und funktionieren komplett ohne Kind-Bild-
schirmzeit (die App ist Anregung für Erwachsene). Der eigentliche Schatz ist
die Familiensammlung – ausdrücklich in de/uk/ru und weiteren Sprachen.

## 5. Politik-Konformität (docs/02, Urheberrecht)

Beispieltexte sind Eigenproduktion (keine Übernahmen). Keine externen Anfragen
(NetzwerkWaechter), keine Konten, nur die eigene Sammlung in localStorage
(„schatz.eigene“, Titel gekappt auf 80 / Text auf 800 Zeichen); gelöscht wird
einzeln (🗑️ je Eintrag) oder ganz über die Karte „Meine Daten löschen“
(`datenKarte`, entfernt den Schlüssel; beim Drucken ausgeblendet, `druck.css`).
Werbefrei. Werkzeug für Eltern OHNE eltern.html, nicht im Sammelband (kein
Kinder-Screen; Anregung für Erwachsene).

## 6. Tests

`test/logik.test.mjs`: Schatz-Daten gültig (Arten+Beispiele passen), Beispiele
als „eigener Text“ gekennzeichnet, jede Art mit warum/wie + Mehrsprachigkeit,
`artName`/`naechsterIndex`, `normalisiereEintrag`/`eintragOk` (Titel Pflicht,
Längen begrenzt). `test/speicher.test.mjs`: ein Schreibweg, Schlüssel
„schatz.eigene“, Karte „Meine Daten löschen“ mit diesem Schlüssel, Einzel-
Löschknopf je Eintrag, Karte nur am Bildschirm.

## 7. Erweiterungen (Katalog)

Vorlese-Kompass (Nr. 14), druckbare Kartei, Melodie-Summen per WebAudio,
Kategorien-Filter, Export der Familiensammlung.

## Vorlesen (Entscheidung 28а)

Keine Vorlese-Pflicht. Dieses Werkzeug richtet sich an Erwachsene. Die Zeile „есть озвучивание“ der Checkliste in `docs/02-anforderungen.md` gilt für Kinder-Apps (Ergänzung 28а vom 27.10.2026, am 29.10.2026 in die GDD übernommen).
