# Sport-Schnupper-Stationen: Kurz-GDD

## 1. Warum
Kinder von 5 bis 7 Jahren brauchen Bewegung, Spiel und einfache Wettbewerbe. Die Praleska beschreibt dafür Sportspiele, Sportübungen und Sportfeste (S. 225 bis 230, Altersgruppe S. 6). Fachkräfte brauchen diese Angaben als Karten, die sie für Bewegungstage und Sportfeste ausdrucken.

## 2. Wer und Kernerlebnis
Wer: Fachkräfte in der Kita. Kinder nehmen teil, sie nutzen das Werkzeug nicht.
Kernerlebnis: Die Fachkraft wählt Stationen, druckt und hat Karten, auf denen jeder Name seine Quellenseite trägt und jede Regel als Eigenentwurf erkennbar ist.

## 3. Entscheidungen
- Der Druck zeigt nur die gewählten Karten, je Karte ein Blatt A4 quer. Keine Zeichen, Kästchen, Punkte, Sterne oder Emojis; keine Namenszeile, kein Tages- oder Wochentagsfeld (docs/02 Z. 79–82).
- Die Namen und Aufgaben stammen aus der Quelle. Die Regeltexte sind Eigenentwurf und als solche überschrieben; die Quelle beschreibt dafür keine Regeln.
- Die Zeile „Ziel: Spiel nach vereinfachten Regeln (S. 229–230)“ steht nur auf den acht Sportspielkarten. Übungen, benannte Spiele und Wettbewerbe haben sie nicht, weil die Quelle dort keine vereinfachten Regeln nennt (S. 230).
- Wettbewerbe ohne Rangliste, ohne Punkte und ohne Zählung. Die Namen der Wettbewerbe stehen in der Quelle; die Form ohne Rangliste ist Eigenentwurf.
- Keine Eingabefelder und keine Speicherung (Projektregel, ohne docs/02-Zeile). Die Auswahl lebt nur in der geöffneten Seite.
- Jede Karte trägt eine Seitenangabe, jede Zeile mit Quellenbezug ebenfalls. Jede Übertragung und jeder Eigenentwurf ist als solcher gekennzeichnet; deutsche Titel in Klammern sind Übertragungen und tragen den Hinweis auf der Karte. Der Pflichtsatz zu den Seitenangaben steht auf jedem gedruckten Blatt, nicht nur im Bildschirmfuß.
- Keine Sicherheitsregeln aus Fremdquellen. Die Quelle nennt für diese Stationen keine Sicherheitsregeln; Sicherheit ist Eigenentwurf und Sache der Fachkraft. Jede Karte sagt das mit demselben Satz.
- Die Winter- und Wasserübungen (S. 230) sind mit Quellenangabe aufgenommen; über ihre Eignung für die Kita entscheidet die Fachkraft.
- Bewusst nicht übernommen: Technik-Piktogramme, Ersatz-Spielnamen aus dem Katalog, Eishockey, Team Deutschland, Special Olympics, DOSB-Verweise (siehe README).

## 4. Lernziele (prüfbar)
1. Die Fachkraft wählt Stationen und druckt Karten, auf denen jede Quelle eine Seite trägt.
2. Die Übersichtskarte lässt sich mit drucken, wenn sie gewählt ist.
3. Auf keiner Karte und in keinem Druck steht ein Kind; es gibt kein Feld dafür.
4. Keine Rangliste, keine Punkte und keine Zählung für einzelne Kinder.

## 5. Inhalt
22 Karten: eine Übersichtskarte (Ziel der Quelle, Sportfeste S. 226, Olympische Thematik S. 225, Hinweis zu Aufsicht und Sicherheit); 8 Sportspiele (S. 229); 5 Sportübungen (S. 230); 6 benannte Spiele und 2 Wettbewerbsformen (S. 230). Die Daten stehen in `daten/stationen.json`.

## 6. Politik (docs/02)
- Keine Anfragen nach außen (docs/02 Z. 22–24): Content-Security-Policy `default-src 'self'`, Netzwerk-Wächter, kein `fetch` im Quelltext der App.
- Keine Bewertung von Kindern (docs/02 Z. 141–146, Release-Regel). Keine Speicherung und kein Bildschirm für Kinder: Projektregeln, ohne docs/02-Zeile.
- Druckblatt nach docs/02 Z. 79–82: keine Zeichen, keine Namenszeile.
- Oberfläche auf der Basis von `packages/kinder-ui` (Touch-Ziele, Kontrast, Schriftgröße). Fuß-Link mindestens 48 px hoch; nach einem Klick bleibt der Fokus auf dem gleichen Knopf.

## 7. Aufwand
S. Die Karten sind statisch und der Druck ist eine Druckansicht.

## 8. Tests
33 Tests in zwei Dateien. Sie prüfen die Daten, die Seiten, die Namen gegen die Quelle, die Kennzeichnung, die Ziel-Zeile, den Sicherheitssatz, die Wettbewerbe ohne Rangliste, den Pflichtsatz auf dem Blatt und die Projektregeln. Details in der README.

## Offen
- Hockey-Widerspruch in der Quelle (S. 229): die Liste nennt „хоккей на траве“ (Feldhockey), der Technik-Absatz nennt Schläger und Scheibe. Die Karte lässt die Sportart offen; eine Fachkraft legt sie fest. Der Widerspruch steht auch auf S. 246: dort nennt die Liste der Sportspiele der Gruppe „Фантазеры“ „хоккей“ (ohne Zusatz).
- Ziel-Zeile auf den Sportspielen: der Satz „играм по упрощенным правилам“ steht auf S. 229 vor der Einzelliste (dort durch Silbentrennung geteilt); nur bei Basketball steht das Wort einzeln. Ob die Zeile für die Sportspiele ohne eigenen Einzeleintrag gelten soll, ist eine fachliche Lesart.
- Sicherheitsaussagen fehlen: die Quelle nennt für Sportspiele, Übungen und Wettbewerbe keine Sicherheitsregeln. Die Karten sagen das; es wird keine Regel gesetzt.
- Eignung der Winter- und Wasserübungen (Schlittenfahren, Gleiten auf vereisten Bahnen, Skilaufen, Vorbereitung auf das Schwimmen) für eine deutsche Kita ist eine fachliche Entscheidung.
- Katalogzahl „8 benannte Spiele“: gezählt auf S. 230 sind 6 Spielnamen und 2 Wettbewerbsformen in Anführungszeichen. Die 8 Sportspiele auf S. 229 stehen ohne Anführungszeichen. Die Katalogzahl passt nur zu den 8 Anführungsnamen; der Katalogeintrag ist nicht geändert.
- Nicht als Karten aufgenommen: die Gleichgewichtsübungen «великан», «цапля», «ласточка» (S. 228) und «волчок» (S. 230). Es sind allgemeine Übungen, keine Sportübungen. Ob sie aufgenommen werden, ist offen.
- Die Regeltexte sind Eigenentwurf und sollten von einer Fachkraft gegengelesen werden.
- Katalogbegriffe, die die Quelle nicht stützt (Eishockey, Team Deutschland, Special Olympics, DOSB, Technik-Piktogramme, Ersatz-Spielnamen), sind nicht übernommen. Ob der Katalogeintrag angepasst wird, ist offen.
- Die Altersgruppe 5 bis 7 Jahre stammt aus S. 6; die Einordnung als Kita oder Vorschule ist Eigenentwurf.
- Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- Nicht geprüft: Darstellung bei 360 px im Browser, Druckvorschau, Prüfung auf dem Gerät.
