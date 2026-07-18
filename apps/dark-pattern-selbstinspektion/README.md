# Dark-Pattern-Selbstinspektion 🎭

Инструмент **для операторов и дизайнеров** — каталог docs/09, Ось D, №228.
UI-чек-лист, чтобы **экран за экраном** проверить собственный сервис на
манипулятивные паттерны (Dark Patterns). Каждый паттерн — с примером,
**воздействием на детей** и честной альтернативой.

## Что внутри

- **3 категории**: время/давление (Countdown, Endlos-Feed, Streak, Nagging),
  деньги/покупки (скрытые расходы, Sneaking, лутбоксы, замаскированная
  реклама), манипуляция решением (Confirmshaming, Roach Motel, трюк-вопросы,
  Privacy Zuckering) — всего 12 паттернов.
- Каждый паттерн: **пример**, **воздействие на детей** и **честная
  альтернатива** (она же — мера устранения). Правовая привязка (DSA Art. 25,
  JuSchG § 10b, JMStV § 6, DSGVO Art. 25, UN-KRK/GC25).
- **Четыре состояния** на паттерн: ⚪ ungeprüft / 🔴 gefunden / 🟢 frei /
  🔵 behoben.
- **Отчёт**: счётчик, открытые находки с мерами устранения, устранённые
  пункты. Экспорт `.txt`, копирование, «Zurücksetzen».
- `logik.mjs` (чистая): `zaehle`, `befunde`, `behobene`, `bericht`,
  `alleMuster`.

Это самопроверка, **не официальное заключение** и не юридическая консультация.

## Политика

Werbefrei, без внешних запросов (NetzwerkWaechter); оценки — только локально
(`darkpattern.status`) + «Zurücksetzen». Всё в браузере.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/dark-pattern-selbstinspektion/
node --test apps/dark-pattern-selbstinspektion/test/*.test.mjs
```
