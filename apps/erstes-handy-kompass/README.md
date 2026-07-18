# Erstes-Handy-Kompass 🧭

Интерактивный чек-лист **для родителей** (ребёнок 8–12) — каталог docs/09,
№98. Безопасная передача первого телефона: пункт за пунктом, каждый с
обоснованием и конкретной инструкцией, в конце — печатная **грамота
передачи** («Handy-Führerschein») для ребёнка.

## Что внутри

8 пунктов: Jugendschutz-Filter, Standort aus, Kaufsperre/без платёжных
данных, Notfallkontakte (в т.ч. 116 111), altersgerechte Apps (fragFINN),
Bildschirmzeit-Absprache, Bildschirmsperre & Updates, **Nicht-Ärger-Pakt**
(важнейшая защита — доверие). У каждого — «Warum» и раскрываемое «So geht’s»
с шагами для Android/iPhone. Прогресс-бар, локальное сохранение галочек.

## Грамота

Кнопка «Urkunde drucken» даёт грамоту с именем ребёнка и списком
выполненных пунктов, местом для даты и подписей (`druck.css`). **Имя
вводится только для печати и не сохраняется** (Datenvermeidung — проверяется
тестом).

## Политика

Reine Anleitung: приложение **не читает** устройство. Werbefrei, без
аккаунтов и внешних запросов; локально только состояние галочек
(`ehk.status`) + сброс. Инструмент для взрослых (без детской страницы).

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/erstes-handy-kompass/
node --test apps/erstes-handy-kompass/test/*.test.mjs
```
