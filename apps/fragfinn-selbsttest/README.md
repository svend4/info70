# fragFINN-Selbsttest ✅

Контент-пак **для операторов** детских сайтов — каталог docs/09, №55. На
движке kriterien-check: пройти критерии приёма в whitelist fragFINN пункт
за пунктом с подсказками и получить локальный **Prüfbericht** (экспорт
файлом) для подготовки заявки.

## Что внутри

11 критериев в 4 областях: Kindeignung (соответствие детям, безвредность,
понятность), Sicherheit & Interaktion (модерация/нет открытого
Fremdkontakt, детские ссылки, техника/HTTPS), Werbung & Kommerz
(разделение рекламы, без Kaufappelle/Kostenfallen/Lootboxen), Datenschutz
(датасбережённость, Impressum + понятная политика, без трекинга). У
каждого — раскрываемая подсказка «что ожидает fragFINN» и правовая привязка.

Отчёт: сводка с разделом «offen», копирование и скачивание файлом. Явно
помечен как **самотест, не официальный результат** (проверяет fragFINN).

Поле «Notizen» имеет подсказку «Keine Namen von Kindern eingeben.»: отдельный
элемент прямо перед полем, поле связано с ним через `aria-describedby`;
название поля («Notizen») не меняется. Тесты: 8 (было 3), `npm test`.

## Политика

Инструмент для взрослых: галочки/заметки только в `localStorage`
(`ffst.status`, `ffst.notiz`) + сброс; экспорт локальный (Blob). Без
внешних запросов и аккаунтов.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/fragfinn-selbsttest/
node --test apps/fragfinn-selbsttest/test/*.test.mjs
```
