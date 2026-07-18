# Kurz-GDD: Familien-Notfall-Fahrplan 🧊

**Einheit aus Katalog:** docs/09 №224 — «Familien-Notfall-Fahrplan».
**Engine:** statisch + kleine Ausfüll-Logik (Formular-zu-Druck). Zielgruppe:
Familie (Eltern+Kind 6-15).

## 1. Kernaussage

Ein gemeinsam ausgefüllter, druckbarer Wenn-dann-Fahrplan für den
Kühlschrank: Feste Schritte für den Ernstfall im Netz plus die eigenen
Vertrauenskontakte – damit jedes Kind sofort weiß, was zu tun ist.

## 2. Zielgruppe

Familien (Eltern+Kind 6-15). Nachbarn: familien-medienvertrag, foto-ampel,
beschwerde-lotse, stark-im-chat. Kein eltern.html (Print-/Familienwerkzeug
wie erstes-handy-kompass/netz-pass).

## 3. Ablauf

1) Feste Schritte lesen (Vorlesen möglich).
2) Eigene Kontakte eintippen (nur für den Ausdruck).
3) Fahrplan drucken/als PDF speichern und sichtbar aufhängen.

## 4. Didaktik / Nutzen

Verwandelt gutes Krisenwissen in einen greifbaren Plan an der Wand: nicht
antworten, Beweise sichern, blockieren/melden, Bescheid sagen, Hilfe holen
(116 111, juuuport). Der Kühlschrank-Platz sorgt dafür, dass der Plan im
Ernstfall wirklich da ist.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, Vorlesen. Es wird
NICHTS gespeichert – die Kontakte leben nur im Seitenspeicher (Test: kein
setItem). Hilfeangebote nur als Text (kein Link/Request). druck.css blendet
die Bedienung aus.

## 6. Tests

`test/logik.test.mjs`: feste Wenn-dann-Kette (≥5, mit Screenshot/blockieren/
melden/Bescheid), baueFahrplan (Schritte + Kontakte + 116 111/juuuport),
Ausfülllinien bei leeren Angaben, keine http-Links, Datenvermeidung (kein
setItem).

## 7. Erweiterungen (Katalog)

Familien-Notfall-Fahrplan in Leichter Sprache; uk/ru; regionale
Beratungsstellen als Textbausteine.
