# Musikspiele-Kartei U3 🎵

Kartei für Fachkräfte mit Kindern von 1 bis 3 Jahren. Sie gliedert die Musikspiele nach den
Gattungen, die die Praleska-Quelle selbst nennt (S. 81–86), und zeigt je Gattung das Prinzip,
die Seite und einige Titel als Beispiele.

## Was an der Quelle geprüft ist

Der Katalogeintrag (Nr. 78) hatte drei Angaben, die der Text so nicht trägt:

- **„ca. 50 Spielprinzipien“**: eine Summe gibt es nicht. Die Quelle nennt Titel in Listen, die
  mit „и др.“ enden. Je nach Zählregel kommen andere Zahlen heraus (Melodienamen, Liedtitel,
  Quellenangaben). Die App zeigt deshalb keine Summe.
- **Filter nach Dauer, Gruppengröße und Ort**: die Quelle macht diese Angaben bei den Spielen
  nicht. Die Kartei filtert nur nach Gattung. Das steht im Bildschirm.
- **„gemeinfreie deutsche Kinderlieder als Träger“**: nicht geprüft und nicht enthalten.

Belegt und mit Seite: dreizehn Gattungen (S. 81–86), darunter Singübungen, Lied mit Bewegung,
Lied-Inszenierung mit Tierfiguren, Singspiele, Reigen (S. 83), Rhythmus und Tanzschritte (S. 83–84),
freier Tanz (S. 84), Tierbewegungen (S. 85), Volksspiele (S. 86), Musikmärchen (S. 86) und
Musikinstrumente (S. 86). Die Titel stehen dort mit Seite; Texte und Noten stehen hier nicht.

## So funktioniert es

- Ein Knopf je Gattung zeigt die Karte. Ohne Auswahl sieht man alle dreizehn.
- Jede Karte nennt die Seite der Quelle und, wo die Quelle es sagt, das Alter (zum Beispiel die
  Melodie aus Frage und Antwort für das dritte Lebensjahr, S. 81).
- Die Titel sind russische oder belarussische Originaltitel. Autoren- und Notenangaben aus den
  Listen werden nicht übernommen; eine Prüfung weist sie ab.
- „Diese Karten drucken“ druckt nur die gewählte Auswahl.
- Die App speichert nichts und stellt keine Verbindung nach außen her.

## Grenzen – ehrlich

- Die Formulierung der Prinzipien ist eigen. Die Quelle beschreibt die Gattungen in
  Aufgaben und Beispielen, nicht als Spielanleitung zum Abschreiben.
- Die Titelbeispiele sind Auswahlen aus den Listen; die vollständigen Listen stehen in der
  Quelle.
- Die Lieder selbst sind nicht enthalten. Wer sie singen will, braucht die Quelle oder eine
  Liedersammlung.

## Prüfung

- `node --test apps/musikspiele-kartei-u3/test/*.mjs` – 12 Tests: dreizehn Gattungen mit Seite
  81–86, Titel mit Seite und ohne Autorenangabe, kein Feld für Dauer, Gruppengröße oder Ort,
  keine Summe im Text, Filter nach Gattung, und Gegenproben: ein Dauerfeld, ein Autor im Titel,
  eine Zählung im Prinzip, ein Beispiel ohne Seite und zu wenige Gattungen werden abgewiesen.
- Browser bei 360 px: dreizehn Karten am Anfang, Filter, Druck nur mit den Karten, Knöpfe mindestens
  44 px, kein Überlauf, keine externen Anfragen. Die einzige Konsolenmeldung ist das `favicon.ico`.

## Starten

`index.html` über einen statischen Server öffnen, zum Beispiel `node tools/serve.mjs`.
