# Tierkinder – Vorlesen: Kurz-GDD

## 1. Warum
Eltern und Fachkräfte lesen Kindern von 3 bis 5 Jahren vor. Die Praleska stellt auf S. 113
bis 114 Aufgaben zu Tieren und ihren Jungen; sie enthält keine Geschichten. Der
Katalogeintrag (Content-Pack 5) beschreibt ein Vorlage-Set ohne fertigen Text. Diese App
liefert feste eigene Bausteine, die Erwachsene auswählen und vorlesen.

## 2. Wer und Kernerlebnis
Wer: Eltern und Fachkräfte, die vorlesen. Kinder hören zu, sie nutzen das Werkzeug nicht.
Kernerlebnis: Die Erwachsene wählt Tierart, Ort und Jungtier-Thema, liest den Text am
Bildschirm vor und druckt ihn bei Bedarf auf ein Blatt.

## 3. Entscheidungen
- Keine freie Texterstellung. Der Text entsteht aus festen eigenen Bausteinen. Die Prüfung
  durchläuft alle 18 gültigen Kombinationen (6 Tierarten, je mit dem passenden Ort, mal 3
  Jungtier-Themen).
- Ort nur zur Tierart. Die Quelle ordnet Bau (Fuchs, Wolf), Höhle (Bär), Nest (Vogel) und
  Stall (Haustiere) zu (S. 114). Die App bietet nur diese Zuordnung an.
- Jeder Absatz trägt seine Kennzeichnung. Mit Sachbezug steht die Seite; ohne Quelle steht
  „Eigenentwurf, ohne Quelle.“ Die Kuschel-Sachfrage und der Schluss sind ohne Quelle.
- Druckblatt: ein Vorlesetext, A4 hoch, ohne Zeichen, Kästchen, Punkte, Sterne oder Emojis,
  ohne Namenszeile, ohne Tages- oder Wochentagsfeld (docs/02 Z. 79–82). Die Pflichtmarkierung
  steht auf dem Blatt.
- Keine Eingabefelder für Kinder, keine Namen, keine Einstufung und keine Bewertung
  (docs/02 Z. 141–146).
- Keine Speicherung und keine Anfrage nach außen (docs/02 Z. 22–24): CSP, Netzwerk-Wächter,
  kein `fetch`, Daten per JSON-Import mit Typangabe.
- Titel „Tierkinder – Vorlesen“ statt des Katalogtitels. Die Begründung steht in README.md.
- Keine Sprachausgabe. Der Katalog nennt Vorlesen durch Erwachsene. Eine Sprachausgabe
  bräuchte eine Stimme, die auf dem Gerät liegt; das ist hier nicht gebaut und nicht geprüft.

## 4. Lernziele (prüfbar)
1. Die Erwachsene wählt Tierart, Ort und Jungtier-Thema; der Text hat fünf Absätze in fester Reihenfolge.
2. Jeder Absatz mit Sachbezug trägt seine Seite (S. 113 bis 114) und die Kennzeichnung Eigenentwurf.
3. Auf dem Blatt stehen keine Zeichen, keine Namenszeile und die Pflichtmarkierung.
4. Auf keinem Blatt und in keiner Datei steht ein Kind, ein Kindername oder ein Eingabefeld für Kinder.

## 5. Inhalt
- Sechs Tierarten: Fuchs, Wolf, Bär, Vogel, Kuh, Huhn. Die Seiten stehen bei jeder Tierart.
- Vier Orte: Bau, Höhle, Nest, Stall (S. 114).
- Drei Jungtier-Themen (S. 114): Eltern sorgen, Frühling und Sommer, Groß werden.
- Schluss und Kuschel-Sachfrage: Eigenentwurf ohne Quelle.
- Eigene Bausteine: 6 + 4 + 3 + 2 = 15. Die Daten stehen in `daten/bausteine.json`.

## 6. Politik
- Keine Anfragen nach außen (docs/02 Z. 22–24): Content-Security-Policy `default-src 'self'`,
  Netzwerk-Wächter, kein `fetch` im Quelltext der App.
- Keine Bewertung von Kindern (docs/02 Z. 141–146). Keine Speicherung und kein Bildschirm
  für Kinder: Projektregeln ohne eigene Fundstelle.
- Druckblatt nach docs/02 Z. 79–82.
- Oberfläche auf der Basis von `packages/kinder-ui`. Fuß-Link mindestens 48 px hoch. Nach einem
  Klick bleibt der Fokus auf dem gleichen Knopf.

## 7. Aufwand
S. Die Bausteine sind fest. Die Anzeige ist eine Auswahl mit einer Druckansicht.

## 8. Tests
33 Tests in zwei Dateien. `test/logik.test.mjs` prüft Daten, Seiten, Zuordnung, Text und die
Pflichtmarkierung für alle 18 Kombinationen. `test/regeln.test.mjs` prüft die Projektregeln.
Details in README.md.

## Offen
- Auswahl der Tierarten für den deutschen Raum ist fachlich zu klären. Hirsch, Wisent und
  Luchs stehen auf S. 113 als Verwandte der Haustiere; Bär steht auf S. 114. Die App nimmt
  nur den Bären auf. Ob der Bär für den deutschen Raum passt, ist nicht geprüft.
- Eignung für Kinder von 3 Jahren ist nicht belegt. Die Sachbezüge stammen aus den Abschnitten
  über Ernährung und über das Wachsen der Tiere (S. 113 bis 114); beide sind im Quelltext mit
  Sternchen markiert. Die Fußnote auf S. 113 nennt die markierten Aufgaben für ältere Kinder.
- Tierkinder-Aufgaben in der Quelle sind für ältere Kinder markiert (*).
- Winterschlaf: Der Quelltext spricht auf S. 113 nur davon, dass Tiere und Insekten, die im
  Winter kein Futter finden, unter dem Schnee schlafen. Das Wort Winterschlaf steht dort nicht.
  Die App nutzt die Stelle nicht.
- Der Schluss „Gute Nacht“ und die Kuschel-Sachfrage sind Eigenentwurf ohne Quelle. Eine
  Fachkraft entscheidet, ob sie bleiben.
- Die Wörter „Kälber“ und „Küken“ sind Eigenentwurf. Die Quelle spricht allgemein von
  Jungtieren; „цыплята“ steht nur als Beobachtungsobjekt auf S. 114.
- „Huhn“ ist nur über den Stall (S. 114) belegt. Die Kurzform ist Eigenentwurf.
- Die Übertragung der Wörter sollte eine Fachkraft gegenlesen (Eigenentwurf).
- uk und ru: nicht vorhanden, offen.
- Der Katalogeintrag in docs/10 trägt noch den Titel „Tierkinder und ihre Familien (Geschichten-Pack)“.
  Ob er geändert wird, entscheidet der Katalog; diese App ändert ihn nicht.
- Browser-Prüfung im Chromium steht aus. Geprüft sind bisher Daten, Logik und Regeln mit
  node --test. Offen: Prüfung auf dem Gerät und in weiteren Browsern.
- Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
