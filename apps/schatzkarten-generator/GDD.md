# GDD: Schatzkarten-Generator

**Katalog:** docs/10 (Praleska-Baukasten), Nr. 90. **Zielgruppe der Bedienung:** Erwachsene. **Zielgruppe der Ausdrucke:** Kinder, die draußen oder im Raum spielen.

## 1. Kernentscheidungen

1. **Erwachsene erzeugen, Kinder spielen mit Papier.** Die App ist kein Kinderspiel am Gerät. Es gibt keine Punkte, keine Bewertung und keine Rangfolge von Kindern.
2. **Keine Speicherung.** Die Eingaben liegen nur im Speicher der Seite. Es gibt kein `localStorage`, keinen Cookie und kein IndexedDB.
3. **Keine externen Anfragen.** Die Seite arbeitet lokal und ist nach dem ersten Laden offline lauffähig. Der Netzwerkwächter aus `packages/kinderschutz` ist beim Start aktiv.
4. **Zufall nur über den Parameter `rng`.** Die Logik in `logik.mjs` ruft `Math.random` nicht auf. Mit einem festen Zufallsgeber sind alle Karten in den Tests reproduzierbar.
5. **Richtungen vom Kind aus.** Die Startmarke zeigt nach vorn. Links und rechts gelten immer vom Kind aus, nie vom Bildschirmrand. Die Karten verwenden keine „oben“- oder „unten“-Angaben.
6. **Druck ohne Lösung.** Die Raster-Karte zeigt weder Ziel noch Weg. Die Wegkarten beschreiben den Weg in Schritten; daraus ist das Ziel ableitbar. Das ist gewollt, denn die Kinder gehen die Wegkarten ab. Das Lösungsblatt hat einen eigenen Druckbereich (`body[data-druck="loesung"]`) und wird nur über seinen eigenen Knopf gedruckt. Der Druck enthält keine Kästchen, keine Häkchen und keine Zeile für einen Namen.
7. **Zeichen als Text.** Die sechs Zeichen sind Unicode-Textzeichen, keine Bilddateien. Verkehrszeichen (S. 302) sind nicht Teil der Liste.
8. **Quelle eng gehalten.** Aus dem Programm «Пралеска» stammen nur die Spielnamen von S. 246 (eigene Übersetzung) und die Seitenanker. Regeln oder Kartenformen stammen nicht aus der Quelle. Alles andere ist als Eigenentwurf gekennzeichnet.

## 2. Ablauf (Eigenentwurf)

1. Der Erwachsene wählt Gittergröße, Ort und Anzahl der Zeichen. Die Seite erzeugt eine Karte, sobald „Neue Karte erzeugen“ gedrückt wird.
2. Die Karten werden gedruckt: Raster, Zeichen, Wegkarten.
3. Das Lösungsblatt bleibt beim Erwachsenen.
4. Der Erwachsene stellt den Start her, versteckt den Gegenstand auf dem Ziel (Vorschlag der App) und gibt die Wegkarten in Reihenfolge aus.
5. Die Kinder gehen die Wegkarten ab. Die Zeichen auf dem Weg werden genannt.

## 3. Logik

- **Start und Ziel:** Der Start wird gleichverteilt über alle Felder gezogen. Das Ziel wird unter allen Feldern gezogen, die mindestens (Gittergröße − 1) Schritte entfernt liegen.
- **Weg:** Breitensuche über benachbarte Felder, die Richtungen in fester Reihenfolge. Der Weg ist daher immer ein kürzester Weg und für gleiche Karten gleich.
- **Zeichen:** Die Arten werden gemischt, die ersten Felder bekommen Zeichen. Start und Ziel bleiben frei.
- **Abschnitte:** Ein Abschnitt endet bei einem Richtungswechsel und bei einem Feld mit Zeichen. Das Zeichen wird im Satz genannt („Dort liegt der Kreis.“).
- **Drehung:** Blickrichtung am Start ist Norden (vorn). Jede Richtung wird relativ zur bisherigen Blickrichtung als geradeaus, rechts, links oder umdrehen ausgegeben.

## 4. Offene Punkte (Entscheidung nötig)

1. **Feldmaß.** Ein Feld ist eine Strecke, die der Erwachsene vor dem Spiel festlegt. Die App legt kein Maß fest. Vorschlag: ein großer Schritt.
2. **Lesen.** Die Wegkarten sind Text. Kinder dieser Altersgruppe können oft noch nicht sicher lesen, und die App hat keine Vorlesefunktion. Offen ist, ob Erwachsene vorlesen oder ob die Karten später Bildsymbole erhalten.
3. **Zeichenfont.** Die Textzeichen (● ▲ ◆ ■ ♥ ☀) hängen von der Systemschrift ab. Vor dem Druck sollte die Darstellung auf einem Drucker geprüft werden.
4. **Zielgruppe.** Die Quelle nennt für «Фантазеры» das Alter von fünf bis sechs oder sieben Jahren, für «Почемучки» von drei bis fünf (S. 6). Der Katalogtext nennt „Kinder 5-7“. Offen ist, ob auch die jüngere Gruppe angesprochen wird; dann wären kleinere Gitter sinnvoll.
5. **Katalogtext.** Der Katalogeintrag (docs/10, docs/praleska-katalog.json) nennt als Begründung für die Bildschirmarmut eine externe Linie. Diese Begründung wird in der App nicht verwendet und sollte im Katalog gestrichen werden. Auch der Bezug „Raum-Lage-Orientierung als mathematische Frühbildung“ ist ein Katalogvorschlag und keine Aussage der Quelle; die App behauptet ihn nicht.
6. **Erprobung.** Vor einem Release soll die Wegbeschreibung mit der Zielgruppe getestet werden (docs/02, Release-Liste).
7. **Impressum.** Die App speichert nichts und zählt im Impressum zu den Apps ohne Speicherung. Die Zahlen dort müssen mit dem Katalog abgeglichen werden.

## 5. Quellen

- S. 246, Abschnitt „Подвижные игры“: die Spielnamen «С картой в путь» und «Спрячь предмет и опиши путь к нему».
- S. 6: Altersgruppen «Почемучки» und «Фантазеры».
- S. 233 und 234: Orientierung auf dem Blatt; Plan lesen.
- S. 138: Plan mit Zeichen.
- S. 245: Plan-Schema für Rätsel.
- S. 247: Spiele im Freien bei verschiedenen Jahreszeiten.
- S. 302: Verkehrszeichen als Entwicklungsindikator (Kenntnis üblicher Zeichen), nicht als Spielmaterial.

## 6. Tests

23 Tests in zwei Dateien: `test/logik.test.mjs` mit 18 Prüfungen zur Logik und zu den Ausgaben, `test/aufbau.test.mjs` mit 5 Prüfungen zu HTML, Druck-CSS, Quelltext und Quellenhinweis. Ausführung: `node --test apps/schatzkarten-generator/test/*.test.mjs`.

## 7. Politik (docs/02)

- Keine Kinderdaten, keine Namen, keine Bewertung von Kindern.
- Keine Werbung, keine Käufe, keine Links zu fremden Angeboten.
- Keine Anfragen an fremde Server; Netzwerkwächter aktiv; Schriften und Skripte nur lokal.
- Keine Speicherung auf dem Gerät.
- Keine Anbindung an externe Dienste, auch nicht zur Erzeugung von Texten oder Karten.

## Vorlesen (Entscheidung 28а)

Keine Vorlese-Pflicht. Dieses Werkzeug richtet sich an Erwachsene. Die Zeile „есть озвучивание“ der Checkliste in `docs/02-anforderungen.md` gilt für Kinder-Apps (Ergänzung 28а vom 27.10.2026, am 29.10.2026 in die GDD übernommen).
