# Mathe-Entdecker 🔢

Детское приложение (5–7, короткие сессии) — каталог **docs/10 (Пралеска),
Топ-30 №6**. Ранняя математика как озвучиваемый квиз на `@info70/quiz-kern`:
множества, счёт, формы, ряды/узоры.

## Что внутри

- **16 заданий** (раунд из 10): больше/меньше/поровну, счёт до 10, формы и их
  углы, продолжить ряд/узор, сравнение по величине, направления (вверху/внизу),
  честное деление (половина), время суток.
- Stand 28.10.2026: 26 Aufgaben in `daten/fragen.json` (vorher 16). Dazu der Modus „Reihen legen“, siehe unten.
- Всё **озвучивается** (Vorlesen, BFSG); эмодзи как «картинки множеств» (без
  внешних ресурсов). Режимы Duett/Staffel/Klassen из quiz-kern; в конце раунда
  «Ende der Runde» без оценки ребёнка.
- Stand 28.10.2026: Der Endbildschirm zeigt „Toll gerechnet!“ (app.mjs, fertigTitel), nicht „Ende der Runde“. Den Titel entscheidet Max (`docs/fragen-fuer-max-2026-10-28.md`, Frage 13).
- Задания выведены из 26 операционализированных целей Пралеска — **собственный
  контент** (ни строчки из книги).

## Адаптация (Пралеска → Германия)

Привязка к образовательной области «Математическое образование» земельных
Bildungspläne; предметы из немецкого Kita-быта; uk/ru-числительные — будущая
опция языка происхождения.

## Политика

Werbefrei, без аккаунтов, без внешних запросов (NetzwerkWaechter). Ничего не
сохраняется; в приложении нет очков, рекорда и рангов, ребёнка не оценивают.
Старый ключ `mathe.rekord` при запуске один раз удаляется (миграция). Есть
`eltern.html`, приложение в Eltern-Sammelband.

Stand 28.10.2026: Die Aussage zu Punkten, Rekord und Rängen trifft zu (A7 umgesetzt, quiz-kern speichert nichts).

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/mathe-entdecker/
node --test apps/mathe-entdecker/test/*.test.mjs
npm test   # im App-Ordner: fragen, logik und regeln
```

## Stand 28.10.2026: Ausbau GEM-8 (Eigenentwurf)

Nach dem Bauauftrag `docs/bauauftraege/GEM-8-mathe-entdecker.md` (Abschnitte 2 bis 9). Alle Aufgaben und Texte sind Eigenentwurf; die Themen stammen aus Praleska, S. 136–138.

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

**Lernziele** (Eigenentwurf):

1. Kind vergleicht zwei Mengen durch Zuordnen und nennt die größere oder die gleich große Menge.
2. Kind zählt bis 10 und ordnet Zahl und Menge einander zu.
3. Kind erkennt eine Hälfte als einen von zwei gleichen Teilen.
4. Kind setzt eine Reihe aus 3 bis 5 Objekten nach einer Regel fort.
5. Kind zählt Ecken und Seiten einer Figur.
6. Kind nennt Wochentage in richtiger Reihenfolge und eine Tageszeit für einen Alltagsmoment.

**Themen** (26 Aufgaben in `daten/fragen.json`; Thema, Seitenangabe und Eigenentwurf stehen je Frage im Block `quellen`): Mengen, Zählen, Formen, Reihen, Größe, Richtung (oben und unten, links und rechts), Hälfte, Tageszeit, Linienarten (S. 137), Wochentage (S. 138), Jahreszeiten (S. 138).

**Modus „Reihen legen“** (neu, Eigenentwurf): Oben auf der Startseite steht die Schaltfläche „Reihen legen“. Eine Reihe aus 3 bis 5 Teilen hat eine freie Stelle. Das Kind tippt ein Teil an („In die Lücke legen“). „Teil zurücknehmen“ nimmt es weg, „Reihe prüfen“ prüft die Reihe. Rückmeldung: „Die Reihe stimmt.“ oder „Schau dir die Reihe noch einmal an.“ „Auflösung zeigen“ und „Vorlesen“ zeigen die ganze Reihe. Ohne Punkt, ohne Rang und ohne Speicher. Die Quiz-Modi (Einzel, Duett, Staffel, Klassen) bleiben unverändert.

**Politik, Stand:** Die Aussage im Abschnitt Politik (keine Punkte, kein Rekord, keine Ränge) stimmt mit dem Code überein: A7 ist umgesetzt, quiz-kern speichert nichts und kennt keine Punkte, keinen Rekord und keine Ränge. Der alte Schlüssel `mathe.rekord` wird beim Start entfernt.

**Offen:** Zahlwörter in Ukrainisch und Russisch (uk, ru) sind nicht vorhanden; die Entscheidung liegt offen. Den Titel am Rundenende entscheidet Max (`docs/fragen-fuer-max-2026-10-28.md`, Frage 13). Für Seitenangaben gilt der Vermerk oben; die Markierung aus docs/02 (Z. 151–152) ist offen (A18).

**Testzahl:** 43 Tests (`npm test` im App-Ordner).
