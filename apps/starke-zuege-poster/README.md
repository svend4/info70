# Poster „Drei starke Züge“ 🖼️

Приложение для **класса** (8–12) — каталог docs/09, Ось H. По каждому
тематическому полю — лучшая последовательность действий из
сценарных-тренажёров, сжатая до **трёх сильных ходов** (например, «Nicht
weiterleiten — Löschen — Bescheid sagen»), как **A3-плакат** для стены класса.
Выученное остаётся на виду, даже когда никакое устройство не работает.

## Что внутри

- Плакаты по темам: Cybermobbing, Kettenbrief/Mutprobe, Datenschatz,
  Fake-News, Kauf-Tricks/Lootboxen — каждый с 3 ходами и Merksatz.
- Крупная A3-раскладка (`@page size: A3`), кнопка печати, Vorlesen.
- `poster.mjs` (чистая логика) под тестами: `pruefePoster` (ровно 3 хода,
  Merksatz), `posterText` (для озвучивания); тест проверяет покрытие
  ключевых тем и существование всех связанных приложений.

## Политика

Werbefrei, без внешних запросов (NetzwerkWaechter), **ничего не хранит**.
Контент в `daten/poster.json`. Печатная утилита для класса, без eltern.html.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/starke-zuege-poster/
node --test apps/starke-zuege-poster/test/*.test.mjs
```
