# @info70/kinderschutz

Инструменты принудительного соблюдения политики монорепозитория
(`docs/02-anforderungen.md`) в рантайме и в тестах.

- `src/kriterien.mjs` — машиночитаемый каталог критериев (fragFINN, BzKJ, DSGVO)
  для тестов, CI и чек-листов в PR.
- `installiereNetzwerkWaechter(win)` — перехватывает `fetch`/`XHR`/`WebSocket` и
  блокирует любые запросы к чужим хостам; возвращает функцию-отчёт о нарушениях.
  В продакшене дублируется CSP-заголовком `default-src 'self'`.
- `pruefeSpeicherNutzung()` — аудит `localStorage` на ключи, похожие на
  персональные данные (их не должно существовать вовсе).

```js
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
installiereNetzwerkWaechter(); // теперь внешние запросы невозможны
```
