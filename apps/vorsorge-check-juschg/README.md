# Vorsorge-Check § 24a 🛡️

Инструмент **для операторов** детских сервисов — каталог docs/09, №175.
Самоаудит по **мерам предосторожности § 24a JuSchG** с трёхсостоянной
**ампелью** у каждого пункта (🟢 erfüllt / 🔴 offen / ⚪ nicht anwendbar).
Ampel-Bericht документирует состояние для надзора BzKJ и заявок на гранты.

## Что внутри

- 4 области: **безопасные предустановки** (приватность по умолчанию,
  геолокация выкл., ограничение контакта), **Melde- und Abhilfeverfahren**
  (простая жалоба + реакция), **Einordnungs-/Elterninformationen**
  (возрастные пометки, инфо для родителей, 116 111) и **отказ от рисковых
  функций** (открытый чат, sog-механики/Lootbox).
- Каждый пункт с подсказкой «что требует § 24a» и ссылкой (JuSchG/DSA/
  DSGVO/UN-KRK).
- Ampel-Bericht со счётчиком и списком открытых пунктов. Экспорт `.txt`,
  копирование, «Zurücksetzen».
- `logik.mjs` (чистая): `ampelBericht`, `zaehle` (та же ампель-модель, что в
  DSA-Selbstaudit).

Это самоаудит, **не официальное заключение**.

## Политика

Werbefrei, без внешних запросов (NetzwerkWaechter); оценки — только
локально (`vcj.status`) + «Zurücksetzen». Всё в браузере.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/vorsorge-check-juschg/
node --test apps/vorsorge-check-juschg/test/*.test.mjs
```
