# GDD – Natur-Fürsorge-Karten

## Was es ist

Karten zum Drucken für Fachkräfte der Gruppe „Малыши“ (Kinder von 1 bis 3 Jahren). Die Karten
zeigen die Pflegehandlungen aus dem Text (gießen, Vögel und Fische füttern, Gemüse ernten) und
eine Checkliste für Erwachsene. Es gibt keinen Kinderbildschirm.

## Die tragende Entscheidung 1: vier Aufgaben für die Fachkraft

Die Quelle formuliert die vier Punkte auf S. 96 als „Задачи“, Aufgaben des Erziehers. Die App
übernimmt diese Formulierung und sagt, dass es keine Fähigkeiten der Kinder sind.

## Die tragende Entscheidung 2: kein Protokoll über einzelne Kinder

Der Katalog wollte ein Mini-Protokoll, welches Kind welche Handlung selbstständig zeigt. Die Quelle
sieht dafür in diesem Abschnitt keine Dokumentation vor, und Notizen über einzelne Kinder gehören
nicht ins Gerät. Die Prüfung lehnt Felder ab, die nach einem Kind aussehen (Name, Protokoll,
Verlauf, Beobachtung, Notizen, Geburtsdatum und Varianten), und Texte mit Mustern wie „Name:“.
Sie liest keinen Fließtext auf Namen; ob die Texte inhaltlich geprüft sind, sagt die Prüfung nicht.

## Die tragende Entscheidung 3: Handlungen aus dem Text, Anregungen als Eigenentwurf

Gießen, Füttern und Ernten nennt der Text als Beispiele. Jede Anregung auf einer Karte ist als
Eigenentwurf markiert. Eine Altersnorm für die Handlungen gibt die Quelle nicht.

## Was als Quelle gilt und was als Eigenentwurf

| Teil | Status |
|---|---|
| Vier Aufgaben | Quelle, S. 96 |
| Handlungen als Beispiele | Quelle, S. 96 |
| Anregungen auf den Karten | Eigenentwurf |
| Checkliste für Erwachsene | Eigenentwurf, Bezug S. 96 |
| Altersangabe 1 bis 3 | Quelle, S. 6 und S. 44 |
| BNE, Länderpläne, Protokoll | nicht im Text, daher nicht gebaut |

## Prüfung

- 45 Tests in `test/logik.test.mjs` und `test/regeln.test.mjs`: Aufgaben und Seiten, Begriffe bis
  sechs Wörter, Handlungen als Textbeispiele, Eigenentwurf je Karte, Abweisung von Feldern nach Kind,
  Altersangabe, Filter, Druckregeln, Speicher- und Netzregeln, Knopfhöhe und Gegenproben.
- Die russischen Begriffe sind maschinell auf S. 96 nachgewiesen.
- Pflichtmarkierung: Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- Browser bei 360 px: Karten, Filter, Druck, Knöpfe mindestens 48 px, keine externen Anfragen.

## Offen

- uk und ru: nicht vorhanden, offen.
- Die Bedeutung der Angaben „S“ und „Erwachsene (Kinder 2–3)“ im Katalog ist nicht geklärt.
- OCR-Fehler im Text (zum Beispiel „возниконовению“, S. 96) sind möglich; das Original ist nicht gegengeprüft.
