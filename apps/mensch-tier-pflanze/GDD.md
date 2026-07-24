# Kurz-GDD: Mensch, Tier, Pflanze 🌳

**Einheit aus Katalog:** docs/10 (Praleska) Kinder-Apps Nr. 9 —
«Mensch-Tier-Pflanze: Was uns verbindet». **Engine:** `quiz-kern`
(Einzel-, Klassen-, Duett- und Staffel-Modus, Vorlesen, Rekord).
Zielgruppe: 5–7 in Ko-Nutzung, 8–12 eigenständig.

## 1. Kernaussage

Kinder sortieren die Welt zuerst nach dem Aussehen; ein Baum und ein
Käfer scheinen nichts gemeinsam zu haben. Das Quiz dreht den Blick um und
fragt nach dem **Gemeinsamen** — den Lebenszeichen: atmen, sich ernähren,
trinken, wachsen, sich bewegen, auf die Umgebung reagieren, für Nachwuchs
sorgen. Wer diese Liste hat, kann selbst prüfen, ob etwas lebendig ist.

## 2. Zielgruppe

5–7 gemeinsam mit einem Erwachsenen (vorlesen, nach ein paar Fragen
aufhören), 8–12 allein. Nachbarn: wer-wohnt-wo (Lebensräume),
nahrungsnetz-werkstatt (wer frisst wen), jahreszeiten-uhr,
koerper-entdecker.

## 3. Ablauf

16 Fragen im Vorrat, 12 pro Runde in zufälliger Reihenfolge — gemischte
binäre Aussagen („Stimmt / Stimmt nicht“) und Wahlfragen mit drei
Antworten. Nach jeder Antwort erscheint eine Erklärung; dort passiert das
Lernen. Am Ende: Punkte, Rekord und einer von vier Rängen
(Natur-Neuling → Lebens-Spürnase → Natur-Forscher\*in →
Lebens-Expert\*in).

## 4. Didaktik / Nutzen

Adaption laut Katalog: die Buchstruktur der gemeinsamen Lebenszeichen,
umgesetzt mit mitteleuropäischer Flora und Fauna (Löwenzahn, Gänseblümchen,
Buche, Amsel, Bohnenranke, Kresse). Bezug: Sachunterricht / Bereich
*Natur und Lebenswelt*.

Drei fachliche Punkte sind bewusst sauber gezogen, weil sie in
Kinderbüchern regelmäßig verschwimmen:

- **Atmung ≠ Fotosynthese.** Pflanzen atmen Tag und Nacht; die
  Nahrungsherstellung aus Licht, Wasser und Luft kommt am Tag *zusätzlich*
  dazu (Frage m02, per Test festgenagelt).
- **Reagieren ohne Gehirn.** Pflanzen wenden sich dem Licht zu, die
  Wurzel findet nach unten, die Ranke greift bei Berührung — Gefühle oder
  ein Gehirn werden ihnen ausdrücklich *nicht* zugeschrieben (m12).
- **„Bewegt sich“ ist kein Beweis.** Ein Auto fährt und lebt nicht, ein
  Baum steht still und lebt; nur die ganze Liste trägt (m11).

Für die Leitungsbahnen steht das kindgerechte Bild aus dem Katalog: viele
dünne Trinkhalme im Stamm, oben ziehen die verdunstenden Blätter, unten
drücken die Wurzeln (m04).

**BFSG:** Vorlesefunktion aus `quiz-kern` deckt Nichtleser ab; jede Frage
und jede Erklärung ist einzeln vorlesbar.

**Herkunftssprache:** Statt erfundener Übersetzungen bittet eltern.html
die Familie, die Kernwörter selbst in ihrer Sprache zu benennen — das ist
die wirksame Form der Sprachbrücke und kommt ohne Wortlisten aus, für die
uns die Belege fehlen.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten. Nur
der Punkte-Rekord liegt unter `mtp.rekord` im localStorage und ist in der
App löschbar. eltern.html, im Sammelband.

## 6. Tests

`test/fragen.test.mjs` (8): Schema gültig bei erhöhter Latte (≥14 Fragen,
Erklärung ≥80 Zeichen); Ränge beginnen bei 0, sind aufsteigend und in
einer 12er-Runde erreichbar; binäre Fragen enthalten beide Antworten
(sonst lernt das Kind „immer ja“) und die richtige Wahlantwort steht nicht
immer an derselben Stelle; alle neun Lebenszeichen-Kategorien
kommen vor; mindestens drei Fragen vergleichen ausdrücklich Mensch,
Tier **und** Pflanze; die drei typischen Verwechslungen sind aufgelöst
(m02 „Tag und Nacht“, m12 „kein Gehirn“, Trinkhalm-Metapher, Auto-Beispiel);
Ton ohne Beschämung und Angstmache; jede Erklärung ≥120 Zeichen mit
Satzzeichen, ids in Reihenfolge.

## 7. Erweiterungen (Katalog)

Zuordnungs-Spiel „Wer macht was womit?“ (Kiemen / Lunge / Blattporen),
Kresse-Versuch als begleitende Beobachtungskarte, Zellen unter dem
Mikroskop als Bildteil, Brücke zu nahrungsnetz-werkstatt (wer isst wen)
und zu koerper-entdecker (mein eigener Körper).
