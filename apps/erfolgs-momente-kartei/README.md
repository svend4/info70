# Erfolgs-Momente-Kartei

Druckkarten für Fachkräfte. Jede Karte beschreibt eine gemeinsame Tätigkeit der ganzen Gruppe, etwa Morgenkreis, Tisch decken, Garderobe, gemeinsames Aufräumen, Spaziergang, Singen im Kreis, Bewegungsspiel im Kreis und gemeinsames Essen. Jede Karte hat eine offene Rolle, die alle Kinder übernehmen können, und zwei bis drei Impulsfragen an die Fachkraft zu Raum, Material, Zeit und Gruppengröße.

Grundlage ist der Katalogeintrag „Erfolgs-Momente-Kartei“ in docs/10 (Praleska, Katalog-Konstruktor №2). Der Titel im Katalog bleibt erhalten.

## Was im Set ist

- **8 Tätigkeitskarten.** Jede trägt „Konkrete Tätigkeit: Eigenentwurf“ und eine Zeile „Grundgedanke“ mit Seitenangabe (S. 15 oder S. 16). Die Quelle nennt keine dieser Tätigkeiten. Jede Impulsfrage trägt ihre Seite und eine Bedingung.
- **1 Quellenkarte** mit drei Belegen aus der Quelle: S. 15 (Erfolg in gemeinsamer, für Kinder bedeutsamer Tätigkeit), S. 16 (Anerkennung durch Gleichaltrige als Haltung der Gruppe) und S. 15 (psychische Gesundheit der Gruppe als Aufgabe der Fachkraft). Die deutschen Sätze sind Übertragung und Eigenentwurf, die russischen Zitate sind kurz.
- **Auswahl am Bildschirm.** Karten wählen, dann „Ausgewählte Karten drucken“. Häkchen gibt es nur am Bildschirm. Gedruckt wird nur die Vorschau mit den gewählten Karten, ohne Symbole, ohne Namenszeile und ohne Datumsfelder.

## Was belegt ist

- Die drei Belege stehen auf den Seiten 15 und 16 der Quelle. Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- Die Zitate sind kurz und russisch; alle übrigen Wörter sind deutsch.

## Was nicht gebaut wurde

- Kein Bezug zu den Bildungsplänen der Länder (nicht belegt) und kein Resilienz-Bezug (die Quelle nennt keinen).
- Die Gruppierung der Quelle nach Merkmalen von Kindern wird nicht übernommen (docs/02 Z. 141–146, keine Bewertung von Kindern).
- Der Katalogeintrag docs/10 Nr. 2 führt als Beschreibung „unsichere Kinder mit niedrigem Selbstwert“. Die App übernimmt diese Gruppierung NICHT.
- Kein Elternteil, keine Speicherung, keine Anmeldung, keine Eingabefelder und kein Textexport.

## Politik (docs/02)

Keine Anfragen nach außen (docs/02 Z. 22–24): die Seite läuft mit der Content-Security-Policy des Projekts und dem Netzwerk-Wächter. Nichts wird gespeichert. Die Karten fragen nach der Lage, nicht nach einzelnen Kindern, und ordnen kein Kind ein (docs/02 Z. 141–146). Auf dem Papier stehen keine Häkchen, Kästchen, Punkte, Sterne, Emojis, keine Namenszeile und keine Tages- oder Wochentagsfelder (docs/02 Z. 79–82). Unter 3 Jahren keine Bildschirme für Kinder (Projektregel, ohne docs/02-Zeile).

## Starten und testen

Die Seite ist eine statische Vanilla-ES-Module-Seite ohne Abhängigkeiten. Sie öffnet sich über einen lokalen Webserver im Projektwurzelordner unter `apps/erfolgs-momente-kartei/`.

```bash
node --test apps/erfolgs-momente-kartei/test/*.test.mjs
```

Die Suite führt 23 Tests aus. `test/logik.test.mjs` prüft Daten und Logik, `test/regeln.test.mjs` prüft die Regeln aus docs/02 und die Projektregeln.
