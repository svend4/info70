# Kurz-GDD: Design-Entdecker ☕

**Einheit aus Katalog:** docs/10 (Praleska), Abschnitt „Ko-Nutzung“, Nr. 16 —
«Design-Entdecker: praktisch und schön».
**Engine:** eigenes datengetriebenes Frage-Format (bewusst **nicht**
`quiz-kern`). Zielgruppe: 3–5 gemeinsam, 5–7 kurz auch allein.

## 1. Die tragende Unterscheidung: drei Geltungsarten

Sie ist Schemabedingung, nicht Redaktionsdisziplin. Jede Frage trägt ein
Pflichtfeld `geltung`:

| Wert | Bedeutung | Konsequenz im Code |
|---|---|---|
| `pruefbar` | man kann es ausprobieren | braucht `probe`, `erwartet`, `wennAnders`, ≥ 2 `gruende` |
| `ausgemacht` | Menschen haben es vereinbart | der **Kindertext** muss „bei uns“ und „ausgemacht“ enthalten, dazu ein `geltungsbereich` für Erwachsene |
| `geschmack` | hat keine Antwort | darf **kein** Feld `richtig` tragen, nicht einmal auf `false`; kein `antwortText`, kein `korrekt` |

Die verbreitete Zweiteilung „Wissen oder Meinung“ ist zu grob: Konventionen
(Feuerwehr rot, Briefkasten gelb) fielen sonst fälschlich in eine der beiden
Schubladen. Ein Test verlangt, dass **alle drei** Arten vorkommen.

## 2. Geschmack kann technisch nicht bewertet werden

`geschmacksFrage()` ist ein eigener Bildschirm, keine Variante mit Schalter.
`istRichtig()` gibt für solche Fragen `null` zurück, nicht `false` — es gibt
hier nichts zu treffen. Keine Zählung, keine Mehrheitsanzeige. Der
Gesprächsimpuls muss nach dem **Warum** fragen (Validator), nicht nach der Wahl:
Bewertet wird das Begründen, nicht der Geschmack.

Ein Test hält zusätzlich fest, dass die Wörter „schön“ und „hässlich“ nur in
Geschmacksfragen vorkommen — analog zum bestehenden Test in
`dinge-des-alltags`, der „falsch“ aus dem Datensatz hält.

## 3. Nie nur ein Grund

`gruende` ist ein Array mit `minLength: 2`. „Holz leitet die Wärme schlecht“
allein ist richtig, aber unvollständig — Holz schont zugleich die
Pfannenbeschichtung. Design funktioniert über konkurrierende Anforderungen;
„der Grund“ wäre gelogen. Der **erste** Grund muss positiv formuliert sein
(kein „nicht“/„kein“): Verneinte Kriterien drehen Vier- bis Sechsjährige beim
Wiedergeben regelmäßig ins Gegenteil.

Materialaussagen (`material`) brauchen zusätzlich `grenze` — was das Material
schlecht kann. Materialien haben Eigenschaften, keine Tugenden.

## 4. Proben: ungefährlich und mit Plan B

`GEFAHR` sperrt heiß/Herd/Backofen/kochend/Kerze/Messer in jedem `probe`-Text;
Wasserversuche brauchen `maxGrad ≤ 40`. Und jede Probe trägt `wennAnders`: den
Satz für den Fall, dass der Versuch etwas anderes zeigt. Ohne ihn korrigiert
der Erwachsene die richtige Beobachtung des Kindes als falsch — der
schädlichste Ausgang, den eine solche App produzieren kann.

## 5. Gebäude: nur Bauform wird abgefragt

`merkmalsart` ∈ `bauform | ausstattung | ortskenntnis`. Nur `bauform` darf ein
Rätsel sein. **Kita** (Ausstattung: Spielgeräte, Fensterbilder) und **Bahnhof**
(Anlage, nicht Haus) werden ausdrücklich gezeigt und ausdrücklich nicht
abgefragt, mit `warumNicht`. Ein Test verlangt, dass es solche Einträge gibt —
eine Sammlung, in der alles am Haus abzulesen ist, wäre zu glatt, um wahr zu
sein. Das ist dieselbe Linie wie `genre: null` beim Dürer-Rhinozeros in
`kunst-entdecker`.

Jede Bauform bringt ihr `gegenbeispiel` mit: Kirche ohne Turm, Fachwerk nicht
schwarz-weiß, Backstein nicht nur rot.

## 6. Was der Kindertext nicht enthalten darf

Jahreszahlen, „Jahrhundert“, „Ritter“, „Mittelalter“ — vom Validator gesperrt.
Fachwerkbau reicht vom Mittelalter bis heute und ist in halb Europa verbreitet;
„typisch deutsch“ und „so haben die Ritter gewohnt“ sind beide falsch. Nicht in
der App: die Vorkragungs-Legende (nicht belegt) und jede Ursprungserzählung zum
Backstein (Forschungsdiskussion, kein Faktenwissen). Beides steht in
`eltern.html` als das, was es ist.

## 6a. Vorlesetext und Knöpfe kommen aus EINER gemischten Liste

Für ein Kind, das nicht liest, **ist** der Vorlesetext die Aufgabe. Zuerst las
die App die Optionen roh vor, während die Knöpfe gemischt waren — die Lösung
kam damit im Vorlesetext systematisch zuerst. Jetzt wird pro Frage genau einmal
gemischt, und dieselbe Liste trägt Knöpfe und Vorlesetext; das Häuser-Rätsel hat
zusätzlich einen eigenen Vorlese-Knopf bekommen. Als zweite Sicherung verlangt
der Validator, dass die Lösung in den Daten nicht überall an derselben Stelle
steht. Und `geltungTexte` wird jetzt geprüft: Fehlte ein Eintrag, verschwiege
die App still die Sorte der Frage.

## 7. Ko-Nutzungs-Muster

Erwachsenen-Gate → `PRO_SESSION = 6` → nach jeder Frage ein Gesprächsimpuls in
Frageform (Validator) → Häuser-Teil → Grenz-Bildschirm → Pflichtabschluss
„Bildschirm aus“ mit drei Offline-Ideen. Keine Punkte, kein Rekord, kein Rang,
nichts gespeichert.

## 8. Abgrenzung

`dinge-des-alltags` (Nr. 2) sortiert die Dingwelt (Kategorien, Teile,
Materialien, gemacht oder gewachsen). Hier geht es um den Zusammenhang
**Funktion – Form – Material** und um Bauformen — und vor allem um die
Unterscheidung, welche Frage überhaupt eine Antwort hat.
`deutschland-kompass` und `kita-kartograph` arbeiten an Plänen und Karten,
nicht an Gebäuden.

## 9. Politik (docs/02)

Werbefrei, ohne Anmeldung, keine externen Anfragen
(`installiereNetzwerkWaechter`, CSP `default-src 'self'`), **kein**
localStorage, deutsche Oberfläche, `eltern.html`, Impressum im Fuß, Vorlesen
über die Gerätestimme.

## 10. Tests

14 Tests in `test/logik.test.mjs`: Datengültigkeit, alle drei Geltungsarten,
Lösungsverbot bei Geschmack, „schön“ nur bei Geschmack, Geltungsbereich im
Kindertext, Zwei-Gründe-Pflicht und Positivform, Gefahrensperre der Proben,
Gegenbeispiel-Pflicht, Materialgrenze, Bauform-Beschränkung der Gebäude,
Verbot von Jahreszahlen und Ritter-Erzählungen, vollständige Sortenanzeige und
wandernde Lösungsposition, Sitzungsgrenze, Ton und Abschluss.
