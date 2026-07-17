# Kurz-GDD: Eltern-Kompass-Sammelband 📚

**Einheit aus Katalog:** docs/09 — «Eltern-Kompass-Sammelband
(mehrsprachig, druckbar)». **Engine:** statisch (Laufzeit-Bündelung).

## 1. Kernaussage

37 Eltern-Kompass-Seiten existieren schon - der Sammelband macht daraus
EIN austeilbares Dokument, ohne eine einzige Zeile Inhalt zu kopieren.

## 2. Zielgruppe

Lehrkräfte und Fachkräfte (Austeilen am Elternabend), Eltern
(Nachschlagen in der Elternmappe). Gegenstück zum elternabend-kit.

## 3. Aufbau

1. Laufzeit-Bündelung: fetch jeder ../app/eltern.html (Same-Origin),
   DOMParser, Kapitel = h1-Titel + alle section.k-karte.
2. Inhaltsverzeichnis (2 Spalten, Anker), Kapitel nummeriert mit
   App-Pfad-Angabe.
3. Broschüren-Druck: Kapitel je neue Seite, UI-Elemente unsichtbar.
4. Fehlertoleranz: nicht ladbare Seite → Platzhalter-Kapitel mit Link.

## 4. Warum Laufzeit statt Kopie (Architektur-Entscheidung)

Kopierte Texte veralten still - gerade bei Datenschutz-Zusagen wäre das
fatal. Die Bündelung zur Laufzeit garantiert: Der Sammelband sagt immer
exakt das, was die App-Seite sagt. Der Preis (JS nötig, kurze Ladezeit)
ist für ein Erwachsenen-Werkzeug akzeptabel.

## 5. Politik-Konformität (docs/02)

Nur Same-Origin-fetch (NetzwerkWaechter aktiv), speichert nichts,
werbefrei, Impressum. Links aus Quell-Kapiteln werden auf die jeweilige
Original-Seite umgebogen und sind im Druck unsichtbar.

## 6. Tests

`test/apps.test.mjs`: Liste sortiert + eindeutig; jede gelistete App hat
eltern.html; ZWEISEITIGE Vollständigkeit (jede vorhandene eltern.html
ist gelistet - neue Apps können nicht vergessen werden); Architektur-
Wächter (fetch + DOMParser statt Kopien, Druck-Kapitelstruktur).

## 7. Erweiterungen (Katalog)

Mehrsprachige Ausgabe, sobald eltern.html-Seiten uk/ru-Fassungen haben
(dieselben i18n-Pakete wie das elternabend-kit-Handout); thematische
Teil-Broschüren (nur "Sicher im Netz", nur Kita-Werkzeuge).
