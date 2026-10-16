# Vom Hantieren zum Rollenspiel 🧩

Karten zum Drucken für Fachkräfte mit Kindern von 3 bis 5 Jahren (Gruppe „Почемучки“). Sie zeigen die
sieben Aufgaben der Quelle für den Übergang vom gegenständlichen Spiel zum Rollenspiel (S. 145–146),
dazu drei Fakten (S. 6, S. 104) und eine Checkliste für Erwachsene.

## Was an der Quelle geprüft ist

Der Katalogeintrag (Nr. 81) hatte drei Angaben, die der Text so nicht trägt:

- **„Spielideen je Entwicklungsschritt“**: Die Quelle nennt Aufgaben für die Fachkraft (S. 145–146),
  aber keine Spielideen je Schritt. Sie werden hier nicht erfunden.
- **„Kurze Verlaufsdokumentation“**: Die Quelle nennt keine Dokumentation des Spielverlaufs.
- **„Rollenangebote“**: nur als Aufgabe beschrieben („ролевого взаимодействия“, S. 146), keine Liste
  von Rollen.

Belegt und mit Seite: der Übergang am Ende des vierten Lebensjahres (S. 104), Diade und Triade als
erste Spielgruppen (S. 104), die Altersangabe 3 bis 5 Jahre für „Почемучки“ (S. 6), die sieben
Aufgaben (S. 145–146). Der Diagnoseteil auf S. 146 (Kinder mit emotionalem Unbehagen erkennen)
wird nicht übernommen, weil er das Beobachten einzelner Kinder betrifft.

## So funktioniert es

- Sieben Aufgabenkarten mit Seite und russischem Wortlaut.
- Eine Faktenkarte zum Übergang und zu den Spielgruppen.
- Eine Checkliste für Erwachsene (Eigenentwurf): Ersatzgegenstände, Spielgruppen, Platz für Rollenspiele,
  gemeinsame Rollen und Würdigung eigener Ideen der Kinder.
- „Diese Karten drucken“ druckt die Karten.
- Keine Eingabe, keine Namen, keine Speicherung.

## Grenzen – ehrlich

- Die Checkliste ist Eigenentwurf. Die Fragen stützen sich auf die Aufgaben, ersetzen aber keine
  Beobachtung im Gruppenalltag.
- Die Quelle ist eine russische Ausgabe; die deutsche Übertragung der Begriffe ist eigen.

## Prüfung

- `node --test apps/spielbegleiter-rollenspiel/test/*.mjs` – 13 Tests: sieben Aufgaben auf S. 145 oder 146,
  Fakten mit Seite, Abweisung von Feldern nach Kind (Verlauf, Diagnose u. a.), keine Lernziele für Kinder,
  Abweichung nennt die Verlaufsdokumentation, Gegenproben.
- Alle elf russischen Zitate sind maschinell auf den angegebenen Seiten nachgewiesen.
- Browser bei 360 px: neun Karten, Druck nur mit Karten, Knöpfe mindestens 44 px, keine externen Anfragen.

## Starten

`index.html` über einen statischen Server öffnen, zum Beispiel `node tools/serve.mjs`.
