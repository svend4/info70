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

Sitzung `session_011s4uQ6nJwuboFdpA7kq4DZ`: noch keine Abgabe zum Stand 14:30 UTC.

## Bewertung des Verfahrens

- Die Technik funktioniert: Der Ausbau läuft in einer Sitzung durch, die Tests laufen, die Browser-Prüfung läuft. Die Dauer ist nicht gemessen; die Sitzung meldet sie im Bericht.
- Die Lücke liegt bei den Regeln für den Druck, die die Anleitung nicht ausreichend verlangt.
- Vor einer Ausweitung (Etappe 2) muss die Anleitung ergänzt werden, und die Auswertung muss den Druck-Schritt als Pflicht ausweisen.
