# Kurz-GDD: Quiz-Kartenspiel drucken 🃏

**Einheit aus Katalog:** docs/09 Ось H — «Quiz-Kartenspiel-PDFs zum Selbstdrucken».
**Engine:** neu: Karten-Builder aus vorhandenen Quiz-JSON-Daten.
Zielgruppe: Klasse 8–12.

## 1. Kernaussage

Aus den vorhandenen Quiz-Daten (quiz-kern-Schema) wird im Browser ein
druckbares Kartendeck: Vorderseite Frage, Rückseite Antwort + Erklärung.
Kein Server, kein neues Werkzeug – Klassen ohne Tablets spielen dieselben
Fälle analog.

## 2. Zielgruppe

Klasse 8–12 / Lehrkraft. Nachbarn: alle Quiz-Apps, starke-zuege-poster,
projektwoche.

## 3. Ablauf

1) Deck wählen (liest fragen.json des Quiz).
2) Kartengitter mit Schnitt- und Falzlinie ansehen.
3) Drucken, ausschneiden, falten, spielen.

## 4. Didaktik / Nutzen

Analog-Backup der digitalen Quizze; Inklusion ohne Geräte; wiederverwendet
bestehende Inhalte ohne Doppelpflege.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, **speichert nichts**.
Liest nur lokale Quiz-Daten. Druckwerkzeug ohne eltern.html.

## 6. Tests

`test/karten.test.mjs`: baueKarten (binaer/wahl → Vorder-/Rückseite),
pruefeFragenListe (leer/kaputt), und alle angebotenen Decks existieren und
ergeben gültige Karten.

## 7. Erweiterungen (Katalog)

Mehrsprachige Decks (mini-i18n), Auswahl einzelner Kategorien, A6-Layout,
Kopplung mit den Postern „Drei starke Züge“.
