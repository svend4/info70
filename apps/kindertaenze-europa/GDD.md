# Kindertänze Europas: Kurz-GDD

## 1. Warum
Die Praleska nennt für die Gruppe „Фантазеры“ (5 bis 7 Jahre, S. 6) Tänze und Melodie-Angaben
für die musikalisch-rhythmische Tätigkeit (S. 265 bis 267). Fachkräfte brauchen die Titel und
Angaben als Karten, die sie drucken und an den Musikraum hängen oder mitnehmen können. Die
Quelle nennt keine Schritte und keine Herkunft der Tänze; diese Teile sind Eigenentwurf.

## 2. Wer und Kernerlebnis
Wer: Fachkräfte in der Kita. Kinder nutzen das Werkzeug nicht. Familien als Zielgruppe sind
nicht belegt (siehe „## Offen“).
Kernerlebnis: Die Fachkraft wählt Tanzkarten, filtert nach Tanzart und druckt je Tanz eine
Datenkarte. Jede Karte nennt die Quellenseite und die Melodie-Angabe der Quelle.

## 3. Entscheidungen
- Startumfang: die 20 Titel mit Volksmelodie-Angabe auf S. 267, in Quellenfolge. Dazu Menuett
  und Polonaise als Tanzart mit Komponistenangabe. Sie haben keine Melodie-Angabe.
- Sirtaki und Reigen sind nicht aufgenommen, weil die Quelle sie auf S. 267 nicht nennt. Ein
  Eintrag dazu wäre Eigenentwurf ohne Quellenbezug.
- Die Quelltitel stehen wörtlich in russischer Schrift, als Zitat von höchstens 12 Wörtern.
  Bei neun belarussischen Titeln ist die Quellenangabe die Liste S. 267 (siehe „## Offen“).
- Melodie-Herkunft nur mit Seite, zum Beispiel „kroatische Volksmelodie (Quelle S. 267)“.
  Tanz-Herkunft steht nicht in den Daten; die Quelle nennt sie nicht.
- Deutsche Namen sind Umschrift oder Übertragung und als Eigenentwurf gekennzeichnet.
- Die Schrittbeschreibung hat 2 bis 4 Sätze, ist Eigenentwurf und dient als Anregung. Sie ist
  keine überlieferte Schrittfolge.
- Die Bewegungsbegriffe aus S. 265 bis 266 stehen nur als Liste auf dem Bildschirm, mit Seite.
  Sie werden keinem Tanz zugeordnet, weil die Quelle das nicht tut.
- Der Druck zeigt nur die gewählten Karten, je Karte ein Blatt A4 quer. Keine Zeichen,
  Kästchen, Punkte, Sterne oder Emojis; keine Namenszeile, kein Tages- oder Wochentagsfeld
  (docs/02 Z. 79–82).
- Auf jeder gedruckten Karte steht im Druck die Pflichtmarkierung der Seitenangaben.
- Keine Eingabefelder und keine Speicherung (Projektregel).
- Keine Bewertung einzelner Kinder (docs/02 Z. 141–146). Die Karten enthalten keine Merkmale
  einzelner Kinder.
- Keine Anfragen nach außen (docs/02 Z. 22–24): Content-Security-Policy `default-src 'self'`,
  Netzwerk-Wächter, Daten per JSON-Import mit Typangabe.
- uk und ru: nicht vorhanden, offen. Keine Fassung wird erfunden.

## 4. Lernziele (prüfbar)
1. Die Fachkraft wählt Tanzkarten nach Tanzart und druckt genau die gewählten, je Karte ein Blatt.
2. Jede gedruckte Karte nennt ihre Quellenseite; alles Eigene ist als Eigenentwurf gekennzeichnet.
3. Auf keiner Karte und in keinem Druck steht ein Kind; es gibt kein Feld dafür.

## 5. Inhalt
22 Tanzkarten in `daten/tanze.json`: 20 Titel mit Volksmelodie-Angabe (S. 267) und 2 Tanzarten
mit Komponistenangabe (Menuett, Polonaise). Dazu 17 Bewegungsbegriffe (S. 265 bis 266) als
Liste auf dem Bildschirm.

## 6. Politik (docs/02 Z. 22–24, Z. 79–82, Z. 141–146)
- Keine Anfragen nach außen (docs/02 Z. 22–24): kein `fetch` im Quelltext der App, Netzwerk-Wächter,
  Content-Security-Policy.
- Keine Bewertung von Kindern (docs/02 Z. 141–146). Keine Speicherung und keine Bildschirme für
  Kinder, ohne Altersgrenze: Projektregeln ohne Zeilenangabe in den Anforderungen.
- Druckblatt nach docs/02 Z. 79–82: keine Zeichen, keine Namenszeile.
- Keine Modellnamen und keine verbotenen Fachbegriffe in den Dateien (Projektregel).
- Oberfläche auf der Basis von `packages/kinder-ui`. Fuß-Link mindestens 48 px hoch; nach einem
  Klick bleibt der Fokus auf dem gleichen Knopf.

## 7. Aufwand
M. Die Daten sind statisch. Die Schritte und Hinweise sind Eigenentwurf und brauchen
Gegenlesen durch eine Fachkraft.

## 8. Tests
28 Tests in zwei Dateien. Sie prüfen die Daten, die Seiten, den Startumfang und die Zitate gegen
die Abschrift von S. 267, die Zitatlängen, die Schrittbeschreibungen, die Auswahl und die
Projektregeln. Details in der README.

## Offen
- Sirtaki und Reigen: Eigenentwurf ohne Quellenbezug. Die Quelle nennt sie auf S. 267 nicht.
  Entscheidung der Projektleitung. (Auf S. 259 und S. 266 nennt die Quelle „хоровод“, auf S. 267
  „Коло“ mit ukrainischer Volksmelodie-Angabe.)
- Anzahl der Titel: 20 Titel mit Volksmelodie-Angabe (Startumfang) oder alle Titel aus S. 267.
  Entscheidung der Projektleitung.
- Menuett und Polonaise sind im Datensatz, obwohl sie nicht zum Volksmelodie-Startumfang gehören.
  Entscheidung der Projektleitung.
- „Трасуха“ steht auf S. 267 zweimal: im Absatz „Танцы“ mit Komponistenangabe und im Absatz
  „Белорусские пляски“ mit belarussischer Volksmelodie-Angabe. Die App nimmt die zweite Fassung.
  Ob die Komponistenfassung auch aufgenommen wird, entscheidet die Projektleitung.
- Alternativtitel: „Травушка-муравушка“ oder „Ходила младешенька по борочку“ (S. 267); „Шастак“ oder
  „Кацілася чорна галка“ (S. 267). Die App zeigt den Alternativtitel nur bei Шастак; bei
  Травушка-муравушка steht er im Quellenzitat. Die Wahl der Fassung entscheidet die Projektleitung.
- Mexikanischer Tanz: die Quelle nennt keinen Eigentitel, nur „мексиканский танец“ mit
  mexikanischer Volksmelodie-Angabe. Der deutsche Name ist Eigenentwurf.
- Die Angabe „и др.“ auf S. 267 zeigt, dass die Quelle mehr Tänze nennt als hier stehen. Nicht
  aufgenommen.
- Neun belarussische Titel (Trasucha bis Mikita): ihr Zitat steht auf S. 267 nicht als
  zusammenhängender Wortlaut. Die Quellenangabe ist deshalb „Liste S. 267: belarussische Tänze
  (Umschrift Eigenentwurf)“. Die Titel stehen in der Liste; die Karte nennt die Liste, nicht ihren
  ganzen Wortlaut.
- Katalogeintrag docs/10: Er nennt Schrittfolgen, Herkunftsgeschichten, Familien als Zielgruppe
  und 26 Tänze. Die Quelle belegt keine Schrittfolgen und keine Herkunftsgeschichten; Familien
  als Zielgruppe sind nicht belegt; die Zahl 26 ist mit S. 267 allein nicht abgeglichen.
  Entscheidung der Projektleitung.
- Schritte, Hinweise, Umschriften der Namen und die Altersangabe sind Eigenentwurf. Eine
  Fachkraft liest sie gegen und entscheidet, ob sie passen.
- uk und ru: nicht vorhanden, offen.
- Vorlesefunktion nicht gebaut (Zielgruppe Fachkraft; Geltungsbereich der Checkliste offen).
- Prüfung im Browser (360 px, Druck, Fokus) und auf dem Gerät steht aus.
- Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
