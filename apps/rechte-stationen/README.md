# Stationenlernen „Deine Rechte, dein Netz“ 🗺️

Приложение для **учителей** — каталог docs/09, Ось B, №186. Печатная учебная
единица (2 двойных урока, 3–6 класс) с **четырьмя станциями** — Schutz,
Förderung, Beteiligung, digitale Rechte — вокруг werbefrei-приложений набора.
Итог: общий **Rechte-Plakat** на стену класса. OER (AGPL).

## Что внутри

- Цели, четыре станции (каждая с приложениями, заданием и статьёй UN-KRK),
  задание-плакат, привязка к компетенциям (NRW/KMK), указания учителю.
- Deep-ссылки на приложения станций, кнопка печати; **ничего не сохраняет**.
- `daten/stationen.json`; тест проверяет 4 станции с существующими
  приложениями, цели, плакат-Sicherung, компетенции, помощь 116 111, отсутствие
  внешних ссылок.

## Политика

Werbefrei, без внешних запросов (NetzwerkWaechter), **ничего не хранит**.
Инструмент для школы, без eltern.html. UN-KRK, GC25.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/rechte-stationen/
node --test apps/rechte-stationen/test/*.test.mjs
```
