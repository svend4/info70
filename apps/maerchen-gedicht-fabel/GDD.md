# Kurz-GDD: Märchen, Gedicht oder Fabel? 📚

**Einheit aus Katalog:** docs/10 (Praleska) Kinder-Apps Nr. 19 —
«Maerchen, Gedicht oder Fabel?». **Engine:** `quiz-kern` (Einzel-,
Klassen-, Duett- und Staffel-Modus, Vorlesen, Rekord). Zielgruppe: 6–10.

## 1. Kernaussage

Textsorten unterscheidet man nicht am Namen, sondern an einem einzigen
prüfbaren Merkmal: Steht am Ende eine Lehre? Könnte das wirklich
passiert sein? Wo hört die Zeile auf? Das Quiz zeigt jeweils einen
kurzen Text und lässt das Kind entscheiden — die Erklärung nennt danach
das Zeichen, an dem man es hätte sehen können.

## 2. Ablauf

18 Fragen im Vorrat, 12 pro Runde. Zehn davon zeigen einen
**Beispieltext** und fragen „Was ist das?“ (drei Gattungen zur Auswahl),
acht sind Aussagen über die Merkmale selbst. Am Ende: Punkte, Rekord und
einer von vier Rängen (Geschichten-Neuling → Wörter-Spürnase →
Gattungs-Kenner\*in → Sprach-Expert\*in).

Sieben Gattungen, jede mit mindestens einem eigenen Beispieltext:
Märchen, Erzählung, Gedicht, Fabel, Rätsel, Sprichwort, Zungenbrecher.

## 3. Die vier Verwechslungen, die bewusst aufgelöst werden

- **Ein Gedicht muss sich nicht reimen** (g11). Der hartnäckigste
  Irrtum, deshalb doppelt behandelt: g04 ist ein gereimter Vierzeiler,
  g05 ein reimloses Gedicht über Fußspuren im Schnee. Ein Test prüft,
  dass g05 wirklich reimlos angelegt ist und die Erklärung das benennt.
- **Nicht jede Tiergeschichte ist eine Fabel** (g18). g09 zeigt einen
  Kater, der sich in die Sonne legt — keine Lehre, kein Sinnbild, also
  eine Erzählung.
- **Zur Fabel gehört die Lehre** (g12, Beispiel g03).
- **Märchen erkennt man am Wunder, nicht am sprechenden Tier** (g13).
  g10 setzt genau die Falle: ein sprechender Wolf, aber keine Lehre und
  dafür Gold über Nacht — Märchen, nicht Fabel.

Alle vier sind per Test an konkrete ids gebunden.

## 4. Aufbau der Beispielfragen (per Test erzwungen)

Jede Beispielfrage folgt derselben Form: `„<Text>“ Was ist das?`. Der
Validator im Test prüft nicht nur die Form, sondern auch die Sachlogik:
Die richtige Antwort muss die Gattung der `kategorie` nennen, und **kein
Ablenker darf dieselbe Gattung enthalten** — sonst gäbe es zwei richtige
Antworten. Die Untergrenze für die Textlänge liegt bewusst niedrig, weil
ein Sprichwort von Natur aus kurz ist.

## 5. Herkunft der Texte

Alle Geschichten, Gedichte, das Rätsel und der Zungenbrecher sind
Eigenproduktion; es wird nichts zitiert. Ausgenommen sind die beiden
Sprichwörter („Morgenstund hat Gold im Mund“ als Beispieltext, „Übung
macht den Meister“ in einer Erklärung): altes, gemeinfreies Sprachgut —
ein erfundenes Sprichwort wäre keines. Das Feld `hinweis` in
`daten/fragen.json` sagt das ausdrücklich, und ein Test hält es fest.

## 6. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten. Nur
der Punkte-Rekord liegt unter `gattung.rekord` im localStorage und ist
in der App löschbar. Vorlesefunktion aus `quiz-kern` deckt Nichtleser ab
(BFSG) — gerade beim Gedicht hört man die Zeilen, statt sie zu sehen.
eltern.html, im Sammelband.

## 7. Tests

`test/fragen.test.mjs` (8): Schema gültig bei erhöhter Latte (≥16 Fragen,
Erklärung ≥80 Zeichen); Ränge beginnen bei 0 und sind in einer 12er-Runde
erreichbar; alle sieben Gattungen kommen vor **und keine Kategorie
außerhalb dieser sieben**; zu jeder Gattung gibt es einen Beispieltext in
der festen Form, dessen richtige Antwort zur Kategorie passt und dessen
Ablenker die Gattung nie wiederholen; binäre Fragen enthalten beide
Antworten und die richtige Wahlantwort steht nicht immer an derselben
Stelle; die vier Verwechslungen sind aufgelöst; die Textherkunft ist
deklariert; jede Erklärung ≥150 Zeichen mit Satzzeichen, ids in
Reihenfolge.

## 8. Erweiterungen (Katalog)

Schreibmodus „Baue selbst ein Rätsel“ (Anschluss an `reim-radar` und
`geschichten-werkstatt`), Hörmodus mit reiner Vorlesefunktion ohne
sichtbaren Text, Druckkarten mit je einem Beispieltext für die
Klassenstunde (`quiz-karten-druck`).
