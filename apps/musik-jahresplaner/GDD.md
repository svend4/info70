# Kurz-GDD: Musik-Jahresplaner für Fachkräfte

**Zielgruppe:** Musikfachkräfte und das Kita-Team. Erwachsene; kein Kinder-Bildschirm,
darum keine `eltern.html`.
**Gegenstand:** die Jahresplanung der Musikarbeit. Nicht Kinder, nicht Gruppen.
**Quelle:** Praleska, Musikteil der Gruppe «ПОЧЕМУЧКИ», S. 160–174. Katalog docs/10, Nr. 87.

## 1. Kernentscheidungen

1. **Kein Stück aus dem Buch.** Die Stückliste gehört der Fachkraft; die App liefert
   keine Titel. Aus der Quelle stehen nur Überschriften, Seiten und die fünf Festbeispiele
   von S. 174. Der Katalogeintrag verlangte eine Repertoire-Liste; die wird nicht gebaut.
2. **Herkunft nur als feste Auswahl.** Vier Optionen. Die App sagt nichts über Gemeinfreiheit
   oder Urheber. Die Optionen „Fachkraft prüft“ und „Fachkraft notiert“ legen die Prüfung
   ausdrücklich bei der Fachkraft ab.
3. **Keine Gesamtzahl, keine Quote.** Die einzige Zählung ist je Monat über die eigenen
   Einträge. Eine Gesamtzahl wirkte wie eine Quellenzahl, eine Quote wie ein Soll.
4. **Die Monatsübersicht wird von Hand geführt.** Die Häkchen sind Eigenentwurf und dienen
   der Erinnerung. Die App wertet sie nicht aus.
5. **Feste als Anregung.** Die Beispiele von S. 174 stehen mit Seite; die deutschen
   Übersetzungen sind Eigenentwurf. Eigene Vorschläge tragen die Kennzeichnung „Vorschlag,
   nicht aus der Quelle“. Feste werden keinen Monaten oder Jahreszeiten zugeordnet, weil
   die Quelle das nicht vorgibt.
6. **Der Jahresbogen hat keine Zählung, keine Namen und keine Häkchen.** Er zeigt jeden
   Monat mit den fünf Bereichen und leeren Linien. Auf dem Papier stehen weder Knopf
   noch Eingabefeld; der Bildschirmteil fällt im Druck weg (druck.css).
7. **Gespeichert wird nur die eigene Stückliste mit den Häkchen,** unter einem Schlüssel
   (`mjp.stand`). Der Löschknopf kommt aus der Daten-Karte. Kinderdaten, auch als
   Monats-Häkchen mit Namen, gibt es nicht; das Titelfeld bittet um keine Namen von Kindern,
   prüft das aber nicht.
8. **Keine Zufallszahlen.** Die Nummern der Stücke sind fortlaufend. Der Kern ist ohne DOM
   und deterministisch.
9. **Fehlerhafter Speicher ist kein Absturz.** Der Plan läuft ohne Speicher weiter und sagt
   dann, dass er nur bis zum Neuladen gilt.

## 2. Offen (Entscheidung des Teams)

- **Reihenfolge der Monate.** Die App zeigt Januar bis Dezember. Ein Kitajahr ab September
  wäre eine eigene Entscheidung.
- **Bereichsbezeichnungen.** „Musikalisch-rhythmische Tätigkeit und Tanz“ und „Spiel auf
  Instrumenten“ sind Eigenbenennungen zur Abnahme.
- **Festvorschläge.** Erntedank, St. Martin, Advent, Fasching und Frühlingsfest stammen aus
  dem Katalogeintrag, nicht aus der Quelle. Übernehmen, streichen oder ergänzen?
- **Feste im Plan.** Feste sind nur Anregung und zählen nicht als Stück. Ob sie eigene
  Planungseinträge bekommen sollen, ist offen.
- **Export.** Die Stückliste lässt sich nur drucken, nicht als Datei speichern. Gewünscht?

## 3. Befunde beim Bau

- **Überschrift des Bereichs Instrumente.** Der Auftrag nannte „Игра на музыкальных инструментах“
  (S. 170–172). Auf S. 170 steht im Original „Обучение элементам нотной грамоты, игре на
  музыкальных инструментах“. Die App zeigt die Fassung der Quelle. Bitte bestätigen.
- **Katalogeintrag Nr. 87.** Er nennt eine Stückzahl der Quelle und legt die Feste auf
  Jahreskreis-Zeiten fest. Beides ist nicht übernommen: Die Zahl ist eine Gesamtzahl der
  Quelle, und die Quelle gibt keine Jahreskreis-Zuordnung vor.
- **Seitenspannen** sind an den Überschriften gegengeprüft. Die Kopfzeilen der Seiten
  entsprechen der gedruckten Seitenzahl.

## 4. Prüfungen

- **Tests:** 33 Tests in `test/logik.test.mjs`, Lauf mit `node --test` im Ordner des Projekts.
  Alle grün.
- **Browserprobe** einmalig gegen den lokalen Server, nicht im Repo: Laden ohne Konsolenfehler
  und ohne Anfrage an fremde Adressen; Stück anlegen, Häkchen setzen, Neuladen; Entfernen;
  Löschknopf; Druckansicht ohne Eingabeelemente; 390 px ohne horizontalen Scroll; gesperrter
  Speicher mit Hinweis.
- **Repo-weite Prüfungen,** die dieses Projekt berühren, siehe Abschnitt 5.

## 5. Außerhalb dieses Ordners (nicht geändert)

- `impressum.html`: Die Zahl der speichernden Apps steigt um eins, weil die App eine Stückliste
  ablegt. Der Test in `packages/kinderschutz/test/datenschutz-zusage.test.mjs` verlangt die
  neue Zahl.
- `README.md` (Wurzel): Die Gesamtzahl der Tests im Repo steigt um die 33 neuen Tests.
- `docs/10-praleska-baukasten.md`: Eintrag Nr. 87 und Statuszeile (gebaut, offene Nummern).
- `index.html` (Hub) und ggf. Katalog-Übersichten: Eintrag der App.
