# @info70/kinder-ui

Общие UI-строительные блоки для детских интерфейсов монорепозитория (8–12 лет).

- `css/kinder.css` — дизайн-токены и компоненты: кнопки (touch ≥ 48 px, фокус-обводка),
  карточки, прогресс-бар, подсказки. Mobile First от 360 px, контраст WCAG AA,
  уважает `prefers-reduced-motion`.
- `js/komponenten.mjs` — `el()` (создание DOM), `vorlesen()` (озвучивание de-DE через
  Web Speech API, офлайн), `mischen()` (Fisher-Yates).

Подключение из приложения (без сборки, относительным путём):

```html
<link rel="stylesheet" href="../../packages/kinder-ui/css/kinder.css" />
<script type="module">
  import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
</script>
```
