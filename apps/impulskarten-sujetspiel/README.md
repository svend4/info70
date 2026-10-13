# Impulskarten für das sujetabbildende Spiel (1–3 Jahre) 🃏

Kartei für Fachkräfte der Gruppe „Малыши“ (Kinder von 1 bis 3 Jahren). Jede Karte beschreibt
eine kleine Spielsituation mit Puppe, Stofftier oder Spielzeug. Das Kind soll ohne Hilfe
Erwachsener einen Ausweg finden. **Die Karten zeigen Situationen, keine Lösungen.**

## Was an der Quelle geprüft ist

Der Katalogeintrag (Praleska, Kita-Abschnitt, Nr. 77) hatte fünf Behauptungen, die der Text
so nicht trägt:

- **Die sechs Ziele sind Aufgaben für die Fachkraft**, keine Lernziele der Kinder (S. 7,
  S. 68–69). Die App sagt das im Bildschirm.
- **Der Titel „Rollenspiel“ passt nicht zu 1–3 Jahren.** Das sujetabbildende Spiel gehört in
  diese Zeit (Merkmal „к трем годам“, S. 99–100); den Übergang zum Rollenspiel nennt der Text
  am Ende des vierten Lebensjahres (S. 104). Deshalb heißt die Kartei anders.
- **Die drei Beispiele des Katalogs** (Puppe hat Hunger, Teddy ist krank, Auto steckt fest)
  stehen nicht im Text. Die Karten sind ein Eigenentwurf.
- **Tagespflege** nennt die Quelle nicht. Die App richtet sich an Kitas.
- **„Kartei mit Spiel-Problemsituationen“** ist ein Vorschlag der Redaktion; die Quelle beschreibt
  keine Karten.

Belegt und mit Seite genannt: die sechs Aufgaben (S. 68–69), die Spielproblemsituation als Mittel
(S. 69), Handlungsketten und Nebeneinander-Spiel als Ziel (S. 69) und als Entwicklungsmerkmal
(S. 46 für die Kette, S. 47 und S. 100 für das Nebeneinander-Spiel), das Beispiel mit dem Ersatzgegenstand (S. 100, Karte 6).

## So funktioniert es

- Die Aufgaben stehen oben, mit russischem Wortlaut. Ein Knopf zeigt die Karten zu dieser
  Aufgabe, ein zweiter filtert nach Figur.
- Jede Karte trägt ihre Quelle oder die Markierung **Eigenentwurf**.
- „Diese Karten drucken“ druckt nur die gerade gewählte Auswahl, mit einer Regelzeile auf dem Blatt.
- Die App speichert nichts: kein Haken, kein Zähler, kein localStorage.

## Grenzen – ehrlich

- Die Prüfung gegen Lösungen erkennt **häufige Formulierungen** (etwa „die Fachkraft gibt …“, „Lösung“, „dient als …“) in Titel und Situation. Sie ist keine Garantie: ob eine Situation die Lösung schon verrät, entscheidet die Fachkraft beim Lesen der Karte.
- Die Karten sind **Übungsbeispiele**, keine Vorlage für Wortlaut im Gruppenalltag.
- Die Quelle nennt Ziele, aber keine Schritte für Handlungsketten und kein Verfahren für
  Nebeneinander-Spiel. Diese Hinweise fehlen; die App erfindet sie nicht.
- Die Übertragung ins Deutsche ist eigen (siehe `daten/karten.json`, Feld `quelle`).

## Prüfung

- `node --test apps/impulskarten-sujetspiel/test/*.mjs` – 21 Tests: sechs Aufgaben mit Seite
  68 oder 69, keine Lernziel-Formulierung, kein „Rollenspiel“ im Titel, kein Lösungsfeld in
  einer Karte, jede Karte Eigenentwurf oder mit Seite, jede Aufgabe mit einer Karte, Filter,
  und Gegenproben: eine Karte mit Lösungsfeld, eine Lösung im Text, ein fehlender Eigenentwurf
  und ein Lernziel-Satz werden abgewiesen.
- Browser bei 360 px: neun Karten am Anfang, Filter nach Aufgabe und Figur, Beispielkarte mit
  S. 100, Eigenkarte mit Eigenentwurf, Druck zeigt nur die Karten, Knöpfe mindestens 44 px,
  kein Überlauf, keine externen Anfragen. Die einzige Konsolenmeldung ist das `favicon.ico`.

## Starten

`index.html` über einen statischen Server öffnen, zum Beispiel `node tools/serve.mjs`.
Ohne Build, ohne Abhängigkeiten, offline.
