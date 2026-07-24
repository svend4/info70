# Erste-Wörter-Lesewerkstatt 🔤

Детское приложение (5–7) — каталог **docs/10 (Пралеска), Топ-30 №25**.
Первое чтение по **слоговому методу** немецкой начальной школы, в три ступени.

## Что внутри

- **Ступень 1**: услышать гласный (A E I O U) → выбрать букву из трёх.
- **Ступень 2**: услышать открытый слог (MA, LO, SU — KV из 8 частотных
  согласных) → выбрать написание.
- **Ступень 3**: прочитать **лаутгетрое** слово (OMA, SOFA, TOMATE — без
  Dehnungs-h и двойных букв, закреплено функцией `istLautgetreu` в тестах)
  со **слоговыми дугами** и **само-контролем по картинке** (выбрать эмодзи).
- Раунд ровно из **8 заданий** (2+3+3, от лёгкого к сложному), затем
  приложение само объявляет «Lese-Pause» — короткие сессии как принцип.
- Озвучка через Web Speech (локально), рекорд в localStorage.
- `logik.mjs` (чистая): `istLautgetreu`, `silbenTeilen` (O-MA, TO-MA-TE),
  `hoerOptionen`, `bildOptionen`, `pruefeMaterial`.

## Политика

Werbefrei, без аккаунтов, без внешних запросов (NetzwerkWaechter); только
рекорд в localStorage (`lese.rekord`). Есть `eltern.html`, приложение в
Eltern-Sammelband.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/erste-woerter-lesewerkstatt/
node --test apps/erste-woerter-lesewerkstatt/test/*.test.mjs
```
