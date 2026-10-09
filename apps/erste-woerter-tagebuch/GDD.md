# GDD: Erste-Wörter-Tagebuch

**Katalog:** docs/10 («Praleska»), Abschnitt «Eltern-Werkzeuge», Nr. 51.
**Quelle:** Praleska (Пралеска), Minsk 2007, S. 29 und S. 37–39.
**Zielgruppe:** Eltern; Bezugskind 0–2. **Nicht** für Kindertagespflege oder Krippe.
**Form:** Lokales Heft mit Datei-Export und Druckansicht.

## 0. Die Quelle, nachgelesen

S. 29 nennt die vorsprachlichen Lautformen in dieser Folge: вскрики
(Aufschreie), гуканье (kurze Laute „ии“, „хм“), гуление (gezogene Laute
„ааа“), лепет (Lallen), лепетные тирады (Lallketten mit ausgeprägtem
Intonationsmuster, „ба-ба-та“), dann die ersten Wörter — ausdrücklich **4 bis
20** zum Ende des ersten Lebensjahres, „emotional gefärbt, situativ, nur
Nahestehenden verständlich“.

S. 37–39 trägt 10 Kommunikationsziele in drei Perioden (1 + 3 + 6); sie sind
in `apps/sprich-mit-mir` umgesetzt und hier nicht wiederholt.

**Ein Widerspruch in der Quelle selbst:** S. 38 zählt dieselben Stufen in
anderer Reihenfolge auf („гуления, гуканья, лепета“), S. 29 dagegen гуканье
vor гуление. Die Quelle trägt also selbst keine verbindliche Reihenfolge der
beiden mittleren Stufen — die Ordnung dieser App ist darum nicht mit der
Quelle begründet.

## 1. Tragend: diese App zählt nicht

Das dreht den Katalogeintrag um. Er wollte eine „Meilenstein-Ansicht“ und
nennt die Zahl der Quelle (4–20 Wörter). Hier steht **kein Zähler**: nicht
über alle Einträge, nicht je Sprache, nicht je Art, nicht als „n Einträge“.

Der Grund ist fachlich, nicht technisch. „Unter 50 Wörter mit 24 Monaten“ ist
das Warnzeichen, an dem die Fachwelt entscheidet, ob ein Kind Unterstützung
braucht. Eine App, die eine Wortzahl neben ein Alter stellt, führt genau
dieses Screening durch — ohne Zuständigkeit, ohne gültigen Normbezug, und bei
einem mehrsprachigen Kind ohne jede zulässige Vergleichsgröße, denn
Vergleichsmaßstäbe bestehen nur für Kinder, die einsprachig deutsch
aufwachsen.

Es gibt deshalb nicht: Zähler, Geburtsdatum, Alter in Monaten, Normvergleich,
Cut-off, Ampel, Score, Prognose oder eine Empfehlung, die aus den Daten
folgt. Zwei Tests halten das: keine exportierte **Funktion** trägt einen
Zählnamen, und keine Array-Länge wird in einen Oberflächentext interpoliert.

Die Zahl der Quelle steht nirgends neben einer Altersangabe; `ZAHL_MIT_ALTER`
weist genau dieses Muster in den Daten ab.

## 2. Geordnet nach Lauttyp — und das ist keine Leiter

docs/02 verlangt für 0–1 eine Ordnung nach dem beobachtbaren Merkmal statt
nach Lebensmonat. Hier sind es zehn Arten von Lauten und Wörtern, jede mit
Erklärung und Beispiel, keine mit einer Altersangabe (der Validator weist
eine Altersangabe in einer Art ab).

Und sie sind ausdrücklich **keine Stufen**. Ein allgemein anerkanntes
Stufenmodell der frühen Lautentwicklung gibt es im deutschen Fachschrifttum
nicht: die Benennungen gehen auseinander, die einzige Leitlinie mit einer
Zweiphasen-Einteilung ist abgelaufen, eine spätere enthält überhaupt kein
vorsprachliches Stufenmodell, und eine Landes-Diagnostikplattform kommt mit
drei Bezeichnungen aus. Der Satz dazu steht **in der Einleitung und** in der
Art-Ansicht — die Browser-Probe hat gefunden, dass er zuerst nur in der
Ansicht stand, man also die Reihenfolge sah, bevor man die Einschränkung las.

Übernommen sind die deutschen Begriffe, die belegt sind: Schreien, Gurren,
Quietschen, Lallen, kanonisches Lallen, variierendes Lallen, Lallmonolog.
Nicht übernommen: „marginales Lallen“ (im Deutschen nicht breit etabliert)
und „Lall-Tirade“ (kein deutscher Fachbegriff). Und die **zwei** Gurrstufen
der Quelle sind **eine**, weil es im Deutschen nur eine Gurrphase gibt.

Eine leere Art bleibt sichtbar und sagt „Hier steht noch nichts – das heißt
nichts.“ Sie auszublenden wäre ein stilles Urteil darüber, was fehlt.

## 3. Sprachen getrennt, ohne Summe

Ein Kind mit zwei Sprachen hat in jeder einzelnen oft weniger Wörter, über
alle seine Sprachen zusammen aber nicht weniger. Das ist der Grund für die
getrennte Erfassung — und es steht als **Satz** da, nicht als Zahl. Eine
Summe wäre wieder eine Vergleichsgröße, und wie sie zu bilden wäre, ist
fachlich nicht entschieden (zwei konkurrierende Verfahren, und keines
erreicht in Studien eine brauchbare Trennschärfe).

Die Lage zur Mehrsprachigkeit steht genau so da, wie sie ist: nicht
häufiger, aber möglich, und dann in allen Sprachen des Kindes. Der Validator
weist **beide** falschen Richtungen ab — „unbedenklich“ ebenso wie
„verursacht“.

## 4. Nur für Eltern

Wer beruflich Aufzeichnungen über fremde Kinder führt, hat dabei Pflichten
gegenüber den Familien, die ein Heft wie dieses nicht erfüllt: getrennte
Akten je Kind, Auskunft auf Verlangen, geregelte Aufbewahrung. Die
Abgrenzung steht im Text und ist Pflichtsatz im Validator. Für die
Kita-Dokumentation ist `apps/eingewoehnungs-tagebuch` da — ein
Fachkräfte-Werkzeug mit Kürzel statt Namen.

## 5. Zweckbestimmung, und zwei Wörter, die sie kippen

Die App dokumentiert Elternbeobachtungen. Sie ist kein Screening, keine
Untersuchung, keine Diagnostik. Das steht nicht nur im Text, sondern wird
durchgehalten: die Wörter „Früherkennung“ und „Prävention“ stehen nirgends
außerhalb einer Verneinung, weil schon ihre Verwendung die Einordnung einer
Software verschiebt — unabhängig davon, ob die App das leistet.

Fachliche Elternfragebogen werden namentlich als frei verfügbar genannt und
**nicht nachgebaut**: keine Wortliste, keine Punktwerte, keine Grenzwerte.

## 6. Speichern erst auf Knopfdruck

Geschrieben wird nur, wenn der Speichern-Knopf gedrückt wird: kein
`oninput`, kein Autosave, und im Modulrumpf steht kein `speichere()`. Im
Speicher liegt ein einziger Inhaltsschlüssel (`ewt.eintraege`), keine
Geräte- oder Nutzerkennung, kein `randomUUID`.

Der Zustand liegt im Arbeitsspeicher und wird durchgeschrieben — im privaten
Fenster wirft schon der Lesezugriff, und dann waren zwei Apps der Welle 78
funktionslos. Hier bleibt die App bedienbar und sagt, dass nichts behalten
wird.

Die technischen Grenzen stehen sichtbar: weg beim Löschen der Browserdaten,
im privaten Fenster, bei Gerätewechsel; kein Hintergrund-Backup; der Export
ist die einzige Sicherung. Dazu der Hinweis, den die Seite nicht lösen kann:
mobile Tastaturen lernen mit, und die Wortvorschläge des Telefons können
danach die Wörter des Kindes vorschlagen.

## 7. Export und Druck

Datei-Export als JSON über einen Download-Anker (keine Navigation zu einer
`blob:`-URL — das wäre unter der CSP `default-src 'self'` der Weg, der nicht
geht; der Anker ist ein Download und geht). Beim Einlesen wird **vor** der
Übernahme geprüft: ein Eintrag mit `name`, `geburtsdatum`, `alter` oder
`monate` wird verworfen, nicht übernommen, und die Meldung sagt das.

Das Druckblatt trägt Kopf („Beobachtungen der Eltern · kein Testergebnis ·
nicht geprüft · ohne Beurteilung“), Hinweis und die chronologische Rohliste.
Keine Zahl, keine Farbe, keine Auffälligkeitsaussage, kein Haken, keine
Namenszeile.

## 8. Was fehlt, und warum

- **Kein Vorlesen der Einträge.** Die Wörter des Kindes können in jeder
  Familiensprache sein; die gesetzte Stimme ist eine deutsche, und eine
  deutsche Stimme läse sie falsch. Vorgelesen werden nur die Rahmentexte,
  und ein Test prüft, dass kein Eintragsfeld in einen Vorlese-Aufruf gerät.
- **Keine Freitextfelder über Dritte.** Nicht über den anderen Elternteil,
  nicht über die Kita, nicht über eine Praxis.
- **Keine Paragrafen, Leitliniennummern oder Jahreszahlen** in den
  Oberflächentexten: die Rechtslage um ein solches Heft ist in Bewegung, und
  eine gedruckte Angabe veraltet schneller als die App gepflegt wird.
- **Keine Zusicherung, was das Lokalbleiben rechtlich bedeutet.** Es steht
  nur die technische Tatsache da.
- **Kein Papierkorb.** Gelöscht ist gelöscht, und das wird vorher gesagt.

## 9. Politik-Konformität (docs/02)

- [x] Keine Werbung, keine Käufe, keine kommerziellen Links.
- [x] Keine externen Anfragen: CSP plus `installiereNetzwerkWaechter()`.
- [x] `localStorage` mit genau einem Schlüssel und Löschknopf über
      `datenKarte`; `localStorage.clear()` kommt nicht vor.
- [x] Keine personenbezogenen Daten im Schema: kein Name, kein
      Geburtsdatum, kein Alter — und der Import kann sie nicht nachtragen.
- [x] Geordnet nach beobachtbarem Merkmal, nicht nach Lebensmonat.
- [x] Keine Gesamtwertung, kein Score, keine Ampel, kein „n von m“.
- [x] `hilfeInsel` nicht eingebunden: Erwachsenen-Werkzeug ohne
      Risikothema; eine Krisennummer auf einem Beobachtungsbogen wäre
      Rauschen.
- [x] Mobile-first ab 360 px, Touch ≥ 48 px, jedes Feld mit Label,
      Impressum im Fuß.
- [x] Druckknopf ⇒ eigenes `druck.css` ohne Haken, Punkte, Sterne,
      Tagesfelder und Namenszeile.

## 10. Tests

`test/logik.test.mjs` (17): Daten gültig; es wird nirgends gezählt (keine
Zählfunktion unter den exportierten **Funktionen**, keine Länge im Text,
`ZAHL_MIT_ALTER` als Gegenprobe in beide Richtungen); kein Geburtsdatum,
Alter oder Name — auch nicht durch den Import, und keine Altersangabe in
einer Art; die Arten sind keine Leiter (eine Gurrphase, der Satz an zwei
Stellen, leere Art bleibt sichtbar); Sprachen getrennt und ohne Summe, beide
falschen Richtungen zur Mehrsprachigkeit abgewiesen; Bewertungsvokabular nur
in den Feldern, die es ausschließen (mit Gegenprobe in einem anderen Feld und
in einer Art); „Früherkennung“ und „Prävention“ nur in einer Verneinung; nur
für Eltern; Speichern erst auf Knopfdruck (kein `oninput`, kein
`speichere()` im Rumpf, keine Gerätekennung); die technischen Grenzen stehen
da; Einträge werden gekürzt und getrimmt; Chronologie und Rohlisten-Export;
Datei sichern und einlesen mit Prüfung vor der Übernahme; Löschen ohne
Papierkorb; nur Rahmentexte werden vorgelesen; Druckblatt und Politik;
Hilfsfunktionen.
