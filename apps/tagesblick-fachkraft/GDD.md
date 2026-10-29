# 📋 Tagesblick Fachkraft — Kurz-GDD

## Kernentscheidungen (Variante A, Entscheidung des Nutzers)

1. **Kein Kind wird bewertet.** Keine Ampel, Stufe, Punkte, Prozent, Rang, kein
   Kürzel und keine Kinderliste (docs/02, Z. 141–146).
2. **Nichts wird gespeichert.** Der Zustand liegt in einer Variablen im Speicher
   der Seite. Es gibt keinen Schreibzugriff auf Browser-Speicher. Die einzige
   Berührung mit dem Speicher ist das Entfernen des Altbestands `wa.daten`.
3. **Gezählt werden nur eigene Handlungen** der Fachkraft, je Bereich
   („erledigt: X von Y“). Eine Gesamtzahl gibt es nicht.
4. **Der Tagesbogen ist leer.** Datum und Häkchen trägt man von Hand ein. Auf dem
   Papier gibt es keine Namenszeile und keine Häkchen vom Bildschirm (docs/02, Z. 79–82).
5. **Keine Rechtsangabe ohne Prüfvermerk** (docs/02).
6. **Keine Verbindung nach außen.** CSP `default-src 'self'` und Netzwerk-Wächter.

## 1. Феномен / потребность (Warum)

Fachkräfte haben im Alltag selten einen Ort, an dem sie ihre eigenen Schritte
(Einzelzeit, Beschwerdeweg, Gespräche) an einem Tag sichtbar machen. Die frühere
Wohlfühl-Ampel bewertete dagegen jedes Kind. Das widerspricht docs/02, Z. 141–146,
und wird deshalb ersetzt. Thema bleibt das emotionale Wohlbefinden (Praleska, S. 15–18).

## 2. Игрок и обещание (Wer + Kernerlebnis)

Fachkraft in Krippe und Kita. Versprechen: Am Tagesende sieht sie in zwei Minuten,
welche ihrer Handlungen heute erledigt sind, und kann den leeren Bogen ausdrucken.
Kinder kommen dabei nicht vor.

## 3. Движок и петля (Wie)

Движок: eine Checkliste mit sechs Handlungen in drei Bereichen. Петля: Handlung
antippen → Knopf und Bilanz des Bereichs ändern sich → am Ende Bogen drucken oder
die Seite schließen. Nichts bleibt zurück.

## 4. Lernziele (проверяемые)

1. Die Fachkraft kann am Tag benennen, welche ihrer Handlungen erledigt sind, je Bereich.
2. Die Fachkraft kann erklären, warum auf Bildschirm und Papier keine Kinder stehen
   und warum nichts gespeichert wird.
3. Die Fachkraft kann einen Bereich mit wenigen erledigten Handlungen benennen, ohne
   dabei ein Kind zu bewerten.

## 5. Контент-план

Drei Bereiche mit je zwei Handlungen (Eigenentwurf) in `logik.mjs`, `BEREICHE`.
Jede Handlung hat einen Namen, eine Frage für die Hilfstechnik (`frage`, enthält
den Namen wörtlich) und einen kurzen Hinweis. Keine Eingabefelder für Kinder,
keine Kontext-Listen.

## 6. Политика соответствия (docs/02)

- [x] Werbefrei, ohne Konto, ohne Tracking
- [x] Keine Kinderdaten: keine Namen, Kürzel, Fotos oder Adressen; kein Eingabefeld
- [x] Keine externen Anfragen: CSP und Netzwerk-Wächter; geprüft in `test/regeln.test.mjs`
- [x] Speicher: keiner; nur `removeItem('wa.daten')` in try/catch
- [x] Druck: eigenes `druck.css` mit `@media print`, leerer Bogen, ohne Namenszeile, ohne Häkchen
- [x] Keine Gesamtzahl, kein Score, keine Prozentwerte
- [x] Keine Rechtsangabe ohne Prüfvermerk (§ 45 SGB VIII entfernt)
- [x] `eltern.html` als Info für Träger und Leitung, ohne Ampel-Behauptung und ohne Kinder-Behauptung
- [x] Mobile First: kinder-ui-Klassen, Knöpfe in voller Breite, mindestens 3 rem hoch
- [x] Offline nach dem Laden
- [x] Impressum verlinkt (`../../impressum.html`)
- [ ] Vorlesen: nicht vorgesehen. Die App richtet sich an Fachkräfte, nicht an Kinder

## 7. Стандарты (Wofür)

DSGVO (Datenminimierung). docs/02 mit der Regel, dass ein Kind nicht bewertet wird.
Die Grenze folgt docs/02: Die App klassifiziert keine Menschen; sie zählt nur, was
die Fachkraft selbst getan hat.

## 8. Аджайл-оценка

Aufwand S: ein Ordner, eine reine Logik-Datei, ein DOM-Modul, ein Druck-CSS. Wiederverwendet
werden `el` aus kinder-ui und der Netzwerk-Wächter aus kinderschutz.

## 9. Offene Entscheidungen

- Der Druckbogen bleibt leer, Antworten ändern ihn nicht. Gefüllte Häkchen auf dem
  Papier verbietet docs/02 (Z. 79–82). Wer das ändern will, muss die Regel ändern.
- § 45 SGB VIII fehlt. Eine Rechtsangabe kommt nur mit dem Prüfvermerk aus docs/02 zurück.
- Die sechs Handlungen sind Vorschläge. Ob die Liste vollständig ist, klärt ein Test
  mit drei bis fünf Fachkräften.

## 10. Тесты

19 тестов. Zählung nach `^test(` über alle Testdateien dieses Ordners. Lauf:
`node --test apps/tagesblick-fachkraft/test/*.test.mjs`.

## Seitenangaben (Serie C, Welle 2, 29.10.2026)

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

Geprüft: 2 Angaben. Das Thema steht auf S. 15 bis 18. Die Quelle nutzt dort благополучие (S. 15, 17, mit Zeilenumbruch: „emotionales Wohlbefinden“). „Wohlbefinden“ und „Psychologische Gesundheit“ sind Übertragungen. Keine Korrektur.
