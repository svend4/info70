# Bewegungslandschaften-Plakate Krippe: Kurz-GDD

## 1. Warum
Krippenkinder brauchen Gelegenheit zum Kriechen, Klettern, Werfen und Balancieren.
Die Praleska beschreibt dafür Übungen mit Maßangaben (S. 58 bis 60). Fachkräfte
brauchen diese Angaben als Karten, die sie an den Bewegungsraum hängen oder mitnehmen.

## 2. Wer und Kernerlebnis
Wer: Fachkräfte in der Krippe. Kinder nehmen teil, sie nutzen das Werkzeug nicht.
Kernerlebnis: Die Fachkraft wählt Stationen, druckt und hat Karten, auf denen jede
Maßangabe ihre Seite trägt.

## 3. Entscheidungen
- Der Druck zeigt nur die gewählten Karten, je Karte ein Blatt A4 quer. Keine Zeichen,
  Kästchen, Punkte, Sterne oder Emojis; keine Namenszeile, kein Tages- oder Wochentagsfeld
  (docs/02 Z. 79–82).
- Die Maßangaben sind Übungsmaße. Jede Karte mit Maßen sagt, dass sie keine Sicherheitsgrenzen sind:
  die vier Stationskarten mit Maßen in der Fußzeile („Übungsmaß laut Quelle, keine Sicherheitsgrenze.“),
  die Aufsichtskarte im Eigenentwurf. Geräte, Höhen und Untergrund prüft der Träger (Aufsichtskarte).
- Keine Eingabefelder und keine Speicherung (Projektregel, ohne docs/02-Zeile). Der Filter
  lebt nur in der geöffneten Seite.
- Jede Karte und jede Maßzeile trägt eine Seitenangabe. Jede Übertragung und jeder
  Eigenentwurf ist als solcher gekennzeichnet.
- Pflichtmarkierung (Lehre aus Pilot 1): Jede gedruckte Karte mit Seitenangabe trägt unten die
  Markierung „noch nicht von einem Menschen geprüft“. Die Prüfung steht in `pruefeMarkierung`.
- Maßzahlen: `pruefeMasse` verlangt für jede Maßzahl mit Einheit eine Seite von 58 bis 60.
  Der Abgleich mit der Quelltextkopie (Workflow, zehn Maßzeilen) hat alle Zeilen als belegt geführt.
- Widerspruch aufgelöst, nach dem Text der Quelle (S. 58 bis 60): Kriechen zwischen Schnüren und
  Durchkriechen nennen keine Maße; für den Balancierweg ist die Frage offen (siehe „Offen“). Die drei
  Karten haben deshalb keinen Abschnitt „Übungsmaß laut Quelle“ und keinen Fuß dazu; die Zeile
  „die Quelle nennt hier keine Maße“ bleibt auf allen dreien. Klettern, schiefe Ebene, Zielwurf
  horizontal und vertikal nennen Maße mit Seite. Test: „Widerspruch aufgelöst“ in
  `test/regeln.test.mjs`.
- Die Aufsicht ist eine eigene Karte mit den Hinweisen von S. 57 und nur mit ihnen.
- Bewusst nicht übernommen: Aufbaupläne, Zeichnungen, das Wort „Tunnel“, DGUV-Verweise,
  Höchstwerte, der Querverweis auf einen Baukasten und die Angabe „auf 100 bis 125 cm“.

## 4. Lernziele (prüfbar)
1. Die Fachkraft wählt Stationen und druckt Karten, auf denen jede Maßangabe eine Seite trägt.
2. Die Aufsichtskarte lässt sich mit drucken, wenn sie gewählt ist.
3. Auf keiner Karte und in keinem Druck steht ein Kind; es gibt kein Feld dafür.

## 5. Inhalt
Acht Karten: sieben Stationen (Kriechen zwischen Schnüren, Klettern mit Gerätehöhe,
schiefe Ebene, Zielwurf horizontal, Zielwurf vertikal, Durchkriechen, Balancierweg) und
die Aufsichtskarte Aufsicht und Umgebung. Die Daten stehen in `daten/stationen.json`.

## 6. Politik (docs/02)
- Keine Anfragen nach außen (docs/02 Z. 22–24): Content-Security-Policy `default-src 'self'`,
  Netzwerk-Wächter, kein `fetch` im Quelltext der App.
- Keine Bewertung von Kindern (docs/02 Z. 141–146). Keine Speicherung und kein Bildschirm
  für Kinder unter 3 Jahren: Projektregeln, ohne docs/02-Zeile.
- Druckblatt nach docs/02 Z. 79–82: keine Zeichen, keine Namenszeile.
- Oberfläche auf der Basis von `packages/kinder-ui` (Touch-Ziele, Kontrast, Schriftgröße).
  Fuß-Link mindestens 48 px hoch; nach einem Klick bleibt der Fokus auf dem gleichen Knopf.

## 7. Aufwand
S. Die Karten sind statisch und der Druck ist eine Druckansicht.

## 8. Tests
35 Tests in zwei Dateien. Sie prüfen die Daten, die Seiten, die Zahlen gegen die
Quellenseiten, die Ausgabe der Quelle, die Auswahl, die Pflichtmarkierung je Karte und die Projektregeln.
Details in der README.

## Offen
- DGUV-Vorgaben für Bewegungsräume sind extern zu prüfen. Die App nennt keine.
- Fallhöhe, Untergrund und Höchstwerte sind in der Quelle nicht belegt; die App nennt sie nicht.
- Der Bezugspunkt von „auf 100 bis 125 cm“ (S. 60) ist unklar; die Angabe fehlt deshalb.
- Die Aufsicht steht nur auf S. 57; weitere Aufsichtsregeln sind nicht belegt.
- Die Übertragung der Wörter sollte eine Fachkraft gegenlesen (Eigenentwurf).
- Balancierweg: Die Quelle nennt auf S. 59 unter „Ходьба“ eine Bahn („по дорожке“) mit 15 bis
  20 cm Breite und 2 bis 3 m Länge. Die Karte Balancierweg übernimmt sie nicht, weil die Quelle
  sie nicht mit den Elementen des Balancierwegs verbindet (S. 60). Eine Fachkraft entscheidet, ob das so bleibt.
- Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- Browser-Prüfung: maschinell in Chromium geprüft (360 px ohne horizontales Scrollen,
  Fuß-Link und Knöpfe mindestens 48 px hoch, Fokus nach Klick, JSON-Import mit Typangabe).
  Die Druckmessung mit Auswahl (eine Seite je Karte, Pflichtmarkierung je Karte) steht nicht im
  Standardlauf; der Standardlauf druckt mit leerer Auswahl. Offen: Prüfung auf dem Gerät und in
  weiteren Browsern.
