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

Кнопка «Urkunde drucken» даёт грамоту со списком выполненных пунктов, местом
для даты и подписей (`druck.css`). В грамоту вписываются **только инициалы или
прозвище** (до 12 знаков): поле «Initialen oder Spitzname (nur für die Urkunde)»
имеет подсказку «Nur Initialen oder einen Spitznamen eintragen, keinen vollen
Namen.». Значение **не сохраняется**: оно живёт только в памяти страницы
(`namen-merker.mjs`) и переживает перерисовку после галочки или «Zurücksetzen»;
после перезагрузки поле пустое. Проверяют это (Datenvermeidung): пять Tests в
`test/regeln.test.mjs` (Quelltext), шесть в `test/namen-merker.test.mjs` (без DOM),
четыре в `test/checkliste.test.mjs`: всего 15 Tests.

## Политика

Reine Anleitung: приложение **не читает** устройство. Werbefrei, без
аккаунтов и внешних запросов; локально только состояние галочек
(`ehk.status`) + сброс. Инструмент для взрослых (без детской страницы).

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/erstes-handy-kompass/
npm test      # in apps/erstes-handy-kompass: node --test test/*.test.mjs (15 Tests)
node tools/browser-pruefung.mjs erstes-handy-kompass -   # Mess-Skript: 360 px, Klicks, Druck, Konsole
```

Alle Schaltflächen tragen `data-kennung` gleich `id` (`ehk-drucken`,
`ehk-zuruecksetzen`), damit das Mess-Skript sie klicken kann. Fußlinks und
Häkchen sind mindestens 48 px hoch und breit; Emoji sind im Druck ausgeblendet.
