# Kleine Forscher ohne Bildschirm

Druckkartei für Fachkräfte und Eltern von Kindern von 1 bis 3 Jahren (PRI-8, Bauauftrag
`docs/bauauftraege/PRI-8-kleine-forscher-ohne-bildschirm.md`). Sieben Versuchskarten zu Sand, Ton,
Wasser, Stapeln, Ineinanderlegen und Werkzeug. Die Fachkraft wählt Karten; „Blätter drucken“ druckt
jede gewählte Karte als ein Blatt A4 hoch. Das Kind sieht keinen Bildschirm.

Ohne Speicherung, ohne Verbindung nach draußen. Ein Neuladen ohne Netz ist nicht zugesichert:
die App hat keinen Service Worker (F4).

**Status: erster Stand (gebaut).** Geprüft sind die Tests mit `npm test` und die Browser-Messung
bei 360 px (siehe Abnahme im Bauauftrag). Die Sicherheitshinweise sind Eigenentwurf und noch nicht
von einer Fachkraft gelesen.

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

## Was belegt ist

- Praleska, Abschnitt „ПОЗНАВАТЕЛЬНО-ПРАКТИЧЕСКАЯ ДЕЯТЕЛЬНОСТЬ“ (S. 63), Gruppe „МАЛЫШИ“ (S. 64).
- Anmerkung 29.10.2026 (Seitenprüfung, Welle 3): Die Karte „Ineinanderlegen“ stützt sich auf den Stichpunkt, der auf
  S. 63 beginnt; das Beispiel steht auf S. 64. In `daten/karten.json` steht `quelle.seite` „S. 63“ und zusätzlich
  `quelle.seite_bis` „S. 64“. Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- Zitate, je mit Seite in den Daten (`daten/karten.json`, Feld `quelle.seite`):
  - „песок, глина, камушки“ (S. 63)
  - „сухой и влажный песок“ (S. 63)
  - „пирамидок из колечек“ (S. 64)
  - „достать палочкой“ (S. 64)
  - „совочком“ (S. 64)
  - „Я сам“ (S. 64)
- Die Umschreibungen (Sand und Ton untersuchen, Stapeln und Ineinanderstecken, Ball mit Stab holen,
  Sand mit der Schaufel füllen, Neugier) stehen ohne Anführungszeichen in der Quelle.

## Was Eigenentwurf ist

- Die sieben Versuchsthemen, Material, Lernziele und Sicherheitshinweise.
- Die deutschen Übertragungen der Zitate („Sand, Ton, Steine“, „trockener und nasser Sand“,
  „Pyramide aus Ringen“, „mit dem Stäbchen herausholen“, „mit dem Schäufelchen“, „Ich selbst“).
- „Knete statt Lehm“: die Materialanpassung für die deutsche Kita.

## Druck

- Ein Blatt A4 hoch je gewählter Karte. Auf dem Blatt stehen Titel, Quellenzeile (Abschnitt und Gruppe),
  Begriffe mit Übertragung, Material, Lernziel für Erwachsene, Sicherheitshinweis und die Pflichtmarkierung.
- Keine Seitenzahl auf dem Blatt (Abnahme und Standard A18). Die Seite steht in den Daten.
- Keine Zeichen aus den verbotenen Gruppen (Kästchen, Häkchen, Sterne, Punkte, Pfeile, Emojis),
  keine Namenszeile, kein Datums- oder Wochentagsfeld.
- Die Bildschirmteile sind beim Drucken ausgeblendet (`druck.css`).

## Projektregeln

- Keine Eingabefelder; die Auswahl ist eine Reihe von Knöpfen mit `aria-pressed`.
- Keine Speicherung, keine Anfragen nach außen, Content-Security-Policy `default-src 'self'`.
- Der Netzwerk-Wächter aus `packages/kinderschutz` ist eingebaut.
- Kein Zufall: die App zieht nichts; alle Karten stehen in fester Reihenfolge.
- Knöpfe mindestens 48 px hoch (3rem über `.k-knopf`), Fuß-Link 48 px.
- Der Fokus bleibt nach einem Klick auf derselben Kennung.

## Dateien

- `index.html`, `app.mjs` (Oberfläche), `logik.mjs` (Auswahl, Prüfung, Blätter, ohne DOM),
  `druck.css`, `daten/karten.json`.
- `test/logik.test.mjs`: Daten gegen den Bauauftrag, Auswahl, Druckblätter.
- `test/regeln.test.mjs`: Projektregeln (Eingabe, Speicherung, Netz, Druckzeichen, Namenszeile,
  Pflichtmarkierung, Fokus, Knopfhöhe, Testzahl).

## Tests

```bash
cd apps/kleine-forscher-ohne-bildschirm && npm test
```

49 Tests in zwei Dateien: 26 in `test/logik.test.mjs`, 23 in `test/regeln.test.mjs`.

## Offen

- Sicherheitshinweise und Materialien sind Eigenentwurf. Eine Fachkraft mit U3-Erfahrung liest sie gegen (Abnahme, Bauauftrag Abschnitt 8).
- Anzahl der Karten: sieben Themen im Entwurf (Bauauftrag Abschnitt 9).
- Form: Druckkartei als App gebaut; der Index führte keine App (Entscheidung Druckkarte oder App im Bauauftrag Abschnitt 9).
- Seitenangaben ohne Markierung „проверено человеком“ (A18). Standard: Auf dem Blatt steht keine Seitenzahl.
- uk und ru: nicht gebaut, offen.
- Modellnamen-Entscheidung A1 bleibt offen; in den Dateien steht kein Modellname.
- Neuladen ohne Netz wird gemessen, ist aber keine Abnahmebedingung (F4).
- Seitenangabe und Pflichtmarkierung: Die Pflichtmarkierung steht auf jedem Blatt, obwohl die Seite nicht gedruckt wird; das folgt Bauauftrag Abschnitt 6.

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
