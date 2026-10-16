# Kurz-GDD: Mini-Oper-Baukasten (offline, ohne KI)

**Zielgruppe:** Erwachsene, Musikfachkräfte und das Kita-Team. Kein Kinder-Bildschirm, darum keine `eltern.html`.
**Gegenstand:** ein Gerüst für eine kleine Musikszene als Impuls. Nicht Kinder, nicht Gruppen.
**Quelle:** Praleska, Musikteil, Gruppe «ФАНТАЗЕРЫ», S. 262, S. 269, S. 270. Katalog docs/10, Nr. 91.

## 1. Kernentscheidungen

1. **Ein Impuls, kein Skript.** Das Gerüst ersetzt das gemeinsame Komponieren nicht. Die Quelle
   nennt als Ziel, Kinder anzuregen (S. 262); die App erzeugt keine Handlung und keinen Text.
2. **Keine Texte aus der Quelle.** Es stehen keine Texte, keine Noten und keine Abbildungen darin.
   Die 18 Titel von S. 269 stehen nur mit Seitenangabe, ohne Text und Musik.
3. **Titel, nicht Märchen.** Nicht alle Titel sind Märchen. Die App nennt sie „Titel“, nicht
   „Märchen“, und trifft keine Aussage über Autorinnen, Autoren oder Schutzfristen.
4. **Keine Figur-Instrument-Zuordnung.** Der Klang-Hinweis bindet die Klangfarbe an den Charakter
   der Musik oder an einen Teil des Stücks (S. 270). Die Instrumentenbeispiele sind Eigenentwurf
   ohne Quellenbezug und ohne Zuordnung zu Figuren.
5. **Platzhalter statt Namen.** Die Rollen heißen „Rolle 1“ bis „Rolle 6“. Die Stichwort-Felder
   bitten um keine Namen von Kindern; der Inhalt wird nicht geprüft.
6. **Zufall nur über eine übergebene Funktion.** Der Kern ist ohne DOM. Die Tests sind deterministisch,
   weil die Zufallsquelle eine Testfunktion sein kann.
7. **Keine Speicherung.** Der Zustand lebt nur im Speicher der Seite. Der Gerüstbogen zeigt keine Eingaben.
8. **Druckbogen ohne Kästchen, ohne Häkchen, ohne Namenszeile.** Nur leere Linien zum Ausfüllen.
9. **Titel in der Schreibweise der Quelle.** Keine Übertragung ins Deutsche, damit jede Angabe am
   Original nachprüfbar bleibt.

## 2. Offen (Entscheidung des Teams)

- **Name.** Der Name „Mini-Oper-Baukasten (offline, ohne KI)“ steht wie beauftragt. Der Zusatz „ohne KI“
  enthält das Kürzel als Verneinung, während die Verbotsliste des Auftrags das Kürzel im Namen ausschließt.
  Bitte bestätigen oder den Zusatz ändern.
- **Katalogeintrag Nr. 91.** docs/10 (Zeile 438) und docs/praleska-katalog.json beschreiben in Engine, Beschreibung
  und Adaption eine andere App: eine Engine mit Modellbezug, Hinweise „welches Instrument für welche Figur“,
  Märchen-Adaptionen mit Gemeinfreiheitsaussage und eine uk/ru-Märchenoption. Das ist nicht übernommen.
  Die Zielgruppe „Erwachsene (für Kinder 5-7)“ passt dagegen zur App. Eintrag umschreiben?
- **Deutsche Figurennamen und Requisiten.** Libelle, Ameise und die übrigen Namen sind Eigenübersetzungen,
  die Requisitenliste und die Instrumentenbeispiele sind Eigenentwurf. Zur Abnahme.
- **Titel auf dem Bogen.** Der gewählte Titel steht als Überschrift auf dem Druckbogen. Ob das so bleiben soll, ist offen.
- **Zahlen.** 3 bis 5 Szenen und 2 bis 6 Rollen sind Eigenentwurf. Ob andere Grenzen passen, entscheidet das Team.
- **Zielgruppe.** Die App ist für Erwachsene gebaut. Eine Variante für Kinder wäre eine eigene Entscheidung
  nach docs/02.

## 3. Befunde beim Bau

- **Titelzahl.** Die Quelle nennt auf S. 269 18 Titel in «» (Zählung über den Textauszug). Im Auszug sind keine
  Nummern sichtbar; die App nennt die Zahl und keine Nummern.
- **Vorlagenverweise auf S. 269.** Bei fünf Titeln steht dort der Verweis auf die Vorlage: vier nach Andersen,
  einer nach Garschin. Die App übernimmt keine Autorenangaben.
- **S. 255.** Die Literaturliste dieser Seite wurde geprüft und nicht übernommen. Die App nutzt nur die
  Titel von S. 269.
- **Statuszeile docs/10.** Mit dieser App wären 21 von 27 Einheiten gebaut. Die Zeile ist nicht geändert.

## 4. Prüfungen

- **Tests:** 19 Tests in `test/logik.test.mjs`, Lauf mit `node --test apps/mini-oper-baukasten/test/*.test.mjs`.
- **Repo-Regeln:** die Druck-, Netzwerk-, Umlaut- und Zahlen-Tests des Repos, die diesen Ordner berühren,
  wurden gelaufen; zwei Abweichungen liegen außerhalb dieses Ordners (Abschnitt 5).
- **Keine Browserprobe.** Die Module sind syntaktisch geprüft. Laden, Druckansicht und 360 px sind im
  Browser noch nicht gegengeprüft.

## 5. Außerhalb dieses Ordners (nicht geändert)

- `impressum.html`: Die Zahl der Apps ohne Speicherung steigt um eins. Der Test in
  `packages/kinderschutz/test/datenschutz-zusage.test.mjs` erwartet dann eine Zahl um eins höher. Vor dieser
  App war der Test bereits rot (erwartet 103, steht 102).
- `README.md` (Wurzel): Die Gesamtzahl der Tests im Repo steigt um 19. Vor dieser App war die Zahl bereits
  falsch (nennt 1912, gezählt 1968).
- `docs/10-praleska-baukasten.md`: Eintrag Nr. 91 und Statuszeile.
- `docs/praleska-katalog.json`: Eintrag „Mini-Oper-Baukasten“.
- Hub (`index.html`) und Katalog-Übersichten: Eintrag der App.
