# Kurz-GDD: Wetter- und Jahreszeiten-Forscher 🌦️

**Einheit aus Katalog:** docs/10 (Praleska) Ko-Nutzung Nr. 5 — «Wetter-
und Jahreszeiten-Forscher». **Engine:** Planer/Selbstbeobachtung mit
`kinder-ui`. Zielgruppe: ab 5, auch als Kita-Morgenkreis-Werkzeug.

## 1. Kernaussage

Wetter schaut man an, nicht nach. Jeden Tag ein Blick aus dem Fenster,
ein Antippen — und dann eine Frage, die nach draußen schickt. Nach vier
Wochen sieht man im Raster etwas, das an einem einzelnen Tag unsichtbar
ist: dass sich das Jahr dreht.

## 2. Die tragende Unterscheidung: gezählt wird das Wetter, nie das Kind

Dieselbe Planer-Mechanik wie in `gesunder-koerper-ampel`, aber für einen
anderen Gegenstand. Dort wäre eine Statistik eine Aussage über das Kind
und ist deshalb ausgeschlossen; hier ist sie eine Aussage über den Himmel
und deshalb erlaubt. „An zwölf von 28 Tagen war es bewölkt“ bewertet
niemanden.

Punkte, Noten und Vergleiche gibt es trotzdem nicht — ein Test verbietet
*Punkte, richtig, falsch, Rekord, Note, besser als* im Datensatz.

Aus demselben Grund ist das Speicherfenster hier mit **28 Tagen** größer
als die eine Woche der Gesunder-Körper-Ampel: Der Monatsrückblick ist der
Zweck dieser App, und Wetter ist keine Aussage über ein Kind. Das ist eine
bewusste Abwägung, keine Nachlässigkeit.

## 3. Wenn-dann-Beobachtungen

Jede der sechs Wettersorten trägt eine Beobachtung, die ohne Material
funktioniert und **eine Frage stellt** — Regen führt zu den Pfützen,
Sonne zum eigenen Schatten, Schnee zum Schmelzversuch, Nebel zur
Sichtweite. Der Validator verlangt Länge **und** Fragezeichen: Ohne Frage
bliebe es beim Antippen.

## 4. Jahreszeiten

Meteorologische Einteilung, wie in Deutschland üblich: Frühling ab März,
Sommer ab Juni, Herbst ab September, Winter ab Dezember — mit ganzen
Monaten. Ein Test prüft für **alle zwölf Monate** die Zuordnung sowie,
dass die vier Jahreszeiten lückenlos und überschneidungsfrei decken.
eltern.html erklärt zusätzlich, dass die astronomische Einteilung um etwa
drei Wochen abweicht und warum für die Kita die meteorologische
praktischer ist.

Je Jahreszeit mindestens vier Merkmale zum Suchen und ein
Gesprächsimpuls in Frageform.

## 5. Robustheit

`anzahlEintraege` zählt nur **bekannte** Wettersorten. Ein alter oder
verfälschter Eintrag im Speicher zählte sonst mit, während
`haeufigstesWetter` ihn ignoriert — die Bilanz widerspräche sich, und die
Anzeige liefe auf eine leere Referenz. Beides ist per Test festgehalten.

Die 28 Kalenderfelder tragen `role="img"` samt vollem Datum im
`aria-label`. Das ist nötig, nicht Zierrat: Ein `div` ohne Rolle ist
`role=generic`, und für `generic` verbietet ARIA einen Namen —
spezifikationstreue Screenreader ignorieren ihn dann, während die
sichtbare Tageszahl `aria-hidden` ist. (Chromium trägt den Namen zwar
trotzdem in seinen Baum ein; darauf zu bauen wäre aber fahrlässig.)
Dieselbe Lösung nutzen (früher) `wohlfuehl-ampel` und `uhr-und-kalender-kind`.

Ein Klick baut die Seite nicht neu auf: `#app` ist eine `aria-live`-Region,
ein Komplettaustausch würde dem Screenreader bei jedem Tipp alles erneut
vorlesen. Nur „Alles löschen“ rendert neu und setzt den Fokus danach
ausdrücklich zurück auf den Löschknopf.

## 6. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten, keine
Namen. Gespeichert wird ausschließlich, welches Wetter an welchem Tag
angetippt wurde, unter `wetter.tagebuch`, beschnitten beim Laden **und**
beim Speichern, vollständig löschbar. eltern.html, im Sammelband.

## 7. Tests

`test/logik.test.mjs` (9): Daten gültig; `datumsSchluessel` nutzt lokale
Zeit (23:30-Fall); `letzteTage`/`beschneide` über Monats-, Jahres- und
Schaltjahrgrenzen; alle zwölf Monate haben genau eine Jahreszeit;
`zaehleWetter` zählt beschreibend und meldet unbekannte Sorten als offen;
`haeufigstesWetter` liefert null bei leerem Tagebuch und ignoriert
verfälschte Einträge; jede Wettersorte stellt eine Frage (zwei Mutationen
geprüft); jede Jahreszeit hat ≥4 Merkmale und einen Impuls; keine
Bewertung im Datensatz.

## 8. Erweiterungen (Katalog)

Temperaturgefühl als zweite Spalte, Wettersymbole zum Ausdrucken für die
Magnettafel, Brücke zu `jahreszeiten-rad` (was Tiere und Pflanzen tun) und
zu `mess-labor` (mit Regenmesser und Thermometer weitermessen).
