# Anzeige-Einstellungen 🔎

Приложение-настройка (6–15) — каталог docs/09, Ось H. Центральная страница
для **высокого контраста** и **размера шрифта** (BFSG/EAA). Выбор сохраняется
локально (`ui.anzeige`) и действует **во всех приложениях**, которые при
старте вызывают `boot()` из `kinder-ui`.

## Что внутри

- Кнопки: контраст (Normal / Hoher Kontrast), шрифт (Normal / Groß /
  Sehr groß), живой пример текста, кнопка сброса.
- Реализация в `packages/kinder-ui`:
  - `css/kinder.css` — токены высокого контраста (`:root[data-kontrast=hoch]`)
    и ступени шрифта (`html[data-schrift=...]`), выше по специфичности, поэтому
    действуют во всех приложениях.
  - `js/anzeige.mjs` (чистая логика) под тестами: `naechsteSchrift`,
    `wechsleKontrast`, `normalisiere`, `ladeEinstellung` (с prefers-contrast),
    `speichere` (сброс удаляет запись), `wendeAn`, `boot`.

## Как подключить в приложении

Одна строка в начале `app.mjs`:

```js
import { boot } from '../../packages/kinder-ui/js/anzeige.mjs';
boot();
```

Уже подключено в `feed-forscher` и во всех квизах (через `quiz-kern`).

## Политика

Werbefrei, без внешних запросов (NetzwerkWaechter); хранится только локальная
настройка, удаляется кнопкой. Утилита, без eltern.html.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/anzeige-einstellungen/
node --test packages/kinder-ui/test/anzeige.test.mjs
```
