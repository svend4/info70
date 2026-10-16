# 🚥 Wohlfühl-Ampel Gruppe — Kurz-GDD

## 1. Феномен / потребность (Warum)
Какому явлению отвечает: эмоциональное благополучие как базовая задача всех
16 земельных Bildungspläne (Beobachtung & Dokumentation — Pflicht) и как
Top-Thema каталога №2 (docs/10, дериваты Праляски: «Psychologische
Gesundheit / emotionales Wohlbefinden»); Beschwerdeverfahren für Kinder
как условие Betriebserlaubnis (§ 45 Abs. 2 Nr. 4 SGB VIII); UN-KRK Art. 3/12.
Что сейчас происходит без приложения: самочувствие детей фиксируется
в лучшем случае «в голове» воспитателя или в облачной Kita-Software с
постоянным датеншутц-конфликтом; тихие «красные» серии (Eingewöhnung,
домашние перемены) замечаются поздно, а разговор с родителями начинается
без задокументированного повода.

## 2. Игрок и обещание (Wer + Kernerlebnis)
Возраст: Fachkräfte (дети 1–7 — как субъекты наблюдения, без экрана для них).
Одно предложение: «Педагог за две минуты в день тикает светофор по каждому
кюрцелю и уходит с видимой недельной динамикой плюс мягким импульсом,
когда ребёнку три дня подряд „красно“».

## 3. Движок и петля (Wie)
Движок: planer (Planer-Selbstbeobachtung: Ampel + Tagesstatistik, по образцу
takt-pause/kriterien-check — тонкий DOM-слой над чистой логикой).
Основная петля: карточка ребёнка → тап 🟢/🟡/🔴 → (опционально) контекст-тег
из фиксированного списка → недельная лента обновляется → при ≥ 3 «рот» подряд
появляется импульс-подсказка. Что делает петлю устойчивой: ежедневный ритуал
«2 минуты после обеда», дозаполнение пропущенного дня через поле даты,
Koffer-экспорт для смены устройства.

## 4. Lernziele (проверяемые!)
Это Fachkraft-инструмент, цели — для взрослого:
1. Fachkraft может **увидеть и показать** недельную динамику самочувствия
   ребёнка («покажи ленту MO за неделю») вместо смутного «вроде норм».
2. Fachkraft может **распознать** тихую «красную серию» (≥ 3 дней) и
   **назвать** три мягких следующих шага (Bezugsperson-Zeit, Elterngespräch,
   Beschwerdeweg des Kindes) — без диагноза.
3. Fachkraft может **объяснить родителю/Träger своими словами**, почему
   данные не уходят с устройства и почему кюрцель вместо имени достаточен.

## 5. Контент-план
Единица контента: не банк, а фиксированные словари в `logik.mjs`:
3 Ampel-Stufen + 5 Kontext-Tags (Eingewöhnung, Konflikt, müde, Abschied
schwer, neu in Gruppe) + 4 Impuls-Formulierungen в `app.mjs`. Схема данных
(`wa.daten`): `{ kinder: string[?3 Zeichen, max 20], eintraege: { [kuerzel]:
{ [JJJJ-MM-TT]: { ampel, kontext|null } } } }`. Дидактический
анти-шаблон-тест: тесты фиксируют, что списков ровно 3/5, что свободный
текст невозможен даже через импорт и что импульс не срабатывает без серии
(«rot-grün-rot» ≠ серия).

## 6. Политика соответствия (Pflicht, docs/02)
[x] Werbefrei / без покупок
[x] Без аккаунтов и персональных данных (только самовыбранные кюрцели
≤ 3 знаков, UI-предупреждение «keine Namen!», max 20 детей)
[x] Без внешних запросов (CSP `default-src 'self'` + installiereNetzwerkWaechter)
[x] localStorage: только `wa.daten` (кюрцели + записи) + кнопка
«Alle Daten löschen»; Export/Import только как локальный JSON-файл
[x] Privacy by default (ноль запросов привилегий)
[x] Mobile First 360px/48px (kinder-ui-классы)
[ ] Vorlesen — n/a: чистый Fachkraft-инструмент без детского контента
(как kriterien-check/foerder-navigator); детям экран не адресован
[x] Offline после загрузки
[x] eltern.html — здесь как Träger-/Leitungs-Info (DSGVO-аргументация,
Eingewöhnung, Partizipation)
[x] Impressum/DSGVO перед публикацией (ссылка на ../../impressum.html)
Особые риски темы: наблюдение за детьми → строго OHNE Score/Ranking/
Kind-Vergleich (AI Act: reine Dokumentation), пометка «Beobachtung, keine
Diagnose» в UI и в импульсе; рекомендация в eltern.html: соответствие
кюрцель↔ребёнок держать максимум на бумаге в закрытом шкафу.

## 7. Стандарты и финансирование (Wofür)
Стандарты: DSGVO Art. 5 (Datenminimierung) / Art. 8 · § 45 Abs. 2 Nr. 4
SGB VIII (Beschwerdeverfahren) · Landes-Bildungspläne (Beobachtungspflicht) ·
EU AI Act (без автоматизированного скоринга детей) · UN-KRK Art. 3/12.
Förder-Fit: B2B-канал Träger/Fortbildung; аргумент «lokal statt Cloud» —
дифференциатор против облачной Kita-Software (см. docs/10, Deutschland-Lücke).

## 8. Аджайл-оценка
Aufwand: M (готовые пакеты + два чистых модуля + тонкий DOM-слой).
Что переиспользуем: kinder-ui (el, CSS), kinderschutz (NetzwerkWaechter),
Koffer-паттерн mitmach-arena, tagesSchluessel-паттерн takt-pause.
Первый срез (playable): кюрцели + дневной светофор + недельная лента +
импульс + Koffer + Löschen-Knopf (готово в MVP).

## 9. Kindertest-гипотезы
Инструмент взрослый → вместо Kindertest — Fachkraft-Test на 3–5 педагогах:
хватает ли 5 контекст-тегов на реальную неделю (чего не хватает — но
помним: без свободного текста)? Понятен ли «повторный тап = удалить запись»
без объяснения? Считывают ли импульс как помощь, а не как упрёк/диагноз?
Пользуются ли полем даты для дозаполнения или тикают только «сегодня»?
