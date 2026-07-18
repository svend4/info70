# Dark-Pattern-Detektiv 🕵️

Сценарный тренажёр (8–12) — каталог docs/09, №52. Дополняет
dark-pattern-labyrinth (симулятор) **тренировкой называния**: каждая
развязка даёт паттерну имя, чтобы ребёнок узнавал его снова.

## Что внутри

8 UI-примеров 2/1/0. Паттерны: Countdown-Druck, vorangekreuztes Häkchen,
versteckter Schließen-Knopf, Confirmshaming (Schäme-dich-Knopf), künstliche
Verknappung («nur noch 2 übrig»), Nerv-Taktik (Nagging), getarnte Cookie-
Voreinstellung — и сценарий «передай знание другу». Собранные разоблачённые
паттерны показываются в финале.

Тест сверяет 2/1/0-структуру, ширину паттернов и то, что развязка **называет**
паттерн (ядро идеи), + подключение Hilfe-Insel.

DSA Art. 25 запрещает такие приёмы — распознавать их всё равно нужно самому.

## Политика

Werbefrei, без аккаунтов и внешних запросов; примеры выдуманы; только
рекорд (`dpd.rekord`). Встроена Hilfe-Insel (116 111).

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/dark-pattern-detektiv/
node --test apps/dark-pattern-detektiv/test/*.test.mjs
```
