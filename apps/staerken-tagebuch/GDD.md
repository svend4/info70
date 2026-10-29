# 🌟 Stärken-Tagebuch — Kurz-GDD

## 1. Феномен / потребность (Warum)
Какому явлению отвечает: каталог №2 (docs/10, дериваты Праляски) — концепт
«Staerken-Tagebuch fuer Eltern» из пункта перечня «Individuelle Besonderheiten,
Begabungsarten, Temperament» (S. 18); UN-KRK Art. 5/18 (родительская
компетенция); stärkenorientierte Beobachtung как стандарт немецкой
элементарной педагогики. Что происходит без приложения: родители либо
не замечают повторяющиеся сильные моменты ребёнка («шумит», «опять строит»),
либо уходят в коммерческие «тесты на одарённость» с облачными профилями
ребёнка и псевдодиагнозами; тревога канализируется в сравнение с другими
детьми вместо игры и, при нужде, бесплатной консультации.

## 2. Игрок и обещание (Wer + Kernerlebnis)
Возраст: Eltern (дети 3–7; ребёнку экран не адресован).
Одно предложение: «Родитель отмечает за 10 секунд наблюдаемый момент из
фиксированного списка и уходит с пятью бесплатными игровыми идеями без
экрана — точно к тому, что его ребёнок делает охотнее всего».

## 3. Движок и петля (Wie)
Движок: Erwachsenen-Katalog + Checkliste (по образцу kriterien-check /
foerder-navigator: тонкий DOM-слой над чистой логикой + JSON-контентбанк).
Основная петля: момент замечен в быту → тап «Beobachtet» у момента →
счётчики поля обновляются → блок «Spielideen» показывает 5 импульсов к двум
самым частым полям → сыгранная игра рождает новые наблюдения.
Что делает петлю устойчивой: нулевой порог (без текста, один тап),
«−»-коррекция, Koffer-обмен между двумя родителями, идеи меняются вместе
с частотами полей.

## 4. Lernziele (проверяемые!)
Инструмент для взрослых, цели — для родителя:
1. Родитель может **назвать** 2–3 конкретных сильных момента своего ребёнка
   («покажи в списке, что было на этой неделе») вместо общих ярлыков.
2. Родитель может **выбрать и провести** подходящую бесплатную игру без
   экрана к самому частому полю ребёнка.
3. Родитель может **объяснить своими словами**, почему частота наблюдений —
   не диагноз и не рейтинг, и **назвать** бесплатный адрес помощи при
   реальной тревоге (Erziehungsberatung / Frühförderstelle).

## 5. Контент-план
Единица контента: беобахтунгс-момент и шпиль-импульс. MVP:
4 поля × 8 моментов (32) + 4 × 5 импульсов (20) в `daten/beobachtungen.json`.
Схема: `{ felder: [{ id, name, emoji, beschreibung, momente: [{id, text}]×8,
impulse: [string]×5 }]×4 }`. Дидактический анти-шаблон-тест: тесты фиксируют
ровно 4/8/5 и глобальную уникальность id; импульсы обязаны быть
бесплатно-бытовыми и бильдширмфрай (regex-тест на App/Video/Bildschirm/
Tablet/Handy/…); свободный текст невозможен даже через koffer-импорт
(неизвестные id отклоняются).

## 6. Политика соответствия (Pflicht, docs/02)
[x] Werbefrei / без покупок
[x] Без аккаунтов и персональных данных (ни имён, ни кюрцелей — фиксированный
список моментов, ноль полей ввода текста)
[x] Без внешних запросов (CSP `default-src 'self'` + installiereNetzwerkWaechter)
[x] localStorage: только счётчики `st.markierungen` + кнопка «Alle Daten
löschen»; Export/Import только как локальный JSON-файл (koffer.mjs)
[x] Privacy by default (ноль запросов привилегий)
[x] Mobile First 360px/48px (kinder-ui-классы)
[x] Vorlesen — для блока игровых идей (детского экрана нет; родитель может
озвучить идеи ребёнку)
[x] Offline после загрузки
[x] eltern.html — концепт-страница (зачем без диагноза, куда обращаться)
[x] Impressum/DSGVO перед публикацией (ссылка на ../../impressum.html)
Особые риски темы: «одарённость» → строго OHNE Score/Ranking/Kind-Vergleich
(EU AI Act), закреплённый UI-текст «Beobachtung ist keine Diagnose — bei
Sorgen: Erziehungsberatung / Frühförderstelle (kostenlos)»; пустое поле
эксплицитно нормализуется («kein Defizit»).

## 7. Стандарты и финансирование (Wofür)
Стандарты: DSGVO Art. 5 (Datenminimierung; свободный текст о ребёнке
исключён дизайном) · EU AI Act (никакого автоматизированного
Begabungs-Scoring) · UN-KRK Art. 5/18 · BZgA/WHO-линия «игра важнее экрана»
в дошкольном возрасте (все импульсы бильдширмфрай).
Förder-Fit: BzKJ (родительская медиакомпетенция + защитный дизайн);
канал Familienbildung/Frühe Hilfen; см. foerder-navigator.

## 8. Аджайл-оценка
Aufwand: M (контентбанк + чистая логика + тонкий DOM-слой на готовых
пакетах). Что переиспользуем: kinder-ui (el, vorlesen, CSS), kinderschutz
(NetzwerkWaechter), Koffer-паттерн mitmach-arena, Katalog+JSON-паттерн
foerder-navigator. Первый срез (playable): 4 поля с отметками + подбор
импульсов + Löschen + Koffer (готово в MVP).

## 9. Kindertest-гипотезы
Инструмент взрослый → вместо Kindertest — Eltern-Test на 5–8 родителях:
хватает ли 32 моментов на реальную неделю (чего не хватает — но помним: без
свободного текста)? Понимают ли, что «×N» — не оценка ребёнка, а счётчик
собственных наблюдений? Пробуют ли предложенные игры и возвращаются ли
после них к новым отметкам? Считывают ли блок «bei Sorgen» как помощь,
а не как тревожный сигнал?

## Vorlesen (Entscheidung 28а)

Keine Vorlese-Pflicht. Dieses Werkzeug richtet sich an Erwachsene. Die Zeile „есть озвучивание“ der Checkliste in `docs/02-anforderungen.md` gilt für Kinder-Apps (Ergänzung 28а vom 27.10.2026, am 29.10.2026 in die GDD übernommen).

## Seitenangaben (Serie C, Pilot 29.10.2026)

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

Geprüft wurden alle Seitenangaben dieser Datei gegen die Textkopie der Pralęska (`tools/app-seiten-pruefen.mjs`, Urteil je Angabe im Lauf vom 29.10.2026). Das ist eine maschinelle Prüfung, keine Prüfung durch einen Menschen.

Ergebnis: Die Seite 18 stimmt. Korrektur 29.10.2026: «Individuelle Besonderheiten, Begabungsarten, Temperament» ist kein Abschnitt der Quelle, sondern ein Punkt in einer Aufzählung auf S. 18. Dafür steht jetzt „Punkt“ statt „Abschnitt“ (Wortlaut in README und GDD geändert, vorher „раздела“).
