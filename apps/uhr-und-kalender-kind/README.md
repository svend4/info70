# Uhr- und Kalender-Kind ⏰

Детское приложение (5–7) — каталог **docs/10 (Пралеска), Топ-30 №24**.
Читать **аналоговые часы** и понимать **календарь** — вечная тема перехода
Vorschule → 1 класс.

## Что внутри

- **Часы рисуются прямо в браузере** (чистый HTML/CSS, подвижные стрелки,
  `role="img"` с говорящим aria-label; никаких картинок извне).
- **Уровни времени**: полный час, «halb» (halb 5 = 4:30!), «Viertel nach»,
  «Viertel vor» — разговорная немецкая форма реализована как чистая функция
  `uhrText` и покрыта тестами (включая переход через 12).
- **Календарь**: 7 дней = неделя, что после вторника, выходные, фазы дня
  (Morgen–Mittag–Abend–Nacht), 4 сезона = год.
- Раунд из 8 загадок (из 12, вперемешку), варианты перемешиваются; озвучка
  (BFSG). После каждого ответа — объяснение. Финал: «Ende der Runde» без
  оценки (очков, рекорда и рангов нет) и призыв «посмотри на настоящие
  часы!»
- `logik.mjs` (чистая): `zeigerWinkel`, `uhrText`, `uhrOptionen`,
  `pruefeFragen` (ловит совпадающие дистракторы); функции ранга больше нет.

## Политика

Werbefrei, без аккаунтов, без внешних запросов (NetzwerkWaechter);
**ничего не сохраняет**, ребёнка не оценивают: очков, рекорда и рангов нет.
Поэтому нет и кнопки «Meine Daten löschen»; старый ключ `uhr.rekord` при
запуске один раз удаляется (миграция). Есть `eltern.html`, приложение в
Eltern-Sammelband.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/uhr-und-kalender-kind/
node --test apps/uhr-und-kalender-kind/test/*.test.mjs
```

## Tests und Lernziele

28 Tests in zwei Dateien: `test/logik.test.mjs` (Uhr, Kalender, Schreibweisen der Antworten, Seitenangaben, Tageszeit-Frage) und `test/regeln.test.mjs` (Eingabefelder, Speicher, Netz, Zufall, Wertung, Pflichtmarkierung, Testzahl, Lernziele).

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

Lernziele (Bauauftrag KIN-17):
- Die Uhrzeit auf einer Analoguhr lesen: volle Stunde, halbe Stunde, Viertelstunde.
- Die Kalenderbeziehungen kennen: 7 Tage je Woche, 4 bis 5 Wochen je Monat, 3 Monate je Jahreszeit, 4 Jahreszeiten je Jahr.
- Tageszeiten benennen, auch Dämmerung, Sonnenaufgang und Sonnenuntergang.
- Die Redeweise „halb 5“ als 4:30 deuten.
