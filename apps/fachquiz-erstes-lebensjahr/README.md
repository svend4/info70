# Fachquiz: Entwicklung im ersten Lebensjahr 🍼

Quiz für Auszubildende in Erzieherberufen, Kinderpflege und Tagespflege. **Lernwerkzeug
für Fachkräfte, kein Test für ein Kind.** Jede Antwort nennt die Seite der Quelle, und
wo die Quelle sich widerspricht, sagt die Erklärung das.

## Was an der Quelle geprüft ist

Der Katalogeintrag (Praleska, Kita-Abschnitt, Nr. 76) nannte **25 Meilensteine** und
**3 Kommunikationsformen** und sprach vom „Belebungskomplex“. Der Text trägt das so nicht:

- **22 Merkmale** in der Liste „Основные показатели развития детей (к концу первого года
  жизни)“, S. 42–43. Die Zahl 25 steht nicht im Text.
- **Der Komplex** heißt im Text «комплекс оживления». Er bildet sich etwa im dritten
  Monat und nimmt bis zum vierten stark zu (S. 28); die Genitivform steht auf S. 38.
  „Belebungskomplex“ ist eine Übertragung, kein belegter Fachbegriff.
- **Lisina** wird in der Einleitung zitiert (S. 5) – zum Übergang zwischen Tätigkeiten.
  Mit dem Komplex verbindet die Quelle sie nicht.
- **Kommunikation:** Der Text beschreibt mehrere Formen – die emotional-persönliche (S. 37),
  die situativ-geschäftliche (S. 28) und die Übergangsform personal-geschäftlich (S. 37–38) –
  zählt sie aber nicht ausdrücklich als drei.
- **Greifen:** Die Aufgabe für Kinder unter drei Monaten zielt auf das Greifen (S. 34);
  die Beschreibung nennt den fünften Monat (S. 39). Das Quiz zeigt den Widerspruch.

## Was nicht drin ist – und warum

- **Die Zahl „(4—20)“** bei den ersten Wörtern (S. 29) steht im Text in Klammern. Ob das
  eine Anzahl ist, geht daraus nicht sicher hervor. Das Quiz fragt danach nicht.
- **Die Untersuchungsfenster des Gelben Heftes** (U3–U5) gehören nicht zur Praleska-
  Quelle und sind hier nicht geprüft. Sie fehlen deshalb.
- **Keine Einschätzung eines Kindes.** Das Quiz fragt nach Quellenwissen, nicht danach,
  ob ein Kind etwas kann.

## So funktioniert es

Vorrat: 13 Fragen (10 Wahl-, 3 ja/nein-Aussagen). Eine Runde: 10 zufällige Fragen,
am Ende steht ein neutrales „Ende der Runde“. Die App kennt keine Punkte, keinen Rekord
und keine Ränge und speichert nichts; einen Löschknopf braucht sie deshalb nicht. Der
Ablauf kommt aus `quiz-kern`. Der Eltern-Link ist aus, weil es keine `eltern.html` gibt.

## Prüfung

- `node --test apps/fachquiz-erstes-lebensjahr/test/*.mjs` – 8 Tests: Schema gültig,
  jede Erklärung mit Seite im Kapitel (S. 26–43) oder Einleitung (S. 5), Widersprüche
  benannt, die Zahlen 25 und „(4—20)“ nicht als Fakt, beide ja/nein-Arten vorhanden,
  keine Ränge in den Daten, kein Speicher im App-Code.
- Browser bei 360 px: volle Runde gespielt, Ende der Runde ohne Wertung, kein Überlauf,
  Antwort-Knöpfe 55 px, keine externen Anfragen. Die einzige Konsolenmeldung ist das
  fehlende `favicon.ico`.

## Starten

`index.html` über einen statischen Server öffnen, zum Beispiel `node tools/serve.mjs`.
