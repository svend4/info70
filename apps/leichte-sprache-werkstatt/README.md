# Arbeitsblätter in Leichter Sprache 🧩

Приложение для **учителей / инклюзии** — каталог docs/09, Ось E. К каждой
разработке урока — **рабочий лист на Лёгком языке**: короткие предложения,
крупные пиктограммы и **функция «Прочитать вслух»** (Web Speech из kinder-ui),
плюс печать. Делает всю школьную линию доступной по BFSG также для детей с
трудностями чтения или обучения.

## Что внутри

- Библиотека рабочих листов (Kettenbrief, Passwort, Algorithmus, Chat,
  Echt-oder-Fake, Bildschirm-Zeit) — по одному на тему Stundenentwurf.
- Каждый лист: понятия с пиктограммой и простым объяснением, 5 коротких
  предложений, одно задание, ссылка на соответствующий Stundenentwurf.
- Кнопки: 🔊 прочитать вслух, 🖨️ печать.
- `logik.mjs` (чистая) под тестами: `vorleseText`/`vorleseStuecke`,
  `pruefeLeichteSprache` (короткие предложения), `alleBegriffe`.

## Лёгкий язык (правила)

Короткие предложения (≤ 100 знаков), один смысл на предложение, знакомые
слова, пиктограммы. Приложение показывает **только** листы, прошедшие
проверку правил.

## Политика

Werbefrei, без внешних запросов (NetzwerkWaechter), **ничего не хранит**.
Контент в `daten/arbeitsblaetter.json`. Инструмент для школы, без eltern.html.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/leichte-sprache-werkstatt/
node --test apps/leichte-sprache-werkstatt/test/*.test.mjs
```
