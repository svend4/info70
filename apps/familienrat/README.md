# Familienrat 🏡

Приложение для **семьи (родители + дети 6–15)** — каталог docs/09, Ось F.
Маленькое **открытое голосование** для дома: выберите шаблон («Handyfreie
Essenszeiten?», «Neues Spiel anschaffen?») или задайте свой вопрос, каждый по
кругу отдаёт голос — и получите **печатный семейный протокол-решение**
(Familienbeschluss) с полем для подписей. Что решили — действует для всех,
включая родителей.

## Что внутри

- Шаблоны голосований + собственный вопрос со своими вариантами.
- Открытый подсчёт (все видят), результат: победитель или ничья.
- Печатный Familienbeschluss (тема/дата — только для печати).
- **Familien-Koffer**: экспорт результата в файл и слияние голосов с
  другого устройства — без сервера.
- `rat.mjs` (чистая логика) под тестами: `VORLAGEN`, `neueAbstimmung`,
  `stimme`, `ergebnis`, `baueBeschluss`, `packe/pruefe/vereinigeFamilienKoffer`.

## Политика

Werbefrei, без внешних запросов (NetzwerkWaechter); локально хранится только
текущее голосование (`fr.abstimmung`, лишь счётчики) — удаляется кнопкой.
Есть `eltern.html`, включено в Eltern-Sammelband. UN-KRK Art. 12.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/familienrat/
node --test apps/familienrat/test/*.test.mjs
```
