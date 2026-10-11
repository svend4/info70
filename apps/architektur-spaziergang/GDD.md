# GDD — Architektur-Spaziergang

## Was es ist

Ein Begleiter für Erwachsene, die mit einem Kind von fünf bis sieben Jahren
durch ihren Ort gehen. Kein Kinderbildschirm: der Spaziergang findet draußen
statt. Darum auch keine `eltern.html` — die ganze Seite ist die Elternseite.

## Die tragende Entscheidung: keine Liste, sondern Suchaufträge

Die Quelle (S. 278) nennt vierzehn Baudenkmäler als Vorbildliste — zehn
einzelne plus die Rathäuser in vier Städten. Alle vierzehn stehen in Belarus.
Der Katalogeintrag wollte „lokale deutsche Baukultur statt Mirski Samok und
Sophienkathedrale". Vierzehn deutsche Bauwerke hätten dasselbe Problem, nur
andersherum: welche Bauwerke in der Nähe sind, ist in jedem Ort eine andere
Liste.

Die Begründung für den anderen Weg liefert die Quelle selbst. Am Ende derselben
Aufzählung steht, womit gearbeitet werden soll: mit den Wohnhäusern und den
öffentlichen und gewerblichen Gebäuden «своей местности» — der eigenen Gegend.
Diese App kennt Ihre Gegend nicht. Sie hat deshalb 22 Suchaufträge, die an
jedem Haus funktionieren, und keine Karte, keinen Standort, kein Foto.

Wer die geschützten Bauwerke in der Nähe wissen will, findet sie in der
Denkmalliste des Bundeslandes; Auskunft gibt die Untere Denkmalschutzbehörde.
Die App ruft dafür nichts ab.

## Die drei Gruppen — und warum die dritte die wichtigste ist

```
bauform        → das Merkmal steckt im Gebäude selbst          (8)
ausstattung    → das Haus sagt nichts, die Sachen drumherum    (4)
nichtErkennbar → das Aussehen verrät es nicht                  (3)
kleineForm     → Laterne, Brunnen, Zaun (genannt), Bank        (4)
gruen          → Park, Grünanlage (genannt), Spielplatz        (3)
```

Quellziel Nr. 9 lautet: Kinder sollen Vorstellungen davon bekommen, dass das
Aussehen eines Gebäudes von seiner Bestimmung abhängt. Das gilt — aber nur
manchmal. Es ist als `nurEingeschraenkt` eingeordnet, und `pruefeDaten`
verlangt, dass der Absatz `nurManchmal` **eine der `nichtErkennbar`-Karten
namentlich nennt**. Ohne diesen Zwang wäre die Einschränkung eine Floskel.

Die Unterscheidung ist nicht neu: „Design-Entdecker" trennt schon Nutzungsart
von Bauweise und zeigt Kita und Bahnhof ausdrücklich, ohne sie abzufragen.
Hier ist sie um die dritte Gruppe erweitert — die Dinge, die niemand von außen
wissen kann. Ein Spaziergang, auf dem man alles errät, wäre ein falscher.

## Kein Satz ohne seinen Sicherheitsgrad

Jedes `fuerErwachsene` trägt ein `sicherheit`:

| Grad | Bedeutung | Pflichtfeld |
|---|---|---|
| `belegt` | mit Fundstelle | `quelle` — sonst Datenfehler |
| `vereinfachung` | stimmt der Richtung nach, ist aber zugespitzt | `sicherheitText` |
| `offen` | hier nicht geprüft | `sicherheitText` |

Eine Erklärung, die sich „belegt" nennt und keine Quelle mitbringt, lässt die
App nicht starten.

Die Faktenprüfung lief in zwei Runden (Recherche, dann Gegenprobe). Ergebnis:
**sechs Karten sind belegt** — der Wasserturm als Ersatz für einen fehlenden
Hügel (amtliche Quelle: er wird errichtet, wenn keine ausreichend hohen
Geländeerhebungen in der Nähe sind), das Fachwerk-Gefüge, Tenne und Bansen der
Scheune samt Durchfahrtscheune, Bahnsteigdach und Abstand fester Gegenstände
von der Gleismitte, der Feuerwehrübungsturm nach DIN 14092-3 und die
Bahnsteighalle mit ihrem Zugband.

**Sechs verbreitete Erklärungen stehen nicht in der App**, weil keine Quelle zu
finden war: dass der Kirchturm hoch sei, damit die Glocken weit zu hören sind;
dass die zwei Scheunentore den Durchzug zum Worfeln erzeugen sollten; dass
Schulen Fensterbänder wegen Tageslichtvorschriften haben; dass Stein keinen Zug
aushalte und der Bogen deshalb die einzige Möglichkeit war; dass Markthallen
ihre Spannweite für frei aufstellbare Stände brauchten; und warum Schläuche
überhaupt getrocknet werden müssen.

**Eine Karte war falsch und ist korrigiert:** sie sagte, das Trocknen der
Schläuche sei nicht zu belegen gewesen. Es ist normativ bis heute genannt — und
die Norm selbst dokumentiert die Verschiebung der Aufgabe, denn sie hieß 1992
noch „Schlauchtrockenturm, Übungswand" und heute „Feuerwehrübungsturm". Was
nicht zu belegen war, ist die Begründung dahinter. Gelesen wurde dabei der
einführende Beitrag zur Norm, nicht der Normtext: Normen sind kostenpflichtig,
und das steht im `sicherheitText` der Karte.

Jede `bauform`-Karte braucht außerdem ihr `gegenbeispiel`: es gibt Kirchen ohne
Turm, Wassertürme ohne Wasser, Scheunen, die Garagen sind. Eine Erkennungsregel
ohne Ausnahme wird zum Gesetz.

## Die Fragen prüfen nichts

Jede Karte hat einen `impuls` — eine Frage, die draußen laut gesagt wird. Sie
muss mit einem Fragezeichen enden und darf keine Erwartung enthalten; das Netz
`ERWARTUNG` lehnt „soll erkennen", „die richtige Antwort", „abhaken" ab. Was
unter „Für Erwachsene" steht, ist Hintergrund für die Begleitung, kein
Lösungsblatt. Gezählt, gepunktet und verglichen wird nichts: kein Werkzeug
dieses Hauses bewertet ein Kind (docs/02).

## Siebzehn Quellziele, vier Einordnungen

`gebaut` (3: Nr. 6, 7, 8) · `nurEingeschraenkt` (1: Nr. 9) · `anderesThema`
(10 → Design-Entdecker, Kunst gucken, Erste Künstler, Kita-Kartograph, Dinge
des Alltags) · `nichtUebernommen` (3):

- **Nr. 11** — elf Fachwörter einüben, darunter „Stilisierung", „Faktur",
  „Modul". Wer auf dem Gehweg „Faktur" sagt, hat nichts erklärt. Die Karten
  benutzen Wörter, die ein Kind draußen selbst verwendet: hoch, breit, Tor,
  Balken, Dach.
- **Nr. 16** — Verpackungsdesign, Großplakate, **Außenwerbung**, Etiketten.
  Das ist Werbung. Diese Werkzeuge sind werbefrei, und zwar nicht nur in der
  eigenen Oberfläche. Wenn Kinder etwas über Werbung lernen sollen, dann sie zu
  erkennen — dafür gibt es „Werbekennzeichnung".
- **Nr. 17** — „künstlerischen Geschmack und Kriterien zur Bewertung von
  Massenproduktion bilden". Eine Geschmacksfrage hat keine Antwort (so hält es
  schon „Design-Entdecker"), und Bewertungskriterien für Massenware machten aus
  dem Spaziergang eine Kaufberatung.

## Unterwegs

`sicherheitImmer` steht in `DRUCK_ABSAETZE` und damit auf dem Zettel, den man
mitnimmt — nicht nur auf dem Bildschirm, wo man ihn beim Losgehen nicht mehr
sieht. Der Validator verlangt, dass der Absatz drei Dinge nennt: Gehweg statt
Fahrbahn, kein Grundstück und kein Klingeln, keine Menschen fotografieren.

## Daten und Technik

- `logik.mjs` ist rein: keine DOM-, keine Netz-, keine Speicherzugriffe.
- Umgekehrte Prüfung wie in Nr. 60–64: `angebotsTexte` liefert den **Rest** —
  alle 272 Strings minus den benannten Ausnahmen in `NICHT_GEPRUEFT`, und jede
  Ausnahme muss ein Feld benennen, das es wirklich gibt.
- `ORTSNAME` kennt Halle, Essen und Hof nur mit Präposition: das sind Städte
  **und** gewöhnliche Wörter („eine weite Halle", „zum Essen", „der
  Pausenhof"). Getroffen wird die Konstruktion, nicht das Wort — Falle A zum
  sechsundzwanzigsten Mal.
- `EPOCHE` gilt nur für die **Kindseite** einer Karte (`impuls`, `woranMan`).
  Der Grund der Regel ist, dass „Gotik" einem Kind vor einem Haus nichts
  erklärt; er verlangt nicht, dass eine Quellenangabe die Epoche ihrer
  Fachliteratur verschweigt. Die Rathaus-Karte muss sagen dürfen, dass die
  Fachliteratur für die **mittelalterlichen** Rathäuser drei Typen
  unterscheidet — ohne das lässt sich der Mythos der typischen Form nicht
  widerlegen. Falle A zum siebenundzwanzigsten Mal.
- `JAHRESZAHL_ERLAUBT_IN` ist eine Ausnahme für **ein Feld und ein Netz**: eine
  Quellenangabe trägt das Jahr ihrer Norm oder Ausgabe, und das ist keine
  Angabe über ein Gebäude. Alle anderen Netze laufen weiter über die
  Quellenangaben — ein Test beweist es mit einer eingeschmuggelten Erwartung.
- Gespeichert wird genau eine Liste: `asp-auswahl`, die gewählten Karten. Mit
  `datenKarte` samt Löschknopf. Ohne Auswahl druckt die App alle Karten — ein
  leeres Blatt wäre kein Blatt.
- 24 Tests.

Quelle: «Пралеска» © НИО 2007, S. 274–276 und S. 278 — übernommen sind Konzept
und Struktur, alle Formulierungen sind Eigenproduktion.
