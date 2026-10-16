# Natur-Fürsorge-Karten 🌱

Karten zum Drucken für Fachkräfte mit Kindern von 1 bis 3 Jahren: Pflege von Zimmerpflanzen,
Pflanzen auf dem Beet und Tieren der Naturecke. Die Quelle (Praleska, S. 96) nennt vier Aufgaben
für die Fachkraft und drei Handlungen als Beispiele. Die Anregungen auf den Karten sind eigen.

## Was an der Quelle geprüft ist

Der Katalogeintrag (Nr. 80) hatte vier Angaben, die der Text so nicht trägt:

- **„Kinder 2–3“**: Der Text sagt 1 bis 3 Jahre (S. 6, S. 44). Eine Altersnorm für die Handlungen
  gibt er nicht.
- **Mini-Protokoll „welches Kind welche Handlung selbstständig zeigt“**: Die Quelle sieht in diesem
  Abschnitt keine Dokumentation von Kindern vor. Ein solches Protokoll wäre eine Notiz über einzelne
  Kinder; es wird hier nicht gebaut.
- **Bezug zu BNE und zu den Länderplänen**: Der Text enthält beides nicht. Das Programm ist das
  belarussische Programm (S. 3); es hat keine Länder.
- **„Vier Ziele“**: gilt für „Труд в природе“ (S. 96). Das Kapitel „Приобщаемся к труду“ hat auf
  S. 94 sechs allgemeine Aufgaben.

Belegt und mit Seite: die vier Aufgaben (S. 96), die Handlungen gießen („полить комнатные растения,
растения на грядках“), Vögel und Fische füttern („покормить птичек, рыбок“) und Gemüse ernten
(„собрать овощи“, nur Gemüse), alle auf S. 96. Die Jahreszeiten-Bezüge stehen auf S. 51, S. 63 und S. 98.

## So funktioniert es

- Die vier Aufgaben stehen oben, mit russischem Wortlaut und Seite.
- Drei Handlungskarten: der Textbeispiel-Satz und eine Anregung (Eigenentwurf).
- Eine Checkliste für Erwachsene zum richtigen Zeitpunkt (Aufgabe 4), ausdrücklich als Eigenentwurf.
- „Diese Karten drucken“ druckt Karten und Checkliste.
- Keine Eingabe, kein Name, keine Speicherung.

## Grenzen – ehrlich

- Die Anregungen sind Vorschläge, keine Vorgabe der Quelle.
- Ob „Vögel“ Wild- oder Zimmervögel meint, sagt der Text nicht; die Karte nennt den Textwortlaut.
- Die Quelle ist eine russische Ausgabe; die deutsche Übertragung ist eigen.

## Prüfung

- `node --test apps/natur-fuersorge-karten/test/*.mjs` – 18 Tests: vier Aufgaben auf S. 96,
  Handlungen als Textbeispiele, Karten als Eigenentwurf, kein Feld nach Kind (Protokoll, Name,
  Notiz u. a.), Altersangabe 1 bis 3, Filter, Gegenproben.
- Alle russischen Zitate sind maschinell auf S. 96 nachgewiesen. Dieser Nachweis ist kein Test: Die Tests prüfen die Form, nicht den Wortlaut gegen die Quelle.
- Browser bei 360 px: vier Karten am Anfang, Filter, Druck nur mit Karten, Knöpfe mindestens 44 px,
  kein Überlauf, keine externen Anfragen. Die einzige Konsolenmeldung ist das `favicon.ico`.

## Starten

`index.html` über einen statischen Server öffnen, zum Beispiel `node tools/serve.mjs`.
