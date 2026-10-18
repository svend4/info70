# 🗓️ Kita-Wochenplaner — Kurz-GDD

## 1. Феномен / потребность (Warum)
Какому явлению отвечает: планирование образовательных предложений — ежедневная
обязанность каждой Kita (Beobachtung/Planung/Dokumentation закреплены во всех
16 земельных Bildungspläne, § 22a SGB VIII Qualitätsentwicklung). Источник
идеи: Каталог №2 (docs/10, Praleska) — недельные планы занятий с ориентирами
количества и длительности. Что происходит без приложения: планы пишутся на
бумажках без взгляда на баланс областей; либо Kita покупает облачный софт с
аккаунтами и вечным датеншутц-конфликтом. Риск перепланирования: слишком много
и слишком длинных «занятий» вместо свободной игры.

## 2. Игрок и обещание (Wer + Kernerlebnis)
Возраст: Fachkräfte (Erzieher*innen, Kita-Leitung; группы 1–7 лет).
Одно предложение: «Фахкрафт раскладывает предложения недели по сетке Пн–Пт
и уходит с наглядным балансом областей, мягкими подсказками по длительности
и готовым аншлагом для родительской доски».

## 3. Движок и петля (Wie)
Движок: planer (Erwachsenen-Werkzeug; родственники: takt-pause/logik-паттерн,
kriterien-check, koffer-механика mitmach-arena). Основная петля: добавить
предложение (день + область + возраст + минуты) → сетка недели обновляется →
Ausgewogenheits-Check (полосы по 6 областям + подсказки) → скорректировать →
печать/экспорт. Реиграбельность: каждая новая неделя — новый план; обмен
файлами в команде (Früh-/Spätdienst) через vereinigeKoffer.

## 4. Lernziele / Nutzwert (проверяемые!)
1. Фахкрафт может **увидеть** дисбаланс недели за один взгляд (полосы областей)
   и назвать «пустую» область.
2. Фахкрафт может **применить** возрастные ориентиры длительности
   (Obergrenze ~15/20/25 мин, 10/15/17 предложений в неделю) — подсказка появляется ровно у превышающего предложения.
3. Фахкрафт может **обосновать** «меньше — лучше»: подсказка при >3
   предложениях в день формулирует Freispiel-Vorrang как принцип.
(Проверка в Praxistest: «покажи, какой области не хватает», «почему план
вторника перегружен?»)

## 5. Контент-план
Единица контента: Bildungsbereich с ориентирами и текстами подсказок.
MVP: 6 областей + 3 возрастные группы + Tages-/Wochen-Hinweis в
`daten/bereiche.json`. Схема данных: `bereiche[{id,name,emoji,beispiele}]`,
`altersgruppen[{id,name,maxMinutenProAngebot,maxAngeboteProWoche,quelle,warntext}]`,
`tagesHinweis{maxAngeboteProTag,warntext}`, `wochenHinweis{warntext}`, `wochenLastHinweis{warntext}`. Testzahl: 42 (`npm test`).
Дидактический анти-шаблон-тест (node:test): ровно 6 областей, ориентиры
= 15/20/25 и 10/15/17, каждый Warntext сформулирован как «Empfehlung», Tages-Hinweis
обязан называть Freispiel, запрет оценочной лексики (Score/Ranking/Diagnose)
во всём датасете.

## 6. Политика соответствия (Pflicht, docs/02)
[x] Werbefrei / без покупок  [x] Без аккаунтов и персональных данных
(планируются предложения, не дети; UI: «Keine Namen von Kindern eingeben.» an jedem Eingabefeld)
[x] Без внешних запросов (CSP `default-src 'self'` + installiereNetzwerkWaechter)
[x] localStorage: только план `kwp.plan` + кнопка «Alle Daten löschen»
[x] Privacy by default (ноль запросов привилегий)
[x] Mobile First 360px/48px (kinder-ui-классы)
[ ] Vorlesen — n/a: инструмент для взрослых без детского контента
(по образцу kriterien-check/foerder-navigator)
[x] Offline после загрузки  [x] eltern.html как Info für Träger & Leitung
[x] Impressum/DSGVO (ссылка ../../impressum.html)
Особые риски темы: AI Act — никакого скоринга/рейтинга/сравнения детей;
все проверки регельбазированы и относятся к ПЛАНУ; тексты подсказок —
рекомендации, не нормы. Urheberrecht: из Праляски взята только концепция,
все индикаторы/тексты/примеры новые.

## 7. Стандарты и финансирование (Wofür)
Стандарты: DSGVO (ноль персональных данных) · EU AI Act (кein Scoring von
Kindern) · § 22a SGB VIII / Landes-Bildungspläne (Planungs- und
Dokumentationspraxis) · BFSG/Barrierefreiheit (aria-Labels, крупные тач-цели).
Förder-Fit: B2B-мультипликатор (Träger/Leitung, см. docs/10 «B2B-Multiplikatoren»);
BzKJ-фокус опосредованно; главный козырь — «lokal statt Cloud» против
облачного Kita-софта (см. foerder-navigator/docs/06).

## 8. Аджайл-оценка
Aufwand: M (готовые паттерны: planer-логика + koffer + Erwachsenen-UI).
Что переиспользуем: kinder-ui (el, CSS), kinderschutz (NetzwerkWaechter),
koffer-муster mitmach-arena, схемный тест foerder-navigator. Первый срез
(playable): сетка Пн–Пт + добавление/удаление + полосы + 3 вида подсказок +
экспорт/импорт + печать (готово в MVP).

## 9. Praxistest-гипотезы
Что проверяем на 3–5 командах Kita: понятна ли разница «рекомендация vs
норма» (не воспринимают ли полосы как KPI)? Достаточно ли 6 генерических
областей или нужен маппинг на конкретный земельный план? Пользуются ли
экспортом/слиянием или планирует один человек? Читабелен ли аншлаг на
родительской доске (шрифт, объём)? Где хочется «ещё поля» — и не тянут ли
они за собой персональные данные (сопротивляться!).
