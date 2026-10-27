# Unser Konzert – Zählhilfe für die Fachkraft: Kurz-GDD

## Kernentscheidungen

1. **Erwachsenen-Werkzeug.** Die Fachkraft bedient die App. Kein Kind benutzt sie
   und kein Kind kommt in ihr vor.
2. **Gezählt wird je Vorschlag, nie je Kind.** Eine Gesamtzahl über alle
   Vorschläge gibt es nicht, auch keine Prozentwerte.
3. **Programmliste ohne Zahlen.** Die Titel stehen nach Zählung absteigend, bei
   Gleichstand in der Reihenfolge der Eingabe. Das gilt auf dem Bildschirm, im
   Druck und in der Textdatei.
4. **Nichts wird gespeichert.** Der Zustand liegt im Speicher der Seite. Neuladen
   löscht ihn. Die Textdatei ist ein Download, den die Fachkraft auslöst.
5. **Keine Verbindung nach außen.** CSP `default-src 'self'` und der
   Netzwerk-Wächter (docs/02, Z. 22–24).
6. **Zählbogen ohne Kästchen, Zahlen und Zeile für einen Namen** (docs/02, Druckregel).
7. **Keine Abstimmung im Gerät und kein Export mit Stimmen.** Der Katalogeintrag
   docs/10, №92 wird in dieser Form nicht gebaut.

## Ziele (prüfbar)

1. Die Fachkraft kann nach dem Eintragen von drei Vorschlägen mit Handzeichen
   benennen, welcher Vorschlag vorn steht, ohne dass auf der Liste eine Zahl steht.
2. Die Fachkraft kann erklären, warum auf der Programmliste keine Zahlen stehen
   und warum nichts gespeichert wird.
3. Die Fachkraft kann einen leeren Zählbogen ausdrucken und von Hand mit Strichen
   je Vorschlag füllen. Auf dem Bogen stehen keine Kästchen und keine Zahlen.

## Inhalt

- **Eingabe:** Titel (nötig, höchstens 60 Zeichen, keine doppelten Titel), Art
  (Lied, Tanz, Festprogramm), höchstens 12 Vorschläge.
- **Zählung:** „+“ und „−“ je Vorschlag. Die Zählung bleibt bei null, sie wird
  nie negativ.
- **Ausgabe:** Programmliste (Bildschirm, Druck, Textdatei), Zählbogen (Druck),
  Zählung zurücksetzen mit Rückfrage.
- **Entfernen** eines einzelnen Vorschlags (eigene Entscheidung, siehe Offen).
- **Anregungen** aus Praleska S. 262, 265 und 272, als Anregung gekennzeichnet.

## Ablauf (Wie)

Titel eintragen, Art wählen, hinzufügen. Pro Handzeichen auf „+“ tippen, mit „−“
korrigieren. Die Programmliste zeigt die Titel in Reihenfolge. Danach drucken,
herunterladen oder die Seite schließen. Nichts bleibt zurück.

## Politik (docs/02)

- [x] Keine Namen und keine Kinderdaten. Das einzige Feld ist der Titel, mit dem Hinweis „Keine Namen“.
- [x] Keine Bewertung von Kindern (docs/02, Z. 141–146): keine Stufen, Punkte, Prozente, keine Rangfolge von Kindern.
- [x] Keine externen Netzwerkanfragen (docs/02, Z. 22–24): CSP und Netzwerk-Wächter, geprüft in `test/regeln.test.mjs`.
- [x] Nichts gespeichert: kein Zugriff auf Browser-Speicher, Cookies oder Datenbanken; geprüft am Quelltext.
- [x] Druck: eigenes `druck.css` mit `@media print`, Zählbogen ohne Kästchen, Zahlen und Zeile für einen Namen.
- [x] Keine Werbung, kein Konto, kein Tracking.
- [x] Keine Modellnamen in den Dateien dieser App.
- [x] Impressum verlinkt (relativ).
- [ ] Wirkung mit drei bis fünf Fachkräften geprüft: offen.

## Offen (für den Nutzer)

1. **Hinweis geändert (Gegenprüfung Welle 89).** Der Hinweis sagt jetzt: Handzeichen sind für die
   Gruppe sichtbar, die Abstimmung ist also offen. Ein verdecktes Verfahren bildet das Werkzeug nicht ab;
   die Fachkraft entscheidet, ob sie ein anderes Verfahren wählt.
2. **Zwei eigene Entscheidungen.** Das Entfernen eines Vorschlags und die Sperre
   gegen doppelte Titel stehen nicht im Auftrag. Bitte bestätigen oder streichen.
3. **Eigenentwurf prüfen.** Die Arten (besonders „Festprogramm“) und die
   Beschriftungen stammen von mir. Mit drei bis fünf Fachkräften prüfen.
4. **Anregungen.** Die drei Anregungen sind umformuliert. Der Wortlaut sollte gegen
   die Quelle gelesen werden.
5. **Druck ohne Knopf.** Wer den Browser-Druck direkt auslöst, druckt beide Bögen.
   Entscheiden, ob ein Standardbogen gewählt werden soll.
6. **Katalogeintrag docs/10, №92.** Die Statuszeile und der Eintrag dort müssen
   nachgezogen werden. Das liegt außerhalb dieser App.
7. **Textdatei.** Der Auftrag verbietet das Speichern. Die Textdatei ist ein
   Download, den die Fachkraft auslöst. Bitte bestätigen.

## Tests

32 Tests. Zählung nach `^test(` über `test/logik.test.mjs` und `test/regeln.test.mjs`.
Lauf: `node --test apps/unser-konzert-zaehlhilfe/test/*.test.mjs`.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
