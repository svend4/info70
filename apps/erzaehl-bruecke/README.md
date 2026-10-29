# Erzähl-Brücke 🌉

Детское/семейное приложение (5–8) — каталог **docs/10 (Пралеска), Топ-30
№19**. Каркас для свободного **устного** рассказывания: ребёнок рассказывает
вслух, приложение даёт только опору.

Anmerkung Stand 29.10.2026: Der Katalog (docs/10) nennt 5 bis 7 Jahre (kurz auch allein). Der Altersbereich 5 bis 8 dieser App ist offen (Bauauftrag GEM-13, Abschnitt 9).

Ergänzung Stand 29.10.2026: Die Altersangabe der Quelle ist uneinheitlich. docs/10 Z. 319 und docs/praleska-katalog.json nennen 5 bis 7 Jahre (kurz auch allein), docs/10 Z. 165 nennt „дети 5–8“. Der Altersbereich bleibt offen (Bauauftrag GEM-13, Abschnitt 9).

## Что внутри

- **«Бросок»**: герой + место + завязка (всё из собственных заготовок).
- **«Лесенка рассказа»** из 4 ступеней (Es war einmal / Eines Tages / Aber
  dann / Am Ende) с наводящими вопросами; карточки-«сюрпризы».
- Ребёнок рассказывает **вслух сам**, всё озвучивается (BFSG).
- **Никакого микрофона, никакой записи, ничего не сохраняется** — образцово
  по приватности. Рассказывать можно на любом языке семьи.
- `logik.mjs` (чистая): `waehleElemente` (инъецируемый выбор → тесты),
  `startSatz`, `baueGeruest`, `pruefeBausteine`.
- **Weil-Satz** (Eigenentwurf): ein Anfang mit „weil …“; das Kind ergänzt den Grund und erzählt laut. „🔁 Anderer Weil-Satz“ tauscht den Anfang an Ort und Stelle, „🔊 Vorlesen“ liest ihn vor. `weilSatz` zählt die Liste ohne Zufall durch.

## Lernziele

Lernziele nach docs/02, Z. 42–43 (in der README beschrieben). Inhalt nach Bauauftrag GEM-13, Abschnitt 2. Grundlage des Dreiteils Anfang, Fortsetzung, Schluss und der Weil-Sätze: S. 143 der Quelle; die vier Stufen sind Eigenentwurf. Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

1. Das Kind erzählt eine Geschichte laut mit Anfang, Fortsetzung und Schluss; die App zeigt dafür vier Stufen (Eigenentwurf, Grundlage S. 143).
2. Das Kind verknüpft zwei Ereignisse mit einem Grund in einem Satz mit „weil“ (Eigenentwurf, Grundlage: Ursache-Folge-Verknüpfung auf S. 143).
3. Das Kind erzählt in jeder Familiensprache; die App nimmt nichts auf (Eigenentwurf nach README).

## Политика

Werbefrei, без аккаунтов, без внешних запросов (NetzwerkWaechter), **без
микрофона и без localStorage**. Есть `eltern.html`, приложение в
Eltern-Sammelband.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/erzaehl-bruecke/
node --test apps/erzaehl-bruecke/test/*.test.mjs
```

Anmerkung Stand 29.10.2026: `npm run dev` läuft im Wurzelordner des Repos; dort steht das Skript `dev`. In apps/erzaehl-bruecke gibt es nur das Skript `test`.

Testzahl: 31 Tests (Stand 29.10.2026): `test/logik.test.mjs` 10, `test/regeln.test.mjs` 21. `npm test` in `apps/erzaehl-bruecke` führt beide aus.
