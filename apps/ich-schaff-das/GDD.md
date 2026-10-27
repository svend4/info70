# 🧗 Ich schaff das! — Kurz-GDD

## 1. Феномен / потребность (Warum)
Какому явлению отвечает: позиция №26 каталога Praleska-Baukasten (docs/10,
каталог №2) — саморегуляция и экзекутивные функции для 8–12 как
«Luecken-Thema» между Lern-Apps и Achtsamkeits-Apps; тематическая рамка —
индикаторы волевой сферы (Willenssphäre) диагностического раздела источника
(«Познать, чтобы воспитывать», S. 19), без переноса текста. Немецкий якорь:
überfachliche Kompetenzen земельных учебных планов («Lernen lernen»,
Selbstregulation). Что происходит без приложения: ребёнок при первой же
фрустрации бросает (домашка, инструмент, новое дело), не имеет слов и
мини-стратегий для «застрял», а взрослые реагируют оценкой («соберись!»)
вместо стратегии.

## 2. Игрок и обещание (Wer + Kernerlebnis)
Возраст: 8-12 (Kernzielgruppe). Одно предложение: «Ребёнок в роли самого себя
в знакомых будничных ситуациях выбирает один из трёх ходов и уходит с тремя
повторяемыми стратегиями: erst Pause, dann Plan · kleine Schritte ·
um Hilfe bitten ist stark».

## 3. Движок и петля (Wie)
Движок: szenario (2/1/0-Szenario-Trainer по образцу stark-im-chat; тонкая
копия, общий szenario-Kern — отдельный рефакторинг, docs/05 метод 0).
Основная петля: ситуация → выбор из 3 ходов (2/1/0) → реакция, объяснение
+ показ сильнейшего хода → следующая ситуация → «Ende der Runde» без оценки.
Что делает петлю реиграбельной: перемешивание сценариев и опций
(Fisher-Yates). Ребёнка не оценивают: нет очков, рекорда и рангов.

## 4. Lernziele (проверяемые!)
1. Ребёнок может **назвать и применить** последовательность «erst Pause,
   dann Plan» при фрустрации («покажи, что делаешь, когда домашка не идёт»).
2. Ребёнок может **разделить** большое задание (Referat, Auftritt, Sparziel)
   на 2-3 конкретных маленьких шага своими словами.
3. Ребёнок может **объяснить**, почему просьба о помощи и признание ошибки —
   сильные ходы, а не слабость («объясни другу, почему спросить — не стыдно»).

## 5. Контент-план
Единица контента: сценарий. MVP: 10 сценариев (Hausaufgaben-Frust,
Referat-Schritte, Instrument-Rueckschlag, Vereins-Niederlage,
Handy-Ablenkung, Fehler zugeben, um Hilfe bitten, Belohnungsaufschub/Sparen,
Lampenfieber, Neues probieren). Схема данных: `{ version, zielgruppe,
szenarien[{id, situation, optionen[3]{text,wert}, erklaerung}] }` (без
рангов). Дидактический анти-шаблон-тест: ровно ОДИН сильный ход (wert 2) и
минимум один, делающий труднее (wert 0), в каждом сценарии; стратегии Pause, Plan/Schritt и Hilfe
обязаны встречаться в банке (node:test).

## 6. Политика соответствия (Pflicht, docs/02)
[x] Werbefrei / без покупок  [x] Без аккаунтов и персональных данных
[x] Без внешних запросов (CSP self + installiereNetzwerkWaechter)
[x] Ничего не сохраняется: нет карты «Meine Daten löschen» и кнопки удаления;
    старый ключ `isd.rekord` удаляется при запуске одной строкой
[x] Privacy by default (ноль запросов привилегий)
[x] Mobile First 360px/48px (kinder-ui-классы)  [x] Vorlesen (kinder-ui)
[x] Offline после загрузки  [x] eltern.html
[x] Impressum/DSGVO (ссылка на ../../impressum.html)
Особые риски темы: «терпи всегда» как токсичный перегиб → стартовый экран и
eltern.html проговаривают «niemand muss immer stark sein» + Nummer gegen
Kummer 116 111; ребёнка не оценивают (без очков, рекорда, рангов, сравнений
и таймеров).

## 7. Стандарты и финансирование (Wofür)
Стандарты: überfachliche Kompetenzen der Laender-Lehrplaene (Lernen lernen,
Selbstregulation) · UN-KRK Art. 29 (Entfaltung der Faehigkeiten) · DSGVO
Art. 8 / Datenminimierung · fragFINN-tauglich (werbefrei, ohne Konto).
Förder-Fit: BzKJ-Linie «Kompetenzfoerderung»; Herkunft aus Katalog №2 —
Kandidat fuer mini-i18n de/uk/ru (Herkunftssprachen-Chance, docs/10).

## 8. Аджайл-оценка
Aufwand: M (готовая 2/1/0-механика + новый контент-банк).
Что переиспользуем: kinder-ui (el, vorlesen, mischen, CSS), kinderschutz
(NetzwerkWaechter), поток экранов stark-im-chat.
Первый срез (playable): старт → 10 сценариев с объяснениями → «Ende der
Runde» (готово в MVP).

## 9. Kindertest-гипотезы
Что проверяем на 5-8 детях: пересказывают ли «erst Pause, dann Plan» своими
словами после одной сессии? Узнают ли себя в ситуациях (какая «не моя»)?
Считывают ли средние ходы как «okay, но можно сильнее», а не как «ошибку»?
Не воспринимается ли реакция «Starker Zug!» как оценка ребёнка (протокол —
docs/05, метод 5)?
