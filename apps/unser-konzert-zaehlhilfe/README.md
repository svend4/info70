# Unser Konzert – Zählhilfe für die Fachkraft

Erwachsenen-Werkzeug für Fachkräfte in Kita-Gruppen (Katalogeintrag docs/10, №92).
Die Fachkraft sammelt Vorschläge für Lieder, Tänze und Festprogramme für ein
Kita-Fest und zählt je Vorschlag, wie viele Handzeichen gezeigt wurden. Die
Programmliste ordnet nach dieser Zählung und zeigt nur die Titel.

## Hinweis auf der Seite (Eigenentwurf)

> Ob Kinder mitentscheiden, entscheidet der Träger bzw. das Team. Das Werkzeug
> hilft nur nach einer Abstimmung in der Gruppe. Handzeichen sind für die Gruppe sichtbar, die
> Abstimmung ist also offen. Die Zählung ordnet keine Stimme einem Kind zu und hält keine Namen fest.

## Was die App ist

- Vorschläge anlegen: Titel (nur der Titel, höchstens 60 Zeichen, keine Namen),
  Art (Lied, Tanz oder Festprogramm), höchstens zwölf Vorschläge.
- Je Vorschlag mit „+“ und „−“ die Handzeichen zählen. Die Zählung geht nie unter null.
- Programmliste: die Titel, nach Zählung absteigend. Bei Gleichstand gilt die
  Reihenfolge der Eingabe. Auf der Liste stehen keine Zahlen.
- Ausgabe: Programmliste drucken, Programmliste als Textdatei herunterladen,
  leeren Zählbogen drucken, Zählung zurücksetzen (mit Rückfrage).
- Anregungen aus der Quelle, als Anregung gekennzeichnet und nicht als Vorgabe.

## Was die App nicht ist

- Keine Abstimmung der Kinder. Die App kennt kein Kind, keinen Namen und keine
  Stimme eines Kindes. Eine Zählung gehört zu einem Vorschlag, nie zu einem Kind.
- Keine Rangliste von Kindern, keine Bewertung, keine Gesamtzahl über alle
  Vorschläge, keine Prozentwerte.
- Kein Konto, keine Anmeldung, kein Chat, keine Werbung, kein Tracking.
- Kein Export mit Stimmen und kein Import.
- Keine Verbindung nach außen: keine Netzanfragen, keine Schriften, keine fremden Skripte.
- Kein Ersatz für die Entscheidung des Trägers oder des Teams darüber, ob und wie
  Kinder mitentscheiden.

## Was gespeichert wird

Nichts. Die Vorschläge und die Zählung liegen nur im Speicher dieser Seite.
Nach dem Neuladen ist alles weg. Die App greift nicht auf Browser-Speicher,
Cookies oder Datenbanken zu. Die einzige Datei ist die Textdatei mit der
Programmliste, die die Fachkraft selbst herunterlädt. Sie enthält nur Titel.

## Quellen (mit Seitenangabe)

- Praleska (Volltext), S. 262: Repertoire der Lieblingslieder von Gruppe und
  kleineren Gruppen aufbauen. Anregung, umformuliert, kein Zitat.
- Praleska, S. 265: besonders geliebte Tänze im Repertoire sammeln. Anregung.
- Praleska, S. 272: Feste wie Neujahr und der 8. März; Unterhaltungen etwa ein- bis
  zweimal im Monat, im Sommer wöchentlich. Anregung, umformuliert.
- docs/02, Z. 22–24: keine externen Netzwerkanfragen.
- docs/02, Z. 141–146: kein Kind wird bewertet, auch nicht in einer Rangfolge.
- docs/10, №92 („Unser Konzert – Mitbestimmen“): Ausgangspunkt. Die dort
  beschriebene Abstimmung der Kinder im Gerät und der Export mit Stimmen sind in
  dieser App bewusst nicht gebaut.

## Was Eigenentwurf ist

- Die drei Arten Lied, Tanz und Festprogramm.
- Der Hinweis oben auf der Seite (Wortlaut aus dem Auftrag).
- Die Grenzen: höchstens zwölf Vorschläge, höchstens 60 Zeichen je Titel.
- Der Zählbogen: zwölf leere Zeilen mit Linien, ohne Kästchen, ohne Zahlen und
  ohne Zeile für einen Namen.
- Die Meldungen im Formular, das Entfernen eines Vorschlags und die Sperre gegen
  doppelte Titel.
- Alle übrigen Texte der Seite, soweit sie nicht als Quelle gekennzeichnet sind.

## Druck

- „Programmliste drucken“ druckt nur die Programmliste mit den Titeln.
- „Zählbogen drucken“ druckt nur den leeren Bogen. `druck.css` blendet den
  Bildschirm aus und den jeweils anderen Bogen mit. Der Knopf setzt am Seitenkopf
  den Bogen, der gedruckt werden soll.

## Technik

- `index.html`: CSP `default-src 'self'; style-src 'self' 'unsafe-inline'`.
  Der Netzwerk-Wächter `installiereNetzwerkWaechter()` läuft beim Start.
- `logik.mjs`: reine Logik ohne DOM (Vorschläge, Titel, Art, Zählung,
  Sortierung, Textdatei, Zählbogen).
- `app.mjs`: Oberfläche. Eine Antwort ändert nur den Knopf und die Zählung eines
  Vorschlags, die Programmliste oder die Meldungen im Formular. Die Seite wird
  nicht neu aufgebaut.
- `druck.css`: die beiden Druckfassungen.

## Tests

32 Tests.

- `test/logik.test.mjs`: Vorschlagsliste, Titel, Art, Zählung nie negativ,
  Sortierung der Programmliste ohne Zahlen, Textdatei, Zählbogen, Wortlaut des Hinweises.
- `test/regeln.test.mjs`: Quelltext. Keine fremden Adressen, kein Zugriff auf den
  Browser-Speicher, nur ein Eingabefeld (für den Titel), keine Kästchen, Zahlen
  oder Zeile für einen Namen auf den Bögen, eigenes `druck.css`, keine Bewertung
  von Kindern, keine Modellnamen, keine verbotenen Begriffe.

Lauf:

```bash
node --test apps/unser-konzert-zaehlhilfe/test/*.test.mjs
```

## Lokal starten

```bash
npm run dev   # → http://localhost:8070/apps/unser-konzert-zaehlhilfe/
npm test
```
