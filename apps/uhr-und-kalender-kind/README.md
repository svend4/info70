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
- Раунд из 8 загадок (из 12, вперемешку), варианты перемешиваются; ранги,
  рекорд, озвучка (BFSG). Финал: «посмотри на настоящие часы!»
- `logik.mjs` (чистая): `zeigerWinkel`, `uhrText`, `uhrOptionen`,
  `pruefeFragen` (ловит совпадающие дистракторы), `rangFuer`.

## Политика

Werbefrei, без аккаунтов, без внешних запросов (NetzwerkWaechter); только
рекорд в localStorage (`uhr.rekord`). Есть `eltern.html`, приложение в
Eltern-Sammelband.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/uhr-und-kalender-kind/
node --test apps/uhr-und-kalender-kind/test/*.test.mjs
```
