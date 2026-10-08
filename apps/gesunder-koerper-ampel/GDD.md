# Kurz-GDD: Gesunder-Körper-Ampel 🚥

**Einheit aus Katalog:** docs/10 (Praleska) Kinder-Apps Nr. 14 —
«Gesunder-Koerper-Ampel (Selbstbeobachtung)». **Engine:** eigener
Planer/Selbstbeobachtungs-Baustein mit `kinder-ui`. Zielgruppe: 8–12
eigenständig, 5–7 in Ko-Nutzung.

## 1. Kernaussage

Ein Tag lässt sich an sechs Dingen beschreiben: Bewegung, Ruhe und Schlaf,
Essen und Trinken, frische Luft, Sauberkeit und Zeit ohne Bildschirm. Das Kind beschreibt seinen
eigenen Tag — und sieht über eine Woche hinweg ein Muster, das ihm sonst
niemand zeigt. Die Leistung liegt im Hinsehen, nicht im Abschneiden.

## 2. Ablauf

Je Faktor drei Selbstauskünfte: 🟢 „heute viel“, 🟡 „ein bisschen“,
⚪ „heute noch nicht“. Ein zweiter Klick auf denselben Knopf nimmt den
Eintrag zurück. Darunter der Rückblick über sieben Tage als Tabelle
(Faktor × Tag) mit einer rein beschreibenden Auszählung, und zuletzt ein
selbst gewähltes Vorhaben für morgen samt Impulstext.

## 3. Die tragende Entscheidung: beschreiben statt bewerten

Der Katalog nennt die Einheit „Ampel“, aber eine Ampel bewertet — und
genau das darf hier nicht passieren. Fünf Eigenschaften sind deshalb
bewusst weggelassen und im Validator festgeschrieben:

| weggelassen | warum | wie abgesichert |
| --- | --- | --- |
| Punkte / Summe | macht aus Selbstbeobachtung eine Note | `pruefeFaktoren` lehnt `punkte`/`wert` an einer Stufe ab |
| Rot | ein ruhiger Tag ist kein Fehler | `pruefeFaktoren` lehnt 🔴 und ❌ ab |
| Ränge | ordnet Kinder in eine Reihenfolge | `pruefeFaktoren` lehnt ein `raenge`-Feld ab |
| Frage nach der Bildschirm-Dauer | dreht die Richtung der Ampel um und lässt das Kind seinen Medienkonsum benoten | `pruefeFaktoren` verlangt bei Geräte-Fragen „ohne Bildschirm“ und lehnt „wie lange/viel/oft“ ab |
| Serie / Streak | erzeugt Druck statt Aufmerksamkeit | kommt im Code nicht vor |
| Vorschlag der App | wäre eine Ableitung über das Kind | Vorhaben wählt ausschließlich das Kind |

Damit ist die App auch mit Blick auf die EU-KI-Verordnung sauber: kein
Scoring, kein Ranking, keine Ableitung über Kinder. Dieselbe Linie wie in
`wohlfuehl-ampel` und `staerken-tagebuch`.

## 4. Abgrenzung zu den Nachbar-Apps

- `stark-und-gesund` — **Quiz** über Gesundheitswissen (was gilt?).
- `koerper-entdecker` — **Quiz** über den Körperbau (was steckt drin?).
- diese App — **kein Quiz**: Es gibt keine richtige Antwort, nur den
  eigenen Tag.
- `wohlfuehl-ampel` — Ampel, aber **für Fachkräfte über Kinder**; hier
  beobachtet sich das Kind selbst.

## 5. Datensparsamkeit

Ein einziger Schlüssel `koerper.ampel` mit den letzten sieben Tagen und
dem Vorhaben. `beschneide()` läuft beim Laden **und** beim Speichern:
Ältere Tage werden tatsächlich verworfen, nicht bloß ausgeblendet.
„Alles löschen“ entfernt den Eintrag vollständig.

Das Datum wird lokal gebildet (`datumsSchluessel` liest
`getFullYear/getMonth/getDate`), nicht über `toISOString` — sonst würde
ein Eintrag um 23:30 Uhr in Deutschland auf den Folgetag rutschen. Ein
Test hält genau diesen Fall fest.

## 6. BFSG / Bedienung

Jede Stufe ist ein Knopf mit `aria-pressed` und einem sprechenden
`aria-label` („Bewegung: ein bisschen“); die Wochentabelle nutzt echte
`th`-Zellen mit `scope` und je Zelle ein `aria-label` mit Faktor, Datum
und Eintrag. Der Status „noch offen“ steht in einer `aria-live`-Region.
Zu jedem Faktor gibt es einen Vorlese-Knopf.

Der Fokus bleibt erhalten, weil ein Klick die Seite gar nicht neu
aufbaut: `setzeStufe` und `setzeVorhaben` fassen über die Maps
`stufenKnoepfe`, `zellen`, `zaehlZeilen` und `vorhabenKnoepfe` nur die
Knoten an, die sich wirklich geändert haben — der gedrückte Knopf
überlebt und behält den Fokus. Einzige Ausnahme ist „Alles löschen“:
Dort wird tatsächlich neu gerendert, deshalb setzt der Handler den Fokus
danach ausdrücklich wieder auf den Löschknopf (`LOESCH_KNOPF`).

## 7. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten.
Speicherung minimal und löschbar, siehe oben. eltern.html, im
Sammelband. Kein Gesundheits-Tracker, keine Diagnosen — eltern.html
verweist auf die kinderärztliche Praxis.

## 8. Tests

`test/logik.test.mjs` (10): Faktor-Daten gültig; die sechs Katalog-Faktoren
sind vollständig, jeder Impuls ≥150 Zeichen und jede Frage endet mit
Fragezeichen; **kein Scoring** — Punkte, Rot und Ränge werden vom
Validator aktiv abgelehnt und kommen im echten Datensatz nicht vor;
`datumsSchluessel` nutzt lokale Zeit (23:30-Fall); `letzteTage` ist
aufsteigend, endet heute und stimmt über Monats- und Schaltjahrgrenzen;
`beschneide` verwirft alles außerhalb des Fensters und lässt das Original
unberührt; `zaehleStufen` zählt beschreibend und meldet fehlende Tage als
„offen“ (unbekannte Stufen ebenfalls); `alleBeantwortet`; Ton ohne
Beschämung, Körperbewertung und Diagnosen, wobei „verboten“ nur in der
Verneinung „Kein Essen ist verboten“ vorkommen darf.

## 9. Erweiterungen (Katalog)

Druckbare Wochenkarte für den Kühlschrank (Anschluss an
`quiz-karten-druck`), Kopplung mit `bewegungs-schatzkiste` (aus dem
Vorhaben wird ein konkretes Spiel), Familienmodus im `familienrat`, in
dem alle unabhängig voneinander ihre eigene Woche anschauen.
