# Pilot 1: Auswertung (Stand 18.10.2026, 14:30 UTC)

Zwei Sitzungen auf der Arbeitsbranche, gestartet 13:59 UTC.

## GEM-10 Kita-Kartograph (Ausbau, Aufwand M)

Sitzung `session_01WhwZAoPHW57BAd7JMNWZaQ`, Commit `cbe3a5a`.

**Ergebnis der Prüfung:**
- Tests der App: 29 von 29 bestanden.
- Browser bei 360 px: kein Überlauf, Knöpfe und Links mindestens 48 px, Fokus stimmt bei allen 54 Klicks, Speicher gleich null, nur `localhost`.
- Neuladen ohne Netz: schlägt fehl (erwartet, F4).

**Verstöße (nicht bestanden):**
1. Druck: Das Emoji „🗺“ steht im Druckinhalt (Titel und Drucküberschrift). Die Regel: keine Emojis im Druck.
2. Druck: Die Pflichtmarkierung „Seitenangaben maschinell gegen den Quelltext geprüft …“ fehlt im gedruckten Text, obwohl die Daten Seitenangaben tragen (`quelle.seite: S. 138`).
3. Druck: Es gibt kein eigenes Druckblatt (`druck.css` mit `@media print` fehlt). Gedruckt wird der Bildschirm.

**Ursache:**
- Die Anleitung verlangte die Druckprüfung nicht ausdrücklich, und die Tests der App prüfen keine Emojis im Druck.
- Der Testtext selbst enthält das Emoji (`test/regeln.test.mjs`, Zeile 70). Der Test bestätigt damit den Verstoß, statt ihn zu fangen.

**Folgerung für die Anleitung:**
- Die Druckregeln aus `apps/puppentheater-werkstatt/test/regeln.test.mjs` sind Pflicht, nicht optional.
- Die Browser-Prüfung muss im Bericht die Felder `druck.zeichen` und `druck.pflichtZeilen` ausweisen, sobald Seitenangaben gedruckt werden.
- Emojis in Titeln und Überschriften sind für Druckinhalte verboten; Emojis auf dem Bildschirm sind erlaubt.

## GEM-17 Tischdienst-Trainer (Ausbau, Aufwand S)

Sitzung `session_011s4uQ6nJwuboFdpA7kq4DZ`, Commit `8861bc8`.

**Ergebnis der Prüfung:**
- Tests der App: 49 von 49 bestanden.
- Browser bei 360 px: kein Überlauf, Knöpfe und Links mindestens 48 px, Speicher gleich null, nur `localhost`.
- Fokus: 1 Abweichung. Der Knopf `los` (Start) wechselt den Bildschirm, der Fokus springt auf `typ-austeilen`. Das ist eine Schwäche, kein Ausfall.

**Verstöße (nicht bestanden):**
1. Druck: Das Emoji „🤔“ (`app.mjs`, Zeile 93) erscheint im Druckinhalt. Der Bildschirmtext ist nicht als Bildschirmteil markiert und wird deshalb gedruckt.
2. Druck: Die Pflichtmarkierung fehlt im gedruckten Text.

**Ursache:** Dasselbe wie bei GEM-10. Die Anleitung von Pilot 1 verlangte die Druckprüfung noch nicht; die Sitzung hat nur die Tests der App laufen lassen.

## Vergleich der beiden Sitzungen

| Prüfpunkt | GEM-10 | GEM-17 |
|---|---|---|
| Tests der App | 29 bestanden | 49 bestanden |
| Überlauf bei 360 px | nein | nein |
| Knopfhöhe ≥ 48 px | ja | ja |
| Fokus nach Klick | 54 von 54 | 1 Abweichung |
| Speicher | 0 | 0 |
| Emoji im Druck | ja (🗺) | ja (🤔) |
| Pflichtmarkierung im Druck | fehlt | fehlt |
| Eigenes Druckblatt | nein | teilweise |

## Speicherung in GEM-10 (Korrektur)

Die Sitzung hat den Plan im localStorage gespeichert (`kartograph.plan`), mit Löschknopf. Das ist nach docs/02, Z. 25 erlaubt. Die Vorlage und die Anleitung hatten das fälschlich als „keine Speicherung“ beschrieben und sind korrigiert. Die Entscheidung bleibt: behalten, mit Löschknopf.

## Bewertung des Verfahrens

- Die Technik funktioniert: Der Ausbau läuft in einer Sitzung durch, die Tests laufen, die Browser-Prüfung läuft. Die Dauer ist nicht gemessen; die Sitzung meldet sie im Bericht.
- Die Lücke liegt bei den Regeln für den Druck, die die Anleitung nicht ausreichend verlangt. Beide Sitzungen verletzen dieselbe Regel: Emojis im Druck und fehlende Pflichtmarkierung.
- Vor einer Ausweitung (Etappe 2) muss die Anleitung ergänzt werden, und die Auswertung muss den Druck-Schritt als Pflicht ausweisen.
