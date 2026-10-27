# Kurz-GDD: Höflich & Fair 🤝

**Einheit aus Katalog:** docs/10 (Praleska) Kinder-Apps Nr. 13 —
«Hoeflich & Fair: Sprach-Etikette». **Engine:** eigener Szenario-Trainer
mit drei Antworten je Szene (Muster wie `tier-zu-gast`,
`freunde-in-der-gruppe`) und Vorlesefunktion; das Kind wird nicht bewertet.
Zielgruppe: 5–7 in Ko-Nutzung, 8–12
eigenständig.

## 1. Kernaussage

Höflichkeit ist keine Liste von Zauberwörtern, sondern die Fähigkeit, in
einer konkreten Situation die Worte zu finden, die ankommen — ohne sich
selbst dabei zu verleugnen. Deshalb steht über der App der Satz:
**Freundlich sein und Nein sagen sind kein Widerspruch.**

## 2. Ablauf

12 Szenen im Vorrat, 10 pro Runde in zufälliger Reihenfolge; die drei
Antworten werden je Szene gemischt. Jede Antwort bekommt eine Rückmeldung
und danach die Erklärung. Am Ende steht „Ende der Runde“ mit einem
Gesprächsimpuls für zu Hause, ohne Auswertung (kein Punktestand, keine
Ränge, kein Rekord).

Kategorien (je Szene genau eine, per Validator eindeutig): Danken,
Entschuldigen, Gratulieren, Mitgefühl, Bewundern, Grüßen, Bitten,
Unterbrechen, Grenze setzen, Am Telefon, Rücksicht, Lob annehmen.

## 3. Die tragende Entscheidung: Höflichkeit ist kein Gehorsam

Die Szene *Grenze setzen* (h09) bricht bewusst mit dem, was ein
Etikette-Trainer nahelegen würde. Ein Verwandter will das Kind zur
Begrüßung umarmen und küssen, das Kind mag das nicht:

- **Beste Antwort:** „Ich gebe dir lieber die Hand.“
- **Mittlere Antwort:** ausweichen, aber nichts sagen.
- **Ungünstigste Antwort:** mitmachen, obwohl es sich falsch anfühlt, und
  niemandem davon erzählen.

Ein Nein ist hier nie die schlechteste Antwort — das ist per Test
festgenagelt (`beste(s).text` enthält „lieber die Hand“, `schlechteste`
enthält „obwohl du dich unwohl fühlst“ und darf kein „Nein“ enthalten).
Die Erklärung nennt außerdem eine Vertrauensperson. Ein Kind, das lernt,
Höflichkeit gehe vor dem eigenen Unwohlsein, ist schlechter geschützt;
diese App soll das nicht trainieren.

## 4. Mittlere Antwort nur für wirklich halb Richtiges

Wie bei `tier-zu-gast` gilt die Invariante, dass die mittlere Rückmeldung
nur vergeben wird, wenn die Antwort tatsächlich zur Hälfte stimmt — sonst
widerspräche die Rückmeldung der eigenen Erklärung. Drei Fälle sind per
Test gepinnt:

- **h03:** Erst traurig sein und abends gratulieren ist *echt*, kommt nur
  nicht im richtigen Moment an → 1. Den Sieg kleinreden → 0.
- **h04:** „Ihr holt euch bestimmt einen neuen“ ist gut gemeint, aber
  abwiegelnd → 1. „Ist doch nur ein Hund“ macht den Verlust klein → 0.
- **h01:** Ein kurzes „Danke“ ist richtig, kommt aber kaum an → 1. Die
  Mühe abwerten → 0.

## 5. Sicherheit im Alltag

Zwei Szenen tragen zusätzlich Schutzwissen, ebenfalls per Test gesichert:

- **Am Telefon (h10):** freundlich bleiben und trotzdem nichts verraten —
  „können gerade nicht“ statt „ich bin allein zu Hause“; Adresse und
  Nachname gehören nicht ans Telefon; Auflegen ist ausdrücklich erlaubt.
- **Unterbrechen (h08):** die Höflichkeitsregel hat eine Ausnahme — wenn
  jemand verletzt ist oder Gefahr besteht, wird sofort und laut
  unterbrochen.

## 6. Mehrsprachigkeit

Der Katalog sieht uk/ru-Höflichkeitsformeln vor. Statt erfundener
Wortlisten, für die uns die Belege fehlen, bittet eine Karte auf dem
Startbildschirm die Familie, „Danke“, „Bitte“, „Entschuldigung“ und den
Morgengruß selbst in ihrer Sprache zu benennen — dieselbe Lösung wie in
`mensch-tier-pflanze`, und die wirksamere.

## 7. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten. Die
App speichert nichts (keine Karte „Meine Daten löschen“, kein Löschknopf);
der alte Rekord-Schlüssel wird beim Start einmal in einer Zeile entfernt.
Vorlesefunktion (BFSG), Namen in den Szenen bewusst
kultursensibel gemischt (Merve, Jonas, Lina, Ali, Nele, Frau Kowal).
eltern.html, im Sammelband.

## 8. Tests

`test/logik.test.mjs` (10): Szenarien gültig; Rückmeldung zu jeder Antwort
(Titel und Emoji je Option, Erklärung vorhanden); Kinder werden nicht
bewertet (keine Rang- oder Punkte-Funktion, keine Ränge in den Daten, kein
Zähler im App-Code, nur „Situation n von m“ als Fortschritt); Speicherregel
(nichts gespeichert, keine Karte, kein Löschknopf, alter Schlüssel in einer
Zeile entfernt); der Validator greift wirklich (zwei beste Optionen,
fehlende ungünstige Option, doppelte Kategorie werden gemeldet); die
Sprechhandlungen des Katalogs kommen vor; *Grenze setzen* wertet das
freundliche Nein als beste und das stumme Mitmachen als ungünstigste
Antwort; die mittlere Antwort nur für halb Richtiges (h01, h03, h04);
Telefon- und Notfallregel stehen in den Erklärungen; Ton ohne
Beschämung und ohne Gehorsams-Botschaft, jede Erklärung ≥150 Zeichen,
ids in Reihenfolge.

## 9. Erweiterungen (Katalog)

Rollenspiel-Karten zum Ausdrucken (Anschluss an `quiz-karten-druck`),
Szenen für den Schulalltag (Gruppenarbeit, Streitschlichtung) als
Brücke zu `freunde-in-der-gruppe`, Modus „eigene Situation eintragen“
für den Familienrat.
