# Kinderrat 🗳️

Режим заседания для класса (8–12) — каталог docs/09, №31. Расширяет
mitmach-arena до формального **Sitzungsmodus**: Tagesordnung, Redeliste,
голосование с обоснованием результата и протокол-файл (Klassen-Koffer,
без сервера).

## Как это работает

- **Redeliste**: кто хочет говорить — в очередь; первый «дран» и договаривает.
- **Tagesordnung**: пункты (или готовые предложения).
- **Abstimmen**: по пункту считаются dafür/dagegen/enthalten, результат
  (`angenommen/abgelehnt/unentschieden`) появляется сам.
- **Begründung**: коротко зафиксировать, почему так решили.
- **Protokoll**: текст + экспорт/импорт файла (Koffer) — можно продолжить
  на след. неделе.
- `koffer.mjs` (чистая логика, без DOM): `ergebnis`, `istBehandelt`,
  `packeProtokoll`, `protokollText`, `pruefeProtokoll` — под тестами.

Привязка: §8/§45 SGB VIII (участие в учреждениях), KMK Demokratiebildung.

## Политика

Werbefrei, без аккаунтов и внешних запросов; обмен — только файлами.
Локально хранится текущее заседание (`kr.sitzung`) + «Neue Sitzung».
Совет: nur Initiale oder Nummer (только инициал или номер).

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/kinderrat/
node --test apps/kinderrat/test/*.test.mjs
npm test --workspace @info70/kinderrat   # 9 Tests (koffer + regeln)
```
