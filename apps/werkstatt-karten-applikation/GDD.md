# Werkstatt-Karten: Schneiden, Reissen, Kleben: Kurz-GDD

## 1. Warum
Kinder der Gruppe „Почемучки“ (3 bis 5 Jahre, S. 6) erproben in der Applikation Schneiden,
Reißen und Kleben. Die Praleska beschreibt diese Techniken und die Ziele für die Schere
(S. 181). Fachkräfte brauchen Karten, die sie drucken und an den Arbeitsplatz legen oder hängen können.

## 2. Wer und Kernerlebnis
Wer: Fachkräfte in Kita oder Familie. Kinder nutzen das Werkzeug nicht.
Kernerlebnis: Die Fachkraft wählt Technik- und Themenkarten und druckt sie. Jede Karte nennt
ihre Quellenangabe mit Seiten. Die drei Technikkarten haben zusätzlich Ziel, Material und eine
nummerierte Schrittfolge; die Ergänzungskarten nennen Ziele und Aussagen aus der Quelle, die
Themenkarten den Themenvorschlag.

## 3. Entscheidungen
- Die drei Technikbereiche stehen ohne Reihenfolge (S. 181). Die Schrittfolge gilt nur innerhalb einer Technik.
- Die Ergänzungen stehen als zwei getrennte Karten und sind als Ergänzung gekennzeichnet:
  „Collage und Flora (Ziele Gruppe 3 bis 5, S. 181)“ mit den Zielen für Gruppe 3 bis 5, und
  „Naturmaterial und Collage-Technik (Gruppe 5 bis 7, S. 282–283)“ mit den Aussagen aus den
  Abschnitten der Gruppe 5 bis 7. Keine der beiden ist einer der drei Technikbereiche.
- Themenkarten: nur die Titel aus S. 181, mit deutscher Übertragung als Eigenentwurf. Die
  Katalogübertragung „Der dicke fette Pfannkuchen“ ist keine Quellenübertragung und wird nicht verwendet.
- Die Filter (Technik, Themengruppe) helfen beim Suchen auf dem Bildschirm. Der Technik-Filter
  wirkt auf die Technikkarten, der Themen-Filter auf die Themenkarten.
- Der Druck zeigt nur die gewählten Karten, je Karte ein Blatt A4 quer. Keine Zeichen, Kästchen,
  Punkte, Sterne oder Emojis; keine Namenszeile, kein Tages- oder Wochentagsfeld (docs/02 Z. 79–82).
  Schrittfolgen sind nummeriert.
- Auf jeder gedruckten Karte steht im Druck der Satz zur Pflichtmarkierung der Seitenangaben.
- Jede Karte trägt eine Quellenangabe. Jede Zeile trägt eine Seite oder ist als Eigenentwurf gekennzeichnet.
- Der Sicherheitssatz zur Schere ist Eigenentwurf mit Quellenangabe S. 126.
- Keine Eingabefelder und keine Speicherung (Projektregel).
- Keine Bewertung einzelner Kinder (docs/02 Z. 141–146). Die Karten enthalten keine Merkmale einzelner Kinder.
- Keine Anfragen nach außen (docs/02 Z. 22–24): Content-Security-Policy `default-src 'self'`,
  Netzwerk-Wächter, kein `fetch` im Quelltext.

## 4. Lernziele (prüfbar)
1. Die Fachkraft wählt Technik- und Themenkarten und druckt genau die gewählten, je Karte ein Blatt.
2. Jede gedruckte Karte nennt ihre Quellenseite; der Eigenentwurf ist gekennzeichnet.
3. Auf keiner Karte und in keinem Druck steht ein Kind; es gibt kein Feld dafür.

## 5. Inhalt
30 Karten: drei Technikkarten (Schneiden, Reißen, Kleben), zwei Ergänzungskarten und 25 Themenkarten.
Die Daten stehen in `daten/karten.json`.

## 6. Politik (Anforderungen, Zeilen wie unten)
- Keine Anfragen nach außen (docs/02 Z. 22–24).
- Druckbögen ohne Zeichen, Namenszeile und Tagesfeld (docs/02 Z. 79–82).
- Keine Bewertung von Kindern (docs/02 Z. 141–146).
- Keine Speicherung und kein Bildschirm für Kinder: Projektregeln.

## 7. Aufwand
S. Die Karten sind statisch; der Druck ist eine Druckansicht.

## 8. Tests
33 Tests in zwei Dateien. Sie prüfen Daten, Seiten, Zitate, Eigenentwurf, Schere, Filter, Auswahl
und die Projektregeln, dazu die Pflichtmarkierung auf jeder gedruckten Karte. Details in README.md.

## Offen
- Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- Gemeinfreiheit der deutschen Übertragungen (Thementitel und Technikbegriffe) ist ungeprüft.
- Scherentyp für Gruppe 3 bis 5 (Spitze oder rund) steht nicht im Text der Quelle; die Karten nennen keinen Typ.
- Layout der Druckbögen ist nicht am PDF sichtgeprüft. Die Prüfung im Browser (360 px, Druckseiten, Fokus) steht aus.
- Altersangabe: die Quelle nennt 3 bis 5 Jahre (S. 6), der Katalogeintrag 4 bis 5 Jahre. Der Katalog ist nicht geändert; die Redaktion entscheidet.
- Der Katalogtext ordnet die Techniken abgestuft ein, die Quelle nennt keine Reihenfolge (S. 181). Die App folgt der Quelle.
- Der Indikator auf S. 197 beschreibt Merkmale einzelner Kinder und ist deshalb nicht auf den Karten; die Redaktion entscheidet über eine Aufnahme.
- Die Themengruppen für den Filter sind Eigenentwurf und stehen nicht im Quelltext.
- aria-live auf `#app` umfasst den ganzen Bereich. Ob Hilfstechnik das gut ausliest, ist nicht geprüft.

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
