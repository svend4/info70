# 🧭 Angebots-Kompass Kita — Kurz-GDD

## 1. Феномен / потребность (Warum)
Команда Kita должна регулярно prüfen, ob ihre **Angebote** stimmen: Raum, Material und
eigenes Handeln der Fachkraft. Ohne Werkzeug bleibt das in Köpfen oder auf Zetteln, und
die Teambesprechung hat keine gemeinsame Grundlage. Die Vorgängerfassung (Beobachtungsbogen
je Kind, Schlüssel `ek.daten`) hat genau diese Lücke nicht geschlossen, sondern Kinder
dokumentiert und in Stufen gefasst. Das ist nach docs/02, Z. 141–146, nicht zulässig.

## 2. Игрок и обещание (Wer + Kernerlebnis)
Nutzer: **Fachkraft und Team** (Kita). Kein Kinder-Bildschirm.
Ein Satz: «Das Team hakt in fünf Bereichen ab, was am Raum, am Material und am eigenen
Handeln umgesetzt ist, und druckt den Bogen für die Besprechung. Kein Kind wird dabei erfasst.»

## 3. Движок и петля (Wie)
Motor: Erwachsenen-Werkzeug. Dünner DOM-Layer (`app.mjs`) über reiner Logik (`logik.mjs`)
und einem JSON-Katalog (`daten/indikatoren.json`) mit Merkmal-Register.
Schleife: Bereich öffnen → je Prüfpunkt eine der drei Auswahlmöglichkeiten wählen (erneuter
Klick nimmt sie zurück) → Zählung des Bereichs aktualisiert sich. Der Druckbogen bleibt leer.
Keine Speicherung, kein Export, kein Import.

## 4. Lernziele (проверяемые!)
1. Fachkraft kann die Angebote von Raum, Material und eigenem Handeln in fünf Bereichen
   prüfen und jeden Prüfpunkt als umgesetzt, noch offen oder trifft nicht zu markieren.
2. Team kann den leeren Druckbogen für die Besprechung nutzen und die Zählung je Bereich
   vom Bildschirm lesen, ohne Gesamtzahl und ohne Prozentwert.
3. Fachkraft kann erklären, warum die Seite nichts über Kinder erfasst und nichts bewertet
   (docs/02, Z. 141–146).

## 5. Контент-план
Einheit: **Prüfpunkt** = Angebot des Erwachsenen mit Merkmal-Kennung. MVP: 5 Bereiche × 6
Prüfpunkte (30) plus 3 Auswahlmöglichkeiten. Die Auswahl heißt bewusst nicht Stufe, es gibt
keine Rangfolge. Merkmal-Register: 11 verwendete Merkmale aus S. 17–19 des Programms
Praleska mit wörtlichen Auszügen (Tabelle in README.md).
Tests erzwingen 5/6/3, global eindeutige Kennungen mit Bereichs-Präfix, Pflicht-Merkmal
je Prüfpunkt und ein Register ohne tote Einträge.

## 6. Политика соответствия (Pflicht, docs/02)
[x] Werbefrei, keine Käufe, keine Links zu kommerziellen Seiten
[x] Keine Kinderdaten: kein Name, kein Kürzel, keine Angabe je Kind, keine Eingabefelder
[x] Keine Speicherung auf dem Gerät: kein `setItem`, kein `sessionStorage`, keine IndexedDB,
    keine Cookies; nur das Entfernen des Altbestands (`ek.daten`) beim Start
[x] Keine externen Anfragen: CSP `default-src 'self'` und `installiereNetzwerkWaechter()`
[x] Keine Bewertung eines Kindes: keine Ampel, keine Stufe, keine Punkte, keine Prozent,
    keine Rangfolge (docs/02, Z. 141–146)
[x] Modellnamen: keine in Dateien, Kommentaren oder Texten (Test in `quellcode.test.mjs`)
[x] Barrierefreiheit: Umschalter mit `aria-pressed`, Knopf trägt den Prüfpunkt im `aria-label`
[x] Vorlesen nur mit einer Stimme auf dem Gerät (`localService`), sonst Hinweis
[x] Druckbogen: `druck.css` mit `@media print`, keine Namenszeile
[x] eltern.html für Träger und Leitung, Titel und `lang` erhalten, Struktur für den Sammelband
[x] Impressum und Datenschutz verlinkt (`../../impressum.html`)

## 7. Kernentscheidungen (Stand v0.2.0)
- **Variante A (Entscheidung des Nutzers):** Die App bewertet kein Kind mehr und speichert
  keine Kinderdaten auf dem Gerät. Die Zielgruppe sind Angebote des Erwachsenen.
- **Drei Auswahlmöglichkeiten ohne Rangfolge:** umgesetzt, noch offen, trifft nicht zu.
- **Zählung nur je Bereich** («erfüllt: 3 von 6»), keine Summe über alle Bereiche, keine
  Prozentwerte, kein Balken in Prozent. Der Nenner ist immer die Zahl der Prüfpunkte des
  Bereichs; «trifft nicht zu» zählt also nicht als erfüllt.
- **Merkmal-Kennung je Prüfpunkt** und die Kennzeichnung «Eigenentwurf nach Merkmal …».
  Die Nummerierung der Merkmale ist eine Setzung dieses Projekts.
- **Ausgeschlossene Merkmale** (nicht übernommen, Begründung in README.md): Gesundheit und
  Reserven eines Kindes, Stellung in der Kindergruppe (Rangordnung), Einfluss der Eltern,
  Einstufung von Hilfebedarf, Temperament und Fähigkeiten, Selbstdiagnose der Fachkraft.
- **Keine Speicherung:** Der Zustand lebt nur im Speicher der Seite. Beim Start wird der
  Altbestand `ek.daten` einmal entfernt (try/catch, nur Entfernen).
- **Kein Export, kein Import, kein Koffer.** `kompass.mjs` und sein Test sind entfernt.
- **Vorlesen** nur mit einer Stimme, die auf dem Gerät liegt. Sonst bleibt es still, und die
  Seite zeigt einen Hinweis.
- **Keine Rechtsangaben.** Der Verweis auf § 22a SGB VIII und die Aussage über eine
  Beobachtungspflicht in allen Bildungsplänen aus der Vorgängerfassung sind entfernt. Die
  Aussage passt nicht zu einer Team-Checkliste und ist nicht gegen docs/ geprüft. docs/10
  nennt § 22a nur bei anderen Einträgen. Eine rechtliche Prüfung steht offen (siehe unten).

## 8. Стандарты и финансирование (Wofür)
Stand: DSGVO (keine personenbezogenen Daten, keine Speicherung), docs/02 Z. 141–146
(keine Bewertung eines Kindes). Der Förderbezug bleibt wie bisher offen (docs/08).

## 9. Аджайл-оценка
Aufwand: S bis M. Wiederverwendet: `kinder-ui` (`el`, `lokaleStimme`, `vorlesen`, CSS),
`kinderschutz` (`installiereNetzwerkWaechter`), Katalog-Muster aus `foerder-navigator`.
Prüfung: 25 Tests in drei Dateien (`node --test apps/entwicklungs-kompass/test/*.test.mjs`).

## 10. Test-Hypothesen mit Fachkräften
Teamtest mit 5 bis 8 Fachkräften: Sind die 30 Angebote für eine Gruppe vollständig genug?
Verstehen alle, dass «erfüllt: 3 von 6» nur die eigene Zählung eines Bereichs ist und keine
Bewertung? Wird der Druckbogen in der Besprechung genutzt? (Protokoll: docs/05, Methode 5.)

## Offen (Entscheidungen des Teams)
1. Ordnername: Die Seite heißt jetzt Angebots-Kompass, der Ordner bleibt `entwicklungs-kompass`.
   Umbenennen würde Hub, Sammelband, Wurzel-README und mehrere GDD-Verweise betreffen.
2. Rechtliche Einordnung und Verweise (§ 22a SGB VIII, Landes-Bildungspläne) sind nicht
   gegen docs/ belegt und deshalb entfernt. Ob und wie sie wieder aufgenommen werden, entscheidet das Team.
3. Die Zuordnung der Prüfpunkte zu den Merkmalen ist ein Eigenentwurf und in Teilen
   großzügig (z. B. Feinmotorik unter S18.7). Eine Durchsicht durch eine Fachkraft ist offen.
4. docs/10 Z. 412 und Z. 431 (Wellen 82 und 87) führen den Beobachtungsbogen je Kind noch als
   offene Frage. Durch Variante A ist sie beantwortet. Die Dokumente sind außerhalb dieser App
   zu aktualisieren.

## Außerhalb des Ordners (nicht geändert)
- `index.html` (Hub): Linktext «🧭 Entwicklungs-Kompass – Beobachtungsbogen» und Linkziel
  `apps/entwicklungs-kompass/` (Ordner unverändert, Text anpassen).
- `README.md` (Wurzel), Zeile `entwicklungs-kompass`: Beschreibung «Лист наблюдения развития»
  passt nicht mehr.
- `apps/eltern-sammelband/daten/apps.json`: Eintrag `entwicklungs-kompass` bleibt gültig,
  da `eltern.html` vorhanden ist.
- `apps/eingewoehnungs-leitfaden/GDD.md`, `apps/meilenstein-begleiter/GDD.md`,
  `apps/elternbrief-generator/GDD.md`, `apps/buchecke-check/GDD.md`: nennen
  `entwicklungs-kompass` als Nachbarn oder als Beispiel für localStorage. Die letzte Angabe
  ist falsch geworden.
- `apps/schulstart-begleiter/`: eigene Kopie von `logik.mjs` und `kompass.mjs`, verweist als
  Muster auf diesen Ordner. Keine Importe, nur Kommentare und Texte.
- `docs/10-praleska-baukasten.md`, `docs/11-kinderrechte-charta.md` Z. 105 und
  `docs/praleska-katalog.json`: Nennungen des Eintrags als Beobachtungsbogen.

## Offen (Welle 88)

- Merkmal-Auswahl: S17.3, S18.1 und S19.1 sind übernommen, liegen aber nahe an der Einstufung, die S18.5 ausschließt. Eine Fachkraft entscheidet, ob sie bleiben oder ersetzt werden.
- Leere Kästchen auf dem Druckbogen: docs/02 Z. 79–80 nennt Haken auf dem Papier; die Frage liegt beim Team.
