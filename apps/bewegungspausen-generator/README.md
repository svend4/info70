# Bewegungspausen-Generator ⚡

Инструмент **для педагогов и семей** — каталог **docs/10 (Пралеска), Топ-30
№16** («физкультминутки»). Генератор готовых **двигательных пауз на 7–10
минут** для Kita и «Bewegte Schule» — без инвентаря, у стола/на месте.

## Что внутри

- **Кнопка «🎲 Neue Pause würfeln»**: по фазе на каждый этап твёрдого
  сценария — Aufwachen → Power → Koordination → Ruhe; если сумма < 7 минут,
  добавляется второй Power-блок (коридор 7–10 минут, без дублей).
- **13 блоков-упражнений** с инструкцией и **собственным стишком** (никаких
  заимствованных текстов/песен), длительность 1–3 минуты каждый.
- Печать (druck.css, класс `bpg-nur-bildschirm`), экспорт `.txt`,
  копирование, озвучка. Устройство — только источник импульса: сама пауза
  **без экрана**.
- `logik.mjs` (чистая): `erzeugePause` (детерминируемая через инъекцию
  выбора), `gesamtMinuten`, `skriptText`, `pruefeBausteine`.

## Политика

Werbefrei, без аккаунтов, без внешних запросов (NetzwerkWaechter); **ничего
не сохраняет** (без localStorage). Есть `eltern.html`, приложение в
Eltern-Sammelband.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/bewegungspausen-generator/
node --test apps/bewegungspausen-generator/test/*.test.mjs
```
