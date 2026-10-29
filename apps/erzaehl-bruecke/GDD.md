# Kurz-GDD: Erzähl-Brücke 🌉

**Einheit aus Katalog:** docs/10 (Praleska) Top-30 Nr. 19 — «Erzähl-Brücke».
**Engine:** Baustein-Generator mit injizierbarem Zufall (Muster geschichten-
werkstatt). Zielgruppe: 5–8, gern in Ko-Nutzung.

## 1. Kernaussage

Würfelt Held + Ort + Problem und zeigt eine vierstufige „Erzähl-Treppe“
(Es war einmal / Eines Tages / Aber dann / Am Ende) mit Impulsfragen plus
Überraschungs-Karten. Das Kind erzählt die Geschichte LAUT selbst – die App
liefert nur das Gerüst. Kein Mikrofon, keine Aufnahme, nichts gespeichert.

## 2. Zielgruppe

Kinder/Familie. Nachbarn: geschichten-werkstatt (App schreibt Text),
reim-radar, familienschatz-reime, vorlese-kompass.

Anmerkung Stand 29.10.2026: Der Katalog (docs/10) nennt 5 bis 7 Jahre (kurz auch allein). Der Altersbereich 5 bis 8 ist offen (Bauauftrag GEM-13, Abschnitt 9).

Ergänzung Stand 29.10.2026: Die Altersangabe der Quelle ist uneinheitlich. docs/10 Z. 319 und docs/praleska-katalog.json nennen 5 bis 7 Jahre (kurz auch allein), docs/10 Z. 165 nennt „дети 5–8“. Der Altersbereich bleibt offen (Bauauftrag GEM-13, Abschnitt 9).

## 3. Ablauf

1) Start erklärt „du erzählst laut, der Computer hört nicht zu“ (Vorlesen).
   Anmerkung Stand 29.10.2026: Der Satz „du erzählst laut, der Computer hört nicht zu“ steht so nicht in der App. Der Startbildschirm sagt „Der Computer hört nicht zu und nimmt nichts auf.“ (app.mjs, Zeile 41).
2) „Geschichte würfeln“: Startsatz + 4 Treppenstufen mit Impulsen (je vorlesbar).
3) „Überraschung einbauen“ (Zufalls-Impuls), „Neue Geschichte“, „Start“.
4) Weil-Satz (Eigenentwurf, Stand 29.10.2026): Karte „💬 Weil-Satz (Eigenentwurf)“ mit einem Anfang „… weil …“; „Vorlesen“ und „Anderer Weil-Satz“ (der Text wird an Ort und Stelle getauscht, der Knopf behält den Fokus).

## 4. Didaktik / Nutzen

Erzählfähigkeit ist ein zentraler Vorläufer der Bildungssprache. Die Mechanik
„Kind erzählt mündlich, App liefert nur das Gerüst, keine Aufnahme“ ist
datenschutz-vorbildlich und stärkt zugleich freie Sprachproduktion – in jeder
Familiensprache. Alle Bausteine sind Eigenproduktion.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), KEIN Mikrofon/keine Aufnahme,
speichert nichts (kein localStorage). Werbefrei. Vorlesen (BFSG). Kinder-App
mit eltern.html, im Sammelband.

Anmerkung Stand 29.10.2026 (Sprachausgabe): Die Vorlesefunktion nutzt die Sprachausgabe des Browsers. Ist auf dem Gerät eine Stimme für Deutsch vorhanden, wählt die App sie; ist keine da, entscheidet der Browser. Ob dabei eine netzbasierte Stimme gewählt wird, ist nicht geprüft (packages/kinder-ui/js/komponenten.mjs, Funktion vorlesen).

## 6. Tests

`test/logik.test.mjs`: Bank gültig (Helden/Orte/Probleme, 4-stufige Treppe
anfang/los/aber/ende), „kein Aufnehmen“-Hinweis, `waehleElemente`
(injizierbar), `startSatz`/`baueGeruest` (Startsatz + 4 Impuls-Stufen).
Ergänzt (Stand 29.10.2026): Vollständigkeit der Impulse und Listen, Weil-Satz-Anstöße (Endung „weil …“), `weilSatz` ohne Zufall, `pruefeBausteine` mit Reihenfolge der Treppe, Hinweis und Weil-Sätzen.
`test/regeln.test.mjs` (Vorlage: `apps/puppentheater-werkstatt/test/regeln.test.mjs`; Abweichungen stehen im Kopf der Datei): keine Eingabefelder, keine Speicherung, keine Anfragen nach außen, keine Medienabfrage, Zufall nur am Bestand, Grundgerüst, 48 px, Seitenangaben-Vermerk, Eigenentwurf-Kennzeichnung, keine Bewertung, externe Fakten, Testzahl, package.json, Sprachregel (Modellnamen und Begriffe nach Bauauftrag Abschnitt 6), uk und ru, Weil-Satz-Knopf.
Angleichung Stand 29.10.2026: Zusätzlich geprüft werden die Lernziele in der README (Test „Lernziele“), die HTML-Einspeisung und eval (Test „keine HTML-Einspeisung“) sowie „Stufe“ gegen den Bestand. 360 px prüft der Node-Test nur als Meta-Viewport; tools/browser-tor.mjs misst Überlauf und Knopfmaße nur auf dem Startbildschirm; das Gerüst wurde in einer Eigenmessung geprüft (nicht im Repo). Die Abweichungen von der Vorlage stehen im Kopf von test/regeln.test.mjs.
Testzahl: 31 Tests (`test/logik.test.mjs` 10, `test/regeln.test.mjs` 21).

## 7. Erweiterungen (Katalog)

uk/ru-Impulse, Bild-Karten statt Text, Kopplung mit familienschatz-reime;
Würfel für Genre (Märchen/Abenteuer/Alltag).

## 8. Quelle und Herkunft (Stand 29.10.2026)

- Grundlage des Gerüsts ist S. 143 der Praleska: Ursache-Folge-Verknüpfung in Sätzen, Aufbau eines Textes aus Anfang, Fortsetzung und Schluss, Erzählen nach einem Bild. Die Seite ist Grundlage, kein Zitat; es gibt keine Sätze aus dem Buch.
- Alle Bausteine (Helden, Orte, Probleme, Überraschungen, Weil-Sätze) und die vier Stufen sind Eigenentwurf (§4). Die Herkunft steht je Liste in `daten/bausteine.json` unter `herkunft`: `"eigenentwurf": true`; Treppe und Weil-Sätze tragen `"quelle": { "seite": "S. 143" }`.
- Anmerkung Stand 29.10.2026: Der Dreiteil Anfang, Fortsetzung und Schluss ist durch S. 143 gedeckt (dort stehen die Stichwörter Anfang, Fortsetzung und Ende). Die vier Stufen der Treppe (Es war einmal, Eines Tages, Aber dann, Am Ende) sind Eigenentwurf; S. 143 nennt den Dreiteil, nicht die vier Stufen.
- Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
- uk und ru: nicht vorhanden, offen.

## Offen (Stand 29.10.2026)

- Bildimpuls (Wimmelbild-Szene, Katalog docs/10) und Bestätigung durch einen Erwachsenen per Antippen: nicht gebaut. Offen sind Bildrechte und die Bestätigung. Bild-Karten bleiben Erweiterung (§7).
- Altersbereich: die App sagt 5 bis 8, der Katalog 5 bis 7. Entscheidung offen.
- uk und ru: nicht vorhanden, offen. uk- und ru-Impulse bleiben Erweiterung (§7).
- Sternchen vor einzelnen Zielen (A11): S. 143 hat solche Zeichen; die Bedeutung steht nicht im Text. Nicht übernommen.
- Das Wort „Stufe“: Die App nennt die vier Treppenschritte „Stufen“ (app.mjs, index.html). Der Bauauftrag (Abschnitt 6) zählt „Stufe“ zu den verbotenen Bewertungen. Nichts ersetzt; das Wertungsmuster in test/regeln.test.mjs lässt das Wort aus. Entscheidung offen: behalten oder „Schritt“. Verweis: Frage 66 (Nachtrag 29.10.2026, Abschnitt И). Stand 29.10.2026: Der Regeltest zählt „Stufe“ seither gegen den Bestand in app.mjs (2), index.html (2) und daten/bausteine.json (0) sowie in logik.mjs (2); der Satz oben über das Wertungsmuster beschreibt den früheren Stand.
- Zufall im Bestand: `Math.random` steht in logik.mjs (Standardwert der Auswahl) und in app.mjs („Überraschung einbauen“). Der Bauauftrag verlangt keinen Zufall im Code der App; ersetzt wurde nichts. Entscheidung offen: Auswahl als Parameter aus app.mjs. Der Test erlaubt genau diesen Bestand und darf ihn nur verkleinern. Verweis: Frage 65 (Nachtrag 29.10.2026, Abschnitt И in docs/fragen-fuer-max-2026-10-28.md).
- Fokus nach Klick: `zeige()` (Bestand) baut den Bildschirm bei „Geschichte würfeln“, „Überraschung einbauen“, „Neue Geschichte“ und „Start“ neu auf und setzt den Fokus auf den ersten Knopf. Gemessen am 29.10.2026 bei 360 px (Chromium, Eigenmessung): danach liegt der Fokus auf „🔊 Vorlesen“. Die Karte „Weil-Satz“ behält den Fokus bei „Vorlesen“ und „Anderer Weil-Satz“. Verweis: Frage 67 (Nachtrag 29.10.2026, Abschnitt И).
- Werkzeugregel (Stand 29.10.2026): `tools/browser-pruefung.mjs` (Z. 19 bis 22) verlangt nach jedem Klick den Fokus auf derselben Kennung. Verschwindet der Knopf, weil der Bildschirm wechselt, genügt eine Überschrift mit `tabindex="-1"`. Nach dieser Regel ist der Fokus nicht erfüllt: Nach „Geschichte würfeln“, „Überraschung einbauen“, „Neue Geschichte“ und „Start“ liegt er auf dem ersten Knopf. Das Werkzeug misst es nicht, weil die App keine `data-kennung` hat. Entscheidung: Frage 67.
- Browser-Tor: misst Klicks nur mit `data-kennung`; die App hat keine (Schuld ohneKennung 1, unverändert). Die Gerüst-Knöpfe prüft der Tor nicht.
- Herkunft je Eintrag (Bauauftrag Abschnitt 4): nicht umgesetzt. Die Listen bleiben Textlisten; die Herkunft steht je Liste.
- Druck und Pflichtmarkierung auf dem Blatt: entfallen, die App druckt nichts.
- Quiz-Engine (A7): die App nutzt keinen quiz-kern; der Katalogtext nennt ihn. Entscheidung, ob der Katalogtext angeglichen wird.
- Vorlesefunktion (F2) und Favicon (A3): vorhanden.
- Test mit Kindern der Zielgruppe: steht aus.
- Registrierung (Hub, Impressum, docs/10, Katalog): nur durch den Koordinator. Diese Änderung registriert nichts.
- Anmerkung Stand 29.10.2026 zu „Offline, werbefrei“ (index.html, package.json): Die Bestandszeilen bleiben stehen. Im Browser-Test schlug das Neuladen ohne Netz fehl (`ERR_INTERNET_DISCONNECTED`); die App hat keinen Service Worker. docs/02 Z. 51 sagt, dass das Neuladen offline nicht gewährleistet ist. Ob „Offline“ gestrichen wird, entscheidet der Koordinator.
