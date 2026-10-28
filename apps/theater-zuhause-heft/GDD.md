# Theater zuhause – Bastel- und Spielheft: Kurz-GDD

## 1. Warum
Erwachsene, die mit einem Kind von einem bis zu drei Jahren spielen, suchen einfache Spielformen
für zu Hause, die ohne Bildschirm auskommen. Die Quelle (Praleska, S. 73) regt Eltern an,
erste häusliche Formen des Theaters zu schaffen. Das Heft macht daraus drei Formen zum Basteln
und fünf kurze Szenen zum Spielen, zum Ausdrucken.

## 2. Wer und Kernerlebnis
Wer: Erwachsene. Das Kind nutzt das Heft nicht; es schaut zu und reagiert.
Kernerlebnis: Die Erwachsene wählt eine Form, bastelt sie nach den Schritten, spielt eine passende
Szene und druckt das ganze Heft als Blätter.

## 3. Entscheidungen
- Drei Formen aus S. 73: Fingertheater („пальчикового“), Tischtheater („настольного“), Handpuppe
  („театра Петрушки“, deutsch Kasper). Die Namen sind Eigenentwurf; die Quelle nennt die Formen,
  nicht ihren Bau.
- Jede Form-Seite trägt die Quellenzeile „Praleska, S. 73“ und den Vermerk „Bastelschritte:
  Eigenentwurf“.
- Der Umschlag belegt die Zielgruppe mit S. 6 (Gruppe „Малыши“, von einem bis zu drei Jahren),
  die Anregung mit S. 73 und die Freizeitspiele mit Puppentheater-Figuren mit S. 72.
- Der Hinweis „kein Bildschirm nötig“ steht als Eigenentwurf, nicht als Quellenaussage.
- Fünf Szenen: eigene Texte, je fünf Sätze, Rollen benannt, offenes Ende. Keine fremden Märchen
  und keine fremden Verse.
- Der Filter wählt nur die Anzeige auf dem Bildschirm. Der Druck enthält immer das ganze Heft in
  fester Reihenfolge, je Seite ein Blatt A4 hoch.
- Keine Eingabefelder und keine Speicherung (Projektregel, ohne docs/02-Zeile).
- Keine Bewertung von Kindern, keine Einstufung, keine Entwicklungsangaben (docs/02 Z. 141–146).
- Keine Anfragen nach außen (docs/02 Z. 22–24): Content-Security-Policy, Netzwerk-Wächter,
  Daten per JSON-Import.

## 4. Ziele (prüfbar)
1. Die Erwachsene findet über den Filter die Form oder die Szene, die sie sucht.
2. Der Druck liefert das ganze Heft in derselben Reihenfolge, jede Seite auf einem eigenen Blatt.
3. Kein Feld und kein Text fragt nach einem Kind oder erfasst es; jede Seite trägt die Pflichtmarkierung.

## 5. Inhalt
Umschlag, drei Formen, fünf Spielszenen (Daten in `daten/heft.json`). Die Szenen spielen mit
Igel, Schnecke, Hase, Maus, Kasper, Ente, Mond, Lampe, Vogel und Bär.

## 6. Politik (docs/02)
- Keine Anfragen nach außen (docs/02 Z. 22–24). Ohne Verbindung nach draußen.
  Ein Neuladen ohne Netz ist nicht zugesichert: die App hat keinen Service Worker (F4 in docs/fragen-und-hinweise.md).
- Druckblatt nach docs/02 Z. 79–82: keine Zeichen, keine Namenszeile, keine Punkte.
- Keine Bewertung von Kindern (docs/02 Z. 141–146).
- Projektregeln ohne docs/02-Zeile: keine Speicherung; das Werkzeug ist für Erwachsene.

## 7. Aufwand
S bis M. Die Inhalte sind statisch. Der Filter lebt nur in der geöffneten Seite.

## 8. Tests
59 Tests in zwei Dateien. `test/logik.test.mjs` prüft Aufbau, Quellenhinweis, Zitate, Satzzahl, Filter, Druckprüfung (`pruefeMarkierung`, `druckeHeft`),
Druckreihenfolge und die Ziffern im Druck. `test/regeln.test.mjs` prüft die Projektregeln. Details in der README.

## Offen
- Fachprüfung der Bastelschritte und Materialien (Eigenentwurf). Insbesondere Sicherheit bei
  Stoffteilen, Knöpfen und Kleber; der Sicherheitssatz ist Eigenentwurf ohne Norm.
- Fachprüfung der fünf Szenen (Eigenentwurf): Sprache, Länge, Eignung für die Altersgruppe.
- Die Altersgruppe „von einem bis zu drei Jahren“ stammt aus S. 6; ob die Gruppe der Quelle hier
  die richtige Zielgruppe ist, prüft eine Fachkraft.
- Der Katalogeintrag (docs/10) nennt „gemeinfreie Maerchenmustern“ und „bebilderte Anleitung“.
  Gebaut ist ohne Märchenmuster (Auftrag) und ohne Bilder; die Entscheidung über Bilder ist offen.
- Druckprüfung: `pruefeMarkierung` und `druckeHeft` sind getestet; der Druckknopf ruft noch
  `window.print()` direkt auf. Der Anschluss ist offen.
- Die Übertragung von „театра Петрушки“ als Kasper ist Eigenentwurf (docs/10 nennt sie als deutsches Äquivalent).
- uk und ru: nicht vorhanden, offen.
- Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- Seitenangaben, Markierung „проверено человеком“: docs/02 Z. 151–152 verlangt sie für Seitenangaben;
  Entscheidung A18 in docs/fragen-und-hinweise.md ist offen. Die Pflichtmarkierung oben nennt nur die
  maschinelle Prüfung.
- Zitatprüfung: Die Gegenprüfung der Zitate lief außerhalb des Repos (F3). Im Repo stehen die
  festgehaltenen Zitate (`test/logik.test.mjs`).
- Automatische Browser-Messung (Darstellung bei 360 px, Druckinhalt, Speicher, Netz) ist grün. Offen: Druck auf A4 auf einem Drucker und Prüfung auf dem Gerät.
- Vorlesefunktion: docs/02 verlangt sie (Z. 44 und 77, Checkliste „есть озвучивание“). Nicht gebaut;
  der Geltungsbereich für dieses Werkzeug ist offen (docs/fragen-und-hinweise.md, F2).
- Favicon: Die App hat keines. favicon.ico gibt 404, wie in allen Apps (A3 in docs/fragen-und-hinweise.md, offen).
- Registrierung durch den Auftraggeber (Hub, Root-README, Impressum): erledigt. Die beiden Repo-Tests
  `packages/kinderschutz/test/datenschutz-zusage.test.mjs` und `packages/kinderschutz/test/testzahlen.test.mjs`
  laufen grün.
