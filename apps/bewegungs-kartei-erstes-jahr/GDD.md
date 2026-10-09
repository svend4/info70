# Kurz-GDD: Bewegungs-Kartei Babys erstes Jahr 🧸

**Einheit aus Katalog:** docs/10 (Praleska), Abschnitt „Инструменты для
родителей“, Nr. 49 — «Bewegungs-Kartei Babys erstes Jahr». Quelle:
«Развитие движений» (S. 34–35) und «Гимнастические упражнения и массаж
(от 1,5 мес. до года)» (S. 35–36).
**Engine:** eigener Kartei-Filter (reine Logik + JSON-Bank), Vorbild
`apps/bewegungs-schatzkiste` für die Druck-Mechanik. Zielgruppe: **Eltern und
Kindertagespflege. Kein Bildschirm für das Kind.**

## 0. Die Quelle wurde gelesen

Das Quelldokument liegt auf dem `main`-Zweig dieses Repositories
(`PRALESKA.pdf`, 320 Seiten). Die drei Abschnitte sind nachgezählt: **26**
Bewegungsziele, **16** Gymnastik- und Massage-Maßnahmen, **4**
Sicherheitsziele — genau die Zahlen, die der Katalogeintrag nennt. Das ist
wichtig, weil die tragende Entscheidung unten ohne gelesene Quelle nur eine
Vermutung wäre.

## 1. Keine Karte beschreibt einen Handgriff am Kind

Der Gymnastik-Teil der Quelle besteht aus: **passivem** Kreuzen und
Ausbreiten der Arme, passivem Beugen und Strecken der Arme im Schulter- und
Ellenbogengelenk, passivem Beugen und Strecken der Beine, passivem Stampfen
in Rückenlage; **Auslösen von Reflexen** (reflektorisches Kriechen über den
Fußsohlenreiz, reflektorisches Aufrichten der Wirbelsäule, Beinstreckung im
Griff unter den Achseln); **Aufsetzen** aus der Rückenlage mit Stütze und
„aktiv bei leichtem Zug an den Händen“; **Schreiten im Griff unter den
Achseln**.

Das ist kein Nebenbefund, sondern der Kern des Abschnitts. Nichts davon ist
übernommen. Und das ist hier **nicht redaktionell vermieden, sondern
strukturell ausgeschlossen**:

- `ausgangslage` ist eine geschlossene Liste — `rueckenlage`, `seitlage`,
  `bauchlage-wach`, `boden`, `auf-dem-arm`, `sitzt-aus-eigener-kraft`. Es gibt
  keinen Wert für eine Haltung, die der Erwachsene hält.
- `rolle` ist eine geschlossene Liste — `vorbereiten`, `anbieten`,
  `begleiten`, `zuschauen`. **Es gibt kein „üben“.**
- `ort` kennt nur `boden` und `auf-dem-arm`. Kein Wickeltisch, kein Sofa,
  kein Bett, kein Tisch.
- Ein Textnetz lehnt das Vokabular ab.

Beim Bau hat dieses Netz zwei eigene Fehler gemeldet, und einer davon war
der Regel selbst anzulasten: ein Stammverbot auf „hochzieh“ hat **„zieht
sich hoch“** mitverboten — also genau das, was die Kartei will, nämlich das
Kind, das sich selbst hochzieht. Entscheidend ist das **Agens**, nicht das
Wort. Die Muster treffen jetzt die Erwachsenen-Formen („zieh dein Kind …“,
„setz dein Kind hin“, „an den Händen führen“, „unter den Achseln“) und
lassen die kindlichen in Ruhe. Umgekehrt stehen `Übung`, `Reflex`,
`Gymnastik` **ohne** Anfangsgrenze im Muster, damit sie auch in „Sitzübung“
und „reflektorisch“ treffen — die Gegenfalle zum `\b`-Problem aus Welle 77.

## 2. Die Bilanz steht in den Daten und wird nachgerechnet

| | Quelle | übernommen | nicht übernommen |
|---|---|---|---|
| Bewegungsziele | 26 | 21 | 5 (Nr. 6, 11, 16, 17, 20) |
| Gymnastik/Massage | 16 | 3 (1 ganz, 2 in Teilen) | 13 |
| Sicherheitsziele | 4 | – (eigene Einheit Nr. 50) | – |

Die 5 nicht übernommenen Bewegungsziele sind **genau** die, in denen der
Erwachsene das Kind in einer Haltung hält: im Griff unter den Achseln (6),
Stehen und Schreiten unter den Achseln und an beiden Händen (11), Stehen mit
Stütze an der Brust (16), Schreiten an beiden Händen (17), Stehen an einer
Hand (20). Von Ziel 26 („gehen bei Unterstützung an einer Hand **und
selbstständig**“) ist nur die zweite Hälfte übernommen.

`pruefeDaten` rechnet das nach: die Menge der in den Karten genannten
`quellZiel`-Nummern muss der behaupteten Zahl **gleich** sein, und
übernommen plus nicht übernommen muss 26 bzw. 16 ergeben. Ein Dokument, das
mehr behauptet als die Daten hergeben, fällt damit auf — die Regel aus
Welle 77.

Die 13 ausgeschlossenen Maßnahmen stehen als `ausgeschlossen`-Array **in der
Datendatei**, jede mit Begründung, nicht im Vorwort: nur so kann ein Test sie
halten.

## 3. Bauchlage ist ohne den Satz zum Schlafen nicht ausdrückbar

Die Bauchlage im Schlaf ist neben dem Rauchen der größte vermeidbare
Risikofaktor für den plötzlichen Kindstod; die Bauchlage im **Wachzustand**
ist gleichzeitig das Wichtigste der ersten Monate. Eine Karte, die zur
Bauchlage einlädt, ohne beides zu trennen, ist die gefährlichste Form, die
diese App annehmen kann.

Darum: `ausgangslage: 'bauchlage-wach'` erzwingt ein nicht-leeres
`schlafhinweis`, das **„Rücken“ und „Schlaf“ beide** enthalten muss, und
einen Sicherheitssatz, der den **Wachzustand** nennt. Dieselbe Technik wie
`geltung` in `apps/tier-tanz-impulse`: die Zusage ist eine Datenbedingung,
keine Redaktionsregel.

## 4. Geordnet nach dem, was das Kind kann — nicht nach Monaten

`apps/meilenstein-begleiter` besitzt die Meilensteinliste und die
Altersfenster U3–U6. Zwei Alterskataloge im Korpus wären zwei Wahrheiten über
dasselbe Kind. Diese Kartei hat deshalb **keine** Monatsüberschrift und
**keine** zweite Meilensteinliste: der Zugang ist „Was kann dein Kind
schon?“ mit sechs beobachtbaren Stufen, und der Validator lehnt jede
Altersangabe in diesen Stufen ab.

Die WHO-Spannen (1. bis 99. Perzentile der Multicentre Growth Reference
Study) stehen an **einer** Stelle, ausdrücklich nicht als Ziele, und keine
Spanne darf schmaler als drei Monate sein — schmaler behauptet eine
Präzision, die die Daten nicht haben. Beim Krabbeln ist `nichtAlle: true`
Pflicht: etwa vier von hundert gesunden Kindern krabbeln nie auf Händen und
Knien, und „Krabbeln nachholen“ ist nichts, was man tun müsste.

## 5. Keine Zahl im Anweisungstext

Minutenpläne und Wiederholungszahlen erzeugen Druck gegen das Kind und gegen
den Erwachsenen und machen das **Aufhören bei Protest zur Regelverletzung
statt zur Regel**. Der Validator lehnt Ziffern und Zahlwörter in den
Anweisungsfeldern ab. Beim Bau hat er eine eigene Formulierung getroffen
(„Schau einmal durch den Tag“) — die ist umgeschrieben worden, statt die
Regel zu schwächen.

Die einzigen Zahlen der App sind die WHO-Spannen und die WHO-Angabe zur
Dauer am Stück, beide mit Quelle und Altersbezug.

## 6. Kein Wirkversprechen

Dass Babymassage Verdauung, Schlaf oder Gewichtszunahme verbessert, ist beim
gesunden reifen Säugling schwach belegt; die tragfähigen Studien kommen aus
der Frühgeborenen-Versorgung und sind nicht übertragbar. Die Massage ist
darum **nur als Kontaktangebot** übernommen — flächiges, langsames Streichen
mit der ganzen Hand —, mit einem Pflichtfeld `ohneWirkung`, das das
ausspricht, und einem Validator, der Wirkbehauptungen ablehnt. Nicht
übernommen: Knetung, Klopfung, Vibration, alles an Wirbelsäule, Hals und
Kopf.

Die Öle **müssen** im Sicherheitssatz vorkommen, um ausgeschlossen zu werden;
geprüft wird, dass sie nur dort und nur verneint auftreten und in keinem
Anweisungsfeld stehen.

## 7. Die App speichert nichts

Kein `localStorage`-Schlüssel, kein Haken, kein Zähler, kein Fortschritt,
keine „alles gesehen“-Anzeige. Vorbild ist `apps/bewegungs-schatzkiste`, nicht
`apps/meilenstein-begleiter`: ein Fortschrittsmerker wäre hier gleichzeitig
ein Punktestand **und** ein Protokoll über die Bewegung eines Kindes. Damit
braucht die App auch keine Lösch-Karte.

Der Test läuft dafür auf dem **kommentarfreien** Quelltext: die Kommentare
nennen `localStorage`, um die Entscheidung zu begründen — ein Test auf den
Rohtext träfe sich selbst (die Falle aus Welle 76).

## 8. Vorlesen nur mit einer Stimme vom Gerät

`vorlesen()` aus `kinder-ui` wählt keine Stimme aus, und Web-Speech-Stimmen
sind nicht garantiert geräteintern; der NetzwerkWaechter patcht nur `fetch`,
`XMLHttpRequest` und `WebSocket`. Hier geht zwar nichts vom Kind durch die
Ausgabe — es gibt kein Eingabefeld und keinen Kindertext —, aber die Zusage
„keine externen Anfragen“ gilt trotzdem. Die App wählt darum ausdrücklich
eine deutsche Stimme mit `localService === true` und sagt sonst, dass
Vorlesen hier aus ist, statt einen toten Knopf zu zeigen.

## 9. Druckblatt: ein Kärtchen je Idee

`break-inside: avoid`, eigenes `druck.css`, Bildschirm-Beiwerk ausgeblendet.
Auf dem Papier: Titel, Voraussetzung, was du vorbereitest, was dein Kind tut,
Sicherheitshinweis, Abbruchzeichen. **Kein** Wochenraster, keine Haken, keine
Sterne, keine Namenszeile — das wäre ein Protokoll über ein Kind, und die
Freigabe-Checkliste in docs/02 verbietet die Namenszeile ausdrücklich
(Welle 77).

## 10. Abweichungen vom Katalogeintrag

| Katalog | Bau | Grund |
|---|---|---|
| „16 Gymnastik-/Massageübungen“ | 13 nicht übernommen, 1 ganz, 2 in Teilen | Die Quelle wurde gelesen: es sind passive Mobilisationen, Reflexauslösung, Hochziehen an den Händen und geführtes Schreiten. |
| „bebilderte Kartei“ | keine Abbildungen | Eine Abbildung eines Griffs ist eine Anleitung zu einer Handlung am Kind, ohne die Rückmeldung einer anwesenden Fachperson. Beschrieben wird die Umgebung und die Eigenbewegung des Kindes. |
| „26 Bewegungsförderziele“ als Soll | als Quellbestand, nicht als Ziel | 26 ist die Zahl der Quelle, keine Füllmenge. Gebaut ist, was den Review überlebt hat, und die Bilanz steht nachrechenbar in den Daten. |
| „im Duktus deutscher PEKiP-/Krabbelgruppen-Praxis“ | Bezug auf gegenwärtige Praxis, nicht auf Säuglingsgymnastik | Die Neumann-Neurode-Tradition ist derselbe passive Ansatz mit deutschem Namen. Bezugspunkt ist die freie Bewegungsentwicklung. |

## 11. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter, CSP `default-src 'self'`), **kein
localStorage**, werbefrei, ohne Anmeldung, kein Kind-Screen, keine Punkte,
keine Ampel, kein Prozentwert. Erwachsenen-Werkzeug **ohne** `eltern.html`
und **nicht** im Eltern-Sammelband — wie `meilenstein-begleiter`,
`vorlese-kompass` und `autonomiephase-navigator`. Keine Hilfe-Insel: die
116 111 adressiert hier niemanden; das Elterntelefon steht als Text im
Schüttel-Hinweis. Mobile-first, Touch-Ziele ≥ 48 px, Impressum im Fuß.

## 12. Tests

`test/logik.test.mjs` (17): Daten gültig; kein Handgriff am Kind (mit fünf
Erwachsenen-Formulierungen als Gegenprobe **und** der Gegenprobe, dass das
Kind sich selbst hochziehen darf); „Übung“ trifft in der Zusammensetzung;
Bauchlage ohne Schlafsatz nicht ausdrückbar; nach Können statt nach Monaten
geordnet; keine Zahl im Anweisungstext; kein Wirkversprechen; Ausschlussliste
in den Daten und deckt die Quelle ab; Quellbilanz gegen die Karten
nachgerechnet; speichert nichts (auf kommentarfreiem Code); kein Kind-Screen
und kein Scoring; Vorlesen nur mit Gerätestimme; Druckblatt ohne Protokoll;
Abgrenzung zu den Nachbar-Apps; Sicherheit und Aufhören auf jeder Karte;
Seite und Politik; `karteText`.
