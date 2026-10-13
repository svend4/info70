# GDD – Elterngespräch üben

## Was es ist

Ein Übungswerkzeug für Erzieher\*innen: fünf typische Gespräche mit Eltern, jeweils
drei Antworten. Jede Antwort wird eingeordnet – dialogisch, verständlich aber
einseitig, oder Falle – und mit einer Seitenangabe belegt. Das Werkzeug ist für
Erwachsene; es gibt keinen Kinderbildschirm und keine `eltern.html`.

## Die tragende Entscheidung: die Szenarien sind eigene

Der Katalogeintrag (Praleska, Kita-Abschnitt, Nr. 73) setzte Gesprächsszenarien aus
der Quelle voraus. Die Quelle enthält sie nicht: die Seiten S. 21–25 nennen
Grundsätze der Zusammenarbeit mit Familien, aber keine Gesprächssituationen. Das
Werkzeug sagt das in seinem Startbildschirm und in `daten/szenarien.json`
(Feld `quelle.abweichung`). Die Szenarien und die Stufen 2 / 1 / 0 sind **Eigenentwurf**.

Die Belegstellen stehen je Antwort. Die Tests prüfen, dass jede Antwort eine
Seitenangabe trägt (`test/logik.test.mjs`). Dass die Seitenzahlen selbst stimmen, ist
für die Praleska-Seiten geprüft; für Hessen und Bayern ist es im Repository nicht
gegengeprüft – siehe „Offen“.

## Was es bewusst nicht tut

- **Keine Gesamtpunktzahl, keine Rangliste.** Die Stufe beschreibt eine Antwort, nicht
  die Person. Die Beschreibung des Werkzeugs (`wasEsIst`) darf keine
  Gesamtwertung nennen; der Test prüft „Gesamtpunkt“, „Rangliste“, „Ranking“ und
  „von N Punkten“ dort.
- **Die Falle ist als Falle markiert** und nur dort. Muster, vor denen gewarnt wird,
  stehen nicht in den Antworten 1 und 2.
- **Keine Speicherung, keine Netzanfragen.** Die Netzwache aus `kinderschutz` läuft.
- **Kein Blatt mit Auswertung.** Das Druckblatt hat Grundhaltungen und Verweise.

## Datenlage

| Feld | Inhalt |
|---|---|
| `szenarien` | fünf Situationen, je drei Antworten (`wert` 2 / 1 / 0, genau eine je Stufe) |
| `grundhaltungen` | fünf Haltungen mit Seitenangabe (zum Beispiel „Eigene Grenzen benennen“, S. 37–39) |
| `rechtlich`, `verweise` | Hinweise auf Hessen, Bayern, KMK; keine Rechtsberatung |
| `quelle` | `geprueft: true`, Werk, Abweichung vom Katalog |

## Prüfung

- `pruefeDaten` (in `logik.mjs`) läuft beim Start; ein Fehler stoppt die Anzeige mit
  Begründung.
- 11 Tests in `test/logik.test.mjs`.
- Browser bei 360 px: Überlauf 0, Ziele mindestens 44 px, Druck zeigt nur das Blatt.

## Offen

- Die Seitenzahlen für den Hessen-Bildungsplan (S. 97, 108, 109) und die Bayern-Broschüre
  (PDF-S. 43, 44, 48, 49) sind gegen die Originale abzugleichen, bevor das Werkzeug in
  der Ausbildung eingesetzt wird.
- Die Situationen sind Übungsfälle, keine Wortlautvorlagen. Eine Fachkraft aus einer
  Kita sollte sie einmal gegenlesen, bevor das Werkzeug in der Ausbildung eingesetzt
  wird.
- Die Stufe 0 ist ein Urteil über den Text einer Antwort. Ob ein Gespräch in der
  Praxis gelingt, hängt von Beziehung und Kontext ab, das Werkzeug misst es nicht.
