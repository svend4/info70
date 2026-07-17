# @info70/kinder-ui

Общие UI-строительные блоки для детских интерфейсов монорепозитория (8–12 лет).

- `css/kinder.css` — дизайн-токены и компоненты: кнопки (touch ≥ 48 px, фокус-обводка),
  карточки, прогресс-бар, подсказки. Mobile First от 360 px, контраст WCAG AA,
  уважает `prefers-reduced-motion`.
- `js/komponenten.mjs` — `el()` (создание DOM), `vorlesen()` (озвучивание de-DE через
  Web Speech API, офлайн), `mischen()` (Fisher-Yates).
- `js/sprache.mjs` — мини-i18n `erstelleSprache({ kataloge, standard, speicherSchluessel })`:
  `t(ключ, {плейсхолдеры})`, `setze()`, `aktuelle()`, `verfuegbare()`; недостающие ключи
  падают на стандартный каталог.
- `js/leichte-sprache.mjs` — **Leichte Sprache (BFSG/EAA)** как локаль с суффиксом `-ls`
  (напр. `de-ls`): `leichteSpracheSchalter({ sprache, neuZeichnen })` рисует видимый
  переключатель (появляется, только если для базового языка есть `-ls`-каталог);
  `pruefeLeichteSpracheAbdeckung(kataloge)` — чистая функция для тестов, проверяющая,
  что каждая `-ls`-версия покрывает ровно ключи своего базового каталога. Построено один
  раз — любое приложение получает переключатель, добавив `-ls`-каталог. Пилот: `feed-forscher`.

Подключение из приложения (без сборки, относительным путём):

```html
<link rel="stylesheet" href="../../packages/kinder-ui/css/kinder.css" />
<script type="module">
  import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
</script>
```
