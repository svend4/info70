# Kita-Mitmach-Börse 🎨

Familien und Team sehen **dieselben Angebote** aus dem Familienkapitel der Quelle und
markieren sie: je Angebot zwei Häkchen – „interessiert“ und „kann mithelfen“. Das
Team zählt die Dateien zusammen. **Keine Namen, kein Freitext, keine Anmeldung.**

## Was an der Quelle geprüft ist

Der Katalogeintrag (Praleska, Kita-Abschnitt, Nr. 75) nannte **20 Formate**, eine
„Näh-Werkstatt“ und einen „Großeltern-Klub“. Die Quelle (S. 24–25) trägt das nicht:

- **13 Formen der Zusammenarbeit** auf S. 24, im Fließtext, nicht als Liste.
- **6 Clubs und Gruppen** auf S. 25, die Liste ist offen („und др.“).
- Die Zahl 20 ist aus dem Text nicht ableitbar und wird hier nirgends verwendet.
- „Näh-Werkstatt“ und „Großeltern-Klub“ stehen nicht im Text. Das Nähen kommt nur
  als Vorbereitung der Kostüme für die Märcheninszenierungen vor. Der Club der
  Großmütter („Клуб бабушек“) ist der Text-Eintrag.

Die Liste in `daten/angebote.json` ist die des Textes, mit russischem Wortlaut und
Seitenangabe je Eintrag. Die deutschen Namen sind Eigenübersetzung.

## So funktioniert es

**Familie:** Häkchen setzen. Die Auswahl merkt sich das Gerät, mit einem Zufallscode.
„Datei speichern“ erzeugt `kita-mitmach-boerse-stimme.json`. Die Datei enthält nur
Code, Art, Version und die Häkchen – jedes Angebot ist aufgeführt, auch die ohne
Häkchen. Sie geht auf dem Weg an das Team, den die Einrichtung ohnehin nutzt. Die App
sendet nichts.

**Team:** mehrere Dateien auswählen. Die App prüft jede Datei und weist ab, was nicht
passt: unbekannte Felder (etwa ein Namensfeld), falsche Art oder Version, unbekannte
Angebote, Werte ohne ja/nein. Gezählt werden die Häkchen je Angebot und die Zahl der
Familien. Dateien mit demselben Code zählen einmal; die zuletzt geladene gilt.
Geladene Dateien bleiben nur im Speicher der offenen Seite.

**Löschen:** Die Familien-Ansicht hat die übliche „Meine Daten löschen“-Karte. Sie
entfernt genau den gespeicherten Eintrag und den Code.

## Grenzen – ehrlich

- Im **Code-Feld** sind Buchstaben erlaubt. Eine von Hand gebaute Datei kann dort einen
  Namen tragen; die Prüfung erkennt das nicht, weil sie nicht prüfen kann, ob ein Code
  zufällig entstanden ist. Die App selbst erzeugt nur Zufallscodes.
- Wer „Meine Daten löschen“ drückt und neu ausfüllt, erscheint als **neue Familie**.
- Ist der Speicher des Geräts gesperrt, gilt die Stimme nur bis zum Schließen der Seite.
  Die Datei ist dann die einzige Kopie – die App sagt das im Bildschirm.
- Eine Familie, die auf **zwei Geräten** ausfüllt, zählt zweimal. Die App kann das
  nicht erkennen.
- Eine Datei lässt sich **von Hand bauen**. Die Zählung ist deshalb eine Stimmung,
  keine Erhebung.
- Bei **sehr wenigen Familien** lassen sich Summen auf einzelne Familien
  zurückführen. Das Team entscheidet, ob es die Summen zeigt.
- Ob eine solche Abstimmung unter Art. 14 BayKiBiG oder § 6 KitaG Brandenburg fällt,
  ist Auslegung des Landesrechts. Was im Text nicht steht, ist keine Pflicht.

## Prüfung

- `node --test apps/kita-mitmach-boerse/test/*.mjs` – 13 Tests: 13 Formate und 6 Clubs,
  Seitenangaben, „Näh-Werkstatt“ nicht als Angebot, Code ohne verwechselbare Zeichen,
  Datei mit Namensfeld abgewiesen, falsche Version abgewiesen, dieselbe Familie einmal
  gezählt, ein Angebot doppelt in einer Datei abgewiesen, Summen ohne Codes und Namen.
- Browser bei 360 px: 38 Häkchen, jedes Feld mindestens 44 px, Export mit exakt den
  vier Feldern, Import der eigenen Datei zählt 1, eine fremde Datei mit Namensfeld
  wird abgewiesen, Löschen leert den Speicher, keine externen Anfragen.
- Die einzige Konsolenmeldung ist die fehlende `/favicon.ico` (404). Keine App im
  Repository deklariert ein Icon; das ist eine Sache des Servers, nicht dieser App.

## Starten

`index.html` über einen statischen Server öffnen, zum Beispiel `node tools/serve.mjs`.
Ohne Build, ohne Abhängigkeiten, offline.
