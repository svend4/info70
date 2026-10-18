# 🗳️ Mitmach-Arena — Kurz-GDD

Stand: 2026-10-18 · Testzahl: 15 (`npm test`). Angelegt nach `docs/vorlagen/kurz-gdd.md`, weil zum Zeitpunkt der Prüfung keine GDD vorlag. Inhalte sind aus README und Quelltext abgeleitet.

## 1. Феномен / потребность (Warum)
Klassenrat und Familie treffen gemeinsame Entscheidungen. Die App lässt jede*n einmal abstimmen, ohne Konto und ohne Server, und zeigt das Ergebnis als Balken mit Anteilen. Zuschnitt laut README: Fokus BzKJ 2026 „Teilhabe, Demokratiefähigkeit, Interaktion“. Ohne ein Werkzeug fehlt ein gemeinsames, sichtbares Zählverfahren für Klassenratsbeschlüsse; Handzeichen bleiben möglich.

## 2. Игрок и обещание (Wer + Kernerlebnis)
Возраст: Kinder einer Klasse oder Familie. Die Frage legt ein Erwachsener oder die Klasse an. Die Altersstufe ist offen.
Одно предложение: «Ich stimme einmal ab, gebe das Gerät weiter und sehe, wie die Klasse entschieden hat.»

## 3. Движок и петля (Wie)
Движок: beteiligung (Abstimmung nach dem Prinzip „Handy herumgeben“).
Петля: Frage anlegen oder Klassenrat-Vorlage wählen → Gerät reihum, jede*r tippt einmal → Ergebnis mit Balken und 🏆 bei der Mehrheit → optional Koffer exportieren, importieren und zusammenzählen.
Реиграбельность: vier Klassenrat-Vorlagen, eine neue Abstimmung pro Sitzung.

## 4. Lernziele (проверяемые!)
1. Kinder können die Schritte einer Abstimmung nennen: Vorschlag, Abstimmung, Ergebnis annehmen (README, Lernziel 1).
2. Kinder können Mehrheit und Minderheit am Balkendiagramm ablesen (README, Lernziel 2).
3. Kinder können eine Frage und Möglichkeiten formulieren, ohne Namen von Mitschüler*innen einzutragen (Hinweis am Feld).

## 5. Контент-план
Единица контента: Frage mit 2 bis 4 Möglichkeiten. Speicher: localStorage `ma.umfrage`. Koffer-Datei: `art: mitmach-arena-umfrage`, `version: 1`, `frage`, `optionen`, `stimmen`. Vorlagen in `vorlagen.mjs`, mindestens vier, geprüft durch `vorlagen.test.mjs`.
Eingabefelder: Frage maxlength 100, Möglichkeiten maxlength 60, jeweils mit sichtbarem Hinweis „Keine Namen von Mitschüler*innen eintragen.“ (`test/eingabe-hinweis.test.mjs`).

## 6. Политика соответствия (Pflicht, docs/02)
[x] Werbefrei (Fußzeile)  [x] Ohne Anmeldung; Daten nur auf dem Gerät (localStorage, Knopf „🧹 Abstimmung löschen“)
[x] Ohne externe Requests (CSP `default-src 'self'` und `installiereNetzwerkWaechter`)
[x] Privacy by default
[ ] Mobile First 360 px / 48 px: Überlauf bei 360 px und Trefferhöhe der Fußlinks (48 px) sind nicht als aktueller Stand belegt (offen)
[x] Vorlesen („🔊 Vorlesen“ auf dem Abstimmungsbildschirm)
[ ] Offline nach dem Laden: nicht zugesichert, kein Service Worker. Neuladen ohne Netz ist nicht als aktueller Stand belegt (offen)
[x] eltern.html vorhanden  [x] Impressum und Datenschutz verlinkt (`../../impressum.html`)
Особые риски темы: Freitext in Frage und Möglichkeiten kann Namen von Mitschüler*innen enthalten. Gegenmaßnahme: sichtbarer Hinweis direkt am Feld, per `aria-describedby` verknüpft, und die Feldlängen 100 und 60. Restrisiko: Der Hinweis verhindert keine Eingabe. Ob das Freitextfeld bleibt, entscheidet Max (`docs/kinder-apps-mit-eingabe.json`: „korrigiert: Hinweis am Feld“).

## 7. Стандарты и финансирование (Wofür)
Стандарты (laut README): fragFINN-Kriterium „Chats“ als Begründung dafür, dass der Austausch über Dateien statt über einen Chat läuft.
Förder-Fit: Kandidat für die Bewerbung BzKJ-2027, Paket „Demokratie & KI“ (laut README und docs/04).

## 8. Аджайл-оценка
Aufwand: S für Nachbesserungen. Der MVP steht. Wiederverwendet werden `packages/kinder-ui` (Elemente, Hilfe-Insel, Vorlesen) und `packages/kinderschutz` (Netzwerkwächter). Das Koffer-Muster übernimmt der Kita-Wochenplaner.
Первый срез (playable): vorhanden. Abstimmung, Ergebnis, Koffer-Export und -Import.

## 9. Kindertest-гипотезы
- Verstehen Kinder ohne Hilfe, dass sie das Gerät weitergeben und nur einmal tippen?
- Lesen Kinder den Hinweis „Keine Namen …“ vor dem Tippen, und schreiben sie trotzdem Namen?
- Erkennen Kinder an den Balken, welche Möglichkeit die Mehrheit hat?
