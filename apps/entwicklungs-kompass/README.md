# 🧭 Angebots-Kompass Kita

Командный чек-лист для педагогических Fachkräfte (Team-Checkliste). Пять Bereiche
по шесть Prüfpunkte (30 всего). Каждый Prüfpunkt — это **Angebot des Erwachsenen**:
Raum, Material, Handlung der Fachkraft. Ответ на каждый Prüfpunkt: **umgesetzt /
noch offen / trifft nicht zu**. Zählung только **je Bereich** («erfüllt: 3 von 6»),
без общей суммы и без процентов. Выход — печатный Druckbogen для Teambesprechung.

**Статус: v0.2.0.** Переработка прежнего «Entwicklungs-Kompass Kita» (v0.1: Beobachtungsbogen
je Kind). Папка осталась `apps/entwicklungs-kompass`, поэтому ссылки из Hub,
eltern-sammelband и корневого README не сломаны (см. GDD, раздел «Вне папки»).

## Что entfällt (по сравнению с v0.1)

- Beobachtung je Kind: Kürzel, Stufen (noch nicht / manchmal / sicher), Bericht je Kind.
- Kopieren des Berichts in die Zwischenablage.
- Datei-Export und -Import (Koffer: `kompass.mjs` und sein Test).
- Gesamtzahl und Fortschrittsanzeige in Prozent.

## Was gespeichert wird: nichts

- Die Seite schreibt nichts: kein `localStorage.setItem`, kein `sessionStorage`, keine
  IndexedDB, keine Cookies (geprüft in `test/quellcode.test.mjs`).
- Die Angaben (umgesetzt / noch offen / trifft nicht zu) liegen nur in einer Variable der
  Seite und sind nach dem Neuladen weg.
- **Altbestand-Bereinigung:** Beim Start wird `ek.daten` einmal per `localStorage.removeItem`
  entfernt, in try/catch (`bereinigeAltbestand()` in `logik.mjs`). Nur entfernen, nie schreiben.

## Merkmal-Kennungen (Eigenentwurf)

Jeder Prüfpunkt trägt das Feld `quelleMerkmal`. Oberfläche und Druckbogen zeigen dazu
„Eigenentwurf nach Merkmal S18.6“. Zitate stehen nicht im Fließtext.

**Kennung:** `S<Seite>.<Nr>`. Gemeint sind die Seite der Quelle und die laufende Nummer des
Aufgaben-Spiegelstrichs auf dieser Seite. Die Nummerierung ist eine Setzung dieses Projekts,
die Quelle nummeriert nicht. Überschriften mit Unterpunkten zählen nicht mit.

**Quelle:** Программа «Пралеска» (Национальный институт образования, Минск, 2007), Seiten 17–19.
Seitenzahl = Anzahl der Formfeeds davor + 1. Die Zitate sind wörtlich (Auszug), ohne
Silbentrennung am Zeilenende.

### Register (`daten/indikatoren.json`, Feld `merkmale`)

| Kennung | S. | Wortlaut (Auszug aus der Quelle) | Prüfpunkte |
|---|---|---|---|
| S17.3 | 17 | «выявление степени психологического здоровья» | sprache-4 |
| S17.4 | 17 | «изучение развитости социальных эмоций» | sozial-2, sozial-6 |
| S18.1 | 18 | «выявление уровня уверенности в себе» | spiel-5 |
| S18.2 | 18 | «общение и взаимоотношения в важных …» | sprache-1, sozial-1, sozial-3 |
| S18.6 | 18 | «определение исходного уровня двигательной активности» | bewegung-1 |
| S18.7 | 18 | «изучение состава движений самостоятельной» | bewegung-2, bewegung-3, bewegung-5, bewegung-6 |
| S18.8 | 18 | «оценка уровня физической подготовленности» | bewegung-4 |
| S18.10 | 18 | «изучение познавательной сферы детей» | sprache-2, sprache-3, denken-2, denken-3, denken-4, denken-5, denken-6 |
| S19.1 | 19 | «выявление особенностей личности воспитанников» | sprache-5, spiel-3 |
| S19.2 | 19 | «познание волевой сферы детей» | sprache-6, sozial-4, sozial-5, denken-1, spiel-1, spiel-2 |
| S19.3 | 19 | «изучение деятельности воспитанников» | spiel-4, spiel-6 |

### Nicht übernommen (bewusst)

- S17.1 «определение физического состояния, здоровья» und S17.2 «изучение резервных возможностей детского организма»: Gesundheit und Reserven des Kindes sind Sache der Ärztin bzw. des Arztes, kein Angebot des Erwachsenen.
- S18.3 «социометрический статус ребенка в «детском обществе»»: würde eine Rangordnung von Kindern ergeben (verboten).
- S18.4 «влияние родителей, стиля их поведения …»: Erziehungsstil der Familie, nicht Gegenstand dieser Checkliste.
- S18.5 «выявление на основе полученной информации»: Einstufung, wer Hilfe braucht, also eine Bewertung eines Kindes (verboten).
- S18.9 «выявление индивидуальных психологических»: Temperament und Fähigkeiten eines Kindes, also eine Klassifikation (verboten).
- S19.4 «познание своего профессионального «Я»»: Selbstdiagnose der Fachkraft, passt nicht zu den fünf Bereichen.

## Technik

- ES-Module ohne Abhängigkeiten. Bausteine: `kinder-ui` (`el`, `lokaleStimme`, `vorlesen`) und
  `kinderschutz` (`installiereNetzwerkWaechter()`, beim Start aufgerufen).
- CSP `default-src 'self'; style-src 'self' 'unsafe-inline'`. Keine externen Anfragen, keine
  fremden Skripte, keine Adressen im Quelltext.
- Beim Klick werden nur die Knöpfe der Zeile, die Zählung des Bereichs
  aktualisiert, nicht die ganze Seite. Umschalter mit `aria-pressed`, jeder Knopf trägt den
  Prüfpunkt im `aria-label`.
- **Vorlesen** läuft nur mit einer Stimme, die auf dem Gerät liegt (`localService`). Gibt es keine,
  erscheint ein Hinweis, und es wird nicht vorgelesen.
- **Druck:** `druck.css` mit `@media print`. Bedienteile verschwinden, der leere Druckbogen erscheint (☐ zum Abhaken von Hand).
  Keine Namenszeile.

## Dateien

- `index.html`: Hülle, CSP, Stylesheets.
- `app.mjs`: DOM-Schicht. `logik.mjs`: reine Logik ohne DOM.
- `daten/indikatoren.json`: Katalog mit Auswahl, Merkmal-Register und 30 Prüfpunkten.
- `druck.css`: Druckbogen. `eltern.html`: Info für Träger und Leitung.
- `test/`: Tests (siehe unten).

## Tests

25 Tests in 3 Dateien: `test/indikatoren.test.mjs` mit 7 Prüfungen, `test/logik.test.mjs` mit 10,
`test/quellcode.test.mjs` mit 8.

```bash
node --test apps/entwicklungs-kompass/test/*.test.mjs
```

Ergebnis: 25 von 25 grün.

## Quellen

- Программа «Пралеска» (НИО, Минск, 2007), S. 17–19: Merkmale laut Register.
- Herkunft des Konzepts: `docs/10-praleska-baukasten.md`, Katalog Nr. 2 (Top-30 №1).
- Regel: `docs/02-anforderungen.md`, Z. 141–146. Ein Kind wird nicht bewertet. Bewertet werden
  die eigenen Handlungen der Fachkraft und der Gegenstand.

## Seitenangaben (Serie C, Welle 2, 29.10.2026)

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

Geprüft: 41 Angaben (Werkzeug: 8) in README, GDD, app.mjs, eltern.html, indikatoren.json und dem Register. Maschinell, nicht von einem Menschen geprüft.

- Die Zahl 11 stimmt: Das Register hat elf Merkmale, alle werden in Prüfpunkten genutzt. Mit den sieben ausgeschlossenen ergeben sich 18 Aufgaben-Spiegelstriche auf S. 17 bis 19 (4, 10 und 4). Die Wortlaute der Merkmale stehen auf der genannten Seite.
- Die Quelle nummeriert ihre Punkte nicht. Die Kennung S18.6 ist eine Zählung dieser App: Seite 18 und der sechste Aufgaben-Spiegelstrich auf dieser Seite. Die Angaben in app.mjs, eltern.html und im Register sind dafür entsprechend formuliert (Korrektur 29.10.2026; vorher hieß es „nennt Seite und Merkmal im Programm“). Ob die Zählung im Register als „nicht belegt“ gelten soll, ist Frage 77.
- Kürzung der Zitate auf höchstens sechs Wörter (Frage 62): zwei Zitate in der Tabelle und der Ausschlussliste der README hatten je sieben Wörter; sie sind auf fünf Wörter und eine Auslassung gekürzt, ebenso der Wortlaut S18.2 in daten/indikatoren.json. Vorher stand dort der volle Wortlaut.
- Hinweis: Die Zuordnung „Feinmotorik unter S18.7“ (GDD) findet sich auf S. 17 bis 19 nicht im Wortlaut. Die Zuordnung ist Eigenentwurf, und die GDD nennt sie bereits als großzügig.
- Keine Befunde bei der Seitenzahl: S. 17 bis 19 stimmen.
