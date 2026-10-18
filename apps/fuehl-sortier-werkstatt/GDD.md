# Fühl- und Sortier-Werkstatt: Holz, Papier, Stoff: Kurz-GDD

## 1. Warum
Fachkräfte und Eltern arbeiten mit Kindern an Alltagsmaterialien: fühlen,
sortieren, zuordnen. Altersangabe 2 bis 3 Jahre aus dem Katalog; die Quelle nennt für Малыши 1 bis 3
(S. 6, siehe A20). Die Praleska beschreibt auf S. 52 und 53 Ziele für Dinge aus Holz, Papier
und Stoff. Die Kartei macht sie als Druckkarten nutzbar: filtern, wählen, drucken.

## 2. Wer und Kernerlebnis
Wer: Fachkräfte und Eltern. Das Kind nutzt das Werkzeug nicht; die Fachkraft leitet an.
Kernerlebnis: Die Erwachsene wählt ein Material oder einen Sortierauftrag, sieht die Karte mit
ihrer Quellenzeile und Seite und druckt die gewählten Karten.

## 3. Entscheidungen
- Acht Karten: drei Materialkarten (Holz, Papier, Stoff), vier Sortieraufträge (Farbe, Form,
  Material, weich / hart) und eine Sicherheitskarte.
- Jede Karte trägt die Quellenzeile „Quelle: Praleska, S. 52“, bei einem Ziel auf S. 53 entsprechend
  „S. 53“, das Lernziel mit Seite, die Übertragung als Eigenentwurf und die Pflichtmarkierung.
- Materialkarten: zwei bis drei Gegenstände aus dem Alltag und eine Frage an das Kind (Eigenentwurf).
- Sortieraufträge: Aufgabe und Frage (Eigenentwurf). Die Ziele stehen auf S. 52 (Farbe, Material)
  und S. 53 (Form). Der Sortierauftrag nach weich / hart ist Eigenentwurf; S. 52 nennt dazu nur das
  Beispiel „шубка — из меха, она мягкая“. Die Sortieraufträge nutzen Dinge aus allen drei Materialien.
- Sicherheitskarte: Ziel S. 53 ohne Sternchen; eigener Hinweis „Kleinteile außer Reichweite lassen
  (Eigenentwurf, Fachkraft prüft).“
- Filter nach Material oder Sortierauftrag, UND-verknüpft. Die Sicherheitskarte erscheint nur bei „Alle“.
- Druck: nur die gewählten Karten, je Karte ein Blatt A4 hoch. Keine Zeichen, Kästchen, Punkte,
  Sterne oder Emojis; keine Namenszeile, kein Tages- oder Wochentagsfeld (docs/02 Z. 79–82).
- Keine Eingabefelder und keine Speicherung (Projektregel, ohne docs/02-Zeile).
- Keine Bewertung von Kindern, keine Einstufung, keine Rangliste (docs/02 Z. 141–146).
- Keine Anfragen nach außen (docs/02 Z. 22–24): Content-Security-Policy, Netzwerk-Wächter,
  Daten per JSON-Import.
- Ohne Verbindung nach draußen. Ein Neuladen ohne Netz ist nicht zugesichert: die App hat keinen Service Worker (F4 in docs/fragen-und-hinweise.md).
- Der Titel weicht vom Katalog nur in der Umschrift ab: „Fühl-“ statt „Fuehl-“.

## 4. Lernziele (prüfbar)
1. Die Erwachsene findet über Material oder Sortierauftrag die passende Karte; jede Karte nennt ihre Seite.
2. Die Erwachsene druckt nur die gewählten Karten, je Karte ein Blatt.
3. Auf keiner Karte und in keinem Druck steht ein Kind; es gibt kein Feld dafür.

## 5. Inhalt
Materialien: Holz („дерево“), Papier („бумага“), Stoff („ткань“), alle auf S. 52.
Sortieraufträge: Farbe (S. 52, „имеющих одинаковый и разный цвет“), Form (S. 53, „по форме, цвету,
величине, назначению“), Material (S. 52), weich / hart (Eigenentwurf; S. 52 nennt als Beispiel „шубка — из меха, она мягкая“).
Sicherheit (S. 53, „быть осторожными с острыми, холодными, горячими предметами“).
Die Gegenstände, Fragen, Aufgaben und der Sicherheitshinweis sind Eigenentwurf; die Quelle nennt sie nicht.

## 6. Politik (docs/02)
- Keine Anfragen nach außen (docs/02 Z. 22–24).
- Druckblatt nach docs/02 Z. 79–82: keine Zeichen, keine Namenszeile.
- Keine Bewertung von Kindern (docs/02 Z. 141–146).
- Projektregeln ohne docs/02-Zeile: keine Speicherung; kein Bildschirm für Kinder, das Werkzeug
  ist für Erwachsene.

## 7. Aufwand
S. Die Karten sind statisch. Der Filter lebt nur in der geöffneten Seite.

## 8. Tests
Die 43 Tests stehen in zwei Dateien. `test/logik.test.mjs` prüft Daten, Zitate gegen die festgehaltene
Zitat-Tabelle, Sternchen-Ziele, Filter, Auswahl und Druck. `test/regeln.test.mjs` prüft die Projektregeln. Details in der README.

## Offen
- Altersangabe: Der Katalog nennt 2 bis 3 Jahre. Die Quelle nennt für die Gruppe „Малыши“ den Bereich
  „от одного года до трех лет“ (S. 6). Eine Fachkraft entscheidet, ob 2 bis 3 bleibt (A20 in `docs/fragen-und-hinweise.md`).
- Gegenstände (Eigenentwurf): Fachprüfung, ob die Dinge für diese Altersgruppe passen und ob darunter
  Kleinteile sind.
- Sicherheitshinweis „Kleinteile außer Reichweite lassen (Eigenentwurf, Fachkraft prüft).“: fachliche Prüfung steht aus.
- „hart“ als Gegenbegriff und „glatt oder rau“ in der Frage zu Holz und Stoff sind Eigenentwurf;
  eine Fachkraft liest sie gegen. Der Sortierauftrag nach weich / hart ist Eigenentwurf.
- warm / kalt aus dem Katalogeintrag ist nicht als Sortierauftrag gebaut. Die Quelle nennt auf S. 52
  und 53 keine Sortierung nach Temperatur. Offen, ob es dazukommt.
- uk und ru: nicht vorhanden, offen. Die dreisprachige Wortliste aus dem Katalog ist nicht gebaut.
- BNE-Bezug (Materialien wiederverwenden) aus dem Katalog ist nicht gebaut.
- Seitenangaben: docs/02 Z. 151–152 verlangt die Markierung „проверено человеком“ für Seitenangaben. Das Blatt trägt
  „noch nicht von einem Menschen geprüft“. Entscheidung A18 in `docs/fragen-und-hinweise.md` (offen).
- Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- Die Zitatprüfung gegen den Quelltext lief außerhalb des Repos (F3); im Repo steht die festgehaltene Zitat-Tabelle.
- Browser-Prüfung, Druckprobe und Prüfung auf dem Gerät stehen aus.
- Erprobung mit der Zielgruppe (docs/02, Abschnitt 4, „Kinder aktiv einbeziehen“) steht vor einem Release aus.
- Vorlesefunktion: docs/02 Z. 44 und 77 verlangen sie („есть озвучивание“). Die Zielgruppe der App sind
  Fachkräfte und Eltern. Vorlesen ist nicht gebaut. Der Geltungsbereich der Checkliste für diese Art
  Werkzeug ist offen (F2 in `docs/fragen-und-hinweise.md`).
- Favicon: die Seite liefert 404, wie in allen Apps (A3).
- Registrierung im Hub, im Root-README und im Impressum macht der Auftraggeber. Nicht Teil dieser Arbeit.
