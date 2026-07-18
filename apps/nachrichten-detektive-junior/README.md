# Nachrichten-Detektive junior 🕵️

Приложение для малышей (**6–8 лет**) — каталог docs/09, №257. Младшая
версия «Nachrichten-Detektive» на движке quiz-kern: вместо текстовых
новостей — простые картинки (эмодзи) и вопрос **«Echt oder ausgedacht?»**
(настоящее или выдуманное). Полностью озвучивается — даже для тех, кто ещё
не читает.

## Что внутри

- 12 бинарных вопросов: настоящее (кошка играет в парке) vs выдуманное
  (кошка сама водит машину, свинья летит, единорог). Баланс 6/6.
- Ядро: вопрос **«Kann das wirklich sein?»** — первая медиаграмотность.
- Vorlese-кнопка на каждом шаге (BFSG), Klassen-Modus, ранги и рекорд.
- Есть страница `eltern.html`. Короткие фразы для 6–8.

## Политика

Werbefrei, без внешних запросов (NetzwerkWaechter); сохраняется только
рекорд (`ndj.rekord`), удаляется одной кнопкой.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/nachrichten-detektive-junior/
node --test apps/nachrichten-detektive-junior/test/*.test.mjs
```
