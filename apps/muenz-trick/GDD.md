# Kurz-GDD: Münz-Trick 💎

**Einheit aus Katalog:** docs/09 №4 — «Münz-Trick». **Engine:** simulator
(reine Logik + dünne DOM-Schicht, wie feed-forscher-profi).

## 1. Kernaussage

Spiel-Währung ist echtes Geld im Kostüm. Der Münz-Trick rechnet den wahren
Euro-Preis aus und zeigt die eingebaute Rest-Falle.

## 2. Zielgruppe

Kinder 8-12. Nachbarn: lootbox-labor (Zufall), dark-pattern-labyrinth
(UI-Tricks), daten-schatz (Kostenfallen-Szenarien).

## 3. Ablauf (Loop)

1. Item wählen (4 Wunsch-Items, Preis in 💎).
2. Echtpreis-Karte deckt auf: günstigster Paket-Kauf, echter €-Preis
   (fett), erhaltene 💎 vs. gebrauchte 💎, Rest als Lock-Falle.
3. Paket-Tabelle zeigt „pro 100 💎“ – die Mengenrabatt-Verlockung.
4. Auflösung: 5 Lektionen; zurück zum Shop.

## 4. Didaktik

Der Aha-Moment ist die Umrechnung: „350 �Juwelen“ fühlt sich klein an,
„3,96 €“ nicht. Die Rest-Mechanik wird nicht behauptet, sondern
vorgerechnet (Test: kein Item geht glatt auf). „+20% extra“ als Lockmittel
statt Geschenk. Handlungswissen: umrechnen, Eltern fragen, Gerät sperren.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), speichert NICHTS, werbefrei,
Vorlesen, mobile-first, eltern.html. Preise/Items sind erfunden und
plattformneutral (keine Markennamen).

## 6. Tests

`test/logik.test.mjs`: Paket-/Item-Schema, Mengenrabatt-Verlockung
(großes Paket pro Juwel günstiger), Ziel-Erreichung + kein negativer Rest,
DP-Minimalität gegen Brute Force, Kern-Invariante „immer ein Rest“,
Anzeige-Felder, Lektionen-Substanz.

## 7. Erweiterungen (Katalog)

Klassen-Modus (Klasse rät den Echtpreis, dann Auflösung); Umrechner-
Werkzeug „Was kostet mein Wunsch WIRKLICH?“ mit freier Eingabe;
uk/ru + Leichte Sprache über die kinder-ui-Bausteine.
